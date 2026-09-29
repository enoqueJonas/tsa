# Technical Steward — Stewardship Evolution Contract

Status: canonical implementation contract

## Purpose

Technical Steward converts accumulated engineering evidence into durable organizational technology choices. The school governs outcomes, investment, risk, controls, lifecycle and capability without centralizing every engineering decision.

It is not Architect II and it is not a generic management curriculum.

## Governing loop

```text
organizational outcome / obligation
        ↓
technology capability
        ↓
evidence: architecture + delivery + quality + security + reliability
        ↓
strategy / risk / lifecycle choice
        ↓
decision rights + controls + standards
        ↓
investment / owner / horizon
        ↓
operating evidence
        ↓
review, exception, retire or adapt
```

## Core rules

1. Govern outcomes and material risks, not personal tool preferences.
2. Delegate low-risk implementation decisions to the closest competent owner.
3. Require stronger evidence/oversight as consequence and irreversibility increase.
4. Strategy must contain non-choices and opportunity cost.
5. A capability is not the same thing as a product.
6. A control must trace to an objective/risk and produce evidence.
7. An exception is governed debt/risk, not silent noncompliance.
8. Acceptance authority follows organizational consequence; engineers do not silently accept business risk.
9. Standards require owners, verification and lifecycle/review rules.
10. Retiring technology is a first-class stewardship outcome.

## Progression

### 1. Technical Leadership
Own outcomes, improve decisions, communicate trade-offs, mentor and lead reviews without depending on positional authority.

### 2. Engineering Governance
Define decision rights, accountability, policy/standard/procedure distinctions and proportionate exception mechanisms.

### 3. IT and Technology Governance
Connect business outcomes, value, resources, performance and recognized governance/service-management frameworks without framework cargo culting.

### 4. Technology Strategy and Capability Planning
Turn organizational outcomes into capability choices, investments, deliberate non-investments and evidence-gated roadmaps.

### 5. Technology Risk
Maintain scenario-based risk, inherent/residual exposure, appetite/tolerance, treatment, acceptance authority, KRIs and review triggers.

### 6. Controls, Compliance and Assurance
Translate objectives/risks into proportionate controls; distinguish design from operating effectiveness; produce evidence and remediation.

### 7. Architecture Governance
Turn Architect decisions into principles, standards, review/exception/lifecycle mechanisms without recreating architecture design work.

### 8. Security and Data Governance
Govern ownership, policy, classification, retention/privacy and access accountability while reusing Security Steward evidence.

### 9. Change and Service Governance
Govern change risk, release authority, service ownership, operational readiness and incident/problem/change relationships.

### 10. Third-party and Technology Lifecycle Risk
Govern vendor/dependency criticality, supportability, end-of-life, concentration, continuity and exit.

### 11. Technical Debt and Engineering Health
Connect debt/health to delivery, security, reliability, cost and strategic capability rather than aesthetic cleanup.

### 12. Engineering Handbook and Standards
Turn decisions into discoverable organizational memory that engineers can actually use and challenge.

### 13. Technical Stewardship Review
Synthesize actual-stack inventory, strategy/capability choices, risk, controls, architecture/service governance, lifecycle, debt/health and ownership into a defensible planning-cycle review.

## Boundary with Architect

Architect answers: **what structure best satisfies these drivers now, and why?**

Technical Steward answers: **how should the organization govern, invest in, own, review and eventually retire/evolve that technology over time?**

Do not repeat architecture-style comparison unless a governance/lifecycle decision requires the evidence.

## Boundary with Professional Engineer

Technical Steward establishes organizational stewardship capability. Professional Engineer should demonstrate sustained professional practice, ethics, evidence, communication and portfolio-level engineering judgment rather than adding another layer of technology governance.

## Runtime integrity

Every declared Technical Steward module must be exported through `technicalStewardPaths` and the academy journey. Run `pnpm audit:curriculum` before merging curriculum changes.
