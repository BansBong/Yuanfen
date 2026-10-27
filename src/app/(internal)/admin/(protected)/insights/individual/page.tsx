import Link from "next/link";
import { InsightsTabs } from "@/components/admin/InsightsTabs";
import { groupedAnswers } from "@/lib/admin/answers";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/admin/constants";
import { contactHref, formatDate } from "@/lib/admin/format";
import { parseRange, sinceFor, type ResponseRow } from "@/lib/admin/insights";
import { RESPONSE_COLUMNS } from "@/lib/admin/responses";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Individual response" };

const nav =
  "inline-flex min-h-11 items-center rounded-full border-2 border-ink-red/40 px-5 font-semibold text-ink-red hover:bg-ink-red/10";

/** One response at a time, like the Individual tab in Google Forms. */
export default async function IndividualPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; range?: string }>;
}) {
  const sp = await searchParams;
  const range = parseRange(sp.range);
  const n = Math.max(1, Number.parseInt(sp.n ?? "1", 10) || 1);
  const { supabase } = await requireAdmin();

  let q = supabase
    .from("requests")
    .select(RESPONSE_COLUMNS, { count: "exact" })
    .eq("type", "inquiry")
    .order("created_at", { ascending: false })
    .range(n - 1, n - 1);
  const since = sinceFor(range);
  if (since) q = q.gte("created_at", since);
  const { data, count } = await q;
  const total = count ?? 0;
  const row = ((data ?? []) as ResponseRow[])[0];

  const href = (i: number) => `/admin/insights/individual?n=${i}${range !== "all" ? `&range=${range}` : ""}`;
  const sections = row ? groupedAnswers("inquiry", row) : [];
  const wa = row ? contactHref(row.contact, "phone") : null;

  return (
    <>
      <h1 className="font-display text-3xl text-ink-red">Responses</h1>
      <InsightsTabs active="individual" range={range} />

      {!row ? (
        <p className="mt-8 rounded-2xl border-2 border-dashed border-ink-red/25 p-10 text-center">No responses to show.</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {n > 1 ? (
              <Link href={href(n - 1)} className={nav}>
                ← Newer
              </Link>
            ) : (
              <span />
            )}
            <p className="font-medium text-ink-red">
              Response {n} of {total}
            </p>
            {n < total ? (
              <Link href={href(n + 1)} className={nav}>
                Older →
              </Link>
            ) : (
              <span />
            )}
          </div>

          <article className="mt-4 space-y-5">
            <header className="rounded-2xl border border-ink-red/15 bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl text-ink-red">{row.name}</h2>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[row.status]}`}>
                  {STATUS_LABELS[row.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-maroon/80">
                <span className="font-mono">{row.reference_code}</span> · submitted {formatDate(row.created_at)} · site language{" "}
                {row.locale.toUpperCase()}
              </p>
              <p className="mt-3">
                <Link href={`/admin/requests/${row.id}`} className="font-semibold text-crimson underline underline-offset-4">
                  Open to change status, assign or add notes
                </Link>
                {wa && (
                  <>
                    {" · "}
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-crimson underline underline-offset-4">
                      Message on WhatsApp
                    </a>
                  </>
                )}
              </p>
            </header>

            {sections.map((s, i) => (
              <section key={s.id} className="rounded-2xl border border-ink-red/15 bg-white p-5" aria-labelledby={`ind-${s.id}`}>
                <h3 id={`ind-${s.id}`} className="font-display text-lg text-ink-red">
                  <span className="mr-2 text-crimson">{i + 1}.</span>
                  {s.title}
                </h3>
                <dl className="mt-3 divide-y divide-ink-red/10">
                  {s.items.map((it) => (
                    <div key={it.name} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr]">
                      <dt className="font-semibold text-ink-red">{it.label}</dt>
                      <dd className={`break-words whitespace-pre-wrap ${it.value ? "" : "text-maroon/40"}`}>
                        {it.value || "No answer"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </article>
        </>
      )}
    </>
  );
}
