# Data Model: Publications Library

This file is the authoritative public content model for PUB-001. The backend validates and writes
this shape; the admin portal presents it; Hugo renders it.

## Publication

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `publication_id` | string | yes | Stable, 3–80 chars, lowercase letters/numbers/hyphens; never reused |
| `title` | string | yes | 1–160 visible characters |
| `slug` | string | yes | 1–80 chars, `^[a-z0-9]+(?:-[a-z0-9]+)*$`; unique in Publications |
| `publication_type` | enum | yes | `magazine_issue`, `major_article`, or `book` |
| `date` | date/time | yes | Publication date; future dates are not public |
| `lastmod` | date/time | yes | Updated on every committed change |
| `draft` | boolean | yes | Defaults to `true`; drafts are excluded from every public output |
| `catalogue` | boolean | yes | Defaults to `true`; `false` excludes a document such as the constitution |
| `summary` | string | yes | 1–320 characters, plain text |
| `languages` | string[] | yes | One or more BCP 47 tags; first is primary (`en`, `bn`, `hi`) |
| `contributors` | Contributor[] | no | Ordered credits; at least one for major articles/books when known |
| `topics` | string[] | no | Normalized labels for filtering; deduplicated case-insensitively |
| `series` | enum | conditional | Required only for `magazine_issue` |
| `volume` | string | no | Magazine display value, maximum 40 chars |
| `issue` | string | no | Magazine display value, maximum 40 chars |
| `cover` | CoverAsset | no | Remote or page-resource image with alt text |
| `document` | DocumentAsset | conditional | Required for PDF-led magazine issues and major articles |
| `purchase_url` | URL | no | `https` only; normally book-only |
| `price_text` | string | no | Display-only, maximum 80 chars; no checkout semantics |
| `isbn` | string | no | Book-only; normalized ISBN-10/13 when present |
| `aliases` | path[] | no | Hugo-local legacy paths beginning with `/` |
| `legacy_urls` | URL[] | no | Absolute source URLs retained for provenance/migration reporting |

### Magazine series values

| Value | Public label | Primary language |
|-------|--------------|------------------|
| `breakthrough-journal` | ‘BREAKTHROUGH’ Journal | English (`en`) |
| `prakriti-bengali` | Prakriti (Bengali) | Bengali (`bn`) |
| `breakthrough-bulletin-hindi` | Breakthrough Bulletin (Hindi) | Hindi (`hi`) |

### Contributor

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | yes | 1–120 chars |
| `role` | enum | yes | `author`, `editor`, `translator`, or `contributor` |

### DocumentAsset

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `asset_id` | 32-char lowercase hex | yes | Issued deterministically by the publication service |
| `key` | string | yes | Immutable generated R2 object key; never begins `/` or contains `..` |
| `filename` | string | yes | Sanitized original display filename, maximum 200 chars |
| `media_type` | string | yes | `application/pdf` for PUB-001 |
| `bytes` | integer | yes | `1..52428800` for the initial release |
| `sha256` | string | no | Lowercase 64-character digest supplied by the client and retained for audit |
| `label` | string | yes | Accessible action label, e.g. “Read July 2026 issue (PDF)” |

`public_url` is derived at build/runtime as
`publication_asset_base_url + "/" + key`; it is returned by the service but not duplicated in every
content record.

### CoverAsset

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `src` | URL/path | yes | Existing approved image source or page resource |
| `alt` | string | yes | Describes the cover or is empty only when the adjacent title is equivalent |
| `width` | integer | no | Positive pixel width when known |
| `height` | integer | no | Positive pixel height when known |

## State transitions

```text
draft ──publish──> published
  ^                    │
  └────unpublish───────┘

published ──update with expected revision──> published (new Git revision)
stale expected revision ──> conflict (no state change)
```

There is no hard delete state in the normal editor workflow. Removal from the catalogue is an
audited content revision (`draft: true` or `catalogue: false`); owner-only asset cleanup is separate.

## Example front matter

```yaml
publication_id: breakthrough-journal-2026-07
title: Breakthrough Journal – July 2026
slug: breakthrough-journal-july-2026
publication_type: magazine_issue
series: breakthrough-journal
date: 2026-07-01T00:00:00+05:30
lastmod: 2026-10-30T00:00:00+05:30
draft: true
catalogue: true
summary: Quarterly magazine of the Breakthrough Science Society.
languages: [en]
topics: [science-movement]
document:
  asset_id: 4d013c5e0d8642ba88b3e8e20cd7e093
  key: publications/magazine-issue/2026/4d013c5e-breakthrough-journal-july-2026.pdf
  filename: breakthrough-journal-july-2026.pdf
  media_type: application/pdf
  bytes: 12004567
  label: Read Breakthrough Journal – July 2026 (PDF)
aliases:
  - /breakthrough-journal-july-2026/
legacy_urls:
  - https://breakthroughindia.org/breakthrough-journal-july-2026/
```

## LegacyMapping

The migration inventory uses one row per source URL:

| Field | Rules |
|-------|-------|
| `legacy_url` | Absolute unique source URL |
| `source_type` | category, post, PDF, cover, or about-document |
| `publication_id` | Target ID when migrated |
| `canonical_path` | Target site path when applicable |
| `rights_status` | approved, review-required, excluded |
| `status` | pending, migrated, redirected, excluded, missing |
| `reason` | Required for excluded or missing records |
| `checked_at` | ISO timestamp of last verification |
