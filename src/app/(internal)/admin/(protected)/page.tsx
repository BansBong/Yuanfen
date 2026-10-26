import Link from "next/link";
import { Avatar } from "@/components/admin/AdminShell";
import {
  PAGE_SIZE,
  REQUEST_STATUSES,
  REQUEST_TYPES,
  STATUS_LABELS,
  STATUS_STYLES,
  TYPE_LABELS,
  type RequestRow,
  type TeamMember,
} from "@/lib/admin/constants";
import { formatDate } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/session";

type SearchParams = Promise<{ type?: string; status?: string; assigned?: string; q?: string; page?: string }>;

const field =
  "min-h-11 w-full rounded-xl border-2 border-ink-red/30 bg-white px-3 text-base text-maroon focus:border-crimson focus:outline-none";

export const metadata = { title: "Inbox" };

export default async function InboxPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();

  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("requests")
    .select("id, reference_code, type, status, name, contact, assigned_to, locale, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (sp.type && (REQUEST_TYPES as readonly string[]).includes(sp.type)) query = query.eq("type", sp.type);
  if (sp.status && (REQUEST_STATUSES as readonly string[]).includes(sp.status)) query = query.eq("status", sp.status);
  if (sp.assigned === "none") query = query.is("assigned_to", null);
  else if (sp.assigned && /^[0-9a-f-]{36}$/i.test(sp.assigned)) query = query.eq("assigned_to", sp.assigned);
  const q = (sp.q ?? "").replace(/[,()%*\\]/g, " ").trim().slice(0, 80);
  if (q) query = query.or(`name.ilike.%${q}%,contact.ilike.%${q}%,reference_code.ilike.%${q}%`);

  const [{ data, count, error }, { data: team }] = await Promise.all([
    query,
    supabase.from("profiles").select("id, display_name, avatar_url").eq("role", "admin"),
  ]);
  const rows = (data ?? []) as Pick<
    RequestRow,
    "id" | "reference_code" | "type" | "status" | "name" | "contact" | "assigned_to" | "locale" | "created_at"
  >[];
  const members = (team ?? []) as TeamMember[];
  const nameOf = (id: string | null) => members.find((m) => m.id === id);
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (v && k !== "page") params.set(k, v);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  return (
    <>
      <h1 className="font-display text-3xl text-ink-red">Inbox</h1>
      <p className="mt-1 text-maroon/80">{total} request{total === 1 ? "" : "s"}</p>

      <form method="get" className="mt-6 grid gap-3 rounded-2xl border border-ink-red/15 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block lg:col-span-2">
          <span className="mb-1 block text-sm font-semibold text-ink-red">Search</span>
          <input name="q" defaultValue={q} placeholder="Name, contact or reference code" className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-red">Type</span>
          <select name="type" defaultValue={sp.type ?? ""} className={field}>
            <option value="">All types</option>
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-red">Status</span>
          <select name="status" defaultValue={sp.status ?? ""} className={field}>
            <option value="">All statuses</option>
            {REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink-red">Assigned to</span>
          <select name="assigned" defaultValue={sp.assigned ?? ""} className={field}>
            <option value="">Anyone</option>
            <option value="none">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.display_name ?? "Admin"}</option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
          <button type="submit" className="min-h-11 rounded-full bg-ink-red px-6 font-medium text-cream hover:bg-maroon">
            Apply filters
          </button>
          <Link href="/admin" className="inline-flex min-h-11 items-center rounded-full border-2 border-ink-red/40 px-6 font-medium text-ink-red hover:bg-ink-red/10">
            Clear
          </Link>
        </div>
      </form>

      {error && <p role="alert" className="mt-6 rounded-xl border-2 border-crimson bg-white p-4 text-crimson">Could not load requests: {error.message}</p>}

      <ul className="mt-6 space-y-3">
        {rows.map((r) => {
          const owner = nameOf(r.assigned_to);
          return (
            <li key={r.id}>
              <Link
                href={`/admin/requests/${r.id}`}
                className="grid gap-2 rounded-2xl border border-ink-red/15 bg-white p-4 transition hover:border-ink-red/40 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${STATUS_STYLES[r.status]}`}>
                      {r.status === "new" ? "● New" : STATUS_LABELS[r.status]}
                    </span>
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-sm font-medium text-ink-red ring-1 ring-ink-red/20">
                      {TYPE_LABELS[r.type]}
                    </span>
                    <span className="font-mono text-sm text-maroon/70">{r.reference_code}</span>
                    <span className="text-sm uppercase text-maroon/60">{r.locale}</span>
                  </span>
                  <span className="mt-1 block truncate text-lg font-semibold text-ink-red">{r.name}</span>
                  <span className="block truncate text-maroon/80">{r.contact}</span>
                </span>
                <span className="flex items-center gap-3 text-sm text-maroon/80 sm:flex-col sm:items-end sm:gap-1">
                  <span>{formatDate(r.created_at)}</span>
                  <span className="flex items-center gap-2">
                    {owner ? (
                      <>
                        <Avatar name={owner.display_name ?? "A"} url={owner.avatar_url} size={24} />
                        {owner.display_name}
                      </>
                    ) : (
                      <span className="text-maroon/60">Unassigned</span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        {rows.length === 0 && !error && (
          <li className="rounded-2xl border-2 border-dashed border-ink-red/25 p-8 text-center">No requests match.</li>
        )}
      </ul>

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center justify-between">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="min-h-11 rounded-full border-2 border-ink-red/40 px-5 py-2 font-medium text-ink-red">
              ← Newer
            </Link>
          ) : <span />}
          <span>Page {page} of {pages}</span>
          {page < pages ? (
            <Link href={pageHref(page + 1)} className="min-h-11 rounded-full border-2 border-ink-red/40 px-5 py-2 font-medium text-ink-red">
              Older →
            </Link>
          ) : <span />}
        </nav>
      )}
    </>
  );
}
