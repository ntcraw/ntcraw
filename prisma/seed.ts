import { PrismaClient } from '@prisma/client';
import conceptsData from './concepts-seed.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.progress.deleteMany();
  await prisma.export.deleteMany();
  await prisma.podcast.deleteMany();
  await prisma.instance.deleteMany();
  await prisma.lessonConcept.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.concept.deleteMany();

  console.log('📚 Seeding concepts...');
  
  // Seed concepts
  for (const concept of conceptsData) {
    await prisma.concept.create({
      data: {
        id: concept.id,
        title: concept.title,
        summary: concept.summary,
        level: concept.level,
        domain: concept.domain,
        tags: JSON.stringify(concept.tags),
        prereqIds: JSON.stringify(concept.prereqIds),
        resources: JSON.stringify(concept.resources),
      },
    });
  }

  console.log(`✅ Seeded ${conceptsData.length} concepts`);
  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
