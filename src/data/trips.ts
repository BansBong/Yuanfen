import type { Localized } from "./types";

/**
 * Curated trips (fixed, no itinerary builder; changes are handled on WhatsApp).
 *
 * PLACEHOLDER: ALL trip content here is draft. Day counts, highlights and
 * "who it's for" must be replaced with the real itineraries before launch.
 * Set `status: "available"` once a trip is bookable.
 */
export type Trip = {
  slug: string;
  status: "available" | "on-request";
  name: Localized;
  /** City names in travel order (proper nouns, not translated). */
  route: string[];
  /** PLACEHOLDER day count. */
  days: number;
  highlights: Localized[];
  forWho: Localized;
};

export const TRIPS: Trip[] = [
  {
    slug: "guangzhou-shenzhen-guilin-yangshuo",
    status: "available",
    name: {
      en: "Guangzhou + Shenzhen + Guilin + Yangshuo",
      id: "Guangzhou + Shenzhen + Guilin + Yangshuo",
    },
    route: ["Guangzhou", "Shenzhen", "Guilin", "Yangshuo"],
    days: 8,
    highlights: [
      { en: "Cantonese food and city life in Guangzhou", id: "Kuliner Kanton dan kehidupan kota di Guangzhou" },
      { en: "Shenzhen skyline and shopping", id: "Panorama dan belanja di Shenzhen" },
      { en: "Li River and karst scenery around Guilin and Yangshuo", id: "Sungai Li dan pemandangan karst di Guilin dan Yangshuo" },
    ],
    forWho: {
      en: "First-time visitors who want a mix of city and scenery.",
      id: "Untuk yang pertama kali ke Tiongkok dan ingin perpaduan kota dan alam.",
    },
  },
  {
    slug: "yunnan",
    status: "available",
    name: { en: "Yunnan: Kunming, Dali, Lijiang, Shangri-la", id: "Yunnan: Kunming, Dali, Lijiang, Shangri-la" },
    route: ["Kunming", "Dali", "Lijiang", "Shangri-la"],
    days: 9,
    highlights: [
      { en: "Old towns of Dali and Lijiang", id: "Kota tua Dali dan Lijiang" },
      { en: "Mountain and lake scenery", id: "Pemandangan gunung dan danau" },
      { en: "Highland culture in Shangri-la", id: "Budaya dataran tinggi di Shangri-la" },
    ],
    forWho: {
      en: "Nature and culture lovers who enjoy a slower pace.",
      id: "Pencinta alam dan budaya yang suka perjalanan santai.",
    },
  },
  {
    slug: "chengdu-chongqing",
    status: "available",
    name: { en: "Chengdu + Chongqing", id: "Chengdu + Chongqing" },
    route: ["Chengdu", "Chongqing"],
    days: 6,
    highlights: [
      { en: "Giant pandas in Chengdu", id: "Panda raksasa di Chengdu" },
      { en: "Sichuan and Chongqing hotpot", id: "Hotpot Sichuan dan Chongqing" },
      { en: "Hillside city views in Chongqing", id: "Pemandangan kota di perbukitan Chongqing" },
    ],
    forWho: {
      en: "Food lovers and families looking for a short trip.",
      id: "Pencinta kuliner dan keluarga yang mencari trip singkat.",
    },
  },
  {
    slug: "greater-bay-area",
    status: "available",
    name: {
      en: "Greater Bay Area: Guangzhou, Shenzhen, Hong Kong, Macau",
      id: "Greater Bay Area: Guangzhou, Shenzhen, Hong Kong, Macau",
    },
    route: ["Guangzhou", "Shenzhen", "Hong Kong", "Macau"],
    days: 6,
    highlights: [
      { en: "Four very different cities in one trip", id: "Empat kota yang sangat berbeda dalam satu trip" },
      { en: "Harbour views in Hong Kong", id: "Pemandangan pelabuhan di Hong Kong" },
      { en: "Old town streets in Macau", id: "Kota tua di Macau" },
    ],
    forWho: {
      en: "Travelers who want variety without long train rides.",
      id: "Untuk yang ingin variasi tanpa perjalanan kereta yang jauh.",
    },
  },
  {
    slug: "east-china-classic",
    status: "on-request",
    name: { en: "East China classic: Shanghai, Hangzhou, Suzhou", id: "Klasik Tiongkok Timur: Shanghai, Hangzhou, Suzhou" },
    route: ["Shanghai", "Hangzhou", "Suzhou"],
    days: 6,
    highlights: [
      { en: "Shanghai skyline and old streets", id: "Panorama dan jalan tua Shanghai" },
      { en: "West Lake in Hangzhou", id: "Danau Barat di Hangzhou" },
      { en: "Classical gardens in Suzhou", id: "Taman klasik di Suzhou" },
    ],
    forWho: {
      en: "Travelers who like history, gardens and easy train connections.",
      id: "Untuk yang suka sejarah, taman, dan perjalanan kereta yang mudah.",
    },
  },
];

export const tripBySlug = (slug: string) => TRIPS.find((t) => t.slug === slug);
