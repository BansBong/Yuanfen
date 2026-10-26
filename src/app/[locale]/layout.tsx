import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fontVariables } from "@/app/fonts";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StickyWhatsApp } from "@/components/site/StickyWhatsApp";
import { BRAND } from "@/data/site";
import { pickMessages } from "@/i18n/messages";
import { isLocale, routing } from "@/i18n/routing";
import { INDEXABLE } from "@/lib/site-mode";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    metadataBase: new URL(BRAND.url),
    title: { default: t("meta.title"), template: `%s | ${BRAND.name}` },
    description: t("meta.description"),
    applicationName: BRAND.name,
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf9f3",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const common = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale} className={fontVariables}>
      <body className="min-h-dvh bg-cream text-base leading-relaxed text-maroon">
        <NextIntlClientProvider locale={locale} messages={pickMessages(messages, ["common", "nav", "forms"])}>
          <a
            href="#main"
            className="sr-only z-50 rounded-full bg-ink-red px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {common("skip")}
          </a>
          <Header />
          <div id="main" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Footer />
          <StickyWhatsApp />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
