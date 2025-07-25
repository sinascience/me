"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Tag, ArrowRight, Search } from "lucide-react";
import { Blog } from "@/types/cms";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/cms/blog?published=true');
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

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-zinc-800 rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-zinc-800 rounded mb-8 max-w-2xl mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-800 rounded-xl h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Tech Blog
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on modern web development, architecture, and the latest in tech.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
            />
          </div>
        </motion.div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-zinc-400 text-lg">
              {searchTerm ? 'No articles found matching your search.' : 'No blog posts available yet.'}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
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

                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center text-zinc-400 text-sm mb-3 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {blog.publishedAt ? formatDate(blog.publishedAt.toString()) : formatDate(blog.createdAt.toString())}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.readTime} min read
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((blogTag) => (
                            <span
                              key={blogTag.tag.id}
                              className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700"
                              style={{ borderColor: blogTag.tag.color + '40', color: blogTag.tag.color }}
                            >
                              {blogTag.tag.name}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors duration-300">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}