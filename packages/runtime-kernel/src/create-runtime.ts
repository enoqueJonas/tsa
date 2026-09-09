import type { LearningPath } from "./paths";
import {
    createLearningSession,
    type LearningSession,
} from "./runtime/session";

export interface Runtime {
    start(path?: LearningPath): LearningSession;
}

export function createRuntime(): Runtime {
    return {
        start(path) {
            return createLearningSession(path);
        },
    };
}
