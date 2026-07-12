import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";

export function LegalPage({
  kind,
  locale
}: {
  kind: "privacy" | "terms";
  locale: Locale;
}) {
  const t = getCopy(locale);
  const title = kind === "privacy" ? t.legal.privacyTitle : t.legal.termsTitle;

  return (
    <>
      <PageIntro eyebrow={t.legal.eyebrow} title={title} lead={t.legal.lead} />
      <section className="legal-section">
        <article className="legal-notice">
          <AlertCircle size={24} />
          <div>
            <h2>{t.legal.pendingTitle}</h2>
            <p>{t.legal.pendingBody}</p>
          </div>
        </article>
        <div className="legal-requirements">
          {t.legal.requiredItems.map((item) => (
            <div key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
