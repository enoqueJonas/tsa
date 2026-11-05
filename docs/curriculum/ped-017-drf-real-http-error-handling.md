# PED-017 — Real DRF exception handling before the Steward API error contract

**School/module:** Builder → Django & API Engineering. **Learner order:** after the persisted Book API and domain Validation/Business Rules, before the existing `API Error Handling` application. This is the next unread material after the already-remediated PostgreSQL module.

**Related:** [#321](https://github.com/enoqueJonas/tsa/issues/321), [PED-016](./ped-016-drf-persistence-bridge.md), [#318](https://github.com/enoqueJonas/tsa/issues/318).

## Demonstrated deficiency

The existing `API Error Handling` reading correctly named 400/401/403/404/409/500, but its only executable example was a pure `public_error(kind)` dictionary mapper. It could pass even if every real HTTP endpoint still returned the wrong status, dropped an `Allow` header, leaked an unexpected exception or mutated the database before returning a refusal. The practical asked for a central DRF exception adapter without demonstrating what DRF handles and what remains a Django 500. This is not a standalone novice lesson.

## Pedagogical decision

Teach **two distinct mechanisms**, not an enlarged list of status codes:

1. **See How DRF Turns Exceptions into HTTP Responses** (new ID): starts from the already migrated `tsa-django-intro` catalogue. Full authored files `catalogue/error_handlers.py`, `catalogue/error_views.py`, `catalogue/urls.py` appended fragment, `config/settings.py` settings fragment and `catalogue/error_contract_lab.py`. Proves parser and serializer 400, looked-up 404, unsupported method 405, unacceptable response 406 and unsupported body 415 with actual in-process HTTP and no Book writes. The handler delegates to DRF first, retaining status and headers before wrapping its output. A separate `catalogue/error_test_urls.py` exists **only for the local test**: an unexpected `RuntimeError` becomes HTTP 500 when DEBUG is false, and its internal string is absent from the response. The exception handler returns `None` for unknown errors and does not promise every 500 will be JSON.
2. **API Error Handling** (existing ID preserved): applies those mechanisms to the existing `registry/services.py` transaction command, not to a made-up mapping. New full authored `registry/api_errors.py`, `registry/readiness_api.py`, `registry/training_urls.py` and `registry/error_contract_lab.py` prove a real HTTP 409 for a denied UAT→production transition with unchanged saved lifecycle and Environment count; adding a production Environment permits HTTP 200 and stored lifecycle promotion. Missing Service yields 404 and unsupported method yields 405. The URLConf is selected only inside Django's `override_settings` for the local test; **it is not registered in the normal project URLs**. Authentication/Team authorization is deliberately not faked, and the training route must not be deployed.

Separate topic-specific practicals describe complete file paths, commands, expected output, failure diagnosis, artifacts and the unimplemented identity boundary.

## Research and factual boundary

| Source | Mechanism checked | Learner-facing explanation / example |
| --- | --- | --- |
| [DRF Exceptions](https://www.django-rest-framework.org/api-guide/exceptions/) — inspected sections on exception handler and custom handling | `APIView` catches `APIException`, `Http404`, Django `PermissionDenied`; custom handler returns a `Response` or `None`; explicit `Response(status=400)` does not call exception handler | Source implementation delegates to `exception_handler`, preserves HTTP metadata, rejects unknown errors as 500 and explains the explicit-Response exception |
| [DRF Views](https://www.django-rest-framework.org/api-guide/views/) — exception dispatch and request lifecycle | Method routing, content negotiation, parser and serializer exceptions | Real 400/404/405/406/415 responses from a minimal `APIView` |
| [Django 5.2 Test Client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/) — `raise_request_exception` and `override_settings` | Deliberate unhandled exceptions reach HTTP 500 with `raise_request_exception=False`; test settings can isolate URLs and DEBUG | Isolated failing URLConf, safe response leak check and independent real HTTP request tests |
| [DRF source implementation](https://github.com/encode/django-rest-framework/blob/main/rest_framework/views.py) — inspected API exception adapter behavior | Default exception handling preserves authentication/throttle headers and returns `None` for unsupported errors | Reuse DRF handling first rather than reimplementing or suppressing framework semantics |

Research sources supply correctness boundaries; teaching and executable examples are complete within TSA. A separate long-form video has **not** been represented as watched.

## Evidence

- Lesson sources: `packages/runtime-kernel/src/paths/builder-django-rich.ts`
- Published practical overrides: `packages/runtime-kernel/src/paths/builder-django-quality.ts`
- Source-derived execution: `scripts/check-builder-django-live-lab.mjs` extracts the **exact** code blocks and runs them in actual Django scratch and isolated PostgreSQL-backed Steward projects.
- Required acceptance: responses must be genuine framework responses, and failed calls must preserve saved data. Both deliberate unexpected failure and known conflict must follow the correct distinct path.
- **Technical status:** authored and regression checks committed; matching-head CI required before marking verified.
- **Rendered and independent learner validation:** NOT YET OBSERVED. Browser traversal and CI are evidence of rendering/technical execution, not proof that a learner can understand or transfer to a new domain.

## Next

Continue in learner order: bounded filtering/search/ordering, pagination, versioning, OpenAPI, configuration and module integration, then Identity/Auth → Software Craft → Builder milestone → later schools. Do not revisit already-read PostgreSQL without a demonstrated blocking defect.
