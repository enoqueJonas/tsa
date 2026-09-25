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
