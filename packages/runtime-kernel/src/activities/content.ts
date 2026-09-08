export interface LearningResource {
    title: string;
    url: string;
}

export interface ReadingContent {
    type: "reading";
    body: string;
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

export type ActivityContent =
    | ReadingContent
    | ReflectionContent
    | PracticalContent;