# PED-021 — Generate OpenAPI from real DRF endpoints and verify HTTP conformance

**Curriculum:** Builder → Django & API Engineering, after real Book persistence, exception handling, filtering, pagination and versioned HTTP. Existing lesson ID `django-and-api-engineering-openapi-and-swagger-documentation` remains stable. New bridge: **Generate and Verify OpenAPI from a Real Book API**.

**Related:** [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-020](ped-020-drf-versioned-http-contract.md).

## Learner-observed instructional defect

The old OpenAPI reading's sole executable artifact was a pasted JSON object for `/health`, deliberately omitting a trailing slash from a route established much earlier. The lesson did not actually produce a schema from the Django code, inspect the `ModelSerializer` component, exercise request/response status and field contracts, run a schema validator, or test how a *syntactically valid* schema can lie. It then asked the learner to generate the full Steward schema and document authorization and 409 errors without teaching the mechanism or implementing identity.

**Correction:** reuse the learner's populated `tsa-django-intro` catalogue after its prior DRF lessons. No Docker, new project, fake membership or production network access.

## Technical choice: drf-spectacular, not deprecated built-in generator

The official [DRF Schemas documentation](https://www.django-rest-framework.org/api-guide/schemas/) explicitly deprecates built-in OpenAPI generation and recommends **drf-spectacular**. Follow its maintained [customization workflow](https://drf-spectacular.readthedocs.io/en/latest/customization.html) instead of making a new learner adopt a deprecated interface.

The learner runs `python -m pip install 'drf-spectacular>=0.28,<1'` in the existing Django Python environment, appends `drf_spectacular` to INSTALLED_APPS, and adds DEFAULT_SCHEMA_CLASS without replacing the earlier EXCEPTION_HANDLER. The CI PostgreSQL/Django job installs the identical additional dependency.

## First-principles source and execution

| Learner-visible source | Purpose |
| --- | --- |
| `config/settings.py` append-only block | Generator registration and readable title/version; preserves current DRF exception settings |
| `catalogue/contract_api.py` | Complete **real database-backed** GET list, POST create and GET detail APIViews. Uses the existing StoredBookSerializer and explicit `@extend_schema` response/request annotations on **entrypoint methods**. Separate error serializers describe the handler's `{error: {code, details}}` body. POST calls `serializer.save()` before 201. |
| `catalogue/contract_urls.py` | Shared, authoritative collection/detail URL patterns |
| `catalogue/openapi_urls.py` | Narrow `--urlconf` for the two annotated training operations; **includes the same** contract_urls rather than duplicating path strings |
| `catalogue/urls.py` appended routes | Real runtime `contract-books/` include and local `training-schema/` / `training-docs/` using SpectacularAPIView / SpectacularSwaggerView |
| `catalogue/openapi_contract_lab.py` | Compares generated `catalogue/openapi.json` schema to **actual Django Client requests and persisted database state**; rejects two misleading-but-plausible schema mutations |

Run `python manage.py check`, then:

```bash
python manage.py spectacular --urlconf catalogue.openapi_urls --format openapi-json --file catalogue/openapi.json --validate --fail-on-warn
python manage.py shell -c "exec(open('catalogue/openapi_contract_lab.py').read())"
```

- The CLI generates, structurally validates, and rejects generator warnings for the focused completed endpoints.
- The test expects two actual paths, GET/list, POST/create, GET/detail; POST `requestBody`; success 200/201, declared 400/404, serializer component fields including read-only id.
- The actual framework must return HTTP 201, persist a new Book, reread it with a fresh request, and list it. Missing title and duplicate code must produce the **existing** error envelope HTTP 400 with unchanged extra write count; missing detail returns 404, wrong detail method returns 405 with Allow.
- Both `/catalogue/training-schema/` and `/catalogue/training-docs/` must return server-side HTTP 200. This **does not** prove Swagger's optional CDN assets load offline; it proves the local HTML and schema endpoints respond.
- Drift A: remove `published_year` from the generated component without changing HTTP. Its field-contract check must fail.
- Drift B: replace the generated collection path with a nonexistent path while keeping valid object structure. A real GET of that path must return 404.
- The successful POST makes the full lab a **one-time** disposable-data experiment; rerun after resetting only the invented `contract-workshop-story` fixture row, not unrelated user data.

## Applied Steward OpenAPI lesson (existing ID preserved)

The original reading is retained under the same ID, but is now an application/decision layer: document real Service list/create/detail, filtering/pagination and known readiness `ReadinessConflict→409` envelope with evidence from previous registry transaction and HTTP tests. Distinguish **currently implemented** test-only server-selected Team scoping from **future** identity-derived memberships. Do not label a bearer security scheme, Swagger UI, or generated schema as proof of implemented 401/403 or per-Team authorization.

## Acceptance and limits

- **Source-derived actual-code execution:** `scripts/check-builder-django-live-lab.mjs` extracts the full published Python fragments, installs the generator in real CI, runs the exact schema export and HTTP+database test in the existing migrated scratch project.
- **Full curriculum CI:** matching-head 19-job workflow required before merge; do not conflate with source commits.
- **Manual rendered lesson inspection**, exercise navigation/progress re-entry and **independent learner transfer** remain UNVERIFIED until an actual learner completes an unfamiliar OpenAPI change.
- The exercise is a **focused two-route schema**: it does NOT assert the rest of the tutorial application is documented. Production Steward public API schema must eventually cover all deployed public endpoints and security contracts.

## Next forward-only

Configuration & Environments is currently a pure string-dictionary parser, not a concrete Django startup/connection fail-closed exercise. Repair that before the integrated Steward lab, then continue Identity/Authorization → Software Craft → the Builder milestone. Avoid backward changes to already-read PostgreSQL without a demonstrated prerequisite blocker.
