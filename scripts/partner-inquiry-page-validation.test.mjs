import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("partner inquiry hero does not render subtitle text under the title", async () => {
  const source = await readFile("src/app/[locale]/partner-inquiry/page.tsx", "utf8");

  assert.match(source, /<PageIntro/);
  assert.match(source, /title=\{t\.nav\.partner\}/);
  assert.doesNotMatch(source, /lead=\{t\.partnerInquiry\.lead\}/);
  assert.match(source, /description: t\.partnerInquiry\.lead/);
});
