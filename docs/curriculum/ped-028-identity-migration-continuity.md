# PED-028 — Identity must extend the integrated Steward registry, not restart at migration 0002

**Date:** 2026-11-05. **Scope:** Builder → Identity & Authorization → Create User Accounts and Team Memberships in Django, immediately after the integrated Django/DRF lab.

## Learner-order failure

The completed Steward API Skeleton lab has a real Django-managed, PostgreSQL-backed registry with migrations 0001–0006, `ServiceDependency`, `ServiceReview`, Service/Review HTTP, readiness command and OpenAPI verification. The next Identity source nevertheless sent the learner to an older separate ORM-primer database and told them to inspect `registry 0002`. That may pass an isolated tutorial, but it is not the application they just built. Switching database at this transition would leave the security model unrelated to the actual Service records it is supposed to protect.

## Remediation

- Preserve every existing Identity lesson ID, content level and already-taught PostgreSQL lesson.
- Replace the Membership lesson's startup/migration instructions: confirm the actual Django `DATABASES` name, inspect `showmigrations registry` for 0001–0006, append Membership to the existing models, generate migration **0007_membership**, inspect its SQL, migrate, and verify the old relations and data remain.
- Reuse the complete existing source-published `Membership` model and `identity_membership_lab.py` rather than synthesize fake replacement code.
- Extend `scripts/check-builder-django-live-lab.mjs` after the actual integrated 0006, HTTP and schema proofs: append the SAME published model to `schemaRoot`, generate/inspect/apply actual PostgreSQL migration 0007, seed users/memberships, reject duplicate membership, verify former Service/Dependency/Review data and inactive account state persist. The earlier independent `0002` primer may still run in its own scratch database, but it is **not** the learner's next application.

## Evidence / gates

- [ ] Matching-head Builder PostgreSQL/Django real database workflow
- [ ] Matching-head 19-job full CI
- [ ] Rendered reading and learner progress re-entry
- [ ] Uncoached learner can explain why 0002 and 0007 are not interchangeable and execute migration in the right database

The exercise explicitly stops short of JWT authentication, login routes, real Team permission checks and production deployment. The later 180-minute Secure Steward API capstone remains a **separate instructional depth risk**: it should be split into authenticated-request, Membership/object authorization, revocation/negative checks, and finally contract/operational checkpoints before any learner-validation claim.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [#315](https://github.com/enoqueJonas/tsa/issues/315).
