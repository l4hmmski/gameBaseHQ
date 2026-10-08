
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/library",
        "/wishlist",
        "/stats",
        "/profile",
        "/login",
      ],
    },

    sitemap:
      "https://gamebasehq.app/sitemap.xml",
  };
}
