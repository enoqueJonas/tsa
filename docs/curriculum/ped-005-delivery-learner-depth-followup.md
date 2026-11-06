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
