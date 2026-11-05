# PED-015 — Populated Django schema evolution from first principles

**Learner cutoff:** PostgreSQL has been completed; this pass edits only subsequent Builder → Django and API Engineering lessons and their source-execution tests. Parent: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318). Prior sequence: [PED-012](ped-012-django-models-before-steward.md), [PED-013](ped-013-django-querysets-evaluation-and-n-plus-one.md), [PED-014](ped-014-django-domain-model-correctness.md).

## Observed instructional defect

The existing **Schema Evolution with Django Migrations** reading discussed four states (model source, migration graph, applied ledger, actual SQL data) but supplied only an isolated middle-stage `RunPython` example. It assumed a named `0002` field migration and required a final constraint migration without showing either file or a complete execution sequence. It promised a populated-table collision, repair, preservation check and rollback decision without a reproducible dataset or executable evidence.

The fix is not another high-level warning. The material is now divided into **two new independent catalogue lessons** and an applied **Steward** lesson retaining its existing ID.

## New learner order and example evidence

| Lesson | Question answered | Exact execution and negatives |
| --- | --- | --- |
| **Add a Field Without Losing Existing Django Rows** (new ID) | How can an existing table change without erasing its rows? | Existing Book and reading-list data; optional `edition_note`; generate/inspect/apply migration 0003; prove pre-migrate missing-column error, unchanged PKs and successful read-after-write |
| **Backfill a Unique Field Without Losing Data** (new ID) | How can old records safely acquire a mandatory unique value? | Nullable `shelf_code` in 0004, historical `RunPython` 0005, required/unique `AlterField` 0006; `River Guide` and `river-guide` collision; failed migration rollback; repair by renaming *one disposable training title* without deleting its PK; unchanged Book/Entry identities; database UNIQUE and NOT NULL refusals |
| **Schema Evolution with Django Migrations** (existing ID retained) | What changes when the same approach is applied to the Steward Service registry? | Dedicated PostgreSQL Django lab, 0002→0003→0004 complete files, UAT Services with slug collision, failure rollback and repair, original Service owner and Environment FK snapshots, actual database duplicate slug refusal |

The existing Django shell and direct SQL concepts are prerequisites only where they were previously taught. No Docker dependency, real production database, or early large-scale migration engineering is introduced as required classroom setup.

## Specific teaching and technical boundaries

- `makemigrations` writes candidate source; `sqlmigrate` previews generated SQL; `migrate` applies to the **selected** database; `showmigrations` reports Django's applied graph. The migration ledger and actual table contents remain separate evidence sources.
- `apps.get_model` in a `RunPython` uses the migration graph's historical model. A direct `registry.models` import can silently break fresh installations later. The migration uses `schema_editor.connection.alias` when saving.
- Slug normalization is **not injective**: distinct names can generate the same code. Collisions must be detected before a UNIQUE constraint or public API contract can depend on it.
- A failed atomic backfill rolls back the writes of that failed migration on the tested transactional database. A **successful** backfill with no `reverse_code` is *irreversible*; marking a reversal as `RunPython.noop` could misrepresent whether data was restored.
- The source-written test checks stable PKs and original FK relationships rather than only unchanged record counts.
- A single local Django `migrate` against a tiny fixture is **not** evidence of zero-downtime production deployment, lock safety, concurrent writer correctness, or recoverability across mixed application versions. Large tables and busy systems require a separate batched/online migration plan.

## Source and executable evidence

Affected teaching source: `packages/runtime-kernel/src/paths/builder-django-rich.ts`.

Exact practice overrides: `packages/runtime-kernel/src/paths/builder-django-quality.ts`.

Technical integration test: `scripts/check-builder-django-live-lab.mjs`, which reconstructs the beginner catalogue (SQLite) and separately manages the real PostgreSQL-backed Steward registry. The test extracts learner code *verbatim* from lesson captions, reconstructs each migration stage, asserts actual SQL history and data, deliberately fails a backfill, checks rollback and retry, and proves the final NOT NULL/UNIQUE contract rejects invalid SQL writes. The registry test also snapshots the original Service PK→Team FK and Environment PK→Service FK relationships.

**Verification status:** source authored and source-derived regression assertions written. Technical execution, build and browser status must be matched to a successful CI workflow at this branch's latest SHA before marking REMEDIATED+TECHNICALLY VERIFIED. Independently observed novice transfer and author-led rendered reading review remain **UNVERIFIED** even after CI success.

## Research map and original teaching translation

1. [Django 5.2 — Migrations](https://docs.djangoproject.com/en/5.2/topics/migrations/) — direct reference for migration graph, historical models and reversible vs irreversible operations; translated into explicit 0003/0004/0005/0006 file/state evidence.
2. [Django 5.2 — How to write migrations](https://docs.djangoproject.com/en/5.2/howto/writing-migrations/) — direct reference for adding a unique field in stages, `RunPython` and non-atomic/batched alternatives; translated into deliberate collision and failed atomic backfill.
3. [Django 5.2 — Migration operations](https://docs.djangoproject.com/en/5.2/ref/migration-operations/) — direct reference for `AddField`, `AlterField` and `RunPython` semantics; translated into complete published migration classes rather than a fragment.
4. [Expand and contract migrations — practitioner discussion](https://keninkujovic.com/blog/expand-and-contract-migrations) — a secondary source for compatibility windows and non-atomic production constraints; examples are independently authored for TSA. A video has not been represented as watched.

## Learner acceptance to be observed separately

Ask an independent beginner to add an optional field to a previously unseen populated model; then introduce a generated unique public identifier that collides for two distinct names. Require the learner to explain four states, capture exact PK/FK evidence, reproduce and diagnose the failed migration, recover without destroying records, and defend the final contract's operational limitations. Do not accept only copied commands or CI logs as proof of understanding.

**Next forward-only scope:** Django serializers, views, routing, validation and API error handling; filtering/pagination/versioning/OpenAPI; configuration/logging; integrated applied lab, then Identity/Auth. No backward audit of already-read PostgreSQL material.
