import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const mdnHttp: LearningResource = { title: "MDN — An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview" };
const mdnMethods: LearningResource = { title: "MDN — HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods" };
const mdnStatus: LearningResource = { title: "MDN — HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" };
const rfc9110: LearningResource = { title: "RFC 9110 — HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110" };
const jsonSpec: LearningResource = { title: "RFC 8259 — The JavaScript Object Notation (JSON) Data Interchange Format", url: "https://www.rfc-editor.org/rfc/rfc8259" };

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function lesson(title: string, estimatedMinutes: number, blocks: LessonBlock[], objective: string, instructions: string[], check: string, resources: LearningResource[] = [mdnHttp]): Lesson {
  const id = `web-and-api-foundations-${slug(title)}`;
  return { id, title, activities: [
    { id: `${id}-concepts`, title: `${title}: Concepts and Mental Model`, estimatedMinutes, content: { type: "reading", body: blocks.find((b) => b.type === "paragraph")?.text ?? title, resources, blocks } },
    { id: `${id}-practice`, title: `${title}: Engineering Practice`, estimatedMinutes: 45, content: { type: "practical", objective, scenario: "Use real HTTP exchanges and the evolving Steward service-registry domain. Inspect what actually crosses the wire rather than relying only on framework abstractions.", instructions, deliverables: ["Captured request/response evidence", "Short engineering note explaining the observed behavior"], completionCriteria: ["The learner can explain the protocol behavior without relying on Postman screenshots alone.", "At least one failure, boundary or alternative case is examined.", "The explanation separates application semantics from transport details."] } },
    { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: check } },
  ] };
}

export const webAndApiFoundationsDeepLessons: Lesson[] = [
  lesson("How the Web Works", 40, [
    { type: "heading", id: "introduction", text: "From a URL to a response" },
    { type: "paragraph", text: "When a client calls an API, several systems cooperate before application code receives a request. A useful mental model is: identify the destination, establish a network path, negotiate a secure connection when HTTPS is used, send an HTTP message, let the server application process it, and return another HTTP message." },
    { type: "code", language: "text", caption: "A simplified request path", code: "Client\n  ↓ DNS lookup\nIP address\n  ↓ TCP connection\nTransport channel\n  ↓ TLS handshake for HTTPS\nSecure channel\n  ↓ HTTP request\nReverse proxy / web server\n  ↓\nSteward API\n  ↓\nHTTP response" },
    { type: "callout", tone: "note", title: "Layers matter", body: "DNS, TCP, TLS and HTTP solve different problems. A DNS failure is not an HTTP 404. A refused TCP connection is not an application validation error. Good debugging starts by identifying the failing layer." },
    { type: "heading", id: "urls", text: "URLs identify resources and destinations" },
    { type: "paragraph", text: "A URL carries structured information: scheme, host, optional port, path, query and fragment. For APIs, the path and query normally participate in identifying or selecting resources while the host tells the client which server to contact." },
    { type: "code", language: "text", caption: "Dissecting a Steward URL", code: "https://steward.example.com:443/services?criticality=high\n│       │                   │    │        │\n│       │                   │    │        └─ query\n│       │                   │    └────────── path\n│       │                   └─────────────── port\n│       └─────────────────────────────────── host\n└─────────────────────────────────────────── scheme" },
    { type: "heading", id: "request-response", text: "The web is request-response at this level" },
    { type: "paragraph", text: "HTTP gives clients and servers a shared message model. The client sends a request describing an intended operation; the server returns a response describing the result. Frameworks hide much of the message parsing, but they do not change the protocol contract." },
    { type: "callout", tone: "steward", title: "Steward connection", body: "Later Django code may expose /services, but a failure to resolve steward.example.com occurs before Django exists in the request path. This distinction becomes essential during Delivery, Cloud and Reliability schools." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Take three URLs and identify scheme, host, port, path and query.", "Use curl -v against a public HTTPS endpoint and identify where connection establishment ends and HTTP begins.", "Create a short failure map distinguishing DNS failure, connection refusal, TLS failure, HTTP 404 and HTTP 500.", "Explain which of those failures could occur before the Steward application executes any code."] },
    { type: "resources", title: "Required and supporting reading", resources: [mdnHttp] },
  ], "Explain and observe the path from a URL to an HTTP response.", ["Inspect a real URL component by component.", "Use curl -v to capture connection and protocol details.", "Create a five-layer failure map.", "Relate each failure to the component responsible."], "A user reports 'the API is down.' What observations would help you distinguish DNS, TCP/TLS and application failures?", [mdnHttp]),

  lesson("Client-Server Architecture", 35, [
    { type: "heading", id: "roles", text: "Client and server are roles" },
    { type: "paragraph", text: "Client and server describe roles in an interaction, not permanent identities of machines. A browser can be a client of Steward. Steward can itself become a client when calling another service. The server exposes behavior through an interface and controls the resources behind that interface." },
    { type: "code", language: "text", caption: "Roles in a service interaction", code: "Engineering Portal ──HTTP──> Steward API ──SQL──> PostgreSQL\n      client                  server/client          server" },
    { type: "heading", id: "boundaries", text: "A network boundary changes the contract" },
    { type: "paragraph", text: "A function call happens in one process with shared memory assumptions. A client-server interaction crosses a boundary where latency, partial failure, serialization, authentication and versioning matter. The network makes previously local assumptions observable." },
    { type: "callout", tone: "warning", title: "Do not confuse distribution with architecture quality", body: "Splitting code into a client and server can be useful, but adding network boundaries also creates failure modes and operational cost. TSA treats distribution as a trade-off, not a maturity badge." },
    { type: "heading", id: "statelessness", text: "Requests should carry enough context" },
    { type: "paragraph", text: "HTTP applications often benefit when each request carries the information needed to process it, while durable state lives in explicit stores such as a database. This is not the same as saying the entire system has no state." },
    { type: "callout", tone: "steward", title: "Steward connection", body: "The future portal may call Steward API as a client. Steward API owns service-registry rules and persists durable state. Keeping those responsibilities explicit makes later authorization and testing easier to reason about." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Draw the roles for browser → Steward API → PostgreSQL.", "List assumptions that become unsafe when a function call becomes an HTTP call.", "Identify which component should own the rule 'a service cannot depend on itself' and justify your answer."] },
    { type: "resources", resources: [mdnHttp] },
  ], "Model client/server responsibilities and the consequences of a network boundary.", ["Map a three-component interaction.", "List at least five consequences of crossing a process/network boundary.", "Assign domain ownership for two Steward rules.", "Describe one design that leaks server responsibility into the client."], "Why is 'client' not synonymous with 'browser'? What new failure modes appear when a local call becomes a network call?"),

  lesson("HTTP Requests and Responses", 45, [
    { type: "heading", id: "messages", text: "HTTP is a message protocol" },
    { type: "paragraph", text: "An HTTP request contains a method, target, headers and sometimes a body. A response contains a status code, headers and sometimes a body. Reading these raw parts is one of the highest-leverage habits for API engineering because it lets you reason underneath tools and frameworks." },
    { type: "code", language: "http", caption: "Example Steward request", code: "GET /services/42 HTTP/1.1\nHost: steward.example.com\nAccept: application/json\nAuthorization: Bearer <token>" },
    { type: "code", language: "http", caption: "Example response", code: "HTTP/1.1 200 OK\nContent-Type: application/json\nETag: \"service-42-v7\"\n\n{\n  \"id\": 42,\n  \"name\": \"Payments API\",\n  \"criticality\": \"high\"\n}" },
    { type: "heading", id: "headers", text: "Headers carry metadata" },
    { type: "paragraph", text: "Headers describe representation, authorization, caching, tracing and other metadata. The body carries a representation when one is needed. Treating everything as 'the JSON' hides important protocol behavior." },
    { type: "callout", tone: "warning", title: "A body is not guaranteed", body: "Many valid HTTP responses have no response body. Clients must use status and headers correctly instead of assuming every response is JSON." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Capture one GET and one POST using curl -i or curl -v.", "Label method, target, request headers, request body, status, response headers and response body.", "Change Accept or Content-Type deliberately and observe what the server does.", "Record one assumption your API client made that was not guaranteed by HTTP itself."] },
    { type: "resources", resources: [mdnHttp, rfc9110] },
  ], "Read and explain raw HTTP requests and responses.", ["Capture raw-ish HTTP evidence using curl.", "Annotate every major message component.", "Compare a request with and without a body.", "Explain one behavior controlled by headers rather than JSON."], "What information belongs to the request line, headers and body? Why is a 204 response different from a 200 response with an empty JSON object?", [mdnHttp, rfc9110]),

  lesson("Methods, Headers and Status Codes", 50, [
    { type: "heading", id: "methods", text: "Methods communicate intent" },
    { type: "paragraph", text: "HTTP methods carry semantics. GET retrieves a representation, POST commonly creates or triggers processing, PUT replaces a resource representation, PATCH applies partial modification, and DELETE requests removal. Correct method choice helps clients, caches, documentation and operators understand intent." },
    { type: "code", language: "http", caption: "Steward operations", code: "GET    /services/42\nPOST   /services\nPATCH  /services/42\nDELETE /services/42\n\nPOST   /services/42/dependencies" },
    { type: "heading", id: "safe-idempotent", text: "Safe and idempotent are protocol properties" },
    { type: "paragraph", text: "A safe method is intended not to change server state as a requested effect. An idempotent method can be repeated with the same intended effect. These properties matter for retries, proxies and failure recovery. POST is not automatically unsafe to retry in every application, but if repeated execution can create duplicates, the API must design around that risk." },
    { type: "heading", id: "status", text: "Status codes classify outcomes" },
    { type: "list", items: ["2xx: the request was successfully processed in the protocol/application sense.", "3xx: redirection or alternate location behavior.", "4xx: the request cannot be fulfilled as sent, including validation, authentication, authorization or missing-resource cases.", "5xx: the server failed while attempting a validly formed request."] },
    { type: "callout", tone: "steward", title: "Make failure semantics useful", body: "If Team A tries to modify a service owned by Team B, returning 500 hides a deliberate authorization decision as a server failure. Status design should preserve the difference between invalid input, missing authentication, forbidden action, missing resource and unexpected server failure." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Classify six Steward operations by method.", "Explain whether retrying each operation is safe and/or idempotent.", "Map validation failure, unauthenticated request, forbidden cross-team edit, missing service and database crash to appropriate status-code families.", "Inspect Retry-After, Location or ETag on a real API if available and explain the header's role."] },
    { type: "resources", resources: [mdnMethods, mdnStatus, rfc9110] },
  ], "Choose methods and status codes from intended semantics rather than convention alone.", ["Map Steward operations to methods.", "Classify safety and idempotency.", "Design statuses for five distinct failures.", "Inspect at least one response header that affects client behavior."], "Why are safety and idempotency useful to clients and infrastructure? Distinguish 400, 401, 403, 404 and 500 using Steward examples.", [mdnMethods, mdnStatus, rfc9110]),

  lesson("JSON and Content Types", 40, [
    { type: "heading", id: "representation", text: "JSON is a representation format" },
    { type: "paragraph", text: "JSON gives systems a portable way to exchange strings, numbers, booleans, null, arrays and objects. It does not carry Python classes, database constraints or domain guarantees. When a JSON document crosses an API boundary, the server must parse it and then validate its meaning." },
    { type: "code", language: "json", caption: "Steward service representation", code: "{\n  \"name\": \"Payments API\",\n  \"slug\": \"payments-api\",\n  \"criticality\": \"high\",\n  \"lifecycle\": \"production\",\n  \"ownerTeamId\": 7,\n  \"tags\": [\"payments\", \"tier-1\"]\n}" },
    { type: "heading", id: "content-type", text: "Content-Type and Accept answer different questions" },
    { type: "paragraph", text: "Content-Type tells the recipient what representation the message body uses. Accept tells the server which response representation the client can process. Confusing them produces subtle API bugs." },
    { type: "code", language: "http", caption: "Representation metadata", code: "POST /services HTTP/1.1\nContent-Type: application/json\nAccept: application/json\n\n{\"name\": \"Payments API\"}" },
    { type: "callout", tone: "warning", title: "Valid JSON is not valid domain data", body: "{\"criticality\":\"banana\"} is valid JSON. Steward must still reject it because the representation violates the service-registry contract." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Create valid JSON representations for a service and environment.", "Create syntactically valid JSON that violates Steward rules.", "Send a request with the wrong Content-Type and inspect the response.", "Explain how null differs from an omitted property for at least one Steward field."] },
    { type: "resources", resources: [jsonSpec, mdnHttp] },
  ], "Distinguish JSON syntax, HTTP representation metadata and domain validation.", ["Create valid and domain-invalid JSON.", "Test Content-Type behavior.", "Compare null with omission.", "Document what the parser can validate versus what the Steward domain must validate."], "Why does valid JSON not imply a valid API request? What is the difference between Content-Type and Accept?", [jsonSpec, mdnHttp]),

  lesson("REST Principles and Trade-offs", 50, [
    { type: "heading", id: "rest", text: "REST is an architectural style, not a URL naming recipe" },
    { type: "paragraph", text: "REST emphasizes resources, representations, uniform interfaces, stateless interactions and cache-aware constraints. In everyday API work, teams often use 'REST API' more loosely. TSA focuses on the useful design consequences rather than policing labels." },
    { type: "heading", id: "resources", text: "Model stable resources before actions" },
    { type: "paragraph", text: "Steward naturally exposes resources such as services, teams, environments and dependencies. Resource-oriented design tends to produce APIs whose behavior can be understood through common HTTP semantics." },
    { type: "code", language: "text", caption: "Resource-oriented Steward surface", code: "/teams\n/teams/7\n/services\n/services/42\n/services/42/environments\n/services/42/dependencies" },
    { type: "heading", id: "tradeoffs", text: "Not every domain action maps elegantly to CRUD" },
    { type: "paragraph", text: "Some operations are better represented as commands or domain actions. Forcing every workflow into generic create/update/delete semantics can reduce clarity. The design question is whether a resource model communicates the behavior accurately and predictably." },
    { type: "callout", tone: "note", title: "REST is not a maturity score", body: "An API is not better because it is more 'RESTful' in the abstract. Consistency, clear contracts, failure semantics, evolvability and suitability for consumers matter more than stylistic purity." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Model Steward services, teams and dependencies as resources.", "Choose one operation that feels awkward as generic CRUD and compare two possible API designs.", "Identify one benefit and one cost of stateless request handling.", "Explain which REST constraints matter most for Steward and which are less relevant at Builder stage."] },
    { type: "resources", resources: [rfc9110, mdnHttp] },
  ], "Use REST principles as design constraints while recognizing their trade-offs.", ["Draft resource-oriented Steward endpoints.", "Evaluate one command-like workflow.", "Compare two API shapes.", "Write a short decision explaining which option you prefer and why."], "Why is REST more than endpoint naming? Give one case where forcing an operation into CRUD could make an API less clear.", [rfc9110]),

  lesson("Modeling Resources and API Contracts", 55, [
    { type: "heading", id: "contract", text: "An API is a contract between independently changing systems" },
    { type: "paragraph", text: "The contract includes resource shape, field meaning, required and optional data, validation, methods, statuses, pagination, filtering and failure representations. Once clients depend on a behavior, changing it has compatibility consequences." },
    { type: "code", language: "json", caption: "A deliberate service contract", code: "{\n  \"id\": 42,\n  \"name\": \"Payments API\",\n  \"slug\": \"payments-api\",\n  \"criticality\": \"high\",\n  \"lifecycle\": \"production\",\n  \"ownerTeam\": {\n    \"id\": 7,\n    \"name\": \"Payments Engineering\"\n  }\n}" },
    { type: "heading", id: "domain-vs-representation", text: "A representation is not the domain model" },
    { type: "paragraph", text: "The API may expose a nested ownerTeam representation while the persistence model stores a foreign key and the domain layer enforces ownership rules. Treating every JSON field as a direct database column couples layers unnecessarily." },
    { type: "heading", id: "compatibility", text: "Contracts live over time" },
    { type: "paragraph", text: "Renaming a field, changing nullability, narrowing accepted values or changing status semantics can break consumers. Good API design asks not only 'does this work today?' but also 'what promises are we making?'" },
    { type: "callout", tone: "steward", title: "Steward contract example", body: "If lifecycle accepts development, uat, production and retired, those values become part of the public contract. Adding a new value may be compatible for some clients and breaking for clients that assume an exhaustive set." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Draft a create-service request and service response separately.", "Mark every field required, optional, nullable or server-generated.", "Define validation for lifecycle, criticality and ownerTeamId.", "Identify three future changes and classify their compatibility risk.", "Write one contract decision you would document before implementation."] },
  ], "Design a Steward resource contract independently from storage implementation.", ["Draft request and response schemas.", "Define field semantics and validation.", "Identify compatibility risks.", "Separate API representation decisions from persistence decisions."], "Why should API representations not simply mirror database tables? Give two examples of seemingly small changes that can break clients."),

  lesson("Errors and Status Design", 50, [
    { type: "heading", id: "errors", text: "Errors are part of the API contract" },
    { type: "paragraph", text: "A useful API does not merely return non-2xx statuses. It provides enough stable information for clients and operators to understand what failed, whether retrying makes sense, and what action could correct the request." },
    { type: "code", language: "json", caption: "Example domain error", code: "{\n  \"code\": \"service.self_dependency\",\n  \"message\": \"A service cannot depend on itself.\",\n  \"field\": \"dependsOnServiceId\"\n}" },
    { type: "heading", id: "categories", text: "Separate failure categories" },
    { type: "list", items: ["Malformed representation: the server cannot parse the request.", "Validation failure: data parses but violates field or domain rules.", "Authentication failure: caller identity is missing or invalid.", "Authorization failure: identity is known but the action is not permitted.", "Conflict: current state prevents the requested transition.", "Unexpected server failure: processing failed for reasons the client cannot correct directly."] },
    { type: "heading", id: "leakage", text: "Useful does not mean leaking internals" },
    { type: "paragraph", text: "Database stack traces, SQL errors and internal class names are excellent diagnostic evidence for controlled logs but poor public API responses. Error contracts should be actionable without disclosing unnecessary implementation details." },
    { type: "callout", tone: "warning", title: "Never turn every exception into 400", body: "Catching all failures and returning 'bad request' destroys the distinction between client-correctable input and server defects. That makes debugging, monitoring and client behavior worse." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Design responses for invalid criticality, self-dependency, duplicate dependency, missing authentication, forbidden cross-team edit and database outage.", "Choose a stable machine-readable code for each domain failure.", "Identify which details belong in logs but not in public responses.", "Explain retry behavior for each failure." ] },
    { type: "resources", resources: [mdnStatus, rfc9110] },
  ], "Design error responses that preserve failure meaning and support correct client behavior.", ["Map six Steward failures to status codes.", "Define machine-readable error codes.", "Classify retryability.", "Separate public error detail from internal diagnostics."], "Why is returning 400 for every failure harmful? How should a client distinguish validation, authorization, conflict and server failure?", [mdnStatus, rfc9110]),

  { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman", title: "Lab: Explore APIs with curl and Postman", activities: [
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-brief", title: "API Investigation Brief", estimatedMinutes: 20, content: { type: "reading", body: "Use curl as the evidence-first tool and Postman as a productivity tool. The goal is to prove that you can read HTTP independently of any specific client UI.", blocks: [
      { type: "heading", id: "objective", text: "Investigate an API from the wire outward" },
      { type: "paragraph", text: "Choose a stable public API or run a tiny local HTTP service. You will capture requests and responses, vary methods and headers, send valid and invalid JSON, classify status codes, and document what each observation proves." },
      { type: "callout", tone: "note", title: "Tool principle", body: "Postman can make exploration faster. curl makes protocol details explicit. You should be able to explain the exchange without depending on either tool's presentation layer." },
      { type: "resources", resources: [mdnHttp, mdnMethods, mdnStatus] },
    ] } },
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-build", title: "HTTP Investigation", estimatedMinutes: 150, content: { type: "practical", objective: "Investigate real API behavior and produce a protocol-level evidence pack.", scenario: "Before Django abstracts request parsing and response generation, prove that you can explain raw API behavior yourself.", instructions: ["Capture at least one GET, POST, PATCH/PUT and DELETE or equivalent exchange.", "For each exchange record URL components, method, relevant request headers, body, response status, response headers and body.", "Send malformed JSON and syntactically valid but semantically invalid data where the target API permits safe testing.", "Vary Accept and Content-Type and record the result.", "Identify one safe method and one idempotent method and demonstrate why the distinction matters.", "Create a failure table covering validation, missing resource, unauthorized/forbidden if available, and server-side failure or a documented substitute.", "Reproduce at least three exchanges in Postman and compare what the UI hides or adds.", "Write a one-page API contract sketch for a future Steward /services resource using what you learned."], deliverables: ["curl transcript or equivalent evidence", "Annotated request/response table", "Failure classification table", "Postman collection", "Draft Steward /services contract"], completionCriteria: ["The learner can reconstruct the meaning of each exchange from protocol evidence.", "HTTP status and application error semantics are not conflated.", "Content negotiation/representation metadata is demonstrated.", "The Steward contract sketch reflects explicit resource and failure semantics."] } },
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-review", title: "Module Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "Without looking at notes, explain the complete path from URL to response, the structure of an HTTP request and response, the difference between Content-Type and Accept, safe vs idempotent methods, what makes an API contract durable, and how you would distinguish malformed input, invalid domain data, forbidden action and server failure in Steward." } },
  ] },
];
