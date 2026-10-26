"use client";

import { COPY, type Lang } from "@/data/site";
import { useLang } from "./LanguageProvider";

const OPTIONS: Lang[] = ["id", "en"];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label={COPY.langToggle[lang]}
      className={`inline-flex overflow-hidden rounded-full border border-ink-red/40 bg-cream/85 text-xs font-medium tracking-widest backdrop-blur ${className}`}
    >
      {OPTIONS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`min-w-11 px-3 py-2 uppercase transition-colors ${
            lang === l ? "bg-ink-red text-cream" : "text-ink-red hover:bg-ink-red/10"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
