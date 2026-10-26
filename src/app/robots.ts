import type { MetadataRoute } from "next";
import { BRAND } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  // The Coming Soon home page may be indexed; the admin area never is.
  const rules: MetadataRoute.Robots["rules"] = { userAgent: "*", allow: "/", disallow: ["/admin", "/login"] };
  return {
    rules,
    sitemap: `${BRAND.url}/sitemap.xml`,
  };
}
