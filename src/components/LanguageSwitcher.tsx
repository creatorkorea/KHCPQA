"use client";

import type { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/lib/content";

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
  const router = useRouter();

  function handleLocaleChange(event: ChangeEvent<HTMLSelectElement>) {
    router.push(getLocalizedHref(pathname, event.target.value as Locale));
  }

  return (
    <label className="language-switcher">
      <span className="sr-only">Language switcher</span>
      <select aria-label="Language switcher" value={locale} onChange={handleLocaleChange}>
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
