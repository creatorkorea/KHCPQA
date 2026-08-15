import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("AdminCommunityManager gives photo gallery posts a dedicated editing mode", async () => {
  const source = await readFile("src/components/AdminCommunityManager.tsx", "utf8");

  assert.match(source, /isPhotoGalleryPost = editor\.kind === "post" && editor\.boardKey === "photo"/);
  assert.match(source, /새 포토갤러리 등록/);
  assert.match(source, /포토갤러리 수정/);
  assert.match(source, /사진이 주인공인 콘텐츠입니다/);
  assert.match(source, /포토갤러리 등록 방식/);
  assert.match(source, /갤러리 대표 이미지/);
  assert.match(source, /사진 제목/);
  assert.match(source, /목록 캡션/);
  assert.match(source, /사진 설명/);
});

test("photo gallery posts require an image before saving", async () => {
  const source = await readFile("src/components/AdminCommunityManager.tsx", "utf8");

  assert.match(source, /hasNewImage = imageFile instanceof File && imageFile\.size > 0/);
  assert.match(source, /isPhotoGalleryPost && !imageUrl && !hasNewImage/);
  assert.match(source, /포토갤러리는 대표 이미지를 먼저 등록해야 합니다/);
  assert.match(source, /required=\{isPhotoGalleryPost && !editor\.imageUrl\}/);
});

test("photo gallery editor has image-first styling", async () => {
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(styleSource, /\.community-photo-guidance/);
  assert.match(styleSource, /\.community-photo-upload-field \.community-file-upload/);
  assert.match(styleSource, /min-height: 112px/);
  assert.match(styleSource, /\.community-photo-upload-field \.community-image-preview/);
  assert.match(styleSource, /aspect-ratio: 16 \/ 9/);
});

test("photo gallery detail keeps category hero separate from attached post image", async () => {
  const source = await readFile("src/app/[locale]/activities/[activityKey]/[postSlug]/page.tsx", "utf8");

  assert.match(source, /getPublishedContentIntro/);
  assert.match(source, /const heroImageUrl = activity\.key === "photo" \? categoryContent\.imageUrl \|\| activity\.imageUrl : imageUrl \|\| activity\.imageUrl/);
  assert.match(source, /"--activity-post-hero-image": `url\("\$\{heroImageUrl\.replace/);
  assert.match(source, /\{imageUrl \? <Image src=\{imageUrl\} alt=\{post\.title\}/);
});

test("community board table omits planning-description column", async () => {
  const source = await readFile("src/components/AdminCommunityManager.tsx", "utf8");

  assert.doesNotMatch(source, /label: "기획서 기준 설명"/);
  assert.doesNotMatch(source, /key: "summary", label: "기획서 기준 설명"/);
  assert.match(source, /placeholder=\{activeTab === "boards" \? "게시판명, 키 검색"/);
});

test("community post table omits slug column from the visible list", async () => {
  const source = await readFile("src/components/AdminCommunityManager.tsx", "utf8");

  assert.doesNotMatch(source, /label: "게시글 Slug"/);
  assert.doesNotMatch(source, /key: "slug", label: "게시글 Slug"/);
  assert.match(source, /placeholder=\{activeTab === "boards" \? "게시판명, 키 검색" : "제목, 요약 검색"/);
});
