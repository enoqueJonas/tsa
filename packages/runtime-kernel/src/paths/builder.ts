import type { LearningPath } from "./learning-path";
import { programmingWithPythonRichLessons } from "./builder-python-rich";
import { webAndApiFoundationsDeepLessons } from "./builder-web-api-deep";
import { djangoAndApiRichLessons } from "./builder-django-rich";
import { relationalDataAndPostgresqlDeepLessons } from "./builder-postgresql-deep";
import { identityAuthenticationAuthorizationDeepLessons } from "./builder-identity-auth-deep";
import { softwareCraftDeepLessons } from "./builder-software-craft-deep";
import { stewardApiV1Deep } from "./builder-milestone-deep";

function path(id: string, title: string, lessons: LearningPath["lessons"]): LearningPath { return { id, title, lessons }; }

export const programmingWithPython = path("programming-with-python", "Programming with Python", programmingWithPythonRichLessons);
export const webAndApiFoundations = path("web-and-api-foundations", "Web and API Foundations", webAndApiFoundationsDeepLessons);
export const djangoAndApiEngineering = path("django-and-api-engineering", "Django and API Engineering", djangoAndApiRichLessons);
export const relationalDataAndPostgresql = path("relational-data-and-postgresql", "Relational Data and PostgreSQL", relationalDataAndPostgresqlDeepLessons);
export const identityAuthenticationAuthorization = path("identity-authentication-authorization", "Identity, Authentication and Authorization", identityAuthenticationAuthorizationDeepLessons);
export const softwareCraft = path("software-craft", "Software Craft", softwareCraftDeepLessons);
export const stewardApiV1 = stewardApiV1Deep;

export const builderPaths: LearningPath[] = [programmingWithPython, webAndApiFoundations, djangoAndApiEngineering, relationalDataAndPostgresql, identityAuthenticationAuthorization, softwareCraft, stewardApiV1];
