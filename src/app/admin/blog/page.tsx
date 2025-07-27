"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Calendar,
  Eye,
  EyeOff,
  Clock,
  User
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/cms";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/cms/blog', {
        headers: { 'Authorization': `Bearer ${auth}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (blogId: string, featured: boolean) => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/cms/blog/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({ featured: !featured })
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const toggleStatus = async (blogId: string, status: string) => {
    const newStatus = status === 'published' ? 'draft' : 'published';
    const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;
    
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/cms/blog/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          ...(publishedAt && { publishedAt })
        })
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/cms/blog/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth}` }
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Manage Blog</h1>
            </div>
            <Link href="/admin/blog/new">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300">
                <Plus className="h-4 w-4" />
                New Article
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-800 rounded-xl h-32"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-zinc-400 text-lg mb-4">No blog posts found</div>
                <Link href="/admin/blog/new">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-300">
                    <Plus className="h-4 w-4" />
                    Write Your First Article
                  </button>
                </Link>
              </motion.div>
            ) : (
              blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Featured Image */}
                      {blog.image && (
                        <div className="mb-4">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={400}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg border border-zinc-700"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-zinc-100">{blog.title}</h3>
                        {blog.featured && (
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          blog.status === 'published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {blog.status}
                        </span>
                      </div>
                      
                      <p className="text-zinc-400 mb-4 line-clamp-2">{blog.excerpt}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {blog.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {blog.publishedAt ? formatDate(blog.publishedAt.toString()) : formatDate(blog.createdAt.toString())}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {blog.readTime} min read
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {blog.views} views
                        </div>
                      </div>

                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {blog.tags.slice(0, 4).map((blogTag) => (
                            <span
                              key={blogTag.tag.id}
                              className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700"
                              style={{ borderColor: blogTag.tag.color + '40', color: blogTag.tag.color }}
                            >
                              #{blogTag.tag.name}
                            </span>
                          ))}
                          {blog.tags.length > 4 && (
                            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                              +{blog.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(blog.id, blog.featured)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          blog.featured 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                        title={blog.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star className={`h-4 w-4 ${blog.featured ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => toggleStatus(blog.id, blog.status)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          blog.status === 'published'
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                        title={blog.status === 'published' ? 'Make draft' : 'Publish'}
                      >
                        {blog.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      
                      <Link href={`/admin/blog/${blog.id}/edit`}>
                        <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => deleteBlog(blog.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}