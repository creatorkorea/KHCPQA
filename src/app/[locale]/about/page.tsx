import { Building2, Globe2, ShieldCheck, Users } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="About KHCPQA"
        title={t.nav.about}
        lead="SMC아카데미와 한국건강관리사자격협회의 기존 소개, 인사말, 수석강사, 연혁, 조직도 콘텐츠를 국제 협회형 정보 구조로 재정리합니다."
      />
      <section className="content-section">
        <div className="feature-row">
          <div>
            <Building2 size={28} />
            <h3>Institutional Profile</h3>
            <p>소개, 인사말, 연혁, 조직도를 하나의 신뢰 중심 스토리로 구성합니다.</p>
          </div>
          <div>
            <Users size={28} />
            <h3>Senior Instructors</h3>
            <p>수석강사 프로필과 전문 분야를 글로벌 파트너가 이해하기 쉽게 보여줍니다.</p>
          </div>
          <div>
            <Globe2 size={28} />
            <h3>Global Positioning</h3>
            <p>한국 기반 전문 교육기관이라는 포지션을 영어/스페인어 사용자에게 전달합니다.</p>
          </div>
          <div>
            <ShieldCheck size={28} />
            <h3>Trust Signals</h3>
            <p>수상경력, 대회, 언론, 봉사활동 콘텐츠를 신뢰 요소로 연결합니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
