import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { programmingWithPythonRichLessons } from "./builder-python-rich";
import { webAndApiFoundationsDeepLessons } from "./builder-web-api-deep";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const activity: Activity = {
        id: `${lessonId}-001`,
        title,
        estimatedMinutes: title.startsWith("Lab:") ? 45 : 12,
        content: title.startsWith("Lab:")
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace("Lab: ", "")} in the evolving Steward API work.`,
                  scenario: "Use the current Steward API codebase or a focused local experiment. Preserve useful work so later Builder modules can build on it.",
                  instructions: ["Define the behavior or technical question you need to prove.", "Implement or investigate the smallest useful version.", "Exercise the result with realistic inputs, including at least one failure or edge case.", "Record what you observed and what the next module can rely on."],
                  deliverables: ["Working implementation or experiment", "Short evidence note"],
                  completionCriteria: ["The result can be demonstrated rather than only described.", "At least one non-happy-path behavior is considered.", "The learner can explain why the implementation behaves as observed."],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes the role of ${title} in building the Steward API. The deep-authoring phase will expand it with full TSA teaching, examples, researched resources, exercises and knowledge checks.`,
              },
    };
    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath { return { id, title, lessons }; }

export const programmingWithPython = path("programming-with-python", "Programming with Python", programmingWithPythonRichLessons);
export const webAndApiFoundations = path("web-and-api-foundations", "Web and API Foundations", webAndApiFoundationsDeepLessons);

export const djangoAndApiEngineering = path("django-and-api-engineering", "Django and API Engineering", [
    lesson("django-and-api-engineering", "Django Foundations"),
    lesson("django-and-api-engineering", "Django REST Framework"),
    lesson("django-and-api-engineering", "Projects, Applications and Boundaries"),
    lesson("django-and-api-engineering", "Models and Domain Data"),
    lesson("django-and-api-engineering", "Serializers and Representation"),
    lesson("django-and-api-engineering", "Views, ViewSets and Routing"),
    lesson("django-and-api-engineering", "Validation and Business Rules"),
    lesson("django-and-api-engineering", "API Error Handling"),
    lesson("django-and-api-engineering", "Filtering, Searching and Ordering"),
    lesson("django-and-api-engineering", "Pagination"),
    lesson("django-and-api-engineering", "API Versioning"),
    lesson("django-and-api-engineering", "OpenAPI and Swagger Documentation"),
    lesson("django-and-api-engineering", "Configuration and Environments"),
    lesson("django-and-api-engineering", "Application Logging"),
    lesson("django-and-api-engineering", "Lab: Steward API Skeleton", "Create the Steward service-registry API with Teams, Services, ownership and at least one meaningful relationship. Add initial endpoints, validation, configuration, logging and generated API documentation."),
]);

export const relationalDataAndPostgresql = path("relational-data-and-postgresql", "Relational Data and PostgreSQL", [
    lesson("relational-data-and-postgresql", "The Relational Model"),
    lesson("relational-data-and-postgresql", "SQL SELECT, INSERT, UPDATE and DELETE"),
    lesson("relational-data-and-postgresql", "Filtering and Ordering Queries"),
    lesson("relational-data-and-postgresql", "Aggregation, GROUP BY and HAVING"),
    lesson("relational-data-and-postgresql", "INNER, LEFT and RIGHT JOINs", "JOINs are a core Builder capability: reason across Teams, Services, Environments and ServiceDependencies and choose join semantics intentionally rather than relying only on ORM convenience."),
    lesson("relational-data-and-postgresql", "Subqueries"),
    lesson("relational-data-and-postgresql", "Common Table Expressions"),
    lesson("relational-data-and-postgresql", "Transactions and ACID"),
    lesson("relational-data-and-postgresql", "Constraints, Keys and Relationships"),
    lesson("relational-data-and-postgresql", "Schema Design"),
    lesson("relational-data-and-postgresql", "Normalization and Denormalization Trade-offs"),
    lesson("relational-data-and-postgresql", "Indexes"),
    lesson("relational-data-and-postgresql", "Query Plans and EXPLAIN"),
    lesson("relational-data-and-postgresql", "Query Performance"),
    lesson("relational-data-and-postgresql", "PostgreSQL in Practice"),
    lesson("relational-data-and-postgresql", "Django ORM"),
    lesson("relational-data-and-postgresql", "ORM versus SQL"),
    lesson("relational-data-and-postgresql", "The N+1 Query Problem"),
    lesson("relational-data-and-postgresql", "Database Migrations"),
    lesson("relational-data-and-postgresql", "Concurrency Fundamentals"),
    lesson("relational-data-and-postgresql", "Lab: Persist and Query Steward API Data", "Model Teams, Memberships, Services, Environments, dependencies and reviews in PostgreSQL. Prove non-trivial service-registry questions using joins, aggregation and query-plan inspection in addition to ORM access."),
]);

export const identityAuthenticationAuthorization = path("identity-authentication-authorization", "Identity, Authentication and Authorization", [
    lesson("identity-authentication-authorization", "Identity in Software Systems"),
    lesson("identity-authentication-authorization", "Authentication versus Authorization"),
    lesson("identity-authentication-authorization", "Password Storage and Hashing"),
    lesson("identity-authentication-authorization", "JWT Structure and Lifecycle"),
    lesson("identity-authentication-authorization", "Access and Refresh Tokens"),
    lesson("identity-authentication-authorization", "Expiration and Token Rotation"),
    lesson("identity-authentication-authorization", "Authentication Flows"),
    lesson("identity-authentication-authorization", "Roles and Permissions"),
    lesson("identity-authentication-authorization", "Object-Level Authorization"),
    lesson("identity-authentication-authorization", "Ownership and Access Rules"),
    lesson("identity-authentication-authorization", "Common Authentication and Authorization Mistakes"),
    lesson("identity-authentication-authorization", "Lab: Secure Steward API", "Implement JWT authentication plus Team membership, ownership and object-level authorization. Verify that users cannot modify services owned by teams for which they lack the required role."),
]);

export const softwareCraft = path("software-craft", "Software Craft", [
    lesson("software-craft", "Git as an Engineering Tool"),
    lesson("software-craft", "Branching and Collaboration"),
    lesson("software-craft", "Readable Code"),
    lesson("software-craft", "Separation of Concerns"),
    lesson("software-craft", "Refactoring"),
    lesson("software-craft", "Managing Dependencies"),
    lesson("software-craft", "Configuration"),
    lesson("software-craft", "Useful Logging"),
    lesson("software-craft", "Technical Documentation"),
    lesson("software-craft", "Designing Errors"),
    lesson("software-craft", "Performance Awareness"),
    lesson("software-craft", "Lab: Refine Steward API for Review", "Refactor and document Steward API so another engineer can understand its service-registry domain, configure it, run it and review it without undocumented local knowledge."),
]);

export const stewardApiV1 = path("steward-api-v1", "Builder Milestone", [
    {
        id: "steward-api-v1-milestone",
        title: "Milestone: Steward API v1",
        activities: [
            {
                id: "steward-api-v1-milestone-001",
                title: "Build Steward API v1",
                estimatedMinutes: 480,
                content: {
                    type: "practical",
                    objective: "Build the first portfolio-grade version of Steward: an Engineering Service Registry with real ownership, dependency and environment rules rather than a generic CRUD backend.",
                    scenario: "An engineering organization needs a trustworthy registry of its teams and technical services. Steward API v1 must answer who owns a service, what lifecycle/criticality it has, where it runs and what other services it depends on. This is the continuing system that later TSA schools will deliver, secure, operate, architect and govern.",
                    instructions: [
                        "Implement User, Team, Membership, Service, Environment, ServiceDependency and ServiceReview concepts with Python, Django and Django REST Framework.",
                        "Require every Service to have an owning Team and enforce explicit membership/role rules for modifications.",
                        "Prevent self-dependencies and duplicate service dependencies.",
                        "Represent lifecycle and criticality deliberately and reject unsupported values.",
                        "Require production services to satisfy the Builder-level production-environment rule defined in the product specification.",
                        "Persist the domain in PostgreSQL with meaningful relationships, constraints and migrations.",
                        "Demonstrate non-trivial relational questions such as services by owner team, high-criticality services, dependency counts or services missing required environment data.",
                        "Implement JWT access and refresh authentication with appropriate lifecycle behavior.",
                        "Enforce team membership, ownership and object-level authorization, including negative cross-team cases.",
                        "Provide filtering, searching and pagination where appropriate, including useful service-registry filters.",
                        "Provide OpenAPI/Swagger documentation and usable local configuration.",
                        "Add application logging and investigate at least one important query with EXPLAIN or equivalent evidence.",
                        "Prepare the repository so System Thinker and later schools can evolve the same system rather than rebuild it.",
                    ],
                    deliverables: ["Steward API v1 source repository", "Domain model for teams, services, environments and dependencies", "PostgreSQL schema and migrations", "JWT authentication and object-level authorization", "Documented API contract", "Evidence of advanced relational queries", "Setup and engineering notes"],
                    completionCriteria: ["The implementation follows the canonical Steward product definition in docs/product/steward.md.", "The API cannot reasonably be described as a basic CRUD tutorial project.", "Service ownership and dependency rules are enforced as domain behavior.", "Authentication and authorization protect real cross-team operations.", "The data model demonstrates relational reasoning.", "Failure paths return deliberate responses.", "A new engineer can run and explore the API from documentation.", "The system is credible enough to remain the TSA continuing project through governance and reliability stages."],
                },
            },
        ],
    },
]);

export const builderPaths: LearningPath[] = [programmingWithPython, webAndApiFoundations, djangoAndApiEngineering, relationalDataAndPostgresql, identityAuthenticationAuthorization, softwareCraft, stewardApiV1];
