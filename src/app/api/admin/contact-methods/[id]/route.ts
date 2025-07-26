import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const contactMethod = await prisma.contactMethod.findUnique({
      where: { id }
    });
    
    if (!contactMethod) {
      return NextResponse.json({ error: 'Contact method not found' }, { status: 404 });
    }
    
    return NextResponse.json(contactMethod);
  } catch (error) {
    console.error('Error fetching contact method:', error);
    return NextResponse.json({ error: 'Failed to fetch contact method' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const contactMethod = await prisma.contactMethod.update({
      where: { id },
      data: body
    });
    
    return NextResponse.json(contactMethod);
  } catch (error) {
    console.error('Error updating contact method:', error);
    return NextResponse.json({ error: 'Failed to update contact method' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.contactMethod.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact method:', error);
    return NextResponse.json({ error: 'Failed to delete contact method' }, { status: 500 });
  }
}