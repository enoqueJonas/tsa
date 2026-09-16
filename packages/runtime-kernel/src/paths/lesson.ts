import type { Activity } from "../activities";

/**
 * Compact curriculum authoring shape used by the deep-path modules.
 * It is normalized into the runtime Activity contract before the journey is consumed.
 */
export type CompactActivity = Record<string, unknown> & {
    type: string;
    title: string;
};

export type AuthoredActivity = Activity | CompactActivity;

export interface Lesson {
    id: string;
    title: string;
    summary?: string;
    objectives?: string[];
    activities: AuthoredActivity[];
}
