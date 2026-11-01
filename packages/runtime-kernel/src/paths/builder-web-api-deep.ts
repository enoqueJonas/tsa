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
  lesson("How the Web Works", 70, [
  {
    "type": "heading",
    "id": "learning-goal",
    "text": "What the web actually is",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "The World Wide Web is a system for retrieving and linking resources over networks. A resource can be a document, an image or the representation of an application-owned record. Web browsers are clients: they request resources and present results. Servers are programs that accept requests and return responses. The internet is the underlying global network; the web is one use of it, not another name for the entire internet. Email and other network services also use the internet."
  },
  {
    "type": "paragraph",
    "text": "A web address (URL) identifies a resource and indicates how to access it. HTTP provides the shared rules for requests and responses. HTTPS is HTTP carried over a protected connection. An address and an HTTP response are distinct things: knowing where to send a request never guarantees that the resource exists or that the server accepts the operation."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "A browser requesting one resource",
    "code": "Browser (client) -- GET / --> Web server\nBrowser (client) <-- 200 + HTML -- Web server\nBrowser then parses the HTML; it may request CSS, JavaScript and images separately."
  },
  {
    "type": "paragraph",
    "text": "A browser does not receive a finished visual page as one magical network object. It typically receives HTML and then may request linked resources. JavaScript can make additional API calls. A script using curl can make the same kind of HTTP request without rendering any page. This distinction explains why a server can return HTTP 200 while the user still sees a broken interface."
  },
  {
    "type": "heading",
    "id": "request-journey",
    "text": "Trace a visit without skipping hidden steps",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Imagine typing https://example.org/services in a browser. First the client interprets the URL: https is the scheme, example.org is the host and /services is the path. If no port is written, HTTPS normally uses port 443. Later in this module, the dedicated URL lesson will teach query strings, fragments and encoding. At present, recognize that a host name is not itself a numerical network address."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Conceptual request journey — not a guarantee that each step makes a new network call",
    "code": "1. Interpret URL and determine destination\n2. Resolve the hostname to address information when needed (DNS or cache)\n3. Establish the network transport (TCP for ordinary HTTP/1.1 or HTTP/2)\n4. Establish TLS and verify the server identity for HTTPS\n5. Exchange HTTP request and response messages\n6. Interpret the representation; a browser may fetch additional resources"
  },
  {
    "type": "paragraph",
    "text": "DNS stands for Domain Name System. It maps names such as example.org to address information. A client can use cached information, so a DNS query is not guaranteed on every visit. DNS answers a naming question; it neither starts an application nor proves an API is healthy. Multiple addresses may be returned, and the destination chosen by the client can vary."
  },
  {
    "type": "paragraph",
    "text": "A network connection is directed to an address and a port. For HTTP/1.1 or HTTP/2 over TLS, TCP provides an ordered transport between endpoints. A successful connection only shows a transport listener accepted it; it does not certify the API's business logic. HTTPS then uses TLS to protect traffic and authenticate the server under certificate and trust rules. A valid TLS session is not a promise of successful authorization or correct application data."
  },
  {
    "type": "callout",
    "tone": "warning",
    "title": "Important version boundary",
    "body": "The diagram above describes the common HTTP/1.1 and HTTP/2 path, not every possible transport. HTTP/3 uses QUIC over UDP with integrated security rather than TCP followed by a separate TLS-over-TCP step. HTTP methods and status meanings remain broadly shared; do not teach TCP as an invariant of all HTTP."
  },
  {
    "type": "heading",
    "id": "http-exchange",
    "text": "Know where HTTP begins",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Only after the client can communicate with the HTTP-speaking endpoint can it send a request such as GET /services. An HTTP response has a status code, headers and optionally a body. The status is evidence that an HTTP-capable component responded; an intermediary (such as a reverse proxy or CDN) may produce it without executing the intended application handler. A 404 means the responding component reports that the target was not found, not that DNS failed."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Three evidence categories",
    "code": "DNS failure: name cannot be resolved; no HTTP status exists.\nConnection refusal: no expected listener accepts the transport connection; no HTTP status exists.\nHTTP 404: an HTTP responder returned a not-found outcome; inspect which responder supplied it."
  },
  {
    "type": "paragraph",
    "text": "A reverse proxy can sit in front of an application. It can terminate TLS, forward requests, serve cached content or reject a request before the application is reached. The initial boundary to understand is client → HTTP endpoint, not a promise that every request reaches Steward core code. There is no PostgreSQL database or deployed Steward API in this lesson."
  },
  {
    "type": "heading",
    "id": "local-lab",
    "text": "Experiment one: prove HTTP success, not-found and refusal locally",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "This first exercise works offline on macOS or Linux with Python 3 and curl. A local loopback address (127.0.0.1) names your own machine, so the exercise does not demonstrate public DNS or TLS. You are running a disposable static-file HTTP server, not Steward. A command can fail if port 8768 is already in use; choose an unused port and update both terminals consistently."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Terminal A — create one HTML file and run an HTTP server",
    "code": "mkdir -p tsa-web-lab\nprintf '<h1>Local web works</h1>\\n' > tsa-web-lab/index.html\npython3 -m http.server 8768 --bind 127.0.0.1 --directory tsa-web-lab"
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Terminal B — compare HTTP and transport outcomes",
    "code": "curl --noproxy '*' -i --http1.1 http://127.0.0.1:8768/\ncurl --noproxy '*' -i --http1.1 http://127.0.0.1:8768/does-not-exist\n# Return to Terminal A, press Ctrl+C, then rerun:\ncurl --noproxy '*' -v --max-time 3 http://127.0.0.1:8768/"
  },
  {
    "type": "paragraph",
    "text": "In the first request expect an HTTP 200 response and the local HTML body. The Python server may label its reply HTTP/1.0 even though the client requested HTTP/1.1; the semantics still apply. In the second expect HTTP 404 and an error page generated by the file server. After Ctrl+C, curl should report a connection failure (often exit code 7) and no HTTP status; read the actual output instead of inventing a status. A different status suggests a different process answered or your expected port/server setup differs."
  },
  {
    "type": "heading",
    "id": "real-https",
    "text": "Experiment two: inspect public HTTPS when a connection is available",
    "level": 2
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Optional public-network observation; do not paste credentials",
    "code": "curl --noproxy '*' -v --http1.1 --max-time 15 https://example.org/ -o /dev/null"
  },
  {
    "type": "paragraph",
    "text": "This is an observation, not a fixed-output test. If internet access is allowed, mark the resolution/address evidence, connection lines, TLS handshake/certificate verification and eventual HTTP status separately. Output varies by curl build, proxy policy, DNS cache and server behavior; -o /dev/null only discards the response body. The --http1.1 switch chooses HTTP/1.1 for this comparison. If access is blocked, record the earliest observed failure; do not report a successful TLS test that never occurred."
  },
  {
    "type": "callout",
    "tone": "warning",
    "title": "Do not turn off verification to make an exercise green",
    "body": "A certificate failure is useful evidence. Do not reach for -k/--insecure, paste tokens or disable proxy/security controls simply to obtain a 200."
  },
  {
    "type": "heading",
    "id": "diagnostic-transfer",
    "text": "Choose the next observation, not a favourite explanation",
    "level": 2
  },
  {
    "type": "list",
    "ordered": true,
    "items": [
      "A teammate says 'the page won't load' but DNS fails: collect the hostname and resolution error before discussing application logs.",
      "A connection is refused: verify address, port and listener before changing API JSON or business rules.",
      "TLS verification fails: distinguish identity/trust evidence from application authorization.",
      "An HTTP 404 arrives: inspect URL path and responding component, including reverse-proxy routing; do not call it a DNS failure.",
      "An HTTP 500 arrives: an HTTP component responded with a server-error status; investigate its request correlation and ownership, without assuming which handler executed."
    ]
  },
  {
    "type": "paragraph",
    "text": "A transfer task: the static-file server returns 200 for /, 404 for /missing and no HTTP response after shutdown. Predict each result before running it; then explain why these three results require different next actions. Independently describe which URL/transport components must be checked before anyone can conclude 'Steward API is down'."
  },
  {
    "type": "resources",
    "title": "Further reference",
    "resources": [
      {
        "title": "MDN — An overview of HTTP",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
      }
    ]
  }
], "Explain the actual web request path and diagnose evidence at the first failing layer.", [
  "Before running commands, draw the browser → web endpoint path and state what DNS, transport, TLS and HTTP each do.",
  "Run the two-terminal local server exercise; collect actual 200, 404 and post-shutdown connection-failure observations.",
  "Label what the offline lab cannot prove: real DNS resolution, TLS negotiation or Steward application behavior.",
  "Inspect a public HTTPS request with curl -v only where network access is allowed; record the first failed or successful layer without fabricating output.",
  "Produce a five-case diagnosis map, then defend the first next action for an unfamiliar failure."
], "Explain why a TCP connection, valid TLS session and HTTP 200 each prove different things. Which of those necessarily proves that an application handler executed?", [mdnHttp]),

  lesson("URLs and Query Encoding", 65, [
  {
    "type": "heading",
    "id": "purpose",
    "text": "A URL is structured input, not a decorative string",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "HTTP can only make sense of a request target when the client knows where to send it and what resource is being requested. A Uniform Resource Locator (URL) gives the client structured information to locate a resource. Data inside a URL can contain characters that also have structural meanings. Encoding preserves the difference between a delimiter and data; without it, user input can change what the server interprets."
  },
  {
    "type": "heading",
    "id": "anatomy",
    "text": "Read every component without guessing",
    "level": 2
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Anatomy of a URL",
    "code": "https://example.org:443/services/payments?team=platform&tag=api#details\n\\____/ \\_________/ \\______________/ \\___________________/ \\_____/\n scheme  authority        path                 query           fragment"
  },
  {
    "type": "paragraph",
    "text": "The scheme says how to access the resource (https here). The authority includes hostname example.org and optional port 443. The path identifies a resource under that destination. The query carries parameters, often for filtering or pagination. The fragment identifies a location within a representation and is interpreted by the client; it is normally not transmitted as part of the HTTP request target. Some URL forms include credentials; never place secrets in URLs, where logs and browser history may record them."
  },
  {
    "type": "paragraph",
    "text": "The origin for ordinary web security comparison is scheme + host + port (using the effective default port when omitted). Changing https to http or changing ports can change the origin even when the hostname is the same. A domain, origin, path, host machine and API operation are not synonyms."
  },
  {
    "type": "heading",
    "id": "encoding",
    "text": "What %20, +, %26 and %2F mean",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Percent-encoding writes a byte as % followed by two hexadecimal digits. In form-style query encoding, a space is often represented by +, and a literal plus must itself be encoded. An ampersand separates query parameters and an equals sign separates names from values. The value 'payments & ops' therefore cannot be safely appended to '?team=' unchanged. Path segments have different escaping rules: a literal slash divides segments, whereas an identifier containing a slash may need %2F."
  },
  {
    "type": "callout",
    "tone": "note",
    "title": "Encoding is not encryption",
    "body": "Percent-encoding preserves URL syntax; it does not conceal information. Do not put passwords, access tokens or sensitive personal data in URL paths or query parameters."
  },
  {
    "type": "heading",
    "id": "worked-example",
    "text": "Run a full parser/encoder and trace every output",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "You already learned Python imports, variables and lists in Programming with Python. This example uses only its standard library, without a web connection. Save the following code as url_parser.py and run python3 url_parser.py. The list of pairs is deliberate: it preserves two tag parameters with the same name. urlencode converts the data into a safe query; urlsplit then separates components; parse_qs reconstructs query values as lists."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "url_parser.py — independently runnable standard-library example",
    "code": "from urllib.parse import urlencode, urlsplit, parse_qs, quote\n\nparameters = [(\"team\", \"payments & ops\"), (\"tag\", \"api\"), (\"tag\", \"bank\")]\nurl = \"https://example.org/services?\" + urlencode(parameters) + \"#details\"\nparts = urlsplit(url)\nrequest_target = parts.path + \"?\" + parts.query\n\nprint(url)\nprint(\"origin:\", f\"{parts.scheme}://{parts.netloc}\")\nprint(\"request target:\", request_target)\nprint(\"teams:\", parse_qs(parts.query)[\"team\"])\nprint(\"tags:\", parse_qs(parts.query)[\"tag\"])\nprint(\"fragment:\", parts.fragment)\nprint(\"encoded id:\", quote(\"payments/core\", safe=\"\"))\nprint(\"bad query team:\", parse_qs(\"team=payments & ops\")[\"team\"])"
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Observed Python 3 output (the example above has been executed)",
    "code": "https://example.org/services?team=payments+%26+ops&tag=api&tag=bank#details\norigin: https://example.org\nrequest target: /services?team=payments+%26+ops&tag=api&tag=bank\nteams: ['payments & ops']\ntags: ['api', 'bank']\nfragment: details\nencoded id: payments%2Fcore\nbad query team: ['payments ']"
  },
  {
    "type": "paragraph",
    "text": "Walk the first line: urlencode turns the space into + and the literal & into %26. The server-side query decoder therefore sees one team value, 'payments & ops', not an accidental second parameter. The list has two separate tag pairs; parse_qs returns both instead of silently overwriting one. urlsplit exposes fragment 'details', but request_target deliberately omits it. The path identifier 'payments/core' becomes 'payments%2Fcore' when quote uses safe='' so its slash is data, not a hierarchy delimiter."
  },
  {
    "type": "paragraph",
    "text": "The final line is a negative test: manual concatenation produces 'team=payments & ops'. A typical query parser sees only 'payments ' as the team value because the unescaped & starts another parameter. A request can be valid HTTP yet represent the wrong user intention. This is why query composition belongs in encoding utilities instead of string concatenation."
  },
  {
    "type": "heading",
    "id": "path-vs-query",
    "text": "Choose path and query based on identity",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A path such as /services/17 commonly names one resource; a query such as /services?team=platform commonly selects a view or collection subset. These are design conventions, not universal HTTP requirements. A path segment is not necessarily an integer ID; if an identifier can contain '/', encode that segment rather than accidentally creating another path level. Query parameters can repeat. The server contract must define whether repeats are accepted, rejected or combined."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Two distinct intended targets",
    "code": "GET /services/17                 # retrieve a selected resource\nGET /services?tag=api&tag=bank  # filter a collection using repeated parameters\nGET /services/payments%2Fcore   # one encoded identifier containing a slash"
  },
  {
    "type": "heading",
    "id": "failure-analysis",
    "text": "Separate a syntax error from a contract error",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "If a query name is unknown, the URL can still be syntactically valid but violate the API contract. If an API expects one 'limit' value and receives two, the server must define how it handles that case; an encoding library cannot decide the domain rule. A '#' inside a URL starts a fragment unless encoded as part of data. Treat copied URLs and manually constructed URLs with suspicion, particularly when a value contains &, =, +, # or /."
  },
  {
    "type": "heading",
    "id": "practical-transfer",
    "text": "Apply the encoding decision to Steward without inventing an API",
    "level": 2
  },
  {
    "type": "list",
    "ordered": true,
    "items": [
      "Write URLs for service 17, for services filtered by team 'platform & operations', and for two tag filters. Show the encoded target and decoded values.",
      "Predict what happens if the raw value 'platform & operations' is concatenated without encoding; run a parser to confirm.",
      "Compare /services/payments/core with /services/payments%2Fcore. Describe why a server router might interpret them differently.",
      "Explain which portion of https://example.org/services?tag=api#results reaches an HTTP server and which is a browser-side fragment.",
      "Design one clear validation rule for a repeated 'limit' query parameter. Test a negative case and justify the HTTP-facing client error you would document."
    ]
  },
  {
    "type": "paragraph",
    "text": "Independent check: a colleague proposes a link with a secret token in the query and argues percent-encoding makes it safe. Reject or accept that proposal with a mechanism-based explanation. Then modify the executable example to accept tag=quality a third time and verify the parser returns all three tags without changing the team."
  },
  {
    "type": "resources",
    "title": "Reference for standard-library behavior",
    "resources": [
      {
        "title": "Python docs — urllib.parse",
        "url": "https://docs.python.org/3/library/urllib.parse.html"
      },
      {
        "title": "MDN — URI",
        "url": "https://developer.mozilla.org/en-US/docs/Web/URI"
      }
    ]
  }
], "Correctly parse and construct resource URLs, including query encoding, fragments and repeated parameters.", [
  "Save and execute url_parser.py exactly; compare each output with the expected transcript.",
  "Generate three Steward URL examples from structured data, including a query value containing spaces and an ampersand.",
  "Break one URL by manually concatenating unencoded input; document the changed parsed value.",
  "Compare an encoded slash in a single identifier with two path segments, and distinguish path, query and fragment.",
  "Design and justify an API rule for repeated limit parameters and a safe logging rule for URLs."
], "Why does an unescaped ampersand change a query? What part of an address does the browser not send in the HTTP request target, and what does percent-encoding not protect?", [mdnHttp, { title: "Python docs — urllib.parse", url: "https://docs.python.org/3/library/urllib.parse.html" }]),

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

  lesson("Methods, Headers and Status Codes", 60, [
  {
    "type": "heading",
    "id": "bridge",
    "text": "Choose behavior before choosing a verb"
  },
  {
    "type": "paragraph",
    "text": "You can now identify the method, target, headers, status and content of an HTTP message. Apprentice's workbench supplied terminal, foreground-process and curl observation skills; Python supplied dictionaries, functions and conditionals. No Django application or database exists in this exercise. The question here is how a caller can predict an operation's effect before sending it. A method is the request's operation category; a resource is the thing identified by the target, such as one service or the collection of services."
  },
  {
    "type": "paragraph",
    "text": "Imagine an API that deletes /services/42 when it receives GET. A browser preview, link checker or retry could remove a service when its caller only intended to read. Shared method semantics prevent that surprise. The method communicates a promise; the handler must implement that promise. Writing GET in a request does not physically prevent a badly written handler from changing data."
  },
  {
    "type": "heading",
    "id": "operation-contract",
    "text": "Read, submit, replace, modify and remove"
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Proposed future Steward operations, not running endpoints",
    "code": "GET    /services/42              read one representation\nPOST   /services                 submit a new service for processing/creation\nPUT    /services/42              replace writable state at a known identity\nPATCH  /services/42              apply a specified partial change\nDELETE /services/42              remove the target association/resource"
  },
  {
    "type": "paragraph",
    "text": "POST lets the target decide how to process submitted content. A collection can allocate a new service identity; an action endpoint can start a workflow. PUT supplies the desired replacement at a target chosen by the caller. PATCH supplies change instructions, whose format and treatment of omitted fields must be documented. DELETE requests removal of the target; it does not promise physical erasure of every historical record. A resource's allowed methods are part of its contract, not something a client can infer from a URL's spelling."
  },
  {
    "type": "paragraph",
    "text": "For a proposed service with name and lifecycle, a PUT containing only name is not automatically a name-only update: the contract must say whether the incomplete replacement is rejected or what replacement means for omitted writable fields. PATCH can express 'set name, leave lifecycle alone'. The same word update hides these different promises. We will study retry properties in the next lesson."
  },
  {
    "type": "heading",
    "id": "status-decision",
    "text": "A status tells the client what kind of result occurred"
  },
  {
    "type": "paragraph",
    "text": "First ask whether an HTTP response arrived at all. Connection refusal has no HTTP status. When a response exists, its status classifies that attempt. 2xx reports success; 3xx covers redirection and conditional reuse; 4xx reports a problem fulfilling the request as sent; 5xx reports server failure or inability to fulfill it. A 5xx does not prove the request was valid, and none of these classes alone proves the intended business outcome."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "A decision table for a proposed create contract",
    "code": "created now                         201 + Location identifying new resource\naccepted for later work              202 + a documented way to inspect progress\nsuccessful with no response content  204 (do not JSON-parse an absent body)\nmalformed/invalid request             400 (this contract's input-error policy)\nmissing/invalid credentials           401 + WWW-Authenticate challenge\naction refused                       403 (do not retry unchanged credentials blindly)\ntarget absent or concealed           404\nknown target, method not allowed      405 + Allow listing supported methods\nconflict with current state           409\nunsupported request media type        415\nunexpected processing defect          500\ntemporarily unable to serve           503, possibly Retry-After"
  },
  {
    "type": "paragraph",
    "text": "Authentication establishes a caller's identity; authorization decides what that caller may do. 401 calls for acceptable credentials and a challenge, while 403 is refusal of the requested action. A server may conceal a forbidden resource with 404. Do not diagnose identity policy from a status alone without the documented contract. Some APIs use 422 for understood content that fails semantic validation; choose and document a consistent distinction from 400 rather than guessing which number is universally correct. Rate-limiting policies commonly use 429; waiting does not fix a forbidden action."
  },
  {
    "type": "heading",
    "id": "executable-methods",
    "text": "Run a complete, deliberately small method contract"
  },
  {
    "type": "paragraph",
    "text": "Save the following as method_server.py in a disposable directory and run python3 method_server.py. It stays running without a startup banner; use a second terminal for curl. If 8766 is occupied, choose another unused port and change both server and commands. This uses UTF-8 plain text so we can isolate methods before the JSON lesson. The only field is a non-empty name. Everything is in memory and disappears on restart. This server intentionally lacks authentication, persistence, general input hardening, PUT/PATCH support and concurrent handling; it is a teaching experiment, not a Steward implementation."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "method_server.py — complete disposable method experiment",
    "code": "from http.server import BaseHTTPRequestHandler, HTTPServer\n\n# A disposable, single-threaded, one-field resource. Restart resets all state.\nservices = {}\nnext_id = 1\n\nclass Handler(BaseHTTPRequestHandler):\n    def reply(self, status, text=\"\", **headers):\n        payload = text.encode(\"utf-8\")\n        self.send_response(status)\n        if status != 204:\n            self.send_header(\"Content-Type\", \"text/plain; charset=utf-8\")\n            self.send_header(\"Content-Length\", str(len(payload)))\n        for name, value in headers.items():\n            self.send_header(name, value)\n        self.end_headers()\n        self.wfile.write(payload)\n\n    def do_GET(self):\n        if self.path == \"/services\":\n            self.reply(200, repr(services))\n        elif self.path in services:\n            self.reply(200, services[self.path])\n        else:\n            self.reply(404, \"unknown resource\")\n\n    def do_POST(self):\n        global next_id\n        if self.path != \"/services\":\n            self.reply(404, \"unknown collection\")\n            return\n        if self.headers.get(\"Content-Type\") != \"text/plain\":\n            self.reply(415, \"send Content-Type: text/plain\")\n            return\n        length = int(self.headers.get(\"Content-Length\", \"0\"))\n        name = self.rfile.read(length).decode(\"utf-8\").strip()\n        if not name:\n            self.reply(400, \"name must not be empty\")\n            return\n        target = f\"/services/{next_id}\"\n        next_id += 1\n        services[target] = name\n        self.reply(201, name, Location=target)\n\n    def do_DELETE(self):\n        if self.path not in services:\n            self.reply(404, \"unknown resource\")\n            return\n        del services[self.path]\n        self.reply(204)\n\n    def do_PUT(self):\n        self.reply(405, \"PUT is not part of this collection contract\",\n                   Allow=\"GET, POST\")\n\nHTTPServer((\"127.0.0.1\", 8766), Handler).serve_forever()"
  },
  {
    "type": "code",
    "language": "shell",
    "caption": "Run in a second terminal against a freshly started server",
    "code": "curl --noproxy '*' -i http://127.0.0.1:8766/services\ncurl --noproxy '*' -i -H 'Content-Type: text/plain' --data 'Payments' http://127.0.0.1:8766/services\ncurl --noproxy '*' -i http://127.0.0.1:8766/services/1\ncurl --noproxy '*' -i -H 'Content-Type: application/json' --data '{}' http://127.0.0.1:8766/services\ncurl --noproxy '*' -i -H 'Content-Type: text/plain' --data '' http://127.0.0.1:8766/services\ncurl --noproxy '*' -i -X PUT http://127.0.0.1:8766/services\ncurl --noproxy '*' -i -X DELETE http://127.0.0.1:8766/services/1\ncurl --noproxy '*' -i -X DELETE http://127.0.0.1:8766/services/1",
    "output": "Statuses in order: 200, 201, 200, 415, 400, 405, 204, 404. The 201 includes Location: /services/1; the 405 includes Allow: GET, POST. Date and Server headers vary. The 204 has no content."
  },
  {
    "type": "paragraph",
    "text": "The initial GET reads an empty dictionary. --data selects POST; the server checks Content-Type before reading and validating the name, allocates /services/1, stores Payments and returns 201 with Location. Follow that path with GET to verify the created state rather than trusting the status alone. The wrong media type is rejected with 415; the empty name is rejected with 400. Neither allocates an identity. The known collection rejects PUT with 405 and advertises its allowed methods. DELETE changes state once; the second DELETE finds no target. Different statuses across repeated requests can still produce the same final state."
  },
  {
    "type": "heading",
    "id": "diagnose",
    "text": "Separate handler support from domain validation"
  },
  {
    "type": "paragraph",
    "text": "Sending PATCH to this server produces BaseHTTPRequestHandler's default 501 response because no do_PATCH handler exists. That is not evidence that a Steward domain rule or JSON validator rejected your patch. Our explicit PUT handler demonstrates the more specific 405 policy for the known collection. To investigate an unexpected response, record the exact method and target, inspect Content-Type and body, then compare the supported-method contract with the handler selected. If startup reports address already in use, resolve the listener problem before interpreting any API result."
  },
  {
    "type": "paragraph",
    "text": "Returning 200 with an error flag forces every generic client to understand your custom body before it can distinguish ordinary success from rejection. Specific statuses preserve shared meaning; stable application error codes add domain detail later. Conversely, a useful status cannot replace an explanation of which field is invalid or what conflict must be resolved."
  },
  {
    "type": "heading",
    "id": "practice-methods",
    "text": "Practice and transfer"
  },
  {
    "type": "list",
    "ordered": true,
    "items": [
      "Run the eight requests on a fresh server. Annotate which handler ran, the state before/after and what each header proves. Record actual output.",
      "Repeat a valid POST twice. Read /services and explain why two identities exist; contrast repeated GET and DELETE. Restart to reset synthetic state.",
      "Without changing code, predict an unknown GET path and unsupported PATCH, then execute them. Explain 404 versus 501 and why neither proves a business validator ran.",
      "Design method/status choices for read service, create service, replace writable state, change name, remove service and add dependency. Label these proposals; the lab does not implement them.",
      "Transfer rubric: explain method intent, predict state, choose a specific status, justify a client action and distinguish unimplemented behavior from domain rejection. All five must be correct on an unfamiliar example before claiming independent application."
    ]
  },
  {
    "type": "resources",
    "resources": [
      {
        "title": "RFC 9110 — method and status semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc9110.html#section-9"
      }
    ]
  }
], "Execute a complete method/status experiment and justify the resulting client behavior.", ["Run the eight requests in the reading against a fresh method_server.py.","Annotate handler, state change, status, headers and content.","Execute unsupported PATCH and a repeated POST; explain the differences.","Design six future Steward operation contracts without claiming they exist."], "Explain why a 405 differs from a 404, why a 201 needs state verification, and why repeated DELETE may return different statuses.", [mdnMethods, mdnStatus, rfc9110]),

  lesson("Retries, Idempotency and Conditional Requests", 60, [
  {
    "type": "heading",
    "id": "retry-bridge",
    "text": "When the response is missing, the outcome is unknown"
  },
  {
    "type": "paragraph",
    "text": "The methods experiment showed that repeated POST can allocate two identities, while a second DELETE can return 404 after the first returned 204. Now connect that behavior to the timeout problem from Client–Server Boundaries. A response can be lost after the server commits a change. The client observes uncertainty, not cancellation. This lesson uses the Python state model you already know to reason about retries and concurrent edits without pretending that an HTTP service or database has implemented these protections."
  },
  {
    "type": "heading",
    "id": "safe-idempotent",
    "text": "Safety and idempotency answer different questions"
  },
  {
    "type": "paragraph",
    "text": "A safe method does not request a state change: GET, HEAD, OPTIONS and TRACE have safe semantics. A server may still log requests or count metrics; those incidental effects do not make reading a resource an intended write. Idempotency asks whether repeating the same request has the same intended server effect as sending it once. Safe methods are idempotent; PUT and DELETE are also idempotent but request changes. POST and PATCH do not carry a general idempotency guarantee. A particular operation can provide a stronger documented application guarantee."
  },
  {
    "type": "paragraph",
    "text": "Setting name to Ledger twice leaves name as Ledger. Incrementing a counter twice adds two. A PATCH that sets a field may be idempotent, while a patch instruction that appends an item may not be. DELETE can return 204 followed by 404 yet leave the same target absent. Idempotency concerns intended effect, not identical status, content, log count or freedom from other clients' intervening changes. It also does not mean a stale PUT cannot overwrite newer data."
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Reason about a lost response before selecting a retry policy",
    "code": "Attempt 1: client sends create -> server creates identity 1 -> response lost\nClient only knows: no confirmed response\nAttempt 2 with ordinary POST -> server might create identity 2\nAttempt 2 with same protected operation identity -> server replays identity 1\n\nAlternative history: attempt 1 never arrived\nProtected attempt 2 -> server performs the operation once"
  },
  {
    "type": "heading",
    "id": "key-contract",
    "text": "An operation key identifies one intent across attempts"
  },
  {
    "type": "paragraph",
    "text": "An idempotency key is a client-chosen identifier for one logical operation, reused across retries of that same input. A server must define its scope (for example caller plus operation), compare the original input with retry input, and retain the result long enough for its documented retry window. A different logical creation gets a new key even if its name matches. Reusing a key with changed input should fail under a documented policy; silently replaying a different operation is dangerous."
  },
  {
    "type": "paragraph",
    "text": "Recognizing a key is insufficient if two workers can both see it as absent and create two resources. Production handling must coordinate duplicate detection and the effect atomically, handle in-progress attempts, recover after crashes, and define retention expiry. The sequential in-memory model below demonstrates the decision rules only. It loses records on restart and has no race protection. A request/correlation identifier helps find logs; it is not deduplication unless the server implements a contract for that purpose."
  },
  {
    "type": "heading",
    "id": "conditional",
    "text": "Version conditions protect against lost updates"
  },
  {
    "type": "paragraph",
    "text": "Suppose two editors read revision 3. Editor A changes the name and advances to revision 4; editor B's replacement from revision 3 would erase A's work. A validator such as an ETag lets the client attach a condition to the write. A strong ETag identifies the current representation for comparison; clients treat its quoted value as opaque, rather than inventing the next value. If-Match with the observed strong validator means apply only if the server's current representation still matches. On mismatch, 412 Precondition Failed tells the client to fetch and reconcile instead of blindly resending."
  },
  {
    "type": "code",
    "language": "http",
    "caption": "Illustrative future exchange — not implemented by method_server.py",
    "code": "GET /services/42\n-> 200 OK\n   ETag: \"revision-3\"\n\nPUT /services/42\nIf-Match: \"revision-3\"\n...complete writable replacement...\n\n-> 204 No Content   (if still current)\nor 412 Precondition Failed (if another edit changed the validator)"
  },
  {
    "type": "paragraph",
    "text": "For a cached read, If-None-Match asks a different question: send the representation only if it differs from the stored validator. A matching conditional GET can receive 304, which has no response content; the client reuses its stored representation. That is different from 204 after a successful write. A cache without the stored representation cannot reconstruct it from a bare 304. These headers solve version comparison, not identity or permission checks."
  },
  {
    "type": "heading",
    "id": "model",
    "text": "Execute the decisions and trace the state"
  },
  {
    "type": "paragraph",
    "text": "Save retry_model.py below and run python3 retry_model.py. It requires only Python's standard runtime and the earlier dictionary/function/conditional concepts. Predict each line before execution. The revision integer models a version condition; it does not implement HTTP ETag comparison. Read each function from its first guard to its state change."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "retry_model.py — assignment, duplication and stale writes",
    "code": "# Pure Python model, not an HTTP server or production concurrency control.\nstate = {\"name\": \"Payments\", \"revision\": 1}\ncreations = []\nremembered = {}\n\ndef replace_name(name):\n    state[\"name\"] = name\n\ndef increment():\n    state[\"revision\"] += 1\n\ndef create(key, name):\n    if key in remembered:\n        old_name, identity = remembered[key]\n        if old_name != name:\n            return \"409 key reused with different input\"\n        return identity\n    identity = len(creations) + 1\n    creations.append(name)\n    remembered[key] = (name, identity)\n    return identity\n\ndef conditional_name(expected_revision, name):\n    if expected_revision != state[\"revision\"]:\n        return \"412 stale version\"\n    state[\"name\"] = name\n    state[\"revision\"] += 1\n    return \"204 changed\"\n\nreplace_name(\"Ledger\")\nreplace_name(\"Ledger\")\nprint(\"repeated assignment:\", state[\"name\"])\nincrement()\nincrement()\nprint(\"repeated increment:\", state[\"revision\"])\nprint(\"same key:\", create(\"operation-a\", \"Payments\"),\n      create(\"operation-a\", \"Payments\"), \"count:\", len(creations))\nprint(\"changed payload:\", create(\"operation-a\", \"Different\"))\nprint(\"new key:\", create(\"operation-b\", \"Payments\"), \"count:\", len(creations))\nobserved_revision = state[\"revision\"]\nprint(\"editor A:\", conditional_name(observed_revision, \"Owner A\"))\nprint(\"editor B:\", conditional_name(observed_revision, \"Owner B\"))\nprint(\"final name:\", state[\"name\"])",
    "output": "repeated assignment: Ledger\nrepeated increment: 3\nsame key: 1 1 count: 1\nchanged payload: 409 key reused with different input\nnew key: 2 count: 2\neditor A: 204 changed\neditor B: 412 stale version\nfinal name: Owner A"
  },
  {
    "type": "paragraph",
    "text": "Assignment stores the same value twice. The two increments move revision from 1 to 3. create remembers operation-a's original input and allocated identity, so its retry returns 1 without appending. Changed input with that key is rejected. operation-b is a new intent, so it creates identity 2. Both editors then start from observed revision 3; A advances it to 4, B's guard fails, and Owner A remains. Inspecting the collection length and final name verifies effects rather than relying only on labels."
  },
  {
    "type": "heading",
    "id": "retry-diagnosis",
    "text": "Waiting and retrying are separate decisions"
  },
  {
    "type": "paragraph",
    "text": "Retry-After can express a delay in seconds or an HTTP date; it does not guarantee a retry will succeed or make a duplicate effect safe. A rate-limited 429 or temporary 503 may justify a bounded wait when the operation's retry contract is understood. A 400 with unchanged invalid input does not. Use a finite attempt/time budget and increasing delays; random variation in delays reduces synchronized client bursts. Stop and surface uncertainty when the budget ends. A timeout on an unprotected creation should trigger reconciliation using durable operation evidence rather than an invented success or endless retries."
  },
  {
    "type": "paragraph",
    "text": "If every retry creates a duplicate, inspect whether the client changed keys or the server lost its records. If 412 repeats, check whether the client is resending the same stale validator. Fetch the current representation, compare the intended change with intervening edits, and ask for a new decision when reconciliation is ambiguous. Removing If-Match simply removes the guard; it does not resolve the conflict."
  },
  {
    "type": "heading",
    "id": "retry-practice",
    "text": "Independent prediction and design"
  },
  {
    "type": "list",
    "ordered": true,
    "items": [
      "Run the model and annotate dictionary/list state after each call. Change editor B to use the current revision; predict and then verify that it overwrites A. Explain why this is a new decision rather than a safe automatic fix.",
      "Simulate a lost response by calling create once without using its returned value, then calling it again with the same key. Compare with a fresh key and verify collection length.",
      "Design a proposed creation-key contract with caller scope, payload comparison, in-progress behavior and retention window. Mark crash safety and concurrency as unimplemented.",
      "For a timeout on POST, a 400, a 503 with Retry-After, and a stale-write 412, choose retry, correction or reconciliation and justify what evidence permits the decision.",
      "Transfer rubric: on an unfamiliar append operation, correctly predict duplicate effects, distinguish safety from idempotency, preserve operation identity and reject a stale write. All four must pass independently; running this model alone does not establish learner validation."
    ]
  },
  {
    "type": "resources",
    "resources": [
      {
        "title": "RFC 9110 — idempotency and conditional requests",
        "url": "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2"
      },
      {
        "title": "RFC 5789 — PATCH semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc5789.html#section-2"
      }
    ]
  }
], "Predict duplicate effects and stale writes using an executable state model.", ["Execute retry_model.py and explain each state transition.","Simulate a lost response with the same operation key and then with a new key.","Change the version used by editor B; predict and verify the effect.","Design a bounded retry/reconciliation policy and state the model's production limitations."], "Can an idempotent operation overwrite a newer change? Explain how an operation key and If-Match solve different problems.", [mdnMethods, mdnStatus, rfc9110]),

  lesson("JSON and Content Types", 70, [
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
    {"type":"heading","id":"the-parsing-boundary","text":"A JSON parser understands syntax, not your business","level":2},
    {"type":"paragraph","text":"The first question is whether a string follows JSON grammar. A JSON parser can answer that; it cannot decide whether a criticality value is allowed or whether a service may reference itself. This is a three-stage boundary: PARSE the representation, CHECK SHAPE and field types, then ENFORCE DOMAIN RULES. Authentication and authorization are separate checks before a state-changing operation is accepted. Conflating the stages leads to confusing error messages and weak tests."},
    {"type":"code","language":"text","caption":"Failure classification is a progression, not one generic 'invalid JSON' category.","code":"Raw bytes -> JSON parsing -> expected object and field types -> domain invariants\n                 |                  |                          |\n             syntax error        shape error                 domain error\n\nA request can pass the first two stages and fail the third."},
    {"type":"heading","id":"python-experiment","text":"Work through four examples with Python's JSON library","level":2},
    {"type":"paragraph","text":"Run the following code as json_boundary.py. The first payload is valid, the second has valid JSON syntax but an unsupported value, the third has invalid JSON syntax because of a trailing comma, and the fourth is valid JSON but is an array where the application expects an object. Notice that json.loads only parses; our separate checks supply application meaning. The small checker is intentionally not a complete Steward validator."},
    {"type":"code","language":"python","caption":"json_boundary.py — executable syntax, shape and domain distinctions","code":"import json\n\nsamples = [\n    '{\"name\":\"Payments\",\"criticality\":\"high\"}',\n    '{\"name\":\"Payments\",\"criticality\":\"banana\"}',\n    '{\"name\":\"Payments\",}',\n    '[\"Payments\"]',\n]\n\nfor raw in samples:\n    try:\n        record = json.loads(raw)\n    except json.JSONDecodeError:\n        print(\"SYNTAX ERROR\")\n        continue\n\n    if not isinstance(record, dict):\n        print(\"SHAPE ERROR\")\n    elif not isinstance(record.get(\"name\"), str) or not isinstance(record.get(\"criticality\"), str):\n        print(\"SHAPE ERROR\")\n    elif record.get(\"criticality\") not in (\"low\", \"medium\", \"high\"):\n        print(\"DOMAIN ERROR\")\n    else:\n        print(\"ACCEPTED\")"},
    {"type":"code","language":"text","caption":"Expected four lines, in the same order as the input strings.","code":"ACCEPTED\nDOMAIN ERROR\nSYNTAX ERROR\nSHAPE ERROR"},
    {"type":"paragraph","text":"Try changing 'banana' to 'low', or changing the first payload's criticality number to 7. Explain why the classification changes. Parsing and validation may both reject a value, but their error causes are different. An HTTP framework could map these failures to distinct application error codes; those choices belong to the future API contract, not to json.loads."},
    {"type":"heading","id":"missing-versus-null","text":"Omitted, null, empty and zero are not synonyms","level":2},
    {"type":"paragraph","text":"An omitted member means the sender did not provide that member. A member set to null means the sender explicitly supplied JSON null, which Python decodes to None. An empty string, an empty array and the number zero are present values. An API might interpret omitted during PATCH as 'leave unchanged' and null as 'clear the field'—but only if that behavior is explicitly defined. Do not assume it silently."},
    {"type":"code","language":"python","caption":"Run this separate Python snippet to observe membership and value.","code":"import json\nfor raw in ('{}', '{\"ownerTeamId\":null}', '{\"ownerTeamId\":0}'):\n    record = json.loads(raw)\n    if \"ownerTeamId\" not in record:\n        print(\"omitted\")\n    elif record[\"ownerTeamId\"] is None:\n        print(\"explicit null\")\n    else:\n        print(\"value:\", record[\"ownerTeamId\"])"},
    {"type":"code","language":"text","caption":"Expected output; the zero value is present, not missing.","code":"omitted\nexplicit null\nvalue: 0"},
    {"type":"heading","id":"media-type-boundary","text":"HTTP metadata and JSON bytes are separate contracts","level":2},
    {"type":"paragraph","text":"Content-Type is supplied by the sender of a body to describe that body. Accept is supplied by the requester to express formats it can receive. A server that implements POST /services might reject a request with Content-Type: text/plain if it only accepts JSON. However, that future POST endpoint does not exist yet in this learning checkpoint. The local mini-Steward server supports only GET; issuing POST to it cannot test JSON parsing, media-type policy or Steward domain validation. Do not mistake an unimplemented method for a content-type test."},
    {"type":"paragraph","text":"Some APIs return 415 Unsupported Media Type when they cannot process the incoming representation; others may respond 406 Not Acceptable if none of their outputs satisfy the client's Accept preferences. Those are design and implementation decisions under HTTP semantics. A client that sets Content-Type: application/json but sends malformed bytes has not made its body valid JSON merely by declaring the header."},
    {"type":"heading","id":"independent-json-challenge","text":"Before moving on: classify the cause, not just the symptom","level":2},
    {"type":"list","ordered":true,"items":["Predict the four output lines before running json_boundary.py, then explain any incorrect prediction.","Modify one sample to contain valid JSON with an integer where a text field is required. Describe which validation stage should reject it.","Decide what missing versus null should mean for an optional future Service field. Write separate tests for both outcomes.","Propose the HTTP request headers for sending JSON and requesting JSON without claiming any endpoint has been implemented.","Explain why valid JSON from an authorized client may still violate a Steward business invariant."]},
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Create valid JSON representations for a service and environment.", "Create syntactically valid JSON that violates Steward rules.", "Send a request with the wrong Content-Type and inspect the response.", "Explain how null differs from an omitted property for at least one Steward field."] },
    { type: "resources", resources: [jsonSpec, mdnHttp] },
  ], "Distinguish JSON syntax, HTTP representation metadata and domain validation.", [
    "Create valid and invalid Steward JSON representations.",
    "Send requests with correct and incorrect Content-Type headers and compare the responses.",
    "Use Accept and Content-Type independently and explain what each header communicates.",
    "Test an omitted property, an explicit null value and a syntactically valid value that violates a Steward domain rule."
  ], "Why can a request contain valid JSON and still be invalid for Steward? Explain the difference between Content-Type and Accept, and distinguish an omitted property from an explicit null value.", [jsonSpec, jsonVideo]),

  lesson("REST Principles and Trade-offs", 65, [
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
    {"type":"heading","id":"mechanism-trace","text":"What the constraints change in a real exchange"},
    {"type":"paragraph","text":"Build on the previous method, retry and JSON lessons. REST is an architectural style for interactions between components. Client/server separates presentation from resource authority. Stateless interaction means each request carries the context needed to interpret it: the server must not depend on a hidden conversational step such as 'the service this connection selected last'. The server can still store service records. Application data and conversation state are different things. GET /services/42 identifies its target on every request, so a different server worker can interpret it without remembering a previous selection."},
    {"type":"paragraph","text":"A uniform interface means shared rules for identifying resources, manipulating them through representations and interpreting self-describing messages, with links describing available transitions. A JSON API with noun-shaped URLs alone does not demonstrate all these constraints. For example, a response can link to its owner's resource and a permitted next operation rather than requiring every caller to invent related URLs. That reduces hard-coded navigation but adds representation and client complexity. In this course the proposed Steward interface is resource-oriented HTTP; do not claim full REST conformance just from its names."},
    {"type":"paragraph","text":"Cacheability makes reuse explicit. A public service description may be reusable for a documented freshness period, avoiding repeated work; caller-specific data requires a deliberate private/no-store policy so one caller's representation is not exposed to another. A validator can let the client recheck freshness using the earlier conditional GET mechanism. The cost is deciding which changes invalidate old representations. Layering permits a client to interact through a proxy without knowing the final implementation, provided the visible contract is preserved. Each layer can add latency and complicate diagnosis. Optional code-on-demand allows downloaded executable client behavior; it is not required for this proposed API."},
    {"type":"heading","id":"worked-transfer","text":"Compare two designs for the same ownership workflow"},
    {"type":"paragraph","text":"Assume a future requirement: Team A proposes transferring a service to Team B, and Team B must accept. These teams and approvals are proposed capabilities, not implemented by the previous lab. Simply PATCHing ownerTeamId would skip the pending decision. Model the states first: pending, accepted or rejected. Only a permitted decision changes ownership. Repeating acceptance must not transfer twice or emit duplicate business effects."},
    {"type":"code","language":"text","caption":"Two proposed contracts for the same workflow","code":"A. Resource-oriented proposal\nPOST /ownership-transfers  (service 42, from A, to B)\n-> 201, Location: /ownership-transfers/9\nGET /ownership-transfers/9 -> pending proposal and permitted next links\nPATCH /ownership-transfers/9 -> request accepted state, conditional on current version\n\nB. Explicit commands\nPOST /services/42/transfer-proposals -> proposal identity 9\nPOST /transfer-proposals/9/accept -> request acceptance\nGET /transfer-proposals/9 -> observed outcome\n\nBoth require authorization, valid state transitions and duplicate-effect rules."},
    {"type":"paragraph","text":"A gives a long-lived proposal an identity that clients can retrieve and audit, and uses a state representation to request a transition. Its cost is documenting which state changes PATCH permits; arbitrary assignment must not bypass rules. B makes the business action conspicuous and can accept action-specific input, but each command needs its own semantics and retry policy. For this asynchronous approval workflow, choose A when a common proposal representation benefits several clients; choose B if acceptance is an established domain command with substantially different input. Neither choice removes server-side invariants. A future requirement for a multi-stage approval process would trigger a review of both designs."},
    {"type":"heading","id":"pagination-trace","text":"Observe why page positions can move"},
    {"type":"paragraph","text":"Filtering selects matching records; sorting establishes their order; pagination returns a bounded portion. An offset is a number of records to skip in the current result. A cursor is continuation information supplied under a documented ordering contract. Run pagination_model.py below with python3. It is a Python collection model, not a network endpoint. IDs are unique and immutable, and ascending ID order is fixed. Predict the second page before running."},
    {"type":"code","language":"python","caption":"pagination_model.py — execute the changing-collection example","code":"rows = [10, 20, 30, 40]\nfirst = rows[:2]\nprint('first:', first)\nrows.insert(0, 5)\nprint('offset after insert:', rows[2:4])\nprint('cursor after insert:', [x for x in rows if x > first[-1]][:2])\nrows = [20, 30, 40]  # original first page already read; ID 10 deleted\nprint('offset after delete:', rows[2:4])\nprint('cursor after delete:', [x for x in rows if x > first[-1]][:2])","output":"first: [10, 20]\noffset after insert: [20, 30]\ncursor after insert: [30, 40]\noffset after delete: [40]\ncursor after delete: [30, 40]"},
    {"type":"paragraph","text":"After insertion, skipping two positions starts at 20 again: the client sees a duplicate. After deletion, skipping two positions starts at 40: it misses 30. Continuing after the last seen immutable ID avoids those particular shifts. It does not produce a snapshot: a newly inserted ID 5 is behind the cursor and will not appear in the remaining traversal. Mutable sorting fields can still move records across a cursor boundary. For name sorting, use a stable tie-breaker and define what happens when names change. A snapshot export needs stronger consistency guarantees than this model provides."},
    {"type":"paragraph","text":"Offset is simple and convenient for numbered pages over small or sufficiently stable collections. Cursor traversal suits changing collections when forward progress matters more than jumping to page 20. A production cursor should preserve or validate the filter and ordering context; changing filters while reusing a cursor must not silently reinterpret it. Opaque means clients should not depend on its internals, not that encoding it makes it secret or trustworthy."},
    {"type":"heading","id":"rest-transfer-check","text":"Transfer exercise with observable success criteria"},
    {"type":"list","ordered":true,"items":["Run the five-line pagination example and explain each duplicate or omission from the changed list positions. Change page size to three and predict the new output before execution.","Design a future service-retirement workflow as both a resource transition and an explicit command. Include current state, allowed caller, success evidence, failure and retry behavior; justify a choice.","Explain how two independent workers interpret the same retrieval request without hidden selected-service state. Distinguish stored resource data from conversational state.","Specify ordering, ties, filters and continuation for a collection. Give one change your pagination design handles and one it does not.","Pass criteria: independently explain the state transition, defend the competing designs, trace the pagination failure, and identify the snapshot limitation. Copying the example output does not satisfy these four criteria."]},
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Model Steward services, teams and dependencies as resources.", "Choose one operation that feels awkward as generic CRUD and compare two possible API designs.", "Identify one benefit and one cost of stateless request handling.", "Explain which REST constraints matter most for Steward and which are less relevant at Builder stage."] },
    { type: "resources", resources: [rfc9110, mdnHttp] },
  ], "Use REST principles as design constraints while recognizing their trade-offs.", ["Draft resource-oriented Steward endpoints.", "Evaluate one command-like workflow.", "Compare two API shapes.", "Write a short decision explaining which option you prefer and why."], "Why is REST more than endpoint naming? Give one case where forcing an operation into CRUD could make an API less clear.", [rfc9110]),

  lesson("Modeling Resources and API Contracts", 70, [
  {
    "type": "heading",
    "id": "contract",
    "text": "Turn existing behavior into an explicit public promise"
  },
  {
    "type": "paragraph",
    "text": "An API contract is the observable agreement between independently changing programs: what callers may send, what an operation means, what it returns and how failures are reported. You already learned Python values and validation, HTTP message anatomy, JSON parsing and REST design. Here we translate an existing capability into a proposed HTTP interface. Nothing in this lesson deploys Django, adds a database or establishes real authentication."
  },
  {
    "type": "paragraph",
    "text": "The preceding Python practicals build Service data with name, endpoint, active and age_days, creation that starts active, activation/deactivation and in-memory lookup/filtering. Later examples explore Team composition and lifecycle, but an illustrative class is not proof that every learner's registry implements that feature. First run your own steward-core and inventory its actual fields and operations. The worked contract below uses the earlier common fields only. Numeric identity is a new API design decision; lifecycle, criticality and ownerTeamId are deferred until their implementation and rules are verified."
  },
  {
    "type": "heading",
    "id": "field-decisions",
    "text": "Decide who supplies each value"
  },
  {
    "type": "code",
    "language": "text",
    "caption": "Proposed create contract, independent of storage",
    "code": "POST /services\nContent-Type: application/json\nAccept: application/json\n\nRequest fields:\nname      required non-empty text; no null\nendpoint  required non-empty text; no null\nageDays   required integer >= 0; true/false are not ages\nactive    forbidden in create input; server initializes true\nid        forbidden in create input; server allocates identity\nUnknown request fields: reject in this teaching contract\n\nSuccess: 201, Location: /services/7\nResponse includes id, name, endpoint, active and ageDays"
  },
  {
    "type": "paragraph",
    "text": "Required means the field must be present; nullable means an explicit null is allowed. These are independent choices. This create contract requires ageDays and rejects null, so neither omission nor null means zero. Zero is a valid explicit age. active is server-controlled here because the existing create behavior initializes it to true; changing status belongs to a separately designed operation. An allowlist of input fields prevents callers from setting response-only fields accidentally. Rejecting unknown request fields catches misspellings but requires coordinated evolution when new clients send new fields to old servers."
  },
  {
    "type": "paragraph",
    "text": "The external name ageDays maps to internal age_days. That deliberate translation lets Python naming or storage change without silently changing the client's contract. Do not serialize an object's entire __dict__: that can expose internal collaborators and future private fields. An endpoint is treated here only as non-empty text, matching the bounded example; real URL syntax, allowed schemes and any server-side fetching policy need separate decisions before claiming those validations exist."
  },
  {
    "type": "heading",
    "id": "worked-boundary",
    "text": "Execute the boundary before choosing a framework"
  },
  {
    "type": "paragraph",
    "text": "Save contract_boundary.py below and run python3 contract_boundary.py. It is a standalone executable adapter model using dictionaries, not a replacement for your Service class. In your project, validated values would be passed to the existing create operation and its domain rules would still run. json.loads handles syntax; object and field checks handle shape; age validation handles the chosen rule; represent selects public output. This sample has no HTTP listener and its identity 7 is supplied by the demonstration."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "contract_boundary.py — explicit inputs and consumer compatibility",
    "code": "import json\n\ndef decode_create(raw):\n    data = json.loads(raw)\n    if not isinstance(data, dict):\n        raise ValueError(\"object required\")\n    if set(data) != {\"name\", \"endpoint\", \"ageDays\"}:\n        raise ValueError(\"required fields: name, endpoint, ageDays; no extras\")\n    for field in (\"name\", \"endpoint\"):\n        if not isinstance(data[field], str) or not data[field].strip():\n            raise ValueError(field + \" must be non-empty text\")\n    if type(data[\"ageDays\"]) is not int or data[\"ageDays\"] < 0:\n        raise ValueError(\"ageDays must be a non-negative integer\")\n    return {\"name\": data[\"name\"], \"endpoint\": data[\"endpoint\"],\n            \"age_days\": data[\"ageDays\"], \"active\": True}\n\ndef represent(service, identity):\n    return {\"id\": identity, \"name\": service[\"name\"],\n            \"endpoint\": service[\"endpoint\"], \"active\": service[\"active\"],\n            \"ageDays\": service[\"age_days\"]}\n\nraw = '{\"name\":\"Payments API\",\"endpoint\":\"https://payments.internal/api\",\"ageDays\":184}'\nservice = decode_create(raw)\nresponse = represent(service, 7)\nprint(json.dumps(response, sort_keys=True))\nfor change in ({\"ageDays\": True}, {\"ageDays\": None}, {\"active\": False}):\n    candidate = json.loads(raw)\n    candidate.update(change)\n    try:\n        decode_create(json.dumps(candidate))\n    except ValueError as error:\n        print(\"REJECTED:\", error)\ndef old_client(payload):\n    return payload[\"name\"] + \" / \" + str(payload[\"ageDays\"])\nprint(\"added field:\", old_client({**response, \"description\": \"optional\"}))\nrenamed = dict(response)\nrenamed[\"displayName\"] = renamed.pop(\"name\")\ntry:\n    old_client(renamed)\nexcept KeyError as error:\n    print(\"BROKEN CLIENT:\", error.args[0])",
    "output": "{\"active\": true, \"ageDays\": 184, \"endpoint\": \"https://payments.internal/api\", \"id\": 7, \"name\": \"Payments API\"}\nREJECTED: ageDays must be a non-negative integer\nREJECTED: ageDays must be a non-negative integer\nREJECTED: required fields: name, endpoint, ageDays; no extras\nadded field: Payments API / 184\nBROKEN CLIENT: name"
  },
  {
    "type": "paragraph",
    "text": "The valid request becomes an internal dictionary with age_days and active true, then a selected JSON representation. Python considers bool a subclass of int, so the exact type check rejects true as an age. null becomes None and is rejected too. Supplying active is rejected before creation. No failed case creates a Service. The old client reads only name and ageDays: an extra description does not break this particular client, but renaming name does. This is executable consumer evidence, not a guarantee for every client."
  },
  {
    "type": "heading",
    "id": "endpoint-trace",
    "text": "Describe complete operations and failure evidence"
  },
  {
    "type": "paragraph",
    "text": "For proposed POST /services, decode the body, validate request shape, invoke domain creation, allocate identity, then return 201 with the representation and Location. Malformed JSON or rejected fields map to the documented 400 policy; a future duplicate-name rule could map to 409 only if uniqueness is actually required. Unexpected implementation defects remain server failures rather than being disguised as bad input. The next lesson develops error translation; do not catch every exception and return 400."
  },
  {
    "type": "paragraph",
    "text": "GET /services/7 returns the selected representation with 200 when the identity exists, or a documented 404 when absent. It must not allocate a replacement resource on a failed lookup. Identity should remain stable when a name changes; using a name as the public identifier is an alternative, but then renaming needs an explicit link/migration policy. An internal list index is also a poor public identity if deletion can shift positions."
  },
  {
    "type": "code",
    "language": "json",
    "caption": "Proposed bounded collection response; pagination implementation remains future",
    "code": "{\"items\":[{\"id\":7,\"name\":\"Payments API\",\"endpoint\":\"https://payments.internal/api\",\"active\":true,\"ageDays\":184}],\"nextCursor\":null}"
  },
  {
    "type": "paragraph",
    "text": "This envelope always contains an items array; no matches means an empty array, not null or 404. nextCursor null means no continuation under this proposed contract. Before implementing pagination, define allowed filters, maximum page size, stable ordering and the meaning of a cursor after concurrent changes using the previous lesson. Unsupported filters should have a documented rejection policy; silently ignoring active=false could return the opposite set from what a caller expects. A bare array is simpler for a permanently small collection, but changing later to an envelope breaks clients that iterate the top-level value."
  },
  {
    "type": "heading",
    "id": "evolution",
    "text": "Evaluate compatibility in both directions"
  },
  {
    "type": "paragraph",
    "text": "Compatibility asks whether an existing consumer still works with the changed provider and whether a new consumer can work with an older provider. Adding an optional response field worked for the demonstrated tolerant client; a strict exact-field client could reject it. Making ageDays newly required would break an older request that omitted it. Changing an integer to text breaks numerical consumers. Adding an enum value can break exhaustive client switches even though no old value was removed. Test concrete consumer assumptions rather than labeling every additive change safe."
  },
  {
    "type": "paragraph",
    "text": "If name must become displayName, first identify consumers and provide a migration period with a documented compatibility adapter or overlapping fields whose equality is enforced. Test old and migrated clients, observe remaining old-field usage where feasible, agree a removal date and remove only under that policy. A versioned endpoint can isolate an unavoidable break, but it creates parallel support obligations. Deprecation means scheduled migration, not immediate removal, and a new version number cannot repair an unexplained contract."
  },
  {
    "type": "heading",
    "id": "practice",
    "text": "Apply the contract to your real core"
  },
  {
    "type": "list",
    "ordered": true,
    "items": [
      "Inventory your actual Service fields and operations with source references. Mark each proposed API field implemented, new adapter responsibility or deferred; do not copy the larger future domain as if it already exists.",
      "Execute the sample. Add missing ageDays, negative age, an array body and malformed JSON. Predict the rejection stage before running; record actual errors without labeling all of them domain failures.",
      "Replace the dictionary construction with your own create operation in a separate adapter. Prove a rejected input leaves registry size unchanged and a valid response exposes only chosen fields.",
      "Write create, read-one and list contracts including required/null/server-controlled fields, status, headers, empty collection and unknown target behavior.",
      "Modify the old client to reject unknown fields; rerun the added-description case and explain why the compatibility conclusion changes.",
      "Transfer rubric: independently trace one valid and one invalid input, preserve domain invariants, justify input/output asymmetry, predict a real consumer break and propose a tested migration. All five criteria must pass before learner validation."
    ]
  }
], "Derive and test a public contract from actual Steward core behavior.", ["Inventory existing fields and operations.", "Execute and extend contract_boundary.py.", "Write create, read and list contracts.", "Demonstrate a consumer compatibility failure and migration."], "Why are required and nullable different? Trace input through validation, domain behavior and selected output; explain which client a field rename breaks."),

  lesson("Errors and Status Design", 70, [
  {
    "type": "heading",
    "id": "errors",
    "text": "Design failures from the caller's next decision"
  },
  {
    "type": "paragraph",
    "text": "An error contract describes a failed operation in terms another program can act on. It has three audiences: HTTP clients interpret the status and headers, application clients interpret stable error codes and fields, and operators investigate diagnostic evidence. A useful error preserves the distinction between correcting input, establishing identity, requesting permission, reconciling state and investigating a server defect. Build on the previous contract adapter; no database or identity provider is implemented here."
  },
  {
    "type": "paragraph",
    "text": "An exception is a local program signal that interrupts normal execution. It is not an HTTP response. A boundary adapter catches understood failures, selects a public result and returns it to the caller. The layer that detects a failure need not decide its public wording: a Service can enforce a rule without knowing HTTP. Conversely, the adapter must not turn every programming exception into a user-input error."
  },
  {
    "type": "heading",
    "id": "failure-order",
    "text": "Trace where the failure occurs before selecting a status"
  },
  {
    "type": "code",
    "language": "text",
    "caption": "A proposed create pipeline and its failure boundaries",
    "code": "bytes -> JSON parsing -> request shape -> domain rules -> state change -> response\n         malformed      wrong type       invalid age     conflict       lost response\n         400            400              400 policy      409 policy     unknown outcome\n\nUnexpected defect anywhere -> controlled 500 boundary + internal diagnostic event\nKnown temporary inability -> 503 only when that condition is actually identified"
  },
  {
    "type": "paragraph",
    "text": "The same 400 can describe several client-correctable failures, so use a stable code such as request.invalid_json or service.invalid_age to identify the correction. Choose field paths only when meaningful. A malformed document may have no reliably identified field; an invalid age can point to ageDays. This lesson uses a documented 400 policy for validation; another API may distinguish semantic validation with 422. Consistency and a clear client action matter more than guessing a universally correct validation number."
  },
  {
    "type": "paragraph",
    "text": "A 409 names a conflict with current state, such as a name already taken under an explicit uniqueness rule. Do not invent uniqueness because a database could enforce it. A 404 represents the target's absence or a deliberate concealment policy. A 500 is an unexpected processing failure; blaming the caller would send them searching for a correction they cannot make. A known unavailable dependency may justify 503, but catching every RuntimeError as 503 would conceal bugs behind an unjustified promise of transience."
  },
  {
    "type": "heading",
    "id": "public-internal",
    "text": "Expose a stable explanation and preserve diagnostic context"
  },
  {
    "type": "code",
    "language": "json",
    "caption": "Proposed public validation response",
    "code": "{\"code\":\"service.invalid_age\",\"message\":\"Send a non-negative integer ageDays.\",\"field\":\"ageDays\",\"requestId\":\"demo-invalid\"}"
  },
  {
    "type": "paragraph",
    "text": "Clients should branch on code and status, not the exact message. Human wording can improve or be translated without changing the machine decision. requestId connects one attempt to diagnostic events; it is not an idempotency key and does not prevent duplicates. Generate or validate identifiers at the boundary rather than trusting arbitrary incoming text. Internal evidence should include enough controlled context to locate a defect, but logs are not a license to store tokens, credentials or complete request bodies."
  },
  {
    "type": "paragraph",
    "text": "For an unexpected exception, send a generic public explanation and an identifier. In an actual application, authorized operators use that identifier to find sanitized diagnostic context and, where appropriate, a controlled stack trace. The model below records only exception class and identifier, deliberately illustrating the separation. It is not a complete logging system, and raw exception text must never become the public contract automatically."
  },
  {
    "type": "heading",
    "id": "execute",
    "text": "Execute success, rejection and defect translation"
  },
  {
    "type": "paragraph",
    "text": "Save error_boundary.py and run python3 error_boundary.py. The function returns a tuple of proposed status, headers, body and internal event; no HTTP response is transmitted. mode injects named synthetic failures so the experiment does not require PostgreSQL, authentication or an external outage. The input rule is ageDays as a non-negative integer, retaining the earlier boolean rejection. The sample performs no persistent mutation."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "error_boundary.py — execute the translation boundary",
    "code": "import json\n\nclass InvalidInput(Exception):\n    pass\n\nclass MissingService(Exception):\n    pass\n\nclass Unavailable(Exception):\n    pass\n\nclass NameConflict(Exception):\n    pass\n\ndef operation(raw, mode):\n    data = json.loads(raw)\n    if not isinstance(data, dict):\n        raise InvalidInput(\"object required\")\n    age = data.get(\"ageDays\")\n    if type(age) is not int or age < 0:\n        raise InvalidInput(\"invalid age\")\n    # Controlled synthetic failures, not a database or authentication service.\n    if mode == \"missing\":\n        raise MissingService(\"internal lookup detail\")\n    if mode == \"conflict\":\n        raise NameConflict(\"synthetic duplicate name\")\n    if mode == \"unavailable\":\n        raise Unavailable(\"synthetic dependency disconnected\")\n    if mode == \"bug\":\n        raise RuntimeError(\"synthetic private implementation detail\")\n    return {\"acceptedAgeDays\": age}\n\ndef boundary(raw, mode, request_id):\n    try:\n        return 200, {}, operation(raw, mode), None\n    except json.JSONDecodeError as error:\n        status, code, message, field = 400, \"request.invalid_json\", \"Send valid JSON.\", None\n    except InvalidInput as error:\n        status, code, message, field = 400, \"service.invalid_age\", \"Send a non-negative integer ageDays in an object.\", \"ageDays\"\n    except MissingService as error:\n        status, code, message, field = 404, \"service.not_found\", \"Service not found.\", None\n    except NameConflict as error:\n        status, code, message, field = 409, \"service.name_conflict\", \"Choose an available name.\", \"name\"\n    except Unavailable as error:\n        status, code, message, field = 503, \"service.unavailable\", \"Try later under the retry policy.\", None\n    except Exception as error:\n        # Last boundary only: sanitized response and a diagnostic event, not silent success.\n        event = {\"requestId\": request_id, \"category\": type(error).__name__}\n        return 500, {}, {\"code\": \"internal.error\", \"message\": \"Unexpected failure.\",\n                         \"requestId\": request_id}, event\n    headers = {\"Retry-After\": \"5\"} if status == 503 else {}\n    body = {\"code\": code, \"message\": message, \"requestId\": request_id}\n    if field is not None:\n        body[\"field\"] = field\n    return status, headers, body, None\n\ncases = [\n    (\"valid\", '{\"ageDays\":0}', \"ok\"),\n    (\"syntax\", '{\"ageDays\":', \"ok\"),\n    (\"invalid\", '{\"ageDays\":true}', \"ok\"),\n    (\"missing\", '{\"ageDays\":2}', \"missing\"),\n    (\"conflict\", '{\"ageDays\":2}', \"conflict\"),\n    (\"unavailable\", '{\"ageDays\":2}', \"unavailable\"),\n    (\"bug\", '{\"ageDays\":2}', \"bug\"),\n]\nfor label, raw, mode in cases:\n    status, headers, body, event = boundary(raw, mode, \"demo-\" + label)\n    print(label, status, body.get(\"code\", \"success\"), headers.get(\"Retry-After\", \"-\"))\n    assert \"synthetic private\" not in json.dumps(body)\n    if event:\n        assert event[\"requestId\"] == body[\"requestId\"]\n        print(\"internal event:\", event[\"category\"], event[\"requestId\"])\n",
    "output": "valid 200 success -\nsyntax 400 request.invalid_json -\ninvalid 400 service.invalid_age -\nmissing 404 service.not_found -\nconflict 409 service.name_conflict -\nunavailable 503 service.unavailable 5\nbug 500 internal.error -\ninternal event: RuntimeError demo-bug"
  },
  {
    "type": "paragraph",
    "text": "Trace invalid: JSON parsing succeeds; true becomes Python True; exact-type validation rejects it; the specific exception maps to 400 and service.invalid_age. Trace bug: the request passes validation, the injected defect raises RuntimeError, the last catch produces 500 and a separate event. The client's body contains neither the private text nor the exception class. The matching identifier connects the two records. The generic catch belongs at the final response boundary, with diagnostics and tests; using it inside every function to ignore failures would destroy evidence."
  },
  {
    "type": "heading",
    "id": "identity-status",
    "text": "Authentication and permission need distinct contracts"
  },
  {
    "type": "paragraph",
    "text": "Authentication establishes acceptable caller identity. A proposed protected endpoint rejects missing or invalid credentials with 401 and a suitable WWW-Authenticate challenge. Authorization decides whether an established caller can perform the action; refusal normally uses 403, with 404 sometimes chosen to conceal existence. For a future ownership edit, invalid age is an input problem, while an authenticated Team A caller editing Team B's service is a permission decision. Neither should become 500. These are contract designs only: the sample does not implement or verify credentials, team membership or challenges."
  },
  {
    "type": "heading",
    "id": "client-actions",
    "text": "Status alone does not make a retry safe"
  },
  {
    "type": "paragraph",
    "text": "For invalid JSON or age, correct the request; resending unchanged input will repeat rejection. For missing target, verify the identity rather than creating a substitute silently. For a name conflict, inspect current state and select or reconcile the name. For 401, obtain acceptable credentials under the application's identity flow; for 403, stop or seek permission. Repeated credentials do not repair an authorization decision."
  },
  {
    "type": "paragraph",
    "text": "The synthetic 503 includes Retry-After: 5, meaning a suggested five-second delay, not proof that the next attempt succeeds. Apply the earlier bounded retry policy only when the operation's duplicate-effect behavior is understood. A real create operation might commit before an exception or lost response; a 500 or timeout does not by itself prove nothing happened. Reconcile using durable operation evidence. This model cannot establish rollback, idempotency or crash safety because it has no mutation or persistence."
  },
  {
    "type": "heading",
    "id": "multiple-fields",
    "text": "Choose how much validation evidence to return"
  },
  {
    "type": "paragraph",
    "text": "For several independent field problems, a response may include a list of field/code/message entries under one stable validation category. Define field-path syntax and whether clients can rely on ordering. Collecting independent errors helps forms avoid repeated correction rounds, but stop when parsing or shape failure makes later checks meaningless. Do not run a state-changing domain operation merely to discover another field error. Compare fail-fast simplicity with the extra validation work and coupling of aggregate responses."
  },
  {
    "type": "heading",
    "id": "practice",
    "text": "Prove classification and transfer"
  },
  {
    "type": "list",
    "ordered": true,
    "items": [
      "Execute all seven cases and explain the detection layer, public status/code, suggested client action and internal evidence for each.",
      "Add array input, null age and negative age; predict what the current model reports before running. Improve the object-shape failure into its own stable code rather than mislabeling it as an age error.",
      "Inject a KeyError after valid input. Prove it remains 500 and its private details never reach the body; preserve an internal event with the same identifier.",
      "Design future unauthenticated and forbidden ownership-edit responses, including a challenge for 401. Label authentication unimplemented.",
      "Connect specific domain exceptions from your own core to a separate adapter and check unchanged state on failures that occur before mutation. Do not claim rollback after mutation without an explicit mechanism and test.",
      "Transfer rubric: independently identify the failing layer, preserve client/server responsibility, choose a justified client action, separate public/internal evidence and explain uncertain mutation outcomes. All five must pass on unfamiliar cases."
    ]
  },
  {
    "type": "resources",
    "resources": [
      {
        "title": "RFC 9110 — HTTP semantics",
        "url": "https://www.rfc-editor.org/rfc/rfc9110"
      }
    ]
  }
], "Translate domain and implementation failures into actionable public contracts.", ["Execute error_boundary.py.", "Extend negative cases and preserve failure categories.", "Design future identity failures explicitly.", "Test an adapter around actual domain exceptions."], "Why can a 500 leave an operation outcome uncertain? Explain which evidence belongs in the response and which belongs in controlled diagnostics.", [mdnStatus, rfc9110]),

  { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman", title: "Lab: Explore APIs with curl and Postman", activities: [
    {
  "id": "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-brief",
  "title": "API Investigation Brief",
  "estimatedMinutes": 60,
  "content": {
    "type": "reading",
    "body": "Execute and explain a complete bounded local API investigation.",
    "blocks": [
      {
        "type": "heading",
        "id": "objective",
        "text": "Investigate a complete local HTTP contract"
      },
      {
        "type": "paragraph",
        "text": "Use Python 3, curl and two terminal windows. The earlier lessons taught methods, JSON, contract decisions and error translation; this lab joins them into observable requests and state changes. Save the complete lab_api.py below in a disposable directory. Run python3 lab_api.py in terminal A and leave it running. Run the numbered sequence in terminal B. No package installation, database, public API account or real credentials are needed."
      },
      {
        "type": "paragraph",
        "text": "This synthetic registry starts empty and resets whenever the process restarts. It deliberately uses only name, ageDays and active to keep the experiment bounded; it is not your steward-core implementation. IDs are allocated by the server. Names must be unique under this lab's explicit policy. Only active may be patched. The contract has no pagination, authentication, TLS or persistence. The outage route is a fixture that always returns 503, not evidence of a failing dependency. Keep the server bound to 127.0.0.1."
      },
      {
        "type": "heading",
        "id": "server",
        "text": "Read the mechanism before executing it"
      },
      {
        "type": "paragraph",
        "text": "HTTPServer accepts local connections and BaseHTTPRequestHandler selects do_GET, do_POST or another handler. Those aliases dispatch to run, which selects a resource and operation. read_object checks representation type, bounded length, JSON syntax and object shape. The operation then validates fields before mutating the dictionary. Rejected carries a known status/code to the response boundary. reply serializes the selected body and writes headers before bytes; 204 has neither content nor Content-Length. Unexpected defects are not handled as input errors."
      },
      {
        "type": "code",
        "language": "python",
        "caption": "lab_api.py — complete disposable final-lab target",
        "code": "import json\nimport os\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\n\nservices = {}\nnext_id = 1\n\nclass Rejected(Exception):\n    def __init__(self, status, code):\n        self.status, self.code = status, code\n\nclass Handler(BaseHTTPRequestHandler):\n    def reply(self, status, body=None, **headers):\n        self.send_response(status)\n        if status != 204:\n            payload = json.dumps(body).encode(\"utf-8\")\n            self.send_header(\"Content-Type\", \"application/json\")\n            self.send_header(\"Content-Length\", str(len(payload)))\n        for key, value in headers.items():\n            self.send_header(key, value)\n        self.end_headers()\n        if status != 204:\n            self.wfile.write(payload)\n\n    def read_object(self):\n        media = self.headers.get(\"Content-Type\", \"\").split(\";\")[0].strip().lower()\n        if media != \"application/json\":\n            raise Rejected(415, \"request.media_type\")\n        try:\n            length = int(self.headers.get(\"Content-Length\", \"0\"))\n        except ValueError:\n            raise Rejected(400, \"request.length\")\n        if length < 0 or length > 4096:\n            raise Rejected(413, \"request.too_large\")\n        try:\n            value = json.loads(self.rfile.read(length))\n        except (ValueError, UnicodeDecodeError):\n            raise Rejected(400, \"request.invalid_json\")\n        if not isinstance(value, dict):\n            raise Rejected(400, \"request.object_required\")\n        return value\n\n    def run(self, method):\n        global next_id\n        # This route is a deliberate fault fixture, not a real outage.\n        if method == \"GET\" and self.path == \"/lab/unavailable\":\n            self.reply(503, {\"code\": \"lab.unavailable\"}, **{\"Retry-After\": \"2\"})\n            return\n        if self.path == \"/services\":\n            if method == \"GET\":\n                self.reply(200, {\"items\": list(services.values())})\n                return\n            if method != \"POST\":\n                self.reply(405, {\"code\": \"request.method\"}, Allow=\"GET, POST\")\n                return\n            data = self.read_object()\n            if set(data) != {\"name\", \"ageDays\"}:\n                raise Rejected(400, \"service.fields\")\n            if not isinstance(data[\"name\"], str) or not data[\"name\"].strip():\n                raise Rejected(400, \"service.name\")\n            if type(data[\"ageDays\"]) is not int or data[\"ageDays\"] < 0:\n                raise Rejected(400, \"service.age\")\n            # Deliberate lab-only uniqueness policy.\n            if any(s[\"name\"] == data[\"name\"] for s in services.values()):\n                raise Rejected(409, \"service.name_conflict\")\n            target = f\"/services/{next_id}\"\n            value = {\"id\": next_id, **data, \"active\": True}\n            services[target] = value\n            next_id += 1\n            self.reply(201, value, Location=target)\n            return\n        if self.path not in services:\n            raise Rejected(404, \"service.not_found\")\n        if method == \"GET\":\n            self.reply(200, services[self.path])\n        elif method == \"PATCH\":\n            data = self.read_object()\n            if set(data) != {\"active\"} or type(data[\"active\"]) is not bool:\n                raise Rejected(400, \"service.active\")\n            services[self.path][\"active\"] = data[\"active\"]\n            self.reply(200, services[self.path])\n        elif method == \"DELETE\":\n            del services[self.path]\n            self.reply(204)\n        else:\n            self.reply(405, {\"code\": \"request.method\"}, Allow=\"GET, PATCH, DELETE\")\n\n    def dispatch(self):\n        try:\n            self.run(self.command)\n        except Rejected as error:\n            self.reply(error.status, {\"code\": error.code})\n\n    do_GET = dispatch\n    do_POST = dispatch\n    do_PATCH = dispatch\n    do_PUT = dispatch\n    do_DELETE = dispatch\n\nport = int(os.environ.get(\"TSA_LAB_PORT\", \"8767\"))\nprint(f\"Lab listening on http://127.0.0.1:{port}\", flush=True)\nHTTPServer((\"127.0.0.1\", port), Handler).serve_forever()\n"
      },
      {
        "type": "paragraph",
        "text": "If startup reports address already in use, leave unknown processes alone. Run TSA_LAB_PORT=8768 python3 lab_api.py and substitute 8768 in every client URL. A startup print is not proof of a listener: verify the initial GET. Python's default response version may be HTTP/1.0; the method and status semantics still apply. This single-threaded teaching server expects ordinary curl requests with known lengths; it is not hardened for arbitrary clients or production traffic."
      },
      {
        "type": "heading",
        "id": "trace",
        "text": "Execute one controlled sequence on a fresh instance"
      },
      {
        "type": "code",
        "language": "shell",
        "caption": "Final lab curl sequence — run in order after a fresh start",
        "code": "curl --noproxy '*' -i http://127.0.0.1:8767/services\ncurl --noproxy '*' -i -H 'Content-Type: application/json' --data '{\"name\":\"Payments\",\"ageDays\":184}' http://127.0.0.1:8767/services\ncurl --noproxy '*' -i http://127.0.0.1:8767/services/1\ncurl --noproxy '*' -i -X PATCH -H 'Content-Type: application/json' --data '{\"active\":false}' http://127.0.0.1:8767/services/1\ncurl --noproxy '*' -i -H 'Content-Type: application/json' --data '{\"name\":' http://127.0.0.1:8767/services\ncurl --noproxy '*' -i -H 'Content-Type: application/json' --data '{\"name\":\"Other\",\"ageDays\":true}' http://127.0.0.1:8767/services\ncurl --noproxy '*' -i -H 'Content-Type: text/plain' --data '{}' http://127.0.0.1:8767/services\ncurl --noproxy '*' -i -H 'Accept: text/plain' http://127.0.0.1:8767/services/1\ncurl --noproxy '*' -i -H 'Content-Type: application/json' --data '{\"name\":\"Payments\",\"ageDays\":184}' http://127.0.0.1:8767/services\ncurl --noproxy '*' -i -X PUT http://127.0.0.1:8767/services/1\ncurl --noproxy '*' -i http://127.0.0.1:8767/lab/unavailable\ncurl --noproxy '*' -i -X DELETE http://127.0.0.1:8767/services/1\ncurl --noproxy '*' -i -X DELETE http://127.0.0.1:8767/services/1\ncurl --noproxy '*' -i http://127.0.0.1:8767/services",
        "output": "Statuses in order: 200, 201, 200, 200, 400, 400, 415, 200, 409, 405, 503, 204, 404, 200. Final body: {\"items\": []}. Date and Server headers vary."
      },
      {
        "type": "paragraph",
        "text": "The first GET proves the collection is empty. POST validates the fields, allocates identity 1 and returns Location: /services/1. GET that path verifies creation. PATCH sets active false while keeping the other fields; repeat that exact patch before deletion to observe the same intended state. The malformed JSON request fails parsing; the boolean age parses but fails the field rule. Neither changes the registry. Compare a GET before and after each rejected write to prove that claim."
      },
      {
        "type": "paragraph",
        "text": "Content-Type text/plain is rejected with 415 even when its bytes resemble JSON. In contrast, Accept: text/plain still receives JSON: this deliberately simple server ignores preferences and has only one representation. Record that behavior rather than claiming negotiation was enforced. The duplicate name returns 409 under the lab policy. PUT to the existing item returns 405 and Allow: GET, PATCH, DELETE. The fixture returns 503 with Retry-After: 2; do not loop indefinitely because it never recovers on its own."
      },
      {
        "type": "paragraph",
        "text": "DELETE removes identity 1 and returns a bodyless 204. Repeating it returns 404 but leaves the same resource absent. The final collection is empty. Stop terminal A with Ctrl+C, then repeat the first GET: curl should report connection failure without an HTTP response. This final observation is categorically different from the explicit 503 fixture. Restarting gives an empty collection and resets allocated IDs, demonstrating why the service is unsuitable for durable identity."
      },
      {
        "type": "heading",
        "id": "postman",
        "text": "Reproduce requests with a second client"
      },
      {
        "type": "paragraph",
        "text": "If Postman is installed, create a new request, choose GET and enter the local /services URL. Send it and inspect status, response headers and body. For POST, select POST, enter /services, select Body → raw → JSON, and paste the valid creation object from the curl sequence. Confirm Content-Type is application/json. For PATCH, use the Location path, select PATCH and send {\"active\":false}. Save these three requests in a lab collection and compare their actual responses with curl. Use a freshly restarted server or a different name so the duplicate policy does not invalidate the comparison."
      },
      {
        "type": "paragraph",
        "text": "If Postman is unavailable, the entire protocol experiment remains executable with curl. Record the Postman portion as UNVERIFIED and retain the curl commands and transcripts as reproducible evidence; do not fabricate a collection or claim cross-client equivalence. No Postman installation is required to learn the HTTP mechanism."
      },
      {
        "type": "heading",
        "id": "diagnosis",
        "text": "Investigate discrepancies using evidence"
      },
      {
        "type": "paragraph",
        "text": "A 404 after restarting may mean you lost volatile state, not that the URL syntax changed. A 409 on a supposedly fresh creation suggests the earlier request succeeded or the server was not restarted. A 400 for active means the PATCH body must contain exactly one boolean field; the string \"false\" is not false. If you receive an HTML 501, check whether you selected a method for which the base handler has no implementation. If no HTTP response arrives, inspect process/listener evidence before changing validation code."
      },
      {
        "type": "heading",
        "id": "independent",
        "text": "Transfer without copying the happy path"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Create a second service and prove that patching the first does not change it. Predict the allocated ID and compare with Location.",
          "Try array JSON, null age, missing fields, an unknown field and a string active value. Classify the rejection stage and prove state remains unchanged.",
          "Explain why repeated POST gives a conflict here while the earlier method server created duplicates. Identify the contract policy responsible; the word POST alone did not enforce uniqueness.",
          "Design 401/403 responses for a future protected resource and state explicitly that this server does not test authentication or authorization.",
          "Write an evidence packet with exact requests, observed status/headers/body, before/after state, failure diagnosis and one justified alternative contract.",
          "Pass rubric: independently trace a write, distinguish syntax/type/domain/method/transport failures, verify state after rejection, explain retry effects and defend a contract choice. All five must pass; executing this script alone is not learner validation."
        ]
      }
    ]
  }
},
    {
  "id": "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-build",
  "title": "HTTP Investigation",
  "estimatedMinutes": 150,
  "content": {
    "type": "practical",
    "objective": "Independently trace method, JSON, state and failure behavior on the supplied local service.",
    "scenario": "Run the complete lab_api.py target from the reading; all data is synthetic and volatile.",
    "instructions": [
      "Start a fresh server and execute the fourteen published curl commands in order; record actual status, headers and body.",
      "Repeat PATCH before deletion and verify unchanged intended state. Prove rejected writes leave the collection unchanged.",
      "Add the five negative variations and second-service isolation exercise from the reading.",
      "Stop the server, repeat GET and distinguish connection failure from the synthetic 503 fixture.",
      "Reproduce GET/POST/PATCH in Postman if available; otherwise explicitly mark that portion UNVERIFIED.",
      "Write future 401/403 contracts without claiming identity enforcement exists.",
      "Defend a proposed Steward contract and explain how it differs from this deliberately bounded lab."
    ],
    "deliverables": [
      "Reproducible curl transcript",
      "Annotated state transitions and negative-case evidence",
      "Postman collection or explicit unverified limitation",
      "Failure diagnosis table",
      "Future Steward contract decision"
    ],
    "completionCriteria": [
      "The learner explains each exchange from observable evidence.",
      "Rejected inputs and successful mutations have independently checked state effects.",
      "Unsupported methods, malformed JSON, invalid fields and transport failures remain distinct.",
      "Synthetic outages and missing identity/persistence capabilities are labeled accurately.",
      "All five independent transfer criteria in the reading are met before claiming learner validation."
    ]
  }
},
    { id: "web-and-api-foundations-lab-explore-apis-with-curl-and-postman-review", title: "Module Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "Without looking at notes, explain the complete path from URL to response, the structure of an HTTP request and response, the difference between Content-Type and Accept, safe vs idempotent methods, what makes an API contract durable, and how you would distinguish malformed input, invalid domain data, forbidden action and server failure in Steward." } },
  ] },
];
