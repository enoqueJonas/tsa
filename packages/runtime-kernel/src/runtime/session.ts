import type { Activity } from "../activities";
import { engineeringFoundations, type LearningPath, type Lesson } from "../paths";

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

export function createLearningSession(
    path: LearningPath = engineeringFoundations
): LearningSession {
    const authoredLessons = path.lessons.filter(
        (lesson) => lesson.activities.length > 0
    );

    if (authoredLessons.length === 0) {
        throw new Error(`Learning path "${path.id}" has no authored lessons.`);
    }

    const activePath: LearningPath = {
        ...path,
        lessons: authoredLessons,
    };

    let lessonIndex = 0;
    let activityIndex = 0;
    const completedActivityIds = new Set<string>();
    const reflectionResponses = new Map<string, string>();

    function lessonAt(index: number): Lesson {
        const lesson = activePath.lessons[index];
        if (!lesson) {
            throw new Error(`Invalid lesson index ${index} for path "${activePath.id}".`);
        }
        return lesson;
    }

    function activityAt(lesson: Lesson, index: number): Activity {
        const activity = lesson.activities[index];
        if (!activity) {
            throw new Error(`Invalid activity index ${index} for lesson "${lesson.id}".`);
        }
        return activity;
    }

    function findActivity(activityId: string) {
        for (
            let nextLessonIndex = 0;
            nextLessonIndex < activePath.lessons.length;
            nextLessonIndex++
        ) {
            const lesson = lessonAt(nextLessonIndex);
            const nextActivityIndex = lesson.activities.findIndex(
                (activity) => activity.id === activityId
            );

            if (nextActivityIndex !== -1) {
                return {
                    lessonIndex: nextLessonIndex,
                    activityIndex: nextActivityIndex,
                    activity: activityAt(lesson, nextActivityIndex),
                };
            }
        }

        return null;
    }

    function getUnlockedLessonIds() {
        const unlockedLessonIds: string[] = [];

        for (let index = 0; index < activePath.lessons.length; index++) {
            const lesson = lessonAt(index);

            if (index === 0) {
                unlockedLessonIds.push(lesson.id);
                continue;
            }

            const previousLesson = lessonAt(index - 1);
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

        for (const lesson of activePath.lessons) {
            if (!unlockedLessonIds.has(lesson.id)) {
                continue;
            }

            for (let index = 0; index < lesson.activities.length; index++) {
                const activity = activityAt(lesson, index);

                if (index === 0) {
                    unlockedActivityIds.push(activity.id);
                    continue;
                }

                const previousActivity = activityAt(lesson, index - 1);

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
            return activePath;
        },

        currentLesson() {
            return lessonAt(lessonIndex);
        },

        currentActivity() {
            const lesson = lessonAt(lessonIndex);
            return activityAt(lesson, activityIndex);
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
            const lesson = lessonAt(lessonIndex);
            const hasNextActivity = activityIndex < lesson.activities.length - 1;
            const hasNextLesson = lessonIndex < activePath.lessons.length - 1;

            return hasNextActivity || hasNextLesson;
        },

        next() {
            const lesson = lessonAt(lessonIndex);

            if (activityIndex < lesson.activities.length - 1) {
                activityIndex++;
                return;
            }

            if (lessonIndex < activePath.lessons.length - 1) {
                lessonIndex++;
                activityIndex = 0;
            }
        },

        goToActivity(activityId: string) {
            const location = findActivity(activityId);

            if (!location || !getUnlockedActivityIds().includes(activityId)) {
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
                    location &&
                    location.activity.content.type === "reflection" &&
                    typeof response === "string"
                ) {
                    reflectionResponses.set(activityId, response);
                }
            }

            for (const activityId of progress.completedActivityIds) {
                const location = findActivity(activityId);

                if (location && canCompleteActivity(location.activity)) {
                    completedActivityIds.add(activityId);
                }
            }

            const location = findActivity(progress.currentActivityId);

            if (
                !location ||
                !getUnlockedActivityIds().includes(progress.currentActivityId)
            ) {
                return;
            }

            lessonIndex = location.lessonIndex;
            activityIndex = location.activityIndex;
        },
    };
}
