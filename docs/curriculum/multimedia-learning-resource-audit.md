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
| Core Infra — Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP server/scope demonstrations reviewed | No candidate promoted yet | Lease, reservation and option behavior is useful to see in a controlled network. |
| Core Infra — DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP relay/failure demonstrations reviewed | No candidate promoted yet | Relay and exhaustion are path/state problems that benefit from topology and packet-flow visualization. |
| Core Infra — Operate Time Synchronization with Chrony | OPTIONAL VIDEO | Chrony/NTP demonstrations reviewed | No candidate promoted yet | A short live chronyc demonstration can help; configuration and evidence remain primary. |
| Core Infra — Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | Clock-skew/TLS/token/logging examples reviewed | No candidate promoted yet | A timeline makes the cross-system consequences of wrong time much easier to understand. |
| Core Infra — Integrate Core Services into the Homelab | NO VIDEO | — | — | Integration evidence is the lesson. |
| Core Infra — Reassess Availability and Ownership | NO VIDEO | — | — | The learner must reason from actual SPOFs and constraints. |
| Configuration — Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible desired-state/idempotence demos reviewed | No candidate promoted yet | Seeing first run changed and second run unchanged makes idempotence concrete. |
| Configuration — Reusable Rocky Baseline Role | OPTIONAL VIDEO | Ansible role walkthroughs reviewed | No candidate promoted yet | Role structure can be demonstrated, but the learner's reusable baseline is primary. |
| Configuration — Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Ansible drift/remediation demos reviewed | No candidate promoted yet | Desired-versus-actual state and repair is valuable to see live. |
| Configuration — Secrets, Failure and Safe Fleet Changes | RECOMMENDED VIDEO | Ansible rolling/failure-handling material reviewed | No candidate promoted yet | Canary/serial/failure behavior across hosts is strongly operational and visual. |
| Configuration — Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Milestone synthesis. |
| Configuration — Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | Ownership boundaries are an architecture decision. |
| Patching — Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Patch-management/SRE change talks reviewed | No candidate promoted yet | Real operational examples add context, but the risk model is primary. |
| Patching — Patch a Rocky Linux Workload Host | NO VIDEO | — | — | The learner must perform and verify the real maintenance. |
| Patching — Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel update/reboot verification demos reviewed | No candidate promoted yet | Installed-versus-running kernel state is useful to see demonstrated once. |
| Patching — Patch Regression and Recovery | NO VIDEO | — | — | The learner must reproduce, diagnose and recover a deterministic regression. |
| Patching — Patch Multiple Rocky Hosts with Ansible | RECOMMENDED VIDEO | Ansible rolling patch demos reviewed | No candidate promoted yet | Canary-to-fleet sequencing is useful to visualize before execution. |
| Patching — Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Patch-compliance dashboard demos reviewed | No candidate promoted yet | Dashboard examples can reinforce visibility without prescribing a new product. |
| Patching — Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | The maintenance-domain distinction should be reasoned from the learner's platform. |
| Patching — Major OS Version Change Is a Migration | OPTIONAL VIDEO | Enterprise Linux major-upgrade/migration material reviewed | No candidate promoted yet | A migration case study can add context; TSA should not teach blind in-place upgrade recipes. |
| Patching — Reassess the Patch Operating Model | NO VIDEO | — | — | Final operating-model decision is evidence-driven. |
| Windows — Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Mixed-estate operations overviews reviewed | No candidate promoted yet | A visual estate/boundary overview can help without turning TSA into a Windows-specialist course. |
| Windows — Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server install/baseline walkthroughs reviewed | No candidate promoted yet | Useful setup aid; the actual VM build remains primary. |
| Windows — PowerShell as an Administrative Interface | RECOMMENDED VIDEO | Microsoft PowerShell object/pipeline demonstrations reviewed | No candidate promoted yet | Seeing objects flow through the pipeline is much more useful than treating PowerShell as text piping. |
| Windows — Services, Processes and Event Logs | RECOMMENDED VIDEO | PowerShell/Event Viewer operational demos reviewed | No candidate promoted yet | Live service failure plus event-log evidence is a good demonstration target. |
| Windows — NTFS and Share Permissions | RECOMMENDED VIDEO | NTFS/share effective-access demos reviewed | No candidate promoted yet | Layered permissions and effective access are easier to understand visually. |
| Windows — Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | WinRM/PowerShell remoting demos reviewed | No candidate promoted yet | Control-path/authentication behavior benefits from live remote execution. |
| Windows — Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft/AD architecture explainers reviewed | No candidate promoted yet | Domain/DC/DNS/Kerberos relationships are strongly architectural and visual. |
| Windows — Domain Join and Group Policy | RECOMMENDED VIDEO | Domain-join/GPO demonstrations reviewed | No candidate promoted yet | Seeing policy scope/application/result evidence adds value. |
| Windows — Linux–Windows Interoperability | RECOMMENDED VIDEO | SMB/DNS/LDAP cross-platform demos reviewed | No candidate promoted yet | Cross-OS boundaries are well suited to a live interoperability demonstration. |
| Windows — Reassess Windows Operational Depth | NO VIDEO | — | — | Scope decision should be based on TSA's target role and implemented evidence. |
| Enterprise Services — Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | NFS/Samba cross-platform demonstrations reviewed | No candidate promoted yet | A producer/consumer share plus permission boundary is useful to see before the practical. |
| Enterprise Services — Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | LDAP directory-tree/bind/search explainers reviewed | No candidate promoted yet | DN/RDN/tree/bind/search concepts benefit substantially from visual representation. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | The learner should define naming/schema/completeness/idempotency contracts directly. |
| File Integration — Legacy FTP Integration | OPTIONAL VIDEO | FTP control/data-channel demonstrations reviewed | No candidate promoted yet | A packet-flow demo can explain why FTP is operationally awkward, but implementation evidence is primary. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch file handoff/atomic rename patterns reviewed | No candidate promoted yet | Producer→landing→validation→processing→archive/reject lifecycle is useful as a state-flow visualization. |
| File Integration — Shared Filesystem versus Managed File Transfer | OPTIONAL VIDEO | MFT/shared-filesystem architecture comparisons reviewed | No candidate promoted yet | A topology comparison can reinforce ownership/failure differences. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP/FTPS protocol-boundary explainers reviewed | No candidate promoted yet | Seeing SSH-based SFTP versus TLS-based FTPS prevents protocol-name confusion. |
| Platform Builder — Milestone Review and Exit Criteria | NO VIDEO | — | — | Review gate. |
| Platform Builder — Assemble the Platform Builder Evidence Pack | NO VIDEO | — | — | Evidence synthesis. |
| Platform Builder — Platform Builder Exit Reflection | NO VIDEO | — | — | Reflection and readiness decision. |


## Platform Builder — Core Services, Configuration and OS Lifecycle lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Core Services — DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | DNS/DHCP/NTP dependency explainers reviewed | Reuse prior DNS video for DNS only; no combined candidate promoted | A dependency map is useful, but avoid repeating full DNS instruction. |
| Core Services — Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | BIND authoritative DNS demonstrations reviewed | No candidate promoted yet | Authoritative zones, records and dig evidence benefit from live demonstration. |
| Core Services — Break and Diagnose DNS | NO VIDEO | — | — | The learner should diagnose the injected DNS failures directly. |
| Core Services — Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP server/scope demos reviewed | No candidate promoted yet | Lease allocation and reservation behavior are useful to see before operation. |
| Core Services — DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP relay/failure demos reviewed | No candidate promoted yet | Relay and exhaustion are path/state behaviors that benefit from visualization. |
| Core Services — Operate Time Synchronization with Chrony | OPTIONAL VIDEO | chrony/NTP demos reviewed | No candidate promoted yet | A live chronyc sources/tracking demo can help, but operation is straightforward. |
| Core Services — Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | Clock-skew/TLS/token incident material reviewed | No candidate promoted yet | A timeline makes skew consequences across certificates, tokens and logs concrete. |
| Core Services — Integrate Core Services into the Homelab | NO VIDEO | — | — | Integration evidence is primary. |
| Core Services — Reassess Availability and Ownership | NO VIDEO | — | — | Availability/SPOF decisions must use the learner's topology. |
| Configuration — Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible desired-state/idempotence demos reviewed | No candidate promoted yet | Seeing first-run changed state versus second-run unchanged state makes idempotence concrete. |
| Configuration — Reusable Rocky Baseline Role | RECOMMENDED VIDEO | Ansible roles demonstrations reviewed | No candidate promoted yet | Role structure, variables, handlers and reuse benefit from a concise live walkthrough. |
| Configuration — Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Ansible drift/remediation demos reviewed | No candidate promoted yet | Deliberate drift followed by detection/repair is a strong visual workflow. |
| Configuration — Secrets, Failure and Safe Fleet Changes | OPTIONAL VIDEO | Ansible secrets/serial/canary material reviewed | No candidate promoted yet | A fleet-change demo can help, but later Vault and delivery paths go deeper. |
| Configuration — Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Milestone synthesis. |
| Configuration — Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | Ownership decision must come from implemented boundaries. |
| OS Lifecycle — Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Patch-management/SRE change-risk talks reviewed | No candidate promoted yet | Real change narratives can add context, but the risk model is primarily a decision exercise. |
| OS Lifecycle — Patch a Rocky Linux Workload Host | NO VIDEO | — | — | Actual DNF maintenance and before/after verification are the learning evidence. |
| OS Lifecycle — Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel update/reboot lifecycle demos reviewed | No candidate promoted yet | Installed-versus-running kernel state is useful to see demonstrated. |
| OS Lifecycle — Patch Regression and Recovery | NO VIDEO | — | — | The learner must diagnose a deterministic regression and recover it. |
| OS Lifecycle — Patch Multiple Rocky Hosts with Ansible | RECOMMENDED VIDEO | Ansible rolling/serial patch demos reviewed | No candidate promoted yet | Canary-to-fleet orchestration and explicit reboot handling benefit from a live run. |
| OS Lifecycle — Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Patch-age dashboard examples reviewed | No candidate promoted yet | A dashboard walkthrough can reinforce the signal, but the learner must build the visibility. |
| OS Lifecycle — Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | The two maintenance domains should be reasoned from the actual homelab. |
| OS Lifecycle — Major OS Version Change Is a Migration | OPTIONAL VIDEO | RHEL/Rocky major-upgrade material reviewed | No candidate promoted yet | A migration case study can add context; the architecture/rollback plan remains primary. |
| OS Lifecycle — Reassess the Patch Operating Model | NO VIDEO | — | — | ADR/runbook synthesis. |


## Platform Builder — Windows/PowerShell lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Windows — Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Mixed-estate operations material reviewed | No candidate promoted yet | A concise enterprise-estate overview can add context, but the boundary is more important than platform advocacy. |
| Windows — Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server evaluation/install walkthroughs reviewed | No candidate promoted yet | Visual setup can reduce friction; actual baseline evidence remains primary. |
| Windows — PowerShell as an Administrative Interface | RECOMMENDED VIDEO | Microsoft PowerShell learning/demos reviewed | No candidate promoted yet | Objects, pipeline and discovery are easier to grasp from a live shell demonstration. |
| Windows — Services, Processes and Event Logs | RECOMMENDED VIDEO | PowerShell/Event Viewer troubleshooting demos reviewed | No candidate promoted yet | A live service failure traced through process/service/event evidence adds value. |
| Windows — NTFS and Share Permissions | RECOMMENDED VIDEO | NTFS/share effective-permission demos reviewed | No candidate promoted yet | Layered share + NTFS effective access is highly visual and benefits from positive/negative identity tests. |
| Windows — Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | WinRM/PowerShell remoting demos reviewed | No candidate promoted yet | Seeing local versus remote execution and authentication/network failures is useful. |
| Windows — Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft/AD architecture explainers reviewed | No candidate promoted yet | Domain/DC/DNS/Kerberos/user/group relationships are architecture-heavy and visual. |
| Windows — Domain Join and Group Policy | RECOMMENDED VIDEO | Domain join/GPO demonstrations reviewed | No candidate promoted yet | The client→DNS→DC→policy sequence and gpresult evidence are worth seeing once. |
| Windows — Linux–Windows Interoperability | RECOMMENDED VIDEO | SMB/DNS/LDAP cross-platform demos reviewed | No candidate promoted yet | Cross-OS identity/name/file boundaries benefit from a topology walkthrough. |
| Windows — Reassess Windows Operational Depth | NO VIDEO | — | — | The learner must decide specialist boundaries from implemented experience. |


## Platform Builder — Enterprise file/directory services, file integration and milestone audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Enterprise Services — Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | NFS/Samba service demonstrations reviewed | No candidate promoted yet | Seeing exports, mounts, share permissions and cross-host access once helps before the learner operates both protocols. |
| Enterprise Services — Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | LDAP/DN/search/filter visual explainers reviewed | No candidate promoted yet | DIT hierarchy, DN/RDN, bind and search scope are much easier to understand visually. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | The learner should define filename/content/completeness/idempotency contracts directly. |
| File Integration — Legacy FTP Integration | RECOMMENDED VIDEO | FTP control/data-channel demonstrations reviewed | No candidate promoted yet | Separate control/data connections and passive/active behavior are useful to see before operating a legacy integration. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch file handoff/atomic rename patterns reviewed | No candidate promoted yet | Producer→landing→validation→processing→archive/reject lifecycle benefits from a sequence diagram. |
| File Integration — Shared Filesystem versus Managed File Transfer | OPTIONAL VIDEO | File-transfer architecture comparisons reviewed | No candidate promoted yet | A topology comparison can reinforce the trade-off, but the learner's own integration constraints should decide. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP/FTPS protocol-boundary explainers reviewed | No candidate promoted yet | SSH-based SFTP versus TLS-wrapped FTP is frequently confused and benefits from visual protocol comparison. |
| Platform Builder Milestone — Assemble the Platform Builder Evidence Pack | NO VIDEO | — | — | Milestone is synthesis of implemented platform evidence. |
| Platform Builder Milestone — Milestone Review and Exit Criteria | NO VIDEO | — | — | Exit gate should assess capability, not introduce media. |
| Platform Builder Milestone — Platform Builder Exit Reflection | NO VIDEO | — | — | Reflection should use the learner's own operational evidence. |


## Platform Builder — Core Infrastructure, Configuration Management, Patching and Windows lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Core Infrastructure — DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | Infrastructure dependency/bootstrapping explainers reviewed | No candidate promoted yet | The dependency chain between name resolution, addressing and time is easier to grasp as a topology. |
| Core Infrastructure — Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | BIND authoritative DNS demos reviewed | No candidate promoted yet | Zone, authoritative answer and reverse lookup behavior benefit from live dig/BIND evidence. |
| Core Infrastructure — Break and Diagnose DNS | RECOMMENDED VIDEO | DNS troubleshooting demos reviewed | No candidate promoted yet | A cache/record/service failure investigated with dig is useful to watch before reproducing. |
| Core Infrastructure — Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP server/reservation demos reviewed | No candidate promoted yet | Lease lifecycle and reservation behavior are visual and observable. |
| Core Infrastructure — DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP relay/failure demonstrations reviewed | No candidate promoted yet | Relay and exhaustion failures are easier to reason about from packet/topology flow. |
| Core Infrastructure — Operate Time Synchronization with Chrony | OPTIONAL VIDEO | Chrony/NTP demos reviewed | No candidate promoted yet | A short chronyc demonstration can reduce setup friction, but direct operation is primary. |
| Core Infrastructure — Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | Clock-skew/TLS/token incident material reviewed | No candidate promoted yet | A timeline makes skew-induced certificate, token and log-order failures concrete. |
| Core Infrastructure — Integrate Core Services into the Homelab | NO VIDEO | — | — | Integration evidence is primary. |
| Core Infrastructure — Reassess Availability and Ownership | NO VIDEO | — | — | The learner must make the ownership/SPOF decision from their topology. |
| Ansible — Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible inventory/idempotence demonstrations reviewed | No candidate promoted yet | Seeing first-run changes followed by a clean second run makes idempotence tangible. |
| Ansible — Reusable Rocky Baseline Role | RECOMMENDED VIDEO | Ansible role/handler demos reviewed | No candidate promoted yet | Role structure and change-driven handlers benefit from a live demonstration. |
| Ansible — Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Ansible check/diff/drift demos reviewed | No candidate promoted yet | A deliberate drift exposed before convergence is a strong visual operational example. |
| Ansible — Secrets, Failure and Safe Fleet Changes | RECOMMENDED VIDEO | Ansible serial/canary/failure demos reviewed | No candidate promoted yet | Canary containment and halted rollout are valuable to see as execution behavior. |
| Ansible — Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Milestone must be independent. |
| Ansible — Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | Architecture ownership decision is evidence-driven. |
| Patching — Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Enterprise patch-management talks reviewed | No candidate promoted yet | Real change-window examples can add context, but the risk classification exercise is primary. |
| Patching — Patch a Rocky Linux Workload Host | NO VIDEO | — | — | DNF maintenance and before/after verification should be performed directly. |
| Patching — Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel update/reboot lifecycle demos reviewed | No candidate promoted yet | Installed-versus-running kernel state is useful to see live. |
| Patching — Patch Regression and Recovery | RECOMMENDED VIDEO | Patch rollback/recovery demos reviewed | No candidate promoted yet | A deterministic regression and recovery is an excellent operational demonstration. |
| Patching — Patch Multiple Rocky Hosts with Ansible | RECOMMENDED VIDEO | Ansible rolling/canary patch demos reviewed | No candidate promoted yet | Fleet sequencing and explicit reboot behavior benefit from execution visualization. |
| Patching — Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Patch compliance dashboard examples reviewed | No candidate promoted yet | A dashboard example can help, but learner-built metrics are primary. |
| Patching — Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | The separation is an operating-model decision. |
| Patching — Major OS Version Change Is a Migration | OPTIONAL VIDEO | Enterprise Linux major-upgrade/migration material reviewed | No candidate promoted yet | A real migration narrative can add useful failure/rollback context. |
| Patching — Reassess the Patch Operating Model | NO VIDEO | — | — | ADR/runbook synthesis. |
| Windows — Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Mixed-estate architecture material reviewed | No candidate promoted yet | A visual estate map can establish boundaries without turning TSA into Windows-specialist training. |
| Windows — Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server installation/baseline walkthroughs reviewed | No candidate promoted yet | A setup walkthrough can reduce friction; actual VM build is primary. |
| Windows — PowerShell as an Administrative Interface | RECOMMENDED VIDEO | Microsoft/PowerShell object-pipeline demonstrations reviewed | No candidate promoted yet | The object pipeline is much clearer when shown interactively rather than described as a shell analogy. |
| Windows — Services, Processes and Event Logs | RECOMMENDED VIDEO | PowerShell service/Event Viewer demos reviewed | No candidate promoted yet | Live administrative evidence is useful. |
| Windows — NTFS and Share Permissions | RECOMMENDED VIDEO | Windows effective-access/share-permission demos reviewed | No candidate promoted yet | Share + NTFS effective access is easier to understand through positive/negative identities. |
| Windows — Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | WinRM/PowerShell remoting demos reviewed | No candidate promoted yet | Authentication, network reachability and remote execution are best seen live. |
| Windows — Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft AD DS/DNS demonstrations reviewed | No candidate promoted yet | Domain, DC, DNS SRV, OU/user/group relationships are strongly visual. |
| Windows — Domain Join and Group Policy | RECOMMENDED VIDEO | Domain join/GPO demonstrations reviewed | No candidate promoted yet | Policy application and resultant state benefit from a live member-machine example. |
| Windows — Linux–Windows Interoperability | RECOMMENDED VIDEO | SMB/DNS/LDAP cross-platform demos reviewed | No candidate promoted yet | Cross-OS trust/name/file boundaries are useful to see end-to-end. |
| Windows — Reassess Windows Operational Depth | NO VIDEO | — | — | Boundary decision is the point of the lesson. |


## Platform Builder — Enterprise file/directory services, file integration and milestone audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Enterprise Services — Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | NFS/Samba cross-platform demonstrations reviewed | No candidate promoted yet | A producer/client/share demonstration makes identity, mount and protocol boundaries concrete. |
| Enterprise Services — Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | LDAP directory/tree/bind/search explainers reviewed | No candidate promoted yet | DN/RDN/tree/search/filter concepts are substantially easier to understand visually before operating a directory. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | The learner must define a precise contract; passive media adds little. |
| File Integration — Legacy FTP Integration | RECOMMENDED VIDEO | FTP active/passive/control-data connection explainers reviewed | No candidate promoted yet | FTP's separate control/data channels and active/passive behavior are highly visual and explain firewall complexity. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch file ingestion/handoff demonstrations reviewed | No candidate promoted yet | Temporary-file→atomic-rename→claim→process→archive/reject flow benefits from a state/lifecycle visualization. |
| File Integration — Shared Filesystem versus Managed File Transfer | OPTIONAL VIDEO | File-transfer architecture comparisons reviewed | No candidate promoted yet | A topology comparison can reinforce trust/ownership differences, but the decision exercise is primary. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP vs FTPS protocol/security explainers reviewed | No candidate promoted yet | Showing SSH-based SFTP versus TLS-based FTPS prevents the common mistake of treating them as variants of FTP. |
| Milestone — Milestone Brief: Steward Homelab v1 | NO VIDEO | — | — | The brief consolidates existing work; no new teaching medium is needed. |
| Milestone — Gate 1: Infrastructure and Topology Baseline | NO VIDEO | — | — | Gate evidence must come from the learner's running homelab. |
| Milestone — Gate 2: Rocky Linux Service and Administrative Control | NO VIDEO | — | — | Operational proof, not instruction. |
| Milestone — Gate 3: Client Path, Reverse Proxy and Firewall Policy | NO VIDEO | — | — | The learner must prove actual network paths and policy. |
| Milestone — Gate 4: Failure, Backup and Recovery Drill | NO VIDEO | — | — | The controlled failure/recovery itself is the learning evidence. |
| Milestone — Gate 5: Capacity, Runbook and Platform Handoff | NO VIDEO | — | — | Handoff synthesis should be independently produced. |


## Platform Builder — Core Infrastructure, Configuration and Lifecycle lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Core Infrastructure — DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | Infrastructure dependency/packet-flow explainers reviewed | No candidate promoted yet | Seeing naming, address assignment and time as separate shared dependencies helps establish the operating model. |
| Core Infrastructure — Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | BIND authoritative-DNS demonstrations reviewed | No candidate promoted yet | Authority, zones, records and recursive-vs-authoritative queries benefit from a live dig/BIND walkthrough. |
| Core Infrastructure — Break and Diagnose DNS | RECOMMENDED VIDEO | DNS troubleshooting demonstrations reviewed | No candidate promoted yet | Wrong answer, stale cache, NXDOMAIN and timeout are useful to see compared side by side. |
| Core Infrastructure — Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP server/lease demonstrations reviewed | No candidate promoted yet | Lease acquisition, reservations and options benefit from a live client/server view. |
| Core Infrastructure — DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP relay/exhaustion labs reviewed | No candidate promoted yet | Relay and exhaustion are multi-hop/stateful behaviors that are easier to visualize. |
| Core Infrastructure — Operate Time Synchronization with Chrony | OPTIONAL VIDEO | chrony/NTP demonstrations reviewed | No candidate promoted yet | A short chronyc tracking/sources demonstration can help, but the hands-on lab is straightforward. |
| Core Infrastructure — Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | NTP/clock-skew incident material reviewed | No candidate promoted yet | Seeing token/TLS/log-order effects on a shared timeline makes clock skew concrete. |
| Core Infrastructure — Integrate Core Services into the Homelab | NO VIDEO | — | — | Integration evidence should come from the learner's environment. |
| Core Infrastructure — Reassess Availability and Ownership | NO VIDEO | — | — | This is an architecture/operations decision from observed dependencies. |
| Configuration — Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible desired-state/idempotence demonstrations reviewed | No candidate promoted yet | A first run with changes followed by a zero-change second run is worth seeing once. |
| Configuration — Reusable Rocky Baseline Role | RECOMMENDED VIDEO | Ansible role demonstrations reviewed | No candidate promoted yet | Role structure, handlers and reusable variables benefit from a live walkthrough. |
| Configuration — Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Ansible drift/repair demonstrations reviewed | No candidate promoted yet | Deliberate drift followed by detection/repair is a strong visual operational workflow. |
| Configuration — Secrets, Failure and Safe Fleet Changes | OPTIONAL VIDEO | Ansible Vault/fleet-change material reviewed | No candidate promoted yet | A demonstration can reinforce boundaries, but later Vault/security work is deeper. |
| Configuration — Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Milestone synthesis. |
| Configuration — Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | Ownership boundaries require a contextual decision. |
| Lifecycle — Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Patch-management/change-window talks reviewed | No candidate promoted yet | Incident/change examples can add context, but risk classification is primary. |
| Lifecycle — Patch a Rocky Linux Workload Host | NO VIDEO | — | — | Actual DNF maintenance and before/after workload evidence are the learning activity. |
| Lifecycle — Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel/reboot lifecycle demonstrations reviewed | No candidate promoted yet | Installed-versus-running kernel state and reboot transition benefit from live evidence. |
| Lifecycle — Patch Regression and Recovery | RECOMMENDED VIDEO | Linux rollback/recovery demonstrations reviewed | No candidate promoted yet | A controlled failed update and recovery path is valuable to see, but learner must reproduce safely. |
| Lifecycle — Patch Multiple Rocky Hosts with Ansible | RECOMMENDED VIDEO | Ansible rolling/canary update demos reviewed | No candidate promoted yet | Canary→fleet orchestration and explicit reboot handling are sequential and visual. |
| Lifecycle — Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Prometheus patch-compliance dashboards reviewed | No candidate promoted yet | A dashboard example can help, but implementation evidence is primary. |
| Lifecycle — Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | The important skill is distinguishing maintenance domains. |
| Lifecycle — Major OS Version Change Is a Migration | OPTIONAL VIDEO | Enterprise Linux major-upgrade/rebuild discussions reviewed | No candidate promoted yet | A migration case study may reinforce why major version change differs from routine patching. |
| Lifecycle — Reassess the Patch Operating Model | NO VIDEO | — | — | Reassessment uses the learner's own evidence. |


## Platform Builder — Windows, Directory/File Services and File Integration lesson audit

| Path / lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Windows — Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Mixed-estate administration overviews reviewed | No candidate promoted yet | A brief enterprise-estate overview can provide context without turning TSA into Windows-specialist training. |
| Windows — Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server evaluation/install walkthroughs reviewed | No candidate promoted yet | A visual install can reduce setup friction; the actual baseline evidence is primary. |
| Windows — PowerShell as an Administrative Interface | RECOMMENDED VIDEO | Microsoft PowerShell learning material/demos reviewed | No candidate promoted yet | Objects, pipeline and discovery differ enough from shell text pipelines that a live demonstration adds value. |
| Windows — Services, Processes and Event Logs | RECOMMENDED VIDEO | PowerShell/Event Viewer operations demos reviewed | No candidate promoted yet | Seeing service state and event evidence correlated is useful. |
| Windows — NTFS and Share Permissions | RECOMMENDED VIDEO | Windows effective-permission demonstrations reviewed | No candidate promoted yet | Share+NTFS effective access is easier to understand with concrete allow/deny identities. |
| Windows — Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | Microsoft WinRM/PowerShell remoting demos reviewed | No candidate promoted yet | Remote session/authentication/network boundaries benefit from live demonstration. |
| Windows — Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft AD DS/DNS architecture material reviewed | No candidate promoted yet | Domain/controller/DNS/Kerberos relationships are highly visual. |
| Windows — Domain Join and Group Policy | RECOMMENDED VIDEO | Microsoft domain-join/GPO demonstrations reviewed | No candidate promoted yet | Join, policy application and resultant-policy evidence are sequential UI/system behaviors. |
| Windows — Linux–Windows Interoperability | RECOMMENDED VIDEO | SMB/DNS/LDAP cross-platform demonstrations reviewed | No candidate promoted yet | Cross-OS identity/name/file flows are useful to see end to end. |
| Windows — Reassess Windows Operational Depth | NO VIDEO | — | — | The learner must define specialist boundaries from the implemented estate. |
| Enterprise Services — Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | Red Hat NFS and Samba interoperability demonstrations reviewed | No candidate promoted yet | Producer/consumer mounts, identity and protocol differences benefit from a live cross-host demonstration. |
| Enterprise Services — Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | LDAP DN/search/bind visual explainers reviewed | No candidate promoted yet | DIT hierarchy, DN/RDN, bind and search filters are easier with a visual directory tree and live query. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | Contract design and atomicity rules are better expressed/tested directly. |
| File Integration — Legacy FTP Integration | OPTIONAL VIDEO | FTP protocol/session demonstrations reviewed | No candidate promoted yet | A packet/session demonstration can provide legacy context, but implementation evidence is primary. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch file handoff/atomic rename patterns reviewed | No candidate promoted yet | Producer→landing→validation→processing→archive/reject lifecycle benefits from a state-flow visualization. |
| File Integration — Shared Filesystem versus Managed File Transfer | NO VIDEO | — | — | This is an architecture choice based on authority, delivery and failure semantics. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP/FTPS protocol comparisons reviewed | No candidate promoted yet | TLS-versus-SSH trust/authentication paths benefit from a visual comparison. |
| Platform Builder — Milestone Review and Exit Criteria | NO VIDEO | — | — | Milestone review must use accumulated evidence. |
| Platform Builder — Assemble the Platform Builder Evidence Pack | NO VIDEO | — | — | Portfolio assembly is learner work. |
| Platform Builder — Platform Builder Exit Reflection | NO VIDEO | — | — | Reflection should come from the learner's actual platform decisions. |


## Platform Builder — Core Infrastructure Services lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| DNS, DHCP and Time as Infrastructure | RECOMMENDED VIDEO | DNS/DHCP/NTP infrastructure-flow material reviewed | Reuse focused DNS media plus service-dependency diagram; no additional broad video promoted | The lesson connects three infrastructure dependencies; visualization helps, but a generic networking overview would duplicate earlier material. |
| Operate Authoritative Homelab DNS | RECOMMENDED VIDEO | Red Hat Enterprise Linux authoritative DNS/BIND session reviewed | [Critical Administration Skills for RHEL — DNS](https://www.youtube.com/watch?v=bMOPLCA-sps) — use the server-side/BIND authoritative-zone demonstration | Red Hat demonstrates BIND as an authoritative nameserver, common record types, zone updates and service operation, closely matching the lab without replacing it. |
| Break and Diagnose DNS | RECOMMENDED VIDEO | DNS troubleshooting demonstrations reviewed | No candidate promoted yet | Watching wrong record, cache and service failures diagnosed with dig provides useful operational pattern recognition. |
| Operate DHCP Scopes and Reservations | RECOMMENDED VIDEO | DHCP allocation/scope explainers reviewed | [PowerCert — DHCP Explained](https://www.youtube.com/watch?v=e6-TaH5bkjo) — use as the conceptual lease-allocation primer | The animation makes dynamic address allocation and the DHCP client/server relationship concrete before the learner configures scopes, options and reservations themselves. |
| DHCP Exhaustion, Wrong Options and Relay | RECOMMENDED VIDEO | DHCP message/state/relay demonstrations reviewed | [IT INDEX — DHCP Master Class](https://www.youtube.com/watch?v=NrlSbxTANhY) — use the DHCP Relay Agent and message-flow sections | The relay path and DHCP state/message sequence make cross-subnet failure reasoning visible; exhaustion and wrong-option diagnosis remain learner-run failure drills. |
| Operate Time Synchronization with Chrony | OPTIONAL VIDEO | RHEL chronyd server/client walkthroughs reviewed | [Nehra Classes — Configure NTP (Chronyd) Server & Client in Linux](https://www.youtube.com/watch?v=CZC7Egtd_LM) — use the chronyd configuration and `chronyc sources`/client verification portions | The walkthrough shows the server/client boundary, chronyd service configuration, firewall exposure and chronyc verification; TSA's own synchronization experiment remains the primary evidence. |
| Clock Skew as a Security and Observability Incident | RECOMMENDED VIDEO | Clock-skew/TLS/token/log-correlation material reviewed | No candidate promoted yet | A timeline makes the cross-system consequences of incorrect time substantially clearer. |
| Integrate Core Services into the Homelab | NO VIDEO | — | — | This is an integration/cutover exercise using services already learned. |
| Reassess Availability and Ownership | NO VIDEO | — | — | The learner should make the SPOF/ownership decision from implemented evidence. |


## Platform Builder — Configuration Management and OS Lifecycle lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Desired State, Inventory and Idempotence | RECOMMENDED VIDEO | Ansible desired-state/idempotence introductions reviewed | [Packet Pushers — Ansible Desired State Configuration & Idempotency Explained](https://packetpushers.net/blog/ansible-desired-state-configuration-idempotency-explained-video/) — use as the conceptual primer before the first two-run experiment | It directly explains desired state and idempotency in Ansible; the learner must still prove convergence by running the same baseline twice and interpreting changed/ok state. |
| Reusable Rocky Baseline Role | RECOMMENDED VIDEO | Ansible roles/handlers demonstrations reviewed | [Jeff Geerling — Ansible 101](https://www.jeffgeerling.com/blog/2020/ansible-101-jeff-geerling-youtube-streaming-series/) — Episode 6 for Roles; Episode 5 for handlers/variables | The series demonstrates the exact structural jump from playbooks into reusable roles and change-triggered handlers; TSA applies those patterns to the Rocky baseline rather than copying the demo. |
| Configuration Drift Detection and Repair | RECOMMENDED VIDEO | Official Ansible configuration-drift/remediation material reviewed | [Ansible — Managing Configuration and Drift with Ansible Automation Platform](https://www.youtube.com/watch?v=a5nZbSAfdKg) — use the configuration/drift management demonstration | The Ansible project demonstrates automation maintaining intended configuration and remediating drift, giving the learner the operational pattern before manually introducing and repairing drift in the homelab. |
| Secrets, Failure and Safe Fleet Changes | OPTIONAL VIDEO | Ansible secrets/fleet rollout material reviewed | No candidate promoted yet | A canary/failure demonstration can reinforce safe rollout, while Vault later owns deeper secrets management. |
| Milestone: Build and Operate the Rocky Configuration Baseline | NO VIDEO | — | — | Independent synthesis milestone. |
| Reassess Image, Ansible and Platform Ownership | NO VIDEO | — | — | The learner must define ownership boundaries from implemented evidence. |
| Patch Risk, Exposure and Change Windows | OPTIONAL VIDEO | Enterprise patch-management/change-window material reviewed | No candidate promoted yet | A real maintenance decision example can add context, but risk classification is primarily reasoning. |
| Patch a Rocky Linux Workload Host | NO VIDEO | — | — | The learner should execute and verify a real maintenance window. |
| Kernel Update and Controlled Reboot | RECOMMENDED VIDEO | Linux kernel-update/reboot lifecycle demos reviewed | No candidate promoted yet | Installed-versus-running kernel and reboot dependency are useful to see live once. |
| Patch Regression and Recovery | RECOMMENDED VIDEO | Patch rollback/recovery demonstrations reviewed | No candidate promoted yet | Failure after change and evidence-driven recovery is a strong operational demonstration. |
| Patch Multiple Rocky Hosts with Ansible | RECOMMENDED VIDEO | Ansible rolling/canary patch material reviewed | Reuse [Jeff Geerling — Ansible 101](https://www.jeffgeerling.com/blog/2020/ansible-101-jeff-geerling-youtube-streaming-series/) for playbook/handler mechanics; no separate patching video promoted | The learner already has the Ansible mechanics needed; the educational value here is designing canary/serial execution, explicit reboot handling and verification against the TSA fleet rather than copying another patch script. |
| Patch Age and Lifecycle Visibility | OPTIONAL VIDEO | Patch posture/dashboard examples reviewed | No candidate promoted yet | Dashboard examples can reinforce visibility, but later observability paths go deeper. |
| Separate Proxmox Host and Rocky Guest Lifecycles | NO VIDEO | — | — | This is an ownership/maintenance-domain design exercise. |
| Major OS Version Change Is a Migration | OPTIONAL VIDEO | Red Hat major-version upgrade/migration material reviewed | [Red Hat — In-place upgrades using LEAPP from Enterprise Linux 7 to 8 to 9](https://tv.redhat.com/detail/6347396499112/in-place-upgrades-using-leapp-from-enterprise-linux-7-to-version-8-to-version-9) — use the planning, pre-upgrade assessment and inhibitor/remediation portions | The Red Hat session shows why a major-version change requires compatibility assessment, blocker remediation, controlled execution and verification; TSA still treats the exercise as migration/change planning rather than a copy-along upgrade. |
| Reassess the Patch Operating Model | NO VIDEO | — | — | ADR/runbook synthesis. |


## Platform Builder — Windows, File/Directory Services and File Integration lesson audit

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Windows in a Linux-Primary Enterprise Platform | OPTIONAL VIDEO | Mixed Linux/Windows enterprise operations material reviewed | No candidate promoted yet | A visual estate map can provide context, but responsibility boundaries are the main objective. |
| Build and Baseline Windows Server | OPTIONAL VIDEO | Windows Server installation/baseline walkthroughs reviewed | No candidate promoted yet | Useful for setup friction; learner still produces their own baseline evidence. |
| PowerShell as an Administrative Interface | RECOMMENDED VIDEO | Microsoft PowerShell object-pipeline demonstrations reviewed | [Microsoft Learn — Objects for the Admin](https://learn.microsoft.com/en-us/shows/getting-started-with-microsoft-powershell/objects-for-the-admin) — focus on objects across the pipeline, filtering, sorting and selecting | Microsoft demonstrates the object pipeline directly, which is the key conceptual difference from text-stream shells and the foundation for later Windows automation. |
| Services, Processes and Event Logs | RECOMMENDED VIDEO | Microsoft Event Viewer/troubleshooting material reviewed | [Microsoft Learn — Event Viewer](https://learn.microsoft.com/en-us/shows/inside/event-viewer) — use the Windows Logs and Applications and Services Logs walkthrough | Microsoft shows the principal Windows log surfaces and explicitly frames component logs as a troubleshooting starting point; the learner still correlates service/process state with an injected failure. |
| NTFS and Share Permissions | RECOMMENDED VIDEO | Microsoft Windows Server file-service/permissions material reviewed | [Microsoft Learn — Windows Server Administration Fundamentals: File and Print Services](https://learn.microsoft.com/en-us/shows/windows-server-administration-fundamentals/06) — NTFS Permissions from 00:54 and Permissions from 14:13 | The first-party walkthrough makes NTFS and shared-resource permission behavior visible before the learner proves effective access with multiple identities. |
| Remote Administration with PowerShell Remoting | RECOMMENDED VIDEO | Microsoft PowerShell remoting demonstrations reviewed | [Microsoft Learn — Automation in scale, remoting](https://learn.microsoft.com/en-us/shows/getstartedpowershell3/08) — sessions from 02:14 and remote cmdlets from 13:33 | Reusable sessions and Invoke-Command make local-versus-remote execution concrete before the learner diagnoses authentication, connectivity and remoting failures in the lab. |
| Active Directory, DNS and Domain Identity | RECOMMENDED VIDEO | Microsoft AD DS/DNS architecture material reviewed | [Microsoft Learn — Windows Server Administration Fundamentals: Essential Services](https://learn.microsoft.com/en-us/shows/windows-server-administration-fundamentals/05) — DNS from 01:40 and Directory Services from 28:46 | Microsoft connects name resolution and directory services in one Windows Server context, supporting the learner's domain/DNS dependency model before implementation. |
| Domain Join and Group Policy | RECOMMENDED VIDEO | Microsoft Windows Server Group Policy material reviewed | Reuse [Microsoft Learn — Essential Services](https://learn.microsoft.com/en-us/shows/windows-server-administration-fundamentals/05) — Group Policies from 58:59; domain join remains a learner-run lab | Reusing the authoritative Windows Server lesson avoids redundant media while visually establishing centralized policy; the learner must still join the host and prove policy application. |
| Linux–Windows Interoperability | RECOMMENDED VIDEO | Windows file-service plus mixed-estate boundary material reviewed | Reuse [Microsoft Learn — File and Print Services](https://learn.microsoft.com/en-us/shows/windows-server-administration-fundamentals/06) for the Windows share/permission side; no separate broad interoperability video promoted | The Windows-side sharing model is already demonstrated; TSA adds the higher-value evidence by making the learner connect from Linux and diagnose DNS, identity and permission boundaries directly. |
| Reassess Windows Operational Depth | NO VIDEO | — | — | Boundary/reassessment exercise. |
| Enterprise File Services: NFS and SMB | RECOMMENDED VIDEO | NFS/Samba operational demonstrations reviewed | Reuse [Microsoft Learn — File and Print Services](https://learn.microsoft.com/en-us/shows/windows-server-administration-fundamentals/06) for SMB/share semantics; no single NFS+SMB video met the promotion bar | Reuse avoids a weak generic comparison. The learner must implement both services and compare client behavior, identity mapping and permissions from real Linux/Windows evidence. |
| Enterprise Directory Services: LDAP | RECOMMENDED VIDEO | Microsoft directory-service material reviewed | [Microsoft Learn — Active Directory Lightweight Directory Services](https://learn.microsoft.com/en-us/shows/introtoad/06) — overview from 00:43 and administration from 05:26 | AD LDS provides a concrete LDAP-capable directory context for understanding directory structure and administration; TSA still requires direct bind/search/filter evidence rather than treating AD LDS as the Linux LDAP implementation. |
| File Integration — File-Based Integration Contracts | NO VIDEO | — | — | Contract/ownership design is the learning objective. |
| File Integration — Legacy FTP Integration | OPTIONAL VIDEO | FTP protocol/session demonstrations reviewed | No candidate promoted yet | Seeing control/data-channel behavior can add context, but FTP is deliberately legacy/bounded. |
| File Integration — Batch File Processing Lifecycle | RECOMMENDED VIDEO | Batch file handoff/atomic-rename processing examples reviewed | No candidate promoted yet | Producer→landing→validation→processing→archive/reject is well suited to a lifecycle diagram/demo. |
| File Integration — Shared Filesystem versus Managed File Transfer | NO VIDEO | — | — | This is an architecture trade-off decision. |
| File Integration — Secure File Transfer Readiness: SFTP and FTPS | RECOMMENDED VIDEO | SFTP/FTPS protocol-boundary explainers reviewed | [Fortra — SFTP vs. FTPS: The Key Differences](https://www.youtube.com/watch?v=G2s855EP-HI) — use as the short protocol-boundary primer | The concise comparison reinforces that SFTP and FTPS are distinct protocols with different transport/security models, preventing the common assumption that SFTP is simply encrypted FTP. |
| Platform Builder Milestone — Assemble the Platform Builder Evidence Pack | NO VIDEO | — | — | Milestone evidence synthesis. |
| Platform Builder Milestone — Platform Builder Exit Reflection | NO VIDEO | — | — | Reflection and capability assessment. |


## Delivery Engineer — complete school multimedia audit

This pass audits the live deep-authored Delivery Engineer runtime paths, including the later production-schema and migration exercises that extend the older high-level journey summary. Media is promoted only when it adds a useful visual or operational model; documentation and learner-run delivery evidence remain primary.

### Software Delivery Foundations and Automation

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| The Source-to-Production Lifecycle | RECOMMENDED VIDEO | CI/CD lifecycle explainers reviewed | [GitLab — What is CI/CD?](https://www.youtube.com/watch?v=scEDHsr3APg) — use as the lifecycle primer | Gives a compact visual path from change through automated integration and delivery before TSA separates each control boundary in depth. |
| Git Workflows | OPTIONAL VIDEO | Branching/workflow explainers reviewed | No candidate promoted | The lesson is a policy/trade-off exercise; repository practice and review evidence matter more than a branching animation. |
| Pull Requests and Reviews | NO VIDEO | — | — | Review quality is learned by reviewing real Steward changes and evidence. |
| Semantic Versioning | OPTIONAL VIDEO | SemVer explainers reviewed | No candidate promoted | The specification is short and authoritative; applying version decisions to Steward is higher value. |
| Conventional Commits | NO VIDEO | — | — | The convention plus real repository history is sufficient. |
| Release Notes and Changelogs | NO VIDEO | — | — | This is release communication practice. |
| Build Artifacts | RECOMMENDED VIDEO | Build/release artifact material reviewed | Reuse the CI/CD lifecycle primer; no separate artifact video promoted | The key TSA behavior is immutable source-to-artifact traceability, which is proved in later CI/release labs. |
| Environment Promotion | RECOMMENDED VIDEO | Promotion/pipeline material reviewed | Reuse [GitLab — What is CI/CD?](https://www.youtube.com/watch?v=scEDHsr3APg) for pipeline context | The visual pipeline helps establish promotion; TSA then requires the same immutable candidate across environments. |
| Shell Scripting for Engineers | OPTIONAL VIDEO | Bash scripting tutorials reviewed | No candidate promoted | The GNU Bash manual plus learner-authored scripts avoid duplicating earlier shell foundations. |
| Pipes, Exit Codes and Failure | RECOMMENDED VIDEO | Shell pipeline/failure material reviewed | No candidate promoted | Worth visual reinforcement, but no candidate met the focused operational standard. |
| Environment Variables | NO VIDEO | — | — | Direct process/configuration experiments are primary. |
| Repeatable Automation Scripts | NO VIDEO | — | — | Repetition, preconditions and rerun behavior must be demonstrated in the learner's scripts. |
| Make and Task Automation | OPTIONAL VIDEO | Make/task-runner tutorials reviewed | No candidate promoted | The lesson needs a small discoverable interface, not a broad Make course. |
| Idempotency Concepts | RECOMMENDED VIDEO | Desired-state/idempotence material reviewed | Reuse [Packet Pushers — Ansible Desired State Configuration & Idempotency Explained](https://packetpushers.net/blog/ansible-desired-state-configuration-idempotency-explained-video/) for the convergence mental model | Reinforces the same property across scripts and delivery automation without duplicating instruction. |
| Lab: Automate Steward Developer and Operator Tasks | NO VIDEO | — | — | Independent automation evidence. |

### Containers and Docker

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Containers versus Virtual Machines | RECOMMENDED VIDEO | Container/VM architecture explainers reviewed | [IBM Technology — Containers vs VMs: What's the difference?](https://www.youtube.com/watch?v=cjXI-yxqGTI) | Strong visual comparison of isolation boundaries before the learner works with Linux container primitives. |
| Namespaces and cgroups Concepts | RECOMMENDED VIDEO | Linux container primitive explainers reviewed | [Docker — How Containers Work](https://www.youtube.com/watch?v=-YnMr1lj4Z8) — focus on namespaces/cgroups isolation concepts | Connects the Docker abstraction to Linux isolation/resource primitives instead of presenting containers as magic. |
| Docker Architecture | RECOMMENDED VIDEO | Docker architecture material reviewed | [Docker — Docker 101 Tutorial](https://www.youtube.com/watch?v=gAGEar5HQoU) — use the architecture/image/container portions | Establishes the client/daemon/image/container model before operational work. |
| Images and Layers | RECOMMENDED VIDEO | Docker image/layer material reviewed | Reuse Docker 101; inspect image history/layers during the TSA lab | Avoids redundant media while the learner proves caching and immutable image identity directly. |
| Writing Dockerfiles | RECOMMENDED VIDEO | Dockerfile tutorials reviewed | Reuse [Docker — Docker 101 Tutorial](https://www.youtube.com/watch?v=gAGEar5HQoU) for build mechanics | First-party demonstration complements the Dockerfile reference; TSA owns production-oriented decisions. |
| Build Context | OPTIONAL VIDEO | Build-context explanations reviewed | No separate candidate promoted | A .dockerignore/build-context experiment is clearer than another video. |
| Multi-stage Builds | RECOMMENDED VIDEO | Multi-stage build material reviewed | [Docker — Multi-stage Builds](https://www.youtube.com/watch?v=zpkqNPwEzac) | The build-stage/runtime-stage boundary is easier to understand visually before optimizing Steward. |
| Volumes | RECOMMENDED VIDEO | Docker storage demonstrations reviewed | Reuse Docker 101 for volume mechanics; prove persistence through container destruction | The destructive/recreate lab supplies the important evidence. |
| Container Networking | RECOMMENDED VIDEO | Docker networking material reviewed | [NetworkChuck — Docker Networking](https://www.youtube.com/watch?v=bKFMS5C4CG0) — use for bridge/port/container communication visualization | Makes the virtual network boundary visible while relying on Platform Builder networking knowledge. |
| Docker Compose | RECOMMENDED VIDEO | Compose demonstrations reviewed | [Docker — Docker Compose](https://www.youtube.com/watch?v=HG6yIjZapSA) — use as the multi-service declaration primer | Visualizes services/networks/volumes as one application model before Steward+PostgreSQL implementation. |
| Health Checks | OPTIONAL VIDEO | Container health-check material reviewed | No candidate promoted | Learner must define and falsify a meaningful health claim. |
| Container Registries | RECOMMENDED VIDEO | Registry workflow material reviewed | Reuse Docker 101 for push/pull context; deeper repository management follows in Artifact & Supply Chain | Prevents duplicating the later repository-manager module. |
| Image Tags and Versioning | RECOMMENDED VIDEO | Tag/digest material reviewed | No candidate promoted | Direct tag-versus-digest inspection against the learner's built image is stronger evidence. |
| Image Optimization | OPTIONAL VIDEO | Image optimization material reviewed | Reuse multi-stage-build media | Multi-stage construction is the main visual concept; optimization remains evidence-based. |
| Container Debugging | RECOMMENDED VIDEO | Docker troubleshooting demonstrations reviewed | No candidate promoted | TSA's controlled failure lab deliberately exercises logs, inspect, networking and configuration boundaries. |
| Lab: Containerize Steward API | NO VIDEO | — | — | Independent build/recreate/failure evidence. |

### Continuous Integration

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| CI Pipeline Architecture | RECOMMENDED VIDEO | Jenkins/GitHub Actions pipeline introductions reviewed | [Jenkins — Pipeline](https://www.jenkins.io/doc/book/pipeline/) plus [Jenkins Pipeline overview video](https://www.youtube.com/watch?v=7KCS70sCoK0) | The pipeline-as-code/stage model is strongly visual and maps to the self-hosted CI work. |
| Jobs, Stages and Dependencies | RECOMMENDED VIDEO | Pipeline execution-model material reviewed | Reuse Jenkins Pipeline overview | One coherent execution model is preferable to unrelated CI tutorials. |
| Runners and Agents | RECOMMENDED VIDEO | Jenkins agent architecture material reviewed | [Jenkins — Using Jenkins agents](https://www.youtube.com/watch?v=99DddJiH7lM) | Makes controller/agent execution boundaries concrete before installing the homelab agent. |
| GitHub Actions and Jenkins | OPTIONAL VIDEO | Platform comparison material reviewed | No candidate promoted | TSA needs capability comparison and an explicit platform choice, not a vendor popularity comparison. |
| Self-hosted Runners | RECOMMENDED VIDEO | Self-hosted runner/agent setup material reviewed | Reuse Jenkins agent media for execution boundary; setup remains learner-run | Keeps the conceptual and operational model aligned with the academy's Jenkins path. |
| Caching | OPTIONAL VIDEO | CI cache demonstrations reviewed | No candidate promoted | Cache correctness is better learned by measuring cold/warm pipeline behavior. |
| Pipeline Artifacts | RECOMMENDED VIDEO | CI artifact material reviewed | Reuse pipeline overview; later Nexus module owns durable artifact management | Avoids conflating temporary CI artifacts with repository-managed release artifacts. |
| Secrets and Variables | RECOMMENDED VIDEO | Jenkins credential-handling material reviewed | [Jenkins — Using Credentials](https://www.jenkins.io/doc/book/using/using-credentials/) | First-party guidance establishes credential boundaries; secret-management depth remains later curriculum. |
| Parallelism | OPTIONAL VIDEO | Parallel pipeline material reviewed | No candidate promoted | Learner should parallelize only after identifying independent work and measuring value. |
| Automated Checks | NO VIDEO | — | — | Existing tests/linters are integrated directly. |
| Test Stages | NO VIDEO | — | — | Pipeline composition practice. |
| Quality Gates | NO VIDEO | — | — | Gate policy must be defended from real risk/evidence. |
| Building Containers in CI | RECOMMENDED VIDEO | Jenkins+Docker build material reviewed | Reuse Jenkins Pipeline + Docker build resources | The value is integrating already-learned primitives into one traceable pipeline. |

### Continuous Delivery and Deployment

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| CI versus Continuous Delivery versus Continuous Deployment | RECOMMENDED VIDEO | CI/CD boundary explainers reviewed | Reuse [GitLab — What is CI/CD?](https://www.youtube.com/watch?v=scEDHsr3APg) | Provides the visual vocabulary; TSA explicitly tests the control boundaries. |
| Environment Management | NO VIDEO | — | — | Environment contracts are derived from the learner's infrastructure/configuration. |
| Deployment Automation | RECOMMENDED VIDEO | Deployment pipeline demonstrations reviewed | Reuse Jenkins Pipeline overview | Pipeline mechanics are known; the lesson's value is executable deployment intent and verification. |
| Release Approvals | OPTIONAL VIDEO | Approval-gate material reviewed | No candidate promoted | Approval is a decision/evidence design problem rather than a UI tutorial. |
| Database Migrations During Deployment | RECOMMENDED VIDEO | Expand/contract and migration-safety material reviewed | [Martin Fowler — Parallel Change](https://martinfowler.com/bliki/ParallelChange.html) — visual/article resource rather than forcing a weaker video | Backward-compatible expand/migrate/contract thinking is more important than framework-specific migration commands. |
| Rollback | RECOMMENDED VIDEO | Deployment rollback material reviewed | No candidate promoted | TSA must prove rollback against immutable image identity and persistent-state constraints. |
| Rolling Deployments | RECOMMENDED VIDEO | Kubernetes deployment strategy explainers reviewed | [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) — use rolling-update diagrams | The controller diagrams make incremental replacement and coexistence constraints clear even before later Kubernetes depth. |
| Blue-Green Deployments | RECOMMENDED VIDEO | Blue/green strategy explainers reviewed | [Martin Fowler — BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html) | Clear topology/traffic-switch mental model without adding a tool-specific recipe. |
| Canary Deployment Concepts | RECOMMENDED VIDEO | Canary/progressive delivery material reviewed | [Argo Rollouts — Canary strategy](https://argo-rollouts.readthedocs.io/en/stable/features/canary/) | The staged exposure model directly prepares the later progressive-delivery exercise. |
| Feature Flag Concepts | OPTIONAL VIDEO | Feature-toggle material reviewed | [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — use diagrams as supporting visual material | Shows deployment/exposure decoupling and the operational complexity of long-lived flags. |
| Lab: Automate Steward API Deployment and Rollback | NO VIDEO | — | — | Independent release/rollback evidence. |

### Configuration Management

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Configuration Drift | RECOMMENDED VIDEO | Ansible drift material reviewed | Reuse [Ansible — Managing Configuration and Drift](https://www.youtube.com/watch?v=a5nZbSAfdKg) | This is deliberate reinforcement of Platform Builder: Delivery Engineer now connects declared host state to the delivery platform. |
| Desired State and Idempotency | RECOMMENDED VIDEO | Desired-state material reviewed | Reuse Packet Pushers idempotency primer | Reinforcement rather than duplicate instruction. |
| Ansible Fundamentals | OPTIONAL VIDEO | Ansible fundamentals reviewed | Reuse Jeff Geerling Ansible 101 only as needed | Platform Builder already established the operational foundation. |
| Inventories | NO VIDEO | — | — | Learner models the actual Steward host roles. |
| Playbooks | OPTIONAL VIDEO | Playbook demonstrations reviewed | Reuse Jeff Geerling Ansible 101 | Existing media is sufficient. |
| Roles Concepts | OPTIONAL VIDEO | Role demonstrations reviewed | Reuse Jeff Geerling Ansible 101 Episode 6 | Existing media is sufficient. |
| Lab: Automate Steward Servers with Ansible | NO VIDEO | — | — | Independent convergence/drift/rebuild evidence. |

### Artifact, Dependency and Supply-Chain Foundations

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Why Organizations Use Internal Artifact Repositories | RECOMMENDED VIDEO | Sonatype repository-manager material reviewed | [Sonatype — What is a Repository Manager?](https://www.youtube.com/watch?v=6F5tTzYgKxQ) | Establishes the enterprise repository-manager role before homelab deployment. |
| Package Registries versus Artifact Repositories | RECOMMENDED VIDEO | Registry/repository-manager comparisons reviewed | Reuse Sonatype repository-manager primer | One conceptual model is sufficient; TSA then compares supported formats and ownership. |
| Public and Private Dependencies | NO VIDEO | — | — | Dependency classification is applied directly to Steward. |
| Repository Manager Architecture | RECOMMENDED VIDEO | Nexus architecture/deployment material reviewed | [Sonatype Nexus Repository documentation](https://help.sonatype.com/en/sonatype-nexus-repository.html) with architecture diagrams | First-party architecture is preferable to an installation-only video. |
| Hosted, Proxy and Group Repositories | RECOMMENDED VIDEO | Nexus repository-type demonstrations reviewed | [Sonatype — Repository Management Basics](https://www.youtube.com/watch?v=6F5tTzYgKxQ) — focus on hosted/proxy/group concepts | These repository types are easiest to understand as a request-flow model before implementation. |
| Python and PyPI Package Distribution | OPTIONAL VIDEO | Python packaging material reviewed | No candidate promoted | PyPA documentation and actual publish/install evidence are stronger. |
| npm Package Distribution | OPTIONAL VIDEO | npm publishing material reviewed | No candidate promoted | npm documentation plus real package publication is sufficient. |
| Container Registries | RECOMMENDED VIDEO | OCI registry workflow reviewed | Reuse Docker registry material | Connects image publication to the same repository platform without duplicating Docker. |
| Deploying Nexus Repository in the Homelab | OPTIONAL VIDEO | Nexus installation walkthroughs reviewed | No candidate promoted | Installation changes over time; first-party docs plus the academy topology are safer. |
| Repository Authentication and Permissions | RECOMMENDED VIDEO | Nexus security/RBAC material reviewed | [Sonatype Nexus Repository documentation](https://help.sonatype.com/en/roles.html) | First-party role/privilege model directly supports least-privilege repository operation. |
| Publishing Internal Python Packages | NO VIDEO | — | — | Learner must build/publish a real internal package. |
| Consuming Internal Packages with pip | NO VIDEO | — | — | Direct client configuration and resolution evidence. |
| Publishing Internal npm Packages | NO VIDEO | — | — | Direct publication evidence. |
| Consuming Internal Packages with npm and pnpm | NO VIDEO | — | — | Direct client-resolution evidence. |
| Publishing Steward Container Images Internally | NO VIDEO | — | — | Direct CI-to-registry evidence. |
| Proxying and Caching Public Dependencies | RECOMMENDED VIDEO | Nexus proxy-repository material reviewed | Reuse Sonatype repository-manager primer | The request/cache flow is the important visual model. |
| Internal Package Versioning | NO VIDEO | — | — | Apply SemVer/release policy to actual internal packages. |
| Prerelease, Snapshot and Release Concepts | OPTIONAL VIDEO | Repository version-state material reviewed | No candidate promoted | The learner should reason from package/repository policy and immutable release identity. |
| Artifact Retention and Cleanup | OPTIONAL VIDEO | Repository cleanup-policy material reviewed | No candidate promoted | Policy is driven by recovery/audit/storage constraints. |
| Dependency Provenance | RECOMMENDED VIDEO | SLSA provenance material reviewed | [SLSA — Provenance](https://slsa.dev/spec/v1.0/provenance) — use provenance model/diagrams | Gives a precise source→build→artifact attestation model. |
| SBOM Fundamentals | RECOMMENDED VIDEO | CISA/CycloneDX SBOM material reviewed | [CycloneDX — SBOM](https://cyclonedx.org/capabilities/sbom/) — use component/dependency model diagrams | Establishes the software-component inventory model before generating Steward evidence. |
| Signing and Provenance Concepts | RECOMMENDED VIDEO | Sigstore/SLSA signing material reviewed | [Sigstore — How it works](https://www.sigstore.dev/how-it-works/) | Visualizes identity, signing and transparency-log concepts without requiring premature deep PKI work. |
| Dependency, Package and Image Scanning | RECOMMENDED VIDEO | Trivy/scanning material reviewed | [Aqua Security — Trivy documentation](https://trivy.dev/latest/) | One tool can demonstrate filesystem/package/image findings while TSA keeps scanning as evidence, not a security guarantee. |
| Lab: Build the Steward Internal Artifact Repository | NO VIDEO | — | — | Independent repository-platform build evidence. |
| Lab: Publish and Consume steward-common through CI | NO VIDEO | — | — | Independent source→package→repository→consumer traceability evidence. |

### Release Engineering and Production Evolution

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Release Candidates | RECOMMENDED VIDEO | Release-engineering material reviewed | [Google SRE Book — Release Engineering](https://sre.google/sre-book/release-engineering/) — use the release philosophy/process diagrams as supporting visual material | Authoritative operational framing for reproducible, automated releases. |
| Promotion and Gates | RECOMMENDED VIDEO | Promotion/gating material reviewed | Reuse Google SRE Release Engineering plus the CI pipeline model | Connects immutable candidate identity to explicit promotion decisions. |
| Deployment Evidence | NO VIDEO | — | — | Evidence must come from the actual deployed Steward release. |
| Release Observability | OPTIONAL VIDEO | Release telemetry material reviewed | No candidate promoted | Reliability Engineer later owns the observability stack; here only enough evidence for a release decision is required. |
| Release Failure Handling | RECOMMENDED VIDEO | Rollback/failure material reviewed | No candidate promoted | The controlled failed release and recovery exercise is intentionally primary. |
| Release Runbooks | NO VIDEO | — | — | Runbook quality is proved by another engineer being able to execute it. |
| Release Engineering Lab and Review | NO VIDEO | — | — | Synthesis, failure and review evidence. |
| Production Database Schema Evolution | RECOMMENDED VIDEO | Parallel-change/expand-contract material reviewed | Reuse [Martin Fowler — Parallel Change](https://martinfowler.com/bliki/ParallelChange.html) | Directly supports expand/backfill/switch/contract and old/new coexistence reasoning. |
| Delivery Platform Migration Exercise | NO VIDEO | — | — | Migration is a bounded comparative exercise using real CI evidence. |
| Progressive Delivery with Canary Releases | RECOMMENDED VIDEO | Argo Rollouts canary material reviewed | [Argo Rollouts — Canary](https://argo-rollouts.readthedocs.io/en/stable/features/canary/) plus rollout diagrams | The staged traffic and automated-analysis control loop is highly visual; implementation remains learner-owned. |

### Delivery Engineer Milestone

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Milestone Brief: Steward Delivery Platform | NO VIDEO | — | — | Defines the independent synthesis target. |
| Gate 1: Source, CI and Artifact Integrity | NO VIDEO | — | — | Must be proven from source, pipeline and immutable artifact evidence. |
| Gate 2: Reproducible Delivery Infrastructure | NO VIDEO | — | — | Must be demonstrated from a reproducible host/repository build. |
| Gate 3: Promotion and Deployment | NO VIDEO | — | — | Same-candidate promotion is assessed directly. |
| Gate 4: Runtime Verification | NO VIDEO | — | — | Requires observed behavior from the deployed release. |
| Gate 5: Failure, Rollback and Recovery | NO VIDEO | — | — | Controlled failure evidence is the assessment. |
| Gate 6: Delivery Platform Handoff | NO VIDEO | — | — | Engineering handoff is the artifact. |
| Milestone Review and Exit Criteria | NO VIDEO | — | — | Final capability assessment. |


## Cloud Engineer — complete school multimedia audit

This audit follows the live Cloud Engineer deep paths rather than the older six-module summary. It therefore includes certificate lifecycle operations, S3-compatible object storage, Kubernetes/OpenShift orchestration, Argo CD GitOps and progressive delivery in addition to hosting, VPS, internet networking, cloud building blocks, IaC and architecture/cost.

### Cloud and Hosting Models

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| On-premises, Colocation, VPS and Cloud | RECOMMENDED VIDEO | Cloud hosting-model explainers reviewed | [IBM Technology — Cloud Computing Explained](https://www.youtube.com/watch?v=M988_fsOSWo) — use for the cloud/service consumption mental model | Gives a visual baseline for what changes when infrastructure ownership moves away from the learner's homelab. |
| IaaS, PaaS and SaaS | RECOMMENDED VIDEO | Service-model explainers reviewed | [IBM Technology — IaaS, PaaS, SaaS](https://www.youtube.com/watch?v=36zducUX16w) | Clearly visualizes the changing responsibility boundary across service models. |
| Regions, Zones and Availability Concepts | RECOMMENDED VIDEO | AWS/Azure region/AZ material reviewed | [AWS — Global Infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/) — use the region/AZ diagrams | Provider diagrams are better than a generic cloud video for physical/logical failure-domain concepts. |
| Shared Responsibility | RECOMMENDED VIDEO | AWS shared-responsibility material reviewed | [AWS — Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/) — use the responsibility diagrams | The responsibility split is the core lesson and is explicitly visualized by the provider. |
| Elasticity and Consumption Models | OPTIONAL VIDEO | Elasticity/cloud economics material reviewed | Reuse IBM cloud-computing primer | The learner's comparison exercise supplies the important cost/capacity context. |
| Cloud Cost Awareness | RECOMMENDED VIDEO | FinOps introductions reviewed | [FinOps Foundation — What is FinOps?](https://www.finops.org/introduction/what-is-finops/) | Establishes cloud cost as an engineering/operating concern rather than only a finance concern. |
| Lab: Compare Homelab, VPS and Managed Cloud Hosting | NO VIDEO | — | — | The learner must defend a hosting decision against actual constraints. |

### VPS Operations

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Choosing a Budget VPS | NO VIDEO | — | — | Provider/pricing choice is time-sensitive and must use current requirements and prices. |
| Provisioning a Server | OPTIONAL VIDEO | VPS provisioning walkthroughs reviewed | No candidate promoted | Provider UIs change; current provider documentation plus learner evidence is safer. |
| Public IP Addressing | RECOMMENDED VIDEO | Public/private addressing material reviewed | Reuse Platform Builder networking foundations; no new broad video promoted | Cloud Engineer applies an already-learned network model to a public host. |
| Securing SSH Access | RECOMMENDED VIDEO | OpenSSH hardening material reviewed | [Red Hat — OpenSSH](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/securing_networks/using-secure-communications-between-two-systems-with-openssh_securing-networks) | First-party operational guidance is preferable to copying an SSH-hardening recipe from video. |
| Provider Firewalls and Security Controls | RECOMMENDED VIDEO | Cloud firewall/security-group material reviewed | [AWS — Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) — use rule/traffic diagrams as a provider example | Shows the external/provider firewall boundary; TSA then maps the same concept to the chosen VPS. |
| OS Lifecycle and Patching | OPTIONAL VIDEO | Linux patching material reviewed | Reuse Platform Builder OS lifecycle resources | Reinforcement, not duplicate teaching. |
| Remote Recovery Concepts | RECOMMENDED VIDEO | VPS rescue/console material reviewed | No candidate promoted | Recovery mechanisms vary by provider; the learner must document the chosen provider's actual console/rescue path. |
| Backups and Snapshots | RECOMMENDED VIDEO | VPS snapshot/backup material reviewed | No candidate promoted | Provider semantics vary; direct restore evidence matters more than a generic snapshot demo. |
| Lab: Provision the Steward VPS | NO VIDEO | — | — | Independent host, deploy, recovery and handoff evidence. |

### Internet Networking, DNS and TLS

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Public and Private Addressing | RECOMMENDED VIDEO | Internet addressing material reviewed | Reuse prior networking media | The new learning objective is exposure/ownership, not relearning IP addressing. |
| Internet Routing Concepts | RECOMMENDED VIDEO | Internet routing/BGP explainers reviewed | [Cloudflare — What is BGP?](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/) — use routing diagrams | Gives enough global-routing context without turning Cloud Engineer into a BGP course. |
| Domains and DNS Records | RECOMMENDED VIDEO | DNS record material reviewed | [Cloudflare — DNS record types](https://www.cloudflare.com/learning/dns/dns-records/) | Visual/reference treatment of A/AAAA/CNAME/MX/TXT and record purpose supports the public DNS lab. |
| DNS Resolution and Troubleshooting | RECOMMENDED VIDEO | DNS resolution material reviewed | [Cloudflare — What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/) — use recursive-resolution diagram | The request path from resolver to authoritative answer is useful before deliberate DNS break/fix. |
| TLS Certificates and Certificate Authorities | RECOMMENDED VIDEO | TLS/CA material reviewed | [Let's Encrypt — How It Works](https://letsencrypt.org/how-it-works/) | Directly connects ACME, domain control and certificate issuance to the learner's public service. |
| HTTPS and TLS Termination | RECOMMENDED VIDEO | TLS handshake/termination material reviewed | [Cloudflare — What happens in a TLS handshake?](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/) | Visual handshake sequence clarifies what the reverse proxy terminates and what the client validates. |
| Reverse Proxies | RECOMMENDED VIDEO | NGINX reverse-proxy material reviewed | [NGINX — Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) — use request-flow configuration examples | First-party material maps directly to the gateway role without replacing the learner's configuration. |
| Ingress Concepts | OPTIONAL VIDEO | Ingress/gateway material reviewed | No candidate promoted | Full Kubernetes ingress arrives later in this school; here the conceptual boundary is enough. |
| Internet-facing Firewalls | RECOMMENDED VIDEO | Cloud firewall material reviewed | Reuse provider security-group diagrams | Avoids redundant firewall instruction. |
| Exposure, Attack Surface and Administrative Boundaries | NO VIDEO | — | — | This is an architecture/security-boundary decision against the learner's topology. |
| Lab: Publish Steward API with DNS and TLS | NO VIDEO | — | — | Independent public request-path and break/fix evidence. |

### Cloud Building Blocks

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Compute | RECOMMENDED VIDEO | Cloud compute material reviewed | [AWS — What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) — use architecture diagrams as one concrete provider mapping | Connects generic compute to a real IaaS implementation without making AWS the curriculum itself. |
| Object Storage | RECOMMENDED VIDEO | Object-storage explainers reviewed | [IBM Technology — Object Storage](https://www.youtube.com/watch?v=eV7T3t2d-7E) | Object/key/bucket semantics differ enough from files/block storage to benefit from visualization. |
| Block Storage | RECOMMENDED VIDEO | Block/file/object comparisons reviewed | [IBM Technology — Block vs File vs Object Storage](https://www.youtube.com/watch?v=5EqAXnNm0FE) | Visual comparison establishes the workload/storage fit before provider mapping. |
| Managed Databases | RECOMMENDED VIDEO | Managed DB/shared-responsibility material reviewed | No candidate promoted | The important lesson is the shifted operational boundary, already covered by shared responsibility. |
| Virtual Networks and Subnets | RECOMMENDED VIDEO | VPC/VNet material reviewed | [AWS — What is Amazon VPC?](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) — use VPC/subnet diagrams | Maps Platform Builder networking concepts into a provider virtual-network boundary. |
| Routing and Gateways | RECOMMENDED VIDEO | VPC routing material reviewed | Reuse AWS VPC diagrams | Keeps one coherent provider example. |
| Load Balancers | RECOMMENDED VIDEO | Load-balancing explainers reviewed | [IBM Technology — Load Balancers](https://www.youtube.com/watch?v=sCR3SAVdyCc) | Request-distribution and health-routing behavior are strongly visual. |
| IAM | RECOMMENDED VIDEO | Cloud IAM explainers reviewed | [Google Cloud — IAM overview](https://cloud.google.com/iam/docs/overview) — use principal/role/resource model diagrams | Makes authorization attachment and least privilege concrete without tying the concept to local OS users. |
| Secrets Management | RECOMMENDED VIDEO | Cloud secret-manager material reviewed | [Google Cloud — Secret Manager overview](https://cloud.google.com/secret-manager/docs/overview) | Establishes a managed secret lifecycle boundary; Security Steward later goes deeper. |
| Cloud Monitoring | OPTIONAL VIDEO | Provider monitoring material reviewed | No candidate promoted | Reliability Engineer owns deep telemetry; here the learner only maps the managed capability. |
| Cloud Backup Services | OPTIONAL VIDEO | Provider backup material reviewed | No candidate promoted | Recovery semantics must be evaluated against the chosen data/service. |
| Managed Services versus Self-managed Infrastructure | NO VIDEO | — | — | Trade-off decision based on responsibility, cost and operational capability. |
| Lab: Map Steward Platform to Cloud Building Blocks | NO VIDEO | — | — | Architecture mapping exercise. |

### Infrastructure as Code — OpenTofu/Terraform Concepts

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Why Infrastructure as Code | RECOMMENDED VIDEO | HashiCorp IaC introductions reviewed | [HashiCorp — What is Infrastructure as Code?](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code) | Establishes versioned/declarative infrastructure as the control model before syntax. |
| Declarative Infrastructure | RECOMMENDED VIDEO | Terraform/OpenTofu workflow material reviewed | Reuse HashiCorp IaC primer | One conceptual source is enough; TSA proves convergence/drift operationally. |
| Terraform and OpenTofu Fundamentals | RECOMMENDED VIDEO | OpenTofu/Terraform introductions reviewed | [OpenTofu — Documentation](https://opentofu.org/docs/) plus getting-started flow | Uses the academy's open implementation while retaining transferable Terraform concepts. |
| Providers and Resources | RECOMMENDED VIDEO | Provider/resource model reviewed | [OpenTofu — Providers](https://opentofu.org/docs/language/providers/) | First-party model directly supports implementation. |
| State | RECOMMENDED VIDEO | Terraform/OpenTofu state material reviewed | [OpenTofu — State](https://opentofu.org/docs/language/state/) | State is a critical non-obvious operational boundary and deserves explicit reinforcement. |
| Variables and Outputs | OPTIONAL VIDEO | IaC variable/output tutorials reviewed | No candidate promoted | Straightforward to learn by implementing the Steward stack. |
| Dependencies | OPTIONAL VIDEO | Resource graph material reviewed | No candidate promoted | The learner can inspect implicit/explicit dependencies directly. |
| Modules Concepts | RECOMMENDED VIDEO | Terraform module material reviewed | [HashiCorp — Modules overview](https://developer.hashicorp.com/terraform/language/modules) | Visual/file-structure model helps establish reusable infrastructure boundaries. |
| Plan and Apply Lifecycle | RECOMMENDED VIDEO | OpenTofu workflow material reviewed | [OpenTofu — CLI workflow](https://opentofu.org/docs/cli/) | Plan-before-apply is central to the school and must be observed directly. |
| Drift | RECOMMENDED VIDEO | IaC drift material reviewed | No separate candidate promoted | The learner deliberately introduces drift and reconciles it; direct plan evidence is stronger. |
| Remote State Concepts | RECOMMENDED VIDEO | Remote-state material reviewed | [OpenTofu — Remote state data](https://opentofu.org/docs/language/state/remote-state-data/) | Clarifies collaboration/state-sharing boundaries before later team-scale infrastructure. |
| Secrets and Sensitive Values | RECOMMENDED VIDEO | IaC secret/state material reviewed | No candidate promoted | The lab should expose the danger by inspecting state/plan behavior rather than hiding it behind a tutorial. |
| Destroy and Resource Lifecycle | RECOMMENDED VIDEO | Resource lifecycle material reviewed | [OpenTofu — Resource lifecycle](https://opentofu.org/docs/language/meta-arguments/lifecycle/) | First-party semantics support safe teardown/replacement reasoning. |
| Lab: Define Steward Infrastructure as Code | NO VIDEO | — | — | Independent plan/apply/drift/state/teardown evidence. |

### Cloud Architecture and Cost

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Availability in Cloud Environments | RECOMMENDED VIDEO | Well-Architected reliability material reviewed | [AWS Well-Architected — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) | Frames availability around failure/recovery rather than simply adding instances. |
| Scalability and Capacity | RECOMMENDED VIDEO | Scaling material reviewed | [IBM Technology — Horizontal vs Vertical Scaling](https://www.youtube.com/watch?v=xpDnVSmNFX0) | The scale-up/scale-out distinction is visual and prepares later architecture work. |
| Security Boundaries | NO VIDEO | — | — | Must be drawn from the actual Steward trust/exposure model. |
| Backup and Recovery | RECOMMENDED VIDEO | Cloud recovery material reviewed | No candidate promoted | Recovery must be proven with the learner's real data and infrastructure. |
| Failure Domains | RECOMMENDED VIDEO | Region/AZ failure-domain material reviewed | Reuse AWS global-infrastructure diagrams | Direct continuation of regions/zones learning. |
| Cost Estimation | RECOMMENDED VIDEO | FinOps cost material reviewed | Reuse FinOps Foundation introduction | The lab must use current provider pricing rather than static video numbers. |
| Cost Controls and Budgets | RECOMMENDED VIDEO | FinOps framework material reviewed | [FinOps Foundation — FinOps Framework](https://www.finops.org/framework/) | Connects engineering decisions to allocation, optimization and governance. |
| Resource Right-sizing | OPTIONAL VIDEO | Right-sizing material reviewed | No candidate promoted | Learner should justify sizing from observed workload assumptions/evidence. |
| Managed vs Self-managed Trade-offs | NO VIDEO | — | — | Architecture decision. |
| Homelab, VPS and Cloud Hybrid Trade-offs | NO VIDEO | — | — | Architecture decision grounded in the learner's actual environments. |
| Lab: Review the Steward Internet Architecture | NO VIDEO | — | — | Independent architecture/cost/recovery review. |

### Certificate Lifecycle Operations

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Certificate Lifecycle Operations | RECOMMENDED VIDEO | ACME/certificate lifecycle material reviewed | Reuse [Let's Encrypt — How It Works](https://letsencrypt.org/how-it-works/) | The issuance/renewal automation loop is the central mental model. |
| Certificates Are Expiring Operational State | NO VIDEO | — | — | Learner inspects actual validity periods and renewal state. |
| Inspect Steward's TLS Identity and Trust Chain | RECOMMENDED VIDEO | OpenSSL certificate inspection material reviewed | No candidate promoted | Direct openssl/browser inspection of the learner's certificate is stronger. |
| Automate Renewal and Gateway Reload | RECOMMENDED VIDEO | Certbot renewal material reviewed | [Certbot — Instructions](https://certbot.eff.org/instructions) | Current first-party workflow is preferable to an aging walkthrough. |
| Monitor Expiry and Renewal Health | NO VIDEO | — | — | Operational evidence is the objective. |
| Break and Recover Certificate Renewal | NO VIDEO | — | — | Controlled failure exercise. |
| Defend the Certificate Lifecycle | NO VIDEO | — | — | Architecture/operations defense. |

### S3-Compatible Object Storage

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| S3-Compatible Object Storage for Steward | RECOMMENDED VIDEO | S3/object-storage material reviewed | Reuse IBM object-storage explainer plus [Amazon S3 concepts](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) | Combines the storage mental model with the API/bucket/object vocabulary used by S3-compatible systems. |
| From Object-storage Design to Operation | NO VIDEO | — | — | Learner converts the prior design into an operational contract. |
| Deploy and Secure the Object Store | RECOMMENDED VIDEO | MinIO deployment/security material reviewed | [MinIO Documentation](https://min.io/docs/minio/linux/index.html) | Current implementation docs are preferable to version-sensitive installation videos. |
| Integrate Steward Export Evidence | NO VIDEO | — | — | Real application integration evidence. |
| Operate Lifecycle, Failure and Recovery | NO VIDEO | — | — | Controlled lifecycle/failure/recovery evidence. |
| Defend the Storage Architecture | NO VIDEO | — | — | Architecture defense. |

### Kubernetes, OpenShift and GitOps

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Why Container Orchestration | RECOMMENDED VIDEO | Kubernetes introductions reviewed | [IBM Technology — Kubernetes Explained](https://www.youtube.com/watch?v=aSrqRSk43lY) | Visualizes why scheduling/reconciliation/service discovery emerge beyond single-host Compose. |
| Kubernetes Cluster and Control Plane | RECOMMENDED VIDEO | Kubernetes architecture material reviewed | [Kubernetes — Components](https://kubernetes.io/docs/concepts/overview/components/) — use control-plane/node diagram | Canonical architecture diagram establishes ownership and reconciliation boundaries. |
| Pods, Deployments and ReplicaSets | RECOMMENDED VIDEO | Kubernetes workload-controller material reviewed | [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) | Controller diagrams map desired replicas to rollout behavior. |
| Services and Cluster Networking | RECOMMENDED VIDEO | Kubernetes networking material reviewed | [Kubernetes — Services](https://kubernetes.io/docs/concepts/services-networking/service/) | Canonical service/endpoint model prepares cross-pod reachability work. |
| ConfigMaps, Secrets and Runtime Configuration | RECOMMENDED VIDEO | Kubernetes configuration material reviewed | [Kubernetes — ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/) and Secrets docs | First-party resource boundaries prevent treating image configuration as mutable container state. |
| Probes, Resources and Rollouts | RECOMMENDED VIDEO | Kubernetes probe/resource/rollout material reviewed | [Kubernetes — Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) | Probes are subtle enough to warrant canonical lifecycle diagrams/examples before failure exercises. |
| Namespaces, Service Accounts and RBAC | RECOMMENDED VIDEO | Kubernetes RBAC material reviewed | [Kubernetes — RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) | Canonical subject/role/binding model supports least-privilege cluster operation. |
| OpenShift as an Enterprise Application Platform | RECOMMENDED VIDEO | Red Hat OpenShift introductions reviewed | [Red Hat — What is OpenShift?](https://www.redhat.com/en/topics/containers/what-is-red-hat-openshift) | Establishes what OpenShift adds around Kubernetes without presenting it as a separate universe. |
| OpenShift Routes, SCC Concepts and Operators | RECOMMENDED VIDEO | Red Hat route/SCC/operator material reviewed | [OpenShift Documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/) — use architecture/resource diagrams | Versioned first-party docs are safer for platform-specific security and routing behavior. |
| GitOps and Reconciliation | RECOMMENDED VIDEO | GitOps conceptual material reviewed | [Argo CD — What is Argo CD?](https://argo-cd.readthedocs.io/en/stable/) | Connects Git desired state to continuous reconciliation rather than imperative deployment. |
| Argo CD Applications, Sync and Drift | RECOMMENDED VIDEO | Argo CD sync/drift material reviewed | [Argo CD — Core Concepts](https://argo-cd.readthedocs.io/en/stable/core_concepts/) | The desired/live-state model directly supports the learner's drift experiment. |
| Lab: Migrate Steward to OpenShift with Argo CD | NO VIDEO | — | — | Independent migration and authority-transfer evidence. |
| Orchestration and GitOps Review | NO VIDEO | — | — | Capability review. |

### Progressive Delivery

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| From Rolling Updates to Progressive Delivery | RECOMMENDED VIDEO | Argo Rollouts material reviewed | [Argo Rollouts — Concepts](https://argo-rollouts.readthedocs.io/en/stable/concepts/) | Shows why ordinary rolling replacement and evidence-driven progressive delivery are different controls. |
| Design Steward's Canary Contract | NO VIDEO | — | — | The learner must define risk, metrics, compatibility and abort criteria. |
| Implement Argo Rollouts Canary Delivery | RECOMMENDED VIDEO | Argo Rollouts canary material reviewed | [Argo Rollouts — Canary](https://argo-rollouts.readthedocs.io/en/stable/features/canary/) | Staged traffic/replica progression is strongly visual. |
| Automate Analysis and Abort a Bad Canary | RECOMMENDED VIDEO | Analysis-run material reviewed | [Argo Rollouts — Analysis](https://argo-rollouts.readthedocs.io/en/stable/features/analysis/) | Makes metric-driven promotion/abort control explicit. |
| Break the Progressive Delivery Control Plane | NO VIDEO | — | — | Failure injection is the lesson. |
| Reassess Progressive Delivery | NO VIDEO | — | — | Architecture/operational reassessment. |

### Cloud Engineer Milestone

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Milestone Brief: Steward Internet Environment | NO VIDEO | — | — | Defines the independent cloud synthesis target. |
| Milestone Review and Exit Criteria | NO VIDEO | — | — | The learner must defend public reachability, TLS, IaC, recovery, cost and operational boundaries from evidence. |


## Quality Steward — complete school multimedia audit

This audit follows every live Quality Steward deep path, including the browser-surface and performance-tool decision gates, reusable internal test infrastructure, continuous/scheduled execution and the complete Steward Quality Platform milestone.

### Quality Engineering

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Quality vs Testing | RECOMMENDED VIDEO | Modern quality-engineering material reviewed | [Google — Software Engineering at Google: Testing Overview](https://abseil.io/resources/swe-book/html/ch11.html) — use the test-size/scope models as visual support | Establishes testing as one engineering mechanism inside a broader quality system rather than equating quality with test execution. |
| Quality Risks | RECOMMENDED VIDEO | Risk-based testing material reviewed | [ISTQB CTFL syllabus](https://www.istqb.org/certifications/certified-tester-foundation-level) — use risk-based testing diagrams/tables | Gives a standardized risk vocabulary while TSA applies it to Steward consequences and evidence. |
| Test Strategy | RECOMMENDED VIDEO | Test strategy material reviewed | [Google Testing Blog](https://testing.googleblog.com/) plus TSA-authored strategy model; no single video promoted | The strategy must emerge from product risk, delivery architecture and evidence needs rather than a generic template. |
| Test Levels and Test Types | RECOMMENDED VIDEO | Test-level/type explainers reviewed | Reuse ISTQB CTFL visual models | Standard taxonomy is useful once; TSA emphasizes selecting the smallest useful boundary. |
| Risk-based Testing | RECOMMENDED VIDEO | Risk-based testing material reviewed | Reuse ISTQB CTFL risk material | Direct continuation of the quality-risk model. |
| Shift-left and Shift-right | RECOMMENDED VIDEO | Shift-left/right material reviewed | [DORA — Capabilities](https://dora.dev/capabilities/) — use continuous testing/delivery context | Connects earlier feedback and production evidence to delivery performance without reducing the concept to a slogan. |
| Testability | RECOMMENDED VIDEO | Testability material reviewed | No candidate promoted | The learner should identify controllability/observability constraints in Steward itself. |
| Defect Evidence and Communication | NO VIDEO | — | — | Quality of evidence is learned by producing reproducible defect reports from observed behavior. |
| Lab: Write the Steward Quality Strategy | NO VIDEO | — | — | Independent strategy/risk/evidence synthesis. |

### Test Analysis and Design

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Requirements Analysis for Testing | NO VIDEO | — | — | Learner must interrogate actual Steward requirements and derive test conditions. |
| Equivalence Partitioning | RECOMMENDED VIDEO | Formal test-design technique material reviewed | [ISTQB CTFL syllabus](https://www.istqb.org/certifications/certified-tester-foundation-level) — use worked equivalence-partition examples | The partition model is visual and standardized; Steward examples provide transfer. |
| Boundary Value Analysis | RECOMMENDED VIDEO | Boundary-analysis material reviewed | Reuse ISTQB CTFL worked examples | Closely coupled to equivalence partitions; one authoritative source is enough. |
| Decision Tables | RECOMMENDED VIDEO | Decision-table testing material reviewed | [ISTQB Glossary — Decision Table Testing](https://glossary.istqb.org/en_US/term/decision-table-testing) plus CTFL examples | Conditions/actions and rule combinations benefit from a tabular visual model. |
| State Transition Testing | RECOMMENDED VIDEO | State-transition testing material reviewed | Reuse ISTQB CTFL state diagrams | State/event/invalid-transition reasoning is strongly visual. |
| Pairwise and Combinatorial Concepts | RECOMMENDED VIDEO | Pairwise material reviewed | [Microsoft PICT](https://github.com/microsoft/pict) — use model/output examples | Demonstrates combinatorial reduction concretely while preserving the warning that pairwise is a heuristic. |
| Exploratory Testing | RECOMMENDED VIDEO | James Bach/DevelopSense exploratory material reviewed | [DevelopSense — Exploratory Testing](https://developsense.com/blog/category/exploratory-testing/) | Practitioner material reinforces chartered learning, observation and adaptation rather than unscripted clicking. |
| Negative Testing | NO VIDEO | — | — | Learner deliberately derives invalid actions and invariant violations from Steward. |
| Traceability | NO VIDEO | — | — | Traceability must connect the learner's risks, requirements, tests and evidence. |
| Lab: Design Risk-based Steward Test Coverage | NO VIDEO | — | — | Independent formal-technique + exploration synthesis. |

### Unit and Component Testing

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Designing Unit Tests | RECOMMENDED VIDEO | Google unit-testing guidance reviewed | [Software Engineering at Google — Unit Testing](https://abseil.io/resources/swe-book/html/ch12.html) — use test structure/behavior examples | Strong engineering treatment of unit-test value and maintainability rather than framework syntax. |
| Isolation | RECOMMENDED VIDEO | Isolation/test-double material reviewed | Reuse Google unit-testing guidance | Keeps isolation tied to behavior and feedback rather than maximizing mocks. |
| Test Doubles | RECOMMENDED VIDEO | Test-double taxonomy reviewed | [Martin Fowler — Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) | Canonical visual/conceptual distinction between state verification and behavior verification. |
| Mocks, Stubs and Fakes | RECOMMENDED VIDEO | Mock/stub/fake material reviewed | Reuse Fowler test-double material | Avoids redundant taxonomy resources. |
| Coverage and Its Limitations | RECOMMENDED VIDEO | Coverage guidance reviewed | [Google Testing Blog — Code Coverage Best Practices](https://testing.googleblog.com/2020/08/code-coverage-best-practices.html) | Reinforces coverage as feedback rather than a proxy for correctness. |
| Component Boundaries | RECOMMENDED VIDEO | Component-test material reviewed | No candidate promoted | Boundary choice is architecture-specific and should be defended against Steward. |
| Fast Feedback and Maintainability | NO VIDEO | — | — | Learner measures and reviews the actual test portfolio. |
| Lab: Strengthen Steward Component Tests | NO VIDEO | — | — | Independent implementation evidence. |

### API, Integration and Contract Testing

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| API Test Design | RECOMMENDED VIDEO | Playwright API testing material reviewed | [Playwright Python — API testing](https://playwright.dev/python/docs/api-testing) — use request/context examples | Maps protocol-level automation to the same framework used later without replacing domain-oriented assertions. |
| Authentication and Authorization Testing | RECOMMENDED VIDEO | OWASP authorization testing material reviewed | [OWASP WSTG — Authorization Testing](https://owasp.org/www-project-web-security-testing-guide/) | Provides systematic negative/role-boundary thinking; Security Steward later deepens attack-oriented testing. |
| Schema and Contract Validation | RECOMMENDED VIDEO | Contract/schema material reviewed | [Pact — What is Contract Testing?](https://docs.pact.io/) | The consumer/provider contract model is highly visual and distinguishes compatibility from broad integration testing. |
| Database Assertions | OPTIONAL VIDEO | DB assertion material reviewed | No candidate promoted | Steward's real transaction/persistence boundary is the better teacher. |
| Integration Boundaries | RECOMMENDED VIDEO | Integration-test boundary material reviewed | No candidate promoted | The learner must name actual Steward boundaries rather than copy a test pyramid mechanically. |
| Contract Testing Concepts | RECOMMENDED VIDEO | Pact contract-testing material reviewed | Reuse Pact documentation/diagrams | One coherent contract model is sufficient. |
| Mocking and Service Virtualization | RECOMMENDED VIDEO | Mock/service virtualization material reviewed | Reuse Fowler test-double model plus Pact provider-state concepts | Reinforces controlled simulation without pretending virtualized dependencies prove full integration. |
| Internal Package Compatibility | NO VIDEO | — | — | Compatibility is tested against the real consumed internal package. |
| Data Setup and Cleanup | NO VIDEO | — | — | State ownership and deterministic cleanup are implemented directly. |
| Lab: Test Steward API End-to-End at the Service Layer | NO VIDEO | — | — | Independent API/persistence/auth/contract evidence. |

### Automation Framework Engineering

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| What Makes an Automation Framework | RECOMMENDED VIDEO | Framework-architecture material reviewed | No candidate promoted | TSA's framework requirements and later refactoring provide a stronger architecture exercise than a vendor tutorial. |
| Framework Architecture | RECOMMENDED VIDEO | pytest/Playwright architecture material reviewed | No candidate promoted | Learner must derive boundaries from Steward's tests and reusable infrastructure. |
| Playwright with Python | RECOMMENDED VIDEO | Official Playwright material reviewed | [Playwright — Getting Started](https://playwright.dev/python/docs/intro) and [Playwright YouTube](https://www.youtube.com/@Playwrightdev) | First-party material establishes locator, browser/context/page and debugging concepts. |
| pytest Fundamentals | RECOMMENDED VIDEO | pytest material reviewed | [pytest — Get Started](https://docs.pytest.org/en/stable/getting-started.html) | Current first-party examples are preferable to a long framework course. |
| Configuration | NO VIDEO | — | — | Framework configuration is designed and versioned directly. |
| Fixtures | RECOMMENDED VIDEO | pytest fixture material reviewed | [pytest — Fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html) — use dependency/lifetime examples | Fixture dependency and scope are non-obvious and benefit from canonical diagrams/examples. |
| Test Data | NO VIDEO | — | — | Data ownership is a framework/domain design exercise. |
| API Clients | NO VIDEO | — | — | Learner builds a narrow client around the actual Steward contract. |
| Page Objects and UI Abstractions | RECOMMENDED VIDEO | Playwright page-object material reviewed | [Playwright — Page Object Models](https://playwright.dev/python/docs/pom) | First-party pattern guidance supports abstraction without mandating a page object for every screen. |
| Helpers and Utilities | NO VIDEO | — | — | Refactoring/reuse decision. |
| Assertions | RECOMMENDED VIDEO | Playwright/pytest assertion material reviewed | [Playwright — Assertions](https://playwright.dev/python/docs/test-assertions) | Auto-retrying web assertions are materially different from immediate Python assertions. |
| Markers and Tags | OPTIONAL VIDEO | pytest marker material reviewed | [pytest — Marking test functions](https://docs.pytest.org/en/stable/how-to/mark.html) | Reference examples are sufficient. |
| Parameterization | RECOMMENDED VIDEO | pytest parameterization material reviewed | [pytest — Parametrize](https://docs.pytest.org/en/stable/how-to/parametrize.html) | Canonical examples show data variation without duplicated tests. |
| Automation Logging | NO VIDEO | — | — | Logging must be designed around failure diagnosis. |
| Reports | OPTIONAL VIDEO | pytest/CI reporting material reviewed | No candidate promoted | Pipeline consumption determines the useful report format. |
| Screenshots, Traces and Video | RECOMMENDED VIDEO | Playwright trace/debug material reviewed | [Playwright — Trace Viewer](https://playwright.dev/python/docs/trace-viewer) | Trace Viewer is inherently visual and provides high diagnostic value. |
| Parallel Execution | RECOMMENDED VIDEO | pytest-xdist/parallel material reviewed | [pytest-xdist documentation](https://pytest-xdist.readthedocs.io/) | Makes worker distribution explicit; learner must still prove isolation. |
| Retries and Flaky-test Risk | RECOMMENDED VIDEO | Playwright retry/flakiness material reviewed | [Playwright — Test retries](https://playwright.dev/docs/test-retries) as conceptual support | Reinforces that retries classify/contain instability rather than fixing nondeterminism. |
| Framework Maintainability | NO VIDEO | — | — | Maintainability is evaluated through change/refactoring evidence. |
| Reusable Testing Infrastructure vs Domain Test Code | RECOMMENDED VIDEO | Python package/plugin architecture material reviewed | [pytest — Writing plugins](https://docs.pytest.org/en/stable/how-to/writing_plugins.html) | Gives the extension boundary needed for shared infrastructure without leaking Steward domain logic. |
| Designing Public APIs for Test Libraries | NO VIDEO | — | — | API design is exercised through the actual reusable package. |
| Reusable pytest Fixtures and Plugins | RECOMMENDED VIDEO | pytest plugin material reviewed | Reuse pytest plugin documentation | Direct continuation of the shared-infrastructure boundary. |
| Versioning Shared Test Infrastructure | NO VIDEO | — | — | Apply existing SemVer/release-engineering discipline. |
| Lab: Build the Steward Automation Framework | NO VIDEO | — | — | Independent framework construction evidence. |
| Lab: Extract tsa-test-core | NO VIDEO | — | — | Refactoring/reuse boundary is the assessment. |
| Lab: Publish and Consume tsa-test-core | NO VIDEO | — | — | Real package publication/consumption evidence. |
| Automation Framework Engineering Review | NO VIDEO | — | — | Capability review. |

### Browser and Environment Testing

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Decision Gate: Does Steward Need Browser Testing? | NO VIDEO | — | — | Browser automation must be justified by an actual user-facing browser surface. |
| Browser Differences | RECOMMENDED VIDEO | Browser engine/cross-browser material reviewed | [Playwright — Browsers](https://playwright.dev/python/docs/browsers) | Maps Chromium/Firefox/WebKit to execution and configuration directly. |
| Responsive Testing | RECOMMENDED VIDEO | Responsive-design/testing material reviewed | [MDN — Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | Establishes layout-state concepts before testing behavior at representative viewports. |
| Cross-browser Testing | RECOMMENDED VIDEO | Cross-browser strategy material reviewed | [BrowserStack — Cross Browser Testing](https://www.browserstack.com/cross-browser-testing) — use browser/device matrix visuals | Makes environment diversity concrete; TSA still requires risk-based selection. |
| BrowserStack or Equivalent | OPTIONAL VIDEO | BrowserStack platform material reviewed | No separate candidate promoted | Provider UI walkthroughs age quickly; the execution contract matters more. |
| Local vs Remote Execution | RECOMMENDED VIDEO | Playwright/remote grid material reviewed | No candidate promoted | Learner compares the same claim across actual local and remote environments. |
| Environment Parity and Configuration Risk | NO VIDEO | — | — | Configuration drift is diagnosed from real environment evidence. |
| Lab: Run Steward Tests Across Environments | NO VIDEO | — | — | Independent cross-environment evidence. |

### Non-functional Quality

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Decision Gate: Select the Steward Performance Tool | NO VIDEO | — | — | Tool selection must be defended from protocol, workload, scripting and CI requirements. |
| Performance Testing | RECOMMENDED VIDEO | k6 performance material reviewed | [Grafana k6 — Documentation](https://grafana.com/docs/k6/latest/) and getting-started examples | Current first-party workload/metric model supports the learner's chosen baseline. |
| Load, Stress, Spike and Endurance | RECOMMENDED VIDEO | Performance-test type material reviewed | [Grafana k6 — Test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/) | The workload-shape diagrams make the distinctions concrete. |
| Accessibility Fundamentals | RECOMMENDED VIDEO | W3C accessibility material reviewed | [W3C — Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/) | Authoritative user/barrier model before automated accessibility checks. |
| Compatibility Testing | RECOMMENDED VIDEO | MDN compatibility material reviewed | [MDN — Browser compatibility data](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables) | Connects compatibility claims to explicit platform support evidence. |
| Reliability-oriented Testing | RECOMMENDED VIDEO | reliability-test material reviewed | No candidate promoted | Reliability Engineer later owns deep failure engineering; here tests should emerge from known quality risks. |
| Data Integrity and Concurrency Testing | RECOMMENDED VIDEO | PostgreSQL isolation/concurrency material reviewed | [PostgreSQL — Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) | Isolation phenomena are subtle and need authoritative transaction semantics before concurrent test design. |
| Lab: Establish Steward Non-functional Baselines | NO VIDEO | — | — | Baselines must be measured against the actual service. |

### Quality in Containers and CI/CD

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Test Containers and Environments | RECOMMENDED VIDEO | Dockerized testing material reviewed | Reuse Delivery Engineer Docker resources | Quality Steward applies existing container knowledge to deterministic test dependencies. |
| Dockerized Test Dependencies | RECOMMENDED VIDEO | Container dependency material reviewed | Reuse Docker Compose resource | No need to reteach Compose. |
| Ephemeral Environment Concepts | RECOMMENDED VIDEO | Ephemeral CI environment material reviewed | No candidate promoted | The learner's pipeline should prove create→test→destroy lifecycle directly. |
| Test Pipeline Stages | RECOMMENDED VIDEO | Jenkins pipeline material reviewed | Reuse Delivery Engineer Jenkins Pipeline media | Existing execution model is sufficient. |
| Parallelization | RECOMMENDED VIDEO | pytest-xdist/CI parallel material reviewed | Reuse pytest-xdist documentation | Connects framework worker isolation to pipeline execution. |
| Reports and Artifacts | OPTIONAL VIDEO | CI reporting material reviewed | No candidate promoted | Diagnostic usefulness is judged from failed pipeline evidence. |
| Quality Gates | NO VIDEO | — | — | Gate policy must be risk/evidence based. |
| Test Selection | RECOMMENDED VIDEO | pytest marker/selection material reviewed | Reuse pytest marker documentation | Existing selection primitives are enough. |
| Failure Triage | NO VIDEO | — | — | Learner must diagnose real failed CI evidence. |
| Flaky-test Containment | RECOMMENDED VIDEO | retry/flakiness material reviewed | Reuse Playwright retry guidance | Reinforces containment/classification rather than hiding failures. |
| Internal Test Package Publishing and Compatibility in CI | NO VIDEO | — | — | Real tsa-test-core producer/consumer compatibility is the evidence. |
| Lab: Build the Steward Quality Pipeline | NO VIDEO | — | — | Independent pipeline/gate/diagnostic evidence. |

### Continuous and Scheduled Quality Execution

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Continuous and Scheduled Quality Execution | RECOMMENDED VIDEO | Jenkins trigger/schedule material reviewed | [Jenkins — Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#triggers) | First-party trigger semantics support SCM-driven and scheduled execution without another broad Jenkins course. |
| Design Triggered Quality Feedback | NO VIDEO | — | — | Trigger policy is a feedback-speed/cost/risk decision. |
| Implement SCM-triggered Automated Testing | NO VIDEO | — | — | Real pipeline implementation evidence. |
| Implement Jenkins CRON Regression | RECOMMENDED VIDEO | Jenkins cron syntax material reviewed | Reuse Jenkins trigger documentation | Exact syntax/reference is more useful than a walkthrough. |
| Implement Failure Alerts and Reports | NO VIDEO | — | — | Learner must prove actionable failure delivery without notification noise. |
| Defend the Quality Execution Policy | NO VIDEO | — | — | Policy defense based on actual pipeline behavior. |

### Quality Steward Milestone

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Quality Steward Milestone Readiness | NO VIDEO | — | — | Evidence audit before final integration. |
| Integrate the Quality Steward System | NO VIDEO | — | — | Cross-module integration is the assessment. |
| Audit the Existing Evidence | NO VIDEO | — | — | Learner must identify evidence gaps independently. |
| Milestone: Steward Quality Platform | NO VIDEO | — | — | Independent synthesis target. |
| Finalize the Steward Quality Strategy | NO VIDEO | — | — | Strategy must reflect the implemented system. |
| Prove the Automated Quality Portfolio | NO VIDEO | — | — | Real test evidence. |
| Prove the Quality Pipeline | NO VIDEO | — | — | Real pipeline/gate evidence. |
| Quality Steward Final Review | NO VIDEO | — | — | Final capability defense. |


## Security Steward — complete school multimedia audit

This audit follows every live Security Steward deep path. It includes foundations, threat modeling, host/network hardening, identity and secrets, Keycloak/LDAP federation, Vault dynamic secrets, internal PKI and mTLS, web/API security, an isolated vulnerability laboratory, application hardening, software-supply-chain controls, artifact signing, secure file-transfer migration and the final security milestone. Offensive material is used only to understand and safely reproduce weaknesses in authorized training environments.

### Security Foundations and Threat Modeling

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Confidentiality, Integrity and Availability | RECOMMENDED VIDEO | Security-foundation material reviewed | [NIST CSF 2.0](https://www.nist.gov/cyberframework) plus framework diagrams | Establishes security outcomes in a recognized risk-management context without reducing security to tool use. |
| Assets, Threats, Vulnerabilities and Risk | RECOMMENDED VIDEO | OWASP risk material reviewed | [OWASP Risk Rating Methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology) | Gives a concrete likelihood/impact model before the Steward risk register. |
| Attack Surface | RECOMMENDED VIDEO | Attack-surface/threat-model material reviewed | [OWASP Threat Modeling](https://owasp.org/www-community/Threat_Modeling) | Connects entry points, assets, flows and trust boundaries visually. |
| Least Privilege | RECOMMENDED VIDEO | Zero-trust/least-privilege material reviewed | [CISA Zero Trust Maturity Model](https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model) | Places least privilege in identity/device/network/application/data control planes. |
| Defense in Depth | RECOMMENDED VIDEO | Layered-control material reviewed | Reuse NIST/CISA framework diagrams | One control-framework model is enough; Steward must map actual preventive/detective/corrective layers. |
| Trust Boundaries | RECOMMENDED VIDEO | Threat-model boundary material reviewed | Reuse OWASP Threat Modeling | Direct precursor to data-flow modeling. |
| Security Controls: Preventive, Detective and Corrective | RECOMMENDED VIDEO | Control taxonomy material reviewed | Reuse NIST CSF | Framework functions make control purpose visible without a vendor-specific product tour. |
| Risk Treatment and Residual Risk | NO VIDEO | — | — | Learner must decide accept/mitigate/transfer/avoid from actual Steward risk. |
| Lab: Map Steward Security Assets and Attack Surface | NO VIDEO | — | — | Independent inventory, boundary and risk-register evidence. |
| Assets and Actors | NO VIDEO | — | — | Must be derived from the real Steward system. |
| Data and Control Flows | RECOMMENDED VIDEO | DFD/threat-model material reviewed | [Microsoft Threat Modeling Tool overview](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) — use DFD/trust-boundary examples | Makes actors/processes/data stores/flows and boundaries concrete before modeling Steward. |
| Threat Identification | RECOMMENDED VIDEO | STRIDE material reviewed | [Microsoft — Threat Modeling Security Fundamentals](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) | Provides the STRIDE prompts as a systematic enumeration aid. |
| STRIDE-style Thinking | RECOMMENDED VIDEO | STRIDE material reviewed | Reuse Microsoft threat-model material | Avoids redundant threat-taxonomy media. |
| Abuse Cases | RECOMMENDED VIDEO | Abuse-case material reviewed | [OWASP — Abuse Case Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html) | Turns attacker goals into explicit negative requirements. |
| Threat Prioritization | RECOMMENDED VIDEO | Risk-prioritization material reviewed | Reuse OWASP Risk Rating | Connects threat discovery to likelihood/impact decisions. |
| Mitigations and Security Requirements | NO VIDEO | — | — | Controls must trace to Steward threats and acceptance criteria. |
| Threat Models as Living Engineering Artifacts | NO VIDEO | — | — | Learner proves update/review behavior across later changes. |
| Lab: Threat-model Steward API | NO VIDEO | — | — | Independent model/threat/mitigation evidence. |

### Linux and Network Security

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Users, Groups and Permissions | OPTIONAL VIDEO | Linux hardening material reviewed | Reuse Platform Builder Linux administration resources | Security Steward applies known primitives to least privilege rather than relearning commands. |
| Privilege and sudo | RECOMMENDED VIDEO | sudo/privilege material reviewed | [Red Hat — Managing sudo access](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/managing-sudo-access_configuring-basic-system-settings) | First-party operational guidance supports explicit privilege delegation. |
| SSH Hardening | RECOMMENDED VIDEO | OpenSSH/host-hardening material reviewed | [Red Hat — OpenSSH security](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/securing_networks/using-secure-communications-between-two-systems-with-openssh_securing-networks) | Current first-party guidance is safer than copying an arbitrary hardening checklist. |
| Host Firewalls | OPTIONAL VIDEO | firewall material reviewed | Reuse Platform Builder firewall resources | The new objective is exposure reduction and verification. |
| Service Exposure | NO VIDEO | — | — | Learner inventories listening services and closes unnecessary exposure. |
| Patching and Vulnerability Windows | RECOMMENDED VIDEO | vulnerability/patch lifecycle material reviewed | [CISA — Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | Grounds patch urgency in known exploitation rather than CVSS alone. |
| File and Secret Permissions | NO VIDEO | — | — | Direct filesystem/secret audit evidence. |
| Security Logging and Auditing | RECOMMENDED VIDEO | Linux audit material reviewed | [Red Hat — Auditing the system](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/security_hardening/auditing-the-system_security-hardening) | First-party auditd model supports traceable security events. |
| Network Segmentation Concepts | RECOMMENDED VIDEO | segmentation/zero-trust material reviewed | Reuse CISA Zero Trust model | Connects segmentation to explicit trust boundaries rather than VLANs for their own sake. |
| Administrative Network Boundaries | NO VIDEO | — | — | Must be defended from the actual homelab/public topology. |
| TLS Configuration and Certificate Hygiene | RECOMMENDED VIDEO | TLS configuration material reviewed | [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/) | Current configuration generator ties protocol/cipher choices to server/software compatibility. |
| Lab: Harden the Steward Hosts and Network Path | NO VIDEO | — | — | Independent baseline→hardening→retest evidence. |

### Identity, Federation and Secrets

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Identity Planes and Trust Boundaries | RECOMMENDED VIDEO | IAM/OIDC material reviewed | [OAuth 2.0 and OpenID Connect — OpenID Foundation](https://openid.net/developers/how-connect-works/) — use authorization/authentication flow diagrams | Establishes actors/tokens/trust relationships before Keycloak configuration. |
| OAuth 2.0 and OpenID Connect Mental Model | RECOMMENDED VIDEO | OIDC material reviewed | Reuse OpenID Foundation flow diagrams | Canonical protocol model is preferable to vendor-specific shortcuts. |
| Keycloak Realms, Clients, Users and Roles | RECOMMENDED VIDEO | Keycloak material reviewed | [Keycloak — Server Administration Guide](https://www.keycloak.org/docs/latest/server_admin/) | Current first-party model supports realms/clients/roles and identity ownership. |
| Machine and Workload Identity | RECOMMENDED VIDEO | workload identity material reviewed | No candidate promoted | Internal PKI later provides the concrete machine-identity implementation. |
| Secret Lifecycle: Create, Distribute, Rotate, Revoke | RECOMMENDED VIDEO | secrets lifecycle material reviewed | [HashiCorp Vault — What is Vault?](https://developer.hashicorp.com/vault/docs/what-is-vault) | Introduces secret lifecycle, leases and centralized policy before implementation. |
| Vault Concepts and Dynamic Secrets | RECOMMENDED VIDEO | Vault dynamic-secret material reviewed | [HashiCorp Vault — Database secrets engine](https://developer.hashicorp.com/vault/docs/secrets/databases) | Dynamic credential lease/revocation is central and non-obvious. |
| Kong, Identity and API Policy | OPTIONAL VIDEO | gateway identity-policy material reviewed | No candidate promoted | Gateway choice/configuration should follow the actual Steward deployment boundary. |
| Identity and Secrets Security Review | NO VIDEO | — | — | Architecture review. |
| Lab: Integrate Keycloak and Harden Steward Identity | NO VIDEO | — | — | Independent identity/secret evidence. |
| Directory Federation Architecture | RECOMMENDED VIDEO | LDAP federation material reviewed | [Keycloak — LDAP and Active Directory](https://www.keycloak.org/docs/latest/server_admin/#_ldap) | First-party federation model maps directory identity into Keycloak without pretending the systems share ownership. |
| Keycloak LDAP Federation | RECOMMENDED VIDEO | Keycloak LDAP material reviewed | Reuse Keycloak LDAP documentation | Direct implementation reference. |
| Federated Identity Lifecycle and Failure Modes | NO VIDEO | — | — | Learner must test disable/delete/outage/stale-membership behavior. |
| Active Directory, LDAP and Kerberos Context | RECOMMENDED VIDEO | directory/Kerberos context reviewed | Reuse Platform Builder AD/LDAP resources | Security Steward extends the existing directory model into federation. |
| Vault and Dynamic Secrets for Steward | RECOMMENDED VIDEO | Vault database-secret material reviewed | Reuse Vault database secrets engine | Establishes leased database credentials before hands-on implementation. |
| From Static Secrets to Leased Credentials | RECOMMENDED VIDEO | Vault lease material reviewed | [HashiCorp Vault — Lease, renew and revoke](https://developer.hashicorp.com/vault/docs/concepts/lease) | Lease lifecycle is the key conceptual shift. |
| Deploy and Initialize Vault Safely | RECOMMENDED VIDEO | Vault deployment/init material reviewed | [HashiCorp Vault — Production hardening](https://developer.hashicorp.com/vault/docs/concepts/production-hardening) | Emphasizes operational security boundaries rather than a dev-mode walkthrough. |
| Issue Dynamic PostgreSQL Credentials | RECOMMENDED VIDEO | Vault PostgreSQL engine material reviewed | Reuse Vault database secrets engine | Direct first-party configuration model. |
| Break Vault and Rotate Trust | NO VIDEO | — | — | Controlled failure/recovery exercise. |
| Reassess the Secrets Platform | NO VIDEO | — | — | Architecture/ownership reassessment. |

### Internal PKI and Machine Trust

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Model Internal PKI and Machine Trust | RECOMMENDED VIDEO | PKI/X.509 material reviewed | [Cloudflare — What is PKI?](https://www.cloudflare.com/learning/ssl/what-is-pki/) — use CA/trust-chain diagrams | Gives the hierarchy/trust-anchor mental model before building a CA. |
| Build a Root and Issuing CA Hierarchy | RECOMMENDED VIDEO | CA hierarchy material reviewed | [Smallstep — PKI](https://smallstep.com/blog/everything-pki/) — use root/intermediate/leaf diagrams | Visually separates offline trust anchor from issuing authority and workload certificates. |
| Issue Workload Certificates with Explicit Identity | RECOMMENDED VIDEO | X.509 identity material reviewed | [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280) plus Smallstep diagrams | Grounds certificate identity in SAN/subject/usage semantics rather than filenames. |
| Distribute Trust without Disabling Verification | NO VIDEO | — | — | Cross-platform trust-store work must be proven directly. |
| Implement Mutual TLS between Workloads | RECOMMENDED VIDEO | mTLS explainers reviewed | [Cloudflare — What is mutual TLS?](https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/) | Client/server certificate exchange and mutual authentication are highly visual. |
| Rotate Certificates without Changing Identity Semantics | NO VIDEO | — | — | Rotation drill is the learning evidence. |
| Revocation and Compromised Identity Response | RECOMMENDED VIDEO | certificate revocation material reviewed | [Cloudflare — How certificate revocation works](https://www.cloudflare.com/learning/ssl/what-happens-when-an-ssl-certificate-is-revoked/) | CRL/OCSP and trust-removal concepts support the compromised-identity drill. |
| Trust-Anchor Rotation and Failure Recovery | NO VIDEO | — | — | Intermediate/root transition must be exercised safely. |
| Reassess PKI Ownership with Vault | NO VIDEO | — | — | ADR/ownership decision after operating both models. |
| Milestone: Operate Steward Internal Machine Trust | NO VIDEO | — | — | Independent trust-platform synthesis. |

### Web and API Threats

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Injection and SQL Injection | RECOMMENDED VIDEO | OWASP/PortSwigger training reviewed | [PortSwigger Web Security Academy — SQL injection](https://portswigger.net/web-security/sql-injection) — use only in authorized labs | Interactive training makes unsafe query construction and mitigations concrete. |
| Cross-site Scripting | RECOMMENDED VIDEO | PortSwigger XSS material reviewed | [PortSwigger — XSS](https://portswigger.net/web-security/cross-site-scripting) — authorized training labs only | Visual browser execution context is valuable for understanding stored/reflected/DOM XSS. |
| Cross-site Request Forgery | RECOMMENDED VIDEO | PortSwigger CSRF material reviewed | [PortSwigger — CSRF](https://portswigger.net/web-security/csrf) — authorized labs only | Request/authentication context benefits from interactive visualization. |
| Broken Authentication | RECOMMENDED VIDEO | OWASP authentication material reviewed | [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Defensive requirements are more durable than exploit-only demonstrations. |
| Broken Authorization and IDOR | RECOMMENDED VIDEO | OWASP API/PortSwigger access-control material reviewed | [PortSwigger — Access control](https://portswigger.net/web-security/access-control) — authorized labs only | Makes horizontal/vertical authorization failures concrete. |
| Server-side Request Forgery | RECOMMENDED VIDEO | PortSwigger SSRF material reviewed | [PortSwigger — SSRF](https://portswigger.net/web-security/ssrf) — authorized labs only | Request-path visualization clarifies why server-side network reachability matters. |
| Path Traversal | RECOMMENDED VIDEO | PortSwigger traversal material reviewed | [PortSwigger — Path traversal](https://portswigger.net/web-security/file-path-traversal) — authorized labs only | Clear controlled examples of filesystem-boundary failure. |
| File Upload Risks | RECOMMENDED VIDEO | OWASP upload material reviewed | [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | Defensive control layers map directly to Steward's upload surfaces. |
| Command Injection | RECOMMENDED VIDEO | PortSwigger command-injection material reviewed | [PortSwigger — OS command injection](https://portswigger.net/web-security/os-command-injection) — authorized labs only | Controlled labs demonstrate data crossing into command execution. |
| Insecure Deserialization Concepts | RECOMMENDED VIDEO | PortSwigger deserialization material reviewed | [PortSwigger — Insecure deserialization](https://portswigger.net/web-security/deserialization) — conceptual/lab use only | Shows the trust-boundary failure without requiring unsafe real-world targeting. |
| Security Misconfiguration | RECOMMENDED VIDEO | OWASP configuration material reviewed | [OWASP Top 10](https://owasp.org/www-project-top-ten/) | Broad category is best anchored to the current OWASP taxonomy and Steward findings. |
| Sensitive Data and Secrets | RECOMMENDED VIDEO | OWASP secrets material reviewed | Reuse Vault/secret-lifecycle resources | Avoids duplicate security instruction. |
| API Abuse and Rate Limiting | RECOMMENDED VIDEO | OWASP API security material reviewed | [OWASP API Security Top 10](https://owasp.org/API-Security/) | Grounds abuse/resource-consumption risks in API-specific taxonomy. |
| Token and Session Attacks | RECOMMENDED VIDEO | OWASP session material reviewed | [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | Defensive token/session lifecycle is the priority. |
| Cryptographic Failures | RECOMMENDED VIDEO | OWASP crypto material reviewed | [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) | Keeps focus on correct protection decisions rather than crypto implementation tricks. |
| Vulnerable Dependencies | RECOMMENDED VIDEO | dependency-risk material reviewed | [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/) plus supply-chain module | Connects component inventory to known-vulnerability evidence. |
| Security Logging and Monitoring Failures | RECOMMENDED VIDEO | OWASP logging material reviewed | [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Establishes security-event evidence requirements. |
| Mass Assignment and Excessive Data Exposure | RECOMMENDED VIDEO | OWASP API authorization/data-exposure material reviewed | Reuse OWASP API Security Top 10 | API-specific taxonomy directly supports negative tests. |
| Lab: Assess Steward Web and API Attack Paths | NO VIDEO | — | — | Threat-model-driven, authorized assessment with evidence and remediation. |

### Vulnerability Laboratory and Application Hardening

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Designing an Isolated Security Lab | RECOMMENDED VIDEO | OWASP training-lab material reviewed | [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — use its intentionally vulnerable training model | Establishes an explicit legal/safety boundary for attack reproduction. |
| Safe Lab Networking | NO VIDEO | — | — | Isolation must be designed against the learner's actual virtualization/network topology. |
| Vulnerable Applications and Intentional Weaknesses | RECOMMENDED VIDEO | OWASP Juice Shop material reviewed | Reuse OWASP Juice Shop | Purpose-built vulnerable targets are safer and more pedagogically useful than real systems. |
| Observing Vulnerable Behavior | RECOMMENDED VIDEO | PortSwigger Academy material reviewed | [PortSwigger Web Security Academy](https://portswigger.net/web-security) | Interactive labs teach observation/reproduction in an authorized environment. |
| Reproducing Representative Attacks Safely | RECOMMENDED VIDEO | PortSwigger/OWASP labs reviewed | Reuse PortSwigger Academy and Juice Shop | Keeps offensive practice bounded to training targets. |
| Using Proxies and Request Inspection | RECOMMENDED VIDEO | Burp Suite training material reviewed | [PortSwigger — Getting started with Burp Suite](https://portswigger.net/burp/documentation/desktop/getting-started) | First-party request interception/replay workflow supports evidence collection. |
| Capturing Security Evidence | NO VIDEO | — | — | Learner must produce reproducible requests/responses/logs/screenshots from the lab. |
| From Finding to Reproduction Steps | NO VIDEO | — | — | Finding quality is assessed from another engineer's ability to reproduce it. |
| Implementing Mitigations | NO VIDEO | — | — | Remediation is application-specific. |
| Retesting Fixes | NO VIDEO | — | — | Closure requires direct negative/positive evidence. |
| Writing Security Findings | NO VIDEO | — | — | Professional finding communication is the deliverable. |
| Lab: Reproduce and Fix Steward Vulnerabilities | NO VIDEO | — | — | Controlled Steward vulnerability/remediation evidence. |
| Secure Authentication | RECOMMENDED VIDEO | OWASP authentication controls reviewed | Reuse OWASP Authentication Cheat Sheet | Directly translates earlier threat knowledge into requirements. |
| Authorization Design and Testing | RECOMMENDED VIDEO | OWASP authorization material reviewed | [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Centralizes deny-by-default, least privilege and per-request authorization guidance. |
| Input Validation | RECOMMENDED VIDEO | OWASP validation material reviewed | [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | Defensive validation rules complement attack-path labs. |
| Secure Error Handling | RECOMMENDED VIDEO | OWASP error-handling material reviewed | [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) | Supports useful diagnostics without sensitive disclosure. |
| Secrets Management | RECOMMENDED VIDEO | OWASP/Vault material reviewed | Reuse Vault secret-lifecycle resources | Existing implementation depth is sufficient. |
| Security Headers and Configuration | RECOMMENDED VIDEO | OWASP header material reviewed | [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) | Concrete defensive configuration reference. |
| Security Logging | RECOMMENDED VIDEO | OWASP logging material reviewed | Reuse OWASP Logging Cheat Sheet | Avoids duplicate media. |
| Rate Limiting and Abuse Resistance | RECOMMENDED VIDEO | OWASP API material reviewed | Reuse OWASP API Security Top 10 | Connects controls to previously modeled abuse cases. |
| Data Protection | RECOMMENDED VIDEO | OWASP cryptographic storage material reviewed | Reuse OWASP Cryptographic Storage Cheat Sheet | Keeps data protection tied to explicit threat/retention needs. |
| Security-focused Code Review | RECOMMENDED VIDEO | OWASP code-review material reviewed | [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) | Provides a repeatable security review lens before reviewing Steward changes. |
| Abuse Cases and Negative Security Requirements | RECOMMENDED VIDEO | OWASP abuse-case material reviewed | Reuse OWASP Abuse Case Cheat Sheet | Maintains traceability from threat to negative requirement. |
| Security Regression Testing | NO VIDEO | — | — | Learner converts closed findings into durable automated evidence. |
| Lab: Harden Steward API | NO VIDEO | — | — | Independent requirements→controls→retest evidence. |

### Software Supply Chain and Artifact Trust

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Lab: Harden the Steward Software Supply Chain | NO VIDEO | — | — | Cross-stage trust mapping and controls are the assessment. |
| Map and Baseline the Trusted Delivery Path | RECOMMENDED VIDEO | SLSA/supply-chain material reviewed | [SLSA — Supply-chain Levels for Software Artifacts](https://slsa.dev/) — use threat/provenance diagrams | Gives a source→build→artifact trust model that connects Delivery Engineer evidence to security controls. |
| Implement High-value Supply-chain Controls | RECOMMENDED VIDEO | OWASP supply-chain/Sigstore material reviewed | [OWASP Software Supply Chain Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html) | Defensive control catalogue supports prioritization without prescribing every tool. |
| Define Gates, Exceptions and Residual Risk | NO VIDEO | — | — | Gate/exception policy is a risk decision. |
| Artifact Signing and Verification | RECOMMENDED VIDEO | Sigstore/Cosign material reviewed | [Sigstore — Cosign](https://docs.sigstore.dev/cosign/overview/) | Establishes signing and verification workflow against immutable artifact identity. |
| From Provenance Evidence to Enforced Trust | RECOMMENDED VIDEO | Sigstore policy material reviewed | [Sigstore — Policy Controller](https://docs.sigstore.dev/policy-controller/overview/) — conceptual reference | Shows the shift from recording evidence to enforcing admission/deployment policy. |
| Sign a Steward Release with Cosign | NO VIDEO | — | — | Real release signing evidence. |
| Enforce Verification Before Deployment | NO VIDEO | — | — | Real policy/gate evidence. |
| Break and Recover the Signing Trust Chain | NO VIDEO | — | — | Controlled trust failure/recovery exercise. |
| Defend Steward's Artifact Trust Policy | NO VIDEO | — | — | Policy defense. |

### Secure File Transfer Migration

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| FTP to SFTP Secure Transfer Migration | RECOMMENDED VIDEO | SFTP/FTP protocol material reviewed | Reuse Delivery/Platform SFTP-vs-FTPS protocol-boundary resource | Existing media already establishes that SFTP is a distinct SSH-based protocol. |
| From Legacy Compatibility to Secure Transfer | NO VIDEO | — | — | Migration contract and coexistence plan are the learning objective. |
| Build the SFTP Trust and Identity Boundary | RECOMMENDED VIDEO | OpenSSH key-auth material reviewed | [OpenSSH manuals](https://www.openssh.com/manual.html) | First-party SSH identity/authorization semantics support the secure boundary. |
| Prove File-contract Parity over SFTP | NO VIDEO | — | — | Actual producer/consumer file-contract evidence. |
| Run Bounded FTP and SFTP Coexistence | NO VIDEO | — | — | Time-bounded migration exercise. |
| Decommission FTP and Prove the Security End State | NO VIDEO | — | — | Removal/exposure evidence is the assessment. |
| Defend the Secure Transfer Migration | NO VIDEO | — | — | Architecture and residual-risk defense. |

### Security Steward Milestone

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Milestone Briefing: Build a Defensible Steward Security Posture | NO VIDEO | — | — | Defines the independent security synthesis target. |
| Integrate the Security Steward Evidence | NO VIDEO | — | — | Cross-module evidence integration. |
| Evidence Readiness Check | NO VIDEO | — | — | Learner audits gaps independently. |
| Milestone: Steward Security Assessment and Hardening | NO VIDEO | — | — | Independent assessment/hardening target. |
| Rebaseline Threats, Assets and Trust Boundaries | NO VIDEO | — | — | Must reflect the final implemented system. |
| Verify Controls Across the Steward Stack | NO VIDEO | — | — | Real control evidence. |
| Close High-priority Gaps and Retest | NO VIDEO | — | — | Remediation and regression evidence. |
| Publish the Steward Security Assessment | NO VIDEO | — | — | Professional assessment artifact. |
| Defend the Security Posture | NO VIDEO | — | — | Final capability/risk defense. |


## Reliability Engineer — complete school multimedia audit

This audit follows every live Reliability Engineer deep path, including observability architecture, Graylog selection and integration, Prometheus/Grafana, Alertmanager, OpenTelemetry/Tempo tracing, SLO engineering, production logging, database stewardship, performance/capacity, resilience patterns, incident management, controlled fault injection, disaster recovery and the final Steward Reliability Program.

### SRE Foundations and Service Levels

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Reliability as a Quality Attribute | RECOMMENDED VIDEO | Google/AWS reliability material reviewed | [Google SRE — Introduction](https://sre.google/sre-book/introduction/) | Establishes reliability as an engineering property tied to user experience and operations. |
| Availability | RECOMMENDED VIDEO | SRE availability material reviewed | [Google SRE — Embracing Risk](https://sre.google/sre-book/embracing-risk/) | Connects availability targets to risk and trade-offs instead of treating 100% as the goal. |
| Failure and Recovery | RECOMMENDED VIDEO | AWS reliability material reviewed | [AWS Well-Architected — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) | Strong failure/recovery design framing. |
| SRE Principles | RECOMMENDED VIDEO | Google SRE material reviewed | [Google — Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) | Canonical SRE operating model. |
| Toil | RECOMMENDED VIDEO | Google SRE toil material reviewed | [Google SRE — Eliminating Toil](https://sre.google/sre-book/eliminating-toil/) | Gives a precise operational definition and why automation alone is not the objective. |
| Reliability and Risk Trade-offs | RECOMMENDED VIDEO | risk/error-budget material reviewed | Reuse Google SRE Embracing Risk | Keeps trade-offs connected to measurable reliability. |
| Reliability Ownership | NO VIDEO | — | — | Ownership must be mapped to the actual Steward operating model. |
| Lab: Build the Steward Reliability Risk Map | NO VIDEO | — | — | Independent capability/failure/recovery analysis. |
| SLIs | RECOMMENDED VIDEO | Google SLO material reviewed | [Google SRE Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/) | Canonical user-centric indicator selection and examples. |
| SLOs | RECOMMENDED VIDEO | Google SLO material reviewed | Reuse Implementing SLOs | One coherent model from indicator to target. |
| SLAs | RECOMMENDED VIDEO | SLI/SLO/SLA material reviewed | [Google SRE — Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | Distinguishes engineering objectives from external agreements. |
| Error Budgets | RECOMMENDED VIDEO | error-budget material reviewed | [Google SRE Workbook — Error Budget Policy](https://sre.google/workbook/error-budget-policy/) | Directly links reliability consumption to release/operational decisions. |
| User-visible Reliability | NO VIDEO | — | — | Learner must choose indicators from actual Steward user outcomes. |
| Choosing Good Indicators | RECOMMENDED VIDEO | SLI selection material reviewed | Reuse Google SLO workbook | Authoritative examples are sufficient. |
| Windowing and Measurement Concepts | RECOMMENDED VIDEO | SLO window material reviewed | Reuse Google SLO workbook | Measurement windows are best understood in the same SLO model. |
| Reliability Targets and Trade-offs | NO VIDEO | — | — | Target selection is a product/risk decision. |
| Error Budgets and Release Decisions | RECOMMENDED VIDEO | error-budget policy material reviewed | Reuse Google Error Budget Policy | Makes the reliability/release control loop explicit. |
| Lab: Define Steward SLOs | NO VIDEO | — | — | Independent SLI/SLO/budget policy evidence. |

### Observability Architecture and Production Logging

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Observability vs Monitoring | RECOMMENDED VIDEO | OpenTelemetry/Grafana material reviewed | [OpenTelemetry — Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) | Frames observability around understanding internal state from telemetry rather than merely watching known thresholds. |
| Logs, Metrics and Traces | RECOMMENDED VIDEO | telemetry signal material reviewed | [OpenTelemetry — Signals](https://opentelemetry.io/docs/concepts/signals/) | One canonical model for the three signal families and their roles. |
| Telemetry Design | NO VIDEO | — | — | Signals must answer Steward reliability questions rather than mirror a generic dashboard. |
| Correlation and Context | RECOMMENDED VIDEO | OpenTelemetry context material reviewed | [OpenTelemetry — Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/) | Correlation across boundaries is central to later logs/traces. |
| Instrumentation | RECOMMENDED VIDEO | OTel instrumentation material reviewed | [OpenTelemetry — Instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/) | Establishes automatic/manual instrumentation boundaries. |
| OpenTelemetry Concepts | RECOMMENDED VIDEO | OTel architecture material reviewed | [OpenTelemetry — What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/) | Canonical vendor-neutral telemetry model. |
| Golden Signals and Service Questions | RECOMMENDED VIDEO | Google SRE monitoring material reviewed | [Google SRE — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) | Latency, traffic, errors and saturation are tied to service questions rather than dashboard fashion. |
| Telemetry Cost and Noise | NO VIDEO | — | — | Learner evaluates signal value/cardinality/retention against actual cost and diagnosis needs. |
| Lab: Design Steward Observability | NO VIDEO | — | — | Independent question→signal→diagnostic-path design. |
| Structured Logs | RECOMMENDED VIDEO | Twelve-Factor/OTel logs material reviewed | [OpenTelemetry — Logs](https://opentelemetry.io/docs/concepts/signals/logs/) | Shows structured log records and telemetry correlation. |
| Log Levels | OPTIONAL VIDEO | logging-level material reviewed | No candidate promoted | Direct implementation and noise review are stronger. |
| Correlation IDs | RECOMMENDED VIDEO | trace/log correlation material reviewed | Reuse OpenTelemetry context propagation | Connects request identity across service boundaries. |
| Request and Trace Context | RECOMMENDED VIDEO | OTel context material reviewed | Reuse context propagation | Same model, no redundant media. |
| Centralized Logging | RECOMMENDED VIDEO | centralized logging platforms reviewed | [Graylog — Documentation](https://go2docs.graylog.org/) — use architecture/search/stream concepts | Supports the academy's implementation while retaining transferable centralized-logging concepts. |
| Useful vs Noisy Logs | NO VIDEO | — | — | Learner evaluates real diagnostic value from Steward failures. |
| Privacy and Security in Logs | RECOMMENDED VIDEO | OWASP logging material reviewed | [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Explicit guidance on sensitive data and security event logging. |
| Log Retention Concepts | NO VIDEO | — | — | Retention must balance investigation, compliance, storage and privacy. |
| Lab: Build a Steward Diagnostic Logging Path | NO VIDEO | — | — | Independent diagnostic evidence. |
| Decision Gate: Select the Steward Centralized Logging Stack | NO VIDEO | — | — | Platform choice must be defended against requirements. |
| Compare Centralized Logging Implementations | NO VIDEO | — | — | Comparative architecture/cost/operations decision. |
| Defend Graylog as the Logging Platform | NO VIDEO | — | — | Explicit platform defense. |

### Metrics, Prometheus and Grafana

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Metrics Mental Models | RECOMMENDED VIDEO | Prometheus metric-model material reviewed | [Prometheus — Metric types](https://prometheus.io/docs/concepts/metric_types/) | Canonical semantics before instrumentation. |
| Counters, Gauges and Histograms | RECOMMENDED VIDEO | Prometheus metric types reviewed | Reuse Prometheus metric types | One authoritative model is enough. |
| Application and Infrastructure Metrics | NO VIDEO | — | — | Metric selection must follow service questions and risks. |
| Prometheus Architecture | RECOMMENDED VIDEO | Prometheus architecture material reviewed | [Prometheus — Overview](https://prometheus.io/docs/introduction/overview/) — use architecture diagram | Pull model, TSDB, exporters, rules and Alertmanager are highly visual. |
| Exporters | RECOMMENDED VIDEO | Prometheus exporter material reviewed | [Prometheus — Exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/) | Establishes translation from system metrics into Prometheus exposition. |
| Service Discovery Concepts | RECOMMENDED VIDEO | Prometheus discovery material reviewed | [Prometheus — Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/) | Current first-party discovery/target model. |
| PromQL | RECOMMENDED VIDEO | PromQL material reviewed | [Prometheus — Querying basics](https://prometheus.io/docs/prometheus/latest/querying/basics/) | Query semantics are best learned against live Steward metrics. |
| Recording Rules Concepts | RECOMMENDED VIDEO | Prometheus rule material reviewed | [Prometheus — Recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) | Canonical precomputation/rule model. |
| Grafana | RECOMMENDED VIDEO | Grafana dashboard material reviewed | [Grafana — Getting started](https://grafana.com/docs/grafana/latest/getting-started/) | First-party data-source/panel/dashboard workflow. |
| Dashboard Design | RECOMMENDED VIDEO | dashboard design material reviewed | [Grafana — Dashboard best practices](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/) | Supports question-driven dashboards rather than graph accumulation. |
| Dashboard Anti-patterns | NO VIDEO | — | — | Learner critiques the actual Steward dashboard. |
| Nexus and Internal Platform Metrics | NO VIDEO | — | — | Must reflect the deployed Nexus service and delivery dependency. |
| CI and Delivery Metrics | NO VIDEO | — | — | Delivery metrics must answer actual pipeline reliability questions. |
| Lab: Instrument Steward API | NO VIDEO | — | — | Independent instrumentation/query/dashboard evidence. |
| Lab: Observe the Internal Artifact Platform | NO VIDEO | — | — | Independent Nexus dependency evidence. |

### Alerting and On-call

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Symptoms vs Causes | RECOMMENDED VIDEO | SRE alerting material reviewed | [Google SRE Workbook — Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) | Strong symptom/user-impact orientation for paging. |
| Actionable Alerts | RECOMMENDED VIDEO | SRE alerting material reviewed | Reuse Alerting on SLOs | Alert must imply meaningful action. |
| Alert Fatigue | RECOMMENDED VIDEO | SRE/PagerDuty material reviewed | Reuse Google alerting guidance | Keeps noise tied to paging policy rather than notification tooling. |
| Severity | NO VIDEO | — | — | Severity model must fit Steward impact and response expectations. |
| Escalation | NO VIDEO | — | — | Organizational/operational policy. |
| Alert Routing Concepts | RECOMMENDED VIDEO | Alertmanager material reviewed | [Prometheus — Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) | Grouping, inhibition, silences and routing are central and visual. |
| Runbooks | NO VIDEO | — | — | Runbook quality is proved by execution. |
| On-call Handover and Context | NO VIDEO | — | — | Handover is an operational communication artifact. |
| Lab: Build Steward Alerts and Runbooks | NO VIDEO | — | — | Independent paging/runbook evidence. |
| Operate Prometheus Alertmanager | RECOMMENDED VIDEO | Alertmanager implementation material reviewed | Reuse Prometheus Alertmanager documentation | Direct implementation reference. |
| From Firing Rule to Delivered Notification | RECOMMENDED VIDEO | Prometheus alert pipeline reviewed | [Prometheus — Alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) plus Alertmanager docs | Makes rule evaluation versus notification delivery an explicit two-stage system. |
| Deploy and Route with Alertmanager | NO VIDEO | — | — | Real routing configuration evidence. |
| Break Alert Delivery and Recover It | NO VIDEO | — | — | Controlled alert-pipeline failure exercise. |
| Defend the Alerting Pipeline | NO VIDEO | — | — | Architecture/operability defense. |

### Distributed Tracing and Stack Integration

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Decision Gate: Select Steward's Tracing Backend | NO VIDEO | — | — | Backend selection must be defended from scale, integration and operations requirements. |
| Evaluate Distributed Tracing Value and Select the Backend | NO VIDEO | — | — | Explicit value/tool decision. |
| Distributed Tracing with OpenTelemetry and Tempo | RECOMMENDED VIDEO | OTel/Tempo material reviewed | [Grafana Tempo — Introduction](https://grafana.com/docs/tempo/latest/introduction/) plus OTel trace concepts | Connects instrumentation, trace transport/storage and Grafana exploration. |
| Trace the Steward Request Path | RECOMMENDED VIDEO | OTel tracing material reviewed | [OpenTelemetry — Traces](https://opentelemetry.io/docs/concepts/signals/traces/) | Span/trace hierarchy is inherently visual. |
| Deploy Tempo and Instrument Steward | RECOMMENDED VIDEO | Tempo deployment material reviewed | [Grafana Tempo — Getting started](https://grafana.com/docs/tempo/latest/getting-started/) | Current first-party implementation path. |
| Investigate Cross-boundary Latency | NO VIDEO | — | — | Learner must diagnose a real trace. |
| Break the Tracing Pipeline | NO VIDEO | — | — | Controlled telemetry failure. |
| Defend the Tracing Architecture | NO VIDEO | — | — | Architecture defense. |
| Observability Stack Integration: Graylog, Prometheus and Grafana | RECOMMENDED VIDEO | cross-signal observability material reviewed | Reuse OpenTelemetry signals + product architecture resources | Integration value comes from correlating the learner's real signals. |
| Implement the Steward Observability Stack | NO VIDEO | — | — | Independent stack integration. |
| Run a Cross-signal Incident Investigation | NO VIDEO | — | — | Diagnosis exercise is the assessment. |
| Defend the Observability Architecture | NO VIDEO | — | — | Final signal/tool/retention boundary defense. |

### Database Stewardship and Capacity

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Database Roles and Least Privilege | RECOMMENDED VIDEO | PostgreSQL role material reviewed | [PostgreSQL — Database Roles](https://www.postgresql.org/docs/current/user-manag.html) | Canonical ownership/privilege semantics. |
| Connections, Pools and Exhaustion | RECOMMENDED VIDEO | PostgreSQL connection/pool material reviewed | No candidate promoted | Actual connection saturation/pool behavior is implementation-specific and should be measured. |
| Slow Queries and Query-plan Evidence | RECOMMENDED VIDEO | PostgreSQL EXPLAIN material reviewed | [PostgreSQL — Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) | Query-plan evidence is central to diagnosing database performance. |
| Locks, Blocking and Deadlocks | RECOMMENDED VIDEO | PostgreSQL locking material reviewed | [PostgreSQL — Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) | Authoritative lock/deadlock semantics before controlled reproduction. |
| Operationally Safe Database Migrations | RECOMMENDED VIDEO | safe-schema-change material reviewed | Reuse Delivery Engineer Parallel Change resource | Reliability applies the existing expand/contract model operationally. |
| Database Backup, Restore and Recovery Evidence | RECOMMENDED VIDEO | PostgreSQL backup material reviewed | [PostgreSQL — Backup and Restore](https://www.postgresql.org/docs/current/backup.html) | Canonical backup modes and recovery boundary. |
| Database Capacity and Health Review | NO VIDEO | — | — | Review must use actual metrics/query/storage evidence. |
| Lab: Run the Steward Database Stewardship Review | NO VIDEO | — | — | Independent operational review. |
| Investigate a Slow or Saturated Database Path | NO VIDEO | — | — | Diagnostic exercise. |
| Prove Recovery and Operational Readiness | NO VIDEO | — | — | Restore/readiness evidence. |
| Latency and Throughput | RECOMMENDED VIDEO | performance material reviewed | [Google SRE — Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) | Connects latency/load/resource pressure to distributed failure. |
| Saturation | RECOMMENDED VIDEO | golden-signal/capacity material reviewed | Reuse Google SRE monitoring/cascading-failure resources | Existing model is sufficient. |
| Bottlenecks | NO VIDEO | — | — | Learner must locate the actual constrained resource from evidence. |
| Load and Stress Testing | RECOMMENDED VIDEO | k6 material reviewed | Reuse Quality Steward Grafana k6 resources | Performance-tool mechanics are already established. |
| Capacity Planning | RECOMMENDED VIDEO | SRE capacity material reviewed | No candidate promoted | Capacity plan should emerge from measured demand, saturation and growth assumptions. |
| Resource Utilization | NO VIDEO | — | — | Direct metric analysis. |
| Database and Application Bottlenecks | NO VIDEO | — | — | Cross-layer diagnosis exercise. |
| Performance Baselines | NO VIDEO | — | — | Must be measured on Steward. |
| Queueing and Contention Concepts | RECOMMENDED VIDEO | queueing/backpressure material reviewed | [AWS Builders' Library — Avoiding overload](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/) | Strong production framing for queues, overload and recovery. |
| Storage Growth and Artifact Capacity | NO VIDEO | — | — | Nexus/storage growth plan uses actual repository evidence. |
| Lab: Establish Steward Capacity Baselines | NO VIDEO | — | — | Independent workload/measurement/growth evidence. |

### Resilience and Distributed Failure

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Timeouts | RECOMMENDED VIDEO | AWS resilience material reviewed | [AWS Builders' Library — Timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) | Production-grade explanation of bounded waiting and retry interaction. |
| Retries | RECOMMENDED VIDEO | retry material reviewed | Reuse AWS Builders' Library | Keeps timeout/retry/backoff as one system. |
| Exponential Backoff and Jitter | RECOMMENDED VIDEO | backoff material reviewed | Reuse AWS Builders' Library | Canonical production treatment. |
| Circuit Breakers | RECOMMENDED VIDEO | resilience-pattern material reviewed | [Azure Architecture Center — Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) | State diagrams make closed/open/half-open behavior clear. |
| Idempotency | RECOMMENDED VIDEO | idempotency material reviewed | Reuse earlier desired-state/API idempotency concepts | Learner applies it specifically to retry-safe distributed operations. |
| Partial Failure | RECOMMENDED VIDEO | distributed-failure material reviewed | [Google SRE — Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) | Strong model of localized failures becoming system failures. |
| Dependency Failure | RECOMMENDED VIDEO | dependency resilience material reviewed | Reuse Google/AWS reliability resources | Avoids redundant media. |
| Cascading Failure | RECOMMENDED VIDEO | cascading-failure material reviewed | Reuse Google SRE chapter | Canonical production examples. |
| Queues and Backpressure | RECOMMENDED VIDEO | queue/backpressure material reviewed | Reuse AWS queue-backlog resource | Direct connection to overload containment. |
| Graceful Degradation | RECOMMENDED VIDEO | reliability-pattern material reviewed | [Azure Architecture Center — Graceful Degradation](https://learn.microsoft.com/en-us/azure/well-architected/reliability/graceful-degradation) | Connects reduced functionality to preserving critical user outcomes. |
| Retry Storms and Amplification | RECOMMENDED VIDEO | retry amplification material reviewed | Reuse AWS timeout/retry/backoff resource | Explicit production warning against layered retries. |
| Dependency Availability Budgets | NO VIDEO | — | — | Learner computes/defends dependency assumptions from Steward SLOs. |
| Lab: Harden Steward Against Dependency Failure | NO VIDEO | — | — | Independent failure/control/recovery evidence. |

### Incident Management and Fault Injection

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Detection | RECOMMENDED VIDEO | Google SRE incident material reviewed | [Google SRE — Managing Incidents](https://sre.google/sre-book/managing-incidents/) | Canonical incident lifecycle and command structure. |
| Triage | RECOMMENDED VIDEO | incident-management material reviewed | Reuse Google SRE incident guidance | One coherent model is preferable. |
| Incident Roles | RECOMMENDED VIDEO | incident command material reviewed | Reuse Google SRE incident guidance | Makes separation of command/operations/communications explicit. |
| Communication | RECOMMENDED VIDEO | incident communication material reviewed | [Atlassian — Incident communication](https://www.atlassian.com/incident-management/incident-communication) | Practical stakeholder/status communication model. |
| Mitigation | NO VIDEO | — | — | Mitigation choice is scenario-specific and must prioritize restoration. |
| Timeline Construction | NO VIDEO | — | — | Learner reconstructs the actual exercise timeline. |
| Root Cause | RECOMMENDED VIDEO | postmortem material reviewed | [Google SRE — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) | Frames root/contributing factors without simplistic blame. |
| Contributing Factors | RECOMMENDED VIDEO | postmortem material reviewed | Reuse Google postmortem guidance | Same causal-analysis model. |
| Blameless Postmortems | RECOMMENDED VIDEO | Google postmortem material reviewed | Reuse Google postmortem guidance | Canonical organizational-learning framing. |
| Corrective Actions | NO VIDEO | — | — | Actions must trace to actual contributing factors and owners. |
| Learning from Near Misses | RECOMMENDED VIDEO | incident-learning material reviewed | Reuse postmortem culture guidance | Extends learning beyond outages. |
| Lab: Run a Steward Incident Exercise | NO VIDEO | — | — | Independent detect→triage→mitigate→postmortem evidence. |
| Hypothesis-driven Reliability Experiments | RECOMMENDED VIDEO | chaos-engineering principles reviewed | [Principles of Chaos Engineering](https://principlesofchaos.org/) | Starts from steady-state hypothesis rather than random breakage. |
| Controlled Failure Injection | RECOMMENDED VIDEO | chaos material reviewed | Reuse Principles of Chaos | Safety and hypothesis remain primary. |
| Blast Radius and Safety | RECOMMENDED VIDEO | chaos safety material reviewed | Reuse Principles of Chaos | Explicitly bounds experiments. |
| Process and Container Failure | NO VIDEO | — | — | Controlled lab injection. |
| Resource Exhaustion Concepts | RECOMMENDED VIDEO | saturation/cascading material reviewed | Reuse Google cascading-failure resource | Existing production model is sufficient. |
| Network and Dependency Failure Simulation | NO VIDEO | — | — | Controlled lab injection. |
| Database Failure Scenarios | NO VIDEO | — | — | Controlled lab injection. |
| Artifact Repository Failure Scenarios | NO VIDEO | — | — | Controlled Nexus dependency failure. |
| Recovery Verification | NO VIDEO | — | — | Recovery evidence is the objective. |
| Chaos Engineering Principles and Safety | RECOMMENDED VIDEO | chaos principles reviewed | Reuse Principles of Chaos Engineering | Avoids tool-first chaos engineering. |
| Lab: Run a Steward Reliability Experiment | NO VIDEO | — | — | Independent hypothesis/injection/observation/improvement evidence. |

### Data Protection and Disaster Recovery

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Backups | RECOMMENDED VIDEO | CISA/AWS backup material reviewed | [CISA — Data Backup Options](https://www.cisa.gov/news-events/news/data-backup-options) | Establishes backup copies/media/location as risk controls. |
| Backup Integrity | NO VIDEO | — | — | Integrity must be verified from actual backup artifacts. |
| Restore Testing | RECOMMENDED VIDEO | DR material reviewed | [AWS Well-Architected — Disaster Recovery](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html) | Recovery objectives and strategy diagrams support restore planning. |
| RPO and RTO | RECOMMENDED VIDEO | DR objective material reviewed | Reuse AWS DR objectives | RPO/RTO are best understood inside recovery strategy. |
| Disaster Scenarios | NO VIDEO | — | — | Learner selects credible Steward failure scenarios. |
| Recovery Procedures | NO VIDEO | — | — | Procedures must be executable against the real system. |
| Database Recovery | RECOMMENDED VIDEO | PostgreSQL recovery material reviewed | Reuse PostgreSQL Backup and Restore | Canonical DB recovery reference. |
| Artifact Repository Backup and Restore | NO VIDEO | — | — | Must prove Nexus recovery directly. |
| Configuration and Infrastructure Recovery | NO VIDEO | — | — | Existing Git/IaC/configuration assets must reconstruct the environment. |
| Recovery Evidence | NO VIDEO | — | — | Evidence is the lesson. |
| Lab: Run a Steward Restore Drill | NO VIDEO | — | — | Independent destructive/recovery verification. |

### Reliability Engineer Milestone

| Lesson | Decision | Candidates checked | Selection / segment | Reason |
| --- | --- | --- | --- | --- |
| Milestone: Steward Reliability Program | NO VIDEO | — | — | Defines the independent reliability synthesis. |
| Assemble the Reliability Evidence Baseline | NO VIDEO | — | — | Cross-module evidence audit. |
| Operate Steward Through a Reliability Review Scenario | NO VIDEO | — | — | Live operational scenario is the assessment. |
| Publish the Steward Reliability Review | NO VIDEO | — | — | Professional reliability artifact. |
| Defend the Reliability Posture | NO VIDEO | — | — | Final SLO, telemetry, resilience, incident and recovery defense. |
