import type { LearningResource } from "../activities/content";
export type ReviewWorkedSection = {title:string;paragraphs:string[];code?:{language:string;caption?:string;code:string}};
export const reviewWorkedByModule:Record<string,Record<string,ReviewWorkedSection[]>> = {
  "failure": {
    "Thinking in Failure Modes": [
      {
        "title": "Build a causal chain with evidence at every boundary",
        "paragraphs": [
          "A failure mode is a way an intended behavior becomes wrong; its cause, symptom, consequence, detection and recovery are different things. For a stale owner lookup: an owner changed → the registry did not receive/reflect the update → incident responders received an old owner → escalation was delayed. One incident can have several candidate causes (missing write, stale cache, invalid source, UI), so do not draw a single confident arrow without checking data and logs.",
          "Write an FMEA-style record with boundary, triggering event, violated assumption, local symptom, user harm, detection method and current recovery. Example: ownership update rejected silently → audit log shows no accepted write; repair is to retry safely with a valid authorized mutation and verify the row. Avoid pretending monitoring exists before it is implemented; state proposed telemetry separately."
        ]
      },
      {
        "title": "Prioritize by reversibility and consequence",
        "paragraphs": [
          "A missing optional email notification and an unauthorized ownership mutation are not equal risks merely because both are 'failures'. First examine impact and evidence: can a user recover? Could it corrupt authoritative state? Could it expose protected ownership data? A scoring table can help discussion, but a made-up severity multiplier is not objective evidence.",
          "Independent case: another service returns an apparently valid but stale owner ID. Describe why HTTP status monitoring might pass while the business outcome is wrong, and specify a freshness/audit signal that could detect this."
        ]
      }
    ],
    "Dependency Failure": [
      {
        "title": "Run an actual loopback 503 → 503 → 200 recovery trace",
        "paragraphs": [
          "A dependency can refuse connections, time out, return an explicit error or return semantically wrong data. Each tells us something different. This local program runs a real HTTP server on an OS-assigned 127.0.0.1 port, returns 503 twice and then 200, and issues three GET requests. After reset it keeps returning 503, and the caller stops after two requests. The source contains all server and client setup; no external service or package install is necessary.",
          "Save the complete Python 3 snippet as bounded_dependency.py and run python bounded_dependency.py. The expected outputs are attempt 1: HTTP 503, attempt 2: HTTP 503, attempt 3: HTTP 200, calls after recovery: 3, unavailable attempt 1: HTTP 503, unavailable attempt 2: HTTP 503, bounded calls during outage: 2. A 503 proves the server responded, not that the network was unavailable. A connection-refusal failure belongs to a different pre-HTTP class.",
          "This tiny lab intentionally retries immediately to isolate attempts and stop conditions. Production retries need bounded backoff, jitter, deadlines, retry budgets and operation-specific idempotency; copying this immediate loop into production would cause overload. Do not retry non-idempotent operations merely because a library can resend a request."
        ],
        "code": {
          "language": "python",
          "caption": "Executable local HTTP 503, bounded retry, success and persistent-outage trace",
          "code": "from http.server import BaseHTTPRequestHandler, HTTPServer\nfrom threading import Thread\nfrom urllib.error import HTTPError\nfrom urllib.request import urlopen\n\nclass Dependency(BaseHTTPRequestHandler):\n    seen = 0\n    fail_until = 2\n\n    def log_message(self, *args):\n        pass\n\n    def do_GET(self):\n        type(self).seen += 1\n        code = 503 if type(self).seen <= type(self).fail_until else 200\n        self.send_response(code)\n        self.end_headers()\n        self.wfile.write(b\"temporary unavailable\" if code == 503 else b\"ok\")\n\nserver = HTTPServer((\"127.0.0.1\", 0), Dependency)\nthread = Thread(target=server.serve_forever, daemon=True)\nthread.start()\nendpoint = f\"http://127.0.0.1:{server.server_port}/lookup\"\ntry:\n    # A GET, not a POST effect. This lab deliberately has no backoff delay.\n    for attempt in range(1, 4):\n        try:\n            with urlopen(endpoint, timeout=2) as response:\n                print(f\"attempt {attempt}: HTTP {response.status}\")\n                break\n        except HTTPError as error:\n            print(f\"attempt {attempt}: HTTP {error.code}\")\n    print(\"calls after recovery:\", Dependency.seen)\n    Dependency.seen = 0\n    Dependency.fail_until = 999\n    for attempt in range(1, 3):\n        try:\n            with urlopen(endpoint, timeout=2) as response:\n                print(f\"unavailable attempt {attempt}: HTTP {response.status}\")\n        except HTTPError as error:\n            print(f\"unavailable attempt {attempt}: HTTP {error.code}\")\n    print(\"bounded calls during outage:\", Dependency.seen)\nfinally:\n    server.shutdown()\n    thread.join(timeout=3)\n    server.server_close()"
        }
      },
      {
        "title": "Identify amplification before applying a retry policy",
        "paragraphs": [
          "Imagine API Gateway, application and provider client each retries the next layer up to three total attempts on a failed dependency. If all levels independently repeat a failing request, the leaf can see 3 × 3 × 3 = 27 attempts for one user request. A single chosen retry layer with a budget could limit it to 3. Real systems may not attain the theoretical worst case, but the multiplication is a warning against independently retrying at every boundary.",
          "After the successful local experiment, change the HTTP handler to always return 503 and remove the attempt limit in a disposable branch; explain why that behavior is dangerous without actually running an unbounded loop. Design instead a bounded, timed policy that returns an explicit dependency-unavailable error after the budget is exhausted."
        ]
      }
    ],
    "Invalid and Partial State": [
      {
        "title": "Show two individually valid operations that violate a global invariant",
        "paragraphs": [
          "Production promotion and deletion of the last production Environment can race. Request A sees an Environment and prepares promotion; request B sees the Service is not yet production and prepares environment deletion; both commit. The final record is production-stage without production deployment, contradicting the Builder product rule. Each handler passing an earlier read is not sufficient.",
          "Draw the timeline as R-A/read, R-B/read, A/write, B/write and mark which snapshots were checked. Then identify the transaction/locking or database-constraint strategy used in the real API; two workers in separate transactions are required to test it. A pure sequential simulation cannot establish concurrency safety."
        ]
      },
      {
        "title": "Recovery must return to a valid state, not hide the symptom",
        "paragraphs": [
          "A naive compensating request that demotes the service after the invalid state is detected may race with new changes and lose legitimate work. First establish authoritative current state, what operation committed and which actor was permitted to make it. Choose recovery that preserves auditability and makes the domain invariant true, and require evidence that clients cannot bypass the protected command path.",
          "Independent transfer: a payment service commits a ledger entry but fails before sending its response. Classify what retry information is missing and why an error response cannot by itself justify reversing the payment."
        ]
      }
    ],
    "Resource Exhaustion": [
      {
        "title": "Trace arrival rate, concurrency and queue length",
        "paragraphs": [
          "If 50 requests/second arrive and the service can complete only 40/second, backlog grows by about 10/second while those rates persist. After one minute, roughly 600 requests may be waiting (ignoring timeouts/drop policies). A bigger queue does not increase processing capacity; it mainly delays refusal and consumes memory. State which work is essential and which can be shed.",
          "At 40 requests/second, mean service time and concurrency interact through Little's Law under a stable workload: L = arrival rate × average time in system. If mean time grows from 0.1 to 1 second while arrival remains 40/second, average in-flight/queued work rises from about 4 to 40. These are illustrative, not actual Steward capacity measurements."
        ],
        "code": {
          "language": "text",
          "caption": "A queue that grows while throughput stays fixed",
          "code": "Requests arrive:      50 / second\nRequests completed:   40 / second\nApprox. backlog:      +10 / second\nAfter 60 seconds:     +600 waiting (if none drop/timeout)\nAdding a queue alone cannot make a 40/s worker process 50/s"
        }
      },
      {
        "title": "Choose explicit overload behavior",
        "paragraphs": [
          "Document which API methods can fail fast with 429/503, which background effects may queue durably, and which state transitions must fail closed. Protecting the database requires connection and concurrency limits, not blind retries from every client. A load-shedding policy must not 'succeed' by returning fabricated ownership data.",
          "In a disposable run, increase load gradually and observe latency percentiles, queue depth, error ratio and database pool saturation; if you do not run an actual load test, label the capacity threshold unverified instead of treating the arithmetic example as a benchmark."
        ]
      }
    ],
    "Human and Operational Failure": [
      {
        "title": "Follow a plausible recovery mistake through its blast radius",
        "paragraphs": [
          "During an incident, an engineer applies a migration to the wrong environment because both connection strings look similar. It is not enough to say 'human error'. The design may have identical console prompts, weak credential scoping, no environment identity check and an untested rollback. Write the causal chain: mistaken target → unauthorized or mistaken schema mutation → application incompatibility → failed requests or corrupt state.",
          "Prevention includes distinct least-privilege credentials, visible target identity, dry-run/migration checks and approvals appropriate to risk. Detection includes schema/version checks and specific error traces. Recovery includes known-good backups, restore rehearsal and contract smoke tests. Those are different controls and require independent evidence."
        ]
      },
      {
        "title": "Write a runbook that a second operator can execute",
        "paragraphs": [
          "A runbook needs triggers, expected observations, safe read-only diagnosis, mutation/rollback permission boundaries, stop conditions and an escalation owner. 'Restart everything' is not a plan: it can erase evidence or duplicate work. For a stalled outbox publisher, first inspect pending-row age and broker availability; distinguish poison messages from a down dependency before replaying anything.",
          "Independent exercise: give a colleague a fabricated alert and only the runbook. Ask them to decide whether the API is down, the database is unavailable, or a consumer backlog is growing without coaching. Any step depending on an unstated command or environment is a teaching/runbook defect."
        ]
      }
    ]
  },
  "decisions": {
    "Architecture Characteristics Introduction": [
      {
        "title": "Derive characteristics from user-visible scenarios",
        "paragraphs": [
          "Availability, security, latency, adaptability and operability sound like general virtues; they become architecture drivers only when linked to important situations. Steward's incident owner lookup may prioritize correct authorized data even under partial outage, while service metadata maintenance may tolerate slower writes. They need different measures and failure behavior.",
          "From Requirements, take a measured scenario instead of declaring 'high scalability'. Example question: can incident responders identify the correct owner within a documented workload and response budget? State current measurement, proposed target, evidence location and stakeholder owner. A quality characteristic without an environment and threshold cannot justify Redis or a broker."
        ]
      },
      {
        "title": "Distinguish product pressure from architecture preference",
        "paragraphs": [
          "A team asks for microservices so deployment is independent. Ask what changes frequently, what is actually blocking the current release process and whether a modular monolith with better test isolation would solve it. Changing process count creates operational boundaries, communication failure and consistency costs; those must be counted against the expected benefit.",
          "Failure example: choosing asynchronous processing to meet a latency goal when the result is required for authoritative authorization. The API may become fast but incorrect because the business decision was deferred."
        ]
      }
    ],
    "Decision Drivers": [
      {
        "title": "Rank constraints without inventing numerical objectivity",
        "paragraphs": [
          "Build a decision table listing Must-pass constraints and Weighted preferences separately. Example: MUST preserve PostgreSQL authority and cross-team access rules; MUST survive a committed lifecycle change if an optional notification cannot be sent; PREFERENCE minimize additional runtime components; PREFERENCE reduce response latency under measured workload. The first two are gates; trading them away for speed is not a valid weighted decision.",
          "An option comparison can mark pass/fail for constraints, then estimate impact on latency, complexity, failure recovery and team support capacity. If evidence is missing, write UNKNOWN rather than a fake 8.4/10 score. An unknown that determines which option wins should trigger a measurement or spike, not a confident ADR."
        ]
      },
      {
        "title": "Keep the business owner visible in technical trade-offs",
        "paragraphs": [
          "The product owner decides whether a notification can complete eventually; architects do not get to assert it is optional because a queue would be interesting. The platform operator supplies evidence about broker cost and maintenance; a tester verifies duplicate and failure behavior. Record who validates which premise and revisit if assumptions change.",
          "Counterexample: citing hypothetical future millions of requests as a driver for Kafka when current measured throughput is tiny. A credible driver needs workload, retention/replay semantics and observable trigger thresholds."
        ]
      }
    ],
    "Architecture Decision Records": [
      {
        "title": "Write a complete small ADR instead of a technology slogan",
        "paragraphs": [
          "An ADR records a significant decision's status, context, choice and consequences. In this worked candidate, the product owner has confirmed that lifecycle mutation is authoritative immediately while an audit notification may arrive later. Keeping notification synchronous couples latency and availability to an external provider; an outbox adds a publisher and eventual side-effect but preserves durable intent. Record the alternatives explicitly; do not mark the decision accepted unless the required runtime proof exists.",
          "Worked ADR-012 (PROPOSED): Context—lifecycle commits must succeed when the notification provider is unavailable, and every committed change requires durable intent to notify. Options—(A) direct synchronous send, (B) fire-and-forget after commit, (C) PostgreSQL outbox with worker. Decision proposal—C if tests demonstrate committed intent, safe retries and backlog recovery. Consequences—new worker and observability burden, possible duplicate deliveries, eventual notification, but no lost intent in the commit/publish gap.",
          "Evidence to accept: simulate broker unavailable at commit; pending outbox row persists; restart publisher; one idempotent consumer effect after duplicate publish. Without this proof the ADR stays proposed. Revisit if support capacity cannot sustain the worker or product timing semantics change."
        ],
        "code": {
          "language": "text",
          "caption": "Proposed ADR with evidence and revisit gate, not a fictional accepted decision",
          "code": "ADR-012: Durable lifecycle notifications\nStatus: PROPOSED\nContext: synchronous provider latency blocks authoritative lifecycle changes\nConstraints: no lost committed intent; safe cross-team authorization\nOptions: direct send | fire-and-forget | transactional outbox + worker\nProposal: outbox + worker IF crash/restart tests pass\nBenefits: recoverable notification intent\nCosts: worker, dedupe, backlog monitoring, eventual outcome\nRevisit: timing requirement changes or operating cost outweighs benefit\nEvidence: broker-down commit, restart and duplicate publish tests"
        }
      },
      {
        "title": "Treat an ADR as a history of a decision, not timeless truth",
        "paragraphs": [
          "An accepted ADR describes why a decision was justified under specific forces. If the force changes, write a superseding ADR referencing the original; do not quietly erase the old rationale. A rejected option may become reasonable after a new workload appears; preserve the actual trigger and trade-offs.",
          "Transfer: write a separate ADR for whether to add Redis when the measured SQL query already meets the service target; the correct result may be to reject a cache."
        ]
      }
    ],
    "Evaluating Trade-offs": [
      {
        "title": "Create a fair alternative comparison using real evidence",
        "paragraphs": [
          "Suppose the owner lookup is slow. Option 1 correct an N+1 query and add an index; Option 2 add Redis cache-aside; Option 3 precompute a read model. Record the same workload and correctness tests for all, plus operational costs: cold miss, stale data, key scoping and outages for Redis, refresh lag for a read model, migration/index overhead for SQL. A comparison that lists only Redis benefits is not an engineering decision.",
          "Use a smallest-reversible-step policy when constraints permit: measure SQL first, change the least expensive cause, and measure again. Redis is justified when the demonstrated target cannot be met within reasonable simpler improvements or when a distinct caching requirement exists. A design can be reversible in theory but hard in practice if every client depends on cache-specific representation."
        ]
      },
      {
        "title": "Reveal the difference between local optimization and whole-system cost",
        "paragraphs": [
          "An asynchronous queue may reduce API response time but create another durable state, consumer lifecycle, retry budget, dead-letter handling and support runbooks. A local latency improvement is not a net gain if unstaffed operations increase incident risk or audit side effects are silently lost.",
          "Independent challenge: a manager requests both RabbitMQ and Kafka. Provide a workload and failure-semantics argument selecting one or neither. State the observable change in requirements that would make the rejected option rational in future."
        ]
      }
    ]
  }
};
export const reviewResearch:Record<string,LearningResource[]> = {
  "failure": [
    {
      "title": "Google SRE Book — Handling Overload",
      "url": "https://sre.google/sre-book/handling-overload/",
      "kind": "reference",
      "purpose": "Capacity, admission control and overload responses; source for explicit queue and shedding discussion."
    },
    {
      "title": "AWS Builders' Library — Timeouts, Retries and Backoff with Jitter",
      "url": "https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter",
      "kind": "reference",
      "purpose": "Deep treatment of bounded retries, timeouts, idempotency and retry amplification."
    },
    {
      "title": "Google SRE — Production Service Practices",
      "url": "https://sre.google/sre-book/service-best-practices/",
      "kind": "reference",
      "purpose": "Incident diagnostics, overload/failure response and operational recovery."
    }
  ],
  "decisions": [
    {
      "title": "ADR templates — Nygard and alternatives",
      "url": "https://adr.github.io/adr-templates/",
      "kind": "reference",
      "purpose": "ADR status, context, decision, consequences and option trade-offs."
    },
    {
      "title": "UK Government Digital Service — Recording architecture decisions",
      "url": "https://gds-way.digital.cabinet-office.gov.uk/standards/architecture-decisions.html",
      "kind": "reference",
      "purpose": "Proposed/accepted/superseded decision lifecycle and traceability."
    },
    {
      "title": "CMU SEI — Quality Attribute Workshop webcast",
      "url": "https://www.sei.cmu.edu/library/architecting-in-a-complex-world-eliciting-and-specifying-quality-attribute-requirements/",
      "kind": "video",
      "purpose": "Optional lecture on connecting requirements, scenarios and architecture drivers; does not replace TSA's worked ADR."
    }
  ]
};
