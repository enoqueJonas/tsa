import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.join(process.cwd(), "packages/runtime-kernel/src/paths");
const files = fs.readdirSync(root).filter((file) => file.endsWith(".ts"));
const findings = [];
const computed = [];
const spreadContracts = [];
const stats = { files: files.length, explicit: 0, dynamic: 0 };
const keys = ["objective", "scenario", "instructions", "deliverables", "completionCriteria"];
const prop = (obj, key) => obj.properties.find((p) =>
  ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === key);
const literal = (node) => node && ts.isStringLiteralLike(node) ? node.text : undefined;
const list = (node) => node && ts.isArrayLiteralExpression(node) ? node.elements : undefined;
for (const name of files) {
  const source = fs.readFileSync(path.join(root, name), "utf8");
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isObjectLiteralExpression(node) && literal(prop(node, "type")?.initializer) === "practical") {
      stats.explicit++;
      const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
      const spreads = node.properties.some((item) => ts.isSpreadAssignment(item));
      const absent = [];
      const weak = [];
      const indirect = [];
      for (const key of keys) {
        const value = prop(node, key)?.initializer;
        if (!value) {
          const shorthand = node.properties.some((item) => ts.isShorthandPropertyAssignment(item) && item.name.text === key);
          if (shorthand || spreads) indirect.push(key);
          else absent.push(key);
          continue;
        }
        const str = literal(value);
        const items = list(value);
        if (str !== undefined) {
          if ((key === "objective" || key === "scenario") && str.trim().length < 20) weak.push(key);
        } else if (items) {
          if (items.length === 0) weak.push(key);
          else if (items.every((item) => literal(item) !== undefined) &&
            items.some((item) => !literal(item).trim())) weak.push(key);
        } else {
          indirect.push(key);
        }
      }
      if (indirect.length) {
        stats.dynamic++;
        computed.push({ file: name, line, fields: indirect });
        if (spreads) spreadContracts.push({ file: name, line });
      }
      if (absent.length || weak.length) findings.push({ file: name, line, absent, weak });
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
}
console.log(`Practical source audit: ${stats.files} path files; ${stats.explicit} explicit practical content objects; ${computed.length} use computed fields; ${findings.length} literal missing/empty candidates.`);
console.log("Literal missing/empty candidates (manual triage required):");
for (const item of findings) console.log(`  ${item.file}:${item.line}: missing=[${item.absent.join(", ")}] weak=[${item.weak.join(", ")}]`);
console.log(`Computed-field practicals requiring resolved lesson inspection: ${computed.length} (not classified as missing); ${spreadContracts.length} include object spreads.`);
const byFile = new Map();
for (const item of findings) byFile.set(item.file, (byFile.get(item.file) ?? 0) + 1);
console.log("Modules ranked by literal-contract findings:");
for (const [name, count] of [...byFile].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) console.log(`  ${name}: ${count}`);
console.log("Computed or wrapper-generated practical content and pedagogical quality require resolved-content review; source-level heuristics are not acceptance evidence.");
