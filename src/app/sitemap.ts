import type { MetadataRoute } from "next";
import { buildLanguageAlternates, locales, type Locale } from "@/i18n/config";
import { getActivityKeys } from "@/lib/content";
import { getPublishedCourses } from "@/lib/course-repository";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khcpqa.vercel.app";
const legacyPublishedLocales: Locale[] = ["ko", "en", "es"];

const publicPaths = [
  "",
  "about",
  "about/greeting",
  "about/history",
  "about/instructors",
  "about/organization",
  "activities",
  "curriculum",
  "login",
  "partner-inquiry",
  "signup"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = legacyPublishedLocales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: path.length > 0 ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path.length > 0 ? 0.7 : 1,
      alternates: { languages: buildLanguageAlternates(path, legacyPublishedLocales, siteUrl) }
    }))
  );

  const coursesByLocale = await Promise.all(locales.map(async (locale) => ({ locale, courses: await getPublishedCourses(locale) })));
  const courseLocalesBySlug = new Map<string, Locale[]>();
  for (const { courses, locale } of coursesByLocale) {
    for (const course of courses) {
      courseLocalesBySlug.set(course.slug, [...(courseLocalesBySlug.get(course.slug) ?? []), locale]);
    }
  }
  const courseRoutes = coursesByLocale.flatMap(({ courses, locale }) =>
    courses.map((course) => ({
      url: encodeURI(`${siteUrl}/${locale}/curriculum/${course.slug}`),
      lastModified: course.updatedAt ? new Date(course.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: buildLanguageAlternates(
          `curriculum/${course.slug}`,
          courseLocalesBySlug.get(course.slug) ?? [locale],
          siteUrl
        )
      }
    }))
  );

  const activityRoutes = legacyPublishedLocales.flatMap((locale) =>
    getActivityKeys().map((activityKey) => ({
      url: `${siteUrl}/${locale}/activities/${activityKey}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.55
    }))
  );

  return [...staticRoutes, ...courseRoutes, ...activityRoutes];
}
