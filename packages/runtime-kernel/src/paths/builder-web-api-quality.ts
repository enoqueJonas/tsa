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
  "objective": "Define and defend a client–server boundary for the current Steward core and collect independent runtime evidence from a synthetic local HTTP client and server.",
  "scenario": "The learner has steward-core domain behavior but not yet a Steward HTTP API or PostgreSQL integration. The decision is whether and how to expose those operations to a future Engineering Portal. Prove the basic request/response interaction with an isolated standard-library demo before designing the future boundary.",
  "instructions": [
    "From memory, define the architecture in terms of client, server, contract, protocol and authority; explain why 'server' need not mean a physical machine.",
    "Run the Python standard-library server from the reading. In a second terminal execute curl -i for /services and /missing, stop the server, and repeat /services. Record actual HTTP 200, HTTP 404 and connection-error evidence; do not fabricate output.",
    "Annotate the three observations with the responsible layer, which process performed the work and why a connection refusal is not an HTTP status.",
    "Draw the proposed Engineering Portal -> Steward HTTP API -> steward-core boundary. Distinguish planned code from existing steward-core. Explicitly omit PostgreSQL at this stage.",
    "Contrast the current client–server proposal with a peer-to-peer alternative; then explain why modular monolith versus microservices is a different architectural dimension.",
    "Explain with a concrete bypass why a browser-only self-dependency check is insufficient and where that invariant must be enforced.",
    "Describe the timeout ambiguity for a hypothetical state-changing request: request lost versus change committed but response lost. Say what evidence would disambiguate them.",
    "Write a concise design decision containing the chosen boundary, its benefits, its costs, one rejected alternative and a specific condition that would make you reconsider."
  ],
  "deliverables": [
    "Observed transcript for successful, nonexistent-path and stopped-server requests",
    "Annotated architecture and process diagram grounded in existing steward-core",
    "Comparison of client–server, peer-to-peer, modular monolith and microservices",
    "Authoritative-rule and bypass analysis",
    "Timeout outcome analysis",
    "Evidence-based architectural decision"
  ],
  "completionCriteria": [
    "A precise definition, not a list of technologies, explains what the client and server do.",
    "The demo was actually executed and its three observed outcomes are correctly differentiated.",
    "The architecture uses the real current Steward increment and does not invent PostgreSQL or a framework implementation.",
    "The explanation distinguishes communication roles from deployment style and tier count.",
    "The server-side domain rule and the risk of client-only checks are justified.",
    "Timeout uncertainty and a safe verification strategy are explained.",
    "The final architecture decision names a genuine trade-off, an alternative and a decision reversal trigger."
  ]
},
  "web-and-api-foundations-client-server-boundaries-and-failure-modes": {
    objective: "Execute the actual mini-Steward HTTP server and distinguish normal responses from transport failure, then defend a proposed future API boundary.",
    scenario: "The existing steward-core library is local. You have not yet implemented Django, DRF or PostgreSQL. The lesson supplies a synthetic read-only Python HTTP server: execute it separately from curl, observe the failure boundaries and explain what an API would add to your domain core.",
    instructions: [
      "Save the exact mini_steward_server.py from the lesson into a disposable directory. State where its synthetic data lives and why this is not a production Steward API.",
      "Use two terminals to start the server bound to 127.0.0.1 and request /services; capture the actual status, Content-Type and JSON fields, and explain each process's role.",
      "Request /missing; capture HTTP 404 and the evidence that an HTTP server answered.",
      "Stop the server with Ctrl+C and repeat the /services request; record the connection failure and explain why it cannot be described by an HTTP status code.",
      "Describe what changed between a local steward-core function call and a network request: representation, latency, trust, error reporting, version compatibility and independent process failure.",
      "Draw both valid server outcomes after the client times out on a future state-changing operation; state what observation or operation identifier could make retry safer.",
      "Write a short architectural decision for one proposed Steward HTTP API versus clients accessing underlying data directly. Label every planned dependency as future."
    ],
    deliverables: [
      "Executed mini_steward_server.py and curl transcripts for 200, 404 and connection refusal",
      "Annotated two-process diagram and JSON response explanation",
      "Local function versus HTTP boundary comparison",
      "Two-outcome timeout analysis",
      "Steward API boundary decision including rejected alternative"
    ],
    completionCriteria: [
      "The local sample executes in two processes and the learner captures observable 200, 404 and non-HTTP connection-failure evidence.",
      "The learner identifies which system holds the synthetic data, what gets serialized into the response, and why a Python object is not shared over the wire.",
      "The learner can explain which changes have been implemented versus merely proposed.",
      "A timeout is correctly treated as an unknown outcome, not proof of cancellation or non-execution.",
      "Business invariants remain server-authoritative and alternatives are compared against operational costs, not slogans."
    ]
  },
  "web-and-api-foundations-http-requests-and-responses": {
    objective: "Explain every meaningful part of an HTTP exchange using real evidence, including where protocol metadata stops and representation content begins.",
    scenario: "A teammate reports that a single HTTP 200 screenshot proves the Steward integration works. You have the disposable mini-Steward Python server from the previous lesson and must demonstrate what a raw response does and does not establish before drawing conclusions.",
    instructions: [
      "Start mini_steward_server.py on loopback, then use curl -i --http1.1 /services and /missing; record the actual status, headers and response body. Do not invent a currently running Steward API.",
      "Use curl -v --http1.1 to identify the outgoing request versus incoming response. Annotate the request method, target, Host, Accept and the separation between headers and body.",
      "Explain why Python may reply with HTTP/1.0 even when curl sends HTTP/1.1 and why protocol semantics still make sense.",
      "Send Accept: text/plain to /services and compare the resulting Content-Type and body with the original request. Explain why the preference is not enforced automatically by the teaching server.",
      "Classify the /missing response as a real HTTP 404 with an HTML body, not a transport failure or a JSON contract.",
      "Analyze the illustrative 204 No Content and 200 with {} responses from the lesson. Predict the result of a client that always JSON-parses a successful response.",
      "Write a short evidence-based verdict explaining why a 200 alone cannot demonstrate correct service data, authorization or a successful state change."
    ],
    deliverables: ["Annotated real 200 and 404 HTTP exchanges", "curl -v client/server transcript", "Accept-versus-Content-Type negative experiment", "204-versus-200 interpretation", "Evidence-based integration verdict"],
    completionCriteria: [
      "The learner labels request/response lines, headers, empty line and optional content without confusing URL, message and connection layers.",
      "Actual status and representation are collected from the runnable example rather than copied from a fabricated transcript.",
      "The Accept negative experiment demonstrates observed server behavior and the limits of client preference headers.",
      "204 is correctly understood to be bodyless, unlike a 200 containing an empty JSON object.",
      "The final verdict distinguishes protocol success from verified application semantics."
    ]
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
