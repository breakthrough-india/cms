# Feature Specification: Publications Library and Menu

**Feature ID**: PUB-001

**Feature Branch**: not created; branching begins after plan approval

**Created**: 2026-10-30

**Status**: Approved for planning

**Input**: User description: "Add the current site's Publications menu and relevant submenus,
provide an affordable PDF publication library including the constitution, and let authorized
administrators add magazines and articles. Save a proposed layout aligned with the new site before
implementation; defer the R2 custom domain."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover publications (Priority: P1)

As a reader, I can open Publications from the primary navigation and browse magazines, major
articles, and books without knowing their publication date or exact title.

**Why this priority**: Discovery is the core public value and restores a major section of the
current website.

**Independent Test**: Starting from any public page, a reader can reach a publication collection,
filter it, and identify a relevant item using only the visible navigation and labels.

**Acceptance Scenarios**:

1. **Given** a reader is using a pointer, keyboard, or touch device, **When** they open Publications,
   **Then** they can reach Magazines, Major articles, Books, and the three named magazine series.
2. **Given** Search Publications contains multiple years and languages, **When** the reader searches or
   filters it, **Then** only matching published items remain and the active filters are clear.
3. **Given** no items match, **When** filters are applied, **Then** the page explains the empty result
   and offers a one-step reset.

---

### User Story 2 - Read or download a publication (Priority: P1)

As a reader, I can open a publication detail page, understand what it is, and read or download its
PDF using a stable link.

**Why this priority**: A searchable catalogue is only useful when the publication itself is
accessible and sufficiently described.

**Independent Test**: A reader can open a magazine issue or major article, review its title,
language, date, type, and file size, and open or download the referenced PDF.

**Acceptance Scenarios**:

1. **Given** a publication has a valid PDF, **When** the reader opens its detail page, **Then** the
   primary read/download action identifies the file type and opens the document safely.
2. **Given** a publication has a cover or thumbnail, **When** the image is unavailable, **Then** the
   title, metadata, and document action remain usable.
3. **Given** an unavailable document, **When** the reader follows its detail page, **Then** the page
   reports that the file is temporarily unavailable without exposing storage details.

---

### User Story 3 - Publish new material (Priority: P2)

As an authorized publication editor, I can add a magazine issue, major article, or book record with
the correct metadata and make it appear in the appropriate public collection after review.

**Why this priority**: The library must stay current without requiring contributors to edit raw
files or storage configuration.

**Independent Test**: An authorized editor can prepare a draft record, associate an approved asset,
preview it, publish it, and later find it in the expected public collection; an unauthorized user
cannot perform those actions.

**Acceptance Scenarios**:

1. **Given** valid metadata and an approved asset, **When** an editor publishes a record, **Then** a
   reviewable content change is created and the record is eligible for the next site release.
2. **Given** required data is missing or invalid, **When** an editor attempts to publish, **Then** no
   public change is made and each error identifies the field to correct.
3. **Given** another editor changed the same record, **When** a stale edit is submitted, **Then** the
   overwrite is stopped and the editor is offered a safe refresh/retry path.

---

### User Story 4 - Preserve legacy access (Priority: P2)

As a reader following an existing bookmark or search result, I reach the matching new collection or
publication instead of a dead page.

**Why this priority**: The current archive contains cited material whose links should survive the
migration.

**Independent Test**: Representative URLs from each current publication section resolve to their
new canonical destination, and migrated records retain source provenance.

**Acceptance Scenarios**:

1. **Given** a legacy magazine, article, book, or constitution URL, **When** it is requested after
   launch, **Then** it resolves to the corresponding new page or document with at most one redirect.
2. **Given** a source item cannot be legally or reliably migrated, **When** the inventory is reviewed,
   **Then** it is recorded as excluded with a reason rather than silently omitted.

### Edge Cases

- A publication may have no cover image but MUST still have a usable text card and detail page.
- A publication can have multiple authors, editors, topics, or languages without creating duplicate
  catalogue records.
- Two issues may share a month or title; the stable publication identifier, not title alone,
  distinguishes them.
- Draft and future-dated records do not appear in public navigation, search, feeds, or collections.
- Books may have an external purchase link, a downloadable sample, both, or neither; unavailable
  actions are omitted rather than disabled without explanation.
- The constitution is managed in the same document storage system but remains linked from About Us
  and is excluded from the Publications catalogue by default.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The primary navigation MUST provide a Publications group containing Magazines, Major
  articles, and Books.
- **FR-002**: Magazines MUST contain the legacy series labels “‘BREAKTHROUGH’ Journal,” “Prakriti
  (Bengali),” and “Breakthrough Bulletin (Hindi).”
- **FR-003**: Navigation MUST be usable with pointer, touch, and keyboard interaction and MUST expose
  the current location to assistive technology.
- **FR-004**: The Publications landing page MUST introduce the archive and provide direct access to
  every publication type and magazine series.
- **FR-005**: The dedicated Search Publications page at `/publications/` MUST support search by title, summary, or topic and filtering by type,
  series, language, topic, and year when those values exist.
- **FR-006**: Search Publications state MUST be shareable through a stable URL and MUST provide a visible
  result count and reset action.
- **FR-007**: Publication cards MUST show title, type or series, publication date or year, language,
  and cover/thumbnail when available.
- **FR-008**: Each publication MUST have a canonical detail page with a stable identifier and a
  clear primary action appropriate to its asset or purchase link.
- **FR-009**: PDF actions MUST identify the format and, when known, file size; they MUST open without
  replacing the catalogue context unexpectedly.
- **FR-010**: The public archive MUST include only records in the published state whose publication
  date is not in the future.
- **FR-011**: Publication records MUST support the three types magazine issue, major article, and
  book, with type-specific fields that are omitted when irrelevant.
- **FR-012**: Magazine issues MUST belong to exactly one named series and provide issue date or
  volume/issue information sufficient to distinguish the issue.
- **FR-013**: Major articles MUST support one or more contributors and a publication date.
- **FR-014**: Books MUST support author/editor credits, edition or year, optional price text, optional
  purchase link, and optional sample or full-document link.
- **FR-015**: Every stored document reference MUST include a stable asset key, media type, byte size,
  original filename, and public URL; the public URL base MUST be configurable.
- **FR-016**: The constitution document MUST use the shared document storage mechanism, stay linked
  from About Us, and remain outside publication collection results unless explicitly opted in.
- **FR-017**: Authorized editors MUST be able to create drafts, validate metadata, preview, publish,
  and update publication records without editing raw repository files.
- **FR-018**: Publication changes MUST retain an auditable author, time, and change description and
  MUST prevent silent overwrite of concurrent changes.
- **FR-019**: Legacy section and item URLs selected during migration MUST resolve to a canonical new
  destination, and each migrated item MUST retain its source URL.
- **FR-020**: The existing general Articles/news experience MUST remain separate from PDF-based
  Major articles so the two labels do not silently merge different content models.
- **FR-021**: The first release MUST NOT require a custom asset domain; switching the asset URL base
  later MUST not require rewriting every publication record.
- **FR-022**: The feature MUST define accessible loading, empty, missing-image, missing-document, and
  validation-error states.

### Key Entities

- **Publication**: A stable catalogue record with type, title, summary, contributors, language,
  topics, publication date, state, legacy URLs, and optional cover and document references.
- **Magazine Series**: A named recurring publication with language, description, and ordered issues.
- **Document Asset**: A binary file reference with stable key, public URL, media type, byte size,
  original filename, and accessibility label.
- **Publication Editor**: An authenticated person permitted to prepare and publish publication
  records but not to administer unrelated systems.
- **Legacy Mapping**: A source URL, canonical destination, migration status, and exclusion reason.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time reader can reach any publication type from the primary navigation in no
  more than three interactions on desktop or mobile.
- **SC-002**: At least 95% of catalogue searches and filter changes update the visible results within
  one second on a mid-range mobile device after the page is loaded.
- **SC-003**: All public publication journeys can be completed using only a keyboard, with no serious
  WCAG 2.2 AA violations in an automated scan and manual focus-order review.
- **SC-004**: An editor can create, validate, and submit a complete magazine issue in under ten
  minutes, excluding the time needed to transfer the PDF.
- **SC-005**: The migration report accounts for 100% of inventoried legacy publication URLs as
  migrated, redirected, or explicitly excluded with a reason.
- **SC-006**: Invalid, unauthorized, conflicted, and interrupted publication changes create no
  partially published public record.
- **SC-007**: The public catalogue and document detail pages remain usable when the authoring service
  is unavailable.

## Assumptions

- The first migration covers items discoverable from the current Publications menu and the About Us
  constitution link; deeper unlinked media is inventoried separately.
- English interface labels are used in the first release while publication titles and metadata may
  use their source language.
- PDFs have publication rights or organizational permission before migration; rights review is an
  editorial responsibility and must be recorded when uncertain.
- Full-text PDF indexing, OCR, subscriptions, payment collection, and book fulfilment are outside
  PUB-001.
- The final public implementation will reuse the new site's established layout and theme; the saved
  layout is an interaction/design reference.
- An asset custom domain is deferred to a later release.

## Dependencies

- `cms-backend/specs/001-publications-storage/` owns the publication service and asset contract.
- `admin-portal/specs/001-publications-editor/` owns the authenticated editorial experience.
- The publication inventory and rights review must be approved before bulk migration.
