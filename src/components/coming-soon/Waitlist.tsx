"use client";

import { useTranslations } from "next-intl";
import { PaperSpeckles } from "@/components/PaperSpeckles";
import { RibbonCorner } from "@/components/RibbonCorner";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  const t = useTranslations("comingSoon");
  return (
    <section aria-label={t("waitlist.title")} className="relative isolate overflow-hidden bg-cream-center px-5 py-20">
      <PaperSpeckles className="-z-10 opacity-70" />
      <RibbonCorner corner="top-left" className="-z-10 hidden w-[30vw] max-w-[260px] opacity-90 lg:block lg:w-[14vw] lg:max-w-none" />
      <RibbonCorner corner="bottom-right" className="-z-10 hidden w-[30vw] max-w-[260px] opacity-90 lg:block lg:w-[14vw] lg:max-w-none" />
      <div className="reveal mx-auto max-w-md text-center">
        <p className="mb-6 text-sm leading-relaxed text-maroon">{t("intro")}</p>
        <WaitlistForm />
      </div>
    </section>
  );
}
