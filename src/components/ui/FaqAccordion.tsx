import { ChevronDown } from "lucide-react";

export type FaqItem = { q: string; a: string };

/** Native <details> accordion: keyboard accessible and works without JavaScript. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-ink-red/15 rounded-2xl border border-ink-red/15 bg-white/60">
      {items.map((item) => (
        <details key={item.q} className="group px-5">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-medium text-ink-red marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown aria-hidden="true" className="size-6 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-5 text-lg leading-relaxed text-maroon">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
