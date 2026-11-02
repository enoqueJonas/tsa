import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root="packages/runtime-kernel/src/paths/";
function parsedExport(file,name,next){
  const src=readFileSync(root+file,"utf8"),a=src.indexOf("export const "+name+":");
  assert.ok(a>=0,"missing "+name);
  const eq=src.indexOf(" = ",a);
  const end=next?src.indexOf(";\nexport const "+next+":",eq):-1;
  assert.ok(eq>a && (!next || end>eq),"truncated export "+name);
  return JSON.parse(src.slice(eq+3,end<0?undefined:end).trim().replace(/;$/,""));
}
function assertSections(name,mapping,expected){
  assert.deepEqual(Object.keys(mapping),expected,name+" lesson selection changed");
  for(const [id,sections] of Object.entries(mapping)){
    assert.ok(sections.length>=1,name+" "+id+" missing authored bridge");
    const slugs=new Set();
    for(const s of sections){
      assert.ok(s.title.length>=25,name+" "+id+" vague title");
      assert.ok(s.paragraphs.length>=2,name+" "+id+" missing mechanism/failure pairing");
      assert.ok(s.paragraphs.every(p=>p.length>=145),name+" "+id+" compressed explanation");
      assert.ok(!slugs.has(s.title.toLowerCase()),name+" "+id+" duplicate heading");
      slugs.add(s.title.toLowerCase());
      if(s.code) assert.ok(s.code.code.length>=160,name+" "+id+" incomplete inspectable example");
    }
  }
}
const enterprise=parsedExport("system-thinker-enterprise-authority-bridge.ts","enterpriseBridgeBySpec","enterpriseBridgeReferences");
const enterpriseRefs=parsedExport("system-thinker-enterprise-authority-bridge.ts","enterpriseBridgeReferences");
const soap=parsedExport("system-thinker-soap-authority-bridge.ts","soapAuthorityBridge","soapAuthoritySources");
const soapRefs=parsedExport("system-thinker-soap-authority-bridge.ts","soapAuthoritySources");
const distributed=parsedExport("system-thinker-operational-reasoning-bridge.ts","operationalBridgeDistributed","operationalBridgeFailure");
const failures=parsedExport("system-thinker-operational-reasoning-bridge.ts","operationalBridgeFailure","operationalBridgeDecisions");
const decisions=parsedExport("system-thinker-operational-reasoning-bridge.ts","operationalBridgeDecisions","operationalBridgeReferences");
const opsRefs=parsedExport("system-thinker-operational-reasoning-bridge.ts","operationalBridgeReferences");
assertSections("File/Batch",enterprise,["contract","batch-lifecycle","shared-file-boundary","secure-transfer-readiness"]);
assertSections("SOAP",soap,["soap-wsdl-contract","soap-steward-consumer","soap-contract-testing-failure","soap-rest-reassessment"]);
assertSections("Distributed",distributed,["Redis and the Cache-Aside Pattern","Cache Invalidation, Staleness and Failure","Dead-Letter Queues and Poison Messages","Ordering and Eventual Consistency","Publishing Events Reliably: The Transactional Outbox","RabbitMQ versus Kafka: Different Messaging Models"]);
assertSections("Failure",failures,["Thinking in Failure Modes","Resource Exhaustion","Human and Operational Failure"]);
assertSections("ADRs",decisions,["Architecture Characteristics Introduction","Decision Drivers","Architecture Decision Records","Evaluating Trade-offs"]);
for(const [group,refs] of [[enterprise,enterpriseRefs],[soap,soapRefs]]){
  assert.deepEqual(Object.keys(group),Object.keys(refs),"Missing per-lesson authoritative references");
  for(const list of Object.values(refs)) assert.ok(list.every(x=>x.url.startsWith("https://")),"Invalid research source");
}
for(const k of ["distributed","failure","decisions"])assert.ok(opsRefs[k].every(x=>x.url.startsWith("https://")),"Invalid operational source");
const composed=[
 ["system-thinker-enterprise-file-integration-deep.ts",["enterpriseBridgeBySpec[spec.id]","enterpriseBridgeReferences[spec.id]"]],
 ["system-thinker-soap-xml-deep.ts",["soapAuthorityBridge[id]","soapAuthoritySources[id]"]],
 ["system-thinker-distributed-state-messaging-deep.ts",["operationalBridgeDistributed[title]","operationalBridgeReferences.distributed"]],
 ["system-thinker-failure-modes-deep.ts",["operationalBridgeFailure[title]","operationalBridgeReferences.failure"]],
 ["system-thinker-architecture-decisions-deep.ts",["operationalBridgeDecisions[title]","operationalBridgeReferences.decisions"]]
];
for(const [path,terms] of composed){
  const source=readFileSync(root+path,"utf8");
  for(const term of terms)assert.ok(source.includes(term),path+" does not compose "+term);
}
const fileSchool=readFileSync(root+"system-thinker-enterprise-file-integration-deep.ts","utf8");
const batchSchool=readFileSync(root+"system-thinker-real-steward-batch-worked.ts","utf8");
assert.ok(fileSchool.includes('id: "steward-batch-domain"'),"Missing separately scoped real Builder import lesson");
assert.ok(fileSchool.includes('spec.id === "batch-lifecycle"') && fileSchool.includes('[lesson(spec), lesson(stewardBatchDomainSpec), lesson(stewardBatchConcurrencySpec)]'),"Real ORM and concurrency lessons not sequenced after batch lifecycle");
assert.ok(!fileSchool.includes('spec.id==="batch-lifecycle"?realStewardBatchSections'),"Long domain lab was collapsed into old overloaded batch reading");
for(const term of ["Independently modify a copy of the lab","trusted","rollback","conflict","full-file"])assert.ok(fileSchool.toLowerCase().includes(term.toLowerCase()),"Real domain independent practice is missing "+term);
for(const term of ["Service.objects.select_for_update()","transaction.atomic()","batch_lab_delivery","trusted_approvals","forged CSV approval denied","lost response retry"])assert.ok(batchSchool.includes(term),"Published real Django+PostgreSQL exercise lacks "+term);
const concurrencySource=readFileSync(root+"system-thinker-concurrent-batch-worked.ts","utf8");
assert.ok(fileSchool.includes('id: "steward-batch-concurrency"'),"Separate concurrency lesson not defined");
assert.ok(fileSchool.includes("concurrentStewardBatchSections") && fileSchool.includes("concurrentStewardBatchReferences"),"Learner-facing concurrency source or references not composed");
for(const term of ["ThreadPoolExecutor","Barrier(2)","pg_backend_pid()","SELECT FOR UPDATE","ON CONFLICT (delivery_id) DO NOTHING","transaction.atomic()","stale_owner","denied_receipt","batch_race_effect"]){
  assert.ok(concurrencySource.includes(term),"Missing real concurrent-worker evidence: "+term);
}
for(const term of ["Independently devise a novel race","two physical PostgreSQL","No human transfer PASS"]){
  assert.ok((fileSchool+" "+concurrencySource).toLowerCase().includes(term.toLowerCase()),"Learner race critique missing "+term);
}
const milestone=readFileSync(root+"system-thinker-milestone-deep.ts","utf8");
for(const term of ["evidence-continuity","cross-module claim ledger","UNVERIFIED","unauthorized actor","independent defence","Independent Transfer"])
  assert.ok(milestone.toLowerCase().includes(term.toLowerCase()),"Portfolio missing "+term);
const joined=JSON.stringify({enterprise,soap,distributed,failures,decisions});
for(const term of ["D-01","Steward","PostgreSQL","SOAP","SFTP","idempotency","Redis","RabbitMQ","replay","authorization","UNVERIFIED"]){
  assert.ok(joined.toLowerCase().includes(term.toLowerCase()),"Missing continuous business/technical concept: "+term);
}
const total=[enterprise,soap,distributed,failures,decisions].reduce((n,group)=>n+Object.values(group).flat().length,0);
assert.equal(total,27);
console.log("System Thinker modules 6–11 enterprise/operations evidence bridges passed: "+total+" targeted authored sections, source composition, references and portfolio continuity.");
