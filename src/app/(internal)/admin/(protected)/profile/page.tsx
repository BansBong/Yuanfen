import { ChangePassword } from "@/components/admin/ChangePassword";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "My profile" };

export default async function ProfilePage() {
  const { user, profile } = await requireAdmin();
  return (
    <>
      <h1 className="font-display text-3xl text-ink-red">My profile</h1>
      <p className="mt-1 mb-6 text-maroon/80">Signed in as {user.email}.</p>
      <ProfileForm userId={user.id} displayName={profile.display_name ?? ""} avatarUrl={profile.avatar_url} />
      <ChangePassword />
    </>
  );
}
