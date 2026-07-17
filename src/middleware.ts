import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

const locales = ["ko", "en", "es"] as const;
const accountPattern = /^\/(ko|en|es)\/account(?:\/|$)/;
const adminRoles = [
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
];

function getLocaleFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as (typeof locales)[number]) ? segment : "ko";
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isProtectedPath(pathname: string) {
  return accountPattern.test(pathname) || isAdminPath(pathname);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasSupabaseBrowserEnv()) {
    const locale = getLocaleFromPath(pathname);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.searchParams.set("auth", "config-error");
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, options, value }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = getLocaleFromPath(pathname);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminPath(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    const role = typeof profile?.role === "string" ? profile.role : "";
    const status = typeof profile?.status === "string" ? profile.status : "";

    if (status !== "active" || !adminRoles.includes(role)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/ko/account";
      redirectUrl.searchParams.set("admin", "denied");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/ko/account/:path*", "/en/account/:path*", "/es/account/:path*"]
};
