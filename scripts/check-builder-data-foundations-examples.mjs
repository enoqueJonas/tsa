import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-postgresql-deep.ts", "utf8");
const marker = (id) => source.indexOf(`"id": "${id}"`);
const persistence = marker("from-memory-to-durable-data");
const connection = marker("postgresql-first-connection");
const relational = source.indexOf('id: "relational-model"');
assert.ok(persistence > 0 && connection > persistence && relational > connection, "The learner order must be persistence → PostgreSQL connection → relational model");

function publishedCode(caption) {
  const anchor = source.indexOf(`"caption": "${caption}"`);
  assert.ok(anchor > 0, `Missing published teaching snippet: ${caption}`);
  const match = source.slice(anchor).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(match, `Unparseable teaching snippet: ${caption}`);
  return JSON.parse(match[1]);
}

const code = publishedCode("persistence_lab.py — published executable file-backed experiment");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-builder-persistence-"));
try {
  fs.writeFileSync(path.join(directory, "persistence_lab.py"), code);
  const run = (action, status, output) => {
    const result = spawnSync("python3", ["persistence_lab.py", action], { cwd: directory, encoding: "utf8", timeout: 10000 });
    assert.ifError(result.error);
    assert.equal(result.status, status, `Unexpected exit from ${action}: ${result.stderr}`);
    assert.equal(result.stdout.trim(), output, `Unexpected learner-visible output from ${action}`);
  };
  run("reset", 0, "RESET: []");
  run("add-payments", 0, "ADDED: Payments API");
  run("read", 0, "READ: Payments API");
  run("add-identity", 0, "ADDED: Identity API");
  run("read", 0, "READ: Payments API, Identity API");
  const saved = JSON.parse(fs.readFileSync(path.join(directory, "steward-snapshot.json"), "utf8"));
  assert.deepEqual(saved.services.map(item => item.name), ["Payments API", "Identity API"]);
  run("corrupt", 0, "CORRUPTED");
  run("read", 2, "ERROR: missing or invalid snapshot");
  assert.equal(fs.readFileSync(path.join(directory, "steward-snapshot.json"), "utf8"), '{"services": [', "Bad data must not be silently replaced");
  run("reset", 0, "RESET: []");
  run("read", 0, "READ:");
  const sql = publishedCode("first_session.sql — run only in a disposable PostgreSQL lab database");
  for (const statement of ["CREATE TEMP TABLE", "INSERT INTO tsa_session_probe", "ORDER BY id", "BEGIN;", "ROLLBACK;", "SELECT count(*)"]) {
    assert.ok(sql.includes(statement), `Missing SQL teaching concept: ${statement}`);
  }
  const relationalShape = source.match(/id: "steward-shape"[\s\S]*?code: ("(?:\\.|[^"\\])*")/);
  assert.ok(relationalShape, "Relational shape lesson missing");
  assert.doesNotMatch(JSON.parse(relationalShape[1]), /CREATE TABLE team/, "The lesson must not recreate Team after the prior example");
  console.log("Builder data foundations examples passed: multi-process JSON persistence, corruption exit 2, recovery, SQL session contract and no duplicate Team CREATE.");
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
