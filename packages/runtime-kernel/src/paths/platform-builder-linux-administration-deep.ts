import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const ubuntuServerGuide: LearningResource = { title: "Ubuntu Server documentation", url: "https://documentation.ubuntu.com/server/" };
const systemdMan: LearningResource = { title: "systemd.service manual", url: "https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html" };
const journalctlMan: LearningResource = { title: "journalctl manual", url: "https://www.freedesktop.org/software/systemd/man/latest/journalctl.html" };
const bashManual: LearningResource = { title: "GNU Bash manual", url: "https://www.gnu.org/software/bash/manual/bash.html" };
const aptGuide: LearningResource = { title: "Ubuntu package management", url: "https://documentation.ubuntu.com/server/how-to/software/package-management/" };
const sshDocs: LearningResource = { title: "OpenSSH manual", url: "https://man.openbsd.org/ssh" };
const fhs: LearningResource = { title: "Filesystem Hierarchy Standard", url: "https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" };
const cronMan: LearningResource = { title: "crontab(5) manual", url: "https://man7.org/linux/man-pages/man5/crontab.5.html" };

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
    const id = `linux-administration-${slug(title)}`;
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

    blocks.push({ type: "callout", tone: "steward", title: "Steward connection", body: "Linux administration is not a collection of commands. Each lesson should improve the learner's ability to install, run, inspect, secure, recover and explain the host that operates Steward API." });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 35, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Linux Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use the Ubuntu Server environment that will host Steward API. Capture evidence from the machine instead of relying on memorized commands.",
                    instructions,
                    deliverables: ["Command/configuration evidence", "Short operational explanation connected to Steward"],
                    completionCriteria: ["The result is demonstrated on the learner-managed server.", "The learner explains the effect of the change and the failure mode it prevents.", "Commands and configuration are reproducible."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const linuxAdministrationDeepLessons: Lesson[] = [
    richLesson(
        "Installing Ubuntu Server",
        "A production-like Linux host begins before the application is copied onto it. Installation choices establish the operating-system version, storage layout, administrator access and the baseline from which later configuration must be reproduced.",
        ["Plan a minimal Ubuntu Server installation.", "Distinguish installation-time choices from later service configuration.", "Record enough baseline information to rebuild the host.", "Verify the system immediately after first boot."],
        [
            { title: "Install for a purpose", paragraphs: ["The goal is not to click through an installer successfully; it is to create a predictable server for Steward. Prefer a supported Ubuntu Server release, minimal packages, a known hostname, deliberate storage choices and a non-root administrative account.", "A reproducible install record should capture OS release, hostname, storage layout, network identity and the initial administrator path."], code: { language: "bash", code: "hostnamectl\ncat /etc/os-release\nlsblk -f\nip addr", caption: "Verify the host you actually created." } },
            { title: "Baseline before customization", paragraphs: ["Before adding application dependencies, capture the clean system state. This makes later drift visible and gives you a reference when troubleshooting package, networking or storage changes.", "The Platform Builder phase should produce a host you can explain and rebuild, not a one-off machine that only works because of forgotten manual steps."] },
        ],
        "Install or prepare an Ubuntu Server host and produce a first-boot baseline for the future Steward service.",
        ["Record OS version, hostname and kernel version.", "Record disks, partitions/filesystems and mounts.", "Record network addresses and default route.", "Confirm a non-root administrative account can use sudo.", "Write a short rebuild note containing the installation decisions that matter."],
        ["Why is a successful install not the same as a reproducible server?", "Which installation decisions affect later Steward operations?", "Why should baseline evidence be captured before heavy customization?"],
        [ubuntuServerGuide],
    ),
    richLesson(
        "Shell Navigation and Command Fluency",
        "The shell is the primary operational interface to a Linux server. Fluency means understanding paths, processes, redirection, pipelines and exit status well enough to investigate safely—not memorizing a long command list.",
        ["Navigate reliably with absolute and relative paths.", "Compose commands using pipes and redirection.", "Use command history and built-in help effectively.", "Check exit status instead of assuming success."],
        [
            { title: "Commands form data pipelines", paragraphs: ["Many Linux tools intentionally do one thing and emit text that can be filtered or redirected. This makes the shell powerful for investigation, but also means a pipeline can hide failures if you do not inspect what each stage does.", "Operational fluency includes knowing when you are reading, modifying or deleting state before pressing Enter."], code: { language: "bash", code: "pwd\nls -lah\nfind /etc -maxdepth 1 -type f | sort | head\necho $?\ncommand --help\nman command", caption: "Navigation, composition and evidence are core shell habits." } },
            { title: "Prefer inspect-before-change", paragraphs: ["On a server, the default sequence should be observe, understand, change, verify. Commands such as cat, less, stat, ps, ss and systemctl status are usually safer first moves than immediately editing or restarting.", "This habit becomes essential once Steward is a long-running service rather than a development process you can casually recreate."] },
        ],
        "Navigate the Steward host and build a short diagnostic pipeline that gathers system and application evidence without modifying state.",
        ["Use absolute and relative paths to locate relevant configuration.", "Use at least one pipe and one redirection into a temporary evidence file.", "Check the exit status of a successful and failing command.", "Use man or --help to explain one unfamiliar option.", "Document one inspect-before-change sequence you would use during an incident."],
        ["What does an exit status of zero conventionally mean?", "Why can a shell pipeline be dangerous on a server?", "What is the benefit of an inspect-before-change workflow?"],
        [bashManual],
    ),
    richLesson(
        "Files and Directories",
        "Linux services depend on a predictable filesystem layout. Application code, configuration, runtime state, logs and persistent data should live in locations whose purpose and ownership are understandable to another operator.",
        ["Create, inspect, copy, move and remove files safely.", "Distinguish persistent configuration from transient runtime data.", "Use metadata to reason about files, not just names.", "Choose paths that support clean service operation."],
        [
            { title: "Names are not enough", paragraphs: ["A filename does not reveal ownership, permissions, size, timestamp, filesystem or whether the path is a symbolic link. Commands such as stat, file and readlink expose metadata that often explains why a service cannot read or write a path.", "For Steward, separate application code from secrets/configuration and from generated or persistent data so lifecycle operations remain predictable."], code: { language: "bash", code: "stat /path/to/file\nfile /path/to/file\nreadlink -f /path/to/link\nfind /opt/steward -maxdepth 2 -type f -ls", caption: "Inspect metadata before changing files." } },
            { title: "Deletion is state change", paragraphs: ["rm, mv and recursive operations can destroy application state quickly. Treat them as privileged operational actions: identify the exact path, understand whether data is reproducible, and prefer backups or copies before risky changes.", "A disciplined administrator can explain why a path exists and whether deleting it is reversible."] },
        ],
        "Design and create a clean directory layout for Steward code, configuration and operational data without mixing unrelated lifecycle concerns.",
        ["Choose paths for code, environment/configuration and any local operational files.", "Create the directories and inspect their metadata.", "Create and resolve one symbolic link in a safe test area.", "Demonstrate a safe copy/move workflow before removing a temporary file.", "Write one rule for what must never be casually deleted on the host."],
        ["Why is file metadata operationally important?", "Why should configuration and application code not be treated as the same lifecycle artifact?", "What makes a deletion safe or unsafe?"],
        [fhs],
    ),
    richLesson(
        "Users and Groups",
        "Linux identities are an operational security boundary. A service should run with an identity that has enough access to do its job and no more, while human administrators should remain distinguishable from application accounts.",
        ["Distinguish human users, service users and groups.", "Inspect UID/GID membership.", "Create a dedicated service identity.", "Reason about shared access through groups instead of root."],
        [
            { title: "Identity precedes permission", paragraphs: ["Linux permission checks depend on the process identity. Running Steward as your personal account entangles application permissions with human administration; running it as root removes useful boundaries.", "A dedicated service account makes ownership and access intent visible and limits the blast radius of an application compromise."], code: { language: "bash", code: "id\ngetent passwd steward\ngetent group steward\nsudo useradd --system --home /opt/steward --shell /usr/sbin/nologin steward", caption: "A service account is intentionally different from a login account." } },
            { title: "Groups express shared authority", paragraphs: ["Groups are useful when multiple identities need controlled access to the same files or administrative workflow. They are preferable to making files world-writable or giving every operator root ownership.", "Access decisions should be explainable in terms of responsibilities: who operates Steward, who runs it, and who owns its data." ] },
        ],
        "Create or inspect a dedicated Steward service identity and document the minimum resources it should own or access.",
        ["Inspect your current user and groups.", "Create a non-login Steward service account in a safe environment if one does not exist.", "Identify directories/files that should be owned by the service account.", "Identify resources that should remain owned by root or another service.", "Explain why Steward should not normally run as root."],
        ["What is the operational difference between a human user and a service user?", "What problem do groups solve?", "How does a dedicated service identity reduce blast radius?"],
        [ubuntuServerGuide],
    ),
    richLesson(
        "Linux Permissions",
        "Permissions determine whether a process can read, modify or execute filesystem objects. Correct permissions should make intended access easy and unintended access difficult without resorting to blanket chmod 777 fixes.",
        ["Read rwx permissions in owner/group/other form.", "Use chmod, chown and chgrp intentionally.", "Explain directory execute permission.", "Apply least privilege to Steward paths."],
        [
            { title: "Permissions are evaluated against identity", paragraphs: ["For normal Unix mode bits, the kernel compares the process identity with file owner, group membership and other permissions. The same path can therefore work for an administrator and fail for the Steward service account.", "Directory execute permission controls traversal, which is why a file can appear readable yet remain unreachable through one parent directory."], code: { language: "bash", code: "namei -l /opt/steward/config.env\nstat -c '%U %G %a %n' /opt/steward /opt/steward/config.env\nchmod 640 /opt/steward/config.env\nchown steward:steward /opt/steward/config.env", caption: "Inspect the entire path, not only the final file." } },
            { title: "Least privilege beats convenience", paragraphs: ["Permissions should be derived from the service's real needs. Application code may only need read access, runtime directories may need write access, and secrets should be tightly restricted.", "A permission error is a signal to fix ownership and intended access—not an invitation to remove the security boundary." ] },
        ],
        "Apply least-privilege ownership and permissions to a Steward directory tree and prove the service account can access only what it needs.",
        ["Inspect ownership and mode bits on the chosen Steward paths.", "Set one configuration file to owner/group-readable but not world-readable.", "Demonstrate directory traversal behavior with namei -l.", "Test access as the Steward service account where safe.", "Document one permission failure and the narrowest fix."],
        ["Why does execute permission matter on directories?", "Why is chmod 777 usually a poor fix?", "How do ownership and mode bits work together?"],
        [fhs],
    ),
    richLesson(
        "Package Management",
        "Package management turns software installation into a tracked, dependency-aware system operation. A server should know what came from the distribution, what repository supplied it and how updates will be applied without losing control of change.",
        ["Use apt to query, install, update and remove packages.", "Distinguish package indexes from installed packages.", "Inspect package provenance and version.", "Plan updates as controlled change."],
        [
            { title: "Package state is managed state", paragraphs: ["apt coordinates repository metadata, dependencies and installed package versions. This is safer and more reproducible than downloading arbitrary binaries into system paths without tracking their origin.", "Before installing something, ask whether it is needed by Steward, the host, or only by the current investigation."], code: { language: "bash", code: "sudo apt update\napt policy postgresql\ndpkg -l | grep -E 'python|postgresql'\napt show <package>", caption: "Inspect availability and current state before installing." } },
            { title: "Updates have consequences", paragraphs: ["Security and bug-fix updates are necessary, but they are still changes. Kernel, database or runtime updates can require service restarts or alter behavior.", "A mature workflow records what changed, verifies service health afterward and avoids conflating 'latest' with 'safe to apply blindly.'"] },
        ],
        "Inventory the packages Steward depends on at OS level and install one required package using a documented, verifiable apt workflow.",
        ["Run apt update and explain what it changes and does not change.", "Inspect the candidate version of one package.", "Install or verify one required package.", "Record its installed version and origin.", "Define how you would verify Steward after a package update."],
        ["What is the difference between apt update and apt upgrade?", "Why is package provenance useful?", "Why should post-update verification be part of administration?"],
        [aptGuide],
    ),
    richLesson(
        "Processes and Signals",
        "Linux administration requires control over running processes. Signals provide a structured way to request termination, reload or other behavior instead of treating every stuck process as something to kill forcefully.",
        ["Inspect process ownership, state and hierarchy.", "Distinguish graceful termination from forced kill.", "Understand common signals such as TERM, HUP and KILL.", "Use process evidence before intervention."],
        [
            { title: "A running service has a process model", paragraphs: ["Steward may run through a parent server process and one or more workers. Restarting the wrong PID, ignoring the parent/child relationship or killing a process outside the service manager can create confusing state.", "Inspect the process tree and service manager ownership before intervening."], code: { language: "bash", code: "ps -ef --forest\npgrep -af 'gunicorn|python'\nkill -TERM <pid>\nkill -KILL <pid>", caption: "TERM asks a process to exit; KILL gives it no cleanup opportunity." } },
            { title: "Signals are control messages", paragraphs: ["SIGTERM is the normal graceful shutdown request. SIGKILL cannot be caught or ignored and should be a last resort. Other signals may trigger application-specific behavior such as reloads.", "The operational question is not 'Which signal is strongest?' but 'What shutdown behavior preserves correctness and gives the service a chance to release resources?'" ] },
        ],
        "Observe Steward's process tree and compare a graceful process stop with a forced termination in a controlled environment.",
        ["Capture the Steward process tree.", "Stop the service gracefully through its normal control path and observe exit behavior.", "In a safe test, force-kill a disposable process and compare the difference.", "Record logs or state that show graceful versus forced behavior.", "Explain why systemd should normally own service lifecycle instead of ad-hoc kill commands."],
        ["Why is SIGTERM preferable to SIGKILL?", "Why does the process tree matter?", "When is forced termination justified?"],
        [ubuntuServerGuide],
    ),
    richLesson(
        "systemd and Services",
        "systemd turns an application process into an operating-system-managed service with a declared start command, identity, dependencies, restart policy and lifecycle. This is the core transition from 'I can run Steward' to 'the server operates Steward.'",
        ["Read and write a basic systemd service unit.", "Use systemctl to control and inspect services.", "Understand restart policy and service identity.", "Verify boot-time and failure behavior."],
        [
            { title: "A service unit is an operational contract", paragraphs: ["A systemd unit should state how Steward starts, which user it runs as, where it runs, which environment it needs and what systemd should do after failure. This removes hidden shell-session assumptions.", "Keep the unit small and explicit. Complex deployment logic belongs elsewhere; systemd should supervise the final runtime process."], code: { language: "ini", code: "[Unit]\nDescription=Steward API\nAfter=network.target postgresql.service\n\n[Service]\nUser=steward\nWorkingDirectory=/opt/steward\nEnvironmentFile=/etc/steward/steward.env\nExecStart=/opt/steward/.venv/bin/gunicorn config.wsgi:application\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target", caption: "A minimal Steward systemd unit." } },
            { title: "Control through systemd", paragraphs: ["Use systemctl start, stop, restart, status and enable because systemd owns the lifecycle. systemctl daemon-reload is required after unit-file changes so the manager re-reads definitions.", "A service being 'active' does not prove application health; follow lifecycle verification with a real Steward request."], code: { language: "bash", code: "sudo systemctl daemon-reload\nsudo systemctl enable --now steward\nsystemctl status steward\nsystemctl show steward -p User -p MainPID -p Restart", caption: "Inspect declared and live service state." } },
        ],
        "Create or review a systemd service for Steward and prove boot/start/stop/restart behavior using both systemctl and an application-level health check.",
        ["Create a dedicated service unit in a safe environment.", "Reload systemd and start the service.", "Verify the configured user, PID and restart policy.", "Enable the service for boot if appropriate.", "Cause one controlled process failure and record whether systemd recovers it as configured."],
        ["What does systemd add beyond starting a process manually?", "Why is daemon-reload needed?", "Why is active status not enough to prove application health?"],
        [systemdMan, ubuntuServerGuide],
    ),
    richLesson(
        "Environment and Configuration",
        "A service needs configuration that is explicit, protected and independent of an interactive shell. Environment variables are useful, but their source, ownership and exposure must be controlled.",
        ["Separate code from environment-specific configuration.", "Understand process environments and inheritance.", "Use systemd EnvironmentFile or equivalent deliberately.", "Protect secrets from casual exposure."],
        [
            { title: "Interactive shell state is not deployment state", paragraphs: ["A variable exported in your SSH shell does not automatically exist when systemd starts Steward. Production-like services need configuration declared in a location the service manager can load consistently.", "Configuration should make environment differences visible without modifying application source code."], code: { language: "bash", code: "printenv | sort\nsystemctl show steward -p Environment\nsudo install -m 640 -o root -g steward /dev/null /etc/steward/steward.env", caption: "Treat configuration files as controlled operational assets." } },
            { title: "Secrets need tighter handling", paragraphs: ["Environment variables are convenient, but they can leak through debugging output, process inspection or careless logs. In this phase, focus on strict file permissions and avoiding secrets in source control; later Security Steward work will deepen secret-management controls.", "Never prove configuration by printing credentials into terminal history or documentation." ] },
        ],
        "Move Steward's runtime configuration out of an interactive shell into a controlled service configuration path and verify it is loaded without exposing secrets.",
        ["List which settings are environment-specific.", "Create a protected configuration file owned appropriately.", "Configure systemd to load it.", "Restart Steward and verify behavior using non-secret evidence.", "Confirm the configuration file is not world-readable and is not committed to the repository."],
        ["Why does export in your shell not configure a systemd service reliably?", "What is configuration drift?", "Why should secrets not be proven by printing them?"],
        [systemdMan, ubuntuServerGuide],
    ),
    richLesson(
        "Logs and journalctl",
        "Logs turn hidden runtime behavior into evidence. systemd's journal centralizes service output and operating-system events so an administrator can correlate application failures with service restarts, permissions, resource problems and boot history.",
        ["Query logs by service, time and boot.", "Use journalctl follow mode during controlled tests.", "Distinguish application messages from service-manager events.", "Collect focused evidence instead of dumping entire logs."],
        [
            { title: "Query with a question", paragraphs: ["Good log investigation starts with a time window and a hypothesis. 'Show me everything' creates noise; 'What happened to steward.service around 14:32?' produces evidence you can correlate with a failed request or restart.", "The journal also records systemd lifecycle events that application logs alone may not contain."], code: { language: "bash", code: "journalctl -u steward.service --since '15 minutes ago'\njournalctl -u steward.service -f\njournalctl -b -u steward.service\nsystemctl status steward.service", caption: "Scope logs by unit, time and boot." } },
            { title: "Logs are evidence, not truth by themselves", paragraphs: ["A missing log line does not prove an event did not happen, and a logged error does not automatically identify root cause. Correlate logs with process state, permissions, network evidence and the actual request path.", "Later Reliability Engineer work will formalize structured logging and observability; here the goal is competent host-level investigation." ] },
        ],
        "Use journalctl to reconstruct one controlled Steward restart or failure from service-manager and application evidence.",
        ["Trigger a controlled restart or configuration error.", "Query the relevant time window only.", "Identify application output and systemd lifecycle messages.", "Write a short timeline of what happened.", "Restore the service and verify recovery with a real request."],
        ["Why is a time-bounded journal query better than dumping all logs?", "What evidence can systemd logs add beyond application logs?", "Why is a logged error not automatically the root cause?"],
        [journalctlMan],
    ),
    richLesson(
        "Scheduled Tasks",
        "Recurring maintenance work should be declared and observable rather than remembered by a human. Linux provides cron and systemd timers, each with different visibility and lifecycle characteristics.",
        ["Explain cron-style scheduling.", "Recognize when a systemd timer is preferable.", "Design idempotent scheduled maintenance.", "Capture output and failure evidence."],
        [
            { title: "A schedule creates an operational dependency", paragraphs: ["Once a task runs automatically, the server now depends on its timing, permissions, environment and failure handling. Jobs should use absolute paths, predictable identities and safe repeated execution.", "Never assume a scheduled job receives the same environment as an interactive shell."], code: { language: "text", code: "# Example cron intent\n0 2 * * * /usr/local/sbin/steward-maintenance >> /var/log/steward-maintenance.log 2>&1", caption: "Scheduling must include execution context and evidence." } },
            { title: "Automate only understood work", paragraphs: ["Do not schedule database deletion, backup pruning or restart loops merely because cron can run them. First define what the task does, whether it is safe to run twice, what happens on failure and how success is verified.", "For this school, a harmless housekeeping or evidence task is enough to prove the concept." ] },
        ],
        "Create a safe scheduled task related to Steward operations and prove its execution, identity and output.",
        ["Choose a harmless repeatable task such as generating a health snapshot.", "Use cron or a systemd timer and explain the choice.", "Use absolute paths and controlled output.", "Trigger or wait for one execution and capture evidence.", "Explain what would happen if the job ran twice or failed halfway."],
        ["Why are absolute paths important in scheduled jobs?", "What does idempotent mean for a recurring task?", "Why should scheduled-task output be observable?"],
        [cronMan, systemdMan],
    ),
    richLesson(
        "Storage and Mounts",
        "Server storage is more than a directory tree. Devices, partitions, filesystems and mount configuration determine where Steward and PostgreSQL state actually lives and whether that state returns after reboot.",
        ["Inspect block devices, filesystems and mount points.", "Explain persistent mounts and /etc/fstab.", "Distinguish device identity from mount path.", "Reason about capacity and recovery implications."],
        [
            { title: "A mount binds storage into the namespace", paragraphs: ["Linux exposes storage through mount points. /var/lib/postgresql may be backed by the root filesystem, a dedicated disk, a logical volume or a network filesystem even though the path looks ordinary.", "Operational decisions should therefore identify both the path and the storage backing it."], code: { language: "bash", code: "lsblk -f\nfindmnt\ndf -hT\ncat /etc/fstab", caption: "Inspect both namespace and storage identity." } },
            { title: "Persistent mounts must survive reboot", paragraphs: ["A manual mount disappears after reboot unless persistent configuration recreates it. /etc/fstab commonly declares boot-time mounts, preferably using stable identifiers such as UUIDs instead of device names that may change.", "A mount failure can prevent services from finding expected data, so verify filesystem presence before assuming an application problem." ] },
        ],
        "Map the storage backing important Steward and PostgreSQL paths and verify whether those mounts are persistent across reboot.",
        ["Record disks/filesystems with lsblk -f.", "Map important application/data paths with findmnt.", "Inspect /etc/fstab without changing it unless needed.", "Identify one path whose loss would be recoverable and one whose loss would threaten persistent data.", "Document how you would verify the mount after reboot before starting Steward."],
        ["What is the difference between a device and a mount point?", "Why are UUIDs often preferable in fstab?", "How can a missing mount appear as an application failure?"],
        [ubuntuServerGuide, fhs],
    ),
    richLesson(
        "SSH and Key Authentication",
        "Remote administration depends on a secure, reliable control path. SSH provides encrypted remote shell access, while public-key authentication avoids sending reusable passwords across routine automation and administration workflows.",
        ["Explain the public/private key model.", "Configure authorized keys safely.", "Inspect SSH host/user configuration.", "Avoid locking yourself out during hardening changes."],
        [
            { title: "Keys prove possession", paragraphs: ["The private key remains with the administrator; the server stores the corresponding public key in authorized_keys. Authentication succeeds when the client proves possession of the private key without sending it to the server.", "Private keys should be protected locally and never copied into repositories or server documentation."], code: { language: "bash", code: "ssh-keygen -t ed25519\nssh-copy-id user@server\nssh -v user@server\nss -ltnp | grep ':22'", caption: "Create, install and troubleshoot a key-based SSH path." } },
            { title: "Harden in stages", paragraphs: ["Changes such as disabling password authentication or root login can improve security, but only after key-based access is proven from a second session. Keep the current working session open while validating a new one.", "Operational security includes preserving recoverability while tightening access." ] },
        ],
        "Establish key-based SSH access to the Steward host and document a safe validation sequence before any authentication hardening.",
        ["Generate or identify a dedicated administrator key.", "Install the public key on the server.", "Prove a new key-authenticated session works.", "Inspect relevant SSH server configuration and listening socket.", "Write a lockout-safe sequence for disabling weaker authentication later."],
        ["Why does the server not need your private key?", "Why should you test a second SSH session before closing the first?", "What operational risk comes from hardening too aggressively?"],
        [sshDocs, ubuntuServerGuide],
    ),
    {
        id: "linux-administration-lab-operate-steward-api-as-a-linux-service",
        title: "Lab: Operate Steward API as a Linux Service",
        activities: [
            {
                id: "linux-administration-lab-operate-steward-api-as-a-linux-service-brief",
                title: "Turn Steward into an operated service",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab integrates the Linux Administration module. Steward must run as a deliberate Linux service with controlled identity, paths, configuration, logs, startup behavior, remote administration and recoverable failure handling.",
                    blocks: [
                        { type: "heading", id: "required-evidence", text: "Required evidence", level: 2 },
                        { type: "list", items: ["Ubuntu host baseline and package inventory", "Dedicated Steward service user and least-privilege filesystem ownership", "systemd service unit with explicit working directory, environment and restart behavior", "journalctl evidence for start, stop and one deliberate failure", "SSH key-based administrative access", "storage/mount evidence for important persistent paths", "one safe scheduled operational task"] },
                        { type: "heading", id: "failure-experiment", text: "Failure experiment", level: 2 },
                        { type: "paragraph", text: "Introduce one realistic failure such as a bad path, missing permission, invalid environment value or killed process. Diagnose it from service status, journal evidence and filesystem/process inspection. Do not immediately fix the symptom; first explain the failure chain." },
                        { type: "callout", tone: "warning", title: "Protect the host", body: "Do not use destructive cleanup, delete unknown files or modify storage blindly. Preserve local work and keep SSH recovery access while testing service failures." },
                        { type: "resources", title: "Reference material", resources: [ubuntuServerGuide, systemdMan, journalctlMan, sshDocs] },
                    ],
                },
            },
            {
                id: "linux-administration-lab-operate-steward-api-as-a-linux-service-practical",
                title: "Operate and recover Steward",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Install and operate Steward API and PostgreSQL on Ubuntu Server as managed services, then diagnose and recover one controlled failure using Linux evidence.",
                    scenario: "The development laptop is no longer the runtime model. Treat the Ubuntu host as a small production-like server that another engineer should be able to understand and operate.",
                    instructions: [
                        "Prepare the application and database dependencies on Ubuntu Server using tracked package/configuration steps.",
                        "Create a dedicated Steward service account and directory layout with least-privilege ownership.",
                        "Move runtime configuration into a protected server-side configuration path.",
                        "Create and enable a systemd unit for Steward.",
                        "Verify the service with systemctl, journalctl and a real HTTP request.",
                        "Prove key-based SSH administration from another machine/session.",
                        "Record the storage/mount backing important persistent paths.",
                        "Create one safe scheduled operational task.",
                        "Introduce one controlled failure, diagnose the chain from symptom to host-level cause, restore service and prove recovery.",
                    ],
                    deliverables: ["Linux service runbook", "systemd unit and configuration evidence", "permissions/identity evidence", "SSH and storage evidence", "failure-and-recovery timeline"],
                    completionCriteria: ["Steward runs independently of an interactive shell.", "The service runs under a dedicated non-root identity.", "Configuration and permissions are explicit and reviewable.", "Logs are sufficient to reconstruct the controlled failure.", "The learner can restart and recover Steward through documented Linux operations.", "No unknown local files or unrelated server state were destroyed during the exercise."],
                },
            },
            {
                id: "linux-administration-lab-operate-steward-api-as-a-linux-service-review",
                title: "Operational review",
                estimatedMinutes: 20,
                content: { type: "reflection", prompt: "Review the finished server as if you were handing it to another engineer. Which five facts must they know to operate Steward safely? Which part of the host is still least reproducible, and what evidence shows that? What should Networking Foundations explain next about how clients actually reach this service?" },
            },
        ],
    },
];