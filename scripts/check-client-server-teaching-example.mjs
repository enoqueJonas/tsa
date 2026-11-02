import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

// Execute the learner-published mini-Steward Python HTTP server and its protocol experiments.
// Execute the same server with a dynamically assigned port to avoid local conflicts.
const source = fs.readFileSync(path.join(process.cwd(), "packages/runtime-kernel/src/paths/builder-web-api-deep.ts"), "utf8");
assert.ok(source.includes('lesson("Client-Server Architecture"'), "Client-server fundamentals lesson was not found");
assert.ok(source.includes('lesson("Client-Server Boundaries and Failure Modes"'), "Client-server failure lab was not found");
assert.ok(source.includes("python3 mini_steward_server.py"), "Learner-facing mini-Steward run command changed without test update");
assert.ok(source.includes("curl -i http://127.0.0.1:8765/services"), "Learner-facing API request changed without test update");
const sampleMatch = source.match(/"caption": "mini_steward_server\.py[^"]*"\s*,\s*"code": ("(?:\\.|[^"\\])*")/);
assert.ok(sampleMatch, "Unable to find the actual learner-facing Python server source");
const sampleCode = JSON.parse(sampleMatch[1]);

async function availablePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => probe.listen(0, "127.0.0.1", resolve).once("error", reject));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  return port;
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-client-server-lab-"));
fs.writeFileSync(path.join(temp, "mini_steward_server.py"), sampleCode);
const port = await availablePort();
let server;
let diagnostics = "";
try {
  server = spawn("python3", ["-u", "mini_steward_server.py"], {
    cwd: temp, env: { ...process.env, STEWARD_DEMO_PORT: String(port) }, stdio: ["ignore", "pipe", "pipe"],
  });
  server.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.stdout.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.on("error", (error) => { diagnostics += error.message; });

  const origin = "http://127.0.0.1:" + port;
  let success;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error("Server exited before accepting requests: " + diagnostics);
    try {
      success = await fetch(origin + "/services", { signal: AbortSignal.timeout(500) });
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }
  assert.ok(success, "Local teaching example did not start: " + diagnostics);
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), { services: [{ id: 7, name: "Cleaning", active: true }] });

  const missing = await fetch(origin + "/missing", { signal: AbortSignal.timeout(2000) });
  assert.equal(missing.status, 404);
  const requestedText = await fetch(origin + "/services", {
    headers: { Accept: "text/plain" }, signal: AbortSignal.timeout(2000),
  });
  assert.equal(requestedText.status, 200);
  assert.match(requestedText.headers.get("content-type") ?? "", /application\/json/);
  assert.deepEqual(await requestedText.json(), { services: [{ id: 7, name: "Cleaning", active: true }] });

  server.kill("SIGTERM");
  await new Promise((resolve) => server.once("exit", resolve));
  await assert.rejects(fetch(origin + "/services", { signal: AbortSignal.timeout(1000) }));
  console.log("Client-server learner example passed: JSON service HTTP 200, HTTP 404 and connection refusal after shutdown.");
} finally {
  if (server && server.exitCode === null) server.kill("SIGKILL");
  fs.rmSync(temp, { recursive: true, force: true });
}
