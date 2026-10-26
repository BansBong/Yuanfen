/**
 * Brand constants. The company is "Yuanfen" (one n). The domain is
 * yuanfenbridge.com. Do not change either spelling.
 */
export const BRAND = {
  name: "Yuanfen",
  chineseName: "缘分",
  domain: "yuanfenbridge.com",
  url: "https://yuanfenbridge.com",
  tagline: "Your bridge to China, guided by fate.",
  madeIn: "Made in Guangzhou",
  year: 2026,
  launchDate: "2026-11-10",
} as const;

/** Coming Soon page: the four teaser services, in display order. */
export const TEASER_SERVICES = [
  { id: "tour", image: "/brand/card-tour.jpg" },
  { id: "shop", image: "/brand/card-shop.jpg" },
  { id: "admission", image: "/brand/card-admission.jpg" },
  { id: "medical", image: "/brand/card-medical.jpg" },
] as const;
