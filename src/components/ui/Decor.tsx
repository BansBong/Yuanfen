/** Decorative pieces for the v2 design: city skyline, gold-and-red ribbon wave. All purely visual (aria-hidden). */

/** Deterministic pseudo-random so server and client render identically. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function buildings(seed: number, minH: number, maxH: number, step: number, width = 1440, height = 220) {
  const rnd = rng(seed);
  const out: { x: number; y: number; w: number; h: number }[] = [];
  let x = -10;
  while (x < width + 10) {
    const w = step + rnd() * step;
    const h = minH + rnd() * (maxH - minH);
    out.push({ x, y: height - h, w, h });
    x += w + 2;
  }
  return out;
}

/** Layered city silhouette with a pagoda and a slender tower, in three depths of red. */
export function Skyline({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const fills = tone === "dark" ? ["#7a1519", "#561014", "#35070a"] : ["#e3b5a8", "#d79788", "#c9786a"];
  const layers = [buildings(7, 70, 150, 34), buildings(19, 40, 105, 40), buildings(31, 12, 55, 46)];
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none block w-full ${className}`}
    >
      {layers[0].map((b, i) => (
        <rect key={`a${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={fills[0]} />
      ))}
      {/* Canton-style tower */}
      <g fill={fills[0]}>
        <path d="M262 220 L266 24 H274 L278 220Z" />
        <circle cx="270" cy="96" r="14" />
        <circle cx="270" cy="34" r="8" />
      </g>
      {/* pagoda */}
      <g fill={fills[0]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const w = 78 - i * 11;
          const y = 190 - i * 28;
          return (
            <g key={i}>
              <path d={`M${1130 - w} ${y} L${1130 - w * 0.55} ${y - 16} H${1130 + w * 0.55} L${1130 + w} ${y}Z`} />
              <rect x={1130 - w * 0.42} y={y} width={w * 0.84} height="14" />
            </g>
          );
        })}
        <rect x="1128" y="20" width="4" height="34" />
      </g>
      {layers[1].map((b, i) => (
        <rect key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={fills[1]} />
      ))}
      {layers[2].map((b, i) => (
        <rect key={`c${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={fills[2]} />
      ))}
    </svg>
  );
}

const WAVE = "M0 26 C 200 74, 440 44, 700 44 S 1190 80, 1440 30";

/**
 * Wavy edge for a dark section. It paints the page cream above the wave and lays a gold and a red ribbon
 * along it. Use edge="top" at the start of a dark section and edge="bottom" at its end.
 */
export function WaveEdge({ edge = "top", id, fill = "#fcf3e6" }: { edge?: "top" | "bottom"; id: string; fill?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute left-0 z-0 h-12 w-full sm:h-16 lg:h-20 ${
        edge === "top" ? "top-0" : "bottom-0 rotate-180"
      }`}
    >
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" x2="1">
          <stop offset="0" stopColor="#c9953f" />
          <stop offset="0.5" stopColor="#fbe9bd" />
          <stop offset="1" stopColor="#d9a955" />
        </linearGradient>
      </defs>
      <path d={`${WAVE} V0 H0 Z`} fill={fill} />
      <path d={WAVE} fill="none" stroke="#a3201f" strokeWidth="7" transform="translate(0 9)" />
      <path d={WAVE} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="9" />
    </svg>
  );
}

/** Huge faint 缘 behind a dark hero. */
export function Glyph({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute font-bold text-[#fcf3e6]/[0.045] select-none ${className}`}
      style={{ fontFamily: '"Noto Serif SC", "Songti SC", "SimSun", serif', lineHeight: 1 }}
    >
      缘
    </span>
  );
}
