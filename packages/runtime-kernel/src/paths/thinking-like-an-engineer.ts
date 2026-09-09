import type { Lesson } from "./lesson";

export const thinkingLikeAnEngineer: Lesson = {
    id: "thinking-like-an-engineer",
    title: "Thinking Like an Engineer",
    activities: [
        {
            id: "thinking-like-an-engineer-001",
            title: "What You Are Learning to Do",
            estimatedMinutes: 6,
            content: {
                type: "reading",
                body: `By the end of this lesson, you should be able to:

- distinguish programming activity from broader software-engineering responsibility;
- turn a vague request into a clearer engineering problem;
- identify stakeholders, constraints, unknowns, risks and evidence before proposing a solution;
- explain why a technically working answer can still be a weak engineering answer;
- make an initial recommendation while being explicit about uncertainty and what you would verify next.

TSA begins here deliberately. Tools change. Frameworks change. The habit of understanding the problem before committing to a solution is useful in every later school—from building Steward API to operating infrastructure, investigating incidents, reviewing architecture and governing technology risk.`,
            },
        },
        {
            id: "thinking-like-an-engineer-002",
            title: "Engineering Is More Than Producing Code",
            estimatedMinutes: 18,
            content: {
                type: "reading",
                body: `Programming answers an important question: **How can I make the computer perform this behavior?** Engineering has to answer a larger set of questions.

**What problem are we actually solving?** A request such as “add caching,” “move this to microservices,” or “make the API faster” already contains a proposed solution. An engineer does not reject the request automatically, but separates the underlying need from the suggested implementation. What is slow? For whom? Under what workload? What evidence shows the current system is inadequate? What outcome would count as success?

**What constraints shape the solution?** Real systems exist inside limits: time, money, skills, compatibility, regulation, operational capacity, security expectations, reliability targets and existing architecture. Constraints are not annoyances that disappear when the code is elegant. They are part of the problem definition.

**What changes over time?** A program can work today and still become expensive to maintain, unsafe to change or impossible for a team to operate. Software engineering therefore cares about the life of the system: how it evolves, how people understand it, how changes are reviewed, how failures are diagnosed and how decisions age.

**What are the trade-offs?** Engineering rarely provides a universally best solution. A choice can improve latency while increasing complexity, reduce infrastructure cost while weakening availability, or speed delivery while creating future maintenance work. Strong engineers make these tensions visible rather than pretending they do not exist.

**What evidence supports the decision?** Confidence should be earned. Logs, measurements, experiments, documentation, user observations, tests and reproducible behavior are stronger foundations than “I think” or “this is best practice.” Evidence can still be incomplete, so an engineer also states what remains uncertain.

A useful TSA mental model is:

**Problem → Context → Constraints → Unknowns → Options → Evidence → Trade-offs → Decision → Feedback**

This is not a rigid process. It is a reminder not to jump directly from a request to implementation. Later schools will add more specialized methods, but the reasoning loop remains the same.`,
                resources: [
                    {
                        title: "Software Engineering at Google — Chapter 1: What Is Software Engineering?",
                        url: "https://abseil.io/resources/swe-book/html/ch01.html",
                    },
                    {
                        title: "NASA Systems Engineering Handbook — Fundamentals of Systems Engineering",
                        url: "https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/",
                    },
                ],
            },
        },
        {
            id: "thinking-like-an-engineer-003",
            title: "Worked Example: The Request Is Not the Problem",
            estimatedMinutes: 12,
            content: {
                type: "reading",
                body: `Imagine a team says:

**“The Steward API is slow. Add Redis caching.”**

A solution-first response starts researching Redis immediately. An engineering response first asks what “slow” means.

Suppose investigation reveals:

- the complaint concerns one reporting endpoint;
- median latency is acceptable, but requests with large date ranges become very slow;
- database logs show the endpoint performs repeated queries for related records;
- the workload is mostly internal and low-volume;
- the data must reflect recent changes immediately;
- the team has no experience operating Redis yet.

Now the problem is materially different. The evidence points toward query behavior and data access rather than a general inability of the system to handle load. Caching may still become an option, but it introduces cache invalidation, another operational dependency and the possibility of stale data.

A stronger first decision might be to fix the query pattern, add an index if the query plan supports it, define an explicit performance target, and measure again. If the endpoint remains inadequate after those changes, caching can be evaluated using better evidence.

Notice what changed: no one “proved Redis is bad.” The engineer improved the problem definition and prevented a plausible technology from becoming an answer before the question was understood.

This is the behavior TSA wants to reinforce: **do not confuse familiarity with a solution for understanding of a problem.**`,
            },
        },
        {
            id: "thinking-like-an-engineer-004",
            title: "Required Reading: Time, Scale and Trade-offs",
            estimatedMinutes: 20,
            content: {
                type: "reading",
                body: `Read the linked chapter from **Software Engineering at Google**, especially the discussion of time, scale and trade-offs. Do not treat Google's practices as rules for TSA. The value of the chapter is its distinction between writing code that works now and engineering software that must remain useful as circumstances change.

While reading, make short notes answering:

1. What changes when software is expected to live for years rather than days?
2. Which practices can become inappropriate when team or system scale changes?
3. Why do trade-offs make engineering decisions context-dependent?
4. Name one practice you have previously treated as a universal “best practice.” What context might make it a poor choice?

The goal is active reading. You should finish with claims you can explain, not merely a completed link.`,
                resources: [
                    {
                        title: "Required — Software Engineering at Google: What Is Software Engineering?",
                        url: "https://abseil.io/resources/swe-book/html/ch01.html",
                    },
                ],
            },
        },
        {
            id: "thinking-like-an-engineer-005",
            title: "Practice: Turn a Request into an Engineering Problem",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Transform a solution-shaped technical request into an evidence-seeking engineering problem statement.",
                scenario: "Use one of these requests—or a real request from your own work: 'move the application to microservices', 'add caching because the API is slow', 'rewrite this service in another language', 'put everything in Kubernetes', or 'automate all regression tests'. You are not being asked to accept or reject the proposed solution yet.",
                instructions: [
                    "Write the original request exactly as given and identify the solution it already assumes.",
                    "Describe the underlying outcome the requester may actually care about. Mark anything you are inferring as an assumption.",
                    "List the stakeholders or users whose needs could change the decision.",
                    "Identify at least five relevant constraints across areas such as time, cost, skills, operations, security, reliability, compatibility or maintainability.",
                    "Separate what is already known from what is still unknown.",
                    "For at least three important unknowns, state what evidence you would collect and how that evidence could change the decision.",
                    "Write a problem statement that does not prescribe a technology.",
                    "Propose at least two plausible options, one of which may be keeping the current design and improving it.",
                    "Make a provisional recommendation and state what evidence could cause you to reverse it.",
                ],
                deliverables: [
                    "Original solution-shaped request",
                    "Problem statement",
                    "Stakeholder and constraint notes",
                    "Known/unknown/evidence table",
                    "Options with a provisional recommendation",
                ],
                completionCriteria: [
                    "The rewritten problem can be understood without naming the original proposed technology.",
                    "Assumptions are visibly different from verified facts.",
                    "The evidence plan could genuinely confirm or challenge the current recommendation.",
                    "At least two credible options are considered.",
                    "The recommendation acknowledges uncertainty and a condition for revisiting it.",
                ],
            },
        },
        {
            id: "thinking-like-an-engineer-006",
            title: "Professional Responsibility Is Part of Engineering",
            estimatedMinutes: 10,
            content: {
                type: "reading",
                body: `Engineering judgment is not only about technical efficiency. Software affects people, organizations and sometimes safety, money, privacy or access to essential services. That creates responsibility.

The ACM and IEEE software-engineering ethics material emphasizes public interest, competent work, honest evaluation, appropriate review and the communication of significant risks. TSA will return to these ideas later in Security Steward, Reliability Engineer and Technical Steward, but the foundation begins now: **an engineer is responsible for the consequences and limitations they can reasonably identify, not just for making the implementation pass.**

Additional resource: read the short ethics principles now. Return to the full material later when the systems you are building carry more consequential risks.`,
                resources: [
                    {
                        title: "IEEE Computer Society / ACM — Software Engineering Code of Ethics",
                        url: "https://www.computer.org/education/code-of-ethics",
                    },
                ],
            },
        },
        {
            id: "thinking-like-an-engineer-007",
            title: "Knowledge Check and Reflection",
            estimatedMinutes: 15,
            content: {
                type: "reflection",
                prompt: `Answer all of the following in your own words:

1. What is the difference between “the code works” and “this is a sound engineering solution”?
2. Why can a request such as “use microservices” be dangerous to accept as the problem statement?
3. Give one example where a constraint should legitimately change a technical choice.
4. What is the difference between a fact, an assumption and a hypothesis?
5. Describe one piece of evidence that could make you reverse a technical recommendation.
6. Think of a recent technical decision you made or observed. Where did the reasoning jump too quickly from request to solution, and what would you investigate differently now?`,
            },
        },
    ],
};
