# PED-029B — Current Membership authorization must be observed over signed HTTP and PostgreSQL

**Date:** 2026-11-05. **Scope:** Builder → Identity & Authorization, after **Object-Level Authorization** and before ownership/transfer rules. Continuation of merged #395 and #397.

## Gap and change

The preceding first-JWT lesson now proves real signed identity and token failures, and Membership 0007 is persisted in the same registry. Neither fact establishes **authorization of an actual Service write**. The original generic object-level reading had a short ORM predicate but the exercise lacked complete executable signed HTTP and authoritative before/after database observations.

Add **Enforce Current Team Membership on a Real Steward PATCH** as a distinct lesson while retaining every previous Identity lesson/activity ID. This lesson publishes complete, reusable code:

- `registry/membership_rename_api.py`: private PATCH-only `TrainingRenameService` with actual Simple JWT authentication, `IsAuthenticated`, one explicit allowlisted name input, `Service.objects.select_for_update()` inside `transaction.atomic()`, **current** `Membership.objects.select_for_update()` filtering user, stored service owner Team and MAINTAINER role. The client cannot select owner or role. Missing object 404, signed-in unauthorized 403, forbidden extra fields 400.
- `registry/membership_training_urls.py`: isolated URLConf that imports the previously real token/identity endpoints and mounts one private PATCH, never normal config URLs.
- `registry/membership_http_lab.py`: real, source-published Django Client requests after real token issuance from framework-hashed test users on the SAME PostgreSQL 0007 Steward registry. Same-Team maintainer 200 persisted, authenticated cross-Team maintainer 403 unchanged, same-Team viewer 403 unchanged, missing token 401, forged ownership/role fields 400, missing Service 404. Then **delete Ana's Membership, reuse the original still-valid JWT, observe whoami 200 but PATCH 403 with no write**. A Team B maintainer can still update its own Service 200. Historical ServiceReview count unchanged.
- CI extracts and executes these exact published files immediately after merged PED-029A real JWT and PED-028 Membership/password checks; asserts six evidence labels and absence of insecure training URL registration.

## Explicit scope and non-claims

- One private Service rename write is proven. It does **not** secure Service list/read/create/delete, Environment, Dependency, ownership transfer, public routing, refresh revocation, account recovery, MFA or all transaction races.
- The test creates fictional users/Services and must execute only once on a disposable training database. Reruns require resetting only known fixtures, never a real database.
- Service row locking plus a locked existing Membership in one transaction is an instructional narrow policy/write boundary, not a proof of universal linearizable revocation or all business-rule races.
- The 403-versus-concealed-404 decision is deliberate for this tutorial, not a universal requirement for private production resources.

## Gates

- [ ] Matching-head 19-job CI (including real PostgreSQL source-derived JWT/Membership script, build and browser)
- [ ] Human rendered reading, code-execution and progress re-entry
- [ ] Uncoached learner predicts revocation with still-valid JWT and identifies unprotected list/nested APIs

**Next:** separate complete collection scope/create/nested-resource checkpoints per [#396](https://github.com/enoqueJonas/tsa/issues/396). Keep #321/#318 open until genuine learner validation.
