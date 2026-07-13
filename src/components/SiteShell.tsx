import Link from "next/link";
import { Instagram, MessageCircle, UserRound, Youtube } from "lucide-react";
import {
  getCopy,
  getTranslationStatusLabel,
  headerNavItems,
  type Locale,
  type TranslationStatus
} from "@/lib/content";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getCopy(locale);
  const visibleHeaderNavItems = headerNavItems.map((item) => ({ label: t.nav[item.key], href: item.href }));

  return (
    <header className="site-header">
      <Link className="brand-mark" href={`/${locale}`} aria-label={t.a11y.homeLink}>
        <span className="brand-symbol" aria-hidden="true" />
        <span>
          <strong>{t.brand}</strong>
          <small>{t.brandFull}</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label={t.a11y.primaryNavigation}>
        {visibleHeaderNavItems.map((item) => (
          <Link key={`${item.href}-${item.label}`} href={`/${locale}/${item.href}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <LanguageSwitcher locale={locale} />
        <Link className="icon-link" href={`/${locale}/login`} aria-label={t.nav.login}>
          <span>{t.nav.login}</span>
          <UserRound size={13} />
        </Link>
        <Link className="consult-link" href={`/${locale}/partner-inquiry`}>
          {t.layout.consultCta}
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
      <div className="footer-brand-block">
        <Link className="footer-logo" href={`/${locale}`}>
          <span className="brand-symbol" aria-hidden="true" />
          <span>
            <strong>{t.brand}</strong>
            <small>{t.brandFull}</small>
          </span>
        </Link>
        <p>{t.layout.footerLead}</p>
      </div>
      <div className="footer-contact">
        <strong>{t.layout.customerCenter}</strong>
        <span>{t.layout.phoneLabel} 02-581-1278</span>
        <span>{t.layout.emailLabel} khcpqa@naver.com</span>
        <span>{t.layout.addressLabel} {t.layout.address}</span>
      </div>
      <div className="footer-links">
        <div className="footer-policy">
          <Link href={`/${locale}/privacy`}>{t.legal.privacyTitle}</Link>
          <Link href={`/${locale}/terms`}>{t.legal.termsTitle}</Link>
          <Link href={`/${locale}/curriculum`}>{t.layout.sitemap}</Link>
        </div>
        <div className="footer-social" aria-label={t.a11y.socialLinks}>
          <Link href={`/${locale}/activities`} aria-label="Instagram"><Instagram size={18} /></Link>
          <Link href={`/${locale}/activities`} aria-label="Kakao"><MessageCircle size={18} /></Link>
          <Link href={`/${locale}/activities`} aria-label="YouTube"><Youtube size={18} /></Link>
        </div>
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
