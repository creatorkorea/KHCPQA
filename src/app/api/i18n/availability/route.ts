import { NextResponse } from "next/server";
import { getPublishedLocalesForPath } from "@/lib/translation-availability";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.searchParams.get("path") ?? "/ko";
  const locales = await getPublishedLocalesForPath(pathname);
  return NextResponse.json({ locales });
}
