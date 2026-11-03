# PED-005 — Technical Steward whole-school learner-source audit

**Active school:** Technical Steward only (13 paths). **Not in scope for this pass:** Professional Engineer, although issue #329 originally groups both.  
**Date:** 2026-11-03. **Parent acceptance:** #318 / #315. **School issue:** #329. **Working PR:** #355.  
**Status:** **AUDIT IN PROGRESS — NOT LEARNER VALIDATED.** Do not close on source counts, green CI or synthetic browser traversal.

## Stop-the-line finding: generic material masquerading as a lesson

`packages/runtime-kernel/src/paths/technical-steward.ts` used `prepareStewardship` to prepend one generic "Worked governance decision" per path **and** one generic "Prepare accountable evidence" reading before every practical. This rewords the practical's scenario/instructions/criteria and does not teach the specific concept. It inflates learner activities and progression. The old `docs/curriculum/technical-steward-deep-audit.md` calls the school strong; that is a historical **structural** assessment, not learner evidence.

**PR #355** removes the generator for all 13 paths, preserves every original authored lesson/activity ID and source order, and adds `scripts/check-technical-steward-authored.mjs` to `pnpm test`. Any completed generated-activity IDs must not count toward current progress. Validate legacy re-entry in an actual browser before claiming that property.

## Original authored-module classification (provisional, source-only)

Classification describes the **actual authored readings**, excluding generated wrappers. The reviewed samples cover all 13 path source files; this is not a full per-activity human or rendered inspection.

| Learner order / path | Source finding and concrete remediation | Status after this checkpoint |
|---|---|---|
| 1. Technical Leadership | 8 original readings now separately explain concept boundaries, prerequisites, operational mechanism, alternatives, a worked case, misleading decisions and an unseen transfer. Their 8 original practicals now assess novel decisions and disqualifying outcomes. Separate 3-step review lab still requires actual learner evidence. | Original reading mechanisms revised; practice and learner validation open |
| 2. Engineering Governance | 7 original readings teach decision-rights mapping, accountability, policy/standard distinction, exceptions, evidence cadence and proportionate controls. Their 7 original practicals now require unfamiliar case evidence, specific authority and rejected false-approval behavior. | Original reading mechanisms revised; practice and learner validation open |
| 3. IT and Technology Governance | All 10 original readings show governance outcomes and relevant COBIT/ITIL/ISO/NIST decisions. The formerly 180-minute single lab was split into 3 assessable phases (60/60/60) preserving the original phase-1 ID. | Original reading mechanisms revised; no learner validation |
| 4. Technology Strategy and Capability Planning | 6 original readings and their existing practicals now combine worked horizons/non-choices, new-case strategy choices, falsifiable failures and topic-specific success criteria. Future assumptions explicitly conditional. | Original reading mechanisms revised; no learner validation |
| 5. Technology Risk | All 9 original readings have risk evidence mechanisms; all 9 original practicals now introduce independently different risk packets with disqualifying false-assurance cases. False-green controls remain in scope. | Original reading mechanisms revised; no learner validation |
| 6. Controls, Compliance and Assurance | All 10 original readings now show control objectives, preventive/detective/corrective roles, design-vs-operation, evidence, sampling, compliance limits, findings and proportionality with falsifying evidence. | Original reading mechanisms revised; practical/rubric validation open |
| 7. Architecture Governance | All 8 original readings now compare principles, standards, selections, reviews, exceptions, decision ownership, context-specific tailoring and lifecycle/retirement with alternatives and disconfirming examples. | Original reading mechanisms revised; practical/rubric validation open |
| 8. Security and Data Governance | All 8 original readings include actual delegated-role boundaries, testable policy hierarchy, data ownership/classification, conditional retention, access denial with after-state and approved exceptions. | Original reading mechanisms revised; legal authorization and learner gates open |
| 9. Change and Service Governance | All 8 original readings now cover change risk/control, exact-artifact provenance, service-owner boundaries, incidents vs problems, readiness, emergency changes and false-green approvals. | Original reading mechanisms revised; operational proof unverified |
| 10. Third-party and Technology Lifecycle Risk | All 11 original readings now show shared SaaS responsibility, vendor evaluation, installed vulnerability exposure, EOL, tested exit, internal product support, provenance, repository retention and bounded exceptions. | Original reading mechanisms revised; actual supplier exit unverified |
| 11. Technical Debt and Engineering Health | All 8 original readings now demonstrate distinguishing debt from defect, evidence-based impact and priority, KPI/KRI games, sustainable remediation, ownership and capacity trade-offs. | Original reading mechanisms revised; learner validation open |
| 12. Engineering Handbook and Standards | All 8 original readings now render outcomes, mechanism, worked choice, false-assurance case, uncoached transfer, ordered practice and scoped resources as separate learner-facing blocks rather than one concatenated paragraph. | Original reading structure revised; independent usability unverified |
| 13. Technical Stewardship Review | The original 600-minute capstone is split into 4 separate evidence-gated practical phases of 130/160/220/90 minutes; the Handbook's 390-minute lab is also split into 120/150/120, and Technology Governance's 180-minute lab into 60/60/60. The original activity ID is preserved for Phase 1; later phases require new independent completion. | Capstone split; conflicting-evidence defense and real-world decisions unverified |

## Targeted practical-remediation checkpoint (3 November 2026)

**What is verified:** On source commit `6040629e4ca4e53bbf71f744662b5bc71f6ca822`, [Actions run #41671317459](https://github.com/enoqueJonas/tsa/actions/runs/41671317459) passed **all 19 technical jobs**, including CI audit/build, cross-school browser regression, technical-steward scripted traversal and learner-browser checks. This establishes a technical baseline *before* the newer practice changes; it does not prove later commits or educational competence.

**What changed after that baseline:**
- Enhanced **83 original topic practicals** across Technical Leadership (8), Engineering Governance (7), Strategy (6), Technology Risk (9), Controls/Assurance (10), Architecture Governance (8), Security/Data Governance (8), Change/Service Governance (8), third-party/lifecycle (11), and Engineering Health (8). Each now requires a distinct new-case scenario and evidence-based, potentially falsifiable completion; retained existing original IDs.
- The original Technology Governance 180-minute lab is three source-authored phases (60/60/60), preserving its original phase-1 ID.
- The original Handbook 390-minute lab is three source-authored phases (120/150/120), preserving its original phase-1 ID.
- Technical Leadership's eight original readings now have explicit prerequisite knowledge, defined roles/boundaries, causal step-by-step mechanism and real alternatives rather than only one short definition and one example.
- The guard checks all 83 distinct original practicals for unseen-case inputs and disqualifying criteria, all three multi-phase labs, all 13 authored paths and the four-phase final stewardship capstone.
- Added [independent transfer protocol](./ped-005-technical-steward-independent-transfer-review.md) with thirteen blind case packets, proposed scoring threshold, stop-the-line failures and an **all-NOT-TESTED** human-evidence register.

**Limitations:** The new changes must pass their own exact-head CI/build/browser tests (do not borrow older green), followed by qualitative reading and exercise scoring. Shared per-module completion language still needs scrutiny: adding a reject rule is necessary but does not automatically supply a model answer or demonstrate teaching quality. Previous school prerequisite state, real company authority and real vendor incidents must not be invented.


## Whole-school conceptual-depth reconstruction — 101 original readings

**Source status:** All twelve conceptual modules now have topic-specific prerequisites, causal decision/control mechanisms, alternatives, and diagnoses of persuasive wrong decisions **in their own original reading blocks**. This is an editorial/source remediation milestone, NOT an observed learner outcome. All original activity IDs remain stable; no generic standalone prep reading or fabricated lesson-credit wrapper was added.

| Module | Original readings | New substantive learner-facing mechanism / teaching focus | Unverified gate |
|---|---:|---|---|
| 1 Technical Leadership | 8 | Outcome ownership vs implementation, evidence-based influence, reversible choices, audience-specific communication, mentoring by prediction, no-hints continuity, independent review, responsible escalation | Blind learner critique; actual delegated roles |
| 2 Engineering Governance | 7 | Governance vs management, decision rights, accountable closure, mandatory policy/standard distinctions, scoped exceptions, evidence cadence, proportionate control design | Actual organization authority; independent decision |
| 3 IT & Technology Governance | 10 | Benefit chain from user outcome, real resource costs, metric denominators, governance structures, precise but limited COBIT EDM/ITIL/ISO PDCA/NIST roles; one evidence source cannot prove every claim | Framework/source currency; independent new-case decision |
| 4 Strategy & Capability | 6 | Outcome-to-horizon sequencing, limited-capacity nonchoices, capability as people+process+data+technology, uncertain investment estimates, build/buy/retire, evidence-gated roadmap options | Actual sponsor capacity/approval; learner prioritization |
| 5 Technology Risk | 9 | Risk vs issue, confidence and ordinal likelihood, inherent/residual control proof, RTO/RPO and unapproved appetite, treatment comparisons, delegated acceptance, decision-grade register, KRIs, distinct authority | Risk acceptance authority and independent score |
| 6 Controls, Compliance & Assurance | 10 | Preventive/detective/corrective timeline, precise objectives, design/bypass, population-based operating effect, provenance, positive+negative tests, compliance != security, audit independence, findings and proportionate control | Real control operation; sampling and assurance claim |
| 7 Architecture Governance | 8 | Principle vs standard/ADR/exception, selection based on measured drivers, review of counterfactual, bounded deviation, actual version lifecycle, decision rights, contextual defaults | Tested exceptions; independent architecture challenge |
| 8 Security & Data Governance | 8 | Governance vs secure code, custodian vs lawful data owner, policy hierarchy, source/replica data lifecycle, classification and handling, privacy/retention authority, resource-scoped access and true denial, time-bounded exceptions | Applicable actual legal/policy scope, authorized controls |
| 9 Change & Service Governance | 8 | Consequence-based change risk, exact build-to-deploy control, release decisions, end-to-end service ownership, incident/problem/change, rehearsed readiness, emergencies, no false-green pipeline | Exact production artifacts and genuine incident evidence |
| 10 Third-party & Lifecycle Risk | 11 | Proportional supplier assessment, actual dependency/failure graphs, SaaS shared duty, EOL as deployed exposure, tested exit, package ownership only after second-consumer gate, artifact source/provenance, support and retention | Contracts, supplier proof, executed export/exit |
| 11 Technical Debt & Engineering Health | 8 | Debt vs bug/risk, observed rework vs estimated ROI, opportunity cost, ungameable metrics, KPI vs KRI, incremental safe remediation, accountable cadence, feature trade-off | Observed real productivity effect, independent transfer |
| 12 Handbook & Standards | 8 | Testable standard, safe runbook, superseding ADR, negative review checklist, deputy rehearsal, standard effective versions, expiring exception, event-triggered maintenance; eight copyable proposed Markdown artifacts | Actual deputy no-hints exercise, runbook execution |
| 13 Final Stewardship Review | — | Four evidence-gated practical phases (130+160+220+90 minutes) consume preceding school outputs and test a defended strategy under conflicting evidence | Real approved estate/authority, human capstone defence |
| **Total original readings** | **101** | In-source blocks use distinct prerequisites, mechanics, alternatives and falsifiers, not generated activity inflation | **0 independent human assessments recorded** |

**Automated guard:** `scripts/check-technical-steward-authored.mjs` now requires a 101-reading conceptual-block inventory and 83 independent original-case practices (plus 3/3/4 independently assessed lab phases). `scripts/check-school-learner-browser.py` checks actual 390px mobile journey across 13 modules; desktop original Risk/Controls/Architecture readings have a minimum rendered-depth guard, and Handbook original readings must show a copyable example artifact. These tests are not a substitute for subjective expert reading or learner comprehension.

**Technical evidence caveat:** Earlier matching-head [run #41671317459](https://github.com/enoqueJonas/tsa/actions/runs/41671317459) was green *before* this reconstruction. A later matching-head [run #41675462030](https://github.com/enoqueJonas/tsa/actions/runs/41675462030) had 18/19 green: desktop rendered all 219 Technical Steward activities, but a newly introduced mobile selector had an incorrect nested locator and failed on first practical. Selector corrected; subsequent full-school mobile and legacy persisted-progress tests require a new exact-head result. **Do not claim 19/19 for the newly rewritten school before that result exists.**

**Pedagogical caveat:** A 3–4k-character lesson with headings is not automatically good teaching. The key still missing is a person without coaching interpreting an unseen scenario and creating an evidence-backed artifact against the protocol's explicit critical-failure rubric. External system simulations remain classroom examples unless an authorized environment truly ran them.

## Source-to-executable-practical stress test — 3 November 2026, follow-up

The **prior** exact-head baseline at `e10e47e`, [Actions #41680816104](https://github.com/enoqueJonas/tsa/actions/runs/41680816104), passed **19/19** jobs, including all 219 desktop and all 219 narrow-mobile activities and 83 rendered separate novel cases. That pass predates the new executable lab; it **must not** be transferred to later commits.

**Material defect identified:** Some critical practicals taught the correct decision vocabulary, yet supplied no independently runnable population or observable rejection. A learner could submit generic governance prose, and the assessor had no concrete baseline to challenge. The repaired subset now has a **Node.js 22+ offline, zero-credential lab**, [source and instructions](../../labs/technical-steward/README.md), with:

- A fabricated but attributable **14-release population** (12 evidenced, one emergency release with zero selected mandatory tests, one deployed/tested artifact mismatch). Initial result must be **HOLD 12/14**. Exact digest, nonzero selected tests, zero failed mandatory tests, denied-after-state, evidence/run IDs and timestamp are required to pass the *synthetic* gate.
- A fabricated **two-observation recovery packet** with a backup-only UNKNOWN and an isolated **360-minute** rehearsal against an explicitly **hypothetical, unapproved 240-minute RTO**. Supplier uptime cannot stand in for a restore. The result must be **RECOVERY_ASSURANCE_NOT_ESTABLISHED**.
- A **learner-controlled `--file` scratch mutation** and a deliberate **`--require-pass` nonzero negative**. Tests actually execute the documented Node commands and reject false-green, missing provenance, missing denied-after-state, duplicate release IDs and absent recoverability evidence.
- Embedded executable command/output blocks and linked practical assessment requirements in **six original lesson/practical pairs**: Controls & Assurance **Control Effectiveness**, **Control Testing**; Change & Service Governance **Release Governance**, **Evidence-based Release Approval**; Technology Risk **Inherent/Residual Risk**, **Risk Appetite/Tolerance**. Both source-compiled and browser-rendered layers remain subject to CI.
- A graded independent prediction, mutation, artifact citation, decision authority and false-result explanation. Editing JSON to say PASS is explicitly **not real control verification**, and no synthetic recovery target is represented as approved policy.

**Scope honesty:** This is a demonstrable executable exercise for **six of the 83 original topic-practical pairs**, not a claim that all governance exercises have command-line actions or that every other case has adequate input data. The other **77** remain candidates for detailed evidence-packet and reviewer-oracle scrutiny. Some legitimately require judgment and review of authoritative artifacts rather than executing code; those must still be independently repeatable with supplied decision data. Human learner transfer and actual organization-provided evidence remain NOT TESTED. The latest exact-head CI outcome is **pending until checked against the final commit**.

## Required next actions — finish this school, do not jump to Professional Engineer

1. Inspect all newly revised source readings **for actual instructional completeness and prior knowledge assumptions**. Worked examples and text coverage alone do not prove the learner can explain the underlying mechanism; split any remaining overbroad concept cluster while preserving prior IDs.
2. Review all original practicals; replace weak "write an artifact" prompts with required input data, a model output, discriminating failure and a rubric that would reject a plausible but wrong answer. Never fabricate a company-wide approval policy or claim a live Steward system exists.
3. Execute tests and build at the **matching PR head**. Inspect desktop + 390px mobile learner path, navigation, code and headings, and legacy progress after generated-ID retirement. GitHub Actions CI without this is structural verification only.
4. Verify earlier-school technical prerequisites by actual source ID. In particular, governance consumes Architect, Security, Reliability and Quality evidence; it must not imply unbuilt modules, invented packages or current production systems.
5. Record externally unavailable governance interviews, board/risk authority decisions and independent novice assessment as **UNVERIFIED**. Score a human's uncoached scenario response against stated acceptance and failure criteria before using **VALIDATED**.
6. After closing this school's **source audit only**, start a separate Professional Engineer whole-school pass. Do not combine their checklists or validation statuses.

## Evidence and limitations

- **Source inspected:** `technical-steward.ts` and the 13 `technical-steward-*-deep.ts` files, plus the historical Technical Steward deep-audit, resource-audit and evolution contract.
- **Changes:** original authored runtime wiring, topic-specific evidence/negative/transfer cases across all twelve conceptual paths, the four-phase capstone, the updated legacy-progress regression, and the source-derived 13-path ID/order and learning-block guard. See PR #355.
- **Verified only at pre-practical baseline:** all 19 CI technical jobs at `6040629`. **Current PR head requires fresh matching-head CI and new-case practical checks.** Full qualitative desktop/mobile assessment, human learner re-entry, real organizational decisions/control operation and independently scored teach-back remain unverified.
- **Status convention:** source change is not learner validation. Keep #329 open.
