# PED-011 — Django model and migration prerequisite repair

**School:** Builder → Django and API Engineering. Parent work: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318). Builds on [PED-010](./ped-010-builder-django-first-principles.md).

## Concrete learner-order defect

The published path previously placed **Steward SQL to Django ORM: One Canonical Domain** before **Models and Domain Data**. Its reading supplied multi-model `registry/models.py`, `ForeignKey`, `makemigrations`, `sqlmigrate`, `migrate` and PostgreSQL-backed QuerySets before teaching the student what a Django model or migration does. The post-composition practicals compounded this error:

- The Django Foundations practical required initial Team/Service/Environment model mapping and a migration before those subjects were introduced.
- The DRF practical required a persisted GET /services endpoint using a Service model before the model lesson.
- The Models practical jumped straight into completing the Steward schema, instead of using an independently understood small model.

This is the same class of prerequisite failure that real learner feedback exposed in PostgreSQL/Docker; green source tests do not establish dependency correctness.

## Revised learner progression

1. Existing Django Foundations: project, application, settings, request, URL and plain view; the practical creates only a working HTTP boundary.
2. Existing Django REST Framework: parsers, renderers, response/error semantics; the practical uses a no-model echo endpoint, not hidden persisted Service data.
3. Existing Projects, Applications and Boundaries: separate app responsibilities before persistence design.
4. **Models and Domain Data** (same lesson/activity ID): one plain `catalogue.models.Book`, fields, primary key, database constraints, NULL versus blank, manager versus actual table. No query executed yet.
5. **Create Your First Django Migration** (new unique lesson/activity IDs): `makemigrations`, review migration file, `sqlmigrate` versus `migrate`, real Book table, idempotent insertion, duplicate ISBN rejection and persistence into a new shell process. Uses scratch SQLite only to isolate the model/migration concept; the learner's prior PostgreSQL knowledge still applies.
6. Existing **Steward SQL to Django ORM: One Canonical Domain** (original activity ID retained): the first multi-table PostgreSQL/Django model mapping, against a new *Django-managed* PostgreSQL database, not the manually seeded SQL lab.
7. Existing QuerySet and advanced schema-evolution lessons follow after models and first migration are understood.

The new migration lesson is not a compressed production migration module. Full compatibility/backfill and phased releases stay in **Schema Evolution with Django Migrations** later in the module.

## Technical evidence

The existing `scripts/check-builder-django-live-lab.mjs` now guards the actual authored lesson order, inspects the final practical override layer to reject pre-model requirements, and constructs `catalogue/models.py` from the *published reading*. With actual Django installed, it generates 0001, runs `sqlmigrate`, checks creation of `catalogue_book` and its unique ISBN constraint, applies the migration, runs `book_model_lab.py` to prove a real `IntegrityError`, and checks that a second shell retrieves the same Book. This is in addition to the previous DRF 200/201/400/404/405/406/415 and real Steward PostgreSQL bridge tests.

**Do not claim passing until the matching-head workflow finishes.** The CI job uses a disposable environment; it does not validate a novice's understanding or the hosted page.

## Acceptance boundaries

- [x] Reorder existing lesson ID and split initial migration into one independent new reading/practical/check.
- [x] Remove early ORM setup from Django Foundations/DRF practicals and make Model practical independently approachable.
- [x] Extend source-derived real Django test with object creation, rejected duplicate and second-process retrieval.
- [ ] Matching-head full workflow success.
- [ ] Human inspection of rendered page ordering and code readability, including progress preservation after adding one new lesson.
- [ ] Uncoached novice transfer: create an unfamiliar table/model in a scratch project, explain its generated migration and diagnose a duplicate or missing-table error without assistant input.

The remaining Django lessons and other Builder modules stay open in the school-level tracker; this is **source remediation**, not module-wide learner validation.

## Independent ForeignKey lesson added before the applied bridge

The first Book model and migration cannot by themselves explain the multi-table `Service.owning_team` relationship. A separate **Connect Django Models With ForeignKey** lesson now follows the initial migration, keeping the broader Steward ORM chapter *after* all three prerequisites. It adds `catalogue_writer` and optional `Book.writer` with a second migration rather than deleting existing records. The reading and practical explain `writer_id`, forward `book.writer`, reverse `writer.books`, temporary nullable migration compatibility and the distinction between Django `on_delete=PROTECT` and actual database-level constraints. `book_writer_lab.py` demonstrates the saved foreign key and an actual rejected deletion, proving the existing Book remains.

The Django CI runner extracts the **exact published replacement models.py**, generates and inspects migration `0002`, checks its writer table and FK column, applies it, runs the source-published relationship script and asserts the real `ProtectedError`. Source order now requires Model → First Migration → ForeignKey → Steward ORM. This strengthens the initial remediation; it is still subject to matching-head CI and independent learner validation.
