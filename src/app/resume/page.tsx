"use client";
import { motion } from "framer-motion";
import { 
  Download, 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Code2
} from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
  const handleDownloadResume = () => {
    // This will be implemented when you provide the actual resume file
    alert("Resume file not yet available. Please provide the resume file.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <motion.button
              onClick={handleDownloadResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </motion.button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white text-zinc-900 rounded-2xl shadow-2xl p-8 md:p-12"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Anis Fajar Fakhruddin
            </h1>
            <p className="text-xl text-zinc-600 mb-6">
              Senior Full-Stack Developer
            </p>
            
            {/* Contact Information */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                sina4science@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +62 856-0703-2998
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Indonesia
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                github.com/sinascience
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 border-b-2 border-blue-500 pb-2">
              Professional Summary
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          {/* Work Experience */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 border-b-2 border-blue-500 pb-2 flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              Work Experience
            </h2>
            
            <div className="space-y-8">
              {/* Job 1 */}
              <div className="relative pl-6 border-l-2 border-blue-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-zinc-900">Senior Full-Stack Developer</h3>
                  <p className="text-blue-600 font-medium">Healthcare Tech Company</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    January 2022 - Present
                  </div>
                </div>
                <div className="text-zinc-700 space-y-2">
                  <p>• Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                  <p>• Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>• Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                  <p>• Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</p>
                </div>
              </div>

              {/* Job 2 */}
              <div className="relative pl-6 border-l-2 border-blue-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-zinc-900">Full-Stack Developer</h3>
                  <p className="text-blue-600 font-medium">Tech Startup</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    June 2021 - December 2021
                  </div>
                </div>
                <div className="text-zinc-700 space-y-2">
                  <p>• Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                  <p>• Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.</p>
                  <p>• Explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
                </div>
              </div>

              {/* Job 3 */}
              <div className="relative pl-6 border-l-2 border-blue-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-zinc-900">Junior Developer</h3>
                  <p className="text-blue-600 font-medium">Software Development Agency</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    March 2020 - May 2021
                  </div>
                </div>
                <div className="text-zinc-700 space-y-2">
                  <p>• At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.</p>
                  <p>• Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.</p>
                  <p>• Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 border-b-2 border-blue-500 pb-2 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Education
            </h2>
            
            <div className="relative pl-6 border-l-2 border-blue-200">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-zinc-900">Bachelor of Computer Science</h3>
                <p className="text-blue-600 font-medium">University of Technology</p>
                <div className="flex items-center gap-2 text-sm text-zinc-600 mt-1">
                  <Calendar className="h-4 w-4" />
                  2016 - 2020
                </div>
              </div>
              <p className="text-zinc-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna cum laude graduation with specialization in 
                software engineering and web technologies. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 border-b-2 border-blue-500 pb-2 flex items-center gap-2">
              <Code2 className="h-6 w-6" />
              Technical Skills
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Frontend Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'Vue.js'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">Backend Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Python', 'PHP', 'PostgreSQL', 'MongoDB', 'Docker'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 border-b-2 border-blue-500 pb-2 flex items-center gap-2">
              <Award className="h-6 w-6" />
              Certifications & Achievements
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">AWS Certified Developer</h3>
                <p className="text-zinc-600">Amazon Web Services • 2023</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Professional Scrum Master I</h3>
                <p className="text-zinc-600">Scrum.org • 2022</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">Google Cloud Professional Developer</h3>
                <p className="text-zinc-600">Google Cloud • 2022</p>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 border-b-2 border-blue-500 pb-2">
              Key Projects
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">Healthcare Management System</h3>
                <p className="text-zinc-700 mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Comprehensive healthcare platform serving 400K+ monthly users. 
                  Built with React, Node.js, and PostgreSQL.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'PostgreSQL', 'AWS'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">E-commerce Platform</h3>
                <p className="text-zinc-700 mb-2">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Full-featured e-commerce solution with payment integration, 
                  inventory management, and analytics dashboard.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'TypeScript', 'Stripe', 'MongoDB'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Download Button */}
          <div className="text-center pt-8 border-t border-zinc-200">
            <motion.button
              onClick={handleDownloadResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Download className="h-5 w-5" />
              Download PDF Resume
            </motion.button>
            <p className="text-sm text-zinc-500 mt-3">
              Click to download a PDF version of this resume
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}