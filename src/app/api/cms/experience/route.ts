import { NextResponse } from 'next/server';
import { getExperiences } from '@/lib/cms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';

    const experiences = await getExperiences({ 
      active: active || undefined 
    });
    
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}