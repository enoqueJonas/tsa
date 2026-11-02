// PED-005 Cloud architecture and cost: measurable worked models, explicitly
// fictional unit costs, and independent failure/transfer questions.
export type CloudCostSection = { heading:string; paragraphs:string[]; code?:{language:string;caption?:string;code:string} };
export const architectureDepthById: Record<string,CloudCostSection[]> = {
  "availability": [
    {
      "heading": "Convert a target into an operational error budget",
      "paragraphs": [
        "Availability is the observed proportion of time that a user can perform the required operation, over a declared measurement window. An uptime dashboard of a VM is not a measure of successful HTTPS API requests. For a hypothetical 730-hour month, 99.9% means 0.1% nonavailability (43.8 minutes); if the database fails for two hours the compute layer cannot make up that deficit merely by running two pods. Model the complete path: public DNS, provider route, TLS/gateway, API, PostgreSQL, credentials and required dependencies. A component's SLA is not the full user-facing service SLO.",
        "A planned maintenance period is not automatically excluded from a published availability promise; the contract must define measurement scope and permitted exclusions. For Steward, choose one user-visible representative operation (e.g. authorized GET or a safe read-only request), verify both HTTP semantics and end-to-end latency, then measure actual failures."
      ],
      "code": {
        "language": "python",
        "caption": "Local availability arithmetic; not observed Steward uptime",
        "code": "# Availability arithmetic on a hypothetical 730-hour month.\nhours = 730\nfor availability in (0.99,0.999,0.9999):\n    minutes_unavailable = hours * 60 * (1-availability)\n    print(f\"{availability*100:.2f}% allows {minutes_unavailable:.2f} minutes/month\")\n# This is a budget of non-availability, not a guarantee of real SLO attainment."
      }
    },
    {
      "heading": "Transfer: where extra replicas do nothing",
      "paragraphs": [
        "Draw a failure tree where two API Pods share one database, one DNS record and the same availability zone. A second Pod may tolerate one process crash, but not database loss, shared incorrect credentials or a zone-wide power outage. State one error-budget-consuming failure and the precise independent synthetic or application metric that would detect it."
      ]
    }
  ],
  "backup-recovery": [
    {
      "heading": "A service restore must preserve consistency and prove a consumer path",
      "paragraphs": [
        "A database point-in-time restore is more than copying a file. Define RPO, RTO, compatible application schema/digest, required secrets, order of bringing dependencies up, and what to do with queued/outbox events from the restoration interval. With a 15-minute RPO, a once-daily snapshot would not usually meet the target; continuous log archival plus periodic backups can provide finer recovery points if its integrity and retention are proven. RTO includes locating backups, provisioning capacity, restoring bytes, applying WAL, starting services and verifying authorized user operations.",
        "An isolated restore must not overwrite the live application. Measure elapsed recovery time from incident decision to externally confirmed service function, and compare recovered data against planted synthetic records. After the restore, confirm exactly-once-looking external side effects are not asserted merely because the database is consistent; replayed messages and idempotency must be audited separately."
      ]
    },
    {
      "heading": "Transfer: two backups with different failure domains",
      "paragraphs": [
        "Backup A exists on the same VPS attached volume as production. Backup B is off-site with separate read/retention permissions but was never restored. Which risks does each reduce? Design a third tested option with time, identity, encryption-key custody and retention evidence. Explain what you can and cannot conclude from an object-storage 200 response versus a successful SQL data restore."
      ]
    }
  ],
  "failure-domains": [
    {
      "heading": "Correlated failure defeats nominal replica count",
      "paragraphs": [
        "A failure domain is a boundary within which one event can affect multiple components: process, VM, host, zone, region, DNS provider, credentials, software release or data contract. Two replicas deployed with the same invalid API token can fail together even in different regions; two zones sharing one primary database have a common dependency. Identify common-mode changes such as a bad GitOps commit or broad IAM revoke as well as physical location boundaries.",
        "Redundancy reduces risk only if its independent parts can serve the user through a failure. A standby database that cannot accept writes, an untested failover DNS path, or a second VM behind one misconfigured gateway may not improve the application SLO."
      ]
    },
    {
      "heading": "Transfer: choose a realistic next fault",
      "paragraphs": [
        "For a single budget VPS, choose the smallest worthwhile recovery improvement before proposing multi-region active/active. Compare tested off-site backup/restore, independent monitoring and separate database placement. What failure does each address, what new dependencies does it introduce, and which failure does the proposed fix *not* cover? Do not claim region separation from two virtual hosts without evidence of their placement."
      ]
    }
  ],
  "cost-estimation": [
    {
      "heading": "Make a complete bill of units instead of citing one VM sticker price",
      "paragraphs": [
        "A cloud bill adds resource-hours or reservation charges, storage capacity over time, snapshots, public address, outbound transfer, managed requests and observability/log retention. Below is a **purely illustrative** Python calculation with invented USD unit prices—not current AWS/Azure/VPS offers and not a quote. It shows why a headline $0.025/hour compute price does not equal the whole month. Distinguish backup GB-month from transfer GB and fixed allocated IP/month. Replace each unit cost with the actual provider region's published SKU and compare the same usage window before making a real financial decision.",
        "Failure case: a training VM was stopped, but the block volume, snapshot and reserved IP remain billable. A cost model must include resources that survive stop/delete operations, teardown ownership and an actual invoice check after a controlled trial."
      ],
      "code": {
        "language": "python",
        "caption": "Local transparent cost model with explicitly fictional prices",
        "code": "# Hypothetical training prices in USD, NOT a provider quote.\nhours = 730\nvm_usd_per_hour = 0.025\nbackup_gib = 30\nbackup_usd_per_gib_month = 0.06\negress_gib = 80\negress_usd_per_gib = 0.09\nipv4_usd_month = 3.60\ncompute = hours * vm_usd_per_hour\nbackup = backup_gib * backup_usd_per_gib_month\negress = egress_gib * egress_usd_per_gib\ntotal = compute + backup + egress + ipv4_usd_month\nprint(f\"compute={compute:.2f}; backup={backup:.2f}; egress={egress:.2f}; ipv4={ipv4_usd_month:.2f}; total={total:.2f}\")\nassert round(total,2) == 30.85\n# If outbound traffic doubles, monthly cost does not merely double.\ndouble_egress_total = compute + backup + 2 * egress + ipv4_usd_month\nprint(f\"double-egress total={double_egress_total:.2f}\")\nassert round(double_egress_total,2) == 38.05"
      }
    },
    {
      "heading": "Independent transfer: test sensitivity, not one total",
      "paragraphs": [
        "Compute the monthly cost when egress doubles but compute does not change. If a managed database removes two monthly operator-hours but costs $40 more, write the decision in cost plus operational-risk terms; do not assign invented labor savings as proven. Explain what budget alerts can detect and why a warning is not a hard spending cap when resources are already running."
      ]
    }
  ],
  "cost-controls-budgets": [
    {
      "heading": "Budget management is an ownership workflow",
      "paragraphs": [
        "A budget threshold should specify billing account/project, currency, period, expected spend, owner, alert delivery, approver and action. A provider budget alert can be delayed; it normally notifies rather than stopping already-created resources. Preventive controls may include quotas, policy-as-code and restricted IAM creation rights, but quotas do not eliminate all usage-based billing or compromised credentials. For a disposable Steward experiment, list exact teardown targets: VM, attached volume, snapshot, reserved public IP, DNS record, load balancer, managed DB and orphaned logs."
      ]
    },
    {
      "heading": "Failure and transfer: the idle cost case",
      "paragraphs": [
        "At the end of a lab the compute VM is terminated but the static IPv4, snapshot and 50GiB volume remain. Define a daily audit query/checklist that exposes these orphaned costs and a rule for retaining evidence without retaining expensive resources. An unknown resource must be investigated before deletion; 'delete everything' can destroy a shared operational dependency."
      ]
    }
  ],
  "right-sizing": [
    {
      "heading": "Use percentiles and saturation, not just average CPU",
      "paragraphs": [
        "Low average CPU and high p99 latency can coexist when request bursts saturate a database pool or lock. A CPU resize will not cure waiting on PostgreSQL. Use demand shape, utilization, throttling, memory pressure, storage latency and application queue time to decide which resource is the bottleneck. Right-sizing can be vertically scaling up, moving to smaller compute, improving queries or avoiding extra managed services entirely."
      ]
    },
    {
      "heading": "Failure and transfer: observe before and after",
      "paragraphs": [
        "Suppose average CPU is 35%, p99 latency doubles during a batch job and database active sessions reach the pool limit. Before ordering a bigger VM, compare queries, lock waits and pool wait times under representative traffic. Propose one reversible improvement, a rollback condition and a post-change business-level check. Explain why a cheap smaller VM that causes frequent OOM or slow restore is not necessarily lower total cost."
      ]
    }
  ]
};
