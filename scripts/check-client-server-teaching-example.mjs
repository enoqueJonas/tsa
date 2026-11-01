import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import ts from "typescript";

const file = path.join(process.cwd(), "packages/runtime-kernel/src/paths/builder-web-api-deep.ts");
const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
let demo;
function visit(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const values = new Map();
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = property.name.getText(source).replace(/^["']|["']$/g, "");
      if (ts.isStringLiteral(property.initializer)) values.set(key, property.initializer.text);
    }
    if (values.get("caption") === "mini_steward_server.py — local, read-only HTTP server") {
      demo = values.get("code");
    }
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.ok(demo?.includes("class StewardHandler"), "The learner's actual Python demo must be available");

async function freePort() {
  const listener = net.createServer();
  await new Promise((resolve, reject) => listener.listen(0, "127.0.0.1", resolve).once("error", reject));
  const port = listener.address().port;
  await new Promise((resolve) => listener.close(resolve));
  return port;
}

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-client-server-"));
const demoFile = path.join(temporary, "mini_steward_server.py");
fs.writeFileSync(demoFile, demo);
const port = await freePort();
let server;
let diagnostics = "";
try {
  server = spawn("python3", ["-u", demoFile], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, STEWARD_DEMO_PORT: String(port) },
  });
  server.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.stdout.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.on("error", (error) => { diagnostics += error.message; });

  const origin = "http://127.0.0.1:" + port;
  let success;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error("Python server exited early: " + diagnostics);
    try {
      success = await fetch(origin + "/services", { signal: AbortSignal.timeout(500) });
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
  }
  assert.ok(success, "The Python server did not start: " + diagnostics);
  assert.equal(success.status, 200);
  assert.match(success.headers.get("content-type") ?? "", /application\/json/);
  assert.deepEqual(await success.json(), { services: [{ id: 7, name: "Cleaning", active: true }] });

  const missing = await fetch(origin + "/missing", { signal: AbortSignal.timeout(2000) });
  assert.equal(missing.status, 404);

  server.kill("SIGTERM");
  await new Promise((resolve) => server.once("exit", resolve));
  await assert.rejects(fetch(origin + "/services", { signal: AbortSignal.timeout(1000) }), "After shutdown, the request must fail at the connection boundary");
  console.log("Client-server learner example passed: HTTP 200 JSON, HTTP 404 and connection refusal after shutdown.");
} finally {
  if (server && server.exitCode === null) server.kill("SIGKILL");
  fs.rmSync(temporary, { recursive: true, force: true });
}
