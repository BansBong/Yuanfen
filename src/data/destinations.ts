import type { Localized } from "./types";

/**
 * Tour Guiding destinations.
 *
 * To open a destination for booking, change its `status` to "available".
 * Every destination starts as "on-request".
 *
 * PLACEHOLDER: the one-line hooks below are draft copy that needs a human review.
 * Photos are placeholders too; add real images under /public/destinations/ and
 * set `image` when you have them.
 */
export type DestinationStatus = "available" | "on-request";

export type Region = { id: string; name: Localized };

export type Destination = {
  id: string;
  region: Region["id"];
  name: string;
  hook: Localized;
  status: DestinationStatus;
  /** Optional real photo path (under /public). Falls back to a placeholder tile. */
  image?: string;
};

export const REGIONS: Region[] = [
  { id: "gba", name: { en: "Guangdong & Greater Bay Area", id: "Guangdong & Greater Bay Area" } },
  { id: "yunnan", name: { en: "Yunnan", id: "Yunnan" } },
  { id: "guilin", name: { en: "Guilin & Yangshuo", id: "Guilin & Yangshuo" } },
  { id: "sichuan", name: { en: "Sichuan & Chongqing", id: "Sichuan & Chongqing" } },
  { id: "north-east", name: { en: "North & East China", id: "Tiongkok Utara & Timur" } },
  { id: "central", name: { en: "Central China", id: "Tiongkok Tengah" } },
];

export const DESTINATIONS: Destination[] = [
  {
    id: "guangzhou",
    region: "gba",
    name: "Guangzhou",
    hook: { en: "Dim sum, Cantonese food and the Pearl River.", id: "Dim sum, kuliner Kanton, dan Sungai Mutiara." },
    status: "on-request",
  },
  {
    id: "shenzhen",
    region: "gba",
    name: "Shenzhen",
    hook: { en: "Modern skyline, tech and electronics markets.", id: "Gedung pencakar langit, teknologi, dan pasar elektronik." },
    status: "on-request",
  },
  {
    id: "hong-kong",
    region: "gba",
    name: "Hong Kong",
    hook: { en: "Harbour views, trams and street food.", id: "Pemandangan pelabuhan, trem, dan jajanan jalanan." },
    status: "on-request",
  },
  {
    id: "macau",
    region: "gba",
    name: "Macau",
    hook: { en: "Old town streets with Portuguese-Chinese heritage.", id: "Kota tua bernuansa Portugis-Tionghoa." },
    status: "on-request",
  },
  {
    id: "kunming",
    region: "yunnan",
    name: "Kunming",
    hook: { en: "The mild-weather 'Spring City' and gateway to Yunnan.", id: "'Kota Musim Semi' berhawa sejuk, gerbang menuju Yunnan." },
    status: "on-request",
  },
  {
    id: "dali",
    region: "yunnan",
    name: "Dali",
    hook: { en: "Old town, Erhai Lake and mountain views.", id: "Kota tua, Danau Erhai, dan pemandangan pegunungan." },
    status: "on-request",
  },
  {
    id: "lijiang",
    region: "yunnan",
    name: "Lijiang",
    hook: { en: "UNESCO old town below Jade Dragon Snow Mountain.", id: "Kota tua UNESCO di kaki Gunung Salju Naga Giok." },
    status: "on-request",
  },
  {
    id: "shangri-la",
    region: "yunnan",
    name: "Shangri-la",
    hook: { en: "Tibetan-style monasteries and highland scenery.", id: "Biara bergaya Tibet dan lanskap dataran tinggi." },
    status: "on-request",
  },
  {
    id: "guilin",
    region: "guilin",
    name: "Guilin",
    hook: { en: "Limestone peaks and the Li River.", id: "Bukit kapur dan Sungai Li." },
    status: "on-request",
  },
  {
    id: "yangshuo",
    region: "guilin",
    name: "Yangshuo",
    hook: { en: "Karst scenery, cycling and river cruises.", id: "Pemandangan karst, bersepeda, dan susur sungai." },
    status: "on-request",
  },
  {
    id: "chengdu",
    region: "sichuan",
    name: "Chengdu",
    hook: { en: "Giant pandas and spicy Sichuan food.", id: "Panda raksasa dan kuliner pedas Sichuan." },
    status: "on-request",
  },
  {
    id: "chongqing",
    region: "sichuan",
    name: "Chongqing",
    hook: { en: "Hotpot and a city built on hills.", id: "Hotpot dan kota yang dibangun di atas perbukitan." },
    status: "on-request",
  },
  {
    id: "beijing",
    region: "north-east",
    name: "Beijing",
    hook: { en: "The Forbidden City and the Great Wall.", id: "Kota Terlarang dan Tembok Besar." },
    status: "on-request",
  },
  {
    id: "shanghai",
    region: "north-east",
    name: "Shanghai",
    hook: { en: "The Bund skyline and modern city life.", id: "Panorama The Bund dan kehidupan kota modern." },
    status: "on-request",
  },
  {
    id: "wuhan",
    region: "central",
    name: "Wuhan",
    hook: { en: "Yangtze River views and famous hot dry noodles.", id: "Pemandangan Sungai Yangtze dan mi kering panas yang terkenal." },
    status: "on-request",
  },
];

export const destinationById = (id: string) => DESTINATIONS.find((d) => d.id === id);
