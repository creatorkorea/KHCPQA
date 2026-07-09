"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/content";

export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1];
    document.documentElement.lang = isLocale(locale) ? locale : defaultLocale;
  }, [pathname]);

  return null;
}
