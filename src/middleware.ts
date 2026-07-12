import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

const locales = ["ko", "en", "es"] as const;
const accountPattern = /^\/(ko|en|es)\/account(?:\/|$)/;

function getLocaleFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as (typeof locales)[number]) ? segment : "ko";
}

function isProtectedPath(pathname: string) {
  return accountPattern.test(pathname) || pathname === "/admin" || pathname.startsWith("/admin/");
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname) || !hasSupabaseBrowserEnv()) {
    return NextResponse.next();
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

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/ko/account/:path*", "/en/account/:path*", "/es/account/:path*"]
};
