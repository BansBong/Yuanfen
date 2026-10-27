import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { QuestionnaireForm } from "@/components/forms/QuestionnaireForm";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.inquiry.meta" });
  return pageMetadata({ locale, path: "/inquiry", title: t("title"), description: t("description") });
}

export default async function InquiryPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.inquiry" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={`${t("greeting")} ${t("intro")}`} />
      <Section tone="blush" innerClassName="max-w-3xl" className="!pt-8">
        <QuestionnaireForm />
        <div className="mt-8 space-y-3 rounded-3xl border-2 border-dashed border-ink-red/25 p-5 text-base leading-relaxed text-maroon">
          <p className="font-medium text-ink-red">{t("note")}</p>
          <p>{t("afterSubmit")}</p>
          <p className="font-display text-lg text-ink-red">{t("closing")}</p>
        </div>
      </Section>
    </main>
  );
}
