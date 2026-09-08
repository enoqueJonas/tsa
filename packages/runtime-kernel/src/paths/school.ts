import type { LearningPath } from "./learning-path";

export interface School {
    id: string;
    title: string;
    paths: LearningPath[];
}
