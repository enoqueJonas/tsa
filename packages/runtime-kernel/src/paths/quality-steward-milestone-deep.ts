import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const junit: LearningResource = { title: "JUnit 5 User Guide", url: "https://docs.junit.org/current/user-guide/" };
const playwright: LearningResource = { title: "Playwright Java", url: "https://playwright.dev/java/" };
const k6: LearningResource = { title: "Grafana k6 documentation", url: "https://grafana.com/docs/k6/latest/" };
const gitlabCi: LearningResource = { title: "GitLab CI/CD documentation", url: "https://docs.gitlab.com/ci/" };
const testcontainers: LearningResource = { title: "Testcontainers for Java", url: "https://java.testcontainers.org/" };

const readingBlocks: LessonBlock[] = [
  { type: "paragraph", text: "The Quality Steward milestone is not a request to create more tests. It is the point where the learner proves that Steward has a coherent, maintainable quality system whose evidence can influence release decisions." },
  { type: "heading", id: "milestone-evidence-system", text: "Treat quality as an evidence system", level: 2 },
  { type: "paragraph", text: "A mature quality platform connects risk analysis, test design, automation, environments, diagnostics and delivery decisions. Each layer should exist because it answers a meaningful question about Steward, not because a framework or checklist says it should." },
  { type: "list", items: [
    "The quality strategy names important Steward risks and the evidence used to investigate them.",
    "Unit and component checks prove focused behavior at low feedback cost.",
    "API and integration checks prove service contracts, persistence and integration boundaries; asynchronous lifecycle checks prove committed publication intent reaches its owned side effect with bounded eventual assertions and idempotency evidence.",
    "Browser and environment checks cover browser behavior and meaningful environment differences without duplicating all service-layer tests.",
    "Selected non-functional baselines provide comparable evidence for performance, accessibility, compatibility and integrity risks.",
    "GitLab CI/CD jobs publish reports and artifacts, preserve commit/release/environment/pipeline-source identity and apply quality gates that reflect real release risk.",
    "Testcontainers-backed integration evidence proves controlled dependency behavior separately from tests against already-deployed shared/UAT environments."
  ] },
  { type: "heading", id: "milestone-traceability", text: "Trace decisions back to risk", level: 2 },
  { type: "paragraph", text: "The milestone should make it possible to start from a release risk and follow the chain to its test design, automated or manual evidence, execution environment, result and release interpretation. A large suite without this traceability is weaker than a smaller suite whose purpose is explicit." },
  { type: "heading", id: "milestone-maintainability", text: "Maintainability is part of quality", level: 2 },
  { type: "paragraph", text: "Framework code must remain simpler than the tests it supports. Quality Steward deliberately leaves reusable infrastructure candidates inside steward-tests because a second real product does not exist yet. Steward ownership rules, lifecycle behavior, service registration workflows and domain assertions remain in Steward so the suite continues to read like the product it tests." },
  { type: "callout", tone: "warning", title: "Do not optimize for green", body: "Retries, quarantines, skipped tests and selective execution must remain visible. A pipeline that produces green by hiding missing or unstable evidence is less trustworthy than one that clearly reports uncertainty." },
  { type: "heading", id: "milestone-review", text: "What the final review should answer", level: 2 },
  { type: "list", ordered: true, items: [
    "What are Steward's most important quality risks and where is each covered?",
    "Which test level gives the cheapest credible evidence for each risk?",
    "Which tests require real infrastructure or browser execution, and why?",
    "Which failures generate enough diagnostics for triage?",
    "Which evidence blocks a release, which evidence informs a decision, and which remains advisory?",
    "What residual risks remain for Security Steward and Reliability Engineer?"
  ] },
  { type: "callout", tone: "steward", title: "Quality Steward completion standard", body: "The learner should leave this school with an operational quality platform around Steward, not a folder of disconnected scripts. The system should make quality risk visible before release and failures understandable after execution." },
  { type: "resources", title: "Reference tools", resources: [junit, playwright, k6, gitlabCi, testcontainers] }
];

export const qualityStewardMilestoneDeepLessons: Lesson[] = [
  {
    id: "quality-steward-milestone-readiness",
    title: "Quality Steward Milestone Readiness",
    activities: [
      {
        id: "quality-steward-milestone-readiness-001",
        title: "Integrate the Quality Steward System",
        estimatedMinutes: 45,
        content: { type: "reading", body: "Integrate the quality work produced across the school into one evidence system.", blocks: readingBlocks }
      },
      {
        id: "quality-steward-milestone-readiness-002",
        title: "Audit the Existing Evidence",
        estimatedMinutes: 60,
        content: {
          type: "practical",
          objective: "Audit the full Steward quality portfolio before final milestone execution.",
          scenario: "Treat previous modules as one system. Find gaps, duplication, hidden assumptions and evidence that cannot yet support a release decision.",
          instructions: [
            "Map the highest-priority Steward risks to current unit/component, API/integration, asynchronous lifecycle, browser/environment and non-functional evidence.",
            "For critical automated claims, record the oracle source and challenge whether assertions could pass while the protected invariant or side effect is wrong.",
            "Identify duplicate tests that add cost without a distinct claim.",
            "Identify critical risks with no credible evidence or with evidence at the wrong test level.",
            "Verify the test target is an exact Steward release/environment from the Delivery or Cloud handoff and that reports preserve test, environment and immutable release identity.",
            "Review skipped, quarantined and flaky tests and ensure their risk remains visible.",
            "Review shared mutable test data and prove which suites are safe for parallel execution, which resources are partitioned per worker and which tests intentionally remain serialized."
          ],
          deliverables: ["Quality evidence map", "Gap and duplication list", "Milestone remediation plan"],
          completionCriteria: ["Every high-priority risk has an explicit evidence status.", "Missing evidence is visible rather than implied green.", "The remediation plan prioritizes risk rather than test count."]
        }
      }
    ]
  },
  {
    id: "quality-steward-milestone-decision-evidence",
    title: "Case Study: Defend a Release Decision from Contradictory Test Evidence",
    activities: [
      {
        id: "quality-steward-milestone-decision-evidence-001",
        title: "Read a complete release evidence chain, including counterevidence",
        estimatedMinutes: 45,
        content: {
          type: "reading",
          body: "A QA engineer does not approve the sum of green cells. A defensible decision ties each acceptance claim to an independent oracle, the exact product/environment tested, real negative proof and evidence gaps.",
          blocks: [
            {type:"heading",id:"quality-release-claim",text:"Define the decision and the candidate",level:2},
            {type:"paragraph",text:"Illustrative release candidate Q-43 targets a non-production Steward registry. The proposed claims are (1) non-owners cannot transfer a service, (2) scheduled critical regression ran for the exact candidate, and (3) lookup load meets an agreed error <= 1% and successful p95 <= 250 ms. The thresholds are scenario assumptions, not established TSA production criteria."},
            {type:"heading",id:"quality-release-observations",text:"Follow three reported green signals to their actual evidence",level:2},
            {type:"list",ordered:true,items:[
              "AUTHORIZATION: API POST by a non-owner returns HTTP 403. A later authorized GET nevertheless reports the service owner changed from team 7 to team 9. The status-only API assertion is green, but the protected non-mutation invariant is broken.",
              "REGRESSION: the scheduled GitLab pipeline is green, yet the manifest declares 12 mandatory test identities and only 11 executed. A skipped mandatory check is missing evidence, not an equivalent passing result.",
              "PERFORMANCE: the dashboard reports successful p95 220 ms, but 15% of attempted lookups return errors. Even if successful latency meets the 250 ms target, the stated 1% error objective fails. The total count and sampling window must be retained."
            ]},
            {type:"heading",id:"quality-release-reasoning",text:"Decision: BLOCK, with different kinds of evidence failure",level:2},
            {type:"paragraph",text:"The owner mutation is observed product contract failure: BLOCK. The missing scheduled check is an incomplete release gate: BLOCK until selection and execution can be explained. The performance error ratio independently exceeds the stated threshold: BLOCK. Passing unit tests or a green job color cannot override these facts. Investigate and repair each source, rerun against an immutable candidate and preserve the original failed run in the evidence ledger."},
            {type:"heading",id:"quality-release-chain",text:"Build a traceable release evidence record",level:2},
            {type:"list",items:[
              "Claim and oracle source: requirement text, clarification or approved API rule, not merely the current code behavior.",
              "Risk/impact: consequence of forbidden ownership transfer or unavailable lookup; name the affected actor and recovery boundary.",
              "Execution identity: commit, artifact, deployed environment, CI source, build/run ID, test data and observation window.",
              "Positive, negative and state-after evidence: denied POST plus authorized GET, selection manifest plus executed tests, performance successes plus errors.",
              "Decision and ownership: BLOCK, open defect/risk with reproduction and owner, retest and review triggers; unresolved assumptions remain explicit."
            ]},
            {type:"heading",id:"quality-release-counterfactual",text:"What evidence could permit release?",level:2},
            {type:"paragraph",text:"For candidate Q-44, suppose the same forbidden POST still returns 403 and an authorized GET confirms unchanged owner, all 12 mandatory regression checks execute and pass with retained reports, and 0.2% of a defined lookup population fail with successful p95 230 ms. These observations address the three illustrated blockers. They do not by themselves prove production authorization, every browser, live security controls or an independent uncoached learner's understanding. Acceptance still depends on all remaining declared release risks and verified environment equivalence."},
            {type:"heading",id:"quality-release-independent",text:"Unseen transfer must be scored, not narrated by the assistant",level:2},
            {type:"paragraph",text:"New challenge: a batch-upload endpoint returns 202 Accepted while a downstream worker has not persisted the expected record. The pipeline has 24/24 green HTTP-response assertions but no asynchronous outcome checks; a worker log shows retries exhausted. Without reusing the ownership example, specify the independent oracle, suitable integration boundary, required negative/recovery case, evidence record and release verdict."},
            {type:"heading",id:"quality-release-rubric",text:"Assessment rubric: five verifiable criteria",level:2},
            {type:"list",ordered:true,items:[
              "Distinguishes transport acceptance (202) from durable downstream completion; identifies the actual outcome that must be checked.",
              "Names the asynchronous persistence/worker boundary and why a pure status-only HTTP test is insufficient.",
              "Designs a bounded eventual assertion with a missing-event/poison-message negative and idempotent recovery, without inventing observed behavior.",
              "Records commit, queue/worker correlation identity, environment, deadline, job selection and before/after state.",
              "Makes an explicit BLOCK or HOLD decision on absent outcome evidence and identifies the conditions for re-evaluation."
            ]},
            {type:"paragraph",text:"Scoring: one point per independently explained criterion. Fewer than 5/5 requires targeted remediation before claiming learner validation; a coached answer does not count. This is an illustrative scoring policy, not a substitute for a real novice pilot."},
          ],
        },
      },
      {
        id: "quality-steward-milestone-decision-evidence-002",
        title: "Produce an independent evidence-to-decision record",
        estimatedMinutes: 70,
        content: {
          type: "practical",
          objective: "Produce a defensible release decision from the previously unseen asynchronous batch outcome, not from test counts.",
          scenario: "Steward accepts a batch with HTTP 202 while its worker fails later; existing test reports prove only receipt. Treat this as a separate domain-specific evidence problem.",
          instructions: [
            "Define the approved asynchronous completion contract and identify any missing clarification before declaring an expected result.",
            "Specify the exact boundaries, correlation keys and independent observable postconditions the test must inspect after HTTP 202.",
            "Design a bounded positive and an exhausted-retry/missing-side-effect negative with safe cleanup; do not assert a queue was observed unless tested.",
            "Show a risk-to-test-to-report-to-release trace including the commit, environment, selected/actually executed tests and ownership.",
            "State a release decision with an explicit reconsideration condition. Score your record against the five criteria in the reading without relying on a copied solution."
          ],
          deliverables:["Contract and ambiguity note","Independent oracle and negative design","Evidence-chain release decision","Self-evaluation against five criteria"],
          completionCriteria:["The record treats 202 as acceptance of work, not proof of durable completion.","Missing outcome evidence cannot become green.","All five independent reasoning elements have an observable basis and unresolved assumptions remain named."],
        },
      },
      {
        id: "quality-steward-milestone-decision-evidence-003",
        title: "Explain what would falsify your release confidence",
        estimatedMinutes: 15,
        content: {
          type:"reflection",
          prompt:"Explain how a plausible green API, pipeline or performance report can conceal a product failure. For the unseen asynchronous batch case, give one disconfirming observation, one alternative hypothesis and a precise next test without assuming the worker is healthy.",
          minimumCharacters:300
        }
      }
    ]
  },
  {
    id: "quality-steward-milestone-platform",
    title: "Milestone: Steward Quality Platform",
    activities: [
      {
        id: "quality-steward-milestone-platform-001",
        title: "Finalize the Steward Quality Strategy",
        estimatedMinutes: 90,
        content: {
          type: "practical",
          objective: "Produce the final quality strategy that explains how Steward quality evidence is designed and used.",
          scenario: "The document should be usable by engineers and release reviewers, not written as an academic summary of testing terminology.",
          instructions: [
            "Document product risks, test levels, environment strategy and execution cadence.",
            "Define which checks are blocking, advisory or manually reviewed.",
            "Document test-data, parallel-isolation, oracle/assertion, retry, quarantine and diagnostic policies.",
            "For independently delivered consumers/providers, document where compatibility contracts are verified before promotion and how obsolete contracts are retired safely.",
            "Record the boundary between Steward domain test code and reusable-infrastructure candidates, and attach the Professional Engineer transfer criteria. tsa-test-core must not exist yet.",
            "List residual quality risks deliberately handed to later Security and Reliability work."
          ],
          deliverables: ["Final Steward quality strategy", "Risk-to-evidence matrix", "Residual-risk register"],
          completionCriteria: ["The strategy explains why each major evidence layer exists.", "Release decisions can be traced to evidence.", "Security and Reliability responsibilities are not falsely claimed as complete."]
        }
      },
      {
        id: "quality-steward-milestone-platform-002",
        title: "Prove the Automated Quality Portfolio",
        estimatedMinutes: 150,
        content: {
          type: "practical",
          objective: "Run the integrated automated portfolio and prove that failures are actionable.",
          scenario: "Use the real Steward codebase and the environment-aware framework developed throughout Quality Steward. Every result must identify the exact release/environment under test.",
          instructions: [
            "Execute representative unit/component and API/integration suites, including the lifecycle test that separates synchronous API success from eventual outbox → RabbitMQ → consumer completion.",
            "For one high-risk test, defend the expected-result oracle independently from the implementation and prove the assertions would detect an intentionally wrong side effect or invariant.",
            "Run a parallel-safe slice concurrently and prove test-data ownership/cleanup prevents worker interference; keep one explicitly unsafe scenario serialized with rationale.",
            "Prove the Maven execution boundary: Surefire owns the intended fast unit/component selection in `test`, while Failsafe owns the intended integration selection through `integration-test`/`verify`, and a failing integration test makes `mvn verify` fail.",
            "Execute the selected browser/environment matrix rather than every test on every browser.",
            "Run the selected stable non-functional baselines that are appropriate for this environment.",
            "Capture reports, logs, traces or other diagnostics for a controlled failing case.",
            "Demonstrate that the failure can be traced to the exact release, environment and test evidence."
          ],
          deliverables: ["Integrated test run", "Browser/environment evidence", "Non-functional baseline evidence", "Controlled failure triage record"],
          completionCriteria: ["The portfolio executes through the intended framework.", "At least one failure produces useful triage evidence.", "The learner can state exactly what the run proves and what it does not."]
        }
      },
      {
        id: "quality-steward-milestone-platform-003",
        title: "Prove the Quality Pipeline",
        estimatedMinutes: 120,
        content: {
          type: "practical",
          objective: "Demonstrate that CI quality gates influence release decisions without hiding uncertainty.",
          scenario: "The pipeline is the operational expression of the Quality Steward strategy.",
          instructions: [
            "Run the staged GitLab CI/CD quality pipeline against a known Steward release candidate and preserve the exact immutable release/environment identity used by synchronous and asynchronous tests.",
            "Prove at least one Testcontainers-backed integration slice on the intended GitLab Runner architecture and distinguish its evidence from shared/UAT regression.",
            "Capture Surefire and Failsafe reports separately enough to prove which Maven lifecycle/test layer produced each result.",
            "Demonstrate merge-request/default-branch or release/scheduled pipeline selection through explicit GitLab rules.",
            "Verify cache is used only for acceleration while JUnit/Allure/browser diagnostics are retained as pipeline evidence/artifacts.",
            "Confirm reports and artifacts are retained for failed and successful stages where appropriate.",
            "Demonstrate one meaningful quality gate blocking a deliberately invalid candidate.",
            "Where contract testing is justified by independent delivery, demonstrate provider compatibility verification against the currently supported consumer contract set before promotion.",
            "Demonstrate that skipped/quarantined evidence remains visible rather than becoming a silent pass.",
            "Publish the tsa-test-core candidate/handoff evidence as a pipeline artifact or repository document so Professional Engineer can compare it with the future capstone test suite; do not publish a library yet."
          ],
          deliverables: ["GitLab pipeline execution evidence", "Testcontainers/runner evidence", "Pipeline-source/rules evidence", "Quality-gate failure evidence", "Reports/artifacts", "tsa-test-core candidate/handoff evidence"],
          completionCriteria: ["The GitLab pipeline can stop an unacceptable candidate for a stated risk reason.", "A Testcontainers infrastructure failure is distinguishable from a product assertion failure.", "Pipeline source and selected portfolio are visible.", "Missing evidence is not silently green.", "No shared test library has been fabricated before a genuine second product exists."]
        }
      },
      {
        id: "quality-steward-milestone-platform-004",
        title: "Quality Steward Final Review",
        estimatedMinutes: 45,
        content: {
          type: "reflection",
          prompt: "Defend the final Steward quality platform. Explain the highest risks, why each is tested at its chosen level, how the framework and pipeline preserve evidence quality, which tsa-test-core candidates are plausible and what second-consumer evidence is still required, how flaky or missing evidence is kept visible, and which unresolved risks intentionally move to Security Steward and Reliability Engineer.",
          minimumCharacters: 500
        }
      }
    ]
  }
];
