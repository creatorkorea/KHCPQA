import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importTsModule(path) {
  const source = await readFile(path, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const encoded = Buffer.from(output).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${pathToFileURL(path).href}`);
}

const modelPath = "src/lib/course-model.ts";

test("hybrid course model exposes stable slug and list normalization", async () => {
  assert.equal(existsSync(modelPath), true, "src/lib/course-model.ts must exist");
  const { createCourseSlug, splitCourseLines } = await importTsModule(modelPath);

  assert.equal(createCourseSlug("  메디컬 스킨케어  "), "메디컬-스킨케어");
  assert.deepEqual(splitCourseLines("첫 단계\n- 둘째 단계\n\n첫 단계"), ["첫 단계", "둘째 단계"]);
});

test("hybrid course localization validation keeps locale publication independent", async () => {
  assert.equal(existsSync(modelPath), true, "src/lib/course-model.ts must exist");
  const { buildCourseLocalizationPayload } = await importTsModule(modelPath);
  const result = buildCourseLocalizationPayload({
    certificationNote: "수료 기준 안내",
    courseId: "course-id",
    curriculumText: "기초 이론\n현장 실습",
    duration: "8주",
    imageUrl: "/assets/course.jpg",
    locale: "ko",
    overview: "과정 개요",
    pdfFileName: "교육과정.pdf",
    pdfUrl: "https://example.com/course.pdf",
    recommendedText: "취업 준비생\n현장 실무자",
    status: "published",
    summary: "과정 요약",
    title: "메디컬 스킨케어"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload.curriculumItems, ["기초 이론", "현장 실습"]);
  assert.deepEqual(result.payload.recommendedFor, ["취업 준비생", "현장 실무자"]);
  assert.equal(result.payload.locale, "ko");
  assert.equal(result.payload.status, "published");
});

test("foreign course URLs do not fall back to Korean static content when Supabase is active", async () => {
  const { getCourseFallbackPolicy } = await importTsModule(modelPath);

  assert.equal(getCourseFallbackPolicy("ko", true), "static");
  assert.equal(getCourseFallbackPolicy("en", true), "none");
  assert.equal(getCourseFallbackPolicy("zh-CN", true), "none");
  assert.equal(getCourseFallbackPolicy("zh-CN", false), "none");
});

test("course catalog migration defines normalized tables, uniqueness, grants, and RLS", async () => {
  const migrationNames = await readdir("supabase/migrations");
  const migrationName = migrationNames.find((name) => name.endsWith("_create_course_catalog.sql"));
  assert.ok(migrationName, "create_course_catalog migration must exist");
  const source = await readFile(`supabase/migrations/${migrationName}`, "utf8");

  assert.match(source, /create table if not exists public\.courses/i);
  assert.match(source, /create table if not exists public\.course_localizations/i);
  assert.match(source, /unique\s*\(course_id, locale\)/i);
  assert.match(source, /curriculum_items text\[\]/i);
  assert.match(source, /recommended_for text\[\]/i);
  assert.match(source, /pdf_url text/i);
  assert.match(source, /enable row level security/i);
  assert.match(source, /grant select on public\.courses to anon, authenticated/i);
  assert.match(source, /has_admin_role/i);
});

test("public course repository provides locale-specific published reads with static fallback", async () => {
  assert.equal(existsSync("src/lib/course-repository.ts"), true, "course repository must exist");
  const source = await readFile("src/lib/course-repository.ts", "utf8");

  assert.match(source, /export async function getPublishedCourses/);
  assert.match(source, /export async function getPublishedCourseBySlug/);
  assert.match(source, /@\/lib\/supabase\/public/);
  assert.doesNotMatch(source, /@\/lib\/supabase\/server/);
  assert.match(source, /getCourses\(locale\)/);
  assert.match(source, /status[^\n]+published/);
  assert.match(source, /is_active/);
  assert.doesNotMatch(
    source,
    /error \|\| !data \|\| data\.length === 0/,
    "an empty published locale must stay empty instead of exposing static fallback courses"
  );
});

test("legacy course migration script is idempotent across all supported locales", async () => {
  assert.equal(existsSync("scripts/migrate-course-content.ts"), true, "legacy migration script must exist");
  const source = await readFile("scripts/migrate-course-content.ts", "utf8");

  assert.match(source, /getCourses\(locale\)/);
  assert.match(source, /migrationLocales = \["ko", "en", "es"\]/);
  assert.doesNotMatch(source, /migrationLocales = [^\n]+zh-CN/);
  assert.match(source, /upsert/);
  assert.match(source, /onConflict: "slug"/);
  assert.match(source, /onConflict: "course_id,locale"/);
});

test("admin course manager uses common fields, locale tabs, image and PDF uploads", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /교육과정 생성/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /핵심 교육 내용/);
  assert.match(source, /추천 대상/);
  assert.match(source, /PDF 자료/);
  assert.match(source, /uploadAdminContentAttachment/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /과정 다시 활성화/);
  assert.doesNotMatch(source, /adminCourseSections/);
  assert.doesNotMatch(source, /원본 URL/);
});

test("admin course actions separate common CRUD from localized content saves", async () => {
  const source = await readFile("src/app/admin/actions.ts", "utf8");
  const dataSource = await readFile("src/lib/admin-data.ts", "utf8");

  assert.match(source, /export async function saveAdminCourse/);
  assert.match(source, /export async function saveAdminCourseLocalization/);
  assert.match(source, /export async function archiveAdminCourse/);
  assert.match(source, /export async function restoreAdminCourse/);
  assert.match(source, /export async function deleteAdminCourse/);
  assert.match(source, /공개 중인 언어 콘텐츠가 있어 삭제할 수 없습니다/);
  assert.match(dataSource, /export async function getAdminCourses/);
  assert.match(dataSource, /course_localizations/);
});

test("public course detail uses the common hybrid template and optional PDF actions", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");

  assert.match(source, /getPublishedCourseBySlug/);
  assert.match(source, /course-hybrid-overview/);
  assert.match(source, /course-hybrid-curriculum/);
  assert.match(source, /course-hybrid-audience/);
  assert.match(source, /course-hybrid-document/);
  assert.match(source, /download/);
  assert.doesNotMatch(source, /originalCourseDetails/);
});
