import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { safeNext } from "@/lib/admin/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Sign in" };

const MESSAGES: Record<string, string> = {
  noaccess: "This account does not have admin access. Ask an owner to set your role.",
  config: "The database is not connected yet (Supabase settings are missing).",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const configured = isSupabaseConfigured();

  // Already signed in as an admin? Skip the form. (Without a code the admin layout sends them on to /login/mfa.)
  if (configured && !sp.error) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(next);
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-ink-red/15 bg-white p-6 shadow-[0_24px_60px_-34px_rgba(122,15,18,0.55)]">
        <p className="font-display text-lg tracking-[0.3em] text-ink-red uppercase">Yuanfen</p>
        <h1 className="mt-2 font-display text-3xl text-ink-red">Team sign-in</h1>
        <p className="mt-2 text-base text-maroon/80">For the Yuanfen team only.</p>
        {sp.error && MESSAGES[sp.error] && (
          <p role="alert" className="mt-4 rounded-xl border-2 border-crimson p-3 font-medium text-crimson">
            {MESSAGES[sp.error]}
          </p>
        )}
        <div className="mt-6">
          {configured ? (
            <LoginForm next={next} />
          ) : (
            <p className="rounded-xl bg-cream p-3 text-base">Set the Supabase environment variables to enable sign-in (see README).</p>
          )}
        </div>
      </div>
    </main>
  );
}
