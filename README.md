# AI Infrastructure Learning System (MVP)

An interactive learning system for large-model training infrastructure, featuring problem-oriented lessons, knowledge graph visualization, role-playing analysis, and spaced repetition.

## 🌟 Features

### Knowledge Graph (80+ Concepts)
- Interactive visualization with Cytoscape.js
- 85 concepts covering distributed training, infrastructure, optimization, and more
- Prerequisite relationship mapping
- Filter by domain and highlight prerequisite paths
- Clustered by domain (training, compute, networking, data, storage, etc.)

### Problem-Oriented Lesson Generation
- Generate lessons from real training infrastructure problems
- 6-8 interactive flip cards per lesson
- Each card focuses on one concept with MDX content
- Automatic concept selection based on problem relevance
- Spaced repetition: weak concepts prioritized in next generation

### Role-Playing Analysis
- 6-role perspective system:
  - Infrastructure Architect
  - Data Lead
  - Training Engineer
  - SRE (Site Reliability Engineer)
  - Cost Officer
  - Red Team
- Each role provides: view, evidence, risks, trade-offs, and actions

### Interactive Flip Cards
- Front: Concept overview, level, domain, tags
- Back: Detailed MDX content with code blocks and diagrams
- Keyboard shortcut: Press `F` to flip all cards
- Mermaid diagram support

### Podcast Generation
- Auto-generate podcast scripts from lessons
- Chapter navigation with timestamps
- TTS integration (Azure Cognitive Services, pluggable adapters)
- Show notes with concept breakdown
- Cross-linked to interactive lessons

### Single-File HTML Export
- Self-contained, offline-capable HTML files
- Inlines CSS, JavaScript, images, and audio
- Interactive flip cards work offline
- Embedded podcast audio as Base64
- Optional service worker for progressive web app features

### Spaced Repetition
- Track weak concepts in user progress
- Automatically prioritize weak concepts in next lesson
- Local progress tracking (no auth required for MVP)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Redis (optional, for queue - uses in-memory fallback)

### Installation

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Seed concepts
npm run seed

# Start development server
npm run dev
```

Visit http://localhost:3000

### Environment Variables

Create a `.env` file:

```env
# Required
DATABASE_URL="file:./dev.db"
MVP_LLM_INFRA_LEARNING=true

# Optional - Redis for queues (uses fallback if not available)
REDIS_URL="redis://localhost:6379"

# Optional - Azure TTS (uses stub audio if not provided)
AZURE_TTS_KEY=your_key_here
AZURE_TTS_REGION=eastus
```

## 📚 Usage

### 1. Explore the Knowledge Graph

Navigate to `/graph` to see the full concept network:
- Filter by domain (training, compute, networking, etc.)
- Click nodes to highlight prerequisite paths
- Zoom and pan to explore relationships

### 2. Generate a Lesson

Navigate to `/lessons/new`:

1. Enter a training infrastructure problem (e.g., "Design infrastructure to train a 175B parameter model across 256 GPUs")
2. Add constraints (budget, timeline, uptime requirements)
3. Click "Generate Lesson"

The system will:
- Analyze the problem
- Select 6-8 relevant concepts
- Prioritize weak concepts from your progress
- Generate flip cards with MDX content
- Create role-playing analysis

### 3. Study with Flip Cards

On the lesson page:
- Click cards to flip and reveal detailed content
- Read code examples, diagrams, and explanations
- Press `F` to flip all cards at once
- Track your understanding

### 4. Explore Multi-Role Analysis

Switch between roles to see different perspectives:
- Technical considerations (Architect, Training Engineer)
- Operational concerns (SRE)
- Business factors (Cost Officer)
- Risk assessment (Red Team)
- Data pipeline (Data Lead)

### 5. Generate Podcast

Click "Generate Podcast" to:
- Create audio narration of the lesson
- Get chapter timestamps
- Listen on the go
- Review show notes

### 6. Export for Offline Learning

Click "Export HTML" to:
- Generate single-file HTML
- Download for offline use
- Share with others
- No internet required after download

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + SQLite (dev) / PostgreSQL (production-ready)
- **Styling**: Tailwind CSS
- **Graph**: Cytoscape.js with cose-bilkent layout
- **Queues**: BullMQ + Redis (in-process workers for dev)
- **Content**: MDX with react-markdown
- **Diagrams**: Mermaid (embedded in cards)

### Project Structure

```
/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage
│   ├── graph/               # Knowledge graph visualization
│   ├── lessons/             # Lesson pages
│   │   ├── page.tsx         # Lesson list
│   │   ├── new/             # Lesson generator
│   │   └── [id]/            # Lesson detail & podcast
│   └── api/                 # API routes
│       └── lessons/         # Generation & export endpoints
├── components/              # React components
│   ├── FlipCard.tsx         # Interactive flip card
│   ├── GraphVisualization.tsx
│   ├── LessonGeneratorForm.tsx
│   └── RolePlayingSection.tsx
├── lib/                     # Core logic
│   ├── prisma.ts            # Database client
│   ├── feature-flags.ts     # MVP flag
│   ├── queue.ts             # BullMQ setup
│   ├── lesson-generator.ts  # Lesson generation logic
│   ├── podcast-generator.ts # Podcast & TTS
│   ├── export-generator.ts  # Single-file HTML export
│   └── graph-utils.ts       # Graph data transformations
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed script
│   └── concepts-seed.json   # 85 concepts with relationships
└── README.md
```

### Data Model

#### Concepts
- `id`, `title`, `summary`, `level`, `domain`
- `tags[]` - searchable tags
- `prereqIds[]` - prerequisite concept IDs
- `resources[]` - external learning resources

#### Lessons
- `problem`, `constraints[]`, `objectives[]`
- `requiredConceptIds[]` - concepts covered
- Linked to instances, podcasts, exports

#### Instances (Flip Cards)
- MDX content for front/back
- Quiz questions
- Optional images (Base64)
- Order within lesson

#### Podcasts
- MDX script
- Audio (Base64 WAV)
- Chapters with timestamps

#### Exports
- Single-file HTML blob
- Self-contained with all assets

#### Progress (Spaced Repetition)
- `localKey` - browser fingerprint
- `weakConcepts[]` - concepts to reinforce
- `status`, `scores`

## 🎯 Seed Data

The system includes **85 concepts** across domains:

### Domains
- **Training** (25 concepts): Distributed training, parallelism, optimization
- **Compute** (5 concepts): GPU architecture, CUDA, tensor cores
- **Networking** (6 concepts): InfiniBand, NCCL, communication patterns
- **Data** (8 concepts): Pipelines, sharding, preprocessing, quality
- **Storage** (4 concepts): Object storage, file systems, checkpoints
- **MLOps** (5 concepts): Tracking, versioning, reproducibility
- **Orchestration** (6 concepts): Kubernetes, schedulers, resource allocation
- **Optimization** (4 concepts): Quantization, pruning, distillation
- **Architecture** (6 concepts): Transformers, attention, embeddings
- **Evaluation** (3 concepts): Metrics, benchmarks, safety
- **Reliability** (3 concepts): Fault tolerance, elastic training
- **Cost** (3 concepts): Modeling, optimization, carbon footprint
- **Monitoring** (2 concepts): GPU utilization, profiling

### Levels
- **Beginner**: Foundational concepts (33 concepts)
- **Intermediate**: Practical implementation (36 concepts)
- **Advanced**: Cutting-edge techniques (16 concepts)

## 🔧 Adding New Concepts

Edit `prisma/concepts-seed.json`:

```json
{
  "id": "c086",
  "title": "Your Concept",
  "summary": "Brief description",
  "level": "intermediate",
  "domain": "training",
  "tags": ["tag1", "tag2"],
  "prereqIds": ["c001", "c002"],
  "resources": [
    {
      "type": "doc",
      "url": "https://...",
      "title": "Resource Name"
    }
  ]
}
```

Then re-seed:

```bash
npm run seed
```

## 📖 Example Lessons

### Example 1: Multi-Node GPT Training

**Problem**: Design infrastructure to train a 175B parameter GPT model across 256 A100 GPUs with 99.9% uptime and cost under $500k.

**Selected Concepts**:
- Distributed Training Basics
- Data Parallelism
- Model Parallelism
- Pipeline Parallelism
- ZeRO Optimizer
- InfiniBand Networking
- Checkpoint Storage
- Fault Tolerance

### Example 2: Fault-Tolerant Training Pipeline

**Problem**: Implement a training system that can recover from node failures within 5 minutes without losing more than 10 minutes of training progress.

**Selected Concepts**:
- Fault Tolerance
- Elastic Training
- Checkpoint Storage
- Distributed Optimizer State
- All-Reduce Communication Pattern
- Training Stability
- Loss Spike Recovery
- Spot Instance Training

### Example 3: Cost-Optimized Vision Model

**Problem**: Train a CLIP-scale vision-language model using spot instances while maintaining training stability and throughput above 1000 samples/sec.

**Selected Concepts**:
- Spot Instance Training
- Large Batch Training
- Mixed Precision Training
- Data Loading Pipeline
- Throughput Optimization
- Cost Modeling
- GPU Utilization Monitoring
- Gradient Accumulation

## 🧪 Development

### Running Tests

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

### Queue Workers

For development, workers run in-process. For production:

```bash
# Start separate worker process
node --loader tsx lib/worker.ts
```

## 🚢 Deployment

### Vercel (Web App)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables:
- `DATABASE_URL` → PostgreSQL connection string
- `REDIS_URL` → Redis instance
- `MVP_LLM_INFRA_LEARNING=true`
- `AZURE_TTS_KEY` and `AZURE_TTS_REGION` (optional)

### Render (Background Workers)

For production-scale lesson/podcast generation, deploy workers separately:

1. Create new Background Worker on Render
2. Set build command: `npm install && npx prisma generate`
3. Set start command: `node --loader tsx lib/worker.ts`
4. Add same environment variables

## 🎛️ Feature Flag

The entire MVP is behind a feature flag:

```env
MVP_LLM_INFRA_LEARNING=true
```

Set to `false` to disable all MVP features.

## 🔌 TTS Provider Adapters

### Azure Cognitive Services (Default)

```typescript
import { AzureTTSProvider } from '@/lib/podcast-generator';

const provider = new AzureTTSProvider(
  process.env.AZURE_TTS_KEY!,
  process.env.AZURE_TTS_REGION!
);

const audioBuffer = await provider.generate(script);
```

### ElevenLabs (Alternative)

```typescript
import { ElevenLabsProvider } from '@/lib/podcast-generator';

const provider = new ElevenLabsProvider(process.env.ELEVENLABS_API_KEY!);
const audioBuffer = await provider.generate(script);
```

### Custom Provider

Implement the `TTSProvider` interface:

```typescript
export interface TTSProvider {
  generate(text: string): Promise<Buffer>;
}
```

## 🐛 Troubleshooting

### Redis Connection Error

If Redis is not available:
- Queue functionality degrades gracefully
- Lesson generation still works (synchronous)
- Warning logged to console

### Prisma Migration Issues

```bash
# Reset and re-seed
npx prisma migrate reset
npm run seed
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📝 License

MIT

## 🤝 Contributing

This is an MVP. For production use:
- Add authentication & multi-user support
- Implement production-grade worker infrastructure
- Add external image generation (DALL-E, Stable Diffusion)
- Expand evaluation rubrics
- Add deployment automation

## 📧 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for AI infrastructure engineers
