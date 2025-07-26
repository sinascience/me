import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        achievements: {
          orderBy: { order: 'asc' }
        },
        skills: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { achievements, skills, startDate, endDate, current, ...experienceData } = body;

    // Convert date fields to period string
    const period = current 
      ? `${startDate} - Present`
      : `${startDate} - ${endDate || ''}`;

    const experience = await prisma.experience.create({
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
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}