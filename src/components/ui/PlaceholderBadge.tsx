import { SHOW_PLACEHOLDER_BADGES } from "@/lib/site-mode";

/**
 * Marks draft/fake content so nobody ships it by accident.
 * Rendered everywhere except production + live mode. See PLACEHOLDERS.md.
 */
export function PlaceholderBadge({ what, className = "" }: { what?: string; className?: string }) {
  if (!SHOW_PLACEHOLDER_BADGES) return null;
  return (
    <span
      title={what ? `Placeholder: ${what}` : "Placeholder content"}
      className={`inline-block rounded border border-amber-600/70 bg-amber-100 px-1.5 py-0.5 align-middle font-sans text-[11px] font-semibold tracking-wide text-amber-900 uppercase ${className}`}
    >
      PLACEHOLDER{what ? `: ${what}` : ""}
    </span>
  );
}
