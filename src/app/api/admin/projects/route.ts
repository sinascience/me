import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { techStack, metrics, features, images, ...projectData } = data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        techStack: {
          create: techStack.map((tech: any, index: number) => ({
            name: tech.name,
            order: index
          }))
        },
        metrics: {
          create: metrics.map((metric: any, index: number) => ({
            label: metric.label,
            value: metric.value,
            icon: metric.icon,
            color: metric.color,
            order: index
          }))
        },
        features: {
          create: features.map((feature: any, index: number) => ({
            title: feature.title,
            description: feature.description,
            impact: feature.impact || '',
            order: index
          }))
        },
        images: {
          create: images?.map((imageUrl: string, index: number) => ({
            url: imageUrl,
            order: index
          })) || []
        }
      },
      include: {
        techStack: true,
        metrics: true,
        features: true,
        images: true
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      include: {
        techStack: {
          orderBy: { order: 'asc' }
        },
        metrics: {
          orderBy: { order: 'asc' }
        },
        features: {
          orderBy: { order: 'asc' }
        },
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}