# Publication Content Contract v1

**Owner**: `cms`

**Consumers**: `cms-backend`, `admin-portal`, Hugo layouts and migration tooling

**Status**: Proposed for implementation review

The authoritative field constraints are in [data-model.md](../data-model.md). The backend's
authoritative HTTP representation is
`cms-backend/specs/001-publications-storage/contracts/publications-v1.openapi.yaml`.

## Compatibility rules

- Additive optional fields are a MINOR-compatible change.
- Constraint clarifications that do not reject previously valid records are PATCH-compatible.
- Renaming/removing fields, changing enum values, or making an optional field required is a MAJOR
  change and requires a migration plus coordinated consumer release.
- Consumers MUST ignore unknown optional fields and MUST reject unknown `publication_type` values.
- `publication_id` and stored asset keys are immutable.

## Persistence contract

- One content file represents one publication.
- The expected repository path is `content/publications/<publication_id>/index.md`.
- Draft and future-dated records are omitted from all public outputs.
- `document.key` is persisted; `document.public_url` is derived from configuration.
- The backend serializes front matter deterministically so no-op edits do not create noisy commits.

## Validation ownership

- `cms/data-model.md`: semantic schema and public display meaning.
- Backend: authoritative security and mutation validation.
- Admin portal: early field feedback using the same enumerations/constraints.
- Hugo: safe rendering and final omission of non-public records.
