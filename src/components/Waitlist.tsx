"use client";

import { COPY } from "@/data/site";
import { useLang } from "./LanguageProvider";
import { PaperSpeckles } from "./PaperSpeckles";
import { RibbonCorner } from "./RibbonCorner";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  const { lang } = useLang();
  return (
    <section aria-label={COPY.waitlist.title[lang]} className="relative isolate overflow-hidden bg-cream-center px-5 py-20">
      <PaperSpeckles className="-z-10 opacity-70" />
      <RibbonCorner corner="top-left" className="-z-10 hidden w-[30vw] max-w-[260px] opacity-90 lg:block lg:w-[14vw] lg:max-w-none" />
      <RibbonCorner corner="bottom-right" className="-z-10 hidden w-[30vw] max-w-[260px] opacity-90 lg:block lg:w-[14vw] lg:max-w-none" />
      <div className="reveal mx-auto max-w-md text-center">
        <p className="mb-6 text-sm leading-relaxed text-maroon">{COPY.intro[lang]}</p>
        <WaitlistForm />
      </div>
    </section>
  );
}
