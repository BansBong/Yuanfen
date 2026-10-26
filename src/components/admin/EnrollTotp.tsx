"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const field =
  "min-h-12 w-full max-w-xs rounded-xl border-2 border-ink-red/30 bg-white px-3 text-center font-mono text-2xl tracking-[0.4em] text-maroon focus:border-crimson focus:outline-none";

type Enrollment = { factorId: string; qr: string; secret: string };

/** Authenticator-app (TOTP) enrollment: scan the QR code, then confirm with a 6-digit code. */
export function EnrollTotp() {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}` });
    setBusy(false);
    if (error || !data) return setError(error?.message ?? "Could not start setup.");
    setEnrollment({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollment) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code: code.trim() });
    setBusy(false);
    if (error) return setError("That code did not work. Check the code in your app and try again.");
    router.replace("/admin");
    router.refresh();
  }

  if (!enrollment) {
    return (
      <div>
        <button type="button" onClick={start} disabled={busy} className="min-h-12 rounded-full bg-crimson px-8 font-semibold text-white hover:bg-maroon disabled:opacity-60">
          {busy ? "Starting…" : "Set up an authenticator app"}
        </button>
        {error && <p role="alert" className="mt-3 font-medium text-crimson">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={verify} className="space-y-4">
      <ol className="list-decimal space-y-2 pl-6">
        <li>Open an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy...).</li>
        <li>Scan this QR code, or type the secret key by hand.</li>
        <li>Enter the 6-digit code the app shows.</li>
      </ol>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={enrollment.qr} alt="QR code for your authenticator app" width={192} height={192} className="rounded-xl border border-ink-red/20 bg-white p-2" />
      <p className="text-sm">
        Secret key: <code className="select-all rounded bg-cream px-2 py-1 font-mono">{enrollment.secret}</code>
      </p>
      <label className="block">
        <span className="mb-1 block font-semibold text-ink-red">6-digit code</span>
        <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required className={field} />
      </label>
      {error && <p role="alert" className="font-medium text-crimson">{error}</p>}
      <button type="submit" disabled={busy || code.length !== 6} className="min-h-12 rounded-full bg-crimson px-8 font-semibold text-white hover:bg-maroon disabled:opacity-60">
        {busy ? "Checking…" : "Turn on two-step sign-in"}
      </button>
    </form>
  );
}
