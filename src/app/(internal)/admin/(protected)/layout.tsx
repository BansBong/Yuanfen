import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/session";

// Everything under here needs: signed in, role = admin, MFA verified.
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, profile } = await requireAdmin();
  const { count } = await supabase
    .from("requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  return (
    <AdminShell profile={profile} newCount={count ?? 0}>
      {children}
    </AdminShell>
  );
}
