import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
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
                  instructions: [
                      "Define the behavior or technical question you need to prove.",
                      "Implement or investigate the smallest useful version.",
                      "Exercise the result with realistic inputs, including at least one failure or edge case.",
                      "Record what you observed and what the next module can rely on.",
                  ],
                  deliverables: ["Working implementation or experiment", "Short evidence note"],
                  completionCriteria: [
                      "The result can be demonstrated rather than only described.",
                      "At least one non-happy-path behavior is considered.",
                      "The learner can explain why the implementation behaves as observed.",
                  ],
              }
            : {
                  type: "reading",
                  body:
                      focus ??
                      `This breadth lesson establishes the role of ${title} in building the Steward API. The deep-authoring phase will expand it with full TSA teaching, examples, researched resources, exercises and knowledge checks.`,
              },
    };

    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const programmingWithPython = path("programming-with-python", "Programming with Python", [
    lesson("programming-with-python", "Setting Up a Python Engineering Environment"),
    lesson("programming-with-python", "Python Syntax, Values and Types"),
    lesson("programming-with-python", "Control Flow"),
    lesson("programming-with-python", "Functions and Scope"),
    lesson("programming-with-python", "Collections and Data Structures"),
    lesson("programming-with-python", "Modules and Packages"),
    lesson("programming-with-python", "Errors, Exceptions and Defensive Programming"),
    lesson("programming-with-python", "Object-Oriented Programming"),
    lesson("programming-with-python", "Comprehensions, Iterators and Pythonic Tools"),
    lesson("programming-with-python", "Type Hints and Static Feedback"),
    lesson("programming-with-python", "Virtual Environments and Dependency Management"),
    lesson("programming-with-python", "Debugging Python Programs"),
    lesson("programming-with-python", "Lab: Build a Small Python Service Core", "Build a small Python domain/service core that will become the conceptual starting point for Steward API rather than a disposable syntax exercise."),
]);

export const webAndApiFoundations = path("web-and-api-foundations", "Web and API Foundations", [
    lesson("web-and-api-foundations", "How the Web Works"),
    lesson("web-and-api-foundations", "Client-Server Architecture"),
    lesson("web-and-api-foundations", "HTTP Requests and Responses"),
    lesson("web-and-api-foundations", "Methods, Headers and Status Codes"),
    lesson("web-and-api-foundations", "JSON and Content Types"),
    lesson("web-and-api-foundations", "REST Principles and Trade-offs"),
    lesson("web-and-api-foundations", "Modeling Resources and API Contracts"),
    lesson("web-and-api-foundations", "Errors and Status Design"),
    lesson("web-and-api-foundations", "Lab: Explore APIs with curl and Postman", "Inspect real HTTP exchanges with curl and Postman and explain requests, responses, headers, status codes and failure behavior."),
]);

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
    lesson("django-and-api-engineering", "Lab: Steward API Skeleton", "Create the Steward API Django/DRF project with a meaningful domain boundary, initial endpoints, validation, configuration, logging and generated API documentation."),
]);

export const relationalDataAndPostgresql = path("relational-data-and-postgresql", "Relational Data and PostgreSQL", [
    lesson("relational-data-and-postgresql", "The Relational Model"),
    lesson("relational-data-and-postgresql", "SQL SELECT, INSERT, UPDATE and DELETE"),
    lesson("relational-data-and-postgresql", "Filtering and Ordering Queries"),
    lesson("relational-data-and-postgresql", "Aggregation, GROUP BY and HAVING"),
    lesson("relational-data-and-postgresql", "INNER, LEFT and RIGHT JOINs", "JOINs are a core Builder capability: reason about relationships across tables and choose join semantics intentionally rather than relying only on ORM convenience."),
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
    lesson("relational-data-and-postgresql", "Lab: Persist and Query Steward API Data", "Model Steward API data in PostgreSQL and prove non-trivial relational queries using joins, aggregation and query-plan inspection in addition to ORM access."),
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
    lesson("identity-authentication-authorization", "Lab: Secure Steward API", "Implement JWT authentication plus role, ownership and object-level authorization rules in Steward API and verify both permitted and forbidden flows."),
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
    lesson("software-craft", "Lab: Refine Steward API for Review", "Refactor and document Steward API so another engineer can understand, configure, run and review it without relying on undocumented local knowledge."),
]);

export const stewardApiV1 = path("steward-api-v1", "Builder Milestone", [
    {
        id: "steward-api-v1-milestone",
        title: "Milestone: Steward API v1",
        activities: [
            {
                id: "steward-api-v1-milestone-001",
                title: "Build Steward API v1",
                estimatedMinutes: 360,
                content: {
                    type: "practical",
                    objective: "Synthesize Builder capabilities into a serious multi-user backend whose complexity requires more than CRUD.",
                    scenario: "Deliver the first portfolio-grade Steward API. Its domain must contain relationships and rules rich enough to exercise SQL, authorization, validation and operational concerns learned throughout Builder.",
                    instructions: [
                        "Implement the API with Python, Django and Django REST Framework.",
                        "Persist the domain in PostgreSQL with meaningful relationships, constraints and migrations.",
                        "Include non-trivial relational behavior and queries, including JOIN-based reasoning, aggregation or equivalent domain reporting.",
                        "Implement JWT access and refresh authentication with appropriate lifecycle behavior.",
                        "Enforce role, ownership and object-level authorization where the domain requires it.",
                        "Implement robust validation and deliberate API error responses, including negative paths.",
                        "Provide filtering, searching and pagination where appropriate.",
                        "Provide OpenAPI/Swagger documentation and usable configuration for local environments.",
                        "Add application logging and investigate at least one query using EXPLAIN or equivalent evidence.",
                        "Prepare the repository so it can be reviewed and later evolved by System Thinker, Platform Builder and the remaining TSA schools.",
                    ],
                    deliverables: [
                        "Steward API v1 source repository",
                        "PostgreSQL schema and migrations",
                        "JWT authentication and authorization implementation",
                        "Documented API contract",
                        "Evidence of advanced relational queries",
                        "Setup and engineering notes",
                    ],
                    completionCriteria: [
                        "The API cannot reasonably be described as a basic CRUD tutorial project.",
                        "Authentication and authorization protect real domain operations.",
                        "The data model requires and demonstrates relational reasoning.",
                        "Failure paths return deliberate, understandable responses.",
                        "A new engineer can run and explore the API from the documentation.",
                        "The implementation is strong enough to become the continuing system for later TSA stages.",
                    ],
                },
            },
        ],
    },
]);

export const builderPaths: LearningPath[] = [
    programmingWithPython,
    webAndApiFoundations,
    djangoAndApiEngineering,
    relationalDataAndPostgresql,
    identityAuthenticationAuthorization,
    softwareCraft,
    stewardApiV1,
];
