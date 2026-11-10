import type { MetadataRoute } from "next";
import { configuredSiteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = configuredSiteUrl();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
