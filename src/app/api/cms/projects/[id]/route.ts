/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const { id: projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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
    const { id: projectId } = await params;
    const data = await request.json();

    // Separate project data from relations
    const { techStack, metrics, features, images, ...projectData } = data;

    // Update project basic data
    await prisma.project.update({
      where: { id: projectId },
      data: projectData
    });

    // Update tech stack if provided
    if (techStack) {
      // Delete existing tech stack
      await prisma.projectTech.deleteMany({
        where: { projectId }
      });

      // Create new tech stack
      if (techStack.length > 0) {
        await prisma.projectTech.createMany({
          data: techStack.map((tech: any, index: number) => ({
            projectId,
            name: tech.name,
            order: tech.order ?? index
          }))
        });
      }
    }

    // Update metrics if provided
    if (metrics) {
      // Delete existing metrics
      await prisma.projectMetric.deleteMany({
        where: { projectId }
      });

      // Create new metrics
      if (metrics.length > 0) {
        await prisma.projectMetric.createMany({
          data: metrics.map((metric: any, index: number) => ({
            projectId,
            label: metric.label,
            value: metric.value,
            icon: metric.icon,
            color: metric.color,
            order: metric.order ?? index
          }))
        });
      }
    }

    // Update features if provided
    if (features) {
      // Delete existing features
      await prisma.projectFeature.deleteMany({
        where: { projectId }
      });

      // Create new features
      if (features.length > 0) {
        await prisma.projectFeature.createMany({
          data: features.map((feature: any, index: number) => ({
            projectId,
            title: feature.title,
            description: feature.description,
            impact: feature.impact || null,
            order: feature.order ?? index
          }))
        });
      }
    }

    // Update images if provided
    if (images) {
      // Delete existing images
      await prisma.projectImage.deleteMany({
        where: { projectId }
      });

      // Create new images
      if (images.length > 0) {
        await prisma.projectImage.createMany({
          data: images.map((imageUrl: string, index: number) => ({
            projectId,
            url: imageUrl,
            order: index
          }))
        });
      }
    }

    // Fetch the updated project with all relations
    const finalProject = await prisma.project.findUnique({
      where: { id: projectId },
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
      }
    });

    return NextResponse.json(finalProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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
    const { id: projectId } = await params;

    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}