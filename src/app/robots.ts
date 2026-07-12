import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khcpqa.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/ko/account",
          "/ko/account/",
          "/ko/privacy",
          "/ko/terms",
          "/en/account",
          "/en/account/",
          "/en/privacy",
          "/en/terms",
          "/es/account",
          "/es/account/",
          "/es/privacy",
          "/es/terms"
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
