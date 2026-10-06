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
- Redis/RabbitMQ are required System Thinker implementations after their evidence gates are satisfied; later schools include them when still active, or carry explicit retirement/migration evidence when a later architecture decision removed them;
- one known-good health/request check;
- architecture decisions or open risks that materially constrain hosting.

This handoff is the canonical starting state for Platform Builder. If a later lab changes one of these facts, the learner updates the handoff or creates a versioned successor rather than allowing operational assumptions to drift.

The learner creates the host, users, permissions, service process, PostgreSQL runtime, networking and operational access needed by Steward.

Result: Steward is a managed service on learner-owned infrastructure with a traceable application-to-platform contract.

### 4. Delivery Engineer — make changes reproducible

The existing Steward application becomes containerized, versioned and delivered through GitLab CI/CD. Ansible and release/rollback work operate on the system already hosted by the learner.

Delivery Engineer begins from the Platform Builder handoff: the exact Steward version, host/runtime topology, PostgreSQL state, configuration contract, exposure boundaries, recovery evidence and known-good verification. Containerization may change how Steward is packaged and started, but it must not silently change the application's domain contract or erase the platform assumptions being replaced.

Delivery Engineer closes with a **release handoff** containing:

- the exact source commit and human release version;
- immutable container image identity, preferably including digest;
- the GitLab CI/CD pipeline/run that produced and validated it;
- Nexus coordinates or repository location for durable artifacts;
- database migration state and compatibility/rollback constraints;
- environment configuration contract with secret names only;
- deployment procedure and target topology;
- known-good runtime/client verification;
- rollback procedure and the last verified recoverable release;
- infrastructure/configuration version needed to host the release;
- unresolved delivery risks and intentionally deferred mechanisms.

Result: a commit can produce a versioned artifact and a reproducible deployment, and the next school can identify exactly which release it is moving.

### 5. Cloud Engineer — move the same release to a remote environment

Cloud Engineer begins from the Delivery release handoff. It moves the **same immutable Steward release** to a budget-conscious remote environment; it does not rebuild the application merely because the hosting model changes.

The learner provisions the remote environment and deploys the existing release with DNS, TLS, IaC, backup/recovery and cost evidence. Any unavoidable application or packaging change becomes a new traceable release through the Delivery path before cloud deployment.

Result: Steward has a controlled remote environment without becoming a new application, and local/homelab versus remote differences are explicit rather than hidden in rebuilt artifacts.

### 6. Quality Steward — build confidence around real behavior

Quality Steward starts from the immutable Steward release and environment contract produced by Delivery/Cloud. The test project must identify which release and environment produced its evidence; "test the current version" is not a sufficient target.

The learner creates `steward-tests` as a Java/Maven project and grows it incrementally:

1. JUnit 5 and the Maven execution chain are understood before framework abstraction;
2. a small raw Java HTTP probe establishes protocol mechanics;
3. REST Assured is introduced only when repeated HTTP ceremony justifies it;
4. Steward-specific API clients, DTOs, data builders and diagnostics emerge from real tests;
5. API, persistence, identity and failure-boundary coverage grows from the actual Steward risk model;
6. Playwright Java is added only if Steward has a genuine browser-facing workflow with browser-specific risk;
7. CI/scheduled execution consumes the same release/environment identity and preserves diagnostic evidence.

The learner must not generate an abstract "enterprise test framework" before product tests exist. Every abstraction must point to repetition, isolation, diagnostic or execution risk demonstrated by `steward-tests`.

Reusable automation is extracted into `tsa-test-core` only after repetition demonstrates a boundary **and** the candidate is independent of Steward domain behavior. A genuine second compatible consumer is mandatory evidence. Quality Steward therefore defers extraction; Professional Engineer must deliberately create or encounter the genuine second-consumer prerequisite before curriculum completion, without distorting an otherwise non-Java capstone merely to manufacture reuse.

Result: Steward has an evidence-producing quality system around a known release, while framework and library boundaries are consequences of proven testing needs rather than preselected architecture.

### 7. Security Steward — attack and harden what exists

Security Steward begins from a **security assessment baseline** assembled from the actual accumulated system, not from a generic web-application scenario. The learner records:

- the exact Steward application release and deployed environment under assessment;
- the current Cloud topology, public/private/management boundaries and authoritative data stores;
- the Delivery source-to-artifact chain, CI identities and immutable artifact coordinates;
- the current authentication and domain-authorization model;
- the Quality risk/evidence map and security-relevant regression capabilities;
- internal packages and shared test libraries only when they actually exist;
- current secrets/credentials by purpose and ownership, never secret values;
- known residual risks and open architecture decisions from earlier schools.

Threat modeling, access-control testing, secrets, delivery/infrastructure security and hardening operate against that baseline. Security findings must identify affected asset/boundary, reproducible evidence, current control, remediation or accepted residual risk, and retest evidence where a change is implemented.

Security Steward must not invent infrastructure merely to satisfy a security topic. Keycloak, Vault, internal PKI, federation or other controls are adopted when the accumulated system creates a defensible requirement; otherwise the learner records a defer decision and trigger. Likewise, future artifacts such as `tsa-test-core` cannot appear in threat models or supply-chain diagrams before their required evidence gate has been satisfied and the artifact actually exists.

Result: security changes correspond to demonstrated risks and controls on a known Steward release, and the final assessment clearly distinguishes verified controls, findings, recommendations and accepted/deferred risk.

### 8. Reliability Engineer — operate measurable behavior

Reliability Engineer begins from a **reliability baseline** for the exact Steward release/environment that survived Quality and Security work. Carry forward user-visible capabilities, current topology and authoritative dependencies, still-valid quality evidence, runtime-affecting security changes, known failure modes/residual risks, existing telemetry gaps, recovery evidence and operational ownership.

Logs, metrics, traces where justified, SLIs/SLOs, alerts, incidents, recovery and capacity work then use real Steward behavior and failure modes.

Reliability controls follow **question → measurement → decision → control → exercise**. A dashboard, metric, alert, tracing backend or resilience mechanism must answer an identified operational question or mitigate a demonstrated risk. Tool installation alone is not progress.

Required observability capabilities must be distinguished from technologies that have not yet reached their implementation gate or that were later retired through explicit architecture evidence. Infrastructure and dependencies must not be invented early to make a reliability scenario interesting. Redis, RabbitMQ, Keycloak and orchestration/GitOps components are expected once their required hands-on gates have been completed unless later retirement evidence exists; `tsa-test-core` remains absent until its later two-consumer gate is genuinely satisfied.

SLIs/SLOs start from user-visible semantics. Alerts require an owner and actionable response. Incident and fault exercises originate from reachable Steward failure modes and run only in learner-controlled environments.

Result: the learner can reason about a known Steward release as an operated service whose reliability claims, limits and recovery mechanisms are evidence-backed rather than inferred from tool presence.

### 9. Architect — evolve from evidence

Architect begins by reconstructing the **architecture that actually exists** for the exact Steward baseline inherited from Reliability. Repository structure, deployed topology, data ownership, integration mechanisms, internal packages, operational dependencies, quality/security evidence, SLOs, incidents, capacity measurements and ADRs are evidence; diagrams or curriculum examples are not substitutes for that evidence.

The learner evaluates the accumulated architecture. Boundaries may be retained, strengthened or changed based on demonstrated drivers. Distribution is never required merely to make the architecture appear advanced. A modular monolith, synchronous interaction, single authoritative PostgreSQL store or existing deployment model may remain the correct decision.

Architect starts from evidence, not from a timeless mandatory stack. Technologies whose earlier implementation gates were required—such as Redis, RabbitMQ, Keycloak, Kong, Kubernetes/OpenShift and GitOps tooling—should have implementation history by this point, but the active baseline may omit one when explicit migration/retirement evidence explains why. `steward-common` is conditional: Architect reviews either its earned extraction history or the evidence-backed defer decision if its real-consumer gate was never satisfied. `tsa-test-core` is different: it remains a future required extraction until Professional Engineer satisfies the genuine two-consumer gate.

Every proposed architecture change must state:

1. the observed pressure or quality-attribute scenario;
2. the current evidence supporting that pressure;
3. credible alternatives, including retaining the current design;
4. data, consistency, security, delivery, reliability and operational consequences;
5. validation/fitness evidence that would show the change helped;
6. rollback/reconsideration triggers.

Result: architectural decisions are consequences of system forces. The Architect milestone may legitimately conclude that the strongest near-term architecture is a better-governed version of the existing system rather than a more distributed one.

### 10. Technical Steward — govern the technology

Technical Steward begins from the **actual architecture and evidence baseline** produced by Architect, including what was deliberately retained, simplified, deferred or removed. Governance operates on that estate; it must not recreate previously rejected complexity merely to populate standards, risk registers or review templates.

Steward expands toward technology risks, standards, controls, exceptions, debt, lifecycle governance and engineering-health reviews. Governance artifacts point to authoritative engineering sources wherever those already exist instead of copying facts into parallel paperwork.

A governance requirement states the outcome it protects, scope, accountable decision owner, exception authority, operating evidence, review/expiry condition and trigger for reconsidering the rule itself.

Technology inventory is historical as well as current: a removed component may remain relevant as a decision or migration record, but it is never represented as an active dependency. Current components and internal packages are governed when they actually exist; future evidence-gated components are tracked as pending requirements or proposals rather than fictional active estate.

Result: the product reaches its natural stewardship purpose using the system history accumulated across TSA, with governance acting as a thin decision/evidence layer over engineering reality rather than a second fictional system of record.

### 11. Professional Engineer — prove transfer

Professional Engineer deliberately breaks Steward implementation continuity. Steward remains evidence, reference material and a source of lessons learned, but the learner must discover, propose and build a **second substantial system in a different problem domain from a blank repository**.

The capstone must not be a renamed Steward, a tutorial clone or an exercise whose architecture is predetermined by TSA. Its technology choices, domain model, delivery model, quality strategy, security controls and reliability mechanisms must be earned again from its own stakeholders, constraints, risks and evidence.

Transfer does not mean refusing all reuse. Generic libraries, templates, practices or internal products may be reused when their contracts genuinely fit, but the learner must explain the decision and preserve independent ownership of capstone-specific code and architecture. Copying Steward structure by default is evidence against transfer, not evidence for it.

The Professional Engineer progression is:

1. discover several credible problems and select one from evidence;
2. produce a solution-neutral discovery baseline;
3. propose architecture and engineering strategy from that baseline;
4. make an explicit go, conditional-go or redesign decision;
5. create the system from a blank repository and deliver vertical increments;
6. revise decisions when implementation evidence contradicts the proposal;
7. conduct a production-readiness review that may legitimately block release;
8. defend the system and its limitations under cross-functional challenge;
9. use Steward + capstone evidence to demonstrate what capability transferred and what still needs development.

Result: TSA can distinguish familiarity with one accumulated system from transferable engineering judgment.

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

## Technology implementation classification

TSA distinguishes learning a technology from pretending the accumulated system already needs it.

- **Required implementation** — TSA intentionally creates a credible engineering requirement, the learner evaluates the fit, implements the technology, verifies behavior/failure/recovery, and later schools may rely on it while it remains active.
- **Conditional implementation** — the learner must evaluate the technology, but implementation occurs only when evidence crosses the stated adoption threshold. Reject/defer is a successful outcome when justified.
- **Comparison/context** — the learner must understand the capability and trade-offs but does not implement it unless their independent evidence creates a new requirement.

A technology classified as required still needs an earned prerequisite. “Required” never means “install this because enterprises use it.” A later lesson may state that a technology exists only after the implementation checkpoint that created it, and must respect any later removal/migration decision.

Current curriculum intent:

| Capability / technology | Intent |
| --- | --- |
| PostgreSQL | Required implementation |
| Linux/systemd | Required implementation |
| Docker/OCI containerization | Required implementation |
| GitLab CI/CD | Required implementation |
| Ansible/configuration management | Required implementation |
| Nexus/artifact repository | Required implementation, justified first by immutable container distribution; language-package flows are conditional on real packages |
| OpenTofu/IaC | Required implementation |
| Public DNS/TLS/API edge with Kong | Required implementation through an explicit edge-management scenario |
| Graylog centralized logging | Required implementation after operational logging/search/correlation questions are defined |
| Prometheus/Grafana metrics | Required implementation after SLI/operational questions are defined |
| OpenTelemetry + selected tracing backend | Required implementation after a distributed diagnostic question justifies end-to-end tracing; backend choice remains evidence-driven |
| Vault dynamic secrets | Required implementation after the static credential-lifecycle problem is demonstrated |
| Keycloak/workforce federation | Required implementation when the Security identity progression reaches the existing homelab directory scenario |
| Kubernetes/OpenShift-compatible orchestration | Required hands-on migration exercise after the containerized release exists; the learner may later simplify/remove it |
| Argo CD/GitOps | Required within the retained orchestration learning scenario; it must have one deployment-authority boundary |
| Redis | Required implementation after Steward reaches the designed catalogue/read workload and measured cache-worthy pressure |
| RabbitMQ | Required implementation after Steward adds a durable asynchronous side-effect requirement that must not block authoritative mutations |
| Kafka | Comparison/context unless a Kafka-shaped requirement is independently demonstrated |
| `steward-common` | Required extraction only after more than one real consumer demonstrates a stable domain-independent capability; otherwise defer |
| `tsa-test-core` | Required extraction after the curriculum deliberately creates a second real test consumer and demonstrates a stable product-independent testing capability |

For required technologies, TSA must deliberately evolve Steward until the prerequisite is real before asking the learner to implement the technology. The curriculum may not fabricate a benchmark result, duplicate code, second consumer or operational pain; the learner must create/measure the prerequisite through preceding exercises.

The four previously conditional arcs therefore become explicit product evolution:

- **Redis:** grow representative catalogue/query usage, establish an uncached baseline, exhaust query/index/ORM improvements first, then demonstrate a read path that misses its target and implement cache-aside without changing PostgreSQL authority.
- **RabbitMQ:** add a real post-commit capability such as lifecycle notifications/audit projection whose external latency/failure must not block the authoritative Service mutation; establish synchronous failure evidence, then implement messaging, redelivery, idempotency, poison handling and outbox recovery.
- **steward-common:** introduce a second real Steward-owned consumer/tool that needs a stable non-domain-specific API/client capability already present in the primary codebase; first tolerate local duplication long enough to prove the boundary, then extract/version/publish/consume it.
- **tsa-test-core:** keep Steward-specific automation inside steward-tests initially; later create a second real TSA test consumer with overlapping infrastructure concerns, prove the repeated capability is product-independent, then extract/version/publish it and prove both consumers remain compatible.

This table expresses curriculum intent, not permanent Steward architecture. Architect and Technical Steward may later retain, simplify, replace or remove technologies using evidence.

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
