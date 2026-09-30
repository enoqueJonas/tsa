# TSA Instructional Depth and Pedagogy Standard

**Status:** normative
**Applies to:** every learner-facing TSA lesson and activity
**Adopted:** 2026-09-30

## Why this standard exists

A curriculum can have correct topics, technologies, sequencing, links and assessments while still fail to teach. TSA must not confuse a syllabus entry, engineering checklist, resource list or compressed expert note with a lesson.

The defect that triggered this standard was the live Engineering Apprentice lesson **Terminal, Shell and Filesystem**. A nominal 50-minute reading rendered essentially one scope paragraph, a boundary note and two external resources. It named many concepts but did not teach them. This is a systemic quality signal, not an isolated copy-editing issue.

## Core benchmark

The governing question for every lesson is:

> **Could the intended learner, without already knowing this subject, build the required mental model and perform the next activity from the TSA lesson itself?**

If the answer is no, the lesson is not complete.

External documentation, books, courses and videos are **supplements**. They may deepen, visualize or provide authoritative reference material. They must not carry the instructional burden that the TSA lesson claims to provide.

## What counts as a lesson

A substantive conceptual or technical lesson should normally contain the following, adapted to the subject rather than mechanically templated:

1. **Purpose and prerequisite bridge** — why the capability matters, what prior knowledge it builds on, and where its boundary lies.
2. **Conceptual model** — explain the underlying system, mechanism or decision model before presenting commands, APIs or recipes.
3. **Progressive explanation** — introduce ideas in dependency order and connect each new idea to what came before.
4. **Concrete worked examples** — commands, code, diagrams, scenarios, decisions or artifacts with explanation of what happens and why.
5. **Failure and diagnostic reasoning** — show representative mistakes, symptoms, causes and a method for investigating them.
6. **Guided practice** — learner performs bounded steps with enough scaffolding to apply the new model.
7. **Independent application** — learner must make choices, produce evidence and work without copying an opaque sequence.
8. **Knowledge checks** — questions or exercises test explanation, prediction, diagnosis and trade-offs, not trivia recall.
9. **Evidence and completion criteria** — make observable what proves the capability.
10. **Further resources** — authoritative reinforcement after the TSA teaching body, with a clear reason for each resource when useful.

Not every lesson needs every block in identical form. The standard measures learning function, not template compliance.

## Depth requirements

### Teach, do not enumerate

A sentence such as “Learn paths, quoting, pipes, redirection, environment variables and exit status” is a syllabus statement. It is not instruction.

Each important concept must receive enough explanation, examples and relationships for the intended learner to form a usable model.

### Explain mechanics and meaning

Commands and code must be explained at the level appropriate to the school. Learners should know what state changes, what remains unchanged, what layer performs the work and how to inspect the result.

### Worked example before independent synthesis

When a capability is new, show at least one representative worked example before asking the learner to design or debug independently. Higher-level schools may deliberately reduce scaffolding because transfer is being assessed.

### Failure is curriculum

Technical fluency includes recognizing failure. Lessons should teach diagnostic boundaries and representative failure modes rather than only happy paths.

### Duration must be credible

The activity time estimate is an instructional promise. A 50-minute reading cannot consist of a few hundred words and links. Estimates must reflect the actual teaching, examples, learner interaction and expected reading/thinking time. Do not inflate duration to make a module look substantial.

### No outsourced teaching

“Continue learning” cannot be the main lesson. A learner may choose not to open any optional external resource and must still receive the core instruction needed for the TSA activity.

## Pedagogical progression by school level

Scaffolding should decrease deliberately:

- **Engineering Apprentice / Builder:** explicit explanation, worked examples, guided practice and strong mental-model construction.
- **System Thinker / Platform Builder:** mechanisms, boundaries, operational inspection and increasingly independent labs.
- **Delivery / Cloud / Quality / Security / Reliability:** prior concepts assumed where genuinely taught; new tools and mechanisms still require direct instruction; labs integrate multiple capabilities.
- **Architect / Technical Steward:** emphasis shifts toward judgment, trade-offs, governance, evidence and decision records; examples illuminate reasoning but must not prescribe the learner's answer.
- **Professional Engineer:** transfer-and-defence capstone. New instruction is exceptional; independent discovery, implementation, operation and defence are intentional.

“Advanced school” is never an excuse for a thin lesson when the topic itself is new.

## Quality gates

A lesson fails remediation if any of these are true:

- it mostly lists concepts to learn rather than teaching them;
- external links contain the real explanation;
- claimed duration is clearly inconsistent with rendered content;
- practical work requires mechanisms never explained or previously taught;
- examples are absent where a new concrete mechanism is introduced;
- code/commands appear without explaining relevant behavior;
- the lesson assumes expertise not established by prerequisites;
- the same generic paragraph/checklist structure is repeated across unrelated topics;
- a knowledge check can be answered by keyword recall without understanding;
- a lab is an opaque command recipe rather than evidence of a mental model.

## Review rubric

For remediation, record each lesson as **PASS**, **REWRITE**, or **TARGETED IMPROVEMENT** across:

| Dimension | What reviewers verify |
| --- | --- |
| Instructional sufficiency | TSA itself teaches the required capability |
| Mental model | learner can explain how/why the mechanism works |
| Sequencing | concepts and prerequisites appear in dependency order |
| Worked examples | representative examples are explained, not merely shown |
| Diagnostic depth | failure modes and investigation are taught where relevant |
| Guided practice | new capability receives appropriate scaffolding |
| Independent application | learner eventually produces evidence without recipe copying |
| Assessment quality | checks test reasoning, prediction, diagnosis or trade-offs |
| Duration integrity | estimated time is credible for rendered work |
| Resource role | external material supplements rather than substitutes |
| Canonical alignment | technology and architecture match current TSA decisions |
| Cross-school boundary | lesson teaches only the depth owned by this school |

A school is not pedagogically remediated until its learner-facing lessons pass this benchmark and the rendered platform is spot-checked.

## Reference benchmark: Terminal, Shell and Filesystem

The remediated lesson should build a progression resembling:

    terminal vs shell
          ↓
    commands, arguments and options
          ↓
    working directory + filesystem tree
          ↓
    /  ~  .  ..
          ↓
    absolute vs relative paths
          ↓
    files, directories and hidden files
          ↓
    safe create/read/copy/move/remove operations
          ↓
    quoting and whitespace
          ↓
    stdin / stdout / stderr
          ↓
    pipes and redirection
          ↓
    environment variables
          ↓
    exit status
          ↓
    help / man / command discovery
          ↓
    worked failures and inspection
          ↓
    guided exercises
          ↓
    independent lab

The exact lesson may evolve, but a scope paragraph plus links does not satisfy this benchmark.

## Maintenance rule

Whenever a new lesson is added or materially rewritten, review **instructional depth** in addition to curriculum wiring, canonical-stack consistency and multimedia/resource fit. Curriculum integrity tooling should progressively automate structural proxies, but human pedagogical review remains required because line counts and block counts cannot prove that teaching is good.
