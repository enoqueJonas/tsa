import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { webAndApiFoundationsDeepLessons } from "./builder-web-api-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "web-and-api-foundations-how-the-web-works": {
    objective: "Diagnose an API availability report by separating DNS, connection, TLS and HTTP/application evidence instead of treating every failure as 'the API is down'.",
    scenario: "A developer reports that Steward is unavailable from their laptop. Another teammate immediately blames the API. You are the first engineer asked to investigate. Your job is not to guess the cause; it is to locate the failing layer and produce evidence another engineer could verify.",
    instructions: [
      "Choose a reachable HTTPS endpoint and write down the URL components before running any tool.",
      "Use curl -v (and a DNS lookup tool available on your machine) to capture name resolution, connection establishment, TLS negotiation and the HTTP exchange.",
      "Create a failure map for five cases: DNS resolution failure, refused connection, TLS/certificate failure, HTTP 404 and HTTP 500.",
      "For each case, state the earliest layer that can prove the failure and whether Steward application code would have executed.",
      "Produce a short triage sequence you would follow when someone says only 'the API is down'."
    ],
    deliverables: ["Annotated connection/HTTP transcript", "Five-case failure-layer map", "API-down triage sequence", "Short explanation of which failures occur before application code"],
    completionCriteria: ["DNS, TCP/TLS and HTTP/application failures are not conflated.", "Every diagnosis points to observable evidence rather than intuition.", "You can identify when an HTTP status proves that the request reached an HTTP server.", "Another engineer could follow your triage sequence without knowing the answer in advance."]
  },
  "web-and-api-foundations-client-server-architecture": {
    objective: "Define client/server responsibilities for Steward and expose the assumptions that become unsafe when a local call crosses a network boundary.",
    scenario: "The current Steward prototype is mostly local Python code. The team is about to introduce a portal calling a Steward API. Before anyone splits code into services, you must make the new boundary explicit and decide which responsibilities must remain server-owned.",
    instructions: [
      "Draw the interaction Engineering Portal → Steward API → PostgreSQL and label the client/server role at each edge.",
      "Take one existing local function call and list what changes when it becomes an HTTP call: latency, serialization, authentication, timeout, partial failure and version compatibility.",
      "Decide where the rule 'a service cannot depend on itself' belongs and defend the decision.",
      "Invent one design where the browser incorrectly owns a server/domain responsibility and explain how a second client could bypass it.",
      "Write one reason not to introduce an additional network boundary yet."
    ],
    deliverables: ["Interaction/boundary diagram", "Local-call versus network-call risk table", "Domain-ownership decision", "Responsibility-leak example", "Boundary restraint note"],
    completionCriteria: ["Client and server are treated as interaction roles, not device types.", "The network boundary introduces explicit engineering consequences.", "Domain enforcement remains authoritative on the server side.", "Distribution is justified as a trade-off rather than assumed to be architectural progress."]
  },
  "web-and-api-foundations-http-requests-and-responses": {
    objective: "Read an HTTP exchange directly enough to explain what happened without relying on a framework debugger or API-client UI.",
    scenario: "A teammate sends you a screenshot showing '200 OK' and says the integration is correct. You are not willing to approve the claim until the complete request and response contract is visible.",
    instructions: [
      "Capture one GET exchange and one request with a body using curl -i or curl -v.",
      "Annotate method, target, request headers, request body, status, response headers and response body separately.",
      "Identify at least two pieces of behavior communicated outside the JSON body.",
      "Find or simulate a response with no body and explain why a client must not assume JSON is always present.",
      "Change one relevant request header and record exactly which part of the exchange changes."
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
      "Map invalid input, missing authentication, forbidden cross-team edit, missing service, conflict and unexpected server failure to status codes or status families.",
      "Choose one response header such as Location, ETag or Retry-After and explain how it changes correct client behavior."
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
      "Send JSON with the expected Content-Type, then repeat with an incorrect Content-Type and capture the difference.",
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
      "Identify one benefit and one cost of stateless request handling for Steward.",
      "Write a short decision record choosing the API shape you would implement now and naming the evidence that could make you revisit it."
    ],
    deliverables: ["Resource map", "Two competing workflow designs", "Trade-off comparison", "API design decision record"],
    completionCriteria: ["Resources are modeled from domain concepts rather than URL aesthetics.", "A non-CRUD workflow is evaluated honestly rather than forced into a preferred style.", "The chosen design has explicit trade-offs.", "REST is treated as an architectural constraint set, not a maturity score."]
  },
  "web-and-api-foundations-modeling-resources-and-api-contracts": {
    objective: "Write a Steward service contract that is deliberately independent from persistence details and test how proposed changes affect consumers over time.",
    scenario: "The database model for Service already exists, and a teammate suggests returning the table almost unchanged as JSON to save time. Before clients depend on that shape, you must define the API contract as a separate public decision.",
    instructions: [
      "Draft separate create-service request and service-response representations.",
      "For every field, mark required, optional, nullable or server-generated and explain at least three choices.",
      "Define validation and meaning for lifecycle, criticality and ownerTeamId without referring to database column types as the justification.",
      "Propose three future changes such as renaming a field, adding an enum value or changing nullability and classify each consumer-compatibility risk.",
      "Identify one database detail you deliberately refuse to expose and explain the coupling it would create."
    ],
    deliverables: ["Create request contract", "Service response contract", "Field-semantics table", "Compatibility-risk analysis", "Persistence-decoupling note"],
    completionCriteria: ["Request and response shapes are designed for their consumers rather than copied from storage.", "Field optionality and nullability are explicit.", "Compatibility is evaluated from the client's perspective.", "At least one persistence detail is intentionally kept behind the API boundary."]
  },
  "web-and-api-foundations-errors-and-status-design": {
    objective: "Design a Steward failure contract that lets clients distinguish correction, authentication, authorization, conflict, retry and unexpected server failure without leaking internal diagnostics.",
    scenario: "A prototype wraps every exception and returns HTTP 400 with the original exception message. It appears user-friendly, but database failures now look like bad input and SQL details can reach callers. Replace the design with a stable failure contract.",
    instructions: [
      "Model six failures: invalid criticality, self-dependency, duplicate dependency, missing authentication, forbidden cross-team edit and database outage.",
      "Assign a status and stable machine-readable error code to each.",
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
