# Engineering Apprentice — Deep Curriculum Audit

Status: structural and prerequisite audit complete; resource regression recorded

## Purpose

Engineering Apprentice establishes the habits and workstation fluency required to learn the rest of TSA deliberately. It is not a miniature Builder, Platform Builder or Computer Science degree.

The learner should leave able to frame a problem, reason from evidence, debug systematically, communicate technical work and operate a basic developer workstation/repository without opaque copy-paste workflows.

## Canonical progression

1. Thinking Like an Engineer
2. Systems Thinking
3. Trade-offs
4. Debugging Mindset
5. Engineering Decisions
6. Evidence and Technical Reasoning
7. Learning as an Engineering Skill
8. Communicating Technical Work
9. Engineering Investigation
10. Terminal, Shell and Filesystem
11. Git and Version-Control Workflow
12. Developer Inspection: Processes, Ports and Text
13. HTTP from the Command Line

## Finding resolved: hidden Builder prerequisites

The original rich Apprentice path was strong on engineering reasoning but did not explicitly teach the shell/filesystem, Git or minimal developer inspection skills that later schools assume.

Added an Engineering Workbench sequence covering:
- paths/files/directories, stdin/stdout/stderr, pipes/redirection, environment variables and exit status;
- Git working tree/staging/commits/branches/diffs/remotes/conflict resolution;
- basic process/port/output inspection without turning into Linux administration;
- HTTP request/status/header/body observation from the command line.

## Boundaries

### Builder
Apprentice does not teach Python/Django/PostgreSQL implementation. It provides the workstation and reasoning prerequisites Builder needs.

### System Thinker
Apprentice introduces systems thinking as a reasoning habit. It does not teach formal context/component/data-flow modeling or enterprise integration.

### Platform Builder
Apprentice uses local process/filesystem inspection. It does not teach Linux administration, permissions/service management, networking administration or infrastructure operations.

### Delivery Engineer
Apprentice teaches local Git fundamentals. It does not teach CI/CD, artifact pipelines, release engineering or delivery automation.

### Reliability Engineer
Apprentice debugging teaches hypothesis/evidence discipline. It does not teach incidents, SLOs, observability systems or resilience controls.

## Resource quality

Existing rich lessons already contain targeted resources including:
- Software Engineering at Google;
- Google SRE troubleshooting/risk material;
- MIT Missing Semester debugging;
- Google technical writing;
- learning-science research;
- ACM ethics;
- NASA systems engineering.

The new workbench uses:
- MIT Missing Semester for shell/data-wrangling foundations;
- Pro Git for repository/branch concepts;
- MDN HTTP for request semantics.

Resources remain subordinate to practice and evidence.

## Regression questions

- Can a learner begin Builder without unexplained terminal/Git prerequisites?
- Does shell instruction stop before system administration?
- Does Git instruction teach the object/workflow mental model rather than only commands?
- Can the learner distinguish observation, inference, assumption and hypothesis?
- Can the learner debug without random-change behavior?
- Can the learner explain a trade-off without claiming a universally best technology?
- Can the learner communicate uncertainty?
- Does every exercise produce inspectable evidence?
- Are later-school concepts introduced only to the depth needed here?
