import Link from "next/link";
import { Images, Megaphone, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { headerNavItems } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { BrandLogoMark } from "@/components/BrandLogoMark";
import { DesktopNav } from "@/components/DesktopNav";
import { HeaderAccountLink } from "@/components/HeaderAccountLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "@/components/MobileNav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("shell");
  const navLabels = Object.fromEntries(headerNavItems.map((item) => [item.key, t(item.key)])) as Record<
    (typeof headerNavItems)[number]["key"],
    string
  >;

  return (
    <header className="site-header">
      <Link className="brand-mark" href={`/${locale}`} aria-label={t("homeLink")}>
        <BrandLogoMark className="site-brand-logo-mark" priority />
        <span>
          <strong>{t("brand")}</strong>
          <small>{t("brandFull")}</small>
        </span>
      </Link>

      <DesktopNav ariaLabel={t("primaryNavigation")} labels={navLabels} locale={locale} />

      <div className="header-actions">
        <LanguageSwitcher locale={locale} />
        <HeaderAccountLink accountLabel={t("account")} locale={locale} loginLabel={t("login")} />
        <Link className="consult-link" href={`/${locale}/partner-inquiry`}>
          {t("consult")}
        </Link>
        <MobileNav locale={locale} />
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = useTranslations("shell");

  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <Link className="footer-logo" href={`/${locale}`}>
          <BrandLogoMark className="footer-brand-logo-mark" />
          <span>
            <strong>{t("brand")}</strong>
            <small>{t("brandFull")}</small>
          </span>
        </Link>
        <p>{t("footerLead")}</p>
      </div>
      <div className="footer-contact">
        <strong>{t("customerCenter")}</strong>
        <span>{t("phone")} 02-581-1278</span>
        <span>{t("email")} khcpqa@naver.com</span>
        <span>{t("addressLabel")} {t("address")}</span>
      </div>
      <div className="footer-links">
        <div className="footer-policy">
          <Link href={`/${locale}/privacy`}>{t("privacy")}</Link>
          <Link href={`/${locale}/terms`}>{t("terms")}</Link>
          <Link href={`/${locale}/curriculum`}>{t("sitemap")}</Link>
        </div>
        <div className="footer-social" aria-label={t("socialLinks")}>
          <Link href={`/${locale}/activities/notice`} aria-label={t("activities")}>
            <Megaphone size={18} />
          </Link>
          <Link href={`/${locale}/activities/photo`} aria-label={t("activities")}>
            <Images size={18} />
          </Link>
          <Link href={`/${locale}/activities/awards`} aria-label={t("activities")}>
            <Trophy size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({
  className,
  eyebrow,
  title,
  lead
}: {
  className?: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className={className ? `page-intro ${className}` : "page-intro"}>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {lead ? <p>{lead}</p> : null}
    </section>
  );
}

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="status-badge">{children}</span>;
}
