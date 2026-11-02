import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import { spawn, spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-web-api-deep.ts", "utf8");
const samples = [...source.matchAll(/"caption":\s*"([^"]+)"\s*,\s*"code":\s*("(?:\\.|[^"\\])*")/g)]
  .map(m => ({ caption: m[1], code: JSON.parse(m[2]) }));
const sample = prefix => {
  const found = samples.find(s => s.caption.startsWith(prefix));
  assert.ok(found, prefix);
  return found.code;
};
const probe = net.createServer();
await new Promise((resolve, reject) => probe.listen(0, "127.0.0.1", resolve).once("error", reject));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const server = spawn("python3", ["-u", "-c", sample("lab_api.py")], {
  env: { ...process.env, TSA_LAB_PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"],
});
let diagnostics = "";
server.stderr.on("data", b => { diagnostics += b; });
server.on("error", e => { diagnostics += e.message; });
const url = `http://127.0.0.1:${port}`;
const curl = command => {
  const result = spawnSync("bash", ["-c", command], { encoding: "utf8", timeout: 5000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  const text = result.stdout.replaceAll("\r\n", "\n");
  return { status: Number(text.match(/^HTTP\/\S+ (\d+)/)?.[1]), text, body: text.split("\n\n").slice(1).join("\n\n") };
};
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error(diagnostics);
    try { const r = await fetch(url + "/services"); await r.text(); ready = true; break; }
    catch { await new Promise(resolve => setTimeout(resolve, 80)); }
  }
  assert.ok(ready, diagnostics);
  const commands = sample("Final lab curl sequence").replaceAll(":8767", ":" + port).split("\n");
  const expected = [200, 201, 200, 200, 400, 400, 415, 200, 409, 405, 503, 204, 404, 200];
  assert.equal(commands.length, expected.length);
  const responses = commands.map((command, i) => {
    const r = curl(command); assert.equal(r.status, expected[i], command);
    if (i >= 3 && i <= 10) {
      const current = curl(`curl --noproxy '*' -i ${url}/services/1`);
      assert.deepEqual(JSON.parse(current.body), { id: 1, name: "Payments", ageDays: 184, active: false });
    }
    return r;
  });
  assert.match(responses[1].text, /Location: \/services\/1/);
  assert.match(responses[7].text, /Content-Type: application\/json/);
  assert.match(responses[9].text, /Allow: GET, PATCH, DELETE/);
  assert.match(responses[10].text, /Retry-After: 2/);
  assert.equal(responses[11].body, "");
  assert.doesNotMatch(responses[11].text, /Content-Length:/i);
  assert.deepEqual(JSON.parse(responses[13].body), { items: [] });
  server.kill("SIGTERM");
  await new Promise(resolve => server.once("exit", resolve));
  const stopped = spawnSync("curl", ["--noproxy", "*", "--max-time", "2", "-i", url + "/services"], { encoding: "utf8" });
  assert.notEqual(stopped.status, 0);
  assert.doesNotMatch(stopped.stdout, /^HTTP\//);
} finally {
  if (server.exitCode === null) server.kill("SIGTERM");
}
console.log("Final API lab passed: fourteen published curl exchanges, preserved rejection state and stopped-server failure.");
