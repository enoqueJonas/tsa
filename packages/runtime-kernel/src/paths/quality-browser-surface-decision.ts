import type { Lesson } from "./lesson";

export const browserSurfaceDecisionLesson: Lesson = {
    id: "browser-environment-browser-surface-decision",
    title: "Decision Gate: Does Steward Need Browser Testing?",
    activities: [
        {
            id: "browser-environment-browser-surface-decision-primer",
            title: "What a browser test proves that an API test cannot",
            estimatedMinutes: 40,
            content: {
                type: "reading",
                body: "A browser test is justified by a user-facing contract, not by a testing tool. Learn how the browser, HTTP API and application state interact before choosing a test surface.",
                blocks: [
                    { type: "heading", id: "browser-boundary-definition", text: "Define the evidence boundary", level: 2 },
                    { type: "paragraph", text: "A browser-based application has at least three independently fallible boundaries: the browser renders and handles DOM events; the application front end sends requests and manages local state; the API authorizes operations and persists domain changes. An HTTP integration test can prove that an unauthorized POST is rejected. Only a browser test can prove that the actual role-based navigation, form feedback and focus behavior are usable after a rejected POST." },
                    { type: "paragraph", text: "Browser automation is a test level choice, not an architecture requirement. If Steward exposes only a REST API, build tests against that real interface; do not create a decorative front end solely to make a browser tool relevant." },
                    { type: "heading", id: "browser-surface-comparison", text: "Compare three real surfaces", level: 2 },
                    { type: "list", items: [
                        "Pure API: check authorization, malformed JSON and persisted state with API/component tests; no product browser workflow exists yet.",
                        "User-facing web console: use a browser for navigation, keyboard entry, validation messages, focus order and rendered results; keep persistence and denial behavior checked at the API boundary too.",
                        "Developer-only API docs: Swagger UI loading does not establish a real end-user journey, so its presence alone is insufficient to justify a browser regression suite."
                    ] },
                    { type: "heading", id: "browser-evidence-case", text: "Worked scenario: a forbidden transfer", level: 2 },
                    { type: "paragraph", text: "Requirement: only the current team owner may transfer a service. API evidence: POST /services/42/transfer by a non-owner returns 403 and the owner remains unchanged in a subsequent authorized GET. Browser evidence, if a real owner-management UI exists: a non-owner cannot initiate a transfer through that UI, a server-side denial is displayed safely when the UI state is stale, and keyboard users can locate the error. The two checks answer different questions; neither substitutes for the other." },
                    { type: "heading", id: "browser-negative-evidence", text: "A green click is a weak oracle", level: 2 },
                    { type: "paragraph", text: "Failure experiment: the button click resolves, but the API returns 403 and the UI silently shows success. A test asserting only that the click happened passes incorrectly; an assertion on the user-visible result catches the false success. Conversely, a disabled button alone does not prove server-side authorization. Pair browser-visible and API-side assertions at the boundaries they own." },
                    { type: "heading", id: "browser-independent-decision", text: "Practice: choose a minimal portfolio", level: 2 },
                    { type: "paragraph", text: "For a hypothetical Steward API with no web client, write one risk-to-test mapping that deliberately excludes UI tests. Then assume a genuine owner console is added; identify exactly two new browser-only risks and choose one positive and one failure assertion. Explain what evidence would change your decision again." },
                ],
            },
        },
        {
            id: "browser-environment-browser-surface-decision-001",
            title: "Evaluate the Browser Surface",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Decide whether Steward currently has a meaningful browser-facing product surface that justifies browser automation.",
                scenario: "Quality Steward must not create a decorative UI solely to satisfy Playwright or cross-browser curriculum objectives. Browser automation is justified only when a real user-facing Steward workflow exists and browser behavior can introduce unique risk.",
                instructions: [
                    "Inventory the current Steward interfaces and identify which, if any, are genuinely browser-facing user workflows rather than API documentation or developer-only tooling.",
                    "For each candidate browser workflow, identify browser-specific risks that API/service-layer tests cannot credibly prove, such as rendering, navigation, input behavior, accessibility, responsive layout, storage or browser security semantics.",
                    "Choose one of three outcomes: proceed with the existing browser surface; add the minimum useful user-facing client because the product itself benefits from it; or keep Quality Steward API/service-layer primary and treat browser-specific exercises as optional/limited.",
                    "Record why creating a new UI solely for curriculum coverage would be artificial architecture.",
                    "Define the evidence that would cause this decision to be revisited later.",
                ],
                deliverables: [
                    "Browser-surface inventory",
                    "Browser-testing decision record",
                    "Risk/evidence rationale",
                    "Revisit trigger",
                ],
                completionCriteria: [
                    "The decision is based on product and quality risk rather than a desire to use Playwright.",
                    "API-only behavior remains at the service layer when browser execution adds no unique evidence.",
                    "Any proposed browser client has a genuine product purpose beyond satisfying the curriculum.",
                    "Residual browser risk is explicit when browser testing is intentionally limited.",
                ],
            },
        },
        {
            id: "browser-environment-browser-surface-decision-002",
            title: "Defend the Decision",
            estimatedMinutes: 15,
            content: {
                type: "reflection",
                prompt: "Defend your browser-testing decision for Steward. What user-facing surface exists today, which risks require a browser, which claims remain better proven at the API/service layer, and what evidence would justify changing the decision later?",
                minimumCharacters: 250,
            },
        },
    ],
};
