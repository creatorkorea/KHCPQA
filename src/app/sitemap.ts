import type { MetadataRoute } from "next";
import { getCourseSlugs, locales } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khcpqa.vercel.app";

const publicPaths = [
  "",
  "about",
  "about/greeting",
  "about/history",
  "about/instructors",
  "about/organization",
  "activities",
  "contact",
  "curriculum",
  "login",
  "partner-inquiry",
  "signup"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: path.length > 0 ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path.length > 0 ? 0.7 : 1
    }))
  );

  const courseRoutes = locales.flatMap((locale) =>
    getCourseSlugs().map((courseSlug) => ({
      url: encodeURI(`${siteUrl}/${locale}/curriculum/${courseSlug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  );

  return [...staticRoutes, ...courseRoutes];
}
