import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Creates a curriculum lesson whose activities have not been authored yet.
 */
export function plannedLesson(pathId: string, title: string): Lesson {
    return {
        id: `${pathId}-${slug(title)}`,
        title,
        activities: [],
    };
}

/**
 * Creates a curriculum module whose lesson content has not been authored yet.
 *
 * During the build-wide phase, these paths let TSA represent the complete
 * academy without inventing placeholder activities that could be mistaken
 * for finished lessons.
 */
export function plannedPath(
    id: string,
    title: string,
    lessonTitles: string[] = []
): LearningPath {
    return {
        id,
        title,
        lessons: lessonTitles.map((lessonTitle) => plannedLesson(id, lessonTitle)),
    };
}
