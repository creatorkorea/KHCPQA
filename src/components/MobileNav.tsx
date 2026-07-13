"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getCopy, headerNavItems, type Locale } from "@/lib/content";

export function MobileNav({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = getCopy(locale);

  return (
    <div className="mobile-nav">
      <button
        aria-controls="mobile-nav-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? t.menuClose : t.menuOpen}
        className="mobile-menu"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen ? (
        <nav className="mobile-nav-panel" id="mobile-nav-panel" aria-label={t.a11y.mobileNavigation}>
          {headerNavItems.map((item) => (
            <Link key={item.key} href={`/${locale}/${item.href}`} onClick={() => setIsOpen(false)}>
              {t.nav[item.key]}
            </Link>
          ))}
          <Link href={`/${locale}/login`} onClick={() => setIsOpen(false)}>
            {t.nav.login}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
