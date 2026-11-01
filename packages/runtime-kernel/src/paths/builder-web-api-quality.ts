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
  "objective": "Explain method intent and observed status semantics using the exact disposable method server from the reading.",
  "scenario": "The GET-only mini-Steward server cannot demonstrate creation or deletion. Use the separate plain-text method_server.py experiment; its state is synthetic, in memory, and reset on restart.",
  "instructions": [
    "Save and start method_server.py on loopback. Run the eight published curl requests in order on a fresh instance.",
    "For each request capture method, target, handler, status, relevant headers, body and resulting state. Verify creation by following Location.",
    "Execute repeated valid POSTs and inspect the collection. Contrast repeated DELETE and GET effects.",
    "Execute PATCH and a missing GET target; distinguish the framework's 501 from 404, the explicit 405 contract, and business-input errors.",
    "Propose six future Steward method/status contracts and justify each. Do not claim the lab implements PUT, PATCH, JSON, authentication or persistence."
  ],
  "deliverables": [
    "Observed eight-request transcript plus unsupported-method and duplicate-creation experiments",
    "Before/after state trace",
    "Six proposed operation contracts with client actions"
  ],
  "completionCriteria": [
    "All eight statuses and Location/Allow/bodyless behavior are interpreted from actual output.",
    "The learner distinguishes 400, 404, 405, 415 and 501 by cause.",
    "Methods are justified by intended operation rather than URL naming.",
    "A changed status on repeated DELETE is not confused with a second deletion effect."
  ]
},
  "web-and-api-foundations-retries-idempotency-and-conditional-requests": {
  "objective": "Predict and diagnose duplicate effects and stale edits, and design a retry contract with explicit limits.",
  "scenario": "A timeout hides the server outcome. The published retry_model.py demonstrates decision rules in sequential Python, without claiming network, database or crash-safe implementation.",
  "instructions": [
    "Predict then execute retry_model.py; annotate every state mutation and returned result.",
    "Simulate response loss by ignoring the first create result, then retry with the same key. Repeat with a different key and compare collection length.",
    "Change editor B to use the current revision, predict the final name and verify it. Explain why fetching a version does not itself reconcile intent.",
    "Design a future operation-key scope, payload-mismatch policy, retention and in-progress behavior; identify the atomicity and restart gaps in the model.",
    "Explain proposed If-Match/412 versus If-None-Match/304 behavior and choose bounded retry/correction/reconciliation for timeout, 400 and 503."
  ],
  "deliverables": [
    "Executed model transcript and two changed-input experiments",
    "Operation-key contract and limitations",
    "Conditional-write and retry decision note"
  ],
  "completionCriteria": [
    "Safety and idempotency are defined separately and effects are inspected.",
    "The same operation keeps one key; a new intent gets a new key.",
    "A stale write is rejected and removing the guard is not claimed as conflict resolution.",
    "The model is explicitly sequential, volatile and not a production deduplication implementation."
  ]
},
  "web-and-api-foundations-json-and-content-types": {
    objective: "Distinguish parsing, shape validation and domain validation through independently executable Python, and correctly interpret HTTP representation headers without an unbuilt API.",
    scenario: "A teammate reports an 'invalid JSON' failure while another sends a correct-looking body with criticality banana. You do not yet have a Steward HTTP POST implementation, but you have Python's standard-library JSON parser, steward-core rules and a local read-only demo server.",
    instructions: [
      "Execute the lesson's json_boundary.py sample in Python, predict the four classifications before running it and compare with ACCEPTED / DOMAIN ERROR / SYNTAX ERROR / SHAPE ERROR.",
      "Change two inputs: use a permitted criticality, then use an integer for a text field. Classify which stage should reject each case and why.",
      "Run the lesson's missing-versus-null snippet. Explain why omitted, null, zero, empty array and empty string can have distinct contract meanings.",
      "Use the local read-only mini-Steward server to inspect actual Content-Type on GET /services, then vary Accept and record the observed behavior.",
      "Design (on paper) a future JSON POST /services contract, including correct request Content-Type, client Accept preference, one malformed representation and one syntactically valid but domain-invalid representation. Label this contract FUTURE, not implemented.",
      "Explain why POST against the current GET-only lab server would test an unimplemented method instead of Steward's JSON parsing or media-type policy."
    ],
    deliverables: ["Executed JSON classification transcript and changed-input analysis", "Omitted/null/zero contract decision", "Observed local Content-Type versus Accept evidence", "Future POST contract sketch with syntax, shape and domain failure distinctions"],
    completionCriteria: [
      "The Python examples are executed and actual output matches the stated seven-line total across two snippets.",
      "JSON syntax, expected object shape and business constraints are correctly distinguished.",
      "Omitted, explicit null and present zero are treated as different cases and have justified contract decisions.",
      "Content-Type and Accept are described separately and the current GET-only server's behavior is not claimed as proof of a hypothetical POST endpoint.",
      "The future contract includes distinct negative cases without pretending unimplemented infrastructure is running."
    ]
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
    objective: "Derive and test a public contract from the learner's actual Steward core.",
    scenario: "The earlier Python practicals supply name, endpoint, active and age_days behavior. Audit your own implementation before proposing new fields; no Django or persistence is assumed.",
    instructions: ["Inventory actual Service fields and operations with source references; label new identity and deferred domain fields.", "Execute contract_boundary.py and extend it with missing ageDays, negative age, an array and malformed JSON. Record the actual rejection stage.", "Adapt the boundary to your existing create operation and prove rejected input leaves registry size unchanged.", "Specify create, read-one and collection request/response contracts, including nullability, server-controlled fields, statuses and empty results.", "Change the old client to reject unknown fields, rerun the optional-field example and explain the compatibility difference.", "Design a name-to-displayName migration with old/new consumer tests and a removal policy."],
    deliverables: ["Actual-core inventory", "Executed boundary and failure transcript", "Three endpoint contracts", "Consumer compatibility experiment and migration plan"],
    completionCriteria: ["Current implementation and future proposals are distinguished.", "Syntax, shape and domain rejection are traced separately.", "Public fields are selected deliberately and invalid input does not mutate registry state.", "Compatibility conclusions cite executed consumer behavior.", "Independent transfer satisfies the five criteria in the reading; sample execution alone does not prove mastery."]
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
