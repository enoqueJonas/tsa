import type { LearningPath } from "./learning-path";

export const stewardApiV1Deep: LearningPath = {
    id: "steward-api-v1",
    title: "Builder Milestone",
    lessons: [
        {
            id: "steward-api-v1-milestone",
            title: "Milestone: Steward API v1",
            activities: [
                {
                    id: "steward-api-v1-milestone-brief",
                    title: "Milestone Brief: Steward API v1",
                    estimatedMinutes: 35,
                    content: {
                        type: "reading",
                        body: "This milestone consolidates the entire Builder school into one portfolio-grade backend system. Steward API v1 must behave like an Engineering Service Registry with real ownership, dependency, environment, persistence, authorization and operational rules—not like a collection of unrelated tutorial endpoints.",
                        blocks: [
                            { type: "heading", id: "mission", text: "The mission", level: 2 },
                            { type: "paragraph", text: "An engineering organization needs one trustworthy API that answers who owns a technical service, what lifecycle and criticality it has, where it runs, what it depends on, who may modify it, and whether its registry data satisfies the organization's baseline stewardship rules." },
                            { type: "paragraph", text: "You are not starting another project. Build on the Steward work produced throughout Builder and turn it into one coherent v1 release candidate." },
                            { type: "heading", id: "domain", text: "Canonical domain", level: 2 },
                            { type: "list", items: ["User — authenticated human identity", "Team — engineering ownership boundary", "Membership — a User's role inside a Team", "Service — a registered technical service owned by exactly one Team", "Environment — where a Service runs, including production where applicable", "ServiceDependency — directed dependency between two Services", "ServiceReview — lightweight review evidence for stewardship follow-up"] },
                            { type: "heading", id: "core-rules", text: "Non-negotiable Builder rules", level: 2 },
                            { type: "list", items: ["Every Service has an owning Team.", "Lifecycle and criticality use explicit supported values.", "A Service cannot depend on itself.", "Duplicate ServiceDependency relationships are rejected.", "Production-related registry rules are enforced deliberately rather than implied by UI behavior.", "Team membership and role determine who may mutate owned Services.", "Authenticated users must still be denied when they lack authorization for another Team's resources.", "Database constraints protect invariants that must survive every application code path.", "API failures have deliberate status codes and response shapes."] },
                            { type: "callout", tone: "steward", title: "Continuing system", body: "Steward API v1 is not a throwaway capstone. System Thinker and every later TSA school will evolve this same system through architecture, delivery, cloud, quality, security, reliability and governance work." },
                            { type: "heading", id: "definition-of-done", text: "Definition of done", level: 2 },
                            { type: "paragraph", text: "A new engineer must be able to clone the repository, configure it, migrate PostgreSQL, obtain authentication credentials, explore the documented API and reproduce important positive and negative behaviors without relying on your private knowledge." },
                        ],
                    },
                },
                {
                    id: "steward-api-v1-milestone-design-review",
                    title: "Gate 1: Domain and Contract Review",
                    estimatedMinutes: 75,
                    content: {
                        type: "practical",
                        objective: "Freeze the Builder-level Steward v1 domain and API contract before final implementation work.",
                        scenario: "You are preparing the implementation plan for a release candidate. The goal is to detect contradictory models, missing invariants and vague endpoint behavior before more code makes them expensive to change.",
                        instructions: ["Draw the current User, Team, Membership, Service, Environment, ServiceDependency and ServiceReview relationships.", "For every relationship, state cardinality and ownership meaning.", "List domain invariants and mark where each is enforced: serializer/application logic, authorization policy, database constraint, or more than one layer.", "Draft or review the public endpoints needed for Teams, Services, Environments and dependencies.", "Record required/optional/nullability semantics for important request fields.", "Create a failure matrix covering malformed input, validation failure, unauthenticated access, authenticated-but-forbidden access, not found, conflict and unexpected server failure.", "Review the OpenAPI surface and identify any mismatch between documentation and intended runtime behavior."],
                        deliverables: ["Steward v1 domain model", "Invariant/enforcement matrix", "API contract and failure matrix", "OpenAPI gap list"],
                        completionCriteria: ["The domain matches docs/product/steward.md.", "Ownership is explicit rather than inferred from creator metadata.", "Each important invariant has an enforcement location.", "401, 403, 404 and conflict cases are distinguishable.", "The planned API is coherent enough to implement without inventing new product concepts mid-build."],
                    },
                },
                {
                    id: "steward-api-v1-milestone-build",
                    title: "Gate 2: Build Steward API v1",
                    estimatedMinutes: 480,
                    content: {
                        type: "practical",
                        objective: "Build the first portfolio-grade version of Steward as a coherent Engineering Service Registry.",
                        scenario: "The registry will be handed to an engineering organization that expects trustworthy ownership, environment and dependency data. The implementation must combine the programming, HTTP, Django, PostgreSQL, identity and software-craft capabilities developed across Builder.",
                        instructions: ["Implement or complete User, Team, Membership, Service, Environment, ServiceDependency and ServiceReview using Python, Django and Django REST Framework.", "Require every Service to have an owning Team and prevent clients from bypassing ownership rules through nested or alternate endpoints.", "Represent lifecycle and criticality with explicit supported values and reject invalid transitions or values at the appropriate boundary.", "Prevent self-dependencies and duplicate dependencies at both application and database levels where feasible.", "Implement the Builder-level production-environment rule defined by the canonical Steward product specification.", "Persist all domain concepts in PostgreSQL with meaningful foreign keys, uniqueness rules, check constraints where useful, and reviewable migrations.", "Implement JWT access and refresh authentication with explicit expiry behavior.", "Enforce Team membership, role and object-level authorization for write operations. Demonstrate authenticated cross-team denials.", "Add useful filtering, searching, ordering and bounded pagination for service-registry use cases.", "Publish an OpenAPI/Swagger contract that matches runtime endpoints and failure behavior closely enough for another engineer to explore the API.", "Use environment-based configuration with safe handling of secrets and required values.", "Add useful application logs for important registry changes and denied/failure paths without logging passwords or raw tokens.", "Keep error responses deliberate and avoid leaking stack traces, SQL text or internal exception classes.", "Refactor only where a concrete maintainability problem exists; do not add speculative architecture layers that belong to System Thinker."],
                        deliverables: ["Working Steward API v1 source", "PostgreSQL schema and migrations", "JWT authentication and authorization implementation", "Documented API contract", "Configuration and logging setup"],
                        completionCriteria: ["The API cannot reasonably be described as a basic CRUD tutorial.", "Ownership, dependency and environment rules are real domain behavior.", "Authentication and authorization protect real cross-team operations.", "Database integrity does not rely solely on front-end behavior.", "The API exposes deliberate success and failure semantics.", "The repository remains understandable without unnecessary abstraction."],
                    },
                },
                {
                    id: "steward-api-v1-milestone-data-evidence",
                    title: "Gate 3: Prove the Data Layer",
                    estimatedMinutes: 120,
                    content: {
                        type: "practical",
                        objective: "Demonstrate that Steward v1 uses PostgreSQL deliberately rather than merely persisting Django objects.",
                        scenario: "A reviewer wants evidence that the data model can answer real registry questions efficiently and protect important invariants under non-happy-path behavior.",
                        instructions: ["Create realistic Teams, Memberships, Services, Environments, dependencies and review data.", "Write or capture SQL for at least four non-trivial questions: services by owning Team, high-criticality Services, dependency counts, and Services missing required environment/review information.", "Include at least one aggregation and one multi-table join.", "Inspect the Django ORM SQL for one important query and explain how it maps to the relational model.", "Demonstrate at least two negative database-integrity cases, such as duplicate dependency or invalid relationship data.", "Run EXPLAIN or EXPLAIN ANALYZE on one important query with enough data to make the plan meaningful.", "Add or justify an index only if access-pattern or plan evidence supports it.", "Demonstrate one safe migration that changes populated data or schema rather than only creating empty tables."],
                        deliverables: ["SQL evidence pack", "ORM-to-SQL explanation", "Constraint failure evidence", "EXPLAIN/EXPLAIN ANALYZE evidence", "Migration evidence"],
                        completionCriteria: ["The learner can answer registry questions directly in SQL.", "ORM use does not hide relational reasoning.", "At least one integrity rule is proven at database level.", "Performance claims use planner evidence.", "The migration demonstrates safe evolution of existing state."],
                    },
                },
                {
                    id: "steward-api-v1-milestone-security-evidence",
                    title: "Gate 4: Prove Security Boundaries",
                    estimatedMinutes: 90,
                    content: {
                        type: "practical",
                        objective: "Prove that Steward v1 distinguishes identity, authentication and authorization under realistic Team ownership scenarios.",
                        scenario: "A reviewer assumes that many APIs are 'secured' only because endpoints require a token. Your task is to prove that valid credentials still cannot cross Steward ownership boundaries.",
                        instructions: ["Create at least two Teams and two authenticated users with different Memberships/roles.", "Prove successful token issuance and a normal authenticated read.", "Prove an unauthenticated protected request is rejected appropriately.", "Prove a permitted same-Team Service mutation succeeds.", "Using a valid token, attempt a cross-Team Service mutation and capture the 403-style denial.", "Repeat authorization checks through at least one nested Environment or ServiceDependency mutation path so permissions cannot be bypassed through route shape.", "Demonstrate access-token expiry/refresh behavior.", "Inspect logs and responses to confirm passwords, raw tokens and sensitive internal details are not exposed."],
                        deliverables: ["Authentication evidence", "Authorization decision evidence", "Cross-Team denial cases", "Token lifecycle evidence", "Secret-leakage check"],
                        completionCriteria: ["Valid authentication does not imply global write access.", "Resource-aware authorization is enforced consistently across routes.", "401 and 403 cases are intentionally distinct.", "Token lifecycle behavior is explainable and reproducible.", "Sensitive credentials do not appear in logs or public errors."],
                    },
                },
                {
                    id: "steward-api-v1-milestone-handoff",
                    title: "Gate 5: Engineering Handoff",
                    estimatedMinutes: 90,
                    content: {
                        type: "practical",
                        objective: "Prepare Steward API v1 so another engineer can run, review and extend it without undocumented local knowledge.",
                        scenario: "Builder is ending. The next engineer—or your future self in System Thinker—must inherit the system as a real codebase, not as a memory of how you happened to build it.",
                        instructions: ["Review the repository diff and tracked files for coherence without deleting unknown local work.", "Document clone-to-running setup, required environment variables, PostgreSQL setup/migrations and the first useful API request.", "Document the Steward domain in concise terms and link to the canonical product specification.", "Document authentication usage and how to reproduce at least one authorized and one forbidden operation.", "Link to generated OpenAPI documentation rather than manually duplicating the full API surface.", "Record one measured performance investigation and its conclusion.", "List known Builder-level limitations rather than hiding them.", "Write a System Thinker handoff: identify architecture boundaries, coupling or dependency questions that now deserve deeper modeling, without implementing speculative redesigns."],
                        deliverables: ["README/setup guide", "API exploration guide", "Known limitations", "System Thinker handoff note"],
                        completionCriteria: ["A new engineer can run Steward from documentation.", "Important behavior can be reproduced without private context.", "Known limitations are explicit.", "The handoff separates proven Builder guarantees from architecture questions reserved for the next school."],
                    },
                },
                {
                    id: "steward-api-v1-milestone-review",
                    title: "Milestone Review and Exit Criteria",
                    estimatedMinutes: 30,
                    content: {
                        type: "reflection",
                        prompt: "1. Which Steward rule is most important to protect at database level, and why?\n2. Show one case where a valid token is correctly denied. What resource state and policy caused the denial?\n3. Which API failure is most useful to a client because its status/code tells the client what to do next?\n4. Which PostgreSQL query or EXPLAIN result best proves you understand the data model beyond the ORM?\n5. What Builder-level refactor did you deliberately avoid because the problem belongs to System Thinker?\n6. Can a new engineer clone, configure, run, authenticate and reproduce a cross-Team authorization failure using only repository documentation?\n7. What architectural question should be investigated first in System Thinker, and what evidence from Steward motivates it?"
                    },
                },
            ],
        },
    ],
};
