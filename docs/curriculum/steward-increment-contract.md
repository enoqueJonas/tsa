# Steward Increment Contract

Status: canonical curriculum architecture contract

## Purpose

Steward is the continuing system through which TSA turns concepts into cumulative engineering work. This document defines **what the learner actually builds, when it exists, and how later lessons are allowed to depend on it**.

It closes a recurring curriculum defect: an exercise must never ask the learner to refactor, extend, test, deploy, secure or operate an artifact that the curriculum has not explicitly caused them to build.

This contract complements the canonical product/domain definition in `docs/product/steward.md`. The product document defines **what Steward is**. This document defines **how the learner earns Steward increment by increment**.

## Core rule

Every substantial implementation exercise must begin from an explicit current state and end in an observable new state.

A learner should always be able to answer:

1. What already exists before I start?
2. What exactly am I building or changing?
3. Which repository, module or file am I touching?
4. What behavior proves that I succeeded?
5. Why does this increment matter to Steward or to the capability being taught?

If an exercise cannot answer those questions, it is not ready for publication.

## No fictional continuity

Curriculum prose must not imply that an artifact exists merely because an earlier lesson discussed the concept.

Bad:

> The first Steward experiment has grown into one script. Refactor it.

This assumes unearned implementation history.

Good:

> In the previous exercise you created `steward/services.py` with `create_service()` and `service_summary()`. Add status changes, then refactor the module so read-only and state-changing operations are obvious.

Continuity comes from files and behavior the learner actually produced, not narrative claims.

If a lesson can be entered independently and requires an earlier artifact, it must name the prerequisite checkpoint and describe the expected starting state.

## Exercise contract

A substantial Engineering Practice or project increment should expose the relevant subset of these sections.

### What you are building

Describe the user/product need in concrete language. Prefer a believable requirement over an abstract engineering instruction.

### Starting point

Name the artifact that already exists and the checkpoint that created it. Where useful, show the relevant current code or repository tree.

### Your assignment

Give concrete, ordered work. Early Builder exercises should be narrow enough that a learner who understands the lesson knows where to begin.

### Expected behavior

Show deterministic examples, HTTP exchanges, commands, output, tests, queries or other observable behavior.

### Constraints

State important rules without prescribing every implementation detail.

### Failure or edge case

Where relevant, require one meaningful negative path or boundary condition.

### Done when

Provide capability-specific acceptance criteria. These are not decorative checkboxes; they define the evidence of completion.

### What changed

Close the increment by naming the capability now present and what later work may rely on.

## Scaffolding gradient

Concrete does not mean permanently prescriptive.

```text
Early Builder
  exact file + small requirement + example behavior
        ↓
Later Builder
  feature ticket + domain rules + acceptance criteria
        ↓
System / Platform / Delivery
  existing system + constraints + evidence requirements
        ↓
Quality / Security / Reliability
  engineering objective + realistic failure/risk + evidence
        ↓
Architect / Technical Steward
  incomplete information + trade-offs + defended decision
```

The learner should gradually decide more of the method. TSA must not create ambiguity before the learner has enough system and conceptual context to reason about it.

## Steward implementation progression

The sequence below is the canonical capability spine. Individual lesson names may evolve, but they must preserve the dependency order.

### 0. Engineering Apprentice — no fictional application

No Steward repository is required. The learner develops investigation, shell, Git, HTTP-observation and engineering-reasoning habits using focused exercises.

The school may introduce the **problem** Steward will eventually solve, but it must not imply that Steward has already been implemented.

### 1. Builder — create Steward from zero

Builder owns the first executable Steward artifacts.

#### B1 — Service data

The learner creates the first small Python workspace and represents a technical Service with concrete information such as:

- name;
- endpoint;
- active status;
- age or creation information.

Result: one Service can be represented and inspected.

#### B2 — Service behavior

The learner introduces functions such as service creation, activation/deactivation and summary behavior.

Result: Service state can be changed deliberately and read-only behavior can be distinguished from mutation.

#### B3 — Service registry

Collections introduce multiple Services, lookup, filtering and simple duplicate handling.

Result: the learner has a useful in-memory registry rather than isolated syntax exercises.

#### B4 — Validation and failure

Control flow/exceptions introduce invalid names/endpoints/status transitions and explicit failure behavior.

Result: Steward begins to protect invariants.

#### B5 — Modules and domain structure

The growing script is split only after it has real responsibilities worth separating.

Result: the learner experiences the reason for modules/packages instead of being told to create architecture pre-emptively.

#### B6 — Domain models

Classes/type hints are introduced by evolving the existing representation, not by discarding it for an unrelated OOP exercise.

Result: Service becomes an explicit domain model with understandable contracts.

#### B7 — HTTP model

Web/API Foundations first observes HTTP independently, then asks how the existing Service capability should appear as resources and operations.

Result: the learner can describe the intended Service API contract before Django/DRF hides protocol mechanics.

#### B8 — Persistent relational domain

Relational Data expands from Service to the canonical Builder domain: Team, Membership, Environment, ServiceDependency and ServiceReview.

Result: the learner has a relational model and can answer real Steward questions with SQL.

#### B9 — Django/DRF implementation

The previously reasoned domain and HTTP contract become a Django/DRF application.

Result: Steward exposes real API behavior rather than framework-shaped CRUD created before the domain was understood.

#### B10 — Identity and authorization

Users, memberships, ownership and object-level permissions are added to existing operations.

Result: valid authentication is demonstrably different from permission to modify a Service.

#### B11 — Software craft consolidation

Configuration, logging, errors, refactoring, dependency decisions and documentation improve the application the learner already owns.

Result: Steward API v1 is reviewable and operationally understandable.

#### B12 — Builder milestone

The learner demonstrates Steward API v1 end-to-end. The milestone synthesizes existing capabilities; it must not secretly introduce a new subsystem.

### 2. System Thinker — understand before adding

System Thinker begins with the Builder milestone as a concrete system.

It does not invent a replacement application. The learner models actors, boundaries, components, data flows, dependencies, lifecycle behavior, failure modes and quality attributes using the implementation they already built.

Feature changes are allowed only when a modeling exercise exposes a justified requirement. Architecture diagrams and ADRs must correspond to real or explicitly proposed Steward behavior.

### 3. Platform Builder — give Steward a host

The same application moves from the development workstation onto learner-managed Linux infrastructure.

Platform Builder begins from a **System Thinker handoff**, not from an undefined phrase such as "the current Steward". Before host work begins, the learner records:

- the exact Steward repository commit/tag being operated;
- the application start command and supported runtime version;
- the PostgreSQL version, schema/migration state and data that must survive redeployment;
- required configuration keys and secrets by name only, never secret values;
- application, database and management ports plus intended exposure;
- filesystem paths or data classes that are persistent versus reproducible;
- the current topology and authoritative-state model;
- Redis/RabbitMQ only if the System Thinker milestone actually retained them as implemented dependencies;
- one known-good health/request check;
- architecture decisions or open risks that materially constrain hosting.

This handoff is the canonical starting state for Platform Builder. If a later lab changes one of these facts, the learner updates the handoff or creates a versioned successor rather than allowing operational assumptions to drift.

The learner creates the host, users, permissions, service process, PostgreSQL runtime, networking and operational access needed by Steward.

Result: Steward is a managed service on learner-owned infrastructure with a traceable application-to-platform contract.

### 4. Delivery Engineer — make changes reproducible

The existing Steward application becomes containerized, versioned and delivered through GitLab CI/CD. Ansible and release/rollback work operate on the system already hosted by the learner.

Result: a commit can produce a versioned artifact and a reproducible deployment.

### 5. Cloud Engineer — move the same release to a remote environment

The learner provisions a budget-conscious remote environment and deploys the existing release with DNS, TLS, IaC, backup/recovery and cost evidence.

Result: Steward has a controlled remote environment without becoming a new application.

### 6. Quality Steward — build confidence around real behavior

Quality Steward starts from the working Steward API. The learner incrementally builds `steward-tests`, first proving API behavior and later adding browser coverage only when a legitimate UI exists.

Reusable automation is extracted into `tsa-test-core` only after repetition demonstrates the boundary.

Result: Steward has an evidence-producing quality platform rather than a framework created in isolation.

### 7. Security Steward — attack and harden what exists

Threat modeling, access-control testing, secrets, delivery/infrastructure security and hardening operate against the accumulated Steward system.

Result: security changes correspond to demonstrated risks and controls.

### 8. Reliability Engineer — operate measurable behavior

Logs, metrics, traces where justified, SLIs/SLOs, alerts, incidents, recovery and capacity work use real Steward behavior and failure modes.

Result: the learner can reason about Steward as an operated service, not a dashboard exercise.

### 9. Architect — evolve from evidence

The learner evaluates the accumulated architecture. Boundaries may be retained or changed based on evidence. Distribution is never required merely to make the architecture appear advanced.

Result: architectural decisions are consequences of system forces.

### 10. Technical Steward — govern the technology

Steward expands toward technology risks, standards, controls, exceptions, debt, lifecycle governance and engineering-health reviews.

Result: the product reaches its natural stewardship purpose using the system history accumulated across TSA.

### 11. Professional Engineer — prove transfer

Steward remains portfolio evidence. The learner builds a second substantial system from a blank repository so TSA can distinguish transferable engineering capability from familiarity with one codebase.

## Builder increment ledger

The Builder rewrite must maintain an explicit ledger. This is the minimum initial mapping.

| Increment | Starting state | Learner adds | Observable result |
| --- | --- | --- | --- |
| Service representation | Python workspace | Service data | Service fields can be printed/read |
| Service behavior | one Service | create/status/summary functions | status changes are observable |
| Registry | Service functions | collection of Services | add/find/filter works |
| Validation | registry | rules + explicit failures | invalid operations fail deliberately |
| Structure | growing module | modules/packages | behavior preserved across separation |
| Domain model | structured functions/data | classes/types | contracts become explicit |
| HTTP contract | domain model | resource/API design | requests/responses can be predicted |
| Relational model | Service concept | teams/memberships/environments/dependencies/reviews | relational questions can be answered |
| DRF API | modeled domain | serializers/views/routes | API behavior is executable |
| Auth/authz | working API | identity + object permissions | forbidden operations are demonstrable |
| Craft consolidation | feature-complete API | config/logging/errors/docs/refactoring | API v1 is reviewable and supportable |

The detailed lesson-to-increment ledger should be maintained during the Builder audit rather than guessed in advance.

## Acceptance-criteria standard

Acceptance criteria must describe behavior the learner can verify.

Weak:

- Understand functions.
- Refactor for clarity.
- Think about state.

Strong:

- Creating a Service without an explicit status creates it as active.
- Deactivating a Service changes `active` from `True` to `False`.
- Calling `service_summary()` does not modify the Service.
- Looking up an unknown Service produces the failure behavior defined by the exercise.
- Existing behavior still works after the module is split.

Acceptance criteria are an early introduction to requirements and testability. They should not become pseudo-tests for purely conceptual lessons.

## Standalone exercise rule

Not every exercise must modify Steward.

Use a focused standalone experiment when it teaches a concept more clearly or safely: slicing, a protocol observation, a small SQL experiment, a failure reproduction, or another bounded capability.

The distinction must be explicit:

- **Practice** — isolated exercise; no later Steward dependency.
- **Steward increment** — changes the continuing artifact; later curriculum may rely on it.
- **Investigation/design exercise** — produces evidence or a decision rather than application code.

Never create fake continuity by narrating a standalone exercise as though it modified Steward.

## Migration rule

Existing curriculum is not rewritten wholesale merely to match this document.

For each module:

1. inventory exercises and their claimed starting artifacts;
2. identify fictional or missing dependencies;
3. map genuine Steward work onto this progression;
4. preserve strong standalone practice;
5. rewrite vague implementation prompts into explicit increments;
6. add acceptance criteria and expected behavior where useful;
7. verify that exercise N actually creates what exercise N+1 consumes;
8. run curriculum/runtime audits and the platform build after each coherent change.

Builder is migrated first because it creates the substrate consumed by every later school. System Thinker migration resumes only after the Builder implementation chain is coherent.

## Authoring regression questions

Before merging a practical curriculum change, ask:

- Does the learner possess every artifact this exercise names?
- Can the learner identify the exact starting file/repository/module?
- Is the requested change concrete enough for the learner's current level?
- Can completion be observed rather than asserted?
- Does the exercise teach the target concept rather than merely use its vocabulary?
- Is Steward continuity real, or are we pretending an earlier implementation happened?
- Does the next exercise rely only on behavior this one actually creates?
- Is ambiguity increasing deliberately as learner capability increases?
- Would a motivated learner know what to do next without guessing what the curriculum author imagined?
