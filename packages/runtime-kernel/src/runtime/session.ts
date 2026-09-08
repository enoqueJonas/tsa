import { engineeringFoundations } from "../paths";
import type { Activity } from "../activities";
import type { LearningPath, Lesson } from "../paths";

export interface LearningProgress {
    currentActivityId: string;
    completedActivityIds: string[];
    reflectionResponses?: Record<string, string>;
}

export interface LearningSession {
    currentPath(): LearningPath;
    currentLesson(): Lesson;
    currentActivity(): Activity;
    completedActivityIds(): string[];
    unlockedLessonIds(): string[];
    unlockedActivityIds(): string[];
    reflectionResponse(activityId: string): string;
    setReflectionResponse(activityId: string, response: string): boolean;
    canCompleteCurrentActivity(): boolean;
    completeCurrentActivity(): boolean;
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
    const reflectionResponses = new Map<string, string>();

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
                    activity: lesson.activities[nextActivityIndex],
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

    function canCompleteActivity(activity: Activity) {
        if (activity.content.type !== "reflection") {
            return true;
        }

        return (reflectionResponses.get(activity.id) ?? "").trim().length > 0;
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

        reflectionResponse(activityId: string) {
            return reflectionResponses.get(activityId) ?? "";
        },

        setReflectionResponse(activityId: string, response: string) {
            const location = findActivity(activityId);

            if (!location || location.activity.content.type !== "reflection") {
                return false;
            }

            reflectionResponses.set(activityId, response);
            return true;
        },

        canCompleteCurrentActivity() {
            return canCompleteActivity(this.currentActivity());
        },

        completeCurrentActivity() {
            const activity = this.currentActivity();

            if (!canCompleteActivity(activity)) {
                return false;
            }

            completedActivityIds.add(activity.id);
            return true;
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
                reflectionResponses: Object.fromEntries(reflectionResponses),
            };
        },

        restoreProgress(progress: LearningProgress) {
            completedActivityIds.clear();
            reflectionResponses.clear();

            for (const [activityId, response] of Object.entries(
                progress.reflectionResponses ?? {}
            )) {
                const location = findActivity(activityId);

                if (
                    location?.activity.content.type === "reflection" &&
                    typeof response === "string"
                ) {
                    reflectionResponses.set(activityId, response);
                }
            }

            for (const activityId of progress.completedActivityIds) {
                const location = findActivity(activityId);

                if (!location) {
                    continue;
                }

                if (canCompleteActivity(location.activity)) {
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
