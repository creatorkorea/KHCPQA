"use client";

import type { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCopy, localeLabels, locales, type Locale } from "@/lib/content";

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
  const t = getCopy(locale);

  function handleLocaleChange(event: ChangeEvent<HTMLSelectElement>) {
    router.push(getLocalizedHref(pathname, event.target.value as Locale));
  }

  return (
    <label className="language-switcher">
      <span className="sr-only">{t.a11y.languageSwitcher}</span>
      <select aria-label={t.a11y.languageSwitcher} value={locale} onChange={handleLocaleChange}>
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
