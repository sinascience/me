import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        achievements: {
          orderBy: { order: 'asc' }
        },
        skills: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { achievements, skills, startDate, endDate, current, ...experienceData } = body;

    // Convert date fields to period string
    const period = current 
      ? `${startDate} - Present`
      : `${startDate} - ${endDate || ''}`;

    // Delete existing relationships
    await prisma.experienceAchievement.deleteMany({
      where: { experienceId: id }
    });
    
    await prisma.experienceSkill.deleteMany({
      where: { experienceId: id }
    });

    // Update experience with new data
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...experienceData,
        period,
        achievements: {
          create: achievements?.map((item: any, index: number) => ({
            achievement: item.title || item.achievement || '',
            order: index
          })) || []
        },
        skills: {
          create: skills?.map((item: any, index: number) => ({
            skill: item.name || item.skill || '',
            order: index
          })) || []
        }
      },
      include: {
        achievements: {
          orderBy: { order: 'asc' }
        },
        skills: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    await prisma.experience.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}