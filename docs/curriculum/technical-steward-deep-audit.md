# Technical Steward — Deep Curriculum Audit

Status: active regression record  
Evolution contract: `technical-steward-evolution.md`

## Audit conclusion

Technical Steward already has unusually strong governance/risk/assurance breadth and generally avoids approval-theater. The main structural gap was explicit technology strategy and capability/investment planning: governance could align and oversee technology, but the curriculum did not yet teach the learner to form a coherent multi-horizon set of technology choices and non-choices.

That gap is now a runtime module.

## Canonical progression

1. Technical Leadership
2. Engineering Governance
3. IT and Technology Governance
4. Technology Strategy and Capability Planning
5. Technology Risk
6. Controls, Compliance and Assurance
7. Architecture Governance
8. Security and Data Governance
9. Change and Service Governance
10. Third-party and Technology Lifecycle Risk
11. Technical Debt and Engineering Health
12. Engineering Handbook and Standards
13. Technical Stewardship Review

## Findings resolved

### Stale Jenkins reference
The final milestone still described Jenkins CI as a TSA implementation. It now uses GitLab CI/CD.

### Missing technology-strategy synthesis
Added Technology Strategy and Capability Planning with:
- outcomes and horizons;
- strategic choices/non-choices;
- capability mapping;
- investment prioritization;
- build/buy/learn/simplify/retire;
- evidence-gated roadmaps.

This module deliberately requires explicit deferred/rejected investment to prevent strategy from becoming a wishlist.

### Missing school-wide evolution contract
The new contract distinguishes architecture decisions from organizational stewardship and defines governance proportionality, delegation, risk acceptance, controls, standards and retirement rules.

## Strong existing areas

- Technical Leadership emphasizes ownership and influence without authority rather than heroics.
- Engineering Governance cleanly distinguishes governance from management/execution and teaches decision rights.
- Technology Governance covers alignment, value, resources, performance and framework landscapes.
- Technology Risk uses cause/event/consequence scenarios, avoids false precision and distinguishes inherent/residual risk.
- Controls/Assurance separates objectives, control design and operating effectiveness.
- Architecture Governance explicitly avoids becoming a duplicate architecture school.
- Security/Data Governance reuses Security Steward evidence and focuses on accountability/policy/data ownership.
- Change/Service Governance is risk-based and rejects universal manual approval queues.
- Third-party/Lifecycle Risk goes beyond CVEs into supportability, licensing, concentration, continuity, exit and EOL.
- Technical Debt/Health connects debt to measurable organizational consequences and permits do-nothing decisions.
- Handbook/Standards emphasizes usable, owned, verifiable standards and organizational memory.
- Final milestone inventories actual active/temporary/retired/proposed technologies rather than assuming every technology encountered in TSA remains deployed.

## Remaining gap: learning resources

Most Technical Steward deep modules currently contain strong authored material but no structured `LearningResource` blocks.

A dedicated resource pass should add targeted primary/authoritative material for:
- technical leadership and decision-making;
- governance vs management and decision rights;
- COBIT / ISO 38500 / ITIL concepts where explicitly taught;
- technology strategy/capability planning;
- ISO/NIST risk concepts and risk acceptance;
- controls/design/operating effectiveness and assurance;
- architecture governance/ADRs/standards/exceptions;
- security/data governance;
- change/service governance;
- third-party/lifecycle/EOL risk;
- technical debt/engineering health;
- handbook/standards/organizational knowledge.

Avoid framework dumping. A COBIT lesson can use COBIT; every governance lesson should not receive COBIT/ITIL/ISO/NIST simultaneously.

## Regression questions

- Does the decision trace to an organizational outcome, obligation or material risk?
- Is a capability distinguished from the product currently implementing it?
- Are decision rights explicit and proportionate?
- Can low-risk decisions remain delegated?
- Does strategy include non-choices and opportunity cost?
- Are investments evaluated for skills/operations/lifecycle as well as acquisition?
- Are risk acceptance and exception authorities explicit?
- Does every material control trace to an objective/risk and evidence?
- Is architecture governance consuming Architect evidence rather than redesigning?
- Is security governance consuming Security evidence rather than retesting vulnerabilities?
- Is service governance consuming Reliability evidence rather than recreating incident operations?
- Are third-party decisions considering exit and concentration?
- Is technical debt connected to consequences rather than aesthetics?
- Do standards have owner, scope, verification and exception/lifecycle paths?
- Can technology be retired when it no longer earns its cost?
- Is every declared module reachable in runtime?

## Runtime integrity

The new strategy/capability module is imported and included in `technicalStewardPaths`. Repository-wide Jenkins search is clean after the milestone correction.
