"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { saveLocaleChoice } from "@/lib/locale-cookie";

const OPTIONS: Locale[] = ["id", "en"];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("comingSoon");

  function choose(next: Locale) {
    if (next === locale) return;
    // The Coming Soon page lives at every URL, so remember the choice and reload.
    saveLocaleChoice(next);
    window.location.reload();
  }

  return (
    <div
      role="group"
      aria-label={t("langToggle")}
      className={`inline-flex overflow-hidden rounded-full border border-ink-red/40 bg-cream/85 text-xs font-medium tracking-widest backdrop-blur ${className}`}
    >
      {OPTIONS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          onClick={() => choose(l)}
          className={`min-w-11 px-3 py-2 uppercase transition-colors ${
            locale === l ? "bg-ink-red text-cream" : "text-ink-red hover:bg-ink-red/10"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
