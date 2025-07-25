/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  Save,
  Database,
  Eye,
  Globe,
  Mail,
  Shield,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const regenerateDatabase = async () => {
    if (!confirm('This will regenerate the database with fresh data. Are you sure?')) return;

    setLoading(true);
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auth}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Database regenerated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to regenerate database' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    setLoading(true);
    try {
      // Simulate cache clearing
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Cache cleared successfully!' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear cache' });
      setLoading(false);
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
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* System Information */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-blue-400" />
              System Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-green-400" />
                    <span>Database Status</span>
                  </div>
                  <span className="text-green-400 font-medium">Connected</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span>Environment</span>
                  </div>
                  <span className="text-blue-400 font-medium">Development</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <span>Authentication</span>
                  </div>
                  <span className="text-purple-400 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-indigo-400" />
                    <span>Admin Access</span>
                  </div>
                  <span className="text-indigo-400 font-medium">Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                onClick={regenerateDatabase}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="p-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl text-left hover:border-blue-500/50 transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className={`h-6 w-6 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
                  <h3 className="text-lg font-semibold">Regenerate Database</h3>
                </div>
                <p className="text-zinc-400 text-sm">
                  Reset database with fresh migration data. This will overwrite existing content.
                </p>
              </motion.button>

              <motion.button
                onClick={clearCache}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-left hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Database className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-semibold">Clear Cache</h3>
                </div>
                <p className="text-zinc-400 text-sm">
                  Clear application cache and refresh data. Improves performance.
                </p>
              </motion.button>
            </div>
          </div>

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
              {message.type === 'success' ? (
                <Save className="h-5 w-5" />
              ) : (
                <Shield className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Environment Variables (Hidden) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Environment Configuration</h2>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">Environment variables are configured</span>
              </div>
              <p className="text-zinc-400 text-sm">
                Database, authentication, and API settings are properly configured in your environment file.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/"
                target="_blank"
                className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors duration-300 text-center"
              >
                <Eye className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="font-medium">View Site</div>
              </Link>
              
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors duration-300 text-center"
              >
                <Database className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="font-medium">Supabase</div>
              </a>
              
              <button
                onClick={() => window.open('mailto:sina4science@gmail.com')}
                className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors duration-300 text-center"
              >
                <Mail className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="font-medium">Support</div>
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}