# PED-012 — Teach Django models and migrations before the Steward ORM bridge

**Learner position:** Builder, immediately after PostgreSQL → Django & API Engineering. Related: #318, #321, [PED-010](ped-010-builder-django-first-principles.md), [PED-011](ped-011-builder-logging-first-principles.md).

## Defect

The earlier source presented a complete multi-table Steward registry model before a beginner had created a single model and applied a first Django migration. The later **Models and Domain Data** reading supplied descriptions and Steward-only model fragments but did not provide a runnable first table. This is a teaching-order defect, not a missing-heading defect. No earlier PostgreSQL lessons need to be reopened.

## Added lessons, in prerequisite order

1. **Define Your First Django Model**: creates `catalogue/models.py` with one `Book`. Explains Python class vs instance vs database row, field descriptors, uniqueness, the implicit primary key and the fact that source code does not create a table.
2. **Turn a Model into a Database Table**: runs `makemigrations` → `sqlmigrate` → `showmigrations` → `migrate`, with explicit before/after state. A reproducible `Book` lab differentiates `full_clean()` field validation from database-enforced unique constraints; an unmigrated-query failure is expected and explained.
3. **Create Relationships Between Django Models**: appends `ReadingList` and `ReadingListEntry`, generates migration 0002, and demonstrates a real composite `UniqueConstraint`, protected Book deletion, and cascade list deletion using Django's ORM. Explains that `on_delete` in Django is an ORM-level deletion policy and must not automatically be equated with SQL `ON DELETE` semantics.

The **existing Steward SQL to Django ORM** lesson and its ID remain in place, but now follow the three general-purpose, runnable lessons. The later **Models and Domain Data** chapter retains its original ID and becomes the application-stage mapping, rather than the first exposure to models. The following advanced Schema Evolution lesson remains the place for data-preserving production changes (expand/backfill/contract), not the first time the learner sees a migration.

## Prerequisites and setup

Reuse `tsa-django-intro` and its registered `catalogue` app from prior Django introductory lessons. The default disposable local SQLite database is acceptable to explain Django's model/migration mechanics. It is *not* a substitution for the earlier PostgreSQL school or the separate PostgreSQL-backed `tsa_steward_django_lab` used for the applied Steward bridge. Do not ask the learner to create a Docker container, a production database or a fully integrated Steward API to complete these fundamentals.

New practical overrides in `builder-django-quality.ts` keep these activities on the same scratch catalogue, with actual artifacts, commands, expected results and meaningful failure evidence. Their IDs are additive; the established Steward lesson IDs are unchanged.

## Research map

| Source | Inspected for | Translation into TSA |
| --- | --- | --- |
| [Django 5.2 model guide](https://docs.djangoproject.com/en/5.2/topics/db/models/) | Field, model, relation and primary-key mapping | Runnable `Book`, then explicit joined `ReadingListEntry` rather than domain jargon |
| [Django 5.2 migration guide](https://docs.djangoproject.com/en/5.2/topics/migrations/) | Generating versus applying migrations; SQL and migration inspection | Before/after `showmigrations`, inspected `sqlmigrate` and true missing-table negative |
| [Django 5.2 model instance validation](https://docs.djangoproject.com/en/5.2/ref/models/instances/#validating-objects) | `full_clean` is not called automatically on `save` | Independent invalid blank-title and database unique-violation demonstrations |

Django documentation is an authority, not a substitute for the authored explanations and executable labs. External videos have not been represented as viewed or verified for this change.

## Source-executed evidence

`scripts/check-builder-django-live-lab.mjs` now extracts the exact authored model, shell commands, persistence and relationship lab programs. The existing real Django job checks: (a) an unmigrated table fails, (b) initial and second migration produce inspectable SQL and applied state, (c) one Book persists, (d) Python-side blank-title failure and database duplicate-title failure differ, (e) composite membership uniqueness rejects a duplicate and (f) the ORM deletion policies preserve or remove the correct records.

**Status:** source authored and source-derived tests added. Technical execution is pending matching-head GitHub Actions. Rendered depth, practical navigation/persistence and genuinely independent student transfer are unverified, not implied by source execution.

## Next dependency

After the Django models and migration primer, continue the remaining Django material in actual learner order. Later module sequence: Identity/Authorization → Software Craft → Steward API v1 milestone → subsequent schools. This forward-only audit does not revisit already-read lessons without a demonstrated blocker.
