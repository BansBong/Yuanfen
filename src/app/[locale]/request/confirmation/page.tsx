import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConfirmationPanel } from "@/components/forms/ConfirmationPanel";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section } from "@/components/ui/Section";
import { RESPONSE_TIME } from "@/data/placeholders";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.confirmation.meta" });
  // A thank-you page should never appear in search results.
  return { ...pageMetadata({ locale, path: "/request/confirmation", title: t("title"), description: t("description") }), robots: { index: false, follow: false } };
}

export default async function ConfirmationPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.confirmation" });
  const f = await getTranslations({ locale, namespace: "forms" });

  return (
    <main>
      <Section tone="paper" className="!pt-20" innerClassName="max-w-xl">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink-red sm:text-4xl">{t("h1")}</h1>
          <p className="mt-4 text-xl leading-relaxed text-maroon">{t("text", { time: RESPONSE_TIME[locale] })}</p>
          <p className="mt-2">
            <PlaceholderBadge what="response time" />
          </p>
        </div>
        <div className="mt-8">
          <ConfirmationPanel
            strings={{
              refLabel: t("refLabel"),
              refHelp: t("refHelp"),
              whatsappCta: t("whatsappCta"),
              whatsappMessage: t("whatsappMessage", { ref: "{ref}" }),
              noRef: t("noRef"),
              copy: f("copy"),
              copied: f("copied"),
            }}
          />
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/" variant="secondary">
            {t("home")}
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
