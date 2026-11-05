# PED-026 — Integrated Steward OpenAPI must match the migrated registry

**Date:** 2026-11-05. **Scope:** Builder → Django & API Engineering → Steward API Skeleton final integration checkpoint.

## Confirmed instruction gap and scope

At the beginning of this pass, the existing learner-visible lab had already been split: real directed ServiceDependency and ServiceReview models with migrations 0005/0006 and negative PostgreSQL tests, real Service/Review HTTP, and transaction-backed readiness HTTP 409/200 with safe logging. Those prerequisites are **already implemented and merged** in the earlier PED-023/024/025 work; this pass does not redo them.

The remaining original **Build Steward API Skeleton** checklist still required "Generate the API's actual OpenAPI document and compare ... to real HTTP" with no complete source to do so for the Steward integrated registry. The earlier Book OpenAPI lab was real but ran in an independent SQLite catalogue; it did not prove the *Steward* schema over the fully migrated PostgreSQL tables and actual training endpoints.

## Changes

A new **Verify Steward OpenAPI Against the Integrated Registry** lesson, complete practical override, and **Checkpoint 5: Verify the integrated OpenAPI contract** are placed immediately before the original final `-build` activity. All existing lesson/activity IDs remain unchanged; checkpoint ID is new.

The learner uses ONE existing migrated PostgreSQL registry after the preceding Service/Review and readiness examples:

- `registry/integrated_contract_views.py`: thin @extend_schema-annotated subclasses of the **existing** real `TrainingServices`, `TrainingServiceDetail`, `TrainingReviews`, and `TrainingPromotion`; they call the original methods through `super()`. Describes actual paginated list envelopes, Service/Review create/read types and an error envelope with explicit 409 readiness conflict.
- `registry/integrated_contract_urls.py`: one authoritative four-path URL configuration for both HTTP execution and schema generation.
- `registry/integrated_schema_urls.py`: includes those exact route objects and test-only schema/Swagger HTML endpoints; neither training URLConf may be included in `config/urls.py`.
- `config/settings.py` append-only generator configuration: maintained `drf-spectacular`, preserving existing PostgreSQL `DATABASES` and stable application error handler. Dependency is already installed in the real Django CI job and taught in PED-021.
- `registry/integrated_schema_contract_lab.py`: actual django Client requests with migrated PostgreSQL data. Checks schema path/method/status keys and request bodies, real scoped Service GET/list, persisted Service 201 and fresh GET, duplicate 400 no extra writes, Review 201/list and server-selected synthetic reviewer, readiness 409 unchanged lifecycle followed by stored production Environment allowing 200, other-Team scope 404 and unsupported 405; checks HTML/JSON schema endpoint status. Two syntactically valid-looking false schema mutations must fail: remove an actual detail response field and document a nonexistent route.
- `python manage.py spectacular --urlconf registry.integrated_contract_urls --format openapi-json --file registry/integrated_openapi.json --validate --fail-on-warn` ensures generated specification validation (separately from runtime conformance).

The test harness `scripts/check-builder-django-live-lab.mjs` extracts **exact published source** and runs the resulting SQL/HTTP/schema exercise after previously published migrations 0001–0006, Service/Review HTTP, and readiness evidence in the **same** isolated PostgreSQL Django project. No alternate fake API implementation is used for CI.

## Safety, pedagogical and verification boundaries

- All included Service/Review/readiness endpoints are **private instructional URLConfs**. Server-selected `TSA_TRAINING_TEAM_ID` and synthetic reviewer do not verify a request user, Team membership or real actor identity. Actual authorization and audit immutability remain future Identity/security concerns.
- The expected 403 here indicates absent synthetic server context, not verified authentication denial. Schema descriptions do not claim otherwise. A Swagger HTML HTTP 200 is not proof that external CDN assets render offline.
- A one-time fictional Service/Review is created: run on a disposable dataset or reset only that known fixture. No banking or production data.
- **Technically verified** only after matching-head 19-job CI including real PostgreSQL and browser checks. A green CI does not prove novice comprehension.
- **Manual rendered-depth review, saved-progress re-entry and independent uncoached learner transfer: UNVERIFIED**. Do not close #321 or claim the whole Builder school is learner-validated.

**Next:** after the integrated Schema checkpoint, inspect the original `-build` final synthesis and reflective exit; then move to Identity & Authorization in learner order. Do not rework already-read PostgreSQL material without a real blocking defect.

## Sources

- [drf-spectacular customization](https://drf-spectacular.readthedocs.io/en/latest/customization.html)
- [DRF schema documentation](https://www.django-rest-framework.org/api-guide/schemas/)
- [Django test client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/)
- Prior [PED-021](ped-021-drf-generated-openapi-http-conformance.md), PED-023/024/025, [issue #321](https://github.com/enoqueJonas/tsa/issues/321).
