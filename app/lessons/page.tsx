import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function LessonsPage() {
  const lessons = await prisma.lesson.findMany({
    include: {
      instances: true,
      podcasts: true,
      exports: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-2xl font-bold text-indigo-600">AI Infra Learning</a>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700 font-medium">Lessons</span>
            </div>
            <Link
              href="/lessons/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              + Generate New Lesson
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Lessons</h1>
          <p className="text-gray-600">
            Browse and explore {lessons.length} problem-oriented learning experiences
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Lessons Yet</h2>
            <p className="text-gray-600 mb-6">
              Generate your first lesson from a training infrastructure problem
            </p>
            <Link
              href="/lessons/new"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
            >
              Create First Lesson
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {lessons.map((lesson) => {
              const objectives = JSON.parse(lesson.objectives) as string[];
              const hasPodcast = lesson.podcasts.length > 0;
              const hasExport = lesson.exports.length > 0;

              return (
                <div key={lesson.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        <Link href={`/lessons/${lesson.id}`} className="hover:text-indigo-600">
                          {lesson.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4">{lesson.problem.substring(0, 200)}...</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {hasPodcast && (
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          🎙️ Podcast
                        </span>
                      )}
                      {hasExport && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          📦 Export
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Learning Objectives</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {objectives.slice(0, 2).map((obj, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                        {objectives.length > 2 && (
                          <li className="text-gray-400">+ {objectives.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Content</h3>
                      <p className="text-sm text-gray-600">
                        {lesson.instances.length} concept cards
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm"
                    >
                      View Lesson
                    </Link>
                    {hasPodcast && (
                      <Link
                        href={`/lessons/${lesson.id}/podcast`}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                      >
                        Listen to Podcast
                      </Link>
                    )}
                    {!hasExport && (
                      <form action={`/api/lessons/${lesson.id}/export`} method="POST">
                        <button
                          type="submit"
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition text-sm"
                        >
                          Generate Export
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
