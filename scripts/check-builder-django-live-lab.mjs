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
  const needle = 'caption: "' + caption + '"';
  const at = source.indexOf(needle);
  assert.ok(at >= 0, "Missing first-principles Django model code: " + caption);
  const match = source.slice(at, at + 12000).match(/value: ("(?:\\.|[^"\\])*")/);
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
  const versioning=snippet("API versioning — executable old-client compatibility test");
  const validation=snippet("DRF validation — executable field and cross-field rejection");
  const errorMapping=snippet("DRF API errors — executable stable domain-to-HTTP mapping");
  const pagination=snippet("DRF pagination — executable offset shift failure");
  const filtering=snippet("DRF filters — executable lifecycle and ordering whitelist");
  const config=snippet("Django configuration — executable environment contract");
  const openapi=snippet("OpenAPI — minimal health contract with deliberate path mismatch");
  assert.match(exec("python3",["-c",filtering]),/filter contract: valid and 2 invalid parameters/);
  assert.match(exec("python3",["-c",config]),/configuration: valid local and 3 rejected setups/);
  const documented=JSON.parse(openapi);
  assert.equal(documented.openapi,"3.0.3");
  assert.ok(documented.paths["/health"] && !documented.paths["/health/"],"Published mismatch must be deliberate and observable");

  assert.match(exec("python3",["-c",errorMapping]),/DRF error mapping: conflict, forbidden, safe internal error/);
  assert.match(exec("python3",["-c",pagination]),/offset shift duplicates: Identity/);
  assert.match(exec("python3",["-c",versioning]),/versioning contract rejects semantic drift/);

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

  // Transfer the complete migration workflow to the actual PostgreSQL-backed
  // registry. All earlier Steward examples already ran before changing schema.
  const registryRun = (name, content) => {
    fs.writeFileSync(path.join(root, "registry", name), content + "\n");
    return exec("python3", ["manage.py", "shell", "-c",
      "exec(open('registry/" + name + "').read())"], env);
  };
  const originalRegistry = fs.readFileSync(path.join(root, "registry", "models.py"), "utf8");
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
  fs.writeFileSync(path.join(root, "registry", "models.py"), nullableRegistry);
  fs.writeFileSync(path.join(root, "registry", "migrations", "0002_service_slug_nullable.py"),
    migrationExamples.registryExpand + "\n");
  const registrySql = exec("python3", ["manage.py", "sqlmigrate", "registry", "0002"], env);
  assert.match(registrySql, /slug/);
  exec("python3", ["manage.py", "migrate", "registry", "0002", "--noinput"], env);

  const conflictSetup = registryRun("create_slug_collision.py", migrationExamples.registryCollision);
  assert.match(conflictSetup, /collision_service_pk: \d+/);
  assert.match(conflictSetup, /all_slugs_still_empty: True/);
  fs.writeFileSync(path.join(root, "registry", "migrations", "0003_backfill_service_slugs.py"),
    migrationExamples.registryBackfill + "\n");
  const failedRegistryBackfill = spawnSync("python3",
    ["manage.py", "migrate", "registry", "--noinput"],
    {cwd: root, encoding: "utf8", timeout: 60000, env});
  assert.notEqual(failedRegistryBackfill.status, 0, "Unresolved Service slug collision must fail");
  assert.match(failedRegistryBackfill.stdout + failedRegistryBackfill.stderr,
    /duplicate Service slug: 'workshop-reports-api'/,
    "Missing real slugify collision in registry migration");
  assert.match(exec("python3", ["manage.py", "showmigrations", "registry"], env),
    /\[ \] 0003_backfill_service_slugs/);
  const undone = exec("python3", ["manage.py", "shell", "-c",
    "from registry.models import Service; assert not Service.objects.exclude(slug__isnull=True).exists(); print('REGISTRY_BACKFILL_ROLLED_BACK')"], env);
  assert.match(undone, /REGISTRY_BACKFILL_ROLLED_BACK/);

  assert.match(registryRun("repair_slug_collision.py", migrationExamples.registryRepair),
    /service_collision_repaired: \d+/);
  exec("python3", ["manage.py", "migrate", "registry", "--noinput"], env);
  assert.match(exec("python3", ["manage.py", "showmigrations", "registry"], env),
    /\[X\] 0003_backfill_service_slugs/);
  const finalRegistry = nullableRegistry.replace(
    "    slug = models.SlugField(max_length=160, null=True, blank=True)",
    "    slug = models.SlugField(max_length=160, unique=True)");
  assert.notEqual(finalRegistry, nullableRegistry);
  fs.writeFileSync(path.join(root, "registry", "models.py"), finalRegistry);
  fs.writeFileSync(path.join(root, "registry", "migrations", "0004_require_unique_service_slug.py"),
    migrationExamples.registryContract + "\n");
  assert.match(exec("python3", ["manage.py", "sqlmigrate", "registry", "0004"], env),
    /slug/);
  exec("python3", ["manage.py", "migrate", "registry", "--noinput"], env);
  assert.match(exec("python3", ["manage.py", "makemigrations", "registry", "--check", "--dry-run"], env),
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
  console.log("Builder Django beginner lab passed: actual lesson snippets for projects, DRF, plain serializer, APIView and ViewSet plus negative HTTP/validation cases.");

  console.log("Builder Django bridge passed: actual learner-visible config URL, models, serializer, PostgreSQL migrations, query, and HTTP test client 200/404/405.");
} finally {
  fs.rmSync(root,{recursive:true,force:true});
}
