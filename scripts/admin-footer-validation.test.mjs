import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin navigation exposes a dedicated footer settings page", async () => {
  const navigation = await readFile("src/components/AdminConsole.tsx", "utf8");
  const page = await readFile("src/app/admin/footer/page.tsx", "utf8");

  assert.match(navigation, /\| "footer"/);
  assert.match(navigation, /href: "\/admin\/footer"/);
  assert.match(navigation, /label: "푸터 관리"/);
  assert.match(page, /active="footer"/);
  assert.match(page, /AdminFooterManager/);
});

test("footer settings keep shared contact details and localized copy in one record", async () => {
  assert.equal(existsSync("src/lib/footer-settings.ts"), true);
  const source = await readFile("src/lib/footer-settings.ts", "utf8");

  assert.match(source, /export type FooterSettings/);
  assert.match(source, /locales: Record<Locale, LocalizedFooterSettings>/);
  assert.match(source, /export function normalizeFooterSettings/);
  assert.match(source, /\.eq\("content_type", "Page"\)/);
  assert.match(source, /\.eq\("locale", "ko"\)/);
  assert.match(source, /\.eq\("slug", FOOTER_SETTINGS_SLUG\)/);
  assert.match(source, /\.eq\("status", "published"\)/);
});

test("admin footer editor saves with progress feedback and locale tabs", async () => {
  const source = await readFile("src/components/AdminFooterManager.tsx", "utf8");
  const actionSource = await readFile("src/app/admin/actions.ts", "utf8");

  assert.match(source, /로고 아래 문구/);
  assert.match(source, /전화번호/);
  assert.match(source, /이메일/);
  assert.match(source, /주소/);
  assert.match(source, /localeLabels/);
  assert.match(source, /admin-action-overlay/);
  assert.match(source, /admin-course-feedback-toast/);
  assert.match(source, /saveAdminFooterSettings/);
  assert.match(actionSource, /export async function saveAdminFooterSettings/);
  assert.match(actionSource, /revalidatePath\(`\/\$\{locale\}`\)/);
});

test("public locale layout loads managed footer settings with fallback", async () => {
  const layout = await readFile("src/app/[locale]/layout.tsx", "utf8");
  const shell = await readFile("src/components/SiteShell.tsx", "utf8");

  assert.match(layout, /getPublishedFooterSettings/);
  assert.match(layout, /<SiteFooter locale=\{activeLocale\} settings=\{footerSettings\}/);
  assert.match(shell, /settings: PublicFooterSettings/);
  assert.match(shell, /settings\.description/);
  assert.match(shell, /settings\.phone/);
  assert.match(shell, /settings\.email/);
  assert.match(shell, /settings\.address/);
});
