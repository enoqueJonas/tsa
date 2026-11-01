import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { spawn } from "node:child_process";

// Execute the exact Python stdlib/localhost scenario used in Web and API
// Foundations. No public port, cloud account, Django or database is required.
const root = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-client-server-"));
fs.writeFileSync(path.join(root, "hello.txt"), "Steward local lab\n");
const probe = net.createServer();
await new Promise((resolve, reject) => probe.once("error", reject).listen(0, "127.0.0.1", resolve));
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const url = `http://127.0.0.1:${port}`;
const child = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], {
  cwd: root, stdio: ["ignore", "ignore", "pipe"],
});
let diagnostics = "";
child.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  let response = null;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error(`Python server exited prematurely: ${diagnostics}`);
    try {
      response = await fetch(`${url}/hello.txt`, { signal: AbortSignal.timeout(500) });
      break;
    } catch {
      await sleep(50);
    }
  }
  assert.ok(response, `Python HTTP server never became reachable: ${diagnostics}`);
  assert.equal(response.status, 200, "The existing file must return HTTP 200");
  assert.equal(await response.text(), "Steward local lab\n", "The server must return the fixture bytes");
  const missing = await fetch(`${url}/does-not-exist.txt`, { signal: AbortSignal.timeout(2000) });
  assert.equal(missing.status, 404, "A missing file must produce an HTTP response with 404");
  await missing.arrayBuffer();
  const stopped = new Promise((resolve) => child.once("close", resolve));
  child.kill("SIGTERM");
  await Promise.race([stopped, sleep(2500)]);
  assert.ok(child.exitCode !== null || child.signalCode !== null, "The server process must have exited before the connection-failure check");
  await assert.rejects(fetch(`${url}/hello.txt`, { signal: AbortSignal.timeout(1000) }),
    "A stopped server must fail at connection level, not return an HTTP 404");
  console.log("Client-server teaching lab passed: HTTP 200, HTTP 404 and connection-level failure.");
} finally {
  if (child.exitCode === null) child.kill("SIGKILL");
  fs.rmSync(root, { recursive: true, force: true });
}
