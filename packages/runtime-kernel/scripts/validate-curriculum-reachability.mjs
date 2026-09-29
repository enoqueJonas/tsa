import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pathsRoot = join(packageRoot, "src", "paths");
const entry = join(pathsRoot, "academy-journey.ts");

async function sourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries.flatMap((entry) => entry.isFile() && extname(entry.name) === ".ts" ? [join(directory, entry.name)] : []);
}

function relativeImports(source) {
    const imports = [];
    const pattern = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["'](\.[^"']+)["']/g;
    for (const match of source.matchAll(pattern)) imports.push(match[1]);
    return imports;
}

function resolveImport(fromFile, specifier, knownFiles) {
    const candidate = normalize(resolve(dirname(fromFile), specifier));
    const options = [candidate, candidate + ".ts", join(candidate, "index.ts")];
    return options.find((option) => knownFiles.has(option));
}

function isCurriculumBearing(source) {
    const exportsLessonOrPath = /export\s+const\s+\w+[^=]*:\s*(?:Lesson|LearningPath|AuthoredLesson|AuthoredLearningPath)\b/.test(source);
    const exportsLessonCollection = /export\s+const\s+\w*(?:Lesson|Lessons|Path|Paths)\w*[^=]*:\s*(?:Lesson|LearningPath|AuthoredLesson|AuthoredLearningPath)\[\]/.test(source);
    return exportsLessonOrPath || exportsLessonCollection;
}

const files = await sourceFiles(pathsRoot);
const knownFiles = new Set(files);
const sources = new Map(await Promise.all(files.map(async (file) => [file, await readFile(file, "utf8")])));

const reachable = new Set();
const pending = [entry];

while (pending.length) {
    const file = pending.pop();
    if (!file || reachable.has(file)) continue;
    reachable.add(file);

    const source = sources.get(file);
    if (!source) continue;

    for (const specifier of relativeImports(source)) {
        const dependency = resolveImport(file, specifier, knownFiles);
        if (dependency && !reachable.has(dependency)) pending.push(dependency);
    }
}

const orphanedCurriculum = files
    .filter((file) => !reachable.has(file))
    .filter((file) => isCurriculumBearing(sources.get(file) ?? ""))
    .map((file) => relative(pathsRoot, file))
    .sort();

if (orphanedCurriculum.length) {
    console.error("TSA curriculum modules are not reachable from academy-journey.ts:");
    for (const file of orphanedCurriculum) console.error(" - " + file);
    console.error("\nEither compose each authored lesson/path into its school registry or remove the superseded curriculum source.");
    process.exit(1);
}

console.log("TSA curriculum reachability OK: " + reachable.size + "/" + files.length + " path modules reachable from academy-journey.ts.");
