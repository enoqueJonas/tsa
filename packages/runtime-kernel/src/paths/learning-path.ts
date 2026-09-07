import type { Lesson } from "./lesson";

export interface LearningPath {
    id: string;
    title: string;
    lessons: Lesson[];
}