import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const pytest: LearningResource = { title: "pytest documentation", url: "https://docs.pytest.org/" };
const playwright: LearningResource = { title: "Playwright Python", url: "https://playwright.dev/python/" };
const k6: LearningResource = { title: "Grafana k6 documentation", url: "https://grafana.com/docs/k6/latest/" };

const readingBlocks: LessonBlock[] = [
  { type: "paragraph", text: "The Quality Steward milestone is not a request to create more tests. It is the point where the learner proves that Steward has a coherent, maintainable quality system whose evidence can influence release decisions." },
  { type: "heading", id: "milestone-evidence-system", text: "Treat quality as an evidence system", level: 2 },
  { type: "paragraph", text: "A mature quality platform connects risk analysis, test design, automation, environments, diagnostics and delivery decisions. Each layer should exist because it answers a meaningful question about Steward, not because a framework or checklist says it should." },
  { type: "list", items: [
    "The quality strategy names important Steward risks and the evidence used to investigate them.",
    "Unit and component checks prove focused behavior at low feedback cost.",
    "API and integration checks prove service contracts, persistence and integration boundaries.",
    "Browser and environment checks cover browser behavior and meaningful environment differences without duplicating all service-layer tests.",
    "Selected non-functional baselines provide comparable evidence for performance, accessibility, compatibility and integrity risks.",
    "CI stages publish reports and artifacts, preserve release/environment identity and apply quality gates that reflect real release risk."
  ] },
  { type: "heading", id: "milestone-traceability", text: "Trace decisions back to risk", level: 2 },
  { type: "paragraph", text: "The milestone should make it possible to start from a release risk and follow the chain to its test design, automated or manual evidence, execution environment, result and release interpretation. A large suite without this traceability is weaker than a smaller suite whose purpose is explicit." },
  { type: "heading", id: "milestone-maintainability", text: "Maintainability is part of quality", level: 2 },
  { type: "paragraph", text: "Framework code must remain simpler than the tests it supports. Shared infrastructure belongs in tsa-test-core only where reuse has been proven. Steward ownership rules, lifecycle behavior, service registration workflows and domain assertions remain in Steward so the suite continues to read like the product it tests." },
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
  { type: "resources", title: "Reference tools", resources: [pytest, playwright, k6] }
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
            "Map the highest-priority Steward risks to current unit/component, API/integration, browser/environment and non-functional evidence.",
            "Identify duplicate tests that add cost without a distinct claim.",
            "Identify critical risks with no credible evidence or with evidence at the wrong test level.",
            "Verify reports preserve test, environment and release identity.",
            "Review skipped, quarantined and flaky tests and ensure their risk remains visible."
          ],
          deliverables: ["Quality evidence map", "Gap and duplication list", "Milestone remediation plan"],
          completionCriteria: ["Every high-priority risk has an explicit evidence status.", "Missing evidence is visible rather than implied green.", "The remediation plan prioritizes risk rather than test count."]
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
            "Document test-data, isolation, retry, quarantine and diagnostic policies.",
            "Record the boundary between Steward domain test code and reusable tsa-test-core infrastructure.",
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
          scenario: "Use the real Steward codebase and the environment-aware framework developed throughout Quality Steward.",
          instructions: [
            "Execute representative unit/component and API/integration suites.",
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
            "Run the staged quality pipeline against a known Steward release candidate.",
            "Confirm reports and artifacts are retained for failed and successful stages where appropriate.",
            "Demonstrate one meaningful quality gate blocking a deliberately invalid candidate.",
            "Demonstrate that skipped/quarantined evidence remains visible rather than becoming a silent pass.",
            "If tsa-test-core was legitimately extracted, prove Steward consumes a versioned package from the internal repository and executes a compatibility check."
          ],
          deliverables: ["Pipeline execution evidence", "Quality-gate failure evidence", "Reports/artifacts", "tsa-test-core compatibility evidence when applicable"],
          completionCriteria: ["The pipeline can stop an unacceptable candidate for a stated risk reason.", "Missing evidence is not silently green.", "Shared test infrastructure is consumed as a normal versioned dependency where applicable."]
        }
      },
      {
        id: "quality-steward-milestone-platform-004",
        title: "Quality Steward Final Review",
        estimatedMinutes: 45,
        content: {
          type: "reflection",
          prompt: "Defend the final Steward quality platform. Explain the highest risks, why each is tested at its chosen level, how the framework and pipeline preserve evidence quality, where tsa-test-core reuse is justified or rejected, how flaky or missing evidence is kept visible, and which unresolved risks intentionally move to Security Steward and Reliability Engineer.",
          minimumCharacters: 500
        }
      }
    ]
  }
];
