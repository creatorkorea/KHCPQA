import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const courseImages = {
  "베이비-마사지": "/assets/premium-course-baby-massage.png",
  "타이-마사지": "/assets/premium-course-thai-massage.png",
  "카이로프랙틱": "/assets/premium-course-chiropractic.png",
  "스웨디시": "/assets/premium-course-swedish-massage.png",
  "스파-테라피": "/assets/premium-course-spa-therapy.png",
  "브라질리언-왁싱": "/assets/premium-course-brazilian-waxing.png",
  "병원-코디네이터": "/assets/premium-course-hospital-coordinator.png"
} as const;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase URL and service role key are required.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, slug")
    .in("slug", Object.keys(courseImages));

  if (coursesError) throw coursesError;

  for (const course of courses ?? []) {
    const imageUrl = courseImages[course.slug as keyof typeof courseImages];
    const { error } = await supabase
      .from("course_localizations")
      .update({ image_url: imageUrl })
      .eq("course_id", course.id);

    if (error) throw error;
    console.log(`${course.slug}: ${imageUrl}`);
  }

  const foundSlugs = new Set((courses ?? []).map((course) => course.slug));
  const missingSlugs = Object.keys(courseImages).filter((slug) => !foundSlugs.has(slug));

  if (missingSlugs.length > 0) {
    throw new Error(`Courses not found: ${missingSlugs.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
