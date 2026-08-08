"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { getCopy, getCourses, type Locale } from "@/lib/content";
import { countryOptions } from "@/lib/countries";
import { buildAuthCallbackUrl } from "@/lib/site-url";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

type SignupField =
  | "name"
  | "email"
  | "phone"
  | "country"
  | "interestedCourse"
  | "password"
  | "confirmPassword"
  | "consent"
  | "marketingOptIn";

type SignupState = Record<Exclude<SignupField, "consent" | "marketingOptIn">, string> & {
  consent: boolean;
  marketingOptIn: boolean;
};

const initialSignupState: SignupState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  interestedCourse: "",
  password: "",
  confirmPassword: "",
  consent: false,
  marketingOptIn: false
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isEmailRateLimitError(message: string) {
  return message.toLowerCase().includes("email rate limit");
}

function isExistingAccountError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("already registered") || normalized.includes("already exists");
}

export function SignupForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = getCopy(locale);
  const courses = getCourses(locale);
  const [form, setForm] = useState<SignupState>(initialSignupState);
  const [errors, setErrors] = useState<Partial<Record<SignupField | "form", string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: Exclude<SignupField, "consent" | "marketingOptIn">, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsSubmitted(false);
  }

  function updateConsent(value: boolean) {
    setForm((current) => ({ ...current, consent: value }));
    setErrors((current) => ({ ...current, consent: undefined }));
    setIsSubmitted(false);
  }

  function updateMarketingOptIn(value: boolean) {
    setForm((current) => ({ ...current, marketingOptIn: value }));
    setIsSubmitted(false);
  }

  function validate() {
    const nextErrors: Partial<Record<SignupField, string>> = {};

    (["name", "email", "phone", "country", "password", "confirmPassword"] as const).forEach((field) => {
      if (form[field].trim().length === 0) {
        nextErrors[field] = t.signup.validation.required;
      }
    });

    if (form.email.trim().length > 0 && !isValidEmail(form.email)) {
      nextErrors.email = t.signup.validation.email;
    }

    if (form.password.length > 0 && form.password.length < 8) {
      nextErrors.password = t.signup.validation.passwordLength;
    }

    if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = t.signup.validation.passwordMatch;
    }

    if (!form.consent) {
      nextErrors.consent = t.signup.validation.consent;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      setIsSubmitted(false);
      return;
    }

    if (!hasSupabaseBrowserEnv()) {
      setErrors({ form: t.signup.configurationError });
      setIsSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: buildAuthCallbackUrl(locale, "account"),
        data: {
          country: form.country,
          full_name: form.name,
          interested_course: form.interestedCourse,
          marketing_opt_in: form.marketingOptIn,
          phone: form.phone,
          preferred_locale: locale,
          role: "user"
        }
      }
    });
    setIsSubmitting(false);

    if (error) {
      const message = error.message;
      const formError = isEmailRateLimitError(message)
        ? t.signup.rateLimitError
        : isExistingAccountError(message)
          ? t.signup.existingAccountError
          : message;
      setErrors({ form: formError });
      setIsSubmitted(false);
      return;
    }

    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setErrors({ form: t.signup.existingAccountError });
      setIsSubmitted(false);
      return;
    }

    if (data.session) {
      router.replace(`/${locale}/account`);
      return;
    }

    setIsSubmitted(true);
  }

  return (
    <form className="auth-card signup-card" onSubmit={handleSubmit} noValidate>
      <UserPlus size={28} />
      <label>
        {t.signup.name}
        <input
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
          name="name"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder={t.signup.namePlaceholder}
          value={form.name}
        />
        {errors.name ? <span className="form-error">{errors.name}</span> : null}
      </label>
      <label>
        {t.signup.email}
        <input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder={t.signup.emailPlaceholder}
          type="email"
          value={form.email}
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>
      <label>
        {t.signup.phone}
        <input
          aria-invalid={Boolean(errors.phone)}
          autoComplete="tel"
          name="phone"
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder={t.signup.phonePlaceholder}
          type="tel"
          value={form.phone}
        />
        {errors.phone ? <span className="form-error">{errors.phone}</span> : null}
      </label>
      <label>
        {t.signup.country}
        <select
          aria-invalid={Boolean(errors.country)}
          autoComplete="country-name"
          name="country"
          onChange={(event) => updateField("country", event.target.value)}
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
        {t.signup.interestedCourse}
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
        {t.signup.password}
        <input
          aria-invalid={Boolean(errors.password)}
          autoComplete="new-password"
          onChange={(event) => updateField("password", event.target.value)}
          placeholder={t.signup.passwordPlaceholder}
          type="password"
          value={form.password}
        />
        {errors.password ? <span className="form-error">{errors.password}</span> : null}
      </label>
      <label>
        {t.signup.confirmPassword}
        <input
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder={t.signup.confirmPasswordPlaceholder}
          type="password"
          value={form.confirmPassword}
        />
        {errors.confirmPassword ? <span className="form-error">{errors.confirmPassword}</span> : null}
      </label>
      <label className="checkbox">
        <input checked={form.consent} name="consent" onChange={(event) => updateConsent(event.target.checked)} type="checkbox" />
        <span>{t.signup.consent}</span>
      </label>
      {errors.consent ? <span className="form-error">{errors.consent}</span> : null}
      <label className="checkbox">
        <input
          checked={form.marketingOptIn}
          name="marketingOptIn"
          onChange={(event) => updateMarketingOptIn(event.target.checked)}
          type="checkbox"
        />
        <span>{t.signup.marketingConsent}</span>
      </label>
      {isSubmitted ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={20} />
          <span>
            <strong>{t.signup.successTitle}</strong>
            {t.signup.successMessage}
          </span>
        </div>
      ) : null}
      {errors.form ? <span className="form-error">{errors.form}</span> : null}
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "..." : t.signup.submitCta}
      </button>
      <Link className="text-button" href={`/${locale}/login`}>
        {t.signup.loginCta}
      </Link>
      <p>{t.signup.note}</p>
    </form>
  );
}
