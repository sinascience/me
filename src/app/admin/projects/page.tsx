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
  Globe,
  Github,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { Project } from "@/types/cms";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
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
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/cms/projects', {
        headers: { 'Authorization': `Bearer ${auth}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (projectId: string, featured: boolean) => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({ featured: !featured })
      });

      if (response.ok) {
        fetchProjects(); // Refresh list
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const toggleStatus = async (projectId: string, status: string) => {
    const newStatus = status === 'published' ? 'draft' : 'published';
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchProjects(); // Refresh list
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth}` }
      });

      if (response.ok) {
        fetchProjects(); // Refresh list
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
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
              <h1 className="text-xl font-bold">Manage Projects</h1>
            </div>
            <Link href="/admin/projects/new">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300">
                <Plus className="h-4 w-4" />
                New Project
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
            {projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-zinc-400 text-lg mb-4">No projects found</div>
                <Link href="/admin/projects/new">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-300">
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </button>
                </Link>
              </motion.div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-zinc-100">{project.title}</h3>
                        {project.featured && (
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      
                      {project.subtitle && (
                        <p className="text-blue-400 font-medium mb-2">{project.subtitle}</p>
                      )}
                      
                      <p className="text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        {project.website && (
                          <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                          >
                            <Globe className="h-4 w-4" />
                            Live Site
                          </a>
                        )}
                        {project.repository && (
                          <a
                            href={project.repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                          >
                            <Github className="h-4 w-4" />
                            Repository
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(project.id, project.featured)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          project.featured 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                        title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => toggleStatus(project.id, project.status)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          project.status === 'published'
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        }`}
                        title={project.status === 'published' ? 'Make draft' : 'Publish'}
                      >
                        {project.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => deleteProject(project.id)}
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