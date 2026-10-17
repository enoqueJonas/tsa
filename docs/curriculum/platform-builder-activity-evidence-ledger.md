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

## Batch 85 — Code-copy regression debugging and activity coverage artifacts (2026-10-17)

- The strict `pre code` versus clipboard equality check exposed a mismatch during CI (run 39033105528) on the first CPU resource example. The highlighted DOM includes presentation/line-number structures and is not necessarily byte-identical to the source clipboard string. This failure is recorded rather than treated as proof of an incorrect learner clipboard. The revised test asserts a known raw CPU inventory prefix in the clipboard; its exact-head CI run must pass before acceptance.
- Added a structured `activity-coverage.json` CI artifact, containing every visited module index, activity ID, rendered activity type and code figure count, so the 328-activity browser coverage is independently reviewable rather than reported only as a terminal summary.
- Added a listener for client-side exceptions across the entire synthetic learner traversal; a browser runtime exception will now fail the validation. These checks verify application behavior but not the real Proxmox/Rocky/Windows labs.

## Batch 86 — Visible-text quality gate and bounded command samples (2026-10-17)

- Extended the full 328-activity Chromium traversal to record visible text length, reject nearly empty learner surfaces and flag unfinished TODO/TBD/Lorem-ipsum wording. Corrected the editorial-placeholder regex to use actual word boundaries. GitHub Actions run [39033527650](https://github.com/enoqueJonas/tsa/actions/runs/39033527650) passed both browser and validation jobs for `11edee8`.
- Replaced the OS resource lesson's unbounded `vmstat 1` sampling with `vmstat 1 5` and a caption explaining available RAM, swap-in/swap-out and CPU wait. Executed `vmstat 1 5` in an isolated Linux shell and observed five rows followed by normal process exit. This is a command-execution check, not a Rocky homelab performance benchmark.
- Replaced the Linux Administration lesson's unbounded `journalctl -u steward.service -f` with a bounded `journalctl -u steward.service -n 30 --no-pager`, suitable for copying into one-shot evidence collection. The journal source was corrected, but the actual steward service unit is not installed in CI; no service output was fabricated.
- New source commits `38fc500` and `1d48777` need exact-head CI verification before final acceptance; rendered/source R and E categories remain bounded by the tests actually performed.

## Batch 87 — Worked output and vmstat interpretation (2026-10-17)

- Corrected the OS resource-inspection explanation: in `vmstat 1 5`, the first displayed report summarizes averages since boot, while subsequent reports represent one-second samples. Verified directly with a bounded `vmstat 1 5` invocation in a disposable Linux shell, yielding five data rows and normal termination.
- Extended the Computer/OS rich-lesson code factory to support explicit `output` examples. The CPU inventory example now shows clearly labeled **illustrative**, host-dependent output instead of leaving the beginner to guess what `nproc`, `uptime` or `ps` print. The output is not misrepresented as evidence from Steward or the learner's machine.
- Added a browser regression assertion to ensure the illustrative output is actually rendered in the learner UI. Source commits: `13ec9dc`, `4ab9872`, `721361c`. As always, source and browser CI must pass for the exact latest commit before acceptance.

## Batch 88 — Real command-output formatting and executable Linux probes (2026-10-17)

- Corrected the CPU inventory worked-output string so the learner's rendered output section uses actual line breaks, not literal backslash-n characters (`8ce5633`). The browser and application jobs passed: [39034200701](https://github.com/enoqueJonas/tsa/actions/runs/39034200701).
- Improved Rocky Linux package-manager teaching: the DNF package-check command and caption now distinguish `dnf check-update` status 0 (no updates), 100 (updates available) and 1 (error), so beginners do not treat a normal update-detection result as a failed command (`5f656da`, `d84fb95`).
- Added `scripts/check-platform-os-observations.py` and a CI step to execute actual non-destructive examples on the disposable Linux Actions runner: `nproc`, bounded `vmstat 1 5`, `/proc/<current PID>/status`, `/proc/<current PID>/fd` and `stat /var` (`ac6ad61`, `68e6dd9`). This supplies actual execution evidence from CI's Ubuntu runner, not certification of the user's Rocky Linux/Proxmox homelab.
- The latest source execution CI must be checked before asserting acceptance. Activity-level qualitative review and real lab sign-off remain pending.

## Batch 89 — Disposable filesystem exercise and worked-output line-break verification (2026-10-17)

- Added a full-journey browser assertion that CPU output is rendered as separate terminal lines rather than escaped text. The source examples remain clearly labeled illustrative, not generated from the learner host. Commit `7660596`.
- Added an isolated filesystem practical exercise (`scripts/check-platform-filesystem-drill.py`) and CI step that create a temporary file, symlink it, inspect `stat`/`ls`, set and independently verify POSIX mode 0640, determine backing storage with `df` and `findmnt`, and observe a dangling symlink when the disposable target is deleted. No real host files are altered. Commits `3779119`, `960aa02`.
- The filesystem execution job's passing status must be checked on [run 39034636184](https://github.com/enoqueJonas/tsa/actions/runs/39034636184) before marking the new lab evidence validated. As always, this is Ubuntu Actions runner execution, not real NAS, Windows, Rocky, or Proxmox sign-off.

## Batch 90 — CPU/load interpretation and filesystem worked output (2026-10-17)

- Expanded the Computer/OS CPU worked example's caption to explain that Linux one-/five-/fifteen-minute load averages are not CPU utilization percentages and must be compared with available CPU capacity, command behavior and observations over time (`23b4bf4`).
- Added a labeled illustrative filesystem output block and explained the distinct purposes of `findmnt`, `lsblk -f`, `df -hT`, `du` and `stat` (`2385e4f`); revised the example to avoid referencing a command not displayed (`bb4dd74`). Illustrative device names and capacities are **not** observations of the learner's machine.
- Added a browser check that the Filesystems reading actually renders its worked output (`2b353c8`). Full CI for the newest commit is required before claiming that new check has passed. These are targeted pedagogical improvements, not full lesson-by-lesson qualitative certification.

## Batch 91 — Process and threads diagnostics pedagogy (2026-10-17)

- Confirmed the previous Batch 90 latest GitHub Actions run [39035005423](https://github.com/enoqueJonas/tsa/actions/runs/39035005423) passed both validation and learner-browser jobs, including the filesystem worked-output rendering check.
- Improved the Computer/OS process/thread lesson to explain process parent/child information, lightweight process (LWP) thread identifiers and the key distinction between the current shell PID (`$$`) and Steward's real service PID. Added a clearly illustrative `/proc/<PID>/status` worked-output excerpt (`c95cb3a`). This prevents beginners from mistaking observations of their own shell for measurements of Steward. The specific change must pass its exact-head CI before marking accepted.
- The source correction supplies explanation and example but does not claim a production service was inspected or restarted. Real-service failure/recovery proof remains a separate lab gate.

## Batch 92 — Process inspection example alignment and executed procfs fields (2026-10-17)

- Aligned the actual learner-facing process/thread commands with the teaching narrative: print the current shell PID, inspect precisely `Name`, `Pid`, `PPid`, and `Threads` in that shell's `/proc` status, and inspect its file descriptors. This explicitly avoids conflating the shell with the Steward process. Source commit `c61f636` fixes an escaped replacement regression that initially removed the second `$` from `sample_pid=$$`; the curriculum integrity audit caught the defect.
- Extended the non-destructive Linux CI drill to execute a real `grep` against `/proc/<current Python PID>/status` and assert all four fields are present (`ff6c169`). Evidence comes from the ephemeral Linux runner, not a live Steward, Proxmox or Rocky lab.
- The earlier intermediate CI builds were not all green because the integrity guard correctly rejected the malformed shell PID. Verify the final run before marking this batch accepted. Subsequent browser traversal remains required.

## Batch 93 — Journal evidence preconditions and bounded output (2026-10-17)

- Confirmed the Batch 92 final Actions run [39036438990](https://github.com/enoqueJonas/tsa/actions/runs/39036438990) completed successfully for validation and browser checks after the corrected `sample_pid=$$` shell expansion.
- Reviewed Linux Administration 'Logs and journalctl'. Removed an outcome that prescribed follow-mode while the worked command intentionally uses bounded output. Clarified `--since`, `-n 30`, `--no-pager`, `-b`, and the prerequisite of using an existing service unit; an empty journal is not evidence that a service is healthy. Source commit `cf8d715`.
- The lesson remains a host-level lab requiring the learner's actual systemd unit and a controlled failure event; the GitHub Actions Ubuntu runner cannot certify a real Steward service journal.

## Batch 94 — Linux service lifecycle and permissions preconditions (2026-10-17)

- Improved the Linux Administration systemd lesson to explain the required existing `steward.service` unit, the difference between `daemon-reload` and `enable --now`, why ActiveState does not establish application health, and why learners must not mutate unfamiliar host or production units (`fb7f374`).
- Improved the permissions lab caption to distinguish file mode `640` from parent-directory traversal requirements and to require verified lab paths and an existing service account before running `chmod` and `chown` (`3dad1fa`). This is a source-level pedagogical correction, not an executed production service or privileged filesystem change.
- The latest CI workflows must complete before either change is accepted. Actual systemd service operations on a learner VM and a real endpoint response remain outstanding.

## Batch 95 — Disposable directory traversal check (2026-10-17)

- Extended `scripts/check-platform-filesystem-drill.py` to create a private temporary directory and file, set the directory mode to 0600 (no execute/traversal), independently inspect it with `stat`, and restore 0700 before reading the contents. This provides a controlled demonstration that directory traversal permission is distinct from file content mode; it does not mutate host application paths. Commit `79980b0`.
- Linux Administration service and permission explanatory captions from Batch 94 remain part of the learner content. The latest Actions run must pass its full validation and browser jobs before the new drill is counted as accepted. Real Rocky/Proxmox/Windows labs remain unverified.

## Batch 96 — Independent child-process failure and HTTP recovery (2026-10-17)

- Added `scripts/check-platform-process-recovery.py` and wired it into the validation job. It launches a real disposable Python HTTP service as a child process, verifies its health response, sends SIGTERM, confirms the child exits and HTTP becomes unreachable, starts a new process on the same port, and confirms the HTTP response is restored. This is separate from the existing in-process HTTPServer lifecycle drill. Commits `44706f8`, `12a4917`.
- Initial CI exposed an incorrect newline-byte expectation in the new response assertion: the actual child response ended with a newline, while the parent test expected a literal escaped backslash-n. Corrected in `1646f20`, rather than weakening the observable HTTP recovery assertions. The corrected validation job passed in [39037594618](https://github.com/enoqueJonas/tsa/actions/runs/39037594618); final browser completion should be checked separately.
- This is real process termination and loopback HTTP verification in a disposable Ubuntu runner. It does not certify systemd unit restart policy, Rocky Linux, Steward's actual endpoint, Proxmox, networking or Windows exercises.

## Batch 97 — Disposable systemd service-unit verification (2026-10-17)

- Added `scripts/check-platform-systemd-unit.py`, which writes an isolated `tsa-steward-synthetic.service` file in a temporary directory, invokes real `systemd-analyze verify`, and checks that the sample explicitly declares `Restart=on-failure` and `NoNewPrivileges=true`. The test does not install, enable, or start units on the CI host. Commits `1d16653`, `50d5bfc`.
- The source validation job passed on [39037782353](https://github.com/enoqueJonas/tsa/actions/runs/39037782353), including the new systemd syntax check. Full learner-browser completion is required for an overall green run.
- Syntax validation, restart-policy configuration, disposable SIGTERM process recovery, and systemd-managed recovery are **distinct claims**. The real systemd manager, Rocky Linux, Steward health endpoint and VM boot/restart behavior remain unverified until controlled lab execution.

## Batch 98 — systemd validator negative control (2026-10-17)

- Extended `scripts/check-platform-systemd-unit.py` to verify that the same `systemd-analyze verify` invocation rejects a deliberately nonexistent `ExecStart` binary in an otherwise valid disposable unit. This negative control demonstrates the audit can detect a real unit error rather than merely reporting positive results. Commit `6e72538`.
- The isolated CI validation job passed on [run 39037931106](https://github.com/enoqueJonas/tsa/actions/runs/39037931106), including the new negative control; full browser completion is a separate gate.
- This remains static systemd-manager tooling verification, not an actual daemon lifecycle or automatically supervised recovery test.

## Batch 99 — Non-root systemd example policy guard (2026-10-17)

- Verified the preceding Batch 98 workflow [39038005706](https://github.com/enoqueJonas/tsa/actions/runs/39038005706) completed successfully for both validation and the full learner-browser journey.
- Strengthened `scripts/check-platform-systemd-unit.py` so the disposable example must explicitly run with `User=nobody` rather than root and retain `Restart=on-failure` rather than switching silently to unconditional restart. This verifies that a syntax-valid example still maintains the chosen least-privilege and restart semantics. Commit `a8e1245`.
- The check is policy-specific and does not prove actual systemd-managed restart. Exact-head CI status must be checked before acceptance.

## Batch 100 — Real systemd-manager lab procedure, deliberately not certified (2026-10-17)

- Added `scripts/platform-systemd-recovery-lab.sh` for **manual execution on a dedicated, learner-owned Rocky Linux VM**, not on the CI runner or a work machine. The script requires systemd PID 1 and a non-root sudo-capable operator. It creates a disposable localhost-only Python HTTP service in a temporary directory, installs a uniquely named systemd unit, checks initial MainPID and `/health` response, kills the main process, waits for **systemd-managed automatic restart** with a different PID, independently checks application-level HTTP recovery, prints bounded journal evidence and removes the lab service in an exit trap. Commit `2a22787`.
- Added CI `bash -n` syntax validation without privileged execution (`4c052f8`). Syntax-check success is not evidence of systemd-manager behavior; **real lab execution, automated restart evidence and Rocky Linux certification remain unverified** until a learner executes the script and retains output. Do not run this lab on production or FNB infrastructure.
- Prior CI systemd unit tests remain static: `systemd-analyze verify` and policy assertions are useful but cannot replace a live systemd manager. No VM was created or accessed during this batch.

## Batch 101 — Live-manager recovery evidence strengthened (2026-10-17)

- Confirmed Batch 100 [39038426147](https://github.com/enoqueJonas/tsa/actions/runs/39038426147) passed both CI jobs, including bash syntax checking for the dedicated-VM systemd lab.
- Extended the **unexecuted** Rocky Linux systemd recovery lab to require systemd's own `NRestarts >= 1` after forced process failure and an observed `Restart=on-failure` policy, in addition to a changed PID and independently successful HTTP response (`1dd3598`). This closes an evidence loophole where a new process could otherwise appear without a recorded systemd restart.
- Added an early sudo authorization check and a named operator prerequisite (`90d33ea`). The lab still writes and removes its own temporary service unit, and must only be run on a dedicated VM with authorization. The test remains syntax-checked in CI; **no running systemd manager was exercised** by this batch.

## Batch 102 — Disposable TCP/UDP and local resolver execution (2026-10-17)

- Added `scripts/check-platform-network-foundations.py` to execute independent loopback TCP connection/request/response, UDP datagram request/response, and local hostname resolution via the runner's configured resolver. Connections bind only to `127.0.0.1`, with no external dependency. Commits `6efd42c`, `92d27f5`.
- This evidence addresses foundational differences between connection-oriented TCP, datagram UDP and hostname-to-address resolution. It does **not** certify routed traffic, firewalld rules, authoritative DNS, DHCP, WireGuard, real Proxmox networking or remote clients. The new test's CI validation result must be checked before acceptance.

## Batch 103 — Disposable backup, restore, and corrupted-backup detection (2026-10-17)

- Added `scripts/check-platform-backup-restore.py`, executed as part of the Linux CI validation job (`688633f`, `176d37e`). It creates disposable configuration and records files; stores SHA-256 fingerprints; copies the files to a distinct backup directory; deliberately changes and deletes live files; restores independently from the backup; verifies file inventory, exact hashes and expected record count; then corrupts the backup and confirms the checksum mismatch is detected.
- Source validation including this drill passed in [39038924538](https://github.com/enoqueJonas/tsa/actions/runs/39038924538). The same run's learner-browser job had not finished when this entry was written. The script demonstrates a local file backup/restore lifecycle on a disposable Ubuntu runner, **not** real NAS, database-consistent snapshots, Proxmox backups, offsite durability or disaster recovery.

## Batch 104 — Delivery Engineer rollback compatibility gate (2026-10-17)

- Began the outstanding Delivery Engineer pedagogical audit rather than extending only Platform Builder. The Continuous Delivery `Rollback` practical now requires inspecting database migration history, acknowledged asynchronous messages and writes since deployment **before** reverting to the previous application image. It also requires explicit compatibility evidence for database/schema and asynchronous paths, and a named recovery owner for non-reversible side effects (`26d2f45`).
- This is a curriculum acceptance-criteria change, not an executed Steward release rollback. The full Delivery Engineer lesson-by-lesson and curriculum-wide reviews remain in progress. Check the new commit's CI before accepting it.

## Batch 105 — Delivery Engineer approval invalidation and partial deployment gates (2026-10-17)

- Delivery `Release Approvals` practical now requires testing approval invalidation after a candidate digest change, recording protected approval/deployment roles, and tracing the approver to the actually deployed candidate (`f00a508`). This prevents a generic approval from authorizing a subsequently altered image.
- Delivery `Deployment Automation` practical now requires deliberately interrupting the multi-role rollout and proving that a partial deployment is detected, recovered or clearly blocked—not silently accepted as success (`105964d`).
- These are improved learner evidence requirements, **not** claims that a real GitLab promotion or Steward deployment was executed. Both await completed CI verification.

## Batch 106 — Delivery Engineer expand/contract migration rehearsal (2026-10-17)

- Strengthened the `Database Migrations During Deployment` practical in `delivery-continuous-delivery-quality.ts` to require an additive expand phase with old and new API/workers, deferral of destructive schema changes until consumers have migrated, and a simulated failed or partial backfill with evidenced restart/repair semantics (`917b07b`).
- Acceptance criteria now distinguish observed old/new compatibility, resumable backfills and schema rollback from application rollback. This is a curriculum exercise specification, **not an executed database migration on Steward**. Check the final GitHub Actions validation/browser run before acceptance.

## Batch 107 — Delivery CI failure propagation and credential trust boundaries (2026-10-17)

- Strengthened Delivery Engineer `Jobs, Stages and Dependencies` to require an *executed* failed-job rehearsal proving GitLab dependency propagation and prevention of image publication after a required check fails. Previous requirements allowed a prediction alone (`f0d9fb9`).
- Strengthened `Secrets and Variables` to test log/artifact leakage with a disposable canary (never real credentials), and require an untrusted merge-request pipeline to demonstrate it cannot access protected release secrets or publish images (`f0d9fb9`). These are learner lab requirements and are not assertions that a private GitLab instance has been exercised by the audit.
- Latest source/browser CI is pending; see the latest GitHub Actions run for exact-head verification.

## Batch 108 — Delivery release digest drift and running-role identity (2026-10-17)

- Strengthened `Promotion and Gates`: a disposable mutable-tag replacement must be detected by immutable image digest comparison and must block the promotion, even if a human-readable tag remains unchanged (`f705389`).
- Strengthened `Deployment Evidence`: the accepted image digest must be independently verified on API, outbox-publisher and lifecycle-consumer; a mixed-role rollout cannot be counted as successful merely because the API is healthy (`f705389`).
- This is a learner practical-evidence requirement, not a claim that Nexus/GitLab or live Steward roles were exercised by the curriculum audit. Exact-head validation and learner-browser results still need confirmation.

## Batch 109 — Delivery Ansible idempotency negative control (2026-10-17)

- Updated `Desired State and Idempotency` in Delivery Configuration Management. Beyond first-run, second-run and repair evidence, the learner must compare Ansible check-mode predictions with actual repair, document unsupported/inaccurate check-mode behavior, and deliberately introduce an invalid desired state in a disposable test resource to prove that the play fails visibly rather than falsely reporting convergence (`6841fb3`).
- This updates practical teaching/acceptance criteria; it does **not** claim a learner-owned Rocky host or Ansible control node was operated. Exact-head CI remains a separate acceptance gate.

## Batch 110 — Ansible template validation before handler changes (2026-10-17)

- Updated the Delivery Engineer `Playbooks` exercise to test an invalid configuration in a disposable lab, use a validation command before installing a managed file, and verify that the previous valid configuration is preserved without triggering a service restart (`4dc38af`). This distinguishes handler change detection from safe configuration application and does not claim Ansible provides general transactional rollback.
- Evidence remains a learner practical requirement, not an executed Rocky Linux/Ansible exercise. CI validation is necessary but does not certify host behavior.

## Batch 111 — Delivery artifact retention and provenance rejection gates (2026-10-17)

- Audited the Delivery Artifact Supply Chain practical contracts. `retention-cleanup` now requires a digest-based inventory of live and rollback dependencies, a dry-run deletion policy that **rejects** deletion of active/rollback images, and safe deletion proof only for an unreferenced disposable artifact (`477fa35`). Age-only cleanup is insufficient.
- `provenance` now requires actual source revision, trusted build-run/runner and publisher evidence, an independent registry digest lookup, and a **negative test** where a mismatched source/run/digest tuple must be rejected (`30b9e24`). Mutable tags are not accepted as provenance.
- These are strengthened learner acceptance criteria; they do not claim live Nexus/GitLab verification. Exact-head CI success must be checked before accepting this batch.

## Batch 112 — Independent Python/npm package consumption and registry fail-closed evidence (2026-10-17)

- Strengthened Delivery Artifact Supply Chain practical contracts for `consume-pip` and `consume-npm-pnpm`: a fresh consumer with no producer checkout/workspace link or cached package must prove effective approved registry origin, pinned version and cryptographic content hash/integrity, and a negative test where the approved registry is unavailable must not silently resolve from unapproved sources (`288ffff`).
- These are learner evidence requirements, not actual Nexus/PyPI/npm pipeline execution by the audit. Previous batch 111 exact-head CI [39039938120](https://github.com/enoqueJonas/tsa/actions/runs/39039938120) passed both jobs. Check current exact-head CI separately.

## Batch 113 — Supply-chain SBOM and signing trust-negative tests (2026-10-17)

- Confirmed Batch 112 [39040353269](https://github.com/enoqueJonas/tsa/actions/runs/39040353269) passed complete CI validation and learner-browser coverage.
- Strengthened Delivery `sbom` practical to require generator and immutable image digest, verification of at least five installed components against the artifact and investigation of a missing/mismatched SBOM entry.
- Strengthened `signing-provenance` to require disposable-key signature validation with tampered-content rejection and a separate unauthorized-signer rejection, distinguishing valid cryptography from authorized release provenance (`494c2a2`). These are learner exercise contracts, not an executed image signing or SBOM verification on live infrastructure.

## Batch 114 — Supply-chain vulnerability scan evidence quality (2026-10-17)

- Confirmed Batch 113 final run [39040562482](https://github.com/enoqueJonas/tsa/actions/runs/39040562482) passed CI validation and learner-browser jobs.
- Updated the Artifact Supply Chain `scanning` exercise to require exact image digest, scanner version/advisory-database freshness, component/exposure/available-fix evidence and an explicit accountable decision. Any suppressed or accepted finding must have an owner and expiration/reassessment condition; a before/after rescan or time-bound exception remains visible (`a556632`). This is an improved practical evidence contract, not a claim to have scanned a real Steward image.

## Batch 115 — Automated Delivery curriculum regression gates (2026-10-17)

- Verified the preceding Batch 114 final workflow [39040759411](https://github.com/enoqueJonas/tsa/actions/runs/39040759411) status in CI separately; the present batch extends `scripts/audit-curriculum-integrity.mjs` with cross-lesson guards for Delivery's CI publish failure, untrusted credential scope, partial deployment, changed-digest approval, failed backfill, Ansible check-mode and configuration validation, tag drift, rollback artifact retention, untrusted signing and time-bound vulnerability exceptions (`9c86e47`).
- These checks detect **removal of explicit exercise evidence clauses** in authored source; they cannot assess whether the prose is sufficiently clear, that students achieve competence, or that a real lab was executed. Exact-head CI must finish before acceptance.

## Batch 116 — Cross-school copyable-command safety inventory (2026-10-17)

- Expanded `scripts/report-curriculum-code-evidence.mjs` to flag potentially destructive **literal teaching code blocks** across runtime path sources (including root-recursive delete, broad chmod on root, and curl-to-shell patterns) with source filename and line number (`dd24b28`). Existing report already locates observable snippets without adjacent expected output; this adds an independent safety-review dimension.
- Hazard matches are **review candidates**, not blanket automatic failures: context, environment isolation and pedagogical purpose must be inspected. The AST inventory does not parse dynamically assembled output nor certify all executable examples. The report is invoked by the existing `report:curriculum-examples` CI step; the new head's CI result must be checked before acceptance.
- Prior Delivery regression-guard commit [39040847468](https://github.com/enoqueJonas/tsa/actions/runs/39040847468) passed both CI jobs.

## Batch 117 — Acted on the cross-school code evidence inventory (2026-10-17)

- Reviewed actual CI output of the code evidence scanner: 196 path TS files, 406 code records, **17** potentially observable literal examples lacking adjacent output evidence, and **0** matched potentially unsafe literal command patterns. Zero pattern matches is not proof of universal command safety; dynamic examples and context are outside the scanner's full coverage.
- Manually reviewed flagged API and networking examples. The Web/API `example.test` curl commands are explicitly identified as non-executable templates with behavior dependent on an authorized host; adding fabricated expected responses would be misleading. The Networking TCP/UDP `ss` example needed stronger guidance: now explains the `-ltnp`/`-lunp` flags, privilege-dependent process details, UDP limitations, loopback binding, and an explicitly illustrative listener row (`4911631`).
- Additional flagged examples remain for review; this is not a completed cross-school lesson-by-lesson audit. Exact-head CI remains an acceptance gate.

## Batch 118 — DNS vs host lookup teaching correction (2026-10-17)

- Reviewed the Networking `DNS and Local Naming` example from the cross-school code-evidence report. Clarified that `dig` tests DNS, `getent hosts` follows the local host-resolution policy (which may include `/etc/hosts`), and `resolvectl` depends on systemd-resolved being available. A successful lookup is not proof of a working TCP/HTTP endpoint; a missing `steward.lab` DNS record on an unconfigured learner VM is not an application defect (`bd2f563`).
- All examples remain explicitly environment-dependent; no fabricated resolver output was added. CI source/build/browser outcomes for this batch must be checked separately.

## Batch 119 — Network firewall and TLS diagnostic explanation (2026-10-17)

- Reviewed two additional cross-school code-evidence candidates in Networking. Firewall caption now distinguishes the default zone from active interface zones (`firewall-cmd --get-active-zones`), local sockets from authorized remote reachability, and cautions against disabling firewalld as a diagnostic shortcut. TLS caption distinguishes TLS handshake from certificate hostname/chain verification and from meaningful HTTP health; bypassing verification with curl `-k` is not accepted as success (`39d88f0`).
- These are learner-facing explanatory corrections, not a live firewalld or TLS endpoint certification. Verify current CI before acceptance.

## Batch 120 — Network troubleshooting observable outcomes (2026-10-17)

- Acted on the cross-school code inventory finding in Platform Networking `Network Troubleshooting Tools`. Expanded the example caption to explain `ip` address/route/neighbor evidence, local `ss` socket scope, DNS isolation with `dig`, why blocked ICMP or traceroute asterisks are not definitive failures, and three *hypothetical* symptom-to-cause interpretations without presenting fabricated runtime captures (`aa7f1e4`).
- These teaching notes do not prove any live Steward endpoint was diagnosed; exact-head CI and broader cross-school review remain separate tasks.

## Batch 121 — Virtualization guest network output interpretation (2026-10-17)

- Reviewed cross-school code-evidence candidate `platform-builder-virtualization-deep.ts` (guest networking inspection). Expanded its caption to explain IP/interface, route, neighbor-cache and listener evidence, empty neighbor caches, permission-dependent `ss -p` output, and why a loopback-only listener cannot accept guest-LAN connections (`eb26a98`). Actual command output remains dependent on the learner's guest and is not fabricated.
- This is a teaching correction; actual virtualization/network verification remains the learner's lab. Source-head CI requires separate confirmation.

## Batch 122 — Reviewed and corrected five observable examples across three schools (2026-10-17)

- Confirmed Batch 121 final workflow [39041581176](https://github.com/enoqueJonas/tsa/actions/runs/39041581176) passed both jobs.
- **Engineering Apprentice:** documented expected shell-workspace output and overwrite caution, explained why `$?` applies only to the immediately preceding command, and added prerequisite/observable Git history guidance for a disposable practice repo (`2193009`).
- **Platform Builder Linux Administration:** explained how pipeline exit status can mask an upstream failure, and clarified metadata/symlink evidence and cleanup boundaries in the temporary-file sample (`e306158`).
- **Quality Engineer CI:** distinguished an illustrative GitLab stage list from jobs that actually run and required visible failing Failsafe/JUnit/GitLab evidence and downstream publication blocking (`18e89d9`, `18e8249`).
- These are source-content corrections based on specific code-evidence inventory candidates; they are not a complete audit of all 196 path files or evidence of live GitLab execution. Exact-head CI verification pending.
