import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin sidebar keeps menu rows compact instead of stretching", async () => {
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(styleSource, /\.console-logo \{/);
  assert.match(styleSource, /min-height: 96px/);
  assert.match(styleSource, /\.console-nav \{[\s\S]*align-content: start/);
  assert.match(styleSource, /\.console-nav \{[\s\S]*grid-auto-rows: min-content/);
  assert.match(styleSource, /\.console-nav a \{[\s\S]*min-height: 40px/);
  assert.match(styleSource, /\.console-admin-card \{[\s\S]*min-height: 68px/);
});

test("admin shell exposes logout action only in the sidebar footer", async () => {
  const actionSource = await readFile("src/app/admin/actions.ts", "utf8");
  const componentSource = await readFile("src/components/AdminConsole.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(actionSource, /export async function signOutFromAdmin\(\)/);
  assert.match(actionSource, /await supabase\.auth\.signOut\(\)/);
  assert.match(actionSource, /redirect\("\/ko\/login"\)/);
  assert.match(componentSource, /import \{ signOutFromAdmin \} from "@\/app\/admin\/actions"/);
  assert.match(componentSource, /className="console-logout-button"/);
  assert.doesNotMatch(componentSource, /console-profile-logout/);
  assert.doesNotMatch(componentSource, /aria-label="super_admin 로그아웃"/);
  assert.match(styleSource, /\.console-logout-button \{[\s\S]*min-height: 34px/);
  assert.doesNotMatch(styleSource, /\.console-top-actions form/);
});

test("admin sidebar hides page management without removing its route contract", async () => {
  const componentSource = await readFile("src/components/AdminConsole.tsx", "utf8");

  assert.doesNotMatch(componentSource, /href: "\/admin\/pages"/);
  assert.match(componentSource, /\| "pages"/);
  assert.match(componentSource, /href: "\/admin\/footer"/);
});

test("admin dashboard summary area is denser on desktop", async () => {
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(styleSource, /\.console-stats-grid \{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styleSource, /\.console-stats-grid \{[\s\S]*gap: 18px/);
  assert.match(styleSource, /\.console-stat-card \{[\s\S]*min-height: 118px/);
  assert.match(styleSource, /\.console-quick-actions \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styleSource, /\.console-quick-actions a \{[\s\S]*min-height: 66px/);
});
