import type { LearningPath } from "./learning-path";
import { programmingWithPythonQualityLessons } from "./builder-python-quality";
import { webAndApiFoundationsQualityLessons } from "./builder-web-api-quality";
import { djangoAndApiQualityLessons } from "./builder-django-quality";
import { relationalDataAndPostgresqlQualityLessons } from "./builder-postgresql-quality";
import { identityAuthenticationAuthorizationDeepLessons } from "./builder-identity-auth-deep";
import { softwareCraftQualityLessons } from "./builder-software-craft-quality";
import { stewardApiV1Deep } from "./builder-milestone-deep";

function path(id: string, title: string, lessons: LearningPath["lessons"]): LearningPath { return { id, title, lessons }; }

export const programmingWithPython = path("programming-with-python", "Programming with Python", programmingWithPythonQualityLessons);
export const webAndApiFoundations = path("web-and-api-foundations", "Web and API Foundations", webAndApiFoundationsQualityLessons);
export const djangoAndApiEngineering = path("django-and-api-engineering", "Django and API Engineering", djangoAndApiQualityLessons);
export const relationalDataAndPostgresql = path("relational-data-and-postgresql", "Relational Data and PostgreSQL", relationalDataAndPostgresqlQualityLessons);
export const identityAuthenticationAuthorization = path("identity-authentication-authorization", "Identity, Authentication and Authorization", identityAuthenticationAuthorizationDeepLessons);
export const softwareCraft = path("software-craft", "Software Craft", softwareCraftQualityLessons);
export const stewardApiV1 = stewardApiV1Deep;

export const builderPaths: LearningPath[] = [programmingWithPython, webAndApiFoundations, djangoAndApiEngineering, relationalDataAndPostgresql, identityAuthenticationAuthorization, softwareCraft, stewardApiV1];
