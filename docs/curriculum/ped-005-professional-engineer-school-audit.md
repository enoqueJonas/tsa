# PED-005 — Professional Engineer source-depth audit

**Scope:** the seven Professional Engineer learning paths only. Technical Steward has a separate source branch [#355](https://github.com/enoqueJonas/tsa/pull/355). This checkpoint follows the learner's forward-only remediation policy and does not reopen Builder, System Thinker, Platform Builder, Delivery Engineer or other previously authored schools.

**Tracking:** #329 / #318 / #315.  
**Status:** **PARTIAL SOURCE REMEDIATION; NOT LEARNER VALIDATED.** Technical evidence needs the latest matching-head CI, and real independent capstone completion is not simulated.

## Root cause: generated filler had become learner material

The live `professional-engineer.ts` adapter had inserted a superficial `professional-model` lesson into each of seven paths and a `professional-preparation` reading before each practical. Those additions paraphrased the practical's instructions, replacing prerequisite teaching with extra navigation and completion markers. They created artificial activity IDs that could distort perceived progress.

This branch removes those synthetic additions. All original authored lesson/activity IDs remain unchanged and ordered. The two added first-principles checkpoints have their own distinct activity IDs. Earlier artificially generated progress is not transferred as proof of completing an authored lesson; synthetic legacy browser progress restoration must be verified.

## Critical product boundary

The Professional Engineer capstone **must be a second substantial system from a blank repository in a new problem domain**. The removed generic `professionalGuides` used a contradictory example: "Implement one vertical Steward feature from a new repository". This is not acceptable independent-transfer evidence. The actual independent-build source already correctly forbids forking or copying Steward; this audit protects that source instead of reintroducing a Steward clone.

## Module-by-module source inventory / disposition

| Learner order | Actual authored source | Current disposition |
| --- | --- | --- |
| 1. Professional Practice and Ethics | `professional-engineer-professional-practice-deep.ts` | Original six ethical decision topics retained; **new prerequisite** distinguishes evidence state, organizational authority, harm and dissent with executable false-release test; remaining per-reading depth and reviewer transfer pending |
| 2. Capstone Problem Discovery | `professional-engineer-capstone-problem-discovery-deep.ts` | Original new-domain discovery preserved; **new prerequisite** differentiates independently observed traces, testimony, assumptions and inferences plus negative source-presence oracle; remaining evidence of actual non-leading interviews pending |
| 3. Capstone Engineering Proposal | `professional-engineer-capstone-engineering-proposal-deep.ts` + `professional-engineer-proposal-teaching.ts` + `professional-engineer-proposal-proofs.ts` | **All 14 original readings and practicals directly remediated** using a consistent explicitly fictional non-Steward case; three executed-source negative models and three independent integration gates; original final ID preserved. Matching-head CI and human transfer distinct |
| 4. Independent Build | `professional-engineer-independent-build-deep.ts` | Existing explicit blank-repository / non-Steward requirement preserved; true authorship, failure-oriented CI and independently justified trade-offs **not yet reviewed in this pass** |
| 5. Production Readiness | `professional-engineer-production-readiness-deep.ts` | Authored readiness gates retained; deployed recovery, real observability/security and release-governance evidence **NOT TESTED** |
| 6. Engineering Portfolio and Reflective Practice | `professional-engineer-portfolio-reflection-deep.ts` | Authored reflection tasks retained; artifact traceability and independent reviewer authenticity checks **not yet reviewed in this pass** |
| 7. Engineering Defence | `professional-engineer-defence-deep.ts` | Authored technical defence retained; scored unseen case, failure diagnosis and uncoached engineer defence **NOT VALIDATED** |

## First two prerequisite lessons — actual source, negatives, and correct interpretation

- **Accountable Decisions: Evidence, Authority, Harm and Dissent** (`professional-practice-accountable-engineering-decisions`): executable Python release-state oracle distinguishes actual FAIL, absent/NOT_TESTED and verified PASS. A deliberately weak "any evidence" implementation creates a false technical approval. Two additional mutants must fail exact published assertions. This is evidence-consistency teaching, **not an algorithmic ethical judgment, risk acceptance or production readiness certification**.
- **Discovery Evidence: Observation, Testimony, Assumption and Inference** (`capstone-problem-discovery-evidence-provenance`): independent Python provenance example contrasts an actually checked observation with an unchecked observation, stakeholder testimony and unsupported generalization. Two mutants must fail when provenance or verification is ignored. No user interview is claimed to have happened.

Every reading has a separate practice with new-domain transfer, concrete deliverables, explicit limitations and a reflective counterexample. A passing snippet can show only local logic, not an actual capstone or independently assessed learner.

## Remaining exit work

1. Complete per-lesson qualitative source audit of all seven paths, moving in learner order. Do not replace existing substantive material with generic addenda.
2. Require matching-head TypeScript, source-derived negative proofs, full test suite, production build, Chromium mobile/scroll/reload and strict learner-facing audit before calling this first pass technically verified.
3. Check re-entry for earlier generated progress markers. Legacy generated activities must not count as mastered authentic lessons.
4. Validate a genuinely new capstone from problem discovery through deployable artifact and evidence-based technical defence with an **unseen independent task**. Mark learner transfer NOT VALIDATED until it actually occurs.
5. Keep all unmet infrastructure, stakeholder, privacy and real-user requirements explicitly NOT TESTED rather than asserting that a headless browser proves them.

Do not merge or mark #329 complete solely because the source builds.
## 2026-11-06 — Module 3: Capstone Engineering Proposal, entire-module source remediation

**Scope:** this checkpoint covers the **entire Proposal module**, not modules 4–7. The original instructional source held fourteen 1–3 sentence readings followed by assignments broad enough to leave prerequisite reasoning unspecified; its 420-minute final lab combined boundary, architecture, release, cost, risks and defence into one unverifiable completion unit.

### Full original reading dispositions

Each original reading ID (and original practice ID) remains stable. All now render a mechanism explanation, worked decision based on the **fictional** community tool-lending domain (not interviewed stakeholders), meaningful alternatives, a failure mode, an evidence boundary, domain-specific independent practice with negative case and a targeted reference:

| Original lesson suffix | Mechanism / concrete negative and trade-off |
| --- | --- |
| system-context-and-boundaries | Separate actor, system, trust boundary and data authority; lost eligibility response, false duplicate ownership |
| domain-and-data-model-proposal | Reservation/Loan identity and lifecycle; active-loan exclusivity; concurrent read-before-write failure |
| architecture-proposal | Modularity versus split services; lost response/ambiguous state; measurable reversal threshold |
| infrastructure-and-hosting-proposal | VM/managed/cluster responsibility; failed restore and exposed backups; operations cost |
| delivery-plan | Commit–artifact–deployment–verification; populated migration; missing gate must not become green |
| quality-strategy | Risk → oracle → test boundary; unauthorized write with no persisted side effect |
| security-strategy | Identity and object ownership; signed cross-location nested mutation; token-safe diagnostics |
| reliability-strategy | User SLIs, ambiguous commit, idempotent retry and backed-up/actually restored state |
| operational-model | Bounded read-only diagnostic, escalation and stop conditions; no imaginary support team |
| cost-model | Fixed/variable/people costs, fictional USD envelopes, Decimal budget sensitivity and negative volume |
| governance-approach | Decision rights, review/exception authority, failed restore cannot be relabeled |
| dependency-and-internal-platform-decisions | Existing vs hypothetical internal packages, licenses, ownership, consumer proof and exit paths |
| implementation-milestones | Measurable vertical increments and negative acceptance oracle, not layer-first busywork |
| architecture-and-risk-review | Claim-to-evidence challenge, counterfactual architecture choice and GO vs CONDITIONAL GO vs REDESIGN |

### Exact executable evidence (the learner source, not a reimplementation)

- Active-loan local Python consistency oracle rejects issue when an item is already loaned; a deliberately wrong implementation allows it. **Does not prove concurrent PostgreSQL integrity**.
- Release evidence-state oracle distinguishes PASS / FAIL / NOT_TESTED and rejects a false technical green based only on unit tests. **Does not authorize a real deployment**.
- Fictional USD Decimal cost model computes 120/600/800-unit sensitivities, budget crossing and negative volume rejection. **Not a current supplier quote**.
- Source-extraction test runs each published program unchanged and checks that a targeted unsafe source mutation fails for the expected assertion. Fourteen independent reading lenses must exist and meet minimum substantial teaching sections.

### Lab separation and progress integrity

- **Stage A:** domain ownership, structural choice, hosting, concurrency and negative proof.
- **Stage B:** release pipeline, signed ownership-denial design, retry failure, restore and operations.
- **Stage C:** cost sensitivity, actual package authority, governance and adversarial review.
- Three stages have distinct practical+reflection activities, inserted after their prerequisite concepts. Original final `capstone-engineering-proposal-lab-defend-the-capstone-engineering-proposal-001` remains and now synthesizes staged evidence in 85 minutes rather than posing a 420-minute unscoped exercise.
- Expected assembled module: **18 lessons / 35 activities** (14 original concept+practice pairs, 3 staged practical+reflection pairs, 1 retained final). A browser script asserts all 14 original readings, copyable source for the three runnable proofs, 390px rendering, stage deep links and restored synthetic progress.

### Evidence status and limits

- **Source authoring:** all 14 original lessons remediated in this checkpoint, subject to technical audit.
- **Technical verification:** matching-head `pnpm test`, TypeScript, build, source-derived negatives, Chromium and strict curriculum audit required; never cite an earlier run as final after further commits.
- **Actual learner's new capstone, real peer review, owner authorization, production restore and assessed transfer:** **NOT VALIDATED / NOT TESTED**. Do not infer these from a fictional tool-lending fixture or synthetic browser.
- **Next module** after a green source gate: Independent Build. Do not expand this module's hypothetical case into the learner's actual capstone.
