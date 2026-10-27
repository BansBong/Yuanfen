import Link from "next/link";
import { RANGES, type Range } from "@/lib/admin/insights";

const TABS = [
  { href: "/admin/insights", key: "summary", label: "Summary" },
  { href: "/admin/insights/individual", key: "individual", label: "Individual" },
  { href: "/admin/insights/table", key: "table", label: "Table" },
] as const;

/** Summary | Individual | Table, plus the date range and the CSV download. */
export function InsightsTabs({ active, range }: { active: (typeof TABS)[number]["key"]; range: Range }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-ink-red/15">
      <nav aria-label="Responses views" className="flex gap-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`${t.href}${range !== "all" ? `?range=${range}` : ""}`}
            aria-current={t.key === active ? "page" : undefined}
            className={`-mb-px inline-flex min-h-11 items-center border-b-4 px-4 font-semibold ${
              t.key === active ? "border-crimson text-crimson" : "border-transparent text-ink-red hover:text-crimson"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <form method="get" className="flex items-center gap-2">
          <label className="sr-only" htmlFor="range">Date range</label>
          <select
            id="range"
            name="range"
            defaultValue={range}
            className="min-h-10 rounded-xl border-2 border-ink-red/30 bg-white px-3 text-sm text-maroon"
          >
            {RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <button type="submit" className="min-h-10 rounded-full border-2 border-ink-red/40 px-4 text-sm font-semibold text-ink-red hover:bg-ink-red/10">
            Apply
          </button>
        </form>
        <a
          href={`/admin/export?range=${range}`}
          className="inline-flex min-h-10 items-center rounded-full bg-ink-red px-4 text-sm font-semibold text-cream hover:bg-maroon"
        >
          Download CSV
        </a>
      </div>
    </div>
  );
}
