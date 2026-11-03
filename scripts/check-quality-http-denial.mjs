import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const source = readFileSync("packages/runtime-kernel/src/paths/quality-api-integration-testing-deep.ts", "utf8");
const match = source.match(/const localHttpContractJava = ("(?:\\.|[^"\\])*");/);
assert.ok(match && source.includes("code: localHttpContractJava, language: \"java\""), "Original HTTP teaching must publish its exact executable example");
const original = JSON.parse(match[1]);
const root = mkdtempSync(join(tmpdir(), "tsa-quality-http-"));
const file = join(root, "LocalHttpContractProof.java");
function run(program, args) {
  const result = spawnSync(program, args, { cwd: root, encoding: "utf8", timeout: 15000 });
  assert.ifError(result.error);
  return result;
}
function compile() {
  const result = run("javac", ["--add-modules", "jdk.httpserver", "LocalHttpContractProof.java"]);
  assert.equal(result.status, 0, result.stderr);
}
try {
  writeFileSync(file, original);
  compile();
  let output = run("java", ["--add-modules", "jdk.httpserver", "LocalHttpContractProof"]);
  assert.equal(output.status, 0, output.stderr);
  assert.equal(output.stdout.trim(), "HTTP denial 403; persisted owner stays 7");

  const mutant = original.replace('respond(exchange, 403, "{\\"error\\":\\"forbidden\\"}");',
      'owner = 9; respond(exchange, 403, "{\\"error\\":\\"forbidden\\"}");');
  assert.notEqual(mutant, original, "Deliberate forbidden-write mutation did not alter original source");
  writeFileSync(file, mutant);
  compile();
  output = run("java", ["--add-modules", "jdk.httpserver", "LocalHttpContractProof"]);
  assert.notEqual(output.status, 0, "403 with a hidden forbidden state change must fail the read-after oracle");
  assert.match(output.stderr, /AssertionError: forbidden operation still changed owner:/);
  console.log("PASS original Quality localhost HTTP fixture, 403 read-after check and forbidden-write mutation.");
} finally {
  rmSync(root, { recursive: true, force: true });
}
