import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequestSection } from "@/components/site/RequestSection";
import { Icon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Section } from "@/components/ui/Section";
import type { IconName } from "@/data/nav";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, TELEGRAM_HANDLE, WECHAT_ID } from "@/data/placeholders";
import { initPage, type LocaleParams } from "@/i18n/page";
import { isLocale } from "@/i18n/routing";
import { hasRealContact, instagramUrl, mailtoUrl, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { SHOW_PLACEHOLDER_BADGES } from "@/lib/site-mode";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.contact.meta" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: t("description") });
}

type Channel = { key: string; icon: IconName; title: string; value: string; href?: string; real: boolean; note?: string };

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const c = await getTranslations({ locale, namespace: "common" });

  const all: Channel[] = [
    {
      key: "whatsapp",
      icon: "message",
      title: t("whatsappTitle"),
      value: c("whatsapp"),
      href: whatsappUrl(c("whatsappMessage")),
      real: true,
      note: t("whatsappText"),
    },
    { key: "email", icon: "send", title: t("emailTitle"), value: CONTACT_EMAIL, href: mailtoUrl() ?? undefined, real: hasRealContact.email },
    { key: "instagram", icon: "camera", title: t("instagramTitle"), value: `@${INSTAGRAM_HANDLE}`, href: instagramUrl(), real: hasRealContact.instagram },
    { key: "wechat", icon: "message", title: t("wechatTitle"), value: WECHAT_ID, real: hasRealContact.wechat },
    { key: "telegram", icon: "send", title: t("telegramTitle"), value: TELEGRAM_HANDLE, real: hasRealContact.telegram },
  ];
  const channels = all.filter((ch) => ch.real || SHOW_PLACEHOLDER_BADGES);

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("h1")} intro={t("intro")} />
      <Section>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch) => {
            const inner = (
              <>
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                  <Icon name={ch.icon} className="size-8" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg text-ink-red">{ch.title}</span>
                  <span className="block break-words text-base text-maroon">{ch.real ? ch.value : <PlaceholderBadge what={ch.key} />}</span>
                  {ch.note && <span className="block text-base text-crimson">{ch.note}</span>}
                </span>
              </>
            );
            const cls =
              "flex min-h-24 items-center gap-4 rounded-3xl border border-ink-red/15 bg-white/70 p-5 transition hover:border-ink-red/40";
            return (
              <li key={ch.key}>
                {ch.href ? (
                  <a href={ch.href} target={ch.key === "email" ? undefined : "_blank"} rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
      <RequestSection locale={locale} formId="contact" title={t("formTitle")} intro={t("formIntro")} showPriceNote={false} />
    </main>
  );
}
