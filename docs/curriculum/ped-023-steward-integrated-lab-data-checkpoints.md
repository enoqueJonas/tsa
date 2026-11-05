# PED-023 — Split Steward API skeleton into relational checkpoints before HTTP assembly

**Curriculum:** Builder → Django & API Engineering, after existing Model, migration, QuerySet, DRF, OpenAPI/configuration lessons; strictly before the integrated `Lab: Steward API Skeleton`. Preserve the original lab ID, brief, build and review activity IDs and saved progress semantics.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-022](ped-022-django-startup-configuration-lab.md).

## Confirmed learner-order defect

The previous lab's only build activity demanded, in one 240-minute assignment, the complete Team/Service/Environment/ServiceDependency/ServiceReview design, migrations, APIs, validation, N+1 measurements, error mapping, OpenAPI, configuration and logging. But the Django source-backed registry established only Team/Service/Environment and their migrations; no `ServiceDependency` or `ServiceReview` was defined. A beginner could neither produce the required two models independently nor verify their invariants with an unambiguous starting point. Source order was also misleading: the earlier SQL exercises covered these relations as data-model sketches, not working Django ORM classes.

The canonical earlier [PostgreSQL lesson](../../packages/runtime-kernel/src/paths/builder-postgresql-deep.ts) defines `service_dependency` with two Service FKs, ordered-pair uniqueness and `source_service_id <> target_service_id`. Its `service_review` example uses `service_id`, reviewer text, verdict pass/followup and timestamptz; importantly this was **TEMP** and the teaching source explicitly stated it did **not** provide permanent foreign-key enforcement. This PR transfers that contract deliberately rather than pretending a ready-made schema exists.

## Two complete prerequisite lessons

### 1. Map a Directed Service Dependency into Django

- Append `ServiceDependency` to the existing `registry/models.py` after the full 0004 slug migration. Two explicit Service ForeignKeys with distinct reverse names and PROTECT; a DB `UniqueConstraint` on `(source_service,target_service)` and a DB `CheckConstraint` rejecting self-dependencies.
- Generate, inspect with `sqlmigrate`, then apply 0005. `makemigrations --check --dry-run` must report no model/migration drift.
- Execute published `registry/dependency_integrity_lab.py` on actual PostgreSQL: two opposite directed edges are distinct; the database rejects self-dependency, duplicate same-direction pair and missing Service FK with unchanged row count; protected target deletion raises `ProtectedError`.
- A separate Python process reopens the edge and confirms persistence.
- **Scope boundary:** no acyclic graph guarantee (A→B→C→A remains possible), permissions or safe public endpoint.

### 2. Persist a Steward Service Review History

- Append `ServiceReview` with Service FK + PROTECT, fictional reviewer text, fixed verdict choices with a database CheckConstraint, time-zone-aware reviewed_at and deterministic ordering by reviewed_at then PK.
- Generate, inspect and apply 0006, only after 0005. Verify no migration-state drift.
- Execute published `registry/review_history_lab.py` once on the isolated schema DB: three historical events for one Service, including equal-timestamp events with distinct IDs, remain stored. Invalid verdict and missing Service FK writes are rejected at DB level without mutating row count. Deleting a reviewed Service is protected. A fresh Django shell reopens the three events and original Service slug.
- **Scope boundary:** a historical table is NOT immutable. Direct SQL UPDATE/DELETE is not blocked; reviewer text does not identify an authenticated principal. Actual Identity, retained review-history policy, edit/retention privileges and HTTP route security remain future work.

## The integrated lab is explicitly staged

The existing `django-and-api-engineering-lab-steward-api-skeleton` and its `-brief`, `-build`, `-review` IDs are preserved. Two new activities precede the original build: `-dependency-checkpoint` and `-review-history-checkpoint`. Each references the complete source-published lessons, actual migrations and observable failure cases. The previous all-in-one 240-minute builder is narrowed into a separately named HTTP **assembly** stage, with explicit prerequisites, security boundary and evidence requirements. The assembly itself is **not** declared novice-validated or production-ready by these schema tests: Service create/detail and ServiceReview create/list must still be completed and proved as one coherent running application.

## Acceptance evidence and verification limits

- Learner source: `packages/runtime-kernel/src/paths/builder-django-rich.ts`.
- Practical overrides: `packages/runtime-kernel/src/paths/builder-django-quality.ts`.
- Source-derived PostgreSQL test: `scripts/check-builder-django-live-lab.mjs`: after the actual original schema 0001–0004 migration chain, append exact published models, generate 0005 and 0006, inspect SQL, execute exact two lab scripts and independent process reopen checks. No mock SQL and no dependency on a training-only public API.
- Source IDs/checkpoints asserted. Full 19-job CI matching the exact head required before merge.
- **Human rendered depth, saved-progress reentry and uncoached novice transfer are not verified by passing CI**. Keep issue #321 open.
- No regression work on already-studied PostgreSQL; existing IDs unchanged.

**Next forward-only:** implement the missing Service + ServiceReview HTTP route layer for the integrated lab, then measurable SQL query counts/OpenAPI/logging and full application startup. Identity-derived authorization remains strictly in the next module.
