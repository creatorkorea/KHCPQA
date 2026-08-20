"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavItems } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export function DesktopNav({
  ariaLabel,
  labels,
  locale
}: {
  ariaLabel: string;
  labels: Record<(typeof headerNavItems)[number]["key"], string>;
  locale: Locale;
}) {
  const pathname = usePathname();

  return (
    <nav className="desktop-nav" aria-label={ariaLabel}>
      {headerNavItems.map((item) => {
        const href = `/${locale}/${item.href}`;
        const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link aria-current={isCurrent ? "page" : undefined} key={item.key} href={href}>
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
