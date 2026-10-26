import Link from "next/link";
import { notFound } from "next/navigation";
import { updateRequest } from "@/app/(internal)/admin/actions";
import {
  REQUEST_STATUSES,
  STATUS_LABELS,
  STATUS_STYLES,
  TYPE_LABELS,
  type RequestRow,
  type TeamMember,
} from "@/lib/admin/constants";
import { contactHref, formatDate, formatDetails } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/session";

const field =
  "min-h-12 w-full rounded-xl border-2 border-ink-red/30 bg-white px-3 text-base text-maroon focus:border-crimson focus:outline-none";

export const metadata = { title: "Request" };

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { supabase } = await requireAdmin();
  const [{ data }, { data: team }] = await Promise.all([
    supabase.from("requests").select("*").eq("id", id).maybeSingle(),
    supabase.from("profiles").select("id, display_name, avatar_url").eq("role", "admin"),
  ]);
  if (!data) notFound();
  const r = data as RequestRow;
  const members = (team ?? []) as TeamMember[];
  const href = contactHref(r.contact, r.contact_type);
  const details = formatDetails(r.type, r.details);
  const editor = members.find((m) => m.id === r.last_updated_by)?.display_name;

  return (
    <>
      <p>
        <Link href="/admin" className="font-medium text-crimson underline underline-offset-4">← Back to inbox</Link>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl text-ink-red">{r.name}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[r.status]}`}>
          {r.status === "new" ? "● New" : STATUS_LABELS[r.status]}
        </span>
      </div>
      <p className="mt-1 text-maroon/80">
        {TYPE_LABELS[r.type]} · <span className="font-mono">{r.reference_code}</span> · {formatDate(r.created_at)} ·{" "}
        <span className="uppercase">{r.locale}</span>
      </p>

      {sp.saved && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 font-medium text-emerald-900">Saved.</p>}
      {sp.error && <p role="alert" className="mt-4 rounded-xl border-2 border-crimson bg-white p-3 font-medium text-crimson">Could not save. Please try again.</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-ink-red/15 bg-white p-5" aria-labelledby="answers">
          <h2 id="answers" className="font-display text-xl text-ink-red">Answers</h2>
          <dl className="mt-4 divide-y divide-ink-red/10">
            <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
              <dt className="font-semibold text-ink-red">Contact</dt>
              <dd className="break-words">
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-crimson underline underline-offset-4">
                    {r.contact}
                  </a>
                ) : (
                  r.contact
                )}
                <span className="ml-2 text-sm text-maroon/60">({r.contact_type})</span>
              </dd>
            </div>
            {details.map((d) => (
              <div key={d.label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                <dt className="font-semibold text-ink-red">{d.label}</dt>
                <dd className="whitespace-pre-wrap break-words">{d.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <form action={updateRequest} className="h-fit space-y-4 rounded-2xl border border-ink-red/15 bg-white p-5" aria-label="Update request">
          <h2 className="font-display text-xl text-ink-red">Handle this request</h2>
          <input type="hidden" name="id" value={r.id} />
          <label className="block">
            <span className="mb-1 block font-semibold text-ink-red">Status</span>
            <select name="status" defaultValue={r.status} className={field}>
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block font-semibold text-ink-red">Assigned to</span>
            <select name="assigned_to" defaultValue={r.assigned_to ?? ""} className={field}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.display_name ?? "Admin"}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block font-semibold text-ink-red">Internal notes</span>
            <textarea name="internal_notes" rows={6} maxLength={5000} defaultValue={r.internal_notes ?? ""} className={`${field} py-2`} />
            <span className="mt-1 block text-sm text-maroon/70">Only the team sees these.</span>
          </label>
          <button type="submit" className="min-h-12 w-full rounded-full bg-crimson px-6 font-semibold text-white hover:bg-maroon">
            Save changes
          </button>
          <p className="text-sm text-maroon/70">
            Last updated {formatDate(r.updated_at)}
            {editor ? ` by ${editor}` : ""}.
          </p>
        </form>
      </div>
    </>
  );
}
