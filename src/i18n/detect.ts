import type { NextRequest } from "next/server";
import { isLocale, type Locale } from "./routing";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * 1) saved choice (cookie), 2) first supported language in Accept-Language
 * (Indonesian -> "id", English -> "en"), 3) English.
 */
export function detectLocale(req: NextRequest): Locale {
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const ranked = (req.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q.slice(2)) : 1 };
    })
    .filter((x) => x.tag && !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "id" || primary === "in") return "id"; // "in" is the legacy code for Indonesian
    if (primary === "en") return "en";
  }
  return "en";
}
