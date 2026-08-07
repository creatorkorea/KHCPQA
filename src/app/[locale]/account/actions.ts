"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Locale } from "@/lib/content";

export async function signOutFromAccount(locale: Locale) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/login`);
}
