import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-rich.ts","utf8");
const publishedPracticeSource=fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-quality.ts","utf8");
function publishedPractice(id) {
  const key='  "django-and-api-engineering-'+id+'": {';
  const start=publishedPracticeSource.indexOf(key);
  assert.ok(start>=0,'Django practical must have explicit learner-order override: '+id);
  const end=publishedPracticeSource.indexOf('\\n  "django-and-api-engineering-',start+key.length);
  return publishedPracticeSource.slice(start,end<0?publishedPracticeSource.length:end);
}
for (const id of ["django-from-zero-a-running-http-endpoint","django-foundations","django-rest-framework",
  "steward-sql-to-django-orm-one-canonical-domain","orm-query-behavior-and-performance",
  "schema-evolution-with-django-migrations","serializers-and-representation",
  "production-readiness-commands-and-atomic-updates"]) {
  assert.ok(publishedPractice(id).includes("instructions:"),"Django practical lacks substantive instructions: "+id);
}
for(const id of ["django-from-zero-a-running-http-endpoint","django-foundations","django-rest-framework"]){
  const practice=publishedPractice(id);
  assert.match(practice,/tsa-django-intro/,'First Django/DRF exercises must reuse scratch project');
  assert.doesNotMatch(practice,/Create Steward's first Django application|Continue the same Steward codebase/,
    'Django scratch primer cannot require an untaught Steward application');
}
assert.match(publishedPractice("serializers-and-representation"),/serializer_lab\\.py/,
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
const root=fs.mkdtempSync(path.join(os.tmpdir(),"tsa-django-bridge-"));
const exec=(command,args,env=process.env)=>{
  const p=spawnSync(command,args,{cwd:root,encoding:"utf8",timeout:60000,env});
  assert.ifError(p.error);
  assert.equal(p.status,0,`Failed ${command} ${args.join(" ")}:\n${p.stdout}\n${p.stderr}`);
  return p.stdout.trim();
};
try {
  assert.equal(process.env.PGDATABASE,"tsa_steward_lab","Live Django test requires dedicated CI PostgreSQL service");
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
