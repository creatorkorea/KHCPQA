"use client";

import { useState } from "react";
import { Download, FileImage } from "lucide-react";
import type { AccountCertificate } from "@/lib/account-data";

type CertificateDownloadActionsProps = {
  certificate: AccountCertificate;
  holderName?: string;
  variant?: "compact" | "full";
};

type CertificateExportData = {
  courseTitle: string;
  holderName: string;
  issuedAt: string;
  number: string;
  status: string;
  verificationCode: string;
};

const certificateSize = {
  height: 1272,
  width: 900
};

const statusLabels: Record<string, string> = {
  expired: "만료됨",
  issued: "발급됨",
  revoked: "취소됨"
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

function getCertificateStatusLabel(status: string) {
  return statusLabels[status.toLowerCase()] ?? status;
}

function splitText(value: string, maxLength: number, maxLines = 2) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) {
    return [normalized];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length > maxLength) {
      lines.push(word.slice(0, maxLength));
      current = word.slice(maxLength);
    } else {
      current = word;
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && normalized.length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/…$/, "")}…`;
  }

  return lines;
}

function renderTextLines(lines: string[], options: {
  className?: string;
  color?: string;
  fontFamily?: string;
  fontSize: number;
  fontStyle?: string;
  fontWeight?: number;
  lineHeight: number;
  textAnchor?: "middle" | "start";
  x: number;
  y: number;
}) {
  const attributes = [
    `x="${options.x}"`,
    `y="${options.y}"`,
    `font-family="${options.fontFamily ?? "Arial, sans-serif"}"`,
    `font-size="${options.fontSize}"`,
    `font-weight="${options.fontWeight ?? 700}"`,
    `fill="${options.color ?? "#1f1a28"}"`,
    options.fontStyle ? `font-style="${options.fontStyle}"` : "",
    options.textAnchor ? `text-anchor="${options.textAnchor}"` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return `<text ${attributes}>${lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : options.lineHeight;
      return `<tspan x="${options.x}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("")}</text>`;
}

function toExportData(certificate: AccountCertificate, holderName = "KHCPQA Member"): CertificateExportData {
  return {
    courseTitle: certificate.title,
    holderName: holderName.trim() || "KHCPQA Member",
    issuedAt: certificate.issuedAt,
    number: certificate.number,
    status: getCertificateStatusLabel(certificate.status),
    verificationCode: certificate.verificationCode
  };
}

export function buildCertificateSvg(certificate: AccountCertificate, holderName?: string) {
  const data = toExportData(certificate, holderName);
  const safe = {
    courseTitle: splitText(data.courseTitle, 16, 2),
    holderName: splitText(data.holderName, 16, 2),
    issuedAt: escapeXml(data.issuedAt),
    number: splitText(data.number, 24, 2),
    status: escapeXml(data.status),
    verificationCode: splitText(data.verificationCode, 34, 2)
  };
  const labelFont = "Malgun Gothic, Apple SD Gothic Neo, serif";
  const valueFont = "Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${certificateSize.width}" height="${certificateSize.height}" viewBox="0 0 ${certificateSize.width} ${certificateSize.height}" role="img" aria-label="${escapeXml(data.courseTitle)} qualification certificate">
  <defs>
    <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#d6b25e"/>
      <stop offset="0.48" stop-color="#f2df91"/>
      <stop offset="1" stop-color="#9f7826"/>
    </linearGradient>
    <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#34205f" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="900" height="1272" fill="#f7f3ea"/>
  <rect x="54" y="54" width="792" height="1164" rx="18" fill="#fffdf7" filter="url(#paperShadow)"/>
  <rect x="86" y="86" width="728" height="1100" rx="8" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <rect x="108" y="108" width="684" height="1056" rx="4" fill="none" stroke="#d7bd72" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="132" y="136" font-family="${valueFont}" font-size="15" font-weight="800" fill="#6f5b22">제 ${escapeXml(data.number)} 호</text>
  <circle cx="450" cy="174" r="58" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <circle cx="450" cy="174" r="39" fill="#fbf7e8" stroke="#d6b25e" stroke-width="2"/>
  <path d="M423 179c27-56 54-56 54 0M407 188h86M429 200h42" fill="none" stroke="#6b4b12" stroke-width="7" stroke-linecap="round"/>
  <text x="450" y="286" text-anchor="middle" font-family="${labelFont}" font-size="60" font-weight="800" fill="#171421" letter-spacing="15">자격증</text>
  <text x="450" y="336" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-style="italic" fill="#252032">Certificate of qualification</text>
  <text x="450" y="408" text-anchor="middle" font-family="${valueFont}" font-size="17" font-weight="800" fill="#6d5f47">Korea Health Care Professional Qualification Association</text>
  <line x1="178" y1="458" x2="722" y2="458" stroke="#e4d4a0" stroke-width="2"/>
  <text x="170" y="530" font-family="${labelFont}" font-size="27" font-weight="800" fill="#1f1a28">성명</text>
  ${renderTextLines(safe.holderName, { fontFamily: valueFont, fontSize: 29, fontWeight: 850, lineHeight: 34, x: 300, y: 530 })}
  <text x="170" y="612" font-family="${labelFont}" font-size="27" font-weight="800" fill="#1f1a28">과정명</text>
  ${renderTextLines(safe.courseTitle, { fontFamily: valueFont, fontSize: 30, fontWeight: 900, lineHeight: 36, x: 300, y: 612 })}
  <text x="170" y="704" font-family="${labelFont}" font-size="27" font-weight="800" fill="#1f1a28">자격번호</text>
  ${renderTextLines(safe.number, { fontFamily: valueFont, fontSize: 25, fontWeight: 850, lineHeight: 31, x: 300, y: 704 })}
  <text x="170" y="780" font-family="${labelFont}" font-size="27" font-weight="800" fill="#1f1a28">발급일</text>
  <text x="300" y="780" font-family="${valueFont}" font-size="25" font-weight="850" fill="#1f1a28">${safe.issuedAt}</text>
  <text x="170" y="846" font-family="${labelFont}" font-size="27" font-weight="800" fill="#1f1a28">상태</text>
  <text x="300" y="846" font-family="${valueFont}" font-size="25" font-weight="900" fill="#0d6b35">${safe.status}</text>
  <text x="450" y="942" text-anchor="middle" font-family="${labelFont}" font-size="28" font-weight="800" fill="#252032">위 사람은 KHCPQA 자격 과정의 취득자로 확인되어</text>
  <text x="450" y="988" text-anchor="middle" font-family="${labelFont}" font-size="28" font-weight="800" fill="#252032">위와 같이 자격을 인정합니다.</text>
  <text x="450" y="1054" text-anchor="middle" font-family="Georgia, serif" font-size="17" font-style="italic" font-weight="700" fill="#574f60">This certificate verifies completion and qualification for the listed course.</text>
  ${renderTextLines(safe.verificationCode.map((line, index) => `${index === 0 ? "Verification code: " : ""}${line}`), {
    color: "#6b6170",
    fontFamily: valueFont,
    fontSize: 17,
    fontWeight: 800,
    lineHeight: 24,
    textAnchor: "middle",
    x: 450,
    y: 1102
  })}
  <circle cx="278" cy="1134" r="46" fill="url(#gold)" opacity="0.92"/>
  <circle cx="278" cy="1134" r="32" fill="none" stroke="#fff8d7" stroke-width="3"/>
  <text x="278" y="1143" text-anchor="middle" font-family="${valueFont}" font-size="22" font-weight="900" fill="#4f360c">KH</text>
  <text x="548" y="1132" text-anchor="middle" font-family="${valueFont}" font-size="24" font-weight="900" fill="#181421">KHCPQA</text>
  <text x="548" y="1161" text-anchor="middle" font-family="${valueFont}" font-size="16" font-weight="850" fill="#625868">한국건강관리사자격협회</text>
</svg>`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function filenameFor(certificate: AccountCertificate, extension: "png" | "svg") {
  const baseName = sanitizeFilename(`${certificate.title}-${certificate.number}`) || "khcpqa-certificate";
  return `${baseName}.${extension}`;
}

export function downloadCertificateSvg(certificate: AccountCertificate, holderName?: string) {
  const svg = buildCertificateSvg(certificate, holderName);
  downloadBlob(filenameFor(certificate, "svg"), new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
}

export async function downloadCertificatePng(certificate: AccountCertificate, holderName?: string) {
  const svg = buildCertificateSvg(certificate, holderName);
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const image = new Image();
  const scale = 2;

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Certificate image could not be rendered."));
      image.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = certificateSize.width * scale;
    canvas.height = certificateSize.height * scale;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not available.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }
        reject(new Error("PNG export failed."));
      }, "image/png");
    });

    downloadBlob(filenameFor(certificate, "png"), blob);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function CertificateDownloadActions({
  certificate,
  holderName,
  variant = "full"
}: CertificateDownloadActionsProps) {
  const [message, setMessage] = useState("");

  async function handlePngDownload() {
    setMessage("");
    try {
      await downloadCertificatePng(certificate, holderName);
    } catch {
      setMessage("PNG 파일을 준비하지 못했습니다. SVG로 다시 시도해 주세요.");
    }
  }

  return (
    <span className={`certificate-download-actions is-${variant}`}>
      <button onClick={() => downloadCertificateSvg(certificate, holderName)} type="button">
        <Download size={15} />
        <span>SVG</span>
      </button>
      <button onClick={handlePngDownload} type="button">
        <FileImage size={15} />
        <span>PNG</span>
      </button>
      {message ? <span className="certificate-download-message" role="status">{message}</span> : null}
    </span>
  );
}
