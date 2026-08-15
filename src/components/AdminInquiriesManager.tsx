"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Pencil, Save, Trash2, X } from "lucide-react";
import {
  deleteAdminInquiry,
  updateAdminInquiry,
  type SaveAdminInquiryResult
} from "@/app/admin/actions";
import {
  adminInquiryStatuses,
  getAdminInquiryStatusLabel,
  getAdminInquiryTypeLabel
} from "@/lib/admin-inquiries";
import type { AdminInquiryRow } from "@/lib/admin-data";

type InquiryFormValue = {
  managerNote: string;
  status: string;
};

export function AdminInquiriesManager({ inquiries }: { inquiries: AdminInquiryRow[] }) {
  const router = useRouter();
  const [selectedReceipt, setSelectedReceipt] = useState("");
  const [formValue, setFormValue] = useState<InquiryFormValue>({ managerNote: "", status: "new" });
  const [result, setResult] = useState<SaveAdminInquiryResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const selectedInquiry = inquiries.find((inquiry) => inquiry.receipt === selectedReceipt) ?? null;
  const newCount = inquiries.filter((inquiry) => inquiry.status === "new").length;
  const reviewCount = inquiries.filter((inquiry) => inquiry.status === "in_review").length;
  const answeredCount = inquiries.filter((inquiry) => inquiry.status === "answered").length;
  const closedCount = inquiries.filter((inquiry) => inquiry.status === "closed").length;

  function openEditModal(inquiry: AdminInquiryRow) {
    setSelectedReceipt(inquiry.receipt);
    setFormValue({
      managerNote: inquiry.managerNote,
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
      const nextResult = await updateAdminInquiry({
        managerNote: formValue.managerNote,
        receipt: selectedReceipt,
        status: formValue.status
      });
      setResult(nextResult);

      if (nextResult.ok) {
        setIsModalOpen(false);
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
      </div>

      <div className="admin-inquiries-table-wrap">
        <table className="admin-inquiries-table">
          <colgroup>
            <col className="admin-inquiries-col-message" />
            <col className="admin-inquiries-col-name" />
            <col className="admin-inquiries-col-contact" />
            <col className="admin-inquiries-col-type" />
            <col className="admin-inquiries-col-status" />
            <col className="admin-inquiries-col-date" />
            <col className="admin-inquiries-col-action" />
          </colgroup>
          <thead>
            <tr>
              <th>문의 내용</th>
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
                  <td className="admin-inquiries-message-cell">
                    <strong className="admin-inquiries-message-title">{inquiry.message}</strong>
                    <span className="admin-inquiries-message-preview">{inquiry.message}</span>
                  </td>
                  <td className="admin-inquiries-person-cell">
                    <strong>{inquiry.name}</strong>
                  </td>
                  <td className="admin-inquiries-contact-cell">
                    <strong title={inquiry.email}>{inquiry.email}</strong>
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
                      처리
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

      {isModalOpen && selectedInquiry ? (
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
              <FileText size={22} />
              <div>
                <h3 id="admin-inquiry-modal-title">{selectedInquiry.receipt}</h3>
                <p>{selectedInquiry.message}</p>
              </div>
              <span className={`admin-inquiry-status is-${formValue.status}`}>
                {getAdminInquiryStatusLabel(formValue.status)}
              </span>
              <button className="admin-inquiries-modal-close" onClick={closeModal} type="button" aria-label="닫기">
                <X size={17} />
              </button>
            </div>

            <div className="admin-inquiries-detail-grid">
              <dl>
                <div>
                  <dt>이름</dt>
                  <dd>{selectedInquiry.name}</dd>
                </div>
                <div>
                  <dt>이메일</dt>
                  <dd>{selectedInquiry.email}</dd>
                </div>
                <div>
                  <dt>연락처</dt>
                  <dd>{selectedInquiry.phone || "-"}</dd>
                </div>
                <div>
                  <dt>기관</dt>
                  <dd>{selectedInquiry.organization}</dd>
                </div>
                <div>
                  <dt>국가</dt>
                  <dd>{selectedInquiry.country}</dd>
                </div>
                <div>
                  <dt>문의 유형</dt>
                  <dd>{getAdminInquiryTypeLabel(selectedInquiry.type)}</dd>
                </div>
              </dl>
              <div className="admin-inquiries-message-box">
                <strong>문의 내용</strong>
                <p>{selectedInquiry.message}</p>
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
                <span>{isPending ? "..." : "문의 처리 저장"}</span>
              </button>
              <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button">
                <Trash2 size={16} />
                <span>문의 삭제</span>
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
