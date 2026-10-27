import Link from "next/link";
import { BarList, ColumnChart, Donut, StatCard } from "@/components/admin/charts";
import { InsightsTabs } from "@/components/admin/InsightsTabs";
import { STATUS_LABELS } from "@/lib/admin/constants";
import { formatDate } from "@/lib/admin/format";
import { countBy, countRecent, parseRange, perDay, summarize, type QuestionSummary } from "@/lib/admin/insights";
import { fetchInquiries } from "@/lib/admin/responses";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Responses" };

const card = "rounded-2xl border border-ink-red/15 bg-white p-5";

function Question({ q, total }: { q: QuestionSummary; total: number }) {
  return (
    <section className={card} aria-labelledby={`q-${q.field.name}`}>
      <h3 id={`q-${q.field.name}`} className="font-display text-lg text-ink-red">
        {q.field.label.en}
      </h3>
      <p className="mb-4 text-sm text-maroon/70">
        {q.answered} of {total} answered
        {q.kind === "choice" && q.multi ? " · more than one answer allowed" : ""}
        {q.kind === "number" && q.average !== null ? ` · average ${q.average.toFixed(1)}` : ""}
      </p>
      {q.kind === "choice" &&
        (q.tallies.length <= 5 && !q.multi && q.field.type !== "select" ? (
          <Donut items={q.tallies} label={q.field.label.en} />
        ) : (
          <BarList items={q.tallies} total={q.multi ? q.answered : undefined} />
        ))}
      {(q.kind === "tags" || q.kind === "months" || q.kind === "number") && (
        <BarList items={q.tallies} total={q.kind === "tags" ? q.answered : undefined} />
      )}
      {q.kind === "text" &&
        (q.answers.length === 0 ? (
          <p className="text-sm text-maroon/70">No answers yet.</p>
        ) : (
          <ul className="space-y-2">
            {q.answers.map((a) => (
              <li key={a.id} className="rounded-xl bg-cream/70 p-3 text-sm">
                <p className="break-words whitespace-pre-wrap text-maroon">{a.value}</p>
                <p className="mt-1 text-xs text-maroon/60">
                  <Link href={`/admin/requests/${a.id}`} className="font-medium text-crimson underline underline-offset-2">
                    {a.name}
                  </Link>
                  {" · "}
                  {formatDate(a.at)}
                </p>
              </li>
            ))}
            {q.answered > q.answers.length && (
              <li className="text-sm">
                <Link href="/admin/insights/table" className="font-semibold text-crimson underline underline-offset-4">
                  See all {q.answered} in the Table view
                </Link>
              </li>
            )}
          </ul>
        ))}
    </section>
  );
}

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const { supabase } = await requireAdmin();
  const { rows, total, error } = await fetchInquiries(supabase, range);

  const days = range === "7" ? 7 : range === "90" ? 90 : 30;
  const recent = countRecent(rows, 7);
  const fresh = rows.filter((r) => r.status === "new").length;
  const pax = rows.map((r) => Number(r.details.pax)).filter((n) => Number.isFinite(n) && n > 0);
  const avgPax = pax.length ? (pax.reduce((a, b) => a + b, 0) / pax.length).toFixed(1) : "–";
  const questions = summarize(rows, "inquiry");
  const sections = [...new Set(questions.map((q) => q.section))];

  return (
    <>
      <h1 className="font-display text-3xl text-ink-red">Responses</h1>
      <p className="mt-1 text-maroon/80">
        Service inquiry questionnaire: {total} response{total === 1 ? "" : "s"}.
      </p>
      <InsightsTabs active="summary" range={range} />

      {error && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-crimson bg-white p-4 text-crimson">
          Could not load: {error.message}
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="mt-8 rounded-2xl border-2 border-dashed border-ink-red/25 p-10 text-center">
          No inquiry responses {range === "all" ? "yet" : "in this period"}. They appear here as soon as someone submits the questionnaire.
        </p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Responses" value={total} />
            <StatCard label="Still new" value={fresh} hint="not contacted yet" />
            <StatCard label="Last 7 days" value={recent} />
            <StatCard label="Average group size" value={avgPax} hint={`${pax.length} gave a number`} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <section className={`${card} lg:col-span-2`}>
              <h2 className="font-display text-lg text-ink-red">Responses over time</h2>
              <p className="mb-2 text-sm text-maroon/70">Last {days} days</p>
              <ColumnChart data={perDay(rows, days)} label={`Responses per day, last ${days} days`} />
            </section>
            <section className={card}>
              <h2 className="mb-3 font-display text-lg text-ink-red">Status</h2>
              <Donut items={countBy(rows, (r) => STATUS_LABELS[r.status])} label="Responses by status" />
              <h2 className="mt-6 mb-3 font-display text-lg text-ink-red">Site language</h2>
              <Donut
                items={countBy(rows, (r) => (r.locale === "id" ? "Indonesian" : "English"))}
                label="Responses by site language"
              />
            </section>
          </div>

          {sections.map((title, i) => (
            <div key={title} className="mt-10">
              <h2 className="mb-3 font-display text-xl text-ink-red">
                <span className="mr-2 text-crimson">{i + 1}.</span>
                {title}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {questions
                  .filter((q) => q.section === title)
                  .map((q) => (
                    <div
                      key={q.field.name}
                      className={q.kind === "text" || q.field.name === "assistance" || q.field.name === "destinations" ? "md:col-span-2" : ""}
                    >
                      <Question q={q} total={total} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
