import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projectId = (await params).id;

    // Delete all related data for the project
    await prisma.$transaction([
      prisma.projectTech.deleteMany({
        where: { projectId }
      }),
      prisma.projectMetric.deleteMany({
        where: { projectId }
      }),
      prisma.projectFeature.deleteMany({
        where: { projectId }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project relations:', error);
    return NextResponse.json({ error: 'Failed to delete project relations' }, { status: 500 });
  }
}