import { prisma } from './prisma';

export interface Role {
  name: string;
  perspective: string;
  responsibilities: string[];
}

export const ROLES: Role[] = [
  {
    name: 'Infrastructure Architect',
    perspective: 'System design and scalability',
    responsibilities: [
      'Design overall infrastructure topology',
      'Select appropriate compute and networking resources',
      'Plan for scalability and fault tolerance',
    ],
  },
  {
    name: 'Data Lead',
    perspective: 'Data pipeline and quality',
    responsibilities: [
      'Design data collection and preprocessing pipeline',
      'Ensure data quality and diversity',
      'Optimize data loading and streaming',
    ],
  },
  {
    name: 'Training Engineer',
    perspective: 'Model training and optimization',
    responsibilities: [
      'Implement training loops and optimization strategies',
      'Tune hyperparameters for convergence',
      'Monitor training stability and performance',
    ],
  },
  {
    name: 'SRE (Site Reliability Engineer)',
    perspective: 'Operations and reliability',
    responsibilities: [
      'Ensure system uptime and fault tolerance',
      'Implement monitoring and alerting',
      'Handle incident response and recovery',
    ],
  },
  {
    name: 'Cost Officer',
    perspective: 'Budget and resource efficiency',
    responsibilities: [
      'Track and optimize infrastructure costs',
      'Identify cost-saving opportunities',
      'Balance performance vs. cost trade-offs',
    ],
  },
  {
    name: 'Red Team',
    perspective: 'Risk assessment and edge cases',
    responsibilities: [
      'Identify potential failure modes',
      'Challenge assumptions and designs',
      'Propose stress tests and validation scenarios',
    ],
  },
];

export interface RoleOutput {
  role: string;
  view: string;
  evidence: string[];
  risks: string[];
  tradeOffs: string[];
  actions: string[];
}

export interface ConceptSelection {
  conceptId: string;
  title: string;
  rationale: string;
  priority: number;
}

export async function selectConceptsForProblem(
  problemStatement: string,
  constraints: string[],
  weakConcepts: string[] = []
): Promise<ConceptSelection[]> {
  // Get all concepts
  const allConcepts = await prisma.concept.findMany();

  // Parse problem for relevant domains and tags
  const problemLower = problemStatement.toLowerCase();
  const constraintsLower = constraints.join(' ').toLowerCase();
  const combinedText = `${problemLower} ${constraintsLower}`;

  // Score concepts based on relevance
  const scoredConcepts = allConcepts.map((concept) => {
    let score = 0;
    const tags = JSON.parse(concept.tags) as string[];

    // Domain match
    if (combinedText.includes(concept.domain.toLowerCase())) {
      score += 10;
    }

    // Tag matches
    tags.forEach((tag) => {
      if (combinedText.includes(tag.toLowerCase())) {
        score += 5;
      }
    });

    // Title match
    if (combinedText.includes(concept.title.toLowerCase())) {
      score += 15;
    }

    // Boost weak concepts for spaced repetition
    if (weakConcepts.includes(concept.id)) {
      score += 20;
    }

    // Prefer beginner and intermediate for MVP
    if (concept.level === 'beginner') score += 3;
    if (concept.level === 'intermediate') score += 2;

    return {
      ...concept,
      score,
    };
  });

  // Sort by score and take top 6-8
  const topConcepts = scoredConcepts
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return topConcepts.map((concept, idx) => ({
    conceptId: concept.id,
    title: concept.title,
    rationale: `Relevant to problem domain (${concept.domain}) and addresses key aspects`,
    priority: idx + 1,
  }));
}

export async function generateLesson(
  problemStatement: string,
  constraints: string[],
  weakConcepts: string[] = []
): Promise<string> {
  // Select concepts
  const selectedConcepts = await selectConceptsForProblem(
    problemStatement,
    constraints,
    weakConcepts
  );

  // Generate lesson metadata
  const title = `Training Infrastructure for: ${problemStatement.substring(0, 60)}...`;
  const objectives = [
    'Understand the infrastructure requirements for the given problem',
    'Design a scalable and cost-effective training setup',
    'Implement fault-tolerant training pipelines',
    'Optimize for performance and resource efficiency',
  ];

  // Create lesson
  const lesson = await prisma.lesson.create({
    data: {
      title,
      problem: problemStatement,
      constraints: JSON.stringify(constraints),
      objectives: JSON.stringify(objectives),
      requiredConceptIds: JSON.stringify(selectedConcepts.map((c) => c.conceptId)),
    },
  });

  // Link concepts to lesson
  for (const concept of selectedConcepts) {
    await prisma.lessonConcept.create({
      data: {
        lessonId: lesson.id,
        conceptId: concept.conceptId,
      },
    });
  }

  // Generate instances (flip cards) for each concept
  let order = 0;
  for (const selection of selectedConcepts) {
    const concept = await prisma.concept.findUnique({
      where: { id: selection.conceptId },
    });

    if (!concept) continue;

    const contentMdx = generateInstanceContent(concept, problemStatement);
    const quiz = generateQuiz(concept);

    await prisma.instance.create({
      data: {
        lessonId: lesson.id,
        conceptId: concept.id,
        title: concept.title,
        contentMdx,
        quiz: JSON.stringify(quiz),
        order: order++,
      },
    });
  }

  return lesson.id;
}

function generateInstanceContent(concept: any, problem: string): string {
  const tags = JSON.parse(concept.tags) as string[];
  
  return `# ${concept.title}

## Overview
${concept.summary}

## In Context of Problem
This concept is crucial for solving: "${problem.substring(0, 100)}..."

### Key Points
- Level: **${concept.level}**
- Domain: **${concept.domain}**
- Tags: ${tags.map(t => `\`${t}\``).join(', ')}

## Implementation Approach

\`\`\`mermaid
graph TD
    A[Problem] --> B{Analyze Requirements}
    B --> C[Apply ${concept.title}]
    C --> D[Validate Solution]
    D --> E[Optimize]
\`\`\`

## Example Code

\`\`\`python
# Example implementation for ${concept.title}
# Context: ${problem.substring(0, 80)}

def apply_${concept.id}():
    """
    ${concept.summary}
    """
    # Implementation would go here
    pass
\`\`\`

## Prerequisites
${JSON.parse(concept.prereqIds).length > 0 
  ? `Before mastering this concept, you should understand:\n${JSON.parse(concept.prereqIds).map((id: string) => `- Concept ${id}`).join('\n')}`
  : 'No prerequisites required - this is a foundational concept.'}

## Key Takeaways
1. ${concept.title} is essential for ${concept.domain} aspects
2. Understanding this enables better decision-making in infrastructure design
3. Practical application requires consideration of trade-offs
`;
}

function generateQuiz(concept: any): any[] {
  return [
    {
      question: `What is the primary purpose of ${concept.title}?`,
      options: [
        concept.summary,
        'To increase system complexity',
        'To reduce code readability',
        'To eliminate all trade-offs',
      ],
      correctIndex: 0,
    },
    {
      question: `What level is this concept classified as?`,
      options: ['beginner', 'intermediate', 'advanced', 'expert'],
      correctIndex: ['beginner', 'intermediate', 'advanced'].indexOf(concept.level),
    },
  ];
}

export function generateRolePlayingSection(problemStatement: string): RoleOutput[] {
  return ROLES.map((role) => {
    return {
      role: role.name,
      view: `From the ${role.perspective} perspective, we need to consider...`,
      evidence: [
        `${role.responsibilities[0]} is critical for this problem`,
        'Historical data shows similar approaches succeed',
      ],
      risks: [
        'Potential bottlenecks in implementation',
        'Resource constraints may impact delivery',
      ],
      tradeOffs: [
        'Performance vs. Cost',
        'Complexity vs. Maintainability',
      ],
      actions: [
        role.responsibilities[0],
        'Monitor and iterate based on results',
      ],
    };
  });
}

export interface RecursiveSolverState {
  problem: string;
  subproblems: string[];
  solutions: string[];
  evaluations: string[];
  decisions: string[];
  depth: number;
  maxDepth: number;
}

export async function recursiveSolve(
  problem: string,
  maxDepth: number = 1
): Promise<RecursiveSolverState> {
  // MVP: Single-pass recursive solver stub
  return {
    problem,
    subproblems: [
      'Design infrastructure topology',
      'Implement training pipeline',
      'Setup monitoring and alerts',
    ],
    solutions: [
      'Use multi-node GPU cluster with InfiniBand',
      'Implement data parallel training with gradient accumulation',
      'Deploy Prometheus + Grafana stack',
    ],
    evaluations: [
      'Solution meets scalability requirements',
      'Cost within acceptable range',
      'Monitoring provides adequate visibility',
    ],
    decisions: [
      'Proceed with proposed infrastructure',
      'Iterate on cost optimization',
      'Expand monitoring coverage',
    ],
    depth: 1,
    maxDepth,
  };
}
