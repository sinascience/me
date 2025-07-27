/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');

    const where: any = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by published status
    if (published === 'true') {
      where.status = 'published';
    }

    // Filter by featured
    if (featured === 'true') {
      where.featured = true;
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true
          },
          orderBy: { tag: { name: 'asc' } }
        }
      },
      orderBy: [
        { featured: 'desc' }, // Featured posts first
        { publishedAt: 'desc' }, // Then by publish date
        { createdAt: 'desc' } // Finally by creation date
      ]
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}