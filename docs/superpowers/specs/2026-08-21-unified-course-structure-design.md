# Unified Course Structure Design

## Goal

Represent every course with one administrator workflow and one public renderer, without forcing all source material into a week-only schedule.

## Data Model

The existing `schedule_tracks` JSONB column remains the persistence boundary for backward compatibility, but its application meaning becomes a curriculum group list.

- Group: `id`, `label`, `duration`, `times`, `items`
- Item: optional `period`, optional `label`, optional `title`, and `items`
- Legacy groups using `weeks` are accepted and normalized into `items`.
- Empty optional fields are omitted from the public presentation.

This model represents weekly courses, numbered certification steps, timetables, startup checklists, program packages, and independent course tracks with the same fields.

## Administrator Experience

The `반·일정` tab becomes `교육 구성`. Administrators add a `구성 그룹`, then add `교육 항목` rows. Every row exposes the same four columns: period, label, title, and detailed lines. Examples explain that the fields may contain `1개월`, `1주차`, `1단계`, `월요일`, or a time range.

No course-type switch changes the form. Existing content remains editable after normalization.

## Public Experience

The public page renders all groups with one adaptive component. Group metadata appears in the header. Each item shows only populated period, label, title, and detail fields. The layout remains fully expanded and uses responsive grid constraints rather than accordions or horizontal scrolling.

## Migration

The existing migration remains idempotent. Korean source pages with explicit regular/accelerated curriculum markers are parsed into exact month/week/item rows. A deliberate `--refresh-ko-structure` option may replace Korean curriculum groups; ordinary migration runs preserve administrator-entered structured content. Non-Korean records are never populated from Korean source text.

## Verification

- Normalization accepts legacy and current shapes.
- Admin labels contain no week-only terminology.
- Public rendering exposes period and label independently.
- Korean source parsing preserves the eight regular and four accelerated rows for facial contouring.
- Existing course, admin, i18n, lint, and production build checks pass.
