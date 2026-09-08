import type { Lesson } from "./lesson";
import {
    debuggingBrief,
    debuggingInvestigation,
    debuggingReflection,
} from "../activities";

export const debuggingMindset: Lesson = {
    id: "debugging-mindset",
    title: "Debugging Mindset",
    activities: [
        debuggingBrief,
        debuggingInvestigation,
        debuggingReflection,
    ],
};
