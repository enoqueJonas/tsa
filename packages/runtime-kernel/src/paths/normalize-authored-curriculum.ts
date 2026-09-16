import type { Activity } from "../activities";
import type { LearningJourney } from "./learning-journey";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeActivity(lessonId: string, input: any, index: number): Activity {
    if (input && typeof input.id === "string" && typeof input.estimatedMinutes === "number" && input.content) {
        return input as Activity;
    }

    const title = typeof input?.title === "string" ? input.title : `Activity ${index + 1}`;
    const id = `${lessonId}-${slug(title) || `activity-${index + 1}`}`;

    if (input?.type === "practical") {
        return {
            id,
            title,
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: input.objective ?? title,
                scenario: input.scenario ?? "Apply this capability to the current TSA/Steward environment and preserve evidence of the result.",
                instructions: Array.isArray(input.instructions) ? input.instructions : [],
                deliverables: Array.isArray(input.deliverables) ? input.deliverables : ["Implementation evidence"],
                completionCriteria: Array.isArray(input.completionCriteria) ? input.completionCriteria : ["The intended capability is demonstrated with evidence."],
            },
        };
    }

    if (input?.type === "reading") {
        return {
            id,
            title,
            estimatedMinutes: 30,
            content: { type: "reading", body: input.description ?? title },
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
            instructions: [input?.description ?? "Document the decision, assumptions, boundaries and evidence."],
            deliverables: [`${title} artifact`],
            completionCriteria: ["The artifact records the decision, boundaries and evidence clearly enough for later review."],
        },
    };
}

function normalizeLesson(lesson: Lesson): Lesson {
    const activities = lesson.activities.map((activity: any, index: number) => normalizeActivity(lesson.id, activity, index));
    const ids = new Set<string>();
    for (const activity of activities) {
        if (ids.has(activity.id)) throw new Error(`Duplicate activity id "${activity.id}" in lesson "${lesson.id}".`);
        ids.add(activity.id);
    }
    return { id: lesson.id, title: lesson.title, activities };
}

function normalizePath(path: LearningPath): LearningPath {
    const lessons = path.lessons.map(normalizeLesson);
    const ids = new Set<string>();
    for (const lesson of lessons) {
        if (ids.has(lesson.id)) throw new Error(`Duplicate lesson id "${lesson.id}" in path "${path.id}".`);
        ids.add(lesson.id);
    }
    return { ...path, lessons };
}

export function normalizeJourney(journey: LearningJourney): LearningJourney {
    return {
        ...journey,
        schools: journey.schools.map((school) => ({
            ...school,
            paths: school.paths.map(normalizePath),
        })),
    };
}
