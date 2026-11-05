# PED-027 — Steward API Skeleton must end with evidence and a learner transfer

**Date:** 2026-11-05. **Scope:** Builder → Django and API Engineering → integrated Steward API Skeleton lab, **after** the merged PED-023–026 checkpoints.

## The remaining instructional defect

The final original `Build Steward API Skeleton` activity (95 minutes) largely asked learners to reassemble the same Service/Review, readiness, schema and logging work already taught and tested in five preceding checkpoints. It did not give a reliable stopping condition, how to link each observed HTTP result to an actual database invariant, or a distinct independent exercise. The brief also contained stale future-tense language about HTTP and OpenAPI that had since been delivered.

This is not a reason to revisit previously read PostgreSQL lessons or rebuild the complete integrated Django/DRF lab. The problem is the **exit learning experience**.

## Source remediation

- Preserve the existing module, lab, five checkpoints, `-build` and `-review` activity IDs.
- Update the `-brief` to distinguish technical checks that already exist from missing signed-in Identity and Team Membership checks.
- Replace the omnibus `-build` with **Handoff: Prove the Steward API Works as One System**. The learner inventories the real migrated 0001–0006 schema, runs `showmigrations`/`check`, builds a six-column HTTP→view→serializer/command→PostgreSQL→schema evidence matrix, reruns the previously published real `spectacular` export, and proves the four training-only URLConfs are absent from `config/urls.py`. Reproducing on a disposable database and avoiding collision-prone repeated fixture scripts are explicit.
- Add independently navigable **Transfer: Diagnose a Forged Ownership Request** (`django-and-api-engineering-lab-steward-api-skeleton-boundary-transfer`), in which the learner predicts and constructs a new negative Django Client request, verifies both Teams' row counts before and after, distinguishes server-selected synthetic Team from authenticated membership, and designs the later revocation test.
- Rewrite the reflective `-review` as a six-dimension teach-back rubric instead of an open-ended recap.

## What previous evidence already establishes

- PED-023: real `ServiceDependency` and `ServiceReview` schema migrations 0005–0006, constraints, durability.
- PED-024: persisted Service and Review HTTP against the same PostgreSQL registry; client-owned fields and Team boundaries rejected under a server-selected training fixture.
- PED-025: actual transactional HTTP 409→200 readiness and redacted application logs.
- PED-026: same-contract URLConf for HTTP and OpenAPI; real schema validation, runtime comparison and two false-document mutations.

The new transfer activity is **not** an automated proof of learner understanding. It is a newly specified exercise whose exact novice request, observed row counts, UI reading/re-entry and unaided explanation must still be reviewed independently.

## Gates and boundaries

- [ ] Matching-head curriculum CI jobs, including source-derived integration and browsers (report actual results after PR)
- [ ] Human review of final lab as rendered, scroll/navigation and progress re-entry
- [ ] Independent uncoached novice attempts the forged-ownership transfer and scores 6/6 on the six-boundary explanation
- [ ] After synthesis, audit Identity & Authorization next in learner order rather than reworking PostgreSQL

No fake login, verified JWT principal, Membership permission, audit immutability or production route is introduced by this change. A 403 due to missing `TSA_TRAINING_TEAM_ID` is a training configuration rejection, not an authenticated authorization decision. All 0001–0006 migration and HTTP assertions depend on a disposable teaching database, never real production data.

Related tracking: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [#315](https://github.com/enoqueJonas/tsa/issues/315).
