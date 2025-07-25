import { NextResponse } from 'next/server';
import { getBlog } from '@/lib/cms';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await getBlog(params.slug);
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}