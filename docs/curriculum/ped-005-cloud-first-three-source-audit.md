# PED-005 — Cloud Engineer: canonical modules 1–3

**Status:** Source-authored remediation on draft PR #406. **Not learner validated** and **not cloud-infrastructure validated**. Separate from Delivery Engineer draft PR #404. Do not retroactively edit previously studied Builder/PostgreSQL topics.

## Baseline and scope

Cloud Engineer has eleven canonical modules. The first three are (1) Cloud and Hosting Models, (2) VPS Operations and (3) Internet Networking. This pass inspected their original authored source and instructional-quality overlays and **preserved every original lesson/activity ID**; no generic preparatory module or fake earned Steward dependency was inserted.

| Module | Original topic readings deepened | Existing integration lab | Added evidence |
|---|---:|---|---|
| 1. Cloud and Hosting Models | 6 / 6 | Hosting decision lab (3 activities) unchanged | Explicit compute/facility/control boundaries, IaaS/PaaS/SaaS, zones, recovery responsibility, horizontal/vertical capacity, 99.9% downtime arithmetic and total monthly cost sensitivity |
| 2. VPS Operations | 8 / 8 | Steward VPS lab (5 activities) unchanged | Capacity and provider controls, provisioning/Ansible, binding vs firewall/route, SSH identity, default-deny, OS maintenance, out-of-band rescue, snapshots vs independently tested restores |
| 3. Internet Networking | 10 / 10 | Public DNS/TLS/Steward API lab (4 activities) unchanged | Address scopes, routing and layer-specific diagnosis, authoritative vs recursive DNS, A/AAAA/CNAME, DNS wire response vs NXDOMAIN, TLS/SNI, proxy/forwarded headers, ingress roles, firewall/IPv6 and application attack surface |

**Source additions:** `cloud-hosting-learner-reconstruction.ts`, `cloud-vps-learner-reconstruction.ts`, `cloud-network-learner-reconstruction.ts` are attached to each original rich-lesson renderer. Original applied practices receive concrete transfer scenarios. Existing reading IDs, practical IDs, required learner reflections and original capstone IDs are preserved.

## Exact executable learner examples and adversarial tests

1. `cloud-hosting-evidence-programs.ts`: Python Decimal-based fictional USD cost of compute, IPv4, backup, transfer and managed DB, plus explicit memory/recovery admission. Independently computes a 99.9% / 30-day 43.2-minute downtime allowance and rejects a changed quote. A separate Python role matrix proves provider backup functionality does not eliminate customer data-restore verification or application access policy. No actual provider quote or account. `scripts/check-cloud-hosting-evidence.mjs` extracts both exact examples and must reject **seven** unsafe modifications (cheap without restore, omitted billed cost, false availability objective, stale quote and missing customer duties).
2. `cloud-vps-local-proofs.ts`: Python opens one **actual local TCP socket** bound to 127.0.0.1, receives/sends data, then rejects an alternative loopback destination. Checks that a wildcard-address mutation would violate the constraint; no host firewall, public interface or real VPS is touched.
3. `cloud-network-dns-proof.ts`: Python starts one **actual local UDP server** speaking the minimal A query/response wire format for `api.steward.test.`, matching transaction ID and reserved `192.0.2.10` fixture. An absent name returns NXDOMAIN with zero answers. Not an authoritative public zone, resolver, DNSSEC implementation or registrar. `scripts/check-cloud-vps-network-evidence.mjs` checks the 18 original VPS/network topic IDs and rejects **six** unsafe TCP/DNS source mutations.
4. `.github/workflows/cloud-learner-depth.yml`: exact-source executable examples; all curriculum smoke tests, strict integrity audit and production build; Chrome 390px/desktop/reload and genuine original reflection gate. Independent human mastery and real cloud-provider actions are deliberately **excluded** from automated success claims.

## Evidence distinctions

- **Source-authored**: explanatory content and practical transfer instructions now exist in the original lessons.
- **Executable source-verified**: copied Python examples run on loopback/fictional resources and reject bad versions.
- **Rendered UI-verified**: only first original reading/practical in each module, responsive 390px and authentic 180-character reflection gate are targeted by Chrome. Remaining original readings in those modules are **NOT BROWSER VERIFIED** because a scripted client must not fabricate learner answers to bypass progress.
- **Real infrastructure**: selecting dated actual offers, billing/recovery, provisioning a VPS, actual external denied SSH/database, real DNS delegation/TLS and independently restored state are **NOT EXECUTED**. Original labs are still genuinely pending.
- **Independent learner transfer**: an uncoached person should distinguish external reachability from loopback, provider from guest responsibility, stale DNS from dead proxy, and verified certificate from authenticated API. **NOT DONE**.

## Test incident

First Cloud CI run rejected a legitimate source paragraph under an arbitrary 310-character length rule. Test adapted to require topic-specific mechanisms, enough contextual explanation, exact runnable code and purposeful negative mutations instead of maximizing character count. The next run passed all Cloud source examples and thirteen mutants but full curriculum tests failed because the newly created workflow omitted `lxml`, `pyftpdlib` and `asyncssh` required by existing System Thinker tests. The workflow now installs those dependencies before whole-curriculum tests. A successful final-head run is required before declaring even the technical gates green.

## Subsequent canonical modules

Continue in order with Certificate Lifecycle Operations, Cloud Building Blocks, S3-Compatible Object Storage, Infrastructure as Code, Kubernetes/OpenShift/GitOps, Progressive Delivery, Cloud Architecture and Cost, then the Cloud Engineer milestone. Do not jump directly to OpenShift at the expense of networking and certificate prerequisites. The learner's original progress state must remain intact.
