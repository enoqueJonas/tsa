// Cloud Engineer module 1: deepen ORIGINAL six topics, do not add duplicated lessons.
// Prices in the executable practice are synthetic and real provider selection remains a learner task.
export type CloudDepthSection={heading:string;paragraphs:string[]};
export const cloudHostingMechanismSections:Record<string,CloudDepthSection[]> = {
  "on-prem-colocation-vps-cloud": [
    {
      "heading": "Begin with the isolation and ownership boundary, not a product label",
      "paragraphs": [
        "On-premises means the organization manages its own site and servers. Colocation moves owned hardware into somebody else's facility while leaving the hardware lifecycle with its owner. A VPS rents an isolated virtual machine on provider hardware; the provider operates the facility, hypervisor and underlying host, while the tenant administers the guest OS and applications. Managed cloud services transfer more of a particular service's operation, such as database engine patching, but do not transfer application correctness or data governance. Those definitions describe different responsibility boundaries, not ascending grades of quality.",
        "Walk through a power outage, a compromised SSH credential, a corrupted PostgreSQL database and a failed application release under each model. Ask who can diagnose, who can repair and who must still verify the recovery. A VPS provider may replace a failed physical host but cannot infer the correct Steward owner_name-to-owner_team_id mapping or decide whether rolling back the application will corrupt migrated data."
      ]
    },
    {
      "heading": "Draw the actual failure and control planes",
      "paragraphs": [
        "Divide one hosting design into physical site and network, guest compute/OS, persistence and backup copies, inbound access, artifact delivery and application/runtime behavior. For a single budget VPS, network reachability and geographic separation from the homelab improve, but the deployment is still a single-server failure domain; backups, patching, firewall rules, secrets and app correctness remain tenant duties. Moving an image to a remote host does not automatically deliver redundancy or disaster recovery.",
        "For an explicit comparison, classify a provider power interruption, accidental firewall lockout, lost signing credential and deleted application table by likelihood and impact. Define a control that can actually detect and mitigate each. A provider SLA is a contractual service expectation, not a measured guarantee that Steward's API, workers and database stay healthy."
      ]
    },
    {
      "heading": "Choose a hosting boundary from falsifiable constraints",
      "paragraphs": [
        "Write a requirements brief for traffic location, acceptable outage, storage and data-residency constraints, recovery objectives, administrative availability, spend ceiling and existing Delivery Engineer artifacts. Score homelab, colocated hardware, a VPS and an appropriately chosen managed design against the same constraints. If a requirement has no measured value, mark it assumption and design a lightweight test rather than invent an SLA or concurrency number.",
        "Reject at least one technically possible option using a specific constraint. State what observation would reverse the decision: sustained RAM pressure, measured recovery time above the agreed objective, recurring network outages or cloud cost above the ceiling. The selected model is a reversible engineering decision, not an identity or long-term commitment."
      ]
    }
  ],
  "iaas-paas-saas": [
    {
      "heading": "Locate the boundary at each layer of the service stack",
      "paragraphs": [
        "Start with the physical facility, hypervisor, guest OS, runtime, deployment system, application, identity, persistent data and user access. IaaS gives tenants configurable compute and network resources while they usually own guest OS patching and application orchestration. PaaS supplies a managed application runtime and can remove routine OS administration but imposes a platform-specific deployment and operational contract. SaaS supplies an application to users; the customer still owns user access choices, data handling obligations, integration configuration and business process controls.",
        "The labels are categories, not a universal contract. A database hosted as a managed service and a container running on a VPS can coexist in one architecture. Always read a service's actual service-level terms and feature set, rather than inferring 'automatic backup', 'zero downtime' or 'data encryption' from the words PaaS or SaaS."
      ]
    },
    {
      "heading": "Compare the same Steward failure under three service contracts",
      "paragraphs": [
        "Take a worker whose outbox-publisher process stops while the API continues to return 200 responses. Under IaaS, the team diagnoses and restarts its container and host dependencies. Under PaaS, the provider may restart an unhealthy container, but the team still must define an accurate worker health signal, recognize a stuck queue and recover failed messages. A hypothetical SaaS workflow may expose incidents through an administrative UI, yet the customer still verifies data correctness and incident completion.",
        "This example separates infrastructure availability from the end-to-end contract. A green managed-platform dashboard is no stronger evidence of successful outbox delivery than a green local Docker build. Verify client behavior and RabbitMQ lifecycle processing regardless of who operates the servers."
      ]
    },
    {
      "heading": "Reason about portability, constraints and the managed premium",
      "paragraphs": [
        "Portability depends on the artifact, networking, identity, state and operational interfaces. A container image may run on many IaaS VMs, but external managed databases, proprietary queues, region-specific IAM and provider metrics can create real migration work. A managed runtime may save patching and on-call effort while adding cost, quotas, cold starts or limits on privileged networking. These are trade-offs to measure, not automatic reasons to reject management.",
        "Build a responsibility matrix with owner, provider, evidence and recovery path for OS CVEs, TLS renewal, application version, PostgreSQL backup, secret rotation and user authorization. Require one observable test for each row. If the proposed PaaS cannot run all three Steward runtime roles, identify an alternate topology instead of silently deleting the worker."
      ]
    }
  ],
  "regions-zones-availability": [
    {
      "heading": "Distinguish geographic location, failure isolation and deployment count",
      "paragraphs": [
        "A region groups provider facilities in a geographic area and serves as a common placement/billing/residency boundary. An availability zone is usually a separately engineered failure domain within one region, with provider-specific isolation details. A physical building, a zone, a region and a logical VPC are not equivalent concepts. A single VPS in a region is still one compute instance; it does not become highly available because the region advertises multiple zones.",
        "Choose location with user latency, legal/data requirements, operational support, availability and total cost in mind. A multi-zone design adds network transfer, data replication, failover and application coordination. Before introducing it, define the failure mode the second zone addresses and how a real user request will behave when one instance or database writer disappears."
      ]
    },
    {
      "heading": "Explain latency and residency without pretending to measure them",
      "paragraphs": [
        "Round-trip network time depends on geographic distance, routing, congestion, peering and protocol handshakes. A host geographically closer to Maputo may not be faster if routes are poor; measuring from the actual user location and mobile network is better than using a region's advertised name. Data residency requires identifying backups, logs, support access and replicas, not only the VM's primary location.",
        "For a real provider shortlist, record the region and run repeatable latency and end-to-end HTTP timing measurements from at least two appropriate client networks. Separate DNS lookup, TCP establishment, TLS handshake, server processing and transfer time where tools permit. Mark unmeasured numbers unknown; do not present fabricated RTT or uptime."
      ]
    },
    {
      "heading": "Treat high availability as a tested application property",
      "paragraphs": [
        "A second VM might survive one host failure while still sharing an unavailable database, DNS record, load balancer or external registry. True availability requires a protected request path and state handling, not just multiple objects in an infrastructure diagram. For Steward, API instances, outbox publisher, lifecycle consumer, database and RabbitMQ have different safe replication and recovery requirements.",
        "Start with a single recoverable VPS if that meets the actual learning objective, retain off-host backups and a documented release path, then design a failure rehearsal before buying redundant infrastructure. A test should kill one chosen component in a disposable environment and observe which client or worker guarantee survives, which fails, and what recovery actually restores."
      ]
    }
  ],
  "shared-responsibility": [
    {
      "heading": "Use a control-to-owner table, not a security slogan",
      "paragraphs": [
        "Shared responsibility assigns distinct actors to infrastructure operation, guest administration, application changes, identity, data protection and incident response. On a VPS the provider normally maintains the physical host/hypervisor; the team controls the guest OS, SSH accounts, host firewall, deployment, Django settings, data access and the correctness of backup restoration. On a managed database, engine patching may become the provider's job while schema design, application credentials, backup policy and tested recovery remain tenant responsibilities.",
        "A control can involve two accountable parties without being ambiguous. For example, the provider may offer encrypted storage while the tenant controls access to backups and decides what is retained. Record provider feature, tenant configuration, how to observe both, and the consequence of each failing. Do not treat provider marketing as evidence that the chosen feature is enabled."
      ]
    },
    {
      "heading": "Test an administrative lockout and a data-loss scenario separately",
      "paragraphs": [
        "Loss of SSH may require out-of-band provider console access even when the VPS disk and application are intact. A corrupt PostgreSQL table requires a suitable independent backup or point-in-time recovery strategy; an interactive console alone cannot reconstruct data. Conversely, a snapshot may preserve the broken SSH configuration and perpetuate the lockout. Each recovery mechanism protects a different asset.",
        "Before disabling password authentication or restrictive firewall access, verify a working key-based second session and provider rescue route. Before relying on an automated backup, perform a restore of a nonproduction copy and compare a deterministic query/checksum. Label provider console availability and data-recovery outcome separately; neither proves the other."
      ]
    },
    {
      "heading": "Include every component in the responsibility ledger",
      "paragraphs": [
        "Steward comprises more than an HTTP API: a persistent PostgreSQL database, RabbitMQ, API, outbox publisher and lifecycle consumer may share the same VM while requiring distinct operational checks. Identify who patches each component, rotates credentials, recovers state, monitors failures, approves release, and validates user-level behavior after recovery.",
        "If a component has no owner, failure signal or recovery procedure, the shared-responsibility design is incomplete even if the host can boot. Link each assignment to a real command, runbook, versioned configuration or provider contract that another engineer can locate without consulting the original operator."
      ]
    }
  ],
  "elasticity-consumption": [
    {
      "heading": "Define capacity, scalability and elasticity as different claims",
      "paragraphs": [
        "Capacity is the work a configured system can sustain at a chosen service-quality threshold. Vertical scaling gives a workload more CPU, RAM or I/O on the same logical host. Horizontal scaling adds replicas or workers, but only helps when request routing, shared state and work ownership permit safe parallel processing. Elasticity changes resource allocation in response to demand; it can scale up and down automatically or through disciplined operations. A system that can be resized manually is scalable but not necessarily elastic.",
        "More replicas do not guarantee throughput. The Steward API may benefit from additional stateless instances while a single PostgreSQL database remains the bottleneck. Multiplying lifecycle consumers may cause duplicate side effects unless queue acknowledgements, idempotency and concurrency controls are correct. Compare observed throughput, latency and error rates before and after a change rather than equating replica count with capacity."
      ]
    },
    {
      "heading": "Work from a service-level limit to a scaling decision",
      "paragraphs": [
        "Suppose a small service processes requests acceptably at 15 per second but breaches its observed p95 latency objective at 25 per second. First test whether CPU saturation, database locks, network transfer or external dependency latency explains the difference. If the database is saturated, increasing API replicas may amplify load without improving user latency. A load test should record concurrent users, request mix, p95, errors, CPU, memory and database pressure together.",
        "Do not lift these illustrative throughput numbers into the actual Steward baseline. Establish a load-test environment and repeatable workload. If traffic is variable, compare the measured resource/cost implications of a larger fixed instance, scheduled resize and autoscaling. Every additional layer has monitoring, failure and recovery costs."
      ]
    },
    {
      "heading": "Show how idle allocation and burst usage drive different bills",
      "paragraphs": [
        "Compute allocation, storage and public IPv4 can remain billable when application traffic is zero, while network egress or request-based services grow with activity. An always-on database can dominate the bill even when a worker is idle. This distinction is why resource teardown, reserved capacity, variable transfer and managed service premiums need separate model inputs.",
        "The executable synthetic cost model in the next Cloud Cost Awareness reading tests a quiet month and a transfer burst under identical fixed resources. It demonstrates the mechanism, not provider prices or actual bandwidth needs. A real elasticity decision also needs measured capacity and scaling response under load; a static spreadsheet cannot prove it."
      ]
    }
  ],
  "cloud-cost-awareness": [
    {
      "heading": "Break the invoice into units and ownership decisions",
      "paragraphs": [
        "Before pricing a remote Steward environment, list which resources exist throughout the month: VM hours or monthly allocation, public IPv4 addresses, persistent storage, snapshots, managed database, load balancer, DNS, outgoing traffic and log retention. Some providers charge for an allocated resource even when idle, and some bundle transfer or backups; read the relevant plan's conditions. A cost model needs units, periods, included quotas and the owner who will remove a resource after experiments.",
        "Label each assumption as a provider quote with an observation date or a synthetic scenario. A price remembered from an article is not a budget. If bandwidth is listed in GB while a benchmark uses GiB, normalize units before multiplying; account for billing currency, taxes and exchange rate separately rather than hiding them in a single 'monthly total'."
      ]
    },
    {
      "heading": "Run a reproducible quiet-month versus traffic-spike estimate",
      "paragraphs": [
        "The Python example below uses only the standard library, Decimal arithmetic and deliberately fictional US-dollar rates. It itemizes compute, IPv4, disk, backups and egress. It proves a synthetic $16.05 baseline, a $14.25 quiet month whose idle resources still cost money, and a $36.75 transfer burst that exceeds a declared $30 budget. It also compares a fictional managed option costing $28 more. None of these are current quotes for any provider or verified Steward workload requirements.",
        "Run python3 and inspect all five HOSTING_* output markers. Change one billed item at a time and predict which assertion should fail: omit IPv4, mark snapshots free, increase included egress or remove the managed premium. The exercise is useful only if the learner can show the model's inputs, correctly explain the changed output and distinguish the decision from real provider selection."
      ]
    },
    {
      "heading": "Convert the budget estimate into an admission decision",
      "paragraphs": [
        "A defensible decision requires at least a baseline and a stress scenario, an operating ceiling, a unit owner, a verification date and a teardown trigger. For example, if the observed spend is higher than the budget, first inspect unneeded allocated resources and actual transfer rather than immediately deleting persistent storage. If the true usage differs from the assumptions, update the model instead of asserting the provider is wrong.",
        "The original hosting-comparison lab should use two actual provider quotes gathered by the learner, not copy the synthetic prices above. Include region, billing cycle, tax and backup/rescue assumptions, and explain why the chosen plan meets the observed deployment and recovery needs. A cheap plan that cannot independently restore the database may be the more expensive engineering choice."
      ]
    }
  ]
};
export const cloudHostingAppliedPractices:Record<string,string[]> = {
  "on-prem-colocation-vps-cloud": [
    "Produce a four-option failure/owner table: power loss, stolen SSH key, corrupted PostgreSQL, broken application release. Name the correct recovery owner and verification signal for each option.",
    "Declare one measurable condition that would reverse your hosting choice. Do not treat a VPS as highly available because its provider has several zones."
  ],
  "iaas-paas-saas": [
    "For an API success but failed RabbitMQ lifecycle consumer, identify who repairs host/process/queue under IaaS and PaaS; show the observable end-to-end evidence a provider dashboard cannot supply.",
    "Build a layer-by-layer provider/tenant control matrix covering OS, runtime, backup, credentials, artifact publication and data correctness; mark unknown contracts explicitly."
  ],
  "regions-zones-availability": [
    "Choose a real candidate region and explain its legal/latency/availability assumptions without inventing numbers; plan timings from client networks.",
    "Draw single-VPS and two-zone failure domains and identify which shared database or network dependency still prevents a client request after a zone loss."
  ],
  "shared-responsibility": [
    "For SSH lockout and PostgreSQL corruption, give different recovery paths, proofs and responsible actors. A snapshot is not a substitute for either a console or a verified DB restore.",
    "Assign named owners to API, publisher, consumer, RabbitMQ and PostgreSQL health, patching and recovery; include how another engineer would observe outcomes."
  ],
  "elasticity-consumption": [
    "Provide two workload curves (steady vs bursty) and distinguish capacity, vertical scale, horizontal scale and elasticity; identify the one bottleneck that makes extra API replicas ineffective.",
    "Define a real load test (request mix, concurrency, p95, error rate, DB pressure), then identify which measured threshold would justify a resize or replica increase. Do not present the fictional throughput example as measured Steward performance."
  ],
  "cloud-cost-awareness": [
    "Execute the exact Python program from the reading, preserve its five HOSTING_* markers and explain the fixed-versus-variable itemization. Introduce a wrong omitted IPv4 or free-backup assumption in a disposable copy and prove expected arithmetic changes.",
    "Replace synthetic prices with two current, dated provider quotes and one 3x traffic scenario. Include backups, public IPv4, egress, managed-service surcharge, budget threshold and teardown actions. Mark unknown fees as unknown rather than zero."
  ]
};
