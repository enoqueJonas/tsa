import { systemThinkerPaths } from "./system-thinker";
import {
    artifactDependencySupplyChainManagement,
    extractStewardCommonLesson,
    reusableInternalPackageLesson,
} from "./internal-dependency-management";
import {
    technicalStewardshipJourney as plannedTechnicalStewardshipJourney,
} from "./technical-stewardship-journey";
import type { LearningJourney } from "./learning-journey";

export const technicalStewardshipJourney: LearningJourney = {
    ...plannedTechnicalStewardshipJourney,
    schools: plannedTechnicalStewardshipJourney.schools.map((school) => {
        if (school.id === "builder") {
            return {
                ...school,
                paths: school.paths.map((path) => {
                    if (path.id !== "software-craft") {
                        return path;
                    }

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
                }),
            };
        }

        if (school.id === "system-thinker") {
            return {
                ...school,
                paths: systemThinkerPaths,
            };
        }

        if (school.id === "delivery-engineer") {
            return {
                ...school,
                paths: school.paths.map((path) =>
                    path.id === "artifact-and-supply-chain"
                        ? artifactDependencySupplyChainManagement
                        : path
                ),
            };
        }

        return school;
    }),
};
