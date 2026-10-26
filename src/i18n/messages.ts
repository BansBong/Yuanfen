import type { Locale } from "./routing";

/**
 * Message namespaces. Each lives in messages/<locale>/<namespace>.json so the
 * copy stays in locale files (not in components) and is easy to review.
 */
export const NAMESPACES = [
  "comingSoon",
  "common",
  "nav",
  "home",
  "services",
  "trips",
  "pages",
  "forms",
  "faq",
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      const mod = await import(`../../messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<Namespace, Record<string, unknown>>;
}

/** Only ship the namespaces a client tree needs. */
export function pickMessages(all: Record<string, unknown>, namespaces: Namespace[]) {
  return Object.fromEntries(namespaces.map((ns) => [ns, all[ns]]));
}
