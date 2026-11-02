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
        { title: "Worked LDAP query and trust-boundary walkthrough", paragraphs: ["Consider a synthetic account uid=steward-reader,ou=people,dc=tsa,dc=lab. The distinguished name identifies its place in the directory; uid is an attribute and does not grant privileges by itself. Start with a read-only service bind over a certificate-validated LDAP connection and search from ou=people,dc=tsa,dc=lab using an exact filter for uid=steward-reader. Record the base DN, search scope, filter, expected entry attributes and the actual response. A successful bind only proves authentication; repeat a restricted search that should be denied to demonstrate authorization.", "Now change one variable in a disposable environment: wrong base DN, invalid bind credential or untrusted TLS certificate. Record the distinct error and restore the known-good configuration. Do not skip certificate verification or grant directory administrator rights to resolve a federation error."] },
        { title: "A directory is a hierarchical typed data model", paragraphs: ["An LDAP entry is identified by a distinguished name (DN) composed from relative distinguished names (RDNs) along the directory tree. Entries contain attributes constrained by object classes/schema. The DN is identity/location in the directory namespace; a display name or login attribute is not automatically the DN.", "Design the tree around administrative/search boundaries rather than reproducing an organizational chart mechanically. Moving/renaming entries can change DNs and therefore affects clients that incorrectly treat DNs as permanent application identifiers."] },
        { title: "Bind establishes identity; search retrieves entries", paragraphs: ["A client commonly binds using an identity/credential, then searches from a base DN with a scope and filter. Base, one-level and subtree searches have different reach. LDAP filters are structured expressions; broad or malformed filters can return the wrong population or create unnecessary directory load.", "A service account used for federation should have only the directory read/search rights it needs. Authentication success does not imply authorization to read every attribute or subtree."] },
        { title: "LDAP transport security and directory authentication are separate", paragraphs: ["A successful bind over plaintext LDAP can still expose credentials/data to the network. LDAPS or StartTLS establishes protected transport when configured with validated certificates and trust. Do not disable certificate validation merely to make federation connect.", "AD DS can expose LDAP directory access while Kerberos handles ticket-based domain authentication; these are related enterprise identity capabilities, not interchangeable names for the same protocol."] },
        { title: "Schema and group semantics are integration contracts", paragraphs: ["Federation code depends on attribute names, identifiers, group representation and membership semantics. AD and OpenLDAP can model these differently even though both speak LDAP. Map only the attributes/groups the application needs and document the authoritative source.", "Treat schema changes like external contract changes: test representative users, nested/group cases where relevant, missing attributes and disabled/removed identities before rollout."] },
    ],
);


// PED-005: original lesson identities survive, but the two mega-labs are split
// so an NFS or LDAP novice does not have to implement two protocols at once.
function narrowFirstProtocolLesson(lesson: Lesson, excluded: RegExp, title: string): Lesson {
    return {
        ...lesson,
        title,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical") return activity;
            return {
                ...activity,
                content: {
                    ...activity.content,
                    instructions: activity.content.instructions.filter((line) => !excluded.test(line)),
                    deliverables: activity.content.deliverables.filter((line) => !excluded.test(line)),
                    completionCriteria: activity.content.completionCriteria.filter((line) => !excluded.test(line)),
                },
            };
        }),
    };
}

const nfsFirst = narrowFirstProtocolLesson(fileServices, /Samba|SMB|which protocol remains/, "Enterprise File Services: NFS and Atomic Handoff");
const ldapFirst = narrowFirstProtocolLesson(directoryFoundations, /OpenLDAP|both.*directories|existing AD DS and bounded/, "LDAP Directory Protocol: Bind, Search and TLS");

const smbInterop = practicalLesson(
    "platform-enterprise-smb-interoperability",
    "Samba/SMB: Cross-Client Authorization and Recovery",
    "SMB and NFS are distinct network file protocols; a successful mount is not evidence that a specific client identity can read or write the intended file. Learn NFS first, then compare SMB's authenticated session, share-level permission and backing filesystem access.",
    "Prove a bounded SMB share's permitted and denied operations separately from the already operational NFS exchange.",
    "A synthetic Windows client must consume a Steward-generated report. Avoid making a second permanent source of truth without a justified cross-platform requirement.",
    [
        "Reuse the NFS exchange evidence, then create a synthetic Samba share on a disposable server, documenting its owner and client boundary.",
        "Identify an allowed and denied client identity; map share-level authorization separately from backing filesystem permissions.",
        "Read and write a disposable report from a separate authorized client; repeat a denied write and denied identity using actual client evidence.",
        "Exercise temporary-to-final-name publication in a single share and identify where replay still needs a separate ledger or checksum.",
        "Interrupt the SMB service in an isolated environment; recover and prove a client request again rather than relying on server status.",
        "Compare identity mapping, permissions, interoperability and operational cost against NFS, then retire the comparison share or justify its bounded ownership."
    ],
    ["Synthetic share/ACL map", "Allowed and denied client operations", "Publish and failure/recovery evidence", "NFS-versus-SMB decision"],
    ["Share ACL, session identity and backing filesystem permissions are not conflated.",
     "Allowed and denied behavior is tested from a second client with synthetic data.",
     "Publication is not mislabeled exactly-once processing.",
     "Recovery is proven from a file operation and the duplicate share is not retained without justification."],
    [sambaDocs,nfsDocs],
    [
        {title:"A permitted SMB session can still be denied by the file",paragraphs:[
            "SMB authenticates a session principal and checks share-level policy, then the server applies backing filesystem rights. A session can connect and list the share but fail a write because file or directory permissions deny it. By contrast, a simple NFS setup may depend on export policy and mapped numeric UID/GID. A shared username string does not establish identical authority across those implementations.",
            "Before changing an ACL, identify the actual authenticated identity, requested operation, share permissions and filesystem owner/mode/ACL. A wide-open guest share or chmod 777 may hide the real cause while expanding access. Test an allowed read, a denied write and a wrong principal independently in a disposable share."
        ]},
        {title:"Service health is not client recovery",paragraphs:[
            "A healthy Samba daemon does not prove a client can authenticate, route to the host, enter the share or read the specific report. Check the client operation after an outage and preserve the original file/checksum. A temporary publication name renamed on the same share is a useful readiness boundary but cannot ensure one-time downstream business processing.",
            "Decide whether adding SMB actually solves an interoperability constraint. An extra network protocol can increase credential, patching and backup burden. Keep NFS as the primary Linux exchange until a concrete client requirement supports an additional SMB boundary."
        ]}
    ]
);

const ldapCompare = practicalLesson(
    "platform-enterprise-openldap-ad-interoperability",
    "OpenLDAP versus AD: Schema and Federation",
    "LDAP bind/search is a protocol shared by directories that can still differ in DN tree, schema, group representation and source-of-truth policy. Master LDAP basics in the previous lesson before creating another directory.",
    "Implement a synthetic OpenLDAP comparison and show why directory bind success does not prove trustworthy group-to-role mapping.",
    "A synthetic AD DS domain is already available in the prior Windows module. Compare it with OpenLDAP without creating two live workforce authorities.",
    [
        "Document the existing synthetic AD authority; allocate a different, test-only namespace for an OpenLDAP comparison.",
        "Deploy bounded OpenLDAP on a disposable host with recovery/retirement plan and synthetic LDIF entries, users and groups.",
        "Compare DN/RDN, entry object classes, search base/scope, group and member attributes with AD examples.",
        "Bind with a minimally authorized service account using certificate-validated TLS; prove an allowed and denied search.",
        "Exercise invalid credential, wrong base DN and untrusted certificate separately; record each result without disabling TLS verification.",
        "Build a client mapping for authoritative identifier, login, group membership and disabled user; determine whether one schema wrongly grants a Steward role.",
        "Decide the sole authoritative workforce directory for the scenario and shut down or isolate the comparison server."
    ],
    ["Synthetic directory/LDIF evidence", "AD/OpenLDAP mapping", "Allowed and denied LDAP queries", "TLS and schema negative tests", "Authority decision"],
    ["A successful bind is not equated with permitted search or application administrator rights.",
     "Group and disabled-user semantics are mapped explicitly, not guessed from equal display names.",
     "Broken TLS trust is distinct from invalid credentials and cannot be repaired by removing certificate checks.",
     "The comparison remains synthetic and does not add another production identity authority."],
    [openLdapAdmin,keycloakFederation],
    [
        {title:"Same LDAP verbs, different identity and group semantics",paragraphs:[
            "An LDAP DN locates an entry within a directory tree, but application federation often needs a stable identifier and a group membership representation. AD may publish groups with member and memberOf links, while selected OpenLDAP schemas may represent membership with memberUid or member. An LDAP client that assumes all servers have identical attributes can silently lose authorization groups or interpret a missing field as a privilege.",
            "Capture a mapping for base DN, identifier, login, group attribute and disabled-user rule for each provider. Never infer that a successful bind means a user should be an application administrator. Preserve one nominated source of truth instead of merging unrelated directories by login name."
        ]},
        {title:"Separate trust failure, search denial and role denial",paragraphs:[
            "The client first establishes a trusted TLS connection, then authenticates its bind identity and performs a search limited by directory ACLs. Failure at one boundary does not imply failure in the others. A valid read-only bind may still be denied sensitive attributes or subtrees; the resulting user may still lack an application role.",
            "Diagnose wrong server certificate, invalid bind secret, wrong base/filter and intentionally unauthorized group independently. Keep trusted certificates enforced, use synthetic accounts, and verify a negative app authorization outcome even when directory authentication succeeded."
        ]}
    ]
);

export const enterpriseFileAndDirectoryServicesDeepLessons: Lesson[] = [nfsFirst, smbInterop, ldapFirst, ldapCompare];
