import type { LearningPath } from "./learning-path";

/**
 * Creates a curriculum module whose lesson content has not been authored yet.
 *
 * During the build-wide phase, these paths let TSA represent the complete
 * academy without inventing placeholder activities that could be mistaken
 * for finished lessons.
 */
export function plannedPath(id: string, title: string): LearningPath {
    return {
        id,
        title,
        lessons: [],
    };
}
