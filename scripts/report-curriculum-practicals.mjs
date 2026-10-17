import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.join(process.cwd(), "packages/runtime-kernel/src/paths");
const files = fs.readdirSync(root).filter((file) => file.endsWith(".ts"));
const findings = [];
const stats = { files: files.length, explicit: 0, dynamic: 0 };
const prop = (obj, key) => obj.properties.find((p) =>
  ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === key);
const text = (node) => node && ts.isStringLiteralLike(node) ? node.text : undefined;
const array = (node) => node && ts.isArrayLiteralExpression(node) ? node.elements : undefined;
const meaningful = (node) => {
  const items = array(node);
  return items?.length > 0 && items.every((item) => typeof text(item) === "string" && text(item).trim().length >= 12);
};
for (const name of files) {
  const source = fs.readFileSync(path.join(root, name), "utf8");
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const type = text(prop(node, "type")?.initializer);
      if (type === "practical") {
        const loc = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
        const checks = ["objective", "scenario", "instructions", "deliverables", "completionCriteria"];
        const missing = checks.filter((key) => {
          const value = prop(node, key)?.initializer;
          if (!value) return true;
          if (key === "objective" || key === "scenario") return typeof text(value) === "string" ? text(value).trim().length < 20 : false;
          return array(value) ? !meaningful(value) : false;
        });
        const dynamic = checks.some((key) => {
          const value = prop(node, key)?.initializer;
          return value && !ts.isArrayLiteralExpression(value) && !ts.isStringLiteralLike(value);
        });
        stats.explicit++;
        if (dynamic) stats.dynamic++;
        if (missing.length) findings.push({ file: name, line: loc, missing });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
}
console.log(`Practical source audit: ${stats.files} path files; ${stats.explicit} explicit practical content objects; ${stats.dynamic} with computed fields; ${findings.length} missing/weak literal-contract candidates.`);
console.log("Candidates for targeted practical review (not automatic failures):");
for (const item of findings) console.log(`  ${item.file}:${item.line}: ${item.missing.join(", ")}`);
console.log("Computed content, wrapper-generated practicals and pedagogical quality require separate inspection; zero findings is not full acceptance.");
