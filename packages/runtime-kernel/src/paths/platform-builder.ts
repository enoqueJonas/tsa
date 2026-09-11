import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { budgetHomelabDeepLessons } from "./platform-builder-budget-homelab-deep";
import { computerAndOsFoundationsQualityLessons } from "./platform-builder-computer-os-quality";
import { linuxAdministrationQualityLessons } from "./platform-builder-linux-administration-quality";
import { stewardHomelabV1DeepLessons } from "./platform-builder-milestone-deep";
import { networkingFoundationsDeepLessons } from "./platform-builder-networking-deep";
import { virtualizationDeepLessons } from "./platform-builder-virtualization-deep";

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const computerAndOsFoundations = path("computer-and-os-foundations", "Computer and Operating-System Foundations", computerAndOsFoundationsQualityLessons);
export const linuxAdministration = path("linux-administration", "Linux Administration", linuxAdministrationQualityLessons);
export const networkingFoundations = path("networking-foundations", "Networking Foundations", networkingFoundationsDeepLessons);
export const virtualization = path("virtualization", "Virtualization", virtualizationDeepLessons);
export const budgetHomelab = path("budget-homelab", "Building the Budget Homelab", budgetHomelabDeepLessons);
export const stewardHomelabV1 = path("steward-homelab-v1", "Platform Builder Milestone", stewardHomelabV1DeepLessons);

export const platformBuilderPaths: LearningPath[] = [
    computerAndOsFoundations,
    linuxAdministration,
    networkingFoundations,
    virtualization,
    budgetHomelab,
    stewardHomelabV1,
];
