# PUB-001 Cross-Repository Ownership

| Concern | Authoritative repository/artifact | Consumers |
|---------|-----------------------------------|-----------|
| Public content fields and display meaning | `cms/specs/001-publications-library/data-model.md` | backend, admin |
| HTTP endpoints, errors, auth and wire schema | `cms-backend/.../contracts/publications-v1.openapi.yaml` | admin, migration tools |
| Public page/navigation behaviour | `cms/specs/001-publications-library/spec.md` | CMS implementation |
| Admin workflow and UI states | `admin-portal/specs/001-publications-editor/spec.md` | admin implementation |
| R2 key generation and cleanup | `cms-backend/specs/001-publications-storage/plan.md` | backend operators |
| Migration inventory and redirects | `cms/specs/001-publications-library/roadmap.md` | integrator |

## Change flow

1. Propose the change in the owning contract/specification.
2. Run Spec Kit consistency analysis in the owner and affected consumer repositories.
3. Merge/deploy additive contract support in the backend before consumers rely on it.
4. Update admin and public consumers.
5. Remove compatibility paths only in a later major contract revision.

No developer should copy a contract into another repository and edit it independently. A consumer
may keep generated fixtures/types, but their source version and checksum must identify the owner.
