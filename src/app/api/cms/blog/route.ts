import { NextRequest, NextResponse } from 'next/server';
import { getBlogs } from '@/lib/cms';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // If published filter is requested, use the CMS helper (public use)
    if (published !== null || featured || limit || offset) {
      const blogs = await getBlogs({ 
        published: published === 'true' || undefined,
        featured: featured || undefined,
        limit,
        offset
      });
      return NextResponse.json(blogs);
    }

    // Otherwise return all blogs for admin use (requires auth)
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blogs = await prisma.blog.findMany({
      include: {
        tags: {
          include: {
            tag: true
          },
          orderBy: { tag: { name: 'asc' } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { tags, ...blogData } = data;

    const blog = await prisma.blog.create({
      data: {
        ...blogData,
        tags: {
          create: tags?.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { 
                  name: tagName,
                  color: '#64748b' // Default color
                }
              }
            }
          })) || []
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}