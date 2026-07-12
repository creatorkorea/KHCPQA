"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { getCopy, localeLabels, locales, type Locale } from "@/lib/content";

type ProfileFormState = {
  name: string;
  email: string;
  country: string;
  preferredLanguage: Locale;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ProfileEditForm({ locale }: { locale: Locale }) {
  const t = getCopy(locale);
  const [form, setForm] = useState<ProfileFormState>({
    name: t.account.profile.fields[0]?.value ?? "",
    email: t.account.profile.fields[1]?.value ?? "",
    country: t.account.profile.fields[2]?.value ?? "",
    preferredLanguage: locale
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormState, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField<Key extends keyof ProfileFormState>(field: Key, value: ProfileFormState[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsSubmitted(false);
  }

  function validate() {
    const nextErrors: Partial<Record<keyof ProfileFormState, string>> = {};

    if (form.name.trim().length === 0) {
      nextErrors.name = t.account.profile.validation.required;
    }

    if (form.email.trim().length === 0) {
      nextErrors.email = t.account.profile.validation.required;
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = t.account.profile.validation.email;
    }

    if (form.country.trim().length === 0) {
      nextErrors.country = t.account.profile.validation.required;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(validate());
  }

  return (
    <section className="profile-edit-panel">
      <div className="section-heading">
        <span className="eyebrow">Profile</span>
        <h2>{t.account.profile.editTitle}</h2>
        <p>{t.account.profile.editLead}</p>
      </div>
      <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
        <label>
          {t.account.profile.fields[0]?.label}
          <input
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => updateField("name", event.target.value)}
            value={form.name}
          />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[1]?.label}
          <input
            aria-invalid={Boolean(errors.email)}
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
            value={form.email}
          />
          {errors.email ? <span className="form-error">{errors.email}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[2]?.label}
          <input
            aria-invalid={Boolean(errors.country)}
            onChange={(event) => updateField("country", event.target.value)}
            value={form.country}
          />
          {errors.country ? <span className="form-error">{errors.country}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[3]?.label}
          <select
            onChange={(event) => updateField("preferredLanguage", event.target.value as Locale)}
            value={form.preferredLanguage}
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeLabels[item]}
              </option>
            ))}
          </select>
        </label>
        {isSubmitted ? (
          <div className="form-success full" role="status">
            <CheckCircle2 size={20} />
            <span>
              <strong>{t.account.profile.successTitle}</strong>
              {t.account.profile.successMessage}
            </span>
          </div>
        ) : null}
        <button className="primary-button" type="submit">
          <Save size={16} />
          <span>{t.account.profile.saveCta}</span>
        </button>
      </form>
    </section>
  );
}
