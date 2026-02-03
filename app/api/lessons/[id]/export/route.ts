import { NextRequest, NextResponse } from 'next/server';
import { createExport } from '@/lib/export-generator';
import { redirect } from 'next/navigation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    
    await createExport(lessonId);

    // Redirect back to lesson page
    return redirect(`/lessons/${lessonId}`);
  } catch (error) {
    console.error('Error creating export:', error);
    return NextResponse.json(
      { error: 'Failed to create export' },
      { status: 500 }
    );
  }
}
