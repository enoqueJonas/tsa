import type { Lesson } from "./lesson";

import {
    engineeringBrief,
    engineeringReflection,
} from "../activities";

export const thinkingLikeAnEngineer: Lesson = {
    id: "thinking-like-an-engineer",

    title: "Thinking Like an Engineer",

    activities: [
        engineeringBrief,
        engineeringReflection,
    ],
};