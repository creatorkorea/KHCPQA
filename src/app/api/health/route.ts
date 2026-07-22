import { NextResponse } from "next/server";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "unknown",
    branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || "unknown",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
    supabaseConfigured: hasSupabaseBrowserEnv()
  });
}
