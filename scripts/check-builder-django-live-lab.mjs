import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-rich.ts","utf8");
const identitySource = fs.readFileSync("packages/runtime-kernel/src/paths/builder-identity-auth-deep.ts","utf8");

const craftSource = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts","utf8");
function craftSnippet(caption) {
  const anchor = craftSource.indexOf('"caption": "' + caption + '"');
  assert.ok(anchor >= 0, 'Missing source-published Software Craft example: ' + caption);
  const code = craftSource.slice(anchor, anchor + 18000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(code, 'No executable source for ' + caption);
  return JSON.parse(code[1]);
}

function identitySnippet(caption) {
  const anchor = identitySource.indexOf('caption: "' + caption + '"');
  assert.ok(anchor >= 0, 'Missing exact identity learner snippet: ' + caption);
  const after = identitySource.slice(anchor, anchor + 3000).match(/\bcode:\s*("(?:\\.|[^"\\])*")/);
  if (after && after.index < 150) return JSON.parse(after[1]);
  const before = identitySource.slice(Math.max(0, anchor - 6000), anchor);
  const matches = [...before.matchAll(/\bcode:\s*("(?:\\.|[^"\\])*")/g)];
  assert.ok(matches.length, 'No identity source code for ' + caption);
  return JSON.parse(matches.at(-1)[1]);
}

function identityJsonSnippet(caption) {
  // New independently navigable Identity checkpoint publishes complete source
  // inside a structured richLesson section, not a generated test replacement.
  const anchor = '"caption":' + JSON.stringify(caption);
  const at = identitySource.indexOf(anchor);
  assert.ok(at >= 0, "Missing first-JWT learner code: " + caption);
  const code = identitySource.slice(at, at + 28000).match(
    /"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(code, "Missing complete first-JWT code block: " + caption);
  return JSON.parse(code[1]);
}

const publishedPracticeSource=fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-quality.ts","utf8");
function publishedPractice(id) {
  const key='  "django-and-api-engineering-'+id+'": {';
  const start=publishedPracticeSource.indexOf(key);
  assert.ok(start>=0,'Django practical must have explicit learner-order override: '+id);
  const end=publishedPracticeSource.indexOf('\n  "django-and-api-engineering-',start+key.length);
  return publishedPracticeSource.slice(start,end<0?publishedPracticeSource.length:end);
}
for (const id of ["django-from-zero-a-running-http-endpoint","django-foundations","django-rest-framework","projects-applications-and-boundaries",
  "steward-sql-to-django-orm-one-canonical-domain","orm-query-behavior-and-performance",
  "schema-evolution-with-django-migrations","serializers-and-representation",
  "production-readiness-commands-and-atomic-updates"]) {
  assert.ok(publishedPractice(id).includes("instructions:"),"Django practical lacks substantive instructions: "+id);
}
for(const id of ["django-from-zero-a-running-http-endpoint","django-foundations","django-rest-framework","projects-applications-and-boundaries"]){
  const practice=publishedPractice(id);
  assert.match(practice,/tsa-django-intro/,'First Django/DRF exercises must reuse scratch project');
  assert.doesNotMatch(practice,/Create Steward's first Django application|Continue the same Steward codebase/,
    'Django scratch primer cannot require an untaught Steward application');
}
assert.match(source, /"caption":"Terminal — start a separate Steward Django application"/,
  "ORM bridge must publish the independent Steward project bootstrap commands");
assert.doesNotMatch(publishedPractice("projects-applications-and-boundaries"), /run manage.py check on registry/,
  "Boundaries practical must not require a registry app before creation");
assert.match(publishedPractice("serializers-and-representation"),/serializer_lab\.py/,
  "Published serializer practice must start from the standalone book experiment");
assert.match(publishedPractice("schema-evolution-with-django-migrations"),/historical-model/,
  "Migration practice must explicitly teach historical models");
const bridge=source.indexOf('richLesson("Steward SQL to Django ORM: One Canonical Domain"');
const serializers=source.indexOf('richLesson("Serializers and Representation"');
const modelSerializer=source.indexOf('"caption":"Service serializer"');
assert.ok(bridge>=0 && serializers>bridge && modelSerializer>serializers,
  "ModelSerializer code must be introduced only after the standalone serializer lesson starts");

function snippet(caption) {
  for(const needle of [`"caption":"${caption}"`, `caption: "${caption}"`]) {
    const ix=source.indexOf(needle);
    if(ix<0)continue;
    const m=source.slice(ix,ix+18000).match(/["']?value["']?\s*:\s*("(?:\\.|[^"\\])*")/);
    assert.ok(m,"No code for "+caption);
    return JSON.parse(m[1]);
  }
  throw new Error("Missing exact learner-visible Django code: "+caption);
}
const pgLessonSource=fs.readFileSync("packages/runtime-kernel/src/paths/builder-postgresql-deep.ts","utf8");
function pgLessonCode(caption) {
  const idx=pgLessonSource.indexOf('"caption": "'+caption+'"');
  assert.ok(idx>=0,"Missing Django-dependent published lesson: "+caption);
  const m=pgLessonSource.slice(idx,idx+24000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(m,"Missing authored code for "+caption);
  return JSON.parse(m[1]);
}
// Extract the real learner-visible logging snippets, not rewritten test substitutes.
function loggingLessonSnippet(caption) {
  const target = '"caption":"' + caption + '"';
  const at = source.indexOf(target);
  assert.ok(at >= 0, "Missing published logging snippet: " + caption);
  const code = source.slice(at, at + 18000).match(/"value":("(?:\\.|[^"\\])*")/);
  assert.ok(code, "Missing published logging code: " + caption);
  return JSON.parse(code[1]);
}
const pythonLoggingIntro = source.indexOf('richLesson("Python Logging: Follow a Message to Its Destination"');
const djangoLoggingIntro = source.indexOf('richLesson("Application Logging"');
assert.ok(pythonLoggingIntro >= 0 && djangoLoggingIntro > pythonLoggingIntro,
  "Teach standard-library logging before Django LOGGING settings");
const loggingBasics = loggingLessonSnippet("logging_first_steps.py — real logger and handler levels");
const loggingPropagation = loggingLessonSnippet("logging_propagation.py — reproduce and fix duplicate messages");
const loggingSettings = loggingLessonSnippet("config/settings.py — configure a dedicated catalogue logger");
const loggingModule = loggingLessonSnippet("catalogue/logging_demo.py — two observable application events");
const loggingExampleCli = loggingLessonSnippet("Terminal — execute the Django logging example");
assert.match(loggingExampleCli, /python manage\.py shell -c/, "Lesson must give runnable Django terminal instructions");

function modelLessonSnippet(caption) {
  // The rich lesson source legitimately contains both authored TS object
  // syntax (caption: "x", value: "...") and JSON-style literal entries
  // ("caption":"x","value":"..."). Always extract the exact published
  // snippet; do not substitute a CI-only reimplementation.
  const tsAt = source.indexOf('caption: "' + caption + '"');
  const jsonAt = source.indexOf('"caption":' + JSON.stringify(caption));
  const at = tsAt >= 0 ? tsAt : jsonAt;
  assert.ok(at >= 0, "Missing exact learner-visible Django code: " + caption);
  const content = source.slice(at, at + 16000);
  const match = tsAt >= 0
    ? content.match(/value: ("(?:\\.|[^"\\])*")/)
    : content.match(/"value":("(?:\\.|[^"\\])*")/);
  assert.ok(match, "Published model example has no value: " + caption);
  return JSON.parse(match[1]);
}
const modelIntro = source.indexOf('richLesson("Define Your First Django Model"');
const modelMigrationIntro = source.indexOf('richLesson("Turn a Model into a Database Table"');
const modelRelationshipIntro = source.indexOf('richLesson("Create Relationships Between Django Models"');
const stewardModelBridge = source.indexOf('richLesson("Steward SQL to Django ORM: One Canonical Domain"');
assert.ok(modelIntro >= 0 && modelIntro < modelMigrationIntro &&
  modelMigrationIntro < modelRelationshipIntro && modelRelationshipIntro < stewardModelBridge,
  "The beginner Book, initial migration and relation mechanics must precede Steward ORM");
for (const id of [
  "define-your-first-django-model",
  "turn-a-model-into-a-database-table",
  "create-relationships-between-django-models"
]) {
  const exercise = publishedPractice(id);
  assert.match(exercise, /tsa-django-intro|catalogue/, "Django model practical must remain beginner-first");
}
const firstBookModel = modelLessonSnippet("catalogue/models.py — first complete model");
const firstMigrationCommands = modelLessonSnippet("Terminal — create and inspect the first catalogue migration");
const bookLab = modelLessonSnippet("catalogue/books_lab.py — persistence and two independent rejections");
const relationModel = modelLessonSnippet("catalogue/models.py — append two related models");
const relationMigrationCommands = modelLessonSnippet("Terminal — inspect and apply the relationship migration");
const relationLab = modelLessonSnippet("catalogue/relations_lab.py — uniqueness, PROTECT and CASCADE");
assert.match(firstMigrationCommands, /sqlmigrate catalogue 0001/);
assert.match(relationMigrationCommands, /sqlmigrate catalogue 0002/);

// The first-principles QuerySet lessons must precede the applied Steward ORM
// chapter. Extract exactly the code the learner sees, not equivalent scripts.
const querysetLessonStart = source.indexOf('richLesson("Build and Execute Your First QuerySet"');
const querysetMethodsStart = source.indexOf('richLesson("Choose Django Query Methods and Reuse Results"');
const querysetRelationsStart = source.indexOf('richLesson("Load Related Django Rows Without Repeating Queries"');
const appliedOrmStart = source.indexOf('richLesson("ORM Query Behavior and Performance"');
assert.ok(querysetLessonStart > modelRelationshipIntro &&
  querysetLessonStart < querysetMethodsStart &&
  querysetMethodsStart < querysetRelationsStart &&
  querysetRelationsStart < stewardModelBridge && stewardModelBridge < appliedOrmStart,
  "QuerySet evaluation, cache/methods and relationship-loading teaching must precede applied Steward ORM");
for (const id of [
  "build-and-execute-your-first-queryset",
  "choose-django-query-methods-and-reuse-results",
  "load-related-django-rows-without-repeating-queries"
]) {
  const practice = publishedPractice(id);
  assert.match(practice, /tsa-django-intro|catalogue/,
    "Published QuerySet practical must use migrated beginner catalogue before Steward: " + id);
}
const publishedQuerySeed = modelLessonSnippet("catalogue/query_seed.py — four books and three reading lists");
const publishedQueryRun = modelLessonSnippet("catalogue/queryset_first.py — construction versus evaluation");
const publishedQueryMethods = modelLessonSnippet("catalogue/queryset_methods.py — query method and cache experiments");
const publishedQueryRelations = modelLessonSnippet("catalogue/queryset_relations.py — N+1 before and after");
for (const [name, code] of [
  ["query_seed.py", publishedQuerySeed],
  ["queryset_first.py", publishedQueryRun],
  ["queryset_methods.py", publishedQueryMethods],
  ["queryset_relations.py", publishedQueryRelations]
]) {
  assert.match(code, /from /, "No real runnable source in " + name);
}

const domainInspectExample = modelLessonSnippet("registry/inspect_models.py — inspect the migrated domain model");
assert.match(domainInspectExample, /from registry\.models import Team, Service, Environment/,
  "Model inspection example must use absolute import in Django shell");
const modelDomainExample = modelLessonSnippet("registry/models_lab.py — safe UAT record and related query");
assert.match(modelDomainExample, /from registry\.models import Team, Service/,
  "Django shell model example must use real absolute import");
assert.match(modelDomainExample, /Service\.Lifecycle\.UAT/,
  "Training model example must not invent a production Service lacking a deployment");
assert.match(modelDomainExample, /invalid\.full_clean\(\)/,
  "Example must demonstrate the model choices validation boundary");

// Source-published migration files and programs are the tests' only inputs.
const migrationExamples = {
  optionalBook: modelLessonSnippet("catalogue/models.py — Book with an optional field"),
  optionalCheck: modelLessonSnippet("catalogue/optional_migration_check.py — verify rows survive"),
  nullableShelfBook: modelLessonSnippet("catalogue/models.py — nullable shelf_code stage"),
  shelfBaseline: modelLessonSnippet("catalogue/migration_baseline.py — create deliberate collision and capture IDs"),
  shelfBackfill: modelLessonSnippet("catalogue/migrations/0005_backfill_shelf_code.py — historical backfill"),
  shelfRepair: modelLessonSnippet("catalogue/repair_shelf_collision.py — preserve the row and change its title"),
  finalShelfBook: modelLessonSnippet("catalogue/models.py — final required unique shelf_code"),
  shelfContract: modelLessonSnippet("catalogue/migrations/0006_require_unique_shelf_code.py — enforce constraints"),
  shelfVerify: modelLessonSnippet("catalogue/verify_shelf_migration.py — positive and negative database evidence"),
  registryBaseline: modelLessonSnippet("registry/migration_identity_snapshot.py — preserve original IDs and foreign keys"),
  registryExpand: modelLessonSnippet("registry/migrations/0002_service_slug_nullable.py — expand"),
  registryCollision: modelLessonSnippet("registry/create_slug_collision.py — two UAT Services with matching slug"),
  registryBackfill: modelLessonSnippet("registry/migrations/0003_backfill_service_slugs.py — detect and backfill"),
  registryRepair: modelLessonSnippet("registry/repair_slug_collision.py — keep the Service identity"),
  registryContract: modelLessonSnippet("registry/migrations/0004_require_unique_service_slug.py — enforce"),
  registryVerify: modelLessonSnippet("registry/verify_service_slugs.py — applied-domain check"),
};
const optionalMigrationStart = source.indexOf('richLesson("Add a Field Without Losing Existing Django Rows"');
const uniqueMigrationStart = source.indexOf('richLesson("Backfill a Unique Field Without Losing Data"');
const stewardMigrationStart = source.indexOf('richLesson("Schema Evolution with Django Migrations"');
const serializerAfterMigrations = source.indexOf('richLesson("Serializers and Representation"');
assert.ok(optionalMigrationStart > querysetRelationsStart &&
  optionalMigrationStart < uniqueMigrationStart &&
  uniqueMigrationStart < stewardMigrationStart &&
  stewardMigrationStart < serializerAfterMigrations,
  "Populated-table changes must follow QuerySet basics and precede the serializer chapter");
assert.match(migrationExamples.shelfBackfill, /apps\.get_model\("catalogue", "Book"\)/);
assert.match(migrationExamples.registryBackfill, /apps\.get_model\("registry", "Service"\)/);
assert.doesNotMatch(migrationExamples.shelfBackfill, /RunPython\.noop/, "No fake reverse for irreversible data migration");
assert.doesNotMatch(migrationExamples.registryBackfill, /RunPython\.noop/, "No fake reverse for irreversible data migration");

const persistedLessonStart = source.indexOf('richLesson("Persist a Book Through a Real DRF API"');
const genericViewStart = source.indexOf('richLesson("Views, ViewSets and Routing"');
const readinessStart = source.indexOf('richLesson("Production Readiness Commands and Atomic Updates"');
assert.ok(persistedLessonStart > genericViewStart && persistedLessonStart < readinessStart,
  "Teach real persistence after introductory dispatch and before Steward readiness");
assert.match(publishedPractice("persist-a-book-through-a-real-drf-api"),
  /tsa-django-intro|catalogue/, "Persistent DRF practice must reuse the actual beginner project");
const persistedSerializer = modelLessonSnippet(
  "catalogue/stored_serializers.py — model-backed input and representation");
const persistedApi = modelLessonSnippet(
  "catalogue/stored_api.py — real GET, POST and PATCH operations");
const persistedUrls = modelLessonSnippet(
  "catalogue/urls.py — append real stored-book routes");
const persistedLab = modelLessonSnippet(
  "catalogue/stored_request_lab.py — persistent HTTP flow with failures");
assert.match(persistedApi, /serializer\.save\(\)/,
  "A real POST must save validated data before promising 201");
assert.match(persistedLab, /Book\.objects\.filter\(pk=book_id\)/,
  "Published HTTP lab must check database persistence, not just response status");

// Both error-handling lessons must prove real HTTP semantics, not just a
// pure mapping that returns Python dictionaries without framework dispatch.
const errorPrimerStart = source.indexOf('richLesson("See How DRF Turns Exceptions into HTTP Responses"');
const errorsReadinessStart = source.indexOf('richLesson("Production Readiness Commands and Atomic Updates"');
const validationStart = source.indexOf('richLesson("Validation and Business Rules"');
const errorAppliedStart = source.indexOf('richLesson("API Error Handling"');
const filteringStart = source.indexOf('richLesson("Filtering, Searching and Ordering"');
assert.ok(errorPrimerStart > validationStart && errorPrimerStart < errorAppliedStart &&
  errorsReadinessStart < validationStart && errorAppliedStart < filteringStart,
  "Real framework exception handling must precede the Steward error-contract application");
for (const id of ["see-how-drf-turns-exceptions-into-http-responses","api-error-handling"]) {
  assert.match(publishedPractice(id), /instructions:/,
    "Published error exercise must provide a concrete executable procedure: " + id);
}
const errorExamples = {
  handler: modelLessonSnippet("catalogue/error_handlers.py — preserve DRF status and headers"),
  views: modelLessonSnippet("catalogue/error_views.py — real parsing, validation and lookup"),
  routes: modelLessonSnippet("catalogue/urls.py — append error demo routes"),
  settings: modelLessonSnippet("config/settings.py — use the catalogue exception handler"),
  crashUrls: modelLessonSnippet("catalogue/error_test_urls.py — isolated unexpected-500 test only"),
  requestLab: modelLessonSnippet("catalogue/error_contract_lab.py — verify actual statuses and no writes"),
  domainHandler: modelLessonSnippet("registry/api_errors.py — real ReadinessConflict to HTTP 409"),
  domainView: modelLessonSnippet("registry/readiness_api.py — call the domain command"),
  domainUrls: modelLessonSnippet("registry/training_urls.py — isolated training route"),
  domainLab: modelLessonSnippet("registry/error_contract_lab.py — real HTTP 409 and unchanged state"),
};
assert.match(errorExamples.handler, /return None  # Unexpected failures remain HTTP 500/);
assert.match(errorExamples.domainHandler, /ReadinessConflict/);
assert.match(errorExamples.domainLab, /service\.refresh_from_db\(\)/);
assert.match(errorExamples.requestLab, /Book\.objects\.count\(\) == before/);

// Learner must encounter the actual Book query/HTTP mechanics before the
// applied Steward filtering and pagination material.
const filteringPrimerStart = source.indexOf('richLesson("Filter, Search and Order a Real Book API"');
const appliedFilteringStart = source.indexOf('richLesson("Filtering, Searching and Ordering"');
const paginationPrimerStart = source.indexOf('richLesson("Paginate Real Book Records Across Requests"');
const appliedPaginationStart = source.indexOf('richLesson("Pagination"');
const errorAppliedStartForQueries = source.indexOf('richLesson("API Error Handling"');
assert.ok(errorAppliedStartForQueries < filteringPrimerStart &&
  filteringPrimerStart < appliedFilteringStart &&
  appliedFilteringStart < paginationPrimerStart &&
  paginationPrimerStart < appliedPaginationStart,
  "Query filtering and paginating full HTTP requests must precede the Steward query modules");
for (const id of ["filter-search-and-order-a-real-book-api",
                  "paginate-real-book-records-across-requests"]) {
  assert.match(publishedPractice(id), /tsa-django-intro|catalogue/,
    "Real query/pagination teaching must reuse the learner's existing Book database: " + id);
}
const queryPaginationExamples = {
  queryView: modelLessonSnippet("catalogue/query_books.py — validate and execute real Book queries"),
  queryUrls: modelLessonSnippet("catalogue/urls.py — append the query-books endpoint"),
  queryLab: modelLessonSnippet("catalogue/query_request_lab.py — search, sort, invalid requests and real SQL"),
  pageView: modelLessonSnippet("catalogue/page_books.py — bounded page numbers and stable-key cursors"),
  pageUrls: modelLessonSnippet("catalogue/urls.py — append page and cursor endpoints"),
  pageLab: modelLessonSnippet("catalogue/pagination_request_lab.py — real offset duplicate and cursor continuation"),
};
assert.match(queryPaginationExamples.queryView, /getlist\(key\)/,
  "Untrusted repeated query params must not be silently accepted");
assert.match(queryPaginationExamples.queryLab, /CaptureQueriesContext\(connection\)/,
  "A generated-SQL string alone is not actual SQL execution evidence");
assert.match(queryPaginationExamples.pageView, /max_page_size = 3/,
  "The teaching example must actually bound the requested page size");
assert.match(queryPaginationExamples.pageView, /CursorPagination/,
  "The cursor exercise must use real DRF pagination, not Python list slicing");

// Applied Service filtering/paging now run through actual framework HTTP and
// a server-selected fixture. No authentication/Membership is silently invented.
const scopedExamples = {
  scope: modelLessonSnippet("registry/training_scope.py — server-selected Team scope and allowlisted Service lookups"),
  views: modelLessonSnippet("registry/training_query_views.py — real Service list and bounded page view"),
  urls: modelLessonSnippet("registry/training_scoped_urls.py — unpublished teaching endpoints"),
  seed: modelLessonSnippet("registry/seed_scoped_services.py — eight fictional UAT Services"),
  filterLab: modelLessonSnippet("registry/scoped_filter_lab.py — real SQL-backed boundary and negative queries"),
  pageLab: modelLessonSnippet("registry/scoped_page_lab.py — scoped HTTP page shift, cap and non-leak"),
};
assert.match(scopedExamples.scope,
  /Service\.objects\.filter\(owning_team_id=team_id\)/,
  "Visibility scope must originate in a server-selected Team before client filtering");
assert.doesNotMatch(scopedExamples.scope, /request\.GET\['team_id'\]|HTTP_X_TEAM|request\.headers/,
  "Client-controlled headers or Team ID cannot stand in for authentication");
assert.match(scopedExamples.filterLab, /CaptureQueriesContext\(connection\)/,
  "Applied scoping must capture SQL actually executed by the database");
assert.match(scopedExamples.pageLab, /"count"\] == 5/,
  "A scoped page must demonstrate counts, not only filtered response rows");
for (const id of ["filtering-searching-and-ordering", "pagination"]) {
  assert.match(publishedPractice(id), /TSA_TRAINING_TEAM_ID/,
    "Applied exercise must explain its test-only server-selected Team scope");
  assert.doesNotMatch(publishedPractice(id), /Authenticate as Team A|authenticated Team maintainer/,
    "Do not require untaught authentication/Membership in the Django module");
}

// Source-derived real HTTP versioning must follow the published Book
// pagination and precede the applied Steward compatibility analysis.
const versionedPrimerStart = source.indexOf('richLesson("Serve Two Versions of a Real Book API"');
const appliedVersionStart = source.indexOf('richLesson("API Versioning"');
const appliedPageStartForVersion = source.indexOf('richLesson("Pagination"');
assert.ok(appliedPageStartForVersion < versionedPrimerStart &&
  versionedPrimerStart < appliedVersionStart,
  "Teach actual v1/v2 Book HTTP before applied Steward compatibility analysis");
assert.match(publishedPractice("serve-two-versions-of-a-real-book-api"),
  /tsa-django-intro|catalogue/,
  "Versioning primer must reuse the existing Book API, not a new project");
const versionExamples = {
  view: modelLessonSnippet("catalogue/versioned_book_api.py — complete version-aware DRF view"),
  urls: modelLessonSnippet("catalogue/urls.py — add v1/v2 Book routes without replacing old endpoints"),
  badUrls: modelLessonSnippet("catalogue/version_bug_urls.py — isolated broken v1 for regression detection"),
  lab: modelLessonSnippet("catalogue/version_request_lab.py — real v1/v2 HTTP compatibility and mutant"),
};
assert.match(versionExamples.view, /URLPathVersioning/,
  "Versioning source must use real DRF request.version, not a dictionary mapper");
assert.match(versionExamples.view, /request\.version == "v1"/,
  "The version must influence actual response serialization");
assert.match(versionExamples.lab, /Client\(\)\.get\(new_route\)/,
  "Version behavior must execute over HTTP, not in-memory data");
assert.match(versionExamples.lab, /override_settings\(ROOT_URLCONF="catalogue\.version_bug_urls"\)/,
  "Mutant old version must remain a test-only route");

// OpenAPI teaching must export an actual annotated DRF API, not parse a
// hard-coded JSON literal that never consults Django's real route tree.
const openapiPrimerStart = source.indexOf('richLesson("Generate and Verify OpenAPI from a Real Book API"');
const openapiAppliedStart = source.indexOf('richLesson("OpenAPI and Swagger Documentation"');
const apiVersionAppliedStart = source.indexOf('richLesson("API Versioning"');
assert.ok(apiVersionAppliedStart < openapiPrimerStart &&
  openapiPrimerStart < openapiAppliedStart,
  "Teach executable schema generation and real HTTP before applied Steward OpenAPI");
assert.match(publishedPractice("generate-and-verify-openapi-from-a-real-book-api"),
  /drf-spectacular|tsa-django-intro/,
  "Schema teaching must name the generator and reuse the migrated Book app");
const schemaExamples = {
  settings: modelLessonSnippet("config/settings.py — enable drf-spectacular without erasing the error handler"),
  api: modelLessonSnippet("catalogue/contract_api.py — annotated real DRF GET and POST"),
  route: modelLessonSnippet("catalogue/contract_urls.py — one shared routing source"),
  schemaUrls: modelLessonSnippet("catalogue/openapi_urls.py — generate the two declared training endpoints"),
  urls: modelLessonSnippet("catalogue/urls.py — append live contract, schema and Swagger UI"),
  lab: modelLessonSnippet("catalogue/openapi_contract_lab.py — validated schema plus real HTTP conformance"),
};
assert.match(schemaExamples.api, /@extend_schema\(/,
  "Annotation must attach real OpenAPI metadata to executable Django views");
assert.match(schemaExamples.api, /serializer\.save\(\)/,
  "Documented 201 must result from durable database persistence");
assert.match(schemaExamples.route, /ContractBookDetail\.as_view\(\)/,
  "Schema and runtime must share actual DRF endpoint routing");
assert.match(schemaExamples.lab, /OPENAPI_TWO_VALID_LOOKING_DRIFTS_DETECTED/,
  "Schema teaching must deliberately fail on valid-looking path and field drift");
assert.match(schemaExamples.lab, /Book\.objects\.count\(\) == before \+ 1/,
  "Successful/failed API operations must check actual stored state");

const configPrimerStart = source.indexOf('richLesson("Make Django Refuse Unsafe Training Configuration"');
const appliedConfigStart = source.indexOf('richLesson("Configuration and Environments"');
const openApiLessonStart = source.indexOf('richLesson("OpenAPI and Swagger Documentation"');
assert.ok(openApiLessonStart < configPrimerStart && configPrimerStart < appliedConfigStart,
  "Actual Django startup settings must precede applied environment design");
assert.match(publishedPractice("make-django-refuse-unsafe-training-configuration"),
  /tsa-django-intro|catalogue/,
  "The settings lab must reuse the existing migrated beginner project");
const realSettingsExamples = {
  guard: modelLessonSnippet("config/lab_guard.py — check the effective training database target"),
  settings: modelLessonSnippet("config/settings.py — append guarded environment configuration"),
  lab: modelLessonSnippet("catalogue/settings_startup_lab.py — prove actual startup denial before a query"),
};
assert.match(realSettingsExamples.settings, /TSA_VALIDATE_TRAINING_SETTINGS/);
assert.match(realSettingsExamples.lab, /subprocess\.run\(/);
assert.match(realSettingsExamples.lab, /UNSAFE_DJANGO_QUERY_EXECUTED/);
assert.match(realSettingsExamples.lab, /secrets\.token_urlsafe/);

const dependencyLessonStart = source.indexOf('richLesson("Map a Directed Service Dependency into Django"');
const historyLessonStart = source.indexOf('richLesson("Persist a Steward Service Review History"');
const integratedLabStart = source.indexOf('"id": "django-and-api-engineering-lab-steward-api-skeleton"');
const configBeforeData = source.indexOf('richLesson("Configuration and Environments"');
assert.ok(configBeforeData < dependencyLessonStart &&
  dependencyLessonStart < historyLessonStart &&
  historyLessonStart < integratedLabStart,
  "The directed edge and review history prerequisites must precede integrated Steward lab");
for (const checkpoint of [
  "django-and-api-engineering-lab-steward-api-skeleton-dependency-checkpoint",
  "django-and-api-engineering-lab-steward-api-skeleton-review-history-checkpoint",
  "django-and-api-engineering-lab-steward-api-skeleton-build",
]) {
  assert.ok(source.includes('"id": "' + checkpoint + '"'),
    "The lab must expose independent activity checkpoints and preserve its original build ID: " + checkpoint);
}
const integratedLabEvidence = source.slice(integratedLabStart);
assert.match(integratedLabEvidence, /Not proved: login, verified principal/,
  "The final lab must explicitly distinguish completed integration from missing Identity");
assert.match(integratedLabEvidence, /django-and-api-engineering-lab-steward-api-skeleton-boundary-transfer/,
  "Integrated Steward lab must include an independent, navigable trust-boundary transfer");
for (const id of [
  "map-a-directed-service-dependency-into-django",
  "persist-a-steward-service-review-history",
]) {
  assert.match(publishedPractice(id), /registry\/models.py|registry\/dependency|registry\/review/,
    "Applied model checkpoint must specify its actual Django source path: " + id);
}
const stewardDataExamples = {
  dependencyModel: modelLessonSnippet("registry/models.py — append ServiceDependency with database constraints"),
  dependencyLab: modelLessonSnippet("registry/dependency_integrity_lab.py — two directions and PostgreSQL rejections"),
  dependencyCommands: modelLessonSnippet("Terminal — add and inspect the directed dependency migration"),
  reviewModel: modelLessonSnippet("registry/models.py — append historical ServiceReview with verdict CHECK"),
  reviewLab: modelLessonSnippet("registry/review_history_lab.py — three events and real negative writes"),
  reviewCommands: modelLessonSnippet("Terminal — migrate review events without altering existing Services"),
};
assert.match(stewardDataExamples.dependencyModel, /models\.CheckConstraint/);
assert.match(stewardDataExamples.dependencyModel, /models\.UniqueConstraint/);
assert.match(stewardDataExamples.dependencyLab, /IntegrityError/);
assert.match(stewardDataExamples.reviewModel, /models\.CheckConstraint/);
assert.match(stewardDataExamples.reviewLab, /ProtectedError/);

const stewardHttpPrimerStart = source.indexOf('richLesson("Serve Real Steward Services and Reviews Through DRF"');
const stewardHttpLabIndex = source.indexOf('"id": "django-and-api-engineering-lab-steward-api-skeleton-http-checkpoint"');
const stewardDataBeforeHttp = source.indexOf('richLesson("Persist a Steward Service Review History"');
const stewardFinalLabIndex = source.indexOf('"id": "django-and-api-engineering-lab-steward-api-skeleton-build"');
assert.ok(stewardDataBeforeHttp < stewardHttpPrimerStart &&
  stewardHttpPrimerStart < stewardHttpLabIndex &&
  stewardHttpLabIndex < stewardFinalLabIndex,
  "Complete PostgreSQL-backed Service/Review HTTP lesson must precede preserved final build checkpoint");
assert.match(publishedPractice("serve-real-steward-services-and-reviews-through-drf"),
  /migrations 0001–0006|integrated_http_lab.py/,
  "The HTTP practical must reuse the migrated registry and exact test source");
const integratedHttpExamples = {
  serializers: modelLessonSnippet("registry/integrated_serializers.py — bounded Service and Review fields"),
  api: modelLessonSnippet("registry/integrated_api.py — persisted list create detail and review endpoints"),
  urls: modelLessonSnippet("registry/integrated_training_urls.py — test-only integrated URL routes"),
  lab: modelLessonSnippet("registry/integrated_http_lab.py — actual POST GET state boundaries and SQL"),
  settings: modelLessonSnippet("config/settings.py — append DRF for isolated Steward HTTP requests"),
};
assert.match(integratedHttpExamples.api, /scoped_services\(/,
  "Integrated HTTP GETs must start from a trusted server-selected Team QuerySet");
assert.match(integratedHttpExamples.api, /IntegrityError/,
  "Duplicate Service writes must use the database constraint and safe HTTP mapping");
assert.match(integratedHttpExamples.api, /select_related\("service"\)/,
  "Review representation must avoid N+1 queries");
assert.doesNotMatch(integratedHttpExamples.urls, /config\/urls.py.*urlpatterns \+=/,
  "Unprotected review write API cannot be appended to the project's normal URLs");
assert.match(integratedHttpExamples.lab, /CaptureQueriesContext\(connection\)/);

const readinessLessonStart = source.indexOf('richLesson("Promote a Steward Service Through a Real HTTP Command"');
const priorIntegratedHttpStart = source.indexOf('richLesson("Serve Real Steward Services and Reviews Through DRF"');
const readinessCheckpointIndex = source.indexOf('"id": "django-and-api-engineering-lab-steward-api-skeleton-readiness-checkpoint"');
const finalBuildAfterReadiness = source.indexOf('"id": "django-and-api-engineering-lab-steward-api-skeleton-build"');
assert.ok(priorIntegratedHttpStart < readinessLessonStart &&
  readinessLessonStart < readinessCheckpointIndex &&
  readinessCheckpointIndex < finalBuildAfterReadiness,
  "Readiness HTTP and logging must be a complete prerequisite before Steward final build");
assert.match(publishedPractice("promote-a-steward-service-through-a-real-http-command"),
  /registry\/integrated_readiness_lab.py/,
  "The learner must run the complete published readiness HTTP script");
const integratedReadinessExamples = {
  view: modelLessonSnippet("registry/integrated_promotion.py — real readiness command and safe log events"),
  urls: modelLessonSnippet("registry/integrated_final_urls.py — private integration-only promotion route"),
  lab: modelLessonSnippet("registry/integrated_readiness_lab.py — 409 rollback 200 persist and safe logs"),
};
assert.match(integratedReadinessExamples.view, /promote_to_production\(service\.pk\)/);
assert.match(integratedReadinessExamples.view, /logger\.warning\(/);
assert.match(integratedReadinessExamples.lab, /private-training-marker/);
assert.match(integratedReadinessExamples.lab, /remove_environment\(production\.pk\)/);

// The final Steward OpenAPI lesson must exercise the SAME previously
// migrated PostgreSQL registry and its real integrated Service/Review and
// readiness views. Do not replace them with fabricated Book-only handlers.
const integratedSchemaLesson = source.indexOf(
  'richLesson("Verify Steward OpenAPI Against the Integrated Registry"');
const integratedSchemaCheckpoint = source.indexOf(
  '"id": "django-and-api-engineering-lab-steward-api-skeleton-schema-checkpoint"');
const readinessCheckpointForSchema = source.indexOf(
  '"id": "django-and-api-engineering-lab-steward-api-skeleton-readiness-checkpoint"');
const retainedFinalBuildForSchema = source.indexOf(
  '"id": "django-and-api-engineering-lab-steward-api-skeleton-build"');
assert.ok(integratedSchemaLesson >= 0 &&
  readinessCheckpointForSchema < integratedSchemaCheckpoint &&
  integratedSchemaCheckpoint < retainedFinalBuildForSchema,
  "Do not require final integrated OpenAPI before readiness models and HTTP");
assert.match(publishedPractice("verify-steward-openapi-against-the-integrated-registry"),
  /integrated_schema_contract_lab.py|integrated_contract_urls.py/,
  "Executable schema practical must name its real HTTP/URL source");
const stewardSchemaExamples = {
  annotated: modelLessonSnippet("registry/integrated_contract_views.py — annotate existing handlers without changing them"),
  routes: modelLessonSnippet("registry/integrated_contract_urls.py — shared real training routes"),
  docs: modelLessonSnippet("registry/integrated_schema_urls.py — isolated schema and Swagger routes"),
  settings: modelLessonSnippet("config/settings.py — append integrated Steward schema generator"),
  lab: modelLessonSnippet("registry/integrated_schema_contract_lab.py — actual HTTP, PostgreSQL and schema drift"),
};
assert.match(stewardSchemaExamples.annotated, /class DocumentedPromotion\(TrainingPromotion\)/);
assert.match(stewardSchemaExamples.routes, /DocumentedServices\.as_view\(\)/);
assert.match(stewardSchemaExamples.lab, /INTEGRATED_SCHEMA_FIELD_MUTANT_REJECTED/);
assert.match(stewardSchemaExamples.lab, /INTEGRATED_SCHEMA_PATH_MUTANT_REJECTED/);

const root=fs.mkdtempSync(path.join(os.tmpdir(),"tsa-django-bridge-"));
const exec=(command,args,env=process.env)=>{
  const p=spawnSync(command,args,{cwd:root,encoding:"utf8",timeout:60000,env});
  assert.ifError(p.error);
  assert.equal(p.status,0,`Failed ${command} ${args.join(" ")}:\n${p.stdout}\n${p.stderr}`);
  return p.stdout.trim();
};
try {
  assert.equal(process.env.PGDATABASE,"tsa_steward_lab","Live Django test requires dedicated CI PostgreSQL service");
  const loggingBasicsOutput = exec("python3", ["-c", loggingBasics]);
  assert.equal(loggingBasicsOutput, "WARNING catalogue.example book_rejected reason=missing_title");
  const propagationOutput = exec("python3", ["-c", loggingPropagation]);
  assert.match(propagationOutput, /before: 2\nafter: 1/);
  console.log("Builder logging primer passed: exact learner source, INFO suppression, WARNING delivery and propagation duplication.");
  const cli=snippet("config/urls.py — first runnable Django endpoint");
  const model=snippet("registry/models.py — canonical Steward ORM foundation");
  const serializer=snippet("Service serializer");
  const commands=snippet("registry/services.py — protect production transitions and last-deployment deletion");
  const validation=snippet("DRF validation — executable field and cross-field rejection");
  const config=snippet("Django configuration — executable environment contract");
  assert.match(exec("python3",["-c",config]),/configuration: valid local and 3 rejected setups/);


  exec("psql",["-X","-v","ON_ERROR_STOP=1","-c","CREATE DATABASE tsa_steward_django_lab;"]);
  exec("python3",["-m","django","startproject","config","."]);
  exec("python3",["manage.py","startapp","registry"]);
  fs.writeFileSync(path.join(root,"config","urls.py"),cli+"\n");
  fs.writeFileSync(path.join(root,"registry","models.py"),model+"\n");
  fs.writeFileSync(path.join(root,"registry","serializers.py"),serializer+"\n");
  fs.writeFileSync(path.join(root,"registry","services.py"),commands+"\n");
  fs.appendFileSync(path.join(root,"config","settings.py"), `
import os
INSTALLED_APPS += ['registry','rest_framework']
ALLOWED_HOSTS += ['testserver']
DATABASES = {'default': {'ENGINE': 'django.db.backends.postgresql',
    'NAME': os.environ['PGDATABASE'], 'USER': os.environ['PGUSER'],
    'PASSWORD': os.environ['PGPASSWORD'], 'HOST': os.environ['PGHOST'],
    'PORT': os.environ['PGPORT']}}
`);
  const env={...process.env,PGDATABASE:"tsa_steward_django_lab"};
  exec("python3",["manage.py","check"],env);
  exec("python3",["manage.py","makemigrations","registry","--noinput"],env);
  const plan=exec("python3",["manage.py","sqlmigrate","registry","0001"],env);
  assert.match(plan,/CREATE TABLE "team"/);
  assert.match(plan,/CREATE TABLE "service"/);
  assert.match(plan,/CREATE TABLE "environment"/);
  exec("python3",["manage.py","migrate","--noinput"],env);
  const inspectedModels = exec("python3", ["manage.py", "shell", "-c", domainInspectExample], env);
  for (const expected of [
    "Team ['id', 'name']",
    "Service ['id', 'name', 'owning_team', 'endpoint', 'lifecycle', 'criticality', 'active', 'retired_at']",
    "Environment ['id', 'service', 'name', 'kind']",
    "lifecycle_example: uat",
    "deployment_kind_example: production"
  ]) assert.ok(inspectedModels.includes(expected),
    "Published model field inspection failed: " + expected + "\n" + inspectedModels);

  // Exact Django-dependent PostgreSQL lesson code is executed in the separate
  // migration-managed database, not merely scanned for method names.
  assert.match(exec("python3",["manage.py","shell","-c",
      pgLessonCode("orm_lazy.py — real QuerySet evaluation and related-Team JOIN")],env),
      /ORM lazy: 0 SQL statements before evaluation; then 1/);
  assert.match(exec("python3",["manage.py","shell","-c",
      pgLessonCode("nplusone_fk.py — measure five queries versus one on the same Service rows")],env),
      /N\+1 owner queries: 5 -> 1/);
  assert.match(exec("python3",["manage.py","shell","-c",
      pgLessonCode("nplusone_reverse.py — prefetch a many-valued Environment relation")],env),
      /N\+1 reverse queries: 2 for 4 Services/);
  assert.match(exec("python3",["manage.py","shell","-c",
      pgLessonCode("orm_equivalence.py — identical ORM and bound-SQL results")],env),
      /ORM\/SQL equivalent: [0-9]+ matching Services/);

  assert.match(exec("python3",["manage.py","shell","-c",validation],env),/DRF validation: valid, field failure, cross-field failure/);
  const probe=`from django.test import Client
from registry.models import Team,Service,Environment
from registry.serializers import ServiceSerializer
from django.db import connection
assert Client().get('/health/').status_code==200
assert Client().get('/missing/').status_code==404
assert Client().post('/health/').status_code==405
t=Team.objects.create(name='Payments')
s=Service.objects.create(name='Payments API',owning_team=t,endpoint='https://payments.example.invalid/api',lifecycle=Service.Lifecycle.PRODUCTION)
e=Environment.objects.create(service=s,name='Primary',kind=Environment.Kind.PRODUCTION)
item=Service.objects.select_related('owning_team').get(pk=s.pk)
assert item.owning_team.name=='Payments'
assert item.lifecycle=='production' and e.kind=='production'
assert item._meta.get_field('owning_team').column=='owning_team_id'
data=ServiceSerializer(item).data
assert data['owning_team']==t.pk and data['lifecycle']=='production'
assert 'slug' not in data
assert Service.objects.filter(name='Payments API').count()==1
from registry.services import promote_to_production, remove_environment, ReadinessConflict
t2=Team.objects.create(name='Payroll')
s2=Service.objects.create(name='Payroll API',owning_team=t2,endpoint='https://payroll.example.invalid/api',lifecycle=Service.Lifecycle.UAT)
e2=Environment.objects.create(service=s2,name='UAT',kind=Environment.Kind.UAT)
try:
    promote_to_production(s2.id)
except ReadinessConflict as exc:
    assert 'environment required' in str(exc)
else:
    raise AssertionError('must reject production without deployment')
s2.refresh_from_db()
assert s2.lifecycle==Service.Lifecycle.UAT
prod=Environment.objects.create(service=s2,name='Primary',kind=Environment.Kind.PRODUCTION)
promote_to_production(s2.id)
s2.refresh_from_db()
assert s2.lifecycle==Service.Lifecycle.PRODUCTION
try:
    remove_environment(prod.id)
except ReadinessConflict as exc:
    assert 'final production environment' in str(exc)
else:
    raise AssertionError('cannot delete last production deployment')
assert Environment.objects.filter(pk=prod.pk).exists()
remove_environment(e2.id)
assert not Environment.objects.filter(pk=e2.pk).exists()
print('DJANGO_READINESS_OK rejected-then-promoted then-final-deletion-blocked')
print('DJANGO_BRIDGE_OK',item.name,item.owning_team.name,item.lifecycle,e.kind)
`;
  const output=exec("python3",["manage.py","shell","-c",probe],env);
  assert.match(output,/DJANGO_BRIDGE_OK Payments API Payments production production/);
  assert.match(output,/DJANGO_READINESS_OK rejected-then-promoted then-final-deletion-blocked/);

  // The first identity lesson only teaches the concept; the following lesson
  // must create Membership using the existing built-in auth.User in the same
  // already migrated Django project, not switch AUTH_USER_MODEL retroactively.
  const membership = identitySnippet("registry/models.py — add Membership without replacing existing models");
  fs.appendFileSync(path.join(root, "registry", "models.py"), "\n" + membership + "\n");
  const migrationOutput = exec("python3", ["manage.py", "makemigrations", "registry", "--noinput"], env);
  assert.match(migrationOutput, /0002_membership/, "Membership should be a new migration after the original ORM models");
  const membershipSql = exec("python3", ["manage.py", "sqlmigrate", "registry", "0002"], env);
  assert.match(membershipSql, /registry_membership/i, "Actual SQL must create an explicit Membership table");
  exec("python3", ["manage.py", "migrate", "registry", "--noinput"], env);
  const seedIdentity = identitySnippet("identity_membership_lab.py — real users and two Team memberships");
  assert.match(exec("python3", ["manage.py", "shell", "-c", seedIdentity], env),
    /Identity lab: 2 accounts, 2 memberships; disabled account retained/);
  const credentialLab = identitySnippet("Delegate password hashing to Django.");
  assert.match(exec("python3", ["manage.py", "shell", "-c", credentialLab], env),
    /Password lab: verifier, correct\/wrong login and inactive denial/);
  const duplicateMembership = [
    "from django.contrib.auth import get_user_model",
    "from registry.models import Team, Membership",
    "from django.db import IntegrityError",
    "ana = get_user_model().objects.get(username='tsa_ana')",
    "team = Team.objects.get(name='Platform')",
    "try:",
    "    Membership.objects.create(user=ana, team=team, role='viewer')",
    "except IntegrityError:",
    "    print('MEMBERSHIP_DUPLICATE_REJECTED')",
    "else:",
    "    raise AssertionError('duplicate team membership was accepted')",
  ].join("\n");
  assert.match(exec("python3", ["manage.py", "shell", "-c", duplicateMembership], env),
    /MEMBERSHIP_DUPLICATE_REJECTED/);
  console.log("Builder Identity Django lab passed: real built-in users, new membership migration, duplicate FK pair refusal, hashed credential, correct/wrong/inactive authentication.");

  const readablePolicy = craftSnippet("Readable Code — Django Membership policy with four real decisions");
  assert.match(exec("python3",["manage.py","shell","-c",readablePolicy],env),
    /Django readable policy: maintainer allowed; viewer, cross-team and inactive denied/);
  console.log("Builder Software Craft real Django policy passed: matching team/role grants and separate viewer/cross-team/inactive denials.");


  // Execute the actual post-primer Steward model example in its isolated
  // PostgreSQL-backed Django registry, after other contract probes so the new
  // training Service does not change existing fixture-specific row counts.
  const uatExampleFirst = exec("python3", ["manage.py", "shell", "-c", modelDomainExample], env);
  for (const expected of [
    "query_has_join: True",
    "returned_rows: 1",
    "Workshop Reports API Django Workshop uat",
    "INVALID_LIFECYCLE_REJECTED"
  ]) assert.ok(uatExampleFirst.includes(expected),
    "Incorrect published Django model example: " + expected + "\n" + uatExampleFirst);
  const uatExampleAgain = exec("python3", ["manage.py", "shell", "-c", modelDomainExample], env);
  assert.equal(uatExampleAgain.trim(), uatExampleFirst.trim(),
    "The domain model exercise must be safe to repeat without duplicate Services");
  console.log("Builder Models and Domain Data passed: actual safe UAT Service, FK JOIN, idempotent reuse and invalid lifecycle rejection.");

  // A clean PostgreSQL Django registry is required here. The original
  // integration project has already added a Membership 0002 from the later
  // Identity module; that schema history must not contaminate this lesson.
  exec("psql", ["-X", "-v", "ON_ERROR_STOP=1", "-c",
    "CREATE DATABASE tsa_steward_schema_lab;"]);
  const schemaRoot = path.join(root, "django-steward-schema");
  fs.mkdirSync(schemaRoot);
  const schemaEnv = {...env, PGDATABASE: "tsa_steward_schema_lab"};
  const schemaExec = (args) => {
    const p = spawnSync("python3", args,
      {cwd: schemaRoot, encoding: "utf8", timeout: 60000, env: schemaEnv});
    assert.ifError(p.error);
    assert.equal(p.status, 0, "Schema lab failed: python3 " + args.join(" ") +
      "\n" + p.stdout + "\n" + p.stderr);
    return p.stdout.trim();
  };
  schemaExec(["-m", "django", "startproject", "config", "."]);
  schemaExec(["manage.py", "startapp", "registry"]);
  fs.writeFileSync(path.join(schemaRoot, "registry", "models.py"), model + "\n");
  fs.appendFileSync(path.join(schemaRoot, "config", "settings.py"), [
    "", "import os", "INSTALLED_APPS += ['registry']",
    "DATABASES = {'default': {'ENGINE': 'django.db.backends.postgresql',",
    "    'NAME': os.environ['PGDATABASE'], 'USER': os.environ['PGUSER'],",
    "    'PASSWORD': os.environ['PGPASSWORD'], 'HOST': os.environ['PGHOST'],",
    "    'PORT': os.environ['PGPORT']}}", ""
  ].join("\n"));
  schemaExec(["manage.py", "check"]);
  schemaExec(["manage.py", "makemigrations", "registry", "--noinput"]);
  schemaExec(["manage.py", "migrate", "--noinput"]);
  assert.match(schemaExec(["manage.py", "showmigrations", "registry"]),
    /\[X\] 0001_initial/);
  const seedSchema = [
    "from registry.models import Team, Service, Environment",
    "team = Team.objects.create(name='Django Workshop')",
    "service = Service.objects.create(name='Workshop Reports API', owning_team=team,",
    "    endpoint='https://workshop.example.invalid/api', lifecycle=Service.Lifecycle.UAT)",
    "Environment.objects.create(service=service, name='UAT', kind=Environment.Kind.UAT)",
    "assert Service.objects.count() == 1 and Environment.objects.count() == 1",
    "print('SCHEMA_BASELINE_READY')"
  ].join("\n");
  assert.match(schemaExec(["manage.py", "shell", "-c", seedSchema]), /SCHEMA_BASELINE_READY/);

  // Transfer the complete migration workflow to the actual PostgreSQL-backed
  // registry. All earlier Steward examples already ran before changing schema.
  const registryRun = (name, content) => {
    fs.writeFileSync(path.join(schemaRoot, "registry", name), content + "\n");
    return schemaExec(["manage.py", "shell", "-c",
      "exec(open('registry/" + name + "').read())"]);
  };
  const originalRegistry = fs.readFileSync(path.join(schemaRoot, "registry", "models.py"), "utf8");
  const originalServicePosition = originalRegistry.indexOf("class Service(models.Model):");
  const serviceNameNeedle = "    name = models.TextField(unique=True)\n";
  const fieldPosition = originalRegistry.indexOf(serviceNameNeedle, originalServicePosition);
  assert.ok(originalServicePosition >= 0 && fieldPosition > originalServicePosition,
    "Cannot locate the actual Service.name definition without modifying Team.name");
  const snapshot = registryRun("migration_identity_snapshot.py", migrationExamples.registryBaseline);
  assert.match(snapshot, /original_services: \d+/);
  assert.match(snapshot, /original_environments: \d+/);
  const nullableRegistry = originalRegistry.slice(0, fieldPosition + serviceNameNeedle.length) +
    "    slug = models.SlugField(max_length=160, null=True, blank=True)\n" +
    originalRegistry.slice(fieldPosition + serviceNameNeedle.length);
  fs.writeFileSync(path.join(schemaRoot, "registry", "models.py"), nullableRegistry);
  fs.writeFileSync(path.join(schemaRoot, "registry", "migrations", "0002_service_slug_nullable.py"),
    migrationExamples.registryExpand + "\n");
  const registrySql = schemaExec(["manage.py", "sqlmigrate", "registry", "0002"]);
  assert.match(registrySql, /slug/);
  schemaExec(["manage.py", "migrate", "registry", "0002", "--noinput"]);

  const conflictSetup = registryRun("create_slug_collision.py", migrationExamples.registryCollision);
  assert.match(conflictSetup, /collision_service_pk: \d+/);
  assert.match(conflictSetup, /all_slugs_still_empty: True/);
  fs.writeFileSync(path.join(schemaRoot, "registry", "migrations", "0003_backfill_service_slugs.py"),
    migrationExamples.registryBackfill + "\n");
  const failedRegistryBackfill = spawnSync("python3",
    ["manage.py", "migrate", "registry", "--noinput"],
    {cwd: schemaRoot, encoding: "utf8", timeout: 60000, env: schemaEnv});
  assert.notEqual(failedRegistryBackfill.status, 0, "Unresolved Service slug collision must fail");
  assert.match(failedRegistryBackfill.stdout + failedRegistryBackfill.stderr,
    /duplicate Service slug: 'workshop-reports-api'/,
    "Missing real slugify collision in registry migration");
  assert.match(schemaExec(["manage.py", "showmigrations", "registry"]),
    /\[ \] 0003_backfill_service_slugs/);
  const undone = schemaExec(["manage.py", "shell", "-c",
    "from registry.models import Service; assert not Service.objects.exclude(slug__isnull=True).exists(); print('REGISTRY_BACKFILL_ROLLED_BACK')"]);
  assert.match(undone, /REGISTRY_BACKFILL_ROLLED_BACK/);

  assert.match(registryRun("repair_slug_collision.py", migrationExamples.registryRepair),
    /service_collision_repaired: \d+/);
  schemaExec(["manage.py", "migrate", "registry", "--noinput"]);
  assert.match(schemaExec(["manage.py", "showmigrations", "registry"]),
    /\[X\] 0003_backfill_service_slugs/);
  const finalRegistry = nullableRegistry.replace(
    "    slug = models.SlugField(max_length=160, null=True, blank=True)",
    "    slug = models.SlugField(max_length=160, unique=True)");
  assert.notEqual(finalRegistry, nullableRegistry);
  fs.writeFileSync(path.join(schemaRoot, "registry", "models.py"), finalRegistry);
  fs.writeFileSync(path.join(schemaRoot, "registry", "migrations", "0004_require_unique_service_slug.py"),
    migrationExamples.registryContract + "\n");
  assert.match(schemaExec(["manage.py", "sqlmigrate", "registry", "0004"]),
    /slug/);
  schemaExec(["manage.py", "migrate", "registry", "--noinput"]);
  assert.match(schemaExec(["manage.py", "makemigrations", "registry", "--check", "--dry-run"]),
    /No changes detected/);
  const verifySteward = registryRun("verify_service_slugs.py", migrationExamples.registryVerify);
  for (const expect of [
    "original_ids_and_owners_preserved: True",
    "service_slugs_valid:",
    "owner_still_present: True",
    "DUPLICATE_SERVICE_SLUG_REJECTED"
  ]) assert.ok(verifySteward.includes(expect),
    "Published Steward migration evidence missing: " + expect + "\n" + verifySteward);
  console.log("Builder Steward schema evolution passed: actual 0002/0003/0004 migration chain, collision rollback, recovery, original FKs, full model-state alignment, unique DB rejection.");

  // Build both published Steward relational concepts on the exact schemaRoot
  // that already migrated real Service slugs through 0004 on PostgreSQL.
  // Generated 0005/0006 migrations are reviewed via sqlmigrate and checked
  // against the actual Python model definitions rather than fabricated SQL.
  fs.appendFileSync(path.join(schemaRoot, "registry", "models.py"),
    "\n" + stewardDataExamples.dependencyModel + "\n");
  schemaExec(["manage.py", "check"]);
  const depMigrations = schemaExec(["manage.py", "makemigrations",
    "registry", "--name", "service_dependency"]);
  assert.match(depMigrations, /0005_service_dependency/);
  const depSql = schemaExec(["manage.py", "sqlmigrate", "registry", "0005"]);
  for (const expected of ["service_dependency", "CHECK", "UNIQUE"]) {
    assert.ok(depSql.includes(expected), "Directed edge SQL missing " + expected + "\n" + depSql);
  }
  schemaExec(["manage.py", "migrate", "registry", "0005", "--noinput"]);
  assert.match(schemaExec(["manage.py", "makemigrations",
    "registry", "--check", "--dry-run"]), /No changes detected/);
  const dependencyProof = registryRun(
    "dependency_integrity_lab.py", stewardDataExamples.dependencyLab);
  for (const expected of [
    "DIRECTED_DEPENDENCIES_BOTH_DIRECTIONS",
    "SELF_DEPENDENCY_DB_REJECTED",
    "DUPLICATE_DEPENDENCY_DB_REJECTED",
    "UNKNOWN_DEPENDENCY_FK_DB_REJECTED",
    "DEPENDENCY_TARGET_DELETE_PROTECTED",
    "DEPENDENCY_DATABASE_LAB_OK",
  ]) assert.ok(dependencyProof.includes(expected),
    "Published dependency model did not prove " + expected + "\n" + dependencyProof);
  assert.match(schemaExec(["manage.py", "shell", "-c", [
    "from registry.models import ServiceDependency",
    "assert ServiceDependency.objects.filter(source_service__name='Dependency Workshop API', target_service__name='Dependency Workshop Identity').exists()",
    "print('DEPENDENCY_REOPENED_OK')",
  ].join("\n")]), /DEPENDENCY_REOPENED_OK/);

  // Separate second migration teaches historical events, not a mutable
  // status column or a synthetic identity/access-control guarantee.
  fs.appendFileSync(path.join(schemaRoot, "registry", "models.py"),
    "\n" + stewardDataExamples.reviewModel + "\n");
  schemaExec(["manage.py", "check"]);
  const reviewMigrations = schemaExec(["manage.py", "makemigrations",
    "registry", "--name", "service_review"]);
  assert.match(reviewMigrations, /0006_service_review/);
  const reviewSql = schemaExec(["manage.py", "sqlmigrate", "registry", "0006"]);
  for (const expected of ["service_review", "CHECK", "reviewed_at"]) {
    assert.ok(reviewSql.includes(expected), "Review history SQL missing " + expected + "\n" + reviewSql);
  }
  schemaExec(["manage.py", "migrate", "registry", "0006", "--noinput"]);
  assert.match(schemaExec(["manage.py", "makemigrations",
    "registry", "--check", "--dry-run"]), /No changes detected/);
  const reviewProof = registryRun(
    "review_history_lab.py", stewardDataExamples.reviewLab);
  for (const expected of [
    "THREE_HISTORICAL_REVIEWS_SAME_SERVICE_AND_TIMESTAMP_TIE",
    "INVALID_REVIEW_VERDICT_DB_REJECTED",
    "UNKNOWN_REVIEW_SERVICE_FK_DB_REJECTED",
    "REVIEWED_SERVICE_DELETE_PROTECTED",
    "SERVICE_REVIEW_DATABASE_LAB_OK",
  ]) assert.ok(reviewProof.includes(expected),
    "Published review history did not prove " + expected + "\n" + reviewProof);
  assert.match(schemaExec(["manage.py", "shell", "-c", [
    "from registry.models import Service, ServiceDependency, ServiceReview",
    "assert ServiceReview.objects.filter(service__name='Review Workshop API').count() == 3",
    "assert ServiceDependency.objects.filter(source_service__name='Dependency Workshop API').count() == 1",
    "assert Service.objects.get(name='Workshop Reports API').slug == 'workshop-reports-api'",
    "print('REVIEW_HISTORY_REOPENED_OK')",
  ].join("\n")]), /REVIEW_HISTORY_REOPENED_OK/);
  console.log("Builder Steward data checkpoints passed: generated 0005/0006, directed edge/self/duplicate/FK/PROTECT, three persistent historical reviews, invalid verdict, no original slug regression.");

  // Assemble the published HTTP source in the SAME schemaRoot where actual
  // ServiceDependency 0005 and ServiceReview 0006 were generated/migrated.
  // Reuse existing source-published application boundaries: no invented
  // principal/membership policy, no normal-project URL publication.
  fs.appendFileSync(path.join(schemaRoot, "config", "settings.py"),
    "\n" + integratedHttpExamples.settings + "\n");
  for (const [file, body] of [
    ["training_scope.py", scopedExamples.scope],
    ["services.py", commands],
    ["api_errors.py", errorExamples.domainHandler],
    ["integrated_serializers.py", integratedHttpExamples.serializers],
    ["integrated_api.py", integratedHttpExamples.api],
    ["integrated_training_urls.py", integratedHttpExamples.urls],
    ["integrated_http_lab.py", integratedHttpExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", file), body + "\n");
  schemaExec(["manage.py", "check"]);
  const integratedHttpProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/integrated_http_lab.py').read())"]);
  for (const expected of [
    "INTEGRATED_SERVICE_LIST_SCOPED_AND_PAGED",
    "INTEGRATED_SERVICE_CREATED_SAVED_AND_REOPENED",
    "INTEGRATED_SERVICE_BAD_INPUT_400_CROSS_TEAM_404_METHOD_405",
    "INTEGRATED_REVIEW_POST_AND_SCOPED_HISTORY",
    "INTEGRATED_REVIEW_BAD_INPUT_AND_CROSS_TEAM_NO_WRITES",
    "INTEGRATED_REVIEW_SELECT_RELATED_NO_N_PLUS_ONE",
    "INTEGRATED_SERVER_SELECTED_SCOPE_NOT_IDENTITY",
    "INTEGRATED_TRAINING_HTTP_OK",
  ]) assert.ok(integratedHttpProof.includes(expected),
    "Published Steward HTTP did not establish: " + expected +
    "\n" + integratedHttpProof);
  assert.match(schemaExec(["manage.py", "shell", "-c", [
    "from registry.models import Service,ServiceReview",
    "service=Service.objects.get(slug='integrated-http-ember')",
    "assert service.owning_team.name=='Integrated HTTP Team A'",
    "assert ServiceReview.objects.filter(service=service).count()==2",
    "print('INTEGRATED_HTTP_FRESH_SHELL_OK')",
  ].join("\n")]), /INTEGRATED_HTTP_FRESH_SHELL_OK/);
  const liveRegistryUrls = fs.readFileSync(
    path.join(schemaRoot, "config", "urls.py"), "utf8");
  assert.doesNotMatch(liveRegistryUrls,
    /integrated_training_urls|TrainingServices|TrainingReviews/,
    "Unprotected training HTTP write routes must not be published");
  console.log("Builder Steward HTTP checkpoint passed: actual Postgres Service create/reread, server-owned Team and synthetic reviewer, scoped Reviews, 400/403/404/405, JOIN query counts and no rejected writes.");

  // Test real transactional readiness on the SAME PostgreSQL Steward registry
  // with migrations 0001–0006 and the previous Service/Review HTTP writes.
  for (const [name, body] of [
    ["integrated_promotion.py", integratedReadinessExamples.view],
    ["integrated_final_urls.py", integratedReadinessExamples.urls],
    ["integrated_readiness_lab.py", integratedReadinessExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", name), body + "\n");
  schemaExec(["manage.py", "check"]);
  const readinessEvidence = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/integrated_readiness_lab.py').read())"]);
  for (const expected of [
    "READINESS_REAL_HTTP_409_NO_STATE_CHANGE",
    "READINESS_CLIENT_CONTROLLED_LIFECYCLE_400",
    "READINESS_REAL_HTTP_200_PERSISTED",
    "READINESS_LAST_PRODUCTION_DEPLOYMENT_PROTECTED",
    "READINESS_CROSS_TEAM_404_UNKNOWN_404_UNSUPPORTED_405",
    "READINESS_MISSING_SERVER_SCOPE_403",
    "READINESS_SAFE_INFO_WARNING_LOGS_NO_SECRET",
    "STEWARD_INTEGRATED_READINESS_OK",
  ]) assert.ok(readinessEvidence.includes(expected),
    "Published readiness HTTP/domain/logging test missing " + expected +
    "\n" + readinessEvidence);
  assert.match(schemaExec(["manage.py", "shell", "-c", [
    "from registry.models import Service,Environment",
    "service=Service.objects.get(slug='integrated-readiness-workshop')",
    "assert service.lifecycle=='production'",
    "assert Environment.objects.filter(service=service,kind='production').count()==1",
    "print('READINESS_FRESH_SHELL_PERSISTED')",
  ].join("\n")]), /READINESS_FRESH_SHELL_PERSISTED/);
  const registryMainUrls = fs.readFileSync(
    path.join(schemaRoot, "config", "urls.py"), "utf8");
  assert.doesNotMatch(registryMainUrls, /integrated_final_urls|TrainingPromotion/,
    "Unauthenticated transaction commands must never be public project routes");
  console.log("Builder Steward readiness checkpoint passed: real PostgreSQL transaction 409 no-write, 200 persistent promotion, final deployment protected, scoped 403/404/405, and nonsecret INFO/WARNING.");

  // Continue the SAME postgres schemaRoot after ServiceReview migrations and
  // the actual integrated HTTP and readiness tests. Schema exports and
  // response tests cannot substitute a fabricated second data store.
  for (const [file, body] of [
    ["integrated_contract_views.py", stewardSchemaExamples.annotated],
    ["integrated_contract_urls.py", stewardSchemaExamples.routes],
    ["integrated_schema_urls.py", stewardSchemaExamples.docs],
    ["integrated_schema_contract_lab.py", stewardSchemaExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", file), body + "\n");
  fs.appendFileSync(path.join(schemaRoot, "config", "settings.py"),
    "\n" + stewardSchemaExamples.settings + "\n");
  schemaExec(["manage.py", "check"]);
  const exported = schemaExec([
    "manage.py", "spectacular",
    "--urlconf", "registry.integrated_contract_urls",
    "--format", "openapi-json",
    "--file", "registry/integrated_openapi.json",
    "--validate", "--fail-on-warn",
  ]);
  const exportedSchema = JSON.parse(fs.readFileSync(
    path.join(schemaRoot, "registry", "integrated_openapi.json"), "utf8"));
  assert.equal(Object.keys(exportedSchema.paths).length, 4,
    "Published schema must describe four real Steward integration paths");
  const contractProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/integrated_schema_contract_lab.py').read())"]);
  for (const expected of [
    "INTEGRATED_OPENAPI_PATHS_METHODS_STATUSES",
    "INTEGRATED_SCHEMA_AND_SWAGGER_HTTP_200",
    "INTEGRATED_SCHEMA_SERVICE_LIST_SCOPED",
    "INTEGRATED_SCHEMA_SERVICE_201_AND_FRESH_GET_200",
    "INTEGRATED_SCHEMA_INVALID_400_UNCHANGED",
    "INTEGRATED_SCHEMA_REVIEW_201_AND_LIST_200",
    "INTEGRATED_SCHEMA_READINESS_409_THEN_200_404_405",
    "INTEGRATED_SCHEMA_OTHER_TEAM_NOT_VISIBLE",
    "INTEGRATED_SCHEMA_FIELD_MUTANT_REJECTED",
    "INTEGRATED_SCHEMA_PATH_MUTANT_REJECTED",
    "INTEGRATED_STEWARD_SCHEMA_CONTRACT_OK",
  ]) assert.ok(contractProof.includes(expected),
    "Published Steward schema/runtime exercise failed: " + expected +
    "\n" + exported + "\n" + contractProof);
  const checkedRoot = fs.readFileSync(
    path.join(schemaRoot, "config", "urls.py"), "utf8");
  assert.doesNotMatch(checkedRoot,
    /integrated_contract_urls|integrated_schema_urls|DocumentedPromotion/,
    "Test-only Steward schema or mutation routes must never be published");
  console.log("Builder Steward final schema contract passed: real generated DRF schema, 201/400/403/404/405/409 over persisted PostgreSQL and two false-schema mutants.");

  // Identity must continue the SAME fully migrated PostgreSQL registry, not
  // silently jump back to the earlier 0001-only prototype. Execute the exact
  // published Membership model/seed after the real 0006 HTTP/schema proofs.
  const beforeIdentityRows = schemaExec(["manage.py", "shell", "-c", [
    "from registry.models import Service, ServiceDependency, ServiceReview",
    "assert ServiceDependency.objects.filter(source_service__name='Dependency Workshop API').exists()",
    "assert ServiceReview.objects.filter(service__name='Review Workshop API').count() == 3",
    "assert Service.objects.get(slug='integrated-http-ember').owning_team.name == 'Integrated HTTP Team A'",
    "print('IDENTITY_0006_STEWARD_DATA_PRESERVED')",
  ].join("\n")]);
  assert.match(beforeIdentityRows, /IDENTITY_0006_STEWARD_DATA_PRESERVED/);
  assert.match(schemaExec(["manage.py", "showmigrations", "registry"]),
    /\[X\] 0006_service_review/, "Do not teach Identity against the 0001-only scratch registry");
  const continuedMembership = identitySnippet(
    "registry/models.py — add Membership without replacing existing models");
  fs.appendFileSync(path.join(schemaRoot, "registry", "models.py"),
    "\n" + continuedMembership + "\n");
  const identityMigration = schemaExec(["manage.py", "makemigrations",
    "registry", "--name", "membership"]);
  assert.match(identityMigration, /0007_membership/,
    "Next Identity migration must follow the existing 0006 Steward registry");
  const identitySql = schemaExec(["manage.py", "sqlmigrate", "registry", "0007"]);
  for (const fragment of ["registry_membership", "uq_membership_user_team"]) {
    assert.match(identitySql, new RegExp(fragment, "i"),
      "Published Membership SQL must create real FK/unique constraints: " + fragment);
  }
  schemaExec(["manage.py", "migrate", "registry", "0007", "--noinput"]);
  assert.match(schemaExec(["manage.py", "showmigrations", "registry"]),
    /\[X\] 0007_membership/);
  assert.match(schemaExec(["manage.py", "makemigrations",
    "registry", "--check", "--dry-run"]), /No changes detected/);
  const continuedIdentity = identitySnippet(
    "identity_membership_lab.py — real users and two Team memberships");
  fs.writeFileSync(path.join(schemaRoot, "identity_membership_lab.py"),
    continuedIdentity + "\n");
  const continuedProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('identity_membership_lab.py').read())"]);
  assert.match(continuedProof,
    /Identity lab: 2 accounts, 2 memberships; disabled account retained/);
  const negativeMembership = schemaExec(["manage.py", "shell", "-c", [
    "from django.contrib.auth import get_user_model",
    "from django.db import IntegrityError",
    "from registry.models import Team, Membership, Service, ServiceReview, ServiceDependency",
    "ana=get_user_model().objects.get(username='tsa_ana')",
    "platform=Team.objects.get(name='Platform')",
    "original=Membership.objects.count()",
    "try:",
    "    Membership.objects.create(user=ana,team=platform,role='viewer')",
    "except IntegrityError:",
    "    pass",
    "else:",
    "    raise AssertionError('duplicate Membership unexpectedly created')",
    "assert Membership.objects.count() == original",
    "assert ServiceReview.objects.filter(service__name='Review Workshop API').count() == 3",
    "assert ServiceDependency.objects.filter(source_service__name='Dependency Workshop API').exists()",
    "assert Service.objects.get(slug='integrated-http-ember').owning_team.name == 'Integrated HTTP Team A'",
    "assert not Membership.objects.filter(user__username='tsa_bo', user__is_active=True).exists()",
    "print('IDENTITY_0007_DUPLICATE_REJECTED_0006_STATE_INTACT')",
  ].join("\n")]);
  assert.match(negativeMembership,
    /IDENTITY_0007_DUPLICATE_REJECTED_0006_STATE_INTACT/);
  console.log("Builder Identity integrated handoff passed: exact source Membership as 0007 on real 0006 Steward PostgreSQL, identity seed, duplicate denial and unchanged Service/Dependency/Review data.");

  // Next Identity lesson must NOT jump back into the independent earlier 0001
  // scratch project. Reuse the exact published credential verifier with the
  // real built-in User/Membership from the 0007 migrated Steward registry.
  const passwordSource = identitySnippet("Delegate password hashing to Django.");
  fs.writeFileSync(path.join(schemaRoot, "credential_lab.py"),
    passwordSource + "\n");
  const passwordEvidence = schemaExec(["manage.py", "shell", "-c",
    "exec(open('credential_lab.py').read())"]);
  assert.match(passwordEvidence,
    /Password lab: verifier, correct\/wrong login and inactive denial/);
  assert.doesNotMatch(passwordEvidence, /tsa-only-disposable-learning-password/,
    "Even the training-only plaintext password must not be printed");
  const freshPasswordEvidence = schemaExec(["manage.py", "shell", "-c", [
    "from django.contrib.auth import authenticate, get_user_model",
    "from registry.models import ServiceReview, Membership",
    "ana=get_user_model().objects.get(username='tsa_ana')",
    "assert ana.has_usable_password() and ana.is_active",
    "assert ana.password != 'tsa-only-disposable-learning-password'",
    "assert ana.check_password('tsa-only-disposable-learning-password')",
    "assert authenticate(username='tsa_ana',password='incorrect-password') is None",
    "assert authenticate(username='tsa_ana',password='tsa-only-disposable-learning-password').pk == ana.pk",
    "assert Membership.objects.filter(user=ana).exists()",
    "assert ServiceReview.objects.filter(service__name='Review Workshop API').count() == 3",
    "print('IDENTITY_0007_PASSWORD_FRESH_PROCESS_AND_0006_HISTORY_OK')",
  ].join("\n")]);
  assert.match(freshPasswordEvidence,
    /IDENTITY_0007_PASSWORD_FRESH_PROCESS_AND_0006_HISTORY_OK/);
  console.log("Builder Identity password continuity passed: same 0007 PostgreSQL registry, hashed verifier, valid/wrong/inactive login, fresh-process auth and unchanged Review history.");

  // Execute the EXACT learner-visible JWT teaching files, after Membership
  // 0007 and framework password verification in the SAME schemaRoot. This
  // is a real signed HTTP contract, not an illustrative decoded JSON token.
  const firstJwtLesson = identitySource.indexOf(
    '"identity-authentication-authorization-first-jwt-http-request"');
  const jwtIntegrationLesson = identitySource.indexOf(
    '"identity-authentication-authorization-drf-jwt-integration"');
  assert.ok(firstJwtLesson >= 0 && firstJwtLesson < jwtIntegrationLesson,
    "Prove one actual JWT request before asking learners to implement full JWT integration");
  const firstJwtExamples = {
    settings: identityJsonSnippet(
      "config/settings.py — append first real Steward JWT training policy"),
    api: identityJsonSnippet(
      "registry/jwt_training_api.py — resolve a real access-token principal"),
    urls: identityJsonSnippet(
      "registry/jwt_training_urls.py — test-only token and principal routes"),
    lab: identityJsonSnippet(
      "registry/jwt_first_http_lab.py — real JWT 200 401 405 and PostgreSQL invariants"),
  };
  fs.appendFileSync(path.join(schemaRoot, "config", "settings.py"),
    "\n" + firstJwtExamples.settings + "\n");
  for (const [name, body] of [
    ["jwt_training_api.py", firstJwtExamples.api],
    ["jwt_training_urls.py", firstJwtExamples.urls],
    ["jwt_first_http_lab.py", firstJwtExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", name), body + "\n");
  schemaExec(["manage.py", "check"]);
  const jwtProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/jwt_first_http_lab.py').read())"]);
  for (const expected of [
    "JWT_REAL_LOGIN_AND_REQUEST_USER_200",
    "JWT_MISSING_MALFORMED_EXPIRED_AND_REFRESH_AS_ACCESS_401",
    "JWT_REFRESH_NEW_ACCESS_200_AND_METHOD_405",
    "JWT_PRINCIPAL_NOT_TEAM_PERMISSION_AND_DOMAIN_UNCHANGED",
  ]) assert.ok(jwtProof.includes(expected),
    "Source-published real JWT checkpoint is not proven: " + expected + "\n" + jwtProof);
  assert.doesNotMatch(fs.readFileSync(path.join(schemaRoot, "config", "urls.py"), "utf8"),
    /jwt_training_urls|TrainingWhoAmI|TokenObtainPairView/,
    "Do not publish the tutorial-only identity token routes");
  console.log("Builder Identity JWT first request passed: same migrated PostgreSQL, actual signed 200 and denied 401/405 HTTP plus data invariant without Team authorization claims.");

  // Continue with an actual principal + CURRENT database membership, not
  // the earlier server-selected fake Team. The source files are taken exactly
  // from the new learner activity; all HTTP and SQL operate on schemaRoot.
  const objectAuthorizationLesson = identitySource.indexOf(
    '"identity-authentication-authorization-current-membership-http"');
  const ownershipLesson = identitySource.indexOf(
    '"identity-authentication-authorization-ownership-and-access-rules"');
  assert.ok(objectAuthorizationLesson > firstJwtLesson &&
    objectAuthorizationLesson < ownershipLesson,
    "Current Membership HTTP must follow real JWT and precede ownership transfer");
  const membershipHttpExamples = {
    api: identityJsonSnippet(
      "registry/membership_rename_api.py — real JWT and current Team Membership PATCH"),
    urls: identityJsonSnippet(
      "registry/membership_training_urls.py — isolated signed-object authorization route"),
    lab: identityJsonSnippet(
      "registry/membership_http_lab.py — signed 200 400 401 403 404 and revoked-role invariants"),
  };
  for (const [name, body] of [
    ["membership_rename_api.py", membershipHttpExamples.api],
    ["membership_training_urls.py", membershipHttpExamples.urls],
    ["membership_http_lab.py", membershipHttpExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", name), body + "\n");
  schemaExec(["manage.py", "check"]);
  const membershipHttpEvidence = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/membership_http_lab.py').read())"]);
  for (const expected of [
    "MEMBERSHIP_REAL_JWT_SAME_TEAM_PATCH_200_SAVED",
    "MEMBERSHIP_REAL_JWT_CROSS_TEAM_AND_VIEWER_403_NO_WRITES",
    "MEMBERSHIP_FORGED_FIELDS_400_MISSING_OBJECT_404",
    "MEMBERSHIP_REVOKED_SAME_VALID_JWT_NOW_403_NO_WRITE",
    "MEMBERSHIP_REAL_OTHER_TEAM_MAINTAINER_200_REVIEW_HISTORY_UNCHANGED",
    "MEMBERSHIP_POLICY_REAL_HTTP_POSTGRES_OK",
  ]) assert.ok(membershipHttpEvidence.includes(expected),
    "Source-published Membership-authorized HTTP lacked proof: " + expected +
    "\n" + membershipHttpEvidence);
  assert.doesNotMatch(fs.readFileSync(path.join(schemaRoot, "config", "urls.py"), "utf8"),
    /membership_training_urls|membership_rename_api|TrainingRenameService/,
    "Never publish tutorial Membership mutation routes");
  console.log("Builder Identity current Membership HTTP passed: signed same-team 200, viewer/cross-team/revoked 403 with unchanged rows, forged 400, absent 404 and preserved Review history.");

  // PED-029C: execute exact learner sources on the SAME migrated registry.
  const membershipReadLesson = identitySource.indexOf(
    '"identity-authentication-authorization-current-membership-reads"');
  assert.ok(membershipReadLesson > objectAuthorizationLesson &&
    membershipReadLesson < ownershipLesson,
    "Signed collection visibility must follow actual Membership PATCH");
  const readExamples = {
    api: identityJsonSnippet(
      "registry/membership_read_api.py — current principal collection and detail scope"),
    urls: identityJsonSnippet(
      "registry/membership_read_urls.py — isolated current Membership reads"),
    lab: identityJsonSnippet(
      "registry/membership_read_lab.py — real signed collection detail revocation and SQL checks"),
  };
  for (const [file, content] of [
    ["membership_read_api.py", readExamples.api],
    ["membership_read_urls.py", readExamples.urls],
    ["membership_read_lab.py", readExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", file), content);
  const readProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/membership_read_lab.py').read())"]);
  for (const expected of [
    "MEMBERSHIP_READ_SQL_SCOPE_BEFORE_COUNT_AND_LIMIT",
    "MEMBERSHIP_READ_REAL_JWT_VIEWER_PAGES_DETAIL_AND_CONCEALED_404",
    "MEMBERSHIP_READ_SAME_JWT_MULTI_TEAM_UNKNOWN_ROLE_AND_REVOCATION",
    "MEMBERSHIP_READ_ALL_SERVICE_ROWS_UNCHANGED",
    "MEMBERSHIP_READ_REAL_POSTGRES_OK",
  ]) assert.ok(readProof.includes(expected), expected + "\n" + readProof);
  assert.doesNotMatch(fs.readFileSync(path.join(schemaRoot, "config", "urls.py"), "utf8"),
    /membership_read_urls|membership_read_api|VisibleServiceList/,
    "Never publish the training-only collection routes");

  // Rollback in the learner script allows independent broken-policy runs.
  // Each subprocess reloads the changed source; remove bytecode to avoid
  // timestamp/size cache reuse. Restore correct source even on failure.
  const readApiPath = path.join(schemaRoot, "registry", "membership_read_api.py");
  try {
    for (const [name, old, replacement] of [
      ["unscoped-list",
        "page.paginate_queryset(visible_services(request.user), request)",
        'page.paginate_queryset(Service.objects.order_by("pk"), request)'],
      ["unscoped-detail",
        "get_object_or_404(visible_services(request.user), pk=service_id)",
        "get_object_or_404(Service.objects.all(), pk=service_id)"],
      ["unrecognized-role-grants-read",
        'role__in=[Membership.Role.VIEWER,\n                            Membership.Role.MAINTAINER]',
        'role__in=[Membership.Role.VIEWER, Membership.Role.MAINTAINER, "unknown"]'],
    ]) {
      assert.ok(readExamples.api.includes(old), "Missing policy mutation target: " + name);
      fs.writeFileSync(readApiPath, readExamples.api.replace(old, replacement));
      fs.rmSync(path.join(schemaRoot, "registry", "__pycache__"), {recursive: true, force: true});
      const mutant = spawnSync("python3", ["manage.py", "shell", "-c",
        "exec(open('registry/membership_read_lab.py').read())"],
        {cwd: schemaRoot, env: schemaEnv, encoding: "utf8", timeout: 60000});
      assert.ifError(mutant.error);
      assert.notEqual(mutant.status, 0, "Broken policy escaped learner assertions: " + name);
      assert.match(mutant.stderr, /AssertionError/, "Mutant must fail an evidence assertion: " + name);
    }
  } finally {
    fs.writeFileSync(readApiPath, readExamples.api);
    fs.rmSync(path.join(schemaRoot, "registry", "__pycache__"), {recursive: true, force: true});
  }
  console.log("Builder Identity collection reads passed: real JWT, scoped count/pages/detail, current multi-Team roles, revoked access, unchanged rows; three broken policies rejected.");

  // The POST boundary has no persisted Service for an object hook to check.
  const membershipCreateLesson = identitySource.indexOf(
    '"identity-authentication-authorization-current-membership-create"');
  assert.ok(membershipCreateLesson > membershipReadLesson &&
    membershipCreateLesson < ownershipLesson,
    "Create authorization must follow signed reads and precede ownership commands");
  const createExamples = {
    api: identityJsonSnippet(
      "registry/membership_create_api.py — authorize current maintainer before Service insert"),
    urls: identityJsonSnippet(
      "registry/membership_create_urls.py — private signed Service creation route"),
    lab: identityJsonSnippet(
      "registry/membership_create_lab.py — signed create denials committed row and cleanup"),
  };
  for (const [file, content] of [
    ["membership_create_api.py", createExamples.api],
    ["membership_create_urls.py", createExamples.urls],
    ["membership_create_lab.py", createExamples.lab],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", file), content);
  const createProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/membership_create_lab.py').read())"]);
  for (const expected of [
    "MEMBERSHIP_CREATE_401_AND_VIEWER_CROSS_TEAM_403_NO_WRITES",
    "MEMBERSHIP_CREATE_FORGED_FIELDS_AND_INVALID_INPUT_400_NO_WRITES",
    "MEMBERSHIP_CREATE_REAL_201_DETAIL_200_AND_FRESH_PROCESS_COMMITTED",
    "MEMBERSHIP_CREATE_DB_UNIQUENESS_400_AND_SUBSEQUENT_201",
    "MEMBERSHIP_CREATE_SAME_JWT_DOWNGRADE_REVOCATION_AND_OTHER_TEAM_201",
    "MEMBERSHIP_CREATE_ORIGINAL_ROWS_PRESERVED_FIXTURES_CLEANED",
    "MEMBERSHIP_CREATE_REAL_POSTGRES_OK",
  ]) assert.ok(createProof.includes(expected), expected + "\n" + createProof);
  assert.doesNotMatch(fs.readFileSync(path.join(schemaRoot, "config", "urls.py"), "utf8"),
    /membership_create_urls|membership_create_api|MembershipServiceCreate/,
    "Never publish the training-only create route");
  const createApiPath = path.join(schemaRoot, "registry", "membership_create_api.py");
  try {
    for (const [name, old, replacement] of [
      ["viewer-can-create", "role=Membership.Role.MAINTAINER",
        "role__in=[Membership.Role.VIEWER, Membership.Role.MAINTAINER]"],
      ["destination-team-unchecked", "user=request.user, team_id=team_id,",
        "user=request.user,"],
      ["authority-field-input-accepted",
        'not isinstance(request.data, dict)\n                    or set(request.data) - {"name", "slug", "endpoint", "criticality"}',
        "not isinstance(request.data, dict)"],
    ]) {
      assert.ok(createExamples.api.includes(old), "Missing create mutation target: " + name);
      fs.writeFileSync(createApiPath, createExamples.api.replace(old, replacement));
      fs.rmSync(path.join(schemaRoot, "registry", "__pycache__"), {recursive: true, force: true});
      const mutant = spawnSync("python3", ["manage.py", "shell", "-c",
        "exec(open('registry/membership_create_lab.py').read())"],
        {cwd: schemaRoot, env: schemaEnv, encoding: "utf8", timeout: 60000});
      assert.ifError(mutant.error);
      assert.notEqual(mutant.status, 0, "Broken creation policy escaped: " + name);
      assert.match(mutant.stderr, /AssertionError/, "Must fail evidence, not imports: " + name);
      // Cleanup also runs on failed assertions. Prove no mutant fixtures leaked.
      assert.match(schemaExec(["manage.py", "shell", "-c",
        "from registry.models import Team; from django.contrib.auth import get_user_model; " +
        "assert not Team.objects.filter(name__startswith='Identity create lab ').exists(); " +
        "assert not get_user_model().objects.filter(username__startswith='tsa_create_lab_').exists(); " +
        "print('CREATE_MUTANT_FIXTURES_CLEAN')"]), /CREATE_MUTANT_FIXTURES_CLEAN/);
    }
  } finally {
    fs.writeFileSync(createApiPath, createExamples.api);
    fs.rmSync(path.join(schemaRoot, "registry", "__pycache__"), {recursive: true, force: true});
  }
  console.log("Builder Identity Service create passed: signed maintainer 201 committed across processes, viewer/cross-Team/revoked 403 no writes, forged/duplicate 400, recovery 201, exact fixture cleanup and three policy mutants rejected.");
  for (const [file, caption] of [
    ["environment_membership_api.py", "registry/environment_membership_api.py — authorize the stored parent"],
    ["environment_membership_urls.py", "registry/environment_membership_urls.py — private nested route"],
    ["environment_membership_lab.py", "registry/environment_membership_lab.py — signed nested negatives"],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", file), identityJsonSnippet(caption));
  const nestedProof = schemaExec(["manage.py", "shell", "-c",
    "exec(open('registry/environment_membership_lab.py').read())"]);
  assert.match(nestedProof, /NESTED_ENVIRONMENT_SIGNED_PARENT_POLICY_AND_UNCHANGED_ROWS_OK/);
  assert.match(nestedProof, /NESTED_ENVIRONMENT_FIXTURES_ROLLED_BACK/);
  assert.doesNotMatch(fs.readFileSync(path.join(schemaRoot, "config", "urls.py"), "utf8"), /environment_membership/);
  console.log("Builder signed nested Environment parent policy passed.");
  for (const [file, caption] of [
    ["dependency_membership_api.py", "registry/dependency_membership_api.py — authorize both stored edge endpoints"],
    ["dependency_membership_urls.py", "registry/dependency_membership_urls.py — private signed edge route"],
    ["dependency_membership_lab.py", "registry/dependency_membership_lab.py — signed directed-edge evidence"],
  ]) fs.writeFileSync(path.join(schemaRoot, "registry", file), identityJsonSnippet(caption));
  const edgeProof = schemaExec(["manage.py", "shell", "-c", "exec(open('registry/dependency_membership_lab.py').read())"]);
  assert.match(edgeProof, /DEPENDENCY_SIGNED_SOURCE_TARGET_DIRECTION_AND_REVOCATION_OK/);
  assert.match(edgeProof, /DEPENDENCY_FIXTURES_ROLLED_BACK/);
  assert.doesNotMatch(fs.readFileSync(path.join(schemaRoot,"config","urls.py"),"utf8"), /dependency_membership/);
  console.log("Builder signed dependency source and target policy passed.");



























  // Existing domain command and PostgreSQL migration lab completed above.
  // Exercise published HTTP exception code against its real stored state;
  // training URLs are ONLY passed through override_settings in the source.
  for (const [file, body] of [
    ["api_errors.py", errorExamples.domainHandler],
    ["readiness_api.py", errorExamples.domainView],
    ["training_urls.py", errorExamples.domainUrls],
    ["error_contract_lab.py", errorExamples.domainLab],
  ]) fs.writeFileSync(path.join(root, "registry", file), body + "\n");
  exec("python3", ["manage.py", "check"], env);
  const errorDomainProof = exec("python3", ["manage.py", "shell", "-c",
    "exec(open('registry/error_contract_lab.py').read())"], env);
  for (const expected of [
    "READINESS_409_NO_MUTATION", "READINESS_PROMOTION_200",
    "READINESS_404_405", "TRAINING_ONLY_NOT_AUTHORIZED_FOR_PUBLIC_DEPLOYMENT"
  ]) assert.ok(errorDomainProof.includes(expected),
    "Missing real Steward HTTP domain result: " + expected + "\n" + errorDomainProof);
  const realRootUrls = fs.readFileSync(path.join(root, "config", "urls.py"), "utf8");
  assert.doesNotMatch(realRootUrls, /training_urls|TrainingPromotionView/,
    "Do not accidentally publish the unauthenticated training promotion endpoint");
  console.log("Builder DRF applied error contract passed: actual 409/200/404/405 HTTP and unchanged PostgreSQL state after denied transition.");

  for (const [filename, body] of [
    ["training_scope.py", scopedExamples.scope],
    ["training_query_views.py", scopedExamples.views],
    ["training_scoped_urls.py", scopedExamples.urls],
    ["seed_scoped_services.py", scopedExamples.seed],
    ["scoped_filter_lab.py", scopedExamples.filterLab],
    ["scoped_page_lab.py", scopedExamples.pageLab],
  ]) fs.writeFileSync(path.join(root, "registry", filename), body + "\n");
  exec("python3", ["manage.py", "check"], env);
  const scopedSeed = exec("python3", ["manage.py", "shell", "-c",
    "exec(open('registry/seed_scoped_services.py').read())"], env);
  assert.match(scopedSeed, /SCOPED_FIXTURE_FIVE_AND_THREE/);
  const scopedHttp = exec("python3", ["manage.py", "shell", "-c",
    "exec(open('registry/scoped_filter_lab.py').read())"], env);
  for (const expected of [
    "SCOPE_FIVE_NO_OTHER_TEAM_SQL_CONFIRMED",
    "SCOPE_CRITICALITY_LIFECYCLE_INTERSECTION_TWO",
    "SCOPE_OTHER_TEAM_REQUEST_RETURNS_ZERO",
    "SCOPE_SEVEN_BAD_QUERIES_400_NO_WRITES",
    "SCOPE_NOT_CONFIGURED_403",
    "SCOPED_STEWARD_QUERY_OK"
  ]) assert.ok(scopedHttp.includes(expected),
    "Published applied-scoping request failed: " + expected + "\n" + scopedHttp);
  const scopedPageHttp = exec("python3", ["manage.py", "shell", "-c",
    "exec(open('registry/scoped_page_lab.py').read())"], env);
  for (const expected of [
    "SCOPED_FIRST_PAGE_FIVE",
    "SCOPED_OFFSET_DUPLICATE_AFTER_INSERT",
    "SCOPED_PAGE_SIZE_CAPPED_THREE",
    "SCOPED_BAD_PAGES_400_OUT_OF_RANGE_404",
    "TRUSTED_SCOPE_CHANGES_WITH_SERVER_CONFIG_NOT_QUERY",
    "SCOPED_STEWARD_PAGINATION_OK"
  ]) assert.ok(scopedPageHttp.includes(expected),
    "Published scoped pagination failed: " + expected + "\n" + scopedPageHttp);
  const deployedUrls = fs.readFileSync(path.join(root, "config", "urls.py"), "utf8");
  assert.doesNotMatch(deployedUrls, /training_scoped_urls|TrainingServicePages|TrainingServiceList/,
    "Lab-only Team scoped URL may not become a public endpoint");
  console.log("Builder Steward scoped queries/pages passed: 5/3 real Team rows, client cannot broaden visibility, scoped SQL/COUNT, 403/400/404 negatives, bounded pages and moving-offset duplicate.");



  // Reconstruct the independent beginner lab from the actual authored Django
  // and DRF lessons, rather than testing equivalent code written only here.
  // Its app has no database models and must never mutate the Steward fixture.
  const authoredSnippet = (caption) => {
    const index = source.indexOf('"caption": "' + caption + '"');
    assert.ok(index >= 0, "Missing beginner Django code block: " + caption);
    const match = source.slice(index, index + 12000).match(/"value":\s*("(?:\\.|[^"\\])*")/);
    assert.ok(match, "Missing code for beginner Django caption: " + caption);
    return JSON.parse(match[1]);
  };
  assert.doesNotMatch(source, /title: "Steward connection"/, "Do not inject generic Steward callouts into every conceptual reading");
  assert.ok(source.includes("djangoActivityNames"), "Django learner headings need intentional names");

  const beginnerRoot = path.join(root, "django-beginner");
  fs.mkdirSync(beginnerRoot);
  const beginnerExec = (args) => {
    const process = spawnSync("python3", args, { cwd: beginnerRoot, encoding: "utf8", timeout: 60000, env });
    assert.ifError(process.error);
    assert.equal(process.status, 0,
      "Beginner Django example failed: python3 " + args.join(" ") + "\n" + process.stdout + "\n" + process.stderr);
    return process.stdout;
  };
  beginnerExec(["-m", "django", "startproject", "config", "."]);
  beginnerExec(["manage.py", "startapp", "catalogue"]);
  fs.appendFileSync(path.join(beginnerRoot, "config", "settings.py"),
    "\nINSTALLED_APPS += ['catalogue', 'rest_framework']\nALLOWED_HOSTS += ['testserver']\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "views.py"),
    authoredSnippet("catalogue/views.py — full view, without a database") + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "config", "urls.py"),
    authoredSnippet("config/urls.py — project-level URL delegation") + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "api_views.py"),
    authoredSnippet("catalogue/api_views.py — complete request/response example") + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "serializers.py"),
    authoredSnippet("catalogue/serializers.py — complete plain serializer") + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "book_api.py"),
    authoredSnippet("catalogue/book_api.py — explicit class-based dispatch") + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "viewset_demo.py"),
    authoredSnippet("catalogue/viewset_demo.py — named actions over a fixed catalogue") + "\n");
  const urls = [
    authoredSnippet("catalogue/urls.py — preserve the original plain Django endpoint"),
    authoredSnippet("catalogue/urls.py — add these lines, keep existing urlpatterns"),
    authoredSnippet("catalogue/urls.py — append a ViewSet through SimpleRouter")
  ].join("\n\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "urls.py"), urls + "\n");
  beginnerExec(["manage.py", "check"]);
  // Apply the published Django LOGGING setting to the real scratch project.
  const settingsPath = path.join(beginnerRoot, "config", "settings.py");
  fs.appendFileSync(settingsPath, "\n" + loggingSettings + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "logging_demo.py"), loggingModule + "\n");
  beginnerExec(["manage.py", "check"]);
  const loggingProbe = () => {
    const result = spawnSync("python3", ["manage.py", "shell", "-c",
      "from catalogue.logging_demo import find_book; print(find_book(5)); print(find_book(-1))"],
      {cwd: beginnerRoot, encoding: "utf8", timeout: 60000, env});
    assert.ifError(result.error);
    assert.equal(result.status, 0, "Django logging example failed: " + result.stdout + result.stderr);
    assert.ok(result.stdout.includes("{'id': 5}"));
    assert.match(result.stdout, /None/);
    return result.stderr;
  };
  const logged = loggingProbe();
  assert.match(logged, /INFO catalogue\.logging_demo book_lookup_requested book_id=5/);
  assert.match(logged, /WARNING catalogue\.logging_demo book_lookup_rejected reason=invalid_id/);
  assert.equal((logged.match(/book_lookup_requested/g) ?? []).length, 1, "Unexpected duplicate INFO event");
  assert.equal((logged.match(/book_lookup_rejected/g) ?? []).length, 1, "Unexpected duplicate WARNING event");

  const warningOnly = loggingSettings.replace('"level": "INFO"', '"level": "WARNING"');
  assert.notEqual(warningOnly, loggingSettings, "No handler level to tighten");
  fs.writeFileSync(settingsPath, fs.readFileSync(settingsPath, "utf8").replace(loggingSettings, warningOnly));
  const filtered = loggingProbe();
  assert.doesNotMatch(filtered, /book_lookup_requested/, "INFO must be filtered at WARNING handler");
  assert.match(filtered, /WARNING catalogue\.logging_demo book_lookup_rejected reason=invalid_id/);
  fs.writeFileSync(settingsPath, fs.readFileSync(settingsPath, "utf8").replace(warningOnly, loggingSettings));
  console.log("Builder Django logging passed: actual settings/module, normal and rejected event, no duplication, handler threshold failure case.");


  // The same independent catalogue scratch project now teaches models before
  // the full Steward SQL/ORM bridge. Execute the published source and both
  // migration and database-rejection boundaries, not equivalent test fixtures.
  const modelPath = path.join(beginnerRoot, "catalogue", "models.py");
  fs.writeFileSync(modelPath, firstBookModel + "\n");
  beginnerExec(["manage.py", "check"]);
  const unmigrated = spawnSync("python3",
    ["manage.py", "shell", "-c", "from catalogue.models import Book; Book.objects.count()"],
    {cwd: beginnerRoot, encoding: "utf8", timeout: 60000, env});
  assert.notEqual(unmigrated.status, 0, "An uncreated model table must not be queryable");
  assert.match(unmigrated.stderr, /no such table|does not exist/i,
    "Unmigrated model must produce a recognizable database-table failure");

  beginnerExec(["manage.py", "makemigrations", "catalogue", "--noinput"]);
  const firstSql = beginnerExec(["manage.py", "sqlmigrate", "catalogue", "0001"]);
  assert.match(firstSql, /CREATE TABLE.+catalogue_book/s);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]), /\[ \] 0001_initial/);
  beginnerExec(["manage.py", "migrate", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]), /\[X\] 0001_initial/);

  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "books_lab.py"), bookLab + "\n");
  const saved = beginnerExec(["manage.py", "shell", "-c", "exec(open('catalogue/books_lab.py').read())"]);
  for (const expected of ["saved_books: 1", "titles: ['The River']", "BLANK_TITLE_REJECTED", "DUPLICATE_TITLE_REJECTED"]) {
    assert.ok(saved.includes(expected), "Missing published Book lab outcome: " + expected + "\n" + saved);
  }

  fs.appendFileSync(modelPath, "\n\n" + relationModel + "\n");
  beginnerExec(["manage.py", "check"]);
  beginnerExec(["manage.py", "makemigrations", "catalogue", "--noinput"]);
  const relationSql = beginnerExec(["manage.py", "sqlmigrate", "catalogue", "0002"]);
  assert.match(relationSql, /catalogue_readinglist/);
  assert.match(relationSql, /catalogue_readinglistentry/);
  beginnerExec(["manage.py", "migrate", "catalogue", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]), /\[X\] 0002_/);
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "relations_lab.py"), relationLab + "\n");
  const related = beginnerExec(["manage.py", "shell", "-c", "exec(open('catalogue/relations_lab.py').read())"]);
  for (const expected of ["list_items: 1", "DUPLICATE_MEMBERSHIP_REJECTED", "BOOK_DELETE_PROTECTED",
    "entries_after_list_delete: 0", "books_after_list_delete: 1"]) {
    assert.ok(related.includes(expected), "Missing published relation proof: " + expected + "\n" + related);
  }
  console.log("Builder Django model/migration/relationship lessons passed: missing-table negative, SQL migration inspection, blank/unique rejections, PROTECT/CASCADE/paired uniqueness.");

  const queryExamples = {
    "query_seed.py": publishedQuerySeed,
    "queryset_first.py": publishedQueryRun,
    "queryset_methods.py": publishedQueryMethods,
    "queryset_relations.py": publishedQueryRelations,
  };
  const runPublishedQueryExample = (name) => {
    fs.writeFileSync(path.join(beginnerRoot, "catalogue", name), queryExamples[name] + "\n");
    return beginnerExec(["manage.py", "shell", "-c", "exec(open('catalogue/" + name + "').read())"]);
  };

  const seedEvidence = runPublishedQueryExample("query_seed.py");
  for (const expected of ["books_ready: 4", "lists_ready: 3", "entries_ready: 3"]) {
    assert.ok(seedEvidence.includes(expected), "Missing published SQL fixture observation: " + expected);
  }
  const repeatedSeed = runPublishedQueryExample("query_seed.py");
  assert.equal(repeatedSeed.trim(), seedEvidence.trim(), "Seed must be safe and idempotent on repeated runs");

  const queried = runPublishedQueryExample("queryset_first.py");
  for (const expected of [
    "construction_queries: 0", "generated_sql_has_where: True",
    "evaluation_queries: 1", "titles: ['River Guide', 'The River']",
    "reuse_queries: 0"
  ]) assert.ok(queried.includes(expected), "Published QuerySet evaluation example failed: " + expected + "\n" + queried);

  const methodResults = runPublishedQueryExample("queryset_methods.py");
  for (const expected of [
    "same_queryset_queries: 1", "fresh_querysets_queries: 2",
    "count: 4 queries: 1", "exists: True queries: 1",
    "first: Third Story queries: 1", "get: The River queries: 1",
    "GET_MISSING_REJECTED", "GET_MULTIPLE_REJECTED",
    "uncached_index_queries: 2", "count_then_list_queries: 2"
  ]) assert.ok(methodResults.includes(expected), "Published QuerySet cache/method example failed: " + expected + "\n" + methodResults);

  const relationshipResults = runPublishedQueryExample("queryset_relations.py");
  for (const expected of [
    "reverse_plain_queries: 4", "reverse_prefetch_queries: 2",
    "reverse_results_match: True", "forward_plain_queries: 4",
    "forward_join_queries: 1", "forward_results_match: True"
  ]) assert.ok(relationshipResults.includes(expected), "Published N+1 demonstration failed: " + expected + "\n" + relationshipResults);

  // Independent transfer: a fourth related record changes the N+1 count but
  // not the bounded prefetch count. Do not change the published lesson code
  // just to make its fixed three-parent baseline pass here.
  const transfer = [
    "from django.db import connection",
    "from django.test.utils import CaptureQueriesContext",
    "from catalogue.models import Book, ReadingList, ReadingListEntry",
    "reading_list = ReadingList.objects.create(name='New Transfer List')",
    "ReadingListEntry.objects.create(reading_list=reading_list, book=Book.objects.get(title='Third Story'))",
    "def rows(q):",
    "    return [(item.name, [entry.book_id for entry in item.entries.all()]) for item in q]",
    "with CaptureQueriesContext(connection) as plain_queries:",
    "    unoptimized = rows(ReadingList.objects.order_by('name'))",
    "with CaptureQueriesContext(connection) as fixed_queries:",
    "    optimized = rows(ReadingList.objects.order_by('name').prefetch_related('entries'))",
    "assert unoptimized == optimized",
    "assert len(plain_queries) == 5 and len(fixed_queries) == 2",
    "print('N_PLUS_ONE_TRANSFER_OK plain=5 prefetch=2')",
  ].join("\n");
  assert.match(beginnerExec(["manage.py", "shell", "-c", transfer]), /N_PLUS_ONE_TRANSFER_OK plain=5 prefetch=2/);
  console.log("Builder Django QuerySet lessons passed: 0/1/cache SQL execution, get/count/exists contracts, forward/reverse N+1 and unseen-fourth-list transfer.");

  // First prove a populated-table ALTER with a new nullable Book field.
  const bookModelFile = path.join(beginnerRoot, "catalogue", "models.py");
  const bookContents = fs.readFileSync(bookModelFile, "utf8");
  assert.ok(bookContents.includes(firstBookModel), "The first Book model must still exist verbatim");
  fs.writeFileSync(bookModelFile, bookContents.replace(
    firstBookModel, migrationExamples.optionalBook));
  const missingColumn = spawnSync("python3", [
    "manage.py", "shell", "-c",
    "from catalogue.models import Book; list(Book.objects.values_list('edition_note', flat=True))"
  ], {cwd: beginnerRoot, encoding: "utf8", timeout: 60000, env});
  assert.notEqual(missingColumn.status, 0, "Unmigrated optional field must really be missing");
  assert.match(missingColumn.stderr, /no such column|does not exist/i);
  beginnerExec(["manage.py", "check"]);
  beginnerExec(["manage.py", "makemigrations", "catalogue", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "sqlmigrate", "catalogue", "0003"]), /edition_note/);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]), /\[ \] 0003_/);
  beginnerExec(["manage.py", "migrate", "catalogue", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]), /\[X\] 0003_/);

  const migrateRun = (file, content) => {
    fs.writeFileSync(path.join(beginnerRoot, "catalogue", file), content + "\n");
    return beginnerExec(["manage.py", "shell", "-c",
      "exec(open('catalogue/" + file + "').read())"]);
  };
  const optionalProof = migrateRun("optional_migration_check.py", migrationExamples.optionalCheck);
  for (const expected of ["old_rows_retained: 4", "optional_field_updated: True",
    "ids_unchanged: True"]) assert.ok(optionalProof.includes(expected),
      "Optional field lab failed: " + expected + "\n" + optionalProof);

  // Expand, fail an atomic data migration, fix training data, backfill, then
  // enforce a UNIQUE and NOT NULL constraint. No fake-initial or toy mock.
  const bookOptionalContents = fs.readFileSync(bookModelFile, "utf8");
  assert.ok(bookOptionalContents.includes(migrationExamples.optionalBook));
  fs.writeFileSync(bookModelFile,
    bookOptionalContents.replace(migrationExamples.optionalBook, migrationExamples.nullableShelfBook));
  beginnerExec(["manage.py", "makemigrations", "catalogue", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "sqlmigrate", "catalogue", "0004"]), /shelf_code/);
  beginnerExec(["manage.py", "migrate", "catalogue", "--noinput"]);
  const beforeShelf = migrateRun("migration_baseline.py", migrationExamples.shelfBaseline);
  assert.match(beforeShelf, /before_books: 5/);
  assert.match(beforeShelf, /same_slug: river-guide/);

  beginnerExec(["manage.py", "makemigrations", "--empty", "catalogue",
    "--name", "backfill_shelf_code"]);
  const dataMigrationFile = path.join(beginnerRoot, "catalogue",
    "migrations", "0005_backfill_shelf_code.py");
  assert.ok(fs.existsSync(dataMigrationFile), "Django must create migration 0005");
  fs.writeFileSync(dataMigrationFile, migrationExamples.shelfBackfill + "\n");
  const badBackfill = spawnSync("python3",
    ["manage.py", "migrate", "catalogue", "--noinput"],
    {cwd: beginnerRoot, encoding: "utf8", timeout: 60000, env});
  assert.notEqual(badBackfill.status, 0, "A real duplicate slug must prevent backfill");
  assert.match(badBackfill.stdout + badBackfill.stderr,
    /duplicate shelf code: 'river-guide'/);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]),
    /\[ \] 0005_backfill_shelf_code/);
  const rolledBack = beginnerExec(["manage.py", "shell", "-c",
    "from catalogue.models import Book; assert not Book.objects.exclude(shelf_code__isnull=True).exists(); print('BOOK_BACKFILL_ROLLED_BACK')"]);
  assert.match(rolledBack, /BOOK_BACKFILL_ROLLED_BACK/);

  const repaired = migrateRun("repair_shelf_collision.py", migrationExamples.shelfRepair);
  assert.match(repaired, /collision_repaired: \d+/);
  assert.match(repaired, /code_still_empty: True/);
  beginnerExec(["manage.py", "migrate", "catalogue", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]),
    /\[X\] 0005_backfill_shelf_code/);

  const bookNullableContents = fs.readFileSync(bookModelFile, "utf8");
  assert.ok(bookNullableContents.includes(migrationExamples.nullableShelfBook));
  fs.writeFileSync(bookModelFile,
    bookNullableContents.replace(migrationExamples.nullableShelfBook, migrationExamples.finalShelfBook));
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "migrations",
    "0006_require_unique_shelf_code.py"), migrationExamples.shelfContract + "\n");
  assert.match(beginnerExec(["manage.py", "sqlmigrate", "catalogue", "0006"]), /shelf_code/);
  beginnerExec(["manage.py", "migrate", "catalogue", "--noinput"]);
  assert.match(beginnerExec(["manage.py", "showmigrations", "catalogue"]),
    /\[X\] 0006_require_unique_shelf_code/);
  assert.match(beginnerExec(["manage.py", "makemigrations", "catalogue",
    "--check", "--dry-run"]), /No changes detected/);
  const verifiedBooks = migrateRun("verify_shelf_migration.py", migrationExamples.shelfVerify);
  for (const expected of [
    "ids_and_links_preserved: True", "unique_shelf_codes: 5",
    "DUPLICATE_CODE_REJECTED", "NULL_CODE_REJECTED"
  ]) assert.ok(verifiedBooks.includes(expected),
    "Published Book schema and data migration proof failed: " + expected + "\n" + verifiedBooks);
  console.log("Builder Book schema evolution passed: applied 0003/0004/0005/0006, missing-column negative, atomic backfill collision rollback, identity/FK preservation and real UNIQUE/NOT NULL denials.");

  for (const name of ["serializer_lab.py", "serializer_negatives.py", "serializer_patch.py"]) {
    const captions = {
      "serializer_lab.py": "serializer_lab.py — run with python manage.py shell < serializer_lab.py",
      "serializer_negatives.py": "serializer_negatives.py — expected independent failures",
      "serializer_patch.py": "serializer_patch.py — a partial payload, not an automatic database write"
    };
    const actual = authoredSnippet(captions[name]);
    const result = beginnerExec(["manage.py", "shell", "-c", actual]);
    assert.match(result, /Accepted:|Rejected bad year|Accepted PATCH fields:/,
      "Missing actual serializer outcome for " + name);
  }
  const httpProbe = [
    "from django.test import Client",
    "c = Client()",
    "assert c.get('/catalogue/books/').status_code == 200",
    "assert c.get('/books/').status_code == 404",
    "assert c.post('/catalogue/books/').status_code == 405",
    "greet = c.post('/catalogue/greet/', data='{\"name\":\"Ada\"}', content_type='application/json', HTTP_ACCEPT='application/json')",
    "assert greet.status_code == 200 and greet.json()['greeting'] == 'Hello, Ada'",
    "assert c.post('/catalogue/greet/', data='{\"name\":\"\"}', content_type='application/json').status_code == 400",
    "assert c.get('/catalogue/greet/').status_code == 405",
    "assert c.post('/catalogue/greet/', data='Ada', content_type='text/plain').status_code == 415",
    "assert c.post('/catalogue/greet/', data='{\"name\":\"Ada\"}', content_type='application/json', HTTP_ACCEPT='text/plain').status_code == 406",
    "books = c.get('/catalogue/books-demo/')",
    "assert books.status_code == 200 and len(books.json()) == 2",
    "created = c.post('/catalogue/books-demo/', data='{\"title\":\"Home\",\"published_year\":2012,\"format\":\"print\"}', content_type='application/json')",
    "assert created.status_code == 201 and created.json()['book_id'] == 99",
    "assert len(c.get('/catalogue/books-demo/').json()) == 2",
    "assert c.post('/catalogue/books-demo/', data='{\"published_year\":2012,\"format\":\"print\"}', content_type='application/json').status_code == 400",
    "assert c.get('/catalogue/router-books/').status_code == 200",
    "assert c.get('/catalogue/router-books/2/').json()['title'] == 'Things Fall Apart'",
    "assert c.get('/catalogue/router-books/999/').status_code == 404",
    "assert c.post('/catalogue/router-books/').status_code == 405",
    "print('DJANGO_BEGINNER_LABS_OK 200 201 400 404 405 406 415 and serializer negatives')",
  ].join("\n");
  assert.match(beginnerExec(["manage.py", "shell", "-c", httpProbe]),
    /DJANGO_BEGINNER_LABS_OK 200 201 400 404 405 406 415/);
  // The introductory APIView's fake 201 is no longer the final learner
  // outcome. Execute the source-published ModelSerializer.save and explicit
  // database-backed APIView in the same migrated Book catalogue.
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "stored_serializers.py"),
    persistedSerializer + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "stored_api.py"),
    persistedApi + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "catalogue", "urls.py"),
    "\n" + persistedUrls + "\n");
  beginnerExec(["manage.py", "check"]);
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "stored_request_lab.py"),
    persistedLab + "\n");
  const persistedEvidence = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/stored_request_lab.py').read())"]);
  for (const expected of [
    "CREATE_201_SAVED", "FRESH_REQUEST_READ_200",
    "PATCH_CHANGED_ONLY_NOTE", "MISSING_TITLE_400",
    "DUPLICATE_SLUG_400_NO_WRITE", "MISSING_404_AND_UNSUPPORTED_405",
    "STORED_BOOK_API_OK"
  ]) assert.ok(persistedEvidence.includes(expected),
    "Published persistent API source did not establish: " + expected +
    "\n" + persistedEvidence);
  const freshShell = beginnerExec(["manage.py", "shell", "-c", [
    "from catalogue.models import Book",
    "book = Book.objects.get(shelf_code='stored-api-test-book')",
    "assert book.edition_note == 'Checked through PATCH'",
    "print('REOPENED_STORED_BOOK_OK')",
  ].join("\n")]);
  assert.match(freshShell, /REOPENED_STORED_BOOK_OK/);
  console.log("Builder DRF persistence passed: exact ModelSerializer/APIView files, durable POST, fresh HTTP GET/shell, partial PATCH and 400/404/405 unchanged-data negatives.");

  // The source-published real DRF error flow runs after persisted Book API.
  for (const [file, body] of [
    ["error_handlers.py", errorExamples.handler],
    ["error_views.py", errorExamples.views],
    ["error_test_urls.py", errorExamples.crashUrls],
    ["error_contract_lab.py", errorExamples.requestLab],
  ]) fs.writeFileSync(path.join(beginnerRoot, "catalogue", file), body + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "catalogue", "urls.py"),
    "\n" + errorExamples.routes + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "config", "settings.py"),
    "\n" + errorExamples.settings + "\n");
  beginnerExec(["manage.py", "check"]);
  const errorRequestProof = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/error_contract_lab.py').read())"]);
  for (const expected of [
    "DRF_HANDLED_ERRORS_OK 200 400 404 405 406 415 no writes",
    "DRF_UNEXPECTED_500_OK no internal string in response"
  ]) assert.ok(errorRequestProof.includes(expected),
    "Actual HTTP error handler must prove: " + expected + "\n" + errorRequestProof);
  const publishedUrls = fs.readFileSync(path.join(beginnerRoot, "catalogue", "urls.py"), "utf8");
  assert.doesNotMatch(publishedUrls, /DeliberatelyBroken|error_test_urls/,
    "A deliberately failing 500 test route may not be published in the normal URL tree");
  console.log("Builder DRF exception primer passed: 200/400/404/405/406/415 and genuine unexpected 500 with no leaked internals.");

  // The actual GET query and pagination examples are added to the same
  // already-migrated catalogue, after persistence and exception mapping.
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "query_books.py"),
    queryPaginationExamples.queryView + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "catalogue", "urls.py"),
    "\n" + queryPaginationExamples.queryUrls + "\n");
  beginnerExec(["manage.py", "check"]);
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "query_request_lab.py"),
    queryPaginationExamples.queryLab + "\n");
  const queryEvidence = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/query_request_lab.py').read())"]);
  for (const expected of [
    "QUERY_SEARCH_SIX_ORDERED", "QUERY_FILTER_THREE",
    "QUERY_TIE_BREAK_ORDERED", "QUERY_SIX_BAD_PARAMS_400_NO_WRITES",
    "QUERY_ACTUAL_SQL_WHERE_ORDER_BY", "BOOK_QUERY_API_OK"
  ]) assert.ok(queryEvidence.includes(expected),
    "Source-published query API did not demonstrate: " + expected + "\n" + queryEvidence);

  // Transfer: a previously unseen seventh Book must change the actual query
  // result without altering parser rules or hiding bad query params.
  const transferEvidence = beginnerExec(["manage.py", "shell", "-c", [
    "from django.test import Client",
    "from catalogue.models import Book",
    "Book.objects.create(title='Query Lab Fjord', published_year=2023, shelf_code='query-lab-fjord')",
    "response = Client().get('/catalogue/query-books/', {'year':'2023','search':'Query Lab'})",
    "assert response.status_code == 200",
    "assert len(response.json()) == 4",
    "assert [row['title'] for row in response.json()] == sorted(row['title'] for row in response.json())",
    "print('NEW_QUERY_BOOK_TRANSFER_FOUR')",
  ].join("\n")]);
  assert.match(transferEvidence, /NEW_QUERY_BOOK_TRANSFER_FOUR/);

  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "page_books.py"),
    queryPaginationExamples.pageView + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "catalogue", "urls.py"),
    "\n" + queryPaginationExamples.pageUrls + "\n");
  beginnerExec(["manage.py", "check"]);
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "pagination_request_lab.py"),
    queryPaginationExamples.pageLab + "\n");
  const pageEvidence = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/pagination_request_lab.py').read())"]);
  for (const expected of [
    "PAGE_ONE_TWO_OF_FIVE", "OFFSET_DUPLICATE_AFTER_INSERT",
    "CURSOR_CONTINUES_NO_DUPLICATE", "PAGE_SIZE_CAPPED_THREE",
    "PAGE_BAD_PARAMS_400_MISSING_PAGE_404", "PAGINATION_REAL_API_OK"
  ]) assert.ok(pageEvidence.includes(expected),
    "Source-published pagination API did not demonstrate: " + expected + "\n" + pageEvidence);
  console.log("Builder DRF query/pagination passed: real SQL, six bad filters, unknown-record transfer, 5-to-6 moving pages, stable-key cursor, bound size and missing-page negatives.");

  // Real request.version and two simultaneous Book response contracts.
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "versioned_book_api.py"),
    versionExamples.view + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "version_bug_urls.py"),
    versionExamples.badUrls + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "catalogue", "urls.py"),
    "\n" + versionExamples.urls + "\n");
  beginnerExec(["manage.py", "check"]);
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "version_request_lab.py"),
    versionExamples.lab + "\n");
  const versionProof = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/version_request_lab.py').read())"]);
  for (const expected of [
    "VERSIONED_V1_OLD_CLIENT_OK",
    "VERSIONED_V2_BREAKING_SHAPE_IDENTIFIED",
    "VERSIONED_V1_STILL_COMPATIBLE_AFTER_V2",
    "VERSIONED_BAD_VERSION_404_MISSING_404_METHOD_405",
    "VERSIONED_BROKEN_V1_CONTRACT_DETECTED",
    "VERSIONED_HTTP_CONTRACT_OK"
  ]) assert.ok(versionProof.includes(expected),
    "Exact published v1/v2 HTTP example did not prove " + expected +
    "\n" + versionProof);
  const actualUrls = fs.readFileSync(path.join(beginnerRoot, "catalogue", "urls.py"), "utf8");
  assert.doesNotMatch(actualUrls, /BrokenOldVersion|version_bug_urls/,
    "The deliberately broken v1 route may not be included in normal catalogue URLs");
  console.log("Builder DRF versioning passed: real URLPathVersioning request.version, old v1 remains stable, breaking v2, 404/405, test-only mutant is rejected.");

  // Execute the EXACT published opt-in settings module in the existing
  // migrated Book scratch project. All negative checks launch a NEW Django
  // interpreter and reject before shell -c can execute any body.
  fs.writeFileSync(path.join(beginnerRoot, "config", "lab_guard.py"),
    realSettingsExamples.guard + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "config", "settings.py"),
    "\n" + realSettingsExamples.settings + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "settings_startup_lab.py"),
    realSettingsExamples.lab + "\n");
  beginnerExec(["manage.py", "check"]);
  const settingsEvidence = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/settings_startup_lab.py').read())"]);
  for (const label of [
    "STARTUP_VALID_CONFIG_REAL_DATABASE_OK",
    "STARTUP_REJECTED_WRONG_DB",
    "STARTUP_REJECTED_INVALID_BOOLEAN",
    "STARTUP_REJECTED_WILDCARD_HOST",
    "STARTUP_REJECTED_NOT_LOCAL",
    "STARTUP_REJECTED_MISSING_SECRET",
    "STARTUP_NO_WRONG_DATABASE_NO_WRITES",
    "DJANGO_LAB_CONFIGURATION_OK",
  ]) assert.ok(settingsEvidence.includes(label),
    "Published Django startup gate failed: " + label + "\n" + settingsEvidence);
  assert.ok(!fs.existsSync(path.join(beginnerRoot, "UNSAFE_DJANGO_QUERY_EXECUTED")),
    "No unsafe application sentinel may be written under a rejected startup");
  assert.ok(!fs.existsSync(path.join(beginnerRoot, "bank_production")),
    "Wrong-target database must never be created by the lab");
  console.log("Builder Django startup configuration passed: effective real SQLite settings and five subprocess failures before application execution with no leaked secret.");


  // The same working catalogue now generates a maintained OpenAPI document.
  // It is generated from an annotated real endpoint, never copied from a
  // test-only OpenAPI fixture. Both URLConfs include the same contract_urls.
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "contract_api.py"),
    schemaExamples.api + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "contract_urls.py"),
    schemaExamples.route + "\n");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "openapi_urls.py"),
    schemaExamples.schemaUrls + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "config", "settings.py"),
    "\n" + schemaExamples.settings + "\n");
  fs.appendFileSync(path.join(beginnerRoot, "catalogue", "urls.py"),
    "\n" + schemaExamples.urls + "\n");
  beginnerExec(["manage.py", "check"]);
  const schemaExport = beginnerExec([
    "manage.py", "spectacular", "--urlconf", "catalogue.openapi_urls",
    "--format", "openapi-json", "--file", "catalogue/openapi.json",
    "--validate", "--fail-on-warn"
  ]);
  const schemaDocument = JSON.parse(fs.readFileSync(
    path.join(beginnerRoot, "catalogue", "openapi.json"), "utf8"));
  assert.match(schemaDocument.openapi, /^3\.0\./);
  assert.ok(schemaDocument.paths["/catalogue/contract-books/"],
    "Documented schema must include the actual Book collection endpoint");
  fs.writeFileSync(path.join(beginnerRoot, "catalogue", "openapi_contract_lab.py"),
    schemaExamples.lab + "\n");
  const openapiProof = beginnerExec(["manage.py", "shell", "-c",
    "exec(open('catalogue/openapi_contract_lab.py').read())"]);
  for(const expected of [
    "OPENAPI_GENERATED_PATHS_METHODS_AND_FIELDS_OK",
    "OPENAPI_SCHEMA_AND_SWAGGER_UI_HTTP_200",
    "OPENAPI_REAL_POST_201_GET_200_AND_PERSISTENCE",
    "OPENAPI_REAL_400_404_405_NO_EXTRA_WRITES",
    "OPENAPI_TWO_VALID_LOOKING_DRIFTS_DETECTED",
    "OPENAPI_REAL_CONTRACT_OK"
  ]) assert.ok(openapiProof.includes(expected),
    "Generated OpenAPI + HTTP conformance did not prove " + expected +
    "\n" + schemaExport + "\n" + openapiProof);
  console.log("Builder DRF OpenAPI passed: generated/validated schema, 200 schema/docs UI, real 201/200/400/404/405 and two schema-drift negatives.");








  console.log("Builder Django beginner lab passed: actual lesson snippets for projects, DRF, plain serializer, APIView and ViewSet plus negative HTTP/validation cases.");

  console.log("Builder Django bridge passed: actual learner-visible config URL, models, serializer, PostgreSQL migrations, query, and HTTP test client 200/404/405.");
} finally {
  fs.rmSync(root,{recursive:true,force:true});
}
