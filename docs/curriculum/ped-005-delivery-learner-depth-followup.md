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

## Independent novel-transfer protocol (NOT YET RUN)

The reviewer presents the following previously unseen scenario *after* the learner has studied this module. Do not supply a working playbook, model answer or source for the assessor's prompt.

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

**Unseen transfer task (not performed):** an assessor changes the authorization rules: an additional security-check job is mandatory for *every* candidate, but one branch's `rules` omit the security job. Without seeing a model solution, the learner must (a) explain why a plain `needs` on that possibly missing job can prevent pipeline creation; (b) reject setting `optional: true` merely to hide a missing security gate; (c) redesign `rules` and `needs` so every permitted candidate has a real performed test; (d) run a failing check in a real authorized GitLab and show no image publication, no privileged secret exposure and the exact tested source SHA; (e) mark GitLab/Runner controls NOT_TESTED if unavailable. Reviewer scores conceptual prediction, fail-closed DAG, artifact identity, actual negative evidence and trust/authority boundary, 0–2 each; target at least 8/10 with no zero for fail-closed DAG or evidence. No outside reviewer has scored this yet.

### Research and evidence provenance

- **Official GitLab job graph:** [`needs` guide](https://docs.gitlab.com/ci/yaml/needs/) — verified current semantics including bypassing stage waits, optional dependency interaction, and failure on missing required jobs.
- **Official artifact reference:** [GitLab job artifacts](https://docs.gitlab.com/ci/jobs/job_artifacts/) — exact job-output versus temporary cache versus versioned release boundary, including retention and `when` behavior.
- **Official cache reference:** [GitLab caching](https://docs.gitlab.com/ci/caching/) — key scope and cache-versus-artifact semantics.
- **Official job eligibility:** [GitLab `rules`](https://docs.gitlab.com/ci/jobs/job_rules/) — risks of duplicate pipelines and permission/eligibility interactions.
- **Substantive article:** [GitLab's stage and DAG walkthrough](https://about.gitlab.com/blog/basics-of-gitlab-ci-updated/) — concrete example of `needs` relaxing implicit stage order and reasons to choose job independence deliberately.
- **Optional video outline inspected, not watched:** [Moss GitLab CI/CD Pipeline Tutorial](https://www.youtube.com/watch?v=mnYbOrj-hLY) — public outline covers stages/jobs (~07:36), artifacts (~11:08), runner settings (~30:16) and caching (~31:59); its correctness and video contents were NOT independently verified from playback, and essential instruction is supplied in TSA itself.

### Module-4 acceptance status

Author-source reconstruction is complete for the five identified gaps; all thirteen readings remain in the expected learner sequence. Source-derived Python/YAML/unsafe-mutant CI and rendered Chrome/full build must pass on the exact **latest** PR head before TECHNICALLY VERIFIED can be claimed. Full GitLab runner, registry, protected variable, user-owned Steward homelab and uncoached novice gate are NOT TESTED; learner validation remains open.
