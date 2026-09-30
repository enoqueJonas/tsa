# TSA Instructional Depth Remediation Tracker

**Status:** active
**Started:** 2026-09-30
**Governing standard:** [Instructional Depth and Pedagogy Standard](./instructional-depth-pedagogy-standard.md)

## Objective

Re-audit TSA from the learner's perspective and remediate lessons that are topically correct but instructionally insufficient.

This tracker is the source of truth for the remediation cycle. Do not mark a school complete because its paths compile, titles exist, resources are linked or canonical technologies are correct. Completion means the learner-facing content satisfies the pedagogy standard and representative pages have been checked in the rendered platform.

## Status vocabulary

- **NOT STARTED** — no pedagogical depth audit yet.
- **AUDIT IN PROGRESS** — learner-facing content is being inspected.
- **REWRITE REQUIRED** — systemic or severe instructional insufficiency confirmed.
- **TARGETED IMPROVEMENT** — lesson basically teaches, but specific gaps must be corrected.
- **REMEDIATED** — source rewritten against the standard; validation still required.
- **VALIDATED** — source and rendered experience satisfy the exit criteria.

## Confirmed defects

| ID | School / path | Finding | Severity | Status | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| PED-001 | Engineering Apprentice / Engineering Foundations / Terminal, Shell and Filesystem | Nominal 50-minute reading renders essentially one scope paragraph, a boundary callout and external resources. Concepts are enumerated rather than taught. | Critical | REWRITE REQUIRED | Trigger defect for this remediation. Rewrite as the reference benchmark lesson. |
| PED-002 | Engineering Apprentice / Engineering Foundations workbench delta | The four new workbench lessons are produced by a generator whose reading body is one short string plus a generic boundary/resource block. | Critical | REWRITE REQUIRED | Audit and rewrite Shell/Filesystem, Git workflow, Developer Inspection, and HTTP CLI individually. |
| PED-003 | Quality Steward / recently remediated Java/JUnit stack | Source is materially richer than PED-001, but several lessons use compressed mechanics/checklists and generated structures. Instructional sufficiency has not been proven from the learner perspective. | High | AUDIT REQUIRED | Deep-audit Java, JUnit/component, API/integration and framework-engineering lessons before accepting them. |

## Remediation order

The audit proceeds in learner progression order so later schools can rely only on capabilities that have actually been taught.

| # | School | Scope / major paths | Status | Exit evidence |
| ---: | --- | --- | --- | --- |
| 1 | Engineering Apprentice | Thinking Like an Engineer; Systems Thinking; Trade-offs; Debugging Mindset; Engineering Foundations/workbench; milestone/checks | AUDIT IN PROGRESS | Every lesson classified; thin lessons rewritten; rendered spot-check; duration sanity check |
| 2 | Builder | Builder fundamentals and implementation paths | NOT STARTED | Same school exit gate |
| 3 | System Thinker | contracts, integration semantics, distributed state and system reasoning | NOT STARTED | Same school exit gate |
| 4 | Platform Builder | OS/Linux/networking/virtualization/storage/core services/Ansible/patching/Windows | NOT STARTED | Same school exit gate |
| 5 | Delivery Engineer | build/test/package/artifacts/GitLab CI/CD/release | NOT STARTED | Same school exit gate |
| 6 | Cloud Engineer | provider abstractions/IaC/orchestration/GitOps/cloud operations | NOT STARTED | Same school exit gate |
| 7 | Quality Steward | all paths detailed below | NOT STARTED | Same school exit gate plus Java-stack coherence |
| 8 | Security Steward | threat/risk/appsec/platform security/identity/secrets/PKI/supply chain | NOT STARTED | Same school exit gate |
| 9 | Reliability Engineer | SLOs/telemetry/on-call/capacity/resilience/DR/incidents/experiments | NOT STARTED | Same school exit gate |
| 10 | Architect | domain/modularity/styles/data/integration/distribution/resilience/governance | NOT STARTED | Same school exit gate |
| 11 | Technical Steward | leadership/governance/risk/controls/lifecycle/standards | NOT STARTED | Same school exit gate with judgment-level pedagogy |
| 12 | Professional Engineer | ethics/practice/discovery/proposal/build/readiness/portfolio/defence | NOT STARTED | Verify deliberate transfer model; do not add tutorial content mechanically |

## Engineering Apprentice detailed remediation

| Path / lesson group | Status | Required action |
| --- | --- | --- |
| Existing pre-workbench foundations | AUDIT REQUIRED | Inspect actual rendered teaching depth; do not assume older lessons are good. |
| Terminal, Shell and Filesystem | REWRITE REQUIRED | Build the reference lesson defined in the pedagogy standard. |
| Git and Version-Control Workflow | REWRITE REQUIRED | Teach repository mental model, working tree/index/commit graph/HEAD/branches/diffs/remotes/conflicts with worked examples before lab. |
| Developer Inspection: Processes, Ports and Text | REWRITE REQUIRED | Teach process/listener/output inspection model with OS-appropriate examples and diagnostic boundaries. |
| HTTP from the Command Line | REWRITE REQUIRED | Teach request/response anatomy and transport-vs-HTTP failure reasoning with worked CLI examples before independent requests. |
| Workbench labs | AUDIT REQUIRED | Ensure guided practice precedes independent evidence and labs are not opaque command recipes. |
| Knowledge/assessment coverage | AUDIT REQUIRED | Add reasoning/prediction/diagnosis checks where needed. |
| Rendered-platform validation | NOT STARTED | Inspect representative pages after deployment/refresh. |

## Quality Steward detailed remediation

Do not treat the recent Java migration as pedagogically complete merely because it is technically coherent.

| Path | Status | Audit focus |
| --- | --- | --- |
| Quality Engineering | NOT STARTED | Does it teach quality reasoning rather than terminology? |
| Test Analysis and Design | NOT STARTED | Worked derivation from risk/requirements to tests; techniques practiced, not listed |
| Java for Test Framework Engineering | AUDIT REQUIRED | Java/JVM/Maven mental models, syntax/mechanics explanations, worked code, progressive scaffolding |
| Unit and Component Testing | AUDIT REQUIRED | JUnit execution/lifecycle, assertions, doubles, isolation, component boundaries; remove any stale non-Java examples |
| API and Integration Testing | AUDIT REQUIRED | HTTP/REST Assured/Jackson/auth/contracts/integration boundaries taught before abstractions |
| Automation Framework Engineering | AUDIT REQUIRED | Framework architecture must be taught through concrete evolution, not design checklists |
| Browser and Environment Testing | NOT STARTED | Playwright Java mechanics and browser model taught directly |
| Reusable Test Infrastructure and Internal Distribution | NOT STARTED | Extraction/versioning/Nexus consumption with worked evolution |
| Non-functional Quality | NOT STARTED | Performance/accessibility/etc. mechanisms and evidence, not tool recipes |
| Quality in Containers and CI | NOT STARTED | Docker/Testcontainers/GitLab execution boundaries and diagnostics |
| Continuous and Scheduled Quality Execution | NOT STARTED | Scheduling, selection, parallelism, evidence and failure handling |
| Quality Steward Milestone | NOT STARTED | Preserve synthesis/defence; verify prerequisites are genuinely taught |

## Per-lesson audit record

For each audited lesson, record enough information in the relevant school audit document or remediation commit to answer:

| Field | Required record |
| --- | --- |
| Classification | PASS / REWRITE / TARGETED IMPROVEMENT |
| Why | concrete pedagogical finding, not “looks short” |
| Missing teaching | concepts/examples/diagnostics/practice/assessment gaps |
| Prerequisite check | where assumed knowledge was actually taught |
| Duration check | whether estimate matches rendered work |
| Resource check | supplement vs outsourced instruction |
| Remediation | files/lessons changed |
| Validation | source review + rendered check where applicable |
| Commit | remediation commit SHA |

## School exit gate

A school reaches **VALIDATED** only when:

1. every live learner-facing lesson has a pedagogical classification;
2. every REWRITE/TARGETED IMPROVEMENT item is resolved;
3. new concepts are taught before they are independently assessed;
4. external resources are supplementary;
5. estimated durations are credible;
6. labs require understanding rather than command copying;
7. knowledge checks test reasoning where appropriate;
8. canonical architecture and cross-school boundaries remain intact;
9. curriculum integrity/build checks pass after source changes;
10. representative remediated pages are inspected in the deployed UI.

## Process discipline

- Work school by school; do not perform another shallow all-repository rewrite.
- Rewrite one coherent path/lesson group at a time and commit it independently.
- Preserve good existing material; remediation is not a mandate to make every lesson longer.
- Prefer explanatory depth and progressive examples over word count.
- Do not inflate lessons with generic prose.
- Track every confirmed systemic pattern here.
- Update statuses and commit references as work lands.
- A successful structural audit does not close a pedagogical audit.

## Immediate next task

**PED-001 / PED-002:** deeply audit Engineering Apprentice and rewrite **Terminal, Shell and Filesystem** first as the reference implementation. Use what is learned from that rewrite to calibrate the remaining Apprentice lessons before moving to Builder.
