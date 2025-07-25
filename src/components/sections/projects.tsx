"use client";
import { motion } from "framer-motion";
import { 
  Globe, 
  Database, 
  Users, 
  TrendingUp, 
  Shield, 
  Smartphone,
  Cloud,
  Code,
  ExternalLink,
  CheckCircle,
  Zap
} from "lucide-react";
import Image from "next/image";

export function ProjectsSection() {
  const mainProject = {
    title: "Hayyu Skin Clinic ERP System",
    subtitle: "Enterprise Healthcare Management Platform",
    description: "Comprehensive healthcare management platform serving as the digital backbone for Indonesia's growing skin clinic chain. This enterprise-level application manages everything from patient consultations to inventory management across multiple locations.",
    image: "/placeholder-hayyu-screenshot.jpg",
    website: "https://hayyu.id/",
    techStack: ["PHP Slim", "AngularJS", "Next.js", "MySQL", "Redis", "MongoDB", "Google Cloud"],
    metrics: [
      { label: "Monthly Users", value: "400K+", icon: Users, color: "text-blue-400" },
      { label: "Annual Transactions", value: "5,000+", icon: TrendingUp, color: "text-green-400" },
      { label: "Clinic Outlets", value: "11", icon: Shield, color: "text-purple-400" },
      { label: "App Downloads", value: "10K+", icon: Smartphone, color: "text-indigo-400" },
      { label: "Database Size", value: "3GB+", icon: Database, color: "text-orange-400" },
      { label: "Cloud Files", value: "1.5TB+", icon: Cloud, color: "text-cyan-400" }
    ],
    features: [
      {
        title: "Online Consultation System",
        description: "Redesigned and stabilized in-app consultation feature with 90% reliability improvement",
        impact: "Enhanced user satisfaction through seamless patient-provider communication"
      },
      {
        title: "Complete UI/UX Revamp", 
        description: "Migrated from static Twig pages to dynamic Next.js application",
        impact: "Significant SEO improvements and enhanced client-side performance"
      },
      {
        title: "Database Architecture Modernization",
        description: "Implemented multi-database architecture with Redis caching",
        impact: "60% reduction in database load and improved response times"
      },
      {
        title: "Code Quality Initiative",
        description: "Pioneered clean code practices across entire codebase",
        impact: "40% reduction in technical debt through systematic refactoring"
      }
    ]
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Showcasing enterprise-level applications and technical leadership in healthcare technology solutions.
        </p>
      </motion.div>

      {/* Project Images Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Main Screenshot */}
          <div className="md:col-span-2">
            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300">
                <div className="bg-zinc-800 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/dashboard.png" 
                    alt="Hayyu Skin Clinic ERP Dashboard" 
                    width={800}
                    height={400}
                    className="w-full h-full object-cover object-top rounded-lg"
                  />
                </div>
              </div>
              <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Live Production
              </div>
            </div>
          </div>

          {/* Secondary Screenshots */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-xl p-4 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300">
              <div className="bg-zinc-800 rounded-lg h-36 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/mobile.png" 
                  alt="Hayyu Mobile App" 
                  width={400}
                  height={600}
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-xl p-4 border border-zinc-800 hover:border-green-500/50 transition-all duration-300">
              <div className="bg-zinc-800 rounded-lg h-36 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/landing-page.png" 
                  alt="Hayyu Landing Page" 
                  width={800}
                  height={600}
                  className="w-full h-full object-cover object-top rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Project - Hayyu Skin Clinic */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-blue-500/30 transition-all duration-300">
          {/* Project Header */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-zinc-100 mb-3">
              {mainProject.title}
            </h3>
            <p className="text-blue-400 font-medium text-lg mb-6">
              {mainProject.subtitle}
            </p>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
              {mainProject.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.a
                href={mainProject.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
              >
                <Globe className="h-5 w-5" />
                View Live Site
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-zinc-700 text-zinc-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
              >
                <ExternalLink className="h-5 w-5" />
                Case Study
              </motion.button>
            </div>

            {/* Tech Stack */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-zinc-200 mb-4 flex items-center justify-center">
                <Code className="h-5 w-5 mr-2 text-indigo-400" />
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {mainProject.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-sm px-4 py-2 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700 hover:border-blue-500/50 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Metrics */}
          <div className="mb-12">
            <h4 className="text-2xl font-bold text-zinc-200 mb-8 text-center">Project Impact</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {mainProject.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors duration-300">
                    <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-zinc-100">{metric.value}</div>
                    <div className="text-sm text-zinc-400">{metric.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-2xl font-bold text-zinc-200 mb-8 text-center">Key Achievements</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {mainProject.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors duration-300"
                >
                  <div className="flex items-start mb-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <h5 className="text-lg font-semibold text-zinc-200">{feature.title}</h5>
                  </div>
                  <p className="text-zinc-300 mb-3 leading-relaxed">{feature.description}</p>
                  <div className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-400 italic">{feature.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Projects Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-12">
          <Code className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-zinc-200 mb-4">More Projects Coming Soon</h3>
          <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
            Currently focusing on expanding this portfolio with additional case studies and projects. 
            Each project will showcase different aspects of my technical expertise and problem-solving abilities.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium"
          >
            Get In Touch
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}