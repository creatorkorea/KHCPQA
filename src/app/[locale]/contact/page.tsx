import { MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, locations, type Locale } from "@/lib/content";

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={t.nav.contact}
        lead="기존 SMC365 하단의 본사, 본점, 지점, 캠퍼스 연락처를 신규 Contact 페이지와 푸터에 반영합니다."
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
