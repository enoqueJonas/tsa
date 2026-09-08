import { engineeringFoundations } from "../paths";
import type { Activity } from "../activities";
import type { LearningPath, Lesson } from "../paths";

export interface LearningProgress {
    currentActivityId: string;
    completedActivityIds: string[];
}

export interface LearningSession {
    currentPath(): LearningPath;
    currentLesson(): Lesson;
    currentActivity(): Activity;
    completedActivityIds(): string[];
    completeCurrentActivity(): void;
    hasNext(): boolean;
    next(): void;
    goToActivity(activityId: string): boolean;
    progress(): LearningProgress;
    restoreProgress(progress: LearningProgress): void;
}

export function createLearningSession(): LearningSession {
    let lessonIndex = 0;
    let activityIndex = 0;
    const completedActivityIds = new Set<string>();

    function findActivity(activityId: string) {
        for (
            let nextLessonIndex = 0;
            nextLessonIndex < engineeringFoundations.lessons.length;
            nextLessonIndex++
        ) {
            const lesson = engineeringFoundations.lessons[nextLessonIndex];
            const nextActivityIndex = lesson.activities.findIndex(
                (activity) => activity.id === activityId
            );

            if (nextActivityIndex !== -1) {
                return {
                    lessonIndex: nextLessonIndex,
                    activityIndex: nextActivityIndex,
                };
            }
        }

        return null;
    }

    return {
        currentPath() {
            return engineeringFoundations;
        },

        currentLesson() {
            return engineeringFoundations.lessons[lessonIndex];
        },

        currentActivity() {
            const lesson = engineeringFoundations.lessons[lessonIndex];
            return lesson.activities[activityIndex];
        },

        completedActivityIds() {
            return Array.from(completedActivityIds);
        },

        completeCurrentActivity() {
            const lesson = engineeringFoundations.lessons[lessonIndex];
            const activity = lesson.activities[activityIndex];
            completedActivityIds.add(activity.id);
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
            const location = findActivity(activityId);

            if (!location) {
                return false;
            }

            lessonIndex = location.lessonIndex;
            activityIndex = location.activityIndex;
            return true;
        },

        progress() {
            return {
                currentActivityId: this.currentActivity().id,
                completedActivityIds: Array.from(completedActivityIds),
            };
        },

        restoreProgress(progress: LearningProgress) {
            const location = findActivity(progress.currentActivityId);

            if (location) {
                lessonIndex = location.lessonIndex;
                activityIndex = location.activityIndex;
            }

            completedActivityIds.clear();

            for (const activityId of progress.completedActivityIds) {
                if (findActivity(activityId)) {
                    completedActivityIds.add(activityId);
                }
            }
        },
    };
}
