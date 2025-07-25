import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/cms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') === 'true';
    const featured = searchParams.get('featured') === 'true';

    const projects = await getProjects({ 
      published: published || undefined, 
      featured: featured || undefined 
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}