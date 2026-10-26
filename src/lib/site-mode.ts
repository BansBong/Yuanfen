/**
 * The launch switch.
 *
 *   NEXT_PUBLIC_SITE_MODE = "coming-soon" (default) | "live"
 *
 * NEXT_PUBLIC_* values are inlined at BUILD time, so changing the variable on
 * Vercel only takes effect after a redeploy (see README, "Launch day").
 */
export type SiteMode = "coming-soon" | "live";

export const SITE_MODE: SiteMode =
  process.env.NEXT_PUBLIC_SITE_MODE === "live" ? "live" : "coming-soon";

/** Vercel preview deployments always show the full site (noindex) so the team can review it. */
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

/** True when the public should be served the full site. */
export const SERVE_FULL_SITE = SITE_MODE === "live" || IS_PREVIEW;

/** Search engines may index only the real, live production site. */
export const INDEXABLE = SITE_MODE === "live" && !IS_PREVIEW;

/** Placeholder badges and similar hints are hidden only in production + live. */
export const SHOW_PLACEHOLDER_BADGES = !(
  SITE_MODE === "live" &&
  !IS_PREVIEW &&
  process.env.NODE_ENV === "production"
);
