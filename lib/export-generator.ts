import { prisma } from './prisma';

export async function generateSingleFileHTML(lessonId: string): Promise<string> {
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
      podcasts: true,
    },
  });

  if (!lesson) {
    throw new Error(`Lesson ${lessonId} not found`);
  }

  const objectives = JSON.parse(lesson.objectives) as string[];
  const constraints = JSON.parse(lesson.constraints) as string[];
  
  const podcast = lesson.podcasts[0];
  const chapters = podcast ? JSON.parse(podcast.chapters) : [];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(lesson.title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }

    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    header p {
      font-size: 1.1em;
      opacity: 0.9;
    }

    .content {
      padding: 40px;
    }

    .section {
      margin-bottom: 40px;
    }

    .section h2 {
      font-size: 1.8em;
      color: #667eea;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #667eea;
    }

    .objectives, .constraints {
      background: #f7f9fc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .objectives ul, .constraints ul {
      list-style-position: inside;
      padding-left: 20px;
    }

    .objectives li, .constraints li {
      margin-bottom: 10px;
      padding-left: 10px;
    }

    .flip-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }

    .flip-card {
      perspective: 1000px;
      height: 400px;
      cursor: pointer;
    }

    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }

    .flip-card.flipped .flip-card-inner {
      transform: rotateY(180deg);
    }

    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: auto;
    }

    .flip-card-front {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .flip-card-back {
      background: white;
      color: #333;
      transform: rotateY(180deg);
      text-align: left;
      border: 2px solid #667eea;
    }

    .flip-card-front h3 {
      font-size: 1.5em;
      margin-bottom: 15px;
    }

    .flip-card-front .level {
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
      display: inline-block;
      margin-top: 10px;
      font-size: 0.9em;
    }

    .flip-card-back h3 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 1.3em;
    }

    .flip-card-back p {
      margin-bottom: 10px;
      line-height: 1.8;
    }

    .flip-card-back code {
      background: #f7f9fc;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }

    .flip-card-back pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 15px 0;
      font-size: 0.85em;
    }

    .podcast-section {
      background: #f7f9fc;
      padding: 30px;
      border-radius: 12px;
      margin-top: 30px;
    }

    .podcast-section h2 {
      color: #667eea;
      margin-bottom: 20px;
    }

    audio {
      width: 100%;
      margin: 20px 0;
    }

    .chapters {
      list-style: none;
      padding: 0;
    }

    .chapters li {
      padding: 12px;
      background: white;
      margin-bottom: 8px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chapters li:hover {
      background: #e8eaf6;
    }

    .chapter-title {
      font-weight: 500;
    }

    .chapter-time {
      color: #666;
      font-size: 0.9em;
    }

    .footer {
      background: #2d2d2d;
      color: white;
      padding: 30px;
      text-align: center;
    }

    .footer p {
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .flip-cards {
        grid-template-columns: 1fr;
      }
      
      header h1 {
        font-size: 1.8em;
      }
      
      .content {
        padding: 20px;
      }
    }

    .mermaid {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(lesson.title)}</h1>
      <p>Interactive Learning Experience - Offline Capable</p>
    </header>

    <div class="content">
      <div class="section">
        <h2>🎯 Problem Statement</h2>
        <p style="font-size: 1.1em; line-height: 1.8;">${escapeHtml(lesson.problem)}</p>
      </div>

      <div class="section">
        <h2>📋 Learning Objectives</h2>
        <div class="objectives">
          <ul>
            ${objectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>⚠️ Constraints</h2>
        <div class="constraints">
          <ul>
            ${constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>🎴 Interactive Concept Cards</h2>
        <p style="margin-bottom: 20px; color: #666;">Click any card to flip and reveal detailed content</p>
        <div class="flip-cards">
          ${lesson.instances.map((instance, idx) => `
            <div class="flip-card" onclick="this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <h3>${escapeHtml(instance.title)}</h3>
                  <p>${escapeHtml(instance.concept.summary)}</p>
                  <span class="level">${escapeHtml(instance.concept.level)}</span>
                  <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">📚 Domain: ${escapeHtml(instance.concept.domain)}</p>
                </div>
                <div class="flip-card-back">
                  <h3>${escapeHtml(instance.title)}</h3>
                  ${renderSimplifiedMDX(instance.contentMdx)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${podcast ? `
      <div class="section">
        <div class="podcast-section">
          <h2>🎙️ Podcast Episode</h2>
          <p>Listen to the full lesson in podcast format</p>
          <audio controls>
            <source src="data:audio/wav;base64,${podcast.audioBase64}" type="audio/wav">
            Your browser does not support the audio element.
          </audio>
          <h3 style="margin-top: 30px; margin-bottom: 15px;">Chapters</h3>
          <ul class="chapters">
            ${chapters.map((ch: any) => `
              <li>
                <span class="chapter-title">${escapeHtml(ch.title)}</span>
                <span class="chapter-time">${escapeHtml(ch.timestamp)} (${escapeHtml(ch.duration)})</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      ` : ''}
    </div>

    <footer class="footer">
      <p>Generated by AI Infrastructure Learning System</p>
      <p style="margin-top: 10px; font-size: 0.9em;">This is a self-contained, offline-capable learning resource</p>
    </footer>
  </div>

  <script>
    // Service worker for offline capability (optional)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const sw = \`
          self.addEventListener('fetch', event => {
            event.respondWith(
              caches.match(event.request).then(response => {
                return response || fetch(event.request);
              })
            );
          });
        \`;
        const blob = new Blob([sw], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        navigator.serviceWorker.register(url).catch(() => {
          // Service worker registration failed, continue without it
        });
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') {
        const cards = document.querySelectorAll('.flip-card');
        cards.forEach(card => card.classList.toggle('flipped'));
      }
    });

    console.log('AI Infrastructure Learning - Offline HTML Export');
    console.log('Press "F" to flip all cards');
  </script>
</body>
</html>`;

  return html;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function renderSimplifiedMDX(mdx: string): string {
  // Simple MDX to HTML conversion for embedded content
  let html = mdx;

  // Handle headers
  html = html.replace(/^# (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^### (.+)$/gm, '<h6>$1</h6>');

  // Handle bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Handle inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle code blocks
  html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Handle lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Handle paragraphs
  html = html.split('\n\n').map(para => {
    if (para.trim().startsWith('<') || para.trim() === '') {
      return para;
    }
    return `<p>${para.trim()}</p>`;
  }).join('\n');

  // Clean up mermaid blocks (remove for simplicity in export)
  html = html.replace(/```mermaid[\s\S]+?```/g, '<p><em>[Diagram available in interactive version]</em></p>');

  return html;
}

export async function createExport(lessonId: string): Promise<string> {
  const htmlBlob = await generateSingleFileHTML(lessonId);

  const exportRecord = await prisma.export.create({
    data: {
      lessonId,
      htmlBlob,
    },
  });

  return exportRecord.id;
}
