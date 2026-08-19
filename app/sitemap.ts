import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  return ["", "/inicio", "/privacidade", "/termos"].map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index < 2 ? ("weekly" as const) : ("monthly" as const),
    priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.4,
  }));
}
