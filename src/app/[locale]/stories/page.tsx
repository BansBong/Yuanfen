import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SocialVideo } from "@/components/ui/SocialVideo";
import { STORIES } from "@/data/stories";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { PLATFORM_NAME, parseVideo } from "@/lib/video";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "stories.meta" });
  const meta = pageMetadata({ locale, path: "/stories", title: t("title"), description: t("description") });
  // An empty page has nothing to rank for: keep it out of search until the first story is added.
  return STORIES.length ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function StoriesPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "stories" });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <Section tone="peach">
        {STORIES.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl card-surface p-8 text-center sm:p-10">
            <span className="inline-block rounded-full border-2 border-crimson/50 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-crimson uppercase">
              {t("soonBadge")}
            </span>
            <h2 className="mt-5 font-display text-2xl text-ink-red sm:text-3xl">{t("soonTitle")}</h2>
            <p className="mt-3 text-base text-maroon">{t("soonText")}</p>
            <div className="mt-6 flex justify-center">
              <ButtonLink href={whatsappUrl(common("whatsappMessage"))} external icon="message">
                {t("soonCta")}
              </ButtonLink>
            </div>
          </div>
        ) : (
          <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {STORIES.map((s) => {
              const video = s.kind === "video" ? parseVideo(s.url) : null;
              return (
                <li key={s.id} className="mb-6 break-inside-avoid">
                  <article className="rounded-3xl card-surface p-4">
                    {s.kind === "video" ? (
                      <SocialVideo
                        video={video}
                        watchUrl={s.url}
                        platformName={video ? PLATFORM_NAME[video.platform] : new URL(s.url).hostname.replace(/^www\./, "")}
                        title={s.title[locale]}
                        playLabel={t("play")}
                        openLabel={t("openOn")}
                      />
                    ) : (
                      <Image
                        src={s.src}
                        alt={s.title[locale]}
                        width={s.width}
                        height={s.height}
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                        className="h-auto w-full rounded-2xl"
                      />
                    )}
                    <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-crimson uppercase">
                      {t(`services.${s.service}`)}
                    </p>
                    <h2 className="mt-1 font-display text-lg leading-snug text-ink-red">{s.title[locale]}</h2>
                    {s.caption && <p className="mt-2 text-base text-maroon">{s.caption[locale]}</p>}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-14 rounded-3xl border-2 border-ink-red/20 bg-cream-center p-8 text-center">
          <h2 className="font-display text-xl text-ink-red sm:text-2xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-maroon">{t("ctaText")}</p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/inquiry" icon="message">
              {t("ctaButton")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
