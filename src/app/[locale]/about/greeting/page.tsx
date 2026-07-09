import Image from "next/image";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about/greeting",
    title: `${t.greetingPage.title} | KHCPQA`,
    description: t.greetingPage.lead
  });
}

export default async function GreetingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.greetingPage.eyebrow}
        title={t.greetingPage.title}
        lead={t.greetingPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="greeting" />
      <section className="content-section">
        <div className="greeting-list">
          {t.greetingPage.greetings.map((greeting, index) => (
            <article className="greeting-card" key={greeting.name}>
              <div className="greeting-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="greeting-photo">
                <Image
                  src={greeting.imageUrl}
                  alt={greeting.name}
                  width={280}
                  height={400}
                  sizes="(max-width: 720px) 140px, 180px"
                />
              </div>
              <div className="greeting-body">
                <div className="greeting-heading">
                  <span>{greeting.role}</span>
                  <h2>{greeting.name}</h2>
                  {greeting.meta ? <p>{greeting.meta}</p> : null}
                </div>
                <div className="greeting-copy">
                  {greeting.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {greeting.contact ? <div className="greeting-contact">{greeting.contact}</div> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
