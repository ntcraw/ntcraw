import { NextRequest, NextResponse } from 'next/server';
import { generatePodcast } from '@/lib/podcast-generator';
import { redirect } from 'next/navigation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    
    await generatePodcast(lessonId);

    // Redirect to podcast page
    return redirect(`/lessons/${lessonId}/podcast`);
  } catch (error) {
    console.error('Error generating podcast:', error);
    return NextResponse.json(
      { error: 'Failed to generate podcast' },
      { status: 500 }
    );
  }
}
