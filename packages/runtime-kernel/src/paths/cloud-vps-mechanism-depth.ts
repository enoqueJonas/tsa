// Cloud Engineer module 2: augment original eight lessons and their existing applied practicals.
export type VpsDepthSection={heading:string;paragraphs:string[]};
export const cloudVpsMechanismSections:Record<string,VpsDepthSection[]> = {
  "choosing-budget-vps": [
    {
      "heading": "Convert demand into an explicit capacity hypothesis",
      "paragraphs": [
        "A VPS is a guest operating system with a bounded entitlement to virtual CPU, memory, disk and network I/O. Advertised vCPU count is not guaranteed dedicated physical core capacity; shared hosts may throttle workloads when neighboring guests compete. A selection therefore begins with actual peak RSS of the Steward API, publisher, consumer, PostgreSQL and RabbitMQ, plus kernel/filesystem headroom. If those values have not been observed, a capacity figure is a hypothesis and must be marked as such.",
        "Choose a small candidate with an explicit OOM margin and an externally recoverable baseline. Test it under concurrent API and queue work and record p95 latency, memory high-water mark, database I/O and disk growth. A failed workload test should trigger a capacity review, not an unsupported claim that two advertised vCPUs always outperform one. Resizing may be easier than supporting premature multi-host choreography."
      ]
    },
    {
      "heading": "Compare provider placement and recovery, not just a price headline",
      "paragraphs": [
        "Compute charges can hide separately billed IPv4, outbound traffic, backups, snapshots and storage tiers. Location affects latency, residency and operator access; rescue consoles and provider APIs affect how you recover from accidental firewall or SSH lockout. No plan becomes acceptable simply because it has the lowest monthly base price. Compare two dated offers against identical storage, bandwidth, backup retention and disaster-recovery assumptions.",
        "A correct exercise produces a requirements matrix with values or explicitly unknown measurements, chooses the smallest credible baseline and identifies one rejected alternative. Include an independent failure path: what happens if the VPS filesystem is lost, if the provider account is unavailable, or if network routes fail? Provider snapshot creation is not independent proof of recovery. A successful restore with application checks supplies the stronger evidence."
      ]
    },
    {
      "heading": "Know the difference between allocated and usable resources",
      "paragraphs": [
        "Allocated RAM must accommodate the kernel, page cache, database buffers, background jobs and worst-case worker concurrency, not merely the memory reported by one container. Disk planning must include container layers, retained images, PostgreSQL WAL, queues, backups and logs. A compact image does not guarantee a small writable layer. CPU, RAM, disk space and disk latency can each become the limiting resource at different traffic levels.",
        "Run a baseline at idle and at representative synthetic load; separate process RSS, file cache and available memory, monitor disk latency and collect a workload result before increasing resource size. If the workload cannot fit within a single small instance, quantify whether resizing, moving data to managed storage or reducing retention is the simpler response. Never inflate availability claims because the provider offers a larger VM."
      ]
    }
  ],
  "provisioning-server": [
    {
      "heading": "Trace the lifecycle from control plane to guest",
      "paragraphs": [
        "Provisioning starts when an authenticated operator requests a provider resource with a region, immutable image or distribution release, instance shape, network, SSH identity and persistent volumes. The provider creates a virtual disk/VM, attaches address routing, initializes the guest and optionally runs cloud-init. A hostname visible in a portal is not proof that the correct OS, account, network or persistent state was created. The guest must be inspected independently after first boot.",
        "Record exact Rocky Linux version and architecture, image provenance, provider resource ID, disk layout, IPv4/IPv6 assignments, bootstrap key fingerprint and rescue-console route. Compare observed state with the request. Cloud-init runs at boot and may fail even when the VM is 'Running'; check its final status and logs where available. Do not treat a one-off shell script as the final configuration-management source."
      ]
    },
    {
      "heading": "Separate one-time access bootstrap from repeatable Ansible",
      "paragraphs": [
        "An initial SSH account, controlled sudo policy and Ansible connection may need a minimal bootstrap step. The ongoing host baseline must then live in idempotent Ansible code with declared inventory and variables, not in remembered terminal history. Drift repair and repeatability matter most when another operator must replace the host after an incident. Keep secrets out of versioned inventory and avoid treating a copied private key as an acceptable backup.",
        "Run Ansible once, run it again and compare changes. Deliberately change a disposable nonsecret setting and verify that the playbook converges back. Preserve provider console as an out-of-band control path so an incorrect security change does not remove all administration. A provider-reported success state is only the beginning of host acceptance."
      ]
    },
    {
      "heading": "Verify independence from the provisioning workstation",
      "paragraphs": [
        "An infrastructure deployment that works only because of local private files or a laptop cache is not reproducible. A clean administrator machine or CI runner must be able to read the approved inventory, obtain authorized temporary credentials and perform a documented health check. The VPS should consume immutable application artifacts from the approved registry rather than receiving a directory copied from a developer computer.",
        "Choose one simple acceptance path: record OS version, SSH alias and server fingerprint, Ansible facts, persistent disk mount and an intentionally denied public listener. Compare expected and observed state. If the clean machine cannot establish trusted SSH without accepting an unknown host key automatically, stop and repair trust establishment before installing application services."
      ]
    }
  ],
  "public-ip-addressing": [
    {
      "heading": "Distinguish routable destination address from listening process",
      "paragraphs": [
        "A public IPv4 address can route packets to a host while the intended service listens only on the loopback interface. Conversely, a process bound to 0.0.0.0 accepts connections on every available IPv4 interface, subject to external filtering; 0.0.0.0 is not a specific client destination. The provider firewall, Linux nftables/firewalld, socket bind address and upstream reverse proxy independently influence reachability. A successful SSH session does not imply the database is hidden.",
        "Inspect ip -brief address, ip route and ss -lntp on the guest, then confirm the provider's assigned IP and any forwarding or NAT rules. List every listening service with expected consumer: public user, restricted operator, internal backend or loopback-only. Test from a separate host when available; an on-host connection to localhost cannot prove that external routing or firewall rules are correct."
      ]
    },
    {
      "heading": "Account for IPv6 and address ownership explicitly",
      "paragraphs": [
        "IPv6 often gives the host a globally routable address without the private IPv4 NAT model, so a database bound to :: can be exposed even when IPv4-only tests look safe. The actual default firewall policy and listener family matter more than whether the marketing plan lists a public IPv4 surcharge. Dual-stack DNS can choose AAAA over A for some clients; tests must verify both transports separately.",
        "Inventory A and AAAA records only after Internet Networking introduces DNS. Record interface scope, listen addresses and expected reachability for each family. Disable unneeded listeners instead of assuming the router blocks them. Treat dynamic address reassignment after server recreation as a reason to document DNS/control-plane change, not to hardcode stale IPs into production secrets."
      ]
    }
  ],
  "securing-ssh-access": [
    {
      "heading": "Explain the two different SSH trust decisions",
      "paragraphs": [
        "SSH authenticates the host to the client with a server host key, and the human or automation principal to the host with an account credential such as an ED25519 keypair. These are separate directions of trust: possession of the right private user key does not prove you are connecting to the genuine VPS. Known-host fingerprints defend against accidentally sending credentials or commands to a substituted endpoint. Private user keys must not enter a repository or routine logs.",
        "During first enrollment obtain the server fingerprint from an independent trusted channel or provider console; then verify it when the client establishes SSH. Disabling StrictHostKeyChecking to remove an error can bypass the one control that detects a changed server. A replacement VPS may legitimately have a new host key, but verify its identity before updating known_hosts."
      ]
    },
    {
      "heading": "Run a real local OpenSSH client/key experiment without any remote login",
      "paragraphs": [
        "The copyable Python program in this lesson creates a disposable local ED25519 keypair with actual ssh-keygen, checks the private-key filesystem mode, derives the public key from the private key and compares it with the generated public file. It then asks real ssh -G to compute a client configuration for a fictional documentation-only address, confirming the intended named user, identity file, IdentitiesOnly and strict host-key checking. No packets are sent to a VPS, no host key is trusted on first use and no security configuration is modified.",
        "Expect SSH_REAL_ED25519_KEYPAIR_AND_PRIVATE_PERMISSIONS, SSH_REAL_CLIENT_CONFIGURATION_REJECTS_UNVERIFIED_HOST and SSH_NO_LIVE_SERVER_AND_NO_TOFU_BYPASS. In a disposable copy change the user to root or disable strict host verification; the corresponding learner-source regression test must fail. The fixture is client configuration evidence, not proof that the real server allows this user, that SSHD is hardened, or that a provider console works."
      ]
    },
    {
      "heading": "Apply server hardening without cutting off the operator",
      "paragraphs": [
        "On the authorized guest, identify where sshd reads included configuration, inspect the effective values with sshd -T, and preserve a currently working session while testing a second session with the intended named account. Confirm sudo authorization, password policy and accepted public keys. A config parse success does not prove new connections will succeed, and closing the first session too early can turn a routine change into an outage.",
        "Use a staged and reversible rollout: validate configuration syntax, document expected host-key fingerprint, test a second authenticated session, then confirm password/root login restrictions and out-of-band rescue access. A failed second login should stop the change. Real administrative tests require owned infrastructure and credentials, and must remain NOT_TESTED in this local lesson."
      ]
    }
  ],
  "provider-firewalls": [
    {
      "heading": "Model three enforcement points independently",
      "paragraphs": [
        "A provider firewall filters traffic outside the guest VM; the host firewall filters inside the guest; a process must still listen on the requested address and port for traffic to reach it. These controls are complementary rather than interchangeable. A provider control-plane rule can block external TCP/5432 even if PostgreSQL binds publicly, but intentionally binding PostgreSQL to loopback or a private interface reduces exposure when that outer rule is later changed.",
        "Document inbound rules by source CIDR, protocol, port, direction and owner. Keep SSH narrow to verified administrative sources when viable; allow public 443 only after HTTPS and reverse-proxy checks. Distinguish an allowed port with no listening service from a blocked port with a listening service using both a local listener inventory and an external connection test."
      ]
    },
    {
      "heading": "Prove negative network reachability safely",
      "paragraphs": [
        "A configuration screenshot showing 'deny all' is an intention, not the observation of a packet being dropped. A valid test compares an authorized source reaching the intended service with an unauthorized source or closed port failing from outside the host. The result should identify the network vantage point and command; a timeout, TCP refusal and TLS identity failure implicate different boundaries.",
        "Before testing on a live VPS, preserve a provider-console rescue path and current SSH session, and ensure the rollback instruction for firewall rules is explicit. The local training fixtures for port binding and TLS later in Internet Networking do not exercise a provider's firewall API or external reachability; they teach separate mechanisms only."
      ]
    },
    {
      "heading": "Do not use firewall openness as an application debug shortcut",
      "paragraphs": [
        "Opening all ports because the application is unreachable can expose the database, admin dashboard, container runtime or message broker while leaving the original DNS/TLS bug unresolved. Investigate one layer at a time: name resolution, destination address, provider policy, host policy, socket bind, reverse proxy and upstream process. Narrow the scope of any temporary rule, record its expiry and restore a known configuration.",
        "Require a before/after firewall inventory and independent negative observation before approving internet publication. When the necessary external test infrastructure is missing, write NOT_TESTED rather than claiming that a ping or localhost curl establishes public exposure safety."
      ]
    }
  ],
  "os-lifecycle-patching": [
    {
      "heading": "Separate upstream package release, installed version and support policy",
      "paragraphs": [
        "OS updates address defects and vulnerabilities in the guest kernel, base libraries, SSH daemon and system services. A package's upstream version string may differ from the distribution-maintained version and backport patches, so declaring a system vulnerable from one simple string comparison can be wrong. Rocky Linux uses DNF/RPM package metadata; do not silently paste Debian apt commands into the Steward host runbook.",
        "Record the installed release, enabled repositories, currently available updates, CVE/advisory references and whether the change requires a reboot or service restart. A security patch is operationally incomplete if the old kernel remains in use or a long-running process has not reloaded a replaced library."
      ]
    },
    {
      "heading": "Design a recoverable patch window",
      "paragraphs": [
        "Run a preflight: validated off-host backup or snapshot where appropriate, out-of-band console, available disk, approved maintenance window and a known-good application digest. Apply updates first in a nonproduction copy with representative processes, monitor service restarts, execute health/authorization/queue checks and explicitly decide whether to advance.",
        "Do not assume a VM snapshot can always be rolled back without affecting persistent database messages written since capture. If the patch fails, distinguish OS boot recovery, compatible package downgrade, app rollback and persistent data recovery. Measure elapsed recovery time and record the actual path; success cannot be inferred from dnf returning zero."
      ]
    },
    {
      "heading": "Verify patch state rather than trusting the installer",
      "paragraphs": [
        "After updating, inspect current kernel release, installed package versions, active services and effective SSH/network settings. For Rocky Linux, dnf updateinfo and rpm -q can show advisory and installed-package evidence, but no package manager can prove an application-level release is healthy. A provider VM health check may remain green while the outbox publisher is stopped.",
        "Verify at least one permitted and denied client API path plus asynchronous event processing if actual Steward components are present. Mark unexecuted runtime checks NOT_TESTED in a classroom fixture. Use configuration management to preserve a documented patch cadence without teaching automatic uncontrolled production reboots."
      ]
    }
  ],
  "remote-recovery": [
    {
      "heading": "Distinguish in-band SSH from independent recovery control",
      "paragraphs": [
        "SSH depends on the guest's network path, daemon configuration and usable login identity. An out-of-band serial or VNC provider console may remain available when the guest network or firewall is misconfigured. A rescue environment booted by the provider is yet another control path for filesystem inspection and key/sshd repairs; neither is equivalent to data restoration from a backup.",
        "Map failures to the surviving control: bad sshd setting, blocked port, broken bootloader, inaccessible volume, accidentally deleted database table and provider account suspension. A console may repair the first two but cannot restore deleted records without retained data. Identify the exact recovery owner and authentication method; do not assume the portal account is available during every incident."
      ]
    },
    {
      "heading": "Use a reversible recovery drill and explicit stop conditions",
      "paragraphs": [
        "Before modifying a running VM, record provider resource identity, last verified backup, secondary admin key, authorized console access and a tested command to revert a firewall or sshd change. If no out-of-band route is available, avoid a risky simulated lockout. For a disposable VPS, use a narrowly scoped invalid SSH port or blocked source only if automatic reversion and provider console access have been independently confirmed.",
        "Measure the drill from observed failure to restored SSH and explain every step and trust boundary. A written hypothetical procedure is source-reviewed guidance, not a completed drill. If a real recovery attempt cannot be run safely, mark it NOT_TESTED and require the actual operation later."
      ]
    },
    {
      "heading": "Close the failure with service verification, not login success",
      "paragraphs": [
        "Regaining SSH proves only the administrative path is restored. Steward's API, PostgreSQL, RabbitMQ, lifecycle consumer and publisher may remain unhealthy. After recovering a disposable host, verify services, release digest, persistent data and a representative asynchronous transaction. Record whether recovery altered application or database state.",
        "A third-party engineer should be able to follow the runbook without personal credentials stored on the author's laptop. Preserve evidence of the provider console route, the last known-good configuration revision and the measured time to restore service, not simply the time at which an SSH prompt appeared."
      ]
    }
  ],
  "backups-snapshots": [
    {
      "heading": "Name the state and recovery objective before choosing a mechanism",
      "paragraphs": [
        "A provider snapshot normally captures block-volume state at a moment, with consistency dependent on the snapshot mechanism and application activity. An application-aware PostgreSQL backup may capture a consistent database state or use WAL for point-in-time recovery, with different restore requirements. Copying the VM image does not guarantee consistent RabbitMQ queues, message acknowledgments or external side effects.",
        "Set Recovery Point Objective (maximum acceptable lost work) and Recovery Time Objective (maximum acceptable restoration duration) for each stateful component. Classify version-controlled Ansible and immutable OCI images as reconstructible, database records and queue state as persistent, and secrets/host identities as requiring authorized protected recovery. Do not claim that a provider offers point-in-time recovery because it advertises snapshots."
      ]
    },
    {
      "heading": "Prove restore in isolation with a semantic data check",
      "paragraphs": [
        "A backup's creation timestamp is insufficient evidence that it can be restored. For an authorized training environment, restore to a separate host or volume, start the appropriate PostgreSQL version and run deterministic semantic verification: expected row counts, representative values, referential constraints and application API behavior. Record backup tool/version, source, restore destination, end time and the gap between source and recovered data.",
        "Never restore a database snapshot over an actively serving system solely to demonstrate competence. If no isolated target exists, document the blocker. A ZIP copy of a directory that happens to exist is not equivalent to a working application restore; it may contain partial database files or exclude critical external state."
      ]
    },
    {
      "heading": "Stress data loss, retention and failure-domain independence",
      "paragraphs": [
        "A snapshot stored under the same account and region can be lost or inaccessible with the primary environment or account. Retention needs multiple recovery points and protected deletion policy. Test a deliberately missing or corrupt backup copy in a disposable environment and require the restore process to fail visibly rather than claim success on incomplete data.",
        "Compute observed backup size, time to restore and maximum expected data gap. If the resulting RTO/RPO exceeds the project objectives, improve the design or renegotiate requirements; do not change the words in the runbook to hide the failure. The student must explain which state cannot be reconstructed from git and container images alone."
      ]
    }
  ]
};
export const cloudVpsEvidencePractices:Record<string,string[]> = {
  "choosing-budget-vps": [
    "Explain the actual control boundaries in \"Convert demand into an explicit capacity hypothesis\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Know the difference between allocated and usable resources\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence."
  ],
  "provisioning-server": [
    "Explain the actual control boundaries in \"Trace the lifecycle from control plane to guest\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Verify independence from the provisioning workstation\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence."
  ],
  "public-ip-addressing": [
    "Explain the actual control boundaries in \"Distinguish routable destination address from listening process\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Account for IPv6 and address ownership explicitly\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence."
  ],
  "securing-ssh-access": [
    "Explain the actual control boundaries in \"Explain the two different SSH trust decisions\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Apply server hardening without cutting off the operator\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence.",
    "Run the exact published ssh-keygen and ssh -G Python proof on a disposable workstation; capture all three SSH_* markers and change root/StrictHostKeyChecking in a copy to demonstrate a failed security assertion."
  ],
  "provider-firewalls": [
    "Explain the actual control boundaries in \"Model three enforcement points independently\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Do not use firewall openness as an application debug shortcut\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence."
  ],
  "os-lifecycle-patching": [
    "Explain the actual control boundaries in \"Separate upstream package release, installed version and support policy\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Verify patch state rather than trusting the installer\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence."
  ],
  "remote-recovery": [
    "Explain the actual control boundaries in \"Distinguish in-band SSH from independent recovery control\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Close the failure with service verification, not login success\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence."
  ],
  "backups-snapshots": [
    "Explain the actual control boundaries in \"Name the state and recovery objective before choosing a mechanism\", then produce concrete observed evidence, expected result and one deliberately denied or failed state. A hypothetical scenario must be labeled NOT_TESTED when no authorized VPS exists.",
    "Use \"Stress data loss, retention and failure-domain independence\" to propose a safe reversal or recovery path. Record independent actor, method, result, limits and what must be proven later on the real Steward host rather than treating a successful document as deployment evidence.",
    "Describe a safe isolated PostgreSQL restore comparison with actual row identity, schema compatibility, recovery-point gap and time measurement. Explicitly reject claiming restore from snapshot creation alone."
  ]
};
