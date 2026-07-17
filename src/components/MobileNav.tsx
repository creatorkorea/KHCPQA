"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { getCopy, headerNavItems, type Locale } from "@/lib/content";

export function MobileNav({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const t = getCopy(locale);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="mobile-nav" ref={rootRef}>
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
          {headerNavItems.map((item) => {
            const href = `/${locale}/${item.href}`;
            const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link aria-current={isCurrent ? "page" : undefined} key={item.key} href={href} onClick={() => setIsOpen(false)}>
                {t.nav[item.key]}
              </Link>
            );
          })}
          <Link aria-current={pathname === `/${locale}/login` ? "page" : undefined} href={`/${locale}/login`} onClick={() => setIsOpen(false)}>
            {t.nav.login}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
