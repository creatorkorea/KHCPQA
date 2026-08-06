"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { type Locale } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

type AuthState = "loading" | "signed-in" | "signed-out";

function useHeaderAuthState() {
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    if (!hasSupabaseBrowserEnv()) {
      setAuthState("signed-out");
      return;
    }

    let isMounted = true;
    const supabase = createClient();

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) {
          setAuthState(data.session ? "signed-in" : "signed-out");
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthState("signed-out");
        }
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "signed-in" : "signed-out");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}

function getAccountHref(locale: Locale, authState: AuthState) {
  return authState === "signed-in" ? `/${locale}/account` : `/${locale}/login`;
}

function getAccountLabel(loginLabel: string, accountLabel: string, authState: AuthState) {
  return authState === "signed-in" ? accountLabel : loginLabel;
}

export function HeaderAccountLink({
  accountLabel,
  locale,
  loginLabel
}: {
  accountLabel: string;
  locale: Locale;
  loginLabel: string;
}) {
  const pathname = usePathname();
  const authState = useHeaderAuthState();
  const href = getAccountHref(locale, authState);
  const label = getAccountLabel(loginLabel, accountLabel, authState);
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link aria-current={isCurrent ? "page" : undefined} aria-label={label} className="icon-link" href={href}>
      <span>{label}</span>
      <UserRound size={13} />
    </Link>
  );
}

export function MobileAccountLink({
  accountLabel,
  locale,
  loginLabel,
  onNavigate
}: {
  accountLabel: string;
  locale: Locale;
  loginLabel: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const authState = useHeaderAuthState();
  const href = getAccountHref(locale, authState);
  const label = getAccountLabel(loginLabel, accountLabel, authState);
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link aria-current={isCurrent ? "page" : undefined} href={href} onClick={onNavigate}>
      {label}
    </Link>
  );
}
