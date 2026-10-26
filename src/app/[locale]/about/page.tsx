import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RibbonDivider } from "@/components/RibbonDivider";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section, SectionHeading } from "@/components/ui/Section";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

const CJK = '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.about.meta" });
  return pageMetadata({ locale, path: "/about", title: t("title"), description: t("description") });
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const faq = (await getTranslations({ locale, namespace: "faq" })).raw("general") as FaqItem[];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("lead")} />

      <Section labelledBy="meaning-title">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="reveal text-center">
            <p lang="zh" aria-hidden="true" className="text-[min(34vw,10rem)] leading-none text-ink-red" style={{ fontFamily: CJK }}>
              缘分
            </p>
            <p className="mt-2 font-display text-lg tracking-[0.4em] text-crimson">{t("meaningPinyin")}</p>
          </div>
          <div className="reveal">
            <h2 id="meaning-title" className="font-display text-3xl text-ink-red">
              {t("meaningTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed sm:text-lg">{t("meaningText")}</p>
            <h3 className="mt-8 font-display text-xl text-ink-red">{t("ribbonTitle")}</h3>
            <p className="mt-3 text-base leading-relaxed">{t("ribbonText")}</p>
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="story-title" innerClassName="max-w-3xl">
        <div className="text-center">
          <h2 id="story-title" className="font-display text-2xl text-ink-red sm:text-3xl">
            {t("storyTitle")}
          </h2>
          <RibbonDivider className="mx-auto mt-5 w-48" />
          <p className="mt-6 text-base leading-relaxed sm:text-lg">{t("storyText")}</p>
          <p className="mt-3">
            <PlaceholderBadge what="our story" />
          </p>
          <h3 className="mt-12 font-display text-xl text-ink-red">{t("baseTitle")}</h3>
          <p className="mt-3 text-base leading-relaxed sm:text-lg">{t("baseText")}</p>
        </div>
      </Section>

      <Section id="faq" labelledBy="faq-title" innerClassName="max-w-3xl">
        <SectionHeading id="faq-title" title={t("faqTitle")} />
        <p className="mt-4 text-center">
          <PlaceholderBadge what="FAQ answers" />
        </p>
        <div className="mt-8">
          <FaqAccordion items={faq} />
        </div>
      </Section>
    </main>
  );
}
