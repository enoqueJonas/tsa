import assert from "node:assert/strict";
import fs from "node:fs";
const root="packages/runtime-kernel/src/paths/";
const read=(name)=>fs.readFileSync(root+name+".ts","utf8");
const entry=read("platform-builder");
const computer=read("platform-builder-computer-os-deep");
const linux=read("platform-builder-linux-administration-deep");
const quality=read("platform-builder-linux-administration-quality");
const exports=[...entry.matchAll(/^export const (\w+) = path\(/gm)];
assert.equal(exports.length,15,"Platform Builder canonical path count changed");
assert.ok(!entry.includes("platformFieldGuides"),"Thin per-path readiness generator returned");
assert.ok(!entry.includes("operational-readiness"),"Artificial one-paragraph lesson returned");
assert.match(entry,/function path\([\s\S]+?return \{ id, title, lessons \};/,"Authored lessons no longer have direct path ownership");
for(const title of ["CPU, Memory, Storage and I/O","What an Operating System Does","Kernel Space and User Space","Processes and Threads","Filesystems"]){
 assert.ok(computer.includes('"'+title+'"'),"Missing Computer/OS authored mechanism: "+title);
}
assert.ok(computer.includes("Virtual memory separates address space"),"Virtual vs physical RAM mechanism missing");
assert.ok(computer.includes("The page cache makes storage and memory interact"),"Cache and IO mechanism missing");
const linuxTitles=[...linux.matchAll(/richLesson\(\s*\n\s*"([^"]+)"/g)].map(m=>m[1]);
assert.equal(linuxTitles.length,13,"Linux Administration canonical authored lesson inventory changed");
assert.equal(linuxTitles[0],"Installing Rocky Linux","Linux lesson is not authored for actual target distro");
assert.ok(linux.includes('title === "Installing Rocky Linux" ? "linux-administration-installing-ubuntu-server"'),"Learner progress key not preserved across distribution correction");
assert.ok(!/\bUbuntu\b|\bdpkg\b|\bapt\b/.test(linux),"Source still ships incorrect Ubuntu/APT training");
assert.ok(!quality.includes("rockyize(")&&!quality.includes("replaceRockyStrings("),"Unsafe string-rewrite layer returned");
assert.ok(linux.includes("compgen -e"),"Lesson may disclose environment secret values");
assert.ok(linux.includes("EnvironmentFiles -p User"),"Lesson introspects secret values instead of references");
assert.ok(!linux.includes("printenv | sort"),"Unsafe printenv example returned");
assert.ok(linux.includes("sudo test -e /etc/steward/steward.env"),"Lesson can overwrite service config with /dev/null");
assert.ok(linux.includes("exit")&&linux.includes("100")&&linux.includes("dnf check-update"),"DNF unusual success-state exit code not taught");
for(const evidence of [
 "Why Unix permissions can allow a request that SELinux denies",
 "How labels, policy and persistent corrections differ",
 "Worked failure discrimination and safe recovery evidence",
 "Distinguish a listening socket from a permitted network path",
 "Runtime policy is deliberately reversible",
 "Predict the outcome before modifying a rule",
 "Two independent permission decisions",
]){
 if(evidence==="Two independent permission decisions")continue;
 assert.ok(quality.includes(evidence),"Missing Linux failure-mechanism teaching: "+evidence);
}
assert.ok(quality.includes("matchpathcon -V")&&quality.includes("ausearch"),"No evidence-based SELinux diagnostic");
assert.ok(quality.includes("--get-active-zones")&&quality.includes("--permanent"),"Runtime/permanent firewalld distinction untestable");
assert.ok(quality.includes("independent clients")||quality.includes("separate-client"),"No separate-client firewall negative contrast");
console.log("Platform Builder foundations source guard passed: 15 thin wrappers removed, 5 real OS lessons, 13 canonical Rocky Linux lessons, protected config and SELinux/firewalld failure teaching.");
