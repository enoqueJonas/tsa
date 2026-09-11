import type { LearningResource, LessonBlock, PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { linuxAdministrationDeepLessons } from "./platform-builder-linux-administration-deep";

const rockyDocs: LearningResource = { title: "Rocky Linux documentation", url: "https://docs.rockylinux.org/" };
const rhelDocs: LearningResource = { title: "Red Hat Enterprise Linux documentation", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/" };
const selinuxDocs: LearningResource = { title: "RHEL — Using SELinux", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux/" };
const firewalldDocs: LearningResource = { title: "RHEL — Configuring firewalls and packet filters", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_firewalls_and_packet_filters/" };

function replaceRockyStrings(value: string): string {
    return value
        .replaceAll("Installing Ubuntu Server", "Installing Rocky Linux")
        .replaceAll("Ubuntu Server", "Rocky Linux")
        .replaceAll("Ubuntu host", "Rocky Linux host")
        .replaceAll("Ubuntu", "Rocky Linux")
        .replaceAll("sudo apt update", "sudo dnf check-update")
        .replaceAll("apt policy postgresql", "dnf info postgresql-server")
        .replaceAll("dpkg -l | grep -E 'python|postgresql'", "rpm -qa | grep -E 'python|postgresql'")
        .replaceAll("apt show <package>", "dnf info <package>")
        .replaceAll("apt update", "dnf check-update")
        .replaceAll("apt upgrade", "dnf upgrade")
        .replaceAll("apt workflow", "DNF/RPM workflow")
        .replaceAll("apt coordinates", "DNF coordinates")
        .replaceAll("apt to query, install, update and remove packages", "DNF and RPM tooling to query, install, update and remove packages")
        .replaceAll("the package manager", "DNF/RPM tooling")
        .replaceAll("https://documentation.ubuntu.com/server/how-to/software/package-management/", "https://docs.rockylinux.org/guides/package_management/dnf_package_manager/")
        .replaceAll("https://documentation.ubuntu.com/server/", "https://docs.rockylinux.org/")
        .replaceAll("Ubuntu package management", "Rocky Linux package management")
        .replaceAll("Ubuntu Server documentation", "Rocky Linux documentation");
}

function rockyize<T>(value: T): T {
    if (typeof value === "string") return replaceRockyStrings(value) as T;
    if (Array.isArray(value)) return value.map((item) => rockyize(item)) as T;
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, rockyize(item)])) as T;
    }
    return value;
}

const practices: Record<string, PracticalContent> = {
    "Installing Rocky Linux": {
        type: "practical",
        objective: "Produce a reproducible first-boot baseline for the Rocky Linux host that will operate Steward and identify the RHEL-family conventions introduced by the platform.",
        scenario: "A second engineer must be able to rebuild the host, identify its RHEL-compatible administration model and distinguish clean-install state from later Steward configuration.",
        instructions: ["Record Rocky Linux release, kernel, hostname and architecture.", "Map disks, filesystems and mounts and note deliberate installation choices.", "Record network addresses, default route and administrator access path.", "Verify a non-root administrative account can use sudo and record the default SELinux mode and firewalld state.", "Capture a pre-Steward RPM package and systemd service baseline.", "Write a rebuild note that separates installation decisions from later application configuration and names the equivalent RHEL concepts where relevant."],
        deliverables: ["Rocky Linux first-boot baseline", "RHEL-family convention note", "Installation decision record", "Short rebuild checklist"],
        completionCriteria: ["Another engineer can identify the exact host baseline.", "SELinux and firewalld state are captured before customization.", "Installation choices with operational consequences are explicit.", "No RHEL subscription is required to complete the exercise."],
    },
    "Shell Navigation and Command Fluency": {
        type: "practical",
        objective: "Build an inspect-before-change diagnostic workflow for the Steward host using shell composition, exit status and command documentation.",
        scenario: "Steward is unhealthy and you have shell access, but restarting or editing immediately could destroy the evidence needed to understand the problem.",
        instructions: ["Choose one plausible host-level Steward symptom.", "Navigate to the relevant paths using both absolute and relative paths.", "Build a read-only evidence pipeline using at least one pipe and one redirection.", "Demonstrate success and failure exit statuses and explain what they prove.", "Use man or --help to verify one option instead of relying on memory.", "Write the exact observe -> understand -> change -> verify sequence you would follow before intervention."],
        deliverables: ["Read-only diagnostic transcript", "Exit-status evidence", "Incident shell workflow"],
        completionCriteria: ["Evidence collection does not modify service state.", "Each command has a stated diagnostic purpose.", "A change is not proposed until the observed evidence supports it."],
    },
    "Files and Directories": {
        type: "practical",
        objective: "Design Steward's host filesystem layout around distinct code, configuration, runtime and persistent-data lifecycles.",
        scenario: "A one-directory deployment works initially, but upgrades, backups and permission changes become risky because code, configuration and generated state are mixed together.",
        instructions: ["Classify current Steward host paths as code, configuration, transient runtime state, logs or persistent data.", "Propose a Linux-appropriate directory layout for each lifecycle.", "Inspect ownership, metadata, backing filesystem and symbolic links for representative paths.", "Demonstrate a safe copy/move/remove sequence on disposable data.", "Identify which paths are reproducible and which require backup or preservation.", "Document one destructive command that should require explicit path verification before use."],
        deliverables: ["Steward filesystem layout", "Path lifecycle/ownership table", "Safe file-operation evidence"],
        completionCriteria: ["Different lifecycle concerns are not mixed casually.", "Persistent or non-reproducible paths are identified.", "Deletion safety is reasoned about from recoverability, not filename alone."],
    },
    "Users and Groups": {
        type: "practical",
        objective: "Define and prove the identity boundary between human administrators and the Steward service account.",
        scenario: "Steward currently inherits access from whichever human launches it, making ownership unclear and increasing the blast radius of application compromise.",
        instructions: ["Inventory the current human, service and relevant group identities.", "Create or inspect a non-login Steward service account.", "List the minimum directories, sockets or files the service identity needs.", "Separate resources that should remain root- or database-owned.", "Use a group only where shared authority is actually required.", "Test one access that should succeed and one that should fail under the Steward identity."],
        deliverables: ["Identity and ownership map", "Minimum-access statement", "Positive and negative access evidence"],
        completionCriteria: ["Human and service identities have distinct responsibilities.", "The Steward account is not granted broad login/root privileges.", "Access boundaries are proven with real host evidence."],
    },
    "Linux Permissions": {
        type: "practical",
        objective: "Diagnose and correct one Steward permission problem using the narrowest ownership or mode change that preserves least privilege.",
        scenario: "A Steward path works for the administrator but fails for the service account. A blanket chmod 777 would hide the real boundary instead of fixing it.",
        instructions: ["Choose a safe test path needed by the Steward service.", "Inspect every parent path with namei/stat and identify the exact failing permission check.", "Predict the access result before changing anything.", "Apply the narrowest chown/chgrp/chmod change that satisfies the requirement.", "Retest as the service identity and confirm unrelated users did not gain unnecessary access.", "Record why a broader permission change was rejected."],
        deliverables: ["Permission failure trace", "Before/after ownership and mode evidence", "Least-privilege decision note"],
        completionCriteria: ["The exact failing Unix permission boundary is identified.", "The fix changes no more access than required.", "The learner does not assume Unix mode bits are the only access-control layer on a RHEL-family host."],
    },
    "Package Management": {
        type: "practical",
        objective: "Treat one Steward host package installation or update as controlled, traceable DNF/RPM change.",
        scenario: "A required host dependency must be installed or updated without turning the server into an undocumented collection of manually downloaded binaries or untracked repositories.",
        instructions: ["Identify one OS-level package Steward or its operation genuinely needs.", "Use dnf info/repolist and rpm queries to inspect candidate version, repository origin and installed state before change.", "Explain the difference between checking package metadata/available updates and actually applying upgrades.", "Install or update the package through DNF.", "Capture the final RPM version, architecture and provenance.", "Run a small Steward verification and state the rollback/recovery path if the package change caused a regression."],
        deliverables: ["DNF/RPM package change record", "Version/provenance evidence", "Post-change Steward verification"],
        completionCriteria: ["The package need is explicit.", "Version and repository origin are known.", "The learner can relate Rocky's package workflow to RHEL-family operations.", "Package-manager success is followed by application verification."],
    },
    "Processes and Signals": {
        type: "practical",
        objective: "Compare graceful and forced process termination and explain which runtime state each approach may preserve or lose.",
        scenario: "A Steward process appears stuck. An operator can send SIGTERM or SIGKILL, but the stronger signal is not automatically the safer operational choice.",
        instructions: ["Capture Steward's process hierarchy and identify lifecycle ownership.", "Perform a graceful stop through the normal control path and capture logs/process evidence.", "Use a disposable process for a forced SIGKILL experiment.", "Compare cleanup, exit visibility and parent/service-manager behavior.", "Identify when forced termination would be justified.", "State why normal service lifecycle should be controlled through systemd rather than ad-hoc PID management."],
        deliverables: ["Process-tree evidence", "Graceful-vs-forced termination comparison", "Signal-use decision note"],
        completionCriteria: ["SIGTERM and SIGKILL are not treated as interchangeable.", "The service manager/process hierarchy is considered before intervention.", "Forced termination is bounded to a safe controlled experiment."],
    },
    "systemd and Services": {
        type: "practical",
        objective: "Run Steward as a declared systemd service and prove lifecycle, identity and recovery behavior at both OS and application level.",
        scenario: "Steward runs successfully in an interactive shell but disappears when the session closes and has no declared restart, boot or identity policy.",
        instructions: ["Create or review a minimal steward.service unit with explicit User, WorkingDirectory, environment source and ExecStart.", "Reload systemd and start the service through systemctl.", "Inspect MainPID, service user and restart policy from live systemd state.", "Verify service availability with a real HTTP request rather than active status alone.", "Introduce one controlled process failure and observe systemd's configured response.", "If boot enablement is appropriate, verify the declared startup behavior."],
        deliverables: ["Reviewable systemd unit", "Lifecycle and identity evidence", "Controlled recovery evidence"],
        completionCriteria: ["Steward no longer depends on an interactive shell.", "Declared service identity matches observed runtime identity.", "Service-manager success is verified against application behavior."],
    },
    "Environment and Configuration": {
        type: "practical",
        objective: "Move Steward configuration into a controlled runtime configuration path without exposing secrets as evidence.",
        scenario: "Steward starts from the developer's shell because exported variables exist there, but the same service fails under systemd and configuration provenance is unclear.",
        instructions: ["Classify settings as code defaults, environment-specific configuration or secrets.", "Create a controlled configuration location with deliberate ownership and mode bits.", "Configure systemd to load the environment without embedding secret values in the unit.", "Restart Steward and prove configuration through non-secret behavior or metadata.", "Confirm the configuration file is not world-readable and is excluded from source control.", "Record one configuration-drift risk and how an operator would detect it."],
        deliverables: ["Configuration ownership map", "Protected runtime configuration evidence", "Non-secret verification and drift note"],
        completionCriteria: ["Interactive shell state is not required for service startup.", "Secrets are not printed or committed as proof.", "Configuration source and ownership are explicit."],
    },
    "Logs and journalctl": {
        type: "practical",
        objective: "Reconstruct one controlled Steward failure as a time-bounded operational timeline using journal and host evidence.",
        scenario: "A failed request and service restart occurred close together. Dumping all logs produces noise; the task is to determine what happened and in which order.",
        instructions: ["Introduce one safe configuration or restart failure with a known start time.", "Query journalctl by unit and a narrow time window.", "Separate application messages from systemd lifecycle events.", "Correlate the journal with one additional host observation such as process, permission, SELinux or socket state.", "Write a timestamped failure -> detection -> intervention -> recovery sequence.", "Restore Steward and verify recovery through a real request."],
        deliverables: ["Focused journal evidence", "Failure/recovery timeline", "Cross-check from a second host signal"],
        completionCriteria: ["The investigation is scoped by a question and time window.", "Logs are corroborated rather than treated as self-sufficient truth.", "Recovery is proven at application level."],
    },
    "Scheduled Tasks": {
        type: "practical",
        objective: "Create one harmless, observable and idempotent scheduled Steward maintenance task with an explicit execution context.",
        scenario: "A recurring operational check currently depends on someone remembering to run it manually, but automating an unsafe or opaque command would create a new failure path.",
        instructions: ["Choose a harmless repeatable task such as a Steward health snapshot.", "Decide between cron and a systemd timer and justify the choice.", "Declare absolute paths, execution identity and output destination.", "Run the task twice deliberately and verify repeated execution is safe.", "Capture one successful execution and the evidence an operator would inspect after failure.", "Document what should prevent overlapping or partially completed runs if that matters for the chosen task."],
        deliverables: ["Scheduled task definition", "Repeated-execution evidence", "Success/failure observability note"],
        completionCriteria: ["The task is safe to repeat.", "Its environment and identity do not depend on an interactive shell.", "An operator can determine whether the task ran successfully."],
    },
    "Storage and Mounts": {
        type: "practical",
        objective: "Map important Steward and PostgreSQL paths to their actual backing storage and define the checks required before service startup after reboot.",
        scenario: "A familiar path still exists after reboot, but the expected data volume did not mount. Starting the application now could write into the wrong filesystem and disguise the storage failure.",
        instructions: ["Use lsblk, findmnt and df to map important service/database paths to devices and filesystems.", "Inspect persistent mount declarations and stable identifiers without changing them unnecessarily.", "Classify one path as reproducible and one as persistent/non-reproducible.", "Describe the failure symptom if the expected mount is absent or read-only.", "Define a pre-start or runbook verification that proves the right storage is mounted.", "State which data belongs in backup/recovery planning and why."],
        deliverables: ["Storage-to-path map", "Persistence classification", "Post-reboot mount verification checklist"],
        completionCriteria: ["Path names are not confused with storage identity.", "Persistent-data paths have an explicit recovery concern.", "The learner can explain how a mount failure can masquerade as an application problem."],
    },
    "SSH and Key Authentication": {
        type: "practical",
        objective: "Establish key-based administrative access and design a hardening sequence that cannot silently remove the only recovery path.",
        scenario: "Password access should eventually be reduced, but changing sshd configuration before proving an independent key-authenticated session can lock the administrator out of the Steward host.",
        instructions: ["Generate or select a dedicated administrator SSH key and protect the private key locally.", "Install only the public key on the server and inspect authorized_keys ownership/permissions.", "Open a second independent key-authenticated session and keep the original session available during validation.", "Inspect the SSH listening socket and effective server configuration relevant to authentication.", "Write the staged sequence for later password/root-login hardening, including validation and rollback checkpoints.", "Record one recovery option if a future SSH configuration change fails."],
        deliverables: ["Key-authentication evidence", "Lockout-safe hardening plan", "SSH recovery note"],
        completionCriteria: ["The private key never appears on the server or in project evidence.", "A second session proves access before weaker authentication is disabled.", "Hardening preserves an explicit recovery path."],
    },
};

function supplementalLesson(
    id: string,
    title: string,
    body: string,
    blocks: LessonBlock[],
    practical: PracticalContent,
): Lesson {
    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 40, content: { type: "reading", body, blocks } },
            { id: `${id}-practice`, title: `${title}: Host Practice`, estimatedMinutes: 60, content: practical },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: `Explain the control boundary introduced by ${title}. Describe one failure symptom, the evidence you would gather before changing state, and the narrowest safe correction.` } },
        ],
    };
}

const selinuxLesson = supplementalLesson(
    "linux-administration-selinux",
    "SELinux Foundations and Troubleshooting",
    "RHEL-family systems add mandatory access control through SELinux. Unix owner/group/mode bits may permit an action while SELinux policy still denies it, so disabling SELinux is not a valid default troubleshooting technique.",
    [
        { type: "paragraph", text: "Treat SELinux as a second authorization layer with labels, domains and policy. Start from enforcement state and denial evidence, not from the assumption that SELinux is the problem." },
        { type: "heading", id: "observe-before-changing", text: "Observe before changing policy", level: 2 },
        { type: "code", language: "bash", code: "getenforce\nsestatus\nls -Z /opt/steward /etc/steward\nps -eZ | grep -E 'gunicorn|python'\nsudo ausearch -m AVC -ts recent", caption: "Inspect enforcement, labels and AVC denials before changing anything." },
        { type: "paragraph", text: "If a custom Steward path or network action is denied, determine whether the path has the wrong context, the service is operating outside its expected domain, or a narrowly justified policy adjustment is required. Prefer restorecon/semanage and correct labeling over setenforce 0." },
        { type: "callout", tone: "warning", title: "Do not solve SELinux by disabling it", body: "Permissive mode may be used briefly as a controlled diagnostic comparison, but the lab is complete only when Steward operates correctly with enforcing mode restored." },
        { type: "resources", title: "Required and supporting reading", resources: [selinuxDocs, rockyDocs, rhelDocs] },
    ],
    {
        type: "practical",
        objective: "Diagnose one controlled Steward access failure through both Unix permissions and SELinux evidence, then restore correct operation with enforcing mode retained.",
        scenario: "The Steward service has Unix permission to access a path, but a RHEL-family mandatory-access-control rule still blocks it.",
        instructions: ["Confirm enforcing mode and capture current labels for the service process and target path.", "Create or use a safe controlled labeling mismatch that produces a denial.", "Capture the AVC denial and explain which subject, target and operation were denied.", "Correct the label or narrowly justified policy configuration using RHEL-family tooling.", "Run restorecon where appropriate and retest Steward.", "Prove the final service works while SELinux remains enforcing."],
        deliverables: ["SELinux state/label evidence", "AVC denial explanation", "Corrected label/policy evidence", "Final enforcing-mode verification"],
        completionCriteria: ["SELinux is distinguished from Unix mode-bit permissions.", "A denial is diagnosed from evidence rather than guessed.", "The final solution does not depend on disabling SELinux."],
    },
);

const firewalldLesson = supplementalLesson(
    "linux-administration-firewalld",
    "firewalld and Host Network Policy",
    "Rocky Linux uses firewalld as the standard dynamic host-firewall interface. A healthy listening service should not automatically be reachable from every network; host policy should expose only the ports and sources justified by the current Steward topology.",
    [
        { type: "paragraph", text: "Separate three questions: is the process listening, does routing reach the host, and does host firewall policy permit the flow? firewalld zones provide a practical way to express trust boundaries around interfaces and sources." },
        { type: "heading", id: "evidence", text: "Inspect effective policy", level: 2 },
        { type: "code", language: "bash", code: "sudo firewall-cmd --state\nsudo firewall-cmd --get-active-zones\nsudo firewall-cmd --list-all\nss -ltnp\nsudo firewall-cmd --list-services --list-ports", caption: "Compare listening sockets with effective host-firewall exposure." },
        { type: "paragraph", text: "Open a service or port only where the topology requires it, verify both runtime and permanent configuration, and test from an allowed and a disallowed source when the lab environment permits." },
        { type: "callout", tone: "steward", title: "Networking handoff", body: "This lesson establishes host-level policy. Networking Foundations later adds subnet, routing, NAT, VPN and broader segmentation reasoning so private administration and public application traffic can follow different paths." },
        { type: "resources", title: "Required and supporting reading", resources: [firewalldDocs, rockyDocs, rhelDocs] },
    ],
    {
        type: "practical",
        objective: "Expose only the Steward port required for the current lab while keeping administrative access deliberately scoped.",
        scenario: "Steward listens correctly, but the host must not become an unrestricted set of open ports merely to make the demo work.",
        instructions: ["Record active firewalld zones, interfaces and current services/ports.", "Record Steward and SSH listening sockets with ss.", "Add the narrowest runtime rule needed for Steward reachability and test it from the intended client.", "Make the rule persistent only after the runtime test succeeds.", "Demonstrate one port or service that remains unreachable by design.", "Document which later network/VPN boundary should carry administrative traffic rather than exposing it publicly."],
        deliverables: ["Before/after firewalld evidence", "Allowed Steward reachability test", "Denied/unexposed service evidence", "Public-vs-private access note"],
        completionCriteria: ["Listening state is not confused with firewall permission.", "Only justified ports/services are opened.", "Runtime and persistent policy are distinguished.", "The design anticipates a later VPN/private-management boundary."],
    },
);

const rockyLessons = rockyize(linuxAdministrationDeepLessons).map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical" ? { ...activity, content: practical } : activity,
        ),
    };
});

export const linuxAdministrationQualityLessons: Lesson[] = rockyLessons.flatMap((lesson) => {
    if (lesson.title === "Linux Permissions") return [lesson, selinuxLesson];
    if (lesson.title === "SSH and Key Authentication") return [firewalldLesson, lesson];
    if (lesson.title !== "Lab: Operate Steward API as a Linux Service") return [lesson];

    return [{
        ...lesson,
        title: "Lab: Operate Steward API as a Rocky Linux Service",
        activities: lesson.activities.map((activity) => {
            if (activity.content.type === "reading") {
                return {
                    ...activity,
                    content: rockyize({
                        ...activity.content,
                        body: `${activity.content.body} The final host must keep SELinux enforcing and use firewalld to expose only justified network access.`,
                    }),
                };
            }
            if (activity.content.type === "practical") {
                return {
                    ...activity,
                    content: {
                        ...rockyize(activity.content),
                        instructions: [
                            ...rockyize(activity.content.instructions),
                            "Prove SELinux remains enforcing; diagnose and correct any policy/label issue rather than disabling it.",
                            "Configure firewalld so Steward is reachable only through the justified service path while unnecessary ports remain closed.",
                        ],
                        deliverables: [...rockyize(activity.content.deliverables), "SELinux enforcing evidence", "firewalld exposure evidence"],
                        completionCriteria: [...rockyize(activity.content.completionCriteria), "Steward operates with SELinux enforcing.", "Host firewall policy exposes only justified services."],
                    },
                };
            }
            return rockyize(activity);
        }),
    }];
});
