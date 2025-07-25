# Portfolio CMS Setup with Supabase & Prisma

This document outlines the complete setup and usage of your portfolio CMS system using Supabase and Prisma.

## 🏗️ Architecture Overview

```
Portfolio CMS Structure:
├── Database (Supabase PostgreSQL)
├── ORM (Prisma)
├── API Routes (Next.js API)
├── Components (Dynamic React Components)
└── Admin Interface (To be built)
```

## 📦 Dependencies Added

```json
{
  "@prisma/client": "^6.12.0",
  "@supabase/supabase-js": "^2.52.1",
  "prisma": "^6.12.0",
  "tsx": "^4.20.3"
}
```

## 🔧 Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > Database and copy your connection string
3. Go to Settings > API and copy your keys
4. Update `.env.local` with your credentials:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SUPABASE_SERVICE_ROLE_KEY]"
```

### 2. Database Setup

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Migrate existing data
bun run db:migrate

# Optional: Open Prisma Studio to view data
bun run db:studio
```

## 📊 Database Schema

### Core Tables

- **Projects**: Portfolio projects with metadata
- **Skills**: Technical skills and competencies  
- **Experiences**: Work experience timeline
- **TechStack**: Technology stack items
- **ContactMethods**: Contact information
- **Blog**: Blog posts and articles
- **Settings**: Application settings

### Relationships

```
Project 1:N ProjectTech, ProjectMetric, ProjectFeature
Experience 1:N ExperienceAchievement, ExperienceSkill
Blog N:N Tag, Category
```

## 🔌 API Endpoints

All endpoints are available under `/api/cms/`:

### Projects
- `GET /api/cms/projects` - List projects
  - Query params: `published=true`, `featured=true`
- `GET /api/cms/projects/[id]` - Get single project

### Skills
- `GET /api/cms/skills` - List skills
  - Query params: `category=frontend`, `active=true`

### Experience
- `GET /api/cms/experience` - List experiences
  - Query params: `active=true`

### Tech Stack
- `GET /api/cms/tech-stack` - List tech stack
  - Query params: `category=language`, `active=true`

### Contact Methods
- `GET /api/cms/contact-methods` - List contact methods
  - Query params: `active=true`

### Blog
- `GET /api/cms/blog` - List blog posts
  - Query params: `published=true`, `featured=true`, `limit=10`, `offset=0`
- `GET /api/cms/blog/[slug]` - Get single blog post

## 🎨 Updated Components

### Projects Component
- Now fetches data from `/api/cms/projects?published=true`
- Displays featured project dynamically
- Supports conditional rendering based on available data
- Icon mapping for metrics using string-based icon names

### Skills Component (Pending)
- Will fetch from `/api/cms/skills?active=true`
- Dynamic skill categories and proficiency levels

### Experience Component (Pending)
- Will fetch from `/api/cms/experience?active=true`
- Timeline with achievements and skills

### Contact Component (Pending)
- Will fetch from `/api/cms/contact-methods?active=true`
- Dynamic contact methods with icons

## 📝 Content Management

### Current Data Structure

Your existing portfolio data has been mapped to:

**Hayyu Skin Clinic Project:**
- Tech Stack: PHP Slim, AngularJS, Next.js, MySQL, Redis, MongoDB, Google Cloud
- Metrics: 400K+ Monthly Users, 5K+ Annual Transactions, 11 Clinic Outlets, etc.
- Features: Online Consultation System, UI/UX Revamp, Database Modernization, Code Quality

**Skills:**
- Frontend Development, Backend Architecture, Database Systems
- Cloud Infrastructure, API Integration, Performance Optimization
- Security & Compliance

**Experience:**
- Senior Web Developer (2024-Present)
- Junior Web Developer (2022-2024)  
- Trainee Programmer (2022)

### Adding New Content

Use Prisma Studio (`bun run db:studio`) or create admin interface to:
- Add new projects with tech stack, metrics, and features
- Update skills and proficiency levels
- Add blog posts with tags and categories
- Manage contact methods and settings

## 🔒 Security Considerations

- Environment variables are properly configured
- Service role key is only used server-side
- Database access is controlled through Prisma
- API routes can be protected with authentication when needed

## 🚀 Next Steps

1. **Complete Component Updates**: Update Skills, Experience, and Contact components
2. **Create Blog System**: Build blog listing and detail pages
3. **Admin Interface**: Create admin dashboard for content management
4. **Image Management**: Set up Supabase Storage for images
5. **Authentication**: Add admin authentication for content editing

## 📁 File Structure

```
src/
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── supabase.ts        # Supabase client
│   └── cms.ts             # CMS utility functions
├── app/api/cms/           # API routes
├── components/sections/   # Updated components
├── types/cms.ts          # TypeScript types
└── scripts/
    └── migrate-data.ts    # Data migration script
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is correct and accessible
2. **Prisma Generate**: Run `bun run db:generate` after schema changes  
3. **Missing Data**: Run `bun run db:migrate` to populate initial data
4. **Environment Variables**: Restart development server after updating .env.local

### Development Commands

```bash
# Start development server
bun run dev

# View database
bun run db:studio

# Push schema changes
bun run db:push

# Re-migrate data (destructive)
bun run db:migrate
```

## 📞 Support

For questions about this CMS setup:
1. Check Prisma documentation: https://prisma.io/docs
2. Check Supabase documentation: https://supabase.com/docs
3. Review the database schema in `prisma/schema.prisma`
4. Use Prisma Studio to inspect data structure