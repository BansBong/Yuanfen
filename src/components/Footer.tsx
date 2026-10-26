"use client";

import Link from "next/link";
import { BRAND, COPY, NAV, instagramUrl, mailtoUrl, whatsappUrl } from "@/data/site";
import { useLang } from "./LanguageProvider";

const link =
  "underline-offset-4 hover:underline";

export function Footer() {
  const { lang } = useLang();
  const mail = mailtoUrl();
  return (
    <footer className="px-5 pb-10 pt-6 text-center text-sm text-ink-red">
      <nav aria-label={COPY.footer.social[lang]} className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link href="/about" className={link}>
          {NAV.about[lang]}
        </Link>
        <a href={instagramUrl()} target="_blank" rel="noopener noreferrer" className={link}>
          Instagram
        </a>
        <a href={whatsappUrl(lang)} target="_blank" rel="noopener noreferrer" className={link}>
          WhatsApp
        </a>
        {mail && (
          <a href={mail} className={link}>
            {COPY.footer.email[lang]}
          </a>
        )}
      </nav>
      <p>
        © {BRAND.year} {BRAND.name} · {BRAND.madeIn}
      </p>
    </footer>
  );
}
