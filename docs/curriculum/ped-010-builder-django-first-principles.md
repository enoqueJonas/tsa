# PED-010 — Builder Django and DRF first-principles source audit

**Scope:** Builder → Django and API Engineering, continuing the PED-005 source-depth reset in [#318](https://github.com/enoqueJonas/tsa/issues/318) and [#321](https://github.com/enoqueJonas/tsa/issues/321).

## Learner-order finding

The preceding PostgreSQL module was rebuilt to teach database, schema, table, SQL and psql before using an ORM. The following Django and API module still had a significant teaching-depth disparity: substantive headlines about request processing, serializers and ViewSets, but too few complete steps a novice could run independently. Several examples were snippets without their companion imports, file paths, route definitions or expected status checks. The authoring helper also inserted the same Steward callout into every conceptual lesson and appended mechanical headings such as "Concepts and Mental Model" and "Engineering Practice."

The issue is not solved by changing labels alone. The revision uses **the same Django scratch project** and teaches each layer in sequence. The actual Steward application is reserved for the separately composed applied practicals.

## Module inventory and disposition

| Published lesson | Original finding | This revision |
| --- | --- | --- |
| Django from Zero: A Running HTTP Endpoint | Short but already has complete setup, view and curl; serves as entry checkpoint | Retained the existing ID and setup; following lessons explicitly build on it |
| Django Foundations | Thin and incomplete route examples; client/server distinction not demonstrated end-to-end | **Source REMEDIATED:** full app creation, INSTALLED_APPS, complete project/app URL files, view, curl + test-client, request/middleware trace, 200/404/405 and post-shutdown transport failure |
| Django REST Framework | Thin; lone @api_view without installation, route, actual parser/renderer failure evidence | **Source REMEDIATED:** installation, JSONParser/JSONRenderer, complete endpoint, route reuse, separate 200/400/405/406/415 tests and lifecycle explanation |
| Projects, Applications and Boundaries | Existing applied case; needs independent rendered review | OPEN |
| Steward SQL to Django ORM | Dedicated applied model bridge; source and authored SQL already exercised elsewhere | OPEN for independent novice review |
| Models and Domain Data | Concise conceptual coverage, model/field/relationship source; no full independent example in reading | OPEN |
| ORM Query Behavior and Performance | Concise conceptual coverage; executable independent ORM examples come later | OPEN |
| Schema Evolution with Django Migrations | Existing source-driven migration exercise; requires actual learner proof | OPEN |
| Serializers and Representation | Thin; example ModelSerializer assumed an existing app/model before basic input/output flow | **Source REMEDIATED:** ordinary book Serializer, field/cross-field errors, ignored read-only input, validated_data versus .data, partial patch with no fabricated persistence |
| Views, ViewSets and Routing | Thin; ModelViewSet snippet assumes models, permissions and queryset scope | **Source REMEDIATED:** APIView route and explicit GET/POST, fixed two-book in-memory demonstration with no claim of durable POST; ViewSet/Router list/retrieve + expected 404/405 |
| Production Readiness Commands and Atomic Updates | Domain-specific material; not the first introduction to views | OPEN |
| Validation and Business Rules | Existing applied validator/command code | OPEN |
| API Error Handling | Existing source-driven code and failure mapping | OPEN |
| Filtering, Searching and Ordering | Existing code and lab | OPEN |
| Pagination | Existing code and lab | OPEN |
| API Versioning | Existing negative API contract | OPEN |
| OpenAPI and Swagger Documentation | Existing source example | OPEN |
| Configuration and Environments | Existing source and negative configuration checks | OPEN |
| Application Logging | Short (around 300 source words) and no runnable independent logger/config example | **Next source-priority:** mechanism and runnable logger/handler/filter/propagation proof |

The four revised topics **retain their existing lesson IDs and activity IDs**, avoiding reset of established learner progress. Their app-agnostic catalogue examples precede the existing Steward applied practicals. Generic Steward callouts are no longer auto-injected into every reading. Topic-specific reading/practice/check titles replace the repeated labels.

## Executable evidence

The existing `scripts/check-builder-django-live-lab.mjs` now rebuilds a **second isolated beginner Django project** from the exact code blocks authored in `builder-django-rich.ts`, in addition to the existing real PostgreSQL-backed Steward bridge. It executes:

- Django `startproject`, `startapp`, `check`, app/project URL files, plain `JsonResponse` view.
- DRF `@api_view` + JSONParser/JSONRenderer: successful JSON, invalid name, wrong HTTP method, unsupported input media type and unacceptable output media type.
- The `BookSerializer` source against three independent Python scripts: valid input and read-only field behavior, bad integer and cross-field digital-book rejection, partial update with omitted fields preserved.
- A hand-authored `APIView` source and `SimpleRouter` + `ViewSet` source, checking 200, 201, 400, 404 and 405 while asserting the teaching POST did **not** persist a new record.

The check runs inside the existing `builder-postgresql-lab` GitHub Actions job, which already installs Django/DRF and PostgreSQL clients. A failing assertion must block the workflow; source labels or keyword counts are not accepted as sufficient proof. The new scripts do not require a beginner to install Docker, and the scratch project is separate from the managed Steward PostgreSQL data.

## Limits and acceptance

- **Source authored and executable assertion written:** yes on this branch; final status depends on matching-head CI.
- **Real framework execution:** match the precise workflow SHA with the corresponding green Django integration run; do not reuse older master CI.
- **Rendered navigation/legibility:** browser automation can establish route existence and layout; manual review of the actual lesson text and code blocks remains open.
- **Actual end-user learning:** uncoached novice transfer from the books example to a new 'films' catalogue, explaining why GET after a scratch POST still contains two records, remains open.
- **Remaining 15 module lessons:** this pass does not assert they are remediated. A complete whole-module result requires their own reading/practical/source audit.

**Proposed teach-back:** Without copying the samples, create a `films` app and route `/films/` under an existing project; explain who receives HTTP, who handles URL dispatch, why Content-Type and Accept are different, demonstrate a serializer rejection and explain why a raw ViewSet is not persistence or authorization.
