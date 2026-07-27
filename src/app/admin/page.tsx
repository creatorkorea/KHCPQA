import { BadgeCheck, BookOpen, FileText, Inbox, Languages } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPanel,
  AdminStatCard
} from "@/components/AdminConsole";
import { getAdminContentRows, type AdminContentRow } from "@/lib/admin-data";

export const metadata = {
  title: "KHCPQA Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDashboardPage() {
  const contentRows = await getAdminContentRows();
  const courseRows = contentRows.filter((row) => row.type === "Course");
  const courseGroups = groupCourses(courseRows);
  const publishedCount = Array.from(courseGroups.values()).filter((items) =>
    items.some((row) => row.status === "published")
  ).length;
  const draftCount = courseRows.filter((row) => row.status === "draft").length;
  const translationNeededCount = Array.from(courseGroups.values()).filter((items) =>
    new Set(items.map((row) => row.locale)).size < supportedLocales.length
  ).length;
  const chartBuckets = buildChartBuckets(courseRows);
  const chart = buildChartPoints(chartBuckets);
  const recentCourses = Array.from(courseGroups.values())
    .map((items) => items[0])
    .filter((row): row is AdminContentRow => Boolean(row))
    .slice(0, 5);

  return (
    <AdminConsoleShell
      active="dashboard"
      description="사이트 운영 상태와 최근 등록 현황을 한눈에 확인합니다."
      title="대시보드"
    >
      <section className="console-stats-grid">
        <AdminStatCard description="실제 등록 과정" icon={BookOpen} label="전체 과정 수" value={courseGroups.size} />
        <AdminStatCard description="공개 중인 과정" icon={BadgeCheck} label="공개 과정" value={publishedCount} />
        <AdminStatCard description="임시저장 상태" icon={FileText} label="임시저장" value={draftCount} />
        <AdminStatCard description="번역 미완료 과정" icon={Languages} label="번역 필요" value={translationNeededCount} />
      </section>

      <section className="console-dashboard-grid">
        <AdminPanel className="console-chart-panel">
          <div className="console-panel-heading">
            <h2>과정 등록 현황</h2>
          </div>
          {chartBuckets.length ? (
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
                <path d={chart.areaPath} fill="url(#adminChartFill)" />
                <path d={chart.linePath} />
                {chart.points.map((point) => (
                  <circle cx={point.x} cy={point.y} key={`${point.x}-${point.y}`} r="5" />
                ))}
              </svg>
              <div className="console-chart-axis">
                {chartBuckets.map((bucket) => (
                  <span key={bucket.label}>{bucket.label}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="console-empty-state console-chart-empty" role="status">
              <Inbox size={18} />
              <span>등록된 과정 데이터가 없습니다.</span>
            </div>
          )}
        </AdminPanel>

        <AdminPanel>
          <div className="console-panel-heading">
            <h2>최근 등록 과정</h2>
          </div>
          {recentCourses.length ? (
            <ul className="console-recent-list">
              {recentCourses.map((row) => (
                <li key={row.id ?? row.slug ?? row.title}>
                  <strong>{row.title}</strong>
                  <span>{row.updatedAt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="console-empty-state" role="status">
              <Inbox size={18} />
              <span>최근 등록 과정이 없습니다.</span>
            </div>
          )}
        </AdminPanel>
      </section>
    </AdminConsoleShell>
  );
}

const supportedLocales = ["ko", "en", "es"];

function groupCourses(rows: AdminContentRow[]) {
  const groups = new Map<string, AdminContentRow[]>();

  rows.forEach((row) => {
    const key = row.slug || row.title;
    const items = groups.get(key) ?? [];
    items.push(row);
    groups.set(key, items);
  });

  return groups;
}

function buildChartBuckets(rows: AdminContentRow[]) {
  const buckets = new Map<string, number>();

  rows.forEach((row) => {
    const rawDate = row.updatedAtRaw ? new Date(row.updatedAtRaw) : null;

    if (!rawDate || Number.isNaN(rawDate.getTime())) {
      return;
    }

    const label = new Intl.DateTimeFormat("ko", {
      day: "2-digit",
      month: "2-digit"
    })
      .format(rawDate)
      .replace(/\s/g, "")
      .replace(/\.$/, "");

    buckets.set(label, (buckets.get(label) ?? 0) + 1);
  });

  return Array.from(buckets.entries())
    .map(([label, count]) => ({ count, label }))
    .slice(-7);
}

function buildChartPoints(buckets: Array<{ count: number; label: string }>) {
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);
  const step = buckets.length > 1 ? 564 / (buckets.length - 1) : 0;
  const points = buckets.map((bucket, index) => ({
    x: Math.round(44 + step * index),
    y: Math.round(226 - (bucket.count / maxCount) * 154)
  }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = first && last ? `${linePath} L${last.x} 246 L${first.x} 246 Z` : "";

  return {
    areaPath,
    linePath,
    points
  };
}
