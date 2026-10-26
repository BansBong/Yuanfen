import type { Metadata, Viewport } from "next";
import { Jost, Marcellus } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/components/LanguageProvider";
import { BRAND } from "@/data/site";
import "./globals.css";

// Poster lettering: COMING SOON is a refined serif; YUANFENN + tagline a light sans.
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const title = "Yuanfenn | Your bridge to China";
const description =
  "Yuanfenn: tour guiding, jasa titip, medical support and university admission in China. Your bridge to China, guided by fate. Coming soon.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title,
  description,
  applicationName: BRAND.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: BRAND.name,
    title,
    description,
    locale: "id_ID",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${marcellus.variable} ${jost.variable}`}>
      <body className="min-h-dvh">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
