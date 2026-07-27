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

const rows = [
  ["글로벌 웰니스 기초 과정", "ko", "완료", "완료", "번역중", "미번역", 75],
  ["명상 전문가 심화 과정", "ko", "완료", "번역중", "미번역", "미번역", 50],
  ["스트레스 관리 실전 과정", "ko", "완료", "미번역", "미번역", "미번역", 25],
  ["수면 개선 프로그램", "ko", "완료", "완료", "번역중", "번역중", 100],
  ["아동상담 입문 과정", "ko", "완료", "완료", "완료", "미번역", 75]
].map(([title, baseLanguage, ko, en, es, ja, progress]) => {
  const koStatus = String(ko);
  const enStatus = String(en);
  const esStatus = String(es);
  const jaStatus = String(ja);
  const progressValue = Number(progress);

  return {
  id: title,
  baseLanguage,
  en: <AdminStatusBadge tone={getTone(enStatus)}>{enStatus}</AdminStatusBadge>,
  es: <AdminStatusBadge tone={getTone(esStatus)}>{esStatus}</AdminStatusBadge>,
  ja: <AdminStatusBadge tone={getTone(jaStatus)}>{jaStatus}</AdminStatusBadge>,
  ko: <AdminStatusBadge tone={getTone(koStatus)}>{koStatus}</AdminStatusBadge>,
  progress: (
    <span className="console-progress-cell">
      {translationProgress(progressValue)}
      <em>{progressValue}%</em>
    </span>
  ),
  title
  };
});

export default function AdminTranslationsPage() {
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
            { key: "ja", label: "ja" },
            { key: "progress", label: "상태" }
          ]}
          rows={rows}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
