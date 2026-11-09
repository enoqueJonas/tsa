// Focused original-ID-preserving canary readings; real HTTP source in -007.
export type CloudCanaryFocusedSection={heading:string;paragraphs:string[]};
export type CloudCanaryFocusedReading={id:string;title:string;estimatedMinutes:number;body:string;sections:CloudCanaryFocusedSection[]};
export const cloudCanaryFocusedReadings:CloudCanaryFocusedReading[] = [
  {
    "id": "cloud-progressive-delivery-canary-007",
    "title": "How traffic weights reach real requests",
    "estimatedMinutes": 55,
    "body": "A declared 25% canary weight matters only when a real request routing layer sends approximately that share to the candidate.",
    "sections": [
      {
        "heading": "Start with the actual HTTP path and preserve version identity",
        "paragraphs": [
          "A canary is an incremental change in who receives real requests, not a rewrite of a Deployment replica count. There must be at least two independently addressable upstream versions and a routing mechanism whose decisions can be observed, for example a properly configured ingress/gateway or service mesh. Requests must be attributed to the candidate and stable version by an independently observable release header, pod image identity, upstream telemetry or structured trace. Without that identity the dashboard may report a beautiful error ratio that mixes both releases.",
          "The small executable example below starts four separate loopback HTTP listeners: stable service, candidate service, a synthetic traffic proxy and a separate telemetry endpoint. Each actual GET passes through the proxy to one backend and returns bytes identifying its release, so the count is based on HTTP responses, not a fabricated percentage. This proves application-level routing mechanics under controlled sequential requests, not production networking, Kubernetes service-mesh balancing, Argo Rollouts weights or actual Steward behavior."
        ]
      },
      {
        "heading": "Run actual HTTP upstreams and observe route share",
        "paragraphs": [
          "A locally defined weight of 25 means the teaching proxy chooses the candidate for 25 of each 100 requests in this deliberately deterministic experiment. With 500 requests its actual response records should show 125 from candidate and 375 from stable. Increasing to 50 and issuing 400 requests should yield 200 responses per version; after approval, 100 directs all requests to the candidate. These exact figures are properties of this synthetic deterministic router, not a guarantee of NGINX, Envoy or a real user's sticky-session and connection-reuse behavior.",
          "Run the copyable Python program from this original TSA learning path. Compare the HTTP response release identity with a separate metrics HTTP server's request and 5xx counters for every decision window. Do not take a screenshot of two Pods and call it a traffic split. In a real Argo Rollouts implementation, identify the actual trafficRouter integration, stable/canary Service ownership, upstream connection stickiness and sampled request window. Verify observed proportions within an explicitly justified statistical tolerance instead of requiring exact fractions on a stochastic production router."
        ]
      },
      {
        "heading": "Compare replicas, requests and sessions without conflating them",
        "paragraphs": [
          "A Kubernetes ReplicaSet with one candidate and nine stable Pods need not deliver precisely 10% of user requests. Keep-alive connections, session affinity, long-lived WebSockets, unequal Pod capacity, cached frontend assets and traffic from nonrepresentative clients can all distort the ratio. Some traffic routers operate at request level, some at connection/session or weighted endpoint selection, and the effective contract must be tested empirically. An accurate 10% request share also does not establish 10% of users or 10% of business risk.",
          "Failure experiment: send requests with session-affinity identities and compare unique user identifiers across releases. Decide whether a user who begins an export on the old API can complete it on the candidate. Describe how to drain a candidate that is processing a message rather than an HTTP request, because changing the ingress router does not roll back already-delivered RabbitMQ messages. The local HTTP proof does not claim session stickiness, background-worker migration, production route weights or edge TLS."
        ]
      }
    ]
  },
  {
    "id": "cloud-progressive-delivery-canary-008",
    "title": "Evidence quality and automated promotion decisions",
    "estimatedMinutes": 65,
    "body": "Release analysis needs a defined observation window, representative samples and safe responses to missing or bad telemetry.",
    "sections": [
      {
        "heading": "Build the observation contract before accepting any sample count",
        "paragraphs": [
          "For each canary step, define the change under observation, target route weight, actual candidate request count, contemporaneous stable count, error definitions, latency distribution, readiness, request population and business outcomes. A low-volume 0% error rate is not equivalent to a healthy service: zero failures among five requests leaves substantial uncertainty. Counts should come from separate observed HTTP or event sources and be paired with a measurement interval, not written in a synthetic table after the decision.",
          "In the local proof the model refuses promotion if either version received fewer than 100 requests. The demonstration sends only 20 requests at a 25% route, so the actual measured counts are five candidate and fifteen stable; the decision remains INCONCLUSIVE. These thresholds are arbitrary pedagogical safeguards, not calibrated statistical acceptance criteria. Real Steward traffic needs duration, volume, latency, dependency/business-specific metrics, confidence and an accepted operating-error budget before setting meaningful release policy."
        ]
      },
      {
        "heading": "Keep the telemetry channel independent from routing and claims",
        "paragraphs": [
          "An error-rate computation needs a denominator and a numerator for the same release, window and request population. Missing, stale or incorrectly labeled metrics can produce plausible ratios even while all candidate requests fail. Prometheus scraping and query labels are a separate operational dependency from the workload and from Argo Rollouts analysis. A Prometheus query that returns no data must be classified explicitly as error or inconclusive rather than as a zero-valued healthy error ratio.",
          "The teaching program exposes a separate local metrics HTTP listener. The proxy records the status and backend identity from actual requests, while the decision function reads the JSON counters over HTTP and checks them against independently accumulated client-observed responses. The proof then actually shuts down the metrics listener and refuses to promote without a response. This is an actual local dependency outage, but it does not prove a real Prometheus scrape failure, stale-series detection, Argo AnalysisTemplate or controller reconciliation."
        ]
      },
      {
        "heading": "Promote only after one gate becomes eligible for additional gates",
        "paragraphs": [
          "Even when minimum sample counts are met, a candidate passing the chosen error-ratio threshold is only eligible for the next decision gates. Evaluate tail latency, data correctness, tenant authorization, schema compatibility, consumer lag, background job behavior, rate limits and observed issues before expanding traffic. A low candidate error rate measured on a synthetic endpoint is irrelevant to whether the real Steward user can produce a correct service-inventory export.",
          "Use a defective candidate that responds with 503 while still answering a separate readiness path, and show that the real error counter drives ABORT. A promotion implementation that tests only readiness or ignores candidate-specific errors must fail negative tests. In a production-style setup also test bad latency, business-authorization regression and intentionally delayed telemetry before declaring a rollout policy safe. Do not silently replace missing measurements with an operator's judgement or a green timer."
        ]
      }
    ]
  },
  {
    "id": "cloud-progressive-delivery-canary-009",
    "title": "Abort, controlled recovery and persistent-state boundaries",
    "estimatedMinutes": 60,
    "body": "A failed canary needs verifiable removal of candidate exposure and a separate plan for everything traffic rollback cannot reverse.",
    "sections": [
      {
        "heading": "Represent the release state machine instead of manually toggling pods",
        "paragraphs": [
          "A useful progressive release has explicit stable, observing candidate, paused, eligible, promoted and aborted conditions. A temporary pause can be the correct outcome when traffic is too low, telemetry is unavailable or approvals are incomplete. A confirmed candidate regression must not be promoted by the passage of time. On abort the router should stop issuing new requests to the failed candidate and preserve an identifiable stable service, but in-flight requests and sticky sessions may persist and require draining.",
          "The local source proves a bad candidate receives 125 actual failing HTTP requests in a bounded 25% sample while stable receives 375 successful requests. The decision returns ABORT, the educational proxy switches to zero candidate weight, and 30 subsequent real HTTP requests must return only stable bytes. A negative mutation that leaves the bad candidate in the routing pool must fail. This is actual local request routing but not proof of Argo Rollouts abort, real gateway policy update or external user behavior."
        ]
      },
      {
        "heading": "Traffic rollback cannot undo writes, messages or irreversible migrations",
        "paragraphs": [
          "Both versions may interact with the same PostgreSQL schema and data, RabbitMQ queues, Redis keys and external services during a canary. If a candidate writes an incompatible enum value, changes a row shape, publishes a new consumer event format or sends a financial notification, moving HTTP traffic back to stable does not remove those changes. An API routing rollback is therefore only safe when the stable version can consume the persistent state the candidate may already have modified.",
          "Before progressive exposure, demonstrate expand/contract schema evolution and an appropriate queue compatibility strategy. For a bad candidate, separately prove that the stable application continues reading/writing the current database and that idempotent consumers tolerate the candidate's messages. Plan compensation for side effects that cannot be undone. The local HTTP experiment has no database, broker, cache or outbox and explicitly does not verify these recovery paths."
        ]
      },
      {
        "heading": "Promotion must preserve immutable build and one deployment authority",
        "paragraphs": [
          "In Steward, GitLab CI/CD builds, tests and uniquely publishes an immutable artifact to Nexus. Argo CD owns environment Git reconciliation; Argo Rollouts manages progressive rollout steps on the cluster. A successful canary promotes the already approved image digest and must not trigger a build that changes the bytes. If manual kubectl rollout edits and Git reconciliation both control the same spec fields, the two authorities can fight and repeatedly undo each other's changes.",
          "After abort, fix the defect in source and produce a new immutable release through the approved pipeline, or return to a retained known-good digest with an authorized environment-Git change. Re-check schema, routes and dependent consumers. The local exercise uses two synthetic HTTP handlers rather than real image digests and cannot demonstrate GitLab/Nexus provenance or Argo CD promotion; it teaches only the observable routing/fail-closed contract."
        ]
      }
    ]
  },
  {
    "id": "cloud-progressive-delivery-canary-010",
    "title": "Argo Rollouts, Argo CD and Prometheus responsibility boundaries",
    "estimatedMinutes": 60,
    "body": "A local working proxy is not an installed Argo controller; identify which real controller would make each observed behavior happen.",
    "sections": [
      {
        "heading": "Distinguish delivery authority from progressive rollout machinery",
        "paragraphs": [
          "GitLab CI/CD is Steward's single release artifact publisher to Nexus. Environment Git records an approved image digest and Kubernetes desired state. Argo CD reconciles Git to cluster API objects; it should not secretly choose a new image build. Argo Rollouts reconciles Rollout resources through canary steps and stable/canary ReplicaSets and may integrate with a traffic router to implement request percentages. These responsibilities are complementary, not interchangeable. A successful manually executed local canary is a foundation, not completion of this platform integration.",
          "A real lab must show an Argo CD Application pointing at an authorized environment repository and a Rollout resource managed by an installed Argo Rollouts controller, including stable/canary Service selectors, current revisions, traffic routing method, step status, pause conditions and final promoted digest. If using an OpenShift environment, explicitly prove admission/SCC and Route or Kong routing ownership. The loopback Python experiment has neither controller and must label both NOT_TESTED."
        ]
      },
      {
        "heading": "Handle Prometheus analysis unavailability as a control-plane incident",
        "paragraphs": [
          "A real AnalysisRun queries one or more defined data providers such as Prometheus and interprets successful, failed, error and inconclusive measurements according to policy. Zero returned time series is not automatically a successful measurement. A service may be healthy while its scrape target is down, the analysis service is unreachable or label selection silently excludes candidate traffic. If the controller cannot obtain trustworthy evidence, automatic promotion may turn a telemetry outage into full user exposure.",
          "Configure a disposable controlled analysis outage: block only the approved training metrics service or make the query return missing data, then observe actual AnalysisRun and Rollout conditions. A fail-closed policy should pause or abort, and restoring the dependency should allow safe re-evaluation, not a silent waiver. The independent metrics-listener shutdown in the teaching program demonstrates the fail-closed decision principle but does not assert that Argo Rollouts implements any particular default failure policy."
        ]
      },
      {
        "heading": "Choose routing and cleanup based on earned deployment requirements",
        "paragraphs": [
          "Service mesh, ingress controllers, weighted routing plugins and Argo Rollouts add resources and failure modes. They should only be added when an explicit risk and a trustworthy observed signal justify the operational cost. A basic Kubernetes Deployment rolling update may be more economical for a low-traffic, backward-compatible change with strong test coverage. Blue/green may simplify cutover but can double capacity and still needs database compatibility; a canary may require enough representative traffic that a small environment cannot provide.",
          "At the real platform checkpoint document capacity for stable and candidate replicas, extra metrics/cardinality cost, cluster security permissions, rollout controller recovery, promotion timeout, manual override governance and the circumstances that justify simplifying back to standard rolling updates. A successful local proxy test proves nothing about controller high availability, real route weighting, user-affinity, production monitoring or suitable thresholds. The original module practicals must still require real controller and business evidence."
        ]
      }
    ]
  }
];
export const cloudCanaryOriginalPractices:Record<string,string[]> = {
  "cloud-progressive-delivery-canary-002": [
    "Run the exact local HTTP source from reading -007 and capture actual stable/candidate response totals at zero, 25, 50 and 100% routes; explain why the deterministic local proxy is not evidence that a real ingress enforces those weights.",
    "For every proposed production-like canary step define one observation window, adequate candidate and stable request count, error and latency thresholds and a business correctness gate; distinguish source-executed synthetic thresholds from a justified operational SLO."
  ],
  "cloud-progressive-delivery-canary-003": [
    "Show actual installed Argo Rollouts and Argo CD controller status separately; the local HTTP proxy does not replace controller-side Rollout/AnalysisRun and Git reconciliation evidence.",
    "Record exact immutable Nexus image digest at stable, candidate and promoted states; demonstrate real request distribution through the selected cluster traffic router and verify Kong remains the intended public edge."
  ],
  "cloud-progressive-delivery-canary-004": [
    "Use the teaching proxy to observe real candidate HTTP 503 responses, automatic ABORT, and a post-abort stable-only request sample. Then reproduce the same failure with real Argo Rollouts AnalysisRun and verified traffic routing before operational acceptance.",
    "Do not accept '100% healthy' if the candidate has fewer than the minimum valid requests. Compare real endpoint business correctness, error/latency and stable baseline within one time window; name each untested gate explicitly."
  ],
  "cloud-progressive-delivery-canary-005": [
    "Shut down the local telemetry HTTP listener to prove the source's real dependency outage makes the decision INCONCLUSIVE. This does not test Prometheus or AnalysisRun; perform that integration separately in an authorized cluster.",
    "For the real environment, capture which Argo Rollouts/Argo CD controller owns the update and how an inconclusive AnalysisRun is observed; do not permit an unreviewed manual promotion to hide analysis failure."
  ]
};
