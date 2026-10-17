import { engineeringApprenticeRichLessons } from "./engineering-apprentice-rich";
import type { LearningPath } from "./learning-path";
import { engineeringApprenticeWorkbenchDeepLessons } from "./engineering-apprentice-workbench-deep";

// Fail explicitly if the expected capstone is absent; never compose an undefined lesson.
const capstone = engineeringApprenticeRichLessons.at(-1);
if (!capstone) throw new Error("Engineering Apprentice is missing its capstone lesson");

export const engineeringFoundations: LearningPath = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    // The independent Engineering Investigation is the school's capstone: it follows both
    // conceptual foundations and hands-on terminal/Git/process/HTTP work.
    lessons: [
        ...engineeringApprenticeRichLessons.slice(0, -1),
        ...engineeringApprenticeWorkbenchDeepLessons,
        capstone,
    ],
};
