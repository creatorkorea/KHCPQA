import type { Locale } from "@/lib/content";

export function getPublicSiteOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "https://khcpqa.vercel.app";
}

export function buildAuthCallbackUrl(locale: Locale, nextPath: string) {
  const normalizedNextPath = nextPath.startsWith("/") ? nextPath : `/${locale}/${nextPath}`;
  const callbackUrl = new URL("/auth/callback", getPublicSiteOrigin());
  callbackUrl.searchParams.set("next", normalizedNextPath);

  return callbackUrl.toString();
}
