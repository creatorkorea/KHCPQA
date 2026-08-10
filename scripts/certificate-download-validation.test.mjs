import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("account certification download component exports SVG and PNG download paths", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");

  assert.match(source, /export function buildCertificateSvg/);
  assert.match(source, /export function downloadCertificateSvg/);
  assert.match(source, /export async function downloadCertificatePng/);
  assert.match(source, /canvas\.toBlob/);
  assert.match(source, /image\/svg\+xml/);
  assert.match(source, /image\/png/);
  assert.match(source, /자격증/);
  assert.match(source, /Certificate of qualification/);
  assert.match(source, /Verification code/);
});

test("my page and certification detail page expose certificate downloads", async () => {
  const overviewPage = await readFile("src/app/[locale]/account/page.tsx", "utf8");
  const certificationsPage = await readFile("src/app/[locale]/account/certifications/page.tsx", "utf8");

  assert.match(overviewPage, /CertificateDownloadActions/);
  assert.match(overviewPage, /variant="compact"/);
  assert.match(overviewPage, /holderName=\{accountData\.profileForm\.name\}/);
  assert.match(certificationsPage, /CertificateDownloadActions/);
  assert.match(certificationsPage, /holderName=\{accountData\.profileForm\.name\}/);
});

test("certificate download buttons have dedicated layout styles", async () => {
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(styleSource, /\.certificate-download-actions/);
  assert.match(styleSource, /\.certificate-download-actions\.is-compact/);
  assert.match(styleSource, /\.certificate-download-message/);
  assert.match(styleSource, /grid-template-columns: minmax\(0, 1fr\) minmax\(170px, 0\.85fr\) auto auto/);
});
