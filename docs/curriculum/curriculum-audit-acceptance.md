# TSA curriculum audit: verified gates and remaining acceptance work

Last evidence checked: 2026-10-17. Branch: `curriculum/oop-depth-reconstruction`.

## Verified automation

- The curriculum source-integrity audit runs against authored Runtime Kernel paths.
- The standard-library Delivery release-identity fixture rejects an unauthorized source/run, altered digest, missing role, and mutable tag substituted for a digest. It is not a Nexus/Docker deployment.
- The learner-browser workflow traverses all **328 Platform Builder activities** across 15 modules, exercising displayed reading, practical, reflection, code and navigation.
- Nine separate browser jobs traverse all displayed activities across the other academy schools, checking rendered text, code blocks and progression. This is **synthetic UI coverage**, not an assessment of engineering competence.
- On source commit `b0501a9f2`, workflow https://github.com/enoqueJonas/tsa/actions/runs/39046349251 passed validate, Platform Builder browser and all nine cross-school browser jobs.
- On source commit `4b990a816`, workflow https://github.com/enoqueJonas/tsa/actions/runs/39048463646 adds a mobile 390px check of the first two activities in each of those nine schools. Its exact-head outcome should be checked in GitHub Actions.

## What CI does *not* certify

- That concepts are introduced in an understandable order or explained adequately for their intended audience.
- That all code blocks show expected output where it is pedagogically useful, or that each output is executable in the documented learner environment.
- That the user completed live Steward, Rocky Linux, GitLab, Nexus, DNS, Kubernetes, PKI or other infrastructure laboratories.
- That the curriculum's systems can be recovered after actual failure or that learners can perform the work without instructions.
- That responsive UX is visually acceptable across every page and device.

## Acceptance tasks still requiring human and live-lab evidence

1. Audit conceptual dependencies lesson by lesson, especially class/instance/state, constructors and `self`, functions, decorators, CI stages, Ansible modules, artifacts and provenance. An advanced lesson may assume earlier material but may not silently rely on an untaught concept.
2. Triage the `report:curriculum-examples` candidate list, adding genuine expected outputs or output explanations to runnable, deterministic commands and distinguishing environment-dependent observations from fabricated output.
3. Conduct learner-focused reviews of the shortest rendered readings reported by each browser job. Length alone is not a quality score; reviewers must judge coherence, sequence, examples and practice.
4. Run the explicit Rocky VM systemd failure/restart exercise on a learner-owned VM, and separately verify a real Ansible idempotency/change-mode and invalid-config rejection lab.
5. Execute GitLab/Nexus publish-consume, independent digest checks, signer trust controls, artifact retention and restore/recovery against controlled infrastructure; do not substitute synthetic fixtures.
6. Review screenshots and responsive reading width, sidebar density and resource cards across desktop/mobile; inspect actual outputs rather than assuming CI overflow assertions imply good UX.
7. Repeat the above after major curriculum authoring changes and record precise artifacts, failures, fixes and retest evidence.

## Completion meaning

**Automated navigation and structural coverage is green** for the named verified commit. **Qualitative pedagogical certification and live operational certification remain open** until the acceptance tasks above produce independently reviewable evidence. A synthetic reflection or a checked checkbox is never proof of skill.
