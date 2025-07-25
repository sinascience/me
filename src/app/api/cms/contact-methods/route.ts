import { NextResponse } from 'next/server';
import { getContactMethods } from '@/lib/cms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';

    const contactMethods = await getContactMethods({ 
      active: active || undefined 
    });
    
    return NextResponse.json(contactMethods);
  } catch (error) {
    console.error('Error fetching contact methods:', error);
    return NextResponse.json({ error: 'Failed to fetch contact methods' }, { status: 500 });
  }
}