import type { Lesson } from "./lesson";

export const browserSurfaceDecisionLesson: Lesson = {
    id: "browser-environment-browser-surface-decision",
    title: "Decision Gate: Does Steward Need Browser Testing?",
    activities: [
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
