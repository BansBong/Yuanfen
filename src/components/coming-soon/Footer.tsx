"use client";

import { useTranslations } from "next-intl";
import { BRAND } from "@/data/site";
import { instagramUrl, mailtoUrl, whatsappUrl } from "@/lib/contact";

const link =
  "underline-offset-4 hover:underline";

export function Footer() {
  const t = useTranslations("comingSoon");
  const mail = mailtoUrl();
  return (
    <footer className="px-5 pb-10 pt-6 text-center text-sm text-ink-red">
      <nav aria-label={t("footer.social")} className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <a href={instagramUrl()} target="_blank" rel="noopener noreferrer" className={link}>
          Instagram
        </a>
        <a href={whatsappUrl(t("whatsappMessage"))} target="_blank" rel="noopener noreferrer" className={link}>
          WhatsApp
        </a>
        {mail && (
          <a href={mail} className={link}>
            {t("footer.email")}
          </a>
        )}
      </nav>
      <p>
        © {BRAND.year} {BRAND.name} · {BRAND.madeIn}
      </p>
    </footer>
  );
}
