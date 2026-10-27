import type { ReactNode } from "react";
import { PaperSpeckles } from "@/components/PaperSpeckles";
import { RibbonCorner } from "@/components/RibbonCorner";

/** Top of every inner page: eyebrow, h1, intro, optional actions. Ribbons sit in the margins on wide screens. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden px-5 pt-14 pb-14 sm:pt-20 sm:pb-20">
      <div aria-hidden="true" className="edge-fade wash-hero absolute inset-0 -z-10">
        <span className="orb orb-a top-[10%] left-[8%] size-48 bg-[#f4b8b0]/35 sm:size-80" />
        <span className="orb orb-b right-[10%] bottom-[10%] size-48 bg-[#fbcf9f]/35 sm:size-80" />
      </div>
      <PaperSpeckles className="-z-10 opacity-80" />
      <RibbonCorner corner="top-right" className="-z-10 hidden w-[18vw] opacity-90 lg:block" />
      <RibbonCorner corner="bottom-left" className="-z-10 hidden w-[16vw] opacity-90 lg:block" />
      <div className="anim-fade-up mx-auto max-w-3xl text-center">
        {eyebrow && <p className="text-sm font-semibold tracking-[0.3em] text-crimson uppercase">{eyebrow}</p>}
        <h1 className="text-gradient mt-3 font-display text-3xl leading-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-5 text-lg leading-relaxed text-maroon">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
