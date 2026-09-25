# TSA Multimedia Learning Resource Audit

## Purpose

TSA should use video when seeing or hearing a concept explained, demonstrated, diagnosed, or operated adds something that text does not. Video is not a quota. A short syntax lesson does not need a YouTube link simply because one exists.

This audit is performed **lesson by lesson before videos are added to the curriculum**:

1. inspect the lesson and its learning objective;
2. classify whether video adds meaningful learning value;
3. search for credible free candidates only where it does;
4. compare candidates for technical accuracy, teaching quality, scope, durability, and fit;
5. record the exact segment when the whole video is not relevant;
6. add the selected resource only after the matrix decision is made.

## Classification

- **NO VIDEO** — text, code, documentation, or the practical is the better medium.
- **OPTIONAL VIDEO** — useful reinforcement, but not needed to achieve the objective.
- **RECOMMENDED VIDEO** — visual explanation or demonstration materially improves understanding.
- **REQUIRED WATCH** — demonstrates behavior, workflow, tooling, or system interaction that is part of the intended learning experience.

Required watches should remain uncommon. TSA must not turn into a playlist.

## Candidate quality bar

Prefer official project/vendor channels for tool-specific behavior, respected technical educators, conference/CNCF/community talks for architecture and operations, and university material when it teaches the concept particularly well.

Reject outdated material where the difference matters, shallow marketing, unexplained copy-along tutorials, and unnecessarily long videos when a focused source exists.

For long videos, record an exact segment such as **Watch 12:40–24:15** and what to focus on. Use a timestamped URL when stable.

## Working audit matrix

| School | Path / lesson | Video value | Candidate(s) checked | Selected resource | Watch segment | Why / learner focus | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Builder | Programming with Python — Python Syntax, Values and Types | NO VIDEO | — | — | — | Concise prose, executable examples and targeted Python docs are better here. | reviewed |
| Platform Builder | Core Infrastructure Services — DNS concepts/authority | RECOMMENDED VIDEO | Computerphile, *How DNS Works* | pending final lesson-level fit check | TBD | Hierarchy and lookup flow benefit from a visual explanation. | candidate found |
| Platform Builder | Configuration Management with Ansible — desired state/idempotence | RECOMMENDED VIDEO | Ansible introductory material | pending stronger technical candidate | TBD | Seeing changed vs unchanged hosts makes desired state concrete. | candidate search |
| Delivery Engineer | Containers and Docker — container model | RECOMMENDED VIDEO | pending research | pending | TBD | Process/isolation/image/container relationships benefit from animation or live inspection. | classify/search |
| Security Steward | Threat Modeling — first modeling workflow | RECOMMENDED VIDEO | pending research | pending | TBD | A worked threat-modeling session is more useful than another definition-only source. | classify/search |
| Reliability Engineer | Distributed Tracing — trace/span propagation | RECOMMENDED VIDEO | pending research | pending | TBD | Cross-service propagation and a trace UI are inherently visual. | classify/search |
| Reliability Engineer | Metrics, Prometheus and Grafana — first end-to-end metrics flow | RECOMMENDED VIDEO | pending research | pending | TBD | Scrape → query → dashboard is useful to see before building it. | classify/search |

These rows seed the audit; they are **not** the completed curriculum-wide matrix. Every assembled lesson will be reviewed. Candidate discovery and curriculum changes happen in focused batches so links and timestamps are checked rather than bulk-inserted.

## Important boundary

Video does not replace authoritative documentation. Documentation remains the source for exact syntax, configuration, API behavior, standards and version-specific details. Video is for intuition, visualization, demonstration, diagnosis, workflow or engineering discussion.

A blog post may also be better than either a manual or a video. The resource mix follows the lesson, not a fixed template.


## Engineering Apprentice — completed lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Thinking Like an Engineer | NO VIDEO | No search promoted after lesson fit review | — | The lesson is about framing, constraints, uncertainty and evidence. The written worked example plus the learner's own problem frame is more valuable than passive viewing. |
| Systems Thinking | OPTIONAL VIDEO | MIT OpenCourseWare — Information Flow / Feedback Loops | MIT OCW Information Flow series; optional, focused on the Feedback Loops item | A visual feedback-loop explanation can reinforce the idea of system behavior emerging from relationships, but the TSA mapping exercise remains the primary learning activity. |
| Trade-offs | NO VIDEO | No search promoted after lesson fit review | — | The learner needs to make and defend a contextual decision. Another general explanation of trade-offs adds less value than the matrix and real decision exercise. |
| Debugging Mindset | RECOMMENDED VIDEO | MIT Missing Semester — Lecture 7: Debugging and Profiling (2020) | Lecture 7; watch the debugging portion before the lecture moves into profiling | A live debugging lecture shows the transition from symptoms to logs, debuggers and inspection tools. It complements the lesson's hypothesis-driven method instead of replacing it. |
| Engineering Decisions | OPTIONAL VIDEO | Saxion Media Xpert Centre — Architecture Decision Records (ADR): The Basics; CodeAndBooks — Documenting decisions using ADR | ADR — The Basics; whole short video | The lesson already teaches decision reasoning. The short ADR explainer is useful only as a concrete example of how teams preserve that reasoning. |
| Evidence and Technical Reasoning | NO VIDEO | No separate video promoted | — | This is a reasoning discipline. The existing troubleshooting material and falsification exercise are better than adding another explanatory video. |
| Learning as an Engineering Skill | OPTIONAL VIDEO | Osmosis — Spaced repetition in learning theory; Pablo Sánchez Urina — Spaced Repetition / Science-based | Osmosis — Spaced repetition in learning theory; whole short video | Animation helps make spacing intuitive, but the lesson covers retrieval, feedback and capability evidence too, so the video is reinforcement rather than required material. |
| Communicating Technical Work | NO VIDEO | Google Technical Writing facilitator videos reviewed but not promoted | — | Google's learner-facing written course matches the objective better. The surfaced videos are primarily facilitator guides, so adding them would be resource noise. |
| Milestone: Engineering Investigation | NO VIDEO | No search promoted | — | This is a synthesis milestone. New explanatory media would distract from demonstrating the capabilities already taught. |


## Builder — Programming with Python lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Setting Up a Python Engineering Environment | NO VIDEO | No video promoted | — | The commands are short and the learner must inspect their own interpreter, PATH and virtual environment. Targeted venv/packaging docs plus the practical are more useful. |
| Python Syntax, Values and Types | NO VIDEO | Previously reviewed | — | Executable examples and targeted Python documentation are sufficient; this intentionally remains video-free. |
| Control Flow | NO VIDEO | No video promoted | — | The value comes from tracing and writing branches/loops, not watching someone type them. |
| Functions and Scope | NO VIDEO | No video promoted | — | Small executable examples and deliberate failure cases teach scope and function contracts more efficiently. |
| Collections and Data Structures | NO VIDEO | No video promoted | — | The learner should manipulate lists, dicts, sets and tuples directly and reason about the representation trade-offs. |
| Modules and Packages | NO VIDEO | No video promoted | — | The module/package model is better learned by building/importing a small package and inspecting import behavior. |
| Errors, Exceptions and Defensive Programming | NO VIDEO | No video promoted | — | The lesson requires designing failure behavior and exception boundaries; executable failure examples are the stronger medium. |
| Object-Oriented Programming | OPTIONAL VIDEO | Corey Schafer — Python OOP Tutorial 1: Classes and Instances | Whole first video in the OOP series | A live construction of a class/instance model can reinforce the object model. Optional because TSA's lesson must still emphasize when a class is justified, not just syntax. |
