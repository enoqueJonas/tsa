import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const nfsDocs: LearningResource = { title: "Red Hat — Deploying an NFS server", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/deploying-an-nfs-server_managing-file-systems" };
const sambaDocs: LearningResource = { title: "Samba documentation", url: "https://www.samba.org/samba/docs/" };
const openLdapAdmin: LearningResource = { title: "OpenLDAP Administrator's Guide", url: "https://www.openldap.org/doc/admin26/" };
const keycloakFederation: LearningResource = { title: "Keycloak — User storage federation", url: "https://www.keycloak.org/docs/latest/server_admin/#_user-storage-federation" };

function practicalLesson(id: string, title: string, intro: string, objective: string, scenario: string, instructions: string[], deliverables: string[], completionCriteria: string[], resources: LearningResource[], foundations: { title: string; paragraphs: string[] }[] = []): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: intro },
        ...foundations.flatMap((section): LessonBlock[] => [
            { type: "heading", id: `${id}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, text: section.title, level: 2 },
            ...section.paragraphs.map((text): LessonBlock => ({ type: "paragraph", text })),
        ]),
        { type: "callout", tone: "steward", title: "Enterprise homelab rule", body: "This is infrastructure for a Steward requirement, not an isolated product demo. Preserve ownership, network, security, failure and recovery evidence so later schools can evolve the same capability." },
        { type: "resources", title: "Continue learning", resources },
    ];
    return {
        id,
        title,
        activities: [
            { id: `${id}-001`, title, estimatedMinutes: 45, content: { type: "reading", body: intro, blocks } },
            { id: `${id}-002`, title: `Implement: ${title}`, estimatedMinutes: 180, content: { type: "practical", objective, scenario, instructions, deliverables, completionCriteria } },
        ],
    };
}

const fileServices = practicalLesson(
    "platform-enterprise-file-services",
    "Enterprise File Services: NFS and SMB",
    "Enterprise platforms frequently exchange or share files across hosts. A mounted network filesystem has different authority, permission, consistency and failure semantics from PostgreSQL, Nexus, object storage or a local application directory.",
    "Add real network file services to the TSA homelab and prove that Steward workloads can use them safely.",
    "A legacy governance/reporting integration needs a shared exchange area that survives application restarts and is reachable from more than one host. Build NFS as the primary Linux shared-filesystem implementation, then run a bounded Samba/SMB interoperability exercise rather than permanently duplicating every share.",
    [
        "Provision a dedicated learner-owned file-service host or VM and record its network/storage boundary.",
        "Create an NFS export for a bounded Steward exchange use case and mount it from at least two appropriate homelab clients.",
        "Configure ownership, UID/GID behavior, read/write boundaries and persistent mounting deliberately; prove both allowed and denied operations.",
        "Exercise a safe producer/consumer handoff using a temporary filename followed by atomic rename so consumers do not process a partially written file.",
        "Stop or isolate the NFS server while a client depends on it. Observe mount/application behavior, recover the service and document what the client must do safely.",
        "Inspect capacity and inode usage and define retention/cleanup expectations for the exchange area.",
        "Configure one bounded Samba/SMB share, authenticate from a separate client, prove read/write restrictions and compare identity/permission semantics with NFS.",
        "Decide which protocol remains the primary Steward homelab file service and remove or clearly bound the comparison share when the exercise ends.",
    ],
    ["NFS server/export configuration", "Client mount and permission evidence", "Atomic handoff evidence", "File-service outage/recovery record", "Samba/SMB interoperability evidence", "NFS-versus-SMB decision note"],
    ["NFS is actually served and consumed across the network.", "Permissions and identity behavior are demonstrated rather than assumed.", "A partial-file hazard and a server-unavailable condition are exercised.", "SMB is implemented as a bounded interoperability exercise rather than unexplained permanent duplication.", "The learner can distinguish shared file storage from Nexus, PostgreSQL and later object storage."],
    [nfsDocs, sambaDocs],
    [
        { title: "Network filesystems extend filesystem semantics across a failure boundary", paragraphs: ["A client path can look like an ordinary directory while every operation depends on network reachability, server availability and protocol state. Local process success therefore does not imply the backing filesystem is reachable or durable.", "NFS clients may block/retry during outages depending on mount options and protocol behavior. Choose timeout/retry/mount semantics from the workload rather than copying options blindly; unsafe recovery actions can turn temporary unavailability into application/data problems."] },
        { title: "Identity and authorization cross machines", paragraphs: ["NFS commonly reasons about numeric UID/GID identities plus export and filesystem policy. Matching usernames on two machines does not guarantee matching numeric identity. SMB typically adds authenticated session/share semantics and can integrate with directory identity.", "Effective access is the intersection of protocol/export/share policy and backing filesystem permissions. Diagnose both layers before widening permissions."] },
        { title: "Shared files need a publication protocol", paragraphs: ["A consumer that sees a filename while the producer is still writing can process incomplete data. A common same-filesystem pattern writes to a temporary name, flushes/closes the file and atomically renames it into the agreed ready name.", "Atomic rename protects the publication step, not the entire business workflow. Consumers still need duplicate/replay rules and retention/ownership policy."] },
    ],
);

const directoryFoundations = practicalLesson(
    "platform-enterprise-directory-services",
    "Enterprise Directory Services: LDAP",
    "LDAP is both a protocol and a directory-oriented way of organizing/querying identity data. Enterprise identity integration requires understanding distinguished names, entries, attributes, object classes, groups, bind/search behavior and trust boundaries rather than treating a directory as a flat user table.",
    "Operate LDAP as a directory-protocol interoperability boundary and prepare a directory source for later Keycloak federation without creating two competing permanent workforce authorities.",
    "The preceding Windows path already established a synthetic AD DS domain, which exposes LDAP-compatible directory semantics alongside Kerberos and AD-integrated DNS. Use that environment to understand enterprise directory integration, and run a bounded OpenLDAP implementation only where it adds protocol/schema/administration contrast. For each federation scenario, name exactly one authoritative workforce directory; Steward retains its own application authorization model.",
    [
        "Inspect the existing synthetic AD directory through LDAP-aware tooling, then deploy a bounded OpenLDAP service only as the Linux/open-standard comparison implementation with a documented DNS name, persistence boundary and administrative recovery path; do not present both as simultaneous authoritative workforce sources.",
        "Design a small directory information tree with people, groups and service/bind-account areas; explain DN and RDN choices.",
        "Populate synthetic users and engineering groups through LDIF or equivalent repeatable administration and inspect the object classes/attributes used.",
        "Perform authenticated binds and searches using explicit base DN, scope and filters. Capture successful and failed examples without exposing credentials.",
        "Create a least-privilege bind/service account intended for federation reads instead of using the directory administrator.",
        "Protect directory traffic with TLS/StartTLS or the supported secure mechanism for the chosen implementation and validate certificate/trust behavior.",
        "Deliberately test an invalid bind credential, wrong base DN/filter, unavailable directory and broken certificate/trust condition; record diagnosis and recovery.",
        "Compare the already-operated AD DS boundary with OpenLDAP: directory tree/schema, LDAP bind/search, groups, authentication integration, DNS/time dependencies and operational ownership. State which directory is authoritative in each exercise and which one is deliberately only the comparison/interoperability target."
    ],
    ["LDAP homelab topology", "Repeatable directory bootstrap/LDIF", "Synthetic people/groups evidence", "Least-privilege bind account evidence", "Secure LDAP evidence", "Failure investigation record", "AD/LDAP/Kerberos concept map"],
    ["A real directory service is running and queryable from another homelab component.", "The learner can explain DN/RDN, attributes, object classes, groups, bind and search filters from the implemented directory.", "Federation access does not require the directory administrator identity.", "Directory transport and trust are protected and tested.", "At least three distinct directory failure modes are reproduced and diagnosed.", "The existing AD DS and bounded OpenLDAP environments have explicit non-competing roles, and the learner can explain which directory is authoritative for a given federation scenario."],
    [openLdapAdmin, keycloakFederation],
    [
        { title: "A directory is a hierarchical typed data model", paragraphs: ["An LDAP entry is identified by a distinguished name (DN) composed from relative distinguished names (RDNs) along the directory tree. Entries contain attributes constrained by object classes/schema. The DN is identity/location in the directory namespace; a display name or login attribute is not automatically the DN.", "Design the tree around administrative/search boundaries rather than reproducing an organizational chart mechanically. Moving/renaming entries can change DNs and therefore affects clients that incorrectly treat DNs as permanent application identifiers."] },
        { title: "Bind establishes identity; search retrieves entries", paragraphs: ["A client commonly binds using an identity/credential, then searches from a base DN with a scope and filter. Base, one-level and subtree searches have different reach. LDAP filters are structured expressions; broad or malformed filters can return the wrong population or create unnecessary directory load.", "A service account used for federation should have only the directory read/search rights it needs. Authentication success does not imply authorization to read every attribute or subtree."] },
        { title: "LDAP transport security and directory authentication are separate", paragraphs: ["A successful bind over plaintext LDAP can still expose credentials/data to the network. LDAPS or StartTLS establishes protected transport when configured with validated certificates and trust. Do not disable certificate validation merely to make federation connect.", "AD DS can expose LDAP directory access while Kerberos handles ticket-based domain authentication; these are related enterprise identity capabilities, not interchangeable names for the same protocol."] },
        { title: "Schema and group semantics are integration contracts", paragraphs: ["Federation code depends on attribute names, identifiers, group representation and membership semantics. AD and OpenLDAP can model these differently even though both speak LDAP. Map only the attributes/groups the application needs and document the authoritative source.", "Treat schema changes like external contract changes: test representative users, nested/group cases where relevant, missing attributes and disabled/removed identities before rollout."] },
    ],
);

export const enterpriseFileAndDirectoryServicesDeepLessons: Lesson[] = [fileServices, directoryFoundations];
