"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  getLocalizedPath,
  localeCookieName,
  localeLabels,
  locales,
  type Locale
} from "@/i18n/config";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("shell");
  const pending = useTranslations("pending");
  const [availableLocales, setAvailableLocales] = useState<Locale[]>(() => [locale]);

  useEffect(() => {
    const controller = new AbortController();
    setAvailableLocales([locale]);
    fetch(`/api/i18n/availability?path=${encodeURIComponent(pathname)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("availability lookup failed")))
      .then((result: { locales?: Locale[] }) => {
        if (Array.isArray(result.locales)) setAvailableLocales(result.locales);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [locale, pathname]);

  function handleLocaleChange(event: ChangeEvent<HTMLSelectElement>) {
    const targetLocale = event.target.value as Locale;
    document.cookie = `${localeCookieName}=${encodeURIComponent(targetLocale)}; path=/; max-age=31536000; samesite=lax`;
    router.push(getLocalizedPath(pathname, targetLocale));
  }

  return (
    <label className="language-switcher">
      <span className="sr-only">{t("languageSwitcher")}</span>
      <select aria-label={t("languageSwitcher")} value={locale} onChange={handleLocaleChange}>
        {locales.map((item) => (
          <option disabled={!availableLocales.includes(item) && item !== locale} key={item} title={!availableLocales.includes(item) ? pending("title") : undefined} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
