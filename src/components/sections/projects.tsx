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
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { Project } from "@/types/cms";
import { useLightbox } from "@/contexts/lightbox-context";
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
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { openLightbox } = useLightbox();

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

  if (loading) {
    return (
      <section
        id="projects"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-zinc-800 rounded mb-4 max-w-md mx-auto"></div>
            <div className="h-6 bg-zinc-800 rounded mb-8 max-w-2xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const featuredProject = projects.find((p) => p.featured) || projects[0];

  return (
    <section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
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
          Showcasing enterprise-level applications and technical leadership in
          healthcare technology solutions.
        </p>
      </motion.div>

      {/* Project Images Gallery */}
      {featuredProject &&
        featuredProject.images &&
        featuredProject.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Main Screenshot (First Image) */}
              {featuredProject.images[0] && (
                <div className="md:col-span-2">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => {
                      const images = featuredProject.images.map((img, idx) => ({
                        src: img.url,
                        alt: `${featuredProject.title} - Screenshot ${idx + 1}`,
                        title: `${featuredProject.title} - Screenshot ${
                          idx + 1
                        }`,
                      }));
                      openLightbox(images, 0);
                    }}
                  >
                    <div className="bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300">
                      <div className="bg-zinc-800 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                        <Image
                          src={featuredProject.images[0].url}
                          alt={`${featuredProject.title} - Main Screenshot`}
                          width={800}
                          height={400}
                          className="w-full h-full object-cover object-top rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Live Production
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary Screenshots (Second and Third Images) */}
              <div className="space-y-6">
                {featuredProject.images[1] && (
                  <div
                    className="bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-xl p-4 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      const images = featuredProject.images.map((img, idx) => ({
                        src: img.url,
                        alt: `${featuredProject.title} - Screenshot ${idx + 1}`,
                        title: `${featuredProject.title} - Screenshot ${
                          idx + 1
                        }`,
                      }));
                      openLightbox(images, 1);
                    }}
                  >
                    <div className="bg-zinc-800 rounded-lg h-36 flex items-center justify-center overflow-hidden">
                      <Image
                        src={featuredProject.images[1].url}
                        alt={`${featuredProject.title} - Screenshot 2`}
                        width={400}
                        height={600}
                        className="w-full h-full object-cover object-top rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                )}

                {featuredProject.images[2] && (
                  <div
                    className="bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-xl p-4 border border-zinc-800 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => {
                      const images = featuredProject.images.map((img, idx) => ({
                        src: img.url,
                        alt: `${featuredProject.title} - Screenshot ${idx + 1}`,
                        title: `${featuredProject.title} - Screenshot ${
                          idx + 1
                        }`,
                      }));
                      openLightbox(images, 2);
                    }}
                  >
                    <div className="bg-zinc-800 rounded-lg h-36 flex items-center justify-center overflow-hidden">
                      <Image
                        src={featuredProject.images[2].url}
                        alt={`${featuredProject.title} - Screenshot 3`}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover object-top rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

      {/* Featured Project */}
      {featuredProject && (
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
                {featuredProject?.title}
              </h3>
              {featuredProject?.subtitle && (
                <p className="text-blue-400 font-medium text-lg mb-6">
                  {featuredProject.subtitle}
                </p>
              )}
              <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                {featuredProject?.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                {featuredProject?.website && (
                  <motion.a
                    href={featuredProject.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    <Globe className="h-5 w-5" />
                    View Live Site
                  </motion.a>
                )}
                {featuredProject?.repository && (
                  <motion.a
                    href={featuredProject.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent border-2 border-zinc-700 text-zinc-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View Code
                  </motion.a>
                )}
              </div>

              {/* Tech Stack */}
              {featuredProject?.techStack &&
                featuredProject.techStack.length > 0 && (
                  <div className="mb-12">
                    <h4 className="text-xl font-semibold text-zinc-200 mb-4 flex items-center justify-center">
                      <Code className="h-5 w-5 mr-2 text-indigo-400" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {featuredProject.techStack.map((tech) => (
                        <span
                          key={tech.id}
                          className="text-sm px-4 py-2 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700 hover:border-blue-500/50 transition-colors duration-300"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Project Metrics */}
            {featuredProject?.metrics && featuredProject.metrics.length > 0 && (
              <div className="mb-12">
                <h4 className="text-2xl font-bold text-zinc-200 mb-8 text-center">
                  Project Impact
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {featuredProject.metrics.map((metric, index) => {
                    const IconComponent = iconMap[metric.icon] || Database;
                    return (
                      <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors duration-300">
                          <IconComponent
                            className={`h-8 w-8 ${metric.color} mx-auto mb-3`}
                          />
                          <div className="text-2xl font-bold text-zinc-100">
                            {metric.value}
                          </div>
                          <div className="text-sm text-zinc-400">
                            {metric.label}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Features */}
            {featuredProject?.features &&
              featuredProject.features.length > 0 && (
                <div>
                  <h4 className="text-2xl font-bold text-zinc-200 mb-8 text-center">
                    Key Achievements
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredProject.features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors duration-300"
                      >
                        <div className="flex items-start mb-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <h5 className="text-lg font-semibold text-zinc-200">
                            {feature.title}
                          </h5>
                        </div>
                        <p className="text-zinc-300 mb-3 leading-relaxed">
                          {feature.description}
                        </p>
                        {feature.impact && (
                          <div className="flex items-start">
                            <Zap className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-zinc-400 italic">
                              {feature.impact}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </motion.div>
      )}

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
          <h3 className="text-2xl font-bold text-zinc-200 mb-4">
            More Projects Coming Soon
          </h3>
          <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
            Currently focusing on expanding this portfolio with additional case
            studies and projects. Each project will showcase different aspects
            of my technical expertise and problem-solving abilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View All Projects
              </motion.button>
            </Link>
            <Link href="#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-zinc-700 text-zinc-300 rounded-lg font-medium hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
              >
                Get In Touch
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
