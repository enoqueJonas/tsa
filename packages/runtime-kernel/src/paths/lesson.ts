import type { Activity } from "../activities";

/** Curriculum authoring input. The assembled academy journey normalizes compact
 * activities into canonical `Activity` objects before the UI/runtime consumes it. */
export interface Lesson {
    id: string;
    title: string;
    summary?: string;
    objectives?: string[];
    activities: Activity[] | any[];
}
