'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Instance {
  id: string;
  title: string;
  contentMdx: string;
  imageBase64: string | null;
  quiz: string;
  concept: {
    id: string;
    title: string;
    summary: string;
    level: string;
    domain: string;
    tags: string;
  };
}

interface Props {
  instance: Instance;
}

export default function FlipCard({ instance }: Props) {
  const [flipped, setFlipped] = useState(false);
  const tags = JSON.parse(instance.concept.tags) as string[];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const levelColors: { [key: string]: string } = {
    beginner: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-green-100 text-green-800',
    advanced: 'bg-purple-100 text-purple-800',
  };

  return (
    <div
      className={`flip-card ${flipped ? 'flipped' : ''} cursor-pointer h-96`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner relative w-full h-full">
        {/* Front */}
        <div className="flip-card-front absolute w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 flex flex-col justify-between text-white">
          <div>
            <h3 className="text-xl font-bold mb-3">{instance.title}</h3>
            <p className="text-sm opacity-90 mb-4">{instance.concept.summary}</p>
          </div>
          
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[instance.concept.level] || 'bg-gray-100 text-gray-800'}`}>
                {instance.concept.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
                {instance.concept.domain}
              </span>
            </div>
            <div className="text-xs opacity-75">
              Click to flip and learn more →
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-lg p-6 overflow-auto border-2 border-indigo-600">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-bold text-indigo-600 mb-3">{instance.title}</h3>
            <div className="text-gray-700 markdown-content">
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-xs">
                        <code {...props}>{children}</code>
                      </pre>
                    );
                  },
                  h1: ({ children }) => <h4 className="text-base font-bold mt-4 mb-2">{children}</h4>,
                  h2: ({ children }) => <h5 className="text-sm font-bold mt-3 mb-1">{children}</h5>,
                  h3: ({ children }) => <h6 className="text-sm font-semibold mt-2 mb-1">{children}</h6>,
                  p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-sm space-y-1">{children}</ul>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                }}
              >
                {instance.contentMdx.substring(0, 600)}
              </ReactMarkdown>
              {instance.contentMdx.length > 600 && (
                <p className="text-xs text-gray-400 mt-2">...</p>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
