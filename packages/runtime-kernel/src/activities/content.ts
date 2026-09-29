export type LearningResourceKind = "article" | "documentation" | "video" | "course" | "reference";

export interface LearningResource {
    title: string;
    url: string;
    /** Lets the learner distinguish watch/read/reference material before opening it. */
    kind?: LearningResourceKind;
    /** Exact chapter, section, heading, page range, timestamp or segment to consume. */
    read?: string;
    /** Why this particular slice of the source matters for the lesson. */
    purpose?: string;
    /** Marks the small number of resources the learner should consume before continuing. */
    recommended?: boolean;
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
