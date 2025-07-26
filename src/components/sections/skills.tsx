/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Cloud,
  Server,
  Layers,
  Zap,
  Shield,
} from "lucide-react";
import { Skill, TechStack } from "@/types/cms";

// Icon mapping for skills
const iconMap: { [key: string]: any } = {
  Code2,
  Database,
  Cloud,
  Server,
  Layers,
  Zap,
  Shield,
};

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [skillsResponse, techStackResponse] = await Promise.all([
          fetch("/api/cms/skills?active=true"),
          fetch("/api/cms/tech-stack?active=true"),
        ]);

        if (skillsResponse.ok && techStackResponse.ok) {
          const [skillsData, techStackData] = await Promise.all([
            skillsResponse.json(),
            techStackResponse.json(),
          ]);

          setSkills(skillsData);
          setTechStack(techStackData);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section
        id="skills"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-zinc-800 rounded mb-4 max-w-md mx-auto"></div>
            <div className="h-6 bg-zinc-800 rounded mb-8 max-w-2xl mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-zinc-800 rounded-2xl h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Dynamic grid layout based on skill count
  const getGridClassName = (index: number, total: number) => {

    const repeatPattern = 9;
    const patternRepetedCount = Math.floor(total / repeatPattern);
    if (index >= patternRepetedCount * repeatPattern) {
      index = index % repeatPattern;
      total = total % repeatPattern;
    } else {
      total = repeatPattern;
    }

    if (total === 1) {
      return "md:col-span-3";
    }
    
    const colspan2Indexes = [0];
    switch (total) {
      case 4:
        colspan2Indexes.push(3);
        break;

      case 6:
        colspan2Indexes.push(3);
        colspan2Indexes.push(4);
        break;

      case 7:
        colspan2Indexes.push(3);

      case 8:
        colspan2Indexes.push(3);
        colspan2Indexes.push(4);
        colspan2Indexes.push(7);
        break;

      case 9:
        colspan2Indexes.push(3);
        colspan2Indexes.push(4);
        break;
    }

    
    if (colspan2Indexes.includes(index)) return "md:col-span-2";

    return "md:col-span-1"; // fallback
  };

  return (
    <section
      id="skills"
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
            Technical Expertise
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Proven mastery across the full technology stack with extensive
          experience in enterprise-level applications and modern development
          practices.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[...skills, ...skills].slice(0, 14).map((skill, i) => {
          const IconComponent = iconMap[skill.icon] || Code2;
          const gridClassName = getGridClassName(i, 14);
          // const gridClassName = getGridClassName(i, skills.length);

          return (
            <motion.div
              key={skill.id + i}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                type: "spring",
                bounce: 0.3,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -12,
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
              }}
              className={`${gridClassName} group cursor-pointer`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 h-full hover:border-blue-500/50 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-blue-500/10 relative overflow-hidden">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Icon container with animation */}
                <motion.div
                  className="mb-6 relative z-10"
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-indigo-600/30 transition-all duration-500">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <IconComponent className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.h3
                    className="text-xl font-bold text-zinc-100 mb-4 group-hover:text-blue-100 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {skill.title}
                  </motion.h3>
                  <motion.p
                    className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                  >
                    {skill.description}
                  </motion.p>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-1 h-1 bg-indigo-400 rounded-full opacity-40"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tech Stack Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Technology Stack
        </h3>
        <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
          A diverse toolkit spanning modern frameworks, robust databases, and
          cloud technologies
        </p>
      </motion.div>

      {/* Full-width Carousel Section */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-[calc(50vw-55%)] overflow-hidden py-6">
        <motion.div
          animate={{
            x: [0, -100 * 18], // Move by the total width of all items
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-4 w-fit"
        >
          {/* Double the array to create seamless loop */}
          {[...techStack, ...techStack].map((tech, index) => (
            <motion.div
              key={`${tech.name}-${index}`}
              whileHover={{
                scale: 1.15,
                y: -8,
                rotateY: 5,
                rotateX: 5,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.2,
              }}
              className={`${tech.bg} border ${tech.border} rounded-xl py-3 px-6 cursor-pointer flex-shrink-0 min-w-12 flex items-center justify-center group hover:border-opacity-80 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-200 ease-out`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <motion.span
                className={`text-xs font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent text-center leading-tight group-hover:scale-110 transition-transform duration-200 ease-out`}
                whileHover={{
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              >
                {tech.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>
      </div>

      {/* Experience Level Indicators */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-wrap justify-center gap-6 text-sm"
      >
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 mr-2"></div>
          <span className="text-zinc-400">Expert (3+ years)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 mr-2"></div>
          <span className="text-zinc-400">Advanced (2+ years)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mr-2"></div>
          <span className="text-zinc-400">Proficient (1+ years)</span>
        </div>
      </motion.div> */}
    </section>
  );
}
