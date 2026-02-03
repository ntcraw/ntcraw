import Link from 'next/link';
import { MVP_LLM_INFRA_LEARNING } from '@/lib/feature-flags';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  if (!MVP_LLM_INFRA_LEARNING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Feature Not Enabled</h1>
          <p className="text-gray-600">The MVP_LLM_INFRA_LEARNING feature flag is not enabled.</p>
        </div>
      </div>
    );
  }

  const conceptCount = await prisma.concept.count();
  const lessonCount = await prisma.lesson.count();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">AI Infra Learning</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/graph"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Knowledge Graph
              </Link>
              <Link
                href="/lessons"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Lessons
              </Link>
              <Link
                href="/lessons/new"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Generate Lesson
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Master AI Training Infrastructure
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            An interactive learning system for understanding large-model training infrastructure
            through problem-oriented lessons, role-playing scenarios, and spaced repetition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-indigo-600 text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{conceptCount} Concepts</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive knowledge graph covering distributed training, infrastructure, and optimization.
            </p>
            <Link
              href="/graph"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Explore Graph
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-indigo-600 text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Problem-Oriented</h3>
            <p className="text-gray-600 mb-4">
              Generate lessons from real infrastructure problems with role-playing perspectives.
            </p>
            <Link
              href="/lessons/new"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Create Lesson
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-transform">
            <div className="text-indigo-600 text-4xl mb-4">🎙️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{lessonCount} Lessons</h3>
            <p className="text-gray-600 mb-4">
              Interactive flip cards, podcasts, and exportable single-file HTML for offline learning.
            </p>
            <Link
              href="/lessons"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              View Lessons
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-800">Knowledge Graph Visualization</h4>
                <p className="text-gray-600 text-sm">
                  Interactive graph with {conceptCount} concepts, clustered by domain with prerequisite paths
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-800">Problem-Based Lesson Generation</h4>
                <p className="text-gray-600 text-sm">
                  Generate lessons with 6-8 instance cards and role-rotation analysis
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-800">Spaced Repetition</h4>
                <p className="text-gray-600 text-sm">
                  Track weak concepts and prioritize them in next lesson generation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-800">Single-File HTML Export</h4>
                <p className="text-gray-600 text-sm">
                  Export lessons as self-contained, offline-capable HTML files
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-800">Podcast Generation</h4>
                <p className="text-gray-600 text-sm">
                  Auto-generate podcast scripts with TTS integration (Azure/pluggable)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h4 className="font-semibold text-gray-800">Interactive Flip Cards</h4>
                <p className="text-gray-600 text-sm">
                  Flip cards with MDX content, code blocks, and Mermaid diagrams
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
