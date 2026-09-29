import type { LearningPath } from "./learning-path";
import { programmingWithPythonQualityLessons } from "./builder-python-quality";
import { webAndApiFoundationsQualityLessons } from "./builder-web-api-quality";
import { djangoAndApiQualityLessons } from "./builder-django-quality";
import { relationalDataAndPostgresqlQualityLessons } from "./builder-postgresql-quality";
import { identityAuthenticationAuthorizationDeepLessons } from "./builder-identity-auth-deep";
import { softwareCraftQualityLessons } from "./builder-software-craft-quality";
import { stewardApiV1Deep } from "./builder-milestone-deep";
import { extractStewardCommonLesson, reusableInternalPackageLesson } from "./internal-dependency-management";

function path(id: string, title: string, lessons: LearningPath["lessons"]): LearningPath { return { id, title, lessons }; }

export const programmingWithPython = path("programming-with-python", "Programming with Python", programmingWithPythonQualityLessons);
export const webAndApiFoundations = path("web-and-api-foundations", "Web and API Foundations", webAndApiFoundationsQualityLessons);
export const djangoAndApiEngineering = path("django-and-api-engineering", "Django and API Engineering", djangoAndApiQualityLessons);
export const relationalDataAndPostgresql = path("relational-data-and-postgresql", "Relational Data and PostgreSQL", relationalDataAndPostgresqlQualityLessons);
export const identityAuthenticationAuthorization = path("identity-authentication-authorization", "Identity, Authentication and Authorization", identityAuthenticationAuthorizationDeepLessons);
const softwareCraftLabIndex = softwareCraftQualityLessons.findIndex((lesson) => lesson.title === "Lab: Refine Steward API for Review");
const softwareCraftInsertionIndex = softwareCraftLabIndex === -1 ? softwareCraftQualityLessons.length : softwareCraftLabIndex;
export const softwareCraft = path("software-craft", "Software Craft", [
    ...softwareCraftQualityLessons.slice(0, softwareCraftInsertionIndex),
    reusableInternalPackageLesson,
    extractStewardCommonLesson,
    ...softwareCraftQualityLessons.slice(softwareCraftInsertionIndex),
]);

export const stewardApiV1: LearningPath = {
    ...stewardApiV1Deep,
    lessons: stewardApiV1Deep.lessons.map((lesson) => ({
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical") return activity;
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

// Data modeling and SQL precede Django ORM/model engineering so the framework
// is learned as an abstraction over understood relational behavior.
export const builderPaths: LearningPath[] = [
    programmingWithPython,
    webAndApiFoundations,
    relationalDataAndPostgresql,
    djangoAndApiEngineering,
    identityAuthenticationAuthorization,
    softwareCraft,
    stewardApiV1,
];
