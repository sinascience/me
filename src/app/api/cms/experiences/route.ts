import { NextRequest, NextResponse } from 'next/server';
import { getExperiences } from '@/lib/cms';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // If active filter is requested, use the CMS helper (public use)
    if (active !== null) {
      const experiences = await getExperiences({ 
        active: active === 'true' || undefined 
      });
      return NextResponse.json(experiences);
    }

    // Otherwise return all experiences for admin use (requires auth)
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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