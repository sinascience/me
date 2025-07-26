"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Hash,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "@/styles/markdown-editor.css";
import { Blog } from "@/types/cms";
import ImageUploader from "@/components/ImageUploader";

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditBlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const params = useParams();

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Sina Kiarostami',
    readTime: 5,
    status: 'draft',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    image: ''
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    fetchBlog();
  }, [router, params.id]);

  const fetchBlog = async () => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/admin/blogs/${params.id}`, {
        headers: { 'Authorization': `Bearer ${auth}` }
      });

      if (response.ok) {
        const blog: Blog = await response.json();
        setFormData({
          title: blog.title,
          excerpt: blog.excerpt || '',
          content: blog.content,
          author: blog.author,
          readTime: blog.readTime,
          status: blog.status,
          featured: blog.featured,
          metaTitle: blog.metaTitle || '',
          metaDescription: blog.metaDescription || '',
          image: blog.image || ''
        });
        
        // Extract tag names from blog tags
        const tagNames = blog.tags?.map(blogTag => blogTag.tag.name) || [];
        setTags(tagNames);
      } else if (response.status === 404) {
        setMessage({ type: 'error', text: 'Blog post not found' });
      } else {
        setMessage({ type: 'error', text: 'Failed to load blog post' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while loading the blog post' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/admin/blogs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({
          ...formData,
          tags: tags,
          publishedAt: formData.status === 'published' && formData.status !== 'draft' 
            ? new Date().toISOString() 
            : null
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Blog post updated successfully!' });
        setTimeout(() => {
          router.push('/admin/blog');
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update blog post' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating the blog post' });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <header className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link
                href="/admin/blog"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Edit Blog Post</h1>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-3 text-zinc-400">Loading blog post...</span>
          </div>
        </main>
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
                href="/admin/blog"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Edit Blog Post</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                form="blog-form"
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Brief description of your blog post..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Content *
                </label>
                <div className="rounded-lg overflow-hidden border border-zinc-700">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                    preview="edit"
                    hideToolbar={false}
                    visibleDragBar={false}
                    data-color-mode="dark"
                    height={400}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Use the toolbar above for formatting, or write Markdown directly. Toggle preview with the eye icon.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Featured Image
                </label>
                <ImageUploader
                  value={formData.image}
                  onChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                  maxSizeMB={5}
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Recommended: 1200x630px for optimal social media sharing. Max file size: 5MB.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-zinc-300">
                  Featured Blog Post
                </label>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Tags</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="Add a tag (e.g., JavaScript, React, Tutorial)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex items-center gap-2"
                    >
                      <Hash className="h-3 w-3 text-blue-400" />
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tags.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No tags added yet. Tags help categorize your blog posts.
                </div>
              )}
            </div>
          </motion.div>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">SEO & Meta Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="SEO title for search engines"
                />
                <p className="text-xs text-zinc-500 mt-1">Leave empty to use the blog title</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="SEO description for search engines"
                />
                <p className="text-xs text-zinc-500 mt-1">Leave empty to use the excerpt</p>
              </div>
            </div>
          </motion.div>

          {/* Status Message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-900/20 border border-green-800 text-green-400'
                  : 'bg-red-900/20 border border-red-800 text-red-400'
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              <span>{message.text}</span>
            </motion.div>
          )}
        </form>
      </main>
    </div>
  );
}