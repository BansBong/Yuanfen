import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InquiryCta } from "@/components/site/InquiryCta";
import { TourPlanner } from "@/components/site/TourPlanner";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { Icon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { DESTINATIONS, REGIONS } from "@/data/destinations";
import type { IconName } from "@/data/nav";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

const TYPES: { key: string; icon: IconName }[] = [
  { key: "city", icon: "compass" },
  { key: "business", icon: "briefcase" },
  { key: "muslim", icon: "moon" },
  { key: "airport", icon: "plane" },
  { key: "photo", icon: "camera" },
];

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "services.tour.meta" });
  return pageMetadata({ locale, path: "/services/tour-guiding", title: t("title"), description: t("description") });
}

export default async function TourGuidingPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "services.tour" });
  const s = await getTranslations({ locale, namespace: "services.common" });
  const c = await getTranslations({ locale, namespace: "common" });
  const faq = (await getTranslations({ locale, namespace: "faq" })).raw("tour") as FaqItem[];

  const groups = REGIONS.map((r) => ({
    id: r.id,
    name: r.name[locale],
    cities: DESTINATIONS.filter((d) => d.region === r.id).map((d) => ({
      id: d.id,
      name: d.name,
      hook: d.hook[locale],
      status: d.status,
    })),
  }));

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")}>
        <ButtonLink href="/inquiry?service=tour" icon="send">
          {c("requestQuote")}
        </ButtonLink>
        <ButtonLink href={whatsappUrl(c("whatsappMessage"))} external variant="secondary" icon="message">
          {c("whatsapp")}
        </ButtonLink>
      </PageHero>

      <Section tone="peach" labelledBy="types-title">
        <SectionHeading id="types-title" title={t("typesTitle")} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((ty) => (
            <li key={ty.key} className="reveal flex gap-4 rounded-3xl card-surface p-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                <Icon name={ty.icon} className="size-8" />
              </span>
              <div>
                <h3 className="font-display text-lg text-ink-red">{t(`types.${ty.key}.title`)}</h3>
                <p className="mt-1 text-base leading-relaxed text-maroon">{t(`types.${ty.key}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sky" labelledBy="dest-title" innerClassName="max-w-7xl">
        <SectionHeading id="dest-title" title={t("destTitle")} text={t("destIntro")} />
        <div className="mt-12">
          <TourPlanner
            groups={groups}
            labels={{
              available: t("statusAvailable"),
              onRequest: t("statusOnRequest"),
              photoPlaceholder: t("photoPlaceholder"),
              choose: t("choose"),
              chosen: t("chosen"),
            }}
            summary={{ selected: t("selectedPlaces"), continue: t("continueToForm") }}
            between={
              <aside className="mt-12 rounded-3xl border-2 border-ink-red/25 bg-cream p-6">
                <h3 className="font-display text-xl text-ink-red">{t("hkmoTitle")}</h3>
                <p className="mt-2 text-base leading-relaxed text-maroon">{t("hkmoText")}</p>
              </aside>
            }
          />
        </div>
      </Section>

      <InquiryCta locale={locale} service="tour" />

      <Section labelledBy="tour-faq-title" innerClassName="max-w-3xl">
        <SectionHeading id="tour-faq-title" title={s("faqTitle")} />
        <div className="mt-8">
          <FaqAccordion items={faq} />
        </div>
      </Section>
    </main>
  );
}
