import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const original=readFileSync(root+"cloud-orchestration-gitops-deep.ts","utf8");
const extra=readFileSync(root+"cloud-k8s-controller-depth.ts","utf8");
const source=readFileSync(root+"cloud-k8s-real-cluster-proof.ts","utf8");
const match=source.match(/export const cloudK8sRealClusterPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Exact learner-published Kubernetes program missing");
const python=JSON.parse(match[1]);
function parse(name,next){
 const a=extra.indexOf("export const "+name);
 const z=next?extra.indexOf("\nexport const "+next,a):extra.length;
 assert.ok(a>=0&&z>a);
 return JSON.parse(extra.slice(extra.indexOf("=",a)+1,z).trim().replace(/;$/,""));
}
const depth=parse("cloudK8sControllerSections","cloudK8sEvidencePractices");
const practices=parse("cloudK8sEvidencePractices");
const originals=["why-orchestration","cluster-control-plane","pods-deployments",
 "services-discovery","scheduling-placement","dns-network-policy",
 "persistent-storage","termination-disruption","pressure-eviction-rollout",
 "config-secrets","health-resources-rollouts","rbac-namespaces",
 "openshift-platform","openshift-security-routing","gitops-model","argocd-operation"];
const block=original.split("const specs: LessonSpec[] = [")[1]?.split("\n];")[0];
assert.ok(block);
assert.deepEqual([...block.matchAll(/^\s*id: "([^"]+)"/gm)].map(m=>m[1]),originals);
for(const i of ["001","002","003","004"])
 assert.ok(original.includes('id: "cloud-orchestration-gitops-milestone-'+i+'"'));
assert.deepEqual(Object.keys(depth),Object.keys(practices));
assert.equal(Object.keys(depth).length,8);
let count=0;
for(const [topic,items] of Object.entries(depth)){
 assert.ok(originals.includes(topic));
 assert.ok(items.length>=2);
 for(const item of items){
  count++;
  assert.ok(item.heading.length>28&&item.paragraphs.length===2);
  assert.ok(item.paragraphs.every(p=>p.length>=290));
 }
 assert.ok(practices[topic].length>=2);
}
assert.ok(count>=16);
for(const needle of ["cloudK8sControllerSections[spec.id]",
 "cloudK8sEvidencePractices[spec.id]","code: cloudK8sRealClusterPython"])
 assert.ok(original.includes(needle));
for(const needle of ["kind-tsa-ped005-","TSA_K8S_NAMESPACE",
 "K8S_REAL_SERVICE_HTTP_READY_RESPONSE",
 "K8S_REAL_SCOPED_RBAC_ALLOW_AND_DENY",
 "K8S_REAL_CLUSTER_API_AND_CONTROLLER_NOT_OPENSHIFT_ARGO_OR_STEWARD"])
 assert.ok(python.includes(needle));
console.log("PASS 16 original topics, four milestone IDs, "+count+
 " in-depth sections, eight original practical overlays and copyable source");
const token=randomBytes(5).toString("hex");
const cluster="tsa-ped005-"+token;
const image="tsa-ped005-echo:"+token;
const workspace=mkdtempSync(join(tmpdir(),"tsa-ped005-workspace-"));
const kubeconfig=join(workspace,"tsa-ped005.kubeconfig");
const nodeImage="kindest/node:v1.37.0@sha256:a1ed56cfb0e7b93589bdf97c8cd566405a265939e3620fc4f5de89adff580ae5";
let clusterAttempted=false;
function run(cmd,args,options={}){
 const x=spawnSync(cmd,args,{encoding:"utf8",timeout:options.timeout??70000,
  cwd:options.cwd,env:options.env??process.env,maxBuffer:4*1024*1024});
 assert.ok(!x.error,cmd+" process timeout: "+String(x.error));
 return x;
}
function success(cmd,args,options={}){
 const x=run(cmd,args,options);
 assert.equal(x.status,0,cmd+" "+args.slice(0,4).join(" ")+
  "\nstdout: "+x.stdout.slice(-2000)+"\nstderr: "+x.stderr.slice(-2000));
 return x.stdout.trim();
}
const go=[
 'package main',
 'import ("fmt"; "net/http"; "os")',
 'func main() {',
 ' http.HandleFunc("/ready",func(w http.ResponseWriter,r *http.Request){',
 '  if os.Getenv("TSA_FAIL_READINESS")=="1" {',
 '   http.Error(w,"unready",http.StatusServiceUnavailable);return',
 '  }',
 '  fmt.Fprint(w,"READY")',
 ' })',
 ' http.HandleFunc("/health",func(w http.ResponseWriter,r *http.Request){',
 '  fmt.Fprint(w,"HEALTHY")',
 ' })',
 ' http.HandleFunc("/",func(w http.ResponseWriter,r *http.Request){',
 '  fmt.Fprint(w,"SYNTHETIC_TSA_STEWARD")',
 ' })',
 ' if err:=http.ListenAndServe(":8080",nil);err!=nil {panic(err)}',
 '}',
].join("\n");
function execute(code,label,positive,limit=85){
 const namespace="tsa-ped005-"+randomBytes(5).toString("hex");
 const env={...process.env,KUBECONFIG:kubeconfig,TSA_K8S_NAMESPACE:namespace,
  TSA_K8S_IMAGE:image,TSA_K8S_WAIT_SECONDS:String(limit),PYTHONDONTWRITEBYTECODE:"1"};
 const x=run("python3",["-c",code],{timeout:245000,env});
 if(positive){
  assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
  for(const marker of [
   "K8S_REAL_DEPLOYMENT_TWO_READY_PODS_AND_ENDPOINTS",
   "K8S_REAL_SERVICE_HTTP_READY_RESPONSE",
   "K8S_REAL_WRONG_SERVICE_SELECTOR_NO_ENDPOINTS",
   "K8S_REAL_CONTROLLER_REPLACED_DELETED_POD",
   "K8S_REAL_UNREADY_CANDIDATE_ROLLOUT_BLOCKED",
   "K8S_REAL_REPAIRED_READINESS_ROLLOUT",
   "K8S_REAL_SCOPED_RBAC_ALLOW_AND_DENY",
   "K8S_REAL_CLUSTER_API_AND_CONTROLLER_NOT_OPENSHIFT_ARGO_OR_STEWARD"])
   assert.ok(x.stdout.includes(marker),label+" missing "+marker);
 }else{
  assert.notEqual(x.status,0,label+" unsafe source passed");
  assert.match(x.stderr,/AssertionError/,label+
   " failed for unrelated reason:\n"+x.stderr.slice(-2000));
 }
 console.log("PASS "+label+" status="+x.status);
}
try{
 writeFileSync(join(workspace,"main.go"),go);
 writeFileSync(join(workspace,"Dockerfile"),
  'FROM scratch\nCOPY app /app\nUSER 10001:10001\nEXPOSE 8080\nENTRYPOINT ["/app"]\n');
 success("go",["build","-trimpath","-ldflags=-s -w","-o","app","main.go"],
  {cwd:workspace,timeout:150000,env:{...process.env,CGO_ENABLED:"0",GOTOOLCHAIN:"local",
   GOOS:"linux",GOARCH:"amd64"}});
 success("docker",["build","--pull=false","-t",image,"."],
  {cwd:workspace,timeout:80000});
 clusterAttempted=true;
 success("kind",["create","cluster","--name",cluster,"--image",nodeImage,
  "--wait","180s","--kubeconfig",kubeconfig],{timeout:330000});
 assert.equal(success("kubectl",["--kubeconfig",kubeconfig,
  "config","current-context"]),"kind-"+cluster);
 success("kind",["load","docker-image",image,"--name",cluster],
  {timeout:140000});
 console.log("PASS disposable real kind Kubernetes API and locally compiled HTTP server image");
 execute(python,"real cluster: pods, Service HTTP, selector, reconciliation, readiness and scoped RBAC",true);
 const mutants=[
  ["wrong Service selector at creation",
   '"selector": {"app": labels["app"]}',
   '"selector": {"app": "wrong-target"}'],
  ["RBAC incorrectly grants Pod delete",
   '"verbs": ["get", "list"]',
   '"verbs": ["get", "list", "delete"]'],
  ["readiness accidentally points at liveness",
   '"readinessProbe": {"httpGet": {"path": "/ready", "port": port}',
   '"readinessProbe": {"httpGet": {"path": "/health", "port": port}'],
  ["Pod replacement falsely claimed without delete",
   'kubectl("delete", "pod", removed["metadata"]["name"], "-n", namespace,\n        "--wait=false")',
   'print("unsafe: Pod deletion skipped")'],
 ];
 for(const [label,needle,bad] of mutants){
  assert.ok(python.includes(needle),"Source mutation anchor changed: "+label);
  execute(python.replace(needle,bad),"rejected unsafe real-cluster mutant: "+label,false,22);
 }
 console.log("PASS four real-cluster negative source mutants; NO OpenShift/Argo/CD release claims");
}finally{
 if(clusterAttempted){
  const x=run("kind",["delete","cluster","--name",cluster],{timeout:100000});
  console.log("KIND_DISPOSABLE_CLUSTER_REMOVED status="+x.status);
 }
 run("docker",["image","rm",image],{timeout:25000});
 rmSync(workspace,{recursive:true,force:true});
}
