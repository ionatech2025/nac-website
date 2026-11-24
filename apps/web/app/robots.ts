import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/share-links";

/** Robots rules: keep admin, login, complaints and APIs out of the index (E15-02). */
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/login", "/complaints", "/api/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
