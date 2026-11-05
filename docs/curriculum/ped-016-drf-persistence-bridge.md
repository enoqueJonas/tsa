# PED-016 — Bridge validated HTTP data to real persistence before the Steward API

**Scope:** Builder → Django & API Engineering after PostgreSQL, populated-table migrations, plain DRF Serializer and APIView/ViewSet routing. No change to already-read PostgreSQL, Web/API or Python lessons.

## Actual instructional gap

The existing `Serializers and Representation` lesson correctly introduces a plain Python-dictionary Serializer, `initial_data`, `validated_data`, `errors`, `partial=True` and the fact that `is_valid()` does **not** write anything.

The following `Views, ViewSets and Routing` lesson correctly demonstrates HTTP dispatch and an intentionally **in-memory** APIView whose valid POST returns 201 with a fictional ID 99. It explicitly warns that the POST does not persist data.

But the next work was the Steward domain/transaction implementation. **No lesson connected those prerequisites into a single, real database-backed ModelSerializer and HTTP lifecycle** before a learner was asked to construct a multi-table API. That was an unjustified jump in learner responsibility.

## New first-principles bridge (new IDs, all existing IDs preserved)

**Persist a Book Through a Real DRF API** follows the routing lesson and precedes Steward's production-readiness commands.

Reuse the existing `tsa-django-intro` scratch project after migration 0006: Book has id, title, published_year, nullable edition_note and required unique shelf_code. The lesson supplies the complete contents of:

- `catalogue/stored_serializers.py`: a ModelSerializer exposing an explicit field list and server-owned read-only ID.
- `catalogue/stored_api.py`: APIView handlers for collection GET and real POST (validate → `serializer.save()` → 201) and detail GET/PATCH (load persisted instance → `partial=True` → save).
- `catalogue/urls.py` snippet appended to the existing URL patterns; it does not replace the working earlier routes.
- `catalogue/stored_request_lab.py`: Django Test Client sends real framework HTTP requests, checks 201 and database PK, confirms a new Client fetches the row, PATCHes only edition_note, and proves negative 400 (missing title, duplicate code), 404 (missing ID), 405 (unsupported detail POST) with unchanged row count.
- A second independent Django shell fetches the stored row after the test process exits.

The hands-on practical remains on the *independent catalogue*, not an assumed running Steward registry. After this mechanism works, later lessons can add ownership scoping, authentication/authorization, business transactions, and migration-based deployment evidence.

## Why the new bridge matters

**Input validity, HTTP success and durable state are separate claims.**

1. `serializer.is_valid()` converts and checks untrusted request content, not database state.
2. `ModelSerializer.save()` invokes default create/update on a configured Django model; a real write has to occur before a create response can honestly be called persistent.
3. Another request and another Python process must see the same row and partial update to establish that the database, not one in-memory dictionary, owns the record.
4. Missing/invalid input and duplicate identifiers must reject without extra writes. The serializer may reject duplicate input early, but a real database UNIQUE constraint is still necessary for concurrent writers.
5. This local API deliberately lacks production permissions and team-scoped authorization; learners must **not** copy this open route unchanged into Steward.

## Research and original teaching translation

- [DRF Serializers](https://www.django-rest-framework.org/api-guide/serializers/) — `save()`, ModelSerializer default create/update, partial updates and read-only fields; translated into exact source and new-process persistence test.
- [DRF APIView](https://www.django-rest-framework.org/api-guide/views/) — method routing and 400/404/405 handling; translated into explicit collection/detail handlers and failures.
- [Django 5.2 Test Client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/) — real in-process HTTP request execution; translated into assertions about response and separate database state.
- [DRF Exceptions](https://www.django-rest-framework.org/api-guide/exceptions/) — 400/404/405 behavior; translated into explicit negative outcomes.

These sources substantiate mechanisms; the lesson itself contains complete implementation steps and explanations. No video has been represented as watched.

## Evidence contract

The exact source is extracted and executed in `scripts/check-builder-django-live-lab.mjs`, after the real Book schema evolution lab and earlier routing checks. The regression writes the **learner-visible** files, executes actual Django framework requests against real database state and checks persistence in a second shell. This is not a mocked API contract.

**Status:** source authored and actual-code regression committed on this branch. Confirm matching-head GitHub Actions success before calling it technically verified. Rendered human review and independent novice transfer remain unverified even if CI passes.

## Next

After this bridge, continue in learner order: production-ready Service application commands → validation/business rules → API error mapping → filtering/pagination/versioning/OpenAPI → configuration and logging → integrated Steward lab → Identity/Auth. No backward re-audit of already studied PostgreSQL content.
