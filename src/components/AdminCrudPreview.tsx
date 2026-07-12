"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2, FilePenLine, ImagePlus, Save, ShieldCheck } from "lucide-react";

type AdminFormType = "content" | "inquiry" | "certification" | "banner";

type AdminField = {
  label: string;
  name: string;
  type?: "input" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

const adminForms: Record<AdminFormType, {
  title: string;
  description: string;
  icon: typeof FilePenLine;
  fields: AdminField[];
}> = {
  content: {
    title: "콘텐츠 등록/수정",
    description: "페이지, 과정, 커뮤니티 게시글의 언어별 콘텐츠를 관리합니다.",
    icon: FilePenLine,
    fields: [
      { label: "콘텐츠 유형", name: "contentType", type: "select", options: ["Page", "Course", "Activity", "Review"], required: true },
      { label: "언어", name: "locale", type: "select", options: ["ko", "en", "es"], required: true },
      { label: "제목", name: "title", placeholder: "콘텐츠 제목", required: true },
      { label: "게시 상태", name: "status", type: "select", options: ["draft", "translated", "reviewed", "published", "archived"], required: true },
      { label: "원본 URL", name: "sourceUrl", placeholder: "https://www.smc365.ac/..." },
      { label: "본문 요약", name: "summary", type: "textarea", placeholder: "관리자 목록과 SEO에 사용할 요약" }
    ]
  },
  inquiry: {
    title: "문의 처리",
    description: "문의 상태와 담당자 메모를 관리합니다.",
    icon: Save,
    fields: [
      { label: "접수번호", name: "receipt", placeholder: "KHCPQA-2026-PREVIEW", required: true },
      { label: "문의 유형", name: "inquiryType", type: "select", options: ["partner", "student", "course", "general"], required: true },
      { label: "처리 상태", name: "inquiryStatus", type: "select", options: ["new", "in progress", "answered", "closed"], required: true },
      { label: "담당자", name: "manager", placeholder: "담당자명" },
      { label: "담당자 메모", name: "memo", type: "textarea", placeholder: "후속 연락, 요청 사항, 내부 메모" }
    ]
  },
  certification: {
    title: "자격 데이터 등록",
    description: "회원의 자격번호, 발급일, 상태, 검증 코드를 관리합니다.",
    icon: ShieldCheck,
    fields: [
      { label: "사용자", name: "user", placeholder: "회원명 또는 이메일", required: true },
      { label: "과정", name: "course", placeholder: "과정명", required: true },
      { label: "자격번호", name: "certificateNumber", placeholder: "SMC-2026-001", required: true },
      { label: "발급일", name: "issuedAt", placeholder: "2026-05-18", required: true },
      { label: "상태", name: "certificateStatus", type: "select", options: ["active", "expired", "revoked", "pending"], required: true },
      { label: "검증 코드", name: "verificationCode", placeholder: "PUBLIC-CODE-001" }
    ]
  },
  banner: {
    title: "팝업/배너 등록",
    description: "노출 위치, 기간, 링크를 관리합니다.",
    icon: ImagePlus,
    fields: [
      { label: "배너명", name: "bannerTitle", placeholder: "파트너 상담 CTA", required: true },
      { label: "노출 위치", name: "placement", type: "select", options: ["home", "curriculum", "activities", "global"], required: true },
      { label: "게시 상태", name: "bannerStatus", type: "select", options: ["draft", "published", "archived"], required: true },
      { label: "시작일", name: "startsAt", placeholder: "2026-07-12" },
      { label: "종료일", name: "endsAt", placeholder: "2026-08-12" },
      { label: "연결 URL", name: "targetUrl", placeholder: "/ko/partner-inquiry" }
    ]
  }
};

const formOrder: AdminFormType[] = ["content", "inquiry", "certification", "banner"];

export function AdminCrudPreview() {
  const [activeForm, setActiveForm] = useState<AdminFormType>("content");
  const [submittedForm, setSubmittedForm] = useState<AdminFormType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentForm = adminForms[activeForm];
  const ActiveIcon = currentForm.icon;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};

    currentForm.fields.forEach((field) => {
      if (field.required && String(formData.get(field.name) ?? "").trim().length === 0) {
        nextErrors[field.name] = "필수 입력 항목입니다.";
      }
    });

    setErrors(nextErrors);
    setSubmittedForm(Object.keys(nextErrors).length === 0 ? activeForm : null);
  }

  function switchForm(nextForm: AdminFormType) {
    setActiveForm(nextForm);
    setSubmittedForm(null);
    setErrors({});
  }

  return (
    <section className="admin-crud-preview">
      <div className="admin-crud-tabs" role="tablist" aria-label="Admin editor forms">
        {formOrder.map((formKey) => {
          const form = adminForms[formKey];
          const Icon = form.icon;
          const isActive = activeForm === formKey;

          return (
            <button
              aria-selected={isActive}
              className={isActive ? "is-active" : undefined}
              key={formKey}
              onClick={() => switchForm(formKey)}
              role="tab"
              type="button"
            >
              <Icon size={16} />
              <span>{form.title}</span>
            </button>
          );
        })}
      </div>
      <form className="admin-editor-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-editor-heading">
          <ActiveIcon size={22} />
          <div>
            <h3>{currentForm.title}</h3>
            <p>{currentForm.description}</p>
          </div>
        </div>
        <div className="admin-editor-grid">
          {currentForm.fields.map((field) => (
            <label className={field.type === "textarea" ? "full" : undefined} key={field.name}>
              {field.label}
              {field.type === "select" ? (
                <select aria-invalid={Boolean(errors[field.name])} name={field.name} defaultValue="">
                  <option value="" disabled>선택</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea aria-invalid={Boolean(errors[field.name])} name={field.name} placeholder={field.placeholder} rows={5} />
              ) : (
                <input aria-invalid={Boolean(errors[field.name])} name={field.name} placeholder={field.placeholder} />
              )}
              {errors[field.name] ? <span className="form-error">{errors[field.name]}</span> : null}
            </label>
          ))}
        </div>
        {submittedForm === activeForm ? (
          <div className="form-success" role="status">
            <CheckCircle2 size={20} />
            <span>
              <strong>검수용 저장 흐름 확인</strong>
              실제 저장은 관리자 API와 데이터베이스 연결 후 활성화됩니다.
            </span>
          </div>
        ) : null}
        <button className="primary-button" type="submit">
          <Save size={16} />
          <span>저장 미리보기</span>
        </button>
      </form>
    </section>
  );
}
