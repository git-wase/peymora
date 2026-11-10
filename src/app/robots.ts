import type { MetadataRoute } from "next";
import { configuredSiteUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/confirm", "/unsubscribe", "/subscribe"],
    },
    sitemap: `${configuredSiteUrl()}/sitemap.xml`,
  };
}
