# PED-005 — Platform Builder learner-order review, modules 1–2

**Date:** 2026-11-02  
**School scope:** only Platform Builder (15 paths). This evidence is a **partial school pass** for its first two paths, not completion of the entire school or human learner validation.  
**Source baseline:** `platform-builder-computer-os-deep.ts`, `platform-builder-computer-os-quality.ts`, `platform-builder-linux-administration-deep.ts`, `platform-builder-linux-administration-quality.ts`, `platform-builder.ts`.  
**Technical evidence:** already-existing isolated Linux observation/TCP loopback scripts plus the newly introduced **source-derived** `scripts/check-platform-builder-foundations-source.mjs` (which executes the published Python OS error example) and 15-module browser census. **Final matching-head CI pending at the time of this document.**

## Structural correction across all 15 paths

The former `platformFieldGuides` array and `path()` helper prepended **15 nominally standalone lessons** consisting of three compact operational bullet notes. The source had content useful as an operator reminder but not sufficient to teach mechanism. The resolved practical contract test perversely required these wrappers to be at least 250 characters; this has been replaced with an assertion that each first lesson is **authored** and none is the generated readiness placeholder. The browser runner's census is intentionally changed **377 → 362 activities** (all 15 modules still present). The 15 removed readiness IDs may remain in legacy learner progress data; monitor re-entry/progression and do not treat those old checklists as substantive learning achievements. Existing authored lesson IDs, including historical Rocky title slug for completed Linux installation progress, remain stable.

## Per-lesson disposition (not a word-count evaluation)

| Order | Actual lesson | Source classification | Specific reason / evidence boundary |
| --- | --- | --- | --- |
| 1.1 | CPU, Memory, Storage and I/O | **RICH / retain** | Five genuinely developed mechanisms, Linux observation examples, pressure/cache/I/O distinction and practical falsification; existing Ubuntu CI only proves low-risk read-only observations |
| 1.2 | What an Operating System Does | **TARGETED REMEDIATION COMMITTED** | Former two-section abstraction gained system-call path ENOENT/EACCES/EROFS interpretation and exact source-published temporary-file Python ENOENT, success, EBADF; CI source regression introduced |
| 1.3 | Kernel Space and User Space | **TARGETED REMEDIATION COMMITTED** | Previously compressed into privilege/root two-part discussion; now differentiates a syscall entry from process/thread context switch, and per-operation DAC/capability/SELinux checks |
| 1.4 | Processes and Threads | **RICH / retain with caution** | Process vs thread/shared resources, descriptor limits, real procfs and process-tree observation; do not use sample stopped process as proof of a real Steward workload |
| 1.5 | Filesystems | **TARGETED IMPROVEMENT OPEN** | Mounts and paths taught and supported by findmnt/lsblk/df read-only observations, but standalone filesystem-vs-device, path walk and failure/recovery reasoning still needs a closer pass |
| 1.6 | Inspect the Machine Beneath Steward API | **TARGETED IMPROVEMENT OPEN** | Good integrative baseline practical; user-managed host and Steward availability cannot be inferred from GitHub runner |
| 2.1 | Installing Rocky Linux | **TARGETED IMPROVEMENT OPEN** | Original source was actually Ubuntu text dynamically renamed; canonical text now Rocky. Real installer, SELinux baseline and DNF/RPM state on a Rocky VM still unverified |
| 2.2 | Shell Navigation and Command Fluency | **TARGETED IMPROVEMENT OPEN** | Pipelines, exit status and inspect-before-change present; need independent wrong-pipe/pipefail observation tied to novice instructions |
| 2.3 | Files and Directories | **TARGETED IMPROVEMENT OPEN** | Stat, symlink and safe disposable delete example present; verify actual distinguishing of symlink target vs directory/mount after execution |
| 2.4 | Users and Groups | **TARGETED IMPROVEMENT OPEN** | Dedicated service identity and groups taught but guest creation/negative access not run on Rocky; no broad root rights should be assumed |
| 2.5 | Linux Permissions | **TARGETED IMPROVEMENT OPEN** | DAC owner/group/other and least privilege touched, with practical tracing; verify parent-directory search and group membership with a real denied case |
| 2.6 | Package Management | **TARGETED REMEDIATION COMMITTED** | Original source taught apt/dpkg and was runtime replaced; source now directly teaches DNF/RPM and check-update exit 100; real repository/package results remain environment dependent |
| 2.7 | Processes and Signals | **RICH / retain with operational caveat** | Parent/worker, resource limits and TERM vs KILL; any forced termination limited to disposable test process |
| 2.8 | systemd and Services | **RICH / retain with platform caveat** | Service unit, ordering vs readiness and actual socket/HTTP diagnosis already authored; systemd in a real Rocky VM not proven by CI runner |
| 2.9 | Environment and Configuration | **TARGETED REMEDIATION COMMITTED** | Original code printed secrets via printenv/systemctl Environment and overwrote existing env file with /dev/null; now shows only keys/references and guarded creation after directory setup |
| 2.10 | Logs and journalctl | **TARGETED IMPROVEMENT OPEN** | Journal time/unit queries and log correlation present; synthetic service error/negative diagnosis still needed |
| 2.11 | Scheduled Tasks | **THIN / REWRITE PENDING** | Only schedule/automation principles and a cron intent example; novice needs scheduling environment, overlap, exit and recovery trace |
| 2.12 | Storage and Mounts | **THIN / REWRITE PENDING** | Mount and persistence principles with lsblk/findmnt/fstab, but mis-mounted vs read-only vs absent storage outcomes and safe recovery underexplained |
| 2.13 | SSH and Key Authentication | **TARGETED IMPROVEMENT OPEN** | Key authentication staged hardening taught and integration lab exists; independent denial and no-lockout recovery on a VM still unverified |
| 2.14 | SELinux Foundations and Troubleshooting | **TARGETED REMEDIATION COMMITTED** | Original brief supplement deepened with DAC vs MAC, process/target types, AVC evidence, semanage mapping vs restorecon effects, enforcing-mode differential; no actual Rocky AVC run claimed |
| 2.15 | firewalld and Host Network Policy | **TARGETED REMEDIATION COMMITTED** | Original command-list supplement deepened with zones, bind address vs reachability, runtime vs permanent, allowed/denied client matrix and remote access recovery; no actual two-client VM evidence claimed |
| 2.16 | Operate Steward API as a Rocky Linux Service | **TARGETED IMPROVEMENT OPEN** | Milestone connects systemd, SELinux and firewalld, but full host-level normal/failure/recovery must be performed in a learner-managed Rocky VM |

## Confirmed defects remediated in source

1. **False instructional depth:** removed the 15 short generated readiness lessons rather than lengthening them or pretending they represented module completion. Altered the structural test to reject this placeholder pattern.
2. **Wrong distribution as source of truth:** Linux was originally authored as Ubuntu/APT and recursively rewritten to Rocky/DNF at runtime. Made Rocky Linux, DNF/RPM, package state and update exit semantics direct canonical text. Removed the lexical `rockyize` transform in the quality layer. Preserved stable historical learner IDs.
3. **Unsafe secret/config example:** removed `printenv | sort` and `systemctl show ... Environment` from the lesson; display environment **keys** and systemd file references only. Ensure the parent directory exists and never overwrite an existing protected env file with an empty one.
4. **Too-shallow Linux security boundary:** expanded both SELinux and firewalld supplements into actual mechanism, worked differential diagnosis, read-only evidence and safe recovery (Unix DAC ≠ SELinux MAC; listening socket ≠ allowed remote network path; runtime ≠ permanent firewalld).
5. **Underexplained OS privilege boundary:** added a real disposable Python `ENOENT`/`EBADF` file-descriptor example and differentiated system-call privilege transition from scheduler context switch. Source regression extracts and runs the exact published program.

## Do not overclaim

A Python example running in GitHub's Linux runner is **not** a Rocky Linux SELinux test. A scripted browser traverse is **not** a human judgment of pedagogical depth. Real systemd, SSH/SELinux, firewalld, Proxmox, Packet Tracer, SMB/NFS and Windows exercises require appropriately isolated environments or must remain **UNVERIFIED**. The remaining lessons labeled TARGETED/THIN are not automatically remediated because the overall build compiles.

## Next learner-order scope

Continue **Platform Builder module 3 Networking Foundations**: currently fourteen concepts, most with only two short mechanism sections despite high-quality practice scaffolding. Check definitions and stepwise reachability first (IP/mask/subnet → neighbor/next-hop → route → TCP listener → DNS/TLS/HTTP), then continue the other **twelve** untouched paths through the school capstone. One school at a time; do not jump to Delivery Engineer yet.
