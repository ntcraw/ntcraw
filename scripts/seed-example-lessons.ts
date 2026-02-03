import { PrismaClient } from '@prisma/client';
import { generateLesson } from '../lib/lesson-generator';
import { generatePodcast } from '../lib/podcast-generator';
import { createExport } from '../lib/export-generator';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating example lessons...\n');

  // Example Lesson 1: Multi-Node GPT Training
  console.log('📚 Lesson 1: Multi-Node GPT Training');
  const lesson1Problem = `Design and implement infrastructure to train a 175B parameter GPT-3 style language model across 256 NVIDIA A100 GPUs. The system must achieve 99.9% uptime, complete training in under 30 days, and stay within a $500,000 budget. The model requires mixed precision training, efficient gradient synchronization, and automatic checkpoint recovery in case of hardware failures.`;
  const lesson1Constraints = [
    'Budget: Maximum $500,000 for compute and storage',
    'Timeline: Complete training in 30 days or less',
    'Uptime: 99.9% availability (max 43 minutes downtime per month)',
    'Hardware: 256 NVIDIA A100 GPUs (40GB each)',
    'Network: InfiniBand or equivalent high-bandwidth fabric required',
    'Recovery: Automatic failure recovery within 5 minutes',
  ];

  const lesson1Id = await generateLesson(lesson1Problem, lesson1Constraints);
  console.log(`✅ Created lesson: ${lesson1Id}`);

  // Generate podcast for lesson 1
  console.log('🎙️  Generating podcast...');
  const podcast1Id = await generatePodcast(lesson1Id);
  console.log(`✅ Created podcast: ${podcast1Id}`);

  // Create export for lesson 1
  console.log('📦 Creating export...');
  const export1Id = await createExport(lesson1Id);
  console.log(`✅ Created export: ${export1Id}\n`);

  // Example Lesson 2: Fault-Tolerant Vision Model Training
  console.log('📚 Lesson 2: Fault-Tolerant Vision Model Training');
  const lesson2Problem = `Build a cost-optimized training pipeline for a CLIP-scale vision-language model using AWS spot instances. The system must maintain training stability despite preemptions, achieve throughput of at least 1000 samples per second, and use data parallelism across 64 GPUs. Implement efficient data loading from S3, automatic checkpoint saving every 10 minutes, and graceful recovery from spot instance terminations.`;
  const lesson2Constraints = [
    'Cost: Use spot instances (75% cost savings vs. on-demand)',
    'Throughput: Minimum 1000 samples/second',
    'Hardware: 64 V100 GPUs (mix of spot instances)',
    'Data: Stream from S3 with 10TB dataset',
    'Checkpointing: Automatic saves every 10 minutes',
    'Recovery: Resume within 2 minutes of preemption',
  ];

  const lesson2Id = await generateLesson(lesson2Problem, lesson2Constraints);
  console.log(`✅ Created lesson: ${lesson2Id}`);

  // Generate podcast for lesson 2
  console.log('🎙️  Generating podcast...');
  const podcast2Id = await generatePodcast(lesson2Id);
  console.log(`✅ Created podcast: ${podcast2Id}`);

  // Create export for lesson 2
  console.log('📦 Creating export...');
  const export2Id = await createExport(lesson2Id);
  console.log(`✅ Created export: ${export2Id}\n`);

  console.log('✨ Example lessons created successfully!');
  console.log('\nYou can now:');
  console.log(`- View Lesson 1: http://localhost:3000/lessons/${lesson1Id}`);
  console.log(`- View Lesson 2: http://localhost:3000/lessons/${lesson2Id}`);
}

main()
  .catch((e) => {
    console.error('❌ Failed to create example lessons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
