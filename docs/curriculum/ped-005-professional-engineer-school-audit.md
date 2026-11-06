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
| 4. Independent Build | `professional-engineer-independent-build-deep.ts` + `professional-engineer-build-teaching.ts` + `professional-engineer-build-proofs.ts` | **All 15 original readings and practicals source-remediated**; 45 subject-specific mechanism/failure sections; six published executable wrong-case oracles, three new integration gates; both original long-lab IDs preserved. Live system and independent learner evidence remain unverified |
| 5. Production Readiness | `professional-engineer-production-readiness-deep.ts` + `professional-engineer-readiness-teaching.ts` + `professional-engineer-readiness-proofs.ts` | **All 12 original readings remediated in place**, each with a real verification practical; separate formerly missing accessibility prerequisite added; three integrated operational gates, seven runnable negative-model proofs, original final review ID preserved. Technical CI and human operational validation remain distinct |
| 6. Engineering Portfolio and Reflective Practice | `professional-engineer-portfolio-reflection-deep.ts` + `professional-engineer-portfolio-teaching.ts` + `professional-engineer-portfolio-proofs.ts` | **Three original lessons directly remediated with preserved reading/practical IDs**; four explicit prerequisite lessons added; 21 differentiated teaching sections; five exact source-run false-claim proofs; two integration gates plus final independent handoff. Actual capstone and human reviewer authenticity remain NOT VALIDATED |
| 7. Engineering Defence | `professional-engineer-defence-deep.ts` + `professional-engineer-defence-teaching.ts` + `professional-engineer-defence-proofs.ts` | **All 12 original Defence readings rewritten in place** with independent negative-case practicals, 36 mechanism/decision sections, six executed learner-oracle programs, three staged unseen-challenge gates and original final milestone ID preserved. Real second capstone and uncoached independent panel remain NOT VALIDATED |

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

## 2026-11-06 — Module 4: Independent Build, whole-module author-source remediation

**Boundary:** this is only module 4 of seven. The actual Professional Engineer capstone **must be a second substantial application in an independently chosen domain**, started from a blank repository. The repeated community tool-lending example is explicitly a **fictional training fixture**, never actual stakeholder interviews, realized product, real loan data or deployment proof.

### Original authored readings and practicals

All fifteen original read/practice lesson IDs remain unchanged and in learner order. The old 1–2-sentence original readings were insufficient to support independently starting a new software product. All fifteen now teach mechanisms, a worked counterexample, alternatives/failure, explicit environment limitations and a genuine new-domain exercise:

| Original authored lesson | Mechanism and observable failure |
| --- | --- |
| Start from a Blank Repository | Distinguish genuine independent authorship from copying/forking Steward; meaningful initial failing domain test |
| Establish Engineering Conventions | Runtime pinning and clean bootstrap, deterministic static tools, missing-secret refusal |
| Model the Domain | Lifecycle state transitions, forbidden reissue and unchanged state after rejection |
| Implement the System | Thin vertical stakeholder outcome, signed resource scope, no unauthorized side effects, ambiguous commit |
| Design and Evolve the Data | Active-loan constraints; SQLite partial unique index failure; Postgres concurrency not inferred |
| Build Infrastructure | Runtime/secret/network/backup ownership, reproduction and fail-closed configuration |
| Automate Delivery | Commit vs artifact digest, no rebuild-under-tag assumptions, missing evidence blocks promotion |
| Build Quality Evidence | Risk/oracle/test boundary, mutation/negative testing, preserve pre-extraction baseline |
| Secure the System | AuthN vs AuthZ vs domain, signed cross-owner nested write, persistence effects and secret hygiene |
| Instrument the System | Correlated allowlisted structured logs, unsafe bearer-token example, high-cardinality risk |
| Build Reliability Evidence | Ambiguous commit/retry, SQLite actual backup/restore integrity, recovery scope limits |
| Operate Internal Dependencies Deliberately | Approved existence and contract, two real consumers before tsa-test-core, no dummy Maven consumer |
| Iterate on Engineering Decisions | Falsifiable architecture hypothesis, observed implementation change and superseding decision |
| Document Significant Decisions | ADR context, alternatives, evidence, owner and revisit threshold |
| Manage Scope and Technical Debt | Safety defect vs deliberate debt, impact priority and defended non-goals |

The source is `professional-engineer-build-teaching.ts`: **45 distinct subject-specific instruction sections** across 15 original topics. Practices now require a real command/commit, expected/observed positive and negative results, failure interpretation, rejected alternative and new-domain transfer. Targeted references use the actual concept rather than a general syllabus link.

### Six exact source-published runnable proofs and mutations

`professional-engineer-build-proofs.ts` contains the actual learner-visible Python programs, executed unchanged by `scripts/check-professional-engineer-depth.mjs`:

1. Frozen dataclass state machine: issue → return; forbidden second return/reissue; original state unchanged.
2. Real **disposable SQLite** partial unique index on active loan records: second active item loan rejected, historical returned row allowed. **Not a PostgreSQL two-client race or real migration proof.**
3. SHA-256 same release label / different bytes, exact artifact identity vs unsafe tag-only promotion. **Not a supply-chain attestation.**
4. Ownership-scoped denied mutation with zero local loan/notification side effects vs deliberately unsafe write-before-403. **Not a real JWT/HTTP claim.**
5. Structured logging allowlist vs intentionally unsafe synthetic bearer-token inclusion. **Not an audit of all proxy or app middleware.**
6. Executed local SQLite backup, corrupted original state and newly restored database with matching checksum/row-count; rejected late backup. **Not a real PostgreSQL RTO/RPO or production restore.**

Each positive run has deterministic expected output markers, and each published program must fail a deliberately unsafe source-derived mutation. The source guard checks all fifteen actual lesson IDs, three substantial explanatory sections, real independent practices, reference links and original lab ID continuity.

### Granularity, stages and original IDs

The inherited 300-minute tsa-test-core extraction and 480-minute full-release lab were overloaded exercises. Requirements were **retained**, while independent proof work is now sequenced into:

- **Stage A** (after first five concepts): independent repository, real vertical domain slice, constraints, migration negative.
- **Stage B** (after next five): reproducible artifact/deployment, real signed same-owner and cross-owner denial, missing pipeline gate, clean pre-extraction test baseline.
- **Stage C** (after final five): correlated failure, local restore, idempotent ambiguity, architecture revision and two-real-Java-consumer eligibility.

Each stage is an independently navigable practical and reflection. The original tsa-test-core lab ID is preserved as a **105-minute integration/publish stage**, after the two-real-consumer proof, and the original end-to-end release lab ID as a **120-minute release evidence synthesis**. A real Java qualifying consumer must have an independent purpose and passing prior test baseline; a non-Java capstone must not be rewritten merely to generate a second Maven dependency. Nexus publication remains a real lab requiring authorized infrastructure, **NOT TESTED** in synthetic CI.

**Expected assembled module: 20 lessons, 38 activities** (15 original read/practice pairs, three new practice/reflection gates, two original labs). The scripted browser audit traverses all fifteen source readings and six copyable code examples at 390px, visits all new gate IDs and original long lab IDs, and verifies synthetic progress restoration. Scripts demonstrate navigation only, not actual lab completion or learner independence.

### Exit evidence and limits

- **Source remediated:** authored 15/15 original Independent Build lessons with concrete mechanisms, examples, negative cases, real-practical contracts, and stage-scoped labs.
- **Technical verification:** still depends on the **latest commit's** CI (source-executed Python and rejected mutants, TypeScript, 38 smoke tests, production build, Chromium mobile/progress, strict audit). A previous green head does not cover subsequent changes.
- **NOT VALIDATED / NOT TESTED:** the real independent repository, signed API, owned SQL database, actual GitLab pipeline, Nexus packages, IdP, production-style recovery, real stakeholders, external assessment and novel learner transfer. Keep these as outstanding learner/environment gates. The next author-source module is **Production Readiness**, not an invitation to claim the capstone is operational.

## 2026-11-06 — Module 5: Production Readiness, author-source reconstruction

### Root cause and scope

The original twelve readings offered high-level readiness descriptions and lists of desired evidence but almost no explanation of *how* a learner measures, falsifies, interprets, or safely acts on an operational claim. The 480-minute final lab then demanded the entire set of risk, accessibility, recovery, supply-chain and release authority evidence in one unit. This was instructional compression, not an independent demonstration.

The new module retains **all 12 original lesson and activity IDs**, now with a distinct practice for each original reading, and inserts one separate **Accessibility and Human Workflow Readiness** lesson with its own practice. This addresses a critical teaching gap: the old final practical required accessibility evidence while no earlier original reading explained keyboard/assistive-technology acceptance and its limits.

**Actual count:** 13 read+practice concepts = 26 activities, three integrated practical+reflection stage gates = 6, and one preserved original final practical = 1; **17 lessons, 33 activities**. The original lab `capstone-production-readiness-lab-run-the-capstone-production-readiness-review-001` now takes 95 minutes of *synthesis after prerequisites*, without deleting its original acceptance requirements.

### Thirteen distinct first-principles treatments

| Original/new topic | Taught mechanism, negative case, acceptance boundary |
| --- | --- |
| Deployment Readiness | Immutable digest vs deployment, populated-data migration compatibility, missing result prevents green |
| Observability | User-facing failure while process remains healthy, correlated telemetry, alert ownership and token-safe logs |
| Security Assessment | Deployed object-level authorization, valid cross-owner request, zero prohibited side effects, risk triage |
| **NEW Accessibility and Human Workflow** | Keyboard/focus/error journey, assistive technology/human validation separate from automated scanner |
| Performance Evidence | Workload and state correctness, tail latency vs average, sample limitations and saturation |
| Reliability and Failure Testing | Fault scope, ambiguous commit, idempotent request identity, bounded and authorized injection |
| Backup and Recovery | RPO/RTO vs actual measures, pre-fault snapshot, restored consistent state and unsafe late backup |
| Runbooks | Actual operator steps, read-only diagnostics, explicit STOP/ESCALATE and independent rehearsal |
| Operational Ownership | Real response coverage and reachable owners, no imaginary on-call team, ongoing maintenance cost |
| Risk and Control Evidence | Current operating proof vs configured control, PASS/FAIL/NOT_TESTED fail-closed aggregation |
| Dependency and Supply-chain | Artifact identity vs trust vs license permission, vulnerability/owner/supported version/exit |
| Cost and Capacity Review | Fictional Decimal USD/month volume sensitivity, human effort and meaningful revisit trigger |
| Release Decision | Technical recommendation vs policy authority vs actual deployment; RELEASE/CONDITIONAL/DEFER/REDESIGN |

`professional-engineer-readiness-teaching.ts` contains **39 distinct subject-specific mechanism/decision/failure instructional sections**, all based on an explicitly fictional cooperative teaching fixture, not user research or a real capstone. Learners transfer mechanisms to the **genuinely independent new-domain product** and record source revision, target environment, executable command, observed negative and positive result, actual owner and reversal threshold. Unavailable infrastructure is NOT_TESTED, never simulated PASS.

### Seven source-extracted executable models

`professional-engineer-readiness-proofs.ts` provides actual copyable lesson source, not companion scripts:

1. SHA-256 artifact identity plus migration/smoke PASS/FAIL/NOT_TESTED; deliberately unsafe matching-label shortcut.
2. Synthetic checkout failure despite green health endpoint; high user-failure rate triggers diagnostic attention.
3. Correct nearest-rank percentile on fictional 5-request latency fixture, contrasted with misleading average; explicitly insufficient for production p95.
4. Executed disposable SQLite pre-fault backup and restore with row-level consistency; post-fault backup rejected; NOT production PostgreSQL RTO/RPO evidence.
5. Fail-closed technical evidence state for authorization, restore and runbook rehearsal; deliberately unsafe one-green-gate approval.
6. License permission, provenance and vulnerability treated independently; a digest does not establish legal distribution rights.
7. Invented USD/month Decimal fixed+usage cost threshold, negative volume rejection and deliberately ignored variable cost.

The source regression executes all published programs unchanged and replaces one critical implementation decision in each with an unsafe mutant that the lesson's assertions must reject. Explicitly **does not** claim actual user stakeholders, enterprise security audit, license clearance, live pricing, real restore, released production artifact, incident response or decision sign-off.

### Three prerequisite-positioned operational gates

- **Stage A:** deployed artifact identity, post-deploy verification, user-impacting telemetry, cross-owner authorization, accessibility and representative workload. Appended after the first five concepts.
- **Stage B:** bounded fault, actual useful restored state, read-only operator runbook, maintenance owner and realistic escalation; after the next four concepts.
- **Stage C:** operating controls, real dependency/licensing provenance, measured costs, risk authority and adversarial release decision; after the final four concepts.

Each has an independent practical and a four-question-style counterfactual reflection. The original final review synthesizes them, has an independently scored 0–2 rubric across five dimensions, and requires an unseen adverse scenario to change or defend the decision. Self-review is explicitly NOT INDEPENDENTLY VALIDATED. An authorized **DEFER** is successful engineering judgment when material evidence is missing; module completion never requires a fabricated production GO.

### Evidence classification and next steps

- **Authored-source depth:** full module 5 revised, all original IDs preserved, missing accessibility prerequisite introduced.
- **Technical confirmation:** exact-head TypeScript, source-derived Python and wrong-answer mutations, full curriculum tests, production build, real Chrome navigation and 390px mobile/progress persistence, and strict audit all required before calling it technically verified. Prior module's passing run cannot validate this head.
- **Real-world independent capstone, user accessibility review, actual server/IdP/DB, cloud restore, funded release authority, licensing legal review, SLO/cost workload and external assessor:** **NOT VALIDATED/NOT TESTED**. No synthetic CI activity can fill those gaps.
- **Next authored source module:** Professional Portfolio and Reflection (module 6), followed by Capstone Defence (module 7). Keep PR #403 draft and unmerged until deliberate source review.

## 2026-11-06 — Module 6: Professional Portfolio & Reflection, complete author-source remediation

### Why the original module needed reconstruction

The inherited portfolio had three authored lessons: `evidence-portfolio`, `reflective-practice` and `professional-development`. They contained important broad statements, but did not teach the difference between artifact existence, observed behavior and independent skill; how to establish provenance/authorship; how to reconstruct a cause without hindsight; how to disclose a real achievement safely; or how to conduct a falsifiable unseen peer challenge. Generic screenshots and certificates could satisfy the visible exercise while proving little.

All **three original lesson IDs and six original reading/practical activity IDs** are preserved. Their authored reading and exercise content are deepened directly, **not** via automatically generated prep wrappers.

### Original and added concepts in learner sequence

| Lesson | Status | Core first-principles, wrong decision and transfer evidence |
| --- | --- | --- |
| Engineering Evidence Portfolio | Original, remediated | Narrow falsifiable claims; source revision, author's contribution, observed negative case, new-domain transfer vs guided gallery |
| Claim Calibration, Provenance and Evidence Quality | NEW prerequisite | Artifact link vs behavior proof; test boundary, domain and environment scope; missing negative oracle; overclaimed SQLite-to-production evidence |
| Reflective Engineering Practice | Original, remediated | Time-of-decision facts vs hindsight, good decisions with bad outcomes, bad decisions with lucky outcomes, measurable future habits |
| Engineering Decision Reconstruction and Causal Reasoning | NEW prerequisite | Incident timeline, observation vs hypothesis, correlation vs causality, alternative diagnosis and bounded discriminating experiment |
| Confidentiality, Consent and Responsible Portfolio Publishing | NEW prerequisite | Asset ownership, authorization, privacy/PII/credentials, sanitized vs permitted evidence, synthetic reconstruction without fictitious authorship |
| Independent Review and Unseen Transfer Challenges | NEW prerequisite | Actual independent reviewer identity, previously unseen domain constraint, new test, 0–2 rubric, dissent, correct NOT VALIDATED classification |
| Continuing Professional Development | Original, remediated | Role-relevant evidence gaps, guided vs truly independent competence, three achievable applied learning goals and re-testing rather than certification count |

The source `professional-engineer-portfolio-teaching.ts` contains **21 topic-specific mechanism/counterexample/transfer teaching sections** (three per reading). Every practice now requires contribution/authorship, actual source/command/environment/result, negative oracle, disclosure permission and a way to falsify the claim. The fictional cooperative is just a teaching fixture and cannot be submitted as the learner's own independently constructed system.

### Five exact learner-visible executable evidence exercises

`professional-engineer-portfolio-proofs.ts` provides Python programs copied unchanged by the teaching runtime and executed directly by `scripts/check-professional-engineer-depth.mjs`. Each program includes correct observations and an explicit unsafe shortcut; test mutants independently change the actual learner source to make a previously rejected claim look trustworthy.

1. **Evidence Portfolio:** guided/simulated vs independent, complete vs missing negative cases, and false confidence from a link alone.
2. **Claim Calibration:** actual observed environment vs claimed environment; local SQLite result cannot substantiate production PostgreSQL.
3. **Causal Reconstruction:** fictional timestamped postmortem, time-of-decision knowledge vs later facts; rejection of hindsight certainty.
4. **Responsible Disclosure:** ownership, public permission, synthetic reconstruction and redaction; confidential but secret-free material remains WITHHOLD.
5. **Development Plan:** source, novel applied task, negative oracle, reviewer feedback plan, bounded weekly hours; course-only or infeasible schedules rejected.

**Evidence limits:** local executable classification only illustrates logic. No source program authenticates a real human contribution, establishes legal permission, verifies an actual incident or demonstrates a real outside reviewer.

### Granularity and authentic evaluation

- **Stage A — Authenticate and Calibrate Actual Engineering Evidence:** three traceable claims spanning Steward, the genuinely independently built capstone and one operational/ethical decision. A missing capstone remains NOT_TESTED; deliberately overbroad claims must be downgraded.
- **Stage B — Reconstruct Decisions, Protect Evidence and Invite Challenge:** real decision chronology, alternative causal explanation, publish/withhold register, genuinely outside reviewer packet and dissent.
- **Final portfolio handoff lab:** 4–6 strong evidence-backed claims, one dated decision reversal, lawful disclosure ledger, five-dimension real peer scoring (target at least 8/10 with mandatory authenticity/disclosure), three measured 12-month development objectives, handoff to subsequent Capstone Defence module. **No reviewer => NOT INDEPENDENTLY VALIDATED**. This is not a simulated completed defence.

**Expected assembled module: 10 lessons / 19 activities** (7 reading+practice = 14, 2 staged practical+reflection pairs = 4, 1 final handoff practical). CI is configured to check the seven real rendered readings at 390px, five copyable source programs, original six IDs, new gates, final ID and all nineteen synthetic saved-progress IDs. Synthetic saved progress never proves an actual learner performed an activity.

### Current status and next source target

- **Source-remediated:** full module 6 author content including original IDs; independently testable contracts introduced.
- **Technical verification:** matching-head source-Python and deliberately wrong mutant tests, TypeScript, full cross-school tests, production build, actual Chrome navigation/390px/reload and strict audit required. An earlier green head cannot validate the latest source.
- **Actual capstone, real workplace evidence, genuine independent reviewer and consent to publish restricted employer artifacts:** NOT VALIDATED. No screenshots or synthetic fixture may be relabeled as independent proof.
- **Next authored source module:** Professional Engineer `capstone-defence`, module 7/7, followed by school-wide source/CI and independent learner acceptance review. Draft PR #403 remains unmerged.

## 2026-11-06 — Module 7: Capstone Defence, complete original-source remediation

### Original deficiency and author-source disposition

The twelve original readings were brief abstractions followed by a **720-minute single capstone defence milestone**. That final required evidence for system definition, architecture, security, reliability, quality, governance, trade-offs, real operations, reviewer challenge and independent transfer, without teaching what constitutes a falsifiable oral answer, how to interpret failed or absent evidence, or how to act when previously unseen constraints overturn a design.

**All twelve original reading lesson and activity IDs remain exactly as authored**, with their lesson order preserved, but each original reading is now a substantive explanation of mechanism, worked counterexample, trade-off/alternative, executable reference where relevant, and independent transfer exercise. Each now has its own practice requiring a claim, original capstone source/environment/command, real observed positive and negative result, alternate explanation, consequence/authority and reviewer status. A fictional community lending narrative is a **teaching fixture only**, not a completed second capstone, real stakeholders, production system or defense.

The 12 original subject treatments span **36 differentiated technical and ethical sections**:
- Present Problem and Outcomes — problem vs solution, original observation and validated user benefit vs a delivered feature.
- Present Architecture — domain, deployment and trust boundaries; denied side effects, ambiguous commits and simpler options.
- Explain Trade-offs — dated alternatives, cost/reversibility, constraints and an experimentally falsifiable reversal threshold.
- Present Engineering Evidence — actual source/command/environment and negative-case oracle vs a CI screenshot or link.
- Defend Quality Decisions — risk-driven test layers, observed database effects and mutation detection, accessibility limits.
- Defend Security Decisions — signed object-level authorization, nested routes, deployment secrets, real attack paths.
- Defend Reliability Decisions — user transaction SLI, ambiguous retry, observed restore vs configured backup.
- Defend Governance Decisions — actual release/risk authority, external dependency license vs byte digest, failed controls remain FAIL.
- Respond to Challenges — claim/scope/observation/limitation/change-or-test answer structure, contrary evidence and unknowns.
- State Limitations — defect, unknown, excluded scope and authorized residual risk kept distinct with stop conditions.
- Propose Future Evolution — evidence-based improvements, no-change and defer options, altered budget/compliance scenario.
- Reflect on TSA Journey — principled transfer beyond Steward, one dated reversed judgment and bounded development plan.

### Six directly published and mutated executable proofs

`professional-engineer-defence-proofs.ts` supplies actual copyable Python source for:

1. implementation-test evidence ≠ real stakeholder benefit;
2. forbidden cross-organization action has zero loan/notification effects, unlike a misleading response code;
3. a source link and local SQLite negative proof ≠ production PostgreSQL claim;
4. 403/404 status cannot substitute for observing absence of unauthorized state;
5. a green security test does not erase failed restore, missing license or other governance gates;
6. a newly removed or failed critical control must change an otherwise positive technical recommendation.

`scripts/check-professional-engineer-depth.mjs` extracts the **exact authored code**, executes it unmodified, confirms deterministic observations and changes one meaningful part of each program to an unsafe alternative. Its actual assertions must reject every mutant for the expected reason. The source scanner also verifies all twelve original IDs, substantial subject explanations, three prerequisite-positioned stages and original final milestone identity.

### Learning and assessment granularity

- **Stage A:** original problem/discovery, actual independent-domain architecture, trade-offs and reproducible positive/negative evidence, plus unseen additional actor/ownership model.
- **Stage B:** quality/security failures, signed cross-owner negative, recovery evidence, dependency licenses and accountable release authority; a missing critical result must change readiness to DEFER or BLOCKED.
- **Stage C:** explicit limitations, changed budget/data/identity constraints, actual novel-domain transfer and external assessment readiness.

Each stage is a practical plus an unseen-challenge reflection, inserted after four corresponding original topics. **The original full milestone ID `capstone-defence-professional-engineering-capstone-and-defence-001` is unchanged**, and its original broad requirements remain but now form a **115-minute final synthesis** after staged evidence rather than a single 720-minute task. Real independent reviewers must score authenticity, architectural reasoning, safety diagnostics, new-domain transfer and governance/evolution (five dimensions, 0–2 each), with a target at least 8/10 and no zero for authenticity or safety. **No real panel = NOT INDEPENDENTLY VALIDATED.** An honest failure or defer can be a legitimate outcome; it is not necessary to manufacture successful release or graduation.

**Expected published module: 16 lessons / 31 activities** (12 original readings and new practices = 24, three two-activity stages = 6, original final milestone = 1). Actual Chrome renders all 12 original reading IDs at 390px, verifies copyable source from six readings and all stages, preserves the original final ID and synthetic progress reload. Synthetic completion must never be confused with real learner oral examination.

### Technical and human gates

- **Source authoring:** all twelve original lesson IDs remediated and final split; source-level depth acceptance awaits matching-head CI.
- **Technical verification:** exact-source executed Python and wrong-answer mutants, runtime-kernel TypeScript, full curriculum suite, production build, Chrome navigation/390px/progress and strict audit, all on the same current commit.
- **Independent new-domain application, real second-system deployment, authorized security/restore evidence, original field interviews, live assessor identities and external unseen panel scoring:** **NOT VALIDATED / NOT TESTED**. No automatic lesson completion or synthetic reviewer is credible graduation evidence.

**School-wide caution:** modules 3–7 have all original authored readings explicitly remediated, but modules **1 Professional Practice and 2 Capstone Problem Discovery received added foundational lessons and wrapper removal only** in the early PR pass. Their remaining original deep-source readings may still require the same complete per-topic mechanism, failure, novel-transfer and actual rendered validation; a green school build must **not** be called a full school author-depth sign-off until these original sources have been audited/reconstructed. Genuine independent learner/panel validation is a separate gate, always.
