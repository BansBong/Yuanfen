import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestSection } from "@/components/site/RequestSection";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.becomeGuide.meta" });
  return pageMetadata({ locale, path: "/become-a-guide", title: t("title"), description: t("description") });
}

export default async function BecomeGuidePage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.becomeGuide" });
  const why = t.raw("why") as string[];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <Section tone="jade" labelledBy="guide-who" innerClassName="max-w-3xl">
        <SectionHeading id="guide-who" title={t("whyTitle")} />
        <ul className="mt-8 space-y-3 text-base text-maroon sm:text-lg">
          {why.map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl card-surface p-4">
              <span aria-hidden="true" className="mt-3 size-2.5 shrink-0 rotate-45 bg-crimson" />
              {item}
            </li>
          ))}
        </ul>
      </Section>
      <RequestSection
        locale={locale}
        formId="guide_application"
        title={t("formTitle")}
        intro={t("formIntro")}
        showPriceNote={false}
      />
    </main>
  );
}
