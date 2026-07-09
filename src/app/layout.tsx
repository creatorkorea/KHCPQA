import type { Metadata } from "next";
import "@/styles/globals.css";
import { HtmlLangSync } from "@/components/HtmlLangSync";

export const metadata: Metadata = {
  title: "KHCPQA Global Webapp",
  description: "Global professional qualification education from Korea"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <HtmlLangSync />
        {children}
      </body>
    </html>
  );
}
