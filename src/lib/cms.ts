import { prisma } from './prisma';
import { supabase } from './supabase';

// Projects
export async function getProjects(options?: { published?: boolean; featured?: boolean }) {
  const where: any = {};
  
  if (options?.published) {
    where.status = 'published';
  }
  
  if (options?.featured) {
    where.featured = true;
  }

  return await prisma.project.findMany({
    where,
    include: {
      techStack: {
        orderBy: { order: 'asc' }
      },
      metrics: {
        orderBy: { order: 'asc' }
      },
      features: {
        orderBy: { order: 'asc' }
      },
      images: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });
}

export async function getProject(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      techStack: {
        orderBy: { order: 'asc' }
      },
      metrics: {
        orderBy: { order: 'asc' }
      },
      features: {
        orderBy: { order: 'asc' }
      },
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });
}

// Skills
export async function getSkills(options?: { category?: string; active?: boolean }) {
  const where: any = {};
  
  if (options?.category) {
    where.category = options.category;
  }
  
  if (options?.active) {
    where.status = 'active';
  }

  return await prisma.skill.findMany({
    where,
    orderBy: { order: 'asc' }
  });
}

// Tech Stack
export async function getTechStack(options?: { category?: string; active?: boolean }) {
  const where: any = {};
  
  if (options?.category) {
    where.category = options.category;
  }
  
  if (options?.active) {
    where.status = 'active';
  }

  return await prisma.techStack.findMany({
    where,
    orderBy: { order: 'asc' }
  });
}

// Experience
export async function getExperiences(options?: { active?: boolean }) {
  const where: any = {};
  
  if (options?.active) {
    where.status = 'active';
  }

  return await prisma.experience.findMany({
    where,
    include: {
      achievements: {
        orderBy: { order: 'asc' }
      },
      skills: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });
}

// Contact Methods
export async function getContactMethods(options?: { active?: boolean }) {
  const where: any = {};
  
  if (options?.active) {
    where.status = 'active';
  }

  return await prisma.contactMethod.findMany({
    where,
    orderBy: { order: 'asc' }
  });
}

// Blog
export async function getBlogs(options?: { 
  published?: boolean; 
  featured?: boolean; 
  limit?: number;
  offset?: number;
}) {
  const where: any = {};
  
  if (options?.published) {
    where.status = 'published';
  }
  
  if (options?.featured) {
    where.featured = true;
  }

  return await prisma.blog.findMany({
    where,
    include: {
      tags: {
        include: {
          tag: true
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    },
    orderBy: { publishedAt: 'desc' },
    take: options?.limit,
    skip: options?.offset
  });
}

export async function getBlog(slug: string) {
  return await prisma.blog.findUnique({
    where: { slug },
    include: {
      tags: {
        include: {
          tag: true
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  });
}

// Settings
export async function getSetting(key: string) {
  const setting = await prisma.settings.findUnique({
    where: { key }
  });
  
  if (!setting) return null;
  
  switch (setting.type) {
    case 'number':
      return Number(setting.value);
    case 'boolean':
      return setting.value === 'true';
    case 'json':
      return JSON.parse(setting.value);
    default:
      return setting.value;
  }
}

export async function setSetting(key: string, value: any, type: string = 'string') {
  let stringValue: string;
  
  switch (type) {
    case 'json':
      stringValue = JSON.stringify(value);
      break;
    default:
      stringValue = String(value);
  }

  return await prisma.settings.upsert({
    where: { key },
    update: { value: stringValue, type },
    create: { key, value: stringValue, type }
  });
}

// File upload helper using Supabase Storage
export async function uploadFile(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl.publicUrl;
}

// Delete file from Supabase Storage
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}