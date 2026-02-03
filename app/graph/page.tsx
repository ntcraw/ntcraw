import { prisma } from '@/lib/prisma';
import GraphVisualization from '@/components/GraphVisualization';
import { conceptsToGraphData, getDomainsWithCounts, getAllTags } from '@/lib/graph-utils';

export default async function GraphPage() {
  const concepts = await prisma.concept.findMany({
    orderBy: { title: 'asc' },
  });

  const graphData = conceptsToGraphData(concepts);
  const domains = getDomainsWithCounts(concepts);
  const tags = getAllTags(concepts);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-2xl font-bold text-indigo-600">AI Infra Learning</a>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700 font-medium">Knowledge Graph</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Knowledge Graph</h1>
          <p className="text-gray-600 mb-4">
            Interactive visualization of {concepts.length} concepts with prerequisite relationships
          </p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Beginner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Intermediate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Advanced</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Domains ({domains.length})</h3>
              <div className="flex flex-wrap gap-2">
                {domains.slice(0, 10).map(({ domain, count }) => (
                  <span
                    key={domain}
                    className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {domain} ({count})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Top Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 10).map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <GraphVisualization graphData={graphData} domains={domains.map(d => d.domain)} />
      </div>
    </div>
  );
}
