import Link from "next/link";
import { BadgeCheck, ClipboardList, LayoutDashboard, UserRound } from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";

const accountIcons = [LayoutDashboard, UserRound, BadgeCheck, ClipboardList];

export function AccountNav({
  locale,
  activeHref
}: {
  locale: Locale;
  activeHref: string;
}) {
  const t = getCopy(locale);

  return (
    <nav className="account-nav" aria-label={t.a11y.accountNavigation}>
      {t.account.nav.map((item, index) => {
        const Icon = accountIcons[index];
        const isActive = item.href === activeHref;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "is-active" : undefined}
            href={`/${locale}/${item.href}`}
            key={item.href}
          >
            <Icon size={18} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountSection({
  children,
  lead,
  title
}: {
  children: React.ReactNode;
  lead: string;
  title: string;
}) {
  return (
    <section className="account-panel">
      <div className="section-heading">
        <span className="eyebrow">Member Area</span>
        <h2>{title}</h2>
        <p>{lead}</p>
      </div>
      {children}
    </section>
  );
}
