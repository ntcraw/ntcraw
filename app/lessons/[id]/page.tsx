import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import FlipCard from '@/components/FlipCard';
import RolePlayingSection from '@/components/RolePlayingSection';
import { generateRolePlayingSection } from '@/lib/lesson-generator';

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      instances: {
        include: {
          concept: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      podcasts: true,
      exports: true,
    },
  });

  if (!lesson) {
    notFound();
  }

  const objectives = JSON.parse(lesson.objectives) as string[];
  const constraints = JSON.parse(lesson.constraints) as string[];
  const roleOutputs = generateRolePlayingSection(lesson.problem);

  const latestExport = lesson.exports[0];
  const latestPodcast = lesson.podcasts[0];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg mb-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-2xl font-bold text-indigo-600">AI Infra Learning</a>
              <span className="text-gray-400">→</span>
              <a href="/lessons" className="text-gray-700 hover:text-indigo-600">Lessons</a>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700 font-medium truncate max-w-xs">
                {lesson.title.substring(0, 40)}...
              </span>
            </div>
            <div className="flex space-x-2">
              {!latestPodcast && (
                <form action={`/api/lessons/${lesson.id}/podcast`} method="POST">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                  >
                    🎙️ Generate Podcast
                  </button>
                </form>
              )}
              {latestPodcast && (
                <a
                  href={`/lessons/${lesson.id}/podcast`}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                >
                  🎙️ View Podcast
                </a>
              )}
              {!latestExport && (
                <form action={`/api/lessons/${lesson.id}/export`} method="POST">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    📦 Export HTML
                  </button>
                </form>
              )}
              {latestExport && (
                <a
                  href={`/api/lessons/${lesson.id}/export/${latestExport.id}/download`}
                  download={`${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                >
                  📥 Download Export
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
          <p className="text-lg opacity-90">{lesson.problem}</p>
        </div>

        {/* Objectives and Constraints */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Learning Objectives</h2>
            <ul className="space-y-2">
              {objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">{idx + 1}.</span>
                  <span className="text-gray-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Constraints</h2>
            <ul className="space-y-2">
              {constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span className="text-gray-700">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flip Cards */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎴 Interactive Concept Cards ({lesson.instances.length})
          </h2>
          <p className="text-gray-600 mb-6">
            Click any card to flip and explore the concept in detail. Press <kbd className="px-2 py-1 bg-gray-200 rounded">F</kbd> to flip all cards.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lesson.instances.map((instance) => (
              <FlipCard key={instance.id} instance={instance} />
            ))}
          </div>
        </div>

        {/* Role-Playing Section */}
        <RolePlayingSection roleOutputs={roleOutputs} problem={lesson.problem} />
      </div>
    </div>
  );
}
