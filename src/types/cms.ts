// Generated types based on Prisma schema

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  website?: string;
  repository?: string;
  status: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  techStack: ProjectTech[];
  metrics: ProjectMetric[];
  features: ProjectFeature[];
}

export interface ProjectTech {
  id: string;
  projectId: string;
  name: string;
  order: number;
}

export interface ProjectMetric {
  id: string;
  projectId: string;
  label: string;
  value: string;
  icon: string;
  color: string;
  order: number;
}

export interface ProjectFeature {
  id: string;
  projectId: string;
  title: string;
  description: string;
  impact?: string;
  order: number;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  proficiency: string;
  order: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechStack {
  id: string;
  name: string;
  color: string;
  bg: string;
  border: string;
  category: string;
  order: number;
  status: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  color: string;
  order: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  achievements: ExperienceAchievement[];
  skills: ExperienceSkill[];
}

export interface ExperienceAchievement {
  id: string;
  experienceId: string;
  achievement: string;
  order: number;
}

export interface ExperienceSkill {
  id: string;
  experienceId: string;
  skill: string;
  order: number;
}

export interface ContactMethod {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  color: string;
  description: string;
  order: number;
  status: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  status: string;
  featured: boolean;
  views: number;
  readTime: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: BlogTag[];
  categories: BlogCategory[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export interface BlogTag {
  blogId: string;
  tagId: string;
  tag: Tag;
}

export interface BlogCategory {
  blogId: string;
  categoryId: string;
  category: Category;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  type: string;
}