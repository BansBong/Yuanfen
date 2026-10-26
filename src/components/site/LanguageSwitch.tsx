"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** EN | ID pill. Each option links to the same page in the other language. */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex overflow-hidden rounded-full border-2 border-ink-red/60 bg-cream text-base font-semibold tracking-widest ${className}`}
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          hrefLang={l}
          aria-current={locale === l ? "true" : undefined}
          className={`grid min-h-11 min-w-12 place-items-center px-3 uppercase transition-colors ${
            locale === l ? "bg-ink-red text-cream" : "text-ink-red hover:bg-ink-red/10"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
