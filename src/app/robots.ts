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
          "/en/account",
          "/en/account/",
          "/es/account",
          "/es/account/"
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
