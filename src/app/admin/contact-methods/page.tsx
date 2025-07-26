"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageCircle,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface ContactMethod {
  id?: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  color: string;
  description: string;
  order: number;
  status: string;
}

const initialContactMethod: ContactMethod = {
  icon: 'Mail',
  label: '',
  value: '',
  href: '',
  color: '#3b82f6',
  description: '',
  order: 0,
  status: 'active'
};

const iconOptions = [
  { value: 'Mail', label: 'Email', component: Mail },
  { value: 'Phone', label: 'Phone', component: Phone },
  { value: 'MapPin', label: 'Location', component: MapPin },
  { value: 'Globe', label: 'Website', component: Globe },
  { value: 'Github', label: 'GitHub', component: Github },
  { value: 'Linkedin', label: 'LinkedIn', component: Linkedin },
  { value: 'Twitter', label: 'Twitter', component: Twitter },
  { value: 'Instagram', label: 'Instagram', component: Instagram },
  { value: 'MessageCircle', label: 'WhatsApp', component: MessageCircle },
  { value: 'Calendar', label: 'Calendar', component: Calendar }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const colorOptions = [
  { value: '#3b82f6', label: 'Blue', color: 'bg-blue-500' },
  { value: '#10b981', label: 'Green', color: 'bg-green-500' },
  { value: '#f59e0b', label: 'Yellow', color: 'bg-yellow-500' },
  { value: '#ef4444', label: 'Red', color: 'bg-red-500' },
  { value: '#8b5cf6', label: 'Purple', color: 'bg-purple-500' },
  { value: '#06b6d4', label: 'Cyan', color: 'bg-cyan-500' },
  { value: '#f97316', label: 'Orange', color: 'bg-orange-500' },
  { value: '#84cc16', label: 'Lime', color: 'bg-lime-500' },
  { value: '#FFFFFF', label: 'Black', color: 'bg-white' }
];

export default function ContactMethodsAdmin() {
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContactMethod, setEditingContactMethod] = useState<ContactMethod | null>(null);
  const [formData, setFormData] = useState<ContactMethod>(initialContactMethod);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactMethods();
  }, []);

  const fetchContactMethods = async () => {
    try {
      const response = await fetch('/api/admin/contact-methods');
      if (response.ok) {
        const data = await response.json();
        setContactMethods(data);
      }
    } catch (error) {
      console.error('Error fetching contact methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingContactMethod 
        ? `/api/admin/contact-methods/${editingContactMethod.id}`
        : '/api/admin/contact-methods';
      
      const method = editingContactMethod ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchContactMethods();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving contact method:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact method?')) return;

    try {
      const response = await fetch(`/api/admin/contact-methods/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchContactMethods();
      }
    } catch (error) {
      console.error('Error deleting contact method:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialContactMethod);
    setEditingContactMethod(null);
    setShowForm(false);
  };

  const startEdit = (contactMethod: ContactMethod) => {
    setEditingContactMethod(contactMethod);
    setFormData({ ...contactMethod });
    setShowForm(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.component : Mail;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
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
                <h1 className="text-xl font-bold">Manage Contact Methods</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-800 rounded mb-4 max-w-md"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-zinc-800 rounded"></div>
              ))}
            </div>
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
                href="/admin/dashboard"
                className="text-zinc-400 hover:text-blue-400 transition-colors duration-300 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold">Manage Contact Methods</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Contact Method
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Contact Methods List */}
        <div className="grid gap-6 mb-8">
          {contactMethods.map((contactMethod) => {
            const IconComponent = getIconComponent(contactMethod.icon);
            return (
              <motion.div
                key={contactMethod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="p-3 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${contactMethod.color}20`, border: `1px solid ${contactMethod.color}40` }}
                    >
                      <IconComponent 
                        className="h-6 w-6"
                        style={{ color: contactMethod.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-zinc-100">{contactMethod.label}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contactMethod.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {contactMethod.status}
                        </span>
                      </div>
                      <p className="text-zinc-300 font-medium mb-2">{contactMethod.value}</p>
                      {contactMethod.description && (
                        <p className="text-zinc-400 text-sm mb-2">{contactMethod.description}</p>
                      )}
                      <a 
                        href={contactMethod.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        {contactMethod.href}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEdit(contactMethod)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(contactMethod.id!)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
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
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">
                    {editingContactMethod ? 'Edit Contact Method' : 'Add Contact Method'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Icon *
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                        required
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Color *
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map(option => {
                          const isSelected = formData.color === option.value;
                          const isBlack = option.special;
                          
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: option.value })}
                              className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 ${
                                isSelected 
                                  ? isBlack
                                    ? 'border-white shadow-lg shadow-white/50 ring-2 ring-white/30'
                                    : 'border-white shadow-lg ring-2 ring-white/30'
                                  : isBlack
                                    ? 'border-zinc-400 hover:border-zinc-300'
                                    : 'border-zinc-600 hover:border-zinc-400'
                              } ${option.color}`}
                              title={option.label}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Label *
                      </label>
                      <input
                        type="text"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Email, Phone, GitHub"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Value *
                      </label>
                      <input
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., john@example.com, +1234567890"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Link/Href *
                      </label>
                      <input
                        type="url"
                        value={formData.href}
                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., mailto:john@example.com, tel:+1234567890"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                        required
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      placeholder="Optional description for this contact method"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Contact Method'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}