import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const censusPath = path.join(root, "docs/curriculum/source-census.md");
const sourceDir = path.join(root, "packages/runtime-kernel/src/paths");
const original = fs.readFileSync(censusPath, "utf8");
let visited = 0;
const refreshed = original.split("\n").map((line) => {
  const match = line.match(/^\| ([a-z-]+) \| `([a-z0-9-]+)` \| (marked|open) \|/);
  if (!match) return line;
  const [, school, module, status] = match;
  const sourcePath = path.join(sourceDir, `${module}.ts`);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing source for census entry ${school}/${module}`);
  const source = fs.readFileSync(sourcePath, "utf8");
  const count = (pattern) => [...source.matchAll(pattern)].length;
  visited++;
  return `| ${school} | \`${module}\` | ${status} | ${source.length} | ${count(/type:\s*["']reading["']/g)} | ${count(/type:\s*["']practical["']/g)} | ${count(/type:\s*["']code["']/g)} | ${count(/\boutput\s*:/g)} |`;
}).join("\n");
if (visited !== 134) throw new Error(`Expected 134 module rows; found ${visited}. Verify the authoritative inventory first.`);
fs.writeFileSync(censusPath, refreshed, "utf8");
console.log(`Refreshed ${visited} module source-census rows. Counts are literals only, not a pedagogical assessment.`);
