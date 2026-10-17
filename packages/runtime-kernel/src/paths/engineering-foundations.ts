import { engineeringApprenticeRichLessons } from "./engineering-apprentice-rich";
import type { LearningPath } from "./learning-path";
import { engineeringApprenticeWorkbenchDeepLessons } from "./engineering-apprentice-workbench-deep";

export const engineeringFoundations: LearningPath = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    // The independent Engineering Investigation is the school's capstone: it follows both\n    // conceptual foundations and hands-on terminal/Git/process/HTTP work.\n    lessons: [\n        ...engineeringApprenticeRichLessons.slice(0, -1),\n        ...engineeringApprenticeWorkbenchDeepLessons,\n        engineeringApprenticeRichLessons[engineeringApprenticeRichLessons.length - 1],\n    ],
};
