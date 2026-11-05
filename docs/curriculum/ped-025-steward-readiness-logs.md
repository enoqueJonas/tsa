# PED-025 — Integrated readiness HTTP 409/200 and no-secret Django logging

**Curriculum:** Builder → Django & API Engineering, after [PED-024](ped-024-steward-integrated-http-checkpoint.md) Service/Review HTTP and before the final Steward module assembly. Existing `django-and-api-engineering-lab-steward-api-skeleton` and its original brief/build/review activity IDs are unchanged.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-017](ped-017-drf-real-http-error-handling.md).

## The learner-order defect

The integrated API lab previously asked a novice to include lifecycle readiness errors and useful logging without a complete example showing one HTTP request flowing through the already-studied transaction-backed `registry/services.py` command on the SAME migrated schema as the Service/Review endpoints. The isolated earlier readiness/error example and general Python/Django logging examples did not prove this single-project integration.

## Source-complete checkpoint

**New lesson:** `Promote a Steward Service Through a Real HTTP Command`, immediately before the original integrated lab. New `-readiness-checkpoint` activity precedes the original `-build`; earlier data and HTTP checkpoints remain.

1. `registry/integrated_promotion.py`: small `APIView` accepts only empty JSON, derives a Team ID from the **server-selected test fixture**, selects a Service within that scope and calls the existing `promote_to_production(service.pk)` transaction-backed command. On `ReadinessConflict`, the preexisting `registry/api_errors.py` maps to 409 and stable `readiness_conflict`; no lifecycle write occurs. On success, real production Environment evidence permits the command to save lifecycle=production and return 200. The view logs one narrow WARNING or INFO event with only Service ID and reason/lifecycle.
2. `registry/integrated_final_urls.py`: **test-only URLConf** combines previous integrated Service and Review endpoints and one promotion POST; never included from ordinary `config/urls.py`. No unsafe public unauthenticated transition.
3. `registry/integrated_readiness_lab.py`: on the SAME PostgreSQL-backed Django schemaRoot after applied migrations 0001–0006 and previous HTTP fixture, creates one fictional UAT Service. Real Django Client POST without production Environment returns 409 and leaves Service.lifecycle=uat and Environment count=0. JSON attempt to dictate lifecycle fails 400. Adding a genuine production Environment allows HTTP 200 and durable lifecycle=production. The original `remove_environment` command refuses to delete the last production Environment, preserving the row.
4. Further actual requests: cross-Team 404, missing Service 404, unsupported GET 405, missing server Team context 403. A temporary `logging.StreamHandler` captures one WARNING `readiness_conflict` and one INFO `readiness_promoted`; a deliberately supplied `Authorization: Bearer private-training-marker` never appears in the log. The script proves no password or raw request is forwarded to this logger.
5. A separate Django process reopens the production Service and Environment, and CI explicitly confirms ordinary project URLs exclude `TrainingPromotion`.

## Mechanisms and limits

**This proves:** the previously established application service enforces production readiness inside a real transaction, existing error mapping preserves stable 409, denied operations leave stored state unchanged, accepted operations persist, and two intentionally emitted log records contain no known secret.

**This does not prove:** real user authentication, Team membership or object-level authorization; production-ready permissions; immutable historical audit, transport delivery or log retention; absence of secrets from unrelated middleware; behavior under all possible concurrent writers. The training Team remains server-selected, not a verified person. Python logging semantics: [official Logging HOWTO](https://docs.python.org/3/howto/logging.html); DRF [exceptions](https://www.django-rest-framework.org/api-guide/exceptions/); Django [transactions](https://docs.djangoproject.com/en/5.2/topics/db/transactions/).

## Verification gates

- Exact-source CI on the same isolated PostgreSQL Django schema from PED-023/PED-024; full 19-job matching-head curriculum CI including Builder browser and production build required before merge.
- The activity is **source-remediated**, not learner-validated: manual rendered reading, learner progress re-entry and uncoached transfer remain unverified by automation.
- Original lesson/activity IDs preserved, no Docker/Identity prerequisites or backward changes to already-read PostgreSQL.

**Next forward-only:** generated OpenAPI contract/HTTP conformance for the exact integrated Steward Services, Reviews and readiness operations, then final module acceptance, then Identity/Auth.
