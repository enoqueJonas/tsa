import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-django-rich.ts","utf8");
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

  exec("psql",["-X","-v","ON_ERROR_STOP=1","-c","CREATE DATABASE tsa_steward_django_lab;"]);
  exec("python3",["-m","django","startproject","config","."]);
  exec("python3",["manage.py","startapp","registry"]);
  fs.writeFileSync(path.join(root,"config","urls.py"),cli+"\n");
  fs.writeFileSync(path.join(root,"registry","models.py"),model+"\n");
  fs.writeFileSync(path.join(root,"registry","serializers.py"),serializer+"\n");
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
  const probe=`from django.test import Client
from registry.models import Team,Service,Environment
from registry.serializers import ServiceSerializer
from django.db import connection
assert Client().get('/health/').status_code==200
assert Client().get('/missing/').status_code==404
assert Client().post('/health/').status_code==405
t=Team.objects.create(name='Payments')
s=Service.objects.create(name='Payments API',owning_team=t,endpoint='https://payments.example.invalid/api',lifecycle=Service.Lifecycle.ACTIVE)
e=Environment.objects.create(service=s,name='Primary',kind=Environment.Kind.PRODUCTION)
item=Service.objects.select_related('owning_team').get(pk=s.pk)
assert item.owning_team.name=='Payments'
assert item.lifecycle=='active' and e.kind=='production'
assert item._meta.get_field('owning_team').column=='owning_team_id'
data=ServiceSerializer(item).data
assert data['owning_team']==t.pk and data['lifecycle']=='active'
assert 'slug' not in data
assert Service.objects.count()==1
print('DJANGO_BRIDGE_OK',item.name,item.owning_team.name,item.lifecycle,e.kind)
`;
  const output=exec("python3",["manage.py","shell","-c",probe],env);
  assert.match(output,/DJANGO_BRIDGE_OK Payments API Payments active production/);
  console.log("Builder Django bridge passed: actual learner-visible config URL, models, serializer, PostgreSQL migrations, query, and HTTP test client 200/404/405.");
} finally {
  fs.rmSync(root,{recursive:true,force:true});
}
