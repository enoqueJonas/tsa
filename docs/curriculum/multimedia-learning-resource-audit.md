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


## Delivery Engineer — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Foundations — The Source-to-Production Lifecycle | RECOMMENDED VIDEO | CI/CD lifecycle visualizations reviewed | No candidate promoted yet | End-to-end source→build→artifact→promotion→runtime flow is inherently visual. |
| Foundations — Git Workflows | NO VIDEO | — | — | Git workflow was already practiced; apply it to delivery. |
| Foundations — Pull Requests and Reviews | NO VIDEO | — | — | Review behavior is learned through actual PRs. |
| Foundations — Semantic Versioning | OPTIONAL VIDEO | SemVer explainers reviewed | No candidate promoted yet | A concise example can reinforce compatibility signaling, but the spec and release exercise are enough. |
| Foundations — Conventional Commits | NO VIDEO | — | — | Convention is compact and practice-oriented. |
| Foundations — Release Notes and Changelogs | NO VIDEO | — | — | Produce them from real changes. |
| Foundations — Build Artifacts | RECOMMENDED VIDEO | Artifact/repository pipeline explainers reviewed | No candidate promoted yet | Immutable artifact flow and provenance benefit from a pipeline diagram. |
| Foundations — Environment Promotion | RECOMMENDED VIDEO | Promotion-pipeline demonstrations reviewed | No candidate promoted yet | Same-artifact promotion across environments is best seen as a flow. |
| Automation — Shell Scripting | NO VIDEO | — | — | Writing and running scripts is primary. |
| Automation — Pipes and Exit Codes | RECOMMENDED VIDEO | Unix pipeline/exit-code demos reviewed | No candidate promoted yet | A live pipeline failure shows why exit status controls automation. |
| Automation — Environment and Inputs | NO VIDEO | — | — | Input/config handling should be implemented directly. |
| Automation — Repeatable Automation | NO VIDEO | — | — | Repeatability is proven by rerunning the task. |
| Automation — Make and Task Entry Points | OPTIONAL VIDEO | Make/task-runner demos reviewed | No candidate promoted yet | A short dependency-target demonstration may help. |
| Automation — Idempotency | RECOMMENDED VIDEO | Idempotent automation demonstrations reviewed | No candidate promoted yet | First-run change versus second-run no-op is valuable to see. |
| Automation — Lab: Automate Steward Developer and Operator Tasks | NO VIDEO | — | — | Independent automation lab. |
| Containers — Containers versus Virtual Machines | RECOMMENDED VIDEO | Container/VM architecture animations reviewed | No candidate promoted yet | Process isolation versus full guest OS is strongly visual. |
| Containers — Namespaces and cgroups Concepts | RECOMMENDED VIDEO | Linux namespace/cgroup demonstrations reviewed | No candidate promoted yet | The kernel mechanisms behind containers are difficult to infer from Docker commands alone. |
| Containers — Docker Architecture | RECOMMENDED VIDEO | Docker client/daemon/image/container diagrams reviewed | No candidate promoted yet | Architecture is visual and operationally important. |
| Containers — Images and Layers | RECOMMENDED VIDEO | Image-layer/cache demonstrations reviewed | No candidate promoted yet | Layer reuse and invalidation are best shown live. |
| Containers — Writing Dockerfiles | NO VIDEO | — | — | Write/build/inspect directly. |
| Containers — Build Context | OPTIONAL VIDEO | Docker build-context demos reviewed | No candidate promoted yet | A concise demo can expose accidental context size/secrets. |
| Containers — Multi-stage Builds | RECOMMENDED VIDEO | Multi-stage build demos reviewed | No candidate promoted yet | Builder/runtime stage separation and image-size difference are visually useful. |
| Containers — Volumes | RECOMMENDED VIDEO | Docker volume/bind-mount demos reviewed | No candidate promoted yet | Persistence and host/container path boundaries benefit from demonstration. |
| Containers — Container Networking | RECOMMENDED VIDEO | Docker bridge/DNS/port-publish demos reviewed | No candidate promoted yet | Network namespace/bridge/published-port flow is highly visual. |
| Containers — Docker Compose | OPTIONAL VIDEO | Compose multi-service demos reviewed | No candidate promoted yet | Useful once, but learner should build the composition. |
| Containers — Health Checks | NO VIDEO | — | — | Implement and break health behavior directly. |
| Containers — Container Registries | RECOMMENDED VIDEO | Registry push/pull/tag flows reviewed | No candidate promoted yet | Image identity and registry movement are visual. |
| Containers — Image Tags and Versioning | NO VIDEO | — | — | Apply versioning rules to actual images. |
| Containers — Image Optimization | OPTIONAL VIDEO | Docker image optimization demos reviewed | No candidate promoted yet | Before/after layer-size inspection can reinforce the evidence loop. |
| Containers — Container Debugging | RECOMMENDED VIDEO | Docker troubleshooting demos reviewed | No candidate promoted yet | Live inspect/log/exec/network diagnosis is valuable. |
| CI — CI Pipeline Architecture | RECOMMENDED VIDEO | Jenkins pipeline architecture demos reviewed | No candidate promoted yet | SCM trigger→agent→stages→artifacts/gates is visual. |
| CI — Jobs, Stages and Dependencies | RECOMMENDED VIDEO | Pipeline DAG/stage demos reviewed | No candidate promoted yet | Execution dependencies and fail-fast behavior benefit from a pipeline graph. |
| CI — Runners and Agents | RECOMMENDED VIDEO | Jenkins agent/controller demos reviewed | No candidate promoted yet | Execution placement is easier to understand visually. |
| CI — GitHub Actions and Jenkins | OPTIONAL VIDEO | Jenkins/GitHub Actions comparisons reviewed | No candidate promoted yet | Comparison is useful, but Jenkins remains primary and Actions bounded. |
| CI — Self-hosted Runners | OPTIONAL VIDEO | Self-hosted agent setup demos reviewed | No candidate promoted yet | A setup demo can help with execution-boundary intuition. |
| CI — Caching | OPTIONAL VIDEO | CI cache demos reviewed | No candidate promoted yet | Cache hit/miss and invalidation are useful but secondary. |
| CI — Pipeline Artifacts | RECOMMENDED VIDEO | Artifact handoff demos reviewed | No candidate promoted yet | Stage-to-stage immutable artifact movement is visual. |
| CI — Secrets and Variables | NO VIDEO | — | — | Configure safely; avoid normalizing secret exposure through tutorial copy-along. |
| CI — Parallelism | OPTIONAL VIDEO | Parallel pipeline demos reviewed | No candidate promoted yet | A DAG/timeline can make speed-versus-contention trade-offs concrete. |
| CI — Automated Checks | NO VIDEO | — | — | Implement the checks. |
| CI — Test Stages | NO VIDEO | — | — | Quality school deepens testing; here integrate real stages. |
| CI — Quality Gates | NO VIDEO | — | — | Gate behavior should be proven with failing/passing pipelines. |
| CI — Building Containers in CI | RECOMMENDED VIDEO | Jenkins Docker-build pipeline demos reviewed | No candidate promoted yet | A live source→image→registry path adds value. |
| CD — CI versus Continuous Delivery versus Continuous Deployment | RECOMMENDED VIDEO | CI/CD distinction explainers reviewed | No candidate promoted yet | A pipeline-state diagram makes the release boundary clear. |
| CD — Environment Management | NO VIDEO | — | — | Implement environment ownership/promotion. |
| CD — Deployment Automation | RECOMMENDED VIDEO | Deployment-pipeline demos reviewed | No candidate promoted yet | Live automated deploy+verification shows the contract. |
| CD — Release Approvals | NO VIDEO | — | — | Approval semantics are process design. |
| CD — Database Migrations During Deployment | RECOMMENDED VIDEO | Zero-downtime migration talks reviewed | No candidate promoted yet | Application/schema compatibility across deployment phases is a timeline problem. |
| CD — Rollback | RECOMMENDED VIDEO | Rollback demonstrations reviewed | No candidate promoted yet | Seeing artifact rollback plus state caveats is useful. |
| CD — Rolling Deployments | RECOMMENDED VIDEO | Rolling-update animations reviewed | No candidate promoted yet | Instance-by-instance replacement is visual. |
| CD — Blue-Green Deployments | RECOMMENDED VIDEO | Blue-green traffic-switch demos reviewed | No candidate promoted yet | Two environments and traffic cutover are inherently visual. |
| CD — Canary Deployment Concepts | RECOMMENDED VIDEO | Canary traffic-shift demos reviewed | No candidate promoted yet | Progressive percentages and analysis gates benefit from animation. |
| CD — Feature Flag Concepts | OPTIONAL VIDEO | Feature-flag rollout demos reviewed | No candidate promoted yet | Control-plane separation can help, but implementation is not central here. |
| Config — Configuration Drift | RECOMMENDED VIDEO | Ansible drift media already reviewed | Reuse Platform Builder candidate only if needed | Avoid duplicate assignment unless Delivery framing adds something new. |
| Config — Desired State and Idempotency | NO VIDEO | Prior Ansible lesson already covers this | — | Apply prior knowledge. |
| Config — Ansible Fundamentals | NO VIDEO | Prior Ansible path already implemented | — | Delivery uses the existing tool rather than reteaching it. |
| Config — Inventories | NO VIDEO | — | — | Use actual environments. |
| Config — Playbooks | NO VIDEO | — | — | Write and run them. |
| Config — Roles Concepts | NO VIDEO | — | — | Already implemented earlier. |
| Release — Release Candidates | NO VIDEO | — | — | Create and promote a real candidate. |
| Release — Promotion and Gates | RECOMMENDED VIDEO | Release-promotion pipeline demos reviewed | No candidate promoted yet | Artifact/gate/environment flow is visual. |
| Release — Deployment Evidence | NO VIDEO | — | — | Capture evidence from actual deployments. |
| Release — Release Observability | OPTIONAL VIDEO | Release-marker/dashboard demos reviewed | No candidate promoted yet | Visual correlation of deploy markers and telemetry can help. |
| Release — Release Failure Handling | RECOMMENDED VIDEO | Failed-release/rollback incident demos reviewed | No candidate promoted yet | Timeline of detection→decision→rollback/recovery is useful. |
| Release — Release Runbooks | NO VIDEO | — | — | Write and execute the runbook. |
| Artifact Management — Artifact, Dependency and Supply-Chain Management | RECOMMENDED VIDEO | Nexus repository/proxy/hosted-flow demos reviewed | No candidate promoted yet | Hosted/proxy/group repositories and immutable artifact flow are easier to understand visually. |
| Schema Evolution — Production Database Schema Evolution | RECOMMENDED VIDEO | Expand-contract/zero-downtime migration talks reviewed | No candidate promoted yet | Old/new app versions, schema states and backfill coexistence are timeline-heavy and benefit from animation. |
| Schema Evolution — Design a Backward-Compatible Steward Change | NO VIDEO | — | — | Design work should be independent. |
| Schema Evolution — Run the Expand and Backfill | RECOMMENDED VIDEO | Online migration/backfill demos reviewed | No candidate promoted yet | A real staged migration can reinforce restartability and coexistence before the learner executes it. |
| Schema Evolution — Switch, Fail and Recover | NO VIDEO | — | — | Controlled failure/recovery is the learner's evidence. |
| Schema Evolution — Contract and Prove the End State | NO VIDEO | — | — | Execute the final gate and cleanup directly. |
| Schema Evolution — Defend the Migration Strategy | NO VIDEO | — | — | Reflection/defence. |
| CI Migration — Migration Brief: Move a Steward CI Workflow Safely | OPTIONAL VIDEO | CI migration case studies reviewed | No candidate promoted yet | A case study can provide context, but semantic mapping is primary. |
| CI Migration — Execute a Bounded CI Migration | NO VIDEO | — | — | Independent migration exercise. |
| CI Migration — Migration Review | NO VIDEO | — | — | Reflection. |
| Delivery Milestone — Milestone Brief: Steward Delivery Platform | NO VIDEO | — | — | Milestone brief. |
| Delivery Milestone — Gate 1: Source, CI and Artifact Integrity | NO VIDEO | — | — | Evidence gate. |
| Delivery Milestone — Gate 2: Reproducible Delivery Infrastructure | NO VIDEO | — | — | Evidence gate. |
| Delivery Milestone — Gate 3: Promotion and Deployment | NO VIDEO | — | — | Evidence gate. |
| Delivery Milestone — Gate 4: Runtime Verification | NO VIDEO | — | — | Evidence gate. |
| Delivery Milestone — Gate 5: Failure, Rollback and Recovery | NO VIDEO | — | — | Evidence gate. |
| Delivery Milestone — Gate 6: Delivery Platform Handoff | NO VIDEO | — | — | Evidence gate. |
| Delivery Milestone — Milestone Review and Exit Criteria | NO VIDEO | — | — | School exit review. |


## Cloud Engineer — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Hosting — On-premises, Colocation, VPS and Cloud | RECOMMENDED VIDEO | Hosting-model architecture explainers reviewed | No candidate promoted yet | Physical ownership and responsibility boundaries are visual. |
| Hosting — IaaS, PaaS and SaaS | RECOMMENDED VIDEO | Cloud service-model diagrams reviewed | No candidate promoted yet | Responsibility shifts are easiest to compare visually. |
| Hosting — Regions, Zones and Availability Concepts | RECOMMENDED VIDEO | Cloud region/AZ architecture material reviewed | No candidate promoted yet | Failure-domain geography is inherently visual. |
| Hosting — Shared Responsibility | RECOMMENDED VIDEO | Cloud shared-responsibility explainers reviewed | No candidate promoted yet | Provider/customer ownership boundary benefits from a layered diagram. |
| Hosting — Elasticity and Consumption Models | OPTIONAL VIDEO | Elasticity/autoscaling demos reviewed | No candidate promoted yet | A demand/capacity timeline can help. |
| Hosting — Cloud Cost Awareness | OPTIONAL VIDEO | Cloud billing model explainers reviewed | No candidate promoted yet | Useful context; actual cost modeling is primary. |
| VPS — Choosing a Budget VPS | NO VIDEO | — | — | Provider choice changes; compare current constraints directly. |
| VPS — Provisioning a Server | OPTIONAL VIDEO | VPS provisioning demos reviewed | No candidate promoted yet | A visual setup can reduce friction but should not tie TSA to one vendor UI. |
| VPS — Public IP Addressing | NO VIDEO | — | — | Apply networking foundations. |
| VPS — Securing SSH Access | NO VIDEO | Prior SSH lesson | — | Apply prior skill. |
| VPS — Provider Firewalls and Security Controls | RECOMMENDED VIDEO | Cloud firewall/security-group demos reviewed | No candidate promoted yet | Provider edge versus host firewall is a visual boundary. |
| VPS — OS Lifecycle and Patching | NO VIDEO | Prior lifecycle path | — | Apply existing patch model. |
| VPS — Remote Recovery Concepts | OPTIONAL VIDEO | Provider console/rescue-mode demos reviewed | No candidate promoted yet | Out-of-band recovery is useful to see once. |
| VPS — Backups and Snapshots | OPTIONAL VIDEO | Provider snapshot/backup demos reviewed | No candidate promoted yet | Useful for provider boundary; preserve snapshot≠backup reasoning. |
| Internet — Public and Private Addressing | NO VIDEO | Prior networking coverage | — | Apply prior model. |
| Internet — Internet Routing Concepts | RECOMMENDED VIDEO | BGP/Internet routing visual explainers reviewed | No candidate promoted yet | Autonomous-system/path concepts benefit from visualization without becoming a BGP operator course. |
| Internet — Domains and DNS Records | NO VIDEO | DNS media already selected | — | Avoid duplicate assignment. |
| Internet — DNS Resolution and Troubleshooting | NO VIDEO | — | — | Use dig and evidence directly. |
| Internet — TLS Certificates and Certificate Authorities | RECOMMENDED VIDEO | Computerphile — Public Key Cryptography / TLS material reviewed | No candidate promoted yet | Chain-of-trust and certificate identity are strongly visual. |
| Internet — HTTPS and TLS Termination | RECOMMENDED VIDEO | TLS termination/reverse-proxy diagrams reviewed | No candidate promoted yet | Client→gateway→upstream trust boundary is visual. |
| Internet — Reverse Proxies | NO VIDEO | Reverse-proxy slot already exists in Platform Builder | — | Avoid duplicate media. |
| Internet — Ingress Concepts | RECOMMENDED VIDEO | Ingress/gateway traffic-flow demos reviewed | No candidate promoted yet | External→edge→service path is inherently visual. |
| Internet — Internet-facing Firewalls | NO VIDEO | — | — | Apply prior firewall reasoning. |
| Internet — Exposure, Attack Surface and Administrative Boundaries | RECOMMENDED VIDEO | Attack-surface/trust-boundary diagrams reviewed | No candidate promoted yet | Public, operator and control-plane paths benefit from a visual model. |
| Certificates — Certificate Lifecycle Operations | RECOMMENDED VIDEO | ACME/certificate lifecycle demonstrations reviewed | No candidate promoted yet | Issue→serve→renew→reload→expire/revoke is a timeline. |
| Certificates — Inspect Steward's TLS Identity and Trust Chain | RECOMMENDED VIDEO | openssl certificate-chain demos reviewed | No candidate promoted yet | Live chain inspection connects abstract PKI to served identity. |
| Certificates — Automate Renewal and Gateway Reload | RECOMMENDED VIDEO | ACME renewal/reload demos reviewed | No candidate promoted yet | Automation lifecycle is useful to see once. |
| Certificates — Break and Recover Certificate Renewal | NO VIDEO | — | — | Learner must diagnose the controlled failure. |
| Certificates — Defend the Certificate Lifecycle | NO VIDEO | — | — | Architecture/operations defence. |
| Building Blocks — Compute | RECOMMENDED VIDEO | Cloud compute architecture demos reviewed | No candidate promoted yet | Placement/capacity abstraction is visual. |
| Building Blocks — Object Storage | RECOMMENDED VIDEO | S3 object-storage architecture demos reviewed | No candidate promoted yet | Bucket/key/API model differs enough from filesystems to merit visualization. |
| Building Blocks — Block Storage | RECOMMENDED VIDEO | Cloud block-volume attach/detach demos reviewed | No candidate promoted yet | Volume lifetime versus compute lifetime is visual. |
| Building Blocks — Managed Databases | OPTIONAL VIDEO | Managed PostgreSQL responsibility demos reviewed | No candidate promoted yet | Useful to show shifted operational ownership. |
| Building Blocks — Virtual Networks and Subnets | RECOMMENDED VIDEO | VPC/VNet topology demos reviewed | No candidate promoted yet | Subnet/trust placement is inherently visual. |
| Building Blocks — Routing and Gateways | RECOMMENDED VIDEO | Cloud route/gateway packet-flow demos reviewed | No candidate promoted yet | Ingress/egress path selection is visual. |
| Building Blocks — Load Balancers | RECOMMENDED VIDEO | Load-balancer traffic demos reviewed | No candidate promoted yet | Distribution/health-check behavior is strongly visual. |
| Building Blocks — IAM | RECOMMENDED VIDEO | Cloud IAM principal/role/policy diagrams reviewed | No candidate promoted yet | Identity assumption and policy evaluation benefit from diagrams. |
| Object Storage — S3-Compatible Object Storage for Steward | RECOMMENDED VIDEO | S3/MinIO architecture demos reviewed | No candidate promoted yet | Object API, bucket policy and persistence boundaries benefit from a visual model. |
| Object Storage — From Object-storage Design to Operation | NO VIDEO | — | — | Design should use the actual Steward need. |
| Object Storage — Deploy and Secure the Object Store | OPTIONAL VIDEO | MinIO deployment demos reviewed | No candidate promoted yet | Setup support only; learner must own security decisions. |
| Object Storage — Operate Lifecycle, Failure and Recovery | RECOMMENDED VIDEO | Object lifecycle/versioning/recovery demos reviewed | No candidate promoted yet | Lifecycle and version recovery are visual operational flows. |
| Object Storage — Defend the Storage Architecture | NO VIDEO | — | — | Architecture defence. |
| IaC — Why Infrastructure as Code | OPTIONAL VIDEO | IaC state/change workflow explainers reviewed | No candidate promoted yet | Useful motivation, but the console-to-code audit is primary. |
| IaC — Declarative Infrastructure | RECOMMENDED VIDEO | Declarative reconciliation demos reviewed | No candidate promoted yet | Desired versus actual state is a strong visual concept. |
| IaC — Terraform and OpenTofu Fundamentals | RECOMMENDED VIDEO | OpenTofu/Terraform plan/apply demos reviewed | No candidate promoted yet | init→plan→apply→state workflow is useful to see once. |
| IaC — Providers and Resources | OPTIONAL VIDEO | Provider/resource graph demos reviewed | No candidate promoted yet | Provider trust and resource ownership can benefit from a concise walkthrough. |
| IaC — State | RECOMMENDED VIDEO | Terraform/OpenTofu state demos reviewed | No candidate promoted yet | State's role as control record and drift/recovery boundary is central. |
| IaC — Variables and Outputs | NO VIDEO | — | — | Interface design is better practiced. |
| IaC — Dependencies | RECOMMENDED VIDEO | Terraform dependency-graph demos reviewed | No candidate promoted yet | Graph-derived ordering is visual. |
| IaC — Modules Concepts | NO VIDEO | — | — | Abstraction should be earned through refactoring. |
| Orchestration — Kubernetes Cluster and Control Plane | RECOMMENDED VIDEO | Kubernetes control-plane animations reviewed | No candidate promoted yet | API server/scheduler/controllers/etcd/node relationships are highly visual. |
| Orchestration — Pods, Deployments and ReplicaSets | RECOMMENDED VIDEO | Kubernetes reconciliation animations reviewed | No candidate promoted yet | Desired replicas and replacement behavior are ideal for animation. |
| Orchestration — Services and Cluster Networking | RECOMMENDED VIDEO | Kubernetes Service/networking demos reviewed | No candidate promoted yet | Pod IPs, Service VIPs and routing are difficult without diagrams. |
| Orchestration — OpenShift as an Enterprise Application Platform | RECOMMENDED VIDEO | Red Hat OpenShift architecture demos reviewed | No candidate promoted yet | Shows the platform delta over Kubernetes without treating it as a new universe. |
| Orchestration — OpenShift Routes, SCC Concepts and Operators | RECOMMENDED VIDEO | OpenShift Route/SCC/Operator demos reviewed | No candidate promoted yet | These platform-specific abstractions benefit from guided visual demonstration. |
| Orchestration — GitOps and Reconciliation | RECOMMENDED VIDEO | Argo CD reconciliation demos reviewed | No candidate promoted yet | Git desired state→controller→cluster drift correction is inherently visual. |
| Orchestration — Lab: Migrate Steward to OpenShift with Argo CD | NO VIDEO | — | — | Independent migration lab. |
| Orchestration — Deploy and Verify on OpenShift | NO VIDEO | — | — | Deployment evidence. |
| Orchestration — Transfer Deployment Authority to Argo CD | NO VIDEO | — | — | Authority cutover must be performed and evidenced. |
| Orchestration — Orchestration and GitOps Review | NO VIDEO | — | — | Review. |
| Canary — Progressive Delivery with Canary Releases | RECOMMENDED VIDEO | Argo Rollouts/canary visual demos reviewed | No candidate promoted yet | Traffic percentages, analysis and promotion/abort are inherently visual. |
| Canary — Design Steward's Canary Contract | NO VIDEO | — | — | Design from service risk and SLO evidence. |
| Canary — Implement Argo Rollouts Canary Delivery | RECOMMENDED VIDEO | Argo Rollouts live demos reviewed | No candidate promoted yet | Seeing rollout steps and controller state is useful before independent implementation. |
| Canary — Automate Analysis and Abort a Bad Canary | RECOMMENDED VIDEO | Argo Rollouts + Prometheus analysis demos reviewed | No candidate promoted yet | Metric gate→abort flow is a strong live demonstration. |
| Canary — Reassess Progressive Delivery | NO VIDEO | — | — | Architecture reassessment. |
| Architecture/Cost — Availability in Cloud Environments | RECOMMENDED VIDEO | Cloud failure-domain/HA diagrams reviewed | No candidate promoted yet | Availability topology is visual. |
| Architecture/Cost — Scalability and Capacity | RECOMMENDED VIDEO | Scaling/bottleneck diagrams reviewed | No candidate promoted yet | Demand/capacity/bottleneck relationships benefit from graphs. |
| Architecture/Cost — Security Boundaries | RECOMMENDED VIDEO | Cloud trust-path diagrams reviewed | No candidate promoted yet | Public/operator/runtime/control-plane separation is visual. |
| Architecture/Cost — Backup and Recovery | RECOMMENDED VIDEO | Cloud restore/DR demos reviewed | No candidate promoted yet | Recovery sequence and failure domains are visual. |
| Architecture/Cost — Failure Domains | RECOMMENDED VIDEO | Region/AZ correlated-failure diagrams reviewed | No candidate promoted yet | Redundancy versus shared fate is inherently visual. |
| Architecture/Cost — Cost Estimation | OPTIONAL VIDEO | Cloud pricing-calculator walkthroughs reviewed | No candidate promoted yet | Useful context, but estimates should use current provider data when learner reaches lesson. |
| Architecture/Cost — Cost Controls and Budgets | OPTIONAL VIDEO | Budget/alert demos reviewed | No candidate promoted yet | A console demo may help but is provider-specific. |
| Architecture/Cost — Resource Right-sizing | RECOMMENDED VIDEO | Right-sizing metrics demos reviewed | No candidate promoted yet | Before/after utilization and cost evidence is valuable. |
| Cloud Milestone — Milestone Brief: Steward Internet Environment | NO VIDEO | — | — | Milestone brief. |
| Cloud Milestone — Milestone Review and Exit Criteria | NO VIDEO | — | — | Evidence review. |
| Cloud Milestone — Cloud Engineer Exit Review | NO VIDEO | — | — | Reflection/transfer check. |


## Quality Steward — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Quality Engineering — Quality vs Testing | OPTIONAL VIDEO | Modern testing/quality engineering talks reviewed | No candidate promoted yet | A strong talk can reframe quality as system property, but strategy work is primary. |
| Quality Engineering — Quality Risks | NO VIDEO | — | — | Build the living risk model. |
| Quality Engineering — Test Strategy | NO VIDEO | — | — | Design the strategy from product risk. |
| Quality Engineering — Test Levels and Test Types | OPTIONAL VIDEO | Testing-pyramid/levels visualizations reviewed | No candidate promoted yet | A visual boundary map can reinforce level/type distinction. |
| Quality Engineering — Risk-based Testing | NO VIDEO | — | — | Prioritization is a reasoning exercise. |
| Quality Engineering — Shift-left and Shift-right | OPTIONAL VIDEO | Continuous testing lifecycle talks reviewed | No candidate promoted yet | A delivery-lifecycle diagram can help. |
| Quality Engineering — Testability | RECOMMENDED VIDEO | Testability/observability design talks reviewed | No candidate promoted yet | Control/observe boundaries benefit from concrete demonstrations. |
| Quality Engineering — Defect Evidence and Communication | NO VIDEO | — | — | Write evidence from actual failures. |
| Quality Engineering — Lab: Write the Steward Quality Strategy | NO VIDEO | — | — | Synthesis lab. |
| Test Design — Requirements Analysis for Testing | NO VIDEO | — | — | Interrogate real requirements. |
| Test Design — Equivalence Partitioning | RECOMMENDED VIDEO | ISTQB-style partition demonstrations reviewed | No candidate promoted yet | Partitioning behavior is easy to reinforce with worked visual examples. |
| Test Design — Boundary Value Analysis | RECOMMENDED VIDEO | Boundary-value demonstrations reviewed | No candidate promoted yet | Rule transitions benefit from a number-line/table visualization. |
| Test Design — Decision Tables | RECOMMENDED VIDEO | Decision-table demonstrations reviewed | No candidate promoted yet | Condition/action combinations are inherently tabular/visual. |
| Test Design — State Transition Testing | RECOMMENDED VIDEO | State-machine testing demos reviewed | No candidate promoted yet | States/events/invalid transitions are visual. |
| Test Design — Pairwise and Combinatorial Concepts | RECOMMENDED VIDEO | Pairwise generation demonstrations reviewed | No candidate promoted yet | Combinatorial explosion and reduced pair coverage benefit from a matrix. |
| Test Design — Exploratory Testing | OPTIONAL VIDEO | James Bach/Michael Bolton exploratory-testing talks reviewed | No candidate promoted yet | A real session can model charter→observation→learning, but learner exploration is primary. |
| Test Design — Negative Testing | NO VIDEO | — | — | Design failures against invariants directly. |
| Test Design — Traceability | NO VIDEO | — | — | Build the actual risk→condition→evidence trace. |
| Test Design — Lab: Design Risk-based Steward Test Coverage | NO VIDEO | — | — | Synthesis lab. |
| Unit/Component — Designing Unit Tests | OPTIONAL VIDEO | Unit-testing design talks reviewed | No candidate promoted yet | A worked behavior-focused test can help. |
| Unit/Component — Isolation | RECOMMENDED VIDEO | Isolation/nondeterminism demonstrations reviewed | No candidate promoted yet | Controlled dependencies are useful to see live. |
| Unit/Component — Test Doubles | RECOMMENDED VIDEO | Mock/stub/fake explanations reviewed | No candidate promoted yet | Different double roles benefit from side-by-side examples. |
| Unit/Component — Mocks, Stubs and Fakes | RECOMMENDED VIDEO | Same test-double candidates | No candidate promoted yet | Behavior versus interaction evidence is clearer in code demonstration. |
| Unit/Component — Coverage and Its Limitations | RECOMMENDED VIDEO | Mutation/coverage demonstrations reviewed | No candidate promoted yet | High coverage with weak assertions is a powerful demonstration. |
| Unit/Component — Component Boundaries | OPTIONAL VIDEO | Component-testing boundary talks reviewed | No candidate promoted yet | A boundary diagram can reinforce the slice. |
| Unit/Component — Fast Feedback and Maintainability | NO VIDEO | — | — | Measure and maintain the actual suite. |
| Unit/Component — Lab: Strengthen Steward Component Tests | NO VIDEO | — | — | Independent lab. |
| API/Integration — API Test Design | NO VIDEO | — | — | Design from the actual contract. |
| API/Integration — Authentication and Authorization Testing | RECOMMENDED VIDEO | Authorization-matrix/BOLA demonstrations reviewed | No candidate promoted yet | A broken-access example can make privilege boundaries concrete. |
| API/Integration — Schema and Contract Validation | RECOMMENDED VIDEO | Contract-testing/Pact demonstrations reviewed | No candidate promoted yet | Provider/consumer expectation flow is visual. |
| API/Integration — Database Assertions | NO VIDEO | — | — | Use persistence as supporting evidence directly. |
| API/Integration — Integration Boundaries | NO VIDEO | — | — | Name and implement the boundary. |
| API/Integration — Contract Testing Concepts | RECOMMENDED VIDEO | Pact contract-testing demos reviewed | No candidate promoted yet | Consumer/provider contract publication and verification benefit from demonstration. |
| API/Integration — Mocking and Service Virtualization | RECOMMENDED VIDEO | Service-virtualization demos reviewed | No candidate promoted yet | Real-versus-virtual boundary and failure simulation are visual. |
| API/Integration — Internal Package Compatibility | NO VIDEO | — | — | Test package compatibility as consumed. |
| API/Integration — Data Setup and Cleanup | NO VIDEO | — | — | Implement deterministic state ownership. |
| API/Integration — Lab: Test Steward API End-to-End at the Service Layer | NO VIDEO | — | — | Independent lab. |
| API/Integration — Lab: Test Steward API End-to-End at the Service Layer | NO VIDEO | — | — | Synthesis lab. |
| Automation — What Makes an Automation Framework | OPTIONAL VIDEO | Framework architecture walkthroughs reviewed | No candidate promoted yet | A repository walkthrough can orient without prescribing architecture. |
| Automation — Framework Architecture | RECOMMENDED VIDEO | Playwright/pytest framework walkthroughs reviewed | No candidate promoted yet | Layers and dependency direction benefit from a codebase tour. |
| Automation — Playwright with Python | RECOMMENDED VIDEO | Playwright official Python material reviewed | No candidate promoted yet | A real execution and trace demo is useful before framework integration. |
| Automation — pytest Fundamentals | OPTIONAL VIDEO | pytest introductions reviewed | No candidate promoted yet | Useful orientation; hands-on tests remain primary. |
| Automation — Configuration | NO VIDEO | — | — | Implement and validate actual configuration. |
| Automation — Fixtures | RECOMMENDED VIDEO | pytest fixture demos reviewed | No candidate promoted yet | Fixture dependency, scope and teardown are easier to see in execution. |
| Automation — Test Data | NO VIDEO | — | — | Design and manage real test data. |
| Automation — API Clients | NO VIDEO | — | — | Implement reusable client boundaries directly. |
| Automation — Page Objects and UI Abstractions | OPTIONAL VIDEO | Playwright POM examples reviewed | No candidate promoted yet | A refactor can help, without teaching POM as mandatory dogma. |
| Automation — Helpers and Utilities | NO VIDEO | — | — | Reuse boundaries should emerge from actual duplication. |
| Automation — Assertions | NO VIDEO | — | — | Concrete false-positive/negative cases are stronger. |
| Automation — Markers and Tags | NO VIDEO | — | — | Small pytest mechanism; docs and practice suffice. |
| Automation — Parameterization | NO VIDEO | — | — | Small mechanism; executable examples suffice. |
| Automation — Automation Logging | OPTIONAL VIDEO | Test-diagnostics demos reviewed | No candidate promoted yet | A before/after failure diagnosis can reinforce useful logging. |
| Automation — Reports | OPTIONAL VIDEO | pytest/CI report demos reviewed | No candidate promoted yet | Seeing a report consumed in triage adds context. |
| Automation — Screenshots, Traces and Video | RECOMMENDED VIDEO | Playwright Trace Viewer demos reviewed | No candidate promoted yet | The capability is itself visual; a trace-viewer demo materially helps. |
| Automation — Parallel Execution | RECOMMENDED VIDEO | pytest-xdist/Playwright parallel demos reviewed | No candidate promoted yet | Worker scheduling and shared-state failures benefit from demonstration. |
| Automation — Retries and Flaky-test Risk | RECOMMENDED VIDEO | Flaky-test/retry talks reviewed | No candidate promoted yet | A repeated intermittent failure makes masking risk concrete. |
| Automation — Framework Maintainability | NO VIDEO | — | — | Refactor and evaluate the actual framework. |
| Automation — Reusable Testing Infrastructure vs Domain Test Code | NO VIDEO | — | — | Boundary decision is contextual. |
| Automation — Designing Public APIs for Test Libraries | NO VIDEO | — | — | Design the actual package API. |
| Automation — Reusable pytest Fixtures and Plugins | OPTIONAL VIDEO | pytest plugin demos reviewed | No candidate promoted yet | A small plugin walkthrough can help before extraction. |
| Automation — Versioning Shared Test Infrastructure | NO VIDEO | — | — | Version/compatibility exercise is primary. |
| Automation — Lab: Build the Steward Automation Framework | NO VIDEO | — | — | Independent build. |
| Automation — Lab: Extract tsa-test-core | NO VIDEO | — | — | Independent extraction. |
| Automation — Lab: Publish and Consume tsa-test-core | NO VIDEO | — | — | Independent package lifecycle lab. |
| Browser — Decision Gate: Does Steward Need Browser Testing? | NO VIDEO | — | — | Decision gate should use actual product surface/risk. |
| Browser — Browser Differences | RECOMMENDED VIDEO | Browser-engine/rendering demos reviewed | No candidate promoted yet | Engine differences and reproducibility benefit from visual comparison. |
| Browser — Responsive Testing | RECOMMENDED VIDEO | Playwright responsive/device emulation demos reviewed | No candidate promoted yet | Viewport/layout state is inherently visual. |
| Browser — Cross-browser Testing | RECOMMENDED VIDEO | Playwright/BrowserStack cross-browser demos reviewed | No candidate promoted yet | Running the same claim across engines is useful to see. |
| Browser — BrowserStack or Equivalent | OPTIONAL VIDEO | BrowserStack product demos reviewed | No candidate promoted yet | Provider UI can orient, but vendor-specific walkthroughs age quickly. |
| Browser — Local vs Remote Execution | OPTIONAL VIDEO | Remote-browser architecture demos reviewed | No candidate promoted yet | Execution-location dependency differences can benefit from a diagram. |
| Browser — Environment Parity and Configuration Risk | NO VIDEO | — | — | Compare actual environments and configuration. |
| Browser — Lab: Run Steward Tests Across Environments | NO VIDEO | — | — | Independent environment lab. |
| Non-functional — Decision Gate: Select the Steward Performance Tool | OPTIONAL VIDEO | k6/JMeter/Gatling demos reviewed | No candidate promoted yet | A short tool execution comparison can inform choice, but the gate must remain criteria-driven. |
| Non-functional — Performance Testing | RECOMMENDED VIDEO | Grafana k6 load-test demos reviewed | No candidate promoted yet | Virtual users, latency percentiles and saturation graphs are valuable to see. |
| Non-functional — Load, Stress, Spike and Endurance | RECOMMENDED VIDEO | Performance test-shape demos reviewed | No candidate promoted yet | Traffic-shape graphs make the distinctions concrete. |
| Non-functional — Accessibility Fundamentals | RECOMMENDED VIDEO | screen-reader/accessibility testing demos reviewed | No candidate promoted yet | Experiencing keyboard/screen-reader behavior adds something text cannot. |
| Non-functional — Compatibility Testing | OPTIONAL VIDEO | Compatibility matrix demos reviewed | No candidate promoted yet | Useful reinforcement, but matrix design is primary. |
| Non-functional — Reliability-oriented Testing | RECOMMENDED VIDEO | failure/recovery testing demos reviewed | No candidate promoted yet | Seeing a dependency fail during a test reinforces temporal behavior. |
| Non-functional — Data Integrity and Concurrency Testing | RECOMMENDED VIDEO | concurrency/race test demos reviewed | No candidate promoted yet | Two-session timelines and invariants are visual. |
| Non-functional — Lab: Establish Steward Non-functional Baselines | NO VIDEO | — | — | Independent baseline lab. |
| CI — Test Containers and Environments | RECOMMENDED VIDEO | Dockerized test-dependency demos reviewed | No candidate promoted yet | Test process→container dependency topology is visual. |
| CI — Dockerized Test Dependencies | RECOMMENDED VIDEO | Testcontainers/Docker Compose test demos reviewed | No candidate promoted yet | Lifecycle and isolation benefit from live execution. |
| CI — Test Pipeline Stages | RECOMMENDED VIDEO | CI test-pipeline walkthroughs reviewed | No candidate promoted yet | Stage ordering and feedback latency are easier to see in a pipeline. |
| CI — Parallelization | RECOMMENDED VIDEO | CI parallel test demos reviewed | No candidate promoted yet | Workers/shards/artifacts benefit from visualization. |
| CI — Reports and Artifacts | OPTIONAL VIDEO | CI artifact/report demos reviewed | No candidate promoted yet | Seeing diagnostics consumed after a failure adds context. |
| CI — Quality Gates | OPTIONAL VIDEO | quality-gate pipeline demos reviewed | No candidate promoted yet | Useful reinforcement; actual policy design is primary. |
| CI — Test Selection | NO VIDEO | — | — | Selection should be designed from suite risk/cost. |
| CI — Failure Triage | RECOMMENDED VIDEO | CI failure-triage demos reviewed | No candidate promoted yet | A real red pipeline investigation is valuable. |
| CI — Flaky-test Containment | RECOMMENDED VIDEO | flake quarantine/retry demos reviewed | No candidate promoted yet | Seeing quarantine versus masking clarifies the policy. |
| CI — Internal Test Package Publishing and Compatibility in CI | NO VIDEO | — | — | Implement package lifecycle and compatibility directly. |
| CI — Lab: Build the Steward Quality Pipeline | NO VIDEO | — | — | Independent pipeline lab. |
| Scheduled Execution — Continuous and Scheduled Quality Execution | OPTIONAL VIDEO | Jenkins trigger/cron demos reviewed | No candidate promoted yet | Orientation can help, but policy/evidence are primary. |
| Scheduled Execution — Design Triggered Quality Feedback | NO VIDEO | — | — | Design from feedback needs. |
| Scheduled Execution — Implement SCM-triggered Automated Testing | RECOMMENDED VIDEO | Jenkins SCM-trigger demos reviewed | No candidate promoted yet | Webhook/SCM→job→test flow is useful to see. |
| Scheduled Execution — Implement Jenkins CRON Regression | RECOMMENDED VIDEO | Jenkins cron/pipeline demos reviewed | No candidate promoted yet | Scheduling and collision behavior benefit from live demonstration. |
| Scheduled Execution — Implement Failure Alerts and Reports | RECOMMENDED VIDEO | Jenkins notification/report demos reviewed | No candidate promoted yet | Failure→alert→diagnostic artifact is a useful end-to-end workflow. |
| Scheduled Execution — Defend the Quality Execution Policy | NO VIDEO | — | — | Defence uses learner evidence. |
| Quality Milestone — Quality Steward Milestone Readiness | NO VIDEO | — | — | Readiness review. |
| Quality Milestone — Integrate the Quality Steward System | NO VIDEO | — | — | Integration work. |
| Quality Milestone — Audit the Existing Evidence | NO VIDEO | — | — | Evidence audit. |
| Quality Milestone — Milestone: Steward Quality Platform | NO VIDEO | — | — | Milestone synthesis. |
| Quality Milestone — Quality Steward Final Review | NO VIDEO | — | — | Final defence/reflection. |

## Security Steward — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Foundations — Confidentiality, Integrity and Availability | OPTIONAL VIDEO | CIA-triad visual explainers reviewed | No candidate promoted yet | A simple scenario animation can reinforce trade-offs, but the concept is compact. |
| Foundations — Assets, Threats, Vulnerabilities and Risk | RECOMMENDED VIDEO | Threat/risk modeling explainers reviewed | No candidate promoted yet | Relationships among asset/threat/vulnerability/control are visual. |
| Foundations — Attack Surface | RECOMMENDED VIDEO | Attack-surface mapping demos reviewed | No candidate promoted yet | A system diagram evolving into exposed entry points adds value. |
| Foundations — Least Privilege | NO VIDEO | — | — | Apply privilege boundaries directly. |
| Foundations — Defense in Depth | OPTIONAL VIDEO | Layered-control explainers reviewed | No candidate promoted yet | Layer visualization can reinforce independent controls. |
| Foundations — Trust Boundaries | RECOMMENDED VIDEO | Trust-boundary diagram demos reviewed | No candidate promoted yet | Boundary crossings are inherently visual. |
| Foundations — Security Controls: Preventive, Detective and Corrective | OPTIONAL VIDEO | Control-type examples reviewed | No candidate promoted yet | A short incident timeline can reinforce control roles. |
| Foundations — Risk Treatment and Residual Risk | NO VIDEO | — | — | Risk decision should be made from scenario evidence. |
| Threat Modeling — Assets and Actors | NO VIDEO | — | — | Map actual system actors/assets. |
| Threat Modeling — Data and Control Flows | RECOMMENDED VIDEO | OWASP threat-modeling walkthroughs reviewed | No candidate promoted yet | A worked data-flow diagram is valuable. |
| Threat Modeling — Trust Boundaries | RECOMMENDED VIDEO | OWASP threat-modeling walkthroughs reviewed | No candidate promoted yet | Seeing boundaries added to a DFD clarifies threat locations. |
| Threat Modeling — Threat Identification | RECOMMENDED VIDEO | OWASP threat-modeling sessions reviewed | No candidate promoted yet | A real identification session models the reasoning process. |
| Threat Modeling — STRIDE-style Thinking | RECOMMENDED VIDEO | STRIDE walkthroughs reviewed | No candidate promoted yet | Applying categories to a diagram is better demonstrated than memorized. |
| Threat Modeling — Abuse Cases | OPTIONAL VIDEO | Abuse-case workshops reviewed | No candidate promoted yet | A worked adversarial scenario can help. |
| Threat Modeling — Threat Prioritization | NO VIDEO | — | — | Prioritize actual threats using impact/likelihood/evidence. |
| Threat Modeling — Mitigations and Security Requirements | NO VIDEO | — | — | Translate threats into actual controls/requirements. |
| Threat Modeling — Threat Models as Living Engineering Artifacts | OPTIONAL VIDEO | Threat-model maintenance talks reviewed | No candidate promoted yet | Industry workflow context is useful but not required. |
| Web/API — Injection and SQL Injection | RECOMMENDED VIDEO | PortSwigger/OWASP SQLi demonstrations reviewed | No candidate promoted yet | Seeing input alter query behavior makes the vulnerability concrete. |
| Web/API — Cross-site Scripting | RECOMMENDED VIDEO | PortSwigger XSS demonstrations reviewed | No candidate promoted yet | Browser execution makes XSS inherently demonstrable. |
| Web/API — Cross-site Request Forgery | RECOMMENDED VIDEO | PortSwigger CSRF demonstrations reviewed | No candidate promoted yet | Browser/session/request flow benefits from live demonstration. |
| Web/API — Broken Authentication | RECOMMENDED VIDEO | OWASP auth-failure demos reviewed | No candidate promoted yet | Concrete bypass/session failures add value. |
| Web/API — Broken Authorization and IDOR | RECOMMENDED VIDEO | PortSwigger access-control/IDOR labs reviewed | No candidate promoted yet | Changing object identifiers across users is a powerful live demo. |
| Web/API — Server-side Request Forgery | RECOMMENDED VIDEO | PortSwigger SSRF demos reviewed | No candidate promoted yet | Victim server→internal target request path is highly visual. |
| Web/API — Path Traversal | RECOMMENDED VIDEO | PortSwigger traversal demos reviewed | No candidate promoted yet | Path manipulation escaping intended root is demonstrable. |
| Web/API — File Upload Risks | RECOMMENDED VIDEO | OWASP/PortSwigger upload demos reviewed | No candidate promoted yet | Content/type/storage/execution boundary failures are demonstrable. |
| Web/API — Command Injection | RECOMMENDED VIDEO | PortSwigger command-injection demos reviewed | No candidate promoted yet | Input crossing into shell execution is valuable to see. |
| Web/API — Insecure Deserialization Concepts | RECOMMENDED VIDEO | Deserialization exploit explainers reviewed | No candidate promoted yet | Object reconstruction→unexpected behavior benefits from a worked demo. |
| Web/API — Security Misconfiguration | OPTIONAL VIDEO | Misconfiguration demos reviewed | No candidate promoted yet | Useful examples, but actual configuration audit is primary. |
| Web/API — Sensitive Data and Secrets | NO VIDEO | — | — | Inspect and protect actual data/secret paths. |
| Web/API — API Abuse and Rate Limiting | RECOMMENDED VIDEO | rate-limit/abuse demos reviewed | No candidate promoted yet | Request bursts and throttling behavior are temporal/visual. |
| Web/API — Token and Session Attacks | RECOMMENDED VIDEO | JWT/session attack demos reviewed | No candidate promoted yet | Token lifecycle/replay/tampering are strong live examples. |
| Web/API — Cryptographic Failures | OPTIONAL VIDEO | crypto misuse explainers reviewed | No candidate promoted yet | Use visual intuition selectively; authoritative guidance remains primary. |
| Web/API — Security Misconfiguration | RECOMMENDED VIDEO | OWASP misconfiguration demonstrations reviewed | No candidate promoted yet | A concrete exposed-debug/default-config example makes configuration risk tangible. |
| Web/API — Sensitive Data and Secrets | OPTIONAL VIDEO | Secret-exposure demos reviewed | No candidate promoted yet | A short leak→abuse example can reinforce consequences; implementation controls remain primary. |
| Web/API — API Abuse and Rate Limiting | RECOMMENDED VIDEO | API abuse/rate-limit demonstrations reviewed | No candidate promoted yet | Request bursts, quotas and client-visible throttling are useful to see. |
| Web/API — Token and Session Attacks | RECOMMENDED VIDEO | PortSwigger token/session labs reviewed | No candidate promoted yet | Replay/fixation/theft behavior is best understood from request flows. |
| Web/API — Cryptographic Failures | OPTIONAL VIDEO | Crypto-failure explainers reviewed | No candidate promoted yet | Visual examples help, but TSA should avoid turning this into a cryptography lecture. |
| Web/API — Vulnerable Dependencies | RECOMMENDED VIDEO | Dependency/SBOM vulnerability demos reviewed | No candidate promoted yet | Seeing a dependency finding traced to an exploitable path adds value. |
| Web/API — Security Logging and Monitoring Failures | OPTIONAL VIDEO | Detection-gap incident demos reviewed | No candidate promoted yet | A missed-versus-detected attack timeline can reinforce observability needs. |
| Web/API — Mass Assignment and Excessive Data Exposure | RECOMMENDED VIDEO | API mass-assignment/data-exposure demos reviewed | No candidate promoted yet | Manipulating hidden/unintended fields is concrete and demonstrable. |
| Web/API — Lab: Assess Steward Web and API Attack Paths | NO VIDEO | — | — | Independent threat-driven assessment lab. |
| Vulnerability Lab — Designing an Isolated Security Lab | RECOMMENDED VIDEO | Isolated lab-network walkthroughs reviewed | No candidate promoted yet | Seeing host-only/NAT/isolated boundaries helps prevent unsafe exposure. |
| Vulnerability Lab — Safe Lab Networking | RECOMMENDED VIDEO | Virtual lab networking demos reviewed | No candidate promoted yet | Network containment is spatial and benefits from topology demonstration. |
| Vulnerability Lab — Vulnerable Applications and Intentional Weaknesses | OPTIONAL VIDEO | OWASP Juice Shop orientation reviewed | No candidate promoted yet | A short orientation can reduce tool friction without becoming a walkthrough of answers. |
| Vulnerability Lab — Observing Vulnerable Behavior | NO VIDEO | — | — | Learner should inspect the target directly. |
| Vulnerability Lab — Reproducing Representative Attacks Safely | RECOMMENDED VIDEO | PortSwigger/OWASP lab demos reviewed | No candidate promoted yet | A bounded demonstration models evidence capture and safe reproduction. |
| Vulnerability Lab — Using Proxies and Request Inspection | RECOMMENDED VIDEO | Burp Suite request-interception demos reviewed | No candidate promoted yet | Proxy interception is a UI workflow worth seeing once. |
| Vulnerability Lab — Capturing Security Evidence | NO VIDEO | — | — | Evidence discipline should be practiced directly. |
| Vulnerability Lab — From Finding to Reproduction Steps | NO VIDEO | — | — | Writing reproducible steps is the learning task. |
| Vulnerability Lab — Implementing Mitigations | NO VIDEO | — | — | Fix the actual weakness. |
| Vulnerability Lab — Retesting Fixes | NO VIDEO | — | — | Independent verification is primary. |
| Vulnerability Lab — Writing Security Findings | NO VIDEO | — | — | Writing the finding is the exercise. |
| Vulnerability Lab — Lab: Reproduce and Fix Steward Vulnerabilities | NO VIDEO | — | — | Independent security lab. |
| Linux/Network Security — Users, Groups and Permissions | NO VIDEO | — | — | Apply prior Linux knowledge under security constraints. |
| Linux/Network Security — Privilege and sudo | RECOMMENDED VIDEO | sudo/privilege-escalation demonstrations reviewed | No candidate promoted yet | Seeing command-specific privilege and failure cases reinforces least privilege. |
| Linux/Network Security — SSH Hardening | RECOMMENDED VIDEO | OpenSSH hardening demos reviewed | No candidate promoted yet | A live before/after configuration and negative login test adds value. |
| Linux/Network Security — Host Firewalls | NO VIDEO | — | — | Prior firewall concepts; harden actual host. |
| Linux/Network Security — Service Exposure | RECOMMENDED VIDEO | socket/exposure enumeration demos reviewed | No candidate promoted yet | Listening sockets→network reachability→attack surface is useful to see. |
| Linux/Network Security — Patching and Vulnerability Windows | OPTIONAL VIDEO | Patch-window/risk explainers reviewed | No candidate promoted yet | Incident context can reinforce urgency; patch lifecycle was already taught. |
| Linux/Network Security — File and Secret Permissions | NO VIDEO | — | — | Direct permission proof is primary. |
| Linux/Network Security — Security Logging and Auditing | RECOMMENDED VIDEO | auditd/security-log demos reviewed | No candidate promoted yet | A live event→audit record investigation adds value. |
| Linux/Network Security — Network Segmentation Concepts | RECOMMENDED VIDEO | segmentation/topology demos reviewed | No candidate promoted yet | Trust zones and permitted flows are visual. |
| Linux/Network Security — Administrative Network Boundaries | RECOMMENDED VIDEO | management-plane isolation examples reviewed | No candidate promoted yet | Separate admin/data paths benefit from topology visualization. |
| Linux/Network Security — TLS Configuration and Certificate Hygiene | RECOMMENDED VIDEO | TLS/certificate inspection demos reviewed | No candidate promoted yet | Seeing chain/hostname/protocol evidence is useful before hardening. |
| Linux/Network Security — Lab: Harden the Steward Hosts and Network Path | NO VIDEO | — | — | Independent hardening lab. |
| Supply Chain — Lab: Harden the Steward Software Supply Chain | NO VIDEO | — | — | Independent integration lab. |
| Supply Chain — Map and Baseline the Trusted Delivery Path | RECOMMENDED VIDEO | software-supply-chain diagrams/talks reviewed | No candidate promoted yet | Source→build→artifact→deploy trust chain is inherently visual. |
| Supply Chain — Implement High-value Supply-chain Controls | OPTIONAL VIDEO | SBOM/scanning/signing demos reviewed | No candidate promoted yet | Specific controls may benefit from demos; implementation remains primary. |
| Supply Chain — Define Gates, Exceptions and Residual Risk | NO VIDEO | — | — | Policy design and exception reasoning are primary. |
| Artifact Trust — Artifact Signing and Verification | RECOMMENDED VIDEO | Sigstore/Cosign signing demos reviewed | No candidate promoted yet | Keyless/key-based signing and verification are command workflows worth seeing. |
| Artifact Trust — From Provenance Evidence to Enforced Trust | RECOMMENDED VIDEO | Sigstore verification-policy talks reviewed | No candidate promoted yet | The distinction between evidence and enforced admission is architectural and visual. |
| Artifact Trust — Sign a Steward Release with Cosign | NO VIDEO | — | — | Learner must sign the actual release. |
| Artifact Trust — Enforce Verification Before Deployment | RECOMMENDED VIDEO | Cosign/admission verification demos reviewed | No candidate promoted yet | A rejected unsigned/tampered artifact is a strong live demonstration. |
| Artifact Trust — Break and Recover the Signing Trust Chain | NO VIDEO | — | — | Failure injection/recovery is the exercise. |
| Artifact Trust — Defend Steward's Artifact Trust Policy | NO VIDEO | — | — | Defence uses learner evidence. |
| Identity/Secrets — Identity Planes and Trust Boundaries | RECOMMENDED VIDEO | OIDC/identity-plane diagrams reviewed | No candidate promoted yet | Human/workload/service identity boundaries are visual. |
| Identity/Secrets — OAuth 2.0 and OpenID Connect Mental Model | RECOMMENDED VIDEO | OAuth/OIDC visual flows reviewed | No candidate promoted yet | Browser/client/IdP/API sequence is best shown as a flow. |
| Identity/Secrets — Keycloak Realms, Clients, Users and Roles | RECOMMENDED VIDEO | Keycloak official/community demos reviewed | No candidate promoted yet | The admin UI and token claims are useful to see once. |
| Identity/Secrets — Machine and Workload Identity | RECOMMENDED VIDEO | workload-identity/mTLS/OIDC talks reviewed | No candidate promoted yet | Non-human identity lifecycle benefits from architecture diagrams. |
| Identity/Secrets — Secret Lifecycle: Create, Distribute, Rotate, Revoke | RECOMMENDED VIDEO | secret-lifecycle demonstrations reviewed | No candidate promoted yet | Rotation/revocation timelines add operational intuition. |
| Identity/Secrets — Vault Concepts and Dynamic Secrets | RECOMMENDED VIDEO | HashiCorp Vault dynamic-secrets demos reviewed | No candidate promoted yet | Lease issuance/renewal/revocation is especially useful to see live. |
| Identity/Secrets — Kong, Identity and API Policy | RECOMMENDED VIDEO | Kong/OIDC policy-flow demos reviewed | No candidate promoted yet | Gateway→IdP→API policy flow is visual. |
| Identity/Secrets — Identity and Secrets Security Review | NO VIDEO | — | — | Review uses actual architecture/evidence. |
| Identity/Secrets — Lab: Integrate Keycloak and Harden Steward Identity | NO VIDEO | — | — | Independent integration lab. |
| Vault — Vault and Dynamic Secrets for Steward | RECOMMENDED VIDEO | HashiCorp Vault demos reviewed | No candidate promoted yet | Seeing dynamic credentials issued with TTL makes the model concrete. |
| Vault — From Static Secrets to Leased Credentials | RECOMMENDED VIDEO | Vault database-secrets demos reviewed | No candidate promoted yet | Static→dynamic comparison and lease lifecycle are visual. |
| Vault — Deploy and Initialize Vault Safely | OPTIONAL VIDEO | Vault initialization/unseal demos reviewed | No candidate promoted yet | UI/CLI orientation helps, but learner must understand recovery boundaries. |
| Vault — Issue Dynamic PostgreSQL Credentials | RECOMMENDED VIDEO | Vault database-secrets engine demos reviewed | No candidate promoted yet | Credential creation, TTL and revocation are strong live demonstrations. |
| Vault — Break Vault and Rotate Trust | NO VIDEO | — | — | Failure/rotation drill is primary. |
| Vault — Reassess the Secrets Platform | NO VIDEO | — | — | Architecture reassessment uses evidence. |
| PKI — Model Internal PKI and Machine Trust | RECOMMENDED VIDEO | PKI chain/trust diagrams reviewed | No candidate promoted yet | Root→intermediate→leaf and trust-anchor relationships are inherently visual. |
| PKI — Build a Root and Issuing CA Hierarchy | RECOMMENDED VIDEO | CA hierarchy/OpenSSL demos reviewed | No candidate promoted yet | Seeing certificate chain construction helps before implementation. |
| PKI — Issue Workload Certificates with Explicit Identity | RECOMMENDED VIDEO | SAN/EKU certificate demos reviewed | No candidate promoted yet | Inspecting identity fields in real certificates adds value. |
| PKI — Distribute Trust without Disabling Verification | RECOMMENDED VIDEO | Linux/Windows trust-store demos reviewed | No candidate promoted yet | Cross-platform trust-store behavior is useful to see. |
| PKI — Implement Mutual TLS between Workloads | RECOMMENDED VIDEO | mTLS handshake demos reviewed | No candidate promoted yet | Both sides presenting/verifying identity is best shown as a sequence. |
| PKI — Rotate Certificates without Changing Identity Semantics | OPTIONAL VIDEO | certificate rotation demos reviewed | No candidate promoted yet | Timeline can reinforce overlap/cutover, but drill is primary. |
| PKI — Revocation and Compromised Identity Response | RECOMMENDED VIDEO | CRL/OCSP/revocation demos reviewed | No candidate promoted yet | Revocation lookup/failure behavior benefits from visualization. |
| PKI — Trust-Anchor Rotation and Failure Recovery | RECOMMENDED VIDEO | CA/intermediate rotation material reviewed | No candidate promoted yet | Overlapping trust and cutover are sequence-oriented. |
| PKI — Milestone: Operate Steward Internal Machine Trust | NO VIDEO | — | — | Milestone synthesis. |
| PKI — Reassess PKI Ownership with Vault | NO VIDEO | — | — | Ownership decision from evidence. |
| Directory Federation — Directory Federation Architecture | RECOMMENDED VIDEO | Keycloak LDAP federation architecture demos reviewed | No candidate promoted yet | Directory→Keycloak→OIDC→application identity path is visual. |
| Directory Federation — Keycloak LDAP Federation | RECOMMENDED VIDEO | Keycloak LDAP federation walkthroughs reviewed | No candidate promoted yet | Admin configuration, sync and claim mapping are useful to see. |
| Directory Federation — Federated Identity Lifecycle and Failure Modes | RECOMMENDED VIDEO | federation lifecycle/outage demos reviewed | No candidate promoted yet | Disable/delete/outage/trust-failure behavior benefits from a timeline. |
| Directory Federation — Active Directory, LDAP and Kerberos Context | RECOMMENDED VIDEO | AD/LDAP/Kerberos relationship explainers reviewed | No candidate promoted yet | Protocol/service relationships are easy to confuse and benefit from a visual map. |
| SFTP Migration — FTP to SFTP Secure Transfer Migration | RECOMMENDED VIDEO | FTP/SFTP protocol-flow comparisons reviewed | No candidate promoted yet | The transport/security-model difference benefits from packet/flow visualization. |
| SFTP Migration — From Legacy Compatibility to Secure Transfer | NO VIDEO | — | — | Migration pressure and constraints are contextual. |
| SFTP Migration — Build the SFTP Trust and Identity Boundary | RECOMMENDED VIDEO | OpenSSH SFTP key/host-key demos reviewed | No candidate promoted yet | User key authentication plus host-key trust is a live workflow. |
| SFTP Migration — Prove File-Contract Parity over SFTP | NO VIDEO | — | — | Parity proof is the exercise. |
| SFTP Migration — Run Bounded FTP and SFTP Coexistence | OPTIONAL VIDEO | migration/cutover demonstrations reviewed | No candidate promoted yet | A coexistence timeline can reinforce bounded migration. |
| SFTP Migration — Decommission FTP and Prove the Security End State | NO VIDEO | — | — | Negative proof that FTP no longer works is primary. |
| SFTP Migration — Defend the Secure Transfer Migration | NO VIDEO | — | — | Defence uses evidence. |
| Application Security — Secure Authentication | NO VIDEO | — | — | Apply prior auth security to actual application. |
| Application Security — Authorization Design and Testing | NO VIDEO | — | — | Authorization matrix and negative tests are primary. |
| Application Security — Input Validation | NO VIDEO | — | — | Implement/retest actual validation. |
| Application Security — Secure Error Handling | NO VIDEO | — | — | Implement and inspect actual failure responses. |
| Application Security — Secrets Management | NO VIDEO | — | — | Vault/secret lifecycle already taught. |
| Application Security — Security Headers and Configuration | OPTIONAL VIDEO | browser/header inspection demos reviewed | No candidate promoted yet | A browser/devtools demonstration can reinforce effect. |
| Application Security — Security Logging | NO VIDEO | — | — | Implement and inspect actual security events. |
| Application Security — Rate Limiting and Abuse Resistance | NO VIDEO | — | — | Implement and load-test actual policy. |
| Application Security — Data Protection | NO VIDEO | — | — | Apply classification/protection decisions. |
| Application Security — Security-focused Code Review | OPTIONAL VIDEO | secure-code-review walkthroughs reviewed | No candidate promoted yet | Watching an expert reason through a diff can model review technique. |
| Application Security — Abuse Cases and Negative Security Requirements | NO VIDEO | — | — | Write concrete abuse cases/negative requirements. |
| Application Security — Security Regression Testing | NO VIDEO | — | — | Build automated regression evidence. |
| Application Security — Lab: Harden Steward API | NO VIDEO | — | — | Independent hardening lab. |
| Security Milestone — Milestone Briefing: Build a Defensible Steward Security Posture | NO VIDEO | — | — | Milestone briefing. |
| Security Milestone — Integrate the Security Steward Evidence | NO VIDEO | — | — | Evidence integration. |
| Security Milestone — Evidence Readiness Check | NO VIDEO | — | — | Readiness review. |
| Security Milestone — Milestone: Steward Security Assessment and Hardening | NO VIDEO | — | — | Milestone synthesis. |
| Security Milestone — Rebaseline Threats, Assets and Trust Boundaries | NO VIDEO | — | — | Reassessment uses actual system. |
| Security Milestone — Verify Controls Across the Steward Stack | NO VIDEO | — | — | Verification work. |
| Security Milestone — Close High-priority Gaps and Retest | NO VIDEO | — | — | Remediation/retest. |
| Security Milestone — Publish the Steward Security Assessment | NO VIDEO | — | — | Deliverable creation. |
| Security Milestone — Defend the Security Posture | NO VIDEO | — | — | Final defence. |


## Reliability Engineer — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| SRE — Reliability as a Quality Attribute | OPTIONAL VIDEO | Google SRE talks reviewed | No candidate promoted yet | Industry framing can reinforce the quality/reliability boundary. |
| SRE — Availability | RECOMMENDED VIDEO | availability/error-budget visual explainers reviewed | No candidate promoted yet | Downtime windows and availability math benefit from timelines. |
| SRE — Failure and Recovery | RECOMMENDED VIDEO | recovery lifecycle demos reviewed | No candidate promoted yet | Failure→detect→mitigate→recover is temporal. |
| SRE — SRE Principles | OPTIONAL VIDEO | Google SRE introductory talks reviewed | No candidate promoted yet | Useful context, but TSA implementation remains primary. |
| SRE — Toil | OPTIONAL VIDEO | Google SRE toil talks reviewed | No candidate promoted yet | Real operational examples can clarify toil. |
| SRE — Reliability and Risk Trade-offs | NO VIDEO | — | — | Make actual risk/reliability decisions. |
| SRE — Reliability Ownership | NO VIDEO | — | — | Define ownership from the actual service. |
| SRE — Lab: Build the Steward Reliability Risk Map | NO VIDEO | — | — | Synthesis lab. |
| Observability — Observability vs Monitoring | RECOMMENDED VIDEO | observability/monitoring talks reviewed | No candidate promoted yet | Question→signal→diagnosis distinction benefits from a worked incident. |
| Observability — Logs, Metrics and Traces | RECOMMENDED VIDEO | OpenTelemetry signal explainers reviewed | No candidate promoted yet | Three signal types and correlation are highly visual. |
| Observability — Telemetry Design | NO VIDEO | — | — | Design from actual reliability questions. |
| Observability — Correlation and Context | RECOMMENDED VIDEO | trace/log correlation demos reviewed | No candidate promoted yet | Following one request across signals is ideal for live demonstration. |
| Observability — Instrumentation | RECOMMENDED VIDEO | OpenTelemetry instrumentation demos reviewed | No candidate promoted yet | Code→exporter→backend path is useful to see. |
| Observability — OpenTelemetry Concepts | RECOMMENDED VIDEO | OpenTelemetry official/community intros reviewed | No candidate promoted yet | SDK/provider/exporter/context architecture is visual. |
| Observability — Golden Signals and Service Questions | OPTIONAL VIDEO | Google SRE golden-signals material reviewed | No candidate promoted yet | Useful reinforcement; learner questions remain primary. |
| Observability — Telemetry Cost and Noise | NO VIDEO | — | — | Evaluate actual telemetry volume/value. |
| Observability — Lab: Design Steward Observability | NO VIDEO | — | — | Independent design lab. |
| Logging — Structured Logs | RECOMMENDED VIDEO | structured logging demos reviewed | No candidate promoted yet | Before/after machine-queryable logs are useful to see. |
| Logging — Log Levels | NO VIDEO | — | — | Small policy concept; apply directly. |
| Logging — Correlation IDs | RECOMMENDED VIDEO | correlation-ID demos reviewed | No candidate promoted yet | Following one request across components is a strong live demonstration. |
| Logging — Request and Trace Context | RECOMMENDED VIDEO | trace-context/log-correlation demos reviewed | No candidate promoted yet | Context propagation is sequence-oriented. |
| Logging — Centralized Logging | RECOMMENDED VIDEO | Graylog centralized-logging demos reviewed | No candidate promoted yet | Host/app→collector→search/dashboard path is useful to see. |
| Logging — Useful vs Noisy Logs | NO VIDEO | — | — | Judge actual events against diagnostic questions. |
| Logging — Privacy and Security in Logs | NO VIDEO | — | — | Review actual fields and leakage risk. |
| Logging — Log Retention Concepts | OPTIONAL VIDEO | retention/lifecycle explainers reviewed | No candidate promoted yet | Lifecycle visualization can help but policy is primary. |
| Logging — Lab: Build a Steward Diagnostic Logging Path | NO VIDEO | — | — | Independent implementation lab. |
| Logging — Decision Gate: Select the Steward Centralized Logging Stack | NO VIDEO | — | — | Decision from evidence. |
| Metrics — Metrics Mental Models | RECOMMENDED VIDEO | Prometheus metric-model explainers reviewed | No candidate promoted yet | Time-series labels/samples are visual. |
| Metrics — Counters, Gauges and Histograms | RECOMMENDED VIDEO | Prometheus metric-type demos reviewed | No candidate promoted yet | Histograms/buckets especially benefit from visualization. |
| Metrics — Application and Infrastructure Metrics | OPTIONAL VIDEO | app/infra metric demos reviewed | No candidate promoted yet | Useful examples, but selection should follow questions. |
| Metrics — Prometheus Architecture | RECOMMENDED VIDEO | Prometheus architecture talks reviewed | No candidate promoted yet | Targets→scrape→TSDB→query/alert flow is architectural. |
| Metrics — Exporters | RECOMMENDED VIDEO | node_exporter/exporter demos reviewed | No candidate promoted yet | Exporter→scrape endpoint workflow is useful to see. |
| Metrics — Service Discovery Concepts | OPTIONAL VIDEO | Prometheus service-discovery demos reviewed | No candidate promoted yet | Dynamic target discovery is easier with a visual model. |
| Metrics — PromQL | RECOMMENDED VIDEO | PromQL query demos reviewed | No candidate promoted yet | Interactive query construction is worth watching once. |
| Metrics — Recording Rules Concepts | OPTIONAL VIDEO | recording-rule demos reviewed | No candidate promoted yet | Useful operational reinforcement. |
| Metrics — Grafana | RECOMMENDED VIDEO | Grafana dashboard/query demos reviewed | No candidate promoted yet | The UI/query/dashboard workflow is inherently visual. |
| Metrics — Dashboard Design | RECOMMENDED VIDEO | dashboard-design talks reviewed | No candidate promoted yet | Good/bad dashboard comparisons are visual. |
| Metrics — Dashboard Anti-patterns | RECOMMENDED VIDEO | dashboard anti-pattern reviews | No candidate promoted yet | Seeing misleading/noisy dashboards makes the critique concrete. |
| Metrics — Nexus and Internal Platform Metrics | NO VIDEO | — | — | Instrument actual platform dependencies. |
| Metrics — CI and Delivery Metrics | NO VIDEO | — | — | Choose metrics from actual delivery questions. |
| Metrics — Lab: Instrument Steward API | NO VIDEO | — | — | Independent instrumentation lab. |
| Metrics — Lab: Observe the Internal Artifact Platform | NO VIDEO | — | — | Independent platform observation lab. |
| Tracing — Decision Gate: Select Steward's Tracing Backend | NO VIDEO | — | — | Decision from evidence. |
| Tracing — Distributed Tracing with OpenTelemetry and Tempo | RECOMMENDED VIDEO | OpenTelemetry/Tempo tracing demos reviewed | No candidate promoted yet | Trace/span hierarchy and backend UI are inherently visual. |
| Tracing — Trace the Steward Request Path | RECOMMENDED VIDEO | Grafana Tempo trace walkthroughs reviewed | No candidate promoted yet | Following a real trace across boundaries is ideal for video. |
| Tracing — Deploy Tempo and Instrument Steward | OPTIONAL VIDEO | Tempo deployment/instrumentation demos reviewed | No candidate promoted yet | Setup orientation can help; implementation remains primary. |
| Tracing — Investigate Cross-Boundary Latency | RECOMMENDED VIDEO | trace waterfall/latency demos reviewed | No candidate promoted yet | Span waterfall makes latency attribution concrete. |
| Tracing — Break the Tracing Pipeline | NO VIDEO | — | — | Failure injection is the exercise. |
| Tracing — Defend the Tracing Architecture | NO VIDEO | — | — | Defence uses evidence. |
| Stack Integration — Observability Stack Integration: Graylog, Prometheus and Grafana | RECOMMENDED VIDEO | cross-signal observability demos reviewed | No candidate promoted yet | Signal ownership and navigation across tools are visual. |
| Stack Integration — Implement the Steward Observability Stack | NO VIDEO | — | — | Independent integration work. |
| Stack Integration — Run a Cross-Signal Incident Investigation | RECOMMENDED VIDEO | incident investigation demos reviewed | No candidate promoted yet | Logs→metrics→traces diagnostic workflow is ideal to watch once. |
| Stack Integration — Defend the Observability Architecture | NO VIDEO | — | — | Defence uses evidence. |
| SLO — SLIs | RECOMMENDED VIDEO | Google SRE SLI/SLO talks reviewed | No candidate promoted yet | Indicator/measurement examples benefit from worked scenarios. |
| SLO — SLOs | RECOMMENDED VIDEO | Google SRE SLO talks reviewed | No candidate promoted yet | Target/window reasoning benefits from worked examples. |
| SLO — SLAs | OPTIONAL VIDEO | SLA/SLO explainers reviewed | No candidate promoted yet | Compact distinction; reinforcement only. |
| SLO — Error Budgets | RECOMMENDED VIDEO | Google SRE error-budget talks reviewed | No candidate promoted yet | Budget burn and release trade-offs benefit from timeline visualization. |
| SLO — User-visible Reliability | NO VIDEO | — | — | Select indicators from actual user journeys. |
| SLO — Choosing Good Indicators | NO VIDEO | — | — | Indicator selection is contextual reasoning. |
| SLO — Windowing and Measurement Concepts | RECOMMENDED VIDEO | rolling-window/burn-rate explainers reviewed | No candidate promoted yet | Time windows are easier to understand graphically. |
| SLO — Reliability Targets and Trade-offs | NO VIDEO | — | — | Make actual target trade-offs. |
| SLO — Error Budgets and Release Decisions | RECOMMENDED VIDEO | error-budget policy examples reviewed | No candidate promoted yet | A worked burn→decision scenario adds value. |
| SLO — Lab: Define Steward SLOs | NO VIDEO | — | — | Independent SLO lab. |
| Alerting — Symptoms vs Causes | RECOMMENDED VIDEO | Google SRE alerting talks reviewed | No candidate promoted yet | A worked incident shows why symptom alerts are more actionable. |
| Alerting — Actionable Alerts | NO VIDEO | — | — | Design from actual operator action. |
| Alerting — Alert Fatigue | OPTIONAL VIDEO | on-call/alert-fatigue talks reviewed | No candidate promoted yet | Real incident narratives add context. |
| Alerting — Severity | NO VIDEO | — | — | Define severity from impact/response needs. |
| Alerting — Escalation | OPTIONAL VIDEO | on-call escalation examples reviewed | No candidate promoted yet | Timeline can reinforce escalation behavior. |
| Alerting — Alert Routing Concepts | RECOMMENDED VIDEO | Alertmanager routing demos reviewed | No candidate promoted yet | Label→route→receiver flow is visual. |
| Alerting — Runbooks | NO VIDEO | — | — | Write/exercise actual runbook. |
| Alerting — On-call Handover and Context | OPTIONAL VIDEO | on-call handover talks reviewed | No candidate promoted yet | Operational examples can help. |
| Alerting — Lab: Build Steward Alerts and Runbooks | NO VIDEO | — | — | Independent alerting lab. |
| Alertmanager — Operate Prometheus Alertmanager | RECOMMENDED VIDEO | Alertmanager UI/routing demos reviewed | No candidate promoted yet | Seeing grouping/inhibition/routing is useful. |
| Alertmanager — From Firing Rule to Delivered Notification | RECOMMENDED VIDEO | Prometheus→Alertmanager notification demos reviewed | No candidate promoted yet | End-to-end signal path is visual. |
| Alertmanager — Deploy and Route with Alertmanager | NO VIDEO | — | — | Implement actual routing. |
| Alertmanager — Break Alert Delivery and Recover It | NO VIDEO | — | — | Failure drill. |
| Alertmanager — Defend the Alerting Pipeline | NO VIDEO | — | — | Defence uses evidence. |
| Database — Database Roles and Least Privilege | NO VIDEO | — | — | Apply actual DB roles. |
| Database — Connections, Pools and Exhaustion | RECOMMENDED VIDEO | connection-pool/exhaustion demos reviewed | No candidate promoted yet | Pool saturation and wait behavior are temporal. |
| Database — Slow Queries and Query-plan Evidence | RECOMMENDED VIDEO | PostgreSQL EXPLAIN demos reviewed | No candidate promoted yet | Live plan interpretation adds value. |
| Database — Locks, Blocking and Deadlocks | RECOMMENDED VIDEO | PostgreSQL lock/deadlock demos reviewed | No candidate promoted yet | Two-session blocking/deadlock is ideal for live demonstration. |
| Database — Operationally Safe Database Migrations | OPTIONAL VIDEO | expand-contract migration talks reviewed | No candidate promoted yet | A production rollout timeline reinforces earlier migration work. |
| Database — Database Backup, Restore and Recovery Evidence | RECOMMENDED VIDEO | PostgreSQL backup/restore demos reviewed | No candidate promoted yet | Restore verification is worth seeing once. |
| Database — Database Capacity and Health Review | NO VIDEO | — | — | Review actual database evidence. |
| Database — Lab: Run the Steward Database Stewardship Review | NO VIDEO | — | — | Independent review lab. |
| Performance — Latency and Throughput | RECOMMENDED VIDEO | latency/throughput visual explainers reviewed | No candidate promoted yet | Concurrent load and response-time relationships are visual. |
| Performance — Saturation | RECOMMENDED VIDEO | saturation/resource-pressure demos reviewed | No candidate promoted yet | Knee-point behavior is best shown graphically. |
| Performance — Bottlenecks | RECOMMENDED VIDEO | profiling/bottleneck demos reviewed | No candidate promoted yet | Live measurement helps model evidence-based bottleneck identification. |
| Performance — Load and Stress Testing | RECOMMENDED VIDEO | k6/load-test demos reviewed | No candidate promoted yet | Load ramp, latency and errors are useful to see together. |
| Performance — Capacity Planning | OPTIONAL VIDEO | capacity-planning talks reviewed | No candidate promoted yet | Worked forecasting can reinforce the model. |
| Performance — Resource Utilization | NO VIDEO | — | — | Measure actual resources. |
| Performance — Database and Application Bottlenecks | RECOMMENDED VIDEO | APM/query profiling demos reviewed | No candidate promoted yet | Cross-layer bottleneck attribution is visual. |
| Performance — Performance Baselines | NO VIDEO | — | — | Establish actual baseline. |
| Performance — Queueing and Contention Concepts | RECOMMENDED VIDEO | queueing/concurrency animations reviewed | No candidate promoted yet | Queue growth/waiting under contention is inherently visual. |
| Performance — Storage Growth and Artifact Capacity | NO VIDEO | — | — | Model actual growth/capacity. |
| Performance — Lab: Establish Steward Capacity Baselines | NO VIDEO | — | — | Independent performance lab. |
| Resilience — Timeouts | RECOMMENDED VIDEO | timeout/failure-timeline demos reviewed | No candidate promoted yet | Bounded waiting is temporal. |
| Resilience — Retries | RECOMMENDED VIDEO | retry failure demos reviewed | No candidate promoted yet | Retry behavior under transient failure is temporal. |
| Resilience — Exponential Backoff and Jitter | RECOMMENDED VIDEO | AWS retry/backoff material reviewed | No candidate promoted yet | Request-wave desynchronization is best shown graphically. |
| Resilience — Circuit Breakers | RECOMMENDED VIDEO | circuit-breaker state-machine demos reviewed | No candidate promoted yet | Closed/open/half-open states are visual. |
| Resilience — Idempotency | OPTIONAL VIDEO | duplicate-delivery demos reviewed | No candidate promoted yet | A duplicate effect demo can reinforce the concept. |
| Resilience — Partial Failure | RECOMMENDED VIDEO | distributed-failure diagrams reviewed | No candidate promoted yet | Some components succeeding while others fail is system-level and visual. |
| Resilience — Dependency Failure | RECOMMENDED VIDEO | dependency-outage demos reviewed | No candidate promoted yet | Failure propagation is valuable to visualize. |
| Resilience — Cascading Failure | RECOMMENDED VIDEO | Google SRE cascading-failure material reviewed | No candidate promoted yet | Amplification across dependencies is strongly visual. |
| Resilience — Queues and Backpressure | RECOMMENDED VIDEO | backpressure/queue demos reviewed | No candidate promoted yet | Producer/consumer imbalance and queue growth are temporal. |
| Resilience — Graceful Degradation | OPTIONAL VIDEO | degradation-pattern examples reviewed | No candidate promoted yet | Worked examples can reinforce product trade-offs. |
| Resilience — Retry Storms and Amplification | RECOMMENDED VIDEO | retry-storm visualizations reviewed | No candidate promoted yet | Synchronized retries and amplification are ideal for animation. |
| Resilience — Dependency Availability Budgets | OPTIONAL VIDEO | availability composition explainers reviewed | No candidate promoted yet | Graphical composition can help, but calculation is primary. |
| Resilience — Lab: Harden Steward Against Dependency Failure | NO VIDEO | — | — | Independent resilience lab. |
| DR — Backups | NO VIDEO | — | — | Implement actual backup policy. |
| DR — Backup Integrity | NO VIDEO | — | — | Verify actual backup artifacts. |
| DR — Restore Testing | RECOMMENDED VIDEO | restore-drill demonstrations reviewed | No candidate promoted yet | A complete restore workflow is worth seeing before running one. |
| DR — RPO and RTO | RECOMMENDED VIDEO | RPO/RTO timeline explainers reviewed | No candidate promoted yet | Recovery-point/time objectives are inherently timeline-based. |
| DR — Disaster Scenarios | OPTIONAL VIDEO | DR scenario talks reviewed | No candidate promoted yet | Real incident examples add context. |
| DR — Recovery Procedures | NO VIDEO | — | — | Write/exercise actual procedure. |
| DR — Database Recovery | RECOMMENDED VIDEO | PostgreSQL recovery demos reviewed | No candidate promoted yet | Recovery sequence and verification are useful to see. |
| DR — Artifact Repository Backup and Restore | RECOMMENDED VIDEO | repository restore demos reviewed | No candidate promoted yet | Artifact recovery is a distinct operational workflow. |
| DR — Configuration and Infrastructure Recovery | OPTIONAL VIDEO | IaC/config recovery demos reviewed | No candidate promoted yet | Rebuild-from-source workflow can reinforce recovery boundaries. |
| DR — Recovery Evidence | NO VIDEO | — | — | Capture actual evidence. |
| DR — Lab: Run a Steward Restore Drill | NO VIDEO | — | — | Independent restore drill. |
| Incident — Detection | RECOMMENDED VIDEO | incident-response simulations reviewed | No candidate promoted yet | Seeing first signal→incident declaration provides context. |
| Incident — Triage | RECOMMENDED VIDEO | SRE incident simulations reviewed | No candidate promoted yet | Live prioritization and hypothesis formation are valuable. |
| Incident — Incident Roles | OPTIONAL VIDEO | incident-command talks reviewed | No candidate promoted yet | Real role handoffs add context. |
| Incident — Communication | OPTIONAL VIDEO | incident-comms examples reviewed | No candidate promoted yet | Examples can model concise stakeholder updates. |
| Incident — Mitigation | RECOMMENDED VIDEO | incident simulation/postmortem material reviewed | No candidate promoted yet | Mitigation under uncertainty benefits from a worked scenario. |
| Incident — Timeline Construction | NO VIDEO | — | — | Construct actual timeline from evidence. |
| Incident — Root Cause | NO VIDEO | — | — | Reason from actual evidence; avoid simplistic narratives. |
| Incident — Contributing Factors | NO VIDEO | — | — | Analyze actual system/human factors. |
| Incident — Blameless Postmortems | OPTIONAL VIDEO | Google SRE/postmortem talks reviewed | No candidate promoted yet | A real postmortem discussion can model tone and systems thinking. |
| Incident — Corrective Actions | NO VIDEO | — | — | Create actual actions. |
| Incident — Learning from Near Misses | OPTIONAL VIDEO | near-miss engineering talks reviewed | No candidate promoted yet | Real examples add perspective. |
| Incident — Lab: Run a Steward Incident Exercise | NO VIDEO | — | — | Independent incident exercise. |
| Fault Injection — Hypothesis-driven Reliability Experiments | RECOMMENDED VIDEO | chaos-engineering talks reviewed | No candidate promoted yet | Steady state→hypothesis→injection→observation is a workflow worth seeing. |
| Fault Injection — Controlled Failure Injection | RECOMMENDED VIDEO | Chaos Mesh/Litmus/manual fault demos reviewed | No candidate promoted yet | A bounded live fault injection makes the safety model concrete. |
| Fault Injection — Blast Radius and Safety | NO VIDEO | — | — | Define actual safeguards before experiment. |
| Fault Injection — Process and Container Failure | RECOMMENDED VIDEO | pod/process failure demos reviewed | No candidate promoted yet | Seeing restart/recovery behavior is useful. |
| Fault Injection — Resource Exhaustion Concepts | RECOMMENDED VIDEO | CPU/memory/disk pressure demos reviewed | No candidate promoted yet | Failure onset under pressure is visual. |
| Fault Injection — Network and Dependency Failure Simulation | RECOMMENDED VIDEO | latency/loss/dependency fault demos reviewed | No candidate promoted yet | Injected latency/loss and downstream effects are ideal for live demo. |
| Fault Injection — Database Failure Scenarios | OPTIONAL VIDEO | database outage demos reviewed | No candidate promoted yet | Useful context; actual controlled scenario remains primary. |
| Fault Injection — Artifact Repository Failure Scenarios | OPTIONAL VIDEO | artifact dependency outage demos reviewed | No candidate promoted yet | Useful context; actual failure drill remains primary. |
| Fault Injection — Recovery Verification | NO VIDEO | — | — | Verify actual recovery. |
| Fault Injection — Chaos Engineering Principles and Safety | OPTIONAL VIDEO | Principles of Chaos Engineering talks reviewed | No candidate promoted yet | Industry framing can reinforce safe experimentation. |
| Fault Injection — Lab: Run a Steward Reliability Experiment | NO VIDEO | — | — | Independent experiment. |
| Reliability Milestone — Milestone: Steward Reliability Program | NO VIDEO | — | — | Milestone synthesis. |
| Reliability Milestone — Assemble the Reliability Evidence Baseline | NO VIDEO | — | — | Evidence assembly. |
| Reliability Milestone — Operate Steward Through a Reliability Review Scenario | NO VIDEO | — | — | Independent scenario. |
| Reliability Milestone — Publish the Steward Reliability Review | NO VIDEO | — | — | Deliverable creation. |
| Reliability Milestone — Defend the Reliability Posture | NO VIDEO | — | — | Final defence. |


## Architect — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Fundamentals — What Software Architecture Is | OPTIONAL VIDEO | SEI/architecture overview talks reviewed | No candidate promoted yet | A strong practitioner explanation can reinforce architecture as consequential decisions rather than diagrams. |
| Fundamentals — Architecture vs Design | NO VIDEO | — | — | The distinction is best applied to concrete decisions rather than memorized. |
| Fundamentals — Architecture Drivers | NO VIDEO | — | — | Drivers must be extracted from actual stakeholder/quality constraints. |
| Fundamentals — Quality Attributes and Architecture Characteristics | RECOMMENDED VIDEO | SEI quality-attribute scenario material reviewed | No candidate promoted yet | Worked quality scenarios connect vague qualities to measurable architectural pressure. |
| Fundamentals — Constraints | NO VIDEO | — | — | Identify and classify actual constraints. |
| Fundamentals — Trade-offs and Consequences | NO VIDEO | — | — | Decision analysis is the learning activity. |
| Fundamentals — Architecture Fitness and Evolution | RECOMMENDED VIDEO | Thoughtworks evolutionary-architecture talks reviewed | No candidate promoted yet | Fitness-function/evolution examples can make continuous architecture concrete. |
| Fundamentals — Architecture Documentation | OPTIONAL VIDEO | arc42/C4 documentation talks reviewed | No candidate promoted yet | A guided architecture-document walkthrough can help, but producing the baseline is primary. |
| Fundamentals — Reconstruct Current Architecture | NO VIDEO | — | — | Independent evidence reconstruction. |
| Fundamentals — Define Drivers and Quality Scenarios | NO VIDEO | — | — | Independent analysis. |
| Fundamentals — Create the Architecture Baseline Record | NO VIDEO | — | — | Deliverable creation. |
| Styles — Layered Architecture | OPTIONAL VIDEO | architecture-style explainers reviewed | No candidate promoted yet | A dependency-flow diagram can reinforce the style. |
| Styles — Hexagonal and Ports-and-Adapters Thinking | RECOMMENDED VIDEO | Alistair Cockburn/ports-and-adapters talks reviewed | No candidate promoted yet | Boundary/port/adapter direction is highly visual. |
| Styles — Modular Monolith | RECOMMENDED VIDEO | modular-monolith talks reviewed | No candidate promoted yet | Module boundaries and deployment unity are easier to compare visually with services. |
| Styles — Service-oriented Architecture | OPTIONAL VIDEO | SOA architecture talks reviewed | No candidate promoted yet | Historical/contextual visualization can help distinguish SOA from microservices. |
| Styles — Microservices | RECOMMENDED VIDEO | Martin Fowler microservices material and practitioner talks reviewed | No candidate promoted yet | Service boundaries, independent deployment and distribution cost benefit from worked architecture examples. |
| Styles — Event-driven Architecture | RECOMMENDED VIDEO | AWS/event-driven architecture talks reviewed | No candidate promoted yet | Producer/event/broker/consumer topology and temporal decoupling are visual. |
| Styles — Serverless Concepts | RECOMMENDED VIDEO | serverless execution/event-flow demos reviewed | No candidate promoted yet | Trigger→managed runtime→managed services is easier to understand visually. |
| Styles — Choosing Styles from Drivers | NO VIDEO | — | — | The learner must compare styles against actual drivers. |
| Styles — The Cost of Distribution | RECOMMENDED VIDEO | distributed-systems/microservices failure talks reviewed | No candidate promoted yet | Latency, partial failure and operational multiplication benefit from concrete examples. |
| Styles — Establish Current Style and Drivers | NO VIDEO | — | — | Independent baseline. |
| Styles — Compare Credible Target Styles | NO VIDEO | — | — | Decision exercise. |
| Styles — Record Style Decision and Evolution Triggers | NO VIDEO | — | — | ADR/evolution evidence. |
| Domain — Domain Models and Business Language | OPTIONAL VIDEO | DDD/domain-modeling talks reviewed | No candidate promoted yet | A worked ubiquitous-language/modeling session can reinforce the concept. |
| Domain — Bounded Context Concepts | RECOMMENDED VIDEO | Martin Fowler bounded-context material and DDD talks reviewed | No candidate promoted yet | Context boundaries and language shifts are strongly diagrammatic. |
| Domain — Entities, Value Objects and Aggregates | RECOMMENDED VIDEO | DDD tactical-modeling talks reviewed | No candidate promoted yet | Worked object/aggregate examples help distinguish identity, value and consistency boundaries. |
| Domain — Invariants and Transaction Boundaries | RECOMMENDED VIDEO | aggregate/invariant talks reviewed | No candidate promoted yet | A transaction-boundary walkthrough can connect domain rules to persistence. |
| Domain — Context Mapping Concepts | RECOMMENDED VIDEO | DDD context-map talks reviewed | No candidate promoted yet | Relationships between contexts are inherently visual. |
| Domain — Domain Services | NO VIDEO | — | — | The learner should decide from behavior that does not naturally belong to an entity/value object. |
| Domain — Avoiding Anemic and Over-engineered Models | OPTIONAL VIDEO | DDD critique/refactoring talks reviewed | No candidate promoted yet | Contrasting examples can help, but context matters more than doctrine. |
| Domain — Recover the Current Domain Model | NO VIDEO | — | — | Independent model recovery. |
| Domain — Challenge and Refine the Model | NO VIDEO | — | — | Independent challenge. |
| Domain — Validate and Record the Domain Decision | NO VIDEO | — | — | Decision evidence. |
| Modularity — Modules and Boundaries | RECOMMENDED VIDEO | modularity/boundary talks reviewed | No candidate promoted yet | Dependency and ownership boundaries benefit from visual examples. |
| Modularity — Coupling and Cohesion Revisited | OPTIONAL VIDEO | coupling/cohesion talks reviewed | No candidate promoted yet | Worked examples can reinforce change coupling. |
| Modularity — Dependency Direction | RECOMMENDED VIDEO | dependency-rule/clean-architecture diagrams reviewed | No candidate promoted yet | Direction and policy/mechanism boundaries are visual. |
| Modularity — Encapsulation at System Scale | OPTIONAL VIDEO | modular architecture talks reviewed | No candidate promoted yet | A worked module boundary can reinforce information hiding. |
| Modularity — Shared Libraries and Coupling | RECOMMENDED VIDEO | shared-library/platform dependency talks reviewed | No candidate promoted yet | Version/coupling blast radius benefits from concrete examples. |
| Modularity — Package Ownership and Change Impact | NO VIDEO | — | — | Use actual repository/package evidence. |
| Modularity — Modular Monoliths | RECOMMENDED VIDEO | modular-monolith talks reviewed | No candidate promoted yet | Module boundaries within one deployment are useful to see contrasted with services. |
| Modularity — When a Service Boundary Is Justified | NO VIDEO | — | — | The learner must prove independent lifecycle/ownership/scaling pressure. |
| Modularity — Distributed Monoliths | RECOMMENDED VIDEO | distributed-monolith failure talks reviewed | No candidate promoted yet | Coupled services with distributed failure modes are best illustrated by a concrete architecture. |
| Modularity — Map Current Boundaries and Change Coupling | NO VIDEO | — | — | Independent analysis. |
| Modularity — Challenge Module, Package and Service Options | NO VIDEO | — | — | Decision exercise. |
| Modularity — Record and Enforce the Boundary Decision | NO VIDEO | — | — | Decision/evidence work. |
| Data — Data Ownership | RECOMMENDED VIDEO | data ownership/microservice data talks reviewed | No candidate promoted yet | Ownership boundaries and cross-service data access benefit from diagrams. |
| Data — Schema Boundaries | OPTIONAL VIDEO | schema-boundary talks reviewed | No candidate promoted yet | Visual examples can reinforce ownership, but actual schema analysis is primary. |
| Data — Transactional Consistency | RECOMMENDED VIDEO | transaction/consistency talks reviewed | No candidate promoted yet | Transaction scope and cross-boundary consistency are temporal and visual. |
| Data — Data Duplication and Derived Views | RECOMMENDED VIDEO | CQRS/read-model material reviewed | No candidate promoted yet | Source-of-truth versus derived-copy flow benefits from visualization. |
| Data — Caching | NO VIDEO | Redis/cache media already audited earlier | Reuse earlier media if review is needed | Avoid duplicate assignment. |
| Data — Read Models | RECOMMENDED VIDEO | CQRS/read-model talks reviewed | No candidate promoted yet | Write model→event/data→read model flow is visual. |
| Data — Database-per-service Trade-offs | RECOMMENDED VIDEO | microservice data architecture talks reviewed | No candidate promoted yet | Ownership gains versus distributed consistency/query costs benefit from worked examples. |
| Data — Data Migration and Evolution | RECOMMENDED VIDEO | expand-contract/online migration talks reviewed | No candidate promoted yet | Coexistence/backfill/cutover/contract sequence is a strong timeline use case. |
| Data — Audit and Historical Data | OPTIONAL VIDEO | audit/event-history architecture talks reviewed | No candidate promoted yet | Examples can distinguish audit history from operational tables. |
| Data — Establish the Data Architecture Baseline | NO VIDEO | — | — | Independent baseline. |
| Data — Challenge Data Architecture Options | NO VIDEO | — | — | Decision exercise. |
| Data — Record and Validate the Decision | NO VIDEO | — | — | Decision evidence. |
| Integration — Integration Styles | RECOMMENDED VIDEO | integration-pattern talks reviewed | No candidate promoted yet | Request/reply, messaging, files and events benefit from side-by-side topology diagrams. |
| Integration — Synchronous APIs | NO VIDEO | HTTP/API media already covered earlier | Reuse earlier media only if review is needed | Avoid duplication. |
| Integration — Asynchronous Messaging | NO VIDEO | RabbitMQ/messaging media already covered earlier | Reuse earlier media only if review is needed | Architect lesson should reason about choice, not reteach mechanics. |
| Integration — Queues and Publish-Subscribe | RECOMMENDED VIDEO | queue/pub-sub architecture explainers reviewed | No candidate promoted yet | Fan-out and competing-consumer semantics are visual. |
| Integration — Events and Commands | RECOMMENDED VIDEO | event-vs-command talks reviewed | No candidate promoted yet | Intent versus fact and coupling consequences benefit from examples. |
| Integration — Delivery Semantics | NO VIDEO | Delivery/ack media already audited in System Thinker | Reuse earlier media if needed | Avoid duplication. |
| Integration — Idempotency | NO VIDEO | Idempotent-consumer media already audited | Reuse earlier media if needed | Apply rather than reteach. |
| Integration — Schema and Contract Evolution | RECOMMENDED VIDEO | schema-evolution/compatibility talks reviewed | No candidate promoted yet | Producer/consumer compatibility across versions is a timeline problem. |
| Integration — Integration Failure and Backpressure | RECOMMENDED VIDEO | backpressure/failure talks reviewed | No candidate promoted yet | Queue growth and dependency slowdown are temporal and visual. |
| Integration — When Not to Add a Message Broker | NO VIDEO | — | — | The learner must justify the simpler option from actual pressure. |
| Scale — Scaling Up and Scaling Out | RECOMMENDED VIDEO | vertical/horizontal scaling diagrams reviewed | No candidate promoted yet | Resource placement and topology changes are visual. |
| Scale — Stateless Services | OPTIONAL VIDEO | stateless scaling demos reviewed | No candidate promoted yet | A load-balanced instance example can reinforce the concept. |
| Scale — Load Distribution | RECOMMENDED VIDEO | load-balancing algorithms/demos reviewed | No candidate promoted yet | Request distribution across instances is highly visual. |
| Scale — Caching and Contention | OPTIONAL VIDEO | cache/contention talks reviewed | No candidate promoted yet | Useful if focused on architectural pressure rather than cache basics. |
| Scale — Replication Concepts | RECOMMENDED VIDEO | database replication animations reviewed | No candidate promoted yet | Primary/replica write/read/failure flows are visual. |
| Scale — Partitioning Concepts | RECOMMENDED VIDEO | sharding/partitioning visual explainers reviewed | No candidate promoted yet | Key→partition placement and rebalance are spatial. |
| Scale — Consistency and Availability Trade-offs | RECOMMENDED VIDEO | distributed consistency/CAP talks reviewed | No candidate promoted yet | Network partition scenarios need careful visual treatment; avoid slogan-only CAP videos. |
| Scale — Distributed Coordination | RECOMMENDED VIDEO | consensus/coordination visual explainers reviewed | No candidate promoted yet | Coordination under failure is difficult to learn from prose alone. |
| Scale — Distributed Transactions and Sagas Concepts | RECOMMENDED VIDEO | saga/compensation talks reviewed | No candidate promoted yet | Multi-step transaction/compensation sequences are ideal for diagrams. |
| Scale — Capacity vs Architectural Complexity | NO VIDEO | — | — | Compare measured pressure with complexity cost. |
| Scale — Compare Scale and Distribution Options | NO VIDEO | — | — | Decision exercise. |
| Scale — Record the Growth Architecture Decision | NO VIDEO | — | — | Decision evidence. |
| Resilience Architecture — Designing for Failure | RECOMMENDED VIDEO | SRE/resilience architecture talks reviewed | No candidate promoted yet | Failure-domain diagrams and dependency paths add value. |
| Resilience Architecture — Timeouts | RECOMMENDED VIDEO | timeout/deadline demos reviewed | No candidate promoted yet | Caller waiting and resource occupancy are temporal. |
| Resilience Architecture — Retries and Retry Storms | RECOMMENDED VIDEO | retry amplification visualizations reviewed | No candidate promoted yet | Amplification is ideal for animation. |
| Resilience Architecture — Circuit Breakers | RECOMMENDED VIDEO | circuit-breaker state-machine demos reviewed | No candidate promoted yet | Closed/open/half-open transitions are inherently visual. |
| Resilience Architecture — Bulkheads | RECOMMENDED VIDEO | bulkhead/isolation diagrams reviewed | No candidate promoted yet | Resource-pool isolation benefits from diagrams. |
| Resilience Architecture — Graceful Degradation | OPTIONAL VIDEO | degradation case studies reviewed | No candidate promoted yet | Worked examples can reinforce product trade-offs. |
| Resilience Architecture — Dependency Isolation | RECOMMENDED VIDEO | dependency-isolation patterns reviewed | No candidate promoted yet | Failure containment is visual. |
| Resilience Architecture — Redundancy and Failure Domains | RECOMMENDED VIDEO | failure-domain/redundancy talks reviewed | No candidate promoted yet | Zone/host/dependency failure boundaries are spatial. |
| Resilience Architecture — Recovery Objectives as Architecture Drivers | RECOMMENDED VIDEO | RPO/RTO media already audited in Reliability | Reuse earlier media if review is needed | Apply recovery objectives architecturally without duplicate viewing. |
| Resilience Architecture — Select and Model the Failure Path | NO VIDEO | — | — | Independent modeling. |
| Resilience Architecture — Compare Resilience Options | NO VIDEO | — | — | Decision exercise. |
| Resilience Architecture — Validate and Record the Evolution | NO VIDEO | — | — | Evidence and ADR. |
| Evaluation — Architecture Decision Records | NO VIDEO | ADR media already audited earlier | Reuse earlier optional media if needed | Do not duplicate. |
| Evaluation — Architecture Reviews | OPTIONAL VIDEO | architecture-review facilitation talks reviewed | No candidate promoted yet | A real review discussion can model challenge and evidence use. |
| Evaluation — Scenario-based Architecture Evaluation | RECOMMENDED VIDEO | ATAM/SEI architecture-evaluation material reviewed | No candidate promoted yet | Scenario walkthroughs show how quality risks emerge from architectural choices. |
| Evaluation — Fitness Functions | RECOMMENDED VIDEO | evolutionary-architecture fitness-function talks reviewed | No candidate promoted yet | Automated architecture constraints benefit from concrete demonstrations. |
| Evaluation — Evolutionary Architecture | OPTIONAL VIDEO | Thoughtworks evolutionary-architecture talks reviewed | No candidate promoted yet | Industry examples reinforce change-oriented architecture. |
| Evaluation — Standards vs Context | NO VIDEO | — | — | The learner must decide when standardization helps or harms. |
| Evaluation — Technology Selection | NO VIDEO | — | — | Evidence-based selection exercise. |
| Evaluation — Build vs Buy | OPTIONAL VIDEO | build-vs-buy practitioner talks reviewed | No candidate promoted yet | Real lifecycle-cost cases add useful context. |
| Evaluation — Architecture Debt | OPTIONAL VIDEO | architecture-debt talks reviewed | No candidate promoted yet | Case studies can show delayed architectural consequences. |
| Evaluation — Architecture Governance without Bottlenecks | OPTIONAL VIDEO | architecture-governance/platform talks reviewed | No candidate promoted yet | Examples can show guardrails versus approval gates. |
| Evaluation — Dependency and Package Governance | NO VIDEO | — | — | Use actual Nexus/package ownership evidence. |
| Evaluation — Evaluating steward-common as a Shared Library | NO VIDEO | — | — | Evaluate the real internal product. |
| Evaluation — Evaluating tsa-test-core as a Shared Engineering Library | NO VIDEO | — | — | Evaluate the real internal product. |
| Evaluation — Prepare the Review | NO VIDEO | — | — | Review preparation. |
| Evaluation — Run the Review | NO VIDEO | — | — | Interactive architecture review. |
| Evaluation — Turn Decisions into Guardrails | NO VIDEO | — | — | Implement actual guardrails. |
| Architect Milestone — Architecture Review and Evolution Decision | NO VIDEO | — | — | School synthesis milestone. |
| Architect Milestone — Reconstruct and Defend the Current Architecture | NO VIDEO | — | — | Independent evidence. |
| Architect Milestone — Challenge the Architecture with New Drivers | NO VIDEO | — | — | Independent scenario. |
| Architect Milestone — Produce the Evolution Decision | NO VIDEO | — | — | Decision artifact. |
| Architect Milestone — Defend Trade-offs and Reversal Triggers | NO VIDEO | — | — | Final defence. |


## Technical Steward — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Governance — Governance vs Management | RECOMMENDED VIDEO | COBIT governance-vs-management explainers reviewed | No candidate promoted yet | A concise governance/management responsibility model can anchor the school. |
| Governance — Decision Rights | OPTIONAL VIDEO | decision-rights/RACI governance talks reviewed | No candidate promoted yet | Worked organizational examples can reinforce authority boundaries. |
| Governance — Accountability | NO VIDEO | — | — | Apply ownership directly to Steward services/risks/products. |
| Governance — Policies, Standards, Procedures and Guidelines | RECOMMENDED VIDEO | policy/standard/procedure governance explainers reviewed | No candidate promoted yet | Side-by-side examples help distinguish artifact purpose and mandatory strength. |
| Governance — Exceptions | OPTIONAL VIDEO | exception/waiver governance material reviewed | No candidate promoted yet | A worked exception can add context, but drafting one is primary. |
| Governance — Evidence and Review Cadence | NO VIDEO | — | — | The learner should map actual operating evidence and cadence. |
| Governance — Governance Without Bureaucracy | OPTIONAL VIDEO | paved-road/guardrail governance talks reviewed | No candidate promoted yet | Industry examples can show automation/defaults replacing approval theater. |
| Governance — Lab: Design the Steward Engineering Governance Model | NO VIDEO | — | — | Independent governance design. |
| Architecture Governance — Architecture Principles | OPTIONAL VIDEO | architecture-principles talks reviewed | No candidate promoted yet | Examples can show principle versus slogan. |
| Architecture Governance — Technology Standards | NO VIDEO | — | — | Write/test standards against Steward context. |
| Architecture Governance — Technology Selection | NO VIDEO | — | — | Evidence-based selection. |
| Architecture Governance — Architecture Reviews | OPTIONAL VIDEO | architecture-review facilitation talks reviewed | No candidate promoted yet | A real review can model challenge without centralizing decisions. |
| Architecture Governance — Architecture Exceptions | NO VIDEO | — | — | Operate the actual exception model. |
| Architecture Governance — Technology Lifecycle | RECOMMENDED VIDEO | technology lifecycle/EOL governance talks reviewed | No candidate promoted yet | Adopt→operate→upgrade→retire sequence and triggers are visual. |
| Architecture Governance — Architecture Decision Ownership | NO VIDEO | — | — | Assign actual ownership. |
| Architecture Governance — Lab: Govern a Steward Architecture Exception | NO VIDEO | — | — | Independent exception exercise. |
| Technology Governance — Business and Technology Alignment | OPTIONAL VIDEO | COBIT/IT governance alignment material reviewed | No candidate promoted yet | A worked goal→capability→measure mapping can reinforce alignment. |
| Technology Governance — Value Delivery | NO VIDEO | — | — | Tie actual investment to outcomes. |
| Technology Governance — Resource Stewardship | OPTIONAL VIDEO | FinOps/resource-governance talks reviewed | No candidate promoted yet | Lifecycle-cost examples can add context. |
| Technology Governance — Performance Oversight | NO VIDEO | — | — | Define actual decision-linked measures. |
| Technology Governance — Governance Structures | OPTIONAL VIDEO | IT governance operating-model talks reviewed | No candidate promoted yet | Examples can show decision forums versus delegated authority. |
| Technology Governance — COBIT Concepts | RECOMMENDED VIDEO | ISACA COBIT overview material reviewed | No candidate promoted yet | A concise official overview can orient governance objectives without teaching the whole framework. |
| Technology Governance — ITIL and Service-management Concepts | RECOMMENDED VIDEO | PeopleCert/ITIL service-management overviews reviewed | No candidate promoted yet | Value/service lifecycle concepts benefit from a concise framework overview. |
| Technology Governance — ISO Management-system Concepts | OPTIONAL VIDEO | ISO management-system explainers reviewed | No candidate promoted yet | Plan/control/evaluate/improve cycle can be reinforced visually. |
| Technology Governance — NIST Framework Landscape | RECOMMENDED VIDEO | NIST CSF/RMF/SSDF overview material reviewed | No candidate promoted yet | Seeing framework scopes side by side helps prevent checklist conflation. |
| Technology Governance — Using Frameworks Without Checklist Thinking | NO VIDEO | — | — | The learner must tailor frameworks to actual governance problems. |
| Technology Governance — Lab: Map Steward Governance Responsibilities | NO VIDEO | — | — | Independent governance mapping. |
| Risk — Risk Identification | OPTIONAL VIDEO | NIST/ISO risk-identification material reviewed | No candidate promoted yet | Worked risk statements can reinforce cause/event/consequence structure. |
| Risk — Likelihood and Impact | OPTIONAL VIDEO | risk-matrix critique/material reviewed | No candidate promoted yet | Examples help show uncertainty and ordinal limitations. |
| Risk — Inherent and Residual Risk | RECOMMENDED VIDEO | risk/control visual explainers reviewed | No candidate promoted yet | Before-controls→controls→residual exposure is well suited to a diagram. |
| Risk — Risk Appetite and Tolerance | OPTIONAL VIDEO | enterprise-risk appetite/tolerance explainers reviewed | No candidate promoted yet | Examples can distinguish organizational boundaries from case-level assessment. |
| Risk — Risk Treatment | NO VIDEO | — | — | Choose actual avoid/reduce/transfer/accept treatments. |
| Risk — Risk Acceptance | NO VIDEO | — | — | Decision authority and evidence are primary. |
| Risk — Risk Registers | NO VIDEO | — | — | Build and operate the actual register. |
| Risk — Key Risk Indicators | OPTIONAL VIDEO | KRI design talks reviewed | No candidate promoted yet | Examples can help distinguish leading exposure signals from vanity metrics. |
| Risk — Risk Ownership | NO VIDEO | — | — | Assign accountable owners. |
| Risk — Lab: Build the Steward Technology Risk Register | NO VIDEO | — | — | Independent synthesis. |
| Engineering Health — Identifying Technical Debt | OPTIONAL VIDEO | Ward Cunningham/technical-debt explanations and modern talks reviewed | No candidate promoted yet | Historical metaphor/context can help prevent debt from becoming a label for disliked code. |
| Engineering Health — Measuring and Communicating Debt | NO VIDEO | — | — | Use actual consequence evidence. |
| Engineering Health — Prioritization | NO VIDEO | — | — | Prioritize actual debt from harm/opportunity cost. |
| Engineering Health — Engineering Health Metrics | OPTIONAL VIDEO | DORA/engineering-metrics talks reviewed | No candidate promoted yet | Worked metric examples can reinforce decision-linked measurement without turning metrics into targets. |
| Engineering Health — KPI vs KRI | OPTIONAL VIDEO | KPI/KRI governance explainers reviewed | No candidate promoted yet | A side-by-side worked example helps distinguish performance from exposure signals. |
| Engineering Health — Sustainable Remediation | NO VIDEO | — | — | Choose remediation from actual recurring causes and verify the consequence changes. |
| Engineering Health — Debt Ownership and Review Cadence | NO VIDEO | — | — | Ownership/cadence design is contextual governance work. |
| Engineering Health — Balancing Feature Delivery and Engineering Health | OPTIONAL VIDEO | Engineering-investment practitioner talks reviewed | No candidate promoted yet | Real trade-off cases can add context without prescribing a universal capacity percentage. |
| Engineering Health — Lab: Build the Steward Engineering Health Review | NO VIDEO | — | — | Independent synthesis and review. |
| Technical Leadership — Technical Ownership | OPTIONAL VIDEO | staff/principal engineering ownership talks reviewed | No candidate promoted yet | Real ownership examples can illustrate responsibility without conflating ownership with doing all work. |
| Technical Leadership — Influence Without Authority | RECOMMENDED VIDEO | technical-leadership influence talks reviewed | No candidate promoted yet | Observed communication/decision scenarios are valuable because the capability is interpersonal rather than tool-based. |
| Technical Leadership — Decision-making | OPTIONAL VIDEO | engineering decision-making talks reviewed | No candidate promoted yet | A worked decision under uncertainty can reinforce reversible/irreversible framing. |
| Technical Leadership — Technical Communication | RECOMMENDED VIDEO | technical communication/review talks reviewed | No candidate promoted yet | Seeing a concise technical explanation and challenge exchange is useful. |
| Technical Leadership — Mentoring | OPTIONAL VIDEO | engineering mentoring talks reviewed | No candidate promoted yet | A good mentoring conversation can model questioning and feedback, but practice remains primary. |
| Technical Leadership — Engineering Reviews | RECOMMENDED VIDEO | architecture/code review facilitation talks reviewed | No candidate promoted yet | A real review demonstrates evidence-based challenge and decision closure. |
| Technical Leadership — Escalation and Responsible Challenge | RECOMMENDED VIDEO | psychological-safety/escalation engineering talks reviewed | No candidate promoted yet | Scenario-based demonstrations add value for high-stakes disagreement. |
| Technical Leadership — Lab: Lead a Steward Technical Review | NO VIDEO | — | — | Independent leadership exercise. |
| Controls — Preventive, Detective and Corrective Controls | RECOMMENDED VIDEO | control-type explainers reviewed | No candidate promoted yet | A single incident mapped to prevent/detect/correct controls is well suited to visual explanation. |
| Controls — Control Objectives | NO VIDEO | — | — | Write objectives against actual risks. |
| Controls — Control Design | OPTIONAL VIDEO | control-design/audit examples reviewed | No candidate promoted yet | Worked design examples can reinforce owner/frequency/evidence/failure response. |
| Controls — Control Effectiveness | RECOMMENDED VIDEO | control design-vs-operating-effectiveness material reviewed | No candidate promoted yet | Side-by-side evidence examples help distinguish intended design from operation. |
| Controls — Evidence | NO VIDEO | — | — | The learner must identify and preserve actual operating evidence. |
| Controls — Control Testing | RECOMMENDED VIDEO | audit/control-testing walkthroughs reviewed | No candidate promoted yet | Sampling/reperformance/inspection are useful to see applied to a concrete control. |
| Controls — Compliance vs Security | OPTIONAL VIDEO | security/compliance practitioner talks reviewed | No candidate promoted yet | Case studies help show why compliance evidence is not equivalent to security. |
| Controls — Audit Fundamentals | OPTIONAL VIDEO | internal-audit lifecycle explainers reviewed | No candidate promoted yet | A concise audit lifecycle overview can orient scope/evidence/findings. |
| Controls — Findings and Remediation | NO VIDEO | — | — | Draft and track actual findings. |
| Controls — Designing Proportionate Controls | NO VIDEO | — | — | Proportionality is a contextual design decision. |
| Controls — Lab: Test Steward Engineering Controls | NO VIDEO | — | — | Independent assurance exercise. |
| Security/Data — Security Governance | RECOMMENDED VIDEO | NIST CSF 2.0 official overview reviewed | [NIST — The Cybersecurity Framework (CSF) 2.0](https://www.youtube.com/watch?v=pPPiaGU12Og); whole short animation | The official CSF 2.0 overview explicitly includes the Govern function and gives concise governance context. |
| Security/Data — Roles and Accountability | NO VIDEO | — | — | Map real security/data decision rights. |
| Security/Data — Policy Hierarchy | OPTIONAL VIDEO | policy/standard/procedure hierarchy material reviewed | No candidate promoted yet | A visual hierarchy can reinforce artifact relationships. |
| Security/Data — Data Ownership | NO VIDEO | — | — | Assign ownership to actual Steward data. |
| Security/Data — Data Classification | OPTIONAL VIDEO | data-classification examples reviewed | No candidate promoted yet | Worked classification examples can reinforce consequence-based categories. |
| Security/Data — Retention and Privacy Concepts | OPTIONAL VIDEO | privacy/data-lifecycle explainers reviewed | No candidate promoted yet | A data lifecycle visual can reinforce collection→use→retention→deletion. |
| Security/Data — Access Governance | RECOMMENDED VIDEO | access-review/IGA demonstrations reviewed | No candidate promoted yet | Joiner/mover/leaver and periodic review flows benefit from visualization. |
| Security/Data — Security Exceptions and Risk Acceptance | NO VIDEO | — | — | Use the actual risk/exception mechanism. |
| Security/Data — Lab: Define Steward Security and Data Accountability | NO VIDEO | — | — | Independent governance synthesis. |
| Change/Service — Classify and Prepare the Change | OPTIONAL VIDEO | ITIL/change-enablement practitioner material reviewed | No candidate promoted yet | A real change-classification example can add context without creating CAB theater. |
| Change/Service — Make the Release Decision | RECOMMENDED VIDEO | production-readiness/change-risk review talks reviewed | No candidate promoted yet | Watching a risk/evidence-based go/no-go discussion can model the decision process. |
| Change/Service — Close the Service-governance Loop | RECOMMENDED VIDEO | Google Cloud Tech — Postmortems and Retrospectives | [Google Cloud Tech — Postmortems and Retrospectives](https://www.youtube.com/watch?v=UBe7U2b3tsA); whole video | The Google SRE discussion directly demonstrates learning after incidents and turning operational evidence into improvement. |
| Change/Service — Lab: Govern a Steward Production Change | NO VIDEO | — | — | Independent change-governance exercise. |
| Third-party — Vendor Assessment | OPTIONAL VIDEO | third-party risk assessment material reviewed | No candidate promoted yet | A worked assessment can reinforce evidence-based vendor questions. |
| Third-party — Dependency Risk | NO VIDEO | — | — | Assess actual dependencies and their ownership/lifecycle. |
| Third-party — SaaS and Cloud Risk | OPTIONAL VIDEO | shared-responsibility/vendor-risk material reviewed | No candidate promoted yet | Responsibility-boundary examples add context. |
| Third-party — End-of-life Technology | RECOMMENDED VIDEO | technology lifecycle/EOL case studies reviewed | No candidate promoted yet | A lifecycle timeline with support/patch/migration consequences is useful. |
| Third-party — Exit and Continuity Planning | RECOMMENDED VIDEO | cloud/SaaS exit-strategy talks reviewed | No candidate promoted yet | Data export, replacement, cutover and continuity are strong sequence/topology topics. |
| Third-party — Internal Software Product Ownership | NO VIDEO | — | — | Apply ownership to steward-common and tsa-test-core. |
| Third-party — Approved Dependency Sources | NO VIDEO | — | — | Use the real Nexus/source policy. |
| Third-party — Internal Package Version and Support Policy | NO VIDEO | — | — | Define the actual support contract. |
| Third-party — Repository Retention and Lifecycle | OPTIONAL VIDEO | artifact-repository lifecycle material reviewed | No candidate promoted yet | A lifecycle example can reinforce retention versus recoverability. |
| Third-party — Dependency Exceptions | NO VIDEO | — | — | Operate the actual exception mechanism. |
| Third-party — Supply-chain Ownership and Provenance Requirements | RECOMMENDED VIDEO | SLSA/software supply-chain provenance talks reviewed | No candidate promoted yet | Build→artifact→provenance→verification flow is visual and cross-cutting. |
| Third-party — Lab: Govern steward-common and tsa-test-core | NO VIDEO | — | — | Independent product-governance exercise. |
| Handbook — Writing Usable Standards | OPTIONAL VIDEO | engineering standards/paved-road talks reviewed | No candidate promoted yet | Industry examples can show outcome standards versus personal tool preferences. |
| Handbook — Runbooks and Playbooks | RECOMMENDED VIDEO | SRE runbook/incident-playbook material reviewed | No candidate promoted yet | A worked operational procedure shows prerequisites, stop conditions, verification and escalation better than definitions alone. |
| Handbook — Decision Records | NO VIDEO | ADR media already reviewed earlier | Reuse earlier ADR candidate only if needed | Avoid duplicate media; apply the established ADR discipline. |
| Handbook — Review Checklists | NO VIDEO | — | — | Design the actual risk-sensitive checklist and automate machine-verifiable items. |
| Handbook — Knowledge Stewardship | OPTIONAL VIDEO | documentation/knowledge-management engineering talks reviewed | No candidate promoted yet | Examples can show authoritative-source and ownership patterns. |
| Handbook — Standards Ownership and Versioning | NO VIDEO | — | — | Define lifecycle metadata for actual standards. |
| Handbook — Exception and Waiver Records | NO VIDEO | — | — | Use the governance exception model already built. |
| Handbook — Keeping the Handbook Alive | OPTIONAL VIDEO | docs-as-code/living-documentation talks reviewed | No candidate promoted yet | A maintained repository workflow can reinforce event-driven documentation updates. |
| Handbook — Lab: Build the Steward Engineering Handbook | NO VIDEO | — | — | Independent synthesis. |
| Technical Steward Milestone — Milestone: Technical Stewardship Review | NO VIDEO | — | — | Final school synthesis and defence; no new instructional media. |


## Professional Engineer — lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Discovery — Choosing a Substantial Problem | NO VIDEO | Prior curriculum resources sufficient | — | Capstone begins by proving transfer; problem choice must come from evidence, not new instruction. |
| Discovery — Stakeholder Discovery | OPTIONAL VIDEO | Stakeholder-interview material reviewed | No candidate promoted; use only if interview technique needs refresh | A short interview demonstration can refresh technique, but the learner must conduct real discovery. |
| Discovery — Problem Framing | NO VIDEO | Prior requirements/problem-framing material sufficient | — | Apply the established framing method independently. |
| Discovery — Requirements | NO VIDEO | Prior System Thinker material sufficient | — | Transfer existing requirements capability. |
| Discovery — Constraints | NO VIDEO | Prior System Thinker material sufficient | — | Identify real constraints. |
| Discovery — Working with Ambiguity | NO VIDEO | — | — | Ambiguity is the condition the learner must handle, not a topic requiring another lecture. |
| Discovery — Quality Attributes | NO VIDEO | Prior architecture material sufficient | — | Elicit measurable quality scenarios from the capstone. |
| Discovery — Risk | NO VIDEO | Prior Technical Steward risk material sufficient | — | Apply the existing risk model. |
| Discovery — Success Measures and Evidence | NO VIDEO | — | — | Define observable outcomes for the chosen problem. |
| Discovery — Scope and Non-goals | NO VIDEO | — | — | Scope discipline is part of independent engineering. |
| Discovery — Lab: Produce the Capstone Discovery Brief | NO VIDEO | — | — | Independent synthesis deliverable. |
| Proposal — System Context and Boundaries | NO VIDEO | C4/system-context media already reviewed | Reuse prior C4 resource only for refresh | Capstone should demonstrate the modeling skill independently. |
| Proposal — Domain and Data Model Proposal | NO VIDEO | — | — | Design from the discovered domain. |
| Proposal — Architecture Proposal | NO VIDEO | Prior Architect resources sufficient | — | Produce and defend the architecture rather than copy a reference architecture. |
| Proposal — Infrastructure and Hosting Proposal | NO VIDEO | Prior platform/cloud material sufficient | — | Choose infrastructure from actual constraints. |
| Proposal — Delivery Plan | NO VIDEO | Prior Delivery Engineer material sufficient | — | Apply existing delivery capability. |
| Proposal — Quality Strategy | NO VIDEO | Prior Quality Steward material sufficient | — | Build a strategy from capstone risks. |
| Proposal — Security Strategy | NO VIDEO | Prior Security Steward material sufficient | — | Apply threat/risk/control reasoning. |
| Proposal — Reliability Strategy | NO VIDEO | Prior Reliability Engineer material sufficient | — | Select reliability mechanisms from actual failure modes/SLOs. |
| Proposal — Operational Model | NO VIDEO | — | — | Define real ownership/support/operations. |
| Proposal — Cost Model | OPTIONAL VIDEO | FinOps/cost-model material reviewed | No new candidate promoted | Optional refresh only if the selected hosting model introduces unfamiliar billing dimensions. |
| Proposal — Governance Approach | NO VIDEO | Prior Technical Steward material sufficient | — | Tailor governance to the capstone. |
| Proposal — Dependency and Internal Platform Decisions | NO VIDEO | — | — | Choose reuse/build boundaries independently. |
| Proposal — Implementation Milestones | NO VIDEO | — | — | Plan executable increments. |
| Proposal — Architecture and Risk Review | NO VIDEO | Prior review material sufficient | — | Run the review; don't watch one instead. |
| Proposal — Lab: Defend the Capstone Engineering Proposal | NO VIDEO | — | — | Independent defence. |
| Build — Start from a Blank Repository | NO VIDEO | — | — | Blank-repo start is deliberate transfer evidence. |
| Build — Establish Engineering Conventions | NO VIDEO | — | — | Choose and encode conventions from the system's needs. |
| Build — Model the Domain | NO VIDEO | — | — | Independent domain modeling. |
| Build — Implement the System | NO VIDEO | — | — | Independent implementation. |
| Build — Design and Evolve the Data | NO VIDEO | — | — | Independent data/schema evolution. |
| Build — Build Infrastructure | NO VIDEO | — | — | Independent platform implementation. |
| Build — Automate Delivery | NO VIDEO | — | — | Independent delivery implementation. |
| Build — Build Quality Evidence | NO VIDEO | — | — | Independent testing/quality evidence. |
