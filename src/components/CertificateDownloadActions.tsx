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

const certificateLogoPath = "/assets/brand/khcpqa-logo-mark.png";
let certificateLogoDataUrl: string | null = null;

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

async function loadCertificateLogoDataUrl() {
  if (certificateLogoDataUrl) {
    return certificateLogoDataUrl;
  }

  const response = await fetch(certificateLogoPath);
  if (!response.ok) {
    throw new Error("Certificate logo could not be loaded.");
  }

  const blob = await response.blob();
  certificateLogoDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Certificate logo could not be encoded."));
    reader.readAsDataURL(blob);
  });

  return certificateLogoDataUrl;
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

function renderCertificateLogo(logoDataUrl?: string) {
  if (logoDataUrl) {
    return `<image href="${escapeXml(logoDataUrl)}" x="407" y="120" width="86" height="86" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `<circle cx="450" cy="163" r="42" fill="none" stroke="url(#gold)" stroke-width="6"/>
  <text x="450" y="174" text-anchor="middle" font-family="Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif" font-size="22" font-weight="900" fill="#6b4b12">KH</text>`;
}

async function getSafeCertificateLogoDataUrl() {
  try {
    return await loadCertificateLogoDataUrl();
  } catch {
    return "";
  }
}

export function buildCertificateSvg(certificate: AccountCertificate, holderName?: string, logoDataUrl?: string) {
  const data = toExportData(certificate, holderName);
  const safe = {
    courseTitle: splitText(data.courseTitle, 18, 2),
    holderName: splitText(data.holderName, 18, 2),
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
  ${renderCertificateLogo(logoDataUrl)}
  <text x="450" y="306" text-anchor="middle" font-family="${labelFont}" font-size="56" font-weight="800" fill="#171421" letter-spacing="14">자격증</text>
  <text x="450" y="354" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-style="italic" fill="#252032">Certificate of qualification</text>
  <text x="450" y="420" text-anchor="middle" font-family="${valueFont}" font-size="16" font-weight="800" fill="#6d5f47">Korea Health Care Professional Qualification Association</text>
  <line x1="178" y1="466" x2="722" y2="466" stroke="#e4d4a0" stroke-width="2"/>
  <text x="170" y="540" font-family="${labelFont}" font-size="24" font-weight="760" fill="#1f1a28">성명</text>
  ${renderTextLines(safe.holderName, { fontFamily: valueFont, fontSize: 27, fontWeight: 780, lineHeight: 32, x: 300, y: 540 })}
  <text x="170" y="618" font-family="${labelFont}" font-size="24" font-weight="760" fill="#1f1a28">과정명</text>
  ${renderTextLines(safe.courseTitle, { fontFamily: valueFont, fontSize: 28, fontWeight: 820, lineHeight: 34, x: 300, y: 618 })}
  <text x="170" y="704" font-family="${labelFont}" font-size="24" font-weight="760" fill="#1f1a28">자격번호</text>
  ${renderTextLines(safe.number, { fontFamily: valueFont, fontSize: 24, fontWeight: 780, lineHeight: 30, x: 300, y: 704 })}
  <text x="170" y="776" font-family="${labelFont}" font-size="24" font-weight="760" fill="#1f1a28">발급일</text>
  <text x="300" y="776" font-family="${valueFont}" font-size="24" font-weight="780" fill="#1f1a28">${safe.issuedAt}</text>
  <text x="170" y="840" font-family="${labelFont}" font-size="24" font-weight="760" fill="#1f1a28">상태</text>
  <text x="300" y="840" font-family="${valueFont}" font-size="24" font-weight="850" fill="#0d6b35">${safe.status}</text>
  <text x="450" y="944" text-anchor="middle" font-family="${labelFont}" font-size="25" font-weight="760" fill="#252032">위 사람은 KHCPQA 자격 과정의 취득자로 확인되어</text>
  <text x="450" y="986" text-anchor="middle" font-family="${labelFont}" font-size="25" font-weight="760" fill="#252032">위와 같이 자격을 인정합니다.</text>
  <text x="450" y="1038" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-style="italic" font-weight="700" fill="#574f60">This certificate verifies completion and qualification for the listed course.</text>
  ${renderTextLines(safe.verificationCode.map((line, index) => `${index === 0 ? "Verification code: " : ""}${line}`), {
    color: "#6b6170",
    fontFamily: valueFont,
    fontSize: 15,
    fontWeight: 800,
    lineHeight: 21,
    textAnchor: "middle",
    x: 586,
    y: 1078
  })}
  <circle cx="270" cy="1106" r="44" fill="url(#gold)" opacity="0.92"/>
  <circle cx="270" cy="1106" r="31" fill="none" stroke="#fff8d7" stroke-width="3"/>
  <text x="270" y="1115" text-anchor="middle" font-family="${valueFont}" font-size="21" font-weight="900" fill="#4f360c">KH</text>
  <text x="586" y="1120" text-anchor="middle" font-family="${valueFont}" font-size="23" font-weight="900" fill="#181421">KHCPQA</text>
  <text x="586" y="1148" text-anchor="middle" font-family="${valueFont}" font-size="15" font-weight="850" fill="#625868">한국건강관리사자격협회</text>
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

export async function downloadCertificateSvg(certificate: AccountCertificate, holderName?: string) {
  const logoDataUrl = await getSafeCertificateLogoDataUrl();
  const svg = buildCertificateSvg(certificate, holderName, logoDataUrl);
  downloadBlob(filenameFor(certificate, "svg"), new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
}

export async function downloadCertificatePng(certificate: AccountCertificate, holderName?: string) {
  const logoDataUrl = await getSafeCertificateLogoDataUrl();
  const svg = buildCertificateSvg(certificate, holderName, logoDataUrl);
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

  async function handleSvgDownload() {
    setMessage("");
    try {
      await downloadCertificateSvg(certificate, holderName);
    } catch {
      setMessage("SVG 파일을 준비하지 못했습니다. 다시 시도해 주세요.");
    }
  }

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
      <button onClick={handleSvgDownload} type="button">
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
