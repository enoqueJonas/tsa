// Client-side anti-blank-click gate for Cloud milestone PRACTICALS only.
// This is SELF-ATTESTED completeness, not external verification of a link,
// remote command, reviewer identity, system behavior or learning competence.
export interface CloudMilestoneEvidenceDraft {
  submissionStatus?: "draft" | "ready" | "accepted";
  notes: string;
  outcome: string;
  links: string[];
}
export function hasSavedCloudMilestoneEvidence(
  record: CloudMilestoneEvidenceDraft | undefined,
): boolean {
  if (!record || record.submissionStatus !== "accepted") return false;
  if (record.notes.trim().length < 120 || record.outcome.trim().length < 100) {
    return false;
  }
  return record.links.some((value) => {
    try {
      const link = new URL(value);
      const host = link.hostname.toLowerCase();
      return link.protocol === "https:" &&
        !!host && !["localhost", "example.com", "www.example.com",
          "example.invalid", "127.0.0.1", "0.0.0.0"].includes(host) &&
        !host.endsWith(".invalid");
    } catch {
      return false;
    }
  });
}
