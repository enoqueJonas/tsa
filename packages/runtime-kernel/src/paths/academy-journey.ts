import { systemThinkerPaths } from "./system-thinker";
import { platformBuilderPaths } from "./platform-builder";
import { deliveryEngineerPaths } from "./delivery-engineer";
import {
    extractStewardCommonLesson,
    reusableInternalPackageLesson,
} from "./internal-dependency-management";
import {
    technicalStewardshipJourney as plannedTechnicalStewardshipJourney,
} from "./technical-stewardship-journey";
import type { LearningJourney } from "./learning-journey";
import type { LearningPath } from "./learning-path";

function extendBuilderPath(path: LearningPath): LearningPath {
    if (path.id === "software-craft") {
        const labIndex = path.lessons.findIndex(
            (lesson) => lesson.title === "Lab: Refine Steward API for Review"
        );
        const insertionIndex = labIndex === -1 ? path.lessons.length : labIndex;

        return {
            ...path,
            lessons: [
                ...path.lessons.slice(0, insertionIndex),
                reusableInternalPackageLesson,
                extractStewardCommonLesson,
                ...path.lessons.slice(insertionIndex),
            ],
        };
    }

    if (path.id === "steward-api-v1") {
        return {
            ...path,
            lessons: path.lessons.map((lesson) => ({
                ...lesson,
                activities: lesson.activities.map((activity) => {
                    if (activity.content.type !== "practical") {
                        return activity;
                    }

                    return {
                        ...activity,
                        content: {
                            ...activity.content,
                            instructions: [
                                ...activity.content.instructions,
                                "Where a genuinely reusable concern exists, package it as steward-common with an explicit public API and semantic version rather than copying shared source between consumers.",
                            ],
                            deliverables: [
                                ...activity.content.deliverables,
                                "Internal steward-common package and local consumption evidence when justified by the domain",
                            ],
                            completionCriteria: [
                                ...activity.content.completionCriteria,
                                "Any extracted internal package has a defensible reuse boundary; no shared library is created merely to satisfy the curriculum.",
                            ],
                        },
                    };
                }),
            })),
        };
    }

    return path;
}

export const technicalStewardshipJourney: LearningJourney = {
    ...plannedTechnicalStewardshipJourney,
    schools: plannedTechnicalStewardshipJourney.schools.map((school) => {
        if (school.id === "builder") {
            return { ...school, paths: school.paths.map(extendBuilderPath) };
        }

        if (school.id === "system-thinker") {
            return { ...school, paths: systemThinkerPaths };
        }

        if (school.id === "platform-builder") {
            return { ...school, paths: platformBuilderPaths };
        }

        if (school.id === "delivery-engineer") {
            return { ...school, paths: deliveryEngineerPaths };
        }

        return school;
    }),
};
