# Research: Publications Library and Menu

## Decision 1: Preserve the current publication taxonomy

**Decision**: The new menu is `Publications` → `Magazines` → “‘BREAKTHROUGH’ Journal,” “Prakriti
(Bengali),” and “Breakthrough Bulletin (Hindi),” plus sibling destinations `Major articles` and
`Books`. The new landing page may add an “All publications” link without replacing those labels.

**Rationale**: These are the labels and relationships visible on the current site. Preserving them
reduces migration surprise and allows old category URLs to map cleanly.

**Alternatives considered**: One flat publications list was rejected because it hides the three
established series. Folding Major articles into the existing Articles section was rejected because
the source site treats them as a distinct publication collection and many are PDF-led.

**Sources**:

- [Current home navigation](https://breakthroughindia.org/)
- [Magazines archive](https://breakthroughindia.org/category/magazines/)
- [Major articles](https://breakthroughindia.org/major-articles/)
- [Books](https://breakthroughindia.org/books/)

## Decision 2: Use Git for metadata and R2 Standard for binary documents

**Decision**: Store publication metadata as Hugo content and large PDFs under `publications/` in the existing `cms-media` R2 Standard
bucket, using a separate Publications Worker binding. The content record stores an immutable asset key and metadata; the public hostname is derived
from configuration.

**Rationale**: The site already builds from Git, so this retains review, history, rollback, and static
availability. PDFs are a poor fit for Git history. As of 2026-10-30, R2 Standard includes 10 GB-month,
1 million Class A requests, and 10 million Class B requests monthly at no charge, then charges for
storage/operations without Internet egress fees. Standard avoids Infrequent Access retrieval charges
and minimum duration, which is more predictable for public documents.

**Alternatives considered**: Git LFS adds bandwidth/hosting workflow overhead; a metadata database
duplicates the Git source of truth; WordPress hotlinks preserve a legacy dependency; Infrequent
Access saves little at this scale and adds retrieval fees.

**Source**: [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)

## Decision 3: Keep the public URL configurable and defer the custom domain

**Decision**: Implement `publication_asset_base_url`/`R2_PUBLIC_URL` configuration now. Use the
managed `r2.dev` URL only for staging or low-volume validation until the user adds the custom domain.

**Rationale**: Cloudflare states that `r2.dev` is rate-limited, lacks cache/WAF controls, and is
intended for non-production traffic. The requested deferral is therefore safe for implementation and
staging, but remains a production-operability follow-up. Keeping the base URL out of every record
makes the later switch configuration-only.

**Alternatives considered**: Hard-coding `r2.dev` would create a migration and reliability risk.
Proxying every public PDF through a Worker would add request cost and an unnecessary runtime reader
dependency.

**Source**: [Cloudflare public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)

## Decision 4: Generate a static catalogue index

**Decision**: Render publication pages at build time and generate a publications-only JSON index for
progressive client filtering.

**Rationale**: The initial archive is small enough to filter locally, readers do not need a runtime
database, and public access remains available during backend outages. The index can be split or
replaced later if measured size or latency crosses the stated targets.

**Alternatives considered**: Server-side search adds a service dependency and operating burden.
Embedding entire PDFs for full-text search is excessive and out of scope.

## Decision 5: Refactor navigation into a generic hierarchy

**Decision**: Replace the one-off State Chapters dropdown markup/behaviour with a reusable menu
partial and generic disclosure behaviour that supports both State Chapters and Publications.

**Rationale**: Copying a second special-case dropdown would duplicate accessibility logic and create
inconsistent mobile behaviour. Hugo menus already represent parent-child relationships.

**Alternatives considered**: A publications-only hard-coded partial was rejected as short-term
duplication. A mega-menu library was rejected because the two small hierarchies do not justify a
new dependency.

## Decision 6: Keep the constitution outside the catalogue by default

**Decision**: Migrate the constitution PDF to the same R2 document bucket and store its asset key in
About Us content/configuration, but set `catalogue: false` and retain the About Us link.

**Rationale**: It benefits from the same inexpensive storage and upload controls but is an
organizational document, not a magazine, major article, or book.

**Source**: [Current About Us constitution link](https://breakthroughindia.org/about-us/)

## Decision 7: Use an explicit migration inventory

**Decision**: Inventory before downloading/uploading, including rights status, duplicates, missing
PDFs, legacy URLs, and the final disposition of every item.

**Rationale**: The live archives contain uneven metadata and category pages with sparse or duplicate
entries. An inventory prevents silent gaps and makes migration repeatable and reviewable.

## Decision 8: Adopt Spec Kit plus Graphify as complementary records

**Decision**: Commit Spec Kit constitutions, specifications, plans, contracts, checklists, and tasks
in each owning repository. Update Graphify after meaningful source/document changes and query it for
cross-file impact; do not treat the graph as the requirements source of truth.

**Rationale**: Spec Kit records intent, decisions, and task ownership. Graphify records the actual
code/document relationship graph. Together they support multiple developers without mixing planned
and implemented state.

**Alternatives considered**: A single root-only spec would not be visible in the independent repo
histories. Post-commit-only graph hooks were not selected because this workspace is multi-repository
and documentation updates must also be captured deliberately.
