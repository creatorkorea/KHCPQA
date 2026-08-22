import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("home popup supports dismissing a specific popup for today", async () => {
  const source = await readFile("src/components/HomePopup.tsx", "utf8");

  assert.match(source, /localStorage\.getItem\(storageKey\)/);
  assert.match(source, /localStorage\.setItem\(storageKey, String\(getTomorrowStart\(\)\)\)/);
  assert.match(source, /banner\.id \|\| banner\.title/);
  assert.match(source, /오늘 하루 보지 않기/);
});

test("published home banners include stable ids for popup dismissal keys", async () => {
  const source = await readFile("src/lib/public-content.ts", "utf8");

  assert.match(source, /\.select\("id, title, placement, target_url, image_url, starts_at, ends_at"\)/);
  assert.match(source, /id: row\.id/);
});

test("home popup has a dedicated action row below the image", async () => {
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(styles, /\.home-popup-actions/);
  assert.match(styles, /\.home-popup-dismiss-today/);
  assert.match(styles, /max-height: min\(74vh, 650px\)/);
});
