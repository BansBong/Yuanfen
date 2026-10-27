import { formatDate } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Places" };

type PlaceCount = { source: "destination_request" | "tour"; place: string; total: number; last_at: string };

function Table({ title, note, rows }: { title: string; note: string; rows: PlaceCount[] }) {
  return (
    <section className="rounded-2xl border border-ink-red/15 bg-white p-5">
      <h2 className="font-display text-xl text-ink-red">{title}</h2>
      <p className="mt-1 text-maroon/80">{note}</p>
      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl border-2 border-dashed border-ink-red/25 p-6 text-center">Nothing yet.</p>
      ) : (
        <table className="mt-4 w-full text-left">
          <thead>
            <tr className="border-b-2 border-ink-red/20 text-sm uppercase tracking-wide text-ink-red">
              <th scope="col" className="py-2 pr-3">Place</th>
              <th scope="col" className="py-2 pr-3 text-right">Requests</th>
              <th scope="col" className="py-2 text-right">Latest</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.source}-${r.place}`} className="border-b border-ink-red/10">
                <th scope="row" className="py-2 pr-3 font-medium capitalize">{r.place}</th>
                <td className="py-2 pr-3 text-right font-semibold text-ink-red">{r.total}</td>
                <td className="py-2 text-right text-sm text-maroon/80">{formatDate(r.last_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/** Market research: which places people ask for, most requested first. */
export default async function PlacesPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.rpc("place_counts");
  const rows = ((data ?? []) as PlaceCount[]).map((r) => ({ ...r, total: Number(r.total) }));

  return (
    <>
      <h1 className="font-display text-3xl text-ink-red">Places</h1>
      <p className="mt-1 text-maroon/80">How many requests per place, most requested first.</p>
      {error && <p role="alert" className="mt-4 rounded-xl border-2 border-crimson bg-white p-4 text-crimson">Could not load: {error.message}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Table
          title="Destination requests"
          note="Places people asked for that are not on the list yet."
          rows={rows.filter((r) => r.source === "destination_request")}
        />
        <Table
          title="Places in service inquiries"
          note="Destinations written in the inquiry questionnaire (and older tour requests)."
          rows={rows.filter((r) => r.source === "tour")}
        />
      </div>
    </>
  );
}
