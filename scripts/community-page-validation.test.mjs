import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("community overview hero does not render subtitle text under the title", async () => {
  const source = await readFile("src/app/[locale]/activities/page.tsx", "utf8");

  assert.match(source, /className="community-page-intro"/);
  assert.match(source, /title=\{introTitle\}/);
  assert.doesNotMatch(source, /lead=\{introLead\}/);
});

test("community category hero does not render subtitle text under the title", async () => {
  const source = await readFile("src/app/[locale]/activities/[activityKey]/page.tsx", "utf8");

  assert.match(source, /className="page-intro activity-category-intro"/);
  assert.match(source, /<h1>\{activityTitle\}<\/h1>/);
  assert.doesNotMatch(source, /<p>\{activitySummary\}<\/p>/);
});

test("community post hero does not render subtitle text under the title", async () => {
  const source = await readFile("src/app/[locale]/activities/[activityKey]/[postSlug]/page.tsx", "utf8");

  assert.match(source, /className="page-intro activity-post-intro"/);
  assert.match(source, /<h1>\{post\.title\}<\/h1>/);
  assert.doesNotMatch(source, /<p>\{activity\.summary\}<\/p>/);
});
