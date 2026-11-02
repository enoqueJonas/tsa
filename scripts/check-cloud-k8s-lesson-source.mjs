import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const authored = readFileSync("packages/runtime-kernel/src/paths/cloud-kubernetes-foundations-worked.ts", "utf8");
const actualLesson = readFileSync("packages/runtime-kernel/src/paths/cloud-orchestration-gitops-deep.ts", "utf8");
const assembler = readFileSync("packages/runtime-kernel/src/paths/cloud-engineer.ts", "utf8");
assert.ok(actualLesson.includes("...(kubernetesFoundationsById[spec.id] ?? [])"), "Kubernetes source lessons not connected");
assert.ok(assembler.includes('if (path.id === "cloud-orchestration-gitops") return path;'), "Wrapper is still obscuring core Kubernetes sequence");
const match = authored.match(/export const kubernetesFoundationsById:[^\n]+ = (\{[\s\S]*\});\s*$/);
assert.ok(match, "Could not extract authored K8s sections");
const sections = JSON.parse(match[1]);
for (const id of ["why-orchestration", "cluster-control-plane", "pods-deployments"]) {
  assert.ok(Array.isArray(sections[id]) && sections[id].length >= 3, "Missing learning phases for " + id);
  assert.ok(sections[id].some(x => x.code?.code), "Missing guided command/manifest: " + id);
  assert.ok(sections[id].some(x => /transfer|failure|failed/i.test(x.heading+" "+x.paragraphs.join(" "))), "Missing negative or transfer case: " + id);
}
const manifest = sections["pods-deployments"].find(x => x.code?.language === "yaml")?.code?.code;
assert.ok(manifest, "No exact learner Deployment YAML");
const p = spawnSync("python3", ["-c", "import sys,json,yaml; print(json.dumps(yaml.safe_load(sys.stdin.read())))"], {input:manifest,encoding:"utf8",timeout:12000});
assert.ifError(p.error); assert.equal(p.status,0,p.stderr);
const obj=JSON.parse(p.stdout);
assert.equal(obj.apiVersion,"apps/v1");
assert.equal(obj.kind,"Deployment");
assert.equal(obj.metadata.name,"tsa-web");
assert.equal(obj.metadata.labels.app,"tsa-web");
assert.equal(obj.spec.replicas,2);
assert.deepEqual(obj.spec.selector.matchLabels,obj.spec.template.metadata.labels);
const container=obj.spec.template.spec.containers[0];
assert.equal(container.ports[0].containerPort,80);
assert.ok(container.resources.requests.cpu && container.resources.requests.memory);
assert.equal(container.readinessProbe.httpGet.port,80);
assert.ok(sections["pods-deployments"].some(x=>x.code?.code.includes("kubectl --context kind-tsa-ped005")), "No explicitly scoped cluster lab");
const serviceSnippets = sections["services-discovery"].filter(x => x.code?.language === "yaml").map(x => x.code.code);
assert.equal(serviceSnippets.length, 2, "Missing healthy and negative Service manifests");
function parseYaml(source) {
  const result = spawnSync("python3", ["-c", "import sys,json,yaml; print(json.dumps(yaml.safe_load(sys.stdin.read())))"], {input:source,encoding:"utf8",timeout:12000});
  assert.ifError(result.error); assert.equal(result.status,0,result.stderr);
  return JSON.parse(result.stdout);
}
const healthy = parseYaml(serviceSnippets[0]);
const empty = parseYaml(serviceSnippets[1]);
assert.equal(healthy.kind,"Service");
assert.equal(healthy.metadata.name,"tsa-web");
assert.deepEqual(healthy.spec.selector,obj.spec.template.metadata.labels,"Healthy Service must select the actual Pods");
assert.equal(healthy.spec.ports[0].targetPort,80);
assert.equal(empty.kind,"Service");
assert.equal(empty.metadata.name,"tsa-web-empty");
assert.notDeepEqual(empty.spec.selector,obj.spec.template.metadata.labels,"Deliberate mismatched selector must remain a negative exercise");
assert.ok(sections["services-discovery"].some(x => x.code?.code.includes("kubectl --context kind-tsa-ped005")), "Service exercise must name the disposable context");
const changed=structuredClone(obj);
changed.spec.template.metadata.labels.app="wrong";
assert.notDeepEqual(changed.spec.selector.matchLabels,changed.spec.template.metadata.labels,"Negative selector mismatch must be rejected");
console.log("Cloud Kubernetes exact authored Deployment and Service YAML parsed: ready selectors and deliberate negative cases checked; runtime cluster UNVERIFIED.");
