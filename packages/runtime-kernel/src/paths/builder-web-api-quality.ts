import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { webAndApiFoundationsDeepLessons } from "./builder-web-api-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "web-and-api-foundations-how-the-web-works": {
  "objective": "Diagnose web availability by locating DNS, transport, TLS and HTTP evidence without claiming offline experiments test HTTPS.",
  "scenario": "A teammate says the site is down. Prove the difference between an HTTP response and a connection failure locally before classifying public HTTPS behavior.",
  "instructions": [
    "Explain how the web differs from the internet and name the distinct responsibilities of client, HTTP endpoint and browser renderer.",
    "Create and run the local Python static server from the reading, then use curl from a second terminal to observe HTTP 200, HTTP 404 and connection refusal after stopping it.",
    "For each observation cite the status/output and component responsible; distinguish HTTP 404 produced by the file server from a Steward API error.",
    "Attempt the optional public HTTPS curl experiment only if allowed and available. Annotate observed DNS/transport/TLS/HTTP evidence; label steps you could not execute.",
    "Compare the common HTTP/1.1/2 TCP/TLS path with HTTP/3's QUIC-over-UDP boundary, without implying all HTTP must use TCP.",
    "Write a five-case failure map and an evidence-led first-response playbook."
  ],
  "deliverables": [
    "Local server command/transcript with three distinct outcomes",
    "Web request path annotated by layer",
    "Optional public HTTPS transcript or explicit external-network limitation",
    "Failure classification and first-response playbook"
  ],
  "completionCriteria": [
    "HTTP status is distinguished from DNS, TCP and TLS failures.",
    "An offline loopback test is not presented as TLS evidence.",
    "The browser/web/server responsibilities and HTTP/3 transport caveat are accurately explained.",
    "The incident response chooses observations before guessing causes."
  ]
},
  "web-and-api-foundations-urls-and-query-encoding": {
  "objective": "Construct, decode and debug URL components with validated Python examples rather than unsafe concatenation.",
  "scenario": "The planned Steward service registry supports future filters and identifiers. Before designing the API, prove how a URL transports those values and how a bad encoding changes the user's intent.",
  "instructions": [
    "Run url_parser.py from the reading using Python 3, and annotate the purpose of urlencode, urlsplit, parse_qs and quote.",
    "Modify the snippet to add tag=quality as a repeated parameter; verify the decoded list preserves all tags.",
    "Construct a filtered services URL for team 'platform & operations' and independently decode the query.",
    "Demonstrate how raw '&' accidentally alters a query, and compare an encoded slash with two literal path segments.",
    "Show which parts of a URL identify the origin, request target and client-side fragment.",
    "Specify how your API would reject or interpret duplicate limit parameters and why encoding cannot protect credentials placed in URLs."
  ],
  "deliverables": [
    "Executed Python and expected-output comparison",
    "Three correct encoded URLs and their decoded interpretations",
    "One demonstrated malformed-concatenation failure",
    "URL anatomy and origin diagram",
    "Duplicate-parameter and URL-sensitive-data policy"
  ],
  "completionCriteria": [
    "Examples execute and the displayed outputs match the Python code.",
    "The learner can explain plus and percent-encoding without treating encoding as encryption.",
    "Repeated parameters, path segments and fragment behavior are differentiated.",
    "A new URL with special characters can be assembled independently with the standard library."
  ]
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
    objective: "Translate understood failures and unexpected defects without confusing caller responsibility or leaking implementation details.",
    scenario: "Use the standalone error_boundary.py model before adapting actual Steward domain exceptions. Authentication and database failures remain explicitly proposed or synthetic.",
    instructions: ["Execute all seven cases and annotate detection layer, status/code, client action and diagnostic evidence.", "Add array, null and negative-age cases; identify the model's coarse object/age classification and improve it with a dedicated shape error.", "Inject KeyError after valid input and verify a generic 500 body with a matching internal event identifier, without private detail leakage.", "Design future 401 and 403 contracts, including the authentication challenge, without claiming credentials were verified.", "Map specific exceptions from your real core in an adapter; test pre-mutation rejection leaves state unchanged.", "Explain why timeout or 500 after a state change cannot prove rollback, and choose a bounded retry or reconciliation policy."],
    deliverables: ["Seven-case executed transcript", "Extended negative cases", "Public/internal evidence comparison", "Domain adapter and failure-state evidence", "Client-action policy"],
    completionCriteria: ["Client input errors remain distinct from unexpected server defects.", "Public codes remain stable independently of exception wording.", "Private implementation details are absent from responses.", "Synthetic failures and future identity contracts are accurately labeled.", "The learner explains uncertain mutation outcomes and satisfies the five-part transfer rubric independently."]
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
