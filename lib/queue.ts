import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

// Attempt to connect, but don't fail if Redis is not available
connection.connect().catch(() => {
  console.warn('Redis not available. Queue functionality will be limited.');
});

export interface LessonGenerationJob {
  problemStatement: string;
  constraints: string[];
  weakConcepts?: string[];
}

export interface PodcastGenerationJob {
  lessonId: string;
}

export const lessonQueue = new Queue<LessonGenerationJob>('lesson-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export const podcastQueue = new Queue<PodcastGenerationJob>('podcast-generation', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// Worker stubs - in production these would be separate processes
if (process.env.NODE_ENV === 'development') {
  const lessonWorker = new Worker<LessonGenerationJob>(
    'lesson-generation',
    async (job: Job<LessonGenerationJob>) => {
      console.log('Processing lesson generation job:', job.id);
      // Actual generation logic will be called from here
      return { success: true };
    },
    { connection }
  );

  const podcastWorker = new Worker<PodcastGenerationJob>(
    'podcast-generation',
    async (job: Job<PodcastGenerationJob>) => {
      console.log('Processing podcast generation job:', job.id);
      // Actual generation logic will be called from here
      return { success: true };
    },
    { connection }
  );

  lessonWorker.on('failed', (job, err) => {
    console.error(`Lesson job ${job?.id} failed:`, err);
  });

  podcastWorker.on('failed', (job, err) => {
    console.error(`Podcast job ${job?.id} failed:`, err);
  });
}
