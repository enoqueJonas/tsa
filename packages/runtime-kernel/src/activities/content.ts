export interface ReadingContent {
    type: "reading";
    body: string;
}

export interface ReflectionContent {
    type: "reflection";
    prompt: string;
}

export type ActivityContent =
    | ReadingContent
    | ReflectionContent;