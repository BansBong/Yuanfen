"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const field =
  "min-h-12 w-full rounded-xl border-2 border-ink-red/30 bg-white px-3 text-base text-maroon focus:border-crimson focus:outline-none";

/** Email + password. There is no sign-up: accounts are invited from the Supabase dashboard. */
export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setBusy(false);
      return setError("That email and password did not match.");
    }
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const needsCode = aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2";
    router.replace(needsCode ? `/login/mfa?next=${encodeURIComponent(next)}` : next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block font-semibold text-ink-red">Email</span>
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block font-semibold text-ink-red">Password</span>
        <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
      </label>
      {error && <p role="alert" className="font-medium text-crimson">{error}</p>}
      <button type="submit" disabled={busy} className="min-h-12 w-full rounded-full bg-crimson px-6 font-semibold text-white hover:bg-maroon disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
