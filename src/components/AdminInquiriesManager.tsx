"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, MessageSquarePlus, Pencil, Save, Trash2, X } from "lucide-react";
import {
  createAdminInquiry,
  deleteAdminInquiry,
  updateAdminInquiry,
  type SaveAdminInquiryResult
} from "@/app/admin/actions";
import {
  adminInquiryLocales,
  adminInquiryStatuses,
  adminInquiryTypes,
  getAdminInquiryStatusLabel,
  getAdminInquiryTypeLabel
} from "@/lib/admin-inquiries";
import type { AdminInquiryRow } from "@/lib/admin-data";

type Mode = "create" | "update";

type InquiryFormValue = {
  country: string;
  email: string;
  inquiryType: string;
  locale: string;
  managerNote: string;
  message: string;
  name: string;
  organization: string;
  phone: string;
  status: string;
};

const emptyForm: InquiryFormValue = {
  country: "",
  email: "",
  inquiryType: "general",
  locale: "ko",
  managerNote: "",
  message: "",
  name: "",
  organization: "",
  phone: "",
  status: "new"
};

export function AdminInquiriesManager({ inquiries }: { inquiries: AdminInquiryRow[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [selectedReceipt, setSelectedReceipt] = useState("");
  const [formValue, setFormValue] = useState<InquiryFormValue>(emptyForm);
  const [result, setResult] = useState<SaveAdminInquiryResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const selectedInquiry = inquiries.find((inquiry) => inquiry.receipt === selectedReceipt) ?? null;
  const newCount = inquiries.filter((inquiry) => inquiry.status === "new").length;
  const reviewCount = inquiries.filter((inquiry) => inquiry.status === "in_review").length;
  const answeredCount = inquiries.filter((inquiry) => inquiry.status === "answered").length;
  const closedCount = inquiries.filter((inquiry) => inquiry.status === "closed").length;

  function openCreateModal() {
    setMode("create");
    setSelectedReceipt("");
    setFormValue(emptyForm);
    setResult(null);
    setIsModalOpen(true);
  }

  function openEditModal(inquiry: AdminInquiryRow) {
    setMode("update");
    setSelectedReceipt(inquiry.receipt);
    setFormValue({
      country: inquiry.country === "-" ? "" : inquiry.country,
      email: inquiry.email,
      inquiryType: inquiry.type,
      locale: inquiry.locale || "ko",
      managerNote: inquiry.managerNote,
      message: inquiry.message,
      name: inquiry.name,
      organization: inquiry.organization === "-" ? "" : inquiry.organization,
      phone: inquiry.phone,
      status: inquiry.status
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

  function updateField(name: keyof InquiryFormValue, value: string) {
    setFormValue((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const nextResult = mode === "create"
        ? await createAdminInquiry(formValue)
        : await updateAdminInquiry({
            managerNote: formValue.managerNote,
            receipt: selectedReceipt,
            status: formValue.status
          });
      setResult(nextResult);

      if (nextResult.ok) {
        setIsModalOpen(false);
        setFormValue(emptyForm);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!selectedReceipt) {
      return;
    }

    const confirmed = window.confirm("선택한 문의를 삭제할까요?");

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const nextResult = await deleteAdminInquiry({ receipt: selectedReceipt });
      setResult(nextResult);

      if (nextResult.ok) {
        setIsModalOpen(false);
        setSelectedReceipt("");
        setFormValue(emptyForm);
        router.refresh();
      }
    });
  }

  return (
    <section className="admin-inquiries-manager">
      <div className="admin-inquiries-toolbar">
        <div className="admin-inquiries-summary" aria-label="문의 상태 요약">
          <span><strong>{inquiries.length}</strong>전체</span>
          <span><strong>{newCount}</strong>신규</span>
          <span><strong>{reviewCount}</strong>검토중</span>
          <span><strong>{answeredCount}</strong>답변</span>
          <span><strong>{closedCount}</strong>종료</span>
        </div>
        <button className="admin-inquiries-new-button" onClick={openCreateModal} type="button">
          <MessageSquarePlus size={15} />
          새 문의
        </button>
      </div>

      <div className="admin-inquiries-table-wrap">
        <table className="admin-inquiries-table">
          <thead>
            <tr>
              <th>접수번호</th>
              <th>이름</th>
              <th>연락처</th>
              <th>유형</th>
              <th>상태</th>
              <th>접수일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.receipt}>
                  <td>
                    <strong>{inquiry.receipt}</strong>
                    <span>{inquiry.message}</span>
                  </td>
                  <td>{inquiry.name}</td>
                  <td>
                    <strong>{inquiry.email}</strong>
                    <span>{inquiry.phone || "-"}</span>
                  </td>
                  <td>{getAdminInquiryTypeLabel(inquiry.type)}</td>
                  <td>
                    <span className={`admin-inquiry-status is-${inquiry.status}`}>
                      {getAdminInquiryStatusLabel(inquiry.status)}
                    </span>
                  </td>
                  <td>{inquiry.submittedAt}</td>
                  <td>
                    <button className="admin-inquiries-edit-button" onClick={() => openEditModal(inquiry)} type="button">
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
                    <FileText size={18} />
                    <span>등록된 문의 데이터가 없습니다.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div
          className="admin-inquiries-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <form className="admin-inquiries-modal" onSubmit={handleSubmit} noValidate role="dialog" aria-modal="true" aria-labelledby="admin-inquiry-modal-title">
            <div className="admin-inquiries-modal-heading">
              <MessageSquarePlus size={22} />
              <div>
                <h3 id="admin-inquiry-modal-title">{mode === "create" ? "새 문의 등록" : selectedInquiry?.receipt ?? "문의 수정"}</h3>
                <p>{mode === "create" ? "전화/이메일로 접수된 문의를 관리자 화면에 등록합니다." : selectedInquiry?.message}</p>
              </div>
              <span className={`admin-inquiry-status is-${formValue.status}`}>
                {getAdminInquiryStatusLabel(formValue.status)}
              </span>
              <button className="admin-inquiries-modal-close" onClick={closeModal} type="button" aria-label="닫기">
                <X size={17} />
              </button>
            </div>

            <div className="admin-inquiries-form-section">
              <div className="admin-inquiries-form-section-title">
                <FileText size={16} />
                <strong>문의 정보</strong>
              </div>
              <div className="admin-editor-grid">
                <label>
                  이름
                  <input
                    disabled={mode === "update"}
                    name="name"
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="홍길동"
                    value={formValue.name}
                  />
                </label>
                <label>
                  이메일
                  <input
                    disabled={mode === "update"}
                    name="email"
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="member@example.com"
                    type="email"
                    value={formValue.email}
                  />
                </label>
                <label>
                  연락처
                  <input
                    disabled={mode === "update"}
                    name="phone"
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="010-0000-0000"
                    value={formValue.phone}
                  />
                </label>
                <label>
                  기관
                  <input
                    disabled={mode === "update"}
                    name="organization"
                    onChange={(event) => updateField("organization", event.target.value)}
                    placeholder="기관명"
                    value={formValue.organization}
                  />
                </label>
                <label>
                  국가
                  <input
                    disabled={mode === "update"}
                    name="country"
                    onChange={(event) => updateField("country", event.target.value)}
                    placeholder="Korea"
                    value={formValue.country}
                  />
                </label>
                <label>
                  문의 유형
                  <select
                    disabled={mode === "update"}
                    name="inquiryType"
                    onChange={(event) => updateField("inquiryType", event.target.value)}
                    value={formValue.inquiryType}
                  >
                    {adminInquiryTypes.map((type) => (
                      <option key={type} value={type}>{getAdminInquiryTypeLabel(type)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  언어
                  <select
                    disabled={mode === "update"}
                    name="locale"
                    onChange={(event) => updateField("locale", event.target.value)}
                    value={formValue.locale}
                  >
                    {adminInquiryLocales.map((locale) => (
                      <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  문의 내용
                  <textarea
                    disabled={mode === "update"}
                    name="message"
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="문의 내용을 입력하세요."
                    rows={4}
                    value={formValue.message}
                  />
                </label>
              </div>
            </div>

            <div className="admin-inquiries-form-section">
              <div className="admin-inquiries-form-section-title">
                <Save size={16} />
                <strong>처리 정보</strong>
              </div>
              <div className="admin-editor-grid">
                <label>
                  처리 상태
                  <select
                    name="status"
                    onChange={(event) => updateField("status", event.target.value)}
                    value={formValue.status}
                  >
                    {adminInquiryStatuses.map((status) => (
                      <option key={status} value={status}>{getAdminInquiryStatusLabel(status)}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  담당자 메모
                  <textarea
                    name="managerNote"
                    onChange={(event) => updateField("managerNote", event.target.value)}
                    placeholder="후속 연락, 답변 내용, 내부 메모"
                    rows={4}
                    value={formValue.managerNote}
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
                <span>{isPending ? "..." : mode === "create" ? "문의 등록" : "문의 수정"}</span>
              </button>
              {mode === "update" ? (
                <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button">
                  <Trash2 size={16} />
                  <span>문의 삭제</span>
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
