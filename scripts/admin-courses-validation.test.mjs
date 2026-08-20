import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("AdminCoursesManager uses file attachment upload for representative images", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /uploadAdminContentImage/);
  assert.match(source, /name="imageFile"/);
  assert.match(source, /type="file"/);
  assert.match(source, /대표 이미지/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /PDF 자료/);
  assert.doesNotMatch(source, /대표 이미지 URL\s*<\/label>/);
});

test("AdminCoursesManager exposes clear save progress in the locale editor", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /useTransition/);
  assert.match(source, /과정 정보를 저장하고 있습니다\./);
  assert.match(source, /aria-live="polite"/);
});
