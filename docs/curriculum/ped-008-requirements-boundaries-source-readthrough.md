# PED-008 — System Thinker source-level instructional read-through, modules 1–2

**Scope:** System Thinker only. **Status:** AUTHOR SOURCE REVIEW; NOT A LEARNER PASS.
**Related:** [PED-008 whole-school audit](./ped-008-system-thinker-school-audit.md), [independent transfer instrument](./ped-008-system-thinker-independent-transfer-review.md), [issue #332](https://github.com/enoqueJonas/tsa/issues/332).
**Verified source:** `system-thinker-requirements-running-case.ts`, `system-thinker-boundaries-running-case.ts` composed into the existing `*-deep.ts` lessons.

## Why these two modules were reopened

The previous first-principles rewrite made each lesson individually stronger, but the visible teaching still let a novice learn a term in isolation: stakeholder, functional requirement, quality attribute, assumption, acceptance evidence, context diagram, actor, trust boundary. There was no consistent **end-to-end cause-and-effect artifact** connecting all those topics. This is a pedagogy gap even when automated code samples and activity navigation pass.

## Continuous synthetic case

OBS-01 is an **invented rehearsal**, not an actual incident. A service owner lookup causes an escalation delay; an engineering lead proposes a dashboard. Two explanations compete: incorrect recorded ownership versus poor discovery of the correct ownership. **The story does not assume either explanation is true.** One observation is not enough to infer the incident rate or a measurable SLA.

### Module 1 — Requirements and Problem Framing: six explicit bridges

| Lesson | Worked artifact now included | Learner must independently disprove |
| --- | --- | --- |
| From Requests to Problems | Timed but fictional observation; H1/H2 evidence plan; implementation-neutral problem | A dashboard is the only solution; one anecdote implies a frequency |
| Stakeholders and Actors | Responder/maintainer/governance/operations goal-and-authority register | Stakeholder influence means authorization; all roles are direct actors |
| Functional Requirements | Separate FR-OWNER-01 read and FR-OWNER-02 authorized transfer contracts | React/PostgreSQL dictates business contract; hidden UI control is sufficient authorization |
| Quality Requirements | Six-part QR-LOOKUP-01 with **explicitly proposed**, not approved workload and latency measures | A fast wrong result is acceptable; p95 of successes hides timeouts |
| Constraints and Assumptions | A-01 owner-update timeliness, I-01 implementation fact, proposed C-01 policy, open D-01 approval owner | Today's Django implementation and informal policy claims are permanent constraints |
| Acceptance and Evidence | OBS-01 → needs → FR/QR → acceptance/verification and distinct responder validation | HTTP 200 or dashboard screenshot proves approved ownership or user outcome |

**Audit notes:** every new lesson segment has a worked example before an independently applied challenge, and has failure/false-confidence cases. Numbers in QR-LOOKUP-01, timestamps and role labels are teaching samples, never silently promoted to a production fact. The material must not assume an identity provider or organizational approval source until verified.

### Module 2 — System Boundaries and Context: four explicit bridges

| Lesson | New worked view | Boundary error that must be diagnosed |
| --- | --- | --- |
| System Context | C4 context of responders, maintainers and one Steward product; planned ownership directory distinctly labelled | Django, PostgreSQL, Redis and Kafka are drawn as neighboring business systems |
| Actors and External Systems | Actor versus indirect stakeholder/neighbor dependency register | A reporting job, identity provider and storage server are all labelled 'admin' or deemed current without evidence |
| Defining System Boundaries | Distinct product-responsibility, deployment, organizational-ownership and trust matrix | Process deployment implies business ownership; identity verification implies domain authority |
| Trust and Ownership Boundaries | Unauthorized Team B transfer threat trace and expected unchanged-state evidence | Trust a client Team header, hidden UI button or valid token as permission to modify every Service |

**Audit notes:** the four conceptual lessons now distinguish a **C4 context diagram** from a lower-level technical/threat DFD. The accompanying context lab still makes the learner build their own Steward-specific model, rather than copying the OBS-01 example. Current/planned/assumed is an explicit relationship property.

## Research and what was used

| Reference | What it contributed | Verification level |
| --- | --- | --- |
| [NASA — How to Write a Good Requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/) | Implementation-independent, traceable, necessary, verifiable requirements | Official text consulted |
| [SEBoK — Requirements Management](https://sebokwiki.org/wiki/Requirements_Management) | Version baseline, change impact and bidirectional traceability | Public technical reference consulted |
| [arc42 — Quality](https://docs.arc42.org/section-10/) | Source/stimulus, environment, artifact, response and measure | Official text consulted |
| [C4 — System Context](https://c4model.com/diagrams/system-context) | One product boundary, actor roles and neighboring systems, right level of abstraction | Official text consulted |
| [arc42 — Context and Scope](https://docs.arc42.org/section-3/) | Business and technical context interface descriptions | Official text consulted |
| [OWASP Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) | Trust boundaries as security/assurance questions, not merely an enclosing rectangle | Official text consulted |
| [Simon Brown — Visualising Software Architecture](https://www.youtube.com/watch?v=x2-rSnhpw0g) | Optional deeper C4 video context already linked in TSA | Video metadata/association known; full recording NOT reviewed |

## Verification ledger

- [x] Exact source file authored for all six Requirements lessons and all four Boundary conceptual lessons; **12 + 8 = 20 new teaching sections**.
- [x] Original lesson IDs and practical IDs preserved. Cross-module order remains System Thinker's canonical order.
- [x] Two source-derived curriculum smoke regressions cover section presence, progressive substance, worked artifacts, negative challenges and actual lesson composition; they cannot judge the truth of a learner's answer.
- [x] Tested at source head `bb897384`: [workflow #41449638324](https://github.com/enoqueJonas/tsa/actions/runs/41449638324) **19/19 jobs passed**, including three linked-case checks, build, 212 desktop and 212 390px mobile activities, and synthetic IndexedDB hard-reload persistence. This is not independent learner validation.
- [ ] Observe a novice uncoached explanation of *why a dashboard does not fix wrong source records* and *why a system context excludes the internal PostgreSQL process*.
- [ ] Examine independent original requirements, quality-scenario measurements and boundary diagrams; score against the PED-008 transfer rubric with counterexamples and recorded review notes.
- [ ] Confirm actual Steward actor membership and external IdP contracts before treating placeholder Team approval logic as production requirements.

**Module disposition:** Requirements: IN REVIEW; Boundaries: IN REVIEW. Modules 3–11 remain part of the same school's audit, not a separate concurrent audit. **Do not begin another school or merge the draft PR based solely on automated evidence.**
