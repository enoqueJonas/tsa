// Original Cloud Building Blocks source enrichments. Each topic explains a distinct
// technical mechanism, testable example and failure boundary instead of a glossary.
export type CloudBuildingSection = { heading:string; paragraphs:string[]; list?:string[]; code?:{language:string;caption?:string;code:string} };
export const buildingBlockDepthById: Record<string,CloudBuildingSection[]> = {
  "compute": [
    {
      "heading": "Worked capacity decision: requests, service time and queueing",
      "paragraphs": [
        "A VM's vCPU count is not the number of simultaneous requests an API can finish. CPU-intensive code competes for processor time; I/O-bound requests can occupy connections or worker slots while waiting for PostgreSQL. Consider a fixed test workload: 20 arrival requests per second and average service latency 0.2 seconds. Little's Law suggests roughly four requests in progress under stable conditions (L = λW). That is an average, not a required number of CPU cores, and a queue forms if sustained arrival rate exceeds the bottleneck's service capacity. Measure service latency, CPU saturation, memory working set, DB pool waits and p95/p99 duration before purchasing capacity."
      ],
      "list": [
        "VM choice: host patching, process supervision and recovery remain with the learner.",
        "Managed container platform: fewer host operations but new quotas, networking, runtime and platform failure boundaries.",
        "Functions/serverless: execution-duration, cold-start, billing and state limitations may make a persistent API a poor fit."
      ]
    },
    {
      "heading": "Failure and transfer: replicas do not replicate durable state",
      "paragraphs": [
        "If Steward's API gains a second instance but both use one local SQLite file or one unrecoverable PostgreSQL host, compute is not independently replaceable. The exercise is to trace one real API request through the worker pool, database connection pool and storage before predicting whether adding vCPUs helps. Given high DB wait time, low CPU and saturated DB connections, adding CPU is not an evidenced improvement. Define the metric that would falsify your chosen intervention."
      ]
    }
  ],
  "object-storage": [
    {
      "heading": "Worked request and integrity boundary",
      "paragraphs": [
        "An object store receives an API operation such as PUT Object(bucket, key, bytes, metadata) and returns a response. A later GET must use the intended key, authorization and any specific version ID. Example: a Steward export named report.pdf generated twice should NOT automatically overwrite the earlier evidence. Use an immutable key such as reports/<export-id>/<timestamp>.pdf and store metadata (object key, content length, SHA-256, uploader identity, authorized owner, retention policy) in PostgreSQL. The database record is authoritative for who may request the blob; an object key is not an access-control token. A presigned URL, if introduced, is a short-lived bearer capability and must not appear in public logs."
      ]
    },
    {
      "heading": "Failure and transfer: durability, availability, deletion and backup differ",
      "paragraphs": [
        "A provider's multi-replica object durability does not establish that an authorized but mistaken delete can be rolled back, that an inaccessible bucket remains available or that the exported content is semantically correct. Compare server-side encryption, bucket versioning, lifecycle expiry, an offline backup and per-object authorization: each solves a different failure. Show how an ETag from a multipart upload can differ from a simple MD5; choose a separately computed SHA-256 when checking bytes. The later Object Storage implementation path must verify the actual store rather than assuming all S3-compatible implementations have identical guarantees."
      ]
    }
  ],
  "block-storage": [
    {
      "heading": "Follow a block volume from allocation to actual bytes",
      "paragraphs": [
        "A cloud block volume exposes addressable blocks to an OS; the learner still needs a filesystem, mount, permissions, backup mechanism and application-consistent write policy. Example: a PostgreSQL data volume is attached to VPS A. If the VM is rebuilt, the volume might be reattached to VPS B only if the provider permits the specific zone/attachment model. The volume does not independently run PostgreSQL, guarantee fsync durability or prevent corruption. Multi-attach support is not automatically safe for an ordinary filesystem; concurrent mount without suitable coordination risks corruption."
      ]
    },
    {
      "heading": "Failure and transfer: detach is not restore",
      "paragraphs": [
        "A VM replacement succeeds and the same volume mounts, but the database will not start because its write-ahead log is inconsistent. Distinguish storage survival, crash recovery and independently tested point-in-time restore. Compare block volumes with object stores for a generated static report and live PostgreSQL data files; one is random-access filesystem state and the other is named whole objects. Record availability-zone attachment constraints, sustained IOPS and snapshot consistency before calling a volume resilient."
      ]
    }
  ],
  "managed-databases": [
    {
      "heading": "A managed failover is still a distributed application event",
      "paragraphs": [
        "A managed PostgreSQL service may patch servers, provision replicas and restart or fail over the engine. Steward still owns the schema, transaction boundary, query performance, connection pooling and retry safety. During failover, established TCP connections can break, in-flight transactions may need a definitive outcome check, and an endpoint can temporarily resolve to a different host. A client must reconnect safely; blindly retrying an already-committed payment or publication can duplicate an external effect. Use idempotency keys, transaction outcome reconciliation and bounded retries according to the operation's semantics."
      ]
    },
    {
      "heading": "Failure and transfer: backup promise versus restore objective",
      "paragraphs": [
        "Suppose the provider reports automated backups enabled, but Steward needs an RPO of 15 minutes and RTO of one hour. Ask how frequently recoverable points are created, how long cross-region restores take, and whether an actual restore was tested. Compare single-zone managed DB, multi-zone managed DB and self-managed Postgres for cost, maintenance, failover and data recovery. Keep roles, credentials and network access scoped even when provider automates host operations."
      ]
    }
  ],
  "virtual-networks-subnets": [
    {
      "heading": "Derive the address and trust topology",
      "paragraphs": [
        "A virtual network creates a controlled address/routing domain; a subnet is a slice of its address space, not by itself an internet security boundary. Example: network 10.42.0.0/16 is divided into 10.42.10.0/24 for the gateway, 10.42.20.0/24 for the API and 10.42.30.0/24 for the database. Those CIDRs contain different address ranges, but actual allowed traffic still depends on routing, security groups/firewalls, load balancer and service listeners. Routing a subnet toward an internet gateway does not itself make every private IP globally reachable, yet an overly broad public interface or forwarding rule can expose unintended services."
      ],
      "code": {
        "language": "python",
        "caption": "Locally prove CIDR membership and non-overlapping subnet intent",
        "code": "from ipaddress import ip_network, ip_address\nnetwork = ip_network('10.42.0.0/16')\nzones = [ip_network(f'10.42.{n}.0/24') for n in (10, 20, 30)]\nassert all(s.subnet_of(network) for s in zones)\nassert all(not a.overlaps(b) for i, a in enumerate(zones) for b in zones[i+1:])\nassert ip_address('10.42.30.12') in zones[2]\nassert ip_address('10.42.30.12') not in zones[0]\nprint('CIDR topology disjoint:', True)"
      }
    },
    {
      "heading": "Failure and transfer: draw the real policy enforcement points",
      "paragraphs": [
        "Give an external user a public DNS name for Steward. Trace inbound DNS resolution, gateway address, security policy, TLS termination and API routing. Then attempt to reach PostgreSQL directly: explain which routes, interfaces, firewalls and identity controls deny it. Do not equate 'subnet is private' with 'database is secured'. A bastion, VPN or identity-aware access path for SSH is a separate administrative trust decision."
      ]
    }
  ],
  "routing-gateways": [
    {
      "heading": "Trace forwarding and NAT as different transformations",
      "paragraphs": [
        "A route table selects a next hop for a destination prefix; it does not authenticate users or decide HTTP paths. A default route 0.0.0.0/0 handles destinations not matched by more specific entries, while a local 10.42.0.0/16 route keeps same-network traffic internal. NAT can rewrite an outbound private source address to a public address, allowing a VM without a public IPv4 to reach external package repositories. That does NOT automatically create an inbound public listener. Inbound publishing usually needs explicit destination routing/translation, a listening service and permissive matching security rules."
      ]
    },
    {
      "heading": "Failure and transfer: the response must have a route too",
      "paragraphs": [
        "A client reaches the public gateway but receives a timeout from the backend. The gateway's request route may be correct while backend response routing, firewall state, DNS or process listening is wrong. Diagnose both directions before changing applications: determine source/destination address and port at each hop, route-table selected next hop, stateful policy and listener. Compare a private subnet behind NAT with a public gateway subnet and explain why they have different exposure properties."
      ]
    }
  ],
  "load-balancers": [
    {
      "heading": "Health checks change membership, not just dashboards",
      "paragraphs": [
        "A load balancer accepts client traffic at a stable frontend and chooses among registered backend targets based on configured routing rules and health. Consider two API instances: A passes readiness, B cannot reach PostgreSQL and fails readiness. A health-aware balancer should stop giving B new requests, but if all targets fail, the frontend may return 503 rather than 'fix' the database. TCP connection success proves a listening socket, not valid business requests; HTTP health can be too shallow when it checks only a static page."
      ]
    },
    {
      "heading": "Failure and transfer: distribution cannot invent redundancy",
      "paragraphs": [
        "One public load balancer forwarding to two containers on the same host still has one physical failure domain. Meanwhile sticky sessions or in-memory state can make an apparently redundant API behave incorrectly after switching targets. Compare round-robin versus least-connections routing, edge TLS versus backend TLS and single-host gateway versus managed load balancer. Specify the observation that proves a target was withdrawn and an actual user request still succeeds after one instance fails."
      ]
    }
  ],
  "iam": [
    {
      "heading": "Evaluate a request, not the name of a role",
      "paragraphs": [
        "Authorization decisions depend on principal identity, requested action, target resource, policy conditions and any explicit denies or higher-level constraints. Example: the backup job needs write access to a narrow prefix in a storage bucket; it does not need delete permission or the ability to read every Steward credential. A policy saying 'storage administrator' may be too broad. Cross-account or resource policies can add restrictions beyond an identity policy. IAM is usually a control-plane policy; it does not make the packet path private."
      ]
    },
    {
      "heading": "Failure and transfer: privilege is visible through denial",
      "paragraphs": [
        "Design three identities: named human operator, CI publisher and Steward runtime. For each list the minimal action/resource pair, credential lifetime and allowed context. Then propose one action each must be denied, such as the runtime deleting a backup or CI reading a database password. A successful permission check for the needed action and a DENIED check for unnecessary access are stronger evidence than the existence of an IAM role label. Distinguish permission denial from a network timeout."
      ]
    }
  ],
  "secrets-management": [
    {
      "heading": "Trace a secret from creation to safe rotation",
      "paragraphs": [
        "A secret has a producer/owner, storage system, reader identity, delivery mechanism, update/expiry policy and revocation mechanism. A password embedded in a container image cannot be rotated without image changes and creates artifact disclosure risk. A mounted secret may refresh but only helps if the process reloads it; an environment variable can remain stale until restart. Workload identity can authenticate a process to a provider secret store without a long-lived shared API key, but token renewal and policy scope still need monitoring."
      ]
    },
    {
      "heading": "Failure and transfer: coordinate two credential generations",
      "paragraphs": [
        "Suppose a database password rotates at noon while three API replicas cache the old password. If the old password is immediately invalidated, all three can lose new connections. Design a bounded overlap or staged replacement when the system supports it: create new credential, grant least privileges, deploy/reload clients, verify new connections, revoke old and verify old use is denied. If overlap is impossible, schedule an explicit coordinated outage and recovery path instead of pretending seamless rotation. Never log the real secret during verification."
      ]
    }
  ],
  "cloud-monitoring": [
    {
      "heading": "Distinguish signals at each responsible layer",
      "paragraphs": [
        "An API latency metric alone cannot show whether a VM is out of memory, an instance was replaced, storage throttled or database connections exhausted. Separate infrastructure signals (CPU saturation, disk I/O, network errors, reboot events), platform signals (runtime restarts, deployment state), application signals (request errors/latency, queue backlog) and business signals (a successful authorized operation). Metrics describe trends, logs support local causal investigation, traces identify cross-service latency and independent synthetic checks test the user path. Monitoring data itself needs retention, sampling and access decisions."
      ]
    },
    {
      "heading": "Failure and transfer: alert on actionable impact",
      "paragraphs": [
        "A high CPU observation during a bounded batch task may not require paging, while one public HTTPS failure for a critical API can. Design an alert with a service-specific threshold, observation window, owner, escalation, runbook and verification query; avoid interpreting a single noisy point as an outage. Explain why provider dashboards showing all green still cannot prove a user's login and database transaction are correct, and why a green host with a full disk may soon become unavailable."
      ]
    }
  ],
  "cloud-backup-services": [
    {
      "heading": "Work backward from RPO/RTO and restore ordering",
      "paragraphs": [
        "A backup is a recoverable copy with a defined scope and retention, not just a schedule. RPO describes the maximum acceptable amount of recent data loss; RTO describes maximum acceptable recovery duration. If Steward has RPO 15 minutes, a single nightly database dump cannot satisfy the requirement. Point-in-time database recovery may need full backups plus continuous WAL archives and a separate retention/verification strategy. Restoring a backup also requires secrets, application artifact identity, network, schema compatibility and correct startup ordering."
      ]
    },
    {
      "heading": "Failure and transfer: exercise an isolated restoration",
      "paragraphs": [
        "A snapshot reports 'completed' but it may capture a database filesystem at a point requiring WAL recovery; it does not prove SQL rows are correct, that encryption keys are available or that an operator can restore before the RTO. Design an isolated restore drill using synthetic data and no live overwrite. Record start/end timestamps, selected recovery point, data integrity queries, dependent service readiness and user-visible verification. Compare snapshot, dump, WAL/PITR and cross-site replication: each solves a different part of the failure model."
      ]
    }
  ],
  "managed-vs-self-managed": [
    {
      "heading": "Calculate the whole operating contract",
      "paragraphs": [
        "Consider two choices for Steward PostgreSQL. Self-managed: monthly VM/volume plus human patch/backup/restore time and on-call failure exposure. Managed: instance/storage/egress fees plus still-owned schema, credentials, application queries and provider-specific failover behavior. The managed price must be justified by reduced toil or better recovery, not by the assumption that the provider now owns all correctness. Compare the provider's SLA scope to the end-to-end API SLO, which includes DNS, gateway, application and database together."
      ]
    },
    {
      "heading": "Failure and transfer: avoid splitting authority accidentally",
      "paragraphs": [
        "A team migrates its database host to a managed provider but keeps the old cron backup while a new managed retention policy is also active. This might give overlapping cost or conflicting restore expectations rather than safety. Assign one owner for each restoration mechanism, monitor both actual backup/restore outcomes and cost, and define an exit plan including data export and cutover. Defend when a simple VPS is still the better choice, and state the measured trigger that would justify changing it."
      ]
    }
  ]
};
