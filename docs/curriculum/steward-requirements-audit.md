# Steward Requirements Audit

## Scope

This audit compares the implemented TSA curriculum against the Steward Requirement Authoring Standard, with particular attention to whether project work is:

- clear enough to model and implement;
- challenging through engineering decisions rather than hidden requirements;
- progressively less prescriptive as learner capability grows;
- aligned with the canonical Steward domain and evolution map.

The audit sampled the actual platform/runtime curriculum, including Builder's Steward API milestone and learning paths, System Thinker's Steward portfolio milestone, and the Technical Steward milestone.

## Overall finding

**Status: PARTIALLY ALIGNED — strong foundation, targeted curriculum corrections required.**

The current platform is substantially better than a tutorial curriculum. It already provides context, scenarios, deliverables, completion criteria, failure reasoning and evidence gates. The Steward API milestone is coherent and the later milestones demand significant independent judgment.

However, the current implementation sometimes over-prescribes the solution—especially in Builder—and later curriculum contains signs of architecture/tool commitments that are stronger than the canonical evolution map permits. The main risk is not vague requirements; it is that some activities tell the learner too much about *how* to build the solution or assume technologies before evidence justifies them.

## Audit dimensions

| Dimension | Finding | Assessment |
| --- | --- | --- |
| Product context | Steward activities consistently explain the engineering-service-registry problem | Strong |
| Mandatory business rules | Builder milestone makes important ownership/dependency/environment rules explicit | Strong |
| Representative scenarios | Present throughout milestone scenarios and evidence gates | Strong |
| Acceptance criteria | Practical activities consistently expose `completionCriteria` | Strong |
| Failure behavior | Builder explicitly covers malformed, validation, 401/403/404/conflict/500; later stages deepen failure analysis | Strong |
| Evidence requirements | SQL, EXPLAIN, auth denials, docs, ADRs and later governance evidence are explicit | Strong |
| Out-of-scope control | Product roadmap is strong, but individual platform activities do not always repeat/observe it | Mixed |
| Learner-owned design | Present conceptually, but some Builder instructions prescribe model/API/technology decisions | Needs correction |
| Difficulty progression | Later schools clearly demand more investigation and defense | Strong, with exceptions |
| Technology justification | Canonical docs require evidence; some implemented later milestones assume Redis/RabbitMQ/platform stack too strongly | Needs correction |

## Builder audit

### What is working

The Builder milestone is unusually clear and gives the learner a credible release mission. It explicitly identifies the canonical domain, important invariants, handoff expectations and multiple evidence gates.

The sequence from domain/contract review → implementation → data evidence → security evidence → engineering handoff is pedagogically strong. It makes a running API insufficient on its own.

The milestone also gives enough domain information to model the system. A learner should not have to guess what `Team`, `Membership`, `Service`, `Environment`, `ServiceDependency` and `ServiceReview` mean or which important invariants are mandatory.

### Where it over-prescribes

Several Builder instructions cross from requirement clarity into solution prescription. Examples include:

- explicitly requiring the learner to implement the named entities rather than first model the stated domain and defend the model;
- prescribing JWT access + refresh rather than first expressing the authentication/session requirements and allowing a bounded decision where the curriculum supports it;
- prescribing exact endpoint families in the design gate;
- some Django lessons show Steward-shaped implementation code and then ask the learner to implement almost the same Steward construct;
- detailed framework instructions can reduce transfer because the project becomes an assembly of lesson outputs.

Not every prescription is wrong. Builder is an early stage and Django/DRF/PostgreSQL are intentional curriculum constraints. The correction is to distinguish **technology constraints** from **solution design**. The learner can be required to use Django/DRF/PostgreSQL while still owning model cardinalities, rule placement, API resource shape and internal organization.

### Builder target

Builder should operate primarily at Requirement Difficulty Level 1, moving toward Level 2 by the milestone.

The learner should receive:

- explicit domain semantics and invariants;
- framework/database constraints already taught;
- representative success/failure scenarios;
- clear acceptance and evidence criteria.

The learner should own:

- final relational model and cardinalities;
- constraint layering;
- endpoint/resource design within REST expectations;
- transaction boundaries;
- code organization;
- test design beyond supplied representative scenarios;
- explanation and defense of decisions.

## System Thinker audit

### What is working

The milestone correctly moves away from coding instructions and toward reconciliation, modeling, boundaries, data flow, failure reasoning and ADRs. It explicitly says requirements should describe behavior rather than mirror implementation structure and that architecture must not be manufactured for novelty.

This is appropriate progression from Builder.

### Misalignment found

The implemented milestone repeatedly references Redis and RabbitMQ as if they may already have entered the system and requires evidence/decisions around them. The canonical Steward evolution map says System Thinker should primarily model the existing system and **not add features merely to satisfy the school**. Distributed components are allowed only when evidence justifies them.

The milestone does contain warnings against manufacturing architecture, which mitigates the problem, but the repeated named-tool prompts create curriculum pressure to introduce or retain those technologies.

### System Thinker target

Rewrite named Redis/RabbitMQ requirements into conditional distributed-state questions. If the learner has no justified cache or broker, the valid evidence should be a decision to remain simpler. If a distributed component exists, then authority, consistency, retry, idempotency and failure analysis become required.

## Technical Steward audit

### What is working

The Technical Steward milestone is appropriately difficult. It asks for evidence-backed governance decisions, residual-risk reasoning, control effectiveness, proportionality, challenge/dissent and retain/simplify/replace decisions. Multiple correct outcomes are possible.

This strongly matches Requirement Difficulty Level 4.

### Misalignment found

The scenario describes a very specific mature ecosystem—PostgreSQL, Redis, RabbitMQ, OpenTofu, OpenShift/Kubernetes, Argo CD, Kong, Keycloak, Jenkins, Nexus and shared packages—and several deliverables require reviews of those named technologies.

This conflicts with the canonical rule that technologies such as distributed components, OIDC infrastructure and platform layers enter only when justified. It risks making tool adoption an implicit graduation prerequisite even though the evolution map explicitly states that distributed architecture is not mandatory.

### Technical Steward target

The milestone should review **the actual accumulated Steward ecosystem**. Named enterprise technologies should be examples or conditional review targets when present. The learner must be able to justify retain/simplify/replace/remove decisions for whatever platform actually exists, including a simpler architecture.

## Platform/UI representation audit

The current runtime content model already supports the requirement contract well:

- reading activities can provide context and product briefs;
- practical activities expose `objective`, `scenario`, `instructions`, `deliverables` and `completionCriteria`;
- assessment gates derive from practical completion criteria;
- evidence workspace allows reasoning and artifacts to be preserved;
- project tracking and portfolio views reinforce milestone ownership.

Therefore, a new platform feature is **not required** to enforce clearer requirements. The main work belongs in curriculum content. A future content-schema enhancement could add first-class `constraints`, `outOfScope` and `learnerDecisions` fields, but this is optional; headings/blocks can already express them.

## Required remediation

### Priority 1 — Builder requirement calibration

Audit Steward-facing Builder practicals and milestone instructions. Keep Django/DRF/PostgreSQL as curriculum constraints where intended, but rewrite instructions that unnecessarily prescribe the domain solution the learner should model.

### Priority 2 — System Thinker conditional architecture

Remove implicit Redis/RabbitMQ adoption pressure. Make distributed-state analysis conditional on evidence and explicitly allow a no-cache/no-broker outcome.

### Priority 3 — Later-school actual-stack principle

Update milestones that enumerate a mandatory enterprise stack so they instead inspect the **actual justified Steward stack**. Named technologies may remain examples and conditional checks.

### Priority 4 — Difficulty labels during curriculum maintenance

When materially revising Steward milestones, identify the intended requirement difficulty level (1–4) in authoring notes or audit documentation. It does not need to appear in learner UI.

## Decision

The platform architecture is capable of delivering the desired learning model. **Do not redesign the TSA application for this concern.**

The curriculum content needs a focused remediation pass so the implemented Steward journey fully matches the newly formalized standard.

The next implementation work should therefore be curriculum PRs, not UI/platform feature work.