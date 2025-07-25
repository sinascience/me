import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/cms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active') === 'true';

    const skills = await getSkills({ 
      category: category || undefined, 
      active: active || undefined 
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}