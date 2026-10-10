import type { MetadataRoute } from "next";

const routes = [
  "",
  "live",
  "matches",
  "predictions",
  "sports",
  "leagues",
  "leaderboard",
  "news",
  "about",
  "contact",
  "privacy",
  "terms"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://magxtv.click/${route}`,
    lastModified: new Date()
  }));
}
