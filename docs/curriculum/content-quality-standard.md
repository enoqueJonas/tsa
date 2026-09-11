# TSA Curriculum Content Quality Standard

## Purpose

Build Wide established the complete Technical Stewardship Academy journey and Build Deep replaced curriculum scaffolding with fully authored lessons across all 12 schools. The next curriculum phase is **Content Quality**: reviewing the learner experience lesson by lesson and improving material that is technically correct but too thin, repetitive, overly templated or insufficiently experiential.

Content Quality is not a new breadth phase and it is not permission to rewrite strong material for stylistic consistency. The goal is to preserve strong authored content while improving weak learning experiences using evidence from the curriculum itself and, later, learner use.

## Core principle

A TSA lesson should help the learner **understand, try, investigate, build, fail safely, explain and preserve evidence**. It should not feel like a documentation page followed by a mechanically generated checklist.

The curriculum remains self-sufficient: TSA-authored teaching must teach the concept. External documentation, books, articles and videos reinforce, verify or extend that teaching rather than substitute for it.

## Content-quality classification

During a content-quality audit, lessons or modules may be classified as:

- **Rich** — strong teaching, meaningful examples, appropriate practice and evidence; preserve unless a concrete defect is found.
- **Thin** — correct but lacking sufficient explanation, worked reasoning, progression, examples, failure exploration or practice depth.
- **Scaffolded / templated** — structurally complete but learner activities are generated from a generic wrapper that makes distinct concepts feel like the same exercise.
- **Needs correction** — technically, pedagogically or sequentially misleading and therefore requires direct repair.

Classification is diagnostic, not a score. A module can contain rich readings and scaffolded practical work at the same time.

## TSA learning progression

A strong practical lesson normally follows the relevant subset of this progression:

```text
Context / Why
        ↓
Mental model
        ↓
Worked example
        ↓
Small guided experiment
        ↓
Engineering assignment
        ↓
Failure / edge case
        ↓
Evidence
        ↓
Review / reflection
```

This is a progression, not a mandatory visual template. Some lessons are primarily conceptual, investigative, operational, design-oriented or reflective and should use the structure that best serves the objective.

## Practice standard

Practice must be authored around the engineering capability being developed. Reusable code helpers are acceptable, but they must not flatten every lesson into the same scenario, deliverables and completion criteria.

Good TSA practice may take forms such as:

- a development ticket with explicit business rules;
- an incident or debugging investigation;
- a protocol observation exercise;
- a data-model or migration review;
- a pull-request review or refactoring task;
- a security assessment in an isolated learner-owned environment;
- an operational failure/recovery exercise;
- an architecture decision under changing constraints;
- a governance, risk or control review;
- a design defence or evidence review.

The form should match the discipline. Variety is useful only when it improves learning; artificial role-play is not required.

## Guided-to-independent progression

Scaffolding should decrease as capability grows.

Early lessons may provide exact commands, worked examples and narrow instructions. Later lessons should increasingly provide goals, constraints, evidence requirements and realistic ambiguity while requiring the learner to choose the implementation or investigation path.

A learner should not finish TSA merely able to follow increasingly long checklists. By later schools, they should be able to determine what evidence is needed, select an appropriate method, defend trade-offs and recognize when the available evidence is insufficient.

## Continuing-system principle

Steward remains the primary continuing system through the main TSA journey. Practice should reuse it when doing so creates authentic continuity and cumulative evidence.

Do not force every exercise into Steward. Disposable or isolated experiments are appropriate when they make a concept safer, clearer or less architecturally artificial. Professional Engineer deliberately uses an independent substantial capstone to prove transfer of judgment.

## Failure and edge-case standard

Engineering competence includes understanding how behavior fails. Where relevant, practice should include at least one meaningful negative path, boundary condition, competing design, degraded state or incorrect assumption.

Failure must not be added mechanically. The selected failure should expose something important about the concept being taught.

Examples:

- Python environment work can distinguish interpreter, environment and package-location failures.
- HTTP work can distinguish DNS, TCP/TLS, protocol and application failures.
- data work can exercise constraint violations, migration risk or query-plan assumptions.
- authorization work can prove that valid authentication does not imply permission.
- reliability work can exercise recovery rather than merely configure a recovery mechanism.

## Evidence standard for practice

Evidence should prove the capability claimed by the exercise. Depending on the task this may include executable code, commands and output, tests, SQL/query plans, logs, traces, screenshots, decision records, diagrams, review notes, pipeline results or recovery observations.

Screenshots are supporting evidence, not automatically authoritative evidence. Prefer reproducible evidence when the claim can reasonably be reproduced.

Exercises should avoid generic evidence requirements such as “provide a screenshot and short note” when more specific evidence would better demonstrate the objective.

## Review questions

Knowledge checks and reflections should test reasoning, not merely terminology recall. Useful questions ask the learner to:

- explain observed behavior;
- distinguish similar concepts;
- diagnose a failure;
- predict consequences;
- justify a trade-off;
- identify what evidence would change a decision;
- connect the lesson to prior or future engineering work.

## Content-quality repair rule

When auditing an existing module:

1. preserve strong authored material;
2. identify the exact weakness before editing;
3. repair thin explanations only where additional teaching is needed;
4. replace repetitive generic practice with capability-specific practice;
5. preserve curriculum sequence and established domain decisions unless a genuine flaw is discovered;
6. verify that examples, assignments, evidence and knowledge checks agree with each other;
7. keep external resources curated and subordinate to TSA-authored teaching;
8. run the platform build after each coherent repair increment.

Do not normalize every lesson into one large “perfect lesson” template. Content quality means purposeful depth, not maximum length.

## Initial Builder audit finding

The first Content Quality audit begins with Builder because it exposed the distinction between **deep-authored structure** and **high-quality learner experience**.

The initial finding is deliberately surgical:

- Identity, Authentication and Authorization and the Builder milestone already demonstrate strong capability-specific scenarios and evidence expectations.
- Web/API, Django, PostgreSQL and Software Craft contain substantial strong teaching but some practical activities remain structurally repetitive.
- Programming with Python is the first repair target because its lesson depth is less consistent and its shared Engineering Practice wrapper makes distinct Python capabilities feel too similar.

The repair sequence should therefore begin with Programming with Python, then reassess the remaining Builder modules based on actual content rather than rewriting them wholesale.
