# PED-008 — System Thinker modules 4–5 connected teaching audit

**Date:** 2026-11-02  
**School lock:** System Thinker only. **Status:** source remediation authored; rendered learner/manual validation and independent transfer pending.  
**Related:** [school audit](./ped-008-system-thinker-school-audit.md), [learner transfer](./ped-008-system-thinker-independent-transfer-review.md), [PR #333](https://github.com/enoqueJonas/tsa/pull/333).

## Diagnostic finding

The previous four **Components and Dependencies** lessons and four conceptual **Data Flow and Integration** lessons already contained meaningful individual explanations. However, their change-impact, dependency arrows, flow contracts and failure semantics were insufficiently connected to the prior OBS-01 Requirements → Boundaries → Modeling teaching case. A novice could memorize each term yet struggle to defend why an external owner directory must *not* be treated as transfer authorization, or why an HTTP timeout does not mean a database rollback. This is a cross-lesson continuity defect, not evidence that the existing isolated examples were useless.

We added two original, explicitly **fictional** OBS-01 sources at the teaching layer, leaving lesson and activity identifiers stable:

- `packages/runtime-kernel/src/paths/system-thinker-components-running-case.ts`: two targeted mechanism/negative sections in **each of four** component lessons.
- `packages/runtime-kernel/src/paths/system-thinker-flow-running-case.ts`: two targeted mechanism/negative sections in **each of four** conceptual flow lessons; the existing independently executed Django/PostgreSQL and ambiguous-HTTP lessons remain intact.
- Both are composed into their `*-deep.ts` sources rather than into generic runtime wrappers, and each reading receives an appropriate primary reference.

### Exact lesson-level teaching trace

| Learner order | Concrete mechanism and artifact | False-confidence/negative challenge |
| --- | --- | --- |
| 4.1 Components and Responsibilities | FR-OWNER-01 lookup versus proposed FR-OWNER-02 transfer; distinguish HTTP adapter, trusted authorization, use case, domain rule and PostgreSQL responsibility; revised responsibility map | Four source files do **not** necessarily equal four C4 components or deployables; Team B is not entitled to Team A |
| 4.2 Coupling and Cohesion Foundations | Interface/data/temporal coupling table; copyable Python dependency-cycle model with original and broken graph | A new service boundary does not remove a logical cycle; run negative example and explain why |
| 4.3 Dependency Direction | Distinguish runtime request direction from source-code dependency direction and repository abstraction; two alternative implementation choices | A generic repository interface does not prove lower coupling; domain policy must not depend on client-provided Team |
| 4.4 Internal and External Dependencies | Evidence-classified inventory: actual Django/DRF + PostgreSQL versus **proposed, not deployed** owner directory and RabbitMQ | Cache does not create authorization; outage must preserve forbidden mutation |
| 5.1 Following Data Through a System | End-to-end recorded-owner query and proposed transfer traces; input/context/authorization/persistence/response meaning separated | Database recording is not external organizational truth or approval |
| 5.2 Synchronous and Asynchronous Boundaries | Critical-path arithmetic (fictional 40+35+480 ms), durable-state versus eventual-notification timeline | `202 Accepted` before durable handoff is not a safe implementation; duplicate delivery remains possible |
| 5.3 Integration Contracts | Proposed directory contract: IDs, authority, source_as_of, semantic versioning and rejection cases | HTTP 200 does not prove permission; same idempotency key with altered intent must be rejected |
| 5.4 Failure Across Integrations | Five-case failure table including after-commit lost response, provider failure and replay authorization | Timeout is not rollback; stale retry after an intervening authorized change needs explicit policy |

## Execution and evidence tiers

1. **Standalone execution:** Ran the exact Python 3 cycle demonstration used in 4.2 locally as an interpreter experiment. Observed `baseline cycle: False`, then `policy imports transport: True`. This is a bounded graph-model test, **not** a measurement of actual Steward imports.
2. **Source-extracted regression created:** `scripts/check-system-thinker-components-flow-running-case.mjs` asserts the eight covered readings, two sections per reading, explicit negative artifacts, primary reference URLs and actual lesson composition. It executes the extracted learner Python cycle example and asserts stdout. Registered in `scripts/tests/curriculum-smoke.test.mjs`. **Latest-head CI needs an independent result** before counting this test as passed in the repository.
3. **No new activity IDs:** Each authored section is added to an existing reading; the canonical 215-activity browser census at historical `2ced14dc` cannot be credited automatically to the newly amended head. Re-run the complete browser suite and inspect at least one long page in each module manually.
4. **Domain and protocol proof:** Previous isolated CI proved Builder-derived Django/PostgreSQL authorization/rollback, and a separate HTTP/SQLite post-commit response-loss exercise. This change does **not** prove a real enterprise identity provider, current owner directory, external notification provider or new production change policy.
5. **Learner transfer:** The independent municipal-maintenance probes for modules 4 and 5 in the [review instrument](./ped-008-system-thinker-independent-transfer-review.md) are **authored but not administered**. Assess whether a learner can find an inappropriate dependency direction and distinguish commit, network receipt and replay semantics without coaching.

## References consulted, with limits

- [C4 components](https://c4model.com/abstractions/component) and [C4 diagram zoom](https://c4model.com/diagrams): separate component responsibilities from code files and deployable containers. Public documentation read.
- [Microsoft architecture principles](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles): source-level dependency inversion versus runtime call direction. Public documentation read.
- [Martin Fowler on coupling](https://martinfowler.com/ieeeSoftware/coupling.pdf): dependence and change-cost framing; existing source reference retained.
- [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110): transport status interpretation and conditional guarantees.
- [AWS Builders' Library — idempotent retries](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/): caller intent, stable operation identity, changed-intent conflict and late retry risk. Public documentation read.

No external video was represented as fully watched. No production Steward identity-policy claim was inferred from the fictional OBS-01 scenario.

**Next same-school source pass:** Enterprise File/Batch → SOAP/XML → Distributed Messaging → Failure Modes → Architecture Decisions → Portfolio, following the actual canonical learner order, not the importance ranking in this note. School #332 and PR #333 remain open/draft.
