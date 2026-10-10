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

## Concept-first teaching contract

Technical depth must not displace basic teaching. A lesson should introduce a concept in the order a learner needs in order to understand and use it, not in the order an architect might review its consequences.

For foundational technical topics, prefer this progression when it fits:

1. define the concept in plain technical language;
2. explain the problem it solves and when it is useful;
3. show the smallest working example;
4. explain the important lines, syntax, or moving parts;
5. show the expected result when the example has a useful observable result;
6. let the learner make a small change or use the concept;
7. introduce nearby concepts and compare them explicitly;
8. explain common mistakes and failure modes;
9. introduce deeper engineering implications such as dependency direction, lifecycle, security, performance, or operability;
10. apply the concept to the continuing Steward system only after the learner understands it independently.

Do not begin an introductory lesson with an architectural consequence when the underlying mechanism has not yet been taught. For example, teach what Python modules and imports are and let the learner use them before discussing circular dependencies and dependency direction.

### Simple example before domain example

When a concept is new, the first example should minimize unrelated cognitive load. Prefer a tiny domain-neutral example when a Steward-specific example would require the learner to understand unfamiliar domain functions, package structure, or architecture at the same time.

A later Steward example should then demonstrate transfer into the continuing project. The simple example is not disposable filler: it isolates the new idea so the learner can see what changed.

### Explain examples, do not merely display them

Code blocks are teaching material, not decoration. Surrounding prose should tell the learner what unfamiliar syntax does, what to notice, and how the example demonstrates the concept. Avoid presenting a code block and immediately jumping to an architectural conclusion that the learner has not yet been shown how to derive.

### Observable output rule

When seeing the result materially helps understanding, show the expected result.

- Use an inline source comment for a short, local result where keeping cause and result together is clearer, such as `print(total)  # 8`.
- Use a distinct output/terminal block for multiline output, structured data, tracebacks, command output, or any result the learner should inspect separately.
- Do not duplicate the same output both inline and in a separate block without a teaching reason.
- Do not add output mechanically to definitions or fragments that have no meaningful immediate result.
- Expected output must agree with the code. Environment-dependent output must be labelled representative.

### Authoritative-source adaptation

TSA should not reinvent established introductory explanations merely to sound distinctive. Authors should consult authoritative documentation and high-quality educational sources for terminology, topic ordering, and canonical examples, then write an original TSA explanation adapted to the learner's stage and the continuing curriculum. Do not copy substantial protected prose.

The TSA value is the combination of accurate teaching, deliberate sequencing, exercises, engineering context, and cumulative application—not unusual wording for familiar concepts.

## Cumulative implementation contract

When an exercise changes the continuing Steward system, it must follow the canonical [Steward Increment Contract](./steward-increment-contract.md).

In particular, substantial implementation work must not depend on fictional prior work. The exercise must make the current artifact, requested change and observable completion state clear enough for the learner's present level. Early Builder work should be highly concrete; later schools deliberately reduce scaffolding as capability grows.

Acceptance criteria should describe behavior the learner can verify. Narrative continuity is not evidence that an implementation exists.


## Foundational concept completeness

A lesson marked or treated as deep-authored is not complete merely because it has several headings, code examples and an engineering exercise. For foundational concepts, the authored teaching must leave the learner with a durable working model that supports later independent research.

Where applicable, a foundational lesson should teach:

- **purpose and mental model** — what problem the concept solves and how to reason about it;
- **core mechanics** — how to create, read/access, update, delete and iterate over it;
- **common operations and vocabulary** — the methods, operators and standard-library tools a working engineer will encounter regularly;
- **real use cases** — several representative situations, including at least one outside the continuing Steward example when that improves transfer;
- **guarantees and limitations** — ordering, uniqueness, mutability, identity, typing/schema behavior, concurrency or persistence implications as relevant;
- **failure modes and traps** — common exceptions, surprising behavior, misuse and boundary conditions;
- **trade-offs and alternatives** — when to choose the concept and when a neighboring abstraction is a better fit;
- **performance intuition** — the important relative cost model when it materially affects normal engineering decisions, without turning an introductory lesson into an algorithms course;
- **worked comparison** — when several related concepts are taught together, compare them explicitly rather than expecting the learner to infer the decision rule;
- **transfer check** — practice or questions that require choosing or explaining the concept in a new situation rather than repeating the worked example.

Not every bullet applies to every topic. The author must decide deliberately rather than omit coverage because the lesson already looks substantial.

### Foundation-complete does not mean encyclopedic

TSA should teach the stable, high-frequency knowledge that makes later documentation useful. It does not need to reproduce an entire language reference or product manual.

A useful boundary is:

> After this lesson, can the learner solve ordinary problems with the concept, explain its important constraints, recognize common mistakes, and know what narrower detail to research when an unfamiliar case appears?

If the answer is no, external resources are compensating for missing TSA teaching and the lesson is still thin.

### Related-concept comparison rule

When a lesson introduces several alternatives—such as list/tuple/dict/set, process/thread, authentication/authorization, queue/stream, or cache/database—it must include an explicit decision model. At minimum, show:

1. what guarantee or access pattern distinguishes each option;
2. one strong use case for each;
3. one poor-fit case or limitation for each;
4. the high-frequency operations the learner will actually perform;
5. a scenario where choosing the wrong option causes a concrete problem.

A comparison table is appropriate when it reduces cognitive load, but the lesson must still explain the reasoning behind the table.

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


## Teaching voice and executable examples

TSA content should read like an experienced engineer teaching another engineer, not like generated reference prose.

- Prefer concrete explanations, natural transitions, and direct examples over repeated abstract formulations such as "X establishes", "X represents", or "X is not merely Y".
- Technical precision is never traded for casualness. Human voice means clearer reasoning, not reduced depth.
- Explain why a learner should care before expanding the abstraction when the motivation is not already obvious.
- Avoid repeating the same sentence rhythm across adjacent sections.
- Keep domain language where it carries real meaning, but do not force Steward terminology into every sentence.

For executable code:
- When an example has deterministic observable output, include that output explicitly in the lesson block.
- Do not hide expected terminal output inside source-code comments when a separate output panel can show it.
- When a snippet intentionally produces no output, say so when that fact helps the learner understand what execution did.
- When output is environment-dependent, label it as representative rather than inventing an exact machine-specific result.
- A code example should make clear whether it is meant to be executed as-is, completed by the learner, or read as an illustrative fragment.


### Do not pretend the curriculum project already exists

Foundational lessons should teach the concept in natural, domain-neutral language such as "a program", "an application", "a service", or "a system" unless the learner has already built the relevant Steward capability.

Steward is a continuing project, not a fictional product that the prose should pretend is already running. Use it when the learner is actually designing, building, integrating, testing, operating, or evolving a concrete Steward artifact. Do not force Steward names into basic language/syntax explanations merely to create continuity.

A useful test: if replacing "Steward" with "a program" makes a foundational explanation sound more natural without losing meaning, prefer the neutral wording. Project continuity should come from real implementation milestones and exercises, not repeated branding inside every concept paragraph.


### Targeted required reading

A lesson must not send the learner to a large manual, specification, book, tutorial, or documentation root and simply label it "required reading".

For every required or supporting resource:
- state the exact chapter, section, heading, page range, RFC section, tutorial step, or documentation page that is relevant;
- deep-link directly to that section or page whenever the source exposes a stable URL/anchor;
- include a short `Read:` instruction so the learner knows where the assigned slice starts and ends even if the external site's anchors change;
- explain why the assigned slice matters when the connection is not obvious;
- do not assign an entire documentation set when a few sections satisfy the learning objective;
- distinguish material that should be read now from reference material that is useful to keep nearby.

Existing curriculum resources must be migrated to this standard school by school. Do not remove useful authoritative sources merely because they are large; narrow the assignment and deep-link to the relevant part instead.


### Use the medium that teaches the lesson best

Do not treat "further reading" as text-only. A lesson may assign a video, talk, recorded demonstration, interactive lab, or strong technical blog post when that medium teaches the objective better.

Video selection is lesson-driven, not quota-driven. Basic syntax or a small factual concept often needs no video. Prefer video where motion, sequence, topology, UI behavior, live diagnosis, operational workflow, or a worked engineering discussion adds real value.

Before adding a video, record it in the multimedia resource audit and compare plausible candidates. For long videos, assign the exact timestamp range to watch and state what the learner should notice. Use a timestamped link when possible. Do not require an hour-long course lecture for a ten-minute learning objective.

Authoritative documentation remains the source of truth for exact commands, APIs, configuration, standards, and version-specific behavior; a video complements rather than silently replaces it.


## Inline technical notation

Learner-facing prose must visually distinguish code and syntax from ordinary language.

- The shared renderer does **not** infer technical meaning from words. Inline-code styling is applied only to text explicitly wrapped in backticks by the curriculum author.
- Authors MUST wrap a token in backticks when the sentence is referring to that token as code or machine-readable notation: language keywords such as `def` or `return`, identifiers, commands, filenames/paths, annotations, configuration keys, operators, literal values, API routes and similar terms.
- Decide from the **meaning of the sentence**, not from a keyword list. A word is not technical merely because a programming language reserves it. For example, JavaScript `let` is inline code in “declare the variable with `let`”, but remains ordinary prose in “default values let callers omit an argument.” Likewise ordinary English uses of “return”, “class”, “for”, “while”, “interface”, “package”, “import”, “select” and “post” remain prose.
- Inline technical notation is semantic, not decorative emphasis. Use ordinary emphasis for conceptual stress.
- Full commands or multi-line examples belong in code blocks rather than a sequence of inline chips.
- The rendered convention is monospace text with a subtle background, border and radius; authors should not encode presentation classes in curriculum source.

Example: `def` binds a function name; `return` sends a value to the caller; run `git status` before changing the working tree.
