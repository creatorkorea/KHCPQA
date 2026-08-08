"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import type { ProfileFormValue } from "@/lib/account-data";
import { getCopy, getCourses, localeLabels, locales, type Locale } from "@/lib/content";
import { countryOptions, getCountryDialCode, getCountryPhonePlaceholder } from "@/lib/countries";
import { formatPhoneNumber, normalizePhoneNumber } from "@/lib/phone";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

type ProfileFormState = ProfileFormValue & {
  form: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ProfileEditForm({ initialProfile, locale }: { initialProfile: ProfileFormValue; locale: Locale }) {
  const t = getCopy(locale);
  const courses = getCourses(locale);
  const [form, setForm] = useState<ProfileFormValue>(initialProfile);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormState, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<Key extends keyof ProfileFormValue>(field: Key, value: ProfileFormValue[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsSubmitted(false);
  }

  function updateCountry(value: string) {
    setForm((current) => ({
      ...current,
      country: value,
      phone: current.phone ? formatPhoneNumber(current.phone, value) : current.phone
    }));
    setErrors((current) => ({ ...current, country: undefined, phone: undefined }));
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

    if (form.phone.trim().length === 0) {
      nextErrors.phone = t.account.profile.validation.required;
    }

    if (form.country.trim().length === 0) {
      nextErrors.country = t.account.profile.validation.required;
    }

    if (!nextErrors.phone && form.phone !== formatPhoneNumber(form.phone, form.country)) {
      setForm((current) => ({ ...current, phone: formatPhoneNumber(current.phone, current.country) }));
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    if (hasSupabaseBrowserEnv()) {
      const supabase = createClient();
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrors({ form: t.login.validation.emailRequired });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          country: form.country.trim(),
          full_name: form.name.trim(),
          interested_course: form.interestedCourse.trim() || null,
          marketing_opt_in: form.marketingOptIn,
          phone: normalizePhoneNumber(form.phone, form.country),
          preferred_locale: form.preferredLanguage
        })
        .eq("id", user.id);

      if (error) {
        setErrors({ form: error.message });
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  return (
    <section className="profile-edit-panel">
      <div className="section-heading">
        <span className="eyebrow">{t.account.profile.title}</span>
        <h2>{t.account.profile.editTitle}</h2>
        <p>{t.account.profile.editLead}</p>
      </div>
      <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
        <label>
          {t.account.profile.fields[0]?.label}
          <input
            aria-invalid={Boolean(errors.name)}
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            value={form.name}
          />
          {errors.name ? <span className="form-error">{errors.name}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[1]?.label}
          <input
            aria-invalid={Boolean(errors.email)}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
            value={form.email}
          />
          {errors.email ? <span className="form-error">{errors.email}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[3]?.label}
          <select
            aria-invalid={Boolean(errors.country)}
            name="country"
            onChange={(event) => updateCountry(event.target.value)}
            value={form.country}
          >
            <option value="">{t.signup.countryPlaceholder}</option>
            {countryOptions.map((country) => (
              <option key={country.value} value={country.value}>
                {country.labels[locale]}
              </option>
            ))}
          </select>
          {errors.country ? <span className="form-error">{errors.country}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[2]?.label}
          <div className="phone-input-group">
            <span className="phone-dial-code">{getCountryDialCode(form.country) || "+"}</span>
            <input
              aria-invalid={Boolean(errors.phone)}
              autoComplete="tel"
              name="phone"
              onBlur={(event) => updateField("phone", formatPhoneNumber(event.target.value, form.country))}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder={form.country ? getCountryPhonePlaceholder(form.country) : t.signup.phonePlaceholder}
              type="tel"
              value={form.phone}
            />
          </div>
          {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
        </label>
        <label>
          {t.account.profile.fields[4]?.label}
          <select
            name="interestedCourse"
            onChange={(event) => updateField("interestedCourse", event.target.value)}
            value={form.interestedCourse}
          >
            <option value="">{t.signup.interestedCoursePlaceholder}</option>
            {courses.map((course) => (
              <option key={course.slug} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.account.profile.fields[6]?.label}
          <select
            name="preferredLanguage"
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
        <label className="checkbox full">
          <input
            checked={form.marketingOptIn}
            name="marketingOptIn"
            onChange={(event) => updateField("marketingOptIn", event.target.checked)}
            type="checkbox"
          />
          <span>{t.signup.marketingConsent}</span>
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
        {errors.form ? <span className="form-error full">{errors.form}</span> : null}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          <Save size={16} />
          <span>{isSubmitting ? "..." : t.account.profile.saveCta}</span>
        </button>
      </form>
    </section>
  );
}
