# Z0 — Rocky Linux Platform Consistency

## Decision

Rocky Linux is TSA's canonical learner-owned enterprise Linux distribution. It provides the free RHEL-compatible environment used to learn the operating-system conventions that later connect naturally to Red Hat/OpenShift-oriented work.

This is a consistency decision, not a claim that transferable Linux engineering is distribution-specific. Debian/Ubuntu conventions may be compared when useful, but TSA should not prescribe Ubuntu as the primary Steward server and then silently switch ecosystems later.

## Canonical progression

- Development workstation: whatever supported host OS the learner owns.
- First dedicated Steward server VM: Rocky Linux.
- Linux Administration: Rocky Linux with explicit RHEL-family concepts, DNF/RPM, systemd, SELinux and firewalld.
- Budget homelab guests: Rocky Linux by default unless a scenario explicitly requires another OS.
- Proxmox VE later owns the homelab hypervisor boundary; Rocky Linux remains the primary Linux guest/server environment.
- OpenShift later introduces the Red Hat enterprise platform relationship without requiring RHEL subscriptions for the earlier learning path.

## Remediation performed

The virtualization source curriculum previously retained Ubuntu-specific source material while a quality wrapper rewrote the rendered lesson tree to Rocky Linux at runtime. That made the learner-facing result mostly correct but left the curriculum source internally contradictory.

Z0 makes the source of truth itself Rocky-native:

- the virtualization reading resource is Rocky/RHEL-family aligned;
- topology examples name a Rocky Linux Steward VM;
- the VM lab installs Rocky Linux directly;
- evidence and objectives refer to Rocky Linux;
- stale Ubuntu-specific transformation logic is removed from the quality layer;
- legacy activity IDs may remain stable where changing them would unnecessarily invalidate existing learner progress. IDs are persistence identifiers, not curriculum claims.

## Boundary

Z0 does not add another Linux course. Existing Linux Administration already provides the substantive operating-system depth. Future distro-specific content must either follow the Rocky/RHEL baseline or state explicitly why another distribution is required by the scenario.
