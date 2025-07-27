import { NextResponse } from 'next/server';
import { getContactMethods } from '@/lib/cms';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active') === 'true';

    // If active filter is requested, use the CMS helper (public use)
    if (active !== undefined) {
      const contactMethods = await getContactMethods({ 
        active: active || undefined 
      });
      return NextResponse.json(contactMethods);
    }

    // Otherwise return all contact methods (admin use)
    const contactMethods = await prisma.contactMethod.findMany({
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(contactMethods);
  } catch (error) {
    console.error('Error fetching contact methods:', error);
    return NextResponse.json({ error: 'Failed to fetch contact methods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const contactMethod = await prisma.contactMethod.create({
      data: body
    });
    
    return NextResponse.json(contactMethod);
  } catch (error) {
    console.error('Error creating contact method:', error);
    return NextResponse.json({ error: 'Failed to create contact method' }, { status: 500 });
  }
}