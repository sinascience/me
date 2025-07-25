import { NextResponse } from 'next/server';
import { getTechStack } from '@/lib/cms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active') === 'true';

    const techStack = await getTechStack({ 
      category: category || undefined, 
      active: active || undefined 
    });
    
    return NextResponse.json(techStack);
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    return NextResponse.json({ error: 'Failed to fetch tech stack' }, { status: 500 });
  }
}