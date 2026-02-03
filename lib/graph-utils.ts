export interface GraphNode {
  data: {
    id: string;
    label: string;
    level: string;
    domain: string;
    summary: string;
    tags: string[];
  };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    label: string;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function conceptsToGraphData(concepts: any[]): GraphData {
  const nodes: GraphNode[] = concepts.map((concept) => ({
    data: {
      id: concept.id,
      label: concept.title,
      level: concept.level,
      domain: concept.domain,
      summary: concept.summary,
      tags: JSON.parse(concept.tags),
    },
  }));

  const edges: GraphEdge[] = [];
  concepts.forEach((concept) => {
    const prereqIds = JSON.parse(concept.prereqIds) as string[];
    prereqIds.forEach((prereqId) => {
      edges.push({
        data: {
          id: `${prereqId}-${concept.id}`,
          source: prereqId,
          target: concept.id,
          label: 'prerequisite',
        },
      });
    });
  });

  return { nodes, edges };
}

export function findPrerequisitePath(
  conceptId: string,
  concepts: any[]
): string[] {
  const visited = new Set<string>();
  const path: string[] = [];

  function dfs(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const concept = concepts.find((c) => c.id === id);
    if (!concept) return;

    const prereqIds = JSON.parse(concept.prereqIds) as string[];
    prereqIds.forEach((prereqId) => {
      dfs(prereqId);
    });

    path.push(id);
  }

  dfs(conceptId);
  return path;
}

export function findConceptsByDomain(
  concepts: any[],
  domain: string
): any[] {
  return concepts.filter((c) => c.domain === domain);
}

export function findConceptsByTag(
  concepts: any[],
  tag: string
): any[] {
  return concepts.filter((c) => {
    const tags = JSON.parse(c.tags) as string[];
    return tags.includes(tag);
  });
}

export function getDomainsWithCounts(concepts: any[]): { domain: string; count: number }[] {
  const domainMap = new Map<string, number>();
  
  concepts.forEach((c) => {
    const count = domainMap.get(c.domain) || 0;
    domainMap.set(c.domain, count + 1);
  });

  return Array.from(domainMap.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(concepts: any[]): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>();
  
  concepts.forEach((c) => {
    const tags = JSON.parse(c.tags) as string[];
    tags.forEach((tag) => {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
