import { engineeringFoundations } from "../paths";
import type { Activity } from "../activities";

export interface LearningSession {
    currentActivity(): Activity;
    next(): void;
}

export function createLearningSession(): LearningSession {

    let lessonIndex = 0;
    let activityIndex = 0;

    return {

        currentActivity() {
            const lesson =
                engineeringFoundations.lessons[lessonIndex];

            return lesson.activities[activityIndex];
        },

        next() {
            const lesson =
                engineeringFoundations.lessons[lessonIndex];

            if (activityIndex < lesson.activities.length - 1) {
                activityIndex++;
                return;
            }

            if (lessonIndex < engineeringFoundations.lessons.length - 1) {
                lessonIndex++;
                activityIndex = 0;
            }
        }

    };
}