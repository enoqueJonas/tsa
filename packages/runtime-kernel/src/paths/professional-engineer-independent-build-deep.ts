import type { Activity } from "../activities";
import type { Lesson } from "./lesson";
import type { LessonBlock } from "../activities/content";
import { buildLenses } from "./professional-engineer-build-teaching";
import { buildPrograms } from "./professional-engineer-build-proofs";

const pathId = "capstone-independent-build";
const review = "Professional Engineer standard: build from the approved proposal, but treat implementation evidence as permission to revise it. Every consequential choice must remain explainable in this new domain; working software does not excuse missing quality, security, reliability, operational or decision evidence.";

function reading(id: string, title: string, body: string, evidence: string[]): Lesson {
  const lesson = buildLenses[id];
  if (!lesson) throw new Error("Missing Independent Build source-depth instruction: " + id);
  const blocks: LessonBlock[] = [
    { type: "paragraph", text: body },
    { type: "heading", id: "what-we-are-building", text: "Understand the engineering claim before implementation", level: 2 },
    { type: "paragraph", text: "The tool-lending cooperative in this lesson is an explicitly fictional new-domain example, NOT an actual capstone or real field research. The learner's own second system must be independently discovered, justified, implemented, and verified. General TSA techniques may transfer; Steward's domain model and architecture may not be transplanted." },
  ];
  for (const [index, section] of lesson.sections.entries()) {
    blocks.push({ type: "heading", id: "mechanism-" + (index+1), text: section.heading, level: 2 });
    for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
  }
  const program = buildPrograms[id];
  if (program) {
    blocks.push({ type: "heading", id: "executable-boundary", text: "Run the real example and inspect the wrong alternative", level: 2 });
    blocks.push({ type: "code", language: "python", caption: program.caption, code: program.code });
    blocks.push({ type: "paragraph", text: program.expected });
  }
  blocks.push({ type: "heading", id: "novel-application", text: "Independent application — transfer to your actual capstone", level: 2 });
  blocks.push({ type: "paragraph", text: review });
  blocks.push({ type: "paragraph", text: "Name the original capstone requirement, its owner and source; the exact local test/command to run; one negative input; the observed result (PASS, FAIL or NOT TESTED); and a meaningful alternative or reversal trigger. Do not paste the fictional lending examples into your capstone as if they were your real product. Do not claim a live PostgreSQL, signed API, production restore, GitLab or Nexus run from a local pure-Python fixture." });
  blocks.push({ type: "resources", title: "Relevant primary reference", resources: [lesson.resource] });
  const readingActivity: Activity = {
    id: `${pathId}-${id}-001`, title, estimatedMinutes: 55,
    content: { type: "reading", body: blocks.filter((b)=>b.type==="paragraph").map((b)=>b.text).join("\n\n"), blocks },
  };
  const buildActivity: Activity = {
    id: `${pathId}-${id}-build`, title: `Build evidence: ${title}`, estimatedMinutes: 70,
    content: {
      type: "practical",
      objective: `Implement or verify ${title} in the independent capstone and preserve inspectable evidence.`,
      scenario: "Work in a new, genuinely independent capstone repository. Use the approved problem/discovery evidence and architectural proposal as a revisable hypothesis. The fictional tool-lending examples are not real data. Use only disposable systems and authorized credentials.",
      instructions: [
        ...evidence,
        ...lesson.practice,
        "Record exact source revision, setup, command, expected observation, actual observation and environment. If a live dependency is unavailable, report NOT TESTED rather than presenting simulated output.",
        "Challenge the current design with a new negative case; revise the proposal if implementation exposes a violated assumption. Preserve the rejected alternative and its revisit threshold.",
      ],
      deliverables: [`${title} implementation/evidence`, "Source revision and reproducible positive+negative command/observation", "Failure interpretation and side-effect scope", "Decision, rejected alternative and revision trigger"],
      completionCriteria: [
        "The result exists in the actual independent capstone rather than only in prose.",
        "Another engineer can reproduce it from recorded prerequisites and commands.",
        "Original input, invalid input, observed output and evidence gaps are explicit.",
        "A copied Steward domain architecture does not qualify as new-domain reasoning.",
        ...lesson.acceptance,
      ],
    },
  };
  return { id: `${pathId}-${id}`, title, activities: [readingActivity, buildActivity] };
}

function practical(id: string, title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[], estimatedMinutes: number): Lesson {
  return { id: `${pathId}-${id}`, title, activities: [{ id: `${pathId}-${id}-001`, title, estimatedMinutes, content: { type: "practical", objective, scenario: "The capstone is a second substantial system in a new problem domain, created from a blank repository. Steward is evidence that you learned the journey, not an implementation template. Reuse TSA internal products only when their contracts fit and preserve independent ownership of capstone-specific code and decisions.", instructions, deliverables, completionCriteria } }] };
}

const originalIndependentBuildLessons: Lesson[] = [
  reading("start-from-a-blank-repository", "Start from a Blank Repository", "Create a genuinely independent repository and establish only the minimum structure needed to begin. Do not fork Steward, copy its domain model, or transplant its architecture. The blank start is an assessment mechanism: it reveals whether you can reconstruct sound engineering practices from principles rather than memory of one codebase.", ["Repository history begins with the capstone rather than Steward-derived source.", "README states problem, current scope, local bootstrap and authoritative proposal links.", "Initial structure is justified by the capstone rather than TSA convention alone."]),
  reading("establish-engineering-conventions", "Establish Engineering Conventions", "Create lightweight conventions that make collaboration and automation predictable: language/tool versions, formatting/linting, commit/branch expectations, configuration boundaries, dependency handling, local commands and review expectations. Automate deterministic rules and keep human review focused on design and risk.", ["Reproducible bootstrap and documented toolchain versions.", "Automated formatting/linting/static checks appropriate to the stack.", "A small conventions record with rationale and ownership."]),
  reading("model-the-domain", "Model the Domain", "Turn the discovery/proposal model into executable domain concepts while learning from implementation. Protect invariants near the model that owns them, keep external representations from silently defining the domain, and update the glossary/decisions when real code exposes incorrect assumptions.", ["Executable model for important entities/value concepts/workflows.", "Tests or other evidence for critical invariants and state transitions.", "Recorded model changes when implementation contradicts the proposal."]),
  reading("implement-the-system", "Implement the System", "Build vertical capabilities that deliver observable stakeholder behavior rather than completing layers in isolation. Keep boundaries coherent, errors intentional, configuration externalized and interfaces understandable. Prefer the simplest code that preserves the system's required qualities; abstraction is earned by repeated or structural need.", ["Thin end-to-end increments tied to capstone outcomes.", "Clear handling of validation, errors and external interactions.", "Reviewable commits/PRs showing incremental integration rather than one final dump."]),
  reading("design-and-evolve-the-data", "Design and Evolve the Data", "Implement persistence from domain and operational requirements. Define keys, constraints, indexes, transaction boundaries, migrations and data lifecycle deliberately. Schema evolution must preserve deployability and recoverability; a migration that works only on an empty developer database is insufficient evidence.", ["Versioned schema/migrations and integrity constraints.", "Representative migration/rollback or forward-recovery evidence.", "Queries/index decisions tied to observed or expected access patterns."]),
  reading("build-infrastructure", "Build Infrastructure", "Provision the environments proposed for the capstone with reproducible infrastructure/configuration where proportionate. Separate environment-specific values from system definition, control privileged access, and make rebuild/recovery feasible. Infrastructure is part of the product's executable design, not a one-time setup screenshot.", ["Reproducible environment definition or documented justified equivalent.", "Network/access/data-service boundaries match the proposal or have a recorded revision.", "Environment creation/change evidence without committed secrets."]),
  reading("automate-delivery", "Automate Delivery", "Implement the real change-to-release path: build, test, artifact versioning, approved dependency resolution, deployment/promotion and verification. Gates should produce evidence and fail for meaningful reasons. Keep deployment logic repeatable and make rollback or recovery behavior explicit before it is needed.", ["Working CI/CD path from source to target environment.", "Immutable/versioned artifact or equivalent release identity.", "Deployment verification plus rollback/recovery evidence."]),
  reading("build-quality-evidence", "Build Quality Evidence", "Execute the risk-based quality strategy against the real system. Combine fast developer feedback, integration/contract evidence, end-to-end confidence and exploratory investigation according to actual risks. Treat flaky tests and misleading green pipelines as quality defects in the evidence system itself. Before any tsa-test-core extraction work, freeze a passing independent capstone test baseline with no tsa-test-core dependency so later reuse is proven as an extraction rather than a prerequisite.", ["Automated tests mapped to meaningful product risks.", "Exploratory or scenario evidence for risks poorly covered by automation.", "Defect/failure examples that caused tests, design or assumptions to improve.", "Passing pre-extraction capstone test baseline whose dependency graph proves tsa-test-core is absent."]),
  reading("secure-the-system", "Secure the System", "Apply the capstone-specific threat model throughout implementation: identity/access, validation, secrets, dependency/supply chain, data protection, logging, configuration and deployment boundaries. Validate controls rather than assuming framework defaults. Findings should change code, configuration, risk treatment or acceptance.", ["Updated threat model reflecting implemented boundaries.", "Security tests/scans/manual evidence appropriate to important threats.", "Tracked findings, remediation and explicit residual risk where applicable."]),
  reading("instrument-the-system", "Instrument the System", "Add telemetry that answers operational questions: what is the service doing, is it healthy, why did a request fail, what changed, and are user-relevant outcomes degrading? Design logs, metrics and traces/events around decisions and failure diagnosis, while avoiding sensitive-data leakage and high-cardinality noise.", ["Structured production-useful logging with correlation/context where needed.", "Metrics/health signals tied to service behavior rather than vanity activity.", "Demonstrated diagnosis of at least one failure using telemetry."]),
  reading("build-reliability-evidence", "Build Reliability Evidence", "Turn reliability claims into experiments and operating evidence. Exercise important failure modes, timeouts/retries where justified, degradation, capacity assumptions, backup/restore and recovery. A resilient-looking architecture diagram is not evidence that the implementation recovers.", ["Failure experiment(s) with observed behavior and follow-up.", "Capacity/performance evidence for a meaningful workload assumption.", "Recovery/restore evidence against stated objectives or explicit provisional targets."]),
  reading("operate-internal-dependencies-deliberately", "Operate Internal Dependencies Deliberately", "Treat every reused internal capability as a product relationship. If an internal product that actually exists from the learner's TSA journey fits, consume an approved version through its intended contract and respect version/provenance/support rules. If it does not fit, reject reuse explicitly. Do not create capstone-specific features inside shared packages merely to claim reuse.", ["Reuse/evolve/reject decision for each relevant internal capability.", "Approved source/version/provenance evidence for reused packages.", "Clear ownership boundary between generic shared capability and capstone-specific behavior."]),
  reading("iterate-on-engineering-decisions", "Iterate on Engineering Decisions", "Implementation is a source of architectural evidence. Revisit assumptions when latency, complexity, domain behavior, operational friction, security findings or cost differ from the proposal. Changing a decision with better evidence is professional engineering; silently drifting away from the proposal is not.", ["At least one decision revalidated using implementation evidence.", "Superseding decision record where a consequential choice changes.", "Impact assessment on tests, operations, risk and milestones."]),
  reading("document-significant-decisions", "Document Significant Decisions", "Maintain a compact decision trail for choices with meaningful consequences or difficult reversibility. Record context, alternatives, decision, evidence and consequences. Keep detailed implementation documentation close to code and use records to preserve why, not narrate every commit.", ["Current ADR/decision index with supersession links where relevant.", "Rejected alternatives preserved for consequential decisions.", "Documentation points to authoritative code/config/evidence instead of duplicating it."]),
  reading("manage-scope-and-technical-debt", "Manage Scope and Technical Debt", "Protect the capstone outcome from both uncontrolled feature growth and perfectionism. Distinguish defects, missing scope, ordinary maintenance and technical debt. Record deliberate compromises when they create future cost/risk, prioritize them by consequence, and preserve explicit non-goals as new ideas appear.", ["Updated scope/non-goal decisions as implementation evolves.", "Debt records explain future consequence rather than disliked code.", "Prioritization shows what was deferred, why and what would trigger reconsideration."]),
  practical("lab-evaluate-shared-test-capability", "Lab: Earn and Publish tsa-test-core from Two Real Products", "Use the independently built capstone as the preferred genuine second consumer that Quality Steward intentionally lacked when its independently justified stack is Java-compatible. Otherwise preserve the capstone architecture and establish a separate genuine Java test-consumer increment with its own testing purpose. Build the qualifying second consumer locally first, compare it with `steward-tests`, then extract the smallest capability demonstrably generic across both consumers. The tsa-test-core implementation is required; its contents are determined by evidence.", ["Use the already-passing independent capstone test baseline. If the capstone independently justified Java/JUnit/REST Assured, compare its repeated generic capability with steward-tests. If its justified test stack is not Java-compatible, do not rewrite the capstone merely to manufacture a second Maven consumer. Instead, complete a separate genuine Java test-consumer increment against a real independently testable system or contract: define the testing risk it owns, build a passing local baseline without tsa-test-core, and only then use its independently repeated generic capability as the second-consumer evidence. A dummy consumer whose only purpose is importing the library does not satisfy the gate.", "Retrieve the tsa-test-core candidate/handoff evidence produced by Quality Steward and compare it with the qualifying second Java consumer implementation.", "Identify at least one stable product-independent capability genuinely repeated across `steward-tests` and the qualifying second Java consumer—the capstone suite when independently Java-compatible, otherwise the separate genuine Java test-consumer increment; reject individual candidates whose contracts do not fit.", "Define the smallest public API that serves both real consumers without importing either product domain.", "Create the tsa-test-core Maven project and move only the proven generic capability.", "Add focused library tests and update both `steward-tests` and the qualifying second Java consumer to consume the local extraction.", "Run both suites and prove the extraction preserves readability and behavior.", "Version and publish tsa-test-core to Nexus, replace local project coupling with normal Maven dependency resolution in both consumers, then rerun compatibility checks from clean resolution.", "Record provenance, compatibility expectations and the process for evolving or breaking the shared contract."], ["Pre-extraction capstone test baseline", "Two-consumer duplication/evidence table", "tsa-test-core Maven project and focused tests", "Two-consumer compatibility runs", "Versioned Nexus artifact", "Dependency/provenance/versioning record"], ["The capstone is a real independent product, not a target invented to justify reuse.", "At least one tsa-test-core capability is demonstrated in both products before extraction.", "No Steward or capstone domain logic leaks into tsa-test-core.", "Both consumers resolve the same published tsa-test-core version from Nexus and remain passing.", "Rejected candidates remain local rather than being forced into the shared package.", "The required hands-on implementation is earned by two genuine compatible consumers rather than curriculum assertion; a non-Java capstone is not distorted solely to satisfy the extraction, and a separate Java consumer used instead has its own real testing purpose and passing pre-extraction baseline."], 105),
  practical("lab-deliver-the-first-end-to-end-capstone-release", "Lab: Deliver the First End-to-End Capstone Release", "Deliver the first integrated production-style capstone release through its real engineering path and use the release to expose remaining gaps before Production Readiness.", ["Select a coherent release slice that demonstrates the capstone's primary value path.", "Build and test it through the real CI path; produce a versioned artifact/release identity and dependency evidence.", "Deploy through the intended infrastructure/configuration path and verify behavior in the target environment.", "Run the planned quality and security evidence for the slice, then inspect telemetry under normal and failing behavior.", "Exercise one meaningful failure/recovery or rollback scenario and capture observations.", "Review implementation against proposal, risks, costs, operations and scope; update authoritative decisions and create a readiness-gap backlog rather than hiding unfinished work."], ["Running end-to-end capstone release", "CI/CD and versioned release evidence", "Deployment and configuration evidence", "Quality/security/observability evidence", "Failure/recovery or rollback evidence", "Updated decisions, risks and Production Readiness gap backlog"], ["The release is produced reproducibly from source rather than assembled manually.", "The primary stakeholder path works end to end in the target environment.", "Important quality/security claims have executable or reviewable evidence.", "Telemetry supports diagnosis of demonstrated behavior/failure.", "A recovery/rollback claim is exercised rather than documented only.", "Known gaps, assumptions and residual risks remain visible for the Production Readiness module."], 120),
];

function buildGate(id: string, title: string, objective: string, instructions: string[], acceptance: string[], questions: string[]): Lesson {
  const stableId = pathId + "-" + id;
  return {
    id: stableId,
    title,
    activities: [
      {
        id: stableId + "-practice",
        title: "Integrated proof: " + title,
        estimatedMinutes: 100,
        content: {
          type: "practical",
          objective,
          scenario: "Apply the preceding Independent Build mechanisms to the learner's real new-domain capstone repository or authorized disposable integration environment. The fictional community lending example is solely explanatory, not a qualifying project.",
          instructions,
          deliverables: ["Commit ID, environment and reproducible positive and negative evidence", "Observed states, side-effect results and an explicitly bounded oracle", "Rejected shortcut/alternative and an updated decision record", "List of FAIL, NOT TESTED and remaining review dependencies"],
          completionCriteria: [
            ...acceptance,
            "Actual system behavior and simulated educational fixtures are kept in separate evidence categories.",
            "There is no invented production sign-off, external stakeholder interview, qualified reviewer or release authority.",
          ],
        },
      },
      {
        id: stableId + "-check",
        title: "Unseen constraint: " + title,
        estimatedMinutes: 20,
        content: {
          type: "reflection",
          prompt: questions.map((item,i)=>(i+1)+". "+item).join("\n") + "\nRate each answer 0–2 for evidence trace, correct failure boundary and defensible changed decision; independent reviewer identity and feedback must be real, otherwise mark NOT LEARNER VALIDATED.",
        },
      },
    ],
  };
}
const verticalGate = buildGate(
  "stage-first-vertical-slice",
  "Stage A: Independent Repository, Domain and Durable Data",
  "Demonstrate the first real new-domain end-to-end action with a domain rule and a durable negative case, not only a scaffold.",
  [
    "Start from the capstone's own blank repository and cite a specific discovered stakeholder need, not Steward's Team/Service/Environment domain.",
    "Show the clean-checkout bootstrap and independent test baseline. Capture an initially failing domain test, the implementation commit and the passing rerun.",
    "Trace one authorized action through input, domain transition, database transaction, state and response; inspect a forbidden transition without changed state.",
    "Create a disposable database integrity negative (such as duplicate active ownership), and distinguish the local demonstration from a real production PostgreSQL concurrency proof.",
    "Show a realistic existing-row migration rehearsal and the response to an invalid historical fixture. A diagram or empty database migration is insufficient.",
  ],
  [
    "A reviewer can reproduce one vertical slice with a real domain rule and failing case.",
    "The negative case proves absence of prohibited durable changes at the observed boundary.",
  ],
  [
    "What evidence makes the repository genuinely independent rather than a Steward fork?",
    "Which invariant needs a database mechanism rather than only an application predicate?",
    "If two clients race, what new test would falsify your current confidence?",
  ]
);
const deploymentGate = buildGate(
  "stage-deployment-and-security-boundaries",
  "Stage B: Reproducible Deployment, Authorization and Test Evidence",
  "Prove release identity, a safe failure path and forbidden-ownership semantics without passing from an irrelevant green status.",
  [
    "Build exactly one versioned deployable artifact with a recorded source commit and digest; demonstrate why rebuilding the same tag can yield different bytes.",
    "Show a disposable deployment from documented infrastructure and config, with missing-secret refusal and no production default.",
    "Exercise a permitted signed object action and a syntactically valid forbidden cross-owner action in the learner's real approved app. Check no unauthorized database row or external message was created.",
    "Run real CI testing, scan/migration gating where appropriate, and remove one required result to prove promotion fails closed.",
    "Preserve a test baseline with no tsa-test-core package in the capstone; do not assert shared package eligibility just because a README mentions it.",
  ],
  [
    "Forbidden writes and side effects are absent when the actual owned resource is inspected.",
    "Missing evidence prevents a technical green recommendation, and promoted bytes match the tested artifact.",
  ],
  [
    "How can an HTTP 403 still hide an unauthorized write?",
    "Which evidence identifies deployed bytes rather than only a version string?",
    "What is the next safe action when backup validation is NOT TESTED?",
  ]
);
const recoveryGate = buildGate(
  "stage-operability-recovery-and-reuse",
  "Stage C: Failure Diagnosis, Recovery, Decision Revision and Reuse",
  "Demonstrate what operators can observe and restore, then challenge proposed shared-package extraction with two real consumers.",
  [
    "Inject one authorized disposable failure, correlate events without logging tokens, and document which trace boundary is still NOT TESTED.",
    "Perform an isolated backup/restore experiment that verifies row count, data invariants and actual recovered state. Do not claim this establishes production RTO/RPO.",
    "Challenge retry behavior for an ambiguous commit, define idempotency identity and inspect the actual side effects after replay.",
    "Record one consequential architecture/risk decision changed by implementation evidence and one deliberate scope exclusion, with triggers to reconsider.",
    "For tsa-test-core, show a qualifying genuine second Java consumer's passing test baseline and duplicated library-independent capability. If none exists, keep extraction BLOCKED and describe the concrete missing gate.",
  ],
  [
    "A backup file is distinguished from demonstrated restored and verified data.",
    "No shared API is published without two independent matching contracts and clean consumer evidence.",
  ],
  [
    "How does a timeout after commit differ from a rejected request?",
    "What restore observation—not a file list—would prove the local recovery objective?",
    "What is the evidence that a second Maven consumer tests a real purpose rather than merely importing a package?",
  ]
);
export const capstoneIndependentBuildDeepLessons: Lesson[] = originalIndependentBuildLessons.flatMap((lesson,index) => {
  if (index === 4) return [lesson, verticalGate];
  if (index === 9) return [lesson, deploymentGate];
  if (index === 14) return [lesson, recoveryGate];
  return [lesson];
});
