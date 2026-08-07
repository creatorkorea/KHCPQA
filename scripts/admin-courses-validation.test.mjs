import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

const {
  buildAdminCourseContentInput,
  getAdminCourseSectionLabel,
  parseAdminCourseManagedSlug
} = await importTsModule("src/lib/admin-courses.ts");

test("buildAdminCourseContentInput maps main section to the public course intro slug", () => {
  const result = buildAdminCourseContentInput({
    body: "Course overview",
    courseSection: "main",
    courseSlug: "피부미용사",
    imageUrl: " /assets/course.jpg ",
    locale: "ko",
    sourceUrl: "",
    status: "published",
    summary: "List card summary",
    title: "피부미용사 국가자격증"
  });

  assert.equal(result.ok, true);
  assert.equal(result.payload.slug, "피부미용사");
  assert.equal(result.payload.contentType, "Course");
  assert.equal(result.payload.imageUrl, "/assets/course.jpg");
});

test("buildAdminCourseContentInput maps detail sections to the slugs read by the public course page", () => {
  const result = buildAdminCourseContentInput({
    body: "1주차\n2주차",
    courseSection: "flow-2",
    courseSlug: "피부미용사",
    imageUrl: "",
    locale: "ko",
    sourceUrl: "",
    status: "draft",
    summary: "단계 설명",
    title: "실습 집중"
  });

  assert.equal(result.ok, true);
  assert.equal(result.payload.slug, "피부미용사-flow-2");
});

test("parseAdminCourseManagedSlug restores selected course and section", () => {
  const parsed = parseAdminCourseManagedSlug("피부미용사-panel-strength", [
    { label: "피부미용사", slug: "피부미용사" }
  ]);

  assert.deepEqual(parsed, {
    courseSection: "panel-strength",
    courseSlug: "피부미용사"
  });
});

test("getAdminCourseSectionLabel explains where the section appears publicly", () => {
  assert.equal(getAdminCourseSectionLabel("main"), "대표 정보");
  assert.equal(getAdminCourseSectionLabel("process-1"), "수업 진행 과정");
});
