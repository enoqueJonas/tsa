# TSA Curriculum-wide Audit — Verified Coverage and Outstanding Work

Updated: 2026-10-17. Branch: `curriculum/oop-depth-reconstruction`.

## What CI proves

Workflow [39043938019](https://github.com/enoqueJonas/tsa/actions/runs/39043938019) completed successfully for all eleven jobs: source/build validation, the exhaustive Platform Builder browser job and the nine-school browser matrix. The tests traverse **2,816 learner activities across all ten schools** using isolated **synthetic** browser progress. These checks verify navigation, nontrivial rendered text, reading paragraphs, practical instruction/evidence sections, displayed code blocks, absence of obvious TODO markers and absence of JavaScript page errors. They do **not** certify the truth or clarity of the subject matter, mastery, real infrastructure execution, or external tool availability.

| School | Synthetic browser activities traversed |
| --- | ---: |
| System Thinker | 190 |
| Platform Builder | 328 |
| Delivery Engineer | 248 |
| Cloud Engineer | 297 |
| Quality Steward | 405 |
| Security Steward | 371 |
| Reliability Engineer | 397 |
| Architect | 242 |
| Technical Steward | 212 |
| Professional Engineer | 126 |
| **Total** | **2,816** |

## Confirmed defects corrected

- Browser matrix exposed reading pages that contained **only reference/resource blocks**, despite substantive lesson `body` text in source. Corrected the Technical Steward lesson families and Architect data/integration/resilience/scalability/governance families to render their actual explanatory paragraphs.
- Corrected browser test coupling when synthetic completion in one school affected later Platform Builder checks. School traversals now run in isolated contexts.
- Added executable, disposable negative tests for three-role Steward release identity and other Platform Builder systems fundamentals. The release fixture is deliberately not evidence from an actual Nexus/GitLab/Docker deployment.
- Improved exact command explanations and expected observable effects across Engineering Apprentice, Linux Administration, Networking, Virtualization, Quality CI and Delivery Release Engineering.
- Added source regression guards for Delivery Engineering approval, rollback, signature, provenance and CI negative controls.

## Still requiring human and/or real lab review

1. **Pedagogical clarity and concept order:** review lessons and practices in each school for concepts referenced before introduction (not merely rendered), deep explanations, realistic examples and appropriate pacing. Passing a browser check does not establish this.
2. **Executable code and output:** the AST inventory examines 406 authored code records and flags 17 potentially observable examples without an inline output marker. Many use contextual captions or environment-dependent commands; triage each candidate rather than fabricating stable outputs. Dynamically built samples need separate review.
3. **Authentic engineering evidence:** carry out learner-owned Rocky Linux, systemd, Ansible, real GitLab CI/CD, Nexus, image-signing, migration, recovery, security and cloud drills where available. Synthetic CI checks cannot substitute for these.
4. **Visual accessibility and editorial review:** inspect representative desktop/mobile screenshots manually, improve navigation width/density and resource-card presentation, and test keyboard/screen-reader behavior. CI smoke checks are not a complete accessibility audit.
5. **Curriculum relevance:** verify current documentation and tools at the time of a given lesson, and check the explicit Steward project stage/preconditions so examples do not assume infrastructure that has not yet been created.

## Acceptance policy

Do not mark a school pedagogically certified solely because its browser matrix is green. Preserve separate status for (a) content rendering, (b) executable synthetic tests, (c) manual pedagogical review, (d) real external infrastructure evidence and (e) accessibility. Each newly found substantive defect should receive a source fix, regression test when practical and exact-head CI verification.
