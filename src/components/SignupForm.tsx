"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

type SignupField = "name" | "email" | "country" | "password" | "confirmPassword" | "consent";

type SignupState = Record<Exclude<SignupField, "consent">, string> & {
  consent: boolean;
};

const initialSignupState: SignupState = {
  name: "",
  email: "",
  country: "",
  password: "",
  confirmPassword: "",
  consent: false
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
  const [form, setForm] = useState<SignupState>(initialSignupState);
  const [errors, setErrors] = useState<Partial<Record<SignupField | "form", string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: Exclude<SignupField, "consent">, value: string) {
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
    const nextErrors: Partial<Record<SignupField, string>> = {};

    (["name", "email", "country", "password", "confirmPassword"] as const).forEach((field) => {
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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}/account`,
        data: {
          country: form.country,
          full_name: form.name,
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
          onChange={(event) => updateField("email", event.target.value)}
          placeholder={t.signup.emailPlaceholder}
          type="email"
          value={form.email}
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>
      <label>
        {t.signup.country}
        <input
          aria-invalid={Boolean(errors.country)}
          onChange={(event) => updateField("country", event.target.value)}
          placeholder={t.signup.countryPlaceholder}
          value={form.country}
        />
        {errors.country ? <span className="form-error">{errors.country}</span> : null}
      </label>
      <label>
        {t.signup.password}
        <input
          aria-invalid={Boolean(errors.password)}
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
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder={t.signup.confirmPasswordPlaceholder}
          type="password"
          value={form.confirmPassword}
        />
        {errors.confirmPassword ? <span className="form-error">{errors.confirmPassword}</span> : null}
      </label>
      <label className="checkbox">
        <input checked={form.consent} onChange={(event) => updateConsent(event.target.checked)} type="checkbox" />
        <span>{t.signup.consent}</span>
      </label>
      {errors.consent ? <span className="form-error">{errors.consent}</span> : null}
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
