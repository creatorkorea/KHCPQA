import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, FileText, Inbox, MessageSquare, Plus } from "lucide-react";
import {
  AdminConsoleShell,
  AdminPanel,
  AdminStatCard,
  AdminStatusBadge,
  getTone
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
        <AdminStatCard
          description="과정 관리로 이동"
          href="/admin/courses"
          icon={BookOpen}
          label="전체 과정 수"
          value={courseGroups.size}
        />
        <AdminStatCard
          description="공개 상태 확인"
          href="/admin/courses"
          icon={BadgeCheck}
          label="공개 과정"
          value={publishedCount}
        />
        <AdminStatCard
          description="임시저장 검토"
          href="/admin/courses"
          icon={FileText}
          label="임시저장"
          value={draftCount}
        />
      </section>

      <section className="console-quick-actions" aria-label="빠른 작업">
        <Link href="/admin/courses">
          <span><Plus size={18} /></span>
          <strong>새 과정 등록</strong>
          <small>교육과정 콘텐츠 추가</small>
        </Link>
        <Link href="/admin/inquiries">
          <span><MessageSquare size={18} /></span>
          <strong>문의 확인</strong>
          <small>상담 요청 상태 점검</small>
        </Link>
      </section>

      <section className="console-dashboard-grid">
        <AdminPanel className="console-chart-panel">
          <div className="console-panel-heading">
            <div>
              <h2>과정 등록 현황</h2>
              <p>최근 등록일 기준으로 과정 데이터 흐름을 확인합니다.</p>
            </div>
          </div>
          {chartBuckets.length > 1 ? (
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
              <strong>{courseRows.length ? `등록 과정 ${courseRows.length}건` : "등록된 과정 없음"}</strong>
              <span>
                {courseRows.length
                  ? "추세 차트는 서로 다른 등록일 데이터가 2개 이상일 때 표시됩니다."
                  : "새 과정을 등록하면 현황 차트가 자동으로 채워집니다."}
              </span>
            </div>
          )}
        </AdminPanel>

        <AdminPanel>
          <div className="console-panel-heading">
            <div>
              <h2>최근 등록 과정</h2>
              <p>마지막으로 수정된 과정부터 표시합니다.</p>
            </div>
            <Link className="console-panel-link" href="/admin/courses">
              전체 보기
              <ArrowRight size={14} />
            </Link>
          </div>
          {recentCourses.length ? (
            <ul className="console-recent-list">
              {recentCourses.map((row) => (
                <li key={row.id ?? row.slug ?? row.title}>
                  <div className="console-recent-main">
                    <strong>{row.title}</strong>
                    <span>{row.locale.toUpperCase()} · {row.updatedAt}</span>
                  </div>
                  <AdminStatusBadge tone={getTone(row.status)}>{statusLabel(row.status)}</AdminStatusBadge>
                  <Link className="console-recent-action" href="/admin/courses">
                    수정
                    <ArrowRight size={13} />
                  </Link>
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

function statusLabel(status: string) {
  if (status === "published") return "공개";
  if (status === "draft") return "임시저장";
  if (status === "translated") return "검수중";
  return status;
}

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
