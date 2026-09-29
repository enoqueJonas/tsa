import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const maven: LearningResource = { title: "Apache Maven Guides", url: "https://maven.apache.org/guides/" };
const junit: LearningResource = { title: "JUnit 5 User Guide", url: "https://docs.junit.org/current/user-guide/" };

const boundaryBlocks: LessonBlock[] = [
  { type: "paragraph", text: "Shared test infrastructure becomes valuable only after multiple capabilities have produced stable, demonstrably generic repetition. Steward domain behavior must remain local even when it is reused by many Steward tests." },
  { type: "heading", id: "reuse-candidates", text: "Audit candidates, do not move folders mechanically", level: 2 },
  { type: "list", items: ["Validated configuration primitives", "Generic REST Assured specification factories", "Playwright browser/context lifecycle foundations", "Evidence and attachment helpers", "Safe logging/redaction", "Selected JUnit extensions", "Generic unique-data utilities"] },
  { type: "heading", id: "must-remain-steward", text: "Keep product behavior with the product", level: 2 },
  { type: "list", items: ["StewardApiClient", "Steward contract DTOs", "Steward page/component objects", "Ownership/lifecycle/dependency workflows", "Steward-specific assertions and test-data semantics"] },
  { type: "resources", title: "Continue learning", resources: [maven, junit] }
];

const boundary: Lesson = { id: "quality-reuse-boundary", title: "Reuse Audit: steward-tests vs tsa-test-core", activities: [
  { id: "quality-reuse-boundary-001", title: "Decide What Is Actually Generic", estimatedMinutes: 50, content: { type: "reading", body: "Perform the reuse audit only now, after API, framework diagnostics and browser lifecycle have all been implemented.", blocks: boundaryBlocks } },
  { id: "quality-reuse-boundary-002", title: "Produce the Extraction Decision", estimatedMinutes: 75, content: { type: "practical", objective: "Classify every candidate as Steward-specific, reusable now, or deferred until a second consumer proves the need.", scenario: "Being used twice inside Steward is not sufficient evidence for a cross-project library.", instructions: ["Inventory configuration, API, browser, evidence, logging, JUnit and data utilities.", "For each candidate record consumers, dependencies and product assumptions.", "Reject anything that imports or encodes Steward domain behavior.", "Define the smallest intentional public API for accepted candidates."], deliverables: ["Reuse-boundary decision record", "Accepted/deferred/rejected candidate table", "Proposed public API"], completionCriteria: ["Every accepted capability has a reuse argument.", "No Steward workflow crosses the boundary.", "Deferred extraction is considered a valid outcome."] } }
] };

const extract: Lesson = { id: "quality-extract-test-core", title: "Milestone: Extract tsa-test-core", activities: [
  { id: "quality-extract-test-core-001", title: "Extract Only the Approved Infrastructure", estimatedMinutes: 120, content: { type: "practical", objective: "Create tsa-test-core from the approved reuse candidates without changing Steward test intent.", scenario: "The library is a normal Java/Maven product with a small public API. Empty architecture folders are not a deliverable.", instructions: ["Create the tsa-test-core Maven project.", "Move only approved generic capabilities.", "Keep implementation internals package-private where possible.", "Add focused library tests.", "Update steward-tests to consume the local built artifact during extraction.", "Prove tsa-test-core has no dependency on Steward packages."], deliverables: ["tsa-test-core Maven project", "Library tests", "Small public API", "Steward compatibility run"], completionCriteria: ["No Steward package is imported by tsa-test-core.", "Steward tests remain readable.", "The extraction reduces real duplication/coupling rather than merely moving files."] } }
] };

const publish: Lesson = { id: "quality-publish-test-core", title: "Milestone: Publish and Consume tsa-test-core", activities: [
  { id: "quality-publish-test-core-001", title: "Use tsa-test-core as a Versioned Internal Dependency", estimatedMinutes: 105, content: { type: "practical", objective: "Publish tsa-test-core to the internal Maven repository and consume it through normal dependency resolution.", scenario: "Source copying and local-path integration are no longer acceptable as the final state.", instructions: ["Assign a version according to the compatibility policy.", "Build and deploy the JAR to Nexus.", "Declare the approved dependency in steward-tests pom.xml.", "Run the focused compatibility suite.", "Record artifact version and upgrade evidence."], deliverables: ["Versioned Nexus artifact", "Maven dependency declaration", "Compatibility evidence", "Versioning note"], completionCriteria: ["Steward resolves tsa-test-core from Nexus.", "The exact version is traceable.", "A compatibility failure can block promotion.", "No copied library source remains in Steward."] } }
] };

export const qualityReuseAndInternalLibraryDeepLessons: Lesson[] = [boundary, extract, publish];
