# Tasks: Publications Library and Menu

**Input**: `specs/001-publications-library/` design artifacts

**Tests**: Required by the constitution and specification. Write failing tests/fixtures before the
corresponding implementation task.

## Phase 1: Setup and Contract Fixtures

- [x] T001 Create valid and invalid content-contract fixtures in `tests/fixtures/publications/valid/` and `tests/fixtures/publications/invalid/`
- [x] T002 [P] Add the three approved series definitions and labels to `data/publication-series.yml`
- [x] T003 [P] Add placeholder-safe `publication_asset_base_url` configuration to `data/settings.yml` without hard-coding content records

## Phase 2: Foundational Validation

- [x] T004 Add failing public-schema and conditional-field tests for the exact constraints in `data-model.md` to `tests/publications-schema.test.mjs`
- [x] T005 Implement deterministic publication front-matter validation for `publication_id` 3–80 lowercase/hyphen chars, `title` 1–160 chars, `slug` 1–80 lowercase/hyphen chars, three publication types, series condition, PDF bytes 1–52,428,800, and HTTPS links in `scripts/validate-publications.mjs`
- [x] T006 Wire publication validation and the production Hugo build into `.github/workflows/deploy.yml`
- [x] T007 Create section/collection placeholder content in `content/publications/_index.md`, `content/publications/magazines/_index.md`, `content/publications/major-articles/_index.md`, and `content/publications/books/_index.md`

**Checkpoint**: Contract fixtures and build validation are ready; story work may proceed in parallel.

## Phase 3: User Story 1 – Discover publications (Priority: P1) 🎯 Public MVP

**Independent Test**: From any page, a keyboard/touch/pointer user reaches each collection and can
search/filter server-rendered published fixtures with a clear count/reset/empty state.

- [x] T008 [P] [US1] Add failing menu hierarchy/current-state assertions to `tests/publications-navigation.test.mjs`
- [x] T009 [P] [US1] Add failing query/type/series/language/topic/year and reset filter tests to `tests/publications-filter.test.mjs`
- [x] T010 [US1] Configure the exact Publications parent/child menu weights and URLs in `hugo.toml`
- [x] T011 [US1] Replace the State Chapters-only dropdown with a reusable hierarchical menu partial in `layouts/partials/menu-tree.html` and integrate it in `layouts/partials/header.html`
- [x] T012 [US1] Generalize disclosure, Escape, outside-click, focus, and mobile behaviour for all menu dropdowns in `assets/js/nav.js`
- [x] T013 [P] [US1] Implement publication card, metadata, filters, and empty-state partials in `layouts/partials/publications/card.html`, `metadata.html`, `filters.html`, and `empty.html`
- [x] T014 [US1] Implement the Publications landing and collection hierarchy in `layouts/publications/list.html`
- [x] T015 [US1] Emit published, non-future, catalogue-enabled records through `layouts/publications/list.json.json`
- [x] T016 [US1] Implement progressive query/filter/URL/count/reset behaviour in `assets/js/publications.js`
- [x] T017 [US1] Add responsive navigation, landing, series, toolbar, cards, focus and empty-state styling using existing tokens in `assets/scss/main.scss`

**Checkpoint**: US1 is usable without JavaScript and enhanced with client filtering when enabled.

## Phase 4: User Story 2 – Read or download a publication (Priority: P1)

**Independent Test**: A fixture detail page exposes complete metadata and a stable PDF/book action;
missing cover/document states stay usable.

- [x] T018 [P] [US2] Add failing generated-detail assertions for metadata, derived URL, safe external link attributes, and missing assets to `tests/publications-detail.test.mjs`
- [x] T019 [P] [US2] Implement cover fallback, document action, and book action partials in `layouts/partials/publications/cover.html`, `document-action.html`, and `book-action.html`
- [x] T020 [US2] Implement the publication detail hierarchy and type-specific metadata in `layouts/publications/single.html`
- [x] T021 [US2] Derive PDF URLs from `publication_asset_base_url` plus validated `document.key` in `layouts/partials/publications/document-action.html`
- [x] T022 [US2] Add publication detail, cover fallback, metadata and action styling to `assets/scss/main.scss`

**Checkpoint**: US2 can be built/tested with static fixtures and no backend availability.

## Phase 5: User Story 3 – Accept newly published material (Priority: P2)

**Independent Test**: A valid Git-created draft is excluded, a published record builds into the
correct collection, and an invalid or stale-contract fixture fails validation before deploy.

- [x] T023 [P] [US3] Add failing draft, future-date, `catalogue: false`, and published-output tests to `tests/publications-visibility.test.mjs`
- [x] T024 [US3] Add valid draft/published sample page bundles for contract integration to `tests/fixtures/publications/integration/`
- [x] T025 [US3] Extend `scripts/validate-publications.mjs` to reject unknown fields/enums and cross-field violations while accepting additive contract-approved optional fields
- [x] T026 [US3] Add publication preview-build instructions and fixture cleanup to `specs/001-publications-library/quickstart.md`

**Checkpoint**: Backend/admin-generated records have a deterministic public acceptance gate.

## Phase 6: User Story 4 – Preserve legacy access (Priority: P2)

**Independent Test**: The inventory reconciles every reviewed URL and representative aliases resolve
to one canonical publication/About destination.

- [x] T027 [P] [US4] Add inventory parsing, duplicate, disposition, and reconciliation tests to `tests/publications-migration.test.mjs`
- [x] T028 [US4] Implement read-only legacy inventory generation with rights/status columns in `scripts/inventory-publications.mjs`
- [x] T029 [US4] Implement deterministic reviewed-inventory-to-content conversion in `scripts/migrate-publications.mjs`
- [x] T030 [US4] Move the approved constitution asset reference to configurable R2 storage and retain the About Us placement in `content/about.md`
- [x] T031 [US4] Add generated aliases and an explicit excluded/missing report under `data/publication-migration.yml`

## Phase 7: Cross-Cutting Verification

- [x] T032 Run `hugo --minify --gc` and all Node tests, then record outcomes in `specs/001-publications-library/quickstart.md`
- [ ] T033 [P] Complete the reviewer-owned requirements and UX/accessibility checklists in `specs/001-publications-library/checklists/`
- [ ] T034 Perform manual keyboard, 320/768/1280 responsive, no-JavaScript, and missing-asset review against the saved design in `specs/001-publications-library/design/publications-layout.html`
- [x] T035 Add and run a 5,000-record filter performance fixture proving the one-second target in `tests/publications-performance.test.mjs`
- [ ] T036 Record post-migration and 30-day build/R2 usage reviews, threshold outcomes, and any corrective action in `specs/001-publications-library/quickstart.md`
- [x] T037 Run `graphify update .` from the workspace root and review PUB-001 paths before implementation handoff

## Dependencies and Parallel Work

Current amendments and release evidence: [reconciliation.md](reconciliation.md). Partial seed import does not complete full migration or manual review tasks.

- Phase 1 precedes Phase 2; Phase 2 blocks all stories.
- After Phase 2, US1 and US2 can run in parallel on distinct partials/tests with coordination on
  `assets/scss/main.scss`; US3 fixtures can progress independently; US4 waits for the approved
  inventory and backend upload availability.
- Public MVP is US1 + US2 using fixtures. US3 completes the publishing integration. US4 completes
  migration continuity.
- Backend/admin work follows `roadmap.md`; no public implementation may invent a wire-contract change.

### Suggested multi-developer split

- Developer A: T008–T017 (navigation and discovery).
- Developer B: T018–T026 (detail/content acceptance).
- Integrator/editorial reviewer: T027–T031 (inventory and migration).
- Shared reviewer: T032–T037 (quality gates, cost review, and graph refresh).
