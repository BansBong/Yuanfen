import { TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestSection } from "@/components/site/RequestSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section, SectionHeading } from "@/components/ui/Section";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "services.medical.meta" });
  return pageMetadata({ locale, path: "/services/medical", title: t("title"), description: t("description") });
}

export default async function MedicalPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "services.medical" });
  const s = await getTranslations({ locale, namespace: "services.common" });
  const c = await getTranslations({ locale, namespace: "common" });
  const faq = (await getTranslations({ locale, namespace: "faq" })).raw("medical") as FaqItem[];
  const what = t.raw("what") as string[];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")}>
        <ButtonLink href="#request" icon="send">
          {c("requestQuote")}
        </ButtonLink>
        <ButtonLink href={whatsappUrl(c("whatsappMessage"))} external variant="secondary" icon="message">
          {c("whatsapp")}
        </ButtonLink>
      </PageHero>

      {/* The disclaimer comes first and cannot be missed. */}
      <Section tone="peach" className="!py-10 sm:!py-12" innerClassName="max-w-3xl">
        <aside
          role="note"
          aria-labelledby="medical-disclaimer"
          className="rounded-3xl border-2 border-crimson bg-white p-6 shadow-[0_18px_40px_-28px_rgba(122,15,18,0.6)] sm:p-8"
        >
          <h2 id="medical-disclaimer" className="flex flex-wrap items-center gap-3 font-display text-xl text-ink-red sm:text-2xl">
            <TriangleAlert aria-hidden="true" className="size-8 text-crimson" />
            {t("disclaimerTitle")}
            <PlaceholderBadge what="medical copy" />
          </h2>
          <p className="mt-3 text-base leading-relaxed text-maroon sm:text-lg">{t("disclaimerText")}</p>
        </aside>
      </Section>

      <RequestSection
        locale={locale}
        formId="medical"
        eyebrow={s("requestEyebrow")}
        title={t("requestTitle")}
        intro={t("requestIntro")}
      />

      <Section tone="rose" labelledBy="medical-what" innerClassName="max-w-3xl">
        <SectionHeading id="medical-what" title={t("whatTitle")} />
        <ul className="mt-8 space-y-3 text-base text-maroon sm:text-lg">
          {what.map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl card-surface p-4">
              <span aria-hidden="true" className="mt-3 size-2.5 shrink-0 rotate-45 bg-crimson" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="blush" labelledBy="medical-faq" innerClassName="max-w-3xl">
        <SectionHeading id="medical-faq" title={s("faqTitle")} />
        <div className="mt-8">
          <FaqAccordion items={faq} />
        </div>
      </Section>
    </main>
  );
}
