# Steward Requirements Audit

## Scope

This audit compares the implemented TSA curriculum against the Steward Requirement Authoring Standard: requirements must be clear enough to model and implement, challenging through engineering decisions rather than hidden semantics, and progressively more demanding as learner capability grows.

## Updated decision after review

**Status: PARTIALLY ALIGNED — remediation in progress.**

The original audit correctly identified over-prescription in parts of Builder and correctly identified that technology should not appear without a reason. It was too conservative, however, in treating deliberate technology exposure itself as a problem.

TSA is an academy. It is valid—and desirable—to **manufacture a credible engineering scenario specifically so the learner can implement an important enterprise technology**. The curriculum should manufacture the pressure, not fabricate a retrospective justification for a tool that was already chosen.

The governing principle is now:

> **Scenario-forced learning, not tool-forced architecture.**

TSA can guarantee hands-on experience with selected technologies while still teaching restraint. A technology introduced for learning does not automatically become permanent architecture.

## What the platform already does well

The runtime content model supports the learning contract without a UI redesign: practical activities provide objective, scenario, instructions, deliverables and completion criteria; assessment gates derive from criteria; evidence and project tracking preserve learner reasoning.

The curriculum also already contains several strong examples of the desired pattern. Jenkins is the primary CI implementation while GitHub Actions is compared rather than duplicated. The Kubernetes material begins from orchestration responsibility rather than treating Kubernetes as a Docker replacement.

## Corrected technology policy

### Primary implementation

For capabilities TSA intends the learner to practise deeply, one primary technology is implemented in Steward. Examples include Redis for shared caching, RabbitMQ for broker mechanics, Jenkins for self-hosted CI, Nexus for artifact/dependency management, Kubernetes for orchestration and Argo CD for GitOps.

### Comparison

A credible alternative is studied without becoming a second permanent production implementation. RabbitMQ versus Kafka and Jenkins versus GitHub Actions are examples.

### Migration/replacement

When migration itself is the learning objective, temporary duplication is allowed. The exercise must define semantic mapping, bounded coexistence, authoritative path during transition, cutover, rollback and decommission/retention. It must end with one primary implementation unless two distinct requirements genuinely remain.

## Curriculum progression decision

The product is intentionally evolved so later technologies become understandable responses to new pressures.

System Thinker receives explicit catalogue-read and asynchronous-side-effect scenarios so Redis and RabbitMQ can be implemented and broken deliberately.

Cloud Engineer receives an explicit orchestration pressure: multiple deployable workloads, health-based replacement, controlled rolling releases, configuration/secrets boundaries, service discovery, horizontal replica management and environment consistency. This makes Kubernetes a meaningful implementation rather than a checklist item. OpenShift becomes a migration/platform-delta exercise rather than a second permanent orchestrator.

Delivery Engineer gains a bounded CI migration exercise so the learner practises moving pipeline guarantees rather than merely learning a second CI syntax.

Technical Steward reviews the actual accumulated stack, including migration history and retired technologies. Historical curriculum exposure does not force permanent retention.

## Remaining remediation

### Priority 1 — Builder calibration

Still required. Builder must keep product/domain rules explicit while giving the learner more ownership of the relational model, rule placement, API organization and implementation structure. Framework constraints can remain explicit.

### Priority 2 — Cross-school scenario continuity

Audit later paths to ensure every primary technology has a preceding scenario that establishes the capability pressure before implementation. The strongest cases should follow baseline → pressure → implementation → failure → evidence → later reassessment.

### Priority 3 — Redundancy audit

Check the curriculum for places where two tools substantially own the same capability. Convert unnecessary duplicates into comparisons or bounded migrations.

### Priority 4 — Migration exercises

Add migration exercises selectively where they teach meaningful engineering skills. Do not add migrations merely to increase tool count.

## Decision

The TSA application architecture remains sufficient. Curriculum content—not UI redesign—is the correct place for these changes.

The final target is not a minimal Steward stack and not an infrastructure zoo. It is a deliberately evolved enterprise system in which the learner has implemented important technologies, understands why each was introduced, has experienced migrations, and can later decide what should remain.