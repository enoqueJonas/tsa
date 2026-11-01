import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const mdnHttp: LearningResource = { title: "MDN — An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview" };
const mdnMethods: LearningResource = { title: "MDN — HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods" };
const mdnStatus: LearningResource = { title: "MDN — HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" };
const rfc9110: LearningResource = { title: "RFC 9110 — HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110" };
const jsonSpec: LearningResource = { title: "RFC 8259 — The JavaScript Object Notation (JSON) Data Interchange Format", url: "https://www.rfc-editor.org/rfc/rfc8259" };
const jsonVideo: LearningResource = { title: "Computerphile — JSON, not Jason", url: "https://www.youtube.com/watch?v=A0hoqSkyY7o", kind: "video", read: "Whole short video", purpose: "Optional visual reinforcement for JSON as a data-interchange representation." };

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function lesson(title: string, estimatedMinutes: number, blocks: LessonBlock[], objective: string, instructions: string[], check: string, resources: LearningResource[] = [mdnHttp]): Lesson {
  const id = `web-and-api-foundations-${slug(title)}`;
  return { id, title, activities: [
    { id: `${id}-concepts`, title: `${title}: Concepts and Mental Model`, estimatedMinutes, content: { type: "reading", body: blocks.filter((b) => b.type === "paragraph").map((b) => b.text).join("\n\n") || title, resources, blocks } },
    { id: `${id}-practice`, title: `${title}: Engineering Practice`, estimatedMinutes: 45, content: { type: "practical", objective, scenario: "Use real HTTP exchanges and the evolving Steward service-registry domain. Inspect what actually crosses the wire rather than relying only on framework abstractions.", instructions, deliverables: ["Reproducible request/response evidence including method, URL, relevant headers/body and observed response", "Short engineering note explaining the observed behavior"], completionCriteria: ["Another learner could reproduce the exchange without relying on a Postman screenshot alone.", "At least one failure, boundary or alternative case is executed and its observed response is recorded.", "The explanation separates application semantics from transport details."] } },
    { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: check } },
  ] };
}

export const webAndApiFoundationsDeepLessons: Lesson[] = [
  lesson("How the Web Works", 40, [
    { type: "heading", id: "introduction", text: "From a URL to a response" },
    { type: "paragraph", text: "At the simplest useful level, the web is a request/response interaction: a client sends an HTTP request to a server, and the server returns an HTTP response. The request says what resource or operation the client wants; the response carries a status plus any returned representation or metadata." },
    { type: "code", language: "text", caption: "The basic HTTP interaction", code: "Client  ── HTTP request ──>  Server\nClient  <─ HTTP response ──  Server" },
    { type: "paragraph", text: "That simple model remains true even when the real path has more layers. Before an HTTPS request can reach application code, the client normally has to resolve a host name, establish transport connectivity and negotiate TLS. We will add those layers one at a time rather than treating them as one opaque 'API call'." },
    { type: "code", language: "text", caption: "A simplified request path", code: "Client\n  ↓ DNS lookup\nIP address\n  ↓ TCP connection\nTransport channel\n  ↓ TLS handshake for HTTPS\nSecure channel\n  ↓ HTTP request\nReverse proxy / web server\n  ↓\nSteward API\n  ↓\nHTTP response" },
    { type: "callout", tone: "note", title: "Layers matter", body: "DNS, TCP, TLS and HTTP solve different problems. A DNS failure is not an HTTP `404`. A refused TCP connection is not an application validation error. Good debugging starts by identifying the failing layer." },
    { type: "heading", id: "dns-tcp-tls", text: "DNS, TCP and TLS establish different prerequisites" },
    { type: "paragraph", text: "DNS answers a naming question: which network address should this host name resolve to? A successful DNS lookup does not prove that an application is running at that address. TCP then establishes a transport connection to an address and port. A successful TCP connection proves that the connection was accepted at that endpoint, not that the application will return a successful HTTP response. With HTTPS, TLS runs over the transport connection to negotiate encryption and authenticate the server identity according to certificate/trust rules before ordinary HTTP messages are exchanged." },
    { type: "code", language: "text", caption: "What each successful step proves", code: "DNS success  → a host name resolved to address information\nTCP success  → a connection was established to an address:port\nTLS success  → a secure session was negotiated sufficiently to exchange HTTPS\nHTTP status  → an HTTP-speaking server returned an HTTP response\n\nNone of the earlier successes guarantees that the next layer will succeed." },
    { type: "paragraph", text: "This layered evidence prevents category errors. 'Could not resolve host' gives you no HTTP status because HTTP was never reached. 'Connection refused' means the expected transport connection was not established. A certificate verification error occurs during the secure-channel step. HTTP `404` or 500 means the request reached an HTTP server far enough for it to return protocol-level application evidence." },
    { type: "callout", tone: "warning", title: "Do not disable TLS verification as a generic fix", body: "Certificate verification failures are evidence about trust, identity or configuration. Bypassing verification may hide the problem and weaken security. At Builder stage, classify the failure correctly; later schools teach certificate and platform administration in depth." },
    { type: "heading", id: "urls", text: "URLs identify resources and destinations" },
    { type: "paragraph", text: "A URL carries structured information: scheme, host, optional port, path, query and fragment. For APIs, the path and query normally participate in identifying or selecting resources while the host tells the client which server to contact." },
    { type: "code", language: "text", caption: "Dissecting a Steward URL", code: "https://steward.example.com:443/services?criticality=high\n│       │                   │    │        │\n│       │                   │    │        └─ query\n│       │                   │    └────────── path\n│       │                   └─────────────── port\n│       └─────────────────────────────────── host\n└─────────────────────────────────────────── scheme" },
    { type: "heading", id: "url-encoding", text: "URL components have syntax and encoding rules" },
    { type: "paragraph", text: "A query string is not an arbitrary text suffix. Reserved characters have structural meaning and data may need percent-encoding. For example, a space may appear encoded as `%20` in a URL. Client libraries normally encode parameters for you; manually concatenating untrusted values into URLs is error-prone." },
    { type: "code", language: "text", caption: "Illustrative URL shapes (not shell commands)", code: "/services/payments-api              # identify one resource by path\n/services?criticality=high&limit=20 # select/filter a collection\n\n# Fragment identifiers such as #section are normally handled client-side\n# and are not sent as part of the HTTP request target to the server." },
    { type: "paragraph", text: "Path segments commonly identify hierarchy/resources while query parameters commonly filter, sort, paginate or modify a retrieval view. These are conventions rather than universal laws, but a consistent API makes the distinction predictable." },
    { type: "heading", id: "http-versions", text: "HTTP semantics outlive a particular wire version" },
    { type: "paragraph", text: "HTTP/1.1, HTTP/2 and HTTP/3 differ in transport/framing behavior and performance characteristics, but methods, statuses, fields and resource semantics remain the conceptual API contract. At this stage, recognize the distinction: an API designer should not confuse HTTP semantics with the exact connection/framing mechanism used to carry them." },
    { type: "heading", id: "request-response", text: "The web is request-response at this level" },
    { type: "paragraph", text: "HTTP gives clients and servers a shared message model. The client sends a request describing an intended operation; the server returns a response describing the result. Frameworks hide much of the message parsing, but they do not change the protocol contract." },
    { type: "callout", tone: "steward", title: "Steward connection", body: "Later Django code may expose /services, but a failure to resolve steward.example.com occurs before Django exists in the request path. This distinction becomes essential during Delivery, Cloud and Reliability schools." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Take three URLs and identify scheme, host, port, path and query.", "Use curl -v against a public HTTPS endpoint and identify where connection establishment ends and HTTP begins.", "Create a short failure map distinguishing DNS failure, connection refusal, TLS failure, HTTP `404` and HTTP 500.", "Explain which of those failures could occur before the Steward application executes any code."] },
    { type: "resources", title: "Required and supporting reading", resources: [mdnHttp] },
  ], "Explain and observe the path from a URL to an HTTP response.", ["Inspect a real URL component by component.", "Use curl -v to capture connection and protocol details.", "Create a five-layer failure map.", "Relate each failure to the component responsible."], "A user reports 'the API is down.' What observations would help you distinguish DNS, TCP/TLS and application failures?", [mdnHttp]),

  lesson("Client-Server Architecture", 85, [
  {
    "type": "heading",
    "id": "why-architecture",
    "text": "Before client and server: what makes an architecture?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Software architecture describes how a system is organized: which components exist, what each is responsible for, and how they interact. Imagine Steward's service registry with a screen, rules for valid services, and stored records. You could build all of it as a local application or expose the operations to other programs over a network. Both may implement the same feature. They differ in who controls the rules, how components are deployed, and what can fail. Those are architectural decisions."
  },
  {
    "type": "heading",
    "id": "client-server-definition",
    "text": "Define client–server precisely",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Client–server is an architectural interaction pattern: a component playing the CLIENT role initiates a request for data or behavior, while a component playing the SERVER role exposes an interface, receives requests and returns results. These are roles in an exchange, not classes of hardware. A laptop can run a server. An application backend is a server when responding to the browser and a client when requesting data from another service. A client does not have to be a browser, and a server does not have to be accessible over the public internet."
  },
  {
    "type": "paragraph",
    "text": "Distinguish the pieces before going further. A COMPONENT is a subsystem with a responsibility; a PROCESS is a running program with its own memory; a HOST is the computer or virtual machine running it; an INTERFACE is the published way another component interacts with it. Two processes on the same laptop can communicate through localhost. That is still an interaction across a process boundary; physical distance is not part of the definition."
  },
  {
    "type": "code",
    "caption": "Today's Steward core is local; HTTP and PostgreSQL are not yet implemented in this checkpoint.",
    "code": "CURRENT: Engineering script ---> steward-core Python functions\n                    (one local program)\n\nFUTURE: Engineering client --HTTP--> Steward API --local call--> steward-core\n             client role        server role             domain rules\n\nLATER: Steward API --database protocol--> database server\n       client role                      server role",
    "language": "text"
  },
  {
    "type": "heading",
    "id": "architectural-contract",
    "text": "What does a working client–server arrangement require?",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "A provider with a defined interface: what operations are available, how to address it, and what a valid request looks like.",
      "A client that initiates requests and interprets responses. It cannot directly access another process's in-memory Python objects.",
      "A server that validates requests, applies domain and access rules, and reports the outcome. The client may help with feedback, but cannot be trusted as the only guard.",
      "A shared communication contract: message representation, errors and compatibility expectations.",
      "An understanding that clients and servers may run, restart, change versions or fail independently."
    ],
    "ordered": true
  },
  {
    "type": "heading",
    "id": "trace-service-request",
    "text": "Follow a complete service lookup",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Suppose a future Engineering Portal needs the name of Service 42. The browser constructs a GET request to a defined API endpoint. The API interprets the request, checks whether access is allowed, asks steward-core to find the service, and creates an HTTP response. The client reads the status and response body and renders the name. A protocol response and a Python function result are not the same thing: the API translates between them."
  },
  {
    "type": "code",
    "caption": "Illustrative future HTTP contract, not an endpoint that has already been built.",
    "code": "REQUEST (client -> API)\nGET /services/42 HTTP/1.1\nHost: steward.example.test\n\nSERVER STEPS\n1. Receive and parse request\n2. Check permissions\n3. Call steward-core lookup for Service 42\n4. Serialize the permitted fields\n\nRESPONSE (API -> client)\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"id\":42,\"name\":\"Payments\"}\n\nIf the service does not exist, return an appropriate not-found response.",
    "language": "text"
  },
  {
    "type": "heading",
    "id": "ownership",
    "text": "Who is responsible for a rule?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A domain invariant is a rule that must always hold, such as 'a service cannot depend on itself'. A browser may check this before submission to give immediate feedback. But a caller can use curl, Python or a different browser client and bypass browser-side validation. The future API must enforce the invariant through the existing domain core. The server is authoritative for business changes; the client is responsible for presenting the interaction. This is why 'the UI already checks it' is not sufficient security or correctness."
  },
  {
    "type": "callout",
    "title": "An important distinction",
    "body": "Client-side validation can improve usability. It cannot replace server-side validation and authorization. You will learn authentication mechanisms later; here you only need to understand where enforcement must live.",
    "tone": "warning"
  },
  {
    "type": "heading",
    "id": "compare-architectures",
    "text": "Other architectures: what differs, and what does not?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "The terms below describe different questions and are not all mutually exclusive. Client–server describes who requests and who responds across an interface. Three-tier describes a separation of presentation, application logic and data. Monolith/microservices describe deployment and ownership boundaries. A system can be client–server, three-tier and a modular monolith simultaneously."
  },
  {
    "type": "code",
    "caption": "Conceptual comparisons, with typical use cases.",
    "code": "STANDALONE LOCAL APP: UI and logic in one local program\n  Example: an offline editor; no remote server needed for core work.\nCLIENT–SERVER: requester talks to a provider through an interface\n  Example: browser retrieving a service from an API.\nTHREE-TIER: presentation / application logic / persistent data\n  Example: business website; tiers need not mean three physical hosts.\nPEER-TO-PEER: participants may both offer and request resources\n  Example: distributed file sharing; no single central service required.\nPUBLISH–SUBSCRIBE: publisher emits events consumed asynchronously\n  Example: notifications; publisher need not wait for each consumer.\nMODULAR MONOLITH: one deployable application with internal modules\n  Example: small team with clear domain separation.\nMICROSERVICES: independently deployed service components\n  Example: large organization needing independent team ownership.\n\nClient–server interactions can appear INSIDE many of these designs.",
    "language": "text"
  },
  {
    "type": "paragraph",
    "text": "For Steward, a modular monolith behind an HTTP API is a plausible starting point: one deployable application, separated internal responsibilities, and a stable interface for clients. Splitting each rule into an independently deployed service would add credentials, distributed traces, network failure cases and more operational work. If multiple independently maintained teams and scaling needs later justify that cost, the design can evolve. 'More distributed' is not synonymous with 'better'."
  },
  {
    "type": "heading",
    "id": "tiers",
    "text": "Three tiers are responsibilities, not a shopping list",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Presentation is what the user interacts with. Application logic enforces business behavior. Persistence retains durable information after a process stops. These responsibilities may run in two or three processes, or temporarily in one. At this learning checkpoint you have steward-core, not a completed PostgreSQL-backed deployment. Treat the API and persistent store as planned architecture, not as things already installed."
  },
  {
    "type": "code",
    "caption": "Describe existing and planned parts without pretending they all run today.",
    "code": "PRESENTATION: planned Engineering client\n       |\n       | planned HTTP communication\n       v\nAPPLICATION: planned Steward API -> already-built steward-core\n       |\n       | future persistence boundary\n       v\nDATA: persistent storage (taught in a later module)",
    "language": "text"
  },
  {
    "type": "heading",
    "id": "misconceptions",
    "text": "Test your mental model against common mistakes",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "“A server is necessarily a powerful remote computer.” False. A server is a role that even a small local process can play.",
      "“Client–server and microservices are opposites.” False. Microservices commonly act as servers to some callers and clients of others.",
      "“An API is always public.” False. An API can be internal, local or external, and not every API uses HTTP.",
      "“Client–server makes everything stateless.” False. User interface, application and durable state can live in different places."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "understanding-check",
    "text": "Can you explain the design without jargon?",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "Define client, server, process, host and interface, explaining how they differ.",
      "Draw the future Engineering Client -> Steward API -> steward-core path. Show the owner of the self-dependency rule. Do not add a database as if it already exists.",
      "Compare the local steward-core program with the future client–server interface. What user need justifies the network boundary?",
      "Explain how peer-to-peer differs from client–server, and why 'three-tier' and 'microservices' are not competing definitions of the same thing."
    ],
    "ordered": true
  },
  {
    "type": "resources",
    "title": "Further reading",
    "resources": [
      {
        "title": "MDN — An overview of HTTP",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
      }
    ]
  }
], "Define client–server from first principles, compare it with alternative architectural patterns and establish correct ownership of Steward business rules.", [
  "Explain each participant and role using the actual steward-core checkpoint.",
  "Create a boundary diagram that does not assume future database infrastructure already exists.",
  "Compare standalone, peer-to-peer, three-tier, monolith and microservice patterns using concrete examples.",
  "Justify why a separate API boundary is or is not warranted for two independently operating clients."
], "Explain why two programs on the same laptop can still be client–server. Distinguish a server process from a host, then decide which component must reject a self-dependency and why a browser cannot be the only enforcement point."),

  lesson("Client-Server Boundaries and Failure Modes", 75, [
  {
    "type": "heading",
    "id": "what-boundary-changes",
    "text": "Local function calls and remote requests are not equivalent",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Imagine a Python function call, get_service(42), inside one process. It can pass an ordinary object and raise a Python exception to its caller. If a browser or command-line client requests the same operation from a separate Steward API process, the programs do not share Python memory. The request must be encoded into messages that cross a communication channel, and the server must convert the result or failure into a documented response."
  },
  {
    "type": "code",
    "caption": "Same business question, different operational assumptions.",
    "code": "IN-PROCESS: result = get_service(42)\n- Direct Python values\n- Caller's stack can observe an exception\n\nFUTURE NETWORK API: GET /services/42\n- Request and response encoded as bytes\n- Status, headers and optional body\n- May time out or disconnect\n- Client cannot assume a result was received",
    "language": "text"
  },
  {
    "type": "heading",
    "id": "serialization",
    "text": "What serialization means",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Serialization converts a program value into a representation that another process can read; JSON is a common choice for an HTTP API. Deserialization turns that representation into new values on the receiving side. You are not transmitting an actual Python Service instance with its methods. You are transmitting a selected representation of fields that both sides agree on. An API contract specifies those fields, valid operations and error responses; changing it can break independently deployed clients."
  },
  {
    "type": "code",
    "caption": "An illustrative public representation of a future Service; not the original Python object.",
    "code": "{\n  \"id\": 42,\n  \"name\": \"Payments\",\n  \"active\": true\n}",
    "language": "json"
  },
  {
    "type": "heading",
    "id": "latency-and-trust",
    "text": "Latency, concurrency and trust",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A network round trip takes time even when the server itself is fast. Messages may be delayed, dropped or interrupted. Several clients may send changes concurrently, so the server must defend the same invariant regardless of which client acts first. Requests crossing an interface are untrusted input: a client may be buggy, stale or intentionally hostile. These are reasons to keep domain rules and access decisions behind the server boundary rather than inside one browser."
  },
  {
    "type": "heading",
    "id": "timeouts",
    "text": "The dangerous ambiguity of a timeout",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Suppose a future client requests deactivation of Service 42. The server could commit that change but lose the response before the client receives it. Or the request might not reach the server at all. Both cases appear as a timeout to the client, but the real service state differs. Therefore a timeout does not prove 'nothing happened'. Repeating some operations can duplicate effects, so safe retries may require an idempotent operation, an operation identifier or verification of current state. Those techniques will be expanded in the HTTP and API design lessons."
  },
  {
    "type": "code",
    "caption": "Two realities, one client-visible symptom.",
    "code": "A) Client --deactivate(42)--> Server changes state\n   Client <--response LOST--- Server\n   Result: timeout, change DID happen\n\nB) Client --deactivate(42)--X Server never receives it\n   Client <--no response---- Server\n   Result: timeout, change DID NOT happen",
    "language": "text"
  },
  {
    "type": "heading",
    "id": "state",
    "text": "State and source of truth",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "State is any information that changes: an unfinished form, a login session, a service's active status. The browser can hold temporary form state; steward-core determines whether domain operations are valid; a future database can retain data across restarts. Ask which part is authoritative for each fact and what happens when one component has an older copy. When HTTP is described as stateless, that generally refers to how requests are interpreted, not to the absence of state anywhere in the system."
  },
  {
    "type": "heading",
    "id": "two-terminals",
    "text": "Experiment: observe a real client and server",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "This safe local lab makes the pattern tangible without requiring Django, Docker, cloud infrastructure or PostgreSQL. Use an empty disposable directory. Run the server in Terminal A and the client in Terminal B. The address 127.0.0.1 is loopback: the server listens only on your own machine. This is a demonstration HTTP file server, NOT an implementation of the Steward API."
  },
  {
    "type": "code",
    "caption": "Terminal A — start the server. Keep this process running.",
    "code": "mkdir -p /tmp/tsa-client-server-lab\ncd /tmp/tsa-client-server-lab\nprintf 'Steward local lab\\n' > hello.txt\npython3 -m http.server 8765 --bind 127.0.0.1",
    "language": "bash"
  },
  {
    "type": "paragraph",
    "text": "Open a second terminal while the first remains running. A successful request for hello.txt should return an HTTP 200 response and the words 'Steward local lab'. A request for a missing file should return HTTP 404: an actual HTTP server answered, but the resource does not exist. Watch Terminal A's logs; the server receives both operations. Now stop the server using Ctrl+C and request hello.txt again. The connection should fail BEFORE an HTTP response exists. Distinguish the three outcomes in your notes."
  },
  {
    "type": "code",
    "caption": "Terminal B — make requests as a separate client.",
    "code": "curl -i http://127.0.0.1:8765/hello.txt\ncurl -i http://127.0.0.1:8765/does-not-exist.txt\n# After stopping the server in Terminal A:\ncurl -i --max-time 3 http://127.0.0.1:8765/hello.txt",
    "language": "bash"
  },
  {
    "type": "paragraph",
    "text": "If port 8765 is busy, select another unused port and replace it in every command. HTTP response headers vary by Python version; use the observed status and body as evidence rather than memorizing an exact transcript. If the first request cannot find hello.txt, check that Terminal A started from the lab directory. A connection refusal is not an HTTP 404 because the HTTP server did not return any response."
  },
  {
    "type": "heading",
    "id": "engineering-decision",
    "text": "Design the future Steward boundary",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "Prepare a comparison of local steward-core calls versus a separate HTTP API: data representation, latency, independent failure, permissions and compatibility.",
      "Draw the planned communication path and label which code already exists versus which parts are future.",
      "Demonstrate 200, 404 and connection refusal using the loopback experiment; explain which component you would investigate for each.",
      "Write a short decision record comparing direct client access to domain storage with access through the Steward API. Include a rejected alternative and one testable consequence.",
      "Describe what a client should do after a state-changing request times out, without claiming that nothing happened."
    ],
    "ordered": true
  },
  {
    "type": "callout",
    "title": "Why there is no Django code yet",
    "body": "Learning the protocol and process boundary first lets you evaluate Django and DRF later instead of mistaking framework convenience methods for architecture. After this lesson, you can explain what the framework must implement.",
    "tone": "steward"
  },
  {
    "type": "resources",
    "title": "Further reading",
    "resources": [
      {
        "title": "MDN — An overview of HTTP",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
      }
    ]
  }
], "Demonstrate separate client/server processes and explain serialization, failure ambiguity, trust, state ownership and safe boundary decisions.", [
  "Run a loopback HTTP server, record one 200 response, one 404 response and one connection failure after stopping it.",
  "Explain what is and is not known after a state-changing request times out.",
  "Compare local steward-core calls with a future HTTP API including five independent failure and contract dimensions.",
  "Write a reproducible API boundary decision with an explicit rejected design."
], "In the loopback lab, why is a missing file different from no running server? If the future client times out while deactivating a Service, can it conclude the change did not occur? Why not?"),

  lesson("HTTP Requests and Responses", 45, [
    { type: "heading", id: "messages", text: "HTTP is a message protocol" },
    { type: "paragraph", text: "An HTTP request contains a method, target, headers and sometimes a body. A response contains a status code, headers and sometimes a body. Reading these raw parts is one of the highest-leverage habits for API engineering because it lets you reason underneath tools and frameworks." },
    { type: "code", language: "http", caption: "Example Steward request", code: "GET /services/42 HTTP/1.1\nHost: steward.example.com\nAccept: application/json\nAuthorization: Bearer <token>" },
    { type: "code", language: "http", caption: "Example response", code: "HTTP/1.1 200 OK\nContent-Type: application/json\nETag: \"service-42-v7\"\n\n{\n  \"id\": 42,\n  \"name\": \"Payments API\",\n  \"criticality\": \"high\"\n}" },
    { type: "heading", id: "headers", text: "Headers carry metadata" },
    { type: "paragraph", text: "Headers describe representation, authorization, caching, tracing and other metadata. The body carries a representation when one is needed. Treating everything as 'the JSON' hides important protocol behavior." },
    { type: "callout", tone: "warning", title: "A body is not guaranteed", body: "Many valid HTTP responses have no response body. Clients must use status and headers correctly instead of assuming every response is JSON." },
    { type: "heading", id: "common-headers", text: "Learn the headers that shape ordinary API behavior" },
    { type: "code", language: "text", caption: "High-frequency HTTP fields", code: "Accept          → response media types the client can process\nContent-Type    → media type of this message body\nAuthorization   → credentials for the request\nLocation        → URI associated with creation/redirection\nCache-Control   → caching directives\nETag            → validator for a representation/version\nIf-None-Match   → make retrieval conditional on an ETag\nRetry-After     → when a client may retry in relevant responses\nUser-Agent      → information about the requesting client" },
    { type: "paragraph", text: "Headers are extensible, so do not try to memorize all of them. Learn the common semantic categories and inspect unfamiliar fields in authoritative documentation." },
    { type: "heading", id: "redirects", text: "3xx responses can require another request" },
    { type: "paragraph", text: "Redirect responses normally use a `Location` header to point at another URI. Clients differ in whether and how they follow redirects automatically, especially when methods or credentials are involved. When debugging, distinguish the original response from the follow-up request your tool may have issued for you." },
    { type: "heading", id: "cookies-auth", text: "Cookies and Authorization are different mechanisms" },
    { type: "paragraph", text: "A server can ask a user agent to store cookie state with `Set-Cookie`, after which matching requests may send it in `Cookie`. APIs also commonly receive credentials in the `Authorization` header. Authentication design comes later; here the key point is that both are HTTP metadata with different client behavior and security attributes, not JSON fields in the resource body." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Capture one GET and one POST using curl -i or curl -v.", "Label method, target, request headers, request body, status, response headers and response body.", "Change Accept or Content-Type deliberately and observe what the server does.", "Record one assumption your API client made that was not guaranteed by HTTP itself."] },
    { type: "resources", resources: [mdnHttp, rfc9110] },
  ], "Read and explain raw HTTP requests and responses.", ["Capture raw-ish HTTP evidence using curl.", "Annotate every major message component.", "Compare a request with and without a body.", "Explain one behavior controlled by headers rather than JSON."], "What information belongs to the request line, headers and body? Why is a 204 response different from a 200 response with an empty JSON object?", [mdnHttp, rfc9110]),

  lesson("Methods, Headers and Status Codes", 50, [
    { type: "heading", id: "methods", text: "Methods communicate intent" },
    { type: "paragraph", text: "HTTP methods carry semantics. `GET` retrieves a representation, `POST` commonly creates or triggers processing, `PUT` replaces a resource representation, `PATCH` applies partial modification, and `DELETE` requests removal. Correct method choice helps clients, caches, documentation and operators understand intent." },
    { type: "code", language: "http", caption: "Steward operations", code: "GET    /services/42\nPOST   /services\nPATCH  /services/42\nDELETE /services/42\n\nPOST   /services/42/dependencies" },
    { type: "heading", id: "safe-idempotent", text: "Safe and idempotent are protocol properties" },
    { type: "paragraph", text: "A safe method is intended not to change server state as a requested effect. An idempotent method can be repeated with the same intended effect. These properties matter for retries, proxies and failure recovery. `POST` is not automatically unsafe to retry in every application, but if repeated execution can create duplicates, the API must design around that risk." },
    { type: "heading", id: "status", text: "Status codes classify outcomes" },
    { type: "list", items: ["2xx: the request was successfully processed in the protocol/application sense.", "3xx: redirection or alternate location behavior.", "4xx: the request cannot be fulfilled as sent, including validation, authentication, authorization or missing-resource cases.", "5xx: the server failed while attempting a validly formed request."] },
    { type: "heading", id: "specific-status-semantics", text: "Choose the specific status from the failure meaning" },
    { type: "paragraph", text: "Status families are only the first classification. Clients need the specific status to decide what happened. 400 Bad Request is suitable for a request the server rejects as invalid at the request/input level. 401 Unauthorized, despite its historical name, means valid authentication credentials are missing or unacceptable and commonly accompanies an authentication challenge. 403 Forbidden means the server understood the caller/request but refuses the action. 404 Not Found means the target resource was not found or is intentionally presented that way. 500 Internal Server Error represents an unexpected server-side failure rather than a client-correctable validation decision." },
    { type: "code", language: "text", caption: "Same endpoint, different failure meanings", code: "POST /services\n400 → JSON/field/domain input is invalid for this operation\n401 → caller has not established acceptable authentication\n403 → caller is identified but is not allowed to create this resource\n404 → referenced/target resource is not found (where applicable)\n500 → server encountered an unexpected processing failure" },
    { type: "paragraph", text: "Authentication asks 'who is the caller and can that identity be established?'. Authorization asks 'is that established caller allowed to perform this action on this resource?'. Keeping those questions separate prevents an access-control decision from being reported as malformed input or server failure." },
    { type: "callout", tone: "note", title: "Status alone is not the whole error contract", body: "Two validation failures can both use 400 while carrying different stable application error codes and field details. Later in this module you will design that response body. First preserve the protocol-level category correctly." },
    { type: "callout", tone: "steward", title: "Make failure semantics useful", body: "If Team A tries to modify a service owned by Team B, returning 500 hides a deliberate authorization decision as a server failure. Status design should preserve the difference between invalid input, missing authentication, forbidden action, missing resource and unexpected server failure." },
    { type: "heading", id: "put-patch", text: "PUT and PATCH make different update promises" },
    { type: "paragraph", text: "`PUT` is defined around creating/replacing the state of the target resource with the supplied representation and is idempotent by semantics. `PATCH` applies a set of partial modifications whose idempotency depends on the patch operation/media type and application design. In practice, document update semantics precisely rather than treating both as interchangeable 'update verbs'." },
    { type: "heading", id: "status-toolkit", text: "Know the statuses that drive ordinary API clients" },
    { type: "code", language: "text", caption: "Useful status semantics", code: "200 OK                  → successful response with normal representation/result\n201 Created             → resource created; Location may identify it\n202 Accepted            → accepted for processing, not necessarily completed\n204 No Content          → successful response with no body\n304 Not Modified        → conditional retrieval can reuse cached representation\n400 Bad Request         → request rejected as malformed/invalid at request level\n401 Unauthorized        → acceptable authentication is missing/invalid\n403 Forbidden           → action is refused for this caller\n404 Not Found           → target resource not found/presented as absent\n409 Conflict            → request conflicts with current resource state\n415 Unsupported Media Type → request representation type is unsupported\n422 Unprocessable Content → representation understood but instructions/content cannot be processed semantically\n429 Too Many Requests   → rate limit/request pressure policy rejected request\n500 Internal Server Error → unexpected server failure\n503 Service Unavailable → service temporarily unable to handle request" },
    { type: "paragraph", text: "Do not choose a status from a memorized table alone. Start from the actual failure meaning and the behavior you want a generic HTTP client to infer. Application error codes then add domain-specific precision inside that protocol category." },
    { type: "heading", id: "idempotency-key", text: "Application design can make risky retries safer" },
    { type: "paragraph", text: "A creation-style `POST` can duplicate work when a client retries after an unknown outcome. Some APIs accept an idempotency key: repeated requests carrying the same operation key can be recognized and prevented from creating a second effect. This is an application contract layered on HTTP; it does not make every POST intrinsically idempotent." },
    { type: "heading", id: "conditional", text: "Conditional requests coordinate versions and caches" },
    { type: "paragraph", text: "A server can return an `ETag` representing a selected representation version. A later GET with `If-None-Match` may receive `304 Not Modified`, avoiding retransmission. Conditional modification headers can also help prevent blindly overwriting a newer version. You do not need to implement concurrency control yet, but recognize ETags as protocol validators rather than arbitrary version strings." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Classify six Steward operations by method.", "Explain whether retrying each operation is safe and/or idempotent.", "Map validation failure, unauthenticated request, forbidden cross-team edit, missing service and database crash to appropriate status-code families.", "Inspect Retry-After, Location or ETag on a real API if available and explain the header's role."] },
    { type: "resources", resources: [mdnMethods, mdnStatus, rfc9110] },
  ], "Choose methods and status codes from intended semantics rather than convention alone.", ["Map Steward operations to methods.", "Classify safety and idempotency.", "Design statuses for five distinct failures.", "Inspect at least one response header that affects client behavior."], "Why are safety and idempotency useful to clients and infrastructure? Distinguish 400, 401, 403, 404 and 500 using Steward examples.", [mdnMethods, mdnStatus, rfc9110]),

  lesson("JSON and Content Types", 40, [
    { type: "heading", id: "representation", text: "JSON is a representation format" },
    { type: "paragraph", text: "JSON gives systems a portable way to exchange strings, numbers, booleans, null, arrays and objects. It does not carry Python classes, database constraints or domain guarantees. When a JSON document crosses an API boundary, the server must parse it and then validate its meaning." },
    { type: "code", language: "json", caption: "Steward service representation", code: "{\n  \"name\": \"Payments API\",\n  \"slug\": \"payments-api\",\n  \"criticality\": \"high\",\n  \"lifecycle\": \"production\",\n  \"ownerTeamId\": 7,\n  \"tags\": [\"payments\", \"tier-1\"]\n}" },
    { type: "heading", id: "content-type", text: "Content-Type and Accept answer different questions" },
    { type: "paragraph", text: "`Content-Type` tells the recipient what representation the message body uses. `Accept` tells the server which response representation the client can process. Confusing them produces subtle API bugs." },
    { type: "code", language: "http", caption: "Representation metadata", code: "POST /services HTTP/1.1\nContent-Type: application/json\nAccept: application/json\n\n{\"name\": \"Payments API\"}" },
    { type: "callout", tone: "warning", title: "Valid JSON is not valid domain data", body: "{\"criticality\":\"banana\"} is valid JSON. Steward must still reject it because the representation violates the service-registry contract." },
    { type: "heading", id: "json-types", text: "JSON has a small type system" },
    { type: "code", language: "json", caption: "The JSON value vocabulary", code: "{\n  \"text\": \"payments\",\n  \"number\": 42.5,\n  \"enabled\": true,\n  \"missingValue\": null,\n  \"tags\": [\"tier-1\", \"payments\"],\n  \"owner\": {\"id\": 7}\n}" },
    { type: "paragraph", text: "JSON defines strings, numbers, booleans, null, arrays and objects. It has no native date/time, UUID, decimal-money or binary type. APIs therefore encode those concepts by contract—often strings with defined formats—and both sides must agree on the meaning." },
    { type: "heading", id: "json-object", text: "JSON objects are not Python dictionaries on the wire" },
    { type: "paragraph", text: "A JSON object uses string member names. Your JSON parser may produce a Python dictionary, but that is a language-specific in-memory representation. Likewise, JSON numbers do not promise Python's exact numeric behavior. Keep interchange syntax separate from the runtime objects produced after parsing." },
    { type: "heading", id: "negotiation-failure", text: "Representation negotiation can fail" },
    { type: "paragraph", text: "If the request body uses a media type the endpoint does not support, `415 Unsupported Media Type` is a common response. If the server cannot produce a representation acceptable under the request's `Accept` preferences, `406 Not Acceptable` may be appropriate. Framework defaults vary, so inspect behavior instead of assuming." },
    { type: "callout", tone: "warning", title: "Null, missing and empty are different states", body: "An omitted member, a member explicitly set to `null`, an empty string, an empty array and zero can carry different domain meanings. Define them deliberately for each field instead of relying on truthiness." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Create valid JSON representations for a service and environment.", "Create syntactically valid JSON that violates Steward rules.", "Send a request with the wrong Content-Type and inspect the response.", "Explain how null differs from an omitted property for at least one Steward field."] },
    { type: "resources", resources: [jsonSpec, mdnHttp] },
  ], "Distinguish JSON syntax, HTTP representation metadata and domain validation.", [
    "Create valid and invalid Steward JSON representations.",
    "Send requests with correct and incorrect Content-Type headers and compare the responses.",
    "Use Accept and Content-Type independently and explain what each header communicates.",
    "Test an omitted property, an explicit null value and a syntactically valid value that violates a Steward domain rule."
  ], "Why can a request contain valid JSON and still be invalid for Steward? Explain the difference between Content-Type and Accept, and distinguish an omitted property from an explicit null value.", [jsonSpec, jsonVideo]),

  lesson("REST Principles and Trade-offs", 50, [
    { type: "heading", id: "rest", text: "Start with resources and representations" },
    { type: "paragraph", text: "A resource is something the API gives a stable conceptual identity to, such as a service or team. A representation is the data sent to describe a resource at a particular moment, often JSON. The resource is not the JSON document itself: the same service can have different representations for different media types, fields or consumers." },
    { type: "code", language: "text", caption: "Resource versus representation", code: "Resource: Service 42\nURI:      /services/42\n\nOne JSON representation:\n{\"id\": 42, \"name\": \"Payments API\"}" },
    { type: "heading", id: "rest-constraints", text: "REST adds constraints to this resource model" },
    { type: "paragraph", text: "REST is an architectural style built around constraints including client/server separation, stateless interactions, cacheability and a uniform interface over resources and representations. In everyday API work, teams often use 'REST API' more loosely. TSA keeps the architectural meaning visible while focusing on the design consequences that are useful for Steward rather than treating the label as a purity score." },
    { type: "heading", id: "resources", text: "Model stable resources before actions" },
    { type: "paragraph", text: "Steward naturally exposes resources such as services, teams, environments and dependencies. Resource-oriented design tends to produce APIs whose behavior can be understood through common HTTP semantics." },
    { type: "code", language: "text", caption: "Resource-oriented Steward surface", code: "/teams\n/teams/7\n/services\n/services/42\n/services/42/environments\n/services/42/dependencies" },
    { type: "heading", id: "tradeoffs", text: "Not every domain action maps elegantly to CRUD" },
    { type: "paragraph", text: "Some operations are better represented as commands or domain actions. Forcing every workflow into generic create/update/delete semantics can reduce clarity. The design question is whether a resource model communicates the behavior accurately and predictably." },
    { type: "callout", tone: "note", title: "REST is not a maturity score", body: "An API is not better because it is more 'RESTful' in the abstract. Consistency, clear contracts, failure semantics, evolvability and suitability for consumers matter more than stylistic purity." },
    { type: "heading", id: "identity-nesting", text: "URLs should express stable identity without mirroring every relationship" },
    { type: "paragraph", text: "Nested paths can communicate ownership/context, such as `/services/42/environments`, but excessive nesting couples navigation to a hierarchy that may later change. Give independently addressable resources stable identifiers/URLs when consumers need to refer to them directly." },
    { type: "heading", id: "collection-queries", text: "Collection endpoints need query semantics" },
    { type: "code", language: "text", caption: "Filtering, sorting and pagination are contract decisions", code: "GET /services?criticality=high&lifecycle=production\nGET /services?sort=name\nGET /services?limit=20&cursor=eyJpZCI6NDJ9" },
    { type: "paragraph", text: "Filtering decides which resources match; sorting decides order; pagination bounds how many results travel in one response. Offset/page-number pagination is simple but can shift under concurrent inserts/deletes. Cursor-based pagination can provide more stable traversal but creates an opaque continuation contract. Choose based on data/access behavior rather than fashion." },
    { type: "heading", id: "actions", text: "Commands should reveal domain meaning" },
    { type: "paragraph", text: "When an operation does not map cleanly to replacing or partially updating resource state, an explicit action or command resource may be clearer. For example, an ownership transfer may deserve a specific contract if it has authorization, audit and validation semantics beyond assigning one field. Resource orientation should clarify the domain, not conceal it." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Model Steward services, teams and dependencies as resources.", "Choose one operation that feels awkward as generic CRUD and compare two possible API designs.", "Identify one benefit and one cost of stateless request handling.", "Explain which REST constraints matter most for Steward and which are less relevant at Builder stage."] },
    { type: "resources", resources: [rfc9110, mdnHttp] },
  ], "Use REST principles as design constraints while recognizing their trade-offs.", ["Draft resource-oriented Steward endpoints.", "Evaluate one command-like workflow.", "Compare two API shapes.", "Write a short decision explaining which option you prefer and why."], "Why is REST more than endpoint naming? Give one case where forcing an operation into CRUD could make an API less clear.", [rfc9110]),

  lesson("Modeling Resources and API Contracts", 55, [
    { type: "heading", id: "contract", text: "An API is a contract between independently changing systems" },
    { type: "paragraph", text: "The contract includes resource shape, field meaning, required and optional data, validation, methods, statuses, pagination, filtering and failure representations. Once clients depend on a behavior, changing it has compatibility consequences." },
    { type: "code", language: "json", caption: "A deliberate service contract", code: "{\n  \"id\": 42,\n  \"name\": \"Payments API\",\n  \"slug\": \"payments-api\",\n  \"criticality\": \"high\",\n  \"lifecycle\": \"production\",\n  \"ownerTeam\": {\n    \"id\": 7,\n    \"name\": \"Payments Engineering\"\n  }\n}" },
    { type: "heading", id: "domain-vs-representation", text: "A representation is not the domain model" },
    { type: "paragraph", text: "The API may expose a nested `ownerTeam` representation while the persistence model stores a foreign key and the domain layer enforces ownership rules. Treating every JSON field as a direct database column couples layers unnecessarily." },
    { type: "heading", id: "compatibility", text: "Contracts live over time" },
    { type: "paragraph", text: "Renaming a field, changing nullability, narrowing accepted values or changing status semantics can break consumers. Good API design asks not only 'does this work today?' but also 'what promises are we making?'" },
    { type: "callout", tone: "steward", title: "Steward contract example", body: "If `lifecycle` accepts `development`, `uat`, `production` and `retired`, those values become part of the public contract. Adding a new value may be compatible for some clients and breaking for clients that assume an exhaustive set." },
    { type: "heading", id: "collection-contract", text: "A collection response is also a contract" },
    { type: "paragraph", text: "Define whether a list response is a bare array or an envelope, how pagination continuation is represented, which filters/sorts are supported, and whether totals are exact/available. Clients will depend on these details just as they depend on individual resource fields." },
    { type: "code", language: "json", caption: "One possible paginated collection contract", code: "{\n  \"items\": [\n    {\"id\": 42, \"name\": \"Payments API\"}\n  ],\n  \"nextCursor\": \"opaque-token\"\n}" },
    { type: "heading", id: "compatibility-types", text: "Additive does not automatically mean compatible" },
    { type: "paragraph", text: "Adding an optional response field is often low-risk because tolerant clients ignore it, but adding a new enum value can break clients that assumed the old set was exhaustive. Making an optional request field required, changing a field's type, changing nullability or removing a field is normally higher risk. Compatibility depends on actual consumer assumptions." },
    { type: "heading", id: "versioning", text: "Versioning is one tool, not a substitute for evolution discipline" },
    { type: "paragraph", text: "APIs can version through paths, media types, headers or other organizational conventions, but every version creates support/migration cost. Prefer compatible evolution where practical. When a breaking change is justified, define migration/deprecation timing and observable consumer impact instead of immediately creating `/v2` for every change." },
    { type: "heading", id: "deprecation", text: "Deprecation is a consumer migration process" },
    { type: "paragraph", text: "A deprecated field or endpoint still exists for some period. Document the replacement, identify/communicate with consumers where possible, provide a migration window, observe remaining usage and remove only under an explicit compatibility policy. 'Deprecated' without a removal/migration plan is merely a label." },
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
    { type: "heading", id: "error-shape", text: "Keep the machine contract stable while human text can improve" },
    { type: "code", language: "json", caption: "A structured error envelope", code: "{\n  \"code\": \"service.self_dependency\",\n  \"message\": \"A service cannot depend on itself.\",\n  \"field\": \"dependsOnServiceId\",\n  \"requestId\": \"req-8f2c\"\n}" },
    { type: "paragraph", text: "Clients should branch on stable status/application codes rather than matching human-readable message text. A request/correlation identifier can connect a public failure to controlled server logs without exposing stack traces." },
    { type: "heading", id: "retry", text: "Retryability depends on failure and operation semantics" },
    { type: "paragraph", text: "A validation error should not become successful merely because the same invalid request is retried. A temporary `503` may be retryable, but clients should use bounded backoff and respect `Retry-After` where applicable. For state-changing operations, retry only when idempotency/duplicate-effect behavior is understood." },
    { type: "heading", id: "field-errors", text: "Multiple validation failures need a deliberate representation" },
    { type: "paragraph", text: "For forms or structured requests, returning only the first invalid field can force repeated round trips. An API may return a list/map of field problems while preserving one stable top-level error category. Define ordering, field paths and codes if clients consume them programmatically." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Design responses for invalid criticality, self-dependency, duplicate dependency, missing authentication, forbidden cross-team edit and database outage.", "Choose a stable machine-readable code for each domain failure.", "Identify which details belong in logs but not in public responses.", "Explain retry behavior for each failure." ] },
    { type: "resources", resources: [mdnStatus, rfc9110] },
  ], "Design error responses that preserve failure meaning and support correct client behavior.", ["Map six Steward failures to status codes.", "Define machine-readable error codes.", "Classify retryability.", "Separate public error detail from internal diagnostics."], "Why is returning 400 for every failure harmful? How should a client distinguish validation, authorization, conflict and server failure?", [mdnStatus, rfc9110]),

  { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman", title: "Lab: Explore APIs with curl and Postman", activities: [
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-brief", title: "API Investigation Brief", estimatedMinutes: 20, content: { type: "reading", body: "Use `curl` as the evidence-first tool and Postman as a productivity tool. The goal is to prove that you can read HTTP independently of any specific client UI.", blocks: [
      { type: "heading", id: "objective", text: "Investigate an API from the wire outward" },
      { type: "paragraph", text: "Choose a stable public API or run a tiny local HTTP service. You will capture requests and responses, vary methods and headers, send valid and invalid JSON, classify status codes, and document what each observation proves." },
      { type: "callout", tone: "note", title: "Tool principle", body: "Postman can make exploration faster. curl makes protocol details explicit. You should be able to explain the exchange without depending on either tool's presentation layer." },
      { type: "paragraph", text: "These commands are templates, not an executable public API: example.test is deliberately a non-resolving documentation hostname. Replace the host and resource paths with a local or public API you are authorized to test. Expected evidence: curl -i prints response status/headers/body, while -v adds DNS, connection and protocol diagnostics. Actual statuses and bodies depend on the selected API; do not invent them." },
      { type: "code", language: "bash", caption: "Request templates — replace example.test with your running API", code: "curl -i https://example.test/services\n\ncurl -i -X POST https://example.test/services \\\n  -H 'Content-Type: application/json' \\\n  -H 'Accept: application/json' \\\n  --data '{\"name\":\"Payments API\"}'\n\ncurl -v https://example.test/services/42\n# -i includes response headers; -v shows connection/protocol diagnostics." },
      { type: "resources", resources: [mdnHttp, mdnMethods, mdnStatus] },
    ] } },
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-build", title: "HTTP Investigation", estimatedMinutes: 150, content: { type: "practical", objective: "Investigate real API behavior and produce a protocol-level evidence pack.", scenario: "Before Django abstracts request parsing and response generation, prove that you can explain raw API behavior yourself.", instructions: ["Capture at least one GET, POST, PATCH/PUT and DELETE or equivalent exchange.", "For each exchange record URL components, method, relevant request headers, body, response status, response headers and body.", "Send malformed JSON and syntactically valid but semantically invalid data where the target API permits safe testing.", "Vary Accept and Content-Type and record the result.", "Identify one safe method and one idempotent method and demonstrate why the distinction matters.", "Create a failure table covering validation, missing resource, unauthorized/forbidden if available, and server-side failure or a documented substitute.", "Reproduce at least three exchanges in Postman and compare what the UI hides or adds.", "Write a one-page API contract sketch for a future Steward /services resource using what you learned."], deliverables: ["curl transcript or equivalent evidence", "Annotated request/response table", "Failure classification table", "Postman collection", "Draft Steward `/services` contract"], completionCriteria: ["The learner can reconstruct the meaning of each exchange from protocol evidence.", "HTTP status and application error semantics are not conflated.", "Content negotiation/representation metadata is demonstrated.", "The Steward contract sketch reflects explicit resource and failure semantics."] } },
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-review", title: "Module Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "Without looking at notes, explain the complete path from URL to response, the structure of an HTTP request and response, the difference between Content-Type and Accept, safe vs idempotent methods, what makes an API contract durable, and how you would distinguish malformed input, invalid domain data, forbidden action and server failure in Steward." } },
  ] },
];
