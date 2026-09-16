import type { Activity } from "../activities";

/** Compact curriculum activity accepted by path authoring files before the
 * assembled academy journey normalizes it into a canonical `Activity`.
 *
 * Deep curriculum modules intentionally use a lighter authoring shape such as
 * `{ type, title, description }` or practical fields directly on the object.
 * Keeping that shape distinct from the runtime `Activity` prevents TypeScript
 * from contextually treating compact objects as already-normalized activities.
 */
export type CompactActivity = Record<string, unknown> & {
    type: string;
    title: string;
};

/** Curriculum authoring input. The assembled academy journey normalizes compact
 * activities into canonical `Activity` objects before the UI/runtime consumes it. */
export interface Lesson {
    id: string;
    title: string;
    summary?: string;
    objectives?: string[];
    activities: Array<Activity | CompactActivity>;
}
