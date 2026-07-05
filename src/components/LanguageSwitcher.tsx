"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/content";

const languageLabels: Record<Locale, string> = {
  ko: "KO",
  en: "EN",
  es: "ES"
};

function getLocalizedHref(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/");

  if (locales.includes(segments[1] as Locale)) {
    segments[1] = targetLocale;
    return segments.join("/") || `/${targetLocale}`;
  }

  return `/${targetLocale}`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="language-switcher" aria-label="Language switcher">
      {locales.map((item) => (
        <Link
          key={item}
          className={item === locale ? "active" : ""}
          href={getLocalizedHref(pathname, item)}
        >
          {languageLabels[item]}
        </Link>
      ))}
    </div>
  );
}
