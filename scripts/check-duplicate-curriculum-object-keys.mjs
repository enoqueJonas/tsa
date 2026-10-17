import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const ts = require(path.join(root, "node_modules/typescript"));
const directory = path.join(root, "packages/runtime-kernel/src/paths");
const files = fs.readdirSync(directory).filter((name) => name.endsWith(".ts"));
const issues = [];
const syntaxErrors = [];
let objects = 0;

function staticName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  if (ts.isComputedPropertyName(name) &&
      (ts.isStringLiteral(name.expression) || ts.isNumericLiteral(name.expression))) return name.expression.text;
  return null;
}

for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(path.join(directory, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (const diagnostic of source.parseDiagnostics) {
    const line = source.getLineAndCharacterOfPosition(diagnostic.start ?? 0).line + 1;
    syntaxErrors.push(`${file}:${line} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`);
  }
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      objects++;
      const seen = new Map();
      for (const property of node.properties) {
        if (!("name" in property) || !property.name) continue;
        const key = staticName(property.name);
        if (key === null) continue;
        const line = source.getLineAndCharacterOfPosition(property.name.getStart(source)).line + 1;
        if (seen.has(key)) {
          issues.push(`${file}:${line} duplicates "${key}" previously at line ${seen.get(key)}`);
        } else {
          seen.set(key, line);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
console.log(`Duplicate curriculum object keys: ${files.length} path files, ${objects} object literals, ${issues.length} duplicate keys; ${syntaxErrors.length} syntax errors.`);
if (syntaxErrors.length) {
  console.error("Curriculum syntax errors:\n" + syntaxErrors.join("\n"));
  process.exitCode = 1;
}
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
}
