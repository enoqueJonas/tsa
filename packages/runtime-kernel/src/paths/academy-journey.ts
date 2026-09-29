import { builderPaths } from "./builder";
import { systemThinkerPaths } from "./system-thinker";
import { platformBuilderPaths } from "./platform-builder";
import { deliveryEngineerPaths } from "./delivery-engineer";
import { cloudEngineerPaths } from "./cloud-engineer";
import { qualityStewardPaths } from "./quality-steward";
import { securityStewardPaths } from "./security-steward";
import { reliabilityEngineerPaths } from "./reliability-engineer";
import { architectPaths } from "./architect";
import { technicalStewardPaths } from "./technical-steward";
import { professionalEngineerPaths } from "./professional-engineer";
import { technicalStewardshipJourney as plannedTechnicalStewardshipJourney } from "./technical-stewardship-journey";
import { normalizeJourney, type AuthoredLearningJourney } from "./normalize-authored-curriculum";
import type { LearningJourney } from "./learning-journey";
import type { Lesson } from "./lesson";

const authoredJourney: AuthoredLearningJourney = {
    ...plannedTechnicalStewardshipJourney,
    schools: plannedTechnicalStewardshipJourney.schools.map((school) => {
        if (school.id === "builder") return { ...school, paths: builderPaths };
        if (school.id === "system-thinker") return { ...school, paths: systemThinkerPaths };
        if (school.id === "platform-builder") return { ...school, paths: platformBuilderPaths };
        if (school.id === "delivery-engineer") return { ...school, paths: deliveryEngineerPaths };
        if (school.id === "cloud-engineer") return { ...school, paths: cloudEngineerPaths };
        if (school.id === "quality-steward") return { ...school, paths: qualityStewardPaths };
        if (school.id === "security-steward") return { ...school, paths: securityStewardPaths };
        if (school.id === "reliability-engineer") return { ...school, paths: reliabilityEngineerPaths };
        if (school.id === "architect") return { ...school, paths: architectPaths };
        if (school.id === "technical-steward") return { ...school, paths: technicalStewardPaths };
        if (school.id === "professional-engineer") return { ...school, paths: professionalEngineerPaths };
        return school;
    }),
};

const normalizedJourney = normalizeJourney(authoredJourney);

function assertUniqueIds(scope: string, values: { id: string }[]): void {
    const seen = new Set<string>();
    for (const value of values) {
        if (seen.has(value.id)) throw new Error(`Duplicate TSA ${scope} id: ${value.id}`);
        seen.add(value.id);
    }
}

function validateRuntimeJourney(journey: LearningJourney): LearningJourney {
    assertUniqueIds("school", journey.schools);

    const allLessons: Lesson[] = [];
    const allActivities: { id: string }[] = [];

    for (const school of journey.schools) {
        assertUniqueIds(`path in school ${school.id}`, school.paths);
        for (const path of school.paths) {
            allLessons.push(...path.lessons);
            allActivities.push(...path.lessons.flatMap((lesson) => lesson.activities));
        }
    }

    assertUniqueIds("lesson across journey", allLessons);
    assertUniqueIds("activity across journey", allActivities);

    const executableSchools = new Set([
        "system-thinker",
        "platform-builder",
        "delivery-engineer",
        "cloud-engineer",
        "quality-steward",
        "security-steward",
        "reliability-engineer",
        "architect",
        "technical-steward",
        "professional-engineer",
    ]);

    for (const schoolId of executableSchools) {
        const school = journey.schools.find((candidate) => candidate.id === schoolId);
        if (!school || school.paths.length === 0) throw new Error(`TSA executable school is unreachable at runtime: ${schoolId}`);
        for (const path of school.paths) {
            if (path.lessons.length === 0) throw new Error(`TSA executable path has no runtime lessons: ${schoolId}/${path.id}`);
        }
    }

    return journey;
}

export const technicalStewardshipJourney: LearningJourney = validateRuntimeJourney(normalizedJourney);
