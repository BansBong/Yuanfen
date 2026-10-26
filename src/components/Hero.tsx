"use client";

import Image from "next/image";
import { BRAND, COPY, instagramUrl, whatsappUrl } from "@/data/site";
import { useLang } from "./LanguageProvider";
import { PaperSpeckles } from "./PaperSpeckles";
import { RibbonCorner } from "./RibbonCorner";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Four-point star with concave sides: the poster's centre shape, used as an ornament. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-3 fill-crimson ${className}`}>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" />
    </svg>
  );
}

export function Hero() {
  const { lang } = useLang();
  return (
    <section className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-cream-center">
      <PaperSpeckles className="-z-10 opacity-80" />
      {/* ribbons enter from opposite corners, as on the poster */}
      <RibbonCorner corner="top-left" priority className="-z-10 w-[42vw] max-w-[460px] lg:w-[30vw] lg:max-w-none" />
      <RibbonCorner corner="bottom-right" priority className="-z-10 w-[42vw] max-w-[460px] lg:w-[30vw] lg:max-w-none" />

      <div className="anim-fade-up flex w-full max-w-xl flex-col items-center px-6 pb-32 pt-28 text-center sm:py-24 text-ink-red">
        <p className="flex items-center gap-4 font-display text-lg tracking-[0.35em] sm:text-xl">
          <span className="pl-[0.35em]">{COPY.comingSoon.left[lang]}</span>
          <Star />
          <span className="pl-[0.35em]">{COPY.comingSoon.right[lang]}</span>
        </p>

        <Image
          src="/brand/logo.png"
          alt={COPY.logoAlt[lang]}
          width={904}
          height={528}
          priority
          sizes="(min-width: 640px) 420px, 80vw"
          className="mt-4 h-auto w-[min(80vw,420px)] select-none"
        />

        <h1 className="-mt-1 pl-[0.5em] text-2xl font-light tracking-[0.5em] sm:text-3xl">
          <span className="sr-only">{BRAND.name}</span>
          <span aria-hidden="true">{BRAND.name.toUpperCase()}</span>
        </h1>
        <p className="mt-3 text-base tracking-wide text-maroon sm:text-lg">{BRAND.tagline}</p>

        <div className="mt-9 flex w-full max-w-sm flex-col gap-3">
          <a
            href={whatsappUrl(lang)}
            {...external}
            className="flex items-center justify-center rounded-full bg-crimson px-6 py-4 text-base font-medium tracking-wide text-white shadow-[0_8px_22px_-8px_rgba(122,15,18,0.6)] transition-colors hover:bg-maroon"
          >
            {COPY.ctaWhatsApp[lang]}
          </a>
          <a
            href={instagramUrl()}
            {...external}
            className="flex items-center justify-center rounded-full border border-ink-red/60 bg-cream/70 px-6 py-3.5 text-base font-medium tracking-wide text-ink-red backdrop-blur-sm transition-colors hover:bg-ink-red hover:text-cream"
          >
            {COPY.ctaInstagram[lang]}
          </a>
        </div>

        <a
          href="#layanan"
          className="mt-10 flex flex-col items-center gap-1 text-xs tracking-[0.25em] text-ink-red/80 uppercase hover:text-ink-red"
        >
          {COPY.scroll[lang]}
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
