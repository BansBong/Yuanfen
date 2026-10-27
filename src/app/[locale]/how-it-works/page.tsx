import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { StarMarker } from "@/components/ui/StarMarker";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.howItWorks.meta" });
  return pageMetadata({ locale, path: "/how-it-works", title: t("title"), description: t("description") });
}

export default async function HowItWorksPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.howItWorks" });
  const steps = t.raw("steps") as { title: string; text: string }[];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <Section tone="peach" innerClassName="max-w-3xl">
        <ol className="space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className="reveal flex items-start gap-5 rounded-3xl card-surface p-6">
              <StarMarker n={i + 1} />
              <div>
                <h2 className="font-display text-xl text-ink-red">{s.title}</h2>
                <p className="mt-2 text-base leading-relaxed text-maroon sm:text-lg">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 rounded-3xl bg-cream-center p-6 ring-1 ring-ink-red/15">
          <h2 className="font-display text-xl text-ink-red">{t("noPricesTitle")}</h2>
          <p className="mt-2 text-base leading-relaxed text-maroon">{t("noPricesText")}</p>
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/#services" icon="compass">
            {t("cta")}
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
