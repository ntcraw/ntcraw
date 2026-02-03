import LessonGeneratorForm from '@/components/LessonGeneratorForm';
import { prisma } from '@/lib/prisma';

export default async function NewLessonPage() {
  // Get user's weak concepts from recent progress
  const recentProgress = await prisma.progress.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
  });

  const weakConceptIds: string[] = [];
  recentProgress.forEach((p) => {
    const weak = JSON.parse(p.weakConcepts) as string[];
    weakConceptIds.push(...weak);
  });

  const uniqueWeakConcepts = Array.from(new Set(weakConceptIds));

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-2xl font-bold text-indigo-600">AI Infra Learning</a>
              <span className="text-gray-400">→</span>
              <a href="/lessons" className="text-gray-700 hover:text-indigo-600">Lessons</a>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700 font-medium">New Lesson</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Generate New Lesson</h1>
          <p className="text-gray-600 mb-6">
            Describe a training infrastructure problem and we'll generate a problem-oriented lesson
            with role-playing analysis and interactive flip cards.
          </p>

          {uniqueWeakConcepts.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Spaced Repetition Active</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    We've identified {uniqueWeakConcepts.length} concept(s) that could use reinforcement.
                    They'll be prioritized in your next lesson.
                  </p>
                </div>
              </div>
            </div>
          )}

          <LessonGeneratorForm weakConcepts={uniqueWeakConcepts} />
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Example Problems</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="font-semibold text-gray-800">Multi-Node GPT Training</h3>
              <p className="text-gray-600 text-sm">
                Design infrastructure to train a 175B parameter GPT model across 256 A100 GPUs with
                99.9% uptime and cost under $500k.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800">Fault-Tolerant Training Pipeline</h3>
              <p className="text-gray-600 text-sm">
                Implement a training system that can recover from node failures within 5 minutes
                without losing more than 10 minutes of training progress.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800">Cost-Optimized Vision Model Training</h3>
              <p className="text-gray-600 text-sm">
                Train a CLIP-scale vision-language model using spot instances while maintaining
                training stability and throughput above 1000 samples/sec.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
