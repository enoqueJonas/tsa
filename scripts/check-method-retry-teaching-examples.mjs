import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-web-api-deep.ts", "utf8");
const samples = [...source.matchAll(/"caption":\s*"([^"]+)"\s*,\s*"code":\s*("(?:\\.|[^"\\])*")(?:\s*,\s*"output":\s*("(?:\\.|[^"\\])*"))?/g)]
  .map(m => ({ caption: m[1], code: JSON.parse(m[2]), output: m[3] ? JSON.parse(m[3]) : undefined }));
const sample = prefix => {
  const found = samples.find(s => s.caption.startsWith(prefix));
  assert.ok(found, `Published sample missing: ${prefix}`);
  return found;
};
const model = sample("retry_model.py");
const result = spawnSync("python3", ["-c", model.code], { encoding: "utf8", timeout: 10000 });
assert.ifError(result.error);
assert.equal(result.status, 0, result.stderr);
assert.equal(result.stdout.trim(), model.output);

const probe = net.createServer();
await new Promise((resolve, reject) => probe.listen(0, "127.0.0.1", resolve).once("error", reject));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
// Only substitute the fixed lab port; execute the published handler unchanged.
const code = sample("method_server.py").code.replace('("127.0.0.1", 8766)', `("127.0.0.1", ${port})`);
const server = spawn("python3", ["-u", "-c", code], { stdio: ["ignore", "pipe", "pipe"] });
let diagnostics = "";
server.stderr.on("data", b => { diagnostics += b; });
server.on("error", e => { diagnostics += e.message; });
const request = (target, options = {}) => fetch(`http://127.0.0.1:${port}${target}`, { ...options, signal: AbortSignal.timeout(2000) });
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error(diagnostics);
    try { const r = await request("/services"); await r.text(); ready = true; break; }
    catch { await new Promise(resolve => setTimeout(resolve, 80)); }
  }
  assert.ok(ready, diagnostics);
  const get = await request("/services");
  assert.equal(get.status, 200);
  assert.equal(await get.text(), "{}");
  const create = () => request("/services", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "Payments" });
  const created = await create();
  assert.equal(created.status, 201);
  assert.equal(created.headers.get("location"), "/services/1");
  assert.equal(await created.text(), "Payments");
  const read = await request("/services/1");
  assert.equal(read.status, 200);
  assert.equal(await read.text(), "Payments");
  const badType = await request("/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  assert.equal(badType.status, 415); await badType.text();
  const empty = await request("/services", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "" });
  assert.equal(empty.status, 400); await empty.text();
  const put = await request("/services", { method: "PUT" });
  assert.equal(put.status, 405);
  assert.equal(put.headers.get("allow"), "GET, POST"); await put.text();
  const removed = await request("/services/1", { method: "DELETE" });
  assert.equal(removed.status, 204);
  assert.equal(removed.headers.get("content-length"), null);
  assert.equal(await removed.text(), "");
  const repeated = await request("/services/1", { method: "DELETE" });
  assert.equal(repeated.status, 404); await repeated.text();
  const patch = await request("/services", { method: "PATCH" });
  assert.equal(patch.status, 501); await patch.text();
  const missing = await request("/missing");
  assert.equal(missing.status, 404); await missing.text();
  const second = await create(); assert.equal(second.headers.get("location"), "/services/2"); await second.text();
  const third = await create(); assert.equal(third.headers.get("location"), "/services/3"); await third.text();
  const collection = await request("/services");
  assert.equal(await collection.text(), "{'/services/2': 'Payments', '/services/3': 'Payments'}");
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise(resolve => server.once("exit", resolve));
  }
}

const apprentice = fs.readFileSync("packages/runtime-kernel/src/paths/engineering-apprentice-workbench-deep.ts", "utf8");
const match = apprentice.match(/caption:"Capture both output streams for a disposable command",code:("(?:\\.|[^"\\])*")/);
assert.ok(match);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-streams-"));
try {
  const r = spawnSync("bash", ["-c", JSON.parse(match[1])], { cwd: temp, encoding: "utf8", timeout: 10000 });
  assert.ifError(r.error);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), "exit=7\nstdout lines=1\nstderr lines=1");
  assert.equal(fs.readFileSync(path.join(temp, "run.out"), "utf8"), "ready\n");
  assert.equal(fs.readFileSync(path.join(temp, "run.err"), "utf8"), "simulated failure\n");
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
console.log("Method/retry teaching examples passed: HTTP effects and failures, retry model, Apprentice stream output.");
