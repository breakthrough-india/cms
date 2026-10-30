# Implementation Plan: Publications Library and Menu

**Branch**: not created | **Date**: 2026-10-30 | **Spec**: [spec.md](spec.md)

**Input**: PUB-001 approved feature specification and the coordinated backend/admin specifications.

## Summary

Add a first-class Publications section to the Hugo site with a hierarchical, accessible navigation
menu; static collection, series, and detail pages; client-side catalogue filtering backed by a
generated JSON index; and repeatable migration mappings for the current WordPress archive. Store
publication metadata in Git and binary documents in R2. The backend contract is authoritative for
uploads and content mutations, while this repository owns the public schema and rendering.

The implementation must reuse the current theme tokens and components. The saved HTML design is an
interaction reference, not a new production stylesheet. The R2 public base URL is configuration;
adding a custom domain is explicitly deferred and is not part of this implementation branch.

## Technical Context

**Language/Version**: Hugo templates/Go template language, SCSS, browser JavaScript (ES2020+), YAML
and Markdown front matter

**Primary Dependencies**: Hugo Extended, existing asset pipeline, existing navigation script; no
new runtime library planned

**Storage**: Git-tracked Markdown/YAML metadata; R2 document objects referenced by stable asset keys

**Testing**: production Hugo build, Node built-in schema/fixture tests, HTML/accessibility smoke checks,
manual keyboard and responsive review

**Target Platform**: static GitHub Pages site, modern evergreen browsers, base-path-safe deployment

**Project Type**: static public website in a multi-repository CMS system

**Performance Goals**: catalogue filter response under one second after load; no PDF payload loaded
until requested; stable page layout with explicit image dimensions where available

**Constraints**: public pages work without admin/backend availability; no secret in generated output;
WCAG 2.2 AA; existing Articles section remains distinct; `R2_PUBLIC_URL` remains configurable

**Scale/Scope**: initial archive in the low hundreds of records and PDFs up to 50 MiB; catalogue
design should remain usable through at least 5,000 metadata records without a public database

## Cost Impact and Guardrails

**Expected Usage and Cost**: the public catalogue adds only static build output and a bounded JSON
index to the existing GitHub Pages deployment. PDF transfer is paid by the R2 delivery path only
when a reader requests a document. No public database, search service, or per-reader Worker request
is introduced. Current provider allowances and prices are deployment assumptions and MUST be
reverified from the sources recorded in `research.md` before production rollout.

**Scale Thresholds**: review the architecture before the catalogue exceeds 5,000 records, the JSON
index exceeds 2 MiB compressed, or publication assets approach 80% of the applicable R2 storage
allowance. Large cover images and PDFs remain subject to the schema limits and asset budgets.

**Controls and Ownership**: the CMS maintainer owns build-output monitoring; the infrastructure
owner supplies monthly R2 usage to the publication owner. Review after migration, 30 days after
launch, and whenever provider pricing or free-tier limits change. Asset URLs remain configurable so
delivery can move without rewriting content records.

**Non-Negotiables**: no cost optimization may remove server-rendered access, accessibility support,
content validation, durable metadata history, or safe document delivery.

## Constitution Check

*GATE: Passed before research and re-checked after design.*

| Principle | Design evidence | Result |
|-----------|-----------------|--------|
| Static-First Content | Public metadata and pages are built from Git; admin services are not in the reader path | PASS |
| Theme and Accessibility Consistency | Existing tokens, header, card patterns, semantic controls, keyboard menu, and focus states are reused | PASS |
| Content Integrity and Compatibility | Stable IDs, validated schema, draft exclusion, aliases, and migration inventory are defined | PASS |
| Security and Privacy | No client credential or personal data is introduced; external data is escaped and links are constrained | PASS |
| Verification and Performance | Build/schema/accessibility checks and bounded client filtering are planned | PASS |
| Sustainable Cost and Resource Use | Static delivery, no public database, bounded assets/index, usage thresholds, and ownership are documented | PASS |

Post-design review: no constitution exception or complexity waiver is required.

## Architecture

```text
Admin portal ──authenticated contract──> Publications Worker ──> R2 documents
       │                                        │
       └──────────────── user token ────────────┴──> GitHub content revision
                                                        │
                                                        v
Hugo build <── content/publications + data/series ── cms repository
    │
    ├── static publication pages
    └── static catalogue JSON ──> browser search/filter
```

- `cms` owns the publication content schema, Hugo layouts, navigation, redirects, and public index.
- `cms-backend` owns the versioned HTTP contract, authorization, Git mutation validation, and R2.
- `admin-portal` owns the editor workflow and consumes, but does not redefine, the backend contract.
- `PUB-001` is the cross-repository feature identifier; contract revisions use semantic versions.

## Project Structure

### Documentation (this feature)

```text
specs/001-publications-library/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── roadmap.md
├── contracts/
│   ├── cross-repo-ownership.md
│   └── publication-content-v1.md
├── design/
│   ├── README.md
│   └── publications-layout.html
├── checklists/
│   ├── requirements.md
│   └── ux-accessibility.md
└── tasks.md
```

### Source Code (planned repository paths)

```text
hugo.toml
data/
├── publication-series.yml
└── settings.yml
content/publications/
├── _index.md
├── magazines/_index.md
├── major-articles/_index.md
├── books/_index.md
└── <publication-id>/index.md
layouts/
├── partials/header.html
├── partials/publications/
│   ├── card.html
│   ├── filters.html
│   ├── metadata.html
│   └── document-action.html
└── publications/
    ├── list.html
    ├── list.json.json
    └── single.html
assets/
├── js/nav.js
├── js/publications.js
└── scss/main.scss
scripts/
├── inventory-publications.mjs
└── migrate-publications.mjs
tests/
├── fixtures/publications/
└── publications-schema.test.mjs
```

**Structure Decision**: Extend the existing Hugo structure rather than introduce a second frontend.
Publication records are page bundles under one section; reusable partials prevent list/detail drift.

## Implementation Design

### Navigation

Refactor the one-off State Chapters dropdown into a reusable recursive menu partial and generic
dropdown script. Configure Publications in `hugo.toml` with the exact legacy labels and child
weights. Desktop hover is supplemental; click/keyboard control is authoritative. Mobile expands the
same semantic structure inline. The current page and expanded state use `aria-current` and
`aria-expanded`.

### Public layouts

- Landing: short introduction, featured/latest issue, three magazine series cards, and links to
  Major articles and Books.
- Collections: a progressive-enhancement form for query, type/series, language, topic, and year;
  server-rendered items remain visible without JavaScript.
- Detail: title, publication metadata, contributor credits, accessible cover fallback, summary,
  source provenance when appropriate, and document/purchase action.
- The existing public Articles section is unchanged; only `publication_type: major_article` appears
  under Publications > Major articles.

### Catalogue index

Hugo emits a publications-only JSON output containing published, non-future records. The filter
script reads this bounded local index and updates a result list and query string. Text comparison is
case-insensitive and Unicode-safe at a basic browser level; PDF full-text search and OCR are outside
scope. All filter links and the unfiltered collection work without JavaScript.

### Asset URLs

Content stores the immutable asset key and file metadata, not a provider hostname. A single setting
(`publication_asset_base_url`) derives the public URL during the Hugo build. The temporary
`r2.dev` hostname may be used for staging, but the feature is designed so a later custom domain is a
configuration-only change.

### Migration

1. Inventory every legacy URL reachable from Publications and the About Us constitution link.
2. Record type, series, language, date, PDF/cover URLs, rights status, and migration disposition.
3. Upload approved assets through the publication service; do not hotlink retained WordPress PDFs.
4. Generate reviewable content records and aliases in batches.
5. Build and compare counts; sample every type/series/year and verify redirect targets.
6. Keep an exclusion report for missing, duplicate, or rights-restricted source items.

## Cross-Repository Delivery Order

1. Approve `publication-content-v1.md` and backend OpenAPI contract.
2. Implement and deploy the backend contract behind a staging URL.
3. Implement the admin editor against fixtures, then the staging contract.
4. Implement public layouts and import a small approved fixture set.
5. Run end-to-end publication, build, preview, and conflict scenarios.
6. Migrate the reviewed inventory in batches and verify legacy mappings.
7. Add the R2 custom domain in a later infrastructure change; switch one configuration value.

## Rollout and Rollback

- Navigation remains hidden until collection fixtures build successfully and migration links pass.
- Content and layout changes can be reverted independently of stored R2 objects.
- Uploaded but unreferenced objects are retained for a bounded review window; owner cleanup is
  separate from the normal editor workflow.
- If catalogue JavaScript fails, server-rendered collections and document links remain usable.
- If the admin service fails, the already-built public library remains unaffected.

## Complexity Tracking

No constitution violations require justification. Three repositories are retained because they are
existing deployment and trust boundaries, not new projects introduced by PUB-001.
