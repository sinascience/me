import { NextRequest, NextResponse } from 'next/server';
import { getSkills } from '@/lib/cms';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active') === 'true';

    // If active filter is requested, use the CMS helper (public use)
    if (active !== undefined || category) {
      const skills = await getSkills({ 
        category: category || undefined, 
        active: active || undefined 
      });
      return NextResponse.json(skills);
    }

    // Otherwise return all skills for admin use (requires auth)
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const skill = await prisma.skill.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        proficiency: data.proficiency,
        color: data.color,
        icon: data.icon,
        order: data.order,
        status: data.status || 'active'
      }
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}