"use client";

import { useTranslations } from "next-intl";
import { PaperSpeckles } from "@/components/PaperSpeckles";
import { RibbonBand } from "@/components/RibbonBand";

/** Star ornament used as the step marker (the poster's four-point centre shape). */
function StarMarker({ n }: { n: number }) {
  return (
    <span className="relative grid size-14 shrink-0 place-items-center">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute inset-0 size-full fill-crimson">
        <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" />
      </svg>
      <span className="relative font-display text-sm text-white">{n}</span>
    </span>
  );
}

/** A short teaser of what Yuanfen does and how it will work. */
export function Hint() {
  const t = useTranslations("comingSoon.hint");
  return (
    <section aria-labelledby="hint-title" className="relative isolate bg-cream-center">
      <PaperSpeckles className="-z-10 opacity-70" />
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-20 sm:pt-28">
        <header className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.35em] text-crimson uppercase">{t("eyebrow")}</p>
          <h2 id="hint-title" className="mt-3 font-display text-3xl leading-snug text-ink-red sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-maroon sm:text-lg">{t("body")}</p>
        </header>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {/* thin ribbon thread joining the steps on wide screens */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent sm:block"
          />
          {(["s1", "s2", "s3"] as const).map((key, i) => (
            <li key={key} className="reveal flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
              <StarMarker n={i + 1} />
              <div>
                <h3 className="font-display text-xl text-ink-red">{t(`steps.${key}.title`)}</h3>
                <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-maroon sm:mx-auto">
                  {t(`steps.${key}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <RibbonBand id="hint" className="-mb-px" />
    </section>
  );
}
