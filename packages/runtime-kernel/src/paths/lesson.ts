import type { Activity } from "../activities";

export interface Lesson {
    id: string;
    title: string;
    activities: Activity[];
}