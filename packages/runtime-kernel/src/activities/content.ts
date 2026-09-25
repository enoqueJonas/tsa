export interface LearningResource {
    title: string;
    url: string;
    /** Exact chapter, section, heading or page range the learner should read. */
    read?: string;
    /** Why this particular slice of the source matters for the lesson. */
    purpose?: string;
    /** How the learner should consume the resource. Defaults to reading for legacy resources. */
    kind?: "reading" | "video" | "interactive" | "reference";
    /** Exact timestamp range for long-form video/audio, for example "12:40–27:15". */
    watch?: string;
}

export type LessonBlock =
    | { type: "heading"; id: string; text: string; level?: 2 | 3 }
    | { type: "paragraph"; text: string }
    | { type: "code"; language: string; code: string; caption?: string | undefined; output?: string | undefined }
    | { type: "list"; items: string[]; ordered?: boolean }
    | { type: "callout"; tone: "note" | "warning" | "steward"; title: string; body: string }
    | { type: "resources"; title?: string; resources: LearningResource[] };

export interface ReadingContent {
    type: "reading";
    body: string;
    resources?: LearningResource[];
    blocks?: LessonBlock[] | undefined;
}

export interface ReflectionContent {
    type: "reflection";
    prompt: string;
    minimumCharacters?: number | undefined;
}

export interface PracticalContent {
    type: "practical";
    objective: string;
    scenario: string;
    instructions: string[];
    deliverables: string[];
    completionCriteria: string[];
    resources?: LearningResource[];
}

export type ActivityContent = ReadingContent | ReflectionContent | PracticalContent;
