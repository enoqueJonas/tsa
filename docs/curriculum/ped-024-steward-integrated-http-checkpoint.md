# PED-024 — One real PostgreSQL-backed Steward Service and Review HTTP checkpoint

**Curriculum:** Builder → Django & API Engineering after [PED-023](ped-023-steward-integrated-lab-data-checkpoints.md) and before `Lab: Steward API Skeleton` final assembly. Existing `-brief`, `-build`, `-review` IDs preserved; new independent `-http-checkpoint` after the data checkpoints.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-017](ped-017-drf-real-http-error-handling.md), [PED-019](ped-019-steward-scoped-query-pagination.md), [PED-021](ped-021-drf-generated-openapi-http-conformance.md).

## Confirmed prerequisite defect

The integrated lab required `/services/` list/create/detail and `ServiceReview` create/list, but previous examples were either a self-contained **Book** API or separate **training-only Steward** fragments. No source-proven combined HTTP flow over the same completed PostgreSQL registry and its actual 0005 dependency/0006 review migrations existed. Simply naming all required endpoints in a 240-minute instruction list did not provide independently executable learner steps.

## The actual implementation taught

**New lesson:** `Serve Real Steward Services and Reviews Through DRF`, after the two fully executed schema lessons.

- `registry/integrated_serializers.py`: separate **input** `ServiceCreateInput` with allowlisted name/slug/endpoint/criticality, `ServiceRead` ModelSerializer with output-only id/owning_team/lifecycle, `ReviewCreateInput` with service_id/verdict, and output-only `ReviewRead` with service_name.
- `registry/integrated_api.py`: actual DRF APIViews. GET Services composes the existing `scoped_services()` QuerySet (server-selected Team, validated lifecycle/criticality/search/order) with PageNumberPagination default 2/max 3. POST validates an **actual JSON object and all supported keys** before writing; owning_team and UAT lifecycle are server-assigned, and PostgreSQL `IntegrityError` is caught inside an atomic boundary to produce a safe 400. Detail GET is scoped to Team first and returns 404 for inaccessible/missing rows. Review POST verifies the chosen Service is within that selected Team; the reviewer label is set by **server-only synthetic test configuration**, not client-supplied; created_at/reviewed_at comes from `timezone.now()`. Review GET filters by Service Team, orders by time and PK, uses `select_related("service")` and bounded paging. No review PATCH/DELETE implemented.
- `registry/integrated_training_urls.py`: **separate test-only URLConf**. Never included from `config/urls.py`; selected solely inside `override_settings(ROOT_URLCONF=...)`.
- `registry/integrated_http_lab.py`: complete isolated PostgreSQL/Django Client test; four fixture Services across Team A/B. GET count 3 for A, 2 default results; POST creates Ember with 201 persisted, independent Client GET 200, correct owning Team/UAT; forged owner/duplicate slug/invalid endpoint or criticality 400 and unchanged Service count; other-Team and missing detail 404, unsupported method 405. POST three Team A Reviews and seed a Team B Review; only A's three appear in results/count, page cap three; direct filter by parent returns two events for Ember with synthetic server-chosen reviewer and actual foreign keys. Invalid verdict, forged reviewer, missing parent input, other-Team write, invalid page/filter and unsupported PATCH are rejected with no review writes. `CaptureQueriesContext` establishes bounded SELECT count (COUNT plus one JOIN) for review representations rather than N+1.
- `config/settings.py` adds only `rest_framework` and `testserver` to the already owned registry schema project. Keeps PostgreSQL connection and all earlier model/migration history.
- CI extracts and executes the **exact authored files** against the same schemaRoot on which 0001–0006 migrations, dependencies and historical reviews were verified. It reopens Ember and two reviews in a separate manage.py shell, and checks ordinary config/urls.py never contains the training routes.

## Explicit limits

**Server-selected Team ID is not authentication**. DRF's default permission policy is `AllowAny` when no permission classes are configured; even a correct filtering predicate is not proof that the requestor belongs to that Team. <https://www.django-rest-framework.org/api-guide/permissions/>. `TSA_TRAINING_REVIEWER` is a fabricated, server-selected label and not verified identity. This is only an isolated test URL configuration and **must not** be deployed as an endpoint. No audit immutability, row-level permissions or real membership revocation is established.

The earlier Book generated OpenAPI lesson proves schema generation and drift detection for Book, but the integrated Steward API does not yet have a generated schema or full readiness/logging integration. That is the **final** lab assembly gate; do not declare the Django module completely learner-validated from this PR alone.

## Acceptance

- Exact-head 19-job GitHub Actions including `builder-postgresql-lab` running published source, `validate` build/curriculum suite, Builder and cross-school browser checks.
- Independently rendered lesson-depth/progress persistence review and uncoached unfamiliar-case learner transfer remain **unverified**.
- Original lab ID and `-brief/-build/-review` activity IDs preserved; new `-http-checkpoint` follows the two existing data checkpoints.

**Next forward-only:** final integrated OpenAPI + readiness contract + structured logging in the same registry schema project, then actual Identity/Authorization module.
