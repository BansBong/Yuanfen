import type { ReactNode } from "react";
import { Glyph, WaveEdge } from "./Decor";

type Tone = "cream" | "paper" | "peach" | "blush" | "rose" | "sky" | "dark";

/** Background band behind a section (v2 design). "dark" is the deep maroon band with wavy ribbon edges. */
const BAND: Partial<Record<Tone, string>> = {
  peach: "band-peach",
  blush: "band-blush",
  dark: "tone-dark bg-deep",
};

/** Page section. Tones only change the background; "dark" also swaps the text palette. */
export function Section({
  id,
  tone = "cream",
  className = "",
  innerClassName = "max-w-6xl",
  labelledBy,
  above,
  below,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
  /** Colour of the section above / below a "dark" section, so its wavy edge blends in (default: page cream). */
  above?: string;
  below?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative isolate scroll-mt-24 overflow-hidden px-5 py-16 sm:py-24 ${BAND[tone] ?? ""} ${
        tone === "dark" ? "!py-24 sm:!py-32" : ""
      } ${className}`}
    >
      {tone === "dark" && (
        <>
          <Glyph className="top-[8%] -right-[6%] -z-10 text-[34rem] sm:text-[44rem]" />
          <WaveEdge edge="top" fill={above} id={`w-top-${id ?? labelledBy ?? "s"}`} />
          <WaveEdge edge="bottom" fill={below} id={`w-bot-${id ?? labelledBy ?? "s"}`} />
        </>
      )}
      <div className={`relative mx-auto ${innerClassName}`}>{children}</div>
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
        className={`text-gradient mt-3 font-display leading-[1.1] ${
          Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {title}
      </Tag>
      {text && <p className="mt-4 text-base leading-relaxed text-maroon sm:text-lg">{text}</p>}
    </header>
  );
}
