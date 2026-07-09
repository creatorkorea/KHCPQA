import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/ko/account", "/en/account", "/es/account"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
