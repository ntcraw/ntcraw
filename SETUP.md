# Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma migrate dev --name init

# 3. Seed concepts (85 concepts)
npm run seed

# 4. (Optional) Seed example lessons
npm run seed:examples

# 5. Start development server
npm run dev
```

Open http://localhost:3000

## What's Been Created

### Example Lessons

After running `npm run seed:examples`, you'll have 2 complete lessons:

1. **Multi-Node GPT Training** - Infrastructure for training 175B parameter models across 256 A100 GPUs
2. **Fault-Tolerant Vision Model Training** - Cost-optimized CLIP-scale training on spot instances

Each lesson includes:
- 6-8 interactive flip cards covering relevant concepts
- Multi-role analysis (6 perspectives)
- Generated podcast with chapters
- Exportable single-file HTML

### Knowledge Graph

The system includes **85 concepts** across 13 domains:
- Training (25 concepts)
- Compute (5 concepts)
- Networking (6 concepts)
- Data (8 concepts)
- Storage (4 concepts)
- MLOps (5 concepts)
- Orchestration (6 concepts)
- Optimization (4 concepts)
- Architecture (6 concepts)
- Evaluation (3 concepts)
- Reliability (3 concepts)
- Cost (3 concepts)
- Monitoring (2 concepts)

## Features

✅ Interactive knowledge graph with prerequisite relationships  
✅ Problem-based lesson generation with concept selection  
✅ Interactive flip cards with MDX content  
✅ Multi-role analysis (6 professional perspectives)  
✅ Podcast generation with TTS support (stubbed for MVP)  
✅ Single-file HTML export (offline-capable)  
✅ Spaced repetition (weak concept tracking)  
✅ Feature flag gated (`MVP_LLM_INFRA_LEARNING=true`)

## Environment Variables

Create `.env` file (already configured):

```env
DATABASE_URL="file:./dev.db"
MVP_LLM_INFRA_LEARNING=true
REDIS_URL="redis://localhost:6379"  # Optional
AZURE_TTS_KEY=your_key              # Optional
AZURE_TTS_REGION=eastus             # Optional
```

## Troubleshooting

### Database Issues

```bash
# Reset database
npx prisma migrate reset
npm run seed
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Project Structure

```
/
├── app/                      # Next.js pages
│   ├── page.tsx             # Homepage
│   ├── graph/               # Knowledge graph
│   ├── lessons/             # Lesson management
│   └── api/                 # API endpoints
├── components/              # React components
│   ├── FlipCard.tsx
│   ├── GraphVisualization.tsx
│   ├── LessonGeneratorForm.tsx
│   └── RolePlayingSection.tsx
├── lib/                     # Core logic
│   ├── lesson-generator.ts
│   ├── podcast-generator.ts
│   ├── export-generator.ts
│   └── graph-utils.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── concepts-seed.json   # 85 concepts
└── scripts/
    └── seed-example-lessons.ts
```

## Next Steps

1. **Explore the knowledge graph**: http://localhost:3000/graph
2. **View example lessons**: http://localhost:3000/lessons
3. **Generate a new lesson**: http://localhost:3000/lessons/new
4. **Check the README.md** for detailed documentation

## MVP Scope

This is an MVP with the following limitations:
- No authentication (single-user)
- Stub TTS audio (10-second silence)
- In-memory queue workers
- Local progress tracking only
- No external image generation

For production use, see README.md for enhancement suggestions.
