import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// Compile and run the exact programs printed in the Java foundational readings.
const src = readFileSync("packages/runtime-kernel/src/paths/quality-java-test-engineering-deep.ts", "utf8");
function published(name) {
  const match = src.match(new RegExp("const " + name + " = (\\\"(?:\\\\.|[^\\\"\\\\])*\\\");"));
  assert.ok(match, "Missing published Java source: " + name);
  assert.ok(src.includes("code:" + name), "Original reading must actually render: " + name);
  return JSON.parse(match[1]);
}
function exec(tool, args, cwd) {
  const out = spawnSync(tool, args, { cwd, encoding: "utf8", timeout: 12000 });
  assert.ifError(out.error);
  return out;
}
const root = mkdtempSync(join(tmpdir(), "tsa-quality-java-"));
try {
  const first = published("javaFirstProgramSource");
  writeFileSync(join(root, "FirstJavaProgram.java"), first);
  let run = exec("javac", ["FirstJavaProgram.java"], root);
  assert.equal(run.status, 0, run.stderr);
  run = exec("java", ["FirstJavaProgram"], root);
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout.trim(), "source -> bytecode -> JVM");

  writeFileSync(join(root, "FirstJavaProgram.java"), first.replace("public class FirstJavaProgram", "public class DifferentName"));
  run = exec("javac", ["FirstJavaProgram.java"], root);
  assert.notEqual(run.status, 0, "Compiler must reject mismatched public class filename");
  assert.match(run.stderr, /DifferentName\.java/, "Compiler must identify the required filename");

  const second = published("javaTwoAccountsSource");
  writeFileSync(join(root, "TwoAccounts.java"), second);
  run = exec("javac", ["TwoAccounts.java"], root);
  assert.equal(run.status, 0, run.stderr);
  run = exec("java", ["TwoAccounts"], root);
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout.trim(), "Alpha:2\nBeta:1");

  writeFileSync(join(root, "TwoAccounts.java"), second.replace("private int successes;", "private static int successes;"));
  run = exec("javac", ["TwoAccounts.java"], root);
  assert.equal(run.status, 0, run.stderr);
  run = exec("java", ["TwoAccounts"], root);
  assert.notEqual(run.status, 0, "Shared-state mutant must fail");
  assert.match(run.stderr, /AssertionError: instance state leaked across objects/);
  assert.match(run.stdout, /Alpha:3\s+Beta:3/);
  console.log("PASS exact Quality Java reading: compile/run, filename failure, independent objects and static-state mutant.");
} finally {
  rmSync(root, { recursive: true, force: true });
}
