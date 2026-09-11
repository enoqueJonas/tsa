import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { djangoAndApiRichLessons } from "./builder-django-rich";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "django-and-api-engineering-django-foundations": {
    objective: "Trace a real request through Django and establish where framework configuration ends and Steward domain behavior begins.",
    scenario: "A teammate can make Django return JSON but cannot explain which layer handled the request or where a service-registry rule should live. Before the codebase grows, produce a request-flow map and prove the boundary with a small endpoint.",
    instructions: ["Create or reuse the Steward Django project and one registry app.", "Send a request to a small health or registry endpoint and trace URL resolution, middleware, view execution and response creation.", "Annotate the project files as configuration, HTTP orchestration or domain/application behavior.", "Move one deliberately misplaced rule out of a view or configuration file into a more appropriate boundary.", "Capture one request that never reaches domain behavior and explain why."],
    deliverables: ["Request-flow diagram", "Annotated project-boundary map", "Before/after rule-placement example", "Captured request evidence"],
    completionCriteria: ["You can explain the request path without relying on Django magic.", "Framework configuration and domain behavior are visibly separated.", "At least one failure or short-circuit path is demonstrated."]
  },
  "django-and-api-engineering-django-rest-framework": {
    objective: "Compare plain Django and DRF at the HTTP boundary and choose abstractions from understood behavior rather than convenience.",
    scenario: "The Steward team is considering DRF. One engineer argues that every endpoint should become a ViewSet immediately. Build the same narrow endpoint with plain Django and DRF, then make the trade-off visible.",
    instructions: ["Implement the same GET behavior once with JsonResponse and once with DRF Response.", "Inspect request parsing, response rendering and content negotiation behavior.", "Add one invalid-method or unsupported-representation case and compare responses.", "List what DRF removes, what it adds and what it can hide.", "Choose the abstraction you would keep for this endpoint and justify it."],
    deliverables: ["Two runnable endpoint implementations", "Behavior comparison table", "Failure-case evidence", "Abstraction decision note"],
    completionCriteria: ["The comparison is based on observed behavior.", "You can explain what DRF contributes beyond Django.", "The chosen abstraction is justified rather than selected by habit."]
  },
  "django-and-api-engineering-projects-applications-and-boundaries": {
    objective: "Design Django app boundaries for Steward from cohesion and dependency direction rather than database nouns.",
    scenario: "A proposed refactor creates one Django app per model: services, teams, environments and dependencies. Review the proposal before the repository becomes a web of cross-app imports.",
    instructions: ["Sketch at least two candidate app structures for Steward.", "For each, draw dependency arrows and identify likely coupling or cycles.", "Choose a structure and state the responsibility owned by each app.", "Implement only the minimum package/app changes needed to prove imports remain directional.", "Record one future signal that would justify splitting a boundary later."],
    deliverables: ["Alternative boundary sketches", "Dependency-direction diagram", "Chosen app structure", "Boundary decision record"],
    completionCriteria: ["Boundaries follow responsibilities rather than one-app-per-model convention.", "The selected design avoids unexplained circular dependencies.", "A rejected alternative is documented with a concrete cost."]
  },
  "django-and-api-engineering-models-and-domain-data": {
    objective: "Model Steward data so persistence constraints reinforce domain meaning without pretending the database owns every business rule.",
    scenario: "The first models were generated quickly and mostly mirror request JSON. Review them as a domain model: decide what the database must guarantee and what remains operation-level behavior.",
    instructions: ["Implement or refine Team, Service and Environment with domain-language names and deliberate field types.", "Add at least one database-enforced invariant such as uniqueness.", "Represent lifecycle or criticality with constrained values.", "Identify one rule that depends on operation/state and should not exist only as a field constraint.", "Attempt one invalid write that the database should reject and one invalid operation that application logic should reject."],
    deliverables: ["Revised models", "Invariant placement table", "Database-rejection evidence", "Application-rule example"],
    completionCriteria: ["Database and application responsibilities are explicit.", "At least one invariant is protected below the HTTP layer.", "Model names and relationships reflect Steward rather than generic storage structures."]
  },
  "django-and-api-engineering-serializers-and-representation": {
    objective: "Treat serializers as a trust boundary and deliberately control what external clients can send and receive.",
    scenario: "A generated ModelSerializer exposes every model field as writable. Before clients depend on that contract, review the representation as untrusted input rather than a convenient mirror of the database.",
    instructions: ["Create separate examples of accepted input, syntactically valid but rejected input, and server-controlled output.", "Mark at least one field read-only and prove client input cannot override it.", "Add one field-level and one cross-field validation example.", "Move one rule out of the serializer if it clearly belongs to reusable domain/application logic.", "Compare serializer representation with the underlying model and note one intentional difference."],
    deliverables: ["Serializer implementation", "Accepted/rejected payload evidence", "Writable/read-only field table", "Validation-boundary decision"],
    completionCriteria: ["The serializer does not expose fields merely because the model has them.", "Representation validation and reusable domain rules are distinguished.", "Rejected client control is demonstrated with evidence."]
  },
  "django-and-api-engineering-views-viewsets-and-routing": {
    objective: "Keep HTTP orchestration thin and choose view abstractions that make Steward behavior easier, not harder, to understand.",
    scenario: "The /services endpoint has started accumulating queries, validation, domain rules and response shaping in one method. Refactor it while comparing explicit views with generic/ViewSet abstractions.",
    instructions: ["Implement or inspect list/create and detail operations.", "Mark every line that belongs to HTTP orchestration, persistence, authorization, domain behavior or representation.", "Move at least one non-HTTP responsibility out of the view.", "Inspect router-generated routes if using a ViewSet.", "Add a custom action only if it represents a genuine domain operation, then justify why ordinary CRUD was insufficient."],
    deliverables: ["Responsibility-marked view review", "Refactored endpoint", "Route inventory", "View abstraction decision"],
    completionCriteria: ["Views coordinate rather than own business behavior.", "Generated routes can be explained.", "Any custom action has a domain reason rather than framework convenience."]
  },
  "django-and-api-engineering-validation-and-business-rules": {
    objective: "Place Steward rules where every caller can rely on them and reinforce critical invariants at appropriate lower layers.",
    scenario: "Self-dependency is rejected in one REST endpoint, but a management command can still create it. Treat this as a rule-placement defect rather than another serializer patch.",
    instructions: ["Reproduce self-dependency through two different entry paths.", "Move or implement the rule in a reusable application/domain boundary.", "Add duplicate-dependency protection and decide whether a database constraint should reinforce it.", "Exercise one valid and two invalid operations outside a single view.", "Document how each rejection becomes an API error without making HTTP the owner of the rule."],
    deliverables: ["Multi-entry-point reproduction", "Reusable rule implementation", "Constraint decision", "Rule-to-API translation evidence"],
    completionCriteria: ["The same rule holds across more than one caller.", "Critical invariants are reinforced where justified.", "HTTP error translation is separated from domain-rule ownership."]
  },
  "django-and-api-engineering-api-error-handling": {
    objective: "Build a stable error contract that preserves the distinction between client mistakes, domain rejection and unexpected server failure.",
    scenario: "Steward currently returns framework-default errors for validation and a different shape for custom exceptions. A client team cannot implement reliable handling. Normalize deliberate failures without hiding server defects.",
    instructions: ["Define a stable error body with machine-readable code and human-readable message.", "Map malformed input, validation failure, missing resource, conflict and unexpected failure to deliberate status semantics.", "Trigger each category locally and capture the public response.", "Trigger one unexpected exception and verify sensitive internals are absent from the client response.", "Record what diagnostic evidence remains available to operators."],
    deliverables: ["Error-contract specification", "Failure/status matrix", "Captured public responses", "Operator-evidence note"],
    completionCriteria: ["Distinct failure categories remain distinguishable.", "Clients do not receive stack traces or database internals.", "Unexpected failures are not disguised as client errors."]
  },
  "django-and-api-engineering-filtering-searching-and-ordering": {
    objective: "Expose query capabilities that answer real Steward questions without accidentally publishing an unbounded query language.",
    scenario: "A generic filter backend makes every field searchable and orderable. It is convenient, but nobody has decided whether those capabilities belong to the public contract or what they cost.",
    instructions: ["List the actual collection questions Steward clients need to ask.", "Implement explicit lifecycle, criticality and owner-team filters.", "Add limited name/slug search and deliberate ordering fields.", "Attempt one unsupported query and confirm it is rejected or ignored predictably.", "Inspect at least one generated SQL query and identify a future performance concern."],
    deliverables: ["Supported-query matrix", "Implemented filters/search/order", "Unsupported-query evidence", "SQL observation note"],
    completionCriteria: ["Every exposed query capability maps to a known use case.", "Search, filtering and ordering are distinguished.", "The public surface is intentionally bounded."]
  },
  "django-and-api-engineering-pagination": {
    objective: "Make collection pagination deterministic, bounded and understandable under changing data.",
    scenario: "A client reports seeing duplicate services while paging through /services. The API uses framework-default pagination but never defined ordering or maximum size.",
    instructions: ["Create enough services to require multiple pages.", "Demonstrate the current ordering behavior and identify whether it is deterministic.", "Set explicit ordering, a sensible default page size and a maximum.", "Test empty, one-page and multi-page collections.", "Insert or modify data between page requests and document what consistency guarantee the chosen pagination style does and does not provide."],
    deliverables: ["Pagination configuration", "Multi-page evidence", "Ordering/consistency experiment", "Client-contract note"],
    completionCriteria: ["Pagination uses deterministic ordering.", "Response size is bounded.", "You can explain the consistency limitations of the chosen approach."]
  },
  "django-and-api-engineering-api-versioning": {
    objective: "Classify API changes by compatibility impact before reaching for a new version.",
    scenario: "Product asks for several changes and the immediate proposal is '/v2'. Review the changes first: some may be additive, some breaking, and some redesignable without parallel API versions.",
    instructions: ["Classify at least ten hypothetical Steward changes as additive, compatible behavior change or breaking.", "For three breaking candidates, explore whether the contract can evolve without a new major version.", "Compare URI and header/media-type versioning for Steward.", "Choose a versioning strategy and define when it should actually be invoked.", "Write a deprecation notice for one unavoidable breaking change."],
    deliverables: ["Compatibility classification table", "Alternative evolution analysis", "Versioning decision record", "Deprecation notice"],
    completionCriteria: ["Versioning follows compatibility analysis rather than habit.", "At least one apparent breaking change is reconsidered.", "Support/deprecation obligations are acknowledged."]
  },
  "django-and-api-engineering-openapi-and-swagger-documentation": {
    objective: "Use OpenAPI as contract evidence and detect drift between generated documentation and real runtime behavior.",
    scenario: "Swagger UI looks complete, but it documents only success responses and one field is writable in the schema even though runtime rejects it. Treat generated documentation as something to verify, not trust automatically.",
    instructions: ["Generate the Steward OpenAPI schema.", "Inspect /services request and response schemas field by field.", "Document at least two non-2xx responses with stable error shapes.", "Compare one documented request/response with a real curl exchange.", "Find and fix at least one meaningful schema/runtime mismatch."],
    deliverables: ["Generated OpenAPI schema", "Contract review notes", "Documented failure responses", "Before/after drift evidence"],
    completionCriteria: ["Documentation includes important failures, not only happy paths.", "At least one runtime comparison is performed.", "Generated output is reviewed as contract evidence rather than accepted blindly."]
  },
  "django-and-api-engineering-configuration-and-environments": {
    objective: "Turn environment-specific assumptions into an explicit configuration contract with safe defaults and fail-fast production behavior.",
    scenario: "The development setup works because DEBUG, hosts and service URLs are embedded in settings.py. A production deployment using the same defaults would be unsafe. Make environment ownership visible before Delivery school.",
    instructions: ["Inventory settings that genuinely vary by environment.", "Move environment-specific values out of source literals.", "Separate secret from non-secret configuration.", "Make one production-critical value mandatory and demonstrate startup failure when it is missing.", "Verify logs and repository history do not expose the secret value.", "Write a concise configuration contract for local and production-like environments."],
    deliverables: ["Configuration inventory", "Environment-driven settings", "Fail-fast evidence", "Secret-handling check", "Configuration contract"],
    completionCriteria: ["Unsafe production behavior is not enabled silently by development defaults.", "Critical missing configuration fails visibly.", "Secrets are neither committed nor logged."]
  },
  "django-and-api-engineering-application-logging": {
    objective: "Design application logs around diagnostic questions while keeping expected domain rejection distinct from unexpected failure.",
    scenario: "Current logs say 'request received' and 'something went wrong'. During an incident, neither line answers what operation failed, for which service, or whether the event was expected. Replace narration with useful operational evidence.",
    instructions: ["Choose one successful and one rejected Steward operation.", "Define the diagnostic question each log event should answer before adding logging.", "Add contextual fields such as service identifier, operation and reason without logging credentials or tokens.", "Exercise multiple log levels and justify them.", "Add or propagate a request/correlation identifier where practical.", "Trigger an unexpected exception and compare its log evidence with an expected domain rejection."],
    deliverables: ["Logging event design", "Captured success/rejection/failure logs", "Sensitive-data review", "Log-level rationale"],
    completionCriteria: ["Logs answer concrete diagnostic questions.", "Expected rejection is not automatically treated as an application error.", "Sensitive authentication material is absent.", "Unexpected failure remains operationally distinguishable."]
  }
};

export const djangoAndApiQualityLessons: Lesson[] = djangoAndApiRichLessons.map((lesson) => ({
  ...lesson,
  activities: lesson.activities.map((activity) => {
    if (activity.content.type !== "practical") return activity;
    const practice = practices[lesson.id];
    return practice ? { ...activity, content: { type: "practical", ...practice } } : activity;
  }),
}));
