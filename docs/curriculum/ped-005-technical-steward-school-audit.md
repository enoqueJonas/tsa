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
| 3. IT and Technology Governance | Ten three-paragraph readings teach useful vocabulary, including COBIT, ITIL, ISO and NIST, but give little complete worked decision trace or disconfirming case. Their 55-minute estimates are not evidence of depth. | TARGETED IMPROVEMENT |
| 4. Technology Strategy and Capability Planning | Source has distinct `workedCases` for strategic horizons, non-choices and investments; validate that cases actually show alternative, opportunity cost and reversal trigger rather than narrative reassurance. | TARGETED REVIEW / UNVERIFIED |
| 5. Technology Risk | The original `workedRiskExamples` covers six topics (identification, likelihood, inherent/residual, appetite/tolerance, treatment, acceptance). Registers, KRI and ownership still rely heavily on a conceptual reading and instruction lists. | TARGETED IMPROVEMENT |
| 6. Controls, Compliance and Assurance | Ten conceptual readings explain controls and assessment language and request 60-minute exercises; read source lacks a complete evidence sample and an explicit failed-control oracle across every topic. | THIN / REWRITE REQUIRED |
| 7. Architecture Governance | Governance subjects and prior Architect boundaries are present, but individual readings rely on summarized terms and artifact-creation prompts, not worked decision/exception/retirement traces. | THIN / REWRITE REQUIRED |
| 8. Security and Data Governance | Eight topics establish ownership, data classification, retention and access governance; original readings lack enough explicit violation evidence, legal/authority boundary examples and exercised decisions. | THIN / REWRITE REQUIRED |
| 9. Change and Service Governance | Eight subjects distinguish change/service responsibility. Readings need source-to-production evidence, a false-green operational case and risk-tiered approval vs delegated release comparison. | THIN / REWRITE REQUIRED |
| 10. Third-party and Technology Lifecycle Risk | Eleven concise readings correctly identify dependency, provenance, EOL, exception and exit concepts but do not yet teach complete proof of survivable supplier exit or version-lifecycle failure at the original lesson. | THIN / REWRITE REQUIRED |
| 11. Technical Debt and Engineering Health | Eight short topics link debt to outcomes, but practicals reuse a broad decision template; need cost/risk scenario, concrete decision model and counterexample for priority debt choices. | THIN / REWRITE REQUIRED |
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
