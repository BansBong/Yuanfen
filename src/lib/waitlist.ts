/**
 * ============================================================================
 *  WAITLIST BACKEND HOOK: the ONLY file to edit when wiring a real backend.
 * ============================================================================
 * `submitWaitlist` is called by <WaitlistForm /> after client-side validation.
 * Right now it stores nothing and always reports success (no database yet).
 *
 * TODO: replace the body with a real call, for example:
 *   const res = await fetch("/api/waitlist", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ email }),
 *   });
 *   return { ok: res.ok };
 * (or a Server Action, Resend / Mailchimp / Supabase / Google Sheets, etc.)
 */
export async function submitWaitlist(email: string): Promise<{ ok: boolean }> {
  void email;
  await new Promise((resolve) => setTimeout(resolve, 400)); // simulate latency
  return { ok: true };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}
