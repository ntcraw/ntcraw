import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function PodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      podcasts: true,
      instances: {
        include: {
          concept: true,
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  const podcast = lesson.podcasts[0];

  if (!podcast) {
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
                <a href={`/lessons/${lesson.id}`} className="text-gray-700 hover:text-indigo-600">Lesson</a>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎙️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Podcast Yet</h1>
            <p className="text-gray-600 mb-6">
              This lesson doesn't have a podcast generated yet.
            </p>
            <form action={`/api/lessons/${lesson.id}/podcast`} method="POST">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
              >
                Generate Podcast Now
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const chapters = JSON.parse(podcast.chapters) as Array<{
    title: string;
    timestamp: string;
    duration: string;
  }>;

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
              <a href={`/lessons/${lesson.id}`} className="text-gray-700 hover:text-indigo-600">Lesson</a>
              <span className="text-gray-400">→</span>
              <span className="text-gray-700 font-medium">Podcast</span>
            </div>
            <a
              href={`/lessons/${lesson.id}`}
              className="text-gray-700 hover:text-indigo-600"
            >
              ← Back to Lesson
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center mb-4">
            <div className="text-6xl mr-4">🎙️</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              <p className="text-lg opacity-90">Podcast Episode</p>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Listen Now</h2>
          <audio controls className="w-full">
            <source
              src={`data:audio/wav;base64,${podcast.audioBase64}`}
              type="audio/wav"
            />
            Your browser does not support the audio element.
          </audio>
          <p className="mt-4 text-sm text-gray-600">
            🎧 Put on your headphones and learn on the go! This podcast covers all {lesson.instances.length} concepts
            from the lesson.
          </p>
        </div>

        {/* Chapters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chapters</h2>
          <div className="space-y-3">
            {chapters.map((chapter, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{idx === 0 ? '🎬' : idx === chapters.length - 1 ? '🏁' : '📖'}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
                    <p className="text-sm text-gray-600">Duration: {chapter.duration}</p>
                  </div>
                </div>
                <div className="text-gray-500 font-mono text-sm">
                  {chapter.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show Notes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Show Notes</h2>
          <div className="prose prose-sm max-w-none">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Episode Description</h3>
              <p className="text-gray-700">{lesson.problem}</p>
            </div>

            <h3 className="font-semibold text-gray-800 mb-3">Concepts Covered</h3>
            <ul className="space-y-2">
              {lesson.instances.map((instance, idx) => (
                <li key={instance.id} className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">{idx + 1}.</span>
                  <div>
                    <span className="font-medium text-gray-800">{instance.concept.title}</span>
                    <span className="text-gray-600"> - {instance.concept.summary}</span>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        instance.concept.level === 'beginner' ? 'bg-blue-100 text-blue-800' :
                        instance.concept.level === 'intermediate' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {instance.concept.level}
                      </span>
                      <span className="text-xs ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {instance.concept.domain}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4">
              <h4 className="font-semibold text-blue-900 mb-2">📚 Continue Learning</h4>
              <p className="text-blue-800 text-sm mb-3">
                Want to dive deeper? Check out the interactive lesson with flip cards, diagrams, and code examples.
              </p>
              <a
                href={`/lessons/${lesson.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                View Interactive Lesson
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
