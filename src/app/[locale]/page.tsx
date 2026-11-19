import { Check } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ServiceCard } from "@/components/site/ServiceCard";
import { TripCard } from "@/components/site/TripCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Glyph, Skyline } from "@/components/ui/Decor";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { Icon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section, SectionHeading } from "@/components/ui/Section";
import { StarMarker } from "@/components/ui/StarMarker";
import { SHOW_GUIDES, SHOW_TESTIMONIALS } from "@/data/flags";
import { SERVICE_LINKS, type IconName } from "@/data/nav";
import { GUIDES, TESTIMONIALS } from "@/data/people";
import { BRAND } from "@/data/site";
import { TRIPS } from "@/data/trips";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { instagramUrl, hasRealContact, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "home" });
  return pageMetadata({ locale, path: "", title: t("meta.title"), description: t("meta.description"), absoluteTitle: true });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });
  const faq = (await getTranslations({ locale, namespace: "faq" })).raw("general") as FaqItem[];

  const steps = t.raw("how.steps") as { title: string; text: string }[];
  const why = t.raw("why.items") as { icon: IconName; title: string; text: string }[];
  const trust = t.raw("hero.trust") as string[];

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.url,
    logo: `${BRAND.url}/brand/logo.png`,
    slogan: BRAND.tagline,
    description: t("meta.description"),
    ...(hasRealContact.instagram ? { sameAs: [instagramUrl()] } : {}),
  };

  return (
    <main>
      <JsonLd data={organization} />

      {/* hero */}
      <section className="tone-dark bg-deep relative isolate flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden lg:min-h-[calc(100dvh-5rem)]">
        <Glyph className="top-[6%] -right-[8%] -z-10 text-[30rem] sm:text-[46rem]" />
        <span aria-hidden="true" className="absolute top-[10%] left-[6%] -z-10 size-72 rounded-full bg-[#b3262a]/25 blur-[100px] sm:size-[30rem]" />
        <div className="anim-fade-up mx-auto flex max-w-2xl flex-col items-center px-5 pt-12 pb-44 text-center sm:pb-56">
          <div className="grid size-56 place-items-center rounded-full border border-ink-red/30 bg-[radial-gradient(circle_at_50%_35%,#8e1519,#6c0c10_70%)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:size-72">
            <div className="flex flex-col items-center">
              <Image
                src="/brand/logo.png"
                alt={t("hero.logoAlt")}
                width={904}
                height={528}
                priority
                sizes="(min-width: 640px) 200px, 150px"
                className="h-auto w-[150px] translate-x-[1.2%] [filter:brightness(0)_invert(1)] select-none sm:w-[200px]"
              />
              <p aria-hidden="true" className="mt-1 pl-[0.5em] font-sans text-base font-normal tracking-[0.5em] text-ink-red sm:text-xl">
                {BRAND.name.toUpperCase()}
              </p>
            </div>
          </div>
          <h1 className="mt-10 font-display text-4xl leading-[1.08] text-ink-red sm:text-6xl">{BRAND.tagline}</h1>
          <p className="mt-5 text-lg leading-relaxed text-maroon">{t("hero.pitch")}</p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <ButtonLink href="#services" variant="primary" icon="compass">
              {t("hero.ctaServices")}
            </ButtonLink>
            <ButtonLink href={whatsappUrl(c("whatsappMessage"))} external variant="secondary" icon="message">
              {c("whatsapp")}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-base text-maroon">
            {trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="size-5 text-crimson" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10">
          <span className="block h-2 w-full bg-gradient-to-r from-[#c9953f] via-[#fbe9bd] to-[#d9a955]" />
          <Skyline className="h-32 sm:h-52" />
        </div>
      </section>

      {/* services */}
      <Section id="services" tone="peach" labelledBy="services-title">
        <SectionHeading id="services-title" eyebrow={t("services.eyebrow")} title={t("services.title")} text={t("services.text")} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_LINKS.map((s) => (
            <li key={s.key}>
              <ServiceCard
                href={s.href}
                icon={s.icon}
                title={t(`services.items.${s.key}.title`)}
                line={t(`services.items.${s.key}.line`)}
                cta={c("learnMore")}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* how it works */}
      <Section tone="dark" labelledBy="how-title" above="#f7e7da" below="#fcf3e6">
        <SectionHeading id="how-title" eyebrow={t("how.eyebrow")} title={t("how.title")} />
        <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="reveal flex items-start gap-4 lg:flex-col lg:items-center lg:text-center">
              <StarMarker n={i + 1} />
              <div>
                <h3 className="font-display text-lg text-ink-red">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-maroon">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/how-it-works" variant="secondary">
            {t("how.cta")}
          </ButtonLink>
        </div>
      </Section>

      {/* why */}
      <Section tone="rose" labelledBy="why-title">
        <SectionHeading id="why-title" eyebrow={t("why.eyebrow")} title={t("why.title")} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <li key={w.title} className="reveal rounded-3xl card-surface p-6">
              <span className="grid size-14 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                <Icon name={w.icon} className="size-8" />
              </span>
              <h3 className="mt-4 font-display text-lg text-ink-red">{w.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-maroon">{w.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* trips preview */}
      <Section tone="peach" labelledBy="trips-title">
        <SectionHeading id="trips-title" eyebrow={t("trips.eyebrow")} title={t("trips.title")} text={t("trips.text")} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TRIPS.slice(0, 3).map((trip) => (
            <li key={trip.slug}>
              <TripCard trip={trip} locale={locale} compact />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/trips" variant="secondary" icon="route">
            {t("trips.cta")}
          </ButtonLink>
        </div>
      </Section>

      {/* guides: hidden until real guides exist */}
      {SHOW_GUIDES && GUIDES.length > 0 && (
        <Section labelledBy="guides-title">
          <SectionHeading id="guides-title" eyebrow={t("guides.eyebrow")} title={t("guides.title")} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <li key={g.name} className="rounded-3xl card-surface p-6">
                <h3 className="font-display text-lg text-ink-red">{g.name}</h3>
                <p className="mt-1 text-maroon">
                  {g.city} · {g.languages.join(", ")}
                </p>
                <p className="mt-3 text-base">{g.bio[locale]}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* testimonials: hidden until real ones exist */}
      {SHOW_TESTIMONIALS && TESTIMONIALS.length > 0 && (
        <Section tone="peach" labelledBy="testimonials-title">
          <SectionHeading id="testimonials-title" eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((q) => (
              <li key={q.name} className="rounded-3xl card-surface p-6">
                <blockquote className="text-base">“{q.quote[locale]}”</blockquote>
                <p className="mt-3 font-semibold text-ink-red">
                  {q.name}, {q.origin}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* FAQ preview */}
      <Section labelledBy="faq-title" innerClassName="max-w-3xl">
        <SectionHeading id="faq-title" eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
        <div className="mt-4 text-center">
          <PlaceholderBadge what="FAQ answers" />
        </div>
        <div className="mt-8">
          <FaqAccordion items={faq.slice(0, 3)} />
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/about#faq" variant="secondary" icon="help">
            {t("faq.cta")}
          </ButtonLink>
        </div>
      </Section>

      {/* final CTA */}
      <Section tone="dark" labelledBy="cta-title" below="#4a0c0f" innerClassName="max-w-2xl text-center">
        <h2 id="cta-title" className="font-display text-4xl leading-tight text-ink-red sm:text-5xl">
          {t("finalCta.title")}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-maroon">{t("finalCta.text")}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="#services" variant="primary" icon="compass">
            {c("chooseService")}
          </ButtonLink>
          <ButtonLink href={whatsappUrl(c("whatsappMessage"))} external variant="secondary" icon="message">
            {c("whatsapp")}
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
