import { adminModules } from "@/lib/content";

export const metadata = {
  title: "KHCPQA Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="admin-page">
      <section className="admin-hero">
        <span className="eyebrow">Admin CMS</span>
        <h1>KHCPQA 관리자 대시보드</h1>
        <p>콘텐츠, 과정, 문의, 사용자, 자격 데이터, 번역 상태를 운영하는 관리자 화면의 1차 구조입니다.</p>
      </section>
      <section className="admin-grid">
        {adminModules.map((module) => {
          const Icon = module.icon;
          return (
            <article key={module.title}>
              <Icon size={26} />
              <h2>{module.title}</h2>
              <span>{module.status}</span>
            </article>
          );
        })}
      </section>
    </main>
  );
}
