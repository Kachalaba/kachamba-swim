import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

const lastSignificantUpdate = new Date("2026-07-22T20:30:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: lastSignificantUpdate,
    },
    {
      url: `${siteUrl}/analysis`,
      lastModified: lastSignificantUpdate,
    },
  ];
}
