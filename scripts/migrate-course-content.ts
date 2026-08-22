import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { getCourses } from "../src/lib/content";
import { originalCourseDetails } from "../src/lib/original-course-details";
import type { CourseContentSection, CourseScheduleTrack, CourseSectionType, CourseTemplateKey } from "../src/lib/course-model";

const migrationLocales = ["ko", "en", "es"] as const;
const refreshKoStructure = process.argv.includes("--refresh-ko-structure");
const inspectKoStructure = process.argv.includes("--inspect-ko-structure");

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

const supabase = url && serviceRoleKey
  ? createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

function splitAudience(value: string) {
  return value
    .split(/,|및|또는/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getTemplateKey(course: ReturnType<typeof getCourses>[number]): CourseTemplateKey {
  if (course.categoryKey === "certification") return "certification";
  if (course.slug === "취업전문과정") return "career";
  if (course.slug === "창업전문과정") return "startup";
  if (course.slug.includes("주말")) return "hobby";
  return "practical";
}

function getSectionType(title: string, variant?: "cards" | "chips" | "income" | "schedule"): CourseSectionType {
  if (variant === "chips") return "practice";
  if (variant === "income" || variant === "cards") return "programs";
  if (/시험|exam|examen/i.test(title)) return "exam";
  if (/실무|테크닉|기술|practice|técnic/i.test(title)) return "practice";
  if (/특징|방식|method|método/i.test(title)) return "learning_method";
  if (/이론|피부|theory|teor/i.test(title)) return "theory";
  if (/위생|주의|태도|precaution|higiene/i.test(title)) return "precautions";
  if (/진출|취업|진로|career|empleo/i.test(title)) return "careers";
  if (/지원|특전|benefit|apoyo/i.test(title)) return "benefits";
  if (/목표|goal|objetivo/i.test(title)) return "goals";
  return "programs";
}

export function mapStructuredCourseContent(course: ReturnType<typeof getCourses>[number]) {
  const detailSections = course.detailSections ?? [];
  const scheduleSections = detailSections.filter((section) => section.variant === "schedule");
  const scheduleTracks: CourseScheduleTrack[] = scheduleSections.map((section, trackIndex) => {
    const times = section.items
      .filter((item) => /교육시간|class time|horario/i.test(item))
      .flatMap((item) => item.split(":").slice(1).join(":").split(",").map((time) => time.trim()).filter(Boolean));
    const items = section.items
      .filter((item) => !/교육시간|class time|horario/i.test(item))
      .map((item, weekIndex) => {
        const [label, ...rest] = item.split(":");
        const title = rest.join(":").trim();
        return {
          items: title ? [title] : [item],
          label: rest.length ? label.trim() : `${weekIndex + 1}`,
          period: "",
          title: ""
        };
      });
    return {
      duration: course.durationHighlights?.[trackIndex] ?? "",
      id: `track-${trackIndex + 1}`,
      items,
      label: section.title,
      times
    };
  });
  const contentSections: CourseContentSection[] = detailSections
    .filter((section) => section.variant !== "schedule")
    .map((section, sectionIndex) => ({
      body: "",
      id: `section-${sectionIndex + 1}`,
      images: [],
      items: section.items,
      title: section.title,
      type: getSectionType(section.title, section.variant)
    }));

  return { contentSections, scheduleTracks };
}

function cleanSourceLine(value: string) {
  return value.replace(/^[-*]\s*/, "").replace(/\s+/g, " ").trim();
}

export function parseOriginalCurriculumGroups(sourceUrl: string): CourseScheduleTrack[] {
  const sourceId = sourceUrl.match(/curriculum(\d+)\.asp/i)?.[1];
  const detail = sourceId ? originalCourseDetails[sourceId] : null;
  if (!detail) return [];

  if (sourceId === "17") {
    const text = detail.sections.map((section) => section.text).join("\n");
    return [
      { label: "자세체형 근교정", start: text.indexOf("자세체형 근교정"), end: text.indexOf("두개천골 족부임상 교정") },
      { label: "두개천골 족부임상 교정", start: text.indexOf("두개천골 족부임상 교정"), end: text.length }
    ].flatMap((definition, trackIndex) => {
      if (definition.start < 0) return [];
      const segment = text.slice(definition.start, definition.end);
      const time = segment.match(/\[교육시간\s*:\s*([^\]]+)\]/)?.[1]?.trim() ?? "";
      const duration = segment.match(/\n(\d+주)\n/)?.[1] ?? "";
      const curriculum = segment.split("\n").map((line) => line.trim());
      const start = curriculum.findIndex((line) => /^\d+주$/.test(line));
      const end = curriculum.findIndex((line, index) => index > start && /^※\s*본 커리큘럼/.test(line));
      const topics = curriculum
        .slice(start + 1, end > start ? end : undefined)
        .filter((line) => /^-\s*/.test(line))
        .map(cleanSourceLine);
      if (!topics.length) return [];
      return [{
        duration,
        id: `original-${sourceId}-${trackIndex + 1}`,
        items: topics.map((title) => ({ items: [], label: "", period: "", title })),
        label: definition.label,
        times: time ? [time] : []
      }];
    });
  }

  const sourceText = detail.sections
    .map((section) => section.text)
    .find((text) => /※\s*(?:정규|속성|실기반\s*속성)/.test(text));
  if (!sourceText) return [];

  const groups: CourseScheduleTrack[] = [];
  let currentGroup: CourseScheduleTrack | null = null;
  let currentPeriod = "";
  let currentLabel = "";
  let currentContent: string[] = [];

  const flushItem = () => {
    if (!currentGroup || (!currentLabel && currentContent.length === 0)) return;
    const [title = "", ...items] = currentContent.map(cleanSourceLine).filter(Boolean);
    currentGroup.items.push({ items, label: currentLabel, period: currentPeriod, title });
    currentLabel = "";
    currentContent = [];
  };

  const flushGroup = () => {
    flushItem();
    if (!currentGroup || currentGroup.items.length === 0) return;
    const periods = Array.from(new Set(currentGroup.items.map((item) => item.period).filter(Boolean)));
    currentGroup.duration = periods.join(" · ");
    groups.push(currentGroup);
    currentGroup = null;
  };

  for (const rawLine of sourceText.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const marker = line.match(/^※\s*(정규|속성|실기반\s*속성)(?:\s*코스)?$/);
    if (marker) {
      flushGroup();
      const label = marker[1].replace(/\s+/g, " ");
      currentGroup = { duration: "", id: `original-${sourceId}-${groups.length + 1}`, items: [], label: `${label} 코스`, times: [] };
      currentPeriod = "";
      continue;
    }
    if (!currentGroup || /^※\s*본 커리큘럼/.test(line)) continue;
    const time = line.match(/^\[교육시간\s*:\s*([^\]]+)\]$/)?.[1];
    if (time) {
      currentGroup.times = [time.trim()];
      continue;
    }
    if (/^\d+개월$/.test(line)) {
      flushItem();
      currentPeriod = line;
      continue;
    }
    if (/^(?:\d+(?:~\d+)?주차|\d+)$/.test(line)) {
      flushItem();
      currentLabel = /^\d+$/.test(line) ? `${line}단계` : line;
      continue;
    }
    if (currentLabel) currentContent.push(line);
  }
  flushGroup();
  return groups;
}

async function migrateCourses() {
  if (!supabase) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }
  let localizationCount = 0;

  for (const locale of migrationLocales) {
    const courses = getCourses(locale);

    for (const [sortOrder, course] of courses.entries()) {
      const structuredContent = mapStructuredCourseContent(course);
      const originalSchedule = locale === "ko" ? parseOriginalCurriculumGroups(course.source) : [];
      const migratedSchedule = originalSchedule.length ? originalSchedule : structuredContent.scheduleTracks;
      const { data: savedCourse, error: courseError } = await supabase
        .from("courses")
        .upsert({
          category_key: course.categoryKey,
          is_active: true,
          slug: course.slug,
          sort_order: sortOrder,
          template_key: getTemplateKey(course)
        }, { onConflict: "slug" })
        .select("id")
        .single();

      if (courseError || !savedCourse) {
        throw new Error(`Failed to migrate course ${course.slug}: ${courseError?.message ?? "missing id"}`);
      }

      const { data: existingLocalization, error: existingError } = await supabase
        .from("course_localizations")
        .select("title, summary, overview, duration, curriculum_items, recommended_for, certification_note, image_url, status, schedule_tracks, content_sections")
        .eq("course_id", savedCourse.id)
        .eq("locale", locale)
        .maybeSingle();

      if (existingError) {
        throw new Error(`Failed to inspect ${locale}/${course.slug}: ${existingError.message}`);
      }

      const existingSchedule = Array.isArray(existingLocalization?.schedule_tracks)
        ? existingLocalization.schedule_tracks
        : [];
      const existingSections = Array.isArray(existingLocalization?.content_sections)
        ? existingLocalization.content_sections
        : [];

      const { error: localizationError } = await supabase
        .from("course_localizations")
        .upsert({
          certification_note: existingLocalization?.certification_note ?? (course.certificationNote || null),
          content_schema_version: 2,
          content_sections: existingSections.length ? existingSections : structuredContent.contentSections,
          course_id: savedCourse.id,
          curriculum_items: existingLocalization?.curriculum_items ?? course.curriculum,
          duration: existingLocalization?.duration ?? course.durationHighlights?.[0] ?? null,
          image_url: existingLocalization?.image_url ?? (course.imageUrl || null),
          locale,
          overview: existingLocalization?.overview ?? (course.overview || null),
          recommended_for: existingLocalization?.recommended_for ?? splitAudience(course.audience),
          schedule_tracks: refreshKoStructure && locale === "ko"
            ? migratedSchedule
            : existingSchedule.length
              ? existingSchedule
              : migratedSchedule,
          status: existingLocalization?.status ?? "published",
          summary: existingLocalization?.summary ?? (course.summary || null),
          title: existingLocalization?.title ?? course.title
        }, { onConflict: "course_id,locale" });

      if (localizationError) {
        throw new Error(`Failed to migrate ${locale}/${course.slug}: ${localizationError.message}`);
      }

      localizationCount += 1;
    }
  }

  console.log(`Migrated ${localizationCount} localized course records.`);
}

if (inspectKoStructure) {
  for (const course of getCourses("ko")) {
    const groups = parseOriginalCurriculumGroups(course.source);
    console.log(`${course.title}: ${groups.length} groups [${groups.map((group) => group.items.length).join(", ")}]`);
  }
} else {
  migrateCourses().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
