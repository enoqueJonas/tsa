# TSA Instructional Depth Remediation Tracker

**Status:** active
**Started:** 2026-09-30
**Governing standard:** [Instructional Depth and Pedagogy Standard](./instructional-depth-pedagogy-standard.md)

## Objective

Re-audit TSA from the learner's perspective and remediate lessons that are topically correct but instructionally insufficient.

This tracker is the source of truth for the remediation cycle. Do not mark a school complete because its paths compile, titles exist, resources are linked or canonical technologies are correct. Completion means the learner-facing content satisfies the pedagogy standard and representative pages have been checked in the rendered platform.

## Status vocabulary

- **NOT STARTED** — no pedagogical depth audit yet.
- **AUDIT IN PROGRESS** — learner-facing content is being inspected.
- **REWRITE REQUIRED** — systemic or severe instructional insufficiency confirmed.
- **TARGETED IMPROVEMENT** — lesson basically teaches, but specific gaps must be corrected.
- **REMEDIATED** — source rewritten against the standard; validation still required.
- **VALIDATED** — source and rendered experience satisfy the exit criteria.

## Confirmed defects

| ID | School / path | Finding | Severity | Status | Evidence / next action |
| --- | --- | --- | --- | --- | --- |
| PED-001 | Engineering Apprentice / Engineering Foundations / Terminal, Shell and Filesystem | Nominal 50-minute reading rendered essentially one scope paragraph, a boundary callout and external resources. Concepts were enumerated rather than taught. | Critical | REMEDIATED | Rewritten as the reference benchmark lesson in `0bed33af`; duplicate-export correction `80ca1458`. Source now teaches the mental model and adds guided practice, reasoning check and independent lab. Rendered validation still required. |
| PED-002 | Engineering Apprentice / Engineering Foundations workbench delta | The four workbench lessons were produced by a generator whose reading body was one short string plus a generic boundary/resource block. | Critical | REMEDIATED | All four are now explicit rich lessons: Shell `0bed33af` (+ `80ca1458` fix), Git `f1344809`, Developer Inspection `ca9fbff0`, HTTP CLI `793bbac6`; obsolete generator removed in `9c2ebb77`. Build/integrity and rendered validation remain open. |
| PED-003 | Quality Steward / recently remediated Java/JUnit stack | Source is materially richer than PED-001, but several lessons use compressed mechanics/checklists and generated structures. Instructional sufficiency has not been proven from the learner perspective. | High | AUDIT REQUIRED | Deep-audit Java, JUnit/component, API/integration and framework-engineering lessons before accepting them. |

## Remediation order

The audit proceeds in learner progression order so later schools can rely only on capabilities that have actually been taught.

| # | School | Scope / major paths | Status | Exit evidence |
| ---: | --- | --- | --- | --- |
| 1 | Engineering Apprentice | Thinking Like an Engineer; Systems Thinking; Trade-offs; Debugging Mindset; Engineering Foundations/workbench; milestone/checks | AUDIT IN PROGRESS | Every lesson classified; thin lessons rewritten; rendered spot-check; duration sanity check |
| 2 | Builder | Builder fundamentals and implementation paths | REMEDIATED | Every live path classified and source-level gaps remediated; build/integrity and rendered UI validation remain pending |
| 3 | System Thinker | contracts, integration semantics, distributed state and system reasoning | REMEDIATED | Every live path classified and source-level gaps remediated; build/integrity and rendered UI validation remain pending |
| 4 | Platform Builder | OS/Linux/networking/virtualization/storage/core services/Ansible/patching/Windows | NOT STARTED | Same school exit gate |
| 5 | Delivery Engineer | build/test/package/artifacts/GitLab CI/CD/release | NOT STARTED | Same school exit gate |
| 6 | Cloud Engineer | provider abstractions/IaC/orchestration/GitOps/cloud operations | NOT STARTED | Same school exit gate |
| 7 | Quality Steward | all paths detailed below | NOT STARTED | Same school exit gate plus Java-stack coherence |
| 8 | Security Steward | threat/risk/appsec/platform security/identity/secrets/PKI/supply chain | NOT STARTED | Same school exit gate |
| 9 | Reliability Engineer | SLOs/telemetry/on-call/capacity/resilience/DR/incidents/experiments | NOT STARTED | Same school exit gate |
| 10 | Architect | domain/modularity/styles/data/integration/distribution/resilience/governance | NOT STARTED | Same school exit gate |
| 11 | Technical Steward | leadership/governance/risk/controls/lifecycle/standards | NOT STARTED | Same school exit gate with judgment-level pedagogy |
| 12 | Professional Engineer | ethics/practice/discovery/proposal/build/readiness/portfolio/defence | NOT STARTED | Verify deliberate transfer model; do not add tutorial content mechanically |

## Engineering Apprentice detailed remediation

| Path / lesson group | Status | Required action |
| --- | --- | --- |
| Existing pre-workbench foundations | PASS | Live `engineering-apprentice-rich.ts` lessons teach explicit mental models, worked examples, evidence-producing practice and reasoning checks. No length-only rewrite warranted. Standalone duplicate lesson definitions remain a maintenance follow-up. |
| Terminal, Shell and Filesystem | REMEDIATED | Reference rewrite landed (`0bed33af`, structural fix `80ca1458`). Validate build/integrity and deployed rendering before marking VALIDATED. |
| Git and Version-Control Workflow | REMEDIATED | Repository state/graph model, worked transitions, conflicts/recovery, guided practice and independent lab landed in `f1344809`. |
| Developer Inspection: Processes, Ports and Text | REMEDIATED | Process → listener → request → output evidence model and diagnostic ladder landed in `ca9fbff0`. |
| HTTP from the Command Line | REMEDIATED | Request/response model, pre-HTTP failure boundaries, controlled comparisons and reproducible evidence landed in `793bbac6`. |
| Workbench labs | REMEDIATED | Each workbench lesson now progresses through direct teaching, guided practice, reasoning check and independent evidence-producing lab. |
| Knowledge/assessment coverage | PASS | Rich foundations and remediated workbench use reflection/knowledge checks requiring explanation, prediction, diagnosis and trade-off reasoning rather than keyword recall. |
| Rendered-platform validation | NOT STARTED | Inspect representative pages after deployment/refresh. Source-level audit is complete; build/integrity validation is the remaining pre-render gate. |

## Engineering Apprentice audit findings

| Area | Classification | Finding |
| --- | --- | --- |
| Thinking Like an Engineer | PASS | Explicit engineering reasoning loop, worked problem-framing example, constrained practice and reasoning check. |
| Systems Thinking | PASS | Teaches boundaries, relationships, feedback/failure propagation and requires a purposeful system map. |
| Trade-offs | PASS | Teaches decision drivers, reversibility, false precision and contextual comparison with applied practice. |
| Debugging Mindset | PASS | Hypothesis-driven investigation, evidence log, cognitive-bias awareness and falsification-oriented practice. |
| Engineering Decisions | PASS | Durable decision-record model, worked ADR-style example, proportionality and revisit conditions. |
| Evidence and Technical Reasoning | PASS | Observation/inference/assumption/hypothesis distinctions plus disconfirming-evidence practice. |
| Learning as an Engineering Skill | PASS | Capability/evidence/retrieval/feedback loop taught directly and applied. |
| Communicating Technical Work | PASS | Audience/action model, worked dual-audience example and truth-preserving adaptation practice. |
| Engineering Investigation milestone | PASS | Appropriate synthesis/defence; does not reteach or prescribe the answer. |
| Engineering workbench | REMEDIATED | Four thin generated lessons replaced with explicit taught lessons and progressive practice. |
| Duplicate curriculum definitions | REMEDIATED | Live reachability confirms `technical-stewardship-journey.ts` composes only `engineeringFoundations`, whose canonical sources are `engineering-apprentice-rich.ts` + `engineering-apprentice-workbench-deep.ts`. Legacy standalone modules remain barrel-exported for compatibility and are now explicitly marked non-canonical (`062d5f8c`, `3d9e41d0`, `48c1444b`, `957edcd5`, `8ae61daf`). Delete only after public/import reachability can be proven safe. |

## Validation gate status

| Gate | Status | Evidence |
| --- | --- | --- |
| Engineering Apprentice source-level pedagogical audit | PASS | All live foundations classified; workbench defects remediated; canonical source boundary established. |
| GitHub commit status / Actions | NOT AVAILABLE | Current master commit `dabdf6d7` has no combined status checks and no associated workflow runs. Absence of checks is not a pass. |
| `pnpm audit:curriculum` | PENDING LOCAL EXECUTION | Must be run from a checked-out workspace after the remediation changes. |
| `pnpm build` | PENDING LOCAL EXECUTION | Must be run from a checked-out workspace after the remediation changes. |
| Rendered UI spot-check | NOT STARTED | Perform after a build/deployment containing the remediated lessons. |

Builder audit may proceed in parallel at source level, but Engineering Apprentice must not be marked VALIDATED until the pending gates pass.

## Builder audit findings

### Programming with Python

| Lesson / area | Classification | Finding |
| --- | --- | --- |
| Environment setup | PASS | Teaches interpreter/PATH/venv/pip boundaries and isolation-vs-reproducibility with observable commands. |
| Python Syntax, Values and Types | PASS | Strong first-principles treatment of names/objects/types, mutability, equality/identity and boundary conversion. |
| Control Flow | REMEDIATED | Added explicit branch-chain execution, boolean composition, iterable binding, range/enumerate and break/continue mechanics before domain-level refactoring (`14f3e7ca`). |
| Functions and Scope | REMEDIATED | Added define/call/return execution model, parameters vs arguments, positional/keyword/default arguments, local call state and return-vs-print before contracts/LEGB (`63671e5d`). |
| Collections and Data Structures | REMEDIATED | Added sequence/mapping/set access model, everyday mutation, missing-access behavior and collection-specific iteration before structure-selection trade-offs (`3949f739`). |
| Modules and Packages | PASS | Appropriate after functions/collections; teaches import/dependency boundaries and side-effect discipline. |
| Errors and Exceptions | PASS | Teaches propagation, specific catching, translation/chaining and boundary ownership. |
| Object-Oriented Programming | PASS WITH PREREQUISITE | Appropriate engineering depth if functions/collections fundamentals are remediated first. |
| Comprehensions / Iterators | PASS WITH PREREQUISITE | Correctly framed around readability and lazy consumption; depends on stronger loop/collection fundamentals. |
| Type Hints | PASS | Clear static-feedback boundary and limitations. |
| Dependency Management | PASS | Correct distinction among environment isolation, declarations, direct/transitive dependencies and version policy. |
| Debugging | PASS | Evidence-driven traceback/hypothesis/debugger model. |
| Python service-core lab | PASS WITH PREREQUISITE | Strong synthesis lab; should remain challenging after early-fundamental remediation. |

### Web and API Foundations

| Lesson / area | Classification | Finding |
| --- | --- | --- |
| How the Web Works | REMEDIATED | Expanded DNS/TCP/TLS prerequisites, success evidence and failure boundaries before HTTP (`9d810021`). |
| Client-Server Architecture | PASS | Clear role model, network-boundary consequences, state ownership and distribution trade-offs. |
| HTTP Requests and Responses | PASS | Teaches raw message anatomy, headers/body distinction and body-optional responses before practice. |
| Methods, Headers and Status Codes | REMEDIATED | Added concrete 400/401/403/404/500 semantics and authentication-vs-authorization distinction (`fa6c086b`). |
| JSON and Content Types | PASS | Separates representation syntax, Content-Type/Accept and domain validation. |
| REST Principles and Trade-offs | PASS | Treats REST as architectural constraints rather than URL aesthetics and explicitly discusses CRUD trade-offs. |
| Modeling Resources and API Contracts | PASS | Strong representation/domain/storage separation and compatibility reasoning. |
| Errors and Status Design | PASS | Failure taxonomy, stable codes, retryability and public-vs-internal evidence are directly taught. |
| curl/Postman lab | PASS | Strong protocol-level synthesis after the targeted teaching gaps were remediated. |

### Relational Data and PostgreSQL

| Lesson / area | Classification | Finding |
| --- | --- | --- |
| Relational model through PostgreSQL practice | PASS | Strong progression from facts/keys through CRUD, predicates, aggregation, joins, subqueries/CTEs, transactions, constraints, schema design, normalization, indexes, plans, performance and direct PostgreSQL operation. |
| Concurrency Fundamentals | PASS | Correctly introduces races, database constraints and selective row locking with two-session practice. |
| Django ORM / ORM vs SQL / N+1 / Django migrations | REMEDIATED | Removed from learner-facing PostgreSQL composition in `3f6a5401`; concepts are now taught after Django foundations/models through explicit ORM lifecycle, query-performance/N+1 and schema-evolution lessons (`b9785de9`, `b05c2867`). Legacy definitions remain temporarily non-rendered pending later source cleanup. |
| Persist and Query Steward API Data lab | REMEDIATED | Removed premature Django/ORM/migration requirements. Lab now proves relational schema, SQL, constraints, plans, transactions and concurrency directly and hands reproducible schema/seed evidence to Django (`c3d2aec5`). |

### Django and API Engineering

| Lesson / area | Classification | Finding |
| --- | --- | --- |
| Django Foundations / DRF / application boundaries | PASS | Framework request lifecycle, DRF additions and architectural boundaries are taught before higher abstractions. |
| Models and Domain Data | REMEDIATED | Added model-to-relational mapping, migration lifecycle, manager/QuerySet mechanics, lazy evaluation and generated-SQL inspection grounded in the prior PostgreSQL module (`b9785de9`). |
| ORM Query Behavior and Performance | REMEDIATED | Relocated ORM-vs-SQL and N+1 concepts to the correct prerequisite position; teaches query evaluation, query counts, select_related/prefetch_related and parameterized SQL trade-offs (`b05c2867`). |
| Schema Evolution with Django Migrations | REMEDIATED | Relocated migration teaching after Django model foundations and ties generated operations to existing data, compatibility and expand-contract reasoning (`b05c2867`). |
| Serializers / views / validation / errors | PASS | Responsibilities and boundaries are explicit; domain rules are not collapsed into framework plumbing. |
| Filtering / pagination / versioning / OpenAPI | PASS | API behavior, compatibility and query-boundary consequences are taught deliberately. |
| Configuration / logging | PASS | Appropriate Builder-level operational boundary without stealing later platform/reliability depth. |
| Steward API Skeleton lab | REMEDIATED | Removed stale claim that PostgreSQL comes later; lab now maps the prior PostgreSQL model, reviews migrations, inspects generated SQL/N+1 behavior and hands off to Identity/Auth (`d664dfd0`). |

### Identity, Authentication and Authorization

| Lesson / area | Classification | Finding |
| --- | --- | --- |
| Identity model / Authentication vs Authorization | PASS | Clear subject/account/credential/session distinctions and request-flow separation before policy design. |
| Password Storage and Hashing | REMEDIATED | Added verifier-record/KDF mental model covering salt, work parameters, derived verifier and verification without recovery while retaining framework-managed cryptography (`af98bea9`). |
| JWT Structure / access-refresh / expiry-rotation | PASS | Strong semantic treatment of claims, confidentiality limits, token purposes, staleness, revocation and statefulness trade-offs. |
| Implementing JWT Authentication in DRF | REMEDIATED | Added missing bridge from token semantics to Simple JWT/DRF settings, routes, JWTAuthentication request flow, explicit lifetimes, rotation/blacklist state and authentication-boundary tests (`d7aaf787`). |
| Authentication Flows | PASS | Registration/login/refresh/logout are modeled as security-state transitions with negative paths. |
| Roles / object authorization / ownership | PASS | Team-scoped membership, resource-aware policy, ownership transfer and nested-resource bypass risks are explicitly taught. |
| Common authn/authz mistakes | PASS | Strong deny-by-default and hostile-request/negative-test orientation. |
| Secure Steward API lab | PASS AFTER REMEDIATION | Lab requirements are now preceded by both conceptual token teaching and concrete DRF JWT wiring; authorization evidence includes authenticated-but-unauthorized cases. |

### Software Craft

| Lesson / area | Classification | Finding |
| --- | --- | --- |
| Git / branching / collaboration | PASS | Teaches history and PRs as review/investigation evidence rather than branch ceremony. |
| Readability / separation of concerns / refactoring | PASS | Concrete responsibility and behavior-preservation reasoning; explicitly resists abstraction and cleanup for their own sake. |
| Testing as a Change Safety Net | REMEDIATED | Added missing prerequisite for later refactoring exercises: behavior-oriented tests, boundary selection, arrange-act-assert, regression fail-before-fix evidence and Builder-vs-Quality scope (`41da8114`, `e86793e3`). |
| Dependencies / configuration | PASS | Treats dependencies/configuration as ownership contracts and prevents speculative shared-package extraction. |
| Logging / documentation / error design | PASS | Operational evidence, executable documentation and deliberate public failure contracts are taught with security boundaries. |
| Performance Awareness | PASS | Requires baseline/hypothesis/re-measurement and explicitly rejects speculative optimization/caching. |
| Refine Steward API for Review lab | PASS AFTER REMEDIATION | Strong integrated maintenance/review exercise; its reliance on automated behavior evidence is now preceded by explicit Builder-level testing instruction. |

### Steward API v1 milestone

| Gate / area | Classification | Finding |
| --- | --- | --- |
| Milestone brief / canonical domain | PASS | Consolidates the continuing Steward system and explicitly freezes Builder-level domain, ownership and invariant expectations. |
| Domain and Contract Review | PASS | Requires cardinality, invariant-enforcement mapping, API/failure contract and OpenAPI consistency before final implementation. |
| Build Steward API v1 | REMEDIATED | Added focused automated behavior safety-net evidence and behavior-preservation across refactoring so Software Craft testing is consumed by the capstone (`9d0df2f`). |
| Data Layer proof | PASS | Requires direct SQL, ORM-to-SQL reasoning, constraint failures, planner evidence, justified indexing and populated-state migration evidence. |
| Security Boundaries proof | REMEDIATED | Expanded token evidence to rotation/revocation/logout policy, invalid/expired/revoked credential cases and automated negative security tests (`9d0df2f`). |
| Engineering Handoff | PASS | Requires reproducible setup, API/auth exploration, known limitations and an evidence-based System Thinker handoff without speculative redesign. |
| Milestone review | PASS | Exit questions require concrete evidence and boundary/trade-off reasoning rather than recall. |

### Builder source-level closure

All live Builder paths have now been classified against the instructional-depth standard and all identified source-level prerequisite/depth gaps are remediated. Cross-path sequencing is coherent: Python → Web/API → PostgreSQL → Django/DRF → Identity/Auth → Software Craft → Steward API v1. A consistency scan found no remaining learner-facing claims that PostgreSQL/ORM fundamentals belong after Django.

Builder is **REMEDIATED, not VALIDATED**. Remaining school-exit gates are:

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |

## System Thinker audit findings

### Requirements through Data Flow and Integration

| Path | Classification | Finding |
| --- | --- | --- |
| Requirements and Problem Framing | PASS | Teaching and quality practice both distinguish need, evidence, assumptions, quality requirements and acceptance from implementation-shaped requests. |
| System Boundaries and Context | PASS | Teaches context, actor/external-system classification, responsibility boundaries and trust/ownership boundaries before diagram exercises. |
| Modeling Software Systems | PASS | Models are explicitly decision-oriented simplifications; C4 levels, state/lifecycle models and visual communication are taught without diagram-for-diagram's-sake behavior. |
| Components and Dependencies | PASS | Responsibility, coupling/cohesion, dependency direction and internal/external dependency consequences are taught as change-cost concepts rather than package aesthetics. |
| Data Flow and Integration | PASS | Teaches intent-to-state flow, synchronous/asynchronous semantics, integration contracts and cross-boundary failure before enterprise protocol implementations. |

### Enterprise File and Batch Integration

| Area | Classification | Finding |
| --- | --- | --- |
| Reading layer | REMEDIATED | Lesson factory now supports substantive teaching sections; all five lessons teach their mechanism before practice (`898c5168`, `8355ca87`, `00e51ed9`, `54f36bc1`, `df701a4e`). |
| File-Based Integration Contracts | REMEDIATED | Directly teaches envelope/record semantics, identity/authority, versioning, completion handoff, acknowledgement and replay before contract design (`8355ca87`). |
| Legacy FTP Integration | REMEDIATED | Adds control/data connection model, active/passive direction, firewall implications, legacy-security boundary and transport-vs-business acceptance (`00e51ed9`). |
| Batch File Processing Lifecycle | REMEDIATED | Adds explicit state machine, durable idempotency, layered validation, partial-processing and crash/recovery reasoning before the worker lab (`8355ca87`). |
| Shared Filesystem vs Managed File Transfer | REMEDIATED | Teaches continuous shared-storage versus discrete-delivery coupling and removes the impossible dependency on a later Platform Builder NFS implementation (`54f36bc1`). |
| Secure File Transfer Readiness | REMEDIATED | Directly teaches SFTP-as-SSH versus FTPS-as-FTP+TLS and preserves business-contract semantics across transport migration (`df701a4e`). |

### SOAP and XML Enterprise Integration

| Area | Classification | Finding |
| --- | --- | --- |
| Teaching layer | REMEDIATED | Added a substantive TSA reading layer before practical work; external specifications are now references rather than the primary teacher (`4ae8714f`, `e8539cd1`, `84b70084`). |
| XML document model / namespaces / parsing | REMEDIATED | Now teaches well-formedness, structured parsing, namespace URI identity, prefix independence, XML-vs-JSON differences and parser security boundary before the lab (`e8539cd1`). |
| XSD contract | REMEDIATED | Now teaches target namespace, types/cardinality, compatibility and schema-vs-domain validation before schema authoring (`e8539cd1`). |
| WSDL / SOAP contract and faults | REMEDIATED | Now teaches XSD→message→portType→binding→service/endpoint plus Envelope/Header/Body/Fault and diagnostic-layer separation (`e8539cd1`). |
| Provider / consumer / contract testing | REMEDIATED | Added contract-first provider, contract-aware client, anti-corruption adapter, explicit failure mapping and empirical compatibility-testing concepts before implementation (`84b70084`). |

### Distributed State and Messaging

| Area | Classification | Finding |
| --- | --- | --- |
| Distribution decision / Redis cache | PASS | Starts from measured pressure and authority boundaries; teaches cache-aside, staleness, invalidation timing, fallback and stampede risk without making Redis authoritative. |
| RabbitMQ topology / acknowledgements / retries | PASS | Exchange/queue/consumer roles, manual ACK crash windows, at-least-once semantics and bounded retry are taught directly before failure labs. |
| Idempotent consumers | REMEDIATED | Existing duplicate-delivery teaching was strong but its simplified check→effect→record sequence left a consumer-side crash gap. Added inbox/processed-event identity atomically with local DB effects and explicit limits for external irreversible effects (`e2216e4d`, `7e058b2d`). |
| DLQ / poison messages | PASS | Dead-lettering is treated as an owned recovery state with safe replay rather than a trash queue. |
| Ordering / eventual consistency | PASS | Authority, convergence window, scoped ordering and stale-version rejection are concrete and product-visible. |
| Transactional outbox | PASS | Correctly teaches DB→broker dual-write failure, durable publication intent and why outbox still does not create exactly-once delivery. |
| RabbitMQ vs Kafka | PASS | Compares queue-first delivery with retained partitioned logs from workload drivers; does not create an unnecessary second implementation track. |
| Integrated Redis/RabbitMQ lab | PASS AFTER REMEDIATION | Requires measured drivers, cache failure/staleness, redelivery, idempotency, DLQ, ordering and outbox evidence; local-effect idempotency now has an atomicity model. |

### Failure Modes and Architecture Decisions

| Path / area | Classification | Finding |
| --- | --- | --- |
| Failure Modes | PASS | Teaches cause→failure-mode→impact separation, dependency semantics, silent partial state, finite-resource saturation and human/operational failure. It deliberately analyzes resilience needs rather than prematurely implementing later-school reliability patterns. |
| Failure Modes quality practices | PASS | Practices prioritize by impact/detectability/blast radius, distinguish authoritative dependencies, inject partial state, model nonlinear overload and replace blame/reminders with guardrails. |
| Architecture Characteristics / Drivers | PASS | Converts vague qualities into scenarios and ranks actual decision forces before technology selection. |
| ADRs / Trade-offs | PASS | Teaches alternatives, consequences, uncertainty, experiments, reversibility and revisit triggers; explicitly rejects architecture novelty as a goal. |
| Steward System Design Portfolio | REMEDIATED | Strong integration milestone preserving the simple baseline and requiring Redis/RabbitMQ breakage/removal evidence. Added explicit consumer inbox/local-effect atomicity evidence so the distributed-state remediation is consumed at school exit (`b3cec4c2`). |

### System Thinker source-level closure

All live System Thinker paths have now been audited against the instructional-depth standard. Early reasoning paths and failure/decision paths pass without artificial expansion; enterprise file and SOAP/XML teaching defects were rewritten; distributed consumer atomicity was corrected and carried into the final milestone.

System Thinker is **REMEDIATED, not VALIDATED**. Remaining school-exit gates are:

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |

## Platform Builder audit findings

### Foundations through Bare Metal

| Path | Classification | Finding |
| --- | --- | --- |
| Computer and Operating-System Foundations | PASS | Directly teaches CPU/memory/storage/I/O, OS responsibility, kernel/user boundary, processes/threads and filesystems before machine evidence. |
| Linux Administration | PASS WITH SOURCE-DEBT NOTE | Learner-facing quality composition standardizes Rocky Linux and adds substantive SELinux/firewalld teaching plus RHEL-family practices. The underlying deep source remains Ubuntu-authored and is transformed at runtime; this is maintainability debt, not currently a learner-facing instructional gap. |
| Networking Foundations | PASS | Substantive mechanism-first coverage from Ethernet/IP/ARP through TCP/UDP, sockets, routing, DHCP, DNS, NAT, firewall, TLS and diagnostic tools. |
| Virtualization | PASS | Teaches host/guest/hypervisor boundaries, resource allocation, virtual networking and snapshot/recovery limits before operation. |
| Budget Homelab | PASS | Design is capability/cost/failure driven and the quality overlay aligns learner-facing OS/VPN choices to Rocky Linux/WireGuard. |
| Bare-Metal Platform Foundations | PASS | Boot chain, firmware/UEFI, SMART/hardware evidence, recovery/OOB/power boundaries and destructive Proxmox readiness are taught explicitly and safely. |
| Packet Tracer Network Engineering | REMEDIATED | Added direct mechanism teaching for VLAN/802.1Q forwarding, STP versus EtherChannel, OSPF adjacency/link-state route learning, and ordered/directional ACL evaluation before the existing evidence-driven labs (`c024ea36`, `d0f7b474`). |

### Core Infrastructure through OS Lifecycle

| Path | Classification | Finding |
| --- | --- | --- |
| Proxmox Homelab + implementation milestone | PASS | Strong host/hypervisor/guest boundaries, resource pressure, virtual-to-physical networking, storage mapping, actual backup restore, layered failure localization and single-host maintenance reality. |
| Enterprise Storage / NAS | PASS | Teaches block→redundancy→LVM→filesystem→mount→NFS/SMB layers, destructive-change safety, capacity/inodes, degraded RAID/rebuild, cross-machine service operation, layered incidents and verified independent restore. |
| Core Infrastructure Services: DNS, DHCP and Time | PASS | Services are operated as real dependencies with authority/scope/time-source boundaries, failure injection, TTL/cache, lease/exhaustion/relay and clock-skew diagnosis plus integrated bootstrap/recovery. |
| Configuration Management with Ansible | REMEDIATED | Existing labs were strong but had no direct teaching layer. Added inventory→play→task→module execution model, desired state/idempotence, facts vs authority, roles/variables/templates/handlers, drift/check/diff, canary blast-radius control and secret-input boundaries before practice (`355a5f30`, `37b332dd`). |
| OS Patching and Lifecycle Operations | PASS | Treats patching as controlled change: update classification, DNF evidence, installed-vs-running kernel, reboot/recovery, regression diagnosis, Ansible canaries, lifecycle visibility, hypervisor/guest separation and major-version migration. |

### Windows and Enterprise Directory sequence

| Area | Classification | Finding |
| --- | --- | --- |
| Windows / PowerShell operational labs | REMEDIATED | Added direct teaching before the relevant labs for PowerShell object pipelines/discovery, NTFS+share effective authorization, remoting layers, AD DS forest/domain/DC/OU boundaries, DNS/time/Kerberos/LDAP relationships, domain join and GPO scope/result processing (`2fa34610`). |
| AD / DNS / GPO sequencing | REMEDIATED | The later directory lesson now explicitly reuses the already-operated synthetic AD boundary and treats OpenLDAP as a bounded protocol/implementation comparison rather than a second permanent workforce authority (`fffd8434`). |
| Enterprise File Services | PASS WITH DUPLICATION NOTE | NFS/SMB practice is sound but overlaps the earlier NAS implementation. Treat this as Steward integration/handoff semantics, not a second permanent file platform. |
| LDAP / Directory interoperability | REMEDIATED | Reframed as LDAP protocol/directory interoperability and federation preparation alongside existing AD DS; each scenario must name one authoritative workforce directory and keep Steward authorization separate (`fffd8434`). |

### Platform Builder milestone and source-level closure

| Area | Classification | Finding |
| --- | --- | --- |
| Platform Builder Milestone: original Linux/network/storage gates | PASS | Strong current-state topology, Rocky/systemd/SELinux administration, WireGuard/firewalld policy, persistence/restore, failure diagnosis and capacity handoff. |
| Cross-path capability consumption | REMEDIATED | Original milestone predated several live school capabilities. Added Gate 7 for DNS/DHCP/time, Ansible drift/idempotence and staged OS lifecycle; added Gate 8 for shared storage plus bounded Windows/AD/LDAP interoperability and explicit directory authority (`20251f91`). |
| School sequencing | PASS AFTER REMEDIATION | Progression now moves from machine/OS/network mechanisms → virtualization/bare metal → operated Proxmox/storage/core services → configuration/lifecycle → bounded mixed-enterprise operation → integrated platform evidence. |

Platform Builder is **REMEDIATED, not VALIDATED**. Source-level audit found strong foundations and operational labs, with targeted remediation required for Packet Tracer mechanism teaching, Ansible conceptual teaching, Windows-specific conceptual teaching, AD/OpenLDAP authority sequencing and milestone integration. Those source gaps are now remediated.

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |

## Delivery Engineer audit findings

### Source through artifact and deployment flow

| Path / area | Classification | Finding |
| --- | --- | --- |
| Software Delivery Foundations | PASS | Directly separates source, validation, artifact, release, deployment and verification states; build-once promotion and release evidence are established before tooling. |
| Automation and Shell | PASS | Mechanism-first shell teaching covers inputs, quoting, exit status, pipefail, environment, repeatability and failure evidence before automation practice. |
| Containers and Docker | PASS | Quality practices preserve VM/container/kernel/network/storage boundaries and require runtime evidence rather than treating containerization as magic packaging. |
| Continuous Integration | REMEDIATED | Pedagogy is strong, but learner-facing terminology retained generic/controller-agent language inconsistent with TSA's GitLab-first architecture. Standardized execution to GitLab Runner, dedicated Runner identity/trust/capacity/cleanup, and GitHub Actions as conceptual comparison only (`3c143414`, `56bb201a`). |
| Continuous Delivery / Deployment | PASS | Correctly separates CI, delivery and deployment; environment contract, immutable candidate approvals, deployment automation, migration compatibility, rollback boundaries and verification are evidence driven. |
| Configuration Management | PASS | Builds on Platform Builder Ansible with delivery-specific host-vs-release ownership, drift, idempotence, inventory and role boundaries. |
| Artifact / Dependency / Supply Chain | PASS | Nexus is justified by real distribution needs and teaches formats/protocols, hosted/proxy/group, least-privilege publication, clean consumption, OCI digest identity, retention, provenance and SBOM. Signing/enforcement remains correctly deferred to Security Steward. |
| CI migration exercise | PASS | Jenkins appears only as an intentionally inherited source platform; migration maps guarantees to GitLab, bounds coexistence, preserves rollback during migration and ends by decommissioning Jenkins as a release path. |
| Delivery milestone integration | REMEDIATED | Added explicit GitLab Runner execution/trust evidence and proof that a retired Jenkins migration path cannot remain a second release publisher after cutover (`9b6ca1a7`). |
| Release Engineering | PASS | Teaches immutable release-candidate identity, build-once promotion, risk-question gates, runtime/client evidence, release observability boundary, rollback limits and executable runbooks. |
| Production Database Schema Evolution | PASS | Strong expand→backfill→switch→contract model with old/new coexistence, restartable interrupted backfill, operational load observation, explicit recovery analysis and delayed destructive cleanup. |

### Delivery Engineer source-level closure

Delivery Engineer is **REMEDIATED, not VALIDATED**. The complete live path now forms one coherent state/evidence chain:

```text
reviewed source
  ↓ GitLab CI/CD
GitLab Runner execution + required checks
  ↓
immutable package / OCI artifacts
  ↓ Nexus
release candidate
  ↓ evidence-bearing promotion gates
same artifact + environment configuration
  ↓
deployment + compatible schema evolution
  ↓
runtime/client verification
  ↓
rollback or forward recovery
```

The intentional Jenkins migration exercise remains the sole legacy Jenkins teaching boundary: it starts from an inherited workflow, proves semantic equivalence during bounded coexistence, cuts over to GitLab CI/CD and decommissions Jenkins as a release publisher.

A source consistency review found and corrected one missing instruction separator introduced during milestone editing (`6ef21ead`). This correction is **not** a substitute for an actual build.

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| Canonical GitLab/GitLab Runner delivery model | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |

## Cloud Engineer audit findings

### Hosting through storage foundations

| Path | Classification | Finding |
| --- | --- | --- |
| Cloud and Hosting Models | PASS | Direct teaching covers hosting responsibility boundaries, IaaS/PaaS/SaaS, regions/zones, shared responsibility, elasticity and cost; practice starts from Steward constraints rather than cloud novelty. |
| VPS Operations | PASS WITH SOURCE CLEANUP | Strong Rocky/VPS provisioning, exposure, SSH, provider-vs-host firewall, patching and out-of-band recovery teaching/practice. Replaced a stale Ubuntu security reference with RHEL 9 security-hardening documentation to match the canonical Rocky/RHEL platform (`6e0651a5`). |
| Internet Networking | PASS | Mechanism-first public/private addressing, internet routing, DNS, TLS/reverse-proxy and layered external-path diagnosis build correctly on Platform Builder networking. |
| Certificate Lifecycle Operations | PASS | Goes beyond issuance into served-certificate identity, SAN/trust validation, automated ACME renewal, gateway reload, endpoint-vs-job expiry monitoring and controlled renewal failure/recovery. |
| Cloud Building Blocks | PASS | Compute, object/block storage, managed DB, virtual networking, routing/gateways, load balancing, IAM, secrets and monitoring are taught as responsibility/failure/cost boundaries rather than provider-product memorization. |
| S3-Compatible Object Storage | PASS | Explicit PostgreSQL/NFS/Nexus/S3 placement model, learner-owned implementation, least privilege, real Steward integration, collision/integrity semantics, lifecycle and outage/credential failure practice. |

### Cloud orchestration through school closure

| Path / area | Classification | Finding |
| --- | --- | --- |
| Infrastructure as Code | PASS | Teaches desired state, provider boundary, configuration/state/provider reality, plan/apply review, replacement risk, dependencies, modules, drift, remote state, secrets and recovery before HCL syntax becomes the focus. |
| Kubernetes / OpenShift / GitOps | PASS | Strong reconciliation/control-plane model, replaceable pods, service discovery, configuration/secrets boundary, probe/resource semantics, RBAC, OpenShift delta and explicit GitLab CI/CD → environment Git → Argo CD authority transfer. The migration milestone proves one reconciler rather than allowing CI and Argo to mutate the same environment independently. |
| Progressive Delivery / Canary | PASS | Argo Rollouts is correctly a progressive-rollout state machine under Argo CD desired-state authority; Prometheus supplies promotion/abort evidence, loss of analysis fails safe, and state compatibility constrains canary/rollback. |
| Cloud Architecture and Cost | PASS | Integrates availability, capacity, trust paths, RPO/RTO, failure domains, cost modeling/guardrails, right-sizing, managed-vs-self-managed and hybrid dependency decisions without forcing hyperscale architecture. |
| Cloud Engineer Milestone | REMEDIATED | Existing gates strongly integrated hosting, OpenTofu, identity/network, GitOps release, recovery, cost and handoff. Added explicit exit evidence for served-certificate renewal/expiry lifecycle and the real S3-compatible Steward workflow so newer substantive paths cannot remain disconnected side exercises (`ddb8c7c8`). |

Cloud Engineer is **REMEDIATED, not VALIDATED**. Its source-level progression is coherent:

```text
hosting responsibility and internet operation
  ↓
DNS / TLS / Kong + certificate lifecycle
  ↓
cloud capability and S3 data placement
  ↓
OpenTofu infrastructure intent
  ↓
Kubernetes/OpenShift reconciled runtime
  ↓
environment Git → Argo CD
  ↓
bounded Argo Rollouts canary + Prometheus evidence
  ↓
architecture / recovery / cost review
  ↓
integrated Cloud Engineer exit evidence
```

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| GitLab CI/CD → environment Git → Argo CD authority model | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |

## Quality Steward audit findings

### Quality reasoning through component testing

| Path | Classification | Finding |
| --- | --- | --- |
| Quality Engineering | PASS | Starts from product/system quality, risk, strategy, evidence boundaries, shift-left/right, testability and defect evidence rather than tool counts. |
| Test Analysis and Design | PASS | Provides deliberate test-design techniques and risk-to-evidence reasoning before automation implementation. |
| Java for Test Framework Engineering | PASS | Substantive Java/Maven/JUnit Platform/Jupiter teaching establishes the execution model, lifecycle, assertions, parameterization and extension mechanics needed by later framework work. |
| Unit and Component Testing | REMEDIATED | Concepts were strong but the live implementation layer still contained Django resources, Python examples and Django/PostgreSQL component assumptions. Converted examples/resources/labs to JUnit 5 + AssertJ + Testcontainers Java + PostgreSQL while preserving boundary/isolation/double/coverage reasoning (`254877bf`). |
| Quality-wide stale-stack scan | PASS SO FAR | Literal code searches after the remediation found no remaining Django/django, pytest, `def test_` or “Playwright Python” references under canonical `quality-*` path files. Later Quality paths still require pedagogical review independent of this syntax scan. |
| API and Integration Testing | REMEDIATED | Strong HTTP→REST Assured→Jackson→auth→diagnostics→contract/integration progression. One stale “Django plus PostgreSQL” boundary remained and the real PostgreSQL mechanism was implicit; aligned it to the Java service/repository boundary and explicitly reused Testcontainers PostgreSQL from the preceding path (`10959a42`). |
| Automation Framework Engineering | PASS | Framework work is incremental rather than template-first and directly teaches dependency/evidence architecture, SLF4J/redaction, failure taxonomy, Allure, artifact policy, retries, flake/quarantine ownership and operability. The milestones require executable framework changes and unattended-failure diagnosis; parallel execution remains correctly deferred until isolation is proven. |

## Quality Steward detailed remediation

Do not treat the recent Java migration as pedagogically complete merely because it is technically coherent.

| Path | Status | Audit focus |
| --- | --- | --- |
| Quality Engineering | NOT STARTED | Does it teach quality reasoning rather than terminology? |
| Test Analysis and Design | NOT STARTED | Worked derivation from risk/requirements to tests; techniques practiced, not listed |
| Java for Test Framework Engineering | AUDIT REQUIRED | Java/JVM/Maven mental models, syntax/mechanics explanations, worked code, progressive scaffolding |
| Unit and Component Testing | AUDIT REQUIRED | JUnit execution/lifecycle, assertions, doubles, isolation, component boundaries; remove any stale non-Java examples |
| API and Integration Testing | AUDIT REQUIRED | HTTP/REST Assured/Jackson/auth/contracts/integration boundaries taught before abstractions |
| Automation Framework Engineering | AUDIT REQUIRED | Framework architecture must be taught through concrete evolution, not design checklists |
| Browser and Environment Testing | NOT STARTED | Playwright Java mechanics and browser model taught directly |
| Reusable Test Infrastructure and Internal Distribution | NOT STARTED | Extraction/versioning/Nexus consumption with worked evolution |
| Non-functional Quality | NOT STARTED | Performance/accessibility/etc. mechanisms and evidence, not tool recipes |
| Quality in Containers and CI | NOT STARTED | Docker/Testcontainers/GitLab execution boundaries and diagnostics |
| Continuous and Scheduled Quality Execution | NOT STARTED | Scheduling, selection, parallelism, evidence and failure handling |
| Quality Steward Milestone | NOT STARTED | Preserve synthesis/defence; verify prerequisites are genuinely taught |

## Per-lesson audit record

For each audited lesson, record enough information in the relevant school audit document or remediation commit to answer:

| Field | Required record |
| --- | --- |
| Classification | PASS / REWRITE / TARGETED IMPROVEMENT |
| Why | concrete pedagogical finding, not “looks short” |
| Missing teaching | concepts/examples/diagnostics/practice/assessment gaps |
| Prerequisite check | where assumed knowledge was actually taught |
| Duration check | whether estimate matches rendered work |
| Resource check | supplement vs outsourced instruction |
| Remediation | files/lessons changed |
| Validation | source review + rendered check where applicable |
| Commit | remediation commit SHA |

## School exit gate

A school reaches **VALIDATED** only when:

1. every live learner-facing lesson has a pedagogical classification;
2. every REWRITE/TARGETED IMPROVEMENT item is resolved;
3. new concepts are taught before they are independently assessed;
4. external resources are supplementary;
5. estimated durations are credible;
6. labs require understanding rather than command copying;
7. knowledge checks test reasoning where appropriate;
8. canonical architecture and cross-school boundaries remain intact;
9. curriculum integrity/build checks pass after source changes;
10. representative remediated pages are inspected in the deployed UI.

## Process discipline

- Work school by school; do not perform another shallow all-repository rewrite.
- Rewrite one coherent path/lesson group at a time and commit it independently.
- Preserve good existing material; remediation is not a mandate to make every lesson longer.
- Prefer explanatory depth and progressive examples over word count.
- Do not inflate lessons with generic prose.
- Track every confirmed systemic pattern here.
- Update statuses and commit references as work lands.
- A successful structural audit does not close a pedagogical audit.

## Immediate next task

**PED-001 / PED-002:** deeply audit Engineering Apprentice and rewrite **Terminal, Shell and Filesystem** first as the reference implementation. Use what is learned from that rewrite to calibrate the remaining Apprentice lessons before moving to Builder.

### Quality Steward final segment and source-level closure

| Path / area | Classification | Finding |
| --- | --- | --- |
| Browser and Environment Testing | REMEDIATED | Playwright runtime/isolation, semantic locators, synchronization, state, diagnostics, parallelism and risk-based browser matrices are substantive. Converted two surviving Python-style Playwright examples to Playwright Java (`6c6615c7`). |
| Reusable Test Infrastructure | PASS | Extraction occurs only after proven repetition; Steward clients/DTOs/pages/workflows/assertions remain product-local. `tsa-test-core` is a normal Maven library published to Nexus and consumed by version, with deferral allowed when reuse is not proven. |
| Non-functional Quality | REMEDIATED | Strong bounded Quality treatment of performance, accessibility, compatibility, integrity/concurrency and controlled failure evidence while explicitly deferring deep Security/Reliability ownership. Removed obsolete Python/Django compatibility dimension and replaced it with JDK/Maven/JUnit, Playwright, Testcontainers and PostgreSQL compatibility surfaces (`00a34e8f`). |
| Quality in Containers and CI | REMEDIATED | Strong GitLab Runner/container trust, Testcontainers, cache/artifact, credential and failure-evidence teaching. Added direct Maven Surefire `test` versus Failsafe `integration-test`/`verify` lifecycle teaching and failure proof (`48e36a89`). |
| Continuous and Scheduled Quality Execution | PASS | Separates SCM-triggered fast evidence from broader GitLab scheduled regression, requires real non-manual trigger proof, preserves environment/infrastructure failures, and proves alert/report delivery on deterministic failure. |
| Quality Steward Milestone | REMEDIATED | Integrates risk→test-level→environment→pipeline→release evidence and now requires explicit Surefire/Failsafe lifecycle/report proof at school exit (`449f25a9`). |
| Final canonical-stack scan | PASS | No Jenkins, GitHub Actions, Django, Python, TestNG, Python-style `get_by_` or `set_viewport_` remnants found under canonical `quality-*` path files. |

Quality Steward is **REMEDIATED, not VALIDATED**. The source-level learning progression now forms one canonical system:

```text
quality risk + test analysis
  ↓
Java / Maven / JUnit Platform + Jupiter
  ↓
unit/component: JUnit + AssertJ
  ↓
real component dependencies: Testcontainers + PostgreSQL
  ↓
API/integration: REST Assured + Jackson
  ↓
operable framework: SLF4J + Allure
  ↓
justified browser evidence: Playwright Java
  ↓
proven generic extraction: tsa-test-core → Nexus
  ↓
bounded non-functional evidence
  ↓
GitLab CI/CD + GitLab Runner
  ↓
Surefire(test) / Failsafe(integration-test→verify)
  ↓
SCM-triggered + scheduled evidence
  ↓
release-quality decision
```

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Canonical Java-stack consistency | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |


## Security Steward audit findings

### Security reasoning through application security

| Path / area | Classification | Finding |
| --- | --- | --- |
| Security Foundations | PASS | Establishes CIA, precise risk language, attack surface, least privilege, defense in depth, trust boundaries, control types and residual-risk treatment against the real Steward ecosystem before introducing security tooling. |
| Threat Modeling | PASS | Builds from the prior asset/trust inventory into concrete actor, boundary and attack-path reasoning; threats are tied to evidence and treatment rather than checklist labels. |
| Web and API Threats | PASS | Applies threat reasoning to reachable web/API behavior and authorization/input/session classes without substituting OWASP category memorization for system evidence. |
| Practical Vulnerability Laboratory | PASS | Requires controlled reproduction, evidence, impact reasoning, remediation and retest in learner-owned environments rather than scanner-output collection. |
| Application Security | PASS | Converts earlier findings/threats into implementation and regression controls across authentication, authorization, validation, errors, secrets, headers, logging, abuse resistance, data protection, review and negative requirements. Django/DRF references are **intentional product-stack teaching**: Steward remains a Python/Django/DRF application from Builder; Java/JUnit is the Quality automation stack. Do not conflate these boundaries in later cleanup. |
| Linux and Network Security | PASS WITH SOURCE CLEANUP | Builds directly on Rocky/RHEL platform operations: identity/privilege, SSH, firewalld, exposure, patching, secret-file permissions, audit, segmentation, administrative boundaries and TLS with before/after/recovery evidence. Corrected one stale `apt upgrade` reflection to RHEL/DNF terminology (`ef068a5e`). |
| Container and Delivery Security | PASS | Extends the existing GitLab/Nexus/container delivery chain with image/dependency scanning, SBOM/provenance, secret handling, CI identity least privilege, protected environments and supply-chain trust rather than inventing a parallel security pipeline. |
| Artifact Signing and Verification | PASS | Signs the exact already-published Steward OCI digest, binds SBOM/provenance to the same artifact identity, defines signer trust, and enforces fail-closed rejection of unsigned/invalid and cryptographically valid-but-untrusted signers before promotion/deployment. |
| Identity and Secrets Security | PASS | Separates human, CI, GitOps and workload identities; teaches issuer/audience/token validation, machine least privilege, full secret lifecycle, gateway-vs-domain authorization and explicit denial/revocation evidence. |
| Vault and Dynamic Secrets | PASS | Mandatory implementation is scenario-forced by accumulated credential lifecycle pressure, not product fashion. Learner deploys non-dev Vault, establishes non-root policy/audit, issues leased least-privilege PostgreSQL credentials, proves renewal/revocation, breaks Vault safely and measures existing-vs-new-secret failure behavior. |


### Security Steward final sequence and source-level closure

| Path / area | Classification | Finding |
| --- | --- | --- |
| Internal PKI and Machine Trust | PASS | Teaches root/intermediate/leaf responsibility, SAN/EKU identity, Rocky/Windows trust distribution, mTLS, leaf rotation, revocation, issuer replacement and broken-chain diagnosis. Public ACME remains separate; machine authentication never replaces domain authorization. The milestone proves an operated lifecycle rather than isolated OpenSSL commands. |
| Enterprise Directory Federation | PASS | Treats LDAP/directory federation as an identity-source/trust problem and preserves the boundary between enterprise identity, Keycloak/OIDC token issuance and Steward domain authorization. |
| FTP to SFTP Secure Transfer Migration | PASS | Preserves the existing file/batch contract and idempotency semantics while changing transport trust. Requires host-key/client identity evidence, interrupted-transfer handling, bounded dual-transport coexistence, rehearsed rollback and final FTP credential/listener/firewall decommission. |
| Security Steward Milestone | PASS | Rebaselines the evolved system, verifies representative controls across application/infrastructure/delivery/supply-chain/identity/Vault/PKI/SFTP, closes high-priority gaps with retest, publishes verified-controls separately from recommendations and requires a technical defense of residual risk. |
| Final canonical/security scan | PASS | Literal scans found no stale APT/Ubuntu, Jenkins, GitHub Actions, TLS-disable, “any valid signer” or permanent-dual-authority wording under canonical `security-*` paths after remediation. |

Security Steward is **REMEDIATED, not VALIDATED**. Its source-level progression is coherent:

```text
assets / risk / trust boundaries
  ↓
threat paths
  ↓
web/API vulnerability evidence
  ↓
application controls + security regression
  ↓
Rocky host/network hardening
  ↓
GitLab/Nexus/container supply-chain controls
  ↓
immutable artifact signing + trusted-signer enforcement
  ↓
human / automation / workload identity + secret lifecycle
  ↓
Vault dynamic PostgreSQL credentials
  ↓
internal PKI / mTLS / rotation / revocation
  ↓
enterprise directory federation
  ↓
bounded FTP→SFTP migration and FTP removal
  ↓
cross-stack assessment + residual-risk defense
```

| Gate | Status |
| --- | --- |
| Source-level pedagogical audit | PASS |
| Canonical platform/delivery/security alignment | PASS |
| Identified source remediation | PASS |
| Cross-path prerequisite/sequence review | PASS |
| `pnpm audit:curriculum` after remediation | PENDING LOCAL EXECUTION |
| `pnpm build` after remediation | PENDING LOCAL EXECUTION |
| Representative rendered UI spot-check | NOT STARTED |

