# TSA Curriculum Breadth Audit

This audit marks the transition from **Build Wide** to **Build Deep**. All 12 planned schools are now represented by runnable curriculum breadth. The purpose of this review is to check sequencing, milestone continuity, prerequisite placement, lab progression, cross-journey capability development and areas that need special care during deep authoring.

## Outcome

The curriculum is structurally strong enough to move into deep authoring. No missing school, broken journey transition or major prerequisite inversion was identified that requires reopening the breadth phase.

The next phase should therefore be:

```text
Complete curriculum breadth
        ↓
Curriculum-wide audit
        ↓
Deep-author Engineering Apprentice
        ↓
Deep-author Builder
        ↓
Continue school by school
        ↓
Periodic cross-journey review
```

Deep authoring should improve lesson quality without casually changing the established journey. Structural changes remain allowed when research or implementation evidence exposes a genuine flaw.

## Journey continuity

The main continuing system remains coherent across the journey:

```text
Engineering reasoning
↓
Steward API
↓
System design
↓
Linux + homelab
↓
Containers + CI/CD + Nexus
↓
Internet/VPS/cloud environment
↓
Quality platform + tsa-test-core
↓
Security assessment and hardening
↓
Reliability program
↓
Architecture evolution
↓
Technology governance
↓
Independent professional capstone
```

The progression avoids restarting with toy projects for every discipline. Later schools reuse the engineering evidence produced earlier and force the learner to evolve or challenge previous decisions.

## Strong areas

### 1. Prerequisite ordering

The broad ordering is defensible:
- engineering reasoning precedes framework work;
- programming/API/data/authentication precede system modeling;
- system understanding precedes Linux/network/platform work;
- platform operation precedes delivery automation;
- delivery precedes remote/cloud operation;
- a deployable system exists before serious quality, security and reliability work;
- operational evidence exists before architecture re-evaluation;
- architecture and engineering evidence exist before governance;
- the independent capstone comes only after the complete stewardship journey.

### 2. Milestone continuity

Milestones form an evidence chain rather than isolated portfolio pieces:
- Engineering Investigation
- Steward API v1
- Steward API System Design Portfolio
- Steward Homelab v1
- Steward Delivery Platform
- Steward Internet Environment
- Steward Quality Platform
- Steward Security Assessment and Hardening
- Steward Reliability Program
- Steward Architecture Evolution
- Technical Stewardship Review
- Professional Engineering Capstone and Defence

Each later milestone should explicitly reference useful artifacts from previous milestones instead of recreating them.

### 3. Internal dependency progression

The internal-software-product thread is unusually strong and should be preserved:

```text
steward-common
    ↓
local package boundary
    ↓
Nexus/private PyPI
    ↓
CI publication and consumption
    ↓
compatibility testing
    ↓
security/provenance/SBOM
    ↓
reliability/backup/availability
    ↓
architecture/coupling review
    ↓
ownership/lifecycle governance
```

`tsa-test-core` adds a second, testing-focused internal product and provides an important distinction between reusable engineering infrastructure and domain-specific test logic. The Professional Engineer capstone can become its second genuine consumer when justified.

### 4. Architecture discipline

The Architect school correctly avoids treating microservices as a graduation badge. Distributed systems, messaging, caching and service decomposition are taught as options with operational costs. Keeping the modular monolith is a valid architecture decision when evidence supports it.

### 5. Governance discipline

Technical Steward is positioned after hands-on engineering. This prevents governance from becoming detached theory. Controls, standards, policies and review mechanisms should always point back to systems and risks the learner has actually encountered.

## Deep-authoring watch items

These do not block the journey, but they need deliberate treatment when lessons are authored in depth.

### Browser-testing target

Quality Steward includes page objects, cross-browser testing and browser execution while the continuing core project is primarily the Steward API. Deep authoring must define a credible browser surface before those lessons are reached. Acceptable options include a small genuine Steward web client or another real browser-facing Steward surface. Do not create a fake UI solely to justify Selenium/Playwright concepts.

Decision gate before deep-authoring the browser-testing module:
- if Steward has a meaningful browser client by that point, use it;
- if not, introduce the minimum useful user-facing client only if it improves the product and learning journey;
- otherwise narrow browser-specific exercises and keep API/service-layer testing primary.

### Performance-tool selection

The breadth teaches performance concepts without prematurely locking the learner into one tool. During deep authoring, select a primary practical tool only after comparing fit for the Python/HTTP ecosystem, CI execution, observability integration and learning cost. k6, Locust or equivalent can be evaluated then.

### Distributed-systems examples

Architect and Reliability teach queues, backpressure, replication, partitioning, eventual consistency and distributed failure. These concepts need hands-on evidence without forcing Steward to become unnecessarily distributed. Use controlled experiments, architectural katas, optional components or justified evolution rather than artificial production complexity.

### Tracing depth

Reliability currently covers traces and OpenTelemetry concepts. Deep authoring should decide whether the operational lab warrants a real tracing backend such as Tempo, Jaeger or an equivalent. Add one only when it helps answer useful diagnostic questions beyond logs and metrics.

### Security laboratory isolation

Every offensive-security exercise must remain learner-controlled and isolated. Deep lessons should pair vulnerability reproduction with mitigation, retesting and evidence. Avoid exercises that depend on external/public targets.

### Governance frameworks

COBIT, ITIL, ISO and NIST should be used as sources of concepts and comparison points, not converted into certification-objective memorization. Deep lessons must show how framework ideas solve concrete accountability, control, risk and service-management problems.

## Duplication that is intentional

Some concepts recur because the learner's responsibility changes over time. Deep authoring should reference prior knowledge rather than reteach from zero.

Examples:
- coupling/cohesion: Builder/System Thinker → Architect at system scale;
- HTTP/TLS: Builder/Platform Builder → Cloud/Security operational context;
- quality gates: Delivery → Quality → Security governance;
- retries/timeouts: Delivery concepts → Reliability behavior → Architect structural decisions;
- dependency management: Builder → Delivery → Quality → Security → Reliability → Architect → Technical Steward;
- risk: Engineering decisions → Security risk → Reliability risk → Technology governance.

The rule is **spiral depth, not duplicate lessons**. Each recurrence should answer a different engineering question.

## Lab progression standard

During deep authoring, every major lab should state:
1. prerequisite artifacts from previous work;
2. the engineering question being answered;
3. the system/environment being changed or observed;
4. evidence to capture;
5. completion criteria;
6. what should be preserved for later schools.

Labs should modify the same continuing system whenever that is pedagogically sound. Disposable toy labs are acceptable only for isolated concepts, dangerous experiments or situations where changing Steward would create artificial architecture.

## Milestone evidence standard

Every milestone should eventually produce reviewable artifacts in four categories:
- **working system evidence** — code, configuration, deployment or executable tests;
- **engineering reasoning** — decisions, alternatives and trade-offs;
- **operational evidence** — logs, test reports, metrics, screenshots, traces or recovery results where relevant;
- **portfolio communication** — concise documentation another engineer can understand and review.

Completion should not be based on lesson count alone.

## Deep-authoring order

Author deeply in journey order because later lessons should reference established TSA terminology and prior artifacts:

1. Engineering Apprentice
2. Builder
3. System Thinker
4. Platform Builder
5. Delivery Engineer
6. Cloud Engineer
7. Quality Steward
8. Security Steward
9. Reliability Engineer
10. Architect
11. Technical Steward
12. Professional Engineer

Do not deep-author all schools in parallel. Finish a coherent school, review its effect on later prerequisites, then move forward.

## Definition of a deep TSA lesson

A deep lesson should normally include:
- explicit learning outcomes;
- TSA-authored explanation rather than link aggregation;
- mental models and terminology;
- worked examples tied to the continuing system where useful;
- required reading/resources selected for that lesson;
- optional additional resources;
- a practical exercise, investigation or reflection when appropriate;
- knowledge checks or review questions;
- connection to prior and future journey artifacts;
- clear completion evidence.

Resources should be independently selected for lessons and exercises. Do not mechanically duplicate the same links everywhere.

## Decision

**Build Wide is complete.**

The curriculum should now enter **Build Deep**, beginning with Engineering Apprentice and using this audit as a guardrail. The next major curriculum change should therefore deepen existing lessons rather than add another school or broad module unless new research exposes a genuine missing prerequisite or capability.
