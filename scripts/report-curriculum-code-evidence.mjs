import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const directory = path.join(process.cwd(), "packages/runtime-kernel/src/paths");
const files = fs.readdirSync(directory).filter((name) => name.endsWith(".ts"));
const cases = [];
const pedagogicalHazards = [];
const getProperty = (node, key) => node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText().replaceAll('"', "").replaceAll("'", "") === key);
const valueOf = (property) => {
  if (!property) return undefined;
  const node = property.initializer;
  return ts.isStringLiteralLike(node) ? node.text : undefined;
};
for (const name of files) {
  const source = fs.readFileSync(path.join(directory, name), "utf8");
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const code = getProperty(node, "code");
      const language = getProperty(node, "language");
      const output = getProperty(node, "output");
      const type = valueOf(getProperty(node, "type"));
      const codeText = valueOf(code);
      // Include direct code blocks and embedded teaching-section samples.
      if (code && (type === "code" || language)) {
        const location = file.getLineAndCharacterOfPosition(node.getStart(file));
        const prints = codeText && /(?:\bprint\s*\(|\bconsole\.log\s*\(|\bprintf\b|\becho\b|\bcurl\b|\bmvn\s+|\bSELECT\b)/i.test(codeText);
        const inline = codeText && /(?:^|\n)\s*(?:#|\/\/|--)\s*(?:expected\s+)?output\b/i.test(codeText);
        if (codeText && /\b(?:rm\s+-rf\s+\/|chmod\s+777\s+\/|curl\s+[^\n]*\|\s*(?:sudo\s+)?(?:ba)?sh\b)/i.test(codeText)) {
          pedagogicalHazards.push(`${name}:${location.line + 1} potentially destructive or unverified pipeline command`);
        }
        cases.push({
          file: name,
          line: location.line + 1,
          language: valueOf(language) ?? "dynamic",
          kind: codeText === undefined ? "dynamic-example" : "literal-example",
          expected: Boolean(output || inline),
          likelyObservable: Boolean(prints),
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
}
const missing = cases.filter((entry) => entry.kind === "literal-example" && entry.likelyObservable && !entry.expected);
console.log(`Source-level code block inventory: ${files.length} path files; ${cases.length} code records; ${missing.length} potentially observable literal examples without adjacent output evidence.`);
console.log("Candidates for human pedagogical review (not automatic failures):");
for (const item of missing) console.log(`  ${item.file}:${item.line} [${item.language}]`);
// Surface where review work is concentrated instead of printing only a flat list.
const byLanguage = new Map();
const byFile = new Map();
for (const item of cases) {
  const language = item.language.toLowerCase();
  const languageSummary = byLanguage.get(language) ?? { total: 0, literal: 0, outputEvidence: 0, reviewCandidates: 0 };
  languageSummary.total += 1;
  if (item.kind === "literal-example") languageSummary.literal += 1;
  if (item.expected) languageSummary.outputEvidence += 1;
  byLanguage.set(language, languageSummary);
  const fileSummary = byFile.get(item.file) ?? { codeBlocks: 0, reviewCandidates: 0 };
  fileSummary.codeBlocks += 1;
  byFile.set(item.file, fileSummary);
}
for (const item of missing) {
  const languageSummary = byLanguage.get(item.language.toLowerCase());
  if (languageSummary) languageSummary.reviewCandidates += 1;
  const fileSummary = byFile.get(item.file);
  if (fileSummary) fileSummary.reviewCandidates += 1;
}
console.log("Code evidence by language (source-level, not runtime pass rates):");
for (const [language, summary] of [...byLanguage.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`  ${language}: ${summary.total} code records, ${summary.literal} literal, ${summary.outputEvidence} with output evidence, ${summary.reviewCandidates} review candidates`);
}
console.log("Source modules with the most unresolved observable examples:");
for (const [name, summary] of [...byFile.entries()]
  .filter(([, info]) => info.reviewCandidates > 0)
  .sort((a, b) => b[1].reviewCandidates - a[1].reviewCandidates || a[0].localeCompare(b[0]))
  .slice(0, 30)) {
  console.log(`  ${name}: ${summary.reviewCandidates} review candidates / ${summary.codeBlocks} code records`);
}
console.log("Generated/dynamic code blocks require rendered activity inspection; the source-only inventory is not evidence of completeness.");

console.log(`Potentially unsafe literal teaching commands: ${pedagogicalHazards.length} (human triage required).`);
for (const hazard of pedagogicalHazards) console.log(`  ${hazard}`);
