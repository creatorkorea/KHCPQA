import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("account overview does not expose the privacy card as a member dashboard module", async () => {
  const source = await readFile("src/app/[locale]/account/page.tsx", "utf8");

  assert.doesNotMatch(source, /moduleIcons/);
  assert.doesNotMatch(source, /moduleMetrics/);
  assert.doesNotMatch(source, /accountModules/);
  assert.doesNotMatch(source, /account-grid/);
  assert.doesNotMatch(source, /t\.account\.modules\.map/);
  assert.doesNotMatch(source, /Lock/);
  assert.doesNotMatch(source, /t\.account\.noindexStatus/);
});

test("account overview keeps status badges in the top account navigation", async () => {
  const accountPageSource = await readFile("src/app/[locale]/account/page.tsx", "utf8");
  const accountShellSource = await readFile("src/components/AccountShell.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(accountPageSource, /const navBadges/);
  assert.match(accountPageSource, /accountData\.profileForm\.name \|\| accountData\.profileForm\.email/);
  assert.match(accountPageSource, /accountData\.certificates\.length/);
  assert.match(accountPageSource, /accountData\.inquiries\.length/);
  assert.match(accountPageSource, /<AccountNav locale=\{locale\} activeHref="account" badges=\{navBadges\} \/>/);
  assert.match(accountShellSource, /badges\?: Partial<Record<string, string>>/);
  assert.match(accountShellSource, /badges\?\.\[item\.href\]/);
  assert.match(accountShellSource, /account-nav-badge/);
  assert.match(styleSource, /\.account-nav-badge/);
});
