"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/cms";
import MultiImageUploader from "@/components/MultiImageUploader";

interface ProjectTech {
  id?: string;
  name: string;
  order: number;
}

interface ProjectMetric {
  id?: string;
  label: string;
  value: string;
  icon: string;
  color: string;
  order: number;
}

interface ProjectFeature {
  id?: string;
  title: string;
  description: string;
  impact: string;
  order: number;
}

export default function EditProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const params = useParams();

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    images: [] as string[],
    website: '',
    repository: '',
    status: 'draft',
    featured: false,
    order: 0
  });

  const [techStack, setTechStack] = useState<ProjectTech[]>([]);
  const [metrics, setMetrics] = useState<ProjectMetric[]>([]);
  const [features, setFeatures] = useState<ProjectFeature[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    fetchProject();
  }, [router, params.id]);

  const fetchProject = async () => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        headers: { 'Authorization': `Bearer ${auth}` }
      });

      if (response.ok) {
        const project: Project = await response.json();
        setFormData({
          title: project.title,
          subtitle: project.subtitle || '',
          description: project.description,
          images: project.images?.map(img => img.url) || [],
          website: project.website || '',
          repository: project.repository || '',
          status: project.status,
          featured: project.featured,
          order: project.order
        });
        setTechStack(project.techStack || []);
        setMetrics(project.metrics || []);
        setFeatures(project.features || []);
      } else if (response.status === 404) {
        setMessage({ type: 'error', text: 'Project not found' });
      } else {
        setMessage({ type: 'error', text: 'Failed to load project' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while loading the project' });
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

  const addTechStack = () => {
    const newTech: ProjectTech = {
      name: '',
      order: techStack.length
    };
    setTechStack([...techStack, newTech]);
  };

  const updateTechStack = (index: number, name: string) => {
    setTechStack(prev => prev.map((tech, i) => 
      i === index ? { ...tech, name } : tech
    ));
  };

  const removeTechStack = (index: number) => {
    setTechStack(prev => prev.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    const newMetric: ProjectMetric = {
      label: '',
      value: '',
      icon: 'Users',
      color: 'text-blue-400',
      order: metrics.length
    };
    setMetrics([...metrics, newMetric]);
  };

  const updateMetric = (index: number, field: string, value: string) => {
    setMetrics(prev => prev.map((metric, i) => 
      i === index ? { ...metric, [field]: value } : metric
    ));
  };

  const removeMetric = (index: number) => {
    setMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    const newFeature: ProjectFeature = {
      title: '',
      description: '',
      impact: '',
      order: features.length
    };
    setFeatures([...features, newFeature]);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    setFeatures(prev => prev.map((feature, i) => 
      i === index ? { ...feature, [field]: value } : feature
    ));
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const auth = localStorage.getItem('admin_auth');
      
      // Delete existing relations and recreate them
      await fetch(`/api/admin/projects/${params.id}/relations`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth}` }
      });

      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({
          ...formData,
          techStack: techStack.filter(tech => tech.name.trim()).map((tech, index) => ({
            name: tech.name,
            order: index
          })),
          metrics: metrics.filter(metric => metric.label.trim() && metric.value.trim()).map((metric, index) => ({
            label: metric.label,
            value: metric.value,
            icon: metric.icon,
            color: metric.color,
            order: index
          })),
          features: features.filter(feature => feature.title.trim() && feature.description.trim()).map((feature, index) => ({
            title: feature.title,
            description: feature.description,
            impact: feature.impact,
            order: index
          }))
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project updated successfully!' });
        setTimeout(() => {
          router.push('/admin/projects');
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to update project' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating the project' });
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
                href="/admin/projects"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Edit Project</h1>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-3 text-zinc-400">Loading project...</span>
          </div>
        </main>
      </div>
    );
  }

  const iconOptions = ['Users', 'TrendingUp', 'Shield', 'Smartphone', 'Database', 'Cloud', 'Globe', 'Code', 'Zap'];
  const colorOptions = [
    'text-blue-400',
    'text-green-400', 
    'text-purple-400',
    'text-indigo-400',
    'text-orange-400',
    'text-cyan-400',
    'text-pink-400',
    'text-yellow-400'
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/admin/projects"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Edit Project</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                form="project-form"
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
        <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="Enter project subtitle"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Describe your project..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Project Images *
              </label>
              <MultiImageUploader
                value={formData.images}
                onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                minImages={3}
                maxImages={10}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Repository URL
                </label>
                <input
                  type="url"
                  name="repository"
                  value={formData.repository}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
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

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-zinc-300">
                  Featured Project
                </label>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Technology Stack</h2>
              <button
                type="button"
                onClick={addTechStack}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Technology
              </button>
            </div>

            <div className="space-y-4">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => updateTechStack(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    placeholder="Technology name (e.g., React, Node.js)"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechStack(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {techStack.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No technologies added yet. Click "Add Technology" to get started.
                </div>
              )}
            </div>
          </motion.div>

          {/* Project Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Project Metrics</h2>
              <button
                type="button"
                onClick={addMetric}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Metric
              </button>
            </div>

            <div className="space-y-6">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-zinc-800 rounded-lg p-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => updateMetric(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Monthly Users"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Value
                      </label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => updateMetric(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                        placeholder="400K+"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Icon
                      </label>
                      <select
                        value={metric.icon}
                        onChange={(e) => updateMetric(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:border-blue-500 focus:outline-none"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Color
                      </label>
                      <select
                        value={metric.color}
                        onChange={(e) => updateMetric(index, 'color', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:border-blue-500 focus:outline-none"
                      >
                        {colorOptions.map(color => (
                          <option key={color} value={color}>{color.replace('text-', '').replace('-400', '')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {metrics.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No metrics added yet. Click "Add Metric" to showcase project impact.
                </div>
              )}
            </div>
          </motion.div>

          {/* Project Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Key Features</h2>
              <button
                type="button"
                onClick={addFeature}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </button>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-zinc-800 rounded-lg p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Feature Title
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Online Consultation System"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="Describe the feature and its implementation..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Impact/Result
                      </label>
                      <input
                        type="text"
                        value={feature.impact}
                        onChange={(e) => updateFeature(index, 'impact', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                        placeholder="90% reliability improvement"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {features.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No features added yet. Click "Add Feature" to highlight key achievements.
                </div>
              )}
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