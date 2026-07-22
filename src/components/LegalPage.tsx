import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro } from "@/lib/public-content";

function splitLegalBody(body: string) {
  return body
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);
}

export async function LegalPage({
  kind,
  locale
}: {
  kind: "privacy" | "terms";
  locale: Locale;
}) {
  const t = getCopy(locale);
  const fallbackTitle = kind === "privacy" ? t.legal.privacyTitle : t.legal.termsTitle;
  const content = await getPublishedContentIntro({
    contentType: "Page",
    fallback: {
      lead: t.legal.lead,
      title: fallbackTitle
    },
    locale,
    slug: kind
  });
  const bodySections = content.body ? splitLegalBody(content.body) : [];

  return (
    <>
      <PageIntro eyebrow={t.legal.eyebrow} title={content.title} lead={content.lead} />
      <section className="legal-section">
        {bodySections.length > 0 ? (
          <article className="legal-document">
            {bodySections.map((section) => (
              <p key={section}>{section}</p>
            ))}
          </article>
        ) : (
          <>
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
          </>
        )}
      </section>
    </>
  );
}
