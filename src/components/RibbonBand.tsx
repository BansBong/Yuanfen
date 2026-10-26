/**
 * A flowing satin ribbon that runs edge to edge, used as a section divider.
 * Drawn as filled shapes with a horizontal crimson, maroon, highlight gradient.
 */
export function RibbonBand({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none block h-16 w-full sm:h-24 lg:h-28 ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-satin`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7a0f12" />
          <stop offset="0.18" stopColor="#d62828" />
          <stop offset="0.3" stopColor="#f9494f" />
          <stop offset="0.45" stopColor="#d62828" />
          <stop offset="0.62" stopColor="#7a0f12" />
          <stop offset="0.8" stopColor="#d62828" />
          <stop offset="0.92" stopColor="#f9494f" />
          <stop offset="1" stopColor="#d62828" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* thin back strand */}
      <path
        d="M0 96 C220 30 420 40 640 82 S1040 132 1240 70 S1400 36 1440 40 L1440 50 C1400 46 1290 84 1220 92 S860 150 640 94 S220 42 0 104Z"
        fill="#7a0f12"
        opacity="0.55"
      />
      {/* main ribbon */}
      <path
        d="M0 58 C200 4 380 8 600 52 S1000 112 1220 46 S1390 8 1440 14 L1440 44 C1390 40 1300 74 1210 82 S880 138 620 82 S210 40 0 92Z"
        fill={`url(#${id}-satin)`}
      />
      <path
        d="M0 58 C200 4 380 8 600 52 S1000 112 1220 46 S1390 8 1440 14 L1440 44 C1390 40 1300 74 1210 82 S880 138 620 82 S210 40 0 92Z"
        fill={`url(#${id}-shade)`}
      />
    </svg>
  );
}
