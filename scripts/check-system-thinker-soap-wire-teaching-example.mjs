import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-soap-wire-worked.ts","utf8");
const caption="Runnable SOAP 1.1 WSDL, real HTTP exchange, business Fault, namespace mismatch and connection refusal";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing published SOAP wire teaching code");
const match=source.slice(anchor,anchor+24000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Unable to extract complete SOAP/WSDL Python teaching program");
const result=spawnSync("python3",["-c",JSON.parse(match[1])],{encoding:"utf8",timeout:15000});
assert.ifError(result.error);
assert.equal(result.status,0,"SOAP/WSDL learner code failed: "+result.stderr);
for(const line of [
"WSDL operation: GetServiceRecord",
"WSDL endpoint matches server: True",
"success HTTP: 200",
"service name: payments-api",
"fault HTTP: 500",
"fault reason: Unknown service ID",
"wrong namespace HTTP: 500",
"wrong namespace reason: Wrong operation namespace",
"after shutdown: connection refused",
]) assert.ok(result.stdout.includes(line),"Missing "+line+" in "+result.stdout);
if(process.env.TSA_REQUIRE_ZEEP==="1") {
  for(const line of ["Zeep WSDL-aware success: True","Zeep SOAP Fault surfaced: True"]) {
    assert.ok(result.stdout.includes(line),"WSDL-aware SOAP client missing '"+line+"': "+result.stdout);
  }
}
console.log("System Thinker SOAP 1.1 learner WSDL/wire trace passed: real loopback success, Fault, namespace mismatch and refusal.");
