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
| Systems Thinking | OPTIONAL VIDEO | [MIT OpenCourseWare — Information Flow / Feedback Loops](https://ocw.mit.edu/courses/res-tll-004-stem-concept-videos-fall-2013/video_galleries/videos/information-flow/) | MIT OCW Information Flow series; optional, focused on the Feedback Loops item | A visual feedback-loop explanation can reinforce the idea of system behavior emerging from relationships, but the TSA mapping exercise remains the primary learning activity. |
| Trade-offs | NO VIDEO | No search promoted after lesson fit review | — | The learner needs to make and defend a contextual decision. Another general explanation of trade-offs adds less value than the matrix and real decision exercise. |
| Debugging Mindset | RECOMMENDED VIDEO | [MIT Missing Semester — Lecture 7: Debugging and Profiling (2020)](https://www.youtube.com/watch?v=l812pUnKxME) | Lecture 7; watch the debugging portion before the lecture moves into profiling | A live debugging lecture shows the transition from symptoms to logs, debuggers and inspection tools. It complements the lesson's hypothesis-driven method instead of replacing it. |
| Engineering Decisions | OPTIONAL VIDEO | [Saxion Media Xpert Centre — Architecture Decision Records (ADR): The Basics](https://www.youtube.com/watch?v=7Gqn2dbt_JY); CodeAndBooks — Documenting decisions using ADR | ADR — The Basics; whole short video | The lesson already teaches decision reasoning. The short ADR explainer is useful only as a concrete example of how teams preserve that reasoning. |
| Evidence and Technical Reasoning | NO VIDEO | No separate video promoted | — | This is a reasoning discipline. The existing troubleshooting material and falsification exercise are better than adding another explanatory video. |
| Learning as an Engineering Skill | OPTIONAL VIDEO | [Osmosis — Spaced repetition in learning theory](https://www.youtube.com/watch?v=cVf38y07cfk); Pablo Sánchez Urina — Spaced Repetition / Science-based | [Osmosis — Spaced repetition in learning theory](https://www.youtube.com/watch?v=cVf38y07cfk); whole short video | Animation helps make spacing intuitive, but the lesson covers retrieval, feedback and capability evidence too, so the video is reinforcement rather than required material. |
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
| Object-Oriented Programming | OPTIONAL VIDEO | [Corey Schafer — Python OOP Tutorial 1: Classes and Instances](https://www.youtube.com/watch?v=ZDa-Z5JzLYM) | Whole first video in the OOP series | A live construction of a class/instance model can reinforce the object model. Optional because TSA's lesson must still emphasize when a class is justified, not just syntax. |
| Comprehensions, Iterators and Pythonic Tools | NO VIDEO | No video promoted | — | This is compact language fluency; examples, REPL experimentation and readability comparison are better than a lecture. |
| Type Hints and Static Feedback | NO VIDEO | No video promoted | — | The learner needs to run the type checker, inspect feedback and understand the boundary between static hints and runtime/domain validation. |
| Virtual Environments and Dependency Management | NO VIDEO | No video promoted | — | Hands-on environment recreation and dependency metadata provide stronger evidence than a walkthrough video. |
| Debugging Python Programs | RECOMMENDED VIDEO | MIT Missing Semester — Debugging and Profiling; [Red Eyed Coder Club — Python PDB tutorial](https://www.youtube.com/watch?v=SdsHXwN3Ka4) | Red Eyed Coder Club PDB tutorial: 02:19–17:42 for debugger output, stepping, inspection, breakpoints and stack navigation | This lesson benefits from seeing an interactive debugger session. The focused PDB demonstration maps more directly to the Python lesson than replaying the broader MIT lecture. |
| Lab: Build a Small Python Service Core | NO VIDEO | No video promoted | — | This is a synthesis build. The learner should integrate the Python capabilities without a copy-along implementation. |


## Builder — Web and API Foundations lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| How the Web Works | OPTIONAL VIDEO | General HTTP/web-stack explainers; MDN remains primary | No video promoted yet | The DNS→connection→TLS→HTTP sequence can benefit from animation, but this lesson's curl/DNS evidence exercise is stronger than a generic overview. Keep video optional until a candidate matches the exact layered model. |
| Client-Server Architecture | NO VIDEO | No video promoted | — | The important learning is assigning responsibilities and identifying network-boundary consequences. The learner's own boundary diagram is the better medium. |
| HTTP Requests and Responses | RECOMMENDED VIDEO | HTTP overview videos reviewed; MDN remains authoritative | No candidate promoted yet | Seeing a raw request/response exchange annotated on screen would add value, but a shallow web-basics animation would not. Candidate remains open rather than lowering the quality bar. |
| Methods, Headers and Status Codes | NO VIDEO | No video promoted | — | This is contract semantics. RFC/MDN reading plus retry/status design work is more useful than memorization-oriented video. |
| JSON and Content Types | OPTIONAL VIDEO | Computerphile — JSON, not Jason | [Computerphile — JSON, not Jason](https://www.youtube.com/watch?v=A0hoqSkyY7o); whole short video | A concise visual explanation reinforces JSON as a data-interchange representation. Optional because content negotiation and domain validation still require the TSA exercise and HTTP documentation. |
| REST Principles and Trade-offs | OPTIONAL VIDEO | General REST explainers reviewed | No candidate promoted yet | A good architecture-oriented explanation could help, but most introductory REST videos collapse REST into CRUD conventions. Keep optional until a source treats constraints and trade-offs accurately. |
| Modeling Resources and API Contracts | NO VIDEO | No video promoted | — | The core capability is designing request/response contracts and evaluating compatibility risk. Producing the contract is more valuable than watching one. |
| Errors and Status Design | NO VIDEO | No video promoted | — | The learner needs to map concrete failures to client actions and stable error semantics. RFC/MDN plus the failure matrix are sufficient. |
| Lab: Explore APIs with curl and Postman | NO VIDEO | Tool walkthroughs intentionally not promoted | — | The lab itself is the demonstration. A copy-along Postman/curl video would reduce rather than improve the evidence-first objective. |


## Builder — Relational Data and PostgreSQL lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| The Relational Model | OPTIONAL VIDEO | General relational-model/normalization explainers reviewed | No candidate promoted yet | A diagrammed explanation can reinforce relations, keys and cardinality, but the schema-modeling exercise is primary. |
| SQL SELECT, INSERT, UPDATE and DELETE | NO VIDEO | No video promoted | — | Direct SQL practice with preview/mutate/verify is the correct medium. |
| Filtering and Ordering Queries | NO VIDEO | No video promoted | — | Predicate and NULL behavior should be discovered by executing queries and comparing expected truth conditions. |
| Aggregation, GROUP BY and HAVING | OPTIONAL VIDEO | SQL aggregation explainers reviewed | No candidate promoted yet | Visualizing grouping grain can help, but only if a concise source improves on the lesson's row-shape exercise. |
| INNER, LEFT and RIGHT JOINs | RECOMMENDED VIDEO | Visual SQL join explainers reviewed | No candidate promoted yet | Join inclusion is highly visual. Keep this slot open for a technically precise animation/whiteboard source rather than a Venn-diagram-only shortcut. |
| Subqueries | NO VIDEO | No video promoted | — | Writing EXISTS and correlated subqueries against real data is more useful than passive explanation. |
| Common Table Expressions | OPTIONAL VIDEO | CTE/recursive-query explainers reviewed | No candidate promoted yet | Recursive dependency traversal can benefit from a stepwise visualization, but ordinary CTE syntax does not justify a video by itself. |
| Transactions and ACID | RECOMMENDED VIDEO | PostgreSQL transaction/MVCC explainers reviewed | No candidate promoted yet | Atomicity, isolation and interleaving benefit from a timeline visualization. Candidate must match PostgreSQL behavior rather than generic ACID mnemonics. |
| Constraints, Keys and Relationships | NO VIDEO | No video promoted | — | The capability is encoding invariants and proving negative cases in PostgreSQL. |
| Schema Design | NO VIDEO | No video promoted | — | Designing the Steward schema and defending boundaries is itself the learning activity. |
| Normalization and Denormalization Trade-offs | OPTIONAL VIDEO | Normalization explainers reviewed | No candidate promoted yet | A worked anomaly decomposition can reinforce the lesson, but the learner must still reason from duplicated facts and workload evidence. |
| Indexes | RECOMMENDED VIDEO | pganalyze — How to reason about indexing your Postgres database | [pganalyze webinar](https://www.youtube.com/watch?v=o0HrXM1thYI) retained as candidate; no required segment yet | The source is technically strong but long. It is retained for the later resource-selection pass only if a focused segment can be verified; the lesson should not assign the full webinar. |
| Query Plans and EXPLAIN | RECOMMENDED VIDEO | pganalyze — How to use the Postgres query planner to debug bad plans | [pganalyze query-planner webinar](https://www.youtube.com/watch?v=nVhLTwVefCA) retained as candidate; no required segment yet | Seeing plan nodes and estimates interpreted live adds real value. The full webinar is too long, so it is not selected until an exact segment is verified. |
| Query Performance | NO VIDEO | Index/planner candidates considered | — | The lesson's evidence loop requires measuring a real query; generic optimization advice risks replacing evidence with folklore. |
| PostgreSQL in Practice | NO VIDEO | No video promoted | — | psql inspection, roles and operational evidence are hands-on skills. |
| Django ORM | NO VIDEO | No video promoted | — | The learner should inspect generated SQL and compare ORM behavior directly. |
| ORM versus SQL | NO VIDEO | No video promoted | — | This is a contextual engineering decision best learned through equivalent implementations and trade-off analysis. |
| The N+1 Query Problem | RECOMMENDED VIDEO | N+1 explainers reviewed | No candidate promoted yet | The repeated request/query pattern is easy to grasp when visualized as a timeline, but the chosen video must map cleanly to Django/PostgreSQL rather than another ORM. |
| Database Migrations | OPTIONAL VIDEO | Migration/expand-contract talks reviewed | No candidate promoted yet | A production migration walkthrough can add operational intuition, but the populated-data migration exercise remains primary. |
| Concurrency Fundamentals | RECOMMENDED VIDEO | PostgreSQL concurrency/MVCC material reviewed | No candidate promoted yet | Two-session interleaving, locks and races are easier to understand with a timeline/live demonstration before reproducing them. |
| Lab: Persist and Query Steward API Data | NO VIDEO | No video promoted | — | This is synthesis evidence. Copy-along database videos would undermine the independent implementation goal. |


## Builder — Django and API Engineering lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Django Foundations | OPTIONAL VIDEO | Django request-lifecycle walkthroughs reviewed | No candidate promoted yet | A request-lifecycle visualization can reinforce URL→middleware→view→response, but the learner's trace through the real project is primary. |
| Django REST Framework | OPTIONAL VIDEO | DRF introductory walkthroughs reviewed | No candidate promoted yet | Seeing plain Django and DRF side by side could help, but most videos are copy-along tutorials rather than abstraction comparisons. |
| Projects, Applications and Boundaries | NO VIDEO | No video promoted | — | Boundary design should come from cohesion/dependency diagrams and the learner's codebase, not Django app conventions taught by video. |
| Models and Domain Data | NO VIDEO | No video promoted | — | The PostgreSQL school already established relational reasoning; this lesson should apply it through Django models. |
| Serializers and Validation | OPTIONAL VIDEO | DRF serializer walkthroughs reviewed | No candidate promoted yet | A focused serializer boundary demonstration may help, provided it distinguishes parsing/field validation/domain rules rather than just CRUD scaffolding. |
| Views, ViewSets and Routers | OPTIONAL VIDEO | DRF ViewSet/router tutorials reviewed | No candidate promoted yet | Seeing generated routing and behavior can be useful, but only as reinforcement for the explicitness/abstraction trade-off. |
| Validation and Business Rules | NO VIDEO | No video promoted | — | The core skill is placing and reusing rules correctly; concrete implementation and negative tests are stronger. |
| API Errors | NO VIDEO | No video promoted | — | Failure-contract design is already exercised directly and should not be reduced to framework exception-handler recipes. |
| Filtering, Search and Ordering | NO VIDEO | No video promoted | — | Hands-on query behavior and bounded API design are more useful. |
| Pagination | OPTIONAL VIDEO | Pagination/API consistency explainers reviewed | No candidate promoted yet | A visual sequence can help explain page navigation under concurrent data changes, but only if it covers consistency trade-offs rather than UI pagination. |
| API Versioning and Compatibility | OPTIONAL VIDEO | API evolution/versioning talks reviewed | No candidate promoted yet | A strong industry talk could add context, but compatibility classification is the primary exercise. |
| OpenAPI and API Documentation | RECOMMENDED VIDEO | OpenAPI/Swagger editor demonstrations reviewed | No candidate promoted yet | Seeing an OpenAPI document drive interactive documentation is useful before producing and checking the contract. |
| Configuration and Environment Settings | NO VIDEO | No video promoted | — | Environment-variable ownership and startup validation are best learned by configuring and breaking the application. |
| Application Logging | OPTIONAL VIDEO | Structured logging demonstrations reviewed | No candidate promoted yet | A short before/after logging demonstration could help, but later Reliability has deeper logging coverage. |
| Lab: Steward API Skeleton | NO VIDEO | No video promoted | — | This is a synthesis build and should not become a Django copy-along. |


## Builder — Identity, Authentication and Authorization lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Identity in Software Systems | NO VIDEO | No video promoted | — | The identity model is conceptual but compact; concrete principal/attribute examples and later implementation are enough. |
| Authentication versus Authorization | OPTIONAL VIDEO | AuthN/AuthZ explainers reviewed | No candidate promoted yet | A short visual comparison can reinforce the boundary, but the lesson should remain grounded in real allow/deny cases. |
| Password Storage and Hashing | RECOMMENDED VIDEO | Computerphile — How NOT to Store Passwords! | [Computerphile — How NOT to Store Passwords!](https://www.youtube.com/watch?v=8ZtInClXe1Q); whole video, with the video's own salt-animation caveat noted | The failure progression from plaintext to hashing/salting is well demonstrated visually. OWASP remains authoritative for current password-storage choices. |
| JWT Structure and Lifecycle | RECOMMENDED VIDEO | JWT/token explainers reviewed | No candidate promoted yet | Header/payload/signature and token lifecycle benefit from a visual decomposition, but the candidate must avoid implying JWT encryption or automatic security. |
| Access and Refresh Tokens | RECOMMENDED VIDEO | OAuth/OIDC token-flow material reviewed, including OktaDev workshop | No candidate promoted yet | A sequence diagram helps explain why access and refresh tokens have different exposure/lifetime roles. Avoid assigning a full OAuth workshop to a narrower JWT lesson. |
| Expiration and Token Rotation | OPTIONAL VIDEO | Token lifecycle/rotation talks reviewed | No candidate promoted yet | Timeline visualization can help, but the learner must actually exercise expiry/refresh/rotation behavior. |
| Authentication Flows | RECOMMENDED VIDEO | OktaDev OAuth/OIDC workshop considered | [OktaDev OAuth/OIDC workshop](https://www.youtube.com/watch?v=Udrrz00PD3k) retained as long-form candidate; exact segment required before selection | Live flow visualization is valuable, but the full workshop exceeds this lesson's scope and must be timestamped before curriculum use. |
| Roles and Permissions | NO VIDEO | No video promoted | — | The capability is designing permission semantics and proving allowed/denied operations. |
| Object-Level Authorization | RECOMMENDED VIDEO | OWASP/authorization demonstrations reviewed | No candidate promoted yet | A worked broken-object-authorization example could make the risk concrete, but it must match the lesson's server-side object-policy focus. |
| Ownership and Access Rules | NO VIDEO | No video promoted | — | Steward's team/resource ownership rules are product-specific and best learned through the actual authorization matrix. |
| Common Authentication and Authorization Mistakes | OPTIONAL VIDEO | Security failure demos reviewed | No candidate promoted yet | A concise exploit demonstration can reinforce consequences, but later Security Steward provides the deeper offensive/defensive treatment. |
| Lab: Secure Steward API | NO VIDEO | No video promoted | — | The learner must prove security boundaries independently; a copy-along auth implementation would weaken the lab. |


## Builder — Software Craft and Builder Milestone lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Git as an Engineering Tool | OPTIONAL VIDEO | Git history/bisect demonstrations reviewed | No candidate promoted yet | A live bisect/history investigation can help, but the lesson's controlled regression exercise already demonstrates the evidence model. |
| Branching and Collaboration | NO VIDEO | No video promoted | — | Branch/PR discipline is contextual workflow; reviewing the learner's own diff is the useful practice. |
| Readable Code | NO VIDEO | No video promoted | — | Reading and revising concrete code is better than style commentary. |
| Separation of Concerns | OPTIONAL VIDEO | Refactoring/design explainers reviewed | No candidate promoted yet | A worked refactor may reinforce responsibility boundaries, but the learner should derive them from actual code smells. |
| Refactoring | OPTIONAL VIDEO | Refactoring demonstrations reviewed | No candidate promoted yet | A before/after live refactor can help if it preserves tests and behavior visibly; no generic clean-code lecture is needed. |
| Managing Dependencies | NO VIDEO | No video promoted | — | Dependency declaration, versioning and reproducibility are best exercised directly. |
| Configuration | NO VIDEO | No video promoted | — | Breaking and validating environment configuration is the stronger learning medium. |
| Useful Logging | OPTIONAL VIDEO | Structured-logging demos reviewed | No candidate promoted yet | A focused diagnostic comparison can help, but deeper logging arrives in Reliability. |
| Technical Documentation | NO VIDEO | No video promoted | — | The learner should produce documentation another engineer can actually follow. |
| Designing Errors | NO VIDEO | No video promoted | — | Concrete failure contracts and exception mapping provide the learning evidence. |
| Performance Awareness | OPTIONAL VIDEO | Performance-profiling demonstrations reviewed | No candidate promoted yet | Seeing a profiler/query trace can reinforce evidence-based optimization, but measurement in the learner's endpoint is primary. |
| Designing Reusable Internal Packages | NO VIDEO | No video promoted | — | The important decision is whether a reuse boundary exists, not package-tool mechanics. |
| Lab: Extract steward-common | NO VIDEO | No video promoted | — | Independent extraction and consumption is the evidence. |
| Lab: Refine Steward API for Review | NO VIDEO | No video promoted | — | Synthesis/review lab; no copy-along resource. |
| Milestone: Steward API v1 | NO VIDEO | No video promoted | — | The Builder milestone must demonstrate transfer across the school without new instructional media. |


## System Thinker — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Requirements — From Requests to Problems | NO VIDEO | — | — | Problem reframing is best practiced on an ambiguous request. |
| Requirements — Stakeholders and Actors | NO VIDEO | — | — | Stakeholder mapping is a reasoning exercise. |
| Requirements — Functional Requirements | NO VIDEO | — | — | Writing testable behavior is the core practice. |
| Requirements — Quality Requirements | OPTIONAL VIDEO | Quality-attribute scenario talks reviewed | No candidate promoted yet | A worked scenario can reinforce measurable quality attributes. |
| Requirements — Constraints and Assumptions | NO VIDEO | — | — | The learner must surface these in a real problem. |
| Requirements — Acceptance and Evidence | NO VIDEO | — | — | Evidence design is better learned by defining observable acceptance. |
| Requirements — Lab: Reframe Steward API Requirements | NO VIDEO | — | — | Synthesis lab. |
| Boundaries — System Context | OPTIONAL VIDEO | C4 talks considered | No candidate promoted yet | Context diagrams benefit from seeing a model built, but the dedicated C4 lesson is the better place for the main video. |
| Boundaries — Actors and External Systems | NO VIDEO | — | — | Mapping real actors/dependencies is primary. |
| Boundaries — Defining System Boundaries | NO VIDEO | — | — | Boundary choice must be defended from the actual system. |
| Boundaries — Trust and Ownership Boundaries | OPTIONAL VIDEO | Trust-boundary modeling material reviewed | No candidate promoted yet | A visual worked example can help, but Security later goes deeper. |
| Boundaries — Lab: Draw the Steward API Context | NO VIDEO | — | — | Independent modeling lab. |
| Modeling — Why We Model Systems | OPTIONAL VIDEO | Simon Brown C4 talks reviewed | No candidate promoted here | Useful motivation, but reserve the selected talk for C4-style thinking. |
| Modeling — C4-Style Thinking | RECOMMENDED VIDEO | Simon Brown — The C4 model for visualising software architecture | [Simon Brown at Devoxx](https://www.youtube.com/watch?v=KvoBrUd1-5E) retained; exact segment required before insertion | The model is inherently visual and is best explained by its creator; the full talk is too long to assign wholesale. |
| Modeling — Containers and Components as Models | RECOMMENDED VIDEO | Same Simon Brown C4 talk | Same candidate; container/component segment to be verified | Seeing zoom levels and notation evolve is valuable. |
| Modeling — State and Lifecycle Modeling | OPTIONAL VIDEO | State-machine demonstrations reviewed | No candidate promoted yet | Animation can reinforce transitions, but the learner's lifecycle model is primary. |
| Modeling — Communicating Architecture Visually | RECOMMENDED VIDEO | Simon Brown C4 talk | Same candidate; communication/notation segment to be verified | The lesson is explicitly visual communication. |
| Modeling — Lab: Model Steward API at Multiple Levels | NO VIDEO | — | — | Synthesis lab. |
| Components — Components and Responsibilities | NO VIDEO | — | — | Responsibility assignment should come from the system model. |
| Components — Coupling and Cohesion Foundations | OPTIONAL VIDEO | Coupling/cohesion design talks reviewed | No candidate promoted yet | A worked refactor may reinforce the concept. |
| Components — Dependency Direction | OPTIONAL VIDEO | Dependency-direction explainers reviewed | No candidate promoted yet | A visual dependency-arrow example can help. |
| Components — Internal and External Dependencies | NO VIDEO | — | — | The learner must inventory and classify actual dependencies. |
| Components — Lab: Map Steward API Dependencies | NO VIDEO | — | — | Independent mapping lab. |
| Data Flow — Following Data Through a System | RECOMMENDED VIDEO | Sequence/data-flow modeling material reviewed | No candidate promoted yet | Tracing a request visually across components materially improves comprehension. |
| Data Flow — Synchronous and Asynchronous Boundaries | RECOMMENDED VIDEO | Messaging interaction explainers reviewed | No candidate promoted yet | Timing and coupling are easier to see on a sequence diagram. |
| Data Flow — Integration Contracts | NO VIDEO | — | — | Contract writing and compatibility analysis are primary. |
| Data Flow — Failure Across Integrations | OPTIONAL VIDEO | Distributed-failure talks reviewed | No candidate promoted yet | A visual cascade can reinforce propagation. |
| Data Flow — Lab: Model Steward API Data Flows | NO VIDEO | — | — | Independent synthesis lab. |
