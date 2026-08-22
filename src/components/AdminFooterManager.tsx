"use client";

import { CheckCircle2, Mail, MapPin, Phone, Save } from "lucide-react";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { saveAdminFooterSettings, type SaveAdminContentResult } from "@/app/admin/actions";
import { BrandLogoMark } from "@/components/BrandLogoMark";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { FooterSettings } from "@/lib/footer-settings";

export function AdminFooterManager({ initialSettings }: { initialSettings: FooterSettings }) {
  const [activeLocale, setActiveLocale] = useState<Locale>("ko");
  const [editor, setEditor] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SaveAdminContentResult | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const localized = editor.locales[activeLocale];

  useEffect(() => {
    if (!showSavedToast) return;
    const timeout = window.setTimeout(() => setShowSavedToast(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showSavedToast]);

  function updateShared(field: "email" | "phone", value: string) {
    setEditor((current) => ({ ...current, [field]: value }));
  }

  function updateLocalized(field: "address" | "description", value: string) {
    setEditor((current) => ({
      ...current,
      locales: {
        ...current.locales,
        [activeLocale]: { ...current.locales[activeLocale], [field]: value }
      }
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setShowSavedToast(false);

    startTransition(async () => {
      const nextResult = await saveAdminFooterSettings(editor);
      setResult(nextResult);
      setShowSavedToast(nextResult.ok);
    });
  }

  return (
    <div className="admin-footer-manager">
      {isPending ? <FooterSaveOverlay /> : null}
      <form className="console-panel admin-footer-form" onSubmit={handleSubmit}>
        <section className="admin-footer-section">
          <div className="admin-footer-section-heading">
            <span>01</span>
            <div><h2>공통 연락처</h2><p>모든 언어의 푸터에 동일하게 표시됩니다.</p></div>
          </div>
          <div className="admin-footer-shared-grid">
            <label><span><Phone size={15} /> 전화번호</span><input onChange={(event) => updateShared("phone", event.target.value)} required value={editor.phone} /></label>
            <label><span><Mail size={15} /> 이메일</span><input onChange={(event) => updateShared("email", event.target.value)} required type="email" value={editor.email} /></label>
          </div>
        </section>

        <section className="admin-footer-section">
          <div className="admin-footer-section-heading">
            <span>02</span>
            <div><h2>언어별 콘텐츠</h2><p>로고 아래 문구와 주소를 언어별로 관리합니다.</p></div>
          </div>
          <div className="admin-footer-localized-editor">
            <div className="admin-footer-locale-tabs" role="tablist" aria-label="푸터 언어 선택">
              {locales.map((locale) => <button aria-selected={activeLocale === locale} className={activeLocale === locale ? "is-active" : undefined} key={locale} onClick={() => setActiveLocale(locale)} role="tab" type="button"><span>{localeLabels[locale]}</span><small>{locale}</small></button>)}
            </div>
            <div className="admin-footer-copy-grid">
              <label>로고 아래 문구<textarea onChange={(event) => updateLocalized("description", event.target.value)} required rows={4} value={localized.description} /><small>줄바꿈은 공개 푸터에도 그대로 반영됩니다.</small></label>
              <label>주소<textarea onChange={(event) => updateLocalized("address", event.target.value)} required rows={4} value={localized.address} /></label>
            </div>
          </div>
        </section>

        <section className="admin-footer-preview" aria-label="푸터 미리보기">
          <div className="admin-footer-preview-heading"><span>미리보기</span><strong>{localeLabels[activeLocale]}</strong></div>
          <div className="admin-footer-preview-content">
            <div className="admin-footer-preview-brand"><div><BrandLogoMark /><strong>KAHC</strong></div><p>{localized.description}</p></div>
            <div className="admin-footer-preview-contact"><strong>고객센터</strong><span><Phone size={14} /> {editor.phone}</span><span><Mail size={14} /> {editor.email}</span><span><MapPin size={14} /> {localized.address}</span></div>
          </div>
        </section>

        {result && !result.ok ? <div className="form-error admin-footer-error" role="alert">{result.message}</div> : null}
        <div className="admin-footer-action-bar"><span>저장하면 전체 공개 페이지의 푸터에 반영됩니다.</span><button className="primary-button" disabled={isPending} type="submit"><Save size={16} /> 변경사항 저장</button></div>
      </form>

      {showSavedToast ? <div className="admin-course-undo-toast admin-course-feedback-toast" role="status" aria-live="polite"><CheckCircle2 size={17} /><span>푸터 설정이 저장되었습니다.</span></div> : null}
    </div>
  );
}

function FooterSaveOverlay() {
  return (
    <div className="admin-action-overlay" role="status" aria-live="assertive" aria-label="푸터 설정 저장 중">
      <div className="admin-action-loader">
        <span className="admin-action-spinner" aria-hidden="true" />
        <strong>푸터 설정을 저장하고 있습니다</strong>
        <p>공통 연락처와 언어별 콘텐츠를 공개 화면에 반영하고 있습니다.</p>
        <span className="admin-action-progress" aria-hidden="true"><span /></span>
      </div>
    </div>
  );
}
