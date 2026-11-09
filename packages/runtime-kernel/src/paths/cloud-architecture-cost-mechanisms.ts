// Original module 10: separate mechanisms, failure paths and executable evidence; no ID renaming.
export type CloudArchitectureSection={heading:string;paragraphs:string[]};
export const cloudArchitectureMechanisms:Record<string,CloudArchitectureSection[]> = {
  "availability": [
    {
      "heading": "Service availability depends on the entire customer operation, not a healthy compute badge",
      "paragraphs": [
        "An availability target is a contract about a named user operation measured over a time interval. HTTP 200 from an API gateway, a running Pod and a healthy database process are three different signals; none proves an authorized team can retrieve its correct data. Specify the exact user route, permitted errors, timeout, latency threshold, maintenance handling and denominator before computing percentages. Multiple availability dependencies in series can make user-visible success lower than any individual component's reported uptime.",
        "In the copyable synthetic architecture model a 99.9% objective over a 730-hour month permits 43.8 minutes of unavailability; a two-hour shared-database interruption alone exceeds it. The calculation cannot demonstrate actual uptime, independence between failure modes or earned provider SLAs. For the real Steward candidate, run a representative authorized and forbidden API request through the intended Kong edge, capture actual failure minutes, and record the unknown dependencies before offering a service-level commitment."
      ]
    },
    {
      "heading": "Availability architecture must distinguish failover capacity from a spare Pod",
      "paragraphs": [
        "Two replicas can both be scheduled on one node or depend on one database, shared credential or DNS zone. A replica that restarts on the surviving node also requires enough CPU, memory and storage/network capacity to serve demand at the accepted latency. Map failure domains for the request path and estimate the steady and failover workloads, rather than counting Deployment replicas on a diagram and assuming the system survives an infrastructure failure.",
        "Record the first single failure that interrupts the user operation and the verification required to remove it. The source model's spare node capacity is a planning hypothesis assuming two safely placed replicas per node; it does not prove real scheduler anti-affinity, replicated PostgreSQL, automatic region failover or a tested recovery. Accept a single failure domain explicitly when the workload and business impact do not justify the cost of removing it."
      ]
    }
  ],
  "scalability-capacity": [
    {
      "heading": "Capacity begins with demand shape and a measured per-instance saturation knee",
      "paragraphs": [
        "Requests per second is not automatically sufficient to size an application: distinguish peak request arrival rate, concurrency, connection reuse, request cost distribution, CPU throttling, memory growth, database-pool wait and external service latency. Establish a repeatable load test and find the knee at which p95/p99 latency or error ratio deteriorates, not just the theoretical maximum throughput. Then select a conservative utilization ceiling with headroom and define which requests/events were included in the benchmark.",
        "The executable source assumes a fictional 32 requests/second per API replica and a 60% operating ceiling, so steady busy-period demand of 28 requests/second requires two replicas while an 80 requests/second burst requires five. These numbers are deliberately synthetic; they are not observed Steward performance. If a real benchmark finds 15 requests/second and a database pool cap, recompute from those measured inputs rather than treating the training arithmetic as the scaling decision."
      ]
    },
    {
      "heading": "Compute placement and billed node-hours are different from replica count",
      "paragraphs": [
        "A cluster scheduler places pods on nodes subject to allocatable resources, affinity, admission and capacity. The exercise uses a fictional limit of two safely scheduled replicas per node and one extra node of capacity for failover, giving two nodes at baseline and four during the burst. That extra capacity is a hypothesis, not proof of distinct availability zones or sufficient headroom after a node fails; use actual pending Pods and placement evidence to validate it.",
        "A transient 48-hour burst must not automatically be charged as if two extra nodes ran for the whole 730-hour month. The source computes base node-hours plus extra node-hours only during the stated surge, while also showing the much higher bill if peak capacity remains allocated all month. For a real platform, use actual instance start/stop timestamps, minimum billing increments, autoscaling lag and idle reserve charges to replace the synthetic node-hour assumption."
      ]
    }
  ],
  "resilience-dependency-failure": [
    {
      "heading": "A dependency outage should have a named degradation mode",
      "paragraphs": [
        "An API depends on more than its own readiness: database availability, Redis, RabbitMQ, object storage, identity verification and external integrations affect different operations. Classify each dependency as essential, optional or asynchronously recoverable for each user journey. A cache outage may be tolerable with a bounded slower database fallback, while a database outage must not silently acknowledge an uncommitted financial record or return success for a failed transaction.",
        "Practice a genuine fault-injection tabletop by selecting one dependency and predicting user-visible status codes, request deadlines, queue growth and recovery. The safe mechanism may include timeouts, circuit breakers, bounded retries with jitter, bulkheads, DLQs and durable outbox state, but each mechanism solves a different failure. An infinite retry loop under overload can multiply work and exhaust the surviving database; require evidence that rejected work is neither lost nor falsely confirmed."
      ]
    },
    {
      "heading": "The recovery path must prevent replay and side-effect corruption",
      "paragraphs": [
        "RabbitMQ may redeliver a message after a consumer reconnects or loses its acknowledgement. A retry of an API write may also repeat an operation after the client times out despite a committed database transaction. A service with perfect uptime can still be incorrect if duplicate financial events or cross-team exports result. Define idempotency keys and deduplication boundaries, transactional outbox behavior and an operator-visible reconciliation process before calling the system resilient.",
        "Use a disposable queue and database test in the real Steward environment to prove recovery from a safely interrupted worker while monitoring unacknowledged messages and business invariants. A simulation that merely prints RETRY does not prove idempotency, persistence, ordering or deduplication. If no real end-to-end dependency can be started, label the result as a design exercise rather than a validated resilience mechanism."
      ]
    }
  ],
  "security-boundaries": [
    {
      "heading": "Follow one authorized and one forbidden request across every trust boundary",
      "paragraphs": [
        "The Steward public edge, operator control plane, cluster API, application workload, database, queues and secrets backend have different principals and permissions. Public DNS and TLS do not make an internal database public; conversely a private IP alone is not sufficient authorization. Identify where the client credential is authenticated, where tenant/team access is enforced, where service-to-service credentials are issued and where secrets can be read from build logs or state artifacts.",
        "Use paired positive and negative requests through the actual deployed Kong-to-API path: valid team ownership may return the authorized resource, while a mismatched team must be denied regardless of which replica handles it. Independently inspect Kubernetes RBAC, network isolation and storage permissions; accepting a NetworkPolicy YAML or a read-only ServiceAccount is not equivalent to application authorization. Retain denied-action evidence and identity names without embedding production tokens in lesson artifacts."
      ]
    },
    {
      "heading": "Minimize the blast radius of a release and of its operator",
      "paragraphs": [
        "The identity authorized to publish an image to Nexus does not automatically need access to deploy production; the Argo CD reconciler does not need the same power as a human cluster admin; the runtime consumer must not manage IaC state. Separation protects against compromised credentials and human error but can also fail when roles are accidentally aggregated or cross-namespace resources grant broad permissions.",
        "Define a threat scenario in which a CI token leaks or a worker Pod is compromised. Trace the exact APIs and data it could reach, what logs would prove abuse and how to revoke access without destroying retained evidence. Secure design is not a product checklist: require real denied reads/writes under the relevant identities and a documented credential rotation path before calling a boundary verified."
      ]
    }
  ],
  "backup-recovery": [
    {
      "heading": "RPO and RTO are properties of a completed restore, not a backup schedule",
      "paragraphs": [
        "Recovery Point Objective limits acceptable data loss by time; Recovery Time Objective limits how long the user operation may be unavailable. A daily snapshot at 02:00 does not prove an RPO of 24 hours if its bytes are corrupt, encryption keys are unavailable or the restore fails validation. Similarly an instance rebuilt through OpenTofu may not have compatible credentials, schema migration state, object-storage exports or replayable queue events.",
        "Identify the backup source, consistency point, target restore environment, retention, encryption-key owner and whether application and database snapshots were coordinated. Perform a disposable restore to a separately isolated environment, verify actual row counts, selected tenant invariants, object checksums and a safe read-only user request, then measure elapsed recovery and the timestamp of the latest restorable data. Report RPO/RTO as NOT_MEASURED until those observations exist."
      ]
    },
    {
      "heading": "Separate availability recovery from disaster recovery",
      "paragraphs": [
        "Recreating an API Pod after deletion is high-availability control-loop behavior, not disaster recovery. If every Pod shares a lost database volume or a deleted encryption key, a healthy controller cannot reconstruct the data. Multi-zone compute, backups in the same provider account and off-account immutable copies protect against different failures. A restored database can also need reconciliation of outbox and message processing to avoid duplicate external side effects.",
        "Rank scenarios from one worker crash to loss of a data volume, database corruption, mistaken admin deletion and provider-account compromise. For each identify which components recover automatically, which require human approval and whether the needed credentials survive the event. Do not run destructive tests on live Steward data merely to satisfy a course; use disposable seeded fixtures, explicit ownership and precondition checks."
      ]
    }
  ],
  "failure-domains": [
    {
      "heading": "Two replicas are not independent when they share the same upstream failure",
      "paragraphs": [
        "Failure domains include process, host, power zone, region, provider account, IAM policy, DNS authority, certificate, external dependency and human operational control. Two replicas can survive a process crash and still fail simultaneously on bad schema rollout, shared database exhaustion, wrong gateway rule or a region outage. Availability multiplication calculations based on independent random component failures are misleading when the components share correlated failure modes.",
        "Draw a dependency and fault tree for one actual Steward public API request and annotate all shared components; distinguish the cheapest tolerated domain loss from the expensive one the requirements justify addressing. In the source model the extra node is only a scheduling-capacity assumption. Real fault-tolerance acceptance requires separate placement evidence, loss of a node in a disposable cluster, surviving user requests and independent database/traffic-path validation."
      ]
    },
    {
      "heading": "Test failover as a controlled loss of one boundary",
      "paragraphs": [
        "Failover has a detection time, decision time, data synchronization condition, cutover time and convergence period. A stand-by service may be unavailable or stale even if its resource status reads Running. DNS changes can be slow because of client caches, while stateful database promotion must prevent split-brain writes. Never claim loss-free recovery from counting zones or describing a virtual IP.",
        "For a bounded training experiment stop one disposable replica or replaceable node, record which requests fail and whether the alternate path serves correct data, then recover and check for duplicate work. Identify the test's unreachable boundaries explicitly: a one-node kind cluster can prove pod replacement but cannot prove node-loss HA. Design a separate approved multi-node or multi-zone test rather than extrapolating from local evidence."
      ]
    }
  ],
  "cost-estimation": [
    {
      "heading": "Make the bill an auditable function of hours, quantities and region-specific rates",
      "paragraphs": [
        "An estimated monthly cloud bill is a sum of distinct billed dimensions, not a single VM sticker price. Compute may be hourly and allocated capacity may remain billed when idle; storage GiB-month, snapshots, public IPv4, gateway/load balancer, managed database, egress and observability retention have separate units. A provider calculator result is only as credible as its assumptions, discount/tax treatment and completeness. Each line should record currency, region, date, quantity, free allowance, applicable billing minimum and ownership.",
        "The exact executable Python program in this original reading uses fictional USD rates to produce an auditable full cost breakdown. It deliberately includes nine categories, including idle IPv4 and backup charges, and calculates allocated node-hours for a 48-hour burst separately from full-month peak capacity. These numbers are NOT a provider quote, a current price, a verified invoice or a real Steward load measurement; the goal is to teach a reproducible decision rather than invent a bill."
      ]
    },
    {
      "heading": "Use scenarios to expose hidden budget and capacity risks",
      "paragraphs": [
        "The training model compares a low-cost single VPS, a two-node cluster baseline, a 48-hour surge and a sustained full-month peak. The VPS is cheaper in cash but is not declared capable of handling the burst, because the hypothetical benchmark requires five API replicas. The cluster model adds extra nodes only for the 48-hour window, while egress and logs rise over the month. Treat a budget breach as a review/authorization trigger, not a reason to erase required capacity from the spreadsheet.",
        "Execute the code and verify four labelled results: baseline cluster $131.40, 48-hour surge $168.76, permanent peak $213.60 and single-VPS $35.40 under the explicit fictional assumptions. The $160 monthly budget is exceeded by $8.76 in the surge case. Then vary node price, outbound traffic and log volume to see which assumptions dominate; collect a real invoice and workload trace later before replacing the baseline with a decision-grade projection."
      ]
    }
  ],
  "cost-allocation-unit-economics": [
    {
      "heading": "Choose the denominator that represents value delivered, not busy infrastructure",
      "paragraphs": [
        "Per-node cost and per-request cost describe different things. Finance and product decisions require a meaningful unit such as a successfully completed authorized export, verified transaction or completed job. Total HTTP requests include probes, retries, errors and duplicate calls, so dividing cloud spend by raw requests can make an unhealthy system appear cheaper. A useful metric states measurement period, success definition, allocated shared-cost fractions and whether internal traffic is excluded.",
        "The synthetic program divides complete cluster spend by separately supplied successful-operation counts and reports cost per 10,000 successful operations. Both the costs and counts are fictional; it does not derive true monthly workload from a 28 QPS representative busy window. Demand peaks determine capacity while actual successful monthly throughput determines unit economics. Collect billing and request/business outcome data for the SAME period to create a real comparable metric."
      ]
    },
    {
      "heading": "Do not compare unit costs without preserving error and capacity context",
      "paragraphs": [
        "Lower cost per successful operation can result from scale, but it can also hide congestion if failures were removed from the success denominator or if a cheaper configuration dropped tail-latency guarantees. Allocate shared gateway, database, logs and backup spend using a disclosed policy. If one tenant causes most storage egress and another causes many expensive writes, a flat per-request allocation can reverse the apparent economics of their workload.",
        "Stress-test two common shortcuts: removing storage and logs from the shared cost pool; and using total requests instead of successful operations. Both should fail the finance-quality gate. Present the unit-cost estimate alongside real error ratio, p95/p99 latency, restoration capability and budget exposure. A percentage improvement in synthetic unit cost is not evidence of a better production service."
      ]
    }
  ],
  "cost-controls-budgets": [
    {
      "heading": "Alerts indicate crossing a threshold; they do not automatically prevent a bill",
      "paragraphs": [
        "A monthly budget notification is commonly asynchronous and may arrive after a service has already consumed billable resources. Preventing a runaway bill may require policy restrictions, project quotas, scoped identities, maximum scale, approval gates and short-lived lab teardown. Even these controls have exceptions: orphaned volumes, retained snapshots, static IPs and managed database minimum charges can persist after compute is terminated.",
        "The local executable model intentionally breaches a fictional $160 monthly budget during a 48-hour demand surge and refuses to hide that result. This proves arithmetic and an explicit decision boundary, not a real provider budget alarm or enforcement action. In an approved disposable cloud account, test an actual alert and a separate resource-creation deny policy, recording who receives and acts on them. Never assume a red dashboard stopped the financial liability."
      ]
    },
    {
      "heading": "Assign ownership to resources at creation and teardown",
      "paragraphs": [
        "An infrastructure cost without an accountable owner cannot be responsibly optimized. Label environments, product, project, owner, TTL, data classification and retained-evidence reason, but ensure the cloud's actual billing/tag mechanism supports your allocation. Automation should shut down explicitly disposable compute without deleting production databases, useful evidence or backups whose retention has been approved.",
        "Run a recurring orphan-resource inventory that can detect an allocated public address, detached storage, retained image, old snapshot or unexpected cross-region data transfer. Document the person authorized to delete each class and how to prove no active service depends on it. A training checkout script that reports all resources deleted cannot substitute for checking the provider's actual inventory and subsequent billing period."
      ]
    }
  ],
  "right-sizing": [
    {
      "heading": "Scale the saturated subsystem and preserve a measurable safety margin",
      "paragraphs": [
        "A steady application might show 20% mean CPU but p99 HTTP latency can degrade when PostgreSQL connection pools saturate, lock waits rise, DNS resolution slows or containers page memory. Adding API replicas can actually worsen a fixed database connection bottleneck. Right-sizing requires correlated demand, queue depth, latency, CPU throttling, memory RSS/OOM and provider-side storage IO rather than one average utilization figure.",
        "The model uses a fictional per-replica sustainable QPS ceiling, then rounds up replicas and accounts for host placement. Its baseline of two pods and surge of five only illustrate the math. Execute a representative load test on the real Steward build before using the figure as a deployment target, and verify actual node allocatable memory, scheduling distribution, PodDisruptionBudget behavior and p95/p99 under load."
      ]
    },
    {
      "heading": "Avoid billing the peak for the entire month unless capacity stayed provisioned",
      "paragraphs": [
        "Cloud billing may charge an instance every minute or hour it is allocated, so reserving surge capacity for a full month can be a significant error if it actually runs for only 48 hours. Conversely assuming perfect instantaneous autoscaling and a zero-cost warm-up path understates capacity and availability risk. Price the minimum number of always-on instances, scale-up lag, idle headroom and the actual duration/rounding of peak demand separately.",
        "In the synthetic exercise the same peak architecture costs $168.76 when only two extra nodes run for 48 hours, versus $213.60 if that peak capacity stays for all 730 hours. That difference is not a promised saving: if surge replicas cannot be scheduled on time, business-level error costs may be much larger. Record actual start/stop timestamps and tail-latency impact from a real scaling rehearsal before claiming right-sizing is safe."
      ]
    }
  ],
  "managed-self-managed": [
    {
      "heading": "Compare cash expense plus credible operational responsibility",
      "paragraphs": [
        "A managed service usually charges a visible premium for some operational obligations but does not transfer application design, authorization, data retention, migration compatibility or incident response to the provider. A self-managed stack may have a smaller invoice but require skilled hours for patching, backups, monitoring, security response and recovery. Price the managed and unmanaged alternatives with explicit retained ownership, realistic labor assumptions and failure handling rather than saying 'managed is always better'.",
        "The executable model compares a fictional $35.40 VPS with $131.40 managed cluster baseline. At an unverified $18/hour and invented maintenance estimates of 15 versus 4 hours/month, the wider total favors managed despite its higher invoice. The break-even engineering rate under those assumptions is between $8 and $9/hour. These are sensitivity examples, not measured staff hours, employment costs or real platform reliability data."
      ]
    },
    {
      "heading": "Managed does not remove blast radius or vendor dependency",
      "paragraphs": [
        "A provider-managed database can reduce patching and automated-backup toil yet become a costly single point of failure if a regional outage, IAM lockout or incompatible upgrade blocks every API replica. Managed compute can also amplify recurring log, transfer and snapshot costs. A self-managed alternative might provide clearer portability but may be too burdensome for a small team with no 24-hour on-call coverage.",
        "For the actual Steward architecture, ask which operational failures the team can reliably repair, the recovery objectives promised and the contract/SLA exclusions. Compare the managed premium with the value of a tested recovery and acceptable support response, not only with a nominal hourly rate. Mark the chosen decision conditional until provider terms, actual bills, labor, security and restore drills have been verified."
      ]
    }
  ],
  "hybrid-tradeoffs": [
    {
      "heading": "A homelab must not become an accidental production dependency",
      "paragraphs": [
        "A developer's home router, laptop, utility power and personal ISP are not accountable production failure domains. A design that routes a public authentication or database request through a private homelab can break during ordinary household maintenance and introduce unsupported trust paths. Define which resources belong to training, which belong to production and which can be disconnected without degrading any real Steward user journey.",
        "In the learning architecture a homelab may be used for kind, OpenTofu simulations, local Prometheus, build rehearsal or restoration drills, while public Steward services must continue independently. The cheapest architecture on paper can become expensive when debugging depends on one person's availability or backups exist only in a home room. Prove the boundary with a safe simulated homelab loss and an external user-path check; a diagram alone is NOT operational evidence."
      ]
    },
    {
      "heading": "Choose provider portability where the switching option has a use case",
      "paragraphs": [
        "Portable Docker images, PostgreSQL schema, HTTP APIs and well-factored modules can reduce migration friction, but imposing every provider-neutral abstraction from day one also increases cost and obscures effective operations. Data egress, DNS TTLs, access-control semantics, secrets, region-specific storage and managed service APIs may still create provider lock-in even when Kubernetes YAML looks transferable.",
        "Compare one inexpensive VPS, a modest managed cluster and a hybrid lab-supported environment against the SAME demand, security, recovery and budget requirements. Document which choice wins under the measured baseline and the trigger for reconsideration, such as a need for isolated failure domains, a higher recovery objective or meaningful sustained traffic. Do not add a second public ingress or dual cloud providers merely because the exercise can draw them."
      ]
    }
  ]
};
export const cloudArchitecturePracticeEvidence:Record<string,string[]> = {
  "availability": [
    "Compute the 99.9% 730-hour error budget from the exact learner model, then name the customer-visible request that should consume it and explain why the two-hour database outage invalidates the target.",
    "Map which shared dependency remains a single failure domain and record an accepted-risk statement if a second zone is not justified."
  ],
  "scalability-capacity": [
    "Run the published capacity solver: given 32 synthetic per-replica QPS at 60% utilization, verify 28 QPS needs two replicas and 80 QPS needs five; cite why a real measured Steward saturation curve is still required.",
    "Contrast node-hours for two additional nodes over 48 hours with 730 hours of provisioned peak capacity and identify the real autoscaling delay test."
  ],
  "resilience-dependency-failure": [
    "Pick one actual Steward dependency outage and record API error/latency, bounded retry policy, queue state, circuit recovery and evidence that no falsely confirmed business operation occurred.",
    "Explain why a canary traffic rollback cannot remove already-emitted RabbitMQ messages or restore a corrupted database."
  ],
  "security-boundaries": [
    "Propose one authorized and one unauthorized request under real user identities, trace the Kong and application policy path and identify independent RBAC/network/secret tests.",
    "Document which identity can deploy, publish, access the database or modify state; prohibit broad role reuse and plaintext evidence uploads."
  ],
  "backup-recovery": [
    "Define actual seed, backup age, encryption-key access, database restore, checksums and representative API verification required to measure RPO/RTO; report NOT_MEASURED if no real restore ran.",
    "Separate recovery of a deleted stateless Pod from restoring PostgreSQL state, queue continuity and cross-tenant authorization."
  ],
  "failure-domains": [
    "Build a fault tree for DNS, Kong, APIs, PostgreSQL, queues, region and provider identity; identify which failures remain correlated even with two API replicas.",
    "State which extra-node capacity the synthetic model assumes and why a one-node kind exercise is not proof of failover between nodes/zones."
  ],
  "cost-estimation": [
    "Execute the exact-source synthetic full-bill Python model. Provide the auditable nine line items and verify $131.40 baseline, $168.76 for 48-hour surge and $213.60 full-month peak, with currency and pricing NOT_VERIFIED.",
    "Show a real provider invoice or published region/date calculator as a separate later evidence source, covering tax/discounts/traffic measurement rather than calling the fictional training price live."
  ],
  "cost-allocation-unit-economics": [
    "Calculate monthly shared-resource cost per 10,000 successful user operations from the model and explain why failed/retried HTTP traffic must not enter the denominator.",
    "Define a real tenant/product allocation rule for gateway, storage, DB, egress and logs for the same observation period as billing."
  ],
  "cost-controls-budgets": [
    "Demonstrate the $160 synthetic budget crossing after the 48-hour burst and identify the approver, stop/go trigger and non-automatic nature of a budget notification.",
    "List at least five chargeable resources that survive stopping compute and the actual ownership/safe-teardown evidence required."
  ],
  "right-sizing": [
    "Compare synthetic two-replica baseline versus five-replica burst and determine how queue/backpressure and database connection limits could invalidate pure API horizontal scaling.",
    "Collect actual sample window, observed CPU/memory/latency percentiles and measured time at peak before adopting the synthetic scale and node-hour forecast."
  ],
  "managed-self-managed": [
    "Reproduce the fictional $35.40 VPS versus $131.40 managed cluster comparison, then include explicitly unverified 15h versus 4h operations labor and a $8–9/hour break-even threshold.",
    "Name the maintenance, backup, security and incident-response obligations that remain with Steward under the proposed managed service contract."
  ],
  "hybrid-tradeoffs": [
    "Specify a concrete experiment that disconnects the homelab while preserving a public Steward user request, and name which measured requests/metrics would falsify the architecture decision.",
    "Compare the same workload/budget/failure criteria for VPS, managed cluster and hybrid; preserve a migration trigger rather than assuming multi-cloud is inherently superior."
  ]
};
