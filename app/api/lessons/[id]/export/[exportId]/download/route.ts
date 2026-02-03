import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; exportId: string }> }
) {
  const { id, exportId } = await params;
  try {
    const exportRecord = await prisma.export.findUnique({
      where: { id: exportId },
      include: {
        lesson: true,
      },
    });

    if (!exportRecord) {
      return NextResponse.json(
        { error: 'Export not found' },
        { status: 404 }
      );
    }

    const filename = `${exportRecord.lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;

    return new NextResponse(exportRecord.htmlBlob, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading export:', error);
    return NextResponse.json(
      { error: 'Failed to download export' },
      { status: 500 }
    );
  }
}
