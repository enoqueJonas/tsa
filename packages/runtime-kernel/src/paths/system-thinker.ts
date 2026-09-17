import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { requirementsAndProblemFramingQualityLessons } from "./system-thinker-requirements-quality";
import { systemBoundariesAndContextQualityLessons } from "./system-thinker-boundaries-quality";
import { modelingSoftwareSystemsQualityLessons } from "./system-thinker-modeling-quality";
import { componentsAndDependenciesQualityLessons } from "./system-thinker-components-quality";
import { dataFlowAndIntegrationQualityLessons } from "./system-thinker-data-flow-quality";
import { soapXmlEnterpriseIntegrationDeepLessons } from "./system-thinker-soap-xml-deep";
import { distributedStateAndMessagingDeepLessons } from "./system-thinker-distributed-state-messaging-deep";
import { failureModesQualityLessons } from "./system-thinker-failure-quality";
import { architectureDecisionsAndTradeOffsQualityLessons } from "./system-thinker-architecture-decisions-quality";
import { stewardApiSystemDesignPortfolioDeep } from "./system-thinker-milestone-deep";

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const requirementsAndProblemFraming = path("requirements-and-problem-framing", "Requirements and Problem Framing", requirementsAndProblemFramingQualityLessons);
export const systemBoundariesAndContext = path("system-boundaries-and-context", "System Boundaries and Context", systemBoundariesAndContextQualityLessons);
export const modelingSoftwareSystems = path("modeling-software-systems", "Modeling Software Systems", modelingSoftwareSystemsQualityLessons);
export const componentsAndDependencies = path("components-and-dependencies", "Components and Dependencies", componentsAndDependenciesQualityLessons);
export const dataFlowAndIntegration = path("data-flow-and-integration", "Data Flow and Integration", dataFlowAndIntegrationQualityLessons);
export const soapXmlEnterpriseIntegration = path("soap-xml-enterprise-integration", "SOAP and XML Enterprise Integration", soapXmlEnterpriseIntegrationDeepLessons);
export const distributedStateAndMessaging = path("distributed-state-and-messaging", "Distributed State and Messaging", distributedStateAndMessagingDeepLessons);
export const failureModes = path("failure-modes", "Failure Modes", failureModesQualityLessons);
export const architectureDecisionsAndTradeOffs = path("architecture-decisions", "Architecture Decisions and Trade-offs", architectureDecisionsAndTradeOffsQualityLessons);
export const stewardApiSystemDesignPortfolio = stewardApiSystemDesignPortfolioDeep;

// SOAP/XML follows general integration-contract reasoning so the learner first
// understands boundaries and semantics, then implements a concrete enterprise
// protocol. Distributed messaging follows afterward as a different interaction
// model; general failure analysis and architecture decisions then reassess both.
export const systemThinkerPaths: LearningPath[] = [
    requirementsAndProblemFraming,
    systemBoundariesAndContext,
    modelingSoftwareSystems,
    componentsAndDependencies,
    dataFlowAndIntegration,
    soapXmlEnterpriseIntegration,
    distributedStateAndMessaging,
    failureModes,
    architectureDecisionsAndTradeOffs,
    stewardApiSystemDesignPortfolio,
];
