import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { spawn, spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-web-api-deep.ts", "utf8");
const samples = [...source.matchAll(/"caption":\s*"([^"]+)"\s*,\s*"code":\s*("(?:\\.|[^"\\])*")/g)]
  .map(hit => ({ caption: hit[1], code: JSON.parse(hit[2]) }));
const sample = prefix => {
  const found = samples.find(value => value.caption.startsWith(prefix));
  assert.ok(found, `Missing published learner code: ${prefix}`);
  return found.code;
};

const preparation = sample("Terminal A — create one HTML file and run an HTTP server").split("\n");
const curlCommands = sample("Terminal B — compare HTTP and transport outcomes")
  .split("\n").filter(line => line.startsWith("curl "));
assert.equal(preparation.length, 3, "Expected reproducible file setup and server command");
assert.equal(curlCommands.length, 3, "Expected 200, 404 and stopped-server curl commands");

const probe = net.createServer();
await new Promise((resolve, reject) => probe.listen(0, "127.0.0.1", resolve).once("error", reject));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-web-journey-"));
const replacePort = command => command.replaceAll("8768", String(port));
const prepare = spawnSync("bash", ["-c", preparation.slice(0, 2).join("\n")], {
  cwd: dir, encoding: "utf8", timeout: 5_000,
});
assert.ifError(prepare.error);
assert.equal(prepare.status, 0, `Teaching setup failed: ${prepare.stderr}`);
const server = spawn("bash", ["-c", replacePort(preparation[2])], {
  cwd: dir, stdio: ["ignore", "pipe", "pipe"],
});
let diagnostics = "";
server.stderr.on("data", data => { diagnostics += data.toString(); });
server.on("error", error => { diagnostics += error.message; });
const base = `http://127.0.0.1:${port}`;
const curl = command => {
  const result = spawnSync("bash", ["-c", replacePort(command)], {
    cwd: dir, encoding: "utf8", timeout: 5_000,
  });
  assert.ifError(result.error);
  return result;
};

try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error(diagnostics);
    try {
      const response = await fetch(base + "/");
      const body = await response.text();
      if (response.status === 200 && body.includes("Local web works")) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 80));
  }
  assert.ok(ready, `Published local server did not start: ${diagnostics}`);

  const success = curl(curlCommands[0]);
  assert.equal(success.status, 0, success.stderr);
  assert.match(success.stdout, new RegExp("^HTTP/[0-9][.][0-9] 200", "m"));
  assert.ok(success.stdout.includes("<h1>Local web works</h1>"));

  const missing = curl(curlCommands[1]);
  assert.equal(missing.status, 0, missing.stderr);
  assert.match(missing.stdout, new RegExp("^HTTP/[0-9][.][0-9] 404", "m"));

  server.kill("SIGTERM");
  await new Promise(resolve => server.once("exit", resolve));
  const refused = curl(curlCommands[2]);
  assert.notEqual(refused.status, 0, "Stopped server unexpectedly answered");
  assert.doesNotMatch(refused.stdout, new RegExp("^HTTP/", "m"), "Connection refusal is not HTTP");
  console.log("Web journey lab passed: published setup, curl HTTP 200, curl HTTP 404 and no HTTP after shutdown.");
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise(resolve => server.once("exit", resolve));
  }
  fs.rmSync(dir, { recursive: true, force: true });
}
