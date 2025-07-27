"use client";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import { FileText, MapPin, Calendar, Code2, Database } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface PersonalInfo {
  name: string;
  greeting: string;
  profession: string;
  short_description: string;
  bio: string;
  location: string;
  timezone: string;
  profile_photo: string;
  resume_url: string;
  years_experience: number;
}

export function HeroSection() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonalInfo() {
      try {
        const response = await fetch("/api/cms/personal");
        if (response.ok) {
          const data = await response.json();
          setPersonalInfo(data);
        }
      } catch (error) {
        console.error("Error fetching personal information:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPersonalInfo();
  }, []);

  // Helper function to parse **text** markdown and apply blue color
  const parseStyledText = (text: string) => {
    if (!text) return text;

    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const content = part.slice(2, -2);
        return (
          <span key={index} className="text-blue-400 font-semibold">
            {content}
          </span>
        );
      }
      return part;
    });
  };

  // Parse profession for typewriter effect with **text** support
  const parseProfessionWords = (profession: string) => {
    if (!profession) {
      return [];
    }

    // Split by spaces and handle **text** syntax
    const words = profession.split(" ");
    return words.map((word, index) => {
      if (word.startsWith("**") && word.endsWith("**")) {
        // Remove ** and apply blue color
        return {
          text: word.slice(2, -2),
          className: "text-blue-400 dark:text-blue-400",
        };
      } else {
        // Apply alternating colors for non-starred words
        const colorIndex = index % 3;
        return {
          text: word,
          className:
            colorIndex === 0
              ? "text-indigo-400 dark:text-indigo-400"
              : colorIndex === 1
              ? "text-zinc-100 dark:text-zinc-100"
              : "text-blue-400 dark:text-blue-400",
        };
      }
    });
  };

  // Show loading state
  if (loading || !personalInfo) {
    return (
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-zinc-400 text-lg">Loading portfolio...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left lg:pr-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm text-blue-300">
                  Available for opportunities
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-linear-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  {personalInfo.greeting}
                </span>
                <br />
                <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>

              <div className="mb-8">
                <TypewriterEffect
                  words={parseProfessionWords(personalInfo.profession)}
                  className="text-left"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-lg lg:text-xl text-zinc-300 mb-8 leading-relaxed">
                {parseStyledText(personalInfo.short_description)}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center text-zinc-400">
                  <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                  {personalInfo.location}
                </div>
                <div className="flex items-center text-zinc-400">
                  <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                  {personalInfo.years_experience}+ Years Experience
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={"/projects"}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    View My Work
                  </motion.button>
                </Link>
                <Link href={personalInfo.resume_url || "/resume"}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="px-8 py-4 bg-zinc-900/50 backdrop-blur-sm border-2 border-zinc-700 text-zinc-300 rounded-xl font-medium hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-300 flex items-center justify-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Developer Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              type: "spring",
              bounce: 0.3,
            }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Animated background elements */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full bg-linear-to-r from-blue-500/10 to-indigo-500/10 blur-3xl"
            />

            {/* Photo container */}
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative z-10 w-80 h-80 lg:w-96 lg:h-96"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Main photo */}
              <div className="w-full h-full rounded-3xl bg-linear-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center overflow-hidden relative group">
                <Image
                  src={personalInfo.profile_photo || "/profile.png"}
                  alt={`${personalInfo.name} - ${personalInfo.profession}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover object-top rounded-3xl"
                  priority
                />

                {/* Animated overlay */}
                <motion.div
                  className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Floating elements around photo */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30 flex items-center justify-center"
              >
                <Code2 className="h-6 w-6 text-blue-400" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center"
              >
                <Database className="h-6 w-6 text-indigo-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-blue-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
