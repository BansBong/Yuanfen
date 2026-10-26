/** Deterministic red/brown paper speckles (same on server and client). */
function speckles(count: number, seed: number) {
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const colours = ["#a8645a", "#8b1a1a", "#b8837a", "#9c5b50"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    cx: rnd() * 1000,
    cy: rnd() * 1000,
    rx: 1 + rnd() * 3.2,
    ry: 0.7 + rnd() * 1.1,
    rot: rnd() * 180,
    fill: colours[Math.floor(rnd() * colours.length)],
    o: 0.22 + rnd() * 0.4,
  }));
}

const DOTS = speckles(70, 20260);

/** Fills its (relatively positioned) parent with a subtle speckled-paper texture. */
export function PaperSpeckles({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {DOTS.map((d) => (
        <ellipse
          key={d.id}
          cx={d.cx}
          cy={d.cy}
          rx={d.rx}
          ry={d.ry}
          fill={d.fill}
          opacity={d.o}
          transform={`rotate(${d.rot} ${d.cx} ${d.cy})`}
        />
      ))}
    </svg>
  );
}
