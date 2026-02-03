'use client';

import { useEffect, useRef, useState } from 'react';
import type { GraphData } from '@/lib/graph-utils';

interface Props {
  graphData: GraphData;
  domains: string[];
}

export default function GraphVisualization({ graphData, domains }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let mounted = true;

    const loadCytoscape = async () => {
      const cytoscape = (await import('cytoscape')).default;
      const coseBilkent = (await import('cytoscape-cose-bilkent')).default;
      
      cytoscape.use(coseBilkent);

      if (!mounted || !containerRef.current) return;

      // Color mapping for levels
      const levelColors: { [key: string]: string } = {
        beginner: '#3B82F6',
        intermediate: '#10B981',
        advanced: '#8B5CF6',
      };

      const filteredNodes = selectedDomain === 'all'
        ? graphData.nodes
        : graphData.nodes.filter(n => n.data.domain === selectedDomain);

      const filteredNodeIds = new Set(filteredNodes.map(n => n.data.id));
      const filteredEdges = graphData.edges.filter(
        e => filteredNodeIds.has(e.data.source) && filteredNodeIds.has(e.data.target)
      );

      const cy = cytoscape({
        container: containerRef.current,
        elements: {
          nodes: filteredNodes,
          edges: filteredEdges,
        },
        style: [
          {
            selector: 'node',
            style: {
              'background-color': (ele: any) => levelColors[ele.data('level')] || '#6B7280',
              'label': 'data(label)',
              'color': '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '10px',
              'font-weight': 'bold',
              'width': '30px',
              'height': '30px',
              'text-wrap': 'wrap',
              'text-max-width': '80px',
              'overlay-padding': '4px',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': '3px',
              'border-color': '#FBBF24',
            },
          },
          {
            selector: 'node.highlighted',
            style: {
              'background-color': '#F59E0B',
              'border-width': '3px',
              'border-color': '#FBBF24',
            },
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#CBD5E1',
              'target-arrow-color': '#CBD5E1',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'arrow-scale': 1,
            },
          },
          {
            selector: 'edge.highlighted',
            style: {
              'width': 3,
              'line-color': '#F59E0B',
              'target-arrow-color': '#F59E0B',
            },
          },
        ],
        layout: {
          name: 'cose-bilkent',
          animate: true,
          animationDuration: 1000,
          nodeDimensionsIncludeLabels: true,
          idealEdgeLength: 100,
          nodeRepulsion: 4500,
          edgeElasticity: 0.45,
          nestingFactor: 0.1,
          gravity: 0.25,
          numIter: 2500,
          tile: true,
          tilingPaddingVertical: 10,
          tilingPaddingHorizontal: 10,
        } as any,
        minZoom: 0.3,
        maxZoom: 3,
        wheelSensitivity: 0.2,
      });

      cyRef.current = cy;

      // Add click handler
      cy.on('tap', 'node', (evt: any) => {
        const node = evt.target;
        const nodeId = node.id();
        setHighlightedNode(nodeId);

        // Highlight prerequisite path
        cy.elements().removeClass('highlighted');
        
        // BFS to find all prerequisites
        const visited = new Set<string>();
        const queue: string[] = [nodeId];
        
        while (queue.length > 0) {
          const current = queue.shift()!;
          if (visited.has(current)) continue;
          visited.add(current);
          
          const currentNode = cy.getElementById(current);
          currentNode.addClass('highlighted');
          
          // Get incoming edges (prerequisites)
          currentNode.incomers('edge').forEach((edge: any) => {
            edge.addClass('highlighted');
            const sourceId = edge.source().id();
            if (!visited.has(sourceId)) {
              queue.push(sourceId);
            }
          });
        }
      });

      // Add tap on background to clear selection
      cy.on('tap', (evt: any) => {
        if (evt.target === cy) {
          setHighlightedNode(null);
          cy.elements().removeClass('highlighted');
        }
      });
    };

    loadCytoscape();

    return () => {
      mounted = false;
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [graphData, selectedDomain]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Domain
        </label>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Domains</option>
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        {highlightedNode && (
          <p className="mt-2 text-sm text-gray-600">
            Showing prerequisite path for: <strong>{highlightedNode}</strong>
            <button
              onClick={() => {
                setHighlightedNode(null);
                if (cyRef.current) {
                  cyRef.current.elements().removeClass('highlighted');
                }
              }}
              className="ml-2 text-indigo-600 hover:text-indigo-800"
            >
              Clear
            </button>
          </p>
        )}
      </div>
      <div ref={containerRef} id="cy" className="w-full h-[700px]" />
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Click on a node to highlight its prerequisite path. Scroll to zoom, drag to pan.
        </p>
      </div>
    </div>
  );
}
