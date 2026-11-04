import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { djangoAndApiRichLessons } from "./builder-django-rich";
import { djangoDependentPostgresqlQualityLessons } from "./builder-postgresql-quality";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "django-and-api-engineering-django-foundations": {
  "objective": "Create and explain the first Django project/application HTTP boundary without preempting ORM and migrations.",
  "scenario": "After the independent catalogue lesson, establish Steward's Django project and registry app in the real working repository. Do not define or migrate persistence models yet; those concepts are taught next.",
  "instructions": [
    "Keep the disposable tsa-django-intro scratch lab separate. In the existing Steward repository choose a nonconflicting Django project/package directory and activate the intended Python environment.",
    "Install Django as an explicit dependency, run startproject/startapp deliberately, and document manage.py, settings.py, urls.py, asgi.py/wsgi.py and apps.py. Keep the generated INSTALLED_APPS entries.",
    "Add the registry app to INSTALLED_APPS. Create a plain Django GET /health/ endpoint with complete view and route code. It can return fixed JSON without any database query.",
    "Run python manage.py check and start the development server only on 127.0.0.1. Use curl to prove 200 /health/, 404 for an unknown URL and 405 for a rejected method.",
    "Trace URL routing, view invocation and middleware response return. Distinguish a server-not-listening failure from a Django HTTP error.",
    "Record the eventual PostgreSQL DB target as a planned, unconfigured dependency; do NOT create Team, Service, Environment or migration tables until the model and migration lessons have explained the mechanism."
  ],
  "deliverables": [
    "Working Steward Django project and registry app",
    "Plain /health/ view with 200/404/405 transcript",
    "Project/app file map and request-flow diagram",
    "Explicit checkpoint noting that no ORM models or migrations were required"
  ],
  "completionCriteria": [
    "The learner can create a project and app without a hidden repository template.",
    "HTTP behavior is proved without PostgreSQL setup.",
    "No premature model or migration work is assigned.",
    "The next DRF activity can use this existing project."
  ]
},
  "django-and-api-engineering-django-rest-framework": {
  "objective": "Learn DRF Request/Response, parsers and renderers before attempting a model-backed Service API.",
  "scenario": "The plain Django /health/ endpoint is working in the new Steward project. Use a separate DRF-only endpoint with fixed input/output to observe the framework boundary without assuming Team and Service models already exist.",
  "instructions": [
    "Install djangorestframework and register rest_framework in the existing Steward Django project; retain the plain GET /health/ endpoint for comparison.",
    "Implement a complete POST /echo/ DRF @api_view whose JSONParser reads a small JSON object and whose JSONRenderer produces a response. Use a deliberate validation failure when the expected field is absent.",
    "Run a valid POST with Content-Type: application/json and Accept: application/json; record the JSON result. Verify the endpoint does not write any model rows.",
    "Run a GET to the POST-only route (405), malformed or invalid JSON field (400), unsupported request Content-Type (415) and unsupported response Accept (406) using the explicitly configured parser and renderer.",
    "Trace where DRF Request.data, the view, Response and rendering participate; explain the difference between a parser failure and a permission rejection.",
    "Compare this with the earlier plain JsonResponse endpoint. Defer GET /services and serializer-backed persistence until the model/migration/ORM bridge has been taught."
  ],
  "deliverables": [
    "Installed DRF and complete /echo/ source",
    "One success and four distinct failure-response transcripts",
    "Content-Type versus Accept comparison",
    "Explanation of why no persistence or ViewSet is required yet"
  ],
  "completionCriteria": [
    "DRF is demonstrated on an existing Django HTTP project.",
    "The student can independently classify parsing, rendering and method failures.",
    "No untaught Service models or database setup are prerequisites.",
    "The later applied Service API can reuse the demonstrated DRF boundary."
  ]
},
  "django-and-api-engineering-projects-applications-and-boundaries": {
    objective: "Design Django app boundaries for Steward from cohesion and dependency direction rather than database nouns.",
    scenario: "A proposed refactor creates one Django app per model: services, teams, environments and dependencies. Review the proposal before the repository becomes a web of cross-app imports.",
    instructions: ["Sketch at least two candidate app structures for Steward.", "For each, draw dependency arrows and identify likely coupling or cycles.", "Choose a structure and state the responsibility owned by each app.", "Implement only the minimum package/app changes needed to prove imports remain directional.", "Record one future signal that would justify splitting a boundary later."],
    deliverables: ["Alternative boundary sketches", "Dependency-direction diagram", "Chosen app structure", "Boundary decision record"],
    completionCriteria: ["Boundaries follow responsibilities rather than one-app-per-model convention.", "The selected design avoids unexplained circular dependencies.", "A rejected alternative is documented with a concrete cost."]
  },
  "django-and-api-engineering-models-and-domain-data": {
  "objective": "Define a first Django model and predict its table structure before creating it through migrations.",
  "scenario": "Use the existing disposable catalogue app to express a persistent Book record with Python fields. Do not prematurely map the full Steward schema.",
  "instructions": [
    "Create the exact reading's catalogue/models.py Book class with title, isbn and published_year in the scratch project.",
    "Explain models.Model, implicit primary key, each field type, unique=True, null=True and blank=True; distinguish the Python declaration from a real database table.",
    "Draw the expected table and identify which rule is enforced by SQL uniqueness and which requires separate application/form validation.",
    "Run python manage.py check to verify model configuration only. State why this does not prove that the table already exists.",
    "Identify the next migration step but leave makemigrations/migrate to the following dedicated lesson. Keep the original PostgreSQL Steward seed database untouched."
  ],
  "deliverables": [
    "Working Book model source",
    "Predicted field/table map",
    "Constraint-versus-validation explanation",
    "Migration prerequisite identified"
  ],
  "completionCriteria": [
    "The model uses no unexplained Team/Service dependencies.",
    "The learner knows no database table has yet been created.",
    "No persistent mutations or schema changes are required.",
    "The next migration lesson can execute the authored model."
  ]
},
  "django-and-api-engineering-create-your-first-django-migration": {
  "objective": "Generate, inspect and apply the first Django migration in a disposable database and prove a real uniqueness rule.",
  "scenario": "The Book model exists in Python but catalogue_book has not yet been created. Use the scratch project's default local SQLite database only for this first framework mechanism; the later Steward bridge uses its own PostgreSQL lab.",
  "instructions": [
    "Run python manage.py makemigrations catalogue and examine the generated 0001_initial.py; explain CreateModel and the fields it declares.",
    "Run python manage.py sqlmigrate catalogue 0001, inspect table creation/unique ISBN, and clarify that this prints SQL rather than applying it.",
    "Run python manage.py migrate and showmigrations catalogue; inspect applied state without deleting migration history or resetting unrelated data.",
    "Execute the published book_model_lab.py, which writes one idempotent book row, rereads it and proves a second row with the same ISBN causes an IntegrityError.",
    "Start a second Django shell and retrieve the same book to prove persistence across Python processes.",
    "Explain why the existing manually created tsa_steward_lab database is not automatically a Django-managed migration target."
  ],
  "deliverables": [
    "Generated and inspected initial migration",
    "Applied migration listing and table existence",
    "Successful/failed Book insert evidence",
    "Persistence across separate shell sessions",
    "Comparison of models, migration files and live schema"
  ],
  "completionCriteria": [
    "All commands run in the isolated scratch project.",
    "The exact source-published Book code executes with a database uniqueness failure.",
    "A schema change is not inferred from makemigrations alone.",
    "No existing Steward database or history is overwritten."
  ]
},
  "django-and-api-engineering-serializers-and-representation": {
    objective: "Treat serializers as a trust boundary and deliberately control what external clients can send and receive.",
    scenario: "A generated ModelSerializer exposes every model field as writable. Before clients depend on that contract, review the representation as untrusted input rather than a convenient mirror of the database.",
    instructions: ["Create separate examples of accepted input, syntactically valid but rejected input, and server-controlled output. Trace initial_data → is_valid() → validated_data → save()/instance → serialized .data for one request.", "Mark at least one field read-only and prove client input cannot override it.", "Add one validate_<field> hook and one validate(attrs) cross-field example; then perform a partial=True update and prove omitted fields are preserved rather than treated as null/reset.", "Move one rule out of the serializer if it clearly belongs to reusable domain/application logic.", "Compare serializer representation with the underlying model and note one intentional difference."],
    deliverables: ["Serializer implementation", "Accepted/rejected payload evidence", "Writable/read-only field table", "Validation-boundary decision"],
    completionCriteria: ["The serializer does not expose fields merely because the model has them.", "Representation validation and reusable domain rules are distinguished.", "Rejected client control is demonstrated with evidence."]
  },
  "django-and-api-engineering-views-viewsets-and-routing": {
    objective: "Keep HTTP orchestration thin and choose view abstractions that make Steward behavior easier, not harder, to understand.",
    scenario: "The /services endpoint has started accumulating queries, validation, domain rules and response shaping in one method. Refactor it while comparing explicit views with generic/ViewSet abstractions.",
    instructions: ["Implement or inspect list/create and detail operations using at least two levels of the DRF view abstraction ladder (for example APIView and a generic/ViewSet) before choosing one.", "Mark every line that belongs to HTTP orchestration, persistence, authorization, domain behavior or representation.", "Move at least one non-HTTP responsibility out of the view.", "Inspect router-generated routes/actions if using a ViewSet and map list/create/retrieve/update/partial_update/destroy to HTTP methods and collection/detail URLs.", "Add a custom action only if it represents a genuine domain operation, then justify why ordinary CRUD was insufficient."],
    deliverables: ["Responsibility-marked view review", "Refactored endpoint", "Route inventory", "View abstraction decision"],
    completionCriteria: ["Views coordinate rather than own business behavior.", "Generated routes can be explained.", "Any custom action has a domain reason rather than framework convenience."]
  },
  "django-and-api-engineering-validation-and-business-rules": {
    objective: "Place Steward rules where every caller can rely on them and reinforce critical invariants at appropriate lower layers.",
    scenario: "Self-dependency is rejected in one REST endpoint, but a management command can still create it. Treat this as a rule-placement defect rather than another serializer patch.",
    instructions: ["Reproduce self-dependency through two different entry paths and verify which validation hooks actually run; explicitly demonstrate that model save() does not automatically imply full_clean().", "Move or implement the rule in a reusable application/domain boundary.", "Add duplicate-dependency protection and decide whether a database constraint should reinforce it.", "Exercise one valid and two invalid operations outside a single view.", "Document how each rejection becomes an API error without making HTTP the owner of the rule."],
    deliverables: ["Multi-entry-point reproduction", "Reusable rule implementation", "Constraint decision", "Rule-to-API translation evidence"],
    completionCriteria: ["The same rule holds across more than one caller.", "Critical invariants are reinforced where justified.", "HTTP error translation is separated from domain-rule ownership."]
  },
  "django-and-api-engineering-api-error-handling": {
    objective: "Build a stable error contract that preserves the distinction between client mistakes, domain rejection and unexpected server failure.",
    scenario: "Steward currently returns framework-default errors for validation and a different shape for custom exceptions. A client team cannot implement reliable handling. Normalize deliberate failures without hiding server defects.",
    instructions: ["Define a stable error body with machine-readable code and human-readable message.", "Map malformed input, validation failure, missing resource, conflict and unexpected failure to deliberate status semantics.", "Trigger each category locally and capture the public response.", "Trigger one unexpected exception and verify sensitive internals are absent from the client response; route known application exceptions through a central DRF exception-translation boundary without swallowing unexpected defects.", "Record what diagnostic evidence remains available to operators."],
    deliverables: ["Error-contract specification", "Failure/status matrix", "Captured public responses", "Operator-evidence note"],
    completionCriteria: ["Distinct failure categories remain distinguishable.", "Clients do not receive stack traces or database internals.", "Unexpected failures are not disguised as client errors."]
  },
  "django-and-api-engineering-filtering-searching-and-ordering": {
    objective: "Expose query capabilities that answer real Steward questions without accidentally publishing an unbounded query language.",
    scenario: "A generic filter backend makes every field searchable and orderable. It is convenient, but nobody has decided whether those capabilities belong to the public contract or what they cost.",
    instructions: ["List the actual collection questions Steward clients need to ask.", "Implement explicit lifecycle, criticality and owner-team filters using an allowlisted FilterSet/backend contract rather than passing arbitrary query parameters into ORM lookups.", "Add bounded name search and deliberate ordering_fields. Include slug search only after the dedicated slug migration exists; inspect the public query-parameter contract and generated SQL.", "Attempt one unsupported query and confirm it is rejected or ignored predictably.", "Inspect at least one generated SQL query and identify a future performance concern."],
    deliverables: ["Supported-query matrix", "Implemented filters/search/order", "Unsupported-query evidence", "SQL observation note"],
    completionCriteria: ["Every exposed query capability maps to a known use case.", "Search, filtering and ordering are distinguished.", "The public surface is intentionally bounded."]
  },
  "django-and-api-engineering-pagination": {
    objective: "Make collection pagination deterministic, bounded and understandable under changing data.",
    scenario: "A client reports seeing duplicate services while paging through /services. The API uses framework-default pagination but never defined ordering or maximum size.",
    instructions: ["Create enough services to require multiple pages.", "Demonstrate the current ordering behavior and identify whether it is deterministic.", "Set explicit ordering, a sensible default page size and a maximum. Implement/compare page-number or limit-offset behavior with cursor pagination on the same changing collection.", "Test empty, one-page and multi-page collections.", "Insert or modify data between page requests and document what consistency guarantee the chosen pagination style does and does not provide."],
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
    instructions: ["Generate the Steward OpenAPI schema and identify its paths, operations, parameters/requestBody, responses, components/schemas and securitySchemes where applicable.", "Inspect /services request and response schemas field by field.", "Document at least two non-2xx responses with stable error shapes.", "Compare one documented request/response with a real curl exchange.", "Find and fix at least one meaningful schema/runtime mismatch."],
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
    instructions: ["Choose one successful and one rejected Steward operation.", "Define the diagnostic question each log event should answer before adding logging.", "Add contextual fields such as service identifier, operation and reason without logging credentials or tokens.", "Exercise multiple log levels and justify them. Inspect logger/handler hierarchy and propagation so you can explain where each record is emitted and avoid duplicate output.", "Add or propagate a request/correlation identifier where practical.", "Trigger an unexpected exception and compare its log evidence with an expected domain rejection."],
    deliverables: ["Logging event design", "Captured success/rejection/failure logs", "Sensitive-data review", "Log-level rationale"],
    completionCriteria: ["Logs answer concrete diagnostic questions.", "Expected rejection is not automatically treated as an application error.", "Sensitive authentication material is absent.", "Unexpected failure remains operationally distinguishable."]
  }
};

const djangoCoreQualityLessons: Lesson[] = djangoAndApiRichLessons.map((lesson) => ({
  ...lesson,
  activities: lesson.activities.map((activity) => {
    if (activity.content.type !== "practical") return activity;
    const practice = practices[lesson.id];
    return practice ? { ...activity, content: { type: "practical", ...practice } } : activity;
  }),
}));

// These data lessons require the Django project created above. They were authored
// with PostgreSQL material but belong here in learner-facing order.
export const djangoAndApiQualityLessons: Lesson[] = [
  ...djangoCoreQualityLessons,
  ...djangoDependentPostgresqlQualityLessons,
];
