import type { Lesson } from "./lesson";
import {
    systemsThinkingBrief,
    systemsThinkingReflection,
} from "../activities";

export const systemsThinking: Lesson = {
    id: "systems-thinking",
    title: "Systems Thinking",
    activities: [
        systemsThinkingBrief,
        systemsThinkingReflection,
    ],
};
