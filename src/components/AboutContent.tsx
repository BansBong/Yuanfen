"use client";

import Link from "next/link";
import {
  BRAND,
  COPY,
  NAV,
  SERVICE_IDS,
  SERVICES,
  instagramUrl,
  whatsappUrl,
} from "@/data/site";
import { useLang } from "./LanguageProvider";
import { PaperSpeckles } from "./PaperSpeckles";
import { RibbonBand } from "./RibbonBand";
import { RibbonCorner } from "./RibbonCorner";
import { RibbonDivider } from "./RibbonDivider";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const CJK = '"Noto Serif SC", "Songti SC", "STSong", "SimSun", serif';

export function AboutContent() {
  const { lang } = useLang();
  const t = COPY.about;

  return (
    <>
      {/* intro */}
      <section className="relative isolate overflow-hidden bg-cream-center px-5 pb-16 pt-32 text-center sm:pt-40">
        <PaperSpeckles className="-z-10 opacity-80" />
        <RibbonCorner corner="bottom-left" className="-z-10 w-[36vw] max-w-[320px] lg:w-[20vw] lg:max-w-none" />
        <RibbonCorner corner="bottom-right" className="-z-10 w-[36vw] max-w-[320px] lg:w-[20vw] lg:max-w-none" />
        <div className="anim-fade-up mx-auto max-w-2xl">
          <p className="text-xs tracking-[0.35em] text-crimson uppercase">{t.eyebrow[lang]}</p>
          <h1 className="mt-3 font-display text-4xl text-ink-red sm:text-5xl">{t.title[lang]}</h1>
          <RibbonDivider className="mx-auto mt-6 w-48" />
          <p className="mt-6 text-lg leading-relaxed text-maroon sm:text-xl">{t.lead[lang]}</p>
        </div>
      </section>
      <RibbonBand id="about-a" className="-mt-px bg-gradient-to-b from-cream-center to-cream" />

      {/* meaning of the name + the ribbon */}
      <section aria-labelledby="meaning-title" className="bg-cream px-5 pb-20 pt-6 sm:pb-28">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="reveal text-center">
            <p
              lang="zh"
              aria-hidden="true"
              className="text-[min(34vw,11rem)] leading-none text-ink-red"
              style={{ fontFamily: CJK }}
            >
              缘分
            </p>
            <p className="mt-2 font-display text-xl tracking-[0.4em] text-crimson">{t.meaningPinyin}</p>
          </div>
          <div className="reveal">
            <h2 id="meaning-title" className="font-display text-3xl text-ink-red">
              {t.meaningTitle[lang]}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-maroon sm:text-lg">{t.meaningBody[lang]}</p>
            <h3 className="mt-8 font-display text-2xl text-ink-red">{t.ribbonTitle[lang]}</h3>
            <p className="mt-3 text-base leading-relaxed text-maroon">{t.ribbonBody[lang]}</p>
          </div>
        </div>
      </section>

      {/* what we are preparing */}
      <section aria-labelledby="about-services" className="relative isolate overflow-hidden bg-cream-center px-5 py-20 sm:py-28">
        <PaperSpeckles className="-z-10 opacity-70" />
        <RibbonCorner corner="bottom-left" className="-z-10 hidden w-[34vw] max-w-[280px] opacity-90 lg:block lg:w-[16vw] lg:max-w-none" />
        <div className="mx-auto max-w-5xl">
          <h2 id="about-services" className="reveal text-center font-display text-3xl text-ink-red">
            {t.servicesTitle[lang]}
          </h2>
          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {SERVICE_IDS.map((id) => (
              <li key={id} className="reveal flex gap-4 border-t border-ink-red/20 pt-5">
                <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rotate-45 bg-crimson" />
                <div>
                  <h3 className="font-display text-xl text-ink-red">{SERVICES[id].name[lang]}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-maroon">{SERVICES[id].description[lang]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* base + contact */}
      <section className="bg-cream px-5 pb-24 pt-16 text-center">
        <div className="reveal mx-auto max-w-md">
          <h2 className="font-display text-2xl text-ink-red">{t.baseTitle[lang]}</h2>
          <p className="mt-3 text-base leading-relaxed text-maroon">{t.baseBody[lang]}</p>
          <p className="mt-10 font-display text-xl text-ink-red">{t.ctaTitle[lang]}</p>
          <div className="mt-5 flex flex-col gap-3">
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
              className="flex items-center justify-center rounded-full border border-ink-red/60 px-6 py-3.5 text-base font-medium tracking-wide text-ink-red transition-colors hover:bg-ink-red hover:text-cream"
            >
              {COPY.ctaInstagram[lang]}
            </a>
            <Link href="/" className="mt-2 text-sm text-ink-red underline-offset-4 hover:underline">
              ← {BRAND.name} · {NAV.home[lang]}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
