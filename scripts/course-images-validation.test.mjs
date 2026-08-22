import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedGeneratedAssets = [
  "premium-course-baby-massage.png",
  "premium-course-thai-massage.png",
  "premium-course-chiropractic.png",
  "premium-course-swedish-massage.png",
  "premium-course-spa-therapy.png",
  "premium-course-brazilian-waxing.png",
  "premium-course-hospital-coordinator.png"
];

test("course thumbnails use explicit course mappings instead of array position", async () => {
  const source = await readFile("src/lib/content.ts", "utf8");

  assert.match(source, /const courseImageBySlug/);
  assert.doesNotMatch(source, /courseImages\[index\s*%\s*courseImages\.length\]/);
  assert.doesNotMatch(source, /course-generated-/);
  assert.doesNotMatch(source, /course-thumb-/);
});

test("replacement course thumbnails exist in the project asset directory", () => {
  for (const fileName of expectedGeneratedAssets) {
    assert.equal(
      existsSync(`public/assets/${fileName}`),
      true,
      `${fileName} must exist in public/assets`
    );
  }
});

test("course image sync updates only the approved replacement slugs across localizations", async () => {
  const source = await readFile("scripts/sync-course-images.ts", "utf8");

  for (const slug of [
    "베이비-마사지",
    "타이-마사지",
    "카이로프랙틱",
    "스웨디시",
    "스파-테라피",
    "브라질리언-왁싱",
    "병원-코디네이터"
  ]) {
    assert.match(source, new RegExp(`"${slug}"`));
  }

  assert.match(source, /from\("course_localizations"\)/);
  assert.match(source, /update\(\{ image_url: imageUrl \}\)/);
  assert.match(source, /eq\("course_id", course\.id\)/);
  assert.match(source, /async function main\(\)/);
  assert.match(source, /main\(\)\.catch/);
});
