import type { ReactNode } from "react";
import { Glyph, Skyline } from "./Decor";

/** Top of every inner page: deep maroon band with a faint 缘, eyebrow, serif h1, intro, optional actions, and a low skyline. */
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
    <section className="tone-dark bg-deep relative isolate overflow-hidden px-5 pt-16 pb-28 sm:pt-24 sm:pb-36">
      <Glyph className="-top-[12%] -right-[4%] -z-10 text-[26rem] sm:text-[40rem]" />
      <span aria-hidden="true" className="absolute -top-24 left-[8%] -z-10 size-72 rounded-full bg-[#b3262a]/25 blur-[90px]" />
      <div className="anim-fade-up mx-auto max-w-3xl text-center">
        {eyebrow && <p className="text-sm font-semibold tracking-[0.3em] text-crimson uppercase">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink-red sm:text-6xl">{title}</h1>
        {intro && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-maroon">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10">
        <span className="block h-1.5 w-full bg-gradient-to-r from-[#c9953f] via-[#fbe9bd] to-[#d9a955]" />
        <Skyline className="h-14 sm:h-24" />
      </div>
    </section>
  );
}
