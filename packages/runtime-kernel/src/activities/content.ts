export interface LearningResource {
    title: string;
    url: string;
}

export type LessonBlock =
    | { type: "heading"; id: string; text: string; level?: 2 | 3 }
    | { type: "paragraph"; text: string }
    | { type: "code"; language: string; code: string; caption?: string }
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
