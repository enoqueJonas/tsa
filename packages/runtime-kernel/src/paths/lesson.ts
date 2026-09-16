import type { Activity } from "../activities";

/**
 * Curriculum source files are authoring inputs. Older/deep-remediation paths may
 * use the compact authoring shape and are normalized at the academy-journey
 * boundary before the UI/runtime consumes them.
 *
 * Keep `Activity` imported here as the canonical target/documentation type.
 * The final journey is validated and normalized into that shape.
 */
export interface Lesson {
    id: string;
    title: string;
    activities: Activity[] | any[];
}
