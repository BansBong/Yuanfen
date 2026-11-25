import type { MetadataRoute } from "next";
import { ALL_PATHS } from "@/data/nav";
import { STORIES } from "@/data/stories";
import { BRAND } from "@/data/site";
import { routing } from "@/i18n/routing";
import { SITE_MODE } from "@/lib/site-mode";

// Localized sitemap: every page in /en and /id, each with hreflang alternates.
// While the site is in coming-soon mode only the single Coming Soon URL is listed.
export default function sitemap(): MetadataRoute.Sitemap {
  if (SITE_MODE !== "live") {
    return [{ url: BRAND.url, changeFrequency: "weekly", priority: 1 }];
  }
  // /stories stays out of the sitemap until it has real content.
  return ALL_PATHS.filter((p) => p !== "/stories" || STORIES.length > 0).flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BRAND.url}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [l, `${BRAND.url}/${l}${path}`]),
          ["x-default", `${BRAND.url}/${routing.defaultLocale}${path}`],
        ]),
      },
    })),
  );
}
