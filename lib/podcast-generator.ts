import { prisma } from './prisma';

export interface PodcastChapter {
  title: string;
  timestamp: string;
  duration: string;
}

export async function generatePodcastScript(lessonId: string): Promise<string> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      instances: {
        include: {
          concept: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!lesson) {
    throw new Error(`Lesson ${lessonId} not found`);
  }

  const objectives = JSON.parse(lesson.objectives) as string[];
  const constraints = JSON.parse(lesson.constraints) as string[];

  let script = `# ${lesson.title}
## Podcast Episode Script

---

### Introduction

**[INTRO MUSIC FADES IN]**

**Host:** Welcome to AI Infrastructure Learning, the podcast where we break down complex training infrastructure challenges into digestible insights.

Today, we're tackling an important problem: "${lesson.problem.substring(0, 150)}..."

This episode will cover ${lesson.instances.length} key concepts that will help you understand and solve this challenge.

---

### Learning Objectives

**Host:** By the end of this episode, you'll be able to:

${objectives.map((obj, idx) => `${idx + 1}. ${obj}`).join('\n')}

---

### Problem Context

**Host:** Let's set the stage. Here's what we're working with:

${lesson.problem}

**Key Constraints:**

${constraints.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}

Now that we understand the problem space, let's dive into the concepts that will help us solve it.

---

`;

  // Add sections for each concept/instance
  lesson.instances.forEach((instance, idx) => {
    const concept = instance.concept;
    script += `### Chapter ${idx + 1}: ${concept.title}

**Host:** Our ${idx === 0 ? 'first' : idx === lesson.instances.length - 1 ? 'final' : 'next'} concept is ${concept.title}.

${concept.summary}

This is a **${concept.level}** level concept in the **${concept.domain}** domain.

**Why does this matter for our problem?**

Understanding ${concept.title} helps us address the challenge by providing a foundation for ${concept.domain}-related decisions. 

Let me break down the key points:

**[PAUSE]**

${extractKeyPointsFromContent(instance.contentMdx)}

**[PAUSE]**

Now, here's a practical question to test your understanding:

${extractQuizQuestion(instance.quiz)}

**[PAUSE FOR LISTENER TO THINK]**

The answer focuses on the core purpose: ${concept.summary}

---

`;
  });

  script += `### Conclusion

**Host:** Let's recap what we've covered today:

${lesson.instances.map((inst, idx) => `${idx + 1}. **${inst.concept.title}** - ${inst.concept.summary}`).join('\n')}

These concepts work together to help you solve the problem of "${lesson.problem.substring(0, 100)}..."

Remember, in AI infrastructure, there's rarely one perfect solution. It's about understanding the trade-offs and making informed decisions based on your specific constraints.

**[OUTRO MUSIC FADES IN]**

**Host:** Thanks for listening to AI Infrastructure Learning. If you want to dive deeper, check out the interactive lesson materials at our web platform, where you can explore flip cards, diagrams, and hands-on examples.

Until next time, keep building and keep learning!

**[OUTRO MUSIC]**

---

## Show Notes

- **Problem:** ${lesson.problem.substring(0, 200)}
- **Concepts Covered:** ${lesson.instances.map(i => i.concept.title).join(', ')}
- **Difficulty:** Mixed (${lesson.instances.map(i => i.concept.level).filter((v, i, a) => a.indexOf(v) === i).join(', ')})
- **Duration:** ~${estimateDuration(lesson.instances.length)} minutes

## Resources

${lesson.instances.map(i => {
  const resources = JSON.parse(i.concept.resources) as any[];
  if (resources.length === 0) return null;
  return `**${i.concept.title}:**\n${resources.map(r => `- [${r.title}](${r.url})`).join('\n')}`;
}).filter(Boolean).join('\n\n')}

`;

  return script;
}

function extractKeyPointsFromContent(contentMdx: string): string {
  // Simple extraction - in production this would be more sophisticated
  const lines = contentMdx.split('\n');
  const keyPoints = lines
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
    .slice(0, 3)
    .map(line => line.trim().replace(/^[-•]\s*/, ''))
    .join('\n- ');
  
  return keyPoints || 'This concept provides essential understanding for infrastructure decision-making.';
}

function extractQuizQuestion(quizJson: string): string {
  try {
    const quiz = JSON.parse(quizJson);
    if (quiz.length > 0) {
      return quiz[0].question;
    }
  } catch (e) {
    // ignore
  }
  return 'What are the key benefits of applying this concept?';
}

function estimateDuration(conceptCount: number): number {
  // Rough estimate: 3-4 minutes per concept + 2 min intro/outro
  return conceptCount * 3.5 + 2;
}

export async function generatePodcast(lessonId: string): Promise<string> {
  const script = await generatePodcastScript(lessonId);

  // Generate chapters
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { instances: true },
  });

  if (!lesson) {
    throw new Error(`Lesson ${lessonId} not found`);
  }

  const chapters: PodcastChapter[] = [
    { title: 'Introduction', timestamp: '0:00', duration: '1:00' },
  ];

  let currentTime = 60; // Start at 1 minute
  lesson.instances.forEach((instance, idx) => {
    const duration = 180 + Math.random() * 60; // 3-4 minutes per chapter
    chapters.push({
      title: `Chapter ${idx + 1}: ${instance.title}`,
      timestamp: formatTimestamp(currentTime),
      duration: formatDuration(duration),
    });
    currentTime += duration;
  });

  chapters.push({
    title: 'Conclusion',
    timestamp: formatTimestamp(currentTime),
    duration: '1:30',
  });

  // Generate TTS audio
  const audioBase64 = await generateTTS(script);

  // Create podcast
  const podcast = await prisma.podcast.create({
    data: {
      lessonId,
      scriptMdx: script,
      audioBase64,
      chapters: JSON.stringify(chapters),
    },
  });

  return podcast.id;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function generateTTS(script: string): Promise<string> {
  // Check for Azure TTS credentials
  const azureKey = process.env.AZURE_TTS_KEY;
  const azureRegion = process.env.AZURE_TTS_REGION;

  if (azureKey && azureRegion) {
    // In production, integrate with Azure TTS
    console.log('Azure TTS would be called here');
    // return await callAzureTTS(script, azureKey, azureRegion);
  }

  // Return stub base64 audio for MVP
  // This represents a silent 1-second WAV file
  return generateStubAudio(script.length);
}

function generateStubAudio(length: number): string {
  // Generate a minimal WAV file header + silence
  // This is a placeholder - in production, use actual TTS
  const duration = Math.min(length / 20, 600); // Max 10 minutes
  const sampleRate = 22050;
  const samples = Math.floor(duration * sampleRate);
  
  // WAV header (44 bytes) + data
  const headerSize = 44;
  const dataSize = samples * 2; // 16-bit mono
  const fileSize = headerSize + dataSize;
  
  const buffer = Buffer.alloc(headerSize + dataSize);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);
  
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // audio format (PCM)
  buffer.writeUInt16LE(1, 22); // num channels (mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Fill with silence (zeros)
  buffer.fill(0, 44);
  
  return buffer.toString('base64');
}

// Adapter interface for pluggable TTS providers
export interface TTSProvider {
  generate(text: string): Promise<Buffer>;
}

export class AzureTTSProvider implements TTSProvider {
  constructor(private key: string, private region: string) {}

  async generate(text: string): Promise<Buffer> {
    // In production: call Azure Cognitive Services TTS API
    // For now, return stub
    return Buffer.from(generateStubAudio(text.length), 'base64');
  }
}

export class ElevenLabsProvider implements TTSProvider {
  constructor(private apiKey: string) {}

  async generate(text: string): Promise<Buffer> {
    // In production: call ElevenLabs API
    return Buffer.from(generateStubAudio(text.length), 'base64');
  }
}
