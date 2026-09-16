import type { Activity } from "../activities";

export interface Lesson {
    id: string;
    title: string;
    summary?: string;
    objectives?: string[];
    activities: Activity[];
}
