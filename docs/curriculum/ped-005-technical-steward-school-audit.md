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
| 1. Technical Leadership | Eight original readings had a compressed definition or high-level paragraph but were scheduled for 55 minutes. PR #355 adds eight distinct case mechanisms, bad-decision diagnoses and unseen transfers **inside the original readings**, covering accountability, influence, decisions, communication, mentoring, succession, reviews and escalation. Review lab answers and readability next. | Targeted source remediation committed; no learner evaluation |
| 2. Engineering Governance | Seven original readings briefly define governance, rights, accountability, artifact hierarchy, exceptions, evidence/cadence and proportionality without showing the governing decision. PR #355 adds seven independently inspectable scenarios, false-assurance cases and transfer problems to those original readings. | Targeted source remediation committed; no learner evaluation |
| 3. IT and Technology Governance | Ten authored readings teach basic vocabulary; five original framework readings (COBIT, ITIL, ISO, NIST, and framework tailoring) now include topic-specific decision mechanisms, false assurance and unfamiliar transfer. Other governance topics still need individual evidence review. | Targeted source remediation committed; remaining review open |
| 4. Technology Strategy and Capability Planning | Source has distinct `workedCases` for strategic horizons, non-choices and investments; validate that cases actually show alternative, opportunity cost and reversal trigger rather than narrative reassurance. | TARGETED REVIEW / UNVERIFIED |
| 5. Technology Risk | The original `workedRiskExamples` covered six topics; PR #355 now includes worked register/KRI/risk-ownership decisions with false-green evidence checks. The 9-topic source still needs evaluated learner transfer. | Targeted source remediation committed; learner evaluation open |
| 6. Controls, Compliance and Assurance | Seven original controls readings now include traced objectives, design-versus-operation, evidence provenance, testing method, findings, proportionality, disconfirming cases and transfer. Three other conceptual readings need deeper inspection and examples. | Source remediation in progress; not validated |
| 7. Architecture Governance | Five original Architecture Governance readings now provide distinct scenarios and false-approval or retirement evidence, including principles, standards, reviews, exceptions and lifecycle. Remaining context, selection and decision-ownership topics need focused review. | Source remediation in progress; not validated |
| 8. Security and Data Governance | Five original readings now teach bounded data-ownership, classification, policy-dependent retention, resource authorization and time-limited security-exception decisions with falsifying outcomes. Remaining roles, policy hierarchy and broad security-governance topics need depth checks. | Source remediation in progress; not validated |
| 9. Change and Service Governance | Six source readings now have worked risk tiers, exact artifact release approval, incident/problem/change distinction, operator readiness, emergency change and false-green report evidence. Two remaining change-control/service-ownership readings need focused examples. | Source remediation in progress; not validated |
| 10. Third-party and Technology Lifecycle Risk | Seven original readings now demonstrate vendor assessment, vulnerability exposure, EOL, a verifiable supplier exit, artifact origins, library support contracts and provenance evidence. Four remaining lifecycle topics still need independent review. | Source remediation in progress; not validated |
| 11. Technical Debt and Engineering Health | Five original readings now teach debt identification, observed versus estimated cost, prioritization against security exposure, KPI/KRI conflicts and a concrete feature-versus-debt choice. The three remaining topics plus generic practical criteria still need authored examples. | Source remediation in progress; not validated |
| 12. Engineering Handbook and Standards | Eight readings already contain authored learning outcomes, an example, common mistakes and practice; inspect actual example substance, access/re-entry and independence instead of inferring a pass from those fields. | TARGETED REVIEW / UNVERIFIED |
| 13. Technical Stewardship Review | Large capstone practical includes evidence inventory and stewardship choice requirements. Assess whether the learner can actually decide from incomplete conflicting evidence, demonstrate actual artifact outputs and defend a rejected alternative uncoached. | UNVERIFIED learner transfer |

## Required next actions — finish this school, do not jump to Professional Engineer

1. Deepen the documented THIN original readings in **module order**, using precise definitions, prerequisites, decision/evidence traces, genuine alternative/failure and an unfamiliar application. Split only genuinely overloaded lessons, preserving old activity IDs.
2. Review all original practicals; replace weak "write an artifact" prompts with required input data, a model output, discriminating failure and a rubric that would reject a plausible but wrong answer. Never fabricate a company-wide approval policy or claim a live Steward system exists.
3. Execute tests and build at the **matching PR head**. Inspect desktop + 390px mobile learner path, navigation, code and headings, and legacy progress after generated-ID retirement. GitHub Actions CI without this is structural verification only.
4. Verify earlier-school technical prerequisites by actual source ID. In particular, governance consumes Architect, Security, Reliability and Quality evidence; it must not imply unbuilt modules, invented packages or current production systems.
5. Record externally unavailable governance interviews, board/risk authority decisions and independent novice assessment as **UNVERIFIED**. Score a human's uncoached scenario response against stated acceptance and failure criteria before using **VALIDATED**.
6. After closing this school's **source audit only**, start a separate Professional Engineer whole-school pass. Do not combine their checklists or validation statuses.

## Evidence and limitations

- **Source inspected:** `technical-steward.ts` and the 13 `technical-steward-*-deep.ts` files, plus the historical Technical Steward deep-audit, resource-audit and evolution contract.
- **Changes:** original authored runtime wiring, type-safe topic-specific cases for Leadership and Engineering Governance, and source-derived 13-path ID/order guard. See PR #355.
- **Not yet verified in this checkpoint:** matching-head test result, production build, complete desktop/mobile learner traversal, learner re-entry, real organizational decision/risk-control observation or independent teach-back.
- **Status convention:** source change is not learner validation. Keep #329 open.
