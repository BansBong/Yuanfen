import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestSection } from "@/components/site/RequestSection";
import { PageHero } from "@/components/ui/PageHero";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.requestDestination.meta" });
  return pageMetadata({ locale, path: "/request-destination", title: t("title"), description: t("description") });
}

export default async function RequestDestinationPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.requestDestination" });
  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <RequestSection locale={locale} formId="destination_request" title={t("formTitle")} showPriceNote={false} />
    </main>
  );
}
