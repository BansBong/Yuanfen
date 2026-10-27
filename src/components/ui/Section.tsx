import type { ReactNode } from "react";
import { PaperSpeckles } from "@/components/PaperSpeckles";

type Tone = "cream" | "paper" | "peach" | "blush" | "rose" | "sky";

/** Which glow (if any) sits behind a section. Sections themselves are transparent. */
const GLOW: Partial<Record<Tone, string>> = {
  peach: "wash-peach",
  blush: "wash-blush",
  rose: "wash-rose",
  sky: "wash-sky",
};

/** Page section. "paper" is the slightly brighter, speckled background used on the poster. */
export function Section({
  id,
  tone = "cream",
  className = "",
  innerClassName = "max-w-6xl",
  labelledBy,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative isolate scroll-mt-24 overflow-hidden px-5 py-16 sm:py-24 ${className}`}
    >
      {GLOW[tone] && <div aria-hidden="true" className={`edge-fade absolute inset-0 -z-10 ${GLOW[tone]}`} />}
      {tone !== "cream" && <PaperSpeckles className="-z-10 opacity-60" />}
      <div className={`mx-auto ${innerClassName}`}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  align = "center",
  as: Tag = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <header className={`reveal max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="text-sm font-semibold tracking-[0.3em] text-crimson uppercase">{eyebrow}</p>}
      <Tag
        id={id}
        className={`text-gradient mt-3 font-display leading-snug ${
          Tag === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {title}
      </Tag>
      {text && <p className="mt-4 text-base leading-relaxed text-maroon sm:text-lg">{text}</p>}
    </header>
  );
}
