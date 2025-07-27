"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
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
  Zap,
  Github,
  Calendar,
  Building,
  Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Background } from "@/components/ui/background";
import { Lightbox } from "@/components/ui/lightbox";
import { Project } from "@/types/cms";
import { IconMap } from "@/lib/types";

// Icon mapping for metrics
const iconMap: IconMap = {
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  Database,
  Cloud,
  Globe,
  Code,
  CheckCircle,
  Zap,
  Briefcase
};

export default function ProjectsPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<Array<{src: string, alt: string, title?: string}>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/cms/projects?published=true");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const openLightbox = (project: Project, index: number = 0) => {
    const gallery = project.images?.map((img, idx) => ({
      src: img.url,
      alt: `${project.title} - Screenshot ${idx + 1}`,
      title: `${project.title} - Screenshot ${idx + 1}`
    })) || [];
    setLightboxImages(gallery);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="relative bg-[#0f0f0f] text-zinc-100 min-h-screen">
        <Background className="fixed top-0 left-0 h-svh w-screen z-0" />
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Portfolio
                </motion.button>
              </Link>
              <div className="text-sm text-zinc-400">
                Loading...
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-16 bg-zinc-800 rounded mb-6 max-w-md mx-auto"></div>
              <div className="h-6 bg-zinc-800 rounded mb-8 max-w-2xl mx-auto"></div>
            </div>
          </div>
          <div className="space-y-24">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 animate-pulse">
                <div className="h-64 bg-zinc-800 rounded mb-8"></div>
                <div className="h-8 bg-zinc-800 rounded mb-4 max-w-md"></div>
                <div className="h-6 bg-zinc-800 rounded mb-6 max-w-lg"></div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-20 bg-zinc-800 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#0f0f0f] text-zinc-100 min-h-screen">
      <Background className="fixed top-0 left-0 h-svh w-screen z-0" />
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </motion.button>
            </Link>
            <div className="text-sm text-zinc-400">
              {projects.length} Projects
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              My Projects
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            A comprehensive showcase of enterprise-level applications, technical leadership, 
            and innovative solutions across various industries and technologies.
          </p>
        </motion.div>

        {/* Project Cards */}
        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Project Header */}
              <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Project Image */}
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className="bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300">
                      <div 
                        className="bg-zinc-800 rounded-lg h-64 flex items-center justify-center overflow-hidden cursor-pointer relative group"
                        onClick={() => openLightbox(project, 0)}
                      >
                        {project.images && project.images.length > 0 ? (
                          <Image 
                            src={project.images[0].url} 
                            alt={project.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover object-top rounded-lg transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-zinc-500 text-center">
                            <Code className="h-16 w-16 mx-auto mb-4" />
                            <p>No images available</p>
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                          <div className="text-white text-center">
                            <div className="w-12 h-12 mx-auto mb-2 border-2 border-white rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium">View Gallery</p>
                            <p className="text-xs opacity-75">{project.images?.length} images</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'Live Production' ? 'bg-green-500 text-white' :
                      project.status === 'In Development' ? 'bg-yellow-500 text-black' :
                      'bg-blue-500 text-white'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {project.category || 'Project'}
                    </span>
                    <div className="flex items-center text-zinc-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.startDate} - {project.endDate || 'Present'}
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-zinc-100 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-blue-400 font-medium text-lg mb-4">
                    {project.subtitle}
                  </p>
                  {project.role && (
                    <div className="flex items-center text-zinc-400 text-sm mb-6">
                      <Building className="h-4 w-4 mr-2" />
                      {project.role}
                    </div>
                  )}
                  <p className="text-zinc-300 leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {project.website && (
                      <motion.a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                      >
                        <Globe className="h-4 w-4" />
                        View Live Site
                      </motion.a>
                    )}
                    {project.repository && (
                      <motion.a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-transparent border-2 border-zinc-700 text-zinc-300 rounded-lg font-medium flex items-center gap-2 hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
                      >
                        <Github className="h-4 w-4" />
                        Source Code
                      </motion.a>
                    )}
                    {project.caseStudyUrl && (
                      <motion.a
                        href={project.caseStudyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-transparent border-2 border-zinc-700 text-zinc-300 rounded-lg font-medium flex items-center gap-2 hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Case Study
                      </motion.a>
                    )}
                  </div>

                  {/* Tech Stack */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center">
                        <Code className="h-4 w-4 mr-2 text-indigo-400" />
                        Technology Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech.id}
                            className="text-sm px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700 hover:border-blue-500/50 transition-colors duration-300"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="mb-12">
                  <h4 className="text-2xl font-bold text-zinc-200 mb-6 text-center">Project Impact</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.metrics.map((metric, metricIndex) => {
                      const IconComponent = iconMap[metric.icon] || Database;
                      return (
                        <motion.div
                          key={metric.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: metricIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="text-center"
                        >
                          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors duration-300">
                            <IconComponent className={`h-6 w-6 ${metric.color} mx-auto mb-2`} />
                            <div className="text-xl font-bold text-zinc-100">{metric.value}</div>
                            <div className="text-xs text-zinc-400">{metric.label}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h4 className="text-2xl font-bold text-zinc-200 mb-6 text-center">Key Achievements</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: featureIndex % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: featureIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-300"
                      >
                        <div className="flex items-start mb-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <h5 className="text-sm font-semibold text-zinc-200">{feature.title}</h5>
                        </div>
                        <p className="text-zinc-300 mb-2 text-sm leading-relaxed">{feature.description}</p>
                        {feature.impact && (
                          <div className="flex items-start">
                            <Zap className="h-3 w-3 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-zinc-400 italic">{feature.impact}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-12">
            <Code className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-zinc-200 mb-4">Interested in Working Together?</h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              I&apos;m always excited to take on new challenges and collaborate on innovative projects. 
              Let&apos;s discuss how I can help bring your ideas to life.
            </p>
            <Link href="/#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium"
              >
                Get In Touch
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        onImageSelect={selectImage}
      />
    </div>
  );
}