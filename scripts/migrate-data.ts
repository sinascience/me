import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting data migration...');

  // Clear existing data
  await prisma.projectFeature.deleteMany();
  await prisma.projectMetric.deleteMany();
  await prisma.projectTech.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experienceSkill.deleteMany();
  await prisma.experienceAchievement.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.techStack.deleteMany();
  await prisma.contactMethod.deleteMany();

  // 1. Migrate Projects
  console.log('📄 Migrating projects...');
  const hayyuProject = await prisma.project.create({
    data: {
      title: "Hayyu Skin Clinic ERP System",
      subtitle: "Enterprise Healthcare Management Platform",
      description: "Comprehensive healthcare management platform serving as the digital backbone for Indonesia's growing skin clinic chain. This enterprise-level application manages everything from patient consultations to inventory management across multiple locations.",
      image: "/dashboard.png",
      website: "https://hayyu.id/",
      status: "published",
      featured: true,
      order: 1,
      techStack: {
        create: [
          { name: "PHP Slim", order: 1 },
          { name: "AngularJS", order: 2 },
          { name: "Next.js", order: 3 },
          { name: "MySQL", order: 4 },
          { name: "Redis", order: 5 },
          { name: "MongoDB", order: 6 },
          { name: "Google Cloud", order: 7 }
        ]
      },
      metrics: {
        create: [
          { label: "Monthly Users", value: "400K+", icon: "Users", color: "text-blue-400", order: 1 },
          { label: "Annual Transactions", value: "5,000+", icon: "TrendingUp", color: "text-green-400", order: 2 },
          { label: "Clinic Outlets", value: "11", icon: "Shield", color: "text-purple-400", order: 3 },
          { label: "App Downloads", value: "10K+", icon: "Smartphone", color: "text-indigo-400", order: 4 },
          { label: "Database Size", value: "3GB+", icon: "Database", color: "text-orange-400", order: 5 },
          { label: "Cloud Files", value: "1.5TB+", icon: "Cloud", color: "text-cyan-400", order: 6 }
        ]
      },
      features: {
        create: [
          {
            title: "Online Consultation System",
            description: "Redesigned and stabilized in-app consultation feature with 90% reliability improvement",
            impact: "Enhanced user satisfaction through seamless patient-provider communication",
            order: 1
          },
          {
            title: "Complete UI/UX Revamp",
            description: "Migrated from static Twig pages to dynamic Next.js application",
            impact: "Significant SEO improvements and enhanced client-side performance",
            order: 2
          },
          {
            title: "Database Architecture Modernization",
            description: "Implemented multi-database architecture with Redis caching",
            impact: "60% reduction in database load and improved response times",
            order: 3
          },
          {
            title: "Code Quality Initiative",
            description: "Pioneered clean code practices across entire codebase",
            impact: "40% reduction in technical debt through systematic refactoring",
            order: 4
          }
        ]
      }
    }
  });

  // 2. Migrate Skills
  console.log('🎯 Migrating skills...');
  await prisma.skill.createMany({
    data: [
      {
        title: "Frontend Development",
        description: "Modern React, Next.js, TypeScript, and Angular applications with exceptional user experiences",
        icon: "Code2",
        color: "from-blue-400 to-indigo-500",
        category: "frontend",
        proficiency: "expert",
        order: 1
      },
      {
        title: "Backend Architecture",
        description: "Scalable PHP, Laravel, Go Fiber, and Node.js solutions handling enterprise-level traffic",
        icon: "Server",
        color: "from-purple-400 to-pink-500",
        category: "backend",
        proficiency: "expert",
        order: 2
      },
      {
        title: "Database Systems",
        description: "MySQL, PostgreSQL, Redis, MongoDB - Optimized for performance and scalability",
        icon: "Database",
        color: "from-green-400 to-emerald-500",
        category: "database",
        proficiency: "advanced",
        order: 3
      },
      {
        title: "Cloud Infrastructure",
        description: "Google Cloud Platform, AWS, Docker deployment and infrastructure management",
        icon: "Cloud",
        color: "from-cyan-400 to-blue-500",
        category: "devops",
        proficiency: "advanced",
        order: 4
      },
      {
        title: "API Integration",
        description: "Payment gateways, chat systems, video calling, and third-party service integrations",
        icon: "Layers",
        color: "from-orange-400 to-red-500",
        category: "integration",
        proficiency: "expert",
        order: 5
      },
      {
        title: "Performance Optimization",
        description: "60% query optimization, caching strategies, and scalable architecture design",
        icon: "Zap",
        color: "from-yellow-400 to-orange-500",
        category: "optimization",
        proficiency: "expert",
        order: 6
      },
      {
        title: "Security & Compliance",
        description: "Healthcare application security, HIPAA considerations, and best practices implementation",
        icon: "Shield",
        color: "from-indigo-400 to-purple-500",
        category: "security",
        proficiency: "advanced",
        order: 7
      }
    ]
  });

  // 3. Migrate Tech Stack
  console.log('⚙️ Migrating tech stack...');
  await prisma.techStack.createMany({
    data: [
      { name: "TypeScript", color: "from-blue-400 to-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/30", category: "language", order: 1 },
      { name: "React", color: "from-cyan-400 to-cyan-600", bg: "bg-cyan-500/10", border: "border-cyan-500/30", category: "framework", order: 2 },
      { name: "Next.js", color: "from-gray-300 to-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/30", category: "framework", order: 3 },
      { name: "Angular", color: "from-red-400 to-red-600", bg: "bg-red-500/10", border: "border-red-500/30", category: "framework", order: 4 },
      { name: "PHP", color: "from-purple-400 to-purple-600", bg: "bg-purple-500/10", border: "border-purple-500/30", category: "language", order: 5 },
      { name: "Laravel", color: "from-orange-400 to-red-500", bg: "bg-orange-500/10", border: "border-orange-500/30", category: "framework", order: 6 },
      { name: "Go", color: "from-cyan-300 to-blue-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30", category: "language", order: 7 },
      { name: "Node.js", color: "from-green-400 to-green-600", bg: "bg-green-500/10", border: "border-green-500/30", category: "runtime", order: 8 },
      { name: "MySQL", color: "from-blue-500 to-indigo-600", bg: "bg-blue-600/10", border: "border-blue-600/30", category: "database", order: 9 },
      { name: "PostgreSQL", color: "from-blue-600 to-indigo-700", bg: "bg-indigo-600/10", border: "border-indigo-600/30", category: "database", order: 10 },
      { name: "Redis", color: "from-red-500 to-red-700", bg: "bg-red-600/10", border: "border-red-600/30", category: "database", order: 11 },
      { name: "MongoDB", color: "from-green-500 to-green-700", bg: "bg-green-600/10", border: "border-green-600/30", category: "database", order: 12 },
      { name: "Docker", color: "from-blue-400 to-cyan-500", bg: "bg-blue-500/10", border: "border-blue-500/30", category: "tool", order: 13 },
      { name: "GCP", color: "from-yellow-400 to-orange-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", category: "cloud", order: 14 },
      { name: "AWS", color: "from-orange-400 to-yellow-500", bg: "bg-orange-500/10", border: "border-orange-500/30", category: "cloud", order: 15 },
      { name: "Git", color: "from-orange-500 to-red-500", bg: "bg-orange-600/10", border: "border-orange-600/30", category: "tool", order: 16 },
      { name: "Figma", color: "from-purple-400 to-pink-500", bg: "bg-purple-500/10", border: "border-purple-500/30", category: "design", order: 17 },
      { name: "WordPress", color: "from-blue-600 to-indigo-600", bg: "bg-blue-700/10", border: "border-blue-700/30", category: "cms", order: 18 }
    ]
  });

  // 4. Migrate Experiences
  console.log('💼 Migrating experiences...');
  const seniorDev = await prisma.experience.create({
    data: {
      title: "Senior Web Developer",
      company: "Venturo Pro Indonesia",
      period: "2024 - Present",
      location: "Indonesia",
      type: "Current Role",
      description: "Leading technical architecture and development for Hayyu Skin Clinic's comprehensive ERP system, serving as the main technical decision-maker.",
      color: "from-blue-400 to-indigo-500",
      order: 1,
      achievements: {
        create: [
          { achievement: "Lead technical development for healthcare application serving 400K+ monthly users", order: 1 },
          { achievement: "Manage application performance handling 5,000+ annual transactions", order: 2 },
          { achievement: "Implement comprehensive code refactoring initiatives improving maintainability", order: 3 },
          { achievement: "Mentor junior developers and establish coding standards across the team", order: 4 },
          { achievement: "Collaborate with stakeholders to translate business requirements into technical solutions", order: 5 }
        ]
      },
      skills: {
        create: [
          { skill: "Technical Leadership", order: 1 },
          { skill: "Architecture Design", order: 2 },
          { skill: "Code Review", order: 3 },
          { skill: "Mentoring", order: 4 },
          { skill: "Stakeholder Management", order: 5 }
        ]
      }
    }
  });

  const juniorDev = await prisma.experience.create({
    data: {
      title: "Junior Web Developer",
      company: "Venturo Pro Indonesia",
      period: "2022 - 2024",
      location: "Indonesia",
      type: "Growth Phase",
      description: "Core developer for building and maintaining the Hayyu Skin Clinic ERP system, focusing on full-stack development while mastering enterprise technologies.",
      color: "from-green-400 to-emerald-500",
      order: 2,
      achievements: {
        create: [
          { achievement: "Developed comprehensive ERP system serving 11 clinic outlets across Java", order: 1 },
          { achievement: "Implemented solutions handling 3GB+ database storage and 1.5TB+ cloud files", order: 2 },
          { achievement: "Built responsive applications using PHP Slim framework with AngularJS", order: 3 },
          { achievement: "Created SEO-optimized landing pages with Next.js contributing to 400K monthly views", order: 4 },
          { achievement: "Developed mobile application features achieving 10K+ Google Play downloads", order: 5 }
        ]
      },
      skills: {
        create: [
          { skill: "PHP Slim", order: 1 },
          { skill: "AngularJS", order: 2 },
          { skill: "Next.js", order: 3 },
          { skill: "MySQL", order: 4 },
          { skill: "Google Cloud", order: 5 },
          { skill: "Mobile Development", order: 6 }
        ]
      }
    }
  });

  const trainee = await prisma.experience.create({
    data: {
      title: "Trainee Programmer",
      company: "Venturo Pro Indonesia",
      period: "2022 (4 months)",
      location: "Indonesia",
      type: "Foundation",
      description: "Intensive training program focusing on modern web development frameworks and database management, establishing foundation for full-stack career.",
      color: "from-purple-400 to-pink-500",
      order: 3,
      achievements: {
        create: [
          { achievement: "Mastered Angular and Laravel frameworks through hands-on projects", order: 1 },
          { achievement: "Built complete CRUD applications with advanced features", order: 2 },
          { achievement: "Learned industry best practices for web application development", order: 3 },
          { achievement: "Gained proficiency in both frontend and backend technologies", order: 4 }
        ]
      },
      skills: {
        create: [
          { skill: "Angular", order: 1 },
          { skill: "Laravel", order: 2 },
          { skill: "Database Design", order: 3 },
          { skill: "CRUD Operations", order: 4 },
          { skill: "Best Practices", order: 5 }
        ]
      }
    }
  });

  // 5. Migrate Contact Methods
  console.log('📞 Migrating contact methods...');
  await prisma.contactMethod.createMany({
    data: [
      {
        icon: "Mail",
        label: "Email",
        value: "sina4science@gmail.com",
        href: "mailto:sina4science@gmail.com",
        color: "text-blue-400",
        description: "Best for professional inquiries",
        order: 1
      },
      {
        icon: "Linkedin",
        label: "LinkedIn",
        value: "/in/anis-fajar-fakhruddin-33aa402ba/",
        href: "https://linkedin.com/in/anis-fajar-fakhruddin-33aa402ba/",
        color: "text-indigo-400",
        description: "Professional networking",
        order: 2
      },
      {
        icon: "Github",
        label: "GitHub",
        value: "/sinascience",
        href: "https://github.com/sinascience",
        color: "text-purple-400",
        description: "Code repositories and contributions",
        order: 3
      },
      {
        icon: "MessageCircle",
        label: "Discord",
        value: "@belpoizz",
        href: "https://discord.com/users/858389159555497994",
        color: "text-indigo-400",
        description: "Quick communication",
        order: 4
      }
    ]
  });

  console.log('✅ Data migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });