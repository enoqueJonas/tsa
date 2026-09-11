# TSA Curriculum Breadth Audit

This audit originally marked the transition from **Build Wide** to **Build Deep**. All 12 planned schools were represented by runnable curriculum breadth, and the review checked sequencing, milestone continuity, prerequisite placement, lab progression, cross-journey capability development and areas requiring special care during deep authoring.

## Current status

The audit's structural conclusion held through implementation: no missing school, broken journey transition or major prerequisite inversion required reopening Build Wide.

**Build Wide is complete and Build Deep is now complete across all 12 schools.** The curriculum has moved into the separate **Content Quality** phase described in [Curriculum Content Quality Standard](./content-quality-standard.md).

The journey therefore now reads:

```text
Complete curriculum breadth
        ↓
Curriculum-wide audit
        ↓
Deep-author all 12 schools
        ↓
Content-quality audit and repair
        ↓
Learner validation and continued iteration
```

Content Quality should improve the learning experience without casually changing the established journey. Structural changes remain allowed when curriculum review, implementation evidence or learner evidence exposes a genuine flaw.

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

## Deep-authoring watch items retained for quality review

These items originated during the pre-deep-authoring audit. Deep content now exists, but they remain useful review questions during Content Quality and learner validation.

### Browser-testing target

Quality Steward includes page objects, cross-browser testing and browser execution while the continuing core project is primarily the Steward API. Content review should ensure any browser surface used is a credible product surface rather than a fake UI introduced solely to justify Selenium/Playwright concepts.

### Performance-tool selection

Performance practice should continue to justify its primary tool by fit for the Python/HTTP ecosystem, CI execution, observability integration and learning cost rather than treating a tool as the learning objective.

### Distributed-systems examples

Architect and Reliability teach queues, backpressure, replication, partitioning, eventual consistency and distributed failure. Hands-on evidence should not force Steward to become unnecessarily distributed. Controlled experiments, architectural katas, optional components or justified evolution remain preferable to artificial production complexity.

### Tracing depth

Tracing practice should use a real backend only when it helps answer useful diagnostic questions beyond logs and metrics. Tool deployment is not itself evidence that the learner understands tracing.

### Security laboratory isolation

Every offensive-security exercise must remain learner-controlled and isolated. Lessons should pair vulnerability reproduction with mitigation, retesting and evidence. Avoid exercises that depend on external/public targets.

### Governance frameworks

COBIT, ITIL, ISO and NIST should remain sources of concepts and comparison points rather than certification-objective memorization. Lessons should show how framework ideas solve concrete accountability, control, risk and service-management problems.

## Duplication that is intentional

Some concepts recur because the learner's responsibility changes over time. Content Quality should reference prior knowledge rather than reteach from zero.

Examples:
- coupling/cohesion: Builder/System Thinker → Architect at system scale;
- HTTP/TLS: Builder/Platform Builder → Cloud/Security operational context;
- quality gates: Delivery → Quality → Security governance;
- retries/timeouts: Delivery concepts → Reliability behavior → Architect structural decisions;
- dependency management: Builder → Delivery → Quality → Security → Reliability → Architect → Technical Steward;
- risk: Engineering decisions → Security risk → Reliability risk → Technology governance.

The rule is **spiral depth, not duplicate lessons**. Each recurrence should answer a different engineering question.

## Lab progression standard

Every major lab should state:
1. prerequisite artifacts from previous work;
2. the engineering question being answered;
3. the system/environment being changed or observed;
4. evidence to capture;
5. completion criteria;
6. what should be preserved for later schools.

Labs should modify the same continuing system whenever that is pedagogically sound. Disposable toy labs are acceptable for isolated concepts, dangerous experiments or situations where changing Steward would create artificial architecture.

## Milestone evidence standard

Every milestone should produce reviewable artifacts in four categories:
- **working system evidence** — code, configuration, deployment or executable tests;
- **engineering reasoning** — decisions, alternatives and trade-offs;
- **operational evidence** — logs, test reports, metrics, screenshots, traces or recovery results where relevant;
- **portfolio communication** — concise documentation another engineer can understand and review.

Completion should not be based on lesson count alone.

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

Deep authorship establishes the material. It does not by itself prove that the learner experience is rich. The Content Quality standard adds a second question: whether explanation, practice, failure exploration, evidence and review are actually appropriate to the capability being learned.

## Decision

**Build Wide: complete. Build Deep: complete.**

The breadth audit remains a structural guardrail, but the active curriculum phase is now **Content Quality**. The first targeted repair begins with Builder → Programming with Python, followed by evidence-based reassessment of the remaining Builder modules.
