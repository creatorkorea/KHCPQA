import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";

export default async function PartnerInquiryPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="Partner Inquiry"
        title={t.nav.partner}
        lead="해외 기관, 교육 파트너, 교육생 문의를 관리자 문의함으로 저장하는 폼입니다. 이메일/문자 자동 발송은 1차 범위에서 제외합니다."
      />
      <section className="form-section">
        <form className="inquiry-form">
          <label>
            Name
            <input name="name" placeholder="Your name" />
          </label>
          <label>
            Organization
            <input name="organization" placeholder="Institution or company" />
          </label>
          <label>
            Email
            <input name="email" placeholder="name@example.com" type="email" />
          </label>
          <label>
            Country
            <input name="country" placeholder="Country" />
          </label>
          <label className="full">
            Message
            <textarea name="message" placeholder="Tell us about your partnership interest" rows={6} />
          </label>
          <label className="checkbox full">
            <input type="checkbox" />
            <span>개인정보 수집 및 문의 처리에 동의합니다.</span>
          </label>
          <button className="primary-button" type="button">
            {t.formSubmit}
          </button>
        </form>
      </section>
    </>
  );
}
