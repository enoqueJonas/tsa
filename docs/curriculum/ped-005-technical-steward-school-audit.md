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
