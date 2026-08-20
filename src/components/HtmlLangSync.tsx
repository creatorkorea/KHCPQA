"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, localeHtmlLang } from "@/i18n/config";

export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1];
    document.documentElement.lang = localeHtmlLang[isLocale(locale) ? locale : defaultLocale];
  }, [pathname]);

  return null;
}
