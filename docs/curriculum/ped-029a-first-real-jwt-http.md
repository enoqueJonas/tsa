# PED-029A — First actual JWT-authenticated Steward HTTP request

**Date:** 2026-11-05. **Scope:** Builder → Identity & Authorization, between Authentication Flows and the original Implementing JWT Authentication in DRF. Follows [PED-028](ped-028-identity-migration-continuity.md), merged PR #395.

## Specific observed instructional defect

The existing JWT theory and implementation outline describe token classes, settings and `request.user`, but the first complete security lab was a 180-minute omnibus. No earlier lesson provides an executable, generated access/refresh pair and HTTP request by an **actual migrated Steward user** on the same PostgreSQL-backed 0007 registry. Merely pasting configuration is not evidence of authentication.

## Proposed remediation (source-complete, before any object authorization)

Add **Your First Real JWT-Authenticated Steward Request** and retain all existing Identity lesson IDs:

1. Preflight: existing Steward PostgreSQL 0001–0007, `tsa_ana` from published 0007 Membership, and the actual existing Django password verifier. Do not recreate the old 0001-only project.
2. Local-only Simple JWT dependency, explicit 5-minute access and one-hour refresh policy (rotation/blacklist deliberately disabled for this first checkpoint), settings **appended without resetting** database or DRF error configuration.
3. Complete `registry/jwt_training_api.py` with real `JWTAuthentication`, `IsAuthenticated`, and an observable `request.user` response, not a fabricated dictionary or `force_authenticate`.
4. Complete private `registry/jwt_training_urls.py` with real Simple JWT token obtain/refresh and protected GET; never include from ordinary `config/urls.py`.
5. Complete `registry/jwt_first_http_lab.py`: obtains real signed tokens with correct username/password, tests authenticated GET 200, rejects missing/malformed/expired/refresh-as-access at 401, uses refresh endpoint to obtain valid new access 200, rejects wrong method 405, and checks Membership/ServiceReview counts unchanged. No token or plaintext printed.
6. CI extracts and executes **the exact learner-published sources**, after the prior successful 0007 migration and password-hashing checks, on the same migrated PostgreSQL registry. Depend on maintained `djangorestframework-simplejwt>=5.5,<6` explicitly. This is authentication evidence, NOT authorization, session revocation, MFA, public registration or production security.

## Verification gates

- [ ] Matching-head 19-job curriculum CI, especially generated PostgreSQL 0007 and real signed HTTP negative tests
- [ ] Manually inspect actual rendered lesson, exercises, scroll and progress re-entry
- [ ] Independent learner explains authentication, refresh-only capability, expiration, and why valid JWT does not permit cross-Team Service updates

This is **the first checkpoint** toward [#396](https://github.com/enoqueJonas/tsa/issues/396), not the conclusion of that issue. Next teach a real DB-backed Membership policy and object/collection permission checks. Maintain #318/#321 learner-validation gates.
