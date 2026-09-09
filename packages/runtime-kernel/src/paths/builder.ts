import type { LearningPath } from "./learning-path";
import { programmingWithPythonRichLessons } from "./builder-python-rich";
import { webAndApiFoundationsDeepLessons } from "./builder-web-api-deep";
import { djangoAndApiRichLessons } from "./builder-django-rich";
import { relationalDataAndPostgresqlDeepLessons } from "./builder-postgresql-deep";
import { identityAuthenticationAuthorizationDeepLessons } from "./builder-identity-auth-deep";
import { softwareCraftDeepLessons } from "./builder-software-craft-deep";

function path(id: string, title: string, lessons: LearningPath["lessons"]): LearningPath { return { id, title, lessons }; }

export const programmingWithPython = path("programming-with-python", "Programming with Python", programmingWithPythonRichLessons);
export const webAndApiFoundations = path("web-and-api-foundations", "Web and API Foundations", webAndApiFoundationsDeepLessons);
export const djangoAndApiEngineering = path("django-and-api-engineering", "Django and API Engineering", djangoAndApiRichLessons);
export const relationalDataAndPostgresql = path("relational-data-and-postgresql", "Relational Data and PostgreSQL", relationalDataAndPostgresqlDeepLessons);
export const identityAuthenticationAuthorization = path("identity-authentication-authorization", "Identity, Authentication and Authorization", identityAuthenticationAuthorizationDeepLessons);
export const softwareCraft = path("software-craft", "Software Craft", softwareCraftDeepLessons);

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
