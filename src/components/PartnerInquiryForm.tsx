"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";

type FieldName = "name" | "organization" | "email" | "country" | "message" | "consent";

type FormState = Record<Exclude<FieldName, "consent">, string> & {
  consent: boolean;
};

const initialFormState: FormState = {
  name: "",
  organization: "",
  email: "",
  country: "",
  message: "",
  consent: false
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function PartnerInquiryForm({ locale }: { locale: Locale }) {
  const t = getCopy(locale);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const receiptNumber = `KHCPQA-${new Date().getFullYear()}-PREVIEW`;

  function updateField(field: Exclude<FieldName, "consent">, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsSubmitted(false);
  }

  function updateConsent(value: boolean) {
    setForm((current) => ({ ...current, consent: value }));
    setErrors((current) => ({ ...current, consent: undefined }));
    setIsSubmitted(false);
  }

  function validate() {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    (["name", "organization", "email", "country", "message"] as const).forEach((field) => {
      if (form[field].trim().length === 0) {
        nextErrors[field] = t.partnerInquiry.validation.required;
      }
    });

    if (form.email.trim().length > 0 && !isValidEmail(form.email)) {
      nextErrors.email = t.partnerInquiry.validation.email;
    }

    if (!form.consent) {
      nextErrors.consent = t.partnerInquiry.validation.consent;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (validate()) {
      setIsSubmitted(true);
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
      <label>
        {t.partnerInquiry.fields.name}
        <input
          aria-invalid={Boolean(errors.name)}
          name="name"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder={t.partnerInquiry.fields.namePlaceholder}
          value={form.name}
        />
        {errors.name ? <span className="form-error">{errors.name}</span> : null}
      </label>
      <label>
        {t.partnerInquiry.fields.organization}
        <input
          aria-invalid={Boolean(errors.organization)}
          name="organization"
          onChange={(event) => updateField("organization", event.target.value)}
          placeholder={t.partnerInquiry.fields.organizationPlaceholder}
          value={form.organization}
        />
        {errors.organization ? <span className="form-error">{errors.organization}</span> : null}
      </label>
      <label>
        {t.partnerInquiry.fields.email}
        <input
          aria-invalid={Boolean(errors.email)}
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder={t.partnerInquiry.fields.emailPlaceholder}
          type="email"
          value={form.email}
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>
      <label>
        {t.partnerInquiry.fields.country}
        <input
          aria-invalid={Boolean(errors.country)}
          name="country"
          onChange={(event) => updateField("country", event.target.value)}
          placeholder={t.partnerInquiry.fields.countryPlaceholder}
          value={form.country}
        />
        {errors.country ? <span className="form-error">{errors.country}</span> : null}
      </label>
      <label className="full">
        {t.partnerInquiry.fields.message}
        <textarea
          aria-invalid={Boolean(errors.message)}
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          placeholder={t.partnerInquiry.fields.messagePlaceholder}
          rows={6}
          value={form.message}
        />
        {errors.message ? <span className="form-error">{errors.message}</span> : null}
      </label>
      <label className="checkbox full">
        <input checked={form.consent} onChange={(event) => updateConsent(event.target.checked)} type="checkbox" />
        <span>{t.partnerInquiry.fields.consent}</span>
      </label>
      {errors.consent ? <span className="form-error full">{errors.consent}</span> : null}
      {isSubmitted ? (
        <section className="inquiry-receipt full" role="status">
          <div className="form-success">
            <CheckCircle2 size={20} />
            <span>
              <strong>{t.partnerInquiry.successTitle}</strong>
              {t.partnerInquiry.successMessage}
            </span>
          </div>
          <div className="receipt-grid">
            <article>
              <span>{t.partnerInquiry.receiptLabel}</span>
              <strong>{receiptNumber}</strong>
            </article>
            <article>
              <span>{t.partnerInquiry.submittedSummaryTitle}</span>
              <dl>
                <div>
                  <dt>{t.partnerInquiry.fields.name}</dt>
                  <dd>{form.name}</dd>
                </div>
                <div>
                  <dt>{t.partnerInquiry.fields.organization}</dt>
                  <dd>{form.organization}</dd>
                </div>
                <div>
                  <dt>{t.partnerInquiry.fields.email}</dt>
                  <dd>{form.email}</dd>
                </div>
                <div>
                  <dt>{t.partnerInquiry.fields.country}</dt>
                  <dd>{form.country}</dd>
                </div>
              </dl>
            </article>
            <article>
              <span>{t.partnerInquiry.nextStepTitle}</span>
              <ol>
                {t.partnerInquiry.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          </div>
        </section>
      ) : null}
      <button className="primary-button" type="submit">
        {t.formSubmit}
      </button>
    </form>
  );
}
