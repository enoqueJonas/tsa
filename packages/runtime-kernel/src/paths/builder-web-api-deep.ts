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

  lesson("Client-Server Architecture", 70, [
  {
    "type": "heading",
    "id": "learning-contract",
    "text": "What you will be able to explain",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "This chapter establishes the meaning of client–server architecture before introducing frameworks or network-failure mechanics. You will define each role, distinguish processes from hosts and tiers, trace a future Steward request, assign ownership of business rules and compare genuine architectural alternatives. In the following chapter you will run a server and client in separate processes and investigate partial failure. Neither Django nor PostgreSQL needs to be installed now."
  },
  {
    "type": "heading",
    "id": "definition",
    "text": "A precise definition of client–server architecture",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Client–server architecture is a way of organizing interactions between software components. A client initiates a request for a capability or resource. A server exposes an agreed interface, receives the request, performs or coordinates the requested work, and returns an outcome. The communication is governed by a protocol—a set of rules describing how the parties exchange information. The architectural feature is the division of roles and responsibilities across an interface, not the use of any particular programming language, database, cloud product, or web framework."
  },
  {
    "type": "paragraph",
    "text": "For example, a browser can ask a website server for a page. A mobile application can ask an API server for a list of services. A backend can act as a client when it asks another server for an exchange rate. A database process can act as a server to the application connecting to it. The same software component may therefore be a server in one interaction and a client in the next. There is no requirement that a client be a browser or a server be a large physical machine."
  },
  {
    "type": "callout",
    "title": "Two distinct meanings of server",
    "body": "A server may mean the software process that listens for requests, or the physical/virtual computer on which that process runs. In architecture diagrams, specify which meaning you intend. You can run a client and a server as separate processes on the same laptop; they still communicate through an interface.",
    "tone": "note"
  },
  {
    "type": "heading",
    "id": "anatomy",
    "text": "The five pieces of one interaction",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "1. Client: the program that wants a result and initiates communication. Example: an Engineering Portal asking for services.",
      "2. Server: a program that accepts a request and decides how to respond. Example: the future Steward HTTP API.",
      "3. Interface/contract: the operations the server makes available, together with the meaning of inputs, results and errors. Example: GET /services returns a list; clients must not assume access to internal Python objects.",
      "4. Protocol and transport: the rules and mechanism for exchanging messages. HTTP defines request/response semantics; TCP is a common transport beneath HTTP/1.1, and TLS protects HTTPS connections. We will study these layers separately.",
      "5. State and dependencies: any facts the operation reads or changes, such as existing Service records, a file, or a future database. A server can serve a response from memory; a database is not required for the client–server model."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "how-an-exchange-works",
    "text": "Follow one request from intention to response",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Suppose the Engineering Portal wants to display the existing Steward service registry. The browser is the client and the future Steward API is the server. The client chooses the operation and sends a request. The server checks what the operation means, applies the rules it owns, consults whichever data source is available, prepares a response, and sends it back. The client interprets that response and decides what to display. A successful response is not the same as a successful rendering: both parties can fail independently."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Future Steward service lookup; the database is deliberately excluded at this stage",
    "code": "Engineering Portal (client)                  Steward API (server)\n         |                                            |\n         |--- request: GET /services ---------------->|\n         |                                            |-- validate operation\n         |                                            |-- call steward-core\n         |                                            |-- prepare response\n         |<-- response: status + service data --------|\n         |                                            |\n         |-- render services or show error            |\n"
  },
  {
    "type": "paragraph",
    "text": "The server may invoke your previously implemented steward-core domain functions. That is a function call inside the server, not another HTTP request. In the current TSA sequence there is no Steward PostgreSQL dependency yet; persistence is introduced later. Do not add components to the diagram merely because they are common in production systems."
  },
  {
    "type": "heading",
    "id": "roles-versus-tiers",
    "text": "Roles, tiers and code organization are different questions",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Client and server describe roles in an exchange. A tier is a logical or physical part of a deployed system with a particular responsibility. A module is a code organization boundary. These are related, but not interchangeable. A single server process may contain many modules; several server processes may run on the same host. A browser may call one API that itself calls another API. This is why the number of clients, servers, processes, machines and tiers need not match."
  },
  {
    "type": "list",
    "items": [
      "Two-tier example: a desktop business client communicates directly with a database server. The client may contain business logic; the database provides shared persistence.",
      "Three-tier example: a browser presentation tier calls an application/API tier, which uses a database tier. The application enforces domain rules and mediates access to stored data.",
      "N-tier example: an API calls identity, messaging or other services. Every added boundary has a reason and an operational cost.",
      "At this point in TSA, we are designing the boundary between a proposed HTTP client and the already built Steward domain core. A three-tier database deployment is not yet something you have implemented."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "responsibility",
    "text": "Which component must own each decision?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A design becomes unsafe when the wrong side of the boundary is trusted. A browser may check that a required field is filled in, giving fast feedback to the user. But a second client—such as a script—could skip that browser check. Therefore the authoritative validation must also run on the server. This includes the domain rule that a service cannot depend on itself and any future rule controlling who may edit a service."
  },
  {
    "type": "paragraph",
    "text": "A practical division of responsibility is: the client owns presentation and user interaction; the server owns authoritative domain operations, access decisions and externally visible behavior; a storage mechanism (when introduced) owns durable data storage, not business authorization. These are design defaults, not universal laws. If a client works offline, it may temporarily maintain local state; synchronization rules must then specify how conflicts are resolved."
  },
  {
    "type": "heading",
    "id": "comparison",
    "text": "What alternatives exist—and what is actually being compared?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Architectures can be classified along different axes. Client–server and peer-to-peer describe communication and coordination. Monolithic versus microservices describes how an application is split into independently deployable pieces. Layered architecture describes organization by responsibility. Event-driven architecture describes how components react to events. One system may be client–server, layered, event-driven and a modular monolith simultaneously. Treating these as mutually exclusive 'architecture types' would be misleading."
  },
  {
    "type": "list",
    "items": [
      "Client–server: a designated server exposes a capability to requesting clients. Useful for centrally governed records, accounts and authoritative APIs. Trade-off: server availability, capacity and trust become important shared concerns.",
      "Peer-to-peer (P2P): participants can both request and provide resources to one another rather than always depending on one central service. Useful in distributed file-sharing and some collaboration networks. Trade-off: discovery, membership, trust and consistency are harder.",
      "Monolithic application: much of the domain logic executes and deploys as one application. It can still provide an HTTP client–server API; monolith is not the opposite of client–server.",
      "Microservices: capabilities are split into separately deployable services that call one another. Their communication is usually still client–server between services; the extra boundaries add coordination and failure modes.",
      "Event-driven communication: a producer publishes an event that one or more consumers process later. Useful for decoupled notifications or asynchronous work. It can coexist with synchronous client–server requests; it does not remove the need to define ownership of operations."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "compare-with-constraints",
    "text": "Choose a design from constraints, not prestige",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "For the present Steward increment, a client calling one authoritative API is straightforward: one central service-registry contract, one location for core validation, and fewer moving parts to deploy and debug. A peer-to-peer service-registry design would need a compelling requirement for independent nodes; otherwise it complicates consistency and control. Splitting the small Steward core into several network services would likewise introduce more operational risk without yet demonstrating a benefit."
  },
  {
    "type": "callout",
    "title": "Decision test",
    "body": "If someone proposes microservices because they are 'more modern', ask which independently changing capability, organizational constraint or measured scaling bottleneck justifies the added network boundary. If they cannot answer, the architecture choice is not yet defensible.",
    "tone": "warning"
  },
  {
    "type": "heading",
    "id": "design-check",
    "text": "Worked design choice: who enforces a business invariant?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Suppose a future UI prevents users from choosing a service as its own dependency. UI validation is helpful but bypassable. A second client can send a request directly. The server must invoke the existing domain rule and return an appropriate failure rather than trusting the client. If only the browser enforces the rule, the system has no reliable single source of truth. This is the distinction between convenient client feedback and authoritative server enforcement."
  },
  {
    "type": "heading",
    "id": "common-misconceptions",
    "text": "Common mistakes and their corrections",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "\"A server is a physical machine.\" Not necessarily: a server is often a program; multiple server processes can run on one machine.",
      "\"Client means browser.\" A CLI, mobile app or another backend can also be a client.",
      "\"Client–server implies PostgreSQL or microservices.\" No: the model defines interaction roles, independent of storage choice or deployment decomposition.",
      "\"A timeout means no update occurred.\" Not necessarily: the response may have been lost after the server committed the operation.",
      "\"A successful HTTP response means the user's workflow succeeded.\" Not automatically: content and business result must also be checked.",
      "\"Stateless means no data is stored.\" It means a specific way of handling requests; durable application state can still exist."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "knowledge-check",
    "text": "Prove the model without looking at notes",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "Define client–server architecture in two sentences, then name its essential roles and why a contract matters.",
      "Draw an Engineering Portal → Steward API → steward-core request. Mark which arrow crosses an HTTP boundary and which is an ordinary function call.",
      "Explain whether a modular monolith can expose a client–server API and why that is not a contradiction.",
      "Compare this Steward design with a peer-to-peer alternative and identify one concrete trade-off for each.",
      "Describe why a client-only self-dependency check is insufficient and how the server should respond."
    ],
    "ordered": true
  },
  {
    "type": "callout",
    "title": "What comes next",
    "body": "The next chapter uses real separate processes to examine HTTP transport, serialization, ambiguous timeouts, state and failures. After that, the module teaches the anatomy and semantics of HTTP messages. You do not need Django, PostgreSQL, microservices or distributed messaging to understand this architectural model.",
    "tone": "note"
  }
], "Understand and defend the client–server pattern from first principles, with a correct division of Steward responsibilities and comparison to other architecture dimensions.", [
  "Define client/server roles, process, host, protocol, tier and module without conflating them.",
  "Draw the current steward-core and future API-client relationship with implemented versus planned labels.",
  "Compare peer-to-peer, client–server, three-tier, modular monolith and microservices in terms of the questions each pattern answers.",
  "Explain who must enforce self-dependency rules and why presentation checks cannot be trusted as the only enforcement."
], "Explain why client/server is a role relationship rather than a hardware distinction. Which architecture terms can coexist? Defend one proposed Steward design and a rejected alternative."),

  lesson("Client-Server Boundaries and Failure Modes", 90, [
  {
    "type": "heading",
    "id": "network-boundary",
    "text": "Why replacing a function call with a network call matters",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A local function call normally executes inside one process and either returns or raises an error according to its programming-language rules. A remote call requires data to be represented as a message, sent across a connection, interpreted by another process and answered. The new boundary introduces more possible failures and less certainty about the other side's internal state."
  },
  {
    "type": "list",
    "items": [
      "Serialization: converting a program value (such as a Python Service object) to a transferable representation (for example JSON text), then interpreting it on the other side. Internal classes should not accidentally become the public contract.",
      "Latency: the time an operation takes. A remote call includes network delays and server work; the client must not assume responses arrive immediately.",
      "Partial failure: one side or one step fails while other parts remain running. Your browser can work while the API is unreachable, or the API can work while its dependency is unavailable.",
      "Timeout: a caller stops waiting after a chosen duration. A timeout tells the caller that it did not receive an answer on time; it does not prove the server did nothing.",
      "Versioning and compatibility: a deployed client may still use an older contract after the server changes. An interface change must consider existing callers.",
      "Authentication and authorization: authentication establishes who a caller is; authorization decides whether that caller is permitted to perform a particular action. A network caller must not be trusted solely because its UI showed an allowed button."
    ],
    "ordered": false
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
    "id": "unknown-outcome",
    "text": "The important difference between a failure and an unknown result",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Imagine a future request that changes a service's status. The server completes the change, but the connection drops before the client receives confirmation. The client sees a timeout. If it sends the operation again, it might perform the change twice. The problem is not that the server necessarily failed: it is that the client cannot tell what happened. A request identifier can help trace an attempt; an idempotent operation is one whose repeated application has the same intended effect as one application. We introduce those names here to explain the danger; the HTTP methods lesson will show precisely which operations can be retried safely."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Possible outcomes of one state-changing request",
    "code": "Client sends \"deactivate Service 7\"\n     |\n     +-- request never reaches server ---------> no change\n     |\n     +-- server rejects request --------------> no change; error response\n     |\n     +-- server changes state; response arrives -> change confirmed\n     |\n     +-- server changes state; response lost --> client sees timeout,\n                                                  but change occurred"
  },
  {
    "type": "heading",
    "id": "state",
    "text": "Where can state live?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "State simply means information remembered across operations. The client's selected tab is presentation state. A service's active/inactive status is domain state. A future database may persist that domain state across restarts. A server can also maintain temporary in-memory state, but it will disappear when the process restarts unless it is stored durably. The architectural question is: which component is authoritative for each fact, who may update it, and how do copies converge? 'Stateless request handling' means a request can be interpreted using the necessary context without relying on an accidental private conversation history in one server process; it does not mean that the whole application has no state."
  },
  {
    "type": "heading",
    "id": "run-it",
    "text": "Run a small client and server yourself",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "The following demonstration uses only Python's standard library, which you encountered earlier, and curl from the previous Web Foundations lesson. It deliberately avoids Django, DRF, authentication, and databases. The goal is to see the architectural boundary first. Save the following code as mini_steward_server.py in a disposable directory. It exposes one read-only operation and returns synthetic JSON data."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "mini_steward_server.py — local, read-only HTTP server",
    "code": "from http.server import BaseHTTPRequestHandler, HTTPServer\nimport json\nimport os\n\nSERVICES = [{\"id\": 7, \"name\": \"Cleaning\", \"active\": True}]\n\nclass StewardHandler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        if self.path != \"/services\":\n            self.send_error(404, \"Resource not found\")\n            return\n\n        data = json.dumps({\"services\": SERVICES}).encode(\"utf-8\")\n        self.send_response(200)\n        self.send_header(\"Content-Type\", \"application/json; charset=utf-8\")\n        self.send_header(\"Content-Length\", str(len(data)))\n        self.end_headers()\n        self.wfile.write(data)\n\nif __name__ == \"__main__\":\n    port = int(os.environ.get(\"STEWARD_DEMO_PORT\", \"8765\"))\n    print(f\"Listening at http://127.0.0.1:{port}\", flush=True)\n    HTTPServer((\"127.0.0.1\", port), StewardHandler).serve_forever()\n"
  },
  {
    "type": "paragraph",
    "text": "The handler is the part of this tiny server that processes requests. The `do_GET` method handles incoming GET operations; `self.path` is the requested path; `send_response` and `send_header` construct response metadata; `wfile.write` sends the body. The list named SERVICES is deliberately in memory and synthetic—it is not Steward's actual persistence layer. The address 127.0.0.1 is the loopback address: requests remain on your own computer, but still cross the process/interface boundary."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Use two terminals; keep the first server process running",
    "code": "# Terminal 1\npython3 mini_steward_server.py\n\n# Terminal 2\ncurl -i http://127.0.0.1:8765/services\ncurl -i http://127.0.0.1:8765/missing\n\n# Stop the server in Terminal 1 with Ctrl+C.\n# Repeat the first curl command and observe the connection failure."
  },
  {
    "type": "paragraph",
    "text": "Expected evidence: the first request gets HTTP 200 with JSON containing service 7. The second reaches the server and gets HTTP 404 because that path does not exist. After stopping the process, the client cannot connect at all; that failure is not an HTTP 404 or HTTP 500, because no server response was delivered. The exact response headers and error text depend on your Python/curl versions. Capture the observed result rather than copying a fabricated transcript."
  },
  {
    "type": "heading",
    "id": "explain-observations",
    "text": "Explain your observations, not just the commands",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "For HTTP 200: identify client program, server process, request path, protocol, response body and the source of the returned data.",
      "For HTTP 404: explain which component produced the result and how you know a server actually received the request.",
      "For connection refusal: explain why no HTTP status exists, even though curl reports an error.",
      "For the same-machine setup: explain why localhost does not make the two processes one application, and why this exercise does not reproduce internet DNS or TLS failures.",
      "For the Steward architecture: replace the hard-coded synthetic list conceptually with a call to existing steward-core operations, without inventing a database or framework implementation."
    ],
    "ordered": true
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
], "Observe a runnable client and server and explain serialization, timeouts, unknown results, state ownership and operational failure boundaries.", [
  "Run mini_steward_server.py from the lesson in a disposable directory and collect real HTTP 200, 404 and connection-refusal evidence with curl.",
  "Identify the processes, protocol, message representation and location of the in-memory synthetic data.",
  "Compare a local steward-core function call with a proposed GET /services and describe serialization, latency, access control and independent failure.",
  "Model two different outcomes for a timed-out state-changing request and explain when a retry is not safe.",
  "Document a boundary decision and one negative or counterexample with independently checkable results."
], "Without notes, distinguish a 404 from a refused connection. Explain why a timeout may follow a successfully committed operation. Show how the server, not the browser, retains authority over domain invariants."),

  lesson("HTTP Requests and Responses", 75, [
  {
    "type": "heading",
    "id": "problem",
    "text": "Why inspect raw HTTP instead of trusting an API tool?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "In the previous chapter you ran a client and a server as separate processes. You saw a success, a missing resource, and a connection failure. Now inspect what the two processes actually exchange when the connection succeeds. HTTP is an application-layer protocol: a shared set of message and behavior rules that lets a client make a request and a server return a response. An HTTP API is one use of that protocol; downloading a web page is another."
  },
  {
    "type": "heading",
    "id": "anatomy-request",
    "text": "Read a request from the first line downward",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "The example below uses HTTP/1.1 notation because it is readable line by line. Its first line is the request line. GET names the operation method, /services is the target path, and HTTP/1.1 names the version of the message format. The Host header says which named server the client intends to reach; the Accept header says which representation formats the client can handle. An empty line ends the headers. This GET has no body. Method semantics are explored more deeply in the next lesson."
  },
  {
    "type": "code",
    "caption": "Illustrative HTTP/1.1 request. This is a protocol transcript, not a curl command.",
    "language": "http",
    "code": "GET /services HTTP/1.1\nHost: 127.0.0.1:8765\nAccept: application/json\n\n"
  },
  {
    "type": "paragraph",
    "text": "The URL you type into curl also includes a scheme and destination: http://127.0.0.1:8765/services. In a typical HTTP/1.1 request to that server, the request target is /services, and Host carries the host and port. The operating system's connection, HTTP message and Steward business logic are different layers. Do not confuse the browser address bar with the exact bytes sent over the connection."
  },
  {
    "type": "heading",
    "id": "anatomy-response",
    "text": "Read a response from status to body",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A server that accepts the request constructs a response. In HTTP/1.1 notation, the status line communicates the outcome category. Headers follow, describing the message or representation, then a blank line separates them from the optional body. A response status of 200 means the request succeeded according to HTTP semantics; it does not alone prove the JSON fields are correct, the caller was authorized properly, or the intended database change occurred."
  },
  {
    "type": "code",
    "caption": "Illustrative success response; real headers and field ordering can differ.",
    "language": "http",
    "code": "HTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nContent-Length: 55\n\n{\"services\":[{\"id\":7,\"name\":\"Cleaning\",\"active\":true}]}"
  },
  {
    "type": "paragraph",
    "text": "The body here is JSON text representing one synthetic Service. Content-Type tells a recipient how to interpret it. Content-Length, when used, describes the body length in bytes, not the number of characters after JavaScript decoding. Do not copy the illustrative Content-Length value as a contractual constant; a real server computes it from the actual bytes sent. The Python mini-server from the previous chapter does exactly that."
  },
  {
    "type": "heading",
    "id": "bytes-boundary",
    "text": "The empty line is a real boundary",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "HTTP/1.1 message syntax uses a blank line after the header fields. Headers are not part of the JSON document; they describe the exchange or its representation. The JSON body starts only after that boundary. A receiver can process response metadata before interpreting the body. With HTTP/2 or HTTP/3 the wire framing is different from the visible HTTP/1.1 lines, but the distinction between method, target, status, header fields and content still matters. Do not treat a human-readable HTTP/1.1 transcript as universal wire framing."
  },
  {
    "type": "heading",
    "id": "why-headers",
    "text": "Headers have different jobs",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "Host identifies the desired host for an HTTP/1.1 server that may handle multiple names.",
      "Accept is the client's preference for what response media types it can use; it does not magically force the server to implement content negotiation.",
      "Content-Type describes the format of the body in the message that carries that header. A client sending JSON may use Content-Type: application/json; a server returning JSON may use it in the response.",
      "Content-Length conveys message-body length in bytes when the protocol uses it; other framing mechanisms also exist.",
      "Authorization carries credentials in some API designs. It is sensitive metadata, not a business field; later identity lessons explain safe token handling.",
      "Location, ETag, Cache-Control and Retry-After support redirects/creation, validation/caching and retry guidance. Learn the mechanism when it becomes relevant, rather than treating their names as definitions."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "experiment",
    "text": "Inspect the same mini-Steward service with curl",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Re-use mini_steward_server.py from the preceding chapter. In Terminal A start python3 mini_steward_server.py from the directory where you saved the file. In Terminal B run these commands. The server is a controlled local example; the JSON record is hardcoded and no database or login exists. The first request should return HTTP 200 with JSON; the second should return HTTP 404 with an HTML error representation. Record actual values rather than copying sample output."
  },
  {
    "type": "code",
    "caption": "Terminal B: first inspect a normal response, then the client's outgoing request and a failure.",
    "language": "bash",
    "code": "curl -i --http1.1 http://127.0.0.1:8765/services\ncurl -v --http1.1 http://127.0.0.1:8765/services\ncurl -i --http1.1 http://127.0.0.1:8765/missing"
  },
  {
    "type": "paragraph",
    "text": "With curl -i, inspect the response headers and body. With curl -v, look for lines describing connection setup and outgoing/incoming protocol details. Python's BaseHTTPRequestHandler defaults to an HTTP/1.0 response even when curl sends an HTTP/1.1 request; this observable difference is expected, not a faulty API. You may see extra headers that are specific to curl or Python: classify what each belongs to rather than memorizing the list. Do not paste tokens or private cookies into shared output when inspecting real systems."
  },
  {
    "type": "heading",
    "id": "negative-test",
    "text": "A client preference is not automatic server behavior",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Now send Accept: text/plain while requesting /services. The mini-server intentionally ignores Accept and still responds with its JSON representation. That is a limitation of THIS implementation, not proof that Accept is meaningless. Content negotiation is behavior the server must implement and define. The experiment demonstrates why a client must examine the observed Content-Type rather than assume its preference was obeyed."
  },
  {
    "type": "code",
    "caption": "A negative contract test: observe, do not invent the expected HTTP status.",
    "language": "bash",
    "code": "curl -i --http1.1 -H 'Accept: text/plain' http://127.0.0.1:8765/services"
  },
  {
    "type": "heading",
    "id": "no-body",
    "text": "A successful response need not contain JSON",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Imagine an API that successfully deletes a resource and returns 204 No Content. That response is intentionally bodyless. A 200 OK response whose body is {} is different: the latter contains a JSON representation and has different meaning for a client expecting data. The 404 response from the local Python server is also not JSON; the body is an HTML error page. A robust client checks status and available metadata before trying to parse content."
  },
  {
    "type": "code",
    "caption": "Two hypothetical successful outcomes with different content guarantees.",
    "language": "http",
    "code": "HTTP/1.1 204 No Content\n\n# No body follows.\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{}"
  },
  {
    "type": "heading",
    "id": "redirects-and-state",
    "text": "Redirects and cookies are HTTP behavior, not JSON",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Some responses direct clients elsewhere using a 3xx status and a Location header. A browser or HTTP library may automatically follow the location, making a sequence of two requests look like one action. Cookies are another distinct mechanism: Set-Cookie in a response can ask a browser to retain data that it sends as Cookie on later applicable requests. These subjects have important security and method details, so this lesson establishes where they appear; later lessons explain how and when to use them."
  },
  {
    "type": "heading",
    "id": "wrong-assumptions",
    "text": "Interpret evidence without overclaiming",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "HTTP 200 does not prove the application returned correct business data; inspect the representation and effects.",
      "HTTP 404 is a response from an HTTP server. It is not the same as failure to resolve a host or failure to establish a connection.",
      "Content-Type tells you how to interpret a message body; Accept requests a preferred output format. They are not interchangeable.",
      "HTTP 204 means no response body. A client that blindly calls JSON.parse on every successful response is broken.",
      "Seeing Authorization in a request does not, by itself, prove that the server correctly authenticated or authorized the operation."
    ],
    "ordered": false
  },
  {
    "type": "heading",
    "id": "transfer",
    "text": "Independent diagnostic exercise",
    "level": 2
  },
  {
    "type": "list",
    "items": [
      "Draw an annotated request and response for the local /services endpoint: method, target, headers, blank line, status, body and each participant's responsibility.",
      "Record the actual behavior of /services, /missing and /services with Accept: text/plain. Explain what the server guarantees and what it does not.",
      "Predict what would happen if a client tried to parse the 404 HTML body as JSON, and identify the check that should come first.",
      "Explain what curl -i reveals versus curl -v and why HTTP/2 traces may not look like literal HTTP/1.1 start lines.",
      "Write one example of a bodyless success and explain how it differs from a JSON object with no fields."
    ],
    "ordered": true
  },
  {
    "type": "resources",
    "title": "Reference after working through the transcript",
    "resources": [
      {
        "title": "MDN — HTTP overview",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
      },
      {
        "title": "RFC 9110 — HTTP Semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc9110"
      }
    ]
  }
], "Identify and interpret the actual parts of HTTP request/response messages and verify their meaning against observable traffic.", [
  "Reuse the preceding mini-Steward server and capture a raw-ish request/response using curl -v and curl -i.",
  "Annotate request line, host, headers, blank line, status line, body and representation semantics.",
  "Run a negative Accept-header experiment and distinguish server behavior from client preferences.",
  "Explain 200 with JSON, 404 with HTML, and hypothetical 204 without a body before parsing any representation.",
  "State the limits of human-readable HTTP/1.1 framing when HTTP/2 or HTTP/3 is negotiated."
], "A client sends Accept: text/plain but receives Content-Type: application/json. Which header states preference and which describes the actual body? Why must a client distinguish 204 No Content from 200 with {}? What does a 404 prove that a connection failure does not?"),

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
