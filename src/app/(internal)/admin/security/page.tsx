import { AdminShell } from "@/components/admin/AdminShell";
import { EnrollTotp } from "@/components/admin/EnrollTotp";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Security" };

// Lives outside the (protected) group on purpose: admins who have not enrolled yet must be able to reach it.
export default async function SecurityPage({ searchParams }: { searchParams: Promise<{ setup?: string }> }) {
  const sp = await searchParams;
  const { supabase, profile } = await requireAdmin({ skipMfa: true });
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = factors?.totp?.filter((f) => f.status === "verified") ?? [];

  return (
    <AdminShell profile={profile}>
      <h1 className="font-display text-3xl text-ink-red">Security</h1>
      <section className="mt-6 max-w-2xl rounded-2xl border border-ink-red/15 bg-white p-5">
        <h2 className="font-display text-xl text-ink-red">Two-step sign-in</h2>
        {verified.length > 0 ? (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 font-medium text-emerald-900">
            On. Your account asks for a code from your authenticator app every time you sign in.
          </p>
        ) : (
          <>
            <p className={`mt-3 rounded-xl p-3 font-medium ${sp.setup ? "border-2 border-crimson text-crimson" : "bg-cream"}`}>
              {sp.setup
                ? "Admin pages need two-step sign-in. Set it up once, then you will be taken to the inbox."
                : "Two-step sign-in is not set up yet."}
            </p>
            <div className="mt-5">
              <EnrollTotp />
            </div>
          </>
        )}
      </section>
    </AdminShell>
  );
}
