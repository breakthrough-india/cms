# Feature Specification: Central State Editor and National Revision Approval Pilot

**Feature Branch**: Not created; specifications are independent of branch naming.
**Created**: 2026-10-30
**Status**: Specification validated; technical planning next; pilot not deployed.
**Input**: Keep state repositories, centralize editing, prevent cross-state/national edits, allow only national editors to approve exact state revisions for national placement, and provide tested restoration paths.

## User Scenarios & Testing

### User Story 1 — Edit only my state's content (Priority: P1)

A Karnataka editor uses the shared editor to create and update Karnataka articles, news, and events without receiving authority over Kerala or national content.

**Why this priority**: Centralization must preserve editorial isolation.
**Independent Test**: With Karnataka-only, Kerala-only, national-only, revoked, and owner identities, exercise visible controls and direct requests against every content target.

**Acceptance Scenarios**:

1. **Given** a Karnataka-only editor, **When** they publish Karnataka content, **Then** the state page updates while national placement is unchanged.
2. **Given** that editor, **When** they manipulate a target, path, state field, or request to change Kerala, national content, permissions, workflows, or editor settings, **Then** the operation is denied and no mutation occurs.
3. **Given** revoked access, **When** the next mutation is attempted, **Then** access is rechecked and denied, preserving unsaved work for recovery.
4. **Given** an existing item's newer revision, **When** a stale editor saves, **Then** no overwrite occurs and local values remain recoverable.

### User Story 2 — Approve an exact revision nationally (Priority: P1)

A nationally authorized editor previews a published state item and explicitly approves that version for national placement.

**Why this priority**: State publication must not imply national endorsement.
**Independent Test**: Approve revision A, publish state revision B, and confirm the national card, destination page, and assets still show A. Approve B separately and then withdraw approval.

**Acceptance Scenarios**:

1. **Given** an unapproved state item, **When** a state editor publishes it or sets an old national-display flag, **Then** it appears only in state contexts.
2. **Given** published revision A, **When** a national editor approves it, **Then** national surfaces and their destination render the reviewed A, with an audit record identifying reviewer and time.
3. **Given** approved A, **When** the state changes body, title, slug, date, images, or documents in B, **Then** national A remains unchanged and B is shown as awaiting further review.
4. **Given** approved A, **When** the state deletes/unpublishes its current item, **Then** national A remains available until a national editor withdraws it; the reviewer sees a source-status warning.
5. **Given** a withdrawal, **When** the next successful release completes, **Then** national listings and the national snapshot page stop exposing that item; the state's publication is unchanged.
6. **Given** a stale preview or competing approval, **When** approval is submitted, **Then** the exact reviewed revision is required and conflicting edits do not silently replace it.

### User Story 3 — Restore the pre-pilot service (Priority: P1)

An operator can disable the pilot and restore the previous editor/build while retaining all content written during the pilot.

**Why this priority**: A pilot must be reversible without data loss.
**Independent Test**: Rehearse a cutover and reversal outside production, checking publication availability, edit access, national decisions, and pilot-created content.

**Acceptance Scenarios**:

1. **Given** a failed candidate release, **When** validation fails, **Then** the last successful public deployment remains available.
2. **Given** pilot-created content and recorded baselines, **When** rollback is executed, **Then** the old editor works and that content remains in its state repository.
3. **Given** an operator chooses full pre-pilot rollback, **When** the old application/build is restored, **Then** its existing state-controlled national-selection behavior may return. The operator records this known limitation; revision-based national approval can be reintroduced in a later rollout.

### User Story 4 — Release one editor fix (Priority: P2)

An operator releases one shared editor fix without modifying or deploying state editor copies.

**Why this priority**: This is the maintenance benefit motivating centralization.
**Independent Test**: Release a visible editor correction for the pilot and verify the state's content repository and legacy editor assets need no changes.

**Acceptance Scenarios**:

1. **Given** the shared editor, **When** its runtime changes, **Then** all enabled pilot users receive the same version and Kerala's existing editor remains available.

### Edge Cases

- Identical slugs across states, renamed/deleted source files, rewritten history, missing approved revisions, mutable external images, unsafe HTML, and draft/future source revisions.
- Missing or malformed approval records, manipulated repository/state identifiers, disabled chapters, revoked roles, expired sessions, concurrent saves/approvals, and failed release notifications.
- Source revision or asset unavailable: reject the candidate approval/release; never substitute latest content. Already published pages remain available.
- Withdrawal takes effect only after a successful release; report pending/failed release accurately.

## Requirements

### Functional Requirements

- **FR-001**: Keep independent state content stores and pilot Karnataka first; use Kerala as a cross-state denial/control case without moving its editor.
- **FR-002**: Reuse existing sign-in and grants; check both active state/action authorization and repository write permission before every mutation. Deny unknown targets and overbroad paths.
- **FR-003**: Allow state editors to change their own articles, news, and events only; prohibit edits to national approvals, other states, layouts, settings, workflows, and grants.
- **FR-004**: Offer national selection only to explicitly authorized national editors. State-controlled display flags MUST NOT authorize national placement. Owner access is explicit, not inferred from a state grant.
- **FR-005**: Approval MUST bind a stable state/item identity, an exact reviewed content version, reviewer identity, time, and allowed national placement. Source changes never automatically advance approval.
- **FR-006**: National cards, search results, feeds, taxonomies, destination pages, and associated media MUST use the approved version. State pages may use the latest published state version. Ordinary links MUST NOT send national readers to an unapproved latest version.
- **FR-007**: Material supporting media MUST be immutable or captured with the approved content; changing an image or PDF at the source MUST NOT change the approved presentation silently.
- **FR-008**: Validate source state, path, published status, revision existence, and media availability before approval. Block draft/future content approval and reject invalid snapshots without exposing private material.
- **FR-009**: Support review of newer state revisions, approval replacement, and national withdrawal with optimistic concurrency and auditable history. Retain state content on national withdrawal.
- **FR-010**: Generate enabled state targets and build inputs from one reviewed registry; reject unknown sources and content collisions rather than silently omitting or overwriting content.
- **FR-011**: Preserve current public routes wherever possible; distinguish national approved snapshots from current state pages and avoid duplicate canonical URLs.
- **FR-012**: Preserve the previous editor/deployment and record restorable baselines before cutover. Rehearse full pre-pilot reversal without deleting pilot-created content. Per the owner's explicit recovery choice, rollback may restore legacy state-controlled national selection; record this limitation rather than claiming new national approval enforcement survives full rollback. Cross-state repository permissions must remain unchanged.
- **FR-013**: Use established typography/components and accessible controls; clearly distinguish state publication, national approval, and pending public release. Preserve local work on conflicts or failures.
- **FR-014**: Keep public approved content readable during editor/service outages; failed validation must not replace the last successful release.
- **FR-015**: Reuse current hosting/storage where practical; document measured build/request/storage costs, bounded limits, an operating owner, and a 30-day review before rollout beyond the pilot.

### Key Entities

- **Chapter**: stable state identity, content source, enabled/pilot status, public/editor routes.
- **Editorial grant**: identity, permitted state targets, allowed actions, active/revoked status.
- **State item**: stable identity, collection, current version and publication state.
- **National approval**: state/item identity, exact approved version, placements, reviewer, timestamp, approval/withdrawal history.
- **Approved snapshot**: reviewed content and immutable supporting assets, provenance and national destination.
- **Pilot baseline**: source versions, deployment versions, configuration references, recovery evidence; no credentials.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All cross-state, national-write, revoked-user, and path-manipulation denial cases pass with zero unauthorized mutations.
- **SC-002**: In all A-to-B revision tests, national content and assets remain A until B is explicitly approved.
- **SC-003**: Every national state item has a traceable reviewer and exact reviewed revision; no legacy flag alone qualifies an item.
- **SC-004**: One shared editor release updates the pilot without a state editor deployment.
- **SC-005**: A rehearsed rollback restores editing within 30 minutes excluding provider outage, retains all pilot content, and preserves the national approval boundary.
- **SC-006**: Keyboard and 320/768/1280-width checks pass for edit/review/approve/withdraw flows; users can distinguish publication and approval states.
- **SC-007**: Missing-source/revision/media tests leave the last successful public release available; duplicate-content tests never overwrite another state's item.

## Assumptions

- Karnataka is the initial pilot; expansion to Kerala follows acceptance, not automatic activation.
- State editors may retain existing direct access to their own repository; national approvals are stored outside state control.
- Existing state-owned national selections are not automatically approved. A national editor must review initial selections before national cutover.
- Latest state deletion does not silently revoke an approved national snapshot. National withdrawal is the explicit removal control.
- No repository deletion, history rewriting, new paid service, domain migration, or blanket permission expansion is part of this pilot.
- This specification authorizes preparation and implementation work. Live cutover follows verification of restore evidence and identity-specific acceptance checks; no successful deployment is claimed by writing these documents.
