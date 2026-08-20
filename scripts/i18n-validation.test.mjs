import assert from "node:assert/strict";
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

function leafKeys(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child) ? leafKeys(child, path) : [path];
  });
}

test("locale configuration supports Korean, English, Spanish, and Simplified Chinese", async () => {
  const { buildLanguageAlternates, defaultLocale, getLocalizedPath, getPreferredLocale, locales } = await importTsModule("src/i18n/config.ts");

  assert.deepEqual(locales, ["ko", "en", "es", "zh-CN"]);
  assert.equal(defaultLocale, "ko");
  assert.equal(getLocalizedPath("/en/about/history", "zh-CN"), "/zh-CN/about/history");
  assert.equal(getLocalizedPath("/admin/translations", "es"), "/es");
  assert.equal(getPreferredLocale("es-ES,es;q=0.9,en;q=0.8", null), "es");
  assert.equal(getPreferredLocale("zh-Hans-CN,zh;q=0.9", null), "zh-CN");
  assert.equal(getPreferredLocale("en-US,en;q=0.9", "ko"), "ko");
  assert.deepEqual(buildLanguageAlternates("about", ["ko", "en"]), {
    ko: "/ko/about",
    en: "/en/about",
    "x-default": "/ko/about"
  });
  assert.deepEqual(buildLanguageAlternates("about", ["ko", "en"], "https://example.com"), {
    ko: "https://example.com/ko/about",
    en: "https://example.com/en/about",
    "x-default": "https://example.com/ko/about"
  });
});

test("all locale message dictionaries expose the same public keys", async () => {
  const locales = ["ko", "en", "es", "zh-CN"];
  const dictionaries = await Promise.all(
    locales.map(async (locale) => JSON.parse(await readFile(`messages/${locale}.json`, "utf8")))
  );
  const expected = leafKeys(dictionaries[0]).sort();

  for (const dictionary of dictionaries.slice(1)) {
    assert.deepEqual(leafKeys(dictionary).sort(), expected);
  }
  assert.equal(dictionaries[3].shell.languageName, "简体中文");
  assert.equal(dictionaries[3].pending.title, "翻译内容准备中");
});

test("translation metadata becomes stale when the Korean source changes", async () => {
  const { canPublishTranslation, getTranslationFreshness } = await importTsModule("src/lib/translation-model.ts");

  assert.equal(
    getTranslationFreshness({
      locale: "en",
      sourceUpdatedAt: "2026-08-20T10:00:00.000Z",
      translatedFromUpdatedAt: "2026-08-19T10:00:00.000Z"
    }),
    "stale"
  );
  assert.equal(
    getTranslationFreshness({
      locale: "ko",
      sourceUpdatedAt: "2026-08-20T10:00:00.000Z",
      translatedFromUpdatedAt: null
    }),
    "source"
  );
  assert.equal(
    canPublishTranslation({ freshness: "stale", isHighRisk: false, title: "Old translation" }).ok,
    false
  );
  assert.equal(
    canPublishTranslation({ freshness: "current", isHighRisk: true, title: "Policy" }).ok,
    false
  );
  assert.equal(
    canPublishTranslation({
      freshness: "current",
      isHighRisk: true,
      reviewedAt: "2026-08-20T10:00:00.000Z",
      reviewedBy: "reviewer-id",
      title: "Policy"
    }).ok,
    true
  );
});

test("translation workflow migration adds review metadata and publish authorization", async () => {
  const migrationNames = await readdir("supabase/migrations");
  const migrationName = migrationNames.find((name) => name.endsWith("_add_translation_workflow.sql"));
  assert.ok(migrationName, "translation workflow migration must exist");
  const sql = await readFile(`supabase/migrations/${migrationName}`, "utf8");

  assert.match(sql, /translated_from_updated_at timestamptz/i);
  assert.match(sql, /reviewed_by uuid/i);
  assert.match(sql, /reviewed_at timestamptz/i);
  assert.match(sql, /locale in \('ko', 'en', 'es', 'zh-CN'\)/i);
  assert.match(sql, /status in \('draft', 'translated', 'reviewed', 'published', 'archived'\)/i);
  assert.match(sql, /has_admin_role\(array\['super_admin'\]\)/i);
});

test("public paths map to stable translation lookup keys", async () => {
  const { classifyLocalizedPath } = await importTsModule("src/lib/public-locales.ts");

  assert.deepEqual(classifyLocalizedPath("/zh-CN/curriculum/medical-skin"), {
    kind: "course",
    slug: "medical-skin"
  });
  assert.deepEqual(classifyLocalizedPath("/en/activities/notice/open-day"), {
    kind: "activity",
    slug: "open-day"
  });
  assert.deepEqual(classifyLocalizedPath("/es/about/history"), {
    kind: "page",
    slug: "about/history"
  });
});

test("translation queue groups content by identity and marks outdated locales stale", async () => {
  const { buildTranslationQueue } = await importTsModule("src/lib/admin-translation-model.ts");
  const queue = buildTranslationQueue([
    {
      key: "Page:about",
      locale: "ko",
      sourceUpdatedAt: "2026-08-20T10:00:00.000Z",
      status: "published",
      title: "협회 소개",
      translatedFromUpdatedAt: "2026-08-20T10:00:00.000Z",
      type: "Page"
    },
    {
      key: "Page:about",
      locale: "en",
      sourceUpdatedAt: "2026-08-20T10:00:00.000Z",
      status: "reviewed",
      title: "About",
      translatedFromUpdatedAt: "2026-08-19T10:00:00.000Z",
      type: "Page"
    }
  ]);

  assert.equal(queue.length, 1);
  assert.equal(queue[0].completedCount, 1);
  assert.equal(queue[0].locales.en.freshness, "stale");
  assert.equal(queue[0].locales["zh-CN"].status, "missing");
});
