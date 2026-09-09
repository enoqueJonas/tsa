# Technical Stewardship Academy Curriculum

This directory is the durable curriculum specification for TSA.

## Curriculum principle

TSA is one continuous engineering apprenticeship, not a collection of disconnected tutorials. The learner builds and evolves real systems across the journey. Each school builds on capabilities and infrastructure created previously.

The primary continuing project is **Steward**, an internal Engineering Service Registry and Technology Stewardship platform. Its canonical product/domain definition lives in [Steward — Product and Domain Definition](../product/steward.md). It begins as a serious locally running backend and progressively becomes designed, hosted, delivered, tested, secured, observed, operated, architected, governed and evolved.

## Engineering values

- Evidence Before Opinion
- Learning Before Ego
- Progress Before Perfection

## Journey

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

See [Technical Stewardship Journey](./technical-stewardship-journey.md) for the curriculum-wide specification.

## Cross-journey capability specifications

Some engineering capabilities deliberately begin in one school and mature across several later schools. They are recorded separately when reducing them to a single module would lose that progression.

- [Internal Dependency and Artifact Management](./internal-dependency-management.md) — Builder creates a genuinely reusable internal package; Delivery Engineer builds the private artifact/package platform and CI publication flow; later schools secure, test, observe, architect and govern the dependency ecosystem.
- [Curriculum Breadth Audit](./breadth-audit.md) — records the transition from Build Wide to Build Deep, the curriculum-wide continuity review, deep-authoring watch items and the lesson/milestone evidence standards.

## Learning model

Each school may contain:

- modules
- full publication-quality lessons
- curated required and additional resources
- worked examples and code examples where appropriate
- first-class practice labs on the TSA platform
- exercises and investigations
- knowledge checks and reflections
- handbook entries
- portfolio artifacts
- milestone projects
- capability evidence

Lessons and exercises may have different resources. Resources are attached where they are useful; the same resource should not be duplicated mechanically between lesson and exercise.

## Deep lesson standard

A deep-authored TSA lesson is a technical learning document, not a large paragraph inside an activity card. Where the subject warrants it, lessons should use structured sections, clear typography, headings, lists, examples, syntax-highlighted code blocks, callouts, diagrams or tables, assignments, curated resources and knowledge checks.

TSA-authored teaching must be sufficient to teach the concept. External documentation, books, articles and videos reinforce or extend the lesson rather than becoming a substitute for the curriculum itself.

A strong lesson normally contains the relevant subset of:

```text
Introduction / why this matters
Learning outcomes
Concept sections
Mental models
Worked examples
Code / command / query examples
Steward connection where natural
Common mistakes / warnings
Required or supporting resources
Assignment / engineering practice
Evidence expectations
Knowledge check / reflection
```

Not every lesson needs every block. Structure follows the learning objective rather than a mechanical template.

## Build-wide-then-deep rule

**Build Wide is complete.** All 12 schools have runnable curriculum breadth, including modules, lessons, labs and milestones.

TSA is now in **Build Deep**. The reference rich-lesson renderer and the first publication-style lesson were prototyped during Builder work specifically so the academy could validate the experience before multiplying it across hundreds of lessons.

The deep-authoring execution order is now locked as:

```text
1. Deep-author every Engineering Apprentice lesson to the publication-quality standard
2. Deep-author Builder, module by module, while building Steward API v1
3. Deep-author System Thinker
4. Deep-author each remaining school in journey order
```

This means the temporary Builder prototype is a design reference, not permission to skip ahead. Once the lesson experience is accepted, authoring returns to Engineering Apprentice and proceeds sequentially through the academy.

The breadth audit remains the guardrail. Significant structural changes are allowed when research or implementation evidence exposes a genuine missing prerequisite, weak sequence or capability gap, but deep authoring should not casually reopen curriculum breadth.

The curriculum specification is a living document. Significant changes should be intentional and committed to the repository so the academy plan is never dependent on chat history.
