import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPanel,
  AdminSearchInput,
  AdminSelect,
  AdminStatusBadge,
  AdminTable,
  AdminTabs,
  getTone,
  translationProgress
} from "@/components/AdminConsole";
import { getAdminContentRows, type AdminContentRow } from "@/lib/admin-data";

export default async function AdminTranslationsPage() {
  const contentRows = await getAdminContentRows();
  const courseRows = contentRows.filter((row) => row.type === "Course");
  const rows = Array.from(groupCourses(courseRows).values()).map((items) => {
    const latest = items[0];
    const statusByLocale = new Map(items.map((row) => [row.locale, row.status]));
    const completedCount = supportedLocales.filter((locale) => isTranslationComplete(statusByLocale.get(locale))).length;
    const progressValue = Math.round((completedCount / supportedLocales.length) * 100);

    return {
      id: latest?.id ?? latest?.slug ?? latest?.title,
      baseLanguage: latest?.locale ?? "-",
      en: translationBadge(statusByLocale.get("en")),
      es: translationBadge(statusByLocale.get("es")),
      ko: translationBadge(statusByLocale.get("ko")),
      progress: (
        <span className="console-progress-cell">
          {translationProgress(progressValue)}
          <em>{progressValue}%</em>
        </span>
      ),
      title: latest?.title ?? "-"
    };
  });

  return (
    <AdminConsoleShell active="translations" description="언어별 번역 현황을 관리합니다." title="번역 관리">
      <AdminPanel>
        <AdminTabs active="번역 현황" tabs={["번역 현황", "번역 요청"]} />
        <AdminFilterBar>
          <AdminSelect label="언어 전체" />
          <AdminSearchInput placeholder="과정명 검색" />
        </AdminFilterBar>
        <AdminTable
          columns={[
            { key: "title", label: "과정명" },
            { key: "baseLanguage", label: "기본 언어" },
            { key: "ko", label: "ko" },
            { key: "en", label: "en" },
            { key: "es", label: "es" },
            { key: "progress", label: "상태" }
          ]}
          emptyLabel="등록된 번역 데이터가 없습니다."
          rows={rows}
        />
      </AdminPanel>
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

function isTranslationComplete(status?: string) {
  return status === "published" || status === "translated" || status === "reviewed";
}

function statusLabel(status?: string) {
  if (!status) {
    return "미등록";
  }

  if (isTranslationComplete(status)) {
    return "완료";
  }

  if (status === "draft") {
    return "임시저장";
  }

  if (status === "archived") {
    return "비공개";
  }

  return status;
}

function translationBadge(status?: string) {
  const label = statusLabel(status);
  const tone = status ? getTone(label === "완료" ? "published" : label) : "neutral";

  return <AdminStatusBadge tone={tone}>{label}</AdminStatusBadge>;
}
