
import type { MetadataRoute } from "next";

const siteUrl = "https://gamebasehq.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page}`,
    changeFrequency:
      page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.5,
  }));
}
