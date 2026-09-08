export interface LearningResource {
    title: string;
    url: string;
}

export interface ReadingContent {
    type: "reading";
    body: string;
    resources?: LearningResource[];
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