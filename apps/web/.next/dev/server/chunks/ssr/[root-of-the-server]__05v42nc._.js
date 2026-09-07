module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/apps/web/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.2vob68tjqpejf.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/apps/web/app/favicon.ico.mjs { IMAGE => \"[project]/apps/web/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/apps/web/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[project]/packages/runtime-kernel/src/activities/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
}),
"[project]/packages/runtime-kernel/src/activities/engineering-foundations.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "engineeringBrief",
    ()=>engineeringBrief
]);
const engineeringBrief = {
    id: "engineering-foundations-001",
    title: "Engineering Brief",
    estimatedMinutes: 5,
    content: {
        type: "reading",
        body: "Software engineering is the disciplined practice of solving problems through systems."
    }
};
}),
"[project]/packages/runtime-kernel/src/activities/engineering-reflection.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "engineeringReflection",
    ()=>engineeringReflection
]);
const engineeringReflection = {
    id: "engineering-foundations-002",
    title: "Reflection",
    estimatedMinutes: 10,
    content: {
        type: "reflection",
        prompt: "Think about a software project you've worked on. What made it succeed or fail?"
    }
};
}),
"[project]/packages/runtime-kernel/src/paths/thinking-like-an-engineer.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "thinkingLikeAnEngineer",
    ()=>thinkingLikeAnEngineer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$activities$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/activities/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$activities$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/activities/engineering-foundations.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$activities$2f$engineering$2d$reflection$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/activities/engineering-reflection.ts [app-rsc] (ecmascript)");
;
const thinkingLikeAnEngineer = {
    id: "thinking-like-an-engineer",
    title: "Thinking Like an Engineer",
    activities: [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$activities$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["engineeringBrief"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$activities$2f$engineering$2d$reflection$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["engineeringReflection"]
    ]
};
}),
"[project]/packages/runtime-kernel/src/paths/engineering-foundations.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "engineeringFoundations",
    ()=>engineeringFoundations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$thinking$2d$like$2d$an$2d$engineer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/paths/thinking-like-an-engineer.ts [app-rsc] (ecmascript)");
;
const engineeringFoundations = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    lessons: [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$thinking$2d$like$2d$an$2d$engineer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["thinkingLikeAnEngineer"]
    ]
};
}),
"[project]/packages/runtime-kernel/src/paths/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/paths/engineering-foundations.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$thinking$2d$like$2d$an$2d$engineer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/paths/thinking-like-an-engineer.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/packages/runtime-kernel/src/runtime/session.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLearningSession",
    ()=>createLearningSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/paths/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/paths/engineering-foundations.ts [app-rsc] (ecmascript)");
;
function createLearningSession() {
    let lessonIndex = 0;
    let activityIndex = 0;
    return {
        currentActivity () {
            const lesson = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["engineeringFoundations"].lessons[lessonIndex];
            return lesson.activities[activityIndex];
        },
        next () {
            const lesson = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["engineeringFoundations"].lessons[lessonIndex];
            if (activityIndex < lesson.activities.length - 1) {
                activityIndex++;
                return;
            }
            if (lessonIndex < __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$paths$2f$engineering$2d$foundations$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["engineeringFoundations"].lessons.length - 1) {
                lessonIndex++;
                activityIndex = 0;
            }
        }
    };
}
}),
"[project]/packages/runtime-kernel/src/create-runtime.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRuntime",
    ()=>createRuntime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$runtime$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/runtime/session.ts [app-rsc] (ecmascript)");
;
function createRuntime() {
    return {
        start () {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$runtime$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLearningSession"])();
        }
    };
}
}),
"[project]/packages/runtime-kernel/src/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2d$kernel$2f$src$2f$create$2d$runtime$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime-kernel/src/create-runtime.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/apps/web/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/apps/web/app/page.tsx'\n\nExpected ';', '}' or <eof>");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/apps/web/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__05v42nc._.js.map