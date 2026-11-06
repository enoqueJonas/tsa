# PED-005 — Technical Steward independent learner-transfer protocol

**Status: PROTOCOL AUTHORED; NO HUMAN LEARNER ASSESSED.**
**School:** Technical Steward only, all 13 paths. **Parent:** #318 / #315. **Tracking:** #329, PR #355.
**Scope:** Governance decisions that consume Architect, Quality, Security, Delivery and Reliability evidence. This is not an external compliance opinion, actual risk acceptance or proof that any simulated service is deployed.

## Administration rules and evidence

1. A reviewer selects **one previously unseen variant per module**. The learner may inspect legitimate earlier-school reference artifacts, but must not read the assessor's model or receive hints during the test. The assessor records what sources the learner used.
2. Give each learner the stated *hypothetical* observation packet; do not imply that a real FNB, bank, IdP, vendor or Steward production service has approved any policy or has a measured failure. The learner must label missing organizational authority/thresholds **UNKNOWN**.
3. The learner creates a versioned artifact and explains it aloud or in their own written words. The reviewer then changes one fact and asks whether the decision still holds. A copied example does not establish transfer.
4. For an environment-dependent exercise, execute only in an isolated authorized lab. If execution is unavailable, record **NOT EXECUTED**, with expected outcome and a runnable validation plan. Never claim operating control effectiveness from an unrun procedure.
5. Use a common rubric **0–4 each** for concept/causal mechanism, evidence/provenance, decision/authority, falsifying negative/uncertainty, and new-case transfer/reconsideration. Record all five sub-scores, source links, learner's artifact and failed assumptions. **Provisional pass: at least 16/20, no dimension below 3, and no critical-failure condition.** This is a proposed TSA learning threshold, not a legal/regulatory standard.
6. A critical failure (fabricating approval, silent acceptance of prohibited business risk, falsely treating a green shell job as authorized side-effect proof, or asserting an untested recovery succeeded) **fails the module regardless of score**.
7. After a failure, revise the *original teaching lesson* and retest with a different case. Do not tune the rubric until every memorized answer passes.
8. Keep **source remediated**, **scripted rendered**, **independent learner passed**, and **authorized real-system operation** as separate evidence statuses. PR/CI green can support only the first two.

## Blind scenario packs and assessor oracles

### 1. Technical Leadership — accountable closure under disagreement
**Packet:** A test request to transfer ownership returned HTTP 403. A subsequent authorized read shows a different owner. Product wants release; QA blocks; platform operations has a rollback route but no decision owner is named.
**Task:** Identify factual evidence versus inferred cause, coordinate three stakeholders, assign execution versus consequence/risk authority, compare rollback/defer/repair, set a decision deadline and articulate a safe challenge/escalation.
**Required output:** One-page decision brief, role/authority mapping, negative test with after-state and reopened-decision trigger.
**Reject:** A 403 is called safe despite changed state, or a developer unilaterally accepts an organization-level security exception.

### 2. Engineering Governance — who may decide a waiver?
**Packet:** A routine dependency patch has a green exact-revision test; a separate production personal-data retention exception lacks delegated approval. A committee wishes to review both in the same weekly meeting.
**Task:** Classify governance/management/engineering choices, define differentiated decision rights, minimum standard and exceptional approval, and select which control can remain automated.
**Required output:** Two decision paths with roles, risk-specific criteria, scope/expiry where appropriate, and one removed ceremony.
**Reject:** A software engineer invents a legal retention requirement or claims the committee's existence proves a control's operating effectiveness.

### 3. IT & Technology Governance — a green indicator hides failure
**Packet:** The deployment dashboard reports 100% success but the mandatory ownership authorization suite ran zero tests on the last three artifacts. The sponsor believes governance is solved by a COBIT certificate.
**Task:** Connect organizational outcome to service capability, choose only relevant governance concepts, define metric denominator and independent evidence, and request an accountable decision.
**Required output:** Outcome→capability→control trace, one correctly scoped framework rationale, signal/owner/action table and a counter-metric.
**Reject:** More sign-offs are proposed without verifying exact artifact coverage or the failed business invariant.

### 4. Technology Strategy & Capability — choosing what *not* to fund
**Packet:** Two sprint-equivalents of delivery capacity are available. Recovery objective is **hypothetically** four hours, the last isolated restore took six hours, an ownership report is unreliable, and a fashionable new message broker has no evidenced throughput driver.
**Task:** Prioritize a bounded portfolio, reject or defer at least one attractive option, account for operational skills and opportunity cost, and define a test that would overturn the ranking.
**Required output:** Decision matrix including do-nothing/current state, near/conditional horizons, owner and evidence-gated checkpoint.
**Reject:** An unfunded three-year technology wishlist or invented financial ROI from arbitrary scores.

### 5. Technology Risk — distinguish observations and uncertainty
**Packet:** Backups report thirty successes but no independently timed restore; vendor uptime is 99.9%; one unauthorized token remains active after rotation. No approved enterprise risk appetite is supplied.
**Task:** Write cause/event/consequence risks, distinguish existing token issue from future loss event, assess confidence and treatment, and identify who could accept residual risk.
**Required output:** Two decision-ready risk records, unverified evidence list, proposed—not approved—tolerance and a falsifying restore/token test.
**Reject:** Equating backup success with recovery performance or deriving restore probability from provider uptime.

### 6. Controls, Compliance & Assurance — design versus actual operation
**Packet:** Fourteen production releases occurred. Twelve have exact-digest authorization test reports; two emergency releases have no such test or approved exception. A branch-protection screenshot exists for the entire period.
**Task:** Define population and criteria, evaluate design and operating effectiveness independently, record exception disposition, and specify a negative control test.
**Required output:** Control assessment worksheet with source identity/date, conclusion limits, finding and closure oracle.
**Reject:** Treating 12/14 as automatic assurance without assessing the two unknown high-impact deployments.

### 7. Architecture Governance — retain versus introduce a new platform
**Packet:** One queue currently carries owner updates. A proposed new broker adds operational support cost but the measured failure is duplicate processing after timeouts. No throughput bottleneck is demonstrated.
**Task:** Review the architecture driver, compare a durable idempotency change, current queue and additional broker; assign decision rights, exception/ADR and reconsideration signal.
**Required output:** Architecture-governance decision with one rejected alternative, support/lifecycle owner and negative replay proof.
**Reject:** A product name is treated as an architecture principle or a previous classroom installation as current active estate.

### 8. Security & Data Governance — technical custody is not lawful authority
**Packet:** An analytics team asks for indefinite export of account-linked ownership data. Policy duration and lawful use have not been supplied. A test user with a valid login can query another user's record.
**Task:** Separate data owner, service custodian, security reviewer and acceptance authority; specify the policy questions, role/resource/action test and retention lifecycle.
**Required output:** Decision-rights matrix, classification/purpose assumptions, denied read/write check and unanswered policy escalation.
**Reject:** Inventing a legal duration, treating authentication as authorization or treating a hidden UI record as deleted.

### 9. Change & Service Governance — approve the *deployed artifact*
**Packet:** Tests passed for commit A; a mutable image tag deployed digest B. A failed post-deploy reconciliation left customer records pending. Operations says the release succeeded because the pipeline is green.
**Task:** Define incident restoration, problem investigation and controlled corrective change; block/rework approval against exact artifact, rollback and customer-effect evidence.
**Required output:** Timeline, artifact provenance chain, safe recovery decision and incident closure test.
**Reject:** Resolving customer-impact incident on merge/green CI without reconciling durable effects.

### 10. Third-party & Lifecycle Risk — prove that exit is possible
**Packet:** A managed logging provider will end support in 60 days. Export API returns CSV but omits raw fields needed by two incident queries. Contract promises exportability and a low monthly price; actual migration cost is unknown.
**Task:** Inventory consumers and retention obligations, compare extend/replace/retire, define a safe export/reimport proof, owner and support/contract escalation.
**Required output:** Lifecycle decision, tested or explicitly untested exit experiment, missing-field consequence and rollback/cost uncertainty.
**Reject:** Claiming the supplier exit passed because a file downloaded or because the vendor advertises a support badge.

### 11. Technical Debt & Engineering Health — evidence over aesthetics
**Packet:** Three releases cost six measured engineer-hours of fixture repair. A proposed rewrite is estimated at twelve hours but future maintenance is unknown. One unsupported dependency with a real exposure path has a deadline.
**Task:** Separate defect, technical debt and technology risk; compare targeted fixture isolation, full rewrite and security work, with opportunity cost and a counter-metric.
**Required output:** Measured versus estimated impact ledger, priority decision, bounded experiment, rejected option and verification trigger.
**Reject:** Choosing purely by code cleanliness or claiming a precise ROI without enough cost/frequency evidence.

### 12. Handbook & Standards — no-hints recovery
**Packet:** The handbook's first result points to an expired runbook, another page describes a retired artifact registry, and the deputy engineer cannot find who may approve an emergency exception.
**Task:** Without owner hints, locate the authoritative guide and risk contact; identify stale source, propose safe correction and rerun the navigation test in an authorized environment.
**Required output:** Timed no-hints observation, updated standard/runbook index, exception route and failing-then-passing retrieval evidence.
**Reject:** Marking usable because pages exist, without a substitute independently finding and following the correct route. If no substitute participated, mark HUMAN TEST UNVERIFIED.

### 13. Technical Stewardship Review — combined adversarial decision
**Packet:** Mix evidence from modules 4–12: an untested restore, expired exception, mutable release tag, unowned vendor dependency and two competing platform options. One component is a historical comparison-only tool. Decision authority is deliberately incomplete.
**Task:** Produce four distinct capstone gates (actual estate; tested risk and controls; retain/simplify/retire portfolio; challenged review and handoff). The assessor then discloses that the originally preferred option has an unplanned cost and the learner must revise or defend their choice.
**Required output:** Four separately assessable records linked to evidence, alternative, owner, authority uncertainty and a safe reconsideration trigger.
**Reject:** Claiming historical tools remain active by curriculum convention, quietly accepting risk or asserting the real-world approval/rehearsal happened when not observed.

## Recording sheet — initialize as NOT TESTED

| Module | Concept 0–4 | Evidence 0–4 | Authority 0–4 | Falsifier 0–4 | Transfer 0–4 | Critical failure? | Human result / artifact |
|---|---:|---:|---:|---:|---:|---|---|
| 1 Technical Leadership | — | — | — | — | — | — | NOT TESTED |
| 2 Engineering Governance | — | — | — | — | — | — | NOT TESTED |
| 3 IT & Technology Governance | — | — | — | — | — | — | NOT TESTED |
| 4 Technology Strategy & Capability | — | — | — | — | — | — | NOT TESTED |
| 5 Technology Risk | — | — | — | — | — | — | NOT TESTED |
| 6 Controls & Assurance | — | — | — | — | — | — | NOT TESTED |
| 7 Architecture Governance | — | — | — | — | — | — | NOT TESTED |
| 8 Security & Data Governance | — | — | — | — | — | — | NOT TESTED |
| 9 Change & Service Governance | — | — | — | — | — | — | NOT TESTED |
| 10 Third-party & Lifecycle | — | — | — | — | — | — | NOT TESTED |
| 11 Technical Debt & Health | — | — | — | — | — | — | NOT TESTED |
| 12 Handbook & Standards | — | — | — | — | — | — | NOT TESTED |
| 13 Stewardship Review | — | — | — | — | — | — | NOT TESTED |

**Mandatory evidence still missing:** Human rendered-page readthrough at desktop/390px, learner comprehension and novel transfer, real external controls/authority, and actual authorized service/contract effects. Source unit tests and CI browser navigation do not fill these cells.
