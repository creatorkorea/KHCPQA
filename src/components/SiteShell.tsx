import Link from "next/link";
import { UserRound } from "lucide-react";
import {
  getCopy,
  getTranslationStatusLabel,
  navItems,
  type Locale,
  type TranslationStatus
} from "@/lib/content";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <header className="site-header">
      <Link className="brand-mark" href={`/${locale}`} aria-label="KHCPQA home">
        <span className="brand-symbol" aria-hidden="true" />
        <span>
          <strong>{t.brand}</strong>
          <small>{t.brandFull}</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.key} href={`/${locale}/${item.href}`}>
            {t.nav[item.key]}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <LanguageSwitcher locale={locale} />
        <Link className="icon-link" href={`/${locale}/login`} aria-label={t.nav.login}>
          <span>{t.nav.login}</span>
          <UserRound size={13} />
        </Link>
        <MobileNav locale={locale} />
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getCopy(locale);

  return (
    <footer className="site-footer">
      <div>
        <div className="footer-brand">{t.brand}</div>
        <p>{t.brandFull}</p>
      </div>
      <div className="footer-grid">
        <Link href={`/${locale}/about`}>{t.nav.about}</Link>
        <Link href={`/${locale}/curriculum`}>{t.nav.curriculum}</Link>
        <Link href={`/${locale}/activities`}>{t.nav.activities}</Link>
        <Link href={`/${locale}/partner-inquiry`}>{t.nav.partner}</Link>
        <Link href={`/${locale}/contact`}>{t.nav.contact}</Link>
      </div>
    </footer>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{lead}</p>
    </section>
  );
}

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="status-badge">{children}</span>;
}

export function TranslationNotice({
  locale,
  status
}: {
  locale: Locale;
  status: TranslationStatus;
}) {
  if (status === "ready") {
    return null;
  }

  return (
    <div className="translation-notice" role="status">
      <StatusBadge>{getTranslationStatusLabel(locale, status)}</StatusBadge>
      <span>{getCopy(locale).pageReady}</span>
    </div>
  );
}
