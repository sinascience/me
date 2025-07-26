import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Personal information keys that we'll manage
const PERSONAL_KEYS = [
  'name',
  'greeting', 
  'profession',
  'short_description',
  'bio',
  'location',
  'timezone',
  'profile_photo',
  'resume_url',
  'years_experience'
];

export async function GET() {
  try {
    const personalSettings = await prisma.settings.findMany({
      where: {
        key: {
          in: PERSONAL_KEYS
        }
      },
      orderBy: { key: 'asc' }
    });

    // Convert to key-value object for easier frontend usage
    const personalInfo = personalSettings.reduce((acc, setting) => {
      let value = setting.value;
      
      // Parse values based on type
      switch (setting.type) {
        case 'number':
          value = Number(setting.value);
          break;
        case 'boolean':
          value = setting.value === 'true';
          break;
        case 'json':
          try {
            value = JSON.parse(setting.value);
          } catch (e) {
            value = setting.value;
          }
          break;
      }
      
      acc[setting.key] = {
        value,
        type: setting.type
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personal information' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const personalData = await request.json();

    // Update each personal information field
    const updatePromises = Object.entries(personalData).map(async ([key, data]: [string, any]) => {
      if (!PERSONAL_KEYS.includes(key)) {
        return null; // Skip invalid keys
      }

      const { value, type = 'string' } = data;
      
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
          stringValue = String(value || '');
      }

      return prisma.settings.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type }
      });
    });

    // Filter out null promises and execute
    const validPromises = updatePromises.filter(p => p !== null);
    await Promise.all(validPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating personal information:', error);
    return NextResponse.json(
      { error: 'Failed to update personal information' },
      { status: 500 }
    );
  }
}