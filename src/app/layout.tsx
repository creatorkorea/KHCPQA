import type { Metadata } from "next";
import "@/styles/globals.css";
import { HtmlLangSync } from "@/components/HtmlLangSync";

export const metadata: Metadata = {
  title: "KAHC Global Webapp",
  description: "Global professional qualification education from Korea"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "(()=>{const l=location.pathname.split('/')[1];const m={ko:'ko-KR',en:'en',es:'es','zh-CN':'zh-CN'};document.documentElement.lang=m[l]||'ko-KR'})()"
          }}
        />
        <HtmlLangSync />
        {children}
      </body>
    </html>
  );
}
