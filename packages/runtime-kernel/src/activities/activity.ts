import type { ActivityContent } from "./content";

export interface Activity {
    id: string;
    title: string;
    estimatedMinutes: number;
    content: ActivityContent;
}