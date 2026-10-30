# PUB-001 reconciliation — 30 October 2026

These approved amendments supersede earlier prototype and plan details where they differ.

## Public layout and navigation

- `/publications/` is Search Publications, the last Publications submenu item after Magazines, Major Articles, and Books. All Publications is removed.
- Only Search Publications renders search, filters, result count, reset, empty-result state, and filter JavaScript. Collection and series pages render their selected records without search controls.
- Search matches title, summary, and topics; contributor search is not implemented and is no longer an acceptance claim.
- Listing/detail headings use the site's 1.3–1.9rem responsive scale; introduction text uses 1rem. The red society-name eyebrow is removed.
- A Home icon is the first main-menu item with an accessible Home label and base-path-safe URL.
- The revised saved design is `design/publications-layout.html`; the live Hugo templates are the implementation authority.

## Storage, seed content, and release evidence

- PDFs use the existing `cms-media` bucket, not a new bucket. Public asset base is `https://pub-d125678e734647aeb774df3e25dd6abc.r2.dev`, configured in `data/settings.yml`. Custom domain remains deferred; r2.dev is temporary delivery with its documented production limitations.
- Seven published records: two English issues, one Hindi issue, two article additions, and two book catalogue records. See `seed-import.md` for provenance, dates, unavailable Prakriti/July 2026 PDFs, and selection limitations. The ledger now includes the five approved seed PDFs in addition to the original 94 pending items (99 total). This is a partial seed import, not completion of the legacy migration. The migration dry run resolves all five approved records to their existing paths; do not rerun with --write, which intentionally refuses overwriting existing content.
- All five R2 PDFs returned successful GETs, valid PDF signatures, and matching recorded SHA-256 hashes. The corrected build renders real PDF anchors.
- Tests: 15 passed; validator: 7 records; Hugo: 81 pages. Commits: `49861a4` layout, `ae1f77d` import, `d5cdd29` asset-base fix, all pushed.
- Full manual responsive/accessibility review, full migration, authenticated end-to-end save verification, and 30-day cost review remain open. Do not mark those task/checklist gates complete from automated checks.
