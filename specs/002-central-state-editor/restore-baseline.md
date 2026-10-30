# Pilot baseline and restoration requirements

Recorded locally on 2026-10-30; these are source HEADs, not verified live deployment versions or complete backups.

| Repository | Source HEAD |
|---|---|
| cms | d5cdd295ec9fa75b7b70630ebda21ed24744a0d1 |
| cms-backend | 7e7b9c40daafeae67f85d9b31b94ba61ae192337 |
| admin-portal | 1e62f8c25b449c08c0574d4af48f55d6c69b4e5c |
| cms-karnataka | c1c2daa8fd3d77fbcbf45f072d3e951c205f5588 |
| cms-kerala | 1f64e7bded9b9a27c18f06cf51f22c8d141d0e91 |

Publication reconciliation is uncommitted in cms, cms-backend, and admin-portal. Preserve it separately from this pilot; HEAD alone does not recover those working-tree changes. Do not reset or discard them. Both state repositories were clean when inspected.

## Before any cutover

1. Record actual deployed public/admin/editor and Worker versions; capture current state registry, authorization configuration and grants in access-controlled recovery storage.
2. Create verified Git bundles or remote recovery refs for relevant source histories and retain reviewed working-tree patches. Record checksums and perform a restore into an isolated directory. No backup has been created merely by this document.
3. Export required D1 data/configuration securely, inventory R2 objects and immutable snapshot retention, verify provider recovery access. Keep credentials and personal data out of this repository.
4. Record candidate and baseline build inputs, state commit IDs, approval manifest revision, static release artifact, and exact dependency versions. Keep the old state editor deployable throughout the pilot.
5. Rehearse rollback in a nonproduction environment, including new content written after cutover and stale/withdrawn approvals. Record operator, timestamps, outcome, and duration before enabling pilot traffic.

## Rollback procedure to make executable during planning

- Freeze pilot writes briefly and record latest state content heads; preserve unsaved work and all new commits.
- Disable the pilot editor route and restore the old Karnataka editor deployment/configuration and necessary exact OAuth origins. Do not broaden repository permissions.
- Restore the previous public release artifact or revert only pilot application changes using reviewed forward commits. Never reset state history or overwrite content with the baseline checkout.
- Preserve national approvals/snapshots and their audit trail for a later rollout. The owner explicitly permits full restoration of pre-pilot behavior, including the legacy state-controlled national-selection flag. Record when that behavior is restored and communicate that revision-based national approvals are inactive. Freezing a reviewed static release remains an optional alternative, not a mandatory rollback restriction.
- Verify old-editor sign-in, own-state save, cross-state/direct-main-write denial, state content retained, expected baseline national-selection behavior, and no dispatch loop. Preserve new approvals for later reactivation without treating them as active enforcement. Resume writes only after checks pass.
- Remove no repo, table, R2 object, approval record, or old editor during the rollback window. Pilot cleanup is a later explicitly scoped operation.

Target: restore editing within 30 minutes excluding provider outages. All steps require executable commands, verified release identifiers, and a successful rehearsal in the implementation plan; this document records requirements rather than pretending a restore point is already operational.
