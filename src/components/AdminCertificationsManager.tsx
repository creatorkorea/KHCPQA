"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, Pencil, Plus, Save, Search, ShieldCheck, X } from "lucide-react";
import {
  saveAdminCertification,
  type SaveAdminCertificationResult
} from "@/app/admin/actions";
import { AdminStatusBadge, getTone } from "@/components/AdminConsole";
import {
  adminCertificationStatuses,
  getAdminCertificationStatusLabel
} from "@/lib/admin-certifications";
import type { AdminCertificationRow } from "@/lib/admin-data";

type CertificationFormValue = {
  adminNote: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
};

type Mode = "create" | "update";

const emptyForm: CertificationFormValue = {
  adminNote: "",
  certificateNumber: "",
  courseTitle: "",
  expiresAt: "",
  issuedAt: "",
  status: "issued",
  userEmail: "",
  verificationCode: ""
};

export function AdminCertificationsManager({ certifications }: { certifications: AdminCertificationRow[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [formValue, setFormValue] = useState<CertificationFormValue>(emptyForm);
  const [result, setResult] = useState<SaveAdminCertificationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const issuedCount = certifications.filter((certification) => certification.status === "issued").length;
  const expiredCount = certifications.filter((certification) => certification.status === "expired").length;
  const revokedCount = certifications.filter((certification) => certification.status === "revoked").length;
  const statusSummary = [
    { className: "is-total", label: "전체", value: certifications.length },
    { className: "is-issued", label: "발급", value: issuedCount },
    { className: "is-expired", label: "만료", value: expiredCount },
    { className: "is-revoked", label: "취소", value: revokedCount }
  ];
  const filteredCertifications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return certifications.filter((certification) => {
      const matchesKeyword =
        !keyword ||
        certification.course.toLowerCase().includes(keyword) ||
        certification.number.toLowerCase().includes(keyword) ||
        certification.user.toLowerCase().includes(keyword);
      const matchesStatus = !statusFilter || certification.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [certifications, search, statusFilter]);

  function openCreateModal() {
    setMode("create");
    setFormValue(emptyForm);
    setResult(null);
    setIsModalOpen(true);
  }

  function openEditModal(certification: AdminCertificationRow) {
    setMode("update");
    setFormValue({
      adminNote: certification.adminNote,
      certificateNumber: certification.number,
      courseTitle: certification.course,
      expiresAt: certification.expiresAt,
      issuedAt: certification.issuedAtRaw,
      status: certification.status,
      userEmail: certification.userEmail,
      verificationCode: certification.verificationCode
    });
    setResult(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isPending) {
      return;
    }

    setIsModalOpen(false);
    setResult(null);
  }

  function updateField(name: keyof CertificationFormValue, value: string) {
    setFormValue((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const nextResult = await saveAdminCertification(formValue);
      setResult(nextResult);

      if (nextResult.ok) {
        setIsModalOpen(false);
        setFormValue(emptyForm);
        router.refresh();
      }
    });
  }

  return (
    <section className="admin-certifications-manager">
      <div className="admin-certifications-toolbar">
        <div className="admin-certifications-summary" aria-label="자격 상태 요약">
          {statusSummary.map((item) => (
            <span className={item.className} key={item.label}>
              <strong>{item.value}</strong>
              {item.label}
            </span>
          ))}
        </div>
        <button className="admin-users-new-button" onClick={openCreateModal} type="button">
          <Plus size={15} />
          새 자격 등록
        </button>
      </div>

      <div className="admin-certifications-filter-bar">
        <label className="console-search-input">
          <Search size={16} />
          <span className="sr-only">자격명, 자격번호, 사용자 검색</span>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="자격명, 자격번호, 사용자 검색"
            value={search}
          />
        </label>
        <div className="admin-certifications-status-filter" aria-label="자격 상태 필터">
          <button className={!statusFilter ? "is-active" : undefined} onClick={() => setStatusFilter("")} type="button">
            전체
          </button>
          {adminCertificationStatuses.map((status) => (
            <button
              className={statusFilter === status ? "is-active" : undefined}
              key={status}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {getAdminCertificationStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="console-table-wrap">
        <table className="console-table">
          <thead>
            <tr>
              <th>자격명</th>
              <th>자격번호</th>
              <th>회원</th>
              <th>발급일</th>
              <th>만료일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertifications.length ? (
              filteredCertifications.map((certification) => (
                <tr key={certification.number}>
                  <td>
                    <span className="admin-certification-title-cell">
                      <ShieldCheck size={16} />
                      <strong>{certification.course}</strong>
                    </span>
                  </td>
                  <td>
                    <code className="admin-certification-number">{certification.number}</code>
                  </td>
                  <td>
                    <span className="admin-certification-user-cell">
                      <strong>{certification.user}</strong>
                      <small>{certification.userEmail || "이메일 미등록"}</small>
                    </span>
                  </td>
                  <td>{certification.issuedAt}</td>
                  <td>
                    <span className={certification.expiresAt ? undefined : "admin-certification-muted-date"}>
                      {certification.expiresAt ? <Clock3 size={14} /> : null}
                      {certification.expiresAtDisplay}
                    </span>
                  </td>
                  <td>
                    <AdminStatusBadge tone={getTone(certification.status)}>
                      {getAdminCertificationStatusLabel(certification.status)}
                    </AdminStatusBadge>
                  </td>
                  <td>
                    <button className="admin-users-edit-button" onClick={() => openEditModal(certification)} type="button">
                      <Pencil size={14} />
                      수정
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className="console-empty-state" role="status">
                    <ShieldCheck size={18} />
                    <span>등록된 자격 데이터가 없습니다.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div
          className="admin-users-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <form className="admin-users-modal" onSubmit={handleSubmit} noValidate role="dialog" aria-modal="true" aria-labelledby="admin-certification-modal-title">
            <div className="admin-users-modal-heading">
              <ShieldCheck size={22} />
              <div>
                <h3 id="admin-certification-modal-title">{mode === "create" ? "새 자격 등록" : "자격 수정"}</h3>
                <p>
                  {mode === "create"
                    ? "회원 이메일과 자격 정보를 입력해 발급 내역을 저장합니다."
                    : "기존 자격의 상태, 발급일, 검증 코드를 수정합니다."}
                </p>
              </div>
              <span className={`admin-users-mode-badge is-${formValue.status}`}>
                {getAdminCertificationStatusLabel(formValue.status)}
              </span>
              <button className="admin-users-modal-close" onClick={closeModal} type="button" aria-label="닫기">
                <X size={17} />
              </button>
            </div>

            <div className="admin-users-form-section">
              <div className="admin-users-form-section-title">
                <ShieldCheck size={16} />
                <strong>자격 정보</strong>
              </div>
              <div className="admin-editor-grid">
                <label>
                  회원 이메일
                  <input
                    name="userEmail"
                    onChange={(event) => updateField("userEmail", event.target.value)}
                    placeholder="member@example.com"
                    type="email"
                    value={formValue.userEmail}
                  />
                </label>
                <label>
                  자격명
                  <input
                    name="courseTitle"
                    onChange={(event) => updateField("courseTitle", event.target.value)}
                    placeholder="피부미용사 국가자격증"
                    value={formValue.courseTitle}
                  />
                </label>
                <label>
                  자격번호
                  <input
                    name="certificateNumber"
                    onChange={(event) => updateField("certificateNumber", event.target.value)}
                    placeholder="SMC-2026-001"
                    value={formValue.certificateNumber}
                  />
                </label>
                <label>
                  발급일
                  <input
                    name="issuedAt"
                    onChange={(event) => updateField("issuedAt", event.target.value)}
                    type="date"
                    value={formValue.issuedAt}
                  />
                </label>
                <label>
                  만료일
                  <input
                    name="expiresAt"
                    onChange={(event) => updateField("expiresAt", event.target.value)}
                    type="date"
                    value={formValue.expiresAt}
                  />
                </label>
                <label>
                  상태
                  <select name="status" onChange={(event) => updateField("status", event.target.value)} value={formValue.status}>
                    {adminCertificationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getAdminCertificationStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  검증 코드
                  <input
                    name="verificationCode"
                    onChange={(event) => updateField("verificationCode", event.target.value)}
                    placeholder="비워두면 자격번호 사용"
                    value={formValue.verificationCode}
                  />
                </label>
                <label className="full">
                  관리자 메모
                  <textarea
                    name="adminNote"
                    onChange={(event) => updateField("adminNote", event.target.value)}
                    placeholder="내부 확인 사항, 발급 근거, 운영 메모"
                    rows={3}
                    value={formValue.adminNote}
                  />
                </label>
              </div>
            </div>

            {result ? (
              <div className={result.ok ? "form-success" : "form-error full"} role="status">
                {result.ok ? <CheckCircle2 size={20} /> : null}
                <span>{result.message}</span>
              </div>
            ) : null}

            <div className="admin-editor-actions">
              <button className="primary-button" disabled={isPending} type="submit">
                <Save size={16} />
                <span>{isPending ? "저장 중" : mode === "create" ? "자격 등록" : "자격 수정 저장"}</span>
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
