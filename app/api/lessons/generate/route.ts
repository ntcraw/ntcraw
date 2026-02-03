import { NextRequest, NextResponse } from 'next/server';
import { generateLesson } from '@/lib/lesson-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemStatement, constraints, weakConcepts } = body;

    if (!problemStatement || !problemStatement.trim()) {
      return NextResponse.json(
        { error: 'Problem statement is required' },
        { status: 400 }
      );
    }

    const lessonId = await generateLesson(
      problemStatement,
      constraints || [],
      weakConcepts || []
    );

    return NextResponse.json({ lessonId, success: true });
  } catch (error) {
    console.error('Error generating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
