import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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