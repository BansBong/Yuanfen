"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const field =
  "min-h-12 w-full rounded-xl border-2 border-ink-red/30 bg-white px-3 text-center font-mono text-2xl tracking-[0.4em] text-maroon focus:border-crimson focus:outline-none";

/** Asks for the 6-digit code from the authenticator app. */
export function MfaForm({ next }: { next: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp?.find((f) => f.status === "verified");
    if (listError || !factor) {
      setBusy(false);
      return setError("No authenticator is set up for this account.");
    }
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
    if (error) {
      setBusy(false);
      return setError("That code did not work. Wait for a fresh code and try again.");
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block font-semibold text-ink-red">6-digit code</span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          required
          className={field}
        />
      </label>
      {error && <p role="alert" className="font-medium text-crimson">{error}</p>}
      <button type="submit" disabled={busy || code.length !== 6} className="min-h-12 w-full rounded-full bg-crimson px-6 font-semibold text-white hover:bg-maroon disabled:opacity-60">
        {busy ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
