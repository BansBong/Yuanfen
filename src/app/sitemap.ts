import type { MetadataRoute } from "next";
import { BRAND } from "@/data/site";

// Add new pages here as they are built (e.g. /services, /contact).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BRAND.url, changeFrequency: "monthly", priority: 1 },
    { url: `${BRAND.url}/about`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
