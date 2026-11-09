// Cloud Engineer canonical module 2, original IDs unchanged.
// Each topic gains a precise mechanism, fail-closed scenario and observable transfer.
export type CloudVpsDepthSection={heading:string;paragraphs:string[];codeKey?:string};
export const cloudVpsDepth: Record<string,CloudVpsDepthSection[]> = {
  "choosing-budget-vps": [
    {
      "heading": "Calculate capacity from processes before selecting a provider",
      "paragraphs": [
        "A VPS is a virtual machine with vCPUs, reserved or shared RAM, persistent block storage and network interfaces. A sizing decision starts from the observed workload: kernel/service overhead, Steward API workers, background publisher, consumer, proxy and any colocated data services. A four-vCPU label does not tell you whether CPU time is dedicated, whether memory is sufficient for a PostgreSQL cache, or whether disk IOPS are predictable. Record p95 API latency, memory RSS, peak concurrent connections and queue lag under a known load first.",
        "A 1 GiB plan may boot but repeatedly trigger an OOM kill when API and database share the machine. That is a design failure, not an excuse to disable OOM protection. If no reliable measurement exists, set a conservative, explicitly uncertain baseline and prove it with a load trial before exposing clients."
      ]
    },
    {
      "heading": "Make the realistic total cost and disaster plan part of selection",
      "paragraphs": [
        "Some VPS offers charge separately for IPv4, backups, snapshots, provisioned storage and egress. A VPS that can be rebuilt after SSH is lost is more valuable than a nominally cheaper server with no console or off-host restore path. Compare the provider's data-center region, supported OS versions, identity policies and recovery interfaces. The earlier fictional cost/SLO Python program teaches the arithmetic, but do not substitute its fabricated prices for real quotes.",
        "For each offer, record exact plan, region, price date and currency, billed resources, restoration mechanism, transfer ceiling, support constraints and the cost of at least one realistic failure. Reject options missing a mandatory operational capability rather than burying that risk in an averaged score."
      ]
    },
    {
      "heading": "Define a measurable resize or architecture-change trigger",
      "paragraphs": [
        "Choose resize criteria tied to workloads: sustained memory pressure with headroom exhaustion, p95 latency exceeding the service objective during moderate traffic, persistent volume free space approaching a safe limit, or queue lag beyond its agreed bound. Identify which metric must be observed and over what window before triggering action; a random spike is not the same as sustained saturation.",
        "A VPS resize may require shutdown, changes its underlying CPU model, or change its network interface. Revalidate deployment and rollback evidence after resizing. A second VPS is not automatically high availability if both share one database and DNS entry with no failover procedure."
      ]
    }
  ],
  "provisioning-server": [
    {
      "heading": "Separate the provider control plane from the guest's state",
      "paragraphs": [
        "Provisioning involves region, OS image, hardware profile, network assignment, SSH public keys, billing account and storage attachment. The provider API or console can create and destroy instances even if SSH into the guest is broken. Inside the guest, you control Linux users, systemd services, host firewall, runtime packages and application processes. These are separate permission boundaries and evidence sources.",
        "Before clicking Create, record the image version, instance size, recovery/rescue capability and a nonsecret resource name. Keep account credentials and private SSH keys out of user-data, console screenshots and Git. An infrastructure resource ID is important for audit and cost cleanup; a hostname alone can be reused or redirected."
      ]
    },
    {
      "heading": "Bootstrap minimally and hand off to declared host configuration",
      "paragraphs": [
        "Use initial provisioning only to establish an administrative key, restricted network controls and a reachable baseline. One-off manual installation of Docker, database and application packages leaves state that Ansible cannot reconstruct later. Reconcile the host against the existing configuration-management runbook and capture idempotent second-run evidence, package versions and system service status.",
        "If cloud-init fails, do not repeatedly paste secrets or rerun destructive setup scripts on a partially configured VM. Inspect console logs and effective user/service state first, then repair or reprovision with a documented decision. A successful SSH connection proves only an entry point, not a reproducible server."
      ]
    },
    {
      "heading": "Independently prove resource identity and the right network route",
      "paragraphs": [
        "An external DNS record can refer to yesterday's server while an engineer successfully SSHes into a different IP today. Validate provider resource ID, address assignment and host OS identity together before changing DNS or publishing an OCI release. Check the provider firewall and guest listener rather than assuming an allocated public IP means public TCP access.",
        "For a disposable provisioned VM, capture read-only uname/hostname/OS details, provisioned addresses, effective user/SSH identity and the approved package baseline. An authorized external client should probe the intended management port while an unrelated application port remains closed."
      ]
    }
  ],
  "public-ip-addressing": [
    {
      "heading": "Address assignment, socket binding, routing and firewall are different conditions",
      "paragraphs": [
        "A provider routes a public address to a VM or load balancer. An application creates a listener on a specific guest or container interface: 127.0.0.1 means loopback within that network namespace; 0.0.0.0 means all available IPv4 interfaces inside that namespace. The provider security group and host nftables/firewalld rules independently filter packets, and Docker published ports can add another NAT/proxy path.",
        "Successful outbound curl or package downloads do not prove a reachable inbound API. Likewise, binding an internal process to 0.0.0.0 can be appropriate in a private container network, but is not an authorization policy. Document public entry, trusted proxy and private backend instead of exposing database/worker ports because an application needs them."
      ]
    },
    {
      "heading": "Execute a real local socket-binding negative control",
      "paragraphs": [
        "The copyable Python fixture opens a TCP listener exclusively on 127.0.0.1 with an ephemeral port, exchanges ping/pong, then verifies that a different loopback address cannot reach the same listener. A deliberately unsafe implementation binding 0.0.0.0 instead would violate this observation. It does not open a public port, modify an OS firewall or contact any VPS.",
        "Run with Python 3; expect VPS_LOOPBACK_POSITIVE_CONNECTION, VPS_UNBOUND_LOOPBACK_ALIAS_REJECTED and VPS_FIXTURE_NOT_A_REAL_INTERNET_FIREWALL_TEST. For a real VPS, validate from an independent external client as well as with ss -ltnp, the provider control plane, IPv4 rules and IPv6 rules. A localhost test cannot certify internet isolation."
      ],
      "codeKey": "loopback"
    },
    {
      "heading": "Treat IPv6 as a separate path, not an annotation to IPv4",
      "paragraphs": [
        "A host with an AAAA DNS record and a globally scoped IPv6 address may be reachable from peers even if IPv4 NAT or firewall settings appear restrictive. IPv6 listener binds such as :: may interact with dual-stack defaults; inspect the effective setting and both address families rather than assuming an IPv4-only deny applies to IPv6.",
        "A safe exposure audit lists every address family, listening socket, container port mapping and relevant provider/host rule. Test permitted HTTPS and denied management/database access over IPv4 and IPv6 separately where supported, and record a failed/unsupported IPv6 path rather than mislabel it secure."
      ]
    }
  ],
  "securing-ssh-access": [
    {
      "heading": "A public key is an authentication credential, not authorization",
      "paragraphs": [
        "SSH server authentication proves the remote host identity (host key); user authentication proves possession of an authorized private key or another configured factor. The server then maps the authenticated user to Linux permissions and possibly sudo. These are distinct: a correct login key does not justify root privileges, and blindly accepting a changed host key can hide a man-in-the-middle or a rebuilt host whose identity was not validated.",
        "Use a named non-root administrator, a strong public-key authentication configuration, protected private key, controlled sudo scope and an out-of-band provider console. Do not remove all working auth methods before proving an independent new session works, and do not treat moving SSH to a different port as a replacement for credential and network controls."
      ]
    },
    {
      "heading": "Follow the safe order of an SSH hardening change",
      "paragraphs": [
        "From the provider console or a recoverable current session, create the intended account, install the correct public key, validate sshd configuration syntax and inspect effective settings. Open a second connection using the target identity before disabling password/root login; preserve the first session and a documented rescue path until access works. Capture which exact server version and configuration include files apply.",
        "If an SSH restart fails or the host is locked out, recovery should use the provider's authorized console/rescue channel and last-known configuration, not relaxed firewall access for everyone. A negative password-login test should fail from a separate client; that does not prove brute-force protection or host-key authenticity by itself."
      ]
    },
    {
      "heading": "Separate SSH reachability from public administrative authorization",
      "paragraphs": [
        "The provider firewall may restrict port 22 to a VPN or narrow management source, while host firewall and sshd still enforce local policy. If a corporate source changes IP, access can fail even though sshd is healthy; blindly opening 0.0.0.0/0 is not an appropriate fix. Prefer a well-defined management path and an emergency override procedure that expires.",
        "Inventory authorized keys, user groups, sudo entitlements and last-login evidence. Document key rotation and revocation when a laptop is lost. Ansible should maintain durable identity and SSH configuration after bootstrap; ad hoc edits on the server are drift."
      ]
    }
  ],
  "provider-firewalls": [
    {
      "heading": "Trace packets through the provider and host policy planes",
      "paragraphs": [
        "A provider security group or firewall controls allowed traffic before or around the VM's network interfaces; the guest firewall applies inside Linux; a container publish rule may translate a host port to a service namespace. Their rules need not be identical, but the resulting allowed path must be deliberate. Distinguish INPUT (connections destined for host) from FORWARD (transiting/bridged container traffic) and related established-return traffic.",
        "A rule that denies port 5432 at the provider can reduce exposure even if PostgreSQL listens broadly, but that is still a dangerous guest configuration if networks change. Defence in depth means explicitly restricting service bindings and host policies too; don't rely on one virtual firewall to enforce every boundary."
      ]
    },
    {
      "heading": "Reason about default deny without breaking recovery",
      "paragraphs": [
        "Start by identifying legitimate ingress: public HTTPS through a proxy, restricted administrative SSH, and internal-only dependencies. Add allow rules needed for existing connections and management before applying a deny-by-default posture. On a remotely administered machine, first establish a console/rescue route and a rollback timer for testing changes.",
        "Failure example: a firewall update blocks the administrator while the service appears healthy from localhost. A controlled experiment must preserve recovery access. Automated scripts should not flush a real firewall or disable SSH simply to generate evidence; use read-only inspection plus authorized temporary test rules in an isolated VM."
      ]
    },
    {
      "heading": "Prove an allowed and a denied path from outside",
      "paragraphs": [
        "Checking nft list ruleset or a provider UI only proves configuration text, not packet reachability. Use a separate external client to test HTTPS reachability and negative database/admin access, while comparing guest ss listeners and server-side request/denial logs. If tests disagree, trace which policy plane is responsible and whether IPv6 rules differ.",
        "Document source address, destination address/port, IP family, timestamp, expected result and actual response. A TCP timeout could indicate routing or filtering; a connection refusal may indicate a reachable host with no listening service. Neither alone establishes application authorization."
      ]
    }
  ],
  "os-lifecycle-patching": [
    {
      "heading": "Differentiate patch discovery, installation, restart and rollback",
      "paragraphs": [
        "A package manager reports available fixes based on configured repositories and package metadata; installing packages changes binaries, libraries and sometimes services. A kernel or libc update may require restart or service reload. A distro's support window and enabled repositories determine which security updates are available, so verify installed OS release, configured package sources and provenance before patching.",
        "On a Rocky Linux-style image, DNF is the appropriate package-management baseline, but repository naming and lifecycle depend on release. Avoid blindly piping remote scripts into bash or using unsupported third-party repos to obtain newer tooling. Record package versions and change approvals, not just a screenshot of an empty update list."
      ]
    },
    {
      "heading": "Plan maintenance against a running application contract",
      "paragraphs": [
        "Before patching, assess dependent services, backup/restore point, release digest, database compatibility and whether the VM must restart. Test an identical or representative nonproduction host, collect post-reboot SSH, reverse-proxy, API and asynchronous worker health, and keep a reversible recovery path. If live traffic exists, plan a maintenance window or traffic migration.",
        "A successful dnf upgrade does not prove the application still works: ABI changes, service restart failures, certificate trust changes or an invalid new kernel may break startup. Define explicit stop/recovery criteria and measure observable behavior after the update."
      ]
    },
    {
      "heading": "Treat patch timing as a risk decision",
      "paragraphs": [
        "A critical exposed remote-code-execution issue may justify accelerated action, while a benign optional component may be scheduled later. Consider exploitability and exposure, not only a CVSS number. Reevaluate when a new vulnerability changes the threat model or when the host has lost vendor support.",
        "A patch history without a verified reboot or restored service is incomplete. Keep identity, authorization and backups intact through emergency maintenance; don't use convenience as an excuse to disable hardening to regain speed."
      ]
    }
  ],
  "remote-recovery": [
    {
      "heading": "Define out-of-band access independent of the broken service",
      "paragraphs": [
        "SSH depends on guest network routing, listener, firewall and user configuration. An out-of-band provider console or rescue environment can sometimes recover access when those layers fail. Document what the console truly controls: serial console, VNC, rescue disk mount, reboot or instance replacement. Its availability and security depend on provider-specific capabilities and account access.",
        "A 'console' that depends on a browser plugin or unavailable MFA recovery method is not a reliable emergency plan. Keep authorized account recovery, backup credentials and encryption key access distinct from the failed VPS. Test the recovery channel before it is needed."
      ]
    },
    {
      "heading": "Diagnose before destructive reprovisioning",
      "paragraphs": [
        "If SSH fails after hardening, compare provider instance state, public addressing, firewall changes, authentication logs and console access. Avoid deleting the instance before capturing diagnostic information and confirming persistent disks/snapshots. Record which changes can be reverted from console and which require a rebuilt image.",
        "If the boot disk is corrupted but an independent backup exists, a fresh VM may be safer than in-place repair. Recovery requires reattaching valid DNS/TLS, restoring secrets through their approved channel and deploying the exact approved OCI digest; starting an arbitrary latest tag weakens reproducibility."
      ]
    },
    {
      "heading": "Measure real recovery objectives in a controlled drill",
      "paragraphs": [
        "Define RTO as the time from an agreed incident detection point until the service returns, and RPO as the maximum tolerated lost data. Rehearse loss of SSH or VM in a disposable environment without damaging persistent user data, then measure the result against these objectives.",
        "Distinguish host rebuild, application rollback, data restore and DNS cutover. A recovered SSH session does not imply the API and worker event path are healthy. Verify client-visible behavior and known historical records after recovery."
      ]
    }
  ],
  "backups-snapshots": [
    {
      "heading": "Snapshots, backups and restore validation are separate capabilities",
      "paragraphs": [
        "A volume snapshot is often a point-in-time representation of storage blocks; an application-consistent database backup may need coordination to ensure transactions and WAL are recoverable together. A VM-level snapshot can capture incompatible states across separate disks or services. An offsite backup additionally addresses host/region account failure, but only if credentials, retention and restore steps remain independently accessible.",
        "A backup dashboard showing 'success' does not prove it contains the latest schema, can decrypt, or can restore without current VM state. Define what data is authoritative (database, uploaded objects, package provenance, secrets), what is reproducible from source, and where each recoverable copy lives."
      ]
    },
    {
      "heading": "Connect recovery policy to business loss limits",
      "paragraphs": [
        "An RPO of one hour requires evidence that state changes are recoverable within that window, not merely a nightly image snapshot. An RTO of two hours requires a measured rebuild/restore and verification time, including DNS, TLS, network controls and dependency startup. Different services may have different objectives; an API can return 200 while a disconnected outbox consumer loses timeliness.",
        "For PostgreSQL, distinguish logical dumps from physical/WAL-based restore and document which one fits the data size, point-in-time requirements and operational maturity. No one backup format is automatically correct for all workloads."
      ]
    },
    {
      "heading": "Prove restoration from an independent environment",
      "paragraphs": [
        "Create a disposable target with a clean database and no access to the producer's local disks. Restore the chosen backup, run deterministic record checks, verify the application version is compatible, then execute representative API and queue processing. Record snapshot ID, creation time, restored state and residual data loss.",
        "One restore rehearsal does not certify future backups forever; changes in schema, storage layout, encryption keys or backup retention require recurring verification. Never delete the sole copy or production VM to test recoverability."
      ]
    }
  ]
};
export const cloudVpsPractices: Record<string,string[]> = {
  "choosing-budget-vps": [
    "Reuse the fabricated Cloud cost test only as a numeric technique; replace all rates with dated, region-specific offers and include IPv4, backup and egress.",
    "Measure or estimate separate API, worker, PostgreSQL and system overhead and reject an undersized option even when cheapest."
  ],
  "provisioning-server": [
    "Write a resource/identity record for the future VM: image, OS, region, ID, public/private address, approved admin, backup mechanism and Ansible handoff.",
    "Demonstrate a failed cloud-init/partial bootstrap recovery decision on a disposable target or describe exactly which console evidence would be needed if no provider account exists."
  ],
  "public-ip-addressing": [
    "Run the exact local TCP loopback probe and capture its three output markers; mutate the bind address only in an isolated copy.",
    "For a future real VPS, record separate IPv4/IPv6 positive HTTPS and negative SSH/database checks from an external client; mark them NOT_TESTED until run."
  ],
  "securing-ssh-access": [
    "Write the safe order: provider console access → key installation → sshd config validation → second key-auth session → restricted login; include rollback path.",
    "Document host-key validation, key revocation, sudo privilege and denied password auth separately."
  ],
  "provider-firewalls": [
    "Classify source/destination/protocol for HTTPS, restricted SSH, database, RabbitMQ and management, at both provider and host layers.",
    "Do not apply destructive firewall experiments on a live VPS; require authorized isolate, console access, external positive/negative checks."
  ],
  "os-lifecycle-patching": [
    "Record OS support state, actual package source, planned updates, reboot impact, post-reboot client and async-worker checks.",
    "Explain one emergency patch where service recovery would override a routine maintenance window, with an explicit rollback decision."
  ],
  "remote-recovery": [
    "Create a branch/failure decision tree for lost SSH, lost boot disk and compromised credential, including independent console and restore prerequisites.",
    "Define the clock start/stop for RTO and how to measure data loss for RPO; distinguish recovered admin login from recovered product."
  ],
  "backups-snapshots": [
    "For each data/state asset, distinguish service process/config, volume snapshot, DB restore log, and off-host independent recoverability.",
    "Rehearse an authorized restore on a new disposable target, record integrity checks and make explicit which RTO/RPO goals were or were not met."
  ]
};
