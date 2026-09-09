import { systemThinkerPaths } from "./system-thinker";
import {
    technicalStewardshipJourney as plannedTechnicalStewardshipJourney,
} from "./technical-stewardship-journey";
import type { LearningJourney } from "./learning-journey";

export const technicalStewardshipJourney: LearningJourney = {
    ...plannedTechnicalStewardshipJourney,
    schools: plannedTechnicalStewardshipJourney.schools.map((school) => {
        if (school.id === "system-thinker") {
            return {
                ...school,
                paths: systemThinkerPaths,
            };
        }

        return school;
    }),
};
