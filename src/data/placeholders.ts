/**
 * ALL not-yet-final values live here (plus the copy/data files listed in
 * PLACEHOLDERS.md). Every placeholder is clearly fake and contains the word
 * PLACEHOLDER (or is all zeros) so it is easy to grep:
 *
 *     npm run check:placeholders
 *
 * Replace these before the site goes live. Nothing here is a real contact.
 */

/** PLACEHOLDER: real WhatsApp number, digits only, with country code (no "+" or spaces). */
export const WHATSAPP_NUMBER = "000000000000";

/** Instagram username without the "@". */
export const INSTAGRAM_HANDLE = "yuanfen.bridge";

/** Public contact email. */
export const CONTACT_EMAIL = "norikakhosiwa238@gmail.com";

/** Other contact channels. Hidden in the UI while a value is a placeholder. */
export const WECHAT_ID = "Norika8989";
export const THREADS_HANDLE = "yuanfen.bridge";

/** PLACEHOLDER: how fast the team replies; shown on the confirmation page. */
export const RESPONSE_TIME = {
  en: "PLACEHOLDER response time (e.g. 24 hours)",
  id: "PLACEHOLDER waktu respons (mis. 24 jam)",
} as const;

/** True for any value that has not been replaced yet. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return /PLACEHOLDER/i.test(value) || /^0+$/.test(value);
}
