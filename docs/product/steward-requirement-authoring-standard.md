# Steward — Requirement Authoring Standard

## Purpose

This document defines how TSA must present requirements for Steward work.

The objective is to create assignments that are **clear enough to model and implement, but incomplete enough to require engineering judgment**. Difficulty should rise because the learner owns more analysis and decision-making over time, not because requirements become vague or contradictory.

A learner should never fail a Steward milestone because the product need was hidden. Equally, the learner should not be able to complete a meaningful milestone by translating a prescribed schema, endpoint list or code recipe directly into framework syntax.

## Core rule

**Specify the problem precisely. Leave the solution meaningfully to the learner.**

TSA owns clarity about required outcomes, business rules, supplied constraints and acceptance. The learner increasingly owns modeling, design, implementation, investigation and trade-offs.

## Requirement contract

Every substantial Steward project brief or milestone must make the following visible when relevant.

### 1. Context

Explain the organizational or engineering situation that creates the work. The learner should know why the capability matters.

### 2. Required outcome

State what users, operators or the organization must be able to accomplish after the work. Describe observable capability rather than framework structure.

### 3. Business and engineering rules

State rules the learner cannot safely infer. Examples include ownership semantics, forbidden states, lifecycle rules, authorization expectations and evidence obligations.

Do not hide a mandatory domain rule and later assess the learner for failing to invent it.

### 4. Representative scenarios

Provide enough realistic examples to remove semantic ambiguity. Scenarios are examples of the rules, not an exhaustive test script or implementation walkthrough.

### 5. Acceptance criteria

Define externally observable evidence that proves the requirement is satisfied. Criteria should describe behavior, integrity, operability or justified decisions rather than file names or code shapes unless a particular artifact is itself the learning objective.

### 6. Constraints

State only constraints that are genuinely required by the curriculum, existing architecture, environment, security boundary or product direction.

A technology must not appear as a constraint merely because it is fashionable or available.

### 7. Explicitly out of scope

State important adjacent concerns that the learner should not solve yet. This prevents early milestones from becoming accidental enterprise-platform rewrites.

### 8. Engineering decisions owned by the learner

Identify the decisions TSA intentionally does **not** prescribe. Depending on maturity these may include model relationships, rule placement, API shape, transaction boundaries, component boundaries, operational thresholds or technology choices.

### 9. Failure and edge conditions

State or prompt investigation of meaningful failure classes. Early stages may name them explicitly; later stages should increasingly require the learner to discover and prioritize them.

### 10. Evidence and explanation

State what evidence must be preserved: tests, API examples, SQL, diagrams, ADRs, logs, measurements, failure reproductions, runbooks or review records. The learner must also be able to explain the reasoning behind important decisions.

## What TSA must not do

A requirement brief should not normally prescribe all of the following at once:

- exact database tables and columns;
- exact Django model definitions;
- exact serializers, views and service classes;
- exact endpoint implementation structure;
- exact function names;
- a sequence of code snippets that assemble into the finished feature;
- the design decision the learner is meant to practise making.

Teaching material may demonstrate isolated syntax or a small unrelated example before the project. The assessed Steward requirement should still require transfer and reasoning.

## Difficulty progression

Clarity remains high throughout TSA. **Solution ownership** is what changes.

### Level 1 — Guided problem specification

Typical stage: early Builder.

TSA supplies:

- concrete context and actors;
- required capability;
- explicit important business rules;
- representative examples;
- clear acceptance criteria;
- important technical constraints already taught;
- named major failure cases;
- narrow out-of-scope boundary.

The learner owns:

- the data model;
- cardinalities and constraints;
- code organization;
- validation placement;
- implementation details;
- tests beyond the minimum scenarios;
- explanation of the design.

The learner should be able to begin modeling without guessing the product.

### Level 2 — Bounded engineering problem

Typical stage: late Builder through Delivery/Cloud.

TSA supplies the problem, critical invariants, operational outcome and important constraints, but stops specifying many implementation mechanics.

The learner increasingly owns API and component decisions, failure handling, automation structure, infrastructure composition and trade-offs.

Requirements may ask the learner to compare alternatives before implementing one.

### Level 3 — Evidence-driven engineering brief

Typical stage: Quality, Security and Reliability.

TSA supplies the organizational need, important boundaries and required outcome. The learner must investigate the current system, identify important risks or failure modes, propose measurable acceptance, implement controls/capabilities and prove their effect.

The learner is no longer given every test case, threat, SLI or alert threshold.

### Level 4 — Open engineering decision

Typical stage: Architect and Technical Steward.

TSA supplies a credible organizational or system problem, decision authority and constraints. The learner must clarify requirements where necessary, gather evidence, formulate alternatives, choose or deliberately retain the current state, implement justified changes where required and defend the decision.

There may be multiple correct outcomes. Assessment focuses on evidence, coherence, consequences and judgment.

## Ambiguity budget

Difficulty must never be manufactured by poor specification.

### Product ambiguity

Low throughout the academy. Mandatory product behavior must be knowable.

### Implementation ambiguity

Starts moderate and rises. This is where the learner practises design.

### Investigation ambiguity

Starts low and rises substantially in Quality, Security, Reliability, Architect and Technical Steward.

### Decision ambiguity

Starts low-to-moderate and becomes high in later schools because several defensible solutions may exist.

If a learner must ask, "What does the organization actually want this feature to do?" because the brief omitted essential semantics, the requirement is under-specified rather than challenging.

## Requirement quality gate

Before publishing a substantial Steward practical or milestone, the author must be able to answer yes to these questions:

1. Can the learner state the problem without reading implementation instructions?
2. Are mandatory business rules explicit or already established by a canonical referenced specification?
3. Is there enough information to create a first domain/system model?
4. Are acceptance criteria observable and testable/reviewable?
5. Are important supplied constraints distinguished from decisions the learner owns?
6. Is the out-of-scope boundary clear enough to prevent premature complexity?
7. Does the task require at least one meaningful engineering decision?
8. Does it require evidence of behavior, failure, reasoning or trade-offs rather than only a running application?
9. Is the expected difficulty appropriate for concepts taught before this task?
10. Would a competent learner be challenged by engineering rather than by guessing hidden requirements?

If the answer to any material question is no, revise the assignment before using it.

## Example — early Builder

### Weak

> Implement team and service ownership in Django.

This is too vague about the product and too framework-oriented.

### Appropriate

> An engineering organization registers technical services against the teams accountable for them. Every service must have exactly one owning team. Service slugs must be unique. A team that still owns active services cannot be deleted until ownership is resolved. Build the first Steward capability that lets engineers register and query teams and services while preserving those rules.

Representative scenarios:

- Payments API can be registered under Payments Engineering.
- Two services cannot share the same slug.
- A service cannot be created without an owner.
- Deleting Payments Engineering while it owns an active service is rejected.

Acceptance includes successful registration/querying and proof that the invalid states above cannot be persisted through supported application paths.

The learner decides the relational model, foreign-key behavior, validation layering, endpoint organization and tests.

## Example — Security Steward

> A review found that valid Steward users may attempt to mutate services outside the teams they are authorized to manage. Steward must enforce resource-aware authorization consistently across normal and nested mutation paths. Unauthorized callers must not gain useful information about protected resources beyond the agreed API semantics. Investigate the current authorization surface, define the abuse cases that matter, implement proportionate controls and prove them with negative-path evidence.

The requirement describes the security outcome. The learner owns the authorization design and evidence strategy within established identity and architecture constraints.

## Example — Reliability Engineer

> Engineering teams now rely on Steward during operational work. Define reliability objectives for the user journeys that matter, instrument the service so those objectives can be measured, and create an alerting strategy that detects meaningful degradation without producing avoidable noise. Use observed behavior to defend the indicators, targets, windows and alert thresholds you choose.

The learner must discover and justify the measurement model rather than receive a preselected SLO.

## Example — Architect / Technical Steward

> Steward's accumulated platform has become expensive to operate and change. Determine which architectural and platform capabilities still earn their complexity. Use current delivery, reliability, security, usage and ownership evidence to recommend retain, simplify, replace or remove decisions. Implement only changes whose evidence and sequencing justify implementation now; record revisit triggers for the rest.

A decision to retain the current state can be correct. Novelty is not the assessment target.

## Relationship to the Steward roadmap

This standard complements:

- [`steward.md`](./steward.md) — canonical product/domain definition;
- [`steward-api-evolution-map.md`](./steward-api-evolution-map.md) — when Steward capabilities may enter the journey.

The evolution map controls **when** a capability is appropriate. This document controls **how the requirement is presented** to the learner.

Future Steward curriculum changes must satisfy both.