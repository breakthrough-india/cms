# PUB-001 Delivery Roadmap

| Milestone | Scope | Repository owner | Exit gate |
|-----------|-------|------------------|-----------|
| M0 – Contracts | Content model, API v1, roles, error model | all; backend contract owner | three plans pass analysis |
| M1 – Storage service | streamed PDF upload, validation, R2 keys, Git revisions | `cms-backend` | contract/security tests pass |
| M2 – Editor | management list, type-aware form, upload, preview, conflict recovery | `admin-portal` | UI/build/a11y tests pass against fixtures and staging |
| M3 – Public library | menu, landing, collections, detail, static index | `cms` | Hugo/build/schema/a11y checks pass |
| M4 – Pilot content | constitution plus a small issue/article/book set | integrator | end-to-end publish and redirect checks pass |
| M5 – Migration | reviewed inventory and batched archive import | integrator/editorial | 100% inventory disposition |
| M6 – Production asset domain | R2 custom domain, cache/security controls, URL switch | infrastructure owner | custom-domain smoke and rollback checks pass |

## Parallel development after M0

- Developer A: `cms` navigation/layout/index work against approved fixtures.
- Developer B: `cms-backend` worker, validation, contract and tests.
- Developer C: `admin-portal` workflow against the versioned OpenAPI fixtures.
- Integrator/editorial reviewer: inventory, rights review, pilot migration, cross-repo acceptance.

M1, M2, and M3 can progress concurrently after contract approval. Real upload integration depends on
M1; full end-to-end acceptance depends on M1–M3. M6 remains intentionally deferred.

## Definition of ready for implementation

- Constitutions, specs, plans, data models, quickstarts, and tasks exist in all three repositories.
- Content v1 and HTTP v1 contracts have named owners and compatible enumerations.
- No critical consistency-analysis finding remains.
- Publication inventory format and rights-review owner are accepted.

## Definition of done for PUB-001 (excluding M6)

- Public navigation and publication pages pass build, keyboard, responsive, and empty-state checks.
- Authorized editors can draft, upload, preview, publish, update, and recover from a conflict.
- Unauthorized users cannot mutate assets or metadata.
- Constitution and pilot publication documents are served from configured R2 staging/public access.
- Every inventoried legacy URL has a migration disposition.
- The remaining custom-domain work is represented as M6, not hidden as implementation debt.
