import { BadgeCheck, FileText, Lock, UserRound } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="Protected Account Area"
        title={t.accountTitle}
        lead="공개 메뉴에는 노출되지 않는 로그인 후 사용자 전용 영역입니다. 실제 배포 전 서버 인증 보호를 연결합니다."
      />
      <section className="content-section">
        <div className="account-grid">
          <article>
            <UserRound size={28} />
            <h3>Profile</h3>
            <p>이름, 이메일, 국가, 선호 언어를 확인하고 수정합니다.</p>
          </article>
          <article>
            <BadgeCheck size={28} />
            <h3>Certification Inquiry</h3>
            <p>샘플 자격 데이터 기준으로 과정명, 발급일, 상태를 표시합니다.</p>
          </article>
          <article>
            <FileText size={28} />
            <h3>Inquiry History</h3>
            <p>사용자가 남긴 문의 내역을 확인합니다.</p>
          </article>
          <article>
            <Lock size={28} />
            <h3>Noindex</h3>
            <p>계정 페이지는 검색엔진 노출을 금지합니다.</p>
          </article>
        </div>
        <div className="cert-table">
          <div>
            <strong>피부미용사 국가자격증</strong>
            <span>Certificate No. SMC-2026-001</span>
            <em>Active</em>
          </div>
          <div>
            <strong>아로마 테라피</strong>
            <span>Certificate No. SMC-2026-014</span>
            <em>Pending review</em>
          </div>
        </div>
      </section>
    </>
  );
}
