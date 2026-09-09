import type { Lesson } from "./lesson";

export const releaseEngineeringReviewLesson: Lesson = {
    id: "release-engineering-module-review",
    title: "Release Engineering Review",
    activities: [
        {
            id: "release-engineering-module-review-001",
            title: "Release Readiness Review",
            estimatedMinutes: 35,
            content: {
                type: "reflection",
                prompt: "Review the release process you now have for Steward from candidate creation through promotion, deployment, verification and failure recovery. Identify one place where release identity could still become ambiguous, one gate that could become ceremonial if poorly maintained, and one recovery assumption that still needs evidence.\n\nThen explain the difference between: (1) a source revision that passed CI, (2) a release candidate stored in Nexus, (3) an approved release, (4) a successful deployment execution, and (5) a verified healthy runtime. Your answer should make clear why these are related but not interchangeable states.",
                minimumCharacters: 300,
            },
        },
    ],
};
