import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const filePath = path.join(process.cwd(), "packages/runtime-kernel/src/paths/builder-python-rich.ts");
const source = ts.createSourceFile("builder-python-rich.ts", fs.readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
const required = new Set([
  "Make the decision visible",
  "Find unowned critical services",
  "Search without a separate flag",
  "Read and change a dictionary deliberately",
  "Iterate with the information you need",
  "Handle, continue and clean up deliberately",
  "Generate matching services lazily",
  "Keep only even numbers",
  "Critical production services",
  "Lazy iteration",
  "Use any/all deliberately",
  "Choose the result structure intentionally",
  // Self-contained OOP examples: execute what learners actually see, not only foundations.
  "Two separate Car objects",
  "Create two objects and trace self through their methods",
  "An Engine is an independent object",
  "Functions can be passed and returned",
  "Decorator syntax is an assignment shortcut",
  "Forward arguments and preserve a function name",
  "A property offers computed attribute-style access",
  "Run as a self-contained example: rejected assignment leaves the prior temperature intact",
  "Class methods receive the class; static methods do not",
  "Dataclasses generate boilerplate",
]);
const extracted = new Map();
const literal = (obj, key) => {
  const property = obj.properties.find((p) => ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === key);
  return property && ts.isStringLiteralLike(property.initializer) ? property.initializer.text : undefined;
};
function visit(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const caption = literal(node, "caption");
    if (caption && required.has(caption)) {
      if (extracted.has(caption)) throw new Error(`Repeated teaching example caption: ${caption}`);
      extracted.set(caption, {
        code: literal(node, "code"),
        expected: literal(node, "output"),
        language: literal(node, "language"),
      });
    }
  }
  ts.forEachChild(node, visit);
}
visit(source);
const normalize = (s) => s.replace(/\r\n/g, "\n").trimEnd();
const failures = [];
for (const caption of required) {
  const sample = extracted.get(caption);
  if (!sample || sample.language !== "python" || !sample.code || sample.expected === undefined) {
    failures.push(`${caption}: missing runnable Python code and expected output`);
    continue;
  }
  const process = spawnSync("python3", ["-I", "-c", sample.code], { encoding: "utf8", timeout: 8000 });
  if (process.error || process.status !== 0) {
    failures.push(`${caption}: execution failed: ${process.error ?? process.stderr}`);
  } else if (normalize(process.stdout) !== normalize(sample.expected)) {
    failures.push(`${caption}: output mismatch\n  Expected: ${JSON.stringify(sample.expected)}\n  Actual:   ${JSON.stringify(process.stdout)}`);
  }
}
if (failures.length) {
  console.error("Python learner-example validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Python learner-example validation passed: ${required.size} independently executed snippets produced their documented output.`);
