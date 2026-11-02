# PED-008 — System Thinker independent learner-transfer review

**Status:** ASSESSMENT INSTRUMENT ONLY — no learner results recorded.
**School lock:** System Thinker, all 11 canonical modules, in the exact sequence at `packages/runtime-kernel/src/paths/system-thinker.ts`.
**Evidence:** Record observed work, not whether the learner clicked the Next button. A source rewrite, green CI, or a coach's answer does not score as learner mastery.

## How to administer

Give the learner the **unfamiliar domain below** after finishing each System Thinker module. Do not provide diagrams, schemas, code or an architecture choice as a hint. The learner may consult TSA lessons and independently look up technical reference documentation, but must name references and explain the mechanism without a coach supplying the answer. Allocate a bounded session per module; collect original diagrams, runnable evidence where specified, rejected hypotheses and a five-minute oral/written defence. Allow the learner to say *not enough information*: that can be the correct answer.

For each module, score six dimensions as applicable: **conceptual accuracy, evidence traceability, boundary/ownership correctness, failure/negative case, competing alternative and independent explanation**. Score 0 = absent or materially incorrect; 1 = needs prompting or omits a consequential failure; 2 = correct, justified, evidence-backed and unprompted. A module is learner-accepted only with **at least 10/12, no zero, and a real negative/diagnostic observation where applicable**. A reviewer records name/date, prompts, artifacts and actual learner responses. This is a proposed review threshold, not a claim of externally calibrated assessment validity.

## Unfamiliar case — municipal water maintenance requests (fictional synthetic data)

A city service office operates three maintenance districts. Residents can report a meter leak; authorized technicians inspect work orders; a dispatcher assigns a technician; and a supervisor closes work after evidence is recorded. The legacy billing system exposes a SOAP operation for retrieving meter status, while a subcontractor uploads a nightly CSV of inspections. Unreliable network connectivity occasionally causes the app to retry requests. A director says “put everything into Kafka and separate microservices” but has no measurements.

Given facts: meter ID is stable, residents may submit requests but may not close them, a work order is scoped to one district, and closing requires an inspection result. Unresolved questions: identity source for temporary contractors, who authorizes cross-district reassignment, SLA for delayed imports, legal retention of photo evidence, permitted corrections to a closed order, billing's update authority and whether a cache is needed. The learner must explicitly resolve or preserve these uncertainties rather than invent policy.

### Module-by-module probes

| Module | Uncoached task | Pass-specific observable evidence / failure test |
| --- | --- | --- |
| 1. Requirements and Problem Framing | Reframe “add a dashboard” and “use Kafka” as two possible problems; write four functional obligations and two quality scenarios | Define actor, triggering context, measurable result and an assumption whose falsification changes design; reject premature architecture |
| 2. System Boundaries and Context | Draw one context view, separating residents, staff, billing, subcontractor and trust boundaries | Explain why an internal database is not an external actor; label current vs proposed interactions and ownership |
| 3. Modeling Software Systems | Draw C4 context/container/component views and a work-order state machine | Distinguish model zooms; block resident-driven closure, unsupported closed→open transition and inconsistent component ownership |
| 4. Components and Dependencies | Map domain services, authorization, billing adapter and CSV parser dependencies | Trace change impact of swapping billing SOAP version; identify and remove at least one inappropriate dependency cycle |
| 5. Data Flow and Integration | Trace one close-order command and one retry whose HTTP response was lost after commit | Mark authorization, durable commit, observed HTTP result, fingerprinted same-key retry and changed-payload conflict separately; run a negative experiment |
| 6. Enterprise File and Batch Integration | Design an inspection CSV manifest, `.part`→final handoff, rejection/replay ledger and district-scoped application boundary; **also diagnose two concurrent importers** for the same delivery and different deliveries that both assume the old district owner | In a disposable database, prove missing-row SELECT FOR UPDATE does not reserve an absent ID, demonstrate same-ID duplicate and changed-content conflict, then distinct-ID stale-owner rejection with an unchanged rejected effect/receipt. Include incomplete delivery, host-key refusal, unauthorized actor, and a novel uncoached interleaving or explicitly UNVERIFIED case. Preserve distinction between synthetic approval fixtures and real district/IdP authority |
| 7. SOAP and XML Enterprise Integration | Map WSDL operation, XML namespace/XSD constraints and consumer adapter outcome | Execute valid response, SOAP Fault, wrong namespace and provider outage; then provide a schema-valid but unauthorized proposed district transfer, proving that the adapter records a discrepancy rather than updating the authoritative work order |
| 8. Distributed State and Messaging | Decide whether DB+worker or Redis/RabbitMQ is justified; run a novel unsupported event through a supervised recovery and explain business-version reordering | Show original event identity and `x-death` quarantine, publish-confirm-before-quarantine-ack replay, deduped local effect and v8-before-v7 projection guard; diagnose a missing/unbound DLX routing destination without pretending the previous classic-queue lab proves at-least-once quarantine; separate confirm, ack, external effect and retained-log guarantees |
| 9. Failure Modes | Investigate a failed nightly import and a timed-out close order with synthetic logs | Show evidence for timeout vs rejection vs post-commit ambiguity, including a silent stale read and one operator retry/replay; estimate backlog from explicit arrival/service rates, identify the unsafe retry and the smallest authorized recovery intervention |
| 10. Architecture Decisions | Draft two ADRs: synchronous vs asynchronous billing notification, and managed file transfer vs shared storage | Compare synchronous, DB-outbox worker and outbox+broker options without presupposing Kafka/RabbitMQ; include rejected alternatives, measured versus assumed drivers, provider idempotency limits, operational owner, and a new premise under which the ADR should be revisited |
| 11. System Thinker Portfolio | Produce one consistent set of requirements, context, flows, state model, integration contracts, ADRs and recovery explanation | Cross-reference artifact versions, trace one domain invariant from requirement through authority and database commit to external transport and derived cache, show a novel unauthorized/replay adverse test, and defend simple topology without coaching |

## Reviewer record (complete only after observation)

- Date, reviewer and learner (or anonymized learner code):
- Branch/source version and the exact activity/lesson IDs assessed:
- Prior knowledge and whether assistance was given:
- Original learner artifact links (no fabricated URLs):
- Real commands, output, failures and reviewer observation:
- Six dimension scores (0–2 each) with evidence for every score:
- Unprompted question/answer and contradiction diagnosis:
- **Decision for each of the 11 modules:** Not tested / In review / Blocked / Accepted.
- Rework required and independently repeated verification date:

## Deliberate acceptance limits

These probes are synthetic education exercises. They do not test real resident information, grant permission to access municipal systems or establish production compliance. A local SQLite/Redis/RabbitMQ/SOAP/SFTP experiment is not equivalent to a secured deployed service. Do not reuse answers from the Steward example or the provided scenario as a model solution. A human reviewer must inspect the learner's independent reasoning, code and outputs; automatic UI progression does not award the pass.

**School closure decision:** Keep #332 and draft PR #333 open while any module has no independent review. School audit stays System Thinker throughout the review; do not begin another school's remediation to escape unresolved acceptance gates.
