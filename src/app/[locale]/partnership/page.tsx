import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestSection } from "@/components/site/RequestSection";
import { Icon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import type { IconName } from "@/data/nav";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

const GROUPS: { key: string; icon: IconName }[] = [
  { key: "agency", icon: "plane" },
  { key: "hospital", icon: "hospital" },
  { key: "university", icon: "graduation-cap" },
  { key: "supplier", icon: "building" },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.partnership.meta" });
  return pageMetadata({ locale, path: "/partnership", title: t("title"), description: t("description") });
}

export default async function PartnershipPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.partnership" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <Section tone="jade">
        <ul className="grid gap-6 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <li key={g.key} className="reveal flex gap-4 rounded-3xl card-surface p-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                <Icon name={g.icon} className="size-8" />
              </span>
              <div>
                <h2 className="font-display text-xl text-ink-red">{t(`groups.${g.key}.title`)}</h2>
                <p className="mt-2 text-base leading-relaxed text-maroon">{t(`groups.${g.key}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <RequestSection
        locale={locale}
        formId="partnership"
        title={t("formTitle")}
        intro={t("formIntro")}
        showPriceNote={false}
      />
    </main>
  );
}
