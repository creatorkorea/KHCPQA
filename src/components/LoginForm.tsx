"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getSafeNextPath(locale: Locale) {
  if (typeof window === "undefined") {
    return `/${locale}/account`;
  }

  const next = new URLSearchParams(window.location.search).get("next");

  if (!next) {
    return `/${locale}/account`;
  }

  const isInternal = next.startsWith("/") && !next.startsWith("//") && !next.includes("://");
  const isAllowedPath = new RegExp(`^/(?:${locale}/account(?:/|$)|admin(?:/|$))`).test(next);

  return isInternal && isAllowedPath ? next : `/${locale}/account`;
}

export function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = getCopy(locale);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const authState = new URLSearchParams(window.location.search).get("auth");
    if (authState === "config-error") {
      setErrors({ form: t.login.configurationError });
    }
  }, [t.login.configurationError]);

  function validate() {
    const nextErrors: { email?: string; password?: string } = {};

    if (email.trim().length === 0) {
      nextErrors.email = t.login.validation.emailRequired;
    } else if (!isValidEmail(email)) {
      nextErrors.email = t.login.validation.emailInvalid;
    }

    if (password.length === 0) {
      nextErrors.password = t.login.validation.passwordRequired;
    } else if (password.length < 8) {
      nextErrors.password = t.login.validation.passwordLength;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateReset() {
    const nextErrors: { email?: string } = {};

    if (email.trim().length === 0) {
      nextErrors.email = t.login.validation.emailRequired;
    } else if (!isValidEmail(email)) {
      nextErrors.email = t.login.validation.emailInvalid;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "reset") {
      if (!validateReset()) {
        setIsSubmitted(false);
        return;
      }

      if (!hasSupabaseBrowserEnv()) {
        setErrors({ form: t.login.configurationError });
        setIsSubmitted(false);
        return;
      }

      setIsSubmitting(true);
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/account/security`
      });
      setIsSubmitting(false);

      if (error) {
        setErrors({ form: error.message });
        setIsSubmitted(false);
        return;
      }

      setIsSubmitted(true);
      return;
    }

    if (!validate()) {
      setIsSubmitted(false);
      return;
    }

    if (!hasSupabaseBrowserEnv()) {
      setErrors({ form: t.login.configurationError });
      setIsSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (error) {
      setErrors({ form: error.message });
      setIsSubmitted(false);
      return;
    }

    setIsSubmitted(true);
    window.setTimeout(() => {
      router.replace(getSafeNextPath(locale));
    }, 650);
  }

  function switchMode(nextMode: "login" | "reset") {
    setMode(nextMode);
    setErrors({});
    setIsSubmitted(false);
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
      <Lock size={28} />
      <label>
        {t.login.email}
        <input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
            setIsSubmitted(false);
          }}
          placeholder={t.login.emailPlaceholder}
          type="email"
          value={email}
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>
      {mode === "login" ? (
        <label>
          {t.login.password}
          <input
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setIsSubmitted(false);
            }}
            placeholder={t.login.passwordPlaceholder}
            type="password"
            value={password}
          />
          {errors.password ? <span className="form-error">{errors.password}</span> : null}
        </label>
      ) : null}
      {isSubmitted ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={20} />
          <span>
            <strong>{mode === "login" ? t.login.successTitle : t.login.resetSuccessTitle}</strong>
            {mode === "login" ? t.login.successMessage : t.login.resetSuccessMessage}
          </span>
        </div>
      ) : null}
      {errors.form ? <span className="form-error">{errors.form}</span> : null}
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "..." : mode === "login" ? t.login.submitCta : t.login.resetCta}
      </button>
      <button className="text-button" type="button" onClick={() => switchMode(mode === "login" ? "reset" : "login")}>
        {mode === "login" ? t.login.forgotPassword : t.login.backToLogin}
      </button>
      {mode === "login" ? (
        <Link className="text-button" href={`/${locale}/signup`}>
          {t.signup.title}
        </Link>
      ) : null}
      <p>{t.login.note}</p>
    </form>
  );
}
