# Platform Builder — evidence-based module review ledger

**Status (2026-10-17):** all 22 `platform-builder-*.ts` path source files identified and structurally/source-triaged. This is **not** a claim that every authored activity was manually executed, rendered, or approved. The canonical learner-visible composition includes quality wrappers, deep sources and milestone imports. Check off an evidence gate only for the evidence actually available.

## Evidence categories

- **S — Source triage:** inspected source contracts for concept order, prerequisites, safe exercises and assessment evidence. This may be a family-level pass, not a per-activity reading.
- **A — Activity review:** each learner activity in the composed path individually examined for prerequisite-first explanation, runnable examples, observable output and concrete completion criteria.
- **R — Rendered:** representative/necessary activities opened as a learner in the actual web application, including resource links and code presentation.
- **E — Executed:** command examples, recovery drills, or homelab exercises actually run in a controlled relevant environment with evidence.
- **C — CI:** integrity audit/examples/build pass for the exact reviewed commit.

The four first categories **must not** be collapsed into a single green checkbox. A successful CI workflow cannot substitute for E or R.

## 17 logical module families

| Module | Source checked | Specific source-level teaching / evaluation focus | Remaining direct evidence |
| --- | --- | --- | --- |
| Computer and OS Foundations | S | Kernel/userspace, memory/processes, storage and limits before service architecture; deep+quality composition | A, R, representative E |
| Linux Administration | S | Rocky/systemd/SELinux/firewalld, service permissions, safe shell and DNF; fix invalid shell placeholders and former Ubuntu reference drift | A, R, more E |
| Networking | S | L2/L3 routing, TCP/UDP, DNS/TLS and private management boundary; later CI/Nexus surfaces kept future-tense | A, R, actual permitted/denied-path E |
| Cisco Packet Tracer | S | Router/switch mechanics before routed DHCP and multi-subnet infrastructure | A, R, Packet Tracer E |
| Virtualization | S | Guest/hypervisor boundary, vCPU/RAM/storage, bridged/NAT and recovery | A, R, VM E |
| Bare Metal | S | Firmware/boot, device health, power and out-of-band recovery without claiming unavailable telemetry | A, R, physical/OOB E where available |
| Budget Homelab | S | Capacity, private management, failure-domain honesty, migration to learner-owned infra | A, R, homelab E |
| Proxmox Homelab | S | Template/bootstrap, network, storage, backup/restore, host maintenance and failure localization | A, R, Proxmox E |
| Enterprise Storage/NAS | S | Block vs file vs object/artifact boundaries; LVM, filesystem, NFS/SMB, authorization, outage/restore | A, R, NAS E |
| DNS/DHCP/Time | S | Authority/resolver and cache, isolated DHCP and routed relay, chrony and bounded clock skew | A, R, controlled failure E |
| Configuration Management | S | Ansible inventory, desired state, drift, canary changes and secrets; correct premature claims about Kubernetes/Vault | A, R, Ansible E |
| OS Patching/Lifecycle | S | Risk/errata, DNF, kernel runtime, staged changes and no-update honesty; report posture before later-school monitoring | A, R, live update E when available |
| Windows/PowerShell | S | Windows baseline, object pipelines, WinRM, NTFS/SMB, AD/domain GPO and cross-OS identity | A, R, legal separate-member E |
| Enterprise File/Directory | S | NFS atomic publication, identity UID/GID, bounded LDAP/AD and directory-authority ownership | A, R, file/LDAP E |
| Platform Implementation Milestones | S | Core services; patch fleet; Windows member. No-op, simulation and constraint are not graduation evidence | A, R, cross-system E |
| Proxmox Implementation Milestone | S | Actual repeatable Rocky template, VM network and recovery beyond diagram claims | A, R, recovery E |
| Final Steward Homelab Milestone | S | 8 operational gates; host/network/storage/identity/recovery/capacity and future-school handoff | A, R, comprehensive E |

The 17 family labels above map to the 22 deep/quality/implementation source files. Count source files and logical module imports separately; these are not counts of verified individual lessons.

## Confirmed defects remediated in this sequence

1. Patch posture mistakenly required Prometheus/Grafana before Reliability Engineer → Shell/Ansible posture report and explicit later handoff (`46fc0b3`).
2. Patch milestone demanded real updates when none might exist → conditional live-update gate and honest pending state (`7e8a6b1`).
3. Regression exercise could be mistaken for a post-update incident without an update → controlled-drill labeling (`cefaee3`).
4. Windows policy evidence could be substituted from the domain controller → separate-member requirement and honest constraint deferral (`6f817e2`).
5. Final homelab exit text could implicitly award missing patch/member competence → exit gates now require execution evidence (`dc21782`).
6. Ansible reassessment asserted later Kubernetes/Vault capabilities are already in use → future capability handoff stated explicitly (`d98c33d`).
7. Deep Linux/Budget Homelab resources pointed at Ubuntu/APT despite Rocky learner contract → Rocky and DNF resource links (`8d6aff5`, `04264ea`).
8. Rockyized DNF lesson included `dnf info <package>`, whose angle-bracket placeholder is not safely runnable as a command → concrete `dnf info bash` (`bba4540`).
9. Explain `dnf check-update` status 100 as available updates, not automatically an installation failure (`d7928b8`).
10. Linux examples used an unsafe raw `kill -KILL <pid>` suggestion and non-existent `/path/to/file` targets → isolated, safely runnable process and temporary-file demonstrations (`4a6862c`, `9ab4618`).

## Concrete remaining approval procedure

1. Resolve the canonical **composed** module activity inventory; do not trust literal counts in quality wrappers alone.
2. Inspect each reading, code block, practical, check and milestone criterion sequentially as delivered to the learner. Record individual IDs and exact defects with remediation commit.
3. Check rendered OOP and Platform representative pages across desktop/mobile widths; verify that URLs, diagrams, output blocks and instructions are not lost by transformation.
4. Execute selected Linux/Rocky, networking, DHCP/time, Ansible, Proxmox, NAS, Windows and final Steward gates on appropriately controlled equipment. Mark impossible or expensive labs **pending**, not passed.
5. Run exact-head `pnpm audit:curriculum`, example checks and build in CI; only then make a merge recommendation.

## Verification batch 73 — actual Linux command execution (2026-10-17)

- Executed the corrected filesystem demonstration in an isolated Linux shell: temporary directory/file, symbolic link, `stat`, `file`, `readlink -f`, `find`, cleanup. It completed with expected existing-file and symlink observations.
- Executed the corrected signal demonstration against a locally spawned disposable `sleep` process and verified process inspection before `SIGTERM`. No unrelated process was targeted.
- Executed the corrected procfs example with `sample_pid=$$`; `/proc/$sample_pid/status` and `/proc/$sample_pid/fd` were present and inspectable. These are Linux-shell execution checks, **not** proof of Rocky Linux homelab or TSA renderer behavior.
- Confirmed GitHub Actions run [39029927381](https://github.com/enoqueJonas/tsa/actions/runs/39029927381) succeeded for commit `e96533c14`, covering the preceding integrity-guard and example fixes. Any subsequent documentation commit must be checked separately.

### Completion boundary

The 22-file Platform source-family triage is finished, but **the full Platform Builder module is not signed off**. The repository connection provides source and CI information, not a learner browser session or control of the user's Proxmox/Windows/Rocky infrastructure. Do not mark R/E gates complete without direct evidence. Activity-by-activity review beyond the targeted cases above remains open; the school-level checklist must reflect this honestly.

## Batch 74–75 — Computer and OS Foundations composed-source review

- Examined the five main deep teaching sequences and their five Quality practical overrides: **CPU/Memory/Storage/I/O**, **What an OS Does**, **Kernel vs User Space**, **Processes/Threads**, and **Filesystems**, plus the integrated host-inspection lab in the deep source. Quality practicals supply observable deliverables; the deep file retains readings and checks. This is an activity-type and source contract review, not a claim that every rendered lesson was tested.
- Found the process inspection snippet had `sample_pid=$` rather than the required Bash `sample_pid=$$`, an error introduced by the previous automated text replacement. Corrected in `ff319e4`, then fetched the file to verify the authored TypeScript contains both dollar signs.
- The preceding CI failure on `d0cc204` was **not** a JavaScript parse error: the GitHub job log shows the intentional audit guard detecting the malformed PID example. The prior `a1edfae` CI run failed due to JavaScript syntax; `d0cc204` fixed parse syntax but the example defect remained. Do not conflate these failures.
- The CI check on `ff319e4` needs independent completion confirmation. The real learner browser and homelab execution gates remain open.

## Batch 77 — Real learner browser and isolated service recovery (2026-10-17)

- Added Playwright Chromium browser testing against the built Next.js static export. GitHub Actions run [39031086697](https://github.com/enoqueJonas/tsa/actions/runs/39031086697) passed both standard validation and a browser job. It opened the Platform Builder school, navigated into a real learner module, asserted a visible lesson and practical evidence requirements at 390px and 1440px, and uploaded screenshots as the `platform-builder-learner-screenshots` Actions artifact. Browser automation confirms rendering/navigation of those samples, not human visual sign-off of all activities.
- Added an isolated loopback HTTP infrastructure drill that checks healthy listener -> stopped listener -> recovered listener. GitHub Actions run [39031124004](https://github.com/enoqueJonas/tsa/actions/runs/39031124004) passed this exercise plus the build/browser jobs. This is real execution in a disposable Ubuntu runner, **not** a Rocky/Proxmox homelab recovery demonstration.
- Extended browser test to open and capture every available Platform Builder module at desktop size (`9c39535`). Its CI result is pending until the exact commit's browser run finishes. Module entry rendering still does not prove every inner activity, every screenshot's visual readability, or network/storage/Windows labs.
- Remaining dependency: meaningful external infrastructure tests require authorized access to the learner's Rocky Linux, Proxmox, NAS and Windows test systems. CI cannot safely invent those hosts or certify network firewall rules, VM restore, Active Directory policy application or hypervisor power-state recovery.

## Batch 78 — Browser checks for activity navigation and mobile layout (2026-10-17)

Extended `scripts/check-platform-learner-browser.py` to inspect the rendered activity-navigation sidebar in every Platform Builder module, assert that the first activity remains selectable, and count the activity entries including locked items. The test deliberately does not unlock activities or mark simulated progress as learner evidence. Added mobile viewport horizontal-overflow assertions for the first reading and practical. These changes are automated browser checks rather than a manual accessibility/layout sign-off. Commits: `efe594b`, `665ab1e`, `3402f24`, `de4109c`. CI for the exact latest change must be checked before treating these assertions as passed. Real lab execution remains separately pending.

## Batch 80 — Browser progression and accurate activity counts (2026-10-17)

- The CI learner-browser runner confirmed **15 learner modules and 328 sidebar activity entries** in the composed Platform Builder school. This is a more accurate learner-visible activity denominator than the 17 source-family categories, which classify source material differently.
- Added a full first-module navigation exercise to verify sequential reading, practical and reflection content in a disposable Chromium browser (`530a5fc`). The first run revealed a test-selector problem: multiple textareas are present because evidence panels coexist with the reflection editor. The test now targets the reflection's exact placeholder (`f6b11c8`), rather than selecting every textarea. The preceding failure is a test-selector defect, not proof that learner navigation is broken.
- The new full-walkthrough CI must succeed before we claim complete first-module browser validation. Even a passing walkthrough is a synthetic progression fixture, not evidence that a learner executed the associated infrastructure labs.

## Batch 81 — Complete synthetic learner progression verified (2026-10-17)

- Added a Chromium journey test traversing every actual learner-facing activity, using an isolated disposable browser profile and explicitly synthetic reflection fixtures. The test does not claim real engineering evidence or certify the activities' technical correctness.
- CI run [39032253329](https://github.com/enoqueJonas/tsa/actions/runs/39032253329) passed both validation and learner-browser jobs for commit `7ad49fe`. Logs confirm **all 328 activities across all 15 Platform Builder modules were visited sequentially**. Modules passed with activity counts: 18, 48, 48, 30, 15, 7, 35, 25, 23, 18, 10, 17, 19, 4, and 11.
- The initial full-module test uncovered ambiguous textarea and nested main selectors; addressed in commits `f6b11c8`, `bf940c1`, and `5650676`. These were browser-test selector defects, not established learner-app defects. The final all-module test succeeded at `7ad49fe`.
- Thus Platform Builder has full browser **progression coverage** (navigation, basic content presence and reflection input), but it is not a full visual/manual proof of readability or code correctness in each activity. Production-like Rocky/Proxmox, real DNS/DHCP, Windows/AD, file/NAS and WireGuard laboratory gates remain unverified without their external environments.

## Batch 82 — Type-specific learner rendering across 328 activities (2026-10-17)

- Extended the full Chromium synthetic progression test to assert activity-type-specific visible content: reflection editor and label, practical assignment and evidence requirements, or reading paragraphs. Browser traversal still uses isolated synthetic responses, never real student submissions.
- GitHub Actions run [39032411812](https://github.com/enoqueJonas/tsa/actions/runs/39032411812) passed both the standard validation and learner-browser jobs for `67d5be1`. Earlier run [39032253329](https://github.com/enoqueJonas/tsa/actions/runs/39032253329) confirmed actual sequential navigation of all **328 activities in 15 Platform Builder modules**.
- This establishes browser navigation and basic type-specific rendering coverage for all activities. It does not establish a human qualitative approval of all instructions, nor actual Proxmox/Rocky/Windows/NAS/DNS/VPN lab performance. Those gates remain distinct and pending.

## Batch 83 — Full-activity code presentation regression checks (2026-10-17)

- Added code-snippet rendering assertions during the 328-activity Chromium journey: where the actual reading shows a code figure with a Copy button, its preformatted code must be present and the copy control visible. Commit `0676a17`.
- Added a strict regression check that the composed Platform Builder journey has exactly **328** activities rather than quietly accepting an accidental coverage reduction to 300. Commits `6538cde` and `44c45f3`.
- Last confirmed CI was `7306e40` (GitHub Actions 39032567789, success). Exact latest browser checks require the subsequent CI result. The browser checks verify presentation structures, not the output of all code or real infrastructure lab execution.

## Batch 84 — Learner code Copy button exercised in Chromium (2026-10-17)

- Beyond checking that code blocks have visible preformatted source and a Copy control, exercised the clipboard interaction for an available example during the full synthetic progression. The browser grants clipboard permissions in its isolated CI context, activates Copy, then checks for nonempty clipboard contents. The test does not execute arbitrary learner code from the browser and must not be counted as infrastructure evidence.
- GitHub Actions run [39032853924](https://github.com/enoqueJonas/tsa/actions/runs/39032853924) passed both validation and learner-browser jobs on commit `c7a598e`, including all 328 synthetic activity visits. A later documentation-only commit needs its own CI result.
