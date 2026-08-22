import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("AdminCoursesManager uses file attachment upload for representative images", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /uploadAdminContentImage/);
  assert.match(source, /name="imageFile"/);
  assert.match(source, /type="file"/);
  assert.match(source, /대표 이미지/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /PDF 자료/);
  assert.doesNotMatch(source, /대표 이미지 URL\s*<\/label>/);
});

test("AdminCoursesManager exposes clear save progress in the locale editor", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /useTransition/);
  assert.match(source, /과정 내용을 저장하고 있습니다\./);
  assert.match(source, /변경사항 저장/);
  assert.doesNotMatch(source, /언어 콘텐츠 저장/);
  assert.match(source, /aria-live="polite"/);
});

test("AdminCoursesManager provides one generic curriculum group editor", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /courseTemplatesByCategory/);
  assert.match(source, /과정 그룹/);
  assert.match(source, /세부 유형/);
  assert.match(source, /courseTemplatesByCategory/);
  assert.match(source, /getDefaultCourseTemplateKey/);
  assert.doesNotMatch(source, />과정 분류<select/);
  assert.doesNotMatch(source, />과정 유형<select/);
  assert.match(source, /기본정보/);
  assert.match(source, /교육 구성/);
  assert.match(source, /상세 콘텐츠/);
  assert.match(source, /첨부자료/);
  assert.match(source, /구성 그룹 추가/);
  assert.match(source, /교육 항목 추가/);
  assert.match(source, /기간·구간/);
  assert.match(source, /구분·순서/);
  assert.match(source, /위로 이동/);
  assert.match(source, /아래로 이동/);
  assert.match(source, /삭제 실행 취소/);
  assert.match(source, /window\.confirm\("이 구성 그룹과 모든 교육 항목을 삭제할까요\?"\)/);
  assert.doesNotMatch(source, /주차 추가/);
  assert.match(source, /섹션 추가/);
  assert.match(source, /선택 첨부자료/);
  assert.match(styles, /@media \(max-width: 1280px\)[\s\S]*?\.admin-courses-workspace[\s\S]*?grid-template-columns:\s*1fr/);
});

test("AdminCoursesManager uses a focused course editing workspace", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /className="admin-course-editor-header"/);
  assert.match(source, /form="admin-course-localization-form"/);
  assert.match(source, /id="admin-course-localization-form"/);
  assert.match(source, /className="admin-course-form-section"/);
  assert.match(source, />게시 설정</);
  assert.match(source, />소개</);
  assert.match(source, />교육 안내</);
  assert.match(source, /className="admin-course-action-bar"/);
  assert.match(source, /변경사항 저장/);
});

test("representative images live in basic information while media only manages PDF attachments", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const basicBlock = source.slice(source.indexOf('{editorTab === "basic"'), source.indexOf('{editorTab === "schedule"'));
  const attachmentBlock = source.slice(source.indexOf('{editorTab === "media"'), source.indexOf("{result ?"));

  assert.match(source, /\["media", "첨부자료"\]/);
  assert.doesNotMatch(source, /\["media", "미디어·PDF"\]/);
  assert.match(basicBlock, /대표 이미지/);
  assert.match(basicBlock, /name="imageFile"/);
  assert.match(basicBlock, /대표 이미지 미리보기/);
  assert.doesNotMatch(attachmentBlock, /대표 이미지/);
  assert.doesNotMatch(attachmentBlock, /name="imageFile"/);
  assert.match(attachmentBlock, /선택 첨부자료 \(PDF\)/);
  assert.match(attachmentBlock, /name="pdfFile"/);
});

test("AdminCoursesManager saves shared settings with the active locale in one flow", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");
  const saveFlow = source.slice(source.indexOf("function handleLocalizationSave"), source.indexOf("function handleArchive"));
  const actionBarStyles = styles.slice(styles.lastIndexOf(".admin-course-action-bar {"), styles.lastIndexOf(".admin-course-action-bar .primary-button"));

  assert.match(source, /과정 설정/);
  assert.match(source, /모든 언어 공통/);
  assert.doesNotMatch(source, /handleCommonSave/);
  assert.doesNotMatch(source, /공통정보 저장/);
  assert.match(saveFlow, /await saveAdminCourse\(/);
  assert.match(saveFlow, /await saveAdminCourseLocalization\(/);
  assert.ok(saveFlow.indexOf("await saveAdminCourse(") < saveFlow.indexOf("await saveAdminCourseLocalization("));
  assert.match(source, /className="admin-course-locale-statuses"/);
  assert.doesNotMatch(actionBarStyles, /position:\s*sticky/);
});

test("course settings controls share the editor field styling without clipping", async () => {
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(styles, /\.admin-course-common-fields\s*\{[\s\S]*?grid-template-columns:\s*minmax\(220px, 1fr\) minmax\(220px, 1fr\) minmax\(120px, 0\.3fr\)/);
  assert.match(styles, /\.admin-course-common-fields (?:input|:is\(input, select\))[\s\S]*?box-sizing:\s*border-box/);
  assert.match(styles, /\.admin-course-common-fields label\s*\{[\s\S]*?min-width:\s*0/);
  assert.match(styles, /\.admin-course-common-fields (?:input|:is\(input, select\))[\s\S]*?width:\s*100%/);
  assert.match(styles, /\.admin-course-common-fields (?:input|:is\(input, select\))[\s\S]*?border:\s*1px solid #ded7ef/);
  assert.match(styles, /\.admin-course-common-fields (?:input|:is\(input, select\))[\s\S]*?border-radius:\s*6px/);
  assert.match(styles, /\.admin-course-common-fields (?:input|select):focus/);
});

test("curriculum items use a readable two-row editor at desktop and mobile widths", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /className="admin-course-week-index"/);
  assert.match(source, /className="admin-course-week-primary"/);
  assert.match(source, /className="admin-course-week-detail"/);
  assert.match(source, /className="admin-course-row-actions"/);
  assert.doesNotMatch(source, /className="admin-course-week-columns"/);
  assert.match(styles, /\.admin-course-week-editor\s*\{[\s\S]*?grid-template-areas:[\s\S]*?"index primary actions"[\s\S]*?"index detail actions"/);
  assert.match(styles, /\.admin-course-week-primary\s*\{[\s\S]*?grid-template-columns:\s*minmax\(100px, 0\.45fr\) minmax\(120px, 0\.55fr\) minmax\(220px, 1\.6fr\)/);
  assert.match(styles, /\.admin-course-week-detail textarea\s*\{[\s\S]*?min-height:\s*76px/);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.admin-course-week-editor\s*\{[\s\S]*?grid-template-areas:[\s\S]*?"index actions"[\s\S]*?"primary primary"[\s\S]*?"detail detail"/);
});

test("section images preview immediately and can be removed before save", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /sectionImagePreviews/);
  assert.match(source, /sectionImageInputRefs/);
  assert.match(source, /handleSectionImageChange/);
  assert.match(source, /clearSectionImage/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /URL\.revokeObjectURL/);
  assert.match(source, /sectionImagePreviews\[section\.id\]\s*\|\|\s*section\.images\[0\]\?\.url/);
  assert.match(source, /onChange=\{\(event\) => handleSectionImageChange\(section\.id, event\)\}/);
});

test("new content sections scroll into view and provide visible feedback", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /sectionEditorRefs/);
  assert.match(source, /newContentSectionId/);
  assert.match(source, /scrollIntoView\(\{ behavior: "smooth", block: "center" \}\)/);
  assert.match(source, /querySelector<HTMLElement>\("input, select, textarea"\)\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /admin-course-section-editor is-new/);
  assert.match(source, /admin-course-add-section-button is-confirmed/);
  assert.match(source, /섹션 추가됨/);
  assert.match(source, /섹션이 추가되었습니다\./);
  assert.match(source, /className="admin-course-undo-toast admin-course-feedback-toast"/);
  assert.match(styles, /\.admin-course-section-editor\.is-new/);
  assert.match(styles, /\.admin-course-add-section-button\.is-confirmed/);
  assert.match(styles, /@keyframes admin-course-section-added/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("course save uses the shared blocking action overlay", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /const \[isSaving, setIsSaving\] = useState\(false\)/);
  assert.match(source, /setIsSaving\(true\)/);
  assert.match(source, /finally\s*\{\s*setIsSaving\(false\)/);
  assert.match(source, /className="admin-action-overlay"/);
  assert.match(source, /className="admin-action-spinner"/);
  assert.match(source, /className="admin-action-progress"/);
  assert.match(source, /과정 내용을 저장하고 있습니다\./);
});
