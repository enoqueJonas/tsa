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
| SOAP/XML — XML Documents, Namespaces and Parsing | OPTIONAL VIDEO | XML namespace explainers reviewed | No candidate promoted yet | Namespaces can benefit from a visual qualified-name example. |
| SOAP/XML — XSD: Make the XML Contract Executable | OPTIONAL VIDEO | XSD walkthroughs reviewed | No candidate promoted yet | Schema validation can be demonstrated visually. |
| SOAP/XML — WSDL and the SOAP Service Contract | RECOMMENDED VIDEO | WSDL/SOAP contract demonstrations reviewed | No candidate promoted yet | WSDL structure and generated surfaces benefit from a guided walkthrough. |
| SOAP/XML — SOAP Envelopes, Headers and Faults | RECOMMENDED VIDEO | SOAP message walkthroughs reviewed | No candidate promoted yet | Envelope/header/body/fault structure is a strong visual target. |
| SOAP/XML — Implement a Contract-First SOAP Endpoint | NO VIDEO | — | — | Implementation evidence is primary. |
| SOAP/XML — Integrate Steward with the SOAP Provider | NO VIDEO | — | — | Integration lab. |
| SOAP/XML — Contract Testing and Compatibility Failure | NO VIDEO | — | — | Breaking and testing the contract is the lesson. |
| SOAP/XML — Milestone: Build and Integrate a Contract-First SOAP Service | NO VIDEO | — | — | Milestone synthesis. |
| SOAP/XML — Reassess SOAP, REST and the Integration Boundary | NO VIDEO | — | — | The learner must make the architecture decision from evidence. |
| Messaging — When Distributed State Is Justified | NO VIDEO | — | — | The key skill is proving pressure before infrastructure. |
| Messaging — Redis and the Cache-Aside Pattern | RECOMMENDED VIDEO | Redis — Cache-Aside Pattern | [Redis — Cache-Aside Pattern](https://www.youtube.com/watch?v=AJhTduDOVCs); whole short video | A concrete cache-aside flow is useful to see before implementing it; PostgreSQL remains source of truth in TSA. |
| Messaging — Cache Invalidation, Staleness and Failure | RECOMMENDED VIDEO | Redis caching material reviewed | No additional candidate promoted yet | Read/write/cache timelines and stale-data windows are inherently visual. |
| Messaging — RabbitMQ: Queues, Exchanges and Consumers | RECOMMENDED VIDEO | RabbitMQ official/tutorial material reviewed | No candidate promoted yet | Exchange→queue→consumer routing is much easier to understand visually. |
| Messaging — Acknowledgements, Retries and Delivery Semantics | RECOMMENDED VIDEO | RabbitMQ reliability material reviewed | No candidate promoted yet | Delivery/ack/redelivery timelines benefit from live demonstration. |
| Messaging — Idempotent Consumers and Duplicate Delivery | OPTIONAL VIDEO | Messaging reliability talks reviewed | No candidate promoted yet | A duplicate-delivery demo can help, but implementing idempotent effects is primary. |
| Messaging — Dead-Letter Queues and Poison Messages | RECOMMENDED VIDEO | RabbitMQ DLQ demonstrations reviewed | No candidate promoted yet | Routing a poison message through retry/dead-letter paths is a useful visual workflow. |
| Messaging — Ordering and Eventual Consistency | RECOMMENDED VIDEO | Distributed-ordering/eventual-consistency talks reviewed | No candidate promoted yet | Timelines make intermediate state and scoped ordering clearer. |
| Messaging — Publishing Events Reliably: The Transactional Outbox | RECOMMENDED VIDEO | Transactional-outbox explainers reviewed | No candidate promoted yet | The dual-write failure and outbox sequence are especially well suited to animation/sequence diagrams. |
| Messaging — RabbitMQ versus Kafka: Different Messaging Models | RECOMMENDED VIDEO | RabbitMQ/Kafka comparison material reviewed | No candidate promoted yet | Visualizing queue/routing versus partitioned durable-log models helps prevent false equivalence. |
| Messaging — Lab: Evolve Steward with Redis and RabbitMQ | NO VIDEO | — | — | Independent integration lab. |
| Failure — Thinking in Failure Modes | OPTIONAL VIDEO | SRE/failure-analysis talks reviewed | No candidate promoted yet | A worked failure-mode review can reinforce the method. |
| Failure — Dependency Failure | RECOMMENDED VIDEO | Distributed-failure/cascading-failure talks reviewed | No candidate promoted yet | A dependency slowdown propagating through queues/retries is valuable to visualize. |
| Failure — Invalid and Partial State | NO VIDEO | — | — | The learner should construct and reason about actual partial-state cases. |
| Failure — Resource Exhaustion | RECOMMENDED VIDEO | Resource-exhaustion/queueing demos reviewed | No candidate promoted yet | Seeing saturation, queue growth and failure onset can build intuition. |
| Failure — Human and Operational Failure | OPTIONAL VIDEO | Incident/postmortem talks reviewed | No candidate promoted yet | Real incident narratives can add context, but should not replace the learner's operational analysis. |
| Failure — Lab: Analyze Steward API Failure Scenarios | NO VIDEO | — | — | Synthesis lab. |
| Architecture Decisions — Architecture Characteristics Introduction | OPTIONAL VIDEO | Architecture quality-attribute talks reviewed | No candidate promoted yet | A scenario-based example can reinforce prioritization. |
| Architecture Decisions — Decision Drivers | NO VIDEO | — | — | Drivers must be extracted from the actual decision context. |
| Architecture Decisions — Architecture Decision Records | OPTIONAL VIDEO | ADR explainers already reviewed in Apprentice | Reuse short ADR candidate only if needed | The concept was introduced earlier; avoid duplicate media unless reinforcement is needed. |
| Architecture Decisions — Evaluating Trade-offs | NO VIDEO | — | — | The learner must compare actual options and accepted downsides. |
| Architecture Decisions — Lab: Write Steward API ADRs | NO VIDEO | — | — | Independent decision-record lab. |
| Milestone: Steward API System Design Portfolio | NO VIDEO | — | — | System Thinker synthesis milestone. |


## Platform Builder — Computer/OS, Linux and Networking lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Computer/OS — CPU, Memory, Storage and I/O | RECOMMENDED VIDEO | Computer architecture animations reviewed | No candidate promoted yet | CPU/memory/storage/I-O interactions benefit from visual data-flow explanation. |
| Computer/OS — What an Operating System Does | RECOMMENDED VIDEO | OS process/memory/filesystem explainers reviewed | No candidate promoted yet | The abstraction boundary between hardware and applications is visual and foundational. |
| Computer/OS — Kernel Space and User Space | RECOMMENDED VIDEO | Kernel/user-space explainers reviewed | No candidate promoted yet | Privilege transitions and system-call boundaries are easier to see diagrammed. |
| Computer/OS — Processes and Threads | RECOMMENDED VIDEO | Process/thread visual explainers reviewed | No candidate promoted yet | Scheduling and shared-vs-isolated state benefit from animation. |
| Computer/OS — Filesystems | OPTIONAL VIDEO | Filesystem explainers reviewed | No candidate promoted yet | Inode/path/mount concepts can benefit from a visual model, but hands-on inspection is primary. |
| Computer/OS — Lab: Inspect the Machine Beneath Steward API | NO VIDEO | — | — | Independent inspection lab. |
| Linux — Installing Rocky Linux | OPTIONAL VIDEO | Rocky installation walkthroughs reviewed | No candidate promoted yet | A visual install walkthrough can reduce setup friction, but official docs and the actual installation remain primary. |
| Linux — Shell Navigation and Command Fluency | NO VIDEO | — | — | Shell fluency comes from using the shell, not watching it. |
| Linux — Files and Directories | NO VIDEO | — | — | Direct filesystem manipulation is primary. |
| Linux — Users and Groups | OPTIONAL VIDEO | Linux identity explainers reviewed | No candidate promoted yet | A visual identity/group/UID model can reinforce the boundary. |
| Linux — Linux Permissions | RECOMMENDED VIDEO | Linux permission demonstrations reviewed | No candidate promoted yet | rwx ownership/effective-access examples are useful to see before deliberately breaking permissions. |
| Linux — Package Management | NO VIDEO | — | — | Repository/package evidence should be gathered directly on Rocky. |
| Linux — Processes and Signals | RECOMMENDED VIDEO | Linux process/signal demonstrations reviewed | No candidate promoted yet | Seeing TERM/KILL/reload behavior and process state live adds value. |
| Linux — systemd and Services | RECOMMENDED VIDEO | systemd service walkthroughs reviewed | No candidate promoted yet | Unit lifecycle, status and journal integration are well suited to live demonstration. |
| Linux — Environment and Configuration | NO VIDEO | — | — | The learner should configure and break the service directly. |
| Linux — Logs and journalctl | RECOMMENDED VIDEO | journalctl troubleshooting demos reviewed | No candidate promoted yet | A live evidence-driven log investigation adds value. |
| Linux — Scheduled Tasks | OPTIONAL VIDEO | cron/systemd timer comparisons reviewed | No candidate promoted yet | A concise timer demonstration may help, but implementation is simple enough without required video. |
| Linux — Storage and Mounts | RECOMMENDED VIDEO | Linux block-device/mount explainers reviewed | No candidate promoted yet | Device→partition→filesystem→mount is a visual stack. |
| Linux — SSH and Key Authentication | RECOMMENDED VIDEO | SSH key/authentication explainers reviewed | No candidate promoted yet | The key exchange/authentication mental model benefits from visualization before configuration. |
| Linux — Lab: Operate Steward API as a Linux Service | NO VIDEO | — | — | Independent operations lab. |
| Networking — Networking Mental Models: OSI and TCP/IP | RECOMMENDED VIDEO | Layer-model explainers reviewed | No candidate promoted yet | Encapsulation/layer responsibility is highly visual. |
| Networking — Ethernet and Switching | RECOMMENDED VIDEO | Switching/frame-forwarding animations reviewed | No candidate promoted yet | MAC learning and frame forwarding benefit from animation. |
| Networking — IP Addressing | RECOMMENDED VIDEO | IP addressing explainers reviewed | No candidate promoted yet | Binary/prefix/address scope is easier with diagrams. |
| Networking — Subnetting | RECOMMENDED VIDEO | Subnetting visual tutorials reviewed | No candidate promoted yet | Visual address partitioning complements calculation exercises. |
| Networking — ARP | RECOMMENDED VIDEO | ARP packet-flow explainers reviewed | No candidate promoted yet | IP-to-MAC resolution is a short visual packet exchange. |
| Networking — TCP and UDP | RECOMMENDED VIDEO | Transport-protocol animations reviewed | No candidate promoted yet | Handshake/reliability versus datagrams benefits from packet-flow visualization. |
| Networking — Ports and Sockets | OPTIONAL VIDEO | Socket/port explainers reviewed | No candidate promoted yet | A process-to-socket diagram can reinforce the OS/network boundary. |
| Networking — Routing | RECOMMENDED VIDEO | Routing-table/next-hop demonstrations reviewed | No candidate promoted yet | Route selection is inherently path-oriented and visual. |
| Networking — DHCP | RECOMMENDED VIDEO | DHCP DORA-flow animations reviewed | No candidate promoted yet | Discover/offer/request/ack sequence is ideal for animation. |
| Networking — DNS | RECOMMENDED VIDEO | Computerphile — How DNS Works | [Computerphile — How DNS Works](https://www.youtube.com/watch?v=uOfonONtIuk); whole video | The hierarchy and recursive lookup flow match the lesson well. |
| Networking — NAT | RECOMMENDED VIDEO | NAT/PAT packet-flow explainers reviewed | No candidate promoted yet | Address/port rewriting is easier to understand visually. |
| Networking — Firewalls | RECOMMENDED VIDEO | Packet-filter/firewall flow demos reviewed | No candidate promoted yet | Policy benefits from concrete packet-path examples. |
| Networking — HTTP and TLS from the Network Perspective | RECOMMENDED VIDEO | TLS handshake/HTTP-layer explainers reviewed | No candidate promoted yet | Separating DNS/TCP/TLS/HTTP is a strong sequence-diagram use case. |
| Networking — Network Troubleshooting Tools | RECOMMENDED VIDEO | tcpdump/dig/curl troubleshooting demos reviewed | No candidate promoted yet | Live diagnosis demonstrates what each tool can and cannot prove. |
| Networking — Lab: Diagnose a Broken Service Path | NO VIDEO | — | — | Independent troubleshooting lab. |


## Platform Builder — Packet Tracer, Virtualization, Bare Metal and Homelab lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Packet Tracer — IOS CLI and Device Evidence | RECOMMENDED VIDEO | Jeremy's IT Lab / Cisco Packet Tracer labs reviewed | No single candidate promoted yet | Seeing IOS navigation and show/config evidence once reduces tool friction before independent labs. |
| Packet Tracer — IPv4 Subnetting and VLSM | RECOMMENDED VIDEO | Free CCNA subnetting/VLSM material reviewed | No candidate promoted yet | Visual address planning complements calculation and Packet Tracer implementation. |
| Packet Tracer — Switching, VLANs and 802.1Q | RECOMMENDED VIDEO | Free CCNA VLAN/trunk labs reviewed | No candidate promoted yet | Frame/VLAN/trunk behavior is strongly visual. |
| Packet Tracer — Inter-VLAN Routing | RECOMMENDED VIDEO | Free CCNA inter-VLAN labs reviewed | No candidate promoted yet | Packet path across VLAN/router boundaries benefits from live topology demonstration. |
| Packet Tracer — STP and EtherChannel | RECOMMENDED VIDEO | Free CCNA STP/EtherChannel labs reviewed | No candidate promoted yet | Topology convergence and blocked/forwarding links are inherently visual. |
| Packet Tracer — Static, Default and OSPF Routing | RECOMMENDED VIDEO | Jeremy's IT Lab — Configuring OSPF Day 26 Lab | [Jeremy's IT Lab — OSPF lab](https://www.youtube.com/watch?v=LeLRWjfylcs); 00:59–12:59 | A real Packet Tracer OSPF lab closely matches the curriculum; skip intro/promotion and focus on configuration/show evidence. |
| Packet Tracer — DHCP, Relay, NAT and PAT | RECOMMENDED VIDEO | Free CCNA DHCP/NAT labs reviewed | No candidate promoted yet | Multi-device packet transformation/relay is valuable to watch before building. |
| Packet Tracer — ACL Policy and Negative Testing | RECOMMENDED VIDEO | Free CCNA ACL labs reviewed | No candidate promoted yet | Seeing permit/deny placement and verification supports the negative-testing emphasis. |
| Packet Tracer — IPv6 Fundamentals | RECOMMENDED VIDEO | Free CCNA IPv6 labs reviewed | No candidate promoted yet | Address types/NDP/routing benefit from topology visualization. |
| Packet Tracer — Enterprise Branch Capstone | NO VIDEO | — | — | Capstone must be independent fault diagnosis and restoration. |
| Virtualization — Virtual Machines and Hypervisors | RECOMMENDED VIDEO | Hypervisor/VM architecture explainers reviewed | No candidate promoted yet | Host/hypervisor/guest/resource layers are inherently visual. |
| Virtualization — VM CPU, Memory and Storage | RECOMMENDED VIDEO | Virtual resource allocation explainers reviewed | No candidate promoted yet | Overcommit/contention is easier with host-versus-guest resource diagrams. |
| Virtualization — Virtual Networking Modes | RECOMMENDED VIDEO | NAT/bridged/host-only VM networking demos reviewed | No candidate promoted yet | Reachability differences are best shown with topology diagrams. |
| Virtualization — Snapshots and Recovery | OPTIONAL VIDEO | Snapshot demonstrations reviewed | No candidate promoted yet | A short demo can show snapshot/revert mechanics, while the lesson must preserve snapshot≠backup reasoning. |
| Bare Metal — Firmware, UEFI and the Boot Chain | RECOMMENDED VIDEO | UEFI/boot-chain explainers reviewed | No candidate promoted yet | Firmware→bootloader→kernel sequence is strongly visual. |
| Bare Metal — Hardware Health and SMART Evidence | OPTIONAL VIDEO | SMART drive-health demos reviewed | No candidate promoted yet | A live SMART interpretation can help, but actual device evidence is primary. |
| Bare Metal — Recovery, Out-of-Band Management and Power Boundaries | RECOMMENDED VIDEO | IPMI/iDRAC/iLO/OOB demonstrations reviewed | No candidate promoted yet | Remote console/power paths are hard to understand without seeing the separate management plane. |
| Bare Metal — Bare-Metal Readiness Gate for Proxmox | NO VIDEO | — | — | Readiness gate is evidence synthesis. |
| Homelab — Designing a Learning Homelab | OPTIONAL VIDEO | Homelab architecture tours reviewed | No candidate promoted yet | A good tour can provide physical intuition, but TSA must avoid copying another person's hardware zoo. |
| Homelab — Choosing Budget Hardware | OPTIONAL VIDEO | Budget homelab hardware guides reviewed | No candidate promoted yet | Useful for form-factor/expandability context; decisions remain local. |
| Homelab — CPU, RAM, Storage and NIC Trade-offs | RECOMMENDED VIDEO | Server hardware/resource explainers reviewed | No candidate promoted yet | Seeing physical components and bottlenecks adds value. |
| Homelab — Power, Noise and Reliability | OPTIONAL VIDEO | Homelab power/noise measurements reviewed | No candidate promoted yet | Real measurements add context but are environment-specific. |
| Homelab — Ethernet Switches and Cabling | RECOMMENDED VIDEO | Switch/cabling demonstrations reviewed | No candidate promoted yet | Physical ports/cables/link evidence are visual. |
| Homelab — Designing the Home Network Topology | RECOMMENDED VIDEO | Homelab topology walkthroughs reviewed | No candidate promoted yet | Physical/logical topology is best visualized. |
| Homelab — Static Addressing | NO VIDEO | — | — | Already covered conceptually; apply it directly. |
| Homelab — Multiple Hosts and VMs | OPTIONAL VIDEO | Homelab VM layout tours reviewed | No candidate promoted yet | Can reinforce placement, but learner capacity model is primary. |
| Homelab — Remote Administration | NO VIDEO | — | — | SSH/remoting was already taught; implement it. |
| Homelab — Local Firewalling | NO VIDEO | — | — | Apply prior networking/Linux knowledge. |
| Homelab — Local DNS Concepts | NO VIDEO | Computerphile DNS already selected earlier | Reuse earlier video only if review is needed | Avoid duplicate assignment. |
| Homelab — Reverse Proxies | RECOMMENDED VIDEO | NGINX/reverse-proxy visual explainers reviewed | No candidate promoted yet | Client→proxy→upstream flow and headers are visual. |
| Homelab — Storage and Backups | OPTIONAL VIDEO | Homelab backup strategy explainers reviewed | No candidate promoted yet | Failure-domain diagrams can help; NAS path goes deeper. |
| Homelab — Safe Exposure and Isolation | RECOMMENDED VIDEO | Network exposure/isolation demos reviewed | No candidate promoted yet | Ingress paths and trust boundaries benefit from topology visualization. |
| Homelab — VLAN Concepts | NO VIDEO | Packet Tracer VLAN lesson already covers this | Reuse earlier VLAN media only if review is needed | Avoid duplicate assignment. |
| Homelab — Planning Capacity for Internal Platform Services | NO VIDEO | — | — | Use the learner's own hardware/workloads. |
| Homelab — Lab: Move Steward API into the Homelab | NO VIDEO | — | — | Independent deployment lab. |


## Platform Builder — Proxmox and Enterprise Storage lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Proxmox — From Virtual Machines to an Operated Hypervisor | RECOMMENDED VIDEO | Proxmox architecture/UI overviews reviewed | No candidate promoted yet | Seeing host, storage, bridge and guest ownership in one interface gives useful platform context. |
| Proxmox — Install and Secure the Proxmox VE Host | OPTIONAL VIDEO | Proxmox install walkthroughs reviewed | No candidate promoted yet | A visual install can reduce setup friction, but official docs and the real installation remain primary. |
| Proxmox — Rocky Linux Templates and VM Lifecycle | RECOMMENDED VIDEO | Proxmox template/cloud-init workflows reviewed | No candidate promoted yet | Template→clone→guest lifecycle is well suited to live demonstration. |
| Proxmox — Compute Allocation, Pressure and Overcommit | RECOMMENDED VIDEO | Hypervisor resource-pressure demos reviewed | No candidate promoted yet | Host-versus-guest contention is easier to understand from live metrics. |
| Proxmox — Bridges, VLANs and the Physical Network Boundary | RECOMMENDED VIDEO | Proxmox bridge/VLAN demos reviewed | No candidate promoted yet | Virtual-to-physical network mapping is strongly visual. |
| Proxmox — Hypervisor Storage Pools and Virtual Disks | RECOMMENDED VIDEO | Proxmox storage model walkthroughs reviewed | No candidate promoted yet | Storage pools and virtual disks benefit from a host/guest boundary diagram. |
| Proxmox — VM Backup, Restore and Recovery Boundaries | RECOMMENDED VIDEO | Proxmox backup/restore demos reviewed | No candidate promoted yet | A real restore is more instructive than backup configuration alone. |
| Proxmox — Guest Failure versus Hypervisor Failure | NO VIDEO | — | — | The learner should inject and diagnose both failure classes directly. |
| Proxmox — Host Maintenance, Upgrade and Single-Host Reality | OPTIONAL VIDEO | Proxmox maintenance/upgrade walkthroughs reviewed | No candidate promoted yet | Useful operational context, but actual maintenance evidence is primary. |
| Proxmox — Reassess the Homelab Virtualization Architecture | NO VIDEO | — | — | Architecture reassessment must come from the learner's evidence. |
| Storage — Model the Enterprise Storage Stack | RECOMMENDED VIDEO | Block/file/object storage explainers reviewed | No candidate promoted yet | The storage-layer distinctions are spatial/architectural and benefit from diagrams. |
| Storage — Block Devices, Partitions and Destructive-Change Safety | RECOMMENDED VIDEO | Linux block-device/partition demos reviewed | No candidate promoted yet | A live lsblk/partition-table demonstration adds safety context. |
| Storage — LVM: Physical Volumes, Volume Groups and Logical Volumes | RECOMMENDED VIDEO | LVM visual walkthroughs reviewed | No candidate promoted yet | PV→VG→LV abstraction and expansion are especially visual. |
| Storage — Filesystems, Mounts and Persistent Identity | RECOMMENDED VIDEO | Filesystem/mount/UUID demos reviewed | No candidate promoted yet | Device identity and mount lifecycle benefit from a live reboot-safe example. |
| Storage — Capacity, Inodes and Online Growth | RECOMMENDED VIDEO | Filesystem capacity/inode/growth demos reviewed | No candidate promoted yet | Seeing byte exhaustion versus inode exhaustion and online growth adds operational intuition. |
| Storage — RAID, Degraded Operation and Rebuild | RECOMMENDED VIDEO | RAID/rebuild visual demonstrations reviewed | No candidate promoted yet | Healthy→degraded→replacement→rebuild is highly visual and failure-oriented. |
| Storage — Operate the NAS over NFS | RECOMMENDED VIDEO | NFS server/client demos reviewed | No candidate promoted yet | Mount/export/network boundaries are useful to see once before independent operation. |
| Storage — SMB Interoperability without a Second File Platform | OPTIONAL VIDEO | Samba interoperability demos reviewed | No candidate promoted yet | Useful for Windows/Linux boundary, but intentionally bounded. |
| Storage — Monitor and Break the NAS | NO VIDEO | — | — | The learner must diagnose injected failures from evidence. |
| Storage — Independent Backup and Restore | RECOMMENDED VIDEO | Restore/failure-domain material reviewed | No candidate promoted yet | A restore-focused demonstration reinforces that backup success is not recovery proof. |
| Storage — Milestone: Build and Operate the Virtual NAS | NO VIDEO | — | — | Milestone synthesis. |
| Storage — Reassess Virtual versus Physical NAS | NO VIDEO | — | — | Trade-off decision must use the learner's own constraints. |


## Platform Builder — Core Services, Configuration and OS Lifecycle lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Core Services — DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | Infrastructure dependency diagrams reviewed | No candidate promoted yet | Seeing these shared services as dependencies of every workload reinforces platform thinking. |
| Core Services — Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | BIND authoritative-DNS demos reviewed | No candidate promoted yet | Zone/record/query behavior benefits from a live dig demonstration. |
| Core Services — Break and Diagnose DNS | NO VIDEO | — | — | Independent failure diagnosis. |
| Core Services — Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP server/reservation demos reviewed | No candidate promoted yet | Lease lifecycle and reservations are useful to observe live. |
| Core Services — DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP relay/failure demos reviewed | No candidate promoted yet | Relay and option propagation are topology-oriented. |
| Core Services — Operate Time Synchronization with Chrony | RECOMMENDED VIDEO | Chrony/NTP demos reviewed | No candidate promoted yet | Source selection, offset and sync state benefit from live output. |
| Core Services — Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | Clock-skew/TLS/token/log-order demos reviewed | No candidate promoted yet | A visible before/after incident makes the cross-layer consequence concrete. |
| Core Services — Integrate Core Services into the Homelab | NO VIDEO | — | — | Integration evidence is primary. |
| Core Services — Reassess Availability and Ownership | NO VIDEO | — | — | Architecture reassessment. |
| Config Mgmt — Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible desired-state/idempotence demos reviewed | No candidate promoted yet | A first run versus no-change second run is a strong live demonstration. |
| Config Mgmt — Reusable Rocky Baseline Role | RECOMMENDED VIDEO | Ansible role demonstrations reviewed | No candidate promoted yet | Role structure/variables/handlers benefit from a concise walkthrough. |
| Config Mgmt — Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Ansible drift demos reviewed | No candidate promoted yet | Observe→change→detect→repair is ideal for demonstration. |
| Config Mgmt — Secrets, Failure and Safe Fleet Changes | OPTIONAL VIDEO | Ansible Vault/serial rollout demos reviewed | No candidate promoted yet | A safe rollout demonstration can help, but Vault ownership arrives later. |
| Config Mgmt — Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Milestone synthesis. |
| Config Mgmt — Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | Ownership decision must use accumulated evidence. |
| OS Lifecycle — Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Patch-management/change-window talks reviewed | No candidate promoted yet | A real maintenance scenario can add context. |
| OS Lifecycle — Patch a Rocky Linux Workload Host | NO VIDEO | — | — | Actual DNF maintenance is the lesson. |
| OS Lifecycle — Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel update/reboot demos reviewed | No candidate promoted yet | Installed-versus-running kernel state and reboot verification are useful to see. |
| OS Lifecycle — Patch Regression and Recovery | NO VIDEO | — | — | The learner must diagnose and recover a deterministic regression. |
| OS Lifecycle — Patch Multiple Rocky Hosts with Ansible | NO VIDEO | Config-management media already considered | Reuse earlier Ansible material only if needed | Avoid duplicate media; execute the fleet rollout. |
| OS Lifecycle — Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Patch-age dashboard examples reviewed | No candidate promoted yet | A dashboard example can help, but learner metrics are primary. |
| OS Lifecycle — Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | Boundary reasoning from the actual homelab is primary. |
| OS Lifecycle — Major OS Version Change Is a Migration | OPTIONAL VIDEO | RHEL/Rocky major-upgrade migration material reviewed | No candidate promoted yet | A migration narrative can reinforce why this is not routine patching. |
| OS Lifecycle — Reassess the Patch Operating Model | NO VIDEO | — | — | ADR/runbook synthesis. |


## Platform Builder — Windows, Enterprise Services and milestone lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Windows — Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Windows Server enterprise-role overviews reviewed | No candidate promoted yet | A visual estate map can orient the bounded Windows scope. |
| Windows — Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server install/baseline walkthroughs reviewed | No candidate promoted yet | Useful setup support; actual baseline evidence is primary. |
| Windows — PowerShell as an Administrative Interface | RECOMMENDED VIDEO | PowerShell object-pipeline demonstrations reviewed | No candidate promoted yet | Seeing objects flow through the pipeline corrects shell-as-text assumptions. |
| Windows — Services, Processes and Event Logs | RECOMMENDED VIDEO | PowerShell/Event Viewer troubleshooting demos reviewed | No candidate promoted yet | Live investigation of service failure and event evidence adds value. |
| Windows — NTFS and Share Permissions | RECOMMENDED VIDEO | NTFS/share effective-access demos reviewed | No candidate promoted yet | Layered share+NTFS permissions are much easier to understand visually. |
| Windows — Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | WinRM/PowerShell remoting demos reviewed | No candidate promoted yet | Remote session/auth/network boundary is a useful live demonstration. |
| Windows — Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft AD DS/DNS architecture material reviewed | No candidate promoted yet | Domain controller, DNS SRV, users/groups/OUs and Kerberos relationships are highly visual. |
| Windows — Domain Join and Group Policy | RECOMMENDED VIDEO | Domain join/GPO demos reviewed | No candidate promoted yet | Client→AD DNS→join→policy application is a strong live workflow. |
| Windows — Linux–Windows Interoperability | RECOMMENDED VIDEO | SMB/DNS/LDAP interoperability demos reviewed | No candidate promoted yet | Cross-OS trust/name/file paths benefit from demonstration. |
| Windows — Reassess Windows Operational Depth | NO VIDEO | — | — | Scope decision is evidence-based. |
| Enterprise Services — Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | NFS/Samba server-client demos reviewed | No candidate promoted yet | Network filesystem authority/permissions/outage behavior are easier to see across two hosts. |
| Enterprise Services — Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | LDAP DIT/bind/search explainers reviewed | No candidate promoted yet | DN/RDN/tree/search-scope and bind flows are inherently visual. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | The learner should design the contract and failure states. |
| File Integration — Legacy FTP Integration | OPTIONAL VIDEO | FTP protocol/active-passive demos reviewed | No candidate promoted yet | Control/data-channel behavior can help explain legacy failure modes. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch handoff/atomic-rename workflow material reviewed | No candidate promoted yet | Producer→staging→rename→consumer→archive/reject is a useful lifecycle diagram. |
| File Integration — Shared Filesystem versus Managed File Transfer | NO VIDEO | — | — | Architecture comparison is primary. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP/FTPS protocol comparisons reviewed | No candidate promoted yet | Visual protocol-stack comparison helps prevent SFTP/FTPS confusion. |
| Platform Builder — Milestone Review and Exit Criteria | NO VIDEO | — | — | Milestone evidence review. |
| Platform Builder — Assemble the Platform Builder Evidence Pack | NO VIDEO | — | — | Portfolio assembly. |
| Platform Builder — Platform Builder Exit Reflection | NO VIDEO | — | — | Reflection and transfer check. |
| Core Infrastructure — DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | DNS/DHCP/NTP architecture material reviewed | Reuse focused protocol videos where applicable | The combined dependency/authority model benefits from a topology view before implementation. |
| Core Infrastructure — Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | BIND authoritative-DNS demonstrations reviewed | No candidate promoted yet | Authoritative zones, recursion boundaries and record ownership are useful to see configured once. |
| Core Infrastructure — Break and Diagnose DNS | NO VIDEO | — | — | The learner should diagnose deliberately broken DNS from dig/service evidence. |
| Core Infrastructure — Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP server/scope demonstrations reviewed | No candidate promoted yet | Scope, lease and reservation behavior is visual and operational. |
| Core Infrastructure — DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP relay/exhaustion demonstrations reviewed | No candidate promoted yet | Relay paths and lease-pool failure are easier to understand visually. |
| Core Infrastructure — Operate Time Synchronization with Chrony | OPTIONAL VIDEO | chrony/NTP demonstrations reviewed | No candidate promoted yet | A short live chronyc demonstration can reduce setup friction; direct evidence remains primary. |
| Core Infrastructure — Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | Clock-skew/TLS/token/log-correlation material reviewed | No candidate promoted yet | A timeline makes the cross-system consequences of bad time immediately visible. |
| Core Infrastructure — Integrate Core Services into the Homelab | NO VIDEO | — | — | Independent integration work. |
| Core Infrastructure — Reassess Availability and Ownership | NO VIDEO | — | — | The learner must decide SPOF/ownership trade-offs from the implemented environment. |
| Configuration Management — Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible desired-state/idempotence demos reviewed | No candidate promoted yet | Seeing first-run changed versus second-run unchanged behavior makes idempotence concrete. |
| Configuration Management — Reusable Rocky Baseline Role | RECOMMENDED VIDEO | Ansible role walkthroughs reviewed | No candidate promoted yet | Role structure, variables, handlers and reuse benefit from a focused live walkthrough. |
| Configuration Management — Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Ansible drift/remediation demos reviewed | No candidate promoted yet | A deliberate manual drift followed by detection/repair is worth seeing once. |
| Configuration Management — Secrets, Failure and Safe Fleet Changes | OPTIONAL VIDEO | Ansible Vault/fleet rollout material reviewed | No candidate promoted yet | A visual rollout can reinforce blast-radius control, but later Vault coverage owns secrets deeply. |
| Configuration Management — Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Milestone synthesis. |
| Configuration Management — Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | Ownership boundaries require an architecture decision, not another tutorial. |
| OS Lifecycle — Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Patch-management/change-window talks reviewed | No candidate promoted yet | A real operational case can add context, but the learner's risk classification is primary. |
| OS Lifecycle — Patch a Rocky Linux Workload Host | NO VIDEO | — | — | Hands-on DNF maintenance and verification are sufficient. |
| OS Lifecycle — Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel update/reboot demonstrations reviewed | No candidate promoted yet | Installed-versus-running kernel state and reboot verification benefit from live evidence. |
| OS Lifecycle — Patch Regression and Recovery | RECOMMENDED VIDEO | Patch rollback/recovery demonstrations reviewed | No candidate promoted yet | A deterministic regression and recovery sequence is useful to observe before reproducing it. |
| OS Lifecycle — Patch Multiple Rocky Hosts with Ansible | RECOMMENDED VIDEO | Ansible rolling/canary patch demos reviewed | No candidate promoted yet | Canary→fleet progression is a visual operational workflow. |
| OS Lifecycle — Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Patch-compliance dashboard demos reviewed | No candidate promoted yet | Dashboard examples can help, but the learner must build their own visibility. |
| OS Lifecycle — Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | The important result is an explicit maintenance-domain model. |
| OS Lifecycle — Major OS Version Change Is a Migration | OPTIONAL VIDEO | Enterprise Linux major-upgrade/migration talks reviewed | No candidate promoted yet | A migration case study can add context without encouraging blind in-place upgrades. |
| OS Lifecycle — Reassess the Patch Operating Model | NO VIDEO | — | — | Reassessment must use operational evidence. |
| Windows — Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Mixed-estate Windows administration overviews reviewed | No candidate promoted yet | Useful orientation without turning TSA into Windows specialization. |
| Windows — Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server install/baseline walkthroughs reviewed | No candidate promoted yet | A visual install can reduce setup friction. |
| Windows — PowerShell as an Administrative Interface | RECOMMENDED VIDEO | Microsoft PowerShell object/pipeline material reviewed | No candidate promoted yet | The object pipeline differs materially from text pipelines and benefits from live inspection. |
| Windows — Services, Processes and Event Logs | RECOMMENDED VIDEO | PowerShell/Event Viewer troubleshooting demos reviewed | No candidate promoted yet | A live service failure traced through process and event evidence adds value. |
| Windows — NTFS and Share Permissions | RECOMMENDED VIDEO | NTFS/share effective-permission demos reviewed | No candidate promoted yet | Share+NTFS effective access is easier with concrete identities and deny/allow tests. |
| Windows — Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | WinRM/PowerShell remoting demos reviewed | No candidate promoted yet | Seeing local versus remote execution and auth/network failure is valuable. |
| Windows — Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft/AD DS architecture explainers reviewed | No candidate promoted yet | Domain controller, DNS, Kerberos/LDAP and directory objects are strongly visual. |
| Windows — Domain Join and Group Policy | RECOMMENDED VIDEO | Domain join/GPO demonstrations reviewed | No candidate promoted yet | Join, policy application and gpresult evidence form a useful end-to-end workflow. |
| Windows — Linux–Windows Interoperability | RECOMMENDED VIDEO | SMB/DNS/LDAP cross-platform demos reviewed | No candidate promoted yet | Cross-OS identity/name/file boundaries are useful to see integrated. |
| Windows — Reassess Windows Operational Depth | NO VIDEO | — | — | Boundary decision, not tutorial content. |
| Enterprise Services — Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | NFS/Samba interoperability demonstrations reviewed | No candidate promoted yet | Comparing Linux NFS and bounded SMB behavior is operationally visual. |
| Enterprise Services — Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | LDAP DN/search/bind visual explainers reviewed | No candidate promoted yet | DIT hierarchy, DN/RDN, bind and search scope are easier to grasp visually. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | The contract and lifecycle must be designed explicitly. |
| File Integration — Legacy FTP Integration | OPTIONAL VIDEO | FTP protocol/session demonstrations reviewed | No candidate promoted yet | A packet/session view can add historical protocol intuition. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch/file handoff workflow material reviewed | No candidate promoted yet | Producer→staging→atomic handoff→consumer→archive/reject is a useful sequence to visualize. |
| File Integration — Shared Filesystem versus Managed File Transfer | NO VIDEO | — | — | The lesson is a boundary/trade-off decision. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP versus FTPS protocol explainers reviewed | No candidate promoted yet | Seeing SSH-based SFTP versus TLS-based FTPS prevents a common conceptual mix-up. |
| Platform Builder — Milestone Review and Exit Criteria | NO VIDEO | — | — | Milestone assessment. |
| Platform Builder — Assemble the Platform Builder Evidence Pack | NO VIDEO | — | — | Evidence synthesis. |
| Platform Builder — Exit Reflection | NO VIDEO | — | — | Reflection and transfer assessment. |
| Core Infra — DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | Infrastructure dependency explainers reviewed | No candidate promoted yet | Seeing name/address/time as separate authorities helps prevent troubleshooting category errors. |
| Core Infra — Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | BIND authoritative DNS demos reviewed | No candidate promoted yet | Zone/record/query flow benefits from a live authoritative-server demonstration. |
| Core Infra — Break and Diagnose DNS | NO VIDEO | — | — | The learner should diagnose wrong records, cache and outage directly. |
