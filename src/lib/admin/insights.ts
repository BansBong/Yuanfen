import { FORMS, type Field, type FormId } from "@/data/forms";
import type { RequestStatus } from "./constants";
import { displayValue } from "./answers";

export type ResponseRow = {
  id: string;
  reference_code: string;
  created_at: string;
  status: RequestStatus;
  locale: "en" | "id";
  name: string;
  contact: string;
  details: Record<string, unknown>;
};

export type Tally = { label: string; count: number };

export type QuestionSummary = {
  field: Field;
  section: string;
  /** How many responses answered this question. */
  answered: number;
} & (
  | { kind: "choice"; tallies: Tally[]; multi: boolean }
  | { kind: "tags"; tallies: Tally[] } // free text split into places / repeated values
  | { kind: "number"; tallies: Tally[]; average: number | null }
  | { kind: "months"; tallies: Tally[] }
  | { kind: "text"; answers: { value: string; id: string; name: string; at: string }[] }
);

/** Free-text answers that are really lists of places: split on commas and count each place. */
const LIST_FIELDS = new Set(["destinations"]);
/** Short free-text answers worth counting (same value repeated = same bar). */
const COUNT_FIELDS = new Set(["nationality", "location"]);

const sortTallies = (m: Map<string, Tally>) => [...m.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

function bump(m: Map<string, Tally>, key: string, label: string) {
  const cur = m.get(key);
  if (cur) cur.count += 1;
  else m.set(key, { label, count: 1 });
}

const titleCase = (s: string) => s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());

export function summarize(rows: ResponseRow[], formId: FormId): QuestionSummary[] {
  const out: QuestionSummary[] = [];

  for (const step of FORMS[formId].steps) {
    for (const field of step.fields) {
      if (field.name === "name" || field.name === "contact") continue;
      const section = step.title.en;
      const answers = rows
        .map((r) => ({ r, v: r.details[field.name] }))
        .filter(({ v }) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0));
      const answered = answers.length;
      // Conditional follow-ups ("Other: please tell us") stay hidden until someone uses them.
      if (field.showWhen && answered === 0) continue;

      if (field.type === "chips" || field.type === "chips-multi" || field.type === "select") {
        const m = new Map<string, Tally>();
        for (const o of field.options ?? []) m.set(o.value, { label: o.label.en, count: 0 });
        for (const { v } of answers) for (const x of Array.isArray(v) ? v : [v]) bump(m, String(x), displayValue(field, x));
        out.push({ kind: "choice", field, section, answered, multi: field.type === "chips-multi", tallies: [...m.values()].sort((a, b) => b.count - a.count) });
      } else if (field.type === "number") {
        const nums = answers.map(({ v }) => Number(v)).filter((n) => Number.isFinite(n));
        const bucket = (n: number) => (n <= 4 ? String(n) : n <= 9 ? "5-9" : n <= 19 ? "10-19" : "20+");
        const m = new Map<string, Tally>();
        for (const n of nums) bump(m, bucket(n), bucket(n));
        const order = ["1", "2", "3", "4", "5-9", "10-19", "20+"];
        out.push({
          kind: "number",
          field,
          section,
          answered,
          average: nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null,
          tallies: order.filter((k) => m.has(k)).map((k) => m.get(k)!),
        });
      } else if (field.type === "date") {
        const m = new Map<string, Tally>();
        for (const { v } of answers) {
          const key = String(v).slice(0, 7);
          bump(m, key, new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }));
        }
        out.push({ kind: "months", field, section, answered, tallies: [...m.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, t]) => t) });
      } else if (LIST_FIELDS.has(field.name) || COUNT_FIELDS.has(field.name)) {
        const m = new Map<string, Tally>();
        for (const { v } of answers) {
          const parts = LIST_FIELDS.has(field.name) ? String(v).split(/[,;\n]/) : [String(v)];
          const seen = new Set<string>();
          for (const part of parts) {
            const key = part.trim().toLowerCase();
            if (!key || seen.has(key)) continue; // one response counts a place once
            seen.add(key);
            bump(m, key, titleCase(key));
          }
        }
        out.push({ kind: "tags", field, section, answered, tallies: sortTallies(m).slice(0, 15) });
      } else {
        out.push({
          kind: "text",
          field,
          section,
          answered,
          answers: answers.slice(0, 6).map(({ r, v }) => ({ value: String(v), id: r.id, name: r.name, at: r.created_at })),
        });
      }
    }
  }
  return out;
}

/** Responses per day for the last `days` days (oldest first). */
export function perDay(rows: ResponseRow[], days: number): Tally[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const out: Tally[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    const key = d.toISOString().slice(0, 10);
    out.push({ label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }), count: counts.get(key) ?? 0 });
  }
  return out;
}

export function countBy<T extends string>(rows: ResponseRow[], pick: (r: ResponseRow) => T): Tally[] {
  const m = new Map<string, Tally>();
  for (const r of rows) bump(m, pick(r), pick(r));
  return sortTallies(m);
}

export type Range = "7" | "30" | "90" | "all";
export const RANGES: { value: Range; label: string }[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export function parseRange(value: string | undefined): Range {
  return RANGES.some((r) => r.value === value) ? (value as Range) : "all";
}

export function sinceFor(range: Range): string | null {
  if (range === "all") return null;
  return new Date(Date.now() - Number(range) * 86_400_000).toISOString();
}

/** How many responses arrived in the last `days` days. */
export function countRecent(rows: ResponseRow[], days: number): number {
  const cutoff = Date.now() - days * 86_400_000;
  return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff).length;
}
