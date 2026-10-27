import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InquiryCta } from "@/components/site/InquiryCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { Icon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section, SectionHeading } from "@/components/ui/Section";
import { StarMarker } from "@/components/ui/StarMarker";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "services.jastip.meta" });
  return pageMetadata({ locale, path: "/services/jasa-titip", title: t("title"), description: t("description") });
}

export default async function JasaTitipPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "services.jastip" });
  const s = await getTranslations({ locale, namespace: "services.common" });
  const c = await getTranslations({ locale, namespace: "common" });
  const faq = (await getTranslations({ locale, namespace: "faq" })).raw("jastip") as FaqItem[];
  const steps = t.raw("steps") as { title: string; text: string }[];
  const trust = t.raw("trust") as string[];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")}>
        <ButtonLink href="/inquiry?service=jastip" icon="send">
          {c("requestQuote")}
        </ButtonLink>
        <ButtonLink href={whatsappUrl(c("whatsappMessage"))} external variant="secondary" icon="message">
          {c("whatsapp")}
        </ButtonLink>
      </PageHero>

      <Section tone="peach" labelledBy="jastip-how">
        <SectionHeading id="jastip-how" title={t("howTitle")} />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, i) => (
            <li key={st.title} className="reveal flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
              <StarMarker n={i + 1} />
              <div>
                <h3 className="font-display text-lg text-ink-red">{st.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-maroon">{st.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-ink-red/20 bg-white/70 p-6">
            <h3 className="flex flex-wrap items-center gap-3 font-display text-xl text-ink-red">
              <Icon name="file" className="size-7 text-crimson" />
              {t("paymentTitle")}
              <PlaceholderBadge what="payment policy" />
            </h3>
            <p className="mt-3 text-base leading-relaxed text-maroon">{t("paymentText")}</p>
          </div>
          <div className="rounded-3xl border-2 border-ink-red/20 bg-white/70 p-6">
            <h3 className="flex flex-wrap items-center gap-3 font-display text-xl text-ink-red">
              <Icon name="shield" className="size-7 text-crimson" />
              {t("feesTitle")}
              <PlaceholderBadge what="fee policy" />
            </h3>
            <p className="mt-3 text-base leading-relaxed text-maroon">{t("feesText")}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-cream-center p-6 ring-1 ring-ink-red/15">
          <h3 className="flex flex-wrap items-center gap-3 font-display text-xl text-ink-red">
            {t("trustTitle")}
            <PlaceholderBadge what="trust list" />
          </h3>
          <ul className="mt-3 space-y-2 text-base text-maroon">
            {trust.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-2.5 shrink-0 rotate-45 bg-crimson" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <InquiryCta locale={locale} service="jastip" />

      <Section labelledBy="jastip-faq" innerClassName="max-w-3xl">
        <SectionHeading id="jastip-faq" title={s("faqTitle")} />
        <div className="mt-8">
          <FaqAccordion items={faq} />
        </div>
      </Section>
    </main>
  );
}
