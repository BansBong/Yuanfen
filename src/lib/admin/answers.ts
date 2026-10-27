import { FORMS, isFormId, type Field, type FormId } from "@/data/forms";

/** Human-readable value of one answer (option labels in English, dates formatted). */
export function displayValue(field: Field | undefined, raw: unknown): string {
  if (raw === undefined || raw === null || raw === "") return "";
  const optionLabel = (v: string) => field?.options?.find((o) => o.value === v)?.label.en ?? v;
  if (Array.isArray(raw)) return raw.map((v) => optionLabel(String(v))).join(", ");
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  if (field?.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(raw))) {
    return new Date(`${raw}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
  return optionLabel(String(raw));
}

export type AnswerSection = {
  id: string;
  title: string;
  items: { name: string; label: string; value: string }[];
};

/** All questions of a form, in order, grouped by section, with this response's answers (empty = unanswered). */
export function groupedAnswers(
  formId: FormId,
  row: { name: string; contact: string; details: Record<string, unknown> },
): AnswerSection[] {
  if (!isFormId(formId)) return [];
  return FORMS[formId].steps.map((step) => ({
    id: step.id,
    title: step.title.en,
    items: step.fields.map((f) => {
      const raw = f.name === "name" ? row.name : f.name === "contact" ? row.contact : row.details[f.name];
      return { name: f.name, label: f.label.en, value: displayValue(f, raw) };
    }),
  }));
}

/** Guard against spreadsheet formula injection when a value is opened in Excel / Sheets. */
export function csvCell(value: string): string {
  // "=", "@", tabs and returns always start a formula; "+" / "-" only when the value is not a plain phone-style number.
  const risky = /^[=@\t\r]/.test(value) || (/^[+-]/.test(value) && !/^[+-][\d\s().-]+$/.test(value));
  const safe = risky ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
