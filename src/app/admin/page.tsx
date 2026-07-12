import { LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { AdminCrudPreview } from "@/components/AdminCrudPreview";
import {
  adminCertificationRows,
  adminContentRows,
  adminInquiryRows,
  adminModules,
  adminReleaseTasks
} from "@/lib/content";

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
        <div>
          <span className="eyebrow">Admin CMS</span>
          <h1>KHCPQA 관리자 대시보드</h1>
          <p>콘텐츠, 과정, 문의, 사용자, 자격 데이터, 번역 상태를 운영하는 관리자 화면의 1차 구조입니다.</p>
        </div>
        <aside className="admin-security-card" aria-label="Admin security status">
          <LockKeyhole size={22} />
          <strong>인증 연결 전 프리뷰</strong>
          <span>배포 전 서버 인증과 권한별 접근 제한을 연결해야 합니다.</span>
        </aside>
      </section>
      <section className="admin-grid">
        {adminModules.map((module) => {
          const Icon = module.icon;
          return (
            <article key={module.title}>
              <Icon size={26} />
              <div>
                <h2>{module.title}</h2>
                <p>{module.description}</p>
              </div>
              <footer>
                <span>{module.status}</span>
                <strong>{module.count}</strong>
              </footer>
            </article>
          );
        })}
      </section>
      <section className="admin-workspace">
        <div className="admin-toolbar">
          <div>
            <span className="eyebrow">Operations</span>
            <h2>운영 데이터 미리보기</h2>
          </div>
          <label>
            <Search size={16} />
            <span className="sr-only">검색</span>
            <input placeholder="콘텐츠, 문의, 자격번호 검색" />
          </label>
        </div>
        <div className="admin-panel-grid">
          <section className="admin-table-card admin-editor-card">
            <h3>관리자 입력 폼</h3>
            <AdminCrudPreview />
          </section>
          <AdminTable
            columns={["유형", "제목", "언어", "상태", "수정자", "수정일"]}
            rows={adminContentRows.map((row) => [row.type, row.title, row.locale, row.status, row.updatedBy, row.updatedAt])}
            title="콘텐츠 관리"
          />
          <AdminTable
            columns={["접수번호", "이름", "기관", "국가", "유형", "상태", "접수일"]}
            rows={adminInquiryRows.map((row) => [row.receipt, row.name, row.organization, row.country, row.type, row.status, row.submittedAt])}
            title="문의 관리"
          />
          <AdminTable
            columns={["사용자", "과정", "자격번호", "발급일", "상태"]}
            rows={adminCertificationRows.map((row) => [row.user, row.course, row.number, row.issuedAt, row.status])}
            title="자격 데이터"
          />
          <section className="admin-task-panel">
            <div>
              <ShieldCheck size={22} />
              <h3>릴리즈 전 필수 연결</h3>
            </div>
            <ul>
              {adminReleaseTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}

function AdminTable({
  columns,
  rows,
  title
}: {
  columns: string[];
  rows: string[][];
  title: string;
}) {
  return (
    <section className="admin-table-card">
      <h3>{title}</h3>
      <div className="admin-table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
