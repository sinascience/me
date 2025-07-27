"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Eye,
  BarChart3,
  User
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    blogs: 0,
    contactMethods: 0
  });
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const headers = { 'Authorization': `Bearer ${auth}` };

      const [projects, skills, experiences, blogs, contactMethods] = await Promise.all([
        fetch('/api/cms/projects', { headers }).then(r => r.json()),
        fetch('/api/cms/skills', { headers }).then(r => r.json()),
        fetch('/api/cms/experiences', { headers }).then(r => r.json()),
        fetch('/api/cms/blog', { headers }).then(r => r.json()),
        fetch('/api/cms/contact-methods', { headers }).then(r => r.json())
      ]);

      setStats({
        projects: projects.length || 0,
        skills: skills.length || 0,
        experiences: experiences.length || 0,
        blogs: blogs.length || 0,
        contactMethods: contactMethods.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { 
      label: "Personal Info", 
      icon: User, 
      href: "/admin/personal", 
      count: null,
      description: "Manage personal information",
      primary: true
    },
    { 
      label: "Projects", 
      icon: Briefcase, 
      href: "/admin/projects", 
      count: stats.projects,
      description: "Manage portfolio projects"
    },
    { 
      label: "Skills", 
      icon: Users, 
      href: "/admin/skills", 
      count: stats.skills,
      description: "Update technical skills"
    },
    { 
      label: "Experience", 
      icon: BarChart3, 
      href: "/admin/experiences", 
      count: stats.experiences,
      description: "Edit work experience"
    },
    { 
      label: "Blog", 
      icon: FileText, 
      href: "/admin/blog", 
      count: stats.blogs,
      description: "Create and edit articles"
    },
    { 
      label: "Contact Methods", 
      icon: MessageCircle, 
      href: "/admin/contact-methods", 
      count: stats.contactMethods,
      description: "Manage contact information"
    },
    { 
      label: "Settings", 
      icon: Settings, 
      href: "/admin/settings", 
      count: null,
      description: "Application settings"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-xl font-bold">Portfolio CMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300"
              >
                <Eye className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-zinc-400 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome to your CMS Dashboard</h2>
          <p className="text-zinc-400 text-lg">
            Manage your portfolio content, blog posts, and settings from this central dashboard.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12"
        >
          {menuItems.slice(1, 6).map((item) => (
            <div
              key={item.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"
            >
              <item.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-zinc-100">{item.count || 0}</div>
              <div className="text-sm text-zinc-400">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link href={item.href}>
                <div className={`${
                  item.primary 
                    ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/50' 
                    : 'bg-zinc-900 border-zinc-800'
                } border rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 h-full`}>
                  <div className="flex items-center justify-between mb-4">
                    <item.icon className={`h-8 w-8 ${
                      item.primary ? 'text-blue-300' : 'text-blue-400'
                    } group-hover:scale-110 transition-transform duration-300`} />
                    {item.count !== null && (
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                    {item.primary && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Profile
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {item.label}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center text-blue-400 font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Manage {item.label}
                    <Edit className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin/blog/new">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <Plus className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-white font-medium">Create New Blog Post</div>
              </div>
            </Link>
            <Link href="/admin/projects/new">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <Plus className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-white font-medium">Add New Project</div>
              </div>
            </Link>
            <Link href="/" target="_blank">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <Eye className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-white font-medium">View Live Site</div>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}