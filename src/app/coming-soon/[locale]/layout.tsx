import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { fontVariables } from "@/app/fonts";
import { Footer } from "@/components/coming-soon/Footer";
import { Header } from "@/components/coming-soon/Header";
import { BRAND } from "@/data/site";
import { pickMessages } from "@/i18n/messages";
import { isLocale, routing } from "@/i18n/routing";
import "@/app/globals.css";

const TITLE = "Yuanfen | Your bridge to China";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/coming-soon/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "comingSoon" });
  const description = t("metaDescription");
  return {
    metadataBase: new URL(BRAND.url),
    title: TITLE,
    description,
    applicationName: BRAND.name,
    alternates: { canonical: "/" },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: BRAND.name,
      title: TITLE,
      description,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: [locale === "id" ? "en_US" : "id_ID"],
      images: [{ url: "/og", width: 1200, height: 630, alt: `${BRAND.name}: ${BRAND.tagline}` }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description, images: ["/og"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf9f3",
  width: "device-width",
  initialScale: 1,
};

export default async function ComingSoonLayout({ children, params }: LayoutProps<"/coming-soon/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={fontVariables}>
      <body className="min-h-dvh">
        <NextIntlClientProvider locale={locale} messages={pickMessages(messages, ["comingSoon"])}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
