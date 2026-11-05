# PED-020 — Real DRF versioned HTTP compatibility before API strategy

**Scope:** Builder → Django & API Engineering after the real Book query/pagination labs and applied Steward scoping. Original `API Versioning` lesson and activity IDs remain stable. New prerequisite: **Serve Two Versions of a Real Book API**.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-016](ped-016-drf-persistence-bridge.md), [PED-019](ped-019-steward-scoped-query-pagination.md).

## Demonstrated defect

The original API Versioning chapter contained a three-case Python dictionary predicate, not actual version routing or `request.version` behavior, and a confusing sentence claiming an unchanged `production` lifecycle broke the old client. The practical jumped straight to a major version/deprecation design record without evidence that learners could use URLPathVersioning or preserve a deployed v1 response.

A version prefix by itself neither changes a JSON representation nor authenticates a user. This module previously left both mechanisms implicit.

## Beginner-first executable bridge

Reuses the existing `tsa-django-intro` catalogue after real migrations and ModelSerializer persistence; no Docker, new project or insecure Steward Service mutation endpoint.

1. `catalogue/versioned_book_api.py`: complete per-view `URLPathVersioning`, `allowed_versions=("v1","v2")`, and a real GET of a persisted `Book`. Both versions return the same database ID and shelf code. v1 returns top-level `published_year`; v2 deliberately replaces that field with `publication.year`. This is an intentionally breaking response shape; compatible optional fields may not need a new version.
2. `catalogue/urls.py` appended fragment: named `(?P<version>v[0-9]+)` URL capture. Unsupported `v3` reaches the DRF versioning mechanism, which returns 404, rather than being masked by a route mismatch.
3. `catalogue/version_bug_urls.py`: isolated **test-only** URLConf with a deliberate v1 regression deleting `published_year`; never appended to ordinary application routes.
4. `catalogue/version_request_lab.py`: genuine Django Client GET requests. Verify v1 response passes the old-client exact field/type contract; v2 has different representation and fails that old predicate; re-read v1 after v2 was introduced and prove it still passes; unsupported version and missing book yield 404, wrong method yields 405. Select the deliberately broken v1 via `override_settings(ROOT_URLCONF=...)`, prove old-client regression is caught; check no Book writes occurred. It is safe to rerun with `get_or_create` fixture.
5. Clear failure diagnosis and tradeoffs: URI path vs NamespaceVersioning vs Accept-header/media-type versioning, compatibility-first evolution, parallel support and measurable deprecation criteria. The retained `API Versioning` lesson now applies these mechanics to Steward consumer contracts without pretending Identity and permissions already exist.

## Official technical references

- [DRF Versioning](https://www.django-rest-framework.org/api-guide/versioning/): by default `request.version` is `None`; per-view `versioning_class` can choose `URLPathVersioning`; the URLConf must capture a named `version`; disallowed versions are rejected.
- [DRF APIView](https://www.django-rest-framework.org/api-guide/views/): dispatch to the view's method after content negotiation/version selection, including unsupported HTTP methods.
- [Django 5.2 test client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/): in-process HTTP and isolated URLConf override.

These are correctness references, not substitutes for the actual executable lesson. No source video is claimed as fully viewed.

## Evidence and limits

- Authoring: `packages/runtime-kernel/src/paths/builder-django-rich.ts`.
- Practical overrides: `packages/runtime-kernel/src/paths/builder-django-quality.ts`.
- Source-derived execution: `scripts/check-builder-django-live-lab.mjs`; extracts exact published Python, URL fragments, and exercises real DRF against the already migrated Book database.
- **Technical verification:** requires successful matching-head full curriculum CI.
- **Manual rendered reading and independent uncoached learner transfer:** UNVERIFIED even if CI passes; do not call Django learner-validated based on automated traversal.
- **Security:** versioned Book API is a local teaching route. Steward production-grade access control is still owned by the later Identity module; neither v1 nor v2 is magically authorized.

**Next forward-only:** OpenAPI/Swagger documentation should verify generated schema and actual HTTP contracts rather than merely parse a hard-coded JSON string. Then configuration/environment safety and integrated Django lab, followed by Identity/Auth and the rest of Builder.
