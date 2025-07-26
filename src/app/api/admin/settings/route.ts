import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value, type = 'string' } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Convert value to string based on type
    let stringValue: string;
    switch (type) {
      case 'json':
        stringValue = JSON.stringify(value);
        break;
      case 'boolean':
        stringValue = String(Boolean(value));
        break;
      case 'number':
        stringValue = String(Number(value));
        break;
      default:
        stringValue = String(value);
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: stringValue, type },
      create: { key, value: stringValue, type }
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error saving setting:', error);
    return NextResponse.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    );
  }
}