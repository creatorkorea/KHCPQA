# Unified Course Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide one curriculum-group editor and adaptive public renderer for all education course structures.

**Architecture:** Extend the existing JSONB-backed schedule model with an optional period and generic item naming while accepting legacy data. Reuse the existing server actions and database column, then add an opt-in Korean source refresh parser.

**Tech Stack:** Next.js 14, React 18, TypeScript, Supabase JSONB, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-21-unified-course-structure-design.md`

## Global Constraints

- Preserve existing administrator data by default.
- Do not copy Korean content into other locales.
- Keep all public curriculum content expanded.
- Do not add a new database migration for the compatible JSON shape.

---

### Task 1: Generic curriculum model

**Files:**
- Modify: `src/lib/course-model.ts`
- Test: `scripts/course-hybrid-validation.test.mjs`

- [ ] Add failing assertions for period normalization and legacy `weeks` compatibility.
- [ ] Run `npm.cmd run test:course-hybrid` and confirm the new assertions fail.
- [ ] Extend the item type and normalizer while retaining the existing persistence contract.
- [ ] Run `npm.cmd run test:course-hybrid` and confirm it passes.

### Task 2: One administrator editor

**Files:**
- Modify: `src/components/AdminCoursesManager.tsx`
- Modify: `src/styles/globals.css`
- Test: `scripts/admin-courses-validation.test.mjs`

- [ ] Add failing assertions for `교육 구성`, `구성 그룹 추가`, `교육 항목 추가`, and independent period/label controls.
- [ ] Run `npm.cmd run test:admin-courses` and confirm failure.
- [ ] Replace week-only labels and add the period field without changing save actions.
- [ ] Run `npm.cmd run test:admin-courses` and confirm it passes.

### Task 3: Adaptive public renderer

**Files:**
- Modify: `src/app/[locale]/curriculum/[courseSlug]/page.tsx`
- Modify: `src/styles/globals.css`
- Test: `scripts/course-hybrid-validation.test.mjs`

- [ ] Add failing assertions that period and label render independently and week-only class names are removed.
- [ ] Run `npm.cmd run test:course-hybrid` and confirm failure.
- [ ] Render generic group items using populated optional fields only.
- [ ] Run `npm.cmd run test:course-hybrid` and confirm it passes.

### Task 4: Korean source structure refresh

**Files:**
- Modify: `scripts/migrate-course-content.ts`
- Test: `scripts/course-hybrid-validation.test.mjs`

- [ ] Add failing assertions for the opt-in refresh flag and source curriculum parser.
- [ ] Run `npm.cmd run test:course-hybrid` and confirm failure.
- [ ] Parse regular/accelerated source sections into period, label, title, and details.
- [ ] Preserve existing structures unless `--refresh-ko-structure` is supplied for Korean.
- [ ] Run migration parser tests and course tests.

### Task 5: Full verification

**Files:**
- Verify only

- [ ] Run `npm.cmd run test:admin-courses`.
- [ ] Run `npm.cmd run test:course-hybrid`.
- [ ] Run `npm.cmd run test:i18n`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build` without the development server writing to the same `.next` directory.
- [ ] Verify `/admin/courses` and one public weekly course at desktop and mobile widths.
