/**
 * Site map. Paths are the same in /en and /id. Labels live in messages/<locale>/nav.json.
 * `icon` keys map to src/components/ui/icons.tsx.
 */
export type IconName =
  | "compass"
  | "shopping-bag"
  | "hospital"
  | "graduation-cap"
  | "map"
  | "map-pin"
  | "route"
  | "users"
  | "handshake"
  | "info"
  | "message"
  | "help"
  | "lock"
  | "shield"
  | "camera"
  | "briefcase"
  | "moon"
  | "plane"
  | "building"
  | "file"
  | "send";

export const SERVICE_LINKS = [
  { key: "tour", href: "/services/tour-guiding", icon: "compass" },
  { key: "jastip", href: "/services/jasa-titip", icon: "shopping-bag" },
  { key: "medical", href: "/services/medical", icon: "hospital" },
  { key: "admission", href: "/services/admission", icon: "graduation-cap" },
] as const satisfies readonly { key: string; href: string; icon: IconName }[];

export const TRIP_LINKS = [
  { key: "trips", href: "/trips", icon: "route" },
  { key: "requestDestination", href: "/request-destination", icon: "map-pin" },
  { key: "stories", href: "/stories", icon: "camera" },
] as const satisfies readonly { key: string; href: string; icon: IconName }[];

export const PARTNER_LINKS = [
  { key: "partnership", href: "/partnership", icon: "handshake" },
  { key: "becomeGuide", href: "/become-a-guide", icon: "users" },
] as const satisfies readonly { key: string; href: string; icon: IconName }[];

export const ABOUT_LINKS = [
  { key: "howItWorks", href: "/how-it-works", icon: "route" },
  { key: "about", href: "/about", icon: "info" },
  { key: "contact", href: "/contact", icon: "message" },
] as const satisfies readonly { key: string; href: string; icon: IconName }[];

/** Every public page (without locale prefix); used by the sitemap. */
export const ALL_PATHS = [
  "",
  "/services/tour-guiding",
  "/services/jasa-titip",
  "/services/medical",
  "/services/admission",
  "/trips",
  "/stories",
  "/inquiry",
  "/request-destination",
  "/how-it-works",
  "/partnership",
  "/become-a-guide",
  "/about",
  "/contact",
  "/privacy",
] as const;
