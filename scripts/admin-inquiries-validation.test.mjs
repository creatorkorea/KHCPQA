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
  buildUpdateAdminInquiryPayload,
  getAdminInquiryStatusLabel,
  getAdminInquiryTypeLabel
} = await importTsModule("src/lib/admin-inquiries.ts");

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

test("admin inquiry list prioritizes message and contact values", async () => {
  const componentSource = await readFile("src/components/AdminInquiriesManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(componentSource, /<colgroup>/);
  assert.doesNotMatch(componentSource, /<th>접수번호<\/th>/);
  assert.match(componentSource, /<th>문의 내용<\/th>/);
  assert.match(componentSource, /<th>고객 정보<\/th>/);
  assert.match(componentSource, /className="admin-inquiries-message-title"/);
  assert.match(componentSource, /className="admin-inquiries-contact-cell"/);
  assert.match(componentSource, /className="admin-inquiries-message-stack"/);
  assert.match(componentSource, /className="admin-inquiries-contact-stack"/);
  assert.match(componentSource, /<td colSpan=\{4\}>/);
  assert.match(componentSource, /id="admin-inquiry-modal-title">\{selectedInquiry\.message\}/);
  assert.doesNotMatch(componentSource, /id="admin-inquiry-modal-title">\{selectedInquiry\.receipt\}/);
  assert.doesNotMatch(componentSource, /<th>접수일<\/th>/);
  assert.doesNotMatch(componentSource, /<th>유형<\/th>/);
  assert.match(styleSource, /table-layout: fixed/);
  assert.match(styleSource, /\.admin-inquiries-col-message/);
  assert.match(styleSource, /\.admin-inquiries-col-customer/);
  assert.match(styleSource, /\.admin-inquiries-message-stack/);
  assert.match(styleSource, /\.admin-inquiries-contact-stack/);
  assert.match(styleSource, /\.admin-inquiries-modal-eyebrow/);
  assert.match(styleSource, /\.admin-inquiries-table tr:hover td/);
  assert.match(styleSource, /white-space: nowrap/);
  assert.match(styleSource, /text-overflow: ellipsis/);
});
