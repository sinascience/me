"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, TrendingUp, Users, Database, Code } from "lucide-react";

export function ExperienceSection() {
  const experiences = [
    {
      title: "Senior Web Developer",
      company: "Venturo Pro Indonesia",
      period: "2024 - Present",
      location: "Indonesia",
      type: "Current Role",
      description: "Leading technical architecture and development for Hayyu Skin Clinic's comprehensive ERP system, serving as the main technical decision-maker.",
      achievements: [
        "Lead technical development for healthcare application serving 400K+ monthly users",
        "Manage application performance handling 5,000+ annual transactions",
        "Implement comprehensive code refactoring initiatives improving maintainability",
        "Mentor junior developers and establish coding standards across the team",
        "Collaborate with stakeholders to translate business requirements into technical solutions"
      ],
      skills: ["Technical Leadership", "Architecture Design", "Code Review", "Mentoring", "Stakeholder Management"],
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Junior Web Developer",
      company: "Venturo Pro Indonesia", 
      period: "2022 - 2024",
      location: "Indonesia",
      type: "Growth Phase",
      description: "Core developer for building and maintaining the Hayyu Skin Clinic ERP system, focusing on full-stack development while mastering enterprise technologies.",
      achievements: [
        "Developed comprehensive ERP system serving 11 clinic outlets across Java",
        "Implemented solutions handling 3GB+ database storage and 1.5TB+ cloud files",
        "Built responsive applications using PHP Slim framework with AngularJS",
        "Created SEO-optimized landing pages with Next.js contributing to 400K monthly views",
        "Developed mobile application features achieving 10K+ Google Play downloads"
      ],
      skills: ["PHP Slim", "AngularJS", "Next.js", "MySQL", "Google Cloud", "Mobile Development"],
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Trainee Programmer",
      company: "Venturo Pro Indonesia",
      period: "2022 (4 months)",
      location: "Indonesia", 
      type: "Foundation",
      description: "Intensive training program focusing on modern web development frameworks and database management, establishing foundation for full-stack career.",
      achievements: [
        "Mastered Angular and Laravel frameworks through hands-on projects",
        "Built complete CRUD applications with advanced features",
        "Learned industry best practices for web application development",
        "Gained proficiency in both frontend and backend technologies"
      ],
      skills: ["Angular", "Laravel", "Database Design", "CRUD Operations", "Best Practices"],
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Professional Journey
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          3+ years of progressive growth in full-stack development, from intensive training to technical leadership in enterprise healthcare systems.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400"></div>

        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`relative flex items-center mb-16 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Timeline dot */}
            <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full border-4 border-zinc-900 z-10"></div>

            {/* Content card */}
            <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300"
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${exp.color} text-white`}>
                      {exp.type}
                    </span>
                    <div className="flex items-center text-zinc-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exp.period}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-2">{exp.title}</h3>
                  <div className="flex items-center text-zinc-300 mb-2">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
                    {exp.company}
                  </div>
                  <div className="flex items-center text-zinc-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {exp.location}
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-300 mb-6 leading-relaxed">{exp.description}</p>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center">
                    <Code className="h-4 w-4 mr-2 text-indigo-400" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-zinc-300 text-sm flex items-start">
                        <span className="text-blue-400 mr-2 mt-1">▸</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center">
                    <Database className="h-4 w-4 mr-2 text-green-400" />
                    Technologies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {[
          { label: "Years Experience", value: "3+", icon: Calendar },
          { label: "Monthly Users", value: "400K+", icon: Users },
          { label: "Annual Transactions", value: "5K+", icon: TrendingUp },
          { label: "Clinic Outlets", value: "11", icon: MapPin }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors duration-300">
              <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}