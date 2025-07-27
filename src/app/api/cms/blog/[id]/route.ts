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

  const id = (await params).id

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
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
    const data = await request.json();
    const { tags, ...blogData } = data;
    const id = (await params).id

    // If tags are provided, update them
    if (tags) {
      // Delete existing tag relationships
      await prisma.blogTag.deleteMany({
        where: { blogId: id }
      });

      // Create new tag relationships
      if (tags.length > 0) {
        await prisma.blogTag.createMany({
          data: tags.map((tagName: string) => ({
            blogId: id,
            tagId: tagName // This assumes tagName is actually the tag ID
          }))
        });
      }
    }

    const blog = await prisma.blog.update({
      where: { id: id },
      data: blogData,
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
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = (await params).id

  try {
    // Delete related data first
    await prisma.blogTag.deleteMany({
      where: { blogId: id }
    });

    // Delete the blog
    await prisma.blog.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}