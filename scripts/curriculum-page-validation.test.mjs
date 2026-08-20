import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("curriculum hero does not render subtitle text under the title", async () => {
  const source = await readFile("src/app/[locale]/curriculum/page.tsx", "utf8");

  assert.match(source, /className="curriculum-hero"/);
  assert.match(source, /t\.curriculumPage\.heroTitlePrefix/);
  assert.match(source, /t\.curriculumPage\.heroTitleHighlight/);
  assert.doesNotMatch(source, /<p>\{intro\.lead\}<\/p>/);
  assert.doesNotMatch(source, /getPublishedContentIntro/);
});

test("course detail hero renders one summary below the main title", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");

  assert.match(source, /className="course-hybrid-hero"/);
  assert.doesNotMatch(source, /<p>\{course\.summary\}<\/p>\s*<h1>/);
  assert.match(source, /<h1>\{course\.title\}<\/h1>\s*<p>\{course\.summary\}<\/p>/);
});

test("course detail renders recommended audience as stored list items", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");

  assert.match(source, /course\.recommendedFor\.map/);
  assert.doesNotMatch(source, /splitAudience/);
});

test("course detail core curriculum heading does not render subtitle text", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");

  assert.match(source, /className="course-hybrid-curriculum"/);
  assert.doesNotMatch(source, /course-hybrid-section-heading[^\n]+<p>/);
});
