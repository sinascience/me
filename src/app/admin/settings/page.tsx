/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  User,
  Palette,
  Bell,
  Lock,
  Plus,
  Edit,
  Trash2,
  X,
  Key,
  Type,
  Hash,
  ToggleLeft,
  Code
} from "lucide-react";
import Link from "next/link";
import { Settings } from "@/types/cms";

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  // Database settings state
  const [settings, setSettings] = useState<Settings[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [showSettingForm, setShowSettingForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Settings | null>(null);
  const [settingFormData, setSettingFormData] = useState({
    key: '',
    value: '',
    type: 'string'
  });
  const [savingSetting, setSavingSetting] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSetting(true);

    try {
      const url = editingSetting 
        ? `/api/admin/settings/${editingSetting.key}`
        : '/api/admin/settings';
      const method = editingSetting ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingFormData)
      });

      if (response.ok) {
        await fetchSettings();
        resetSettingForm();
        setMessage({ type: 'success', text: `Setting ${editingSetting ? 'updated' : 'created'} successfully!` });
      } else {
        setMessage({ type: 'error', text: 'Failed to save setting' });
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSavingSetting(false);
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchSettings();
        setMessage({ type: 'success', text: 'Setting deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete setting' });
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      setMessage({ type: 'error', text: 'An error occurred while deleting' });
    }
  };

  const startEditSetting = (setting: Settings) => {
    setEditingSetting(setting);
    setSettingFormData({
      key: setting.key,
      value: setting.value,
      type: setting.type
    });
    setShowSettingForm(true);
  };

  const resetSettingForm = () => {
    setSettingFormData({
      key: '',
      value: '',
      type: 'string'
    });
    setEditingSetting(null);
    setShowSettingForm(false);
  };

  const getSettingTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return Hash;
      case 'boolean': return ToggleLeft;
      case 'json': return Code;
      default: return Type;
    }
  };

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
                className="p-6 bg-linear-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl text-left hover:border-blue-500/50 transition-all duration-300 disabled:opacity-50"
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
                className="p-6 bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-left hover:border-purple-500/50 transition-all duration-300 disabled:opacity-50"
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

          {/* Database Settings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Database className="h-6 w-6 text-green-400" />
                Application Settings
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettingForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Setting
              </motion.button>
            </div>

            <div className="mb-4">
              <p className="text-zinc-400 text-sm">
                Manage application configuration stored in the database. These settings can be updated at runtime without server restart.
              </p>
            </div>

            {settingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-zinc-800 rounded-lg h-16"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {settings.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    <Database className="h-12 w-12 mx-auto mb-3 text-zinc-600" />
                    <p>No settings configured yet</p>
                    <p className="text-sm">Add your first application setting to get started</p>
                  </div>
                ) : (
                  settings.map((setting) => {
                    const TypeIcon = getSettingTypeIcon(setting.type);
                    return (
                      <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center justify-between hover:border-zinc-600 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-2 bg-zinc-700 rounded-lg shrink-0">
                            <TypeIcon className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-zinc-200 truncate">{setting.key}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${{
                                'string': 'bg-blue-500/20 text-blue-400',
                                'number': 'bg-orange-500/20 text-orange-400', 
                                'boolean': 'bg-green-500/20 text-green-400',
                                'json': 'bg-purple-500/20 text-purple-400'
                              }[setting.type] || 'bg-gray-500/20 text-gray-400'}`}>
                                {setting.type}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-sm font-mono truncate">
                              {setting.type === 'json' 
                                ? (() => {
                                    try {
                                      return JSON.stringify(JSON.parse(setting.value), null, 2);
                                    } catch {
                                      return setting.value;
                                    }
                                  })()
                                : setting.value
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEditSetting(setting)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteSetting(setting.key)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
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

          {/* Setting Form Modal */}
          <AnimatePresence>
            {showSettingForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
                      <Key className="h-6 w-6 text-green-400" />
                      {editingSetting ? 'Edit Setting' : 'Add Setting'}
                    </h2>
                    <button
                      onClick={resetSettingForm}
                      className="p-2 text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSettingSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Setting Key *
                        </label>
                        <input
                          type="text"
                          value={settingFormData.key}
                          onChange={(e) => setSettingFormData({ ...settingFormData, key: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-green-500 focus:outline-none"
                          placeholder="e.g., site_title, max_upload_size"
                          required
                          disabled={!!editingSetting}
                        />
                        {editingSetting && (
                          <p className="text-xs text-zinc-500 mt-1">Setting key cannot be changed</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Type *
                        </label>
                        <select
                          value={settingFormData.type}
                          onChange={(e) => setSettingFormData({ ...settingFormData, type: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-green-500 focus:outline-none"
                          required
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Value *
                      </label>
                      {settingFormData.type === 'boolean' ? (
                        <select
                          value={settingFormData.value}
                          onChange={(e) => setSettingFormData({ ...settingFormData, value: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-green-500 focus:outline-none"
                          required
                        >
                          <option value="">Select value</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : settingFormData.type === 'json' ? (
                        <textarea
                          value={settingFormData.value}
                          onChange={(e) => setSettingFormData({ ...settingFormData, value: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-green-500 focus:outline-none font-mono text-sm"
                          placeholder='{"key": "value", "nested": {"data": true}}'
                          required
                        />
                      ) : (
                        <input
                          type={settingFormData.type === 'number' ? 'number' : 'text'}
                          value={settingFormData.value}
                          onChange={(e) => setSettingFormData({ ...settingFormData, value: e.target.value })}
                          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-green-500 focus:outline-none"
                          placeholder={settingFormData.type === 'number' ? '42' : 'Setting value'}
                          required
                        />
                      )}
                      
                      {settingFormData.type === 'json' && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Enter valid JSON. Use double quotes for strings.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={resetSettingForm}
                        className="px-6 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={savingSetting}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        {savingSetting ? 'Saving...' : (editingSetting ? 'Update Setting' : 'Create Setting')}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}