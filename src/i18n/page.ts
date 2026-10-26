import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./routing";

/**
 * Call first in every page/layout: validates the locale segment and enables
 * static rendering for it.
 */
export async function initPage(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export type LocaleParams = { params: Promise<{ locale: string }> };
