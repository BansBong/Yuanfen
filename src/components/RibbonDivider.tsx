/** A thin satin-ribbon flourish, echoing the loop in the logo. */
export function RibbonDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id="yf-divider" x1="0" x2="1">
          <stop offset="0" stopColor="#d62828" stopOpacity="0" />
          <stop offset="0.25" stopColor="#d62828" />
          <stop offset="0.5" stopColor="#7a0f12" />
          <stop offset="0.75" stopColor="#d62828" />
          <stop offset="1" stopColor="#d62828" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 12 C30 12 45 2 70 8 C95 14 85 22 105 15 C115 11 118 12 120 12 C122 12 125 11 135 15 C155 22 145 14 170 8 C195 2 210 12 240 12"
        fill="none"
        stroke="url(#yf-divider)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
