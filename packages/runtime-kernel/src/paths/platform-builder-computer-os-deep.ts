import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const linuxKernelDocs: LearningResource = { title: "Linux kernel documentation", url: "https://docs.kernel.org/" };
const procMan: LearningResource = { title: "proc(5) — Linux manual page", url: "https://man7.org/linux/man-pages/man5/proc.5.html" };
const processMan: LearningResource = { title: "proc_pid_stat(5) — process state", url: "https://man7.org/linux/man-pages/man5/proc_pid_stat.5.html" };
const filesystemHierarchy: LearningResource = { title: "Filesystem Hierarchy Standard", url: "https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" };
const ioStatMan: LearningResource = { title: "iostat(1) manual", url: "https://man7.org/linux/man-pages/man1/iostat.1.html" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `computer-and-os-foundations-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
        if (section.code) {
            blocks.push(section.code.caption
                ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                : { type: "code", language: section.code.language, code: section.code.code });
        }
    }

    blocks.push({ type: "callout", tone: "steward", title: "Steward connection", body: "Every concept in this module should eventually explain a real observation about the machine running Steward API: why the process consumes CPU, why memory pressure hurts latency, why storage can become the bottleneck, or why the application cannot run without operating-system abstractions." });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 35, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Machine Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use the machine or VM that runs Steward API. Prefer direct operating-system evidence over memorized definitions.",
                    instructions,
                    deliverables: ["Command/output evidence", "Short explanation connecting the observation to application behavior"],
                    completionCriteria: ["The observation comes from a real machine.", "The learner explains what the operating system is doing, not just what the command prints.", "At least one finding is connected to Steward API behavior or capacity."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const computerAndOsFoundationsDeepLessons: Lesson[] = [
    richLesson(
        "CPU, Memory, Storage and I/O",
        "Applications do not run on abstract compute. They consume finite CPU time, memory, storage capacity and I/O bandwidth. Platform engineering starts by understanding these resources well enough to explain why an application is fast, slow, blocked or unstable.",
        ["Explain the role of CPU, memory, persistent storage and I/O.", "Distinguish capacity from throughput and latency.", "Recognize that a bottleneck is workload-dependent.", "Connect resource pressure to application symptoms."],
        [
            { title: "CPU executes work", paragraphs: ["A CPU executes instructions on behalf of processes and threads. More CPU cores can increase concurrency, but only when the workload can use them. A single blocked thread, lock-heavy code path or database wait can remain slow even on a machine with many cores.", "Useful questions are not only 'How many CPUs do I have?' but also 'Who is consuming CPU?', 'Is the process runnable or waiting?', and 'Is the workload parallel enough to benefit from more cores?'"], code: { language: "bash", code: "nproc\nlscpu\nuptime\nps -eo pid,comm,%cpu,%mem --sort=-%cpu | head", caption: "Start with inventory, then observe actual consumption." } },
            { title: "Memory is working state", paragraphs: ["RAM holds active code and data close to the CPU. The operating system also uses otherwise free memory for caches, so low 'free' memory is not automatically a problem. The stronger signal is whether the system is under pressure: reclaiming aggressively, swapping, killing processes or forcing the application to wait.", "For Steward, memory demand may come from the Django process, Python objects, connection pools, PostgreSQL, filesystem cache and other services sharing the host."] },
            { title: "Storage has multiple dimensions", paragraphs: ["Storage must be reasoned about in at least three dimensions: capacity, throughput and latency. A disk can have plenty of free space while still being too slow for a workload, and a fast device can still fail the system when it fills up.", "Database-heavy systems are often sensitive to I/O latency because durable writes and page reads sit on the request path."], code: { language: "bash", code: "df -h\nlsblk\nfree -h\nvmstat 1", caption: "Capacity and activity are different questions." } },
        ],
        "Inspect the machine's compute, memory and storage resources and explain which resource is most likely to limit Steward first under higher load.",
        ["Record CPU count and architecture.", "Record total/available memory and explain why 'free' alone is insufficient.", "Record mounted filesystems and free capacity.", "Observe process CPU/memory use while exercising Steward.", "Write one evidence-backed capacity hypothesis and one measurement that would confirm or reject it."],
        ["Why can adding CPU fail to improve performance?", "Why is low free memory not automatically a problem on Linux?", "What is the difference between storage capacity and I/O latency?"],
        [linuxKernelDocs, procMan, ioStatMan],
    ),
    richLesson(
        "What an Operating System Does",
        "The operating system turns hardware into stable abstractions that applications can use: processes, virtual memory, files, sockets, users, permissions, clocks and device access. Steward does not talk directly to the CPU, disk or network card; it asks the operating system to mediate those resources.",
        ["Explain the OS as a resource manager and abstraction layer.", "Name the operating-system abstractions Steward depends on.", "Distinguish application behavior from kernel-mediated behavior.", "Use system calls as the conceptual boundary between user programs and the kernel."],
        [
            { title: "The OS multiplexes finite resources", paragraphs: ["Many processes believe they have a CPU, memory space, files and network access at the same time. The OS schedules CPU time, maps virtual memory, enforces permissions and coordinates device access so those processes can coexist.", "This is why platform behavior can change without application code changing: process limits, file permissions, memory pressure, socket state or filesystem availability can all change what the application can do."] },
            { title: "Applications request kernel services", paragraphs: ["User programs rely on system calls for operations such as opening a file, reading from a socket, creating a process or mapping memory. Libraries and frameworks hide much of this detail, but the boundary still exists.", "A useful platform engineer can move up and down the abstraction stack: from a failed HTTP request to a socket, process, file descriptor, permission or filesystem problem beneath it."], code: { language: "text", code: "HTTP request\n  ↓\nDjango / Python runtime\n  ↓\nsystem calls\n  ↓\nLinux kernel\n  ↓\nCPU · memory · disk · network device", caption: "The application stack rests on operating-system mediation." } },
        ],
        "Build a dependency map showing which operating-system abstractions Steward requires to serve one HTTP request.",
        ["Trace a request from client connection to application process.", "Identify at least one socket, process, memory, filesystem and clock dependency.", "For each dependency, state what failure would look like at application level.", "Mark which behaviors are primarily application-controlled versus OS-controlled."],
        ["Why does an application need an operating system even if its code never imports an OS-specific library?", "What does it mean to say the OS multiplexes resources?", "Why are system calls useful as a mental boundary?"],
        [linuxKernelDocs, procMan],
    ),
    richLesson(
        "Kernel Space and User Space",
        "Modern operating systems isolate privileged kernel code from ordinary application processes. This boundary protects the machine, but it also explains why applications cannot directly manipulate hardware, networking tables or arbitrary memory.",
        ["Distinguish kernel space from user space.", "Explain why privilege separation exists.", "Understand that Python, Django and PostgreSQL normally execute in user space.", "Recognize context switches into the kernel for privileged operations."],
        [
            { title: "Privilege is intentionally separated", paragraphs: ["Kernel space contains code with authority over memory management, process scheduling, filesystems, networking and devices. User-space processes are intentionally restricted so a bug in one application does not automatically grant it control of the whole machine.", "Steward's Django process normally runs in user space. When it reads a file or sends bytes over a socket, the kernel performs the privileged operation after validating the request."] },
            { title: "Root is not the same as kernel mode", paragraphs: ["A root-owned user-space process has broad operating-system permissions, but it is still a user-space process. This distinction matters because 'run it as root' is not equivalent to 'the application becomes the kernel.'", "Platform engineering aims to grant only the privileges a service actually needs rather than solving permission problems by removing the boundary."], code: { language: "bash", code: "id\nps -eo user,pid,comm | grep -E 'python|gunicorn|postgres'\ncat /proc/$$/status | head", caption: "Inspect which user owns the processes that form the Steward stack." } },
        ],
        "Inspect the users running Steward-related processes and explain why those processes should not require unrestricted root privileges.",
        ["Identify the OS user for the Steward application process.", "Identify the OS user for PostgreSQL if local.", "List resources each process actually needs.", "Write one example of a permission failure that should be fixed with ownership/permissions rather than root execution."],
        ["What runs in kernel space?", "Why is root still different from kernel mode?", "What security benefit does user-space isolation provide?"],
        [linuxKernelDocs, procMan],
    ),
    richLesson(
        "Processes and Threads",
        "A deployed application becomes operating-system processes and threads. Understanding their lifecycle, state and resource ownership is essential for diagnosing hung services, CPU spikes, memory growth and failed restarts.",
        ["Define process and thread at an operational level.", "Read basic Linux process state.", "Connect PIDs, parent processes and service managers.", "Distinguish CPU-bound work from waiting/blocking behavior."],
        [
            { title: "A process is a running execution context", paragraphs: ["A process has an identity, virtual address space, open file descriptors, credentials and scheduler state. A PID is the operating system's handle for that running instance.", "A service manager can start a parent process which then creates workers. What looks like 'the application' at source level may therefore be several OS processes at runtime."] },
            { title: "Threads share process resources", paragraphs: ["Threads execute independently within one process while sharing much of the same memory and file state. Whether a workload uses processes, threads or both affects concurrency, failure isolation and resource consumption.", "The key platform question is empirical: how is this service actually running on this host? Inspect it instead of assuming from framework defaults."], code: { language: "bash", code: "ps -ef --forest\nps -eLo pid,ppid,lwp,stat,comm | head -30\ncat /proc/<PID>/status\nls -l /proc/<PID>/fd | head", caption: "Linux exposes process and thread evidence directly." } },
        ],
        "Map the runtime process tree for Steward and identify which process would need to be restarted after an application failure.",
        ["Start Steward in the environment used for this school.", "Capture its process tree and PIDs.", "Identify parent/child relationships and any workers.", "Inspect one process state and open file descriptors.", "Stop one process deliberately and record what happens to the service."],
        ["What does a PID identify?", "What resources do threads typically share?", "Why can source-code architecture differ from runtime process architecture?"],
        [processMan, procMan],
    ),
    richLesson(
        "Filesystems",
        "Applications experience persistent storage through filesystems: named paths, directories, metadata, permissions and mount points. A correct service can fail completely when its filesystem assumptions are wrong.",
        ["Explain filesystems as named persistent storage abstractions.", "Distinguish files, directories and mount points.", "Recognize path, ownership, permission and capacity failures.", "Connect filesystem design to application configuration, logs, database storage and backups."],
        [
            { title: "Paths are part of operational behavior", paragraphs: ["Configuration files, Unix sockets, logs, static assets, database files and backups all depend on filesystem paths. A path that exists on a developer laptop may not exist on a server, and a process may see the path but lack permission to use it.", "Platform engineering therefore treats paths and ownership as deployment configuration, not incidental details."] },
            { title: "Mount points shape failure boundaries", paragraphs: ["Linux combines multiple filesystems into one directory tree. A separate disk or volume can be mounted below a directory, so two paths that look adjacent may have very different capacity, durability or failure characteristics.", "Before deciding where Steward data, PostgreSQL state or backups belong, inspect the actual mounts and understand which device backs each path."], code: { language: "bash", code: "findmnt\nlsblk -f\ndf -hT\ndu -sh /var/* 2>/dev/null | sort -h | tail\nstat /path/to/steward", caption: "Filesystem questions require both namespace and backing-device evidence." } },
        ],
        "Map the important filesystem paths used by Steward and identify their ownership, backing filesystem and failure consequence.",
        ["Identify where application code/configuration lives.", "Identify where PostgreSQL persists data if local.", "Identify where logs or journal data are written.", "Use findmnt/df/stat to record backing filesystem and permissions.", "Describe what happens if one important filesystem becomes read-only or full."],
        ["Why can a correct path still be unusable by a service?", "What is a mount point?", "Why should backup storage not be reasoned about only as another directory name?"],
        [filesystemHierarchy, procMan],
    ),
    {
        id: "computer-and-os-foundations-lab-inspect-the-machine-beneath-steward-api",
        title: "Lab: Inspect the Machine Beneath Steward API",
        activities: [
            {
                id: "computer-and-os-foundations-lab-inspect-the-machine-beneath-steward-api-brief",
                title: "Build a machine evidence baseline",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab turns the machine beneath Steward into an explicit engineering artifact. The goal is not to benchmark for sport; it is to establish enough evidence that later Linux, networking, capacity and reliability work starts from a known system rather than assumptions.",
                    blocks: [
                        { type: "heading", id: "evidence-domains", text: "Evidence domains", level: 2 },
                        { type: "list", items: ["CPU architecture, cores and observed utilization", "Memory capacity, available memory and pressure indicators", "Storage devices, filesystems, mounts and free capacity", "Steward process tree, ownership and process state", "Important paths and open files/sockets relevant to the service"] },
                        { type: "heading", id: "failure-experiment", text: "Failure experiment", level: 2 },
                        { type: "paragraph", text: "Introduce one safe machine-level constraint or failure, such as stopping the application process, removing read access to a disposable test file, filling a temporary test filesystem, or exhausting a deliberately small resource limit. Record the symptom and the evidence that localizes the cause." },
                        { type: "callout", tone: "warning", title: "Do not damage the host", body: "Use a disposable VM or safe test path for destructive experiments. Do not fill the root filesystem, alter unknown system files or delete local work. The objective is controlled diagnosis, not chaos." },
                        { type: "resources", title: "Core references", resources: [linuxKernelDocs, procMan, filesystemHierarchy] },
                    ],
                },
            },
            {
                id: "computer-and-os-foundations-lab-inspect-the-machine-beneath-steward-api-practice",
                title: "Inspect and explain the host",
                estimatedMinutes: 150,
                content: {
                    type: "practical",
                    objective: "Produce a reproducible machine baseline for the host or VM running Steward API and connect operating-system evidence to application behavior.",
                    scenario: "Another engineer must take over the platform without knowing the machine. Your evidence should let them understand what resources exist, which processes constitute Steward, where important data lives and what one controlled machine-level failure looks like.",
                    instructions: ["Record OS/kernel identity and CPU architecture.", "Record CPU, memory, storage and filesystem inventory.", "Start or exercise Steward and capture process tree, process ownership and high-level resource use.", "Identify important application/database paths and their mount points.", "Inspect listening/open resources relevant to the process where possible.", "Run one safe failure experiment and diagnose it using OS evidence.", "Write a short capacity note: which resource deserves measurement first as Steward grows, and why?", "Save commands and outputs in a reviewable platform-baseline artifact."],
                    deliverables: ["Machine inventory", "Steward runtime process map", "Filesystem/mount map for important paths", "Controlled failure diagnosis", "Initial capacity hypothesis"],
                    completionCriteria: ["Every major claim is backed by command/output evidence.", "The learner can explain the OS abstraction behind each observation.", "The failure is localized rather than described only from the application symptom.", "The artifact is safe and reproducible on a disposable learner-managed environment."]
                },
            },
            {
                id: "computer-and-os-foundations-lab-inspect-the-machine-beneath-steward-api-reflection",
                title: "Host Baseline Review",
                estimatedMinutes: 15,
                content: { type: "reflection", prompt: "1. Which operating-system abstraction was easiest to ignore while developing Steward locally?\n2. Which resource appears most likely to become the first operational constraint, and what evidence supports that?\n3. What machine-level failure could currently be mistaken for an application bug?\n4. What must the next Linux Administration module make reproducible rather than manual?" }
            },
        ],
    },
];
