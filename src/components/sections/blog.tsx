"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { Blog } from "@/types/cms";

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/cms/blog?published=true&limit=3');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="animate-pulse">
            <div className="h-12 bg-zinc-800 rounded mb-4 max-w-md mx-auto"></div>
            <div className="h-6 bg-zinc-800 rounded mb-8 max-w-2xl mx-auto"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-800 rounded-xl h-80"></div>
          ))}
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-12">
            <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-zinc-200 mb-4">Blog Coming Soon</h2>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              I'm working on sharing insights about web development, architecture patterns, and the latest in tech. 
              Stay tuned for articles on React, Next.js, database optimization, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  View Blog
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Latest Articles
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Insights and tutorials on modern web development, system architecture, and emerging technologies.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {blogs.map((blog, index) => (
          <motion.article
            key={blog.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <Link href={`/blog/${blog.slug}`}>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 h-full">
                {/* Featured Image */}
                {blog.image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                    {blog.featured && (
                      <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex flex-col h-full">
                  {/* Meta Info */}
                  <div className="flex items-center text-zinc-400 text-sm mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {blog.publishedAt ? formatDate(blog.publishedAt.toString()) : formatDate(blog.createdAt.toString())}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {blog.readTime} min
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-zinc-400 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 2).map((blogTag) => (
                        <span
                          key={blogTag.tag.id}
                          className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700"
                          style={{ borderColor: blogTag.tag.color + '40', color: blogTag.tag.color }}
                        >
                          {blogTag.tag.name}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors duration-300 mt-auto">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* View All Blog Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link href="/blog">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent border-2 border-zinc-700 text-zinc-300 rounded-lg font-medium flex items-center gap-2 mx-auto hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
          >
            <BookOpen className="h-5 w-5" />
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}