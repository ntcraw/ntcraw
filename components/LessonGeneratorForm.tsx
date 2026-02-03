'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  weakConcepts: string[];
}

export default function LessonGeneratorForm({ weakConcepts }: Props) {
  const router = useRouter();
  const [problem, setProblem] = useState('');
  const [constraints, setConstraints] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddConstraint = () => {
    setConstraints([...constraints, '']);
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleConstraintChange = (index: number, value: string) => {
    const newConstraints = [...constraints];
    newConstraints[index] = value;
    setConstraints(newConstraints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemStatement: problem,
          constraints: constraints.filter(c => c.trim() !== ''),
          weakConcepts,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson');
      }

      const data = await response.json();
      router.push(`/lessons/${data.lessonId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
          Problem Statement *
        </label>
        <textarea
          id="problem"
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe the training infrastructure problem you want to solve..."
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Be specific about the model size, hardware requirements, performance targets, etc.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Constraints
          </label>
          <button
            type="button"
            onClick={handleAddConstraint}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            + Add Constraint
          </button>
        </div>
        <div className="space-y-2">
          {constraints.map((constraint, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={constraint}
                onChange={(e) => handleConstraintChange(index, e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Constraint ${index + 1} (e.g., budget under $100k, max 48h training time)`}
              />
              {constraints.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveConstraint(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading || !problem.trim()}
          className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          {loading ? 'Generating Lesson...' : 'Generate Lesson'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/lessons')}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-600">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
          <p>Analyzing problem and selecting concepts...</p>
        </div>
      )}
    </form>
  );
}
