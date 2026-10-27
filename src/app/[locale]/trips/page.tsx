import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TripCard } from "@/components/site/TripCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TRIPS } from "@/data/trips";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "trips.meta" });
  return pageMetadata({ locale, path: "/trips", title: t("title"), description: t("description") });
}

export default async function TripsPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "trips" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <Section tone="peach">
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TRIPS.map((trip) => (
            <li key={trip.slug}>
              <TripCard trip={trip} locale={locale} />
            </li>
          ))}
        </ul>
        <div className="mt-14 rounded-3xl border-2 border-ink-red/20 bg-cream-center p-8 text-center">
          <h2 className="font-display text-xl text-ink-red sm:text-2xl">{t("customTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-maroon">{t("customText")}</p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/request-destination" icon="map-pin">
              {t("customCta")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
