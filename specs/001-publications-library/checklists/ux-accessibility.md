# Publications UX and Accessibility Requirements Checklist

**Purpose**: Reviewer gate for requirements quality before public-site implementation

**Created**: 2026-10-30

**Ownership**: Reviewer-owned. `[x]` means the written requirement is approved, not implemented.

## Navigation and Information Architecture

- [ ] CHK001 Are the complete Publications hierarchy and exact legacy labels specified without conflicting names? [Completeness, Spec §FR-001–FR-002]
- [ ] CHK002 Are keyboard, touch, pointer, disclosure-state, and current-page requirements defined for every navigation level? [Coverage, Spec §FR-003]
- [ ] CHK003 Is the boundary between general Articles and publication Major articles explicit enough to prevent content-model drift? [Clarity, Spec §FR-020]

## Collection and Detail Requirements

- [ ] CHK004 Are all required search/filter dimensions, URL state, counts, reset, and empty-state behaviours specified? [Completeness, Spec §FR-005–FR-006]
- [ ] CHK005 Are card and detail metadata requirements consistent across magazine, article, and book records? [Consistency, Spec §FR-007–FR-014]
- [ ] CHK006 Is the document action wording measurable for format, size, context, and missing-document states? [Clarity, Spec §FR-008–FR-009]
- [ ] CHK007 Are missing-cover requirements sufficient to keep title, metadata, and actions usable? [Coverage, Spec §Edge Cases]

## Accessibility and Responsive Coverage

- [ ] CHK008 Are focus visibility, semantic controls, status announcements, and keyboard completion requirements stated for all interactive elements? [Completeness, Spec §FR-003, FR-022]
- [ ] CHK009 Are accessibility outcomes objectively measurable through both automated and manual checks? [Measurability, Spec §SC-003]
- [ ] CHK010 Are responsive requirements bounded by named review sizes and usable interaction rather than vague “mobile friendly” wording? [Clarity, Plan §Verification]

## Failure, Migration and Dependency Coverage

- [ ] CHK011 Are no-JavaScript, unavailable-backend, unavailable-document, and no-results requirements all defined? [Coverage, Spec §US1–US2, SC-007]
- [ ] CHK012 Are draft, future-date, and catalogue-exclusion rules consistent across HTML, JSON, navigation, and search outputs? [Consistency, Spec §FR-010, FR-016]
- [ ] CHK013 Are redirect, provenance, rights-review, duplicate, missing-source, and exclusion requirements complete for migration? [Completeness, Spec §US4, FR-019]
- [ ] CHK014 Is the custom-domain deferral explicit about configuration portability and temporary endpoint limitations? [Dependency, Spec §FR-021; Research §Decision 3]
- [ ] CHK015 Are design-reference requirements explicit that production reuses the established theme rather than copying a standalone stylesheet? [Clarity, Spec §Assumptions; Design README]

## Notes

Review after the public content contract and backend OpenAPI contract are approved. Do not mark items
from implementation evidence; this checklist evaluates whether the requirements are ready to build.
