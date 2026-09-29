import { engineeringApprenticeRichLessons } from "./engineering-apprentice-rich";
import type { LearningPath } from "./learning-path";
import { engineeringApprenticeWorkbenchDeepLessons } from "./engineering-apprentice-workbench-deep";

export const engineeringFoundations: LearningPath = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    lessons: [...engineeringApprenticeRichLessons, ...engineeringApprenticeWorkbenchDeepLessons],
};
