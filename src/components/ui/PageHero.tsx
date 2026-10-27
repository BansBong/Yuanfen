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
    <section className="relative isolate overflow-hidden bg-hero-wash px-5 pt-14 pb-14 sm:pt-20 sm:pb-20">
      <span aria-hidden="true" className="orb orb-a -z-10 top-[-10%] left-[8%] size-56 bg-[#f4b8b0]/40 sm:size-96" />
      <span aria-hidden="true" className="orb orb-b -z-10 right-[10%] bottom-[-20%] size-56 bg-[#fbcf9f]/45 sm:size-96" />
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
