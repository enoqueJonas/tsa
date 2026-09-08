import { engineeringFoundations } from "../paths";
import type { Activity } from "../activities";
import type { Lesson } from "../paths";

export interface LearningSession {
    currentLesson(): Lesson;
    currentActivity(): Activity;
    hasNext(): boolean;
    next(): void;
    goToActivity(activityId: string): boolean;
}

export function createLearningSession(): LearningSession {
    let lessonIndex = 0;
    let activityIndex = 0;

    return {
        currentLesson() {
            return engineeringFoundations.lessons[lessonIndex];
        },

        currentActivity() {
            const lesson = engineeringFoundations.lessons[lessonIndex];
            return lesson.activities[activityIndex];
        },

        hasNext() {
            const lesson = engineeringFoundations.lessons[lessonIndex];

            const hasNextActivity =
                activityIndex < lesson.activities.length - 1;

            const hasNextLesson =
                lessonIndex < engineeringFoundations.lessons.length - 1;

            return hasNextActivity || hasNextLesson;
        },

        next() {
            const lesson = engineeringFoundations.lessons[lessonIndex];

            if (activityIndex < lesson.activities.length - 1) {
                activityIndex++;
                return;
            }

            if (lessonIndex < engineeringFoundations.lessons.length - 1) {
                lessonIndex++;
                activityIndex = 0;
            }
        },

        goToActivity(activityId: string) {
            for (let nextLessonIndex = 0; nextLessonIndex < engineeringFoundations.lessons.length; nextLessonIndex++) {
                const lesson = engineeringFoundations.lessons[nextLessonIndex];
                const nextActivityIndex = lesson.activities.findIndex(
                    (activity) => activity.id === activityId
                );

                if (nextActivityIndex !== -1) {
                    lessonIndex = nextLessonIndex;
                    activityIndex = nextActivityIndex;
                    return true;
                }
            }

            return false;
        },
    };
}
