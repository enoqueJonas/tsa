// Cloud Engineer canonical module 1; no new progress IDs, no fictional provider account.
// Each original topic gains specific definition, causal mechanism, failure and transfer.
export type CloudHostingDepthSection={heading:string;paragraphs:string[];code?:{language:string;caption:string;codeKey:string}};
export const cloudHostingDepth:Record<string,CloudHostingDepthSection[]> = {
  "on-prem-colocation-vps-cloud": [
    {
      "heading": "Four boundaries: capital ownership, virtualization, platform and application",
      "paragraphs": [
        "On premises, your organization procures server hardware, power/cooling, physical access, storage, network uplinks and break/fix service. Colocation delegates building and facility services but commonly leaves owned hardware and its firmware/software to you. A VPS rents a virtual machine: the provider operates the physical host/hypervisor; you still control and patch the guest OS, the containers, the application and much of network policy. A public cloud platform is not a mutually exclusive synonym for VPS: it adds API-provisioned compute/network/storage and may include VPS-like virtual machines and managed services.",
        "A useful comparison must identify *which party can fix a failed layer*. If a physical disk fails on your homelab, your operator replaces it; if a VPS hypervisor fails, you open a provider incident and may redeploy elsewhere; if an application migration corrupts rows, neither provider replaces the business data for you. Compare authority, failure domains, support response, and recovery evidence before making a decision."
      ]
    },
    {
      "heading": "Trace a Steward API request through each hosting choice",
      "paragraphs": [
        "For an on-prem service, an external request may traverse ISP, router/firewall, reverse proxy, Steward container and a local database. A VPS changes the provider address/routing and the physical machine administrator, not the application behavior, API authentication or immutable release digest. A more managed design may replace the database host with a database service while leaving the container release and private connectivity under customer control.",
        "Draw separate lines for control plane (who provisions), data plane (where user requests and package bytes travel), persistence (where restore points live) and management plane (how engineers administer). A 'cloud' badge does not prove TLS, private database access, acceptable latency or recoverability; require observed paths and explicit ownership."
      ]
    },
    {
      "heading": "Choose a solution by requirements, not prestige",
      "paragraphs": [
        "Write a measurable requirement before comparing: for example, a public HTTPS endpoint reachable from an external network and recoverable after a lost VM, subject to a monthly spending limit. Reject options that cannot meet the minimum capacity or recovery controls even if their advertised price is lowest. Consider the administrative burden of remote hardware and the expected blast radius of one region or host.",
        "A future scale trigger might be p95 latency above a threshold under representative traffic, persistent memory pressure, or a restoration objective that a single VM cannot meet. The next action is not 'migrate to Kubernetes' by default; it is to validate which constraint changed and which simpler changes could solve it."
      ]
    }
  ],
  "iaas-paas-saas": [
    {
      "heading": "Place the service and data at concrete responsibility boundaries",
      "paragraphs": [
        "IaaS delegates physical infrastructure and virtualization but leaves guest OS hardening, runtime, application, database installation (if self-hosted), IAM configuration and backups with the operator. PaaS typically operates more of the runtime, scheduling or engine lifecycle; you still own application code, access rules, data semantics, release policy and the contractual availability objective. SaaS provides a finished application but leaves customers responsible for user provisioning, integration permissions and appropriate data use.",
        "A managed database can patch its engine and create provider snapshots without knowing whether your application schema is valid or whether you can recover after accidental deletion. Responsibility may be shared: provider produces a backup; customer configures retention and independently restores a snapshot to a test instance. Avoid a false all-or-nothing matrix that declares 'provider responsible' for a layer without identifying which specific operation."
      ]
    },
    {
      "heading": "Run a provider/customer ownership check with a failing counterexample",
      "paragraphs": [
        "The following runnable program defines a small IaaS and managed-database matrix for four technical responsibilities. It requires application access policy to remain customer-owned in both and explicit customer restore validation even when managed database backups exist. Removing that validation fails admission. This models contract reasoning with fictional services, not any actual cloud vendor's SLA or product defaults.",
        "Execute with Python 3 and record both CLOUD_SHARED_RESPONSIBILITY_CUSTOMER_STILL_OWNS_IDENTITY_AND_RECOVERY and CLOUD_MANAGED_BACKUP_WITHOUT_CUSTOMER_RESTORE_TEST_REJECTED. Then create your own role matrix for Steward's Linux host, database, TLS, DNS, incident response and account billing. For each row include a contact and an observable test, not only the names of two parties."
      ],
      "code": {
        "language": "python",
        "caption": "Execute explicit IaaS vs managed-database responsibility gates",
        "codeKey": "responsibility"
      }
    },
    {
      "heading": "Evaluate managed convenience against loss of control",
      "paragraphs": [
        "Managing PostgreSQL on a VPS lets you choose extensions, version, tuning and backup tooling but requires monitoring, patch scheduling and restore drills. A managed PostgreSQL service can reduce server maintenance but introduces vendor-specific roles, network policies, pricing, supported extension constraints and independent maintenance windows. Managed does not mean no performance diagnosis; it moves some knobs to a support interface.",
        "For one workload, compare operating toil and incident ownership under both designs. If a feature requires custom server extensions or very low latency between worker and DB, verify whether the PaaS option supports it before assuming the migration is an improvement. The correct boundary is the one you can explain and test."
      ]
    }
  ],
  "regions-zones-availability": [
    {
      "heading": "Distinguish geography, isolation and guaranteed behavior",
      "paragraphs": [
        "A region is a provider-defined geographic deployment area; a zone is a provider-defined isolation boundary within a region, often with separate power/network fault domains. The exact independence guarantees vary by provider and product. Two VM instances in the same zone do not protect against zone loss. Two zones do not protect against a shared region-wide identity, routing, control-plane or application bug.",
        "Availability zones reduce particular correlated hardware/facility failures only if the service routes requests to surviving instances and persistent state remains accessible. A region label is not a latency or legal-residency guarantee. Measure real round-trip latency to users and investigate data routing, backup locations and support constraints separately."
      ]
    },
    {
      "heading": "Quantify downtime and define the objective before buying redundancy",
      "paragraphs": [
        "A 99.9% uptime objective over a 30-day month permits 0.1% of 43,200 minutes, or 43.2 minutes of downtime. This is a numerical budget, not a claim that any chosen VPS or provider will achieve it. Actual service availability includes application bugs, DB dependency, DNS, TLS and deployment mistakes; provider instance uptime is only one layer.",
        "Run the local cost exercise's downtime calculation and explain the difference between an SLO you choose, an SLA a provider contract offers, RTO (time to restore after an incident) and RPO (amount of data potentially lost). Do not multiply independent failure probabilities across zones without evidence that their failure domains and shared dependencies are independent."
      ]
    },
    {
      "heading": "Plan a one-host failure before escalating to multi-zone",
      "paragraphs": [
        "A single remote Steward instance may be a defensible learning and limited-service stage if you explicitly accept its downtime budget and have off-host backups, a rebuild procedure and health checks. Prove replacement capacity can be provisioned in the intended region, secrets can be restored safely, and the prior image digest remains available to a new host.",
        "If multiple zones become justified, enumerate changes needed: load balancer health checks, distributed or replicated database, consistency/leader behavior, replicated secrets and network links. Duplicating only the API container while leaving a sole database node in one zone does not deliver multi-zone availability."
      ]
    }
  ],
  "shared-responsibility": [
    {
      "heading": "Break down ownership by operation, not provider marketing category",
      "paragraphs": [
        "In the shared-responsibility model, a provider operates parts of its infrastructure and service while the customer operates identity, configured access, application logic and the use of data. The split changes per service type and contract. 'Encryption' for example can mean the provider encrypts storage media, while the customer still manages application keys, secret exposure, user permissions and accidental data disclosure.",
        "Use an operation-level matrix: 'patch hypervisor' (provider), 'patch guest OS' (customer on VPS), 'allow SQL connections only from backend' (customer), 'restore yesterday's snapshot in a clean environment' (shared operation). Test one negative path for each critical customer action: denied cross-team mutation, no public DB listener, and a restore that yields the expected data state."
      ]
    },
    {
      "heading": "Prove backup operation is not the same as recoverability",
      "paragraphs": [
        "A managed backup schedule may successfully produce snapshots while retention is too short, permissions block restore, or the application schema is corrupted in the saved snapshot. The executable Python matrix treats the provider's backup action and the customer's restore validation as separate booleans; it deliberately rejects a configuration that delegates restore evidence entirely to the provider.",
        "Run the responsibility program here and identify what evidence the Cloud Engineer needs from Delivery: immutable OCI digest, CI run, database schema migration state, actual off-host snapshot and representative test data. A screenshot of 'backup enabled' does not satisfy a recovery objective."
      ],
      "code": {
        "language": "python",
        "caption": "Execute explicit IaaS vs managed-database responsibility gates",
        "codeKey": "responsibility"
      }
    },
    {
      "heading": "Write an operational handoff between provider and customer",
      "paragraphs": [
        "For incidents, document the provider escalation path and the customer-owned first response. If DNS resolves but port 443 cannot be reached, the team must distinguish provider routing, cloud firewall, Linux listener and application/proxy behavior before calling provider support. If data is missing but HTTPS returns 200, the customer investigates application transactions, deployment events and recoverable snapshots.",
        "The boundary changes over time as services become managed. Revalidate the matrix for any newly introduced managed database, load balancer, object store or identity provider. A stale responsibility document can be worse than none when it causes a team to assume another party has already tested recovery."
      ]
    }
  ],
  "elasticity-consumption": [
    {
      "heading": "Separate elasticity, vertical scale, horizontal scale and throughput",
      "paragraphs": [
        "Vertical scaling changes capacity of an individual instance (e.g., CPU or RAM) and may require restart and single-host interruption. Horizontal scaling adds instances and requires request routing, shared session handling, queue/worker concurrency and safe database connections. Elasticity is the ability to adjust resources in response to changing demand; autoscaling is an implementation mechanism, not a guarantee that stateful services scale safely.",
        "If the API handles 100 requests/second in a benchmark, two replicas will not necessarily handle 200: a single database, connection pool or worker queue may become the bottleneck. Separate latency, request throughput, concurrency, CPU utilization, memory use and error rate. Scaling the front end may expose a backend limit that was hidden before."
      ]
    },
    {
      "heading": "Distinguish metered resources and capacity reservations",
      "paragraphs": [
        "Compute may be billed per hour or per second with a minimum granularity; IPv4, block storage, backups, transferred bytes, load balancers and database I/O may be billed independently. Some providers charge for allocated storage even when the application is idle. Auto-scaling without billing limits can turn a runaway retry storm into a large bill instead of a recovered service.",
        "Before deploying, write a resource inventory and upper-bound assumptions. Identify which spend is fixed (reserved VM) and which may grow with requests, storage or egress. Set alerts appropriate to the account and avoid declaring a cost ceiling unless the provider actually enforces a hard limit."
      ]
    },
    {
      "heading": "Measure demand before suggesting a scale trigger",
      "paragraphs": [
        "Record baseline CPU, memory, p95 latency, network throughput, DB connections and worker lag under a known request mix. Increase one dimension in a controlled nonproduction load test, observe the first saturation point, and define a reversible capacity adjustment. Pair each scale change with a rollback/verification plan so an unsuccessful resize does not become silent downtime.",
        "A scale rule based only on CPU can miss database lock contention or high error rates. In an API+outbox+consumer system, publish and consume lag are separate workloads from HTTP traffic; ensure additional workers do not violate event idempotency or overwhelm the database."
      ]
    }
  ],
  "cloud-cost-awareness": [
    {
      "heading": "Build a total monthly cost estimate from independent billable dimensions",
      "paragraphs": [
        "A VPS headline price omits potentially separate public IPv4, allocated block storage, snapshot/backup retention, bandwidth overage, tax, conversion fees and optionally a managed database. Use explicit units, not guesses: USD per VM-month, per GB-month, per IP-month, per GiB of egress, and contracted backup policy. Record prices and the date/provider separately when using real quotations.",
        "The provided local example uses entirely fabricated training prices to illustrate a baseline VPS at 8+2+3+1=14 USD/month and a more-managed option at 37 USD/month. It is deliberately **not** a verified current quote. The code rejects a cheaper 4 USD VPS that lacks memory and independent restore, showing why lowest sticker price cannot be the selection rule."
      ]
    },
    {
      "heading": "Run a constraint-gated cost and sensitivity model",
      "paragraphs": [
        "The copyable Python program computes totals using Decimal and checks minimum memory, independent restore and a 20 USD fictional limit. It also derives the 43.2-minute 99.9% monthly downtime allowance, then raises compute costs to 18 USD and verifies the previous recommendation is no longer eligible. No real cloud account, payment or pricing API is accessed.",
        "Run it and capture four CLOUD_* markers. Change the fictional backup cost or monthly budget and predict which option would be selected; explain why a provider's current rate cannot be inferred from this exercise. A quote taken in a different region or date must be revalidated before creating infrastructure."
      ],
      "code": {
        "language": "python",
        "caption": "Execute fictional provider cost and 99.9% downtime decision",
        "codeKey": "cost"
      }
    },
    {
      "heading": "Stress-test the cost model with shocks and non-price limits",
      "paragraphs": [
        "Model a month with unexpected log growth, failed-job retries, backup retention doubling and extra egress. Keep growth variables explicit rather than burying them in a single contingency percentage. A monthly estimate must also state the recovery objective: dropping backups to fit the budget may make the design unfit even if arithmetic is correct.",
        "Use scenario labels baseline, high traffic and outage/rebuild. Choose one candidate only if it meets minimum operational constraints in all required scenarios; otherwise downgrade service promises or raise budget before provisioning. An attractive total without a viable restore route is not a credible engineering decision."
      ]
    }
  ]
};
export const cloudHostingPracticeDepth:Record<string,string[]> = {
  "on-prem-colocation-vps-cloud": [
    "Draw the four hosting paths with compute owner, external entry, persistence, management access and recovery authority; explain one failure in each.",
    "Choose one concrete Steward external-access requirement and identify which option meets it without inventing unavailable provider services."
  ],
  "iaas-paas-saas": [
    "Use the shared-responsibility executable matrix as a prerequisite and compare specific OS, database, IAM, DNS and backup operations under IaaS and PaaS.",
    "Give two actions that remain customer-owned even with managed services; propose observable negative checks for them."
  ],
  "regions-zones-availability": [
    "Calculate a 30-day 99.9% downtime budget and separate it from actual provider SLA, RTO and RPO.",
    "Draw a two-zone API architecture and circle every still-shared database, DNS or identity dependency that can fail both zones."
  ],
  "shared-responsibility": [
    "Run the exact Python ownership-matrix program and mutate the managed-backup customer restore requirement to see the admission fail.",
    "Produce a reviewed owner/contact/evidence matrix for Steward's guest OS, database, access policy, DNS, TLS and restore."
  ],
  "elasticity-consumption": [
    "Define CPU, p95 latency, memory, DB connections and consumer lag as distinct metrics, with one measurable scale trigger for each.",
    "Describe why doubling HTTP replicas may not double throughput when the database or outbox queue is the bottleneck."
  ],
  "cloud-cost-awareness": [
    "Run the provided fabricated USD cost proof, show four markers, change backup/IPv4 assumptions and recompute.",
    "Compare two current real providers using dated quotations only after checking region, backups, IPv4, egress, OS support and full restore requirements."
  ]
};
