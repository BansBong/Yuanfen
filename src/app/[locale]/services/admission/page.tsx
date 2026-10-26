import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestSection } from "@/components/site/RequestSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
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
  const t = await getTranslations({ locale, namespace: "services.admission.meta" });
  return pageMetadata({ locale, path: "/services/admission", title: t("title"), description: t("description") });
}

export default async function AdmissionPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "services.admission" });
  const s = await getTranslations({ locale, namespace: "services.common" });
  const c = await getTranslations({ locale, namespace: "common" });
  const faq = (await getTranslations({ locale, namespace: "faq" })).raw("admission") as FaqItem[];
  const who = t.raw("who") as string[];
  const steps = t.raw("steps") as { title: string; text: string }[];
  const need = t.raw("need") as string[];

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

      <Section labelledBy="adm-who">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="adm-who" align="left" title={t("whoTitle")} />
            <ul className="mt-6 space-y-3 text-lg text-maroon sm:text-xl">
              {who.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-3 size-2.5 shrink-0 rotate-45 bg-crimson" />
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 font-display text-2xl text-ink-red">{t("needTitle")}</h3>
            <ul className="mt-4 space-y-2 text-lg text-maroon">
              {need.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rotate-45 bg-crimson" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <PlaceholderBadge what="admission copy" />
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink-red sm:text-4xl">{t("howTitle")}</h2>
            <ol className="mt-6 space-y-6">
              {steps.map((st, i) => (
                <li key={st.title} className="flex items-start gap-4">
                  <StarMarker n={i + 1} />
                  <div>
                    <h3 className="font-display text-xl text-ink-red">{st.title}</h3>
                    <p className="mt-1 text-lg leading-relaxed text-maroon">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <RequestSection
        locale={locale}
        formId="admission"
        eyebrow={s("requestEyebrow")}
        title={t("requestTitle")}
        intro={t("requestIntro")}
      />

      <Section labelledBy="adm-faq" innerClassName="max-w-3xl">
        <SectionHeading id="adm-faq" title={s("faqTitle")} />
        <div className="mt-8">
          <FaqAccordion items={faq} />
        </div>
      </Section>
    </main>
  );
}
