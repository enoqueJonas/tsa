import {
    tradeOffsBrief,
    tradeOffsReflection,
} from "../activities";
import type { Lesson } from "./lesson";

export const tradeOffs: Lesson = {
    id: "trade-offs",
    title: "Trade-offs",
    activities: [
        tradeOffsBrief,
        tradeOffsReflection,
    ],
};
