"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  User,
  Save,
  Upload,
  MapPin,
  Clock,
  FileText,
  Image as ImageIcon,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PersonalInfo {
  name: { value: string; type: string };
  greeting: { value: string; type: string };
  profession: { value: string; type: string };
  short_description: { value: string; type: string };
  bio: { value: string; type: string };
  location: { value: string; type: string };
  timezone: { value: string; type: string };
  profile_photo: { value: string; type: string };
  resume_url: { value: string; type: string };
  years_experience: { value: number; type: string };
}

interface FormData {
  name: string;
  greeting: string;
  profession: string;
  short_description: string;
  bio: string;
  location: string;
  timezone: string;
  profile_photo: string;
  resume_url: string;
  years_experience: number;
}

const initialFormData: FormData = {
  name: '',
  greeting: '',
  profession: '',
  short_description: '',
  bio: '',
  location: '',
  timezone: '',
  profile_photo: '',
  resume_url: '',
  years_experience: 0
};

export default function PersonalInfoAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    fetchPersonalInfo();
  }, [router]);

  const fetchPersonalInfo = async () => {
    try {
      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/cms/personal?admin=true', {
        headers: { 'Authorization': `Bearer ${auth}` }
      });
      if (response.ok) {
        const data: PersonalInfo = await response.json();
        
        // Convert to form data format
        const newFormData: FormData = {
          name: data.name?.value || '',
          greeting: data.greeting?.value || '',
          profession: data.profession?.value || '',
          short_description: data.short_description?.value || '',
          bio: data.bio?.value || '',
          location: data.location?.value || '',
          timezone: data.timezone?.value || '',
          profile_photo: data.profile_photo?.value || '',
          resume_url: data.resume_url?.value || '',
          years_experience: data.years_experience?.value || 0
        };
        
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Error fetching personal information:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert form data to API format
      const personalData = {
        name: { value: formData.name, type: 'string' },
        greeting: { value: formData.greeting, type: 'string' },
        profession: { value: formData.profession, type: 'string' },
        short_description: { value: formData.short_description, type: 'string' },
        bio: { value: formData.bio, type: 'string' },
        location: { value: formData.location, type: 'string' },
        timezone: { value: formData.timezone, type: 'string' },
        profile_photo: { value: formData.profile_photo, type: 'string' },
        resume_url: { value: formData.resume_url, type: 'string' },
        years_experience: { value: formData.years_experience, type: 'number' }
      };

      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/cms/personal', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify(personalData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Personal information updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update personal information' });
      }
    } catch (error) {
      console.error('Error saving personal information:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.imageUrl || result.url;
        setFormData(prev => ({ ...prev, profile_photo: imageUrl }));
        setMessage({ type: 'success', text: 'Profile photo uploaded successfully!' });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to upload photo' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profile_photo: '' }));
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl mx-auto p-8">
          <div className="h-8 bg-zinc-800 rounded mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
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
              <h1 className="text-xl font-bold">Personal Information</h1>
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
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <User className="h-8 w-8 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-zinc-400">Manage your personal details and profile information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-4">
                  Profile Photo
                </label>
                <div className="flex items-center gap-6">
                  {formData.profile_photo ? (
                    <div className="relative">
                      <Image
                        src={formData.profile_photo}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-zinc-500" />
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                      id="profile-photo"
                    />
                    <label
                      htmlFor="profile-photo"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </label>
                    <p className="text-xs text-zinc-500 mt-1">
                      Recommended: Square image, at least 200x200px
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Greeting/Title
                  </label>
                  <input
                    type="text"
                    value={formData.greeting}
                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="Hi, I'm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Profession *
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="Full-Stack Developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="3"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      placeholder="Indonesia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      placeholder="UTC+7 (WIB)"
                    />
                  </div>
                </div>
              </div>

              {/* Resume URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Resume URL
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="url"
                    value={formData.resume_url}
                    onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="A brief one-line description about yourself"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Biography
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Tell your story, background, and what drives your passion for development..."
                />
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
                  <span>{message.text}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Information'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}