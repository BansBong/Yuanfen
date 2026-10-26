import type { Metadata } from "next";
import { BRAND } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { INDEXABLE } from "@/lib/site-mode";

/**
 * Per-page metadata: canonical, hreflang alternates, Open Graph, and robots.
 * Everything is noindex unless NEXT_PUBLIC_SITE_MODE is "live" on production.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const full = `/${locale}${path}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: full,
      languages: { en: `/en${path}`, id: `/id${path}`, "x-default": `/en${path}` },
    },
    openGraph: {
      type: "website",
      url: full,
      siteName: BRAND.name,
      title,
      description,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: [locale === "id" ? "en_US" : "id_ID"],
      images: [{ url: "/og", width: 1200, height: 630, alt: `${BRAND.name}: ${BRAND.tagline}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og"] },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  };
}
