"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Share2, Eye } from "lucide-react";
import { Blog } from "@/types/cms";

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!params.slug) return;
      
      try {
        const response = await fetch(`/api/cms/blog/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else if (response.status === 404) {
          setError('Blog post not found');
        } else {
          setError('Failed to load blog post');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 rounded mb-8 max-w-xs"></div>
            <div className="h-12 bg-zinc-800 rounded mb-4"></div>
            <div className="h-6 bg-zinc-800 rounded mb-8 max-w-md"></div>
            <div className="h-64 bg-zinc-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-zinc-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-zinc-200">
            {error || 'Blog post not found'}
          </h1>
          <p className="text-zinc-400 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-zinc-400 hover:text-blue-400 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </motion.div>

        <article>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Featured Badge */}
            {blog.featured && (
              <div className="mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured Article
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center text-zinc-400 text-sm gap-4 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {blog.publishedAt ? formatDate(blog.publishedAt.toString()) : formatDate(blog.createdAt.toString())}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {blog.readTime} min read
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {blog.views} views
              </div>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((blogTag) => (
                  <span
                    key={blogTag.tag.id}
                    className="text-sm px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700 hover:border-blue-500/50 transition-colors duration-300"
                    style={{ borderColor: blogTag.tag.color + '40', color: blogTag.tag.color }}
                  >
                    #{blogTag.tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Categories */}
            {blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.categories.map((blogCategory) => (
                  <span
                    key={blogCategory.category.id}
                    className="text-sm px-3 py-1 bg-zinc-900 text-zinc-200 rounded-lg border border-zinc-700"
                    style={{ backgroundColor: blogCategory.category.color + '20', borderColor: blogCategory.category.color + '40' }}
                  >
                    {blogCategory.category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors duration-300"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </motion.header>

          {/* Featured Image */}
          {blog.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="prose prose-invert prose-blue max-w-none"
          >
            {/* For now, showing raw content. In production, you'd want to use a markdown parser */}
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
              {blog.content}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-zinc-800"
          >
            <div className="flex items-center justify-between">
              <div className="text-zinc-400">
                Thanks for reading! 🚀
              </div>
              <button
                onClick={handleShare}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Share this article
              </button>
            </div>
          </motion.footer>
        </article>
      </div>
    </div>
  );
}