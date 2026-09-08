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
    unlockedLessonIds(): string[];
    unlockedActivityIds(): string[];
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

    function getUnlockedLessonIds() {
        const unlockedLessonIds: string[] = [];

        for (let index = 0; index < engineeringFoundations.lessons.length; index++) {
            const lesson = engineeringFoundations.lessons[index];

            if (index === 0) {
                unlockedLessonIds.push(lesson.id);
                continue;
            }

            const previousLesson = engineeringFoundations.lessons[index - 1];
            const previousLessonComplete = previousLesson.activities.every(
                (activity) => completedActivityIds.has(activity.id)
            );

            if (!previousLessonComplete) {
                break;
            }

            unlockedLessonIds.push(lesson.id);
        }

        return unlockedLessonIds;
    }

    function getUnlockedActivityIds() {
        const unlockedLessonIds = new Set(getUnlockedLessonIds());
        const unlockedActivityIds: string[] = [];

        for (const lesson of engineeringFoundations.lessons) {
            if (!unlockedLessonIds.has(lesson.id)) {
                continue;
            }

            for (let index = 0; index < lesson.activities.length; index++) {
                const activity = lesson.activities[index];

                if (index === 0) {
                    unlockedActivityIds.push(activity.id);
                    continue;
                }

                const previousActivity = lesson.activities[index - 1];

                if (!completedActivityIds.has(previousActivity.id)) {
                    break;
                }

                unlockedActivityIds.push(activity.id);
            }
        }

        return unlockedActivityIds;
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

        unlockedLessonIds() {
            return getUnlockedLessonIds();
        },

        unlockedActivityIds() {
            return getUnlockedActivityIds();
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

            if (!getUnlockedActivityIds().includes(activityId)) {
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
            completedActivityIds.clear();

            for (const activityId of progress.completedActivityIds) {
                if (findActivity(activityId)) {
                    completedActivityIds.add(activityId);
                }
            }

            const location = findActivity(progress.currentActivityId);

            if (!location) {
                return;
            }

            if (!getUnlockedActivityIds().includes(progress.currentActivityId)) {
                return;
            }

            lessonIndex = location.lessonIndex;
            activityIndex = location.activityIndex;
        },
    };
}
