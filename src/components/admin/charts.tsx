import type { Tally } from "@/lib/admin/insights";

/** Distinguishable, on-brand chart colours (crimson first). */
export const CHART_COLORS = ["#d62828", "#7a0f12", "#e09a3a", "#c9677a", "#5b7a99", "#8a7a6a", "#b84a2e", "#a58b5d"];

/** Horizontal bars with the count and share next to each label (Google Forms style). */
export function BarList({ items, total }: { items: Tally[]; total?: number }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  const base = total ?? items.reduce((n, i) => n + i.count, 0);
  if (items.length === 0) return <p className="text-sm text-maroon/70">No data yet.</p>;
  return (
    <ul className="space-y-3">
      {items.map((i) => {
        const pct = base ? Math.round((i.count / base) * 100) : 0;
        return (
          <li key={i.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium text-ink-red">{i.label}</span>
              <span className="shrink-0 tabular-nums text-maroon/80">
                {i.count} <span className="text-maroon/60">({pct}%)</span>
              </span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-ink-red/10" role="presentation">
              <div
                className="h-full rounded-full bg-linear-to-r from-crimson to-maroon"
                style={{ width: `${(i.count / max) * 100}%`, minWidth: i.count ? "0.5rem" : 0 }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Vertical columns, e.g. responses per day. */
export function ColumnChart({ data, label }: { data: Tally[]; label: string }) {
  const W = 640;
  const H = 170;
  const pad = { l: 28, r: 8, t: 10, b: 26 };
  const max = Math.max(1, ...data.map((d) => d.count));
  const niceMax = max <= 4 ? max : Math.ceil(max / 2) * 2;
  const slot = (W - pad.l - pad.r) / Math.max(1, data.length);
  const barW = Math.max(3, slot * 0.7);
  const step = Math.ceil(data.length / 8);
  const y = (n: number) => pad.t + (H - pad.t - pad.b) * (1 - n / niceMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      {[0, niceMax / 2, niceMax].map((tick) => (
        <g key={tick}>
          <line x1={pad.l} x2={W - pad.r} y1={y(tick)} y2={y(tick)} stroke="#8b1a1a" strokeOpacity="0.12" />
          <text x={pad.l - 6} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#7a0f12" fillOpacity="0.7">
            {Math.round(tick * 10) / 10}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = pad.l + i * slot + (slot - barW) / 2;
        const h = (H - pad.t - pad.b) * (d.count / niceMax);
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={y(d.count)} width={barW} height={h} rx={2} fill="#d62828">
              <title>{`${d.label}: ${d.count}`}</title>
            </rect>
            {i % step === 0 && (
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#7a0f12" fillOpacity="0.75">
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Donut with a legend. */
export function Donut({ items, label }: { items: Tally[]; label: string }) {
  const total = items.reduce((n, i) => n + i.count, 0);
  const R = 52;
  const C = 2 * Math.PI * R;
  if (total === 0) return <p className="text-sm text-maroon/70">No data yet.</p>;
  const visible = items.filter((i) => i.count > 0);
  const segments = visible.map((i, idx) => ({
    ...i,
    len: (i.count / total) * C,
    start: visible.slice(0, idx).reduce((n, v) => n + (v.count / total) * C, 0),
  }));
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 140 140" role="img" aria-label={label} className="size-36 shrink-0 -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#8b1a1a" strokeOpacity="0.08" strokeWidth="22" />
        {segments.map((seg, idx) => (
          <circle
            key={seg.label}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={CHART_COLORS[idx % CHART_COLORS.length]}
            strokeWidth="22"
            strokeDasharray={`${seg.len} ${C - seg.len}`}
            strokeDashoffset={-seg.start}
          >
            <title>{`${seg.label}: ${seg.count}`}</title>
          </circle>
        ))}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {items
          .filter((i) => i.count > 0)
          .map((i, idx) => (
            <li key={i.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-sm" style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }} />
              <span className="font-medium text-ink-red">{i.label}</span>
              <span className="tabular-nums text-maroon/80">
                {i.count} ({Math.round((i.count / total) * 100)}%)
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-ink-red/15 bg-white p-4">
      <p className="text-sm font-medium text-maroon/80">{label}</p>
      <p className="mt-1 font-display text-3xl text-ink-red">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-maroon/60">{hint}</p>}
    </div>
  );
}
