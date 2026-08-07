import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importTsModule(path) {
  const source = await readFile(path, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const encoded = Buffer.from(output).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${pathToFileURL(path).href}`);
}

const {
  buildCreateAdminInquiryPayload,
  buildUpdateAdminInquiryPayload,
  getAdminInquiryStatusLabel,
  getAdminInquiryTypeLabel
} = await importTsModule("src/lib/admin-inquiries.ts");

test("buildCreateAdminInquiryPayload trims values and defaults locale, type, and status", () => {
  const result = buildCreateAdminInquiryPayload({
    country: " Korea ",
    email: " Member@Example.COM ",
    inquiryType: "",
    locale: "",
    managerNote: " 확인 필요 ",
    message: " 상담 요청드립니다. ",
    name: " 홍길동 ",
    organization: " KHCPQA ",
    phone: "010-0000-0000",
    status: ""
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, {
    country: "Korea",
    email: "member@example.com",
    inquiryType: "general",
    locale: "ko",
    managerNote: "확인 필요",
    message: "상담 요청드립니다.",
    name: "홍길동",
    organization: "KHCPQA",
    phone: "010-0000-0000",
    status: "new"
  });
});

test("buildCreateAdminInquiryPayload rejects missing required fields and invalid options", () => {
  const result = buildCreateAdminInquiryPayload({
    country: "",
    email: "not-email",
    inquiryType: "unknown",
    locale: "fr",
    managerNote: "",
    message: "",
    name: "",
    organization: "",
    phone: "",
    status: "waiting"
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /이름/);
  assert.match(result.message, /이메일/);
  assert.match(result.message, /문의 내용/);
  assert.match(result.message, /문의 유형/);
  assert.match(result.message, /언어/);
  assert.match(result.message, /처리 상태/);
});

test("buildUpdateAdminInquiryPayload requires receipt and normalizes status note", () => {
  const result = buildUpdateAdminInquiryPayload({
    managerNote: " 답변 완료 ",
    receipt: " KHCPQA-2026-ABC ",
    status: "answered"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, {
    managerNote: "답변 완료",
    receipt: "KHCPQA-2026-ABC",
    status: "answered"
  });
});

test("inquiry labels are operator friendly", () => {
  assert.equal(getAdminInquiryStatusLabel("new"), "신규");
  assert.equal(getAdminInquiryStatusLabel("in_review"), "검토중");
  assert.equal(getAdminInquiryStatusLabel("answered"), "답변완료");
  assert.equal(getAdminInquiryStatusLabel("closed"), "종료");
  assert.equal(getAdminInquiryTypeLabel("partnership"), "파트너십");
});
