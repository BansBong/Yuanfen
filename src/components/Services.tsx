"use client";

import Image from "next/image";
import { COPY, SERVICE_IDS, SERVICES } from "@/data/site";
import { useLang } from "./LanguageProvider";
import { RibbonCorner } from "./RibbonCorner";
import { RibbonDivider } from "./RibbonDivider";

export function Services() {
  const { lang } = useLang();
  return (
    <section id="layanan" aria-labelledby="services-title" className="relative isolate scroll-mt-4 overflow-hidden bg-cream px-5 pb-24 pt-10 sm:pb-32">
      <RibbonCorner corner="top-right" className="-z-10 hidden w-[34vw] max-w-[300px] opacity-90 lg:block lg:w-[16vw] lg:max-w-none" />
      <RibbonCorner corner="bottom-left" className="-z-10 hidden w-[40vw] max-w-[340px] opacity-90 lg:block lg:w-[18vw] lg:max-w-none" />
      <div className="mx-auto max-w-6xl">
        <header className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.35em] text-crimson uppercase">{COPY.services.eyebrow[lang]}</p>
          <h2 id="services-title" className="mt-3 font-display text-3xl leading-snug text-ink-red sm:text-4xl">
            {COPY.services.title[lang]}
          </h2>
          <RibbonDivider className="mx-auto mt-6 w-48" />
        </header>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {SERVICE_IDS.map((id, i) => {
            const s = SERVICES[id];
            return (
              <li key={id} className="reveal group" style={{ transitionDelay: `${i * 60}ms` }}>
                {/* arch-shaped window, like a moon-gate */}
                <div className="relative aspect-4/5 overflow-hidden rounded-t-[999px] rounded-b-xl shadow-[0_18px_40px_-24px_rgba(122,15,18,0.5)] ring-1 ring-ink-red/15">
                  <Image
                    src={s.image}
                    alt={s.alt[lang]}
                    fill
                    sizes="(min-width: 1024px) 22vw, 46vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cream/20 transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cream/70 to-transparent"
                  />
                </div>
                <h3 className="mt-5 text-center font-display text-lg leading-tight text-ink-red sm:text-xl">
                  {s.name[lang]}
                </h3>
                <p className="mx-auto mt-2 max-w-[26ch] text-center text-sm leading-relaxed text-maroon">
                  {s.description[lang]}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
