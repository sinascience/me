import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Personal information keys for public API
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
      }
    });

    // Default values
    const defaultValues = {
      name: 'Anis Fajar',
      greeting: 'Hi, I\'m',
      profession: 'Versatile Full-Stack Developer',
      short_description: 'Senior Full-Stack Developer with **3+ years** of hands-on experience building enterprise-level applications. Currently leading technical architecture for healthcare systems serving **400K+ monthly users**.',
      bio: '',
      location: 'Indonesia',
      timezone: 'UTC+7 (WIB)',
      profile_photo: '/profile.png',
      resume_url: '/resume',
      years_experience: 3
    };

    // Convert database settings to key-value object
    const databaseInfo = personalSettings.reduce((acc, setting) => {
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
      
      acc[setting.key] = value;
      return acc;
    }, {} as Record<string, any>);

    // Merge defaults with database values (database values override defaults)
    const personalInfo = { ...defaultValues, ...databaseInfo };

    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error('Error fetching personal information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personal information' },
      { status: 500 }
    );
  }
}