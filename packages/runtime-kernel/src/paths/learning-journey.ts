import type { School } from "./school";

export interface LearningJourney {
    id: string;
    title: string;
    schools: School[];
}
