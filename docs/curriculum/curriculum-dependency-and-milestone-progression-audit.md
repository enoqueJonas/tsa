# Curriculum Dependency and Milestone Progression Audit

## Status

**OPEN — mandatory before TSA curriculum closure.**

The curriculum now has broad enterprise capability coverage and a clean build, but those facts do not prove that the learner encounters capabilities in the right order or that each module culminates in meaningful implementation. This audit treats curriculum sequencing and milestone design as first-class correctness properties.

## Trigger

Two concrete Platform Builder defects exposed the need for this audit:

1. **Proxmox VE Homelab Platform currently appears before Building the Budget Homelab.** The learner is therefore asked to operate the selected hypervisor before the physical homelab has been deliberately designed/built.
2. Some deep modules culminate in a **reassessment/ADR exercise** when the more appropriate milestone is to **build and prove the capability itself**. For example, Proxmox ends with `Reassess the Homelab Virtualization Architecture`, and Enterprise Storage/NAS ends by reassessing virtual versus physical NAS. Reassessment is valuable, but it must not substitute for the implementation milestone.

These are treated as symptoms, not isolated defects.

---

## Audit question

> Does every TSA module appear after the capabilities it genuinely depends on, before the capabilities that consume it, and culminate in an implementation/operation milestone appropriate to the learner's current stage rather than merely a planning, comparison or reassessment artifact?

The audit must cover **all 12 schools**, not only Platform Builder.

---

## Part A — Dependency-order audit

For every learning path/module, record:

- prerequisites the learner must already possess;
- artifacts/infrastructure the module expects to exist;
- capabilities the module creates;
- later modules that consume those capabilities;
- whether the current school/path order satisfies those dependencies;
- whether a prerequisite is taught too late;
- whether a module accidentally assumes infrastructure that has not yet been built;
- whether an earlier module unnecessarily depends on a later technology;
- whether cross-school dependencies are explicit and valid.

### Ordering rule

The preferred progression is:

**understand → design → build → configure/integrate → break/diagnose → operate/recover → reassess/evolve**

A module must not begin at `operate` or `reassess` when the learner has not yet built the underlying capability.

### Platform Builder sequence requiring immediate review

At minimum, test this dependency chain:

**Computer/OS foundations → Linux administration → networking foundations → Packet Tracer network engineering → virtualization foundations → bare-metal foundations → design/build the homelab → Proxmox platform → storage/NAS → core DNS/DHCP/time → configuration management → OS lifecycle → Windows/mixed enterprise → enterprise file/directory services → file/batch integration → Platform Builder milestone**

This is a hypothesis to validate against the actual lesson dependencies, not an ordering to copy blindly.

---

## Part B — Milestone implementation audit

For every module/path, inspect the final substantial project/gate and classify it as:

1. **Build milestone** — creates the capability/system for real.
2. **Integration milestone** — connects an already-built capability to the continuing Steward/platform environment.
3. **Operational milestone** — proves failure, diagnosis, recovery, maintenance or lifecycle operation.
4. **Migration milestone** — performs a justified replacement/cutover with coexistence and rollback.
5. **Reassessment milestone** — ADR/comparison/review of an already implemented capability.
6. **Paper-only milestone** — design/comparison artifact without sufficient implementation evidence.

### Milestone rule

For implementation-oriented TSA modules, categories 1–4 should normally be the **primary culmination**. Category 5 is usually a final reflection **after** implementation, not the milestone itself. Category 6 is acceptable only where the target competency is intentionally conceptual/design-oriented or physical execution would be unsafe, legally constrained or unjustifiably expensive.

A module should therefore usually follow:

**build it → prove it → break it → recover/operate it → reassess it**

not:

**study it → discuss it → reassess whether to build it**.

---

## Part C — Physical-versus-virtual progression audit

Do not force physical infrastructure merely to make a module feel enterprise-like.

For infrastructure such as NAS/storage, directory services and other platform services:

1. implement the capability in the **smallest realistic environment** first;
2. virtualize it when virtualization preserves the learning objective;
3. expose and document the shared failure domain honestly;
4. operate and recover the virtual implementation;
5. reassess whether workload, capacity, availability, performance or recovery evidence justifies physical independence later.

### NAS correction principle

The NAS path should not make `virtual versus physical NAS` the primary achievement. A better progression is:

**build a real virtual NAS on Proxmox → attach/manage storage → expose NFS/SMB → consume it from another VM → inject failures → back up and restore data → document the Proxmox shared failure domain → define measurable triggers for moving to dedicated physical NAS hardware.**

Physical NAS becomes an evidence-driven evolution, not an up-front purchase requirement.

### Proxmox correction principle

The Proxmox path should culminate in an **operated virtualization platform**: installed hypervisor, repeatable Rocky guests, networking, storage mapping, backup/restore, failure localization and maintenance evidence. `Reassess the Homelab Virtualization Architecture` may remain as a closing ADR/reflection, but it must not function as the module's primary milestone.

---

## Part D — Continuing-system progression audit

TSA uses Steward and the homelab as continuing systems. For each module verify that its milestone advances one of them rather than producing an isolated throwaway exercise whenever integration is reasonable.

Ask:

- What exists before this module?
- What new capability is now added?
- What concrete artifact remains afterward?
- Which later module will consume it?
- Is the learner operating a progressively richer system, or repeatedly starting disconnected labs?

Throwaway/disposable labs remain appropriate for destructive fault injection and bounded comparisons, but the primary successful implementation should normally leave the platform more capable.

---

## Part E — Reassessment placement audit

Reassessment is still mandatory because TSA teaches stewardship rather than blind tool adoption. The correction is about **placement**, not removal.

A reassessment lesson should verify:

- whether the implemented solution still fits the requirement;
- measurable limitations discovered during operation;
- triggers for scaling, replacing or decommissioning it;
- alternatives and their trade-offs;
- ownership and failure-domain changes;
- whether additional complexity is actually justified.

It belongs after enough implementation/operational evidence exists to make the decision meaningful.

---

## Required audit table

For every module/path across all schools, produce a row with:

| School | Module | Current position | Required prerequisites | Capability produced | Current culmination | Culmination class | Ordering issue? | Milestone issue? | Required remediation |
|---|---|---:|---|---|---|---|---|---|---|

Do not mark a module `OK` from its title alone. Inspect its actual lessons, activities, milestone and references to earlier/later infrastructure.

---

## Adversarial checks

The audit must specifically search for:

- technology used before its foundation module;
- infrastructure operated before it is designed/built;
- later-created credentials, DNS, storage, identity or observability assumed earlier;
- `reassess`, `compare`, `design`, `plan`, `ADR`, `architecture record` or `decision record` acting as a substitute for implementation;
- modules whose practical labs are strong but whose displayed/final milestone understates the real achievement;
- physical-hardware requirements where a realistic virtual implementation should be primary;
- isolated labs that should instead extend Steward/the homelab;
- duplicated build milestones for a capability already built earlier;
- migration exercises without an existing source implementation;
- operation/recovery exercises without a previously established healthy baseline;
- final school milestones that do not integrate the capabilities taught in that school.

---

## Remediation rules

1. **Reorder before rewriting** when content is correct but dependency placement is wrong.
2. **Promote implementation to the milestone** when a module already builds the capability but ends with a weaker reassessment artifact.
3. **Add implementation work** when the module genuinely never builds what it claims to teach.
4. **Keep reassessment after implementation** rather than deleting stewardship reasoning.
5. **Prefer virtual-first infrastructure** where it preserves the competency and budget constraints; require physical separation only when the learning objective depends on a separate failure domain or hardware behavior.
6. **Preserve scenario-forced technology learning**: do not turn the audit into a tool checklist or infrastructure zoo.
7. **Preserve stage-appropriate scaffolding**: early schools may give concrete requirements; later schools should increase decision ownership.
8. **Do not introduce new technologies solely to repair sequencing.**

---

## Completion criteria

This audit closes only when:

- all 12 schools have been inspected path by path;
- every path has explicit prerequisite/consumer reasoning;
- all confirmed ordering defects are remediated;
- every implementation-oriented path has a meaningful build/integration/operation/migration culmination;
- reassessment activities follow rather than replace the relevant implementation where appropriate;
- virtual-versus-physical decisions are evidence-driven;
- continuing Steward/homelab progression is coherent;
- no new backwards dependency is introduced by remediation;
- the final curriculum order is documented;
- `pnpm build` succeeds from the resulting `master`.

A clean build is the final technical gate, **not evidence of pedagogical correctness**.
