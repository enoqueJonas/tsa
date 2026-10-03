import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { djangoAndApiRichLessons } from "./builder-django-rich";
import { djangoDependentPostgresqlQualityLessons } from "./builder-postgresql-quality";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "django-and-api-engineering-django-foundations": {
    objective: "Create Steward's first Django application and connect it to artifacts the learner already designed: the HTTP contract and PostgreSQL-backed domain.",
    scenario: "You now have three real inputs: a Python Steward domain history, an HTTP contract designed before frameworks, and a PostgreSQL schema you can query directly. Django does not exist yet. In this increment you will create it deliberately and trace one request through the framework without pretending a starter project was already provided.",
    instructions: [
      "From the steward-core repository, create a new working branch or checkpoint before introducing Django.",
      "Add Django as an explicit project dependency, then create the Steward Django project and a registry app. Record the generated files and explain manage.py, settings.py, urls.py, asgi.py/wsgi.py, apps.py and migrations instead of treating them as magic.",
      "Configure a local PostgreSQL connection using environment-owned configuration rather than embedding credentials in committed source.",
      "Create the minimum model/migration mapping needed for one existing Service concept. Where the Django model differs from your earlier SQL design, record the reason instead of silently replacing the design.",
      "Implement GET /services/health as the first narrow endpoint and return a small JSON response.",
      "Send a real request and trace ordered URL resolution, middleware request/response traversal, HttpRequest/view execution and HttpResponse creation.",
      "Annotate the important project files as framework configuration, HTTP orchestration, persistence mapping or domain/application behavior.",
      "Commit this checkpoint: later Django exercises may now rely on an actual Steward Django project."
    ],
    deliverables: ["Created Steward Django project and registry app", "Declared Django/PostgreSQL dependencies", "Environment-based database configuration", "Initial model/migration mapping", "Working health endpoint", "Request-flow diagram"],
    completionCriteria: ["The Django project is created in this exercise rather than assumed to pre-exist.", "The application can connect to the learner's Steward PostgreSQL environment.", "GET /services/health returns the expected JSON.", "The learner can trace the request path through Django.", "Framework configuration, persistence and domain responsibilities are distinguishable.", "Later Django lessons have an explicit checkpoint to continue from."]
  },
  "django-and-api-engineering-django-rest-framework": {
    objective: "Introduce Django REST Framework only after observing plain Django HTTP behavior, then use it to begin implementing the Service contract designed earlier.",
    scenario: "The previous checkpoint created a real Django project and a plain JSON health endpoint. Web/API Foundations already defined the intended Service contract. Now evaluate what DRF contributes before using it for the first contract-backed Service endpoint.",
    instructions: [
      "Continue from the Django project created in the previous checkpoint; do not create another project.",
      "Add Django REST Framework as an explicit dependency.",
      "Keep the existing plain Django health endpoint as a reference point.",
      "Implement a narrow read-only GET /services endpoint with DRF using persisted Service data from the current PostgreSQL-backed model.",
      "Compare plain Django HttpRequest/JsonResponse with DRF Request/Response for parsing, rendering and content negotiation; vary Content-Type and Accept independently.",
      "Send an unsupported method and unsupported request/response representation and capture the behavior. Identify where authentication, permission and throttling would occur even if those policies are not all implemented yet.",
      "Map the response fields back to the Service response contract created in Web/API Foundations and record any justified contract adjustment.",
      "Do not introduce a ViewSet merely because DRF provides one; later exercises will evaluate routing/view abstractions."
    ],
    deliverables: ["DRF dependency declaration", "Working GET /services endpoint", "Plain Django versus DRF comparison", "Failure-case evidence", "Contract traceability note"],
    completionCriteria: ["DRF is added to an existing Django application rather than appearing as hidden setup.", "GET /services reads real persisted Service data.", "The learner can explain what DRF contributes beyond JsonResponse.", "The endpoint is checked against the earlier HTTP contract.", "No framework abstraction is adopted before its trade-off is understood."]
  },
  "django-and-api-engineering-projects-applications-and-boundaries": {
    objective: "Design Django app boundaries for Steward from cohesion and dependency direction rather than database nouns.",
    scenario: "A proposed refactor creates one Django app per model: services, teams, environments and dependencies. Review the proposal before the repository becomes a web of cross-app imports.",
    instructions: ["Sketch at least two candidate app structures for Steward.", "For each, draw dependency arrows and identify likely coupling or cycles.", "Choose a structure and state the responsibility owned by each app.", "Implement only the minimum package/app changes needed to prove imports remain directional.", "Record one future signal that would justify splitting a boundary later."],
    deliverables: ["Alternative boundary sketches", "Dependency-direction diagram", "Chosen app structure", "Boundary decision record"],
    completionCriteria: ["Boundaries follow responsibilities rather than one-app-per-model convention.", "The selected design avoids unexplained circular dependencies.", "A rejected alternative is documented with a concrete cost."]
  },
  "django-and-api-engineering-models-and-domain-data": {
    objective: "Complete Steward's Django persistence model by mapping the relational design already built in PostgreSQL rather than inventing a new framework-shaped domain.",
    scenario: "The Django foundation checkpoint mapped enough Service data to prove the stack. PostgreSQL work already established Team, Service, Environment, ServiceDependency and ServiceReview relationships. Now bring those established facts into Django while deciding which invariants belong in database constraints and which remain operation-level behavior.",
    instructions: [
      "Place the PostgreSQL schema from the previous school beside the current Django models and create a field/relationship mapping.",
      "Implement or refine Team, Service, Environment and ServiceDependency using domain-language names. Explain null versus blank on one field, on_delete on each ForeignKey and whether any relationship needs an explicit through model.",
      "Generate and inspect migrations before applying them. Identify any SQL/schema effect that differs materially from the earlier relational design.",
      "Preserve at least one database-enforced invariant such as uniqueness and demonstrate a rejected invalid write.",
      "Keep one state/operation rule in application/domain behavior where a field constraint alone cannot express it correctly.",
      "Query the resulting model through Django and directly through PostgreSQL to verify that both views describe the same persisted facts.",
      "Record any intentional divergence from the earlier schema as a design decision rather than accidental framework drift."
    ],
    deliverables: ["SQL-to-Django mapping table", "Completed core models", "Reviewed migrations", "Database-rejection evidence", "Application-rule example", "Cross-check query evidence"],
    completionCriteria: ["Django models trace back to the relational model the learner actually built.", "Core relationships are not silently redesigned by framework convenience.", "At least one invariant is protected below the HTTP layer.", "Operation-level behavior is not forced into an inappropriate field constraint.", "Intentional schema changes are documented."]
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
    instructions: ["List the actual collection questions Steward clients need to ask.", "Implement explicit lifecycle, criticality and owner-team filters using an allowlisted FilterSet/backend contract rather than passing arbitrary query parameters into ORM lookups.", "Add limited name/slug search and deliberate ordering_fields; inspect the actual public query-parameter conventions and generated SQL.", "Attempt one unsupported query and confirm it is rejected or ignored predictably.", "Inspect at least one generated SQL query and identify a future performance concern."],
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
