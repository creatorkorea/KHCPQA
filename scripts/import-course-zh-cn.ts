import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import {
  buildZhCnStructuredContent,
  courseZhCnTranslations
} from "../src/lib/course-translations-zh-cn";

const applyChanges = process.argv.includes("--apply");
const inspectSource = process.argv.includes("--inspect");
const publishTranslations = process.argv.includes("--publish");
const verifyOnly = process.argv.includes("--verify");

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function loadCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id, slug, sort_order,
      course_localizations(
        id, locale, title, summary, overview, duration, curriculum_items,
        recommended_for, certification_note, schedule_tracks, content_sections,
        image_url, pdf_url, pdf_file_name, status, source_updated_at,
        translated_from_updated_at, updated_at
      )
    `)
    .order("sort_order", { ascending: true });

  if (error || !data) throw new Error(error?.message ?? "Failed to load courses.");
  return data;
}

async function run() {
  const courses = await loadCourses();

  if (publishTranslations) {
    const zhRows = courses.flatMap((course) => {
      const source = course.course_localizations.find((item) => item.locale === "ko");
      const localization = course.course_localizations.find((item) => item.locale === "zh-CN");
      return localization ? [{ course, localization, source }] : [];
    });

    if (zhRows.length !== Object.keys(courseZhCnTranslations).length) {
      throw new Error(`Expected 18 zh-CN rows before publishing, found ${zhRows.length}.`);
    }

    for (const { course, localization, source } of zhRows) {
      if (!source) throw new Error(`Missing Korean source: ${course.slug}`);
      if (!["translated", "reviewed", "published"].includes(localization.status)) {
        throw new Error(`Cannot publish zh-CN/${course.slug} from status ${localization.status}.`);
      }
      if (localization.translated_from_updated_at !== source.updated_at) {
        throw new Error(`Stale Simplified Chinese translation: ${course.slug}`);
      }
    }

    const { data: reviewers, error: reviewerError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("role", "super_admin")
      .eq("status", "active")
      .limit(1);

    if (reviewerError || !reviewers?.[0]) {
      throw new Error(reviewerError?.message ?? "No active super administrator was found.");
    }

    const now = new Date().toISOString();
    const { data: publishedRows, error: publishError } = await supabase
      .from("course_localizations")
      .update({
        reviewed_at: now,
        reviewed_by: reviewers[0].id,
        status: "published"
      })
      .eq("locale", "zh-CN")
      .select("course_id, status, reviewed_at, reviewed_by");

    if (publishError) throw new Error(`Failed to publish zh-CN courses: ${publishError.message}`);
    if (publishedRows?.length !== zhRows.length) {
      throw new Error(`Expected to publish ${zhRows.length} rows, updated ${publishedRows?.length ?? 0}.`);
    }

    console.log(`Published 18 zh-CN courses with reviewer ${reviewers[0].email}.`);
    return;
  }

  if (verifyOnly) {
    const { data: rows, error } = await supabase
      .from("course_localizations")
      .select(`
        course_id, locale, status, title, summary, overview, duration,
        curriculum_items, recommended_for, certification_note,
        schedule_tracks, content_sections, seo_title, seo_description,
        translated_from_updated_at, reviewed_at, reviewed_by
      `)
      .eq("locale", "zh-CN");

    if (error || !rows) throw new Error(error?.message ?? "Failed to verify zh-CN rows.");
    if (rows.length !== Object.keys(courseZhCnTranslations).length) {
      throw new Error(`Expected 18 zh-CN rows, found ${rows.length}.`);
    }

    const courseIds = new Set(courses.map((course) => course.id));
    for (const row of rows) {
      if (!courseIds.has(row.course_id)) throw new Error(`Unknown course_id: ${row.course_id}`);
      if (row.status !== "published") throw new Error(`Unexpected zh-CN status: ${row.status}`);
      if (!row.translated_from_updated_at) throw new Error(`Missing source timestamp: ${row.title}`);
      if (!row.reviewed_at || !row.reviewed_by) throw new Error(`Missing review metadata: ${row.title}`);
      if (/[가-힣]/.test(JSON.stringify(row))) throw new Error(`Korean remains in zh-CN row: ${row.title}`);
    }

    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required for public verification.");
    const publicClient = createClient(url!, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data: publicRows, error: publicError } = await publicClient
      .from("course_localizations")
      .select("course_id, locale, status")
      .eq("locale", "zh-CN")
      .eq("status", "published");

    if (publicError) throw new Error(`Public zh-CN verification failed: ${publicError.message}`);
    if (publicRows?.length !== rows.length) {
      throw new Error(`Expected 18 public zh-CN rows, found ${publicRows?.length ?? 0}.`);
    }

    console.log(`Verified 18 public zh-CN rows with review metadata and no Korean text.`);
    return;
  }

  if (inspectSource) {
    const sources = courses.map((course) => ({
      slug: course.slug,
      source: course.course_localizations.find((item) => item.locale === "ko") ?? null
    }));
    console.log(JSON.stringify(sources, null, 2));
    return;
  }

  let inserted = 0;
  let skipped = 0;

  for (const course of courses) {
    const source = course.course_localizations.find((item) => item.locale === "ko");
    const existingLocalization = course.course_localizations.find((item) => item.locale === "zh-CN");
    const translation = courseZhCnTranslations[course.slug];

    if (!source) throw new Error(`Missing Korean source: ${course.slug}`);
    if (!translation) throw new Error(`Missing Simplified Chinese translation: ${course.slug}`);
    if (existingLocalization) {
      skipped += 1;
      console.log(`SKIP existing zh-CN: ${course.slug}`);
      continue;
    }

    const { contentSections, scheduleTracks } = buildZhCnStructuredContent(source, translation);
    const localizedContent = {
      certification_note: translation.certificationNote || null,
      content_sections: contentSections,
      curriculum_items: translation.curriculumItems,
      duration: translation.duration,
      image_alt: translation.imageAlt,
      overview: translation.overview,
      recommended_for: translation.recommendedFor,
      schedule_tracks: scheduleTracks,
      seo_description: translation.seoDescription,
      seo_title: translation.seoTitle,
      summary: translation.summary,
      title: translation.title
    };

    if (/[가-힣]/.test(JSON.stringify(localizedContent))) {
      throw new Error(`Untranslated Korean remains in zh-CN/${course.slug}.`);
    }

    if (!applyChanges) {
      console.log(`DRY RUN insert zh-CN: ${course.slug}`);
      continue;
    }

    const { error } = await supabase.from("course_localizations").insert({
      ...localizedContent,
      content_schema_version: 2,
      course_id: course.id,
      image_url: source.image_url,
      locale: "zh-CN",
      pdf_file_name: source.pdf_file_name,
      pdf_url: source.pdf_url,
      reviewed_at: null,
      reviewed_by: null,
      source_locale: "ko",
      source_updated_at: source.updated_at,
      status: "translated",
      translated_from_updated_at: source.updated_at
    });

    if (error) throw new Error(`Failed to insert zh-CN/${course.slug}: ${error.message}`);
    inserted += 1;
  }

  if (applyChanges) {
    const { data: insertedRows, error: verificationError } = await supabase
      .from("course_localizations")
      .select("course_id, locale, status, title, translated_from_updated_at")
      .eq("locale", "zh-CN");

    if (verificationError) throw new Error(`Failed to verify zh-CN rows: ${verificationError.message}`);
    console.log(`Verified zh-CN rows: ${insertedRows?.length ?? 0}`);
  }

  console.log(`${applyChanges ? "Inserted" : "Ready"}: ${inserted || courses.length - skipped}, skipped: ${skipped}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
