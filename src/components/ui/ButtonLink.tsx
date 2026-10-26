import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { IconName } from "@/data/nav";
import { Icon } from "./icons";

type Variant = "primary" | "secondary" | "dark";

const BASE =
  "inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 py-3.5 text-lg font-medium tracking-wide transition-colors";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-crimson text-white shadow-[0_8px_22px_-8px_rgba(122,15,18,0.6)] hover:bg-maroon",
  secondary: "border-2 border-ink-red/70 bg-cream/80 text-ink-red hover:bg-ink-red hover:text-cream",
  dark: "bg-ink-red text-cream hover:bg-maroon",
};

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

/** Big, high-contrast link-button. Internal links get the locale prefix automatically. */
export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  icon,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}) {
  const cls = buttonClass(variant, className);
  const content = (
    <>
      {icon && <Icon name={icon} className="size-6 shrink-0" />}
      <span>{children}</span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
