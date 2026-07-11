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
  const visibleHeaderNavItems =
    locale === "ko"
      ? [
          { label: "협회소개", href: "about" },
          { label: "교육과정", href: "curriculum" },
          { label: "자격안내", href: "curriculum" },
          { label: "취업지원", href: "partner-inquiry" },
          { label: "커뮤니티", href: "activities" }
        ]
      : headerNavItems.map((item) => ({ label: t.nav[item.key], href: item.href }));

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
          상담문의
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
        <p>체계적인 교육과 취업·창업 지원을 연결하는 프리미엄 전문 교육 플랫폼입니다.</p>
      </div>
      <div className="footer-contact">
        <strong>Customer Center</strong>
        <span>전화 02-581-1278</span>
        <span>이메일 khcpqa@naver.com</span>
        <span>주소 서울특별시 강남구 테헤란로 123, 5층</span>
      </div>
      <div className="footer-links">
        <div className="footer-policy">
          <Link href={`/${locale}/about`}>개인정보처리방침</Link>
          <Link href={`/${locale}/about`}>이용약관</Link>
          <Link href={`/${locale}/curriculum`}>사이트맵</Link>
        </div>
        <div className="footer-social" aria-label="Social links">
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
