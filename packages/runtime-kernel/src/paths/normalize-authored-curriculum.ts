import type { Activity } from "../activities";
import type { LearningJourney } from "./learning-journey";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

export type CompactActivity = Record<string, unknown> & {
    type: string;
    title: string;
};

export type AuthoredActivity = Activity | CompactActivity;
export type AuthoredLesson = Omit<Lesson, "activities"> & { activities: AuthoredActivity[] };
export type AuthoredLearningPath = Omit<LearningPath, "lessons"> & { lessons: AuthoredLesson[] };
export type AuthoredLearningJourney = Omit<LearningJourney, "schools"> & {
    schools: Array<Omit<LearningJourney["schools"][number], "paths"> & { paths: AuthoredLearningPath[] }>;
};

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeActivity(lessonId: string, input: AuthoredActivity, index: number): Activity {
    if ("id" in input && typeof input.id === "string" && "estimatedMinutes" in input && typeof input.estimatedMinutes === "number" && "content" in input && input.content) {
        return input as Activity;
    }

    const compact = input as CompactActivity;
    const title = compact.title || `Activity ${index + 1}`;
    const id = `${lessonId}-${slug(title) || `activity-${index + 1}`}`;

    if (compact.type === "practical") {
        return {
            id,
            title,
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: typeof compact.objective === "string" ? compact.objective : title,
                scenario: typeof compact.scenario === "string" ? compact.scenario : "Apply this capability to the current TSA/Steward environment and preserve evidence of the result.",
                instructions: Array.isArray(compact.instructions) ? compact.instructions.filter((item): item is string => typeof item === "string") : [],
                deliverables: Array.isArray(compact.deliverables) ? compact.deliverables.filter((item): item is string => typeof item === "string") : ["Implementation evidence"],
                completionCriteria: Array.isArray(compact.completionCriteria) ? compact.completionCriteria.filter((item): item is string => typeof item === "string") : ["The intended capability is demonstrated with evidence."],
            },
        };
    }

    if (compact.type === "reading") {
        return {
            id,
            title,
            estimatedMinutes: 30,
            content: { type: "reading", body: typeof compact.description === "string" ? compact.description : title },
        };
    }

    return {
        id,
        title,
        estimatedMinutes: 45,
        content: {
            type: "practical",
            objective: title,
            scenario: "Turn the engineering decision into an explicit, reviewable artifact before implementation continues.",
            instructions: [typeof compact.description === "string" ? compact.description : "Document the decision, assumptions, boundaries and evidence."],
            deliverables: [`${title} artifact`],
            completionCriteria: ["The artifact records the decision, boundaries and evidence clearly enough for later review."],
        },
    };
}

function normalizeLesson(lesson: AuthoredLesson): Lesson {
    const activities = lesson.activities.map((activity, index) => normalizeActivity(lesson.id, activity, index));
    const ids = new Set<string>();
    for (const activity of activities) {
        if (ids.has(activity.id)) throw new Error(`Duplicate activity id "${activity.id}" in lesson "${lesson.id}".`);
        ids.add(activity.id);
    }
    return { ...lesson, activities };
}

function normalizePath(path: AuthoredLearningPath): LearningPath {
    const lessons = path.lessons.map(normalizeLesson);
    const ids = new Set<string>();
    for (const lesson of lessons) {
        if (ids.has(lesson.id)) throw new Error(`Duplicate lesson id "${lesson.id}" in path "${path.id}".`);
        ids.add(lesson.id);
    }
    return { ...path, lessons };
}

export function normalizeJourney(journey: AuthoredLearningJourney): LearningJourney {
    return {
        ...journey,
        schools: journey.schools.map((school) => ({
            ...school,
            paths: school.paths.map(normalizePath),
        })),
    };
}
