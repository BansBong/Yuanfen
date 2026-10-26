import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section } from "@/components/ui/Section";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.privacy.meta" });
  return pageMetadata({ locale, path: "/privacy", title: t("title"), description: t("description") });
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  const sections = t.raw("sections") as { title: string; text: string }[];

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} />
      <Section innerClassName="max-w-3xl">
        <p className="rounded-2xl border-2 border-dashed border-ink-red/30 bg-cream-center p-4 text-lg">
          {t("draftNote")} <PlaceholderBadge what="privacy policy" />
        </p>
        <p className="mt-4 text-base text-maroon">
          {t("updatedLabel")}: {t("updated")}
        </p>
        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-2xl text-ink-red">{s.title}</h2>
              <p className="mt-2 text-lg leading-relaxed">{s.text}</p>
            </section>
          ))}
        </div>
      </Section>
    </main>
  );
}
