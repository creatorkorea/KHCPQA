import { BadgeCheck, BookOpen, FileText, Languages } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPanel,
  AdminStatCard
} from "@/components/AdminConsole";
import { getAdminContentRows } from "@/lib/admin-data";

export const metadata = {
  title: "KHCPQA Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDashboardPage() {
  const contentRows = await getAdminContentRows();
  const publishedCount = contentRows.filter((row) => row.status === "published").length;
  const draftCount = contentRows.filter((row) => row.status === "draft").length;

  return (
    <AdminConsoleShell
      active="dashboard"
      description="사이트 운영 상태와 최근 등록 현황을 한눈에 확인합니다."
      title="대시보드"
    >
      <section className="console-stats-grid">
        <AdminStatCard description="전체 등록 과정" icon={BookOpen} label="전체 과정 수" value={128} />
        <AdminStatCard description="공개 중인 콘텐츠" icon={BadgeCheck} label="공개 과정" value={publishedCount || 86} />
        <AdminStatCard description="임시저장 상태" icon={FileText} label="임시저장" value={draftCount || 23} />
        <AdminStatCard description="번역 미완료 과정" icon={Languages} label="번역 필요" value={19} />
      </section>

      <section className="console-dashboard-grid">
        <AdminPanel className="console-chart-panel">
          <div className="console-panel-heading">
            <h2>과정 등록 현황</h2>
          </div>
          <div className="console-line-chart" aria-label="과정 등록 현황 차트">
            <svg viewBox="0 0 640 280" role="img">
              <defs>
                <linearGradient id="adminChartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7c5ce6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c5ce6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 90, 140, 190, 240].map((y) => (
                <line key={y} x1="38" x2="612" y1={y} y2={y} />
              ))}
              <path d="M44 226 L140 178 L236 194 L332 132 L428 96 L524 132 L608 72 L608 246 L44 246 Z" fill="url(#adminChartFill)" />
              <path d="M44 226 L140 178 L236 194 L332 132 L428 96 L524 132 L608 72" />
              {[44, 140, 236, 332, 428, 524, 608].map((x, index) => (
                <circle cx={x} cy={[226, 178, 194, 132, 96, 132, 72][index]} key={x} r="5" />
              ))}
            </svg>
            <div className="console-chart-axis">
              {["05.12", "05.13", "05.14", "05.15", "05.16", "05.17", "05.18"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="console-panel-heading">
            <h2>최근 등록 과정</h2>
          </div>
          <ul className="console-recent-list">
            {[
              ["글로벌 웰니스 기초 과정", "2026.05.18"],
              ["명상 전문가 심화 과정", "2026.05.17"],
              ["스트레스 관리 실전 과정", "2026.05.16"],
              ["수면 개선 프로그램", "2026.05.15"],
              ["아동상담 입문 과정", "2026.05.14"]
            ].map(([title, date]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{date}</span>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </section>
    </AdminConsoleShell>
  );
}
