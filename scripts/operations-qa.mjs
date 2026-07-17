import { existsSync, readFileSync } from "node:fs";

const defaultBaseUrl = "https://khcpqa.vercel.app";
const baseUrl = normalizeBaseUrl(process.env.QA_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || defaultBaseUrl);
const env = readDotEnv(".env.local");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const routeChecks = [
  { path: "/ko", status: 200 },
  { path: "/ko/curriculum", status: 200 },
  { path: "/ko/activities/notice", status: 200 },
  { path: "/ko/login", status: 200 },
  { path: "/ko/signup", status: 200 },
  { path: "/robots.txt", status: 200 },
  { path: "/sitemap.xml", status: 200 },
  { path: "/admin", status: [200, 307, 308] },
  { path: "/ko/account", status: [200, 307, 308] }
];

const supabaseChecks = [
  ["auth settings", "/auth/v1/settings"],
  ["published content", "/rest/v1/admin_content_items?select=id,status&status=eq.published&limit=1"],
  ["published banners", "/rest/v1/banners?select=id,status&status=eq.published&limit=1"]
];

let hasFailure = false;

console.log(`Operations QA target: ${baseUrl}`);
console.log("");

for (const check of routeChecks) {
  await checkRoute(check);
}

console.log("");
await checkSupabase();

if (hasFailure) {
  console.error("\nOperations QA failed.");
  process.exit(1);
}

console.log("\nOperations QA passed.");

async function checkRoute({ path, status }) {
  const expectedStatuses = Array.isArray(status) ? status : [status];
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const ok = expectedStatuses.includes(response.status);
  const location = response.headers.get("location");
  report(ok, "route", path, `${response.status}${location ? ` -> ${location}` : ""}`);
}

async function checkSupabase() {
  const envReady = Boolean(supabaseUrl && supabaseAnonKey);
  report(envReady, "supabase", "env", envReady ? "configured" : "missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!envReady) {
    return;
  }

  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`
  };

  for (const [label, path] of supabaseChecks) {
    const response = await fetch(`${supabaseUrl}${path}`, { headers });
    report(response.ok, "supabase", label, String(response.status));
  }
}

function report(ok, group, name, detail) {
  const prefix = ok ? "PASS" : "FAIL";
  console.log(`[${prefix}] ${group}: ${name} (${detail})`);
  if (!ok) {
    hasFailure = true;
  }
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function readDotEnv(path) {
  if (!existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return index === -1 ? [line, ""] : [line.slice(0, index), line.slice(index + 1)];
      })
  );
}
