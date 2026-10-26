import { redirect } from "next/navigation";
import { MfaForm } from "@/components/admin/MfaForm";
import { safeNext } from "@/lib/admin/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Enter your code" };

export default async function MfaPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (!isSupabaseConfigured()) redirect("/login?error=config");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-ink-red/15 bg-white p-6 shadow-[0_24px_60px_-34px_rgba(122,15,18,0.55)]">
        <p className="font-display text-lg tracking-[0.3em] text-ink-red uppercase">Yuanfen</p>
        <h1 className="mt-2 font-display text-3xl text-ink-red">Two-step sign-in</h1>
        <p className="mt-2 text-base text-maroon/80">Open your authenticator app and enter the 6-digit code.</p>
        <div className="mt-6">
          <MfaForm next={next} />
        </div>
      </div>
    </main>
  );
}
