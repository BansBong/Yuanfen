"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const field =
  "min-h-12 w-full rounded-xl border-2 border-ink-red/30 bg-white px-3 text-base text-maroon focus:border-crimson focus:outline-none";
const MIN_LENGTH = 12;

/** Lets each teammate replace the password they were given. */
export function ChangePassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (password.length < MIN_LENGTH) {
      return setMessage({ ok: false, text: `Use at least ${MIN_LENGTH} characters.` });
    }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) return setMessage({ ok: false, text: error.message });
    setPassword("");
    setMessage({ ok: true, text: "Password changed." });
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-ink-red/15 bg-white p-5">
      <h2 className="font-display text-xl text-ink-red">Change password</h2>
      <label className="block">
        <span className="mb-1 block font-semibold text-ink-red">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />
        <span className="mt-1 block text-sm text-maroon/70">At least {MIN_LENGTH} characters. A passphrase works well.</span>
      </label>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`rounded-xl p-3 font-medium ${message.ok ? "bg-emerald-50 text-emerald-900" : "border-2 border-crimson text-crimson"}`}>
          {message.text}
        </p>
      )}
      <button type="submit" disabled={busy} className="min-h-12 rounded-full border-2 border-ink-red/50 px-8 font-semibold text-ink-red hover:bg-ink-red hover:text-cream disabled:opacity-60">
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
