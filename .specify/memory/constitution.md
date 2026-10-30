<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Added principle: Sustainable Cost and Resource Use
- Added sections: Architecture Constraints; Delivery Workflow and Quality Gates
- Removed sections: none
- Deferred items: none
-->
# Breakthrough Science Society Website Constitution

## Core Principles

### I. Static-First Content
Published content MUST be represented as reviewable files in Git and rendered into a static site.
Runtime services MAY manage binary assets and authoring workflows, but the public site MUST remain
readable when those services are unavailable. New dynamic dependencies require a documented need,
failure mode, and operating cost.

### II. Theme and Accessibility Consistency
New pages MUST reuse the site's established layout components, typography, spacing, colour tokens,
and responsive behaviour. Interactive controls MUST be keyboard operable, expose visible focus,
use semantic HTML, and meet WCAG 2.2 AA contrast and labelling expectations. A design reference is
guidance, not permission to introduce a parallel visual system.

### III. Content Integrity and Compatibility
Content schemas MUST use stable identifiers, explicit validation, and documented optional fields.
Legacy URLs that have meaningful traffic or citations MUST receive aliases or redirects. Draft,
scheduled, and unpublished content MUST NOT appear in production outputs. Migration work MUST be
repeatable and preserve source provenance.

### IV. Security and Privacy
Secrets and privileged tokens MUST NOT be stored in this repository or exposed to the generated
site. Public pages MUST NOT depend on client-side credentials. External links, embedded content,
and uploaded metadata MUST be treated as untrusted. Collect no personal data unless a documented
feature requires it and defines retention and consent.

### V. Verification and Performance
Every feature MUST define independently testable acceptance scenarios before implementation.
Changes MUST pass the production Hugo build and relevant automated checks. Public pages MUST use
progressive enhancement, bounded asset sizes, and resilient empty/error states; regressions in
accessibility, navigation, metadata, or Core Web Vitals require explicit review.

### VI. Sustainable Cost and Resource Use
Every material feature MUST document expected build, storage, bandwidth, request, and maintenance
costs at current and anticipated scale. New paid services MUST identify an owner, pricing model,
usage limits, monitoring approach, and exit strategy. Designs SHOULD reuse existing infrastructure
and avoid duplicated storage or databases unless measured requirements justify them. Cost savings
MUST NOT weaken security, privacy, accessibility, reliability, or recoverability.

## Architecture Constraints

- Hugo content and data files are the public metadata source of truth.
- Large documents and media MUST be stored outside Git; content records reference configurable
  public asset URLs.
- Cross-repository interfaces MUST have a versioned contract with one named authoritative owner.
- Site navigation MUST remain data-driven and support both pointer and touch/keyboard interaction.
- New dependencies MUST be justified against build size, maintenance burden, and static-site value.

## Delivery Workflow and Quality Gates

Material features MUST progress through specification, clarification, plan, requirements-quality
checklist, tasks, and consistency analysis before implementation. Each task MUST name its owning
repository and file path. Pull requests MUST identify the requirements and acceptance scenarios
they satisfy, include rollback or migration notes where relevant, and update Graphify after source
or documentation changes. Contract changes land before consumers and remain backward compatible
until all consumers migrate.

## Governance

This constitution overrides conflicting local conventions. Amendments require a documented reason,
an impact review across active specifications, and approval by a repository maintainer. Versioning
uses semantic versioning: MAJOR for incompatible principle changes, MINOR for new or materially
expanded rules, and PATCH for clarifications. Reviewers MUST verify constitution compliance; any
exception MUST be time-bounded and recorded in the relevant implementation plan.

**Version**: 1.1.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-30
