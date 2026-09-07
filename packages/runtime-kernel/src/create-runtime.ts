import {
    createLearningSession,
    type LearningSession,
} from "./runtime/session";

export interface Runtime {
    start(): LearningSession;
}

export function createRuntime(): Runtime {
    return {
        start() {
            return createLearningSession();
        },
    };
}