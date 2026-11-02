# PED-008 — System Thinker complete learner-order source review: modules 6–11

**Date:** 2026-11-02  
**Status:** **Source remediation and test integration in progress; independent learner validation OPEN.**  
**Scope lock:** System Thinker only, continuing modules 1–5 in the existing [school audit](./ped-008-system-thinker-school-audit.md).  
**Issue:** [#332](https://github.com/enoqueJonas/tsa/issues/332); [draft PR #333](https://github.com/enoqueJonas/tsa/pull/333).  
**Current branch:** `curriculum/system-thinker-pedagogical-audit`.

## Audit method and the actual defect

The full module is not the single `*-deep.ts` reading. Its authored sections, protocol example modules, quality/practice overlays, runnable setup, negative case and adjacent handoff must be read in learner order. This pass inspected the original six file/transfer lessons, nine SOAP/XML activities/lessons, ten messaging concept lessons plus six staged labs, five failure concepts, four ADR concepts and final portfolio/transfer.

**Diagnosis:** Most technical components already had substantial teaching and isolated live protocol evidence, so generic lengthening would be counterproductive. The important remaining gap was a broken *meaning chain*. A learner could execute FTP/SFTP, parse SOAP, get Redis PONG, observe RabbitMQ confirms and write an ADR while still being unable to state which observation authorizes a Team ownership change, which is only transported, which was actually committed and which may be stale. Separately, missing dead-letter bindings, operator replay and semantic rather than schema-only SOAP changes had insufficient learner-facing adversarial pressure.

One fictional OBS-01 service-owner escalation (established in modules 1–5) now makes those distinctions explicit. Enterprise identity and approved owner-transfer policy **D-01 remain unresolved**. Illustrative protocol diagrams are not representations of a deployed Steward enterprise system.

## Learner-order matrix — inspected source, intervention and open gate

| # | Lesson/source | Disposition after source read | Concrete additional teaching | Evidence gap; no false pass |
| --- | --- | --- | --- | --- |
| 6.1 | File-Based Integration Contracts | TARGETED continuity fix | Envelope vs row; recorded/proposed owner not approved transfer; identical/changed-content replay and distinct receipt/validation/application results | Real producer signoff, domain policy and learner-supplied rejection matrix |
| 6.2 | Legacy FTP Integration | Already substantially taught and previously protocol-tested | **No repetitive appendix:** retain real passive/control-data boundary, failure and legacy confidentiality warning | Actual third-party FTP provider and independent learner diagnosis |
| 6.3 | Batch File Processing Lifecycle | TARGETED correctness bridge | Row 1 committed, row 2 rejected, row 3 interrupted; distinguish file claim, local SQL atomicity, row ledger and partial acceptance | No live Steward import adapter/approved per-row atomicity agreement |
| 6.4 | Shared Filesystem versus Managed File Transfer | TARGETED comparison | NFS, FTP, SFTP each transports/stores bytes differently; none supplies owner-change authority; migration preserves domain identity and acceptance rules | Remote shared filesystem semantics and vendor cutover unverified |
| 6.5 | SSH Trust and SFTP File Delivery | Existing strong live local protocol lab | Retain independently proven host/user-key, .part/rename, SHA-256 and refusal examples; do not label this a secure production server | Managed remote server, OS jail, key rotation and domain ingestion not proven |
| 6.6 | Secure File Transfer Readiness | TARGETED exit discipline | Split transport trust from business approval; explicit wrong-key/replay/forbidden-owner cutover matrix | Vendor trust, rollback and credential lifecycle not validated |
| 7.1 | XML Documents/Namespaces | Existing strong parser and negative examples | Retain namespace/prefix distinction and XML security caution; no generic duplication | Untrusted production payload parsing/hardening unverified |
| 7.2 | XSD XML Contract | Existing validated structure checks | Retain schema vs domain validation and negative XSD cases | Real vendor schema/version compatibility unverified |
| 7.3 | WSDL and SOAP Contract | TARGETED semantic bridge | GetServiceRecord external owner observation vs Steward business authorization; endpoint movement vs schema vs meaning change | Actual enterprise CMDB trust/contract and approval D-01 unknown |
| 7.4 | SOAP Envelope/Fault | Existing protocol simulator | Keep SOAP 1.1 action/media type and Fault/wrong namespace cases | Real independent vendor fault contracts/security unverified |
| 7.5 | SOAP Provider Implementation | Existing runnable training endpoint/Zeep | Do not change working bounded experiment to a fabricated enterprise provider | Production-grade provider framework and CMDB integration unverified |
| 7.6 | Steward SOAP Consumer | TARGETED anti-corruption boundary | Typed external result -> proposed owner observation -> domain authorization, with separate CONNECT/FAULT/SCHEMA/POLICY errors and denied wrong-Team mutation | Deployed authenticated Steward adapter and end-to-end negative call unverified |
| 7.7 | Contract Testing/Failure | TARGETED negative cases | Schema-valid but semantically false or unauthorized input; exact WSDL/digest and before/after database state | Real provider compatibility tests and manual learner diagnosis |
| 7.8 | SOAP/XML Milestone | Existing cross-protocol recovery lab | Preserve authored success/fault/outage/namespace recovery practical | Complete two-provider integration still unverified |
| 7.9 | SOAP versus REST Reassessment | TARGETED decision gate | Explicit adapter vs leaked generated types vs defer integration until D-01 approved | Business contract owner decision unapproved |
| 8.1–8.3 | Distributed State: justification, cache-aside, invalidation | TARGETED relevant cache sections | Scope cache keys to verified authorization, reject revocation leak, distinguish cache hit from owner truth and show failed invalidation | Live permission-sensitive cache+Steward integration and approved staleness budget unverified |
| 8.4–8.7 | RabbitMQ routing/ack/idempotency/DLQ | TARGETED missing-binding failure | Confirm vs consumer ACK; single-node classic-queue DLX with no matching binding must not be called safe quarantine | Real single-node RabbitMQ unbound-DLX negative-control CI passed at `3ecff33e`; cluster/quorum and real operator guarantees remain unverified |
| 8.8 | Ordering and Eventual Consistency | TARGETED reasoning | Version 8 before 7 is producer/business revision inversion; event-ID dedup alone does not guard older distinct event | Cross-producer version allocator and enterprise ordering unverified |
| 8.9 | Transactional Outbox | TARGETED chain | PostgreSQL commit, publisher confirm, consumer DB/ACK and remote provider effect all separate; late confirmation/provider duplicate | External provider idempotency and production lease renewal unverified |
| 8.10 | RabbitMQ versus Kafka | TARGETED workload contrast | Single delayed notification vs retained replayable multi-consumer event stream, explicit operational costs and revisitation | No Kafka broker performance claims |
| 8 staged labs (six) | Existing live disposable Redis/RabbitMQ/Postgres labs | Preserve source-extracted crash/replay/concurrent outbox, DLX and operator recovery; do not combine into one 300-minute lab | Full Steward deployed workflow, clustered safety and novice execution unverified |
| 9.1–9.5 | Failure Modes (five concepts) | TARGETED 1, 4, 5; existing 2–3 already substantive | Misleading owner despite HTTP 200, explicit 150/s–100/s hypothetical backlog = 30,000, privileged quarantine replay and SSH key rotation | Independent original failure log diagnosis, real load/operations and manual review pending |
| 10.1–10.4 | Architecture Decisions | TARGETED four connected decision sections | Quality scenario anchored to correctness; sync email vs DB-only outbox vs outbox+broker; D-01 unresolved; change drivers under two changed premises | Measured SLO/operating cost and independent ADR defence pending |
| 11 | Steward Portfolio, five gates + independent transfer | TARGETED acceptance tightening | Cross-module evidence-and-authority ledger, exact revision, negative unchanged-state case; novel-room booking prohibits CSV bypass of campus authorization | **No independent assessor/learner results.** No score fabricated |

## New teaching sources

- `system-thinker-enterprise-authority-bridge.ts`: **7 authored sections** in four selected file/batch lessons.
- `system-thinker-soap-authority-bridge.ts`: **7 authored sections** in four selected SOAP lessons.
- `system-thinker-operational-reasoning-bridge.ts`: **13 authored sections** across six distributed lessons, three failure lessons and four architecture-decision lessons.
- Existing lesson/activity IDs stay stable; the capstone is tightened directly in `system-thinker-milestone-deep.ts`.
- The module-specific material is composed at the teaching source. **No generic wrapper or universal filler appended to unrelated lessons.**

## Completed live RabbitMQ negative and source-head technical verification

**Matching-head technical verification:** [GitHub Actions #41459105017](https://github.com/enoqueJonas/tsa/actions/runs/41459105017) **19/19 SUCCESS** at code commit `3ecff33ed4dd97d581c80e0d3f77e3b011a1cd19`. Source-derived teaching regression passed, build and school-browser traversal passed (215 desktop + 215 mobile, IndexedDB hard-reload persistence). The dedicated real RabbitMQ 4 job executed the *exact learner-published* unbound DLX example: a rejected event with no DLX binding left source and quarantine empty; a new event after binding appeared in quarantine with `x-death.reason=rejected`. This single-node classic-queue demonstration does NOT establish quorum/cluster dead-letter safety, actual lost-message recovery, enterprise provider effects, independently approved operator replay or human learner mastery.

## Evidence and verification restrictions

1. **New source-derived curriculum regression:** `scripts/check-system-thinker-enterprise-to-portfolio.mjs` verifies precisely targeted lesson maps, depth/artifact anchors, per-lesson credible references, composition in real learners' reading sources, and the milestone cross-module transfer gate. It is registered in `scripts/tests/curriculum-smoke.test.mjs`; check latest-head CI before claiming the new regression green.
2. **Historical real protocol CI:** Source-derived Python XML/XSD/SOAP+Zeep/FTP/SFTP and live Redis/RabbitMQ/PostgreSQL outbox and poison-DLX recovery had passing CI at previous branch heads, most recently 19/19 jobs at `6be5b4f7`. Later run #41459105017 **does** execute an unbound DLX route on a disposable live broker, but **does not** execute an enterprise CMDB/IdP or full Steward import processing.
3. **Browser evidence:** At prior head `6be5b4f7`, 215 System Thinker activities rendered at desktop and 390px, with navigation, no page-level overflow and IndexedDB saved-practical/reflection hard-reload persistence. The revised long readings passed the matching-code-head 215/215 desktop/mobile browser traversal at #41459105017; they still require **manual** comprehension/readability checks.
4. **Independent transfer:** The revised [11-module municipal maintenance assessment](./ped-008-system-thinker-independent-transfer-review.md) demands novel contract/authorization misuse, missing DLX route, stale read, changed ADR premises, and one end-to-end invariant trace. This is an **unadministered instrument**, not evidence a learner learned.
5. **External labs:** Explicitly retain enterprise provider, identity and policy approval, quorum DLX safety, third-party SFTP trust, and external provider idempotency as UNVERIFIED until a real integration is run. Do not equate the isolated lesson simulator with production assurance.

## Technical reading base and attribution

Official sources used as primary anchors, then actual worked examples authored in TSA: [Python CSV](https://docs.python.org/3/library/csv.html), [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [AsyncSSH SFTP](https://asyncssh.readthedocs.io/en/latest/api.html), [W3C WSDL 1.1](https://www.w3.org/TR/2001/NOTE-wsdl-20010315), [Zeep](https://docs.python-zeep.org/en/latest/), [OWASP XML External Entity Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html), [RabbitMQ confirms/acks](https://www.rabbitmq.com/docs/confirms), [RabbitMQ DLX](https://www.rabbitmq.com/docs/dlx), [Google SRE](https://sre.google/sre-book/table-of-contents/), [arc42 quality](https://docs.arc42.org/section-10/), [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110). Existing XML video and Redis supporting video remain optional; no video was claimed fully watched. Where vendor guidance limits delivery guarantees, the lessons explain those limits rather than copying an optimistic tutorial claim.

## Source-review disposition

**One school source-reading pass now spans all eleven modules**, with targeted fixes in modules 1–11 and source/runtimes explicitly separated from learner outcomes. Do **not** close PED-008 or merge draft PR #333: new matching-head build/browser and real-person independent learner review remain outstanding; additionally the specified enterprise/security/cluster tests remain scope-limited or unverified. The next action is to close those named System Thinker gates, not to start a different school's audit.
