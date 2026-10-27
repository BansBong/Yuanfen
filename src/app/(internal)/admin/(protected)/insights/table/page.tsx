import Link from "next/link";
import { InsightsTabs } from "@/components/admin/InsightsTabs";
import { FORMS } from "@/data/forms";
import { displayValue } from "@/lib/admin/answers";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/admin/constants";
import { formatDate } from "@/lib/admin/format";
import { parseRange, sinceFor, type ResponseRow } from "@/lib/admin/insights";
import { RESPONSE_COLUMNS } from "@/lib/admin/responses";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Responses table" };

const PAGE = 50;

/** Every answer in a spreadsheet-style table (scrolls sideways). */
export default async function TablePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; range?: string }>;
}) {
  const sp = await searchParams;
  const range = parseRange(sp.range);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE;
  const { supabase } = await requireAdmin();

  let q = supabase
    .from("requests")
    .select(RESPONSE_COLUMNS, { count: "exact" })
    .eq("type", "inquiry")
    .order("created_at", { ascending: false })
    .range(from, from + PAGE - 1);
  const since = sinceFor(range);
  if (since) q = q.gte("created_at", since);
  const { data, count } = await q;
  const rows = (data ?? []) as ResponseRow[];
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));

  const fields = FORMS.inquiry.steps.flatMap((s) => s.fields).filter((f) => f.name !== "name" && f.name !== "contact");
  const href = (p: number) => `/admin/insights/table?page=${p}${range !== "all" ? `&range=${range}` : ""}`;
  const th =
    "whitespace-nowrap border-b-2 border-ink-red/20 bg-cream px-3 py-2 text-left text-xs font-semibold tracking-wide text-ink-red uppercase";
  const td = "border-b border-ink-red/10 px-3 py-2 align-top text-sm";

  return (
    <>
      <h1 className="font-display text-3xl text-ink-red">Responses</h1>
      <InsightsTabs active="table" range={range} />
      <p className="mt-4 text-sm text-maroon/70">
        {total} response{total === 1 ? "" : "s"}. Scroll sideways to see every question. Click a name to open the response.
      </p>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-red/15 bg-white">
        <table className="min-w-[1500px] border-collapse">
          <thead>
            <tr>
              <th scope="col" className={`${th} sticky left-0 z-10`}>
                Name
              </th>
              <th scope="col" className={th}>
                Submitted
              </th>
              <th scope="col" className={th}>
                Status
              </th>
              <th scope="col" className={th}>
                WhatsApp
              </th>
              {fields.map((f) => (
                <th key={f.name} scope="col" className={th}>
                  {f.label.en}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream/50">
                <th scope="row" className={`${td} sticky left-0 z-10 bg-white text-left font-semibold`}>
                  <Link href={`/admin/requests/${r.id}`} className="text-crimson underline underline-offset-2">
                    {r.name}
                  </Link>
                </th>
                <td className={`${td} whitespace-nowrap`}>{formatDate(r.created_at)}</td>
                <td className={td}>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className={`${td} whitespace-nowrap`}>{r.contact}</td>
                {fields.map((f) => (
                  <td key={f.name} className={`${td} max-w-64 break-words whitespace-pre-wrap`}>
                    {displayValue(f, r.details[f.name])}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={fields.length + 4} className="p-10 text-center">
                  No responses to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-4 flex items-center justify-between">
          {page > 1 ? (
            <Link href={href(page - 1)} className="min-h-11 rounded-full border-2 border-ink-red/40 px-5 py-2 font-semibold text-ink-red">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={href(page + 1)} className="min-h-11 rounded-full border-2 border-ink-red/40 px-5 py-2 font-semibold text-ink-red">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
