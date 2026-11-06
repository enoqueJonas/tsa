# PED-005 — Evidence-led learner-depth re-audit, Delivery Engineer Configuration Management

**Audit entry:** 2026-11-06. **Baseline:** `master` `bed6363564e53841b3349ba77f10c39cf1468a56`. **PR scope:** first complete module-level re-audit in Delivery Engineer; DO NOT mark Reliability or Quality learner-validated from this work. Related school issues: [Delivery #325](https://github.com/enoqueJonas/tsa/issues/325), [Reliability #327](https://github.com/enoqueJonas/tsa/issues/327), [Quality #328](https://github.com/enoqueJonas/tsa/issues/328), depth standard [#318](https://github.com/enoqueJonas/tsa/issues/318).

## Why this module was selected

The existing Delivery Engineer source audit covers all eleven paths, with a real Ansible localhost role demonstration in the original *Roles Concepts* reading. But the actual learner-visible example has not been executed in CI, the earlier **Configuration Drift**, **Inventories**, and **Playbooks** conceptual readings compressed several distinct mechanisms into approximately two explanatory paragraphs, and no independent learner had demonstrated what the playbook could or could not prove. These are factual source-level gaps, not evidence that every Delivery module is weak.

### Original learner activity audit

| Original reading ID | Before: specific instructional gap | Remediation in actual original source | Evidence |
| --- | --- | --- | --- |
| `configuration-management-drift-001` | Description + examples of drift; no trace from versioned desired state to observed state, nor permission-based diagnosis | Define desired/observed/approved exception, nonprivileged file-mode example, diagnosis before repair, unintended outage possibility | 390px rendered heading; independent explanation still pending |
| `configuration-management-desired-state-001` | Real DNF example, second-run concept and caveat already provided, but no source-executed local run | Preserve source and prerequisites; source-execute concrete state-aware Ansible file example later in module | Ansible role exact-source test; real Rocky/DNF remains unverified |
| `configuration-management-ansible-fundamentals-001` | Correct localhost control-node ping, local-vs-SSH and privilege distinctions already covered | Preserve actual original ID and early prerequisite order | Existing learner code; real remote SSH and privileged host unverified |
| `configuration-management-inventories-001` | Named group/host example without full targeting resolution, effective variable scope and no-target diagnosis | Explain host aliases vs addresses, groups/children, selection, variable ownership, and safe `ansible-inventory --graph/--host` observations | 390px rendered heading; remote target not invented |
| `configuration-management-playbooks-001` | Short playbook and handler list; missing task/module result, changed, check mode and empty-target analysis | Trace play→task→module→result→handler, check mode and nonmutation, explicit verification beyond green recap | 390px rendered heading and copyable source |
| `configuration-management-roles-001` | Real-looking first/second/drift role, but expected observations never executed in targeted CI and no check-mode nonmutation | Same actual original role source updated with safe `--check` prediction, absence test and genuine repair; exact learner source is extracted from TypeScript and executed | New GitHub Actions pinned `ansible-core`, with three negative mutants |
| `configuration-management-lab-automate-steward-servers-with-ansible-001/002` | Strong but environment-dependent Rocky/Steward milestone; no actual learner host, Docker, or secret boundary verified | Preserve original practicum and reflection without fabricating infrastructure; require distinct real-host gate | **NOT TESTED**, unless real learner demonstrates permitted homelab |

**Research map:** [Ansible documentation: the file module](https://docs.ansible.com/projects/ansible-core/2.21/collections/ansible/builtin/file_module.html) (examined module check-mode support and actual observed state); [Ansible check/diff mode](https://docs.ansible.com/projects/ansible-core/devel/playbook_guide/playbooks_checkmode.html) (examined dry-run semantics, unsupported tasks and conditional limitations); [Ansible release and support matrix](https://docs.ansible.com/projects/ansible/latest/reference_appendices/release_and_maintenance.html) (2.21 on Python 3.12). These were consulted as documentation references, not executed external platforms. Additional multimedia deep-dive and secondary chapter review remain an authoring checkpoint, not falsely marked completed.

## Executable exact-source acceptance

`node scripts/check-delivery-ansible-local-state.mjs` extracts the **literal code shown in the existing original Roles reading**, runs it from a fresh temporary directory through real Ansible and validates:

1. first run reports changed=1 and creates isolated directory with 0755 policy;
2. second unchanged run reports changed=0;
3. after controlled deletion, check mode **predicts changed=1 without restoring anything**, proven by `test ! -e lab-state`;
4. the next actual run repairs the drift (changed=1) and leaves 0755 directory;
5. mutation 1 removes `--check`: published absence assertion must fail;
6. mutation 2 changes declared 0755 to permissive 0777: Ansible itself stays green, but the **independent file-mode oracle** rejects it;
7. mutation 3 changes the module name to nonexistent: execution fails nonzero and cannot create the directory.

This is **real localhost Ansible file-module execution** in a temporary workspace, **not** proof of Rocky remote SSH, enterprise access, Ansible DNF, real Steward configuration or a learner's independent skill.

`scripts/check-delivery-ansible-browser.py` navigates the actual Delivery school to its sixth module, inspects the original drift/inventory/playbook/role readings, code-copy controls, 390px width and page reload. A rendered source check does **not** establish the learner comprehends the mechanisms.

## Assessor exercise design — illustrative published example, NOT an unseen examination

The following scenario is a **published assessor-design illustration**, not a genuinely unseen examination, because learners can read this audit. A real reviewer must privately compose a materially different new-domain problem AFTER learning, without supplying a model playbook, code, hidden hints or rehearsal prompts.

> A second independent reporting worker must run on a different machine from the Steward API. It writes local reports to a private application directory and must not be given the API host's firewall policy or database credentials. An operator has changed the worker directory to world-readable permissions. A second worker may be added later. Propose an inventory and one bounded Ansible role that establishes the directory's intended `0700` mode, proves unchanged reruns, detects/repairs deliberately induced drift, refuses to affect the API host, and has a safe STOP if target or privilege assumptions are wrong. You may use a disposable localhost stand-in, but must state what remains unverified on real SSH hosts.

**Uncoached 0–2 rubric (target 8/10, with no zero for state safety or evidence):**

- **Conceptual explanation:** can distinguish desired from observed state, legitimate host differences and accidental drift;
- **Correct targeting and privilege:** demonstrates resolved group/host selection without unintended API host changes or implicit privilege escalation;
- **State safety and failure:** actual first/second/check/repair evidence, file mode and a no-op/incorrect-target or invalid-module negative;
- **Source-derived evidence:** commands, logs, target environment, actual outputs and independent file inspection, not a screenshot alone;
- **Diagnosis and transfer:** explains why check-mode/green run cannot prove correctness, handles an unseen target/group constraint, states remote SSH/production limits.

**Assessment conditions:** A reviewer not involved in authoring the solution observes unaided work, records name/date, source revision, commands, misconceptions and scoring. The reviewer may offer clarifications but records every hint. If the candidate cannot succeed without hints, remediate the relevant exact lesson and test a different unseen variant. With no real assessor, report **NOT INDEPENDENTLY VALIDATED**, regardless of CI.

## Cross-school triage — not an all-school re-audit

- **Delivery:** module 6 demonstrated a concrete gap in first-principles teaching plus missing actual-source execution; remediated/technically testable here. The other ten Delivery paths remain previously source-remediated, **not** newly novice-validated.
- **Reliability:** sampling `reliability-incident-management-deep.ts` finds eleven original incident skills, several relying on concise principle lists and generic scenario instructions. Source `reliability-investigation-proofs.ts` supplies targeted dated timeline/root-cause programs, not an independently observed incident commander/communication handoff. **Candidate next after Delivery module closes:** incident roles/communications drills under a bounded simulated outage, check whether the learner can separate observation and causal explanation. Real Graylog/Prometheus/lived incidents still outstanding.
- **Quality:** sampling `quality-test-analysis-design-deep.ts` shows the prior re-audit executed representative boundary, equivalence/partition, state, and oracle code with negative mutants; source `quality-experiential-depth-v6.ts` includes actual controlled browser defects. The remaining high-value unresolved claim is **uncoached requirement→novel test design and fault diagnosis** against a *different* contract, not another overlay on the same worked example. No candidate's real transfer has yet been assessed. School #328 remains open.

**Disposition:** focus on Delivery one module at a time; do not retitle the other two schools as completed or count CI output as third-party learner competence. School-wide work must not be closed solely on this module's evidence.


## Additional Delivery module reviewed — Containers and Docker (canonical path 3)

The existing 15 original Docker concepts are registered in `delivery-containers-docker-deep.ts` and acquire module-specific practicals in `delivery-containers-docker-quality.ts`. Crucially, `delivery-docker-operational-depth.ts` already supplements actual original lessons with deeper worked container/runtime/registry reasoning: namespaces versus cgroups, Docker client/daemon trust and registry digests. These should **not be mechanically rewritten again** simply because their base paragraphs are short. However, the source-published BusyBox evidence originally remained unexecuted by the school audit, so the existing example did not prove that the exact command or the observation contract worked.

**New runtime source check:** `node scripts/check-delivery-docker-runtime.mjs` parses the exact learner-shown Bash block under *Guided observable inspection with a disposable container*, then uses an actual Docker Engine on the CI runner. It observes the real container PID, separate host PID, Linux cgroup-v2 `memory.max` for `--memory=64m` (expected **67108864 bytes**), and cleanup of the temporary detached container. Three wrong implementations must be detected:
- `--memory=128m` (green process, but **134217728 bytes**, not the required limit);
- `--memory=0` (no specified finite 64 MiB limit);
- inspecting `tsa-not-the-lab` (nonzero Docker failure, not proof of the intended container).

The source expressly relies on published `busybox:1.36` and network access to pull it. CI must not silently replace a failed pull with claimed execution. Docker daemon version, host kernel, runtime permission and cross-platform cgroup v1 differences are real boundary constraints; the test deliberately restricts its executable cgroup oracle to a Linux cgroup-v2 runner. This evidence **does not** establish a Rocky Linux homelab, Proxmox, production security boundary, registry digest immutability, real Steward image or human understanding. The example uses a mutable teaching tag, not an approved supply-chain artifact.

The targeted real-Chrome traversal now includes original Docker *Namespaces and cgroups*, *Architecture*, and *Registries* readings at 390px with relevant worked headings and copyable code, in addition to the completed Ansible module review. Earlier Delivery source audit covers the other original Docker topics, which remain outside new independent human validation.

**Current CI status:** the Docker-specific matching-head job must pass before updating this to TECHNICALLY VERIFIED. This remains a bounded second Delivery module review, not confirmation that all 11 paths or the other two schools have reached real learner acceptance.


## Third Delivery module review — Continuous Integration (canonical module 4)

**Entry:** 2026-11-06. **Audit decision:** preserve eight original CI lessons with sufficiently specific earlier mechanism, threat-boundary and negative-case enrichments rather than mechanically rewrite them; repair five concrete original-lesson gaps that still lacked worked artifacts and real negative-contract evidence. All original lesson IDs, reading IDs, practicals and final three lab activities remain stable.

The author-source inventory `packages/runtime-kernel/src/paths/delivery-continuous-integration-deep.ts` defines **13 original concept readings** in learner order, backed by `delivery-continuous-integration-quality.ts` for genuine independent practicals. Original `jobs-stages` already included a local Python dependency gate in `delivery-ci-dependency-worked.ts`, but it only reasoned about statuses—not actual GitLab YAML, separate workspaces or artifact transfer. The other source had short primers for caching, artifacts, quality gates and image identity. The prior `delivery-ci-operational-depth.ts` genuinely deepened the other eight original subjects (architecture, runners, GitHub-vs-GitLab, self-hosted runners, secrets, parallelism, automated checks and test stages); do not call those nonexistent or rewrite them merely to increase length.

### Concrete original-reading fixes and failure mode

| Original reading ID | Missing before | Teaching change in original lesson | Observable evidence |
| --- | --- | --- | --- |
| `continuous-integration-jobs-stages-001` | Python status-model only; vague `needs` versus stage ordering, no actual artifact boundary | Define stage/needs eligibility and missing-edge bypass, required vs optional jobs, transfer versus authority; publish a real *illustrative* GitLab YAML with **four short Python jobs** and exact manifest handoff, followed by negative exploration | Exact published YAML parsed and actual job scripts executed locally; missing mandatory edge, missing artifact and allow-failure negatives |
| `continuous-integration-caching-001` | Cache treated as speed without demonstrated source-of-truth boundary | Cache key/trust scope, cold-cache and poisoned-cache failure cases, reproducibility and independent checksum transfer | Controlled independent future cache experiment; no simulated cache backend claimed |
| `continuous-integration-artifacts-001` | Conceptual contrast but not exact consumed bytes and diagnostic retention | Producer output versus cache; manifest M tied to commit C and copied to independent consumer; `artifacts:when: always` retains diagnostics without allowing a failing gate through | Local manifest equality, missing-artifact negative and original lesson 390px rendering |
| `continuous-integration-quality-gates-001` | Broad 'risk-based gates', unclear FAIL/BLOCKED/NOT_RUN authority | Actual nonzero outcome and stopped candidate, waiver versus technical truth; `allow_failure` and `when: always` dangers | Deliberate missing-needs and waived-gate mutations rejected by local proof |
| `continuous-integration-container-build-001` | Image digest and tag conflation risk, original build YAML omits proof of pushing or running | Commit C vs tag, local image ID, registry manifest D, platform-specific image identity and promotion/runtime gate | Independent actual real-Steward registry digest evidence remains NOT_TESTED |

**Instructional detail:** 15 new topic-specific mechanism / failure / transfer sections in `delivery-ci-learner-mechanisms.ts`, integrated directly into their original `rich()` reading factory, rather than prep wrappers. The GitLab-specific resource hierarchy now puts authoritative GitLab documentation first (prior default was GitHub Actions comparison docs), and each relevant topic has a targeted reference.

### Actual source-derived local pipeline exercise

`delivery-ci-dependency-worked.ts` now publishes `ciGitlabCandidateYaml` verbatim as a copyable lesson code block. It models four jobs, `fixture_check`, `unit_test`, `candidate_manifest`, and `candidate_audit`, in stages `verify`, `build`, and `inspect`. The jobs use ordinary shell-invoked Python scripts and one temporary `candidate.txt` bound to a synthetic SHA; **no Docker build, push, real GitLab Runner, protected secret, deployment, CI Lint endpoint or customer data is claimed**.

`python3 scripts/check-delivery-ci-yaml.py` extracts the **literal actual published YAML string**, parses it with PyYAML, verifies the required job graph and executes the actual published job shell scripts in **separate disposable workspaces**, transferring only declared artifacts. The checker asserts:

1. Green case: both checks pass; manifest is created and copied; consumer independently verifies the exact SHA.
2. Negative required unit failure: the unit job exits nonzero; candidate production and downstream audit are **BLOCKED**.
3. Wrong graph mutant removes the `unit_test` `needs` edge: the unit script still FAILS but candidate creation and audit incorrectly PASS. The required-edge oracle rejects the unsafe configuration.
4. Wrong artifact mutant sets `artifacts: false` for the consumer: previous build passes but the candidate audit cannot read the artifact and **FAILS**.
5. Wrong `allow_failure: true` mutant on the required unit job: the mandatory-gate contract rejects the waiver.
6. The existing `ciDependencyPython` original example remains tested separately through `node scripts/check-delivery-ci-dependency.mjs`, including its failure status 17.

The source checker implements an intentionally **limited local DAG executor**. It does NOT reproduce GitLab's entire stage, `rules`, manual-job, trigger, permission, artifact-retention or credential semantics; the learner must separately execute a safe negative pipeline in the real authorized homelab GitLab to validate those assumptions. Do not promote source-Python graph success to a verified pipeline deployment.

### Browser evidence and independent assessment

`scripts/check-delivery-ansible-browser.py` has been extended to traverse **all 13 original CI reading IDs** in the fourth Delivery module, assert distinct mechanism headings and genuine rendered content, inspect actual copyable code/YAML, check **390px** overflow on every original reading, and reload the current module. The Ansible module and Docker checks remain in the same browser script. This verifies UI operation, not a novice's explanation or independently built GitLab project.

**Illustrative reviewer-only design pattern (published, NOT an actual unseen task):** a hypothetical assessor changes the authorization rules: an additional security-check job is mandatory for *every* candidate, but one branch's `rules` omit the security job. Without seeing a model solution, the learner must (a) explain why a plain `needs` on that possibly missing job can prevent pipeline creation; (b) reject setting `optional: true` merely to hide a missing security gate; (c) redesign `rules` and `needs` so every permitted candidate has a real performed test; (d) run a failing check in a real authorized GitLab and show no image publication, no privileged secret exposure and the exact tested source SHA; (e) mark GitLab/Runner controls NOT_TESTED if unavailable. Reviewer scores conceptual prediction, fail-closed DAG, artifact identity, actual negative evidence and trust/authority boundary, 0–2 each; target at least 8/10 with no zero for fail-closed DAG or evidence. No outside reviewer has scored this yet. A genuine assessment must use a different, private and unpractised variation chosen by the reviewer; the scenario printed above is a rehearsal example and cannot be counted as a surprise.

### Research and evidence provenance

- **Official GitLab job graph:** [`needs` guide](https://docs.gitlab.com/ci/yaml/needs/) — verified current semantics including bypassing stage waits, optional dependency interaction, and failure on missing required jobs.
- **Official artifact reference:** [GitLab job artifacts](https://docs.gitlab.com/ci/jobs/job_artifacts/) — exact job-output versus temporary cache versus versioned release boundary, including retention and `when` behavior.
- **Official cache reference:** [GitLab caching](https://docs.gitlab.com/ci/caching/) — key scope and cache-versus-artifact semantics.
- **Official job eligibility:** [GitLab `rules`](https://docs.gitlab.com/ci/jobs/job_rules/) — risks of duplicate pipelines and permission/eligibility interactions.
- **Substantive article:** [GitLab's stage and DAG walkthrough](https://about.gitlab.com/blog/basics-of-gitlab-ci-updated/) — concrete example of `needs` relaxing implicit stage order and reasons to choose job independence deliberately.
- **Optional video outline inspected, not watched:** [Moss GitLab CI/CD Pipeline Tutorial](https://www.youtube.com/watch?v=mnYbOrj-hLY) — public outline covers stages/jobs (~07:36), artifacts (~11:08), runner settings (~30:16) and caching (~31:59); its correctness and video contents were NOT independently verified from playback, and essential instruction is supplied in TSA itself.

### Module-4 acceptance status

Author-source reconstruction is complete for the five identified gaps; all thirteen readings remain in the expected learner sequence. Source-derived Python/YAML/unsafe-mutant CI and rendered Chrome/full build must pass on the exact **latest** PR head before TECHNICALLY VERIFIED can be claimed. Full GitLab runner, registry, protected variable, user-owned Steward homelab and uncoached novice gate are NOT TESTED; learner validation remains open.


## Fourth Delivery module review — Continuous Delivery and Deployment (canonical module 5)

**Review date:** 2026-11-06. The original `delivery-continuous-delivery-deep.ts` contains exactly **ten named concept readings** in preserved sequence, with corresponding practicals in `delivery-continuous-delivery-quality.ts` and original final four-part lab `continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback-001` through `-004`. The previous `delivery-cd-operational-depth.ts` already taught CI/continuous-delivery/deployment distinctions, environment boundaries, ordered automation, approvals and rolling replacement with worked failures, so indiscriminate rewriting of those five would reduce clarity rather than enhance it. The remaining migration, rollback, blue-green, canary and flags concepts had some useful examples but lacked independently executable and falsifiable evidence.

### Real source-first lesson repairs

| Original lesson reading | Instructional gap and correction | Executable learner evidence |
| --- | --- | --- |
| `continuous-delivery-deployment-ci-cd-cd-001` | Existing robust distinction between integration, releasable candidate and automatic deployment, plus two contrasting learner scenarios; **preserved** | New final lab still requires real source-to-image and running-service comparison; no fictional deployment |
| `continuous-delivery-deployment-environment-management-001` | Existing deployment environment as artifact/config/data/secrets/trust boundary; **preserved** | Actual learner environment contract remains unverified without owned homelab |
| `continuous-delivery-deployment-deployment-automation-001` | Existing ordered stage/negative branch and fail-closed automation explanation; **preserved** | Actual image/roles deployment not inferred from a local simulator |
| `continuous-delivery-deployment-release-approvals-001` | Strong prior digest-bound approval but tier assumptions not explicit; **added** current GitLab tier/approval caveat, exact digest+environment executable source gate | `promotion_identity.py` rejects digest drift, target drift and fake approval from an authorized actor alone |
| `continuous-delivery-deployment-database-migrations-001` | Before: broad expand-and-contract narrative; now schema contract across API and workers, compatibility matrix, backfill failure/locking and point of no return | `migration_compatibility.py` runs real disposable SQLite expansion with both readers, then contracts `status`, proves the new `custody_state` reader STILL works and observes the legacy old-reader failure. **NOT real Django/Postgres migration** |
| `continuous-delivery-deployment-rollback-001` | Before: correct high-level warnings; now identify code, migration/data, event and worker versions separately, choose STOP or forward repair instead of blind image revert | `rollback_decision.py` classifies schema failure, missing evidence and irreversible effects, rejecting the digest-only false green |
| `continuous-delivery-deployment-rolling-deployments-001` | Existing deeper mechanism for readiness, multiple replaceable instances, mixed event versions and lack of single-node availability; **preserved** | Real multi-instance platform remains NOT_TESTED |
| `continuous-delivery-deployment-blue-green-001` | Before: narrative traffic-switch/HTTP warnings, no real target. Now two-color Docker mechanism, actual loopback image+HTTP exercise, shared-state trap, capacity/compatibility limits | `blue_green_local.sh` builds two different BusyBox images, probes both, gets HTTP 200 from an intentionally broken B, refuses client route to B and leaves active A in a disposable local-only exercise |
| `continuous-delivery-deployment-canary-001` | Before: warnings that 5% of scarce traffic is weak evidence; now sample bias, matching routes, critical invariants, finite window and off-ramp/side-effect limits | `canary_evidence.py` distinguishes tiny zero-error set, missing critical writes, observed violation and eligible **illustrative** sample; thresholds are NOT real statistical SLO |
| `continuous-delivery-deployment-feature-flags-001` | Before: deployed-dark/flag removal concept; now mutable operational authority, provider failure/mixed code, unrolled side effects and server authorization distinction | `flagged_side_effects.py` proves already emitted events remain after turning off the flag; never treats flag-off as data rollback |

Five remaining original readings receive **15 full new mechanism/failure/alternative sections** via `delivery-cd-learner-mechanisms.ts`, integrated into the exact original lesson source. The sixth executable example is added in the already deepened Release Approvals reading, and relevant original practical instructions explicitly distinguish executing fixtures from real system claims. Original IDs, workbooks, complete final exercise and level ordering remain unchanged.

### Exact-source executed checks and unsafe mutants

The actual reading factory renders the **unmodified** learner-source programs from `delivery-cd-proofs.ts`. `scripts/check-delivery-cd-proofs.mjs` parses those literal published source strings and executes them, not a separately rewritten model:

1. **SQLite expand/contract:** old reader works during additive expansion; the NEW replacement-field query survives contraction and the old SELECT breaks after deliberate column removal. A mutant that omits the contract change must be rejected.
2. **Rollback decision:** candidate only when image identified, owner authorized, prior schema compatible and effects reconciled. Mutant bypassing schema guard must be rejected.
3. **Canary evidence:** 10 zero-error requests and insufficient write coverage are NOT_ENOUGH_EVIDENCE; observed integrity violation is STOP. Mutant bypassing sample floor must be rejected.
4. **Flag lifecycle:** disabling the path stops new executions but does not retract recorded events. Mutant ignoring flag state must be rejected.
5. **Approval:** recorded digest and target must match; changing approved bytes must block. Mutant bypassing identity check must be rejected.
6. **Actual Docker local blue-green:** two separately built BusyBox images, host ports bound to `127.0.0.1` (not 0.0.0.0), direct HTTP 200 with different body markers, real separate Docker image IDs; active client route variable remains on A after rejecting broken B. Two unsafe source mutants (route erroneously selects broken B, or absent broken-B evidence) must fail. The shell owns/tears down its own containers, images and temporary workspace using an exit trap. No public port, production proxy, real registry, GitLab, persistent database, CI artifact digest or real Steward deployment is touched.

**Risk of teaching by simulation:** A meaningful local proof establishes a narrow mechanism and can reject a bad candidate decision. It cannot establish a real published image digest, authorized production deployment, runbook/rollback, PostgreSQL concurrency/locking, true canary confidence, a flag-service rollout or a real independent learner's skill. Source publication is not learner validation.

### Browser and independent assessment

The existing real-Chrome Delivery browser test traverses **all 10 original CD reading IDs at 390px**, inspects the right mechanism heading and six copyable code blocks, then traverses **all four original final lab IDs** and verifies reentry after reload. Previous CI, Docker and Configuration Management browser/source tests must remain green. The full 38-test curriculum suite, production build, strict audit and matching-head workflows must all pass before calling this module technically verified.

An independent reviewer (not the author) must privately choose a **different new-domain release** after study, not use the published example. The learner must defend immutable candidate identity, at least one safe/unsafe migration window, authorized promotion, a validated failed deployment, post-rollback behavior across all workers, and a justified decision between direct/rolling/blue-green/canary/flags under a new constraint. Score five dimensions 0–2 each, minimum 8/10 and no zero on destructive-data safety or real evidence. If actual Docker/GitLab/Postgres are absent, the learner should say NOT_TESTED and propose a safe experiment rather than manufacture evidence. The private unseen exercise and real human review are **NOT PERFORMED**.

### Current status

All source edits and regression/browser gates are staged on the Delivery draft branch; only exact-head CI can establish technical verification. Real GitLab protected-environment approvals are tier-gated and cannot be assumed on the learner's self-managed plan: consult [GitLab deployment approvals](https://docs.gitlab.com/ci/environments/deployment_approvals/) and [protected environments](https://docs.gitlab.com/ci/environments/protected_environments/). Docker localhost port publishing follows [Docker run reference](https://docs.docker.com/reference/cli/docker/container/run/). No live external deployment or human assessment has been performed. **Four targeted Delivery modules reviewed out of eleven; Reliability and Quality issues remain separate.**


## Fifth Delivery module review — Release Engineering (canonical module 7)

**Entry 2026-11-06.** This review covers the **ENTIRE Release Engineering module** (canonical path 7, following Configuration Management path 6). The original source `delivery-release-engineering-deep.ts` defines six authored core reading lessons, each with original reading `-001` and practice `-002`, followed by the original **four-part** `release-engineering-steward-release-lab-001` through `-004` and final `release-engineering-module-review-001`. All original IDs, order and lab/review membership remain unchanged. Other school paths, real deploys and independent learner scoring are not in scope.

### Lesson-specific audit and decisions

| Original lesson | Prior source issue | Author-source remediation | Strongest negative acceptance |
| --- | --- | --- | --- |
| `release-candidates` | A repeated version/digest audit and a fictitious manifest; insufficient distinction between local image ID, registry manifest, tag and trusted build provenance | Hash real disposable candidate payload bytes, show mutable version label mismatch and locally build two different Docker images whose same candidate tag moves between IDs. Explain complete multi-artifact manifest, actual OCI manifest subject, trustworthy attestation vs self-reported fields and reproducible rebuild identity | Candidate changed while same tag remains; source-derived oracle blocks promotion; real Docker mutable tag rejected |
| `promotion-and-gates` | Good human approval narrative but no executed failed or waived transition showing absence of deployment effects | Teach guard-based state-machine, FAIL/NOT_TESTED/NOT_AUTHORIZED distinctions, same digest and target scope, and tiered GitLab protected-environment approvals | Failing or unrun mandatory check, swapped candidate digest or different target BLOCKS; zero deploy events |
| `deployment-evidence` | Useful illustrative Docker inspect commands but could be confused with registry proof or total system health | Separate GitLab job exit, local image ID, registry manifest, API and worker identities, migration result, signed user/forbidden-side-effect check | API healthy and job exit zero, but consumer on old release -> MIXED_RELEASE; missing role -> NOT_VERIFIED |
| `release-observability` | Basic before/after list without independent meaningful denominator/critical-state gate | Teach release marker, comparable observation window, rate vs count, client outcome and integrity-stop, bounded investigation vs SLO | Error rate improves but forbidden durable change occurred -> STOP_INTEGRITY; tiny sample -> INSUFFICIENT |
| `release-failure-handling` | Correct warning against image-only rollback, but a generalized failure decision sketch and no executed oracle | Stage/side-effect-specific recovery: pre-state stop, compatible revert candidate, unknown evidence, contain + forward-repair; include workers, schema, events, authorized operator | Prior image known but schema contracted -> CONTAIN_FORWARD_REPAIR, NOT pretend recovery |
| `release-runbooks` | Checklist without executable precondition/no-side-effect contract | Teach target, digest, privilege, compatibility preflight, correct state transitions, runbook verification/STOP/escalation and independent operator rehearsal | Invalid target, mismatched digest, unauthorized operator or incompatible schema produces STOP_PREFLIGHT **with zero deployment events** |

There are **18 topic-specific mechanism/counterexample/novel-transfer sections** (3 per original lesson) in `delivery-release-learner-mechanisms.ts`, integrated directly into all six existing authored reading pages, not generated preparation wrappers. The original content is retained where correct; the generic common source audit is now supplemented with a distinct mechanism and failure example per topic. All six original practices now begin with the exact learner-executable example and require separate, properly authorized live evidence. The original final lab's four activities and final review now demand per-role, schema/event, actual authorization, failure and runtime evidence.

**Instructional correction:** earlier Release Candidates practical incorrectly stated that rebuilding the same source/version **necessarily creates different bytes**. Reproducible builds can create identical bytes. The corrected claim is that a rebuild is a *new build invocation requiring provenance and acceptance*; its output may be byte-identical or different, which must be measured, and promotion should reuse the actual previously tested artifact.

### Seven directly published executable proofs and deliberately wrong implementations

`delivery-release-proofs.ts` is the **source rendered into each original lesson**. `node scripts/check-delivery-release-proofs.mjs` extracts those exact published code blocks, executes them and changes one dangerous branch or assumption to make an intentionally wrong implementation. The gate includes:

1. **Release Candidates:** real local filesystem SHA-256 bytes change behind the same human label; an unsafe label-only comparison is rejected.
2. **Promotion and Gates:** a real required failure, NOT_TESTED, digest mismatch or scope mismatch produces BLOCKED and no simulated deployment event; identity-only approval shortcut rejected.
3. **Deployment Evidence:** source-local recorded identities for API, publisher and consumer must all match; success command with a mixed worker or forbidden persisted effect is rejected.
4. **Release Observability:** normalized failure rates with denominators, minimum sample, and nonnegotiable integrity stop; lower errors cannot mask an observed unauthorized effect. Numeric thresholds are illustrations, **not a real SLO/statistical guarantee**.
5. **Failure Handling:** classify failure before persistent mutation vs compatible rollback vs already incompatible schema/external effects vs unknown evidence; reject blind old-image reuse.
6. **Runbooks:** preflight invalid target, unapproved digest, no operator permission and incompatible data contract each stop with **zero** synthetic deployment writes; reject an unsafe handler recording a deployment regardless of preflight.
7. **Local Docker executable Release Candidate identity:** actual Docker Engine builds two tiny disposable BusyBox image variants, observes two distinct **LOCAL IMAGE IDs**, assigns `candidate` to A then retags candidate to B, and proves the previous approved image ID does not follow the tag. Two source mutations fail: a branch accepting the changed candidate, and a test that silently never retags. **Local image ID is NOT an OCI registry manifest digest; the fixture does not publish to Nexus, verify SLSA provenance or deploy anything**. All temporary Docker tags/images are removed by trap.

The strong claim here is limited: source-derived executable logic and real disposable local Docker tag behavior. Real GitLab production approval, Nexus registry manifest integrity, artifact signing, audit-friendly attestation, deploy/run health, semver compatibility and independent learner assessment remain **NOT_TESTED** unless independently supplied real evidence establishes them. No actual asset, credential or user data is invented.

### Browser and human learner gate

The real browser script traverses all **six original Release reading IDs**, checks their individual mechanism headings, topic-specific paragraphs and copyable source; it also verifies the **six original applied practices**, **all four original final lab activity IDs**, final original review and 390px mobile rendering without overflow, plus reload continuity. Existing Configuration Management, Docker, CI and CD source/run/Chrome checks must remain green.

A genuine outside learner assessor should give a **privately designed and previously unseen release scenario in a different domain** AFTER the learner studies these examples. The learner must: assemble a real candidate with source+artifact digest+environment contract; reject an unapproved tag swap; inspect all runtime roles and a forbidden durable-state case; choose rollback vs contain/repair after surprise schema/event effects; and operate or explain a safe runbook with exact stop conditions. Scoring dimensions (0–2) are provenance/identity, promotion gate correctness, actual runtime verification, harmful-failure diagnosis and safe operator handoff. Target at least 8/10 with no zero in harmful-failure handling or evidence integrity. Any real homelab work must be consensual and permitted, and all missing live controls must remain NOT_TESTED. Public examples are **not** unseen tests. **No real independent learner assessor has yet completed this protocol.**

**Primary research consulted:** [Semantic Versioning](https://semver.org/), [The Twelve-Factor App: Build/Release/Run](https://12factor.net/build-release-run), [Google SRE Release Engineering](https://sre.google/sre-book/release-engineering/), [SLSA Provenance v1.2](https://slsa.dev/spec/v1.2/provenance), [GitLab protected-environment approvals](https://docs.gitlab.com/ci/environments/deployment_approvals/) and [GitLab release evidence](https://docs.gitlab.com/user/project/releases/release_evidence/). GitLab protected-environment deployment approvals are tier-dependent; release evidence snapshots are not automatically verified OCI provenance, live service fitness or a human approval for each component. Current provider docs explain capabilities; they do **not** show the learner's instance has them configured.

**Current disposition:** Author-source remediation and technical tests authored on draft PR #404; final acceptance requires the entire source-derived full 38/38 suite, production build, strict learner audit and matching-head real Chrome test to pass. The school is not human learner-validated, draft PR is not merged, and additional modules remain to be examined. Release Engineering is **canonical module 7 of 11**; module 6 Configuration Management was already re-audited.
