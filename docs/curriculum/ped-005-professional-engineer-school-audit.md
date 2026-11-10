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


## 2026-11-10 — Module 2 original source: Selecting a substantial capstone problem

**Why this first:** module 7 Defence and modules 3–6 have substantial, topic-specific authored source; modules 1–2 still contain thin original readings. Rather than reopen completed Reliability/Quality topics or inflate synthetic checking, advance module 2 in original learner order. The *first original* reading `capstone-problem-discovery-choosing-a-substantial-problem-001` and its `-practice` retain both historical activity IDs and module placement. This is one of ten original module-2 topics, **not completion of module 2**.

**Actual deficiency:** the original candidate-selection reading defined broad suitability and warned against technology-first work but did not trace (1) a solution pitch versus an observed harm, (2) reported, observed and inferred evidence, (3) stakeholder access promised versus verified and permission to collect data, (4) an ethically bounded comparison between two imperfect candidates, or (5) a falsifiable choice/defer condition. The original paired practice used generic discovery instructions without a concrete wrong-decision oracle.

**Source remediation:** `professional-engineer-discovery-problem-choice.ts` now supplies six genuinely distinct original-reading sections: problem/symptom/cause/solution; provenance and ethical access; two fictional counterposed candidates; non-compensatory decision gates; an exact Python 3 case; source breakage and new-domain transfer. The first original reading actually renders the source blocks, not a detached essay. The paired practical now requires two solution-neutral statements with alternative causes, verified access and authorization, negative-source mutation, and a *neither* decision. An eligible candidate remains **eligible for further discovery**, not approved for design, deployment or stakeholder validity.

**Executable teaching contract:** the original reading displays a single exact Python 3 decision-gate program with five fictional cases: claimed but unverified access, forbidden/unauthorized evidence collection, unbounded scope, absent observed problem, and bounded candidate for further discovery. The source-extracting `scripts/check-professional-engineer-depth.mjs` executes the published bytes and requires `DISCOVERY_SELECTION_GATES_PASS`; three source mutations must fail assertions when a claimant is treated as verified, consent is ignored, or unbounded scope is accepted. These deterministic booleans are an **illustrative classroom filter**, not observational research, a production feasibility model, or learner validation.

**Rendered acceptance target:** `scripts/check-professional-engineer-browser.py` checks the *original* reading and practical route/IDs, distinct explanatory sections, code copyability, 390px overflow, reload and explicit claimed-vs-verified-access practice. The Professional Engineer workflow now triggers for both relevant new/modified discovery source files. Check the **matching HEAD** before declaring any automated tests or browser passes; the initially observed workflow for `bbcc3bc` was **queued**, not accepted.

**Remaining module-2 backlog:** Stakeholder Discovery; Problem Framing; Requirements; Constraints; Working with Ambiguity; Quality Attributes; Risk; Success Measures and Evidence; Scope and Non-goals; and the original final discovery brief. Each must receive an individual, evidence-led source audit and any required remediation. Module 1 Professional Practice also remains source-incomplete. The full independent new-domain capstone, real authorized research, observed learner performance, and actual external reviewer assessment are **NOT TESTED**; do not merge or mark whole-school accepted from one lesson and a green CI.


## 2026-11-10 — Module 2 original Stakeholder Discovery, three separate prerequisite readings

**Source finding and learning-boundary decision:** the existing original `capstone-problem-discovery-stakeholder-discovery-001` contained only a short definition/role inventory and suggestions to interview or observe. It did not teach a novice how to distinguish direct users, downstream operators, affected non-users and decision owners; map workflow handoffs; recruit without power/availability bias; avoid leading questions; establish voluntary informed participation and lawful access; or reconcile conflicting accounts without deciding truth by seniority. Its paired original `-practice` was generic. This is too many independent mechanisms for one short reading, so **split the learner progression**, not the original progress identity.

**Authored source:** `packages/runtime-kernel/src/paths/professional-engineer-discovery-stakeholders.ts` now supplies three different copyable/readable experiences connected in the original topic:
1. **Original reading `...-stakeholder-discovery-001`**, retained: workflow-based role map, authority versus firsthand exposure, missing affected voices, purposive/convenience sampling and limits, permission/consent, manager-only and testimony-only counterexamples, source-exact Python evidence gate.
2. **New focused `...-stakeholder-discovery-interview-method-reading`**: research question versus open recent-event interview questions, neutral probing/counterexamples, leading-question reconstruction, separate recording consent, confidential notes, objective observation versus testimony; explicitly fictional transcript.
3. **New focused `...-stakeholder-discovery-triangulation-reading`**: dependent source limitations, time-aligned handoff measurements, contradictory manager/clerk/operator claims, lack of authority or actual records, discriminating observations, provenance and defer/narrow outcome rather than voting among testimonies.

**Original `...-stakeholder-discovery-practice` remains after all three reading steps.** The distinct practice requires a role/handoff map, an affected non-user, rewritten neutral question, consent/access boundaries, exact local code and wrong-source mutations, contradictory evidence register and independent new-domain falsification. Two additional intermediate reading IDs are intentional; all previously authored IDs remain unchanged. Prior progress records must not be blindly relabeled as completion of new unstudied material.

**Exact source and negative oracles:** the original reading prints Python 3 standard-library `stakeholderCoveragePython`. Five fictional cases show `MISSING_STAKEHOLDER_VOICE`, `UNAUTHORIZED_RECORD`, `LEADING_QUESTION_BIAS`, `TESTIMONY_ONLY_CAUSE_UNVERIFIED`, and `READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS`. The last label does **not** mean discovery is proven. `scripts/check-professional-engineer-depth.mjs` extracts the exact displayed source and rejects four meaningful mutations (skip consent, skip coverage, skip leading-question check, treat pure testimony as causal observation). Exact copy and assertion failure are a program-level illustration, NOT authorization for real interviews, statistical validity or complete human research.

**Rendered checkpoint:** `scripts/check-professional-engineer-browser.py` traverses the original reading → new interview reading → new triangulation reading → original practical with actual Next actions; requires distinct teaching headings, original ID retention, runnable/copyable source, 390px no-overflow and practice reentry/reload. Synthetic prerequisite seeding is navigation coverage only. The new teaching file is included in the Professional Engineer workflow path filter. **Technical signoff requires the matching final HEAD workflow result**, not a successful older run.

**Still open:** actual permitted stakeholder recruitment, safe data handling, real session notes and independent challenge; module 2's following original topics Problem Framing, Requirements, Constraints, Ambiguity, Quality Attributes, Risk, Success Measures/Evidence, Scope/non-goals and final brief, plus module 1 original Professional Practice. No claim of whole-module source completion or learner validation. PR #403 stays DRAFT/UNMERGED; issue #329 stays OPEN.


## 2026-11-10 — Third original Module 2 topic: Problem Framing

**Original deficiency:** The old Problem Framing reading described symptoms and causes in two abstract paragraphs but did not demonstrate one present-state workflow, instrumented event chain, missing-data policy, falsifiable competing causes, source-executable calculation or a bounded problem statement. A novice could mistake a manager's suggested cause for an evidenced root cause.

**What changed, preserving existing IDs:** The ORIGINAL reading and practical remain capstone-problem-discovery-problem-framing-001 and capstone-problem-discovery-problem-framing-practice. The original reading now explains RECEIVED → DOCUMENTS_READY → SUPPLIER_ANSWERED → CLOSED with exception paths, owners and provenance, as well as symptoms, mechanisms, competing explanations and the unit/population of analysis. Two separate intermediate readings before the original practical now teach (1) lifecycle cohort, stage duration, missing and out-of-order event evidence and (2) causal uncertainty, scope, six-field problem statement and falsification. Two new reading IDs intentionally preserve all earlier progress IDs.

**Source-exact exercise:** professional-engineer-discovery-framing.ts publishes the Python 3 standard-library program and the exact learner-visible code block once. The entirely FICTIONAL nine-case handoff trace has six complete cases, two OPEN and one marked RESOLVED without evidence of closure. It must report COHORT complete=6/9 unverified=3/9, STAGES supplier_gt50=3/6 document_gt30=2/6, W03 document=40 supplier=10 total=60, W09 incomplete despite status, and X01 invalid chronology. It is a mechanism tutorial, NOT a real supplier incident, production SLO, population estimate or completed research.

**Failure oracles and practice:** scripts/check-professional-engineer-depth.mjs executes the exact published source and requires four incorrect variants to fail assertions: supplier wait incorrectly measured from intake, incomplete cases converted to zero-duration completed outcomes, reversed chronology accepted and total time attributed to document preparation. The original practical demands a current workflow with branches, alternative causes and disconfirming observations, ethical data-collection plan, exact nine-case proof, nontechnical options, and an improved customer outcome rather than a technology-first promise.

**Rendered target:** scripts/check-professional-engineer-browser.py traverses the original first reading, measurement reading, causal boundary reading and original practice with real Next transitions. It checks copyable code, 390px viewport, exact activity IDs and reload. The workflow path filter includes the new source. A successful matching-head run is REQUIRED before calling this technically verified; earlier green runs cannot establish acceptance of this batch.

**Still not established:** real authorized stakeholder or warranty data, causal identification, new-domain independent learner application or a live review. After this source pass, 3 of 10 original Module 2 topics have targeted remediation; seven later original topics, final discovery brief and Module 1 still need review. Keep #329 OPEN and draft PR #403 UNMERGED.


## 2026-11-10 — Fourth original Module 2 topic: Requirements

**Deficiency established against the original learner source.** The original Requirements reading named categories and encouraged acceptance criteria but did not explain how to derive a need from a falsifiable problem, distinguish stakeholder wishes from authorized obligations, define source/owner status, write observable positive AND forbidden-side-effect oracles, measure quality without fabricated service levels, manage conflicting interests or reverse a decision when its provenance changes. Its original practice was generic. Earlier green CI did not audit this original content in depth.

**Authored remediation:** the original requirements-001 reading and original requirements-practice ID remain exactly unchanged. Added three subject-specific learning stages in order:
- Existing original reading: derivation (harm → actor/outcome → source permission → candidate requirement → oracle → owner decision); business goals vs functional capabilities vs domain/data rules vs quality constraints; evidence and authority gating, worked BAD AI dashboard/50% vs candidate R-04/R-05 examples.
- New requirements-acceptance-reading: Given–When–Then allowed and forbidden cases, independent observable oracles checking response plus side effect/state, domain state transition rules, evidence-backed quality requirements, and exact Python 3 published source.
- New requirements-traceability-reading: reverse and forward graph from harm/source/requirement/acceptance/test/release; conflicts with unauthorized exposure, decision authority/dissent, change-impact propagation to tests/security/risk/operational decisions and deliberate DEFER.
- The existing requirements-practice now requires a six-row new-domain ledger, three traceable requirements, at least one allowed and one denied case, five original-program wrong mutants, a resolved/deferred conflict, and a change scenario demonstrating invalidated source/decision/test versions. Two additional intermediate reading IDs precede the original practice; no existing activity ID was renamed.

**Source and explicit wrong-implementation proof:** packages/runtime-kernel/src/paths/professional-engineer-discovery-requirements.ts publishes a self-contained exact Python 3 standard-library synthetic reviewer example and one copyable code block, not real organizational research or security assurance. Its fixture differentiates EVIDENCE_UNVERIFIED for claimed-only testimony, OWNER_UNCONFIRMED, UNTESTABLE, UNSAFE_NEGATIVE_PATH and REVIEWABLE_NOT_APPROVED (never actual approval), plus allowed and cross-owner denied access. scripts/check-professional-engineer-depth.mjs extracts precisely the displayed learner source and must reject five targeted source changes: ignoring provenance, accepting unconfirmed owners, bypassing measurable success, omitting denial oracle, and allowing access across records.

**Rendered browser target:** scripts/check-professional-engineer-browser.py navigates the original reading → acceptance reading → traceability reading → original practice through the actual Next action, checks source visibility/copy, 390px overflow, source-specific concepts, original activity identity and reload. The workflow trigger covers the new source file. **Do not claim matching-head CI green until the final HEAD run completes.**

**Evidence limits:** Synthetic booleans and same-owner predicates teach failure classification, NOT compliance with any real access policy, any deployed system's confidentiality, lawful data collection, independent human mastery or a stakeholder signoff. No production or actual research data were collected. If technical verification passes this is the fourth of ten original module-2 topics at targeted source depth. Constraints, Ambiguity, Quality Attributes, Risk, Success Measures/Evidence and Scope/non-goals remain, plus the original final brief and Module 1 Professional Practice. Keep issue #329 OPEN and PR #403 DRAFT/UNMERGED.


## 2026-11-10 — Fifth original Module 2 topic: Constraints

**Original learner-facing gap:** Constraints had two generic paragraphs and a PostgreSQL analogy, with no method for distinguishing lawful/contractually enforceable boundaries from an interviewee's preference, testing source currency and decision authority, quantifying capacity/budget, comparing multiple options under noncompensatory constraints, or resolving a jointly impossible constraint set. It risked teaching that a confidently stated law, chosen database or claimed timeline was automatically binding.

**Targeted source depth:** The original IDs capstone-problem-discovery-constraints-001 and capstone-problem-discovery-constraints-practice are preserved. The original reading now covers constraint vs requirement vs assumption vs architecture choice, legal/contractual source validity and interpretation, authority, scope, evidence age, hard/soft classification, fictional data-use agreement, budget, staffing and protocol boundaries. Two focused intermediate readings, before the original practical, separate:
1. capstone-problem-discovery-constraints-feasibility-reading: source/authority/applicability/binding checks, hard versus negotiable restrictions, quantified fictional budget/operations/protocol architecture matrix, exact runnable Python, eight wrong-inference source mutations and limitations of a green filter.
2. capstone-problem-discovery-constraints-conflict-revision-reading: mutually contradictory hard restrictions, no feasible solution, safe renegotiation, true cost of ownership, no unauthorized production integration, versioned changes of contracts/staffing and decisions that must be suspended/reconsidered.

**Actual original practice:** demands an eight-row independent new-domain constraint register with source versions, authority, applicability and verification; candidate architecture comparison and rejection reasons; execution of the exact Python 3 source plus eight negative mutants; conflicting data-export and supplier requirements; two subsequent changes (permission revoked and available operator capacity halved); downstream requirement/test/risk/architecture revalidation and a NO SOLUTION/DEFER/NARROW SCOPE decision if necessary. All original IDs remain stable; two new reading IDs are deliberate additional learning, not retroactive proof that someone mastered it.

**Source-exact classroom oracle:** professional-engineer-discovery-constraints.ts has a single Python 3 standard-library example displayed once in a code block. Five FICTIONAL source classifications: UNVERIFIED_SOURCE, AUTHORITY_UNCONFIRMED, NOT_APPLICABLE, NEGOTIABLE_PREFERENCE, BINDING_FOR_THIS_SCENARIO. Five FICTIONAL architecture outcomes: BLOCKED_DATA_EXPORT, BLOCKED_BUDGET, BLOCKED_OPERATOR_CAPACITY, BLOCKED_CONTRACT_PROTOCOL, FEASIBLE_NOT_APPROVED. Eight independently incorrect versions are required to fail assertions: skip source verification, authority, scope or negotiability; permit private-data export, overspend, unavailable operator staffing or protocol mismatch. This is a *reasoning tutorial*, NOT legal advice, a verified supplier contract, actual budget capacity or permission to deploy.

**Technical gate:** scripts/check-professional-engineer-depth.mjs extracts and executes the source-exact learner-visible Python, checks all 10 classifications and eight negative mutations, three subject-specific author-depth blocks and the original practice. scripts/check-professional-engineer-browser.py drives original 001 → feasibility → conflict/revision → original practice by real Next actions, verifies 390px no-overflow, source copy, distinct headings, expected practice and reload. Workflow triggers include the new file. At time of this authoring note the matching-HEAD CI result is not yet established: **do not call this technically accepted until green**.

**Remain open:** real contract and applicable law verification by appropriate owner, valid procurement source/cost, source-backed staffing and system integration, independent learner transfer, module-1 original lesson depth, five remaining original module-2 topics (Working with Ambiguity, Quality Attributes, Risk, Success Measures and Evidence, Scope and Non-goals), and the original final discovery brief. Draft PR #403 stays unmerged and issue #329 OPEN. Source tests do not substitute for field research or human validation.


## 2026-11-10 — Sixth original Module 2 topic: Working with Ambiguity

**Original gap:** the existing original Working with Ambiguity reading simply named assumptions, unknowns, confidence and investigation methods. It failed to explain ambiguity versus missing information versus stakeholder disagreement, the meaning of a confidence estimate, how to select a discriminating permitted experiment, whether a decision is genuinely reversible, how small probability shifts could reverse a design choice, or why an experiment's positive result does not automatically justify production. The original practical was a generic capstone discovery artifact exercise.

**Source-depth reconstruction:** the original IDs `capstone-problem-discovery-working-with-ambiguity-001` and paired `-practice` remain unchanged. The original reading now teaches the vocabulary and a six-entry evidence/ambiguity register with provenance, competing hypotheses, risk and decision cost; five false-clarity patterns and concrete warranty case counterexamples. TWO distinct, independently navigable readings precede its original practical:
- `...-sensitivity-reading`: explicitly fictional two-state utility calculations, baseline intake improvement 38 versus automation 36 at synthetic p=0.60, preference reversal at 0.70, the approximate 0.610 threshold, an EVPI ceiling of 48 NOT expected value of an actual imperfect study, and non-compensatory permission and harm gates.
- `...-experiment-design-reading`: targeted interviews vs event samples vs technical spikes vs experiments; authorization, sampling/confounding limits, independent measurements, stop rules, real rollback and irreversible side effects, owner, re-evaluation triggers and no-authority decisions.

**Executable learner evidence, never field research:** `professional-engineer-discovery-ambiguity.ts` publishes one exact Python 3 standard-library program using rational Fraction arithmetic. The example calculates assumption-sensitive action rankings and a maximum theoretical value of perfect information, then explicitly blocks unauthorized/unsafe research and a study costing at or above its hypothetical information ceiling. The script warns probabilities and payoff magnitudes are NOT measured. `scripts/check-professional-engineer-depth.mjs` extracts the identical source text rendered in the lesson and requires eight wrong-source mutations to fail actual Python assertions: flipped probability weighting, removed downside, fixed leader, falsely stable ranking, incorrect perfect-information ceiling, research without authority, research despite harm, and ignored study-cost ceiling. These are algorithmic tests, NOT empirical probability calibration or an actual research approval.

**The original paired practice** demands a new-domain uncertainty register, actual unknown-versus-assumption classification, source-exact Python results and eight unsafe mutants, competing explanations and a falsifiable study, actual authorized permission boundary and stop/rollback, reversal of a costly-to-reverse decision after permission revocation or conflicting results, and an explicit DEFER/NO_AUTHORIZATION decision when evidence is unavailable. Two new reading IDs do not rename any historic progress ID or attest to learner completion.

**Rendered verification target:** browser test follows the original reading → sensitivity → authorized experiment design → original practice via real Next actions, 390px no-overflow, visible copyable source, stage-specific reading depth, original practice and reload. The CI workflow path trigger includes the new authored source file. **All this is an authored-source checkpoint until a matching-final-HEAD full CI run is COMPLETED SUCCESS.** No source-only assertion can substitute for real learner transfer.

**Backlog and honesty limits:** This is the sixth of TEN original Module 2 topics to receive targeted content remediations, subject to final technical verification. Following original topics: Quality Attributes, Risk, Success Measures and Evidence, Scope and Non-goals (4 remaining), plus the original final discovery brief and module 1 Professional Practice. Neither the classroom probabilities, fictional warranty stakeholders, invented payoffs, fieldwork permissions nor synthetic browser progress constitute actual research, legal authorization, an independently assessed capstone or proven human learning. Keep #329 OPEN and draft PR #403 UNMERGED.


## 2026-11-10 — Seventh original Module 2 topic: Quality Attributes

**Original learner-source deficiency:** two short paragraphs enumerated reliability/security/performance/scalability etc. and mentioned scenario-based qualities and trade-offs but never taught an actual quality-attribute scenario, legitimate source and signoff, how an observable metric differs from a product slogan, how a sample denominator distorts p95 or availability, how to prove denied access and no state mutation, how RTO differs from RPO, or how a privacy/consistency/operability conflict should change an engineering decision. This left a learner at risk of assuming technology or a green unit test proves real quality.

**Preserved activity identity and new focused readings:** original `capstone-problem-discovery-quality-attributes-001` and `capstone-problem-discovery-quality-attributes-practice` IDs remain unchanged. The original reading is now substantive: attribute vs functional capability, availability vs reliability vs resilience vs recoverability, stimulus-environment-response-measure scenario definition, quality provenance/authority and five failure counterexamples. Two separate new readings, positioned before the original practice, teach:
- `...-measurement-reading`: conditional nearest-rank p95 vs max vs incomplete observations, legitimate sample definition, fictitious RTO/RPO calculations, forbidden-access/forbidden-side-effect oracles, verified restore and eight negative source mutants. Includes a complete copyable Python 3 example that is identical to the test runner's source string.
- `...-tradeoffs-reading`: useful availability vs correctness, stale statuses after partial failure, protected audit trail vs excessive PII, scalability vs cost and real human operability, explicit matrix with noncompensatory privacy/authorization gates, versioned decisions, and independent new-domain transfer.

**Published exact-source Python 3 evidence fixture:** `professional-engineer-discovery-quality-attributes.ts` uses entirely FICTIONAL 20 complete successful status durations: sixteen 100-ms events and four 180/220/250/780-ms events. Nearest-rank p95=250 ms but worst case=780 ms; threshold 300 ms is NOT an approved SLO. A small/unfinished cohort must be rejected, as must unauthorized record exposure/mutation, absent restore proof, fictional recovery time >45m, point-loss >15m and a 21-case p95 tail breach. Fictional minute timeline last backup=12, failure=20, verified restoration=50 yields observed classroom RTO=30m and potential RPO=8m. Best state is REVIEWABLE_NOT_APPROVED, never deploy-approved. The fixture teaches why a reachable endpoint and a passing latency statistic do not demonstrate user correctness, actual authorization, a genuine restore, statistical coverage, production SLO or customer acceptance.

**Negative source-proof tests:** `scripts/check-professional-engineer-depth.mjs` extracts the exact learner-visible Python (single canonical source string); it must reject EIGHT deliberately wrong source changes with actual Python AssertionError: percentile replaced by median, tiny cohort accepted, incomplete records normalized away, unauthorized disclosure accepted, restore integrity ignored, RTO miss ignored, RPO miss ignored, tail latency breach accepted. It also checks original source wiring, three authored subject-specific sections and preserved practical.

**Original practical, now rigorous:** requires six NEW-domain quality scenarios (privacy/authorization, real p95+load, degraded dependency, verified recovery/data loss, accessible task outcome and operator maintenance), exact published code + eight unsafe-mutant evidence, handling of failed/unknown observations, conflicting quality tradeoffs with at least two adverse effects, owner-approved source/threshold status, and impact when a privacy field becomes forbidden or the operations team loses capacity. Real thresholds remain THRESHOLD_PENDING unless signed off by a competent owner. The learner must be free to conclude DEFER/NARROW_SCOPE rather than inventing a green architecture.

**Rendered gate:** `scripts/check-professional-engineer-browser.py` traverses original Quality Attributes → measurement → tradeoffs → original practice via the actual Next control, checks headings/full rendered prose, exact copyable code, 390px layout without overflow, preserved activity URL and browser reload. The workflow path filter includes the new file. **Do not call this technically verified until an exact-final-HEAD CI run is green.**

**Evidence still absent:** actual workload observations, production privacy verification, a correctly approved SLO, an observed incident/restore, real UX/accessibility task trials, operations staffing, uncoached learner application, independent assessors. This is the seventh of ten original module-2 topics with authored targeted source-depth work, pending CI verification. Original topics still to reconstruct: Risk, Success Measures and Evidence, Scope and Non-goals (three), plus the original final discovery brief and Module 1 original Professional Practice. Keep #329 OPEN; #403 DRAFT and UNMERGED.


## 2026-11-10 — Eighth original Module 2 topic: Risk

**Original learner gap:** the original Risk reading had two generic paragraphs listing risk categories and register fields. It did not define a credible cause → uncertain failure event → affected actor/harm mechanism, distinguish a live issue from future exposure, quantify the limitations of likelihood × consequence heatmaps, show concrete prevention vs detection vs recovery, demonstrate a testable harmful side effect, or teach what evidence and competent authority can accept residual exposure. Existing generic practical could be completed with six adjectives and no verifiable control.

**Original IDs preserved:** `capstone-problem-discovery-risk-001` and `capstone-problem-discovery-risk-practice` are unchanged. The first original reading is expanded with real explanations of risk vs incident/issue vs threat/vulnerability/hazard, credible causal chains in a FICTIONAL warranty-return handoff, confidence without made-up numeric probabilities, and an evidence/scope/owner/source/monitoring-based register. Two separate focused readings now precede original practical:
- `capstone-problem-discovery-risk-controls-reading`: prevention, independent detection and recovery; explicit duplicate-event idempotency oracle; source/control/authority checks; exact runnable Python fixture; nine unsafe mutations.
- `capstone-problem-discovery-risk-residual-decisions-reading`: residual risk even after a tested control, shared causal dependencies, mitigations that introduce worse hazards, real acceptance authority and noncompensatory privacy stop conditions, reversible decisions and genuinely independent domain transfer.

**Source-exact standard-library Python proof:** `professional-engineer-discovery-risk.ts` publishes a single executable Python code block. Synthetic classroom states distinguish ESCALATE_EXISTING_INCIDENT, FAILURE_PATH_UNDEFINED, SOURCE_NOT_VERIFIED, RISK_OWNER_MISSING, STOP_PROHIBITED_DATA_EXPOSURE, CONTROL_NOT_IMPLEMENTED, CONTROL_EFFECT_UNVERIFIED, RESIDUAL_RISK_NOT_ACCEPTED and REVIEWABLE_NOT_PRODUCTION_APPROVED (never real approval). The same exact script executes three deliveries of event W-09 into a toy in-memory handler, requiring exactly **one** recorded closure side effect. This illustrates a narrow negative observable outcome but does NOT cover real transactional storage, concurrent retries, source authorization, signed risk ownership or deployment.

**Nine independent unsafe mutations:** `scripts/check-professional-engineer-depth.mjs` extracts the exact literal learner-visible code and requires actual Python AssertionError for ignoring an existing incident, undefined causal path, unverified evidence, missing owner, forbidden data exposure, planned/not-implemented control, untested control, unsigned residual decision and suppressed duplicate-event detection. The source checker also enforces actual teaching depth, original ID/practice wiring and ordering.

**Original paired practice:** now requires six new-domain risk/issue entries (including active incident escalation, forbidden permission boundary, supplier risk, duplicate state, operator/restore and adoption harm), explicit causal mechanisms and permissible evidence, prevention/detection/recovery with separate forbidden-side-effect tests, the source-exact output and all nine mutations, residual ownership and monitored revalidation. Two change events force reconsideration: a mitigation copies forbidden private data and the external supplier reuses event IDs. The learner may conclude BLOCK/DEFER/ESCALATE, never fictional approval.

**Browser gate:** `scripts/check-professional-engineer-browser.py` follows original Risk → controls → residual decisions → original practice via actual Next controls, checks rendered subject-specific paragraphs, copied exact Python, 390px overflow, stable original activity IDs and practice reload; the workflow watches the new Risk source. **This is authored work until a matching-final-HEAD GitHub Actions workflow COMPLETED SUCCESS.**

**Honesty and backlog:** the eighth of TEN original module-2 topics has targeted authored source-depth remediation, subject to final CI. Next: Success Measures and Evidence; Scope and Non-goals; then the original final discovery brief and Module 1 original source. No classroom event, program output or draft risk acceptance establishes actual probabilities, incident history, legal/contractual permission, production idempotency, empirical harm, authorized field research, uncoached learner mastery or external assessment. PR #403 remains DRAFT/UNMERGED and issue #329 OPEN.
