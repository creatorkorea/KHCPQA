import Link from "next/link";
import { Lock } from "lucide-react";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        eyebrow="Secure Login"
        title={t.nav.login}
        lead="Supabase Auth 연결 전 UI 단계입니다. 로그인 후 My Page와 자격 조회 메뉴가 노출되는 정책을 화면에 반영합니다."
      />
      <section className="auth-section">
        <form className="auth-card">
          <Lock size={28} />
          <label>
            Email
            <input type="email" placeholder="name@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Password" />
          </label>
          <Link className="primary-button" href={`/${locale}/account`}>
            Preview My Page
          </Link>
          <p>실제 인증은 Supabase 환경변수 설정 후 연결합니다.</p>
        </form>
      </section>
    </>
  );
}
