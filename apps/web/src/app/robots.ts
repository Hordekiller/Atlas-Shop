import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/profile", "/orders", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
