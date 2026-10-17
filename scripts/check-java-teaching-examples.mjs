import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const sourcePath = path.join(process.cwd(), "packages/runtime-kernel/src/paths/quality-java-test-engineering-deep.ts");
const content = fs.readFileSync(sourcePath, "utf8");
const tree = ts.createSourceFile("quality-java-test-engineering-deep.ts", content, ts.ScriptTarget.Latest, true);
const value = (node, key) => {
  const prop = node.properties.find((p) => ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === key);
  return prop && ts.isStringLiteralLike(prop.initializer) ? prop.initializer.text : undefined;
};
let code;
function find(node) {
  if (ts.isObjectLiteralExpression(node) && value(node, "id") === "dependency-injection") {
    if (code) throw new Error("Duplicate Java dependency-injection example");
    code = value(node, "code");
  }
  ts.forEachChild(node, find);
}
find(tree);
if (!code || !content.includes('output:"https://test.invalid / Bearer demo-token"')) {
  throw new Error("Java constructor injection snippet or documented output is missing");
}
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-java-example-"));
try {
  fs.writeFileSync(path.join(directory, "DependencyInjectionExample.java"), code);
  const compile = spawnSync("javac", ["DependencyInjectionExample.java"], { cwd: directory, encoding: "utf8", timeout: 12000 });
  if (compile.error || compile.status !== 0) throw new Error(`javac failed: ${compile.error ?? compile.stderr}`);
  const execute = spawnSync("java", ["-cp", directory, "DependencyInjectionExample"], { cwd: directory, encoding: "utf8", timeout: 8000 });
  if (execute.error || execute.status !== 0) throw new Error(`Java example failed: ${execute.error ?? execute.stderr}`);
  const expected = "https://test.invalid / Bearer demo-token";
  if (execute.stdout.trim() !== expected) throw new Error(`Expected ${expected}; received ${execute.stdout}`);
  console.log("Java learner-example validation passed: dependency injection compiled and produced its published output.");
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
