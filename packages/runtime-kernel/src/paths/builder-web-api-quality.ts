import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { webAndApiFoundationsDeepLessons } from "./builder-web-api-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "web-and-api-foundations-how-the-web-works": {
    objective: "Diagnose an API availability report by separating DNS, connection, TLS and HTTP/application evidence instead of treating every failure as 'the API is down'.",
    scenario: "A developer reports that Steward is unavailable from their laptop. Another teammate immediately blames the API. You are the first engineer asked to investigate. Your job is not to guess the cause; it is to locate the failing layer and produce evidence another engineer could verify.",
    instructions: [
      "Choose a reachable HTTPS endpoint and write down scheme, host, port, path and query before running any tool; include one query value that requires URL encoding and show the encoded request target.",
      "Use curl -v (and a DNS lookup tool available on your machine) to capture name resolution, connection establishment, TLS negotiation and the HTTP exchange.",
      "Create a failure map for five cases: DNS resolution failure, refused connection, TLS/certificate failure, HTTP 404 and HTTP 500.",
      "For each case, state the earliest layer that can prove the failure and whether Steward application code would have executed.",
      "Produce a short triage sequence you would follow when someone says only 'the API is down'."
    ],
    deliverables: ["Annotated connection/HTTP transcript", "Five-case failure-layer map", "API-down triage sequence", "Short explanation of which failures occur before application code"],
    completionCriteria: ["DNS, TCP/TLS and HTTP/application failures are not conflated.", "Every diagnosis points to observable evidence rather than intuition.", "You can identify when an HTTP status proves that the request reached an HTTP server.", "Another engineer could follow your triage sequence without knowing the answer in advance."]
  },
  "web-and-api-foundations-client-server-architecture": {
    objective: "Design the first network boundary for the Steward core you already built and identify what must remain authoritative on the server.",
    scenario: "Your steward-core package is now installable and its domain behavior is understood locally. The next major increment is to expose that capability to clients. Before choosing Django or DRF, decide what changes when the existing local Service operations cross an HTTP boundary.",
    instructions: [
      "Start from the completed steward-core checkpoint; use Service creation, lookup and status change as the concrete behavior under discussion.",
      "Draw a proposed interaction Engineering Client → Steward HTTP API → Steward domain core. PostgreSQL is a later increment, so do not pretend it exists yet.",
      "Take the existing Service lookup and deactivation operations and compare local function calls with future HTTP calls: serialization, latency, authentication, timeout, partial failure and compatibility. For a timed-out state-changing request, explain why the client may not know whether the server committed the change.",
      "Decide which existing validation and Service invariants must remain authoritative behind the server boundary even if a future client also validates them.",
      "Sketch one bad design where a client alone enforces an important Service rule and explain how another client could bypass it.",
      "Record why this lesson designs the boundary but does not yet introduce a web framework."
    ],
    deliverables: ["Boundary diagram grounded in steward-core", "Local-call versus HTTP-call comparison", "Server-authority decision", "Client-bypass example", "Framework-deferral note"],
    completionCriteria: ["The design starts from Steward behavior the learner actually built.", "No database or framework is assumed to exist yet.", "Network-specific failure modes are explicit.", "Domain rules remain authoritative on the server side.", "The learner can explain why HTTP design precedes framework implementation."]
  },
  "web-and-api-foundations-http-requests-and-responses": {
    objective: "Read an HTTP exchange directly enough to explain what happened without relying on a framework debugger or API-client UI.",
    scenario: "A teammate sends you a screenshot showing '200 OK' and says the integration is correct. You are not willing to approve the claim until the complete request and response contract is visible.",
    instructions: [
      "Capture one GET exchange and one request with a body using curl -i or curl -v.",
      "Annotate method, target, request headers, request body, status, response headers and response body separately.",
      "Identify at least two pieces of behavior communicated outside the JSON body.",
      "Find or simulate a response with no body and explain why a client must not assume JSON is always present.",
      "Change one relevant request header and record exactly which part of the exchange changes.",
      "Capture or deliberately inspect one redirect and distinguish the original 3xx response from any follow-up request performed by the client."
    ],
    deliverables: ["Two annotated HTTP exchanges", "Header-behavior notes", "Bodyless-response analysis", "Before/after header experiment"],
    completionCriteria: ["Every major message component can be identified independently.", "Headers are not treated as incidental metadata.", "Status and body are interpreted separately.", "You can reconstruct the exchange without depending on Postman's presentation layer."]
  },
  "web-and-api-foundations-methods-headers-and-status-codes": {
    objective: "Design method, retry and status semantics for Steward operations so clients can behave correctly under success and failure.",
    scenario: "A proposed Steward API uses POST for every operation and returns 200 for every handled outcome with an error flag in JSON. Review it before implementation and replace convenience-driven choices with explicit HTTP semantics.",
    instructions: [
      "List at least six Steward operations, including retrieval, creation, partial update, deletion and dependency management.",
      "Choose a method for each operation and classify whether it is safe and/or idempotent.",
      "For each operation, describe what could happen if a client retries after losing the response.",
      "Map invalid input, missing authentication, forbidden cross-team edit, missing service, conflict, unsupported media type, rate limiting, temporary unavailability and unexpected server failure to specific status codes.",
      "Use 201/Location for a creation case, then explain one ETag conditional-request case and one Retry-After case.",
      "For a retryable creation-style POST, design an idempotency-key contract and explain what duplicate effect it prevents."
    ],
    deliverables: ["Steward operation/method matrix", "Retry-risk analysis", "Failure/status decision table", "Response-header behavior note"],
    completionCriteria: ["Method choices communicate operation intent.", "Safety and idempotency are explained rather than memorized.", "Client-correctable failures remain distinguishable from server failures.", "Retry behavior is considered explicitly for non-trivial operations."]
  },
  "web-and-api-foundations-json-and-content-types": {
    objective: "Separate JSON syntax, representation metadata and Steward domain validation by deliberately crossing each boundary with valid and invalid examples.",
    scenario: "An integration defect is reported as 'invalid JSON', but the payload parses correctly: its criticality is 'banana'. At the same time another caller sends genuine JSON with the wrong Content-Type. You must classify both failures accurately.",
    instructions: [
      "Create one valid Steward service JSON document and one malformed JSON document.",
      "Create a syntactically valid document that violates at least two Steward domain rules.",
      "Send JSON with the expected Content-Type, then repeat with an incorrect Content-Type and capture the difference. Also vary Accept to demonstrate that request representation and acceptable response representation are independent.",
      "Compare a field omitted entirely with the same field explicitly set to null and define the intended Steward meaning for each.",
      "Write a three-stage validation model: representation parsing, field/schema validation and domain validation."
    ],
    deliverables: ["Valid, malformed and domain-invalid payloads", "Content-Type experiment", "Omitted-versus-null contract decision", "Three-stage validation model"],
    completionCriteria: ["Valid JSON is not confused with valid domain data.", "Content-Type and Accept can be explained separately.", "Nullability and optionality are treated as contract decisions.", "The validation stages assign failures to the correct boundary."]
  },
  "web-and-api-foundations-rest-principles-and-trade-offs": {
    objective: "Design a resource-oriented Steward surface, then challenge it with a workflow that does not fit CRUD cleanly and make a defensible API-design decision.",
    scenario: "Two engineers propose competing Steward APIs. One insists every operation must be a pure CRUD resource. The other adds action endpoints whenever naming becomes difficult. You must design a coherent surface without treating REST purity or command endpoints as ideology.",
    instructions: [
      "Model services, teams, environments and dependencies as resources with example URLs.",
      "Choose one command-like Steward workflow and design it two ways: a resource-oriented form and an explicit action/command form.",
      "Compare the two designs for clarity, HTTP semantics, discoverability, retry behavior and future evolution.",
      "Design filtering, sorting and pagination semantics for GET /services; compare simple offset/page pagination with a cursor for a collection that can change while clients traverse it.",
      "Identify one benefit and one cost of stateless request handling for Steward.",
      "Write a short decision record choosing the API shape you would implement now and naming the evidence that could make you revisit it."
    ],
    deliverables: ["Resource map", "Two competing workflow designs", "Trade-off comparison", "API design decision record"],
    completionCriteria: ["Resources are modeled from domain concepts rather than URL aesthetics.", "A non-CRUD workflow is evaluated honestly rather than forced into a preferred style.", "The chosen design has explicit trade-offs.", "REST is treated as an architectural constraint set, not a maturity score."]
  },
  "web-and-api-foundations-modeling-resources-and-api-contracts": {
    objective: "Turn the existing Steward Service capability into an explicit HTTP contract without coupling the contract to a database or framework that has not been built yet.",
    scenario: "You already have a Service model and registry behavior in steward-core. Clients now need a stable way to create and read Services over HTTP. Define that public contract before PostgreSQL or Django can accidentally dictate it.",
    instructions: [
      "Inventory the Service fields and behavior that exist at the end of Programming with Python.",
      "Draft a create-service JSON request using the existing concepts. Mark each field required, optional or server-controlled.",
      "Draft a service-response representation and decide whether internal implementation details such as Python class names should appear. They should not appear merely because they exist.",
      "Map the existing Service validation failures and missing-Service failure to proposed HTTP status/error semantics.",
      "Define GET /services, POST /services and GET /services/{id-or-slug} at contract level. You are designing requests/responses, not implementing Django.",
      "Add one future field such as criticality or ownerTeamId as explicitly deferred if it is not yet present in steward-core; do not rewrite history and claim it already exists.",
      "Define a collection response for GET /services including supported filter/sort/pagination behavior.",
      "Classify four proposed changes—optional response field, new enum value, required request field, removed field—by compatibility risk and define how one breaking change would be deprecated/migrated rather than reflexively adding /v2.",
      "Write one compatibility risk for a future contract change."
    ],
    deliverables: ["Current-domain inventory", "Create request contract", "Service response contract", "Initial endpoint contract", "Failure mapping", "Deferred-field note"],
    completionCriteria: ["The API contract grows from the current Steward implementation.", "Request and response semantics are explicit.", "Future fields are labeled as future rather than treated as existing state.", "No persistence detail leaks into the public contract.", "A later framework can implement this contract without defining it retroactively."]
  },
  "web-and-api-foundations-errors-and-status-design": {
    objective: "Design a Steward failure contract that lets clients distinguish correction, authentication, authorization, conflict, retry and unexpected server failure without leaking internal diagnostics.",
    scenario: "A prototype wraps every exception and returns HTTP 400 with the original exception message. It appears user-friendly, but database failures now look like bad input and SQL details can reach callers. Replace the design with a stable failure contract.",
    instructions: [
      "Model six failures: invalid criticality, self-dependency, duplicate dependency, missing authentication, forbidden cross-team edit and database outage.",
      "Assign a status and stable machine-readable error code to each, and define a consistent error envelope that can carry field details plus a request/correlation identifier.",
      "For every case, state what the client should do next: correct input, authenticate, stop, retry later or escalate.",
      "Separate fields suitable for a public response from details that belong only in controlled logs.",
      "Take one low-level database exception and show how you would prevent its raw text from becoming the public API contract."
    ],
    deliverables: ["Six-case failure contract", "Client-action/retry table", "Public-versus-internal diagnostic split", "Exception-leakage remediation example"],
    completionCriteria: ["Different failure categories remain observable to clients.", "Stable error codes do not depend on raw exception text.", "Unexpected server defects are not mislabeled as client errors.", "Public responses are actionable without exposing unnecessary internals."]
  }
};

export const webAndApiFoundationsQualityLessons: Lesson[] = webAndApiFoundationsDeepLessons.map((lesson) => ({
  ...lesson,
  activities: lesson.activities.map((activity) => {
    if (activity.content.type !== "practical") return activity;
    const practice = practices[lesson.id];
    return practice ? { ...activity, content: { type: "practical", ...practice } } : activity;
  }),
}));
