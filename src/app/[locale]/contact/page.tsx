import { MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, getLocations, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "contact",
    title: `${t.nav.contact} | KHCPQA`,
    description: t.contact.lead
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const locations = getLocations(locale);

  return (
    <>
      <PageIntro
        eyebrow={t.contact.eyebrow}
        title={t.nav.contact}
        lead={t.contact.lead}
      />
      <section className="content-section">
        <div className="location-grid">
          {locations.map((location) => (
            <article className="location-card" key={location.name}>
              <h3>{location.name}</h3>
              <p>
                <MapPin size={18} />
                {location.address}
              </p>
              <p>
                <Phone size={18} />
                {location.phone}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
