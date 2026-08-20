import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { getCourses } from "../src/lib/content";

const migrationLocales = ["ko", "en", "es"] as const;

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function splitAudience(value: string) {
  return value
    .split(/,|및|또는/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function migrateCourses() {
  let localizationCount = 0;

  for (const locale of migrationLocales) {
    const courses = getCourses(locale);

    for (const [sortOrder, course] of courses.entries()) {
      const { data: savedCourse, error: courseError } = await supabase
        .from("courses")
        .upsert({
          category_key: course.categoryKey,
          is_active: true,
          slug: course.slug,
          sort_order: sortOrder
        }, { onConflict: "slug" })
        .select("id")
        .single();

      if (courseError || !savedCourse) {
        throw new Error(`Failed to migrate course ${course.slug}: ${courseError?.message ?? "missing id"}`);
      }

      const { error: localizationError } = await supabase
        .from("course_localizations")
        .upsert({
          certification_note: course.certificationNote || null,
          course_id: savedCourse.id,
          curriculum_items: course.curriculum,
          duration: course.durationHighlights?.[0] || null,
          image_url: course.imageUrl || null,
          locale,
          overview: course.overview || null,
          recommended_for: splitAudience(course.audience),
          status: "published",
          summary: course.summary || null,
          title: course.title
        }, { onConflict: "course_id,locale" });

      if (localizationError) {
        throw new Error(`Failed to migrate ${locale}/${course.slug}: ${localizationError.message}`);
      }

      localizationCount += 1;
    }
  }

  console.log(`Migrated ${localizationCount} localized course records.`);
}

migrateCourses().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
