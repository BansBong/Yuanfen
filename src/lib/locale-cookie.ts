import { LOCALE_COOKIE } from "@/i18n/detect";
import type { Locale } from "@/i18n/routing";

/** Remember the visitor's language choice for a year (read again by the proxy). */
export function saveLocaleChoice(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
