import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/data/nav";
import { Link } from "@/i18n/navigation";

/** Big service tile: icon + title + one line, always with a visible text label. */
export function ServiceCard({
  href,
  icon,
  title,
  line,
  cta,
}: {
  href: string;
  icon: IconName;
  title: string;
  line: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-3xl border border-ink-red/15 bg-white/70 p-6 shadow-[0_18px_40px_-28px_rgba(122,15,18,0.5)] transition hover:-translate-y-1 hover:border-ink-red/40 hover:shadow-[0_22px_44px_-24px_rgba(122,15,18,0.55)]"
    >
      <span className="grid size-16 place-items-center rounded-2xl bg-crimson/10 text-crimson">
        <Icon name={icon} className="size-9" />
      </span>
      <h3 className="mt-5 font-display text-xl leading-tight text-ink-red">{title}</h3>
      <p className="mt-2 flex-1 text-base leading-relaxed text-maroon">{line}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-crimson group-hover:text-maroon">
        {cta}
        <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
