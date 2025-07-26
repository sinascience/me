"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { 
  ArrowLeft,
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Building,
  MapPin,
  Star,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface ExperienceAchievement {
  id?: string;
  achievement: string;
  order: number;
}

interface ExperienceSkill {
  id?: string;
  skill: string;
  order: number;
}

interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  type: string;
  status: string;
  order: number;
  color?: string;
  achievements: ExperienceAchievement[];
  skills: ExperienceSkill[];
}

// Form-specific interfaces for the UI
interface FormExperience extends Omit<Experience, 'period' | 'achievements' | 'skills'> {
  startDate: Date | null;
  endDate: Date | null;
  current: boolean;
  achievements: Array<{
    id?: string;
    title: string;
    description: string;
    order: number;
  }>;
  skills: Array<{
    id?: string;
    name: string;
    order: number;
  }>;
}

const initialFormExperience: FormExperience = {
  title: '',
  company: '',
  location: '',
  startDate: null,
  endDate: null,
  current: false,
  description: '',
  type: 'work',
  status: 'active',
  order: 0,
  achievements: [],
  skills: []
};

const experienceTypes = [
  { value: 'work', label: 'Work Experience' },
  { value: 'education', label: 'Education' },
  { value: 'project', label: 'Project' },
  { value: 'volunteer', label: 'Volunteer' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export default function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<FormExperience>(initialFormExperience);
  const [saving, setSaving] = useState(false);

  // Helper function to convert database Experience to FormExperience
  const experienceToForm = (experience: Experience): FormExperience => {
    // Parse period string - handle various formats:
    // "2022-01 - Present", "2022-01 - 2023-12", "2022 (4 months)", etc.
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    let current = false;

    // Try to extract dates from different period formats
    if (experience.period.includes(' - ')) {
      // Format: "2022-01 - Present" or "2022-01 - 2023-12"
      const periodParts = experience.period.split(' - ');
      const startDateStr = periodParts[0]?.trim() || '';
      const endPart = periodParts[1]?.trim() || '';
      current = endPart === 'Present';
      
      // Parse start date
      if (startDateStr.match(/^\d{4}-\d{2}$/)) {
        startDate = new Date(startDateStr + '-01');
      } else if (startDateStr.match(/^\d{4}$/)) {
        startDate = new Date(startDateStr + '-01-01');
      }
      
      // Parse end date
      if (!current && endPart) {
        if (endPart.match(/^\d{4}-\d{2}$/)) {
          endDate = new Date(endPart + '-01');
        } else if (endPart.match(/^\d{4}$/)) {
          endDate = new Date(endPart + '-12-01');
        }
      }
    } else if (experience.period.match(/^\d{4}/)) {
      // Format: "2022 (4 months)" or just "2022"
      const yearMatch = experience.period.match(/^(\d{4})/);
      if (yearMatch) {
        startDate = new Date(yearMatch[1] + '-01-01');
        // If it mentions duration but no end date, assume it ended same year
        if (experience.period.includes('(') && experience.period.includes('months')) {
          endDate = new Date(yearMatch[1] + '-12-01');
        } else {
          current = true; // If no clear end date, assume current
        }
      }
    }

    // Fallback: if we couldn't parse any dates, set reasonable defaults
    if (!startDate) {
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear + '-01-01');
      console.warn(`Could not parse start date from period: "${experience.period}", using current year`);
    }

    return {
      ...experience,
      startDate,
      endDate,
      current,
      achievements: experience.achievements.map(ach => ({
        id: ach.id,
        title: ach.achievement,
        description: '', // Database doesn't have description field
        order: ach.order
      })),
      skills: experience.skills.map(skill => ({
        id: skill.id,
        name: skill.skill,
        order: skill.order
      }))
    };
  };

  // Helper function to convert FormExperience to database format
  const formToExperience = (formData: FormExperience) => {
    // Convert Date objects to YYYY-MM format for API
    const formatDate = (date: Date | null) => {
      if (!date) return '';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    const startDate = formatDate(formData.startDate);
    const endDate = formatDate(formData.endDate);

    return {
      ...formData,
      startDate,
      endDate,
      achievements: formData.achievements.map(ach => ({
        title: ach.title, // Will be converted to 'achievement' in API
        order: ach.order
      })),
      skills: formData.skills.map(skill => ({
        name: skill.name, // Will be converted to 'skill' in API
        order: skill.order
      }))
    };
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingExperience 
        ? `/api/admin/experiences/${editingExperience.id}`
        : '/api/admin/experiences';
      
      const method = editingExperience ? 'PUT' : 'POST';
      
      // Convert form data to the format expected by the API
      const dataToSend = formToExperience(formData);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await fetchExperiences();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchExperiences();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormExperience);
    setEditingExperience(null);
    setShowForm(false);
  };

  const startEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData(experienceToForm(experience));
    setShowForm(true);
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [
        ...formData.achievements,
        { title: '', description: '', order: formData.achievements.length }
      ]
    });
  };

  const updateAchievement = (index: number, field: 'title' | 'description', value: string) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [
        ...formData.skills,
        { name: '', order: formData.skills.length }
      ]
    });
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = { ...updatedSkills[index], name: value };
    setFormData({ ...formData, skills: updatedSkills });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded mb-4 max-w-md"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-zinc-800 rounded"></div>
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
              <h1 className="text-xl font-bold">Manage Experience</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Experience List */}
      <div className="grid gap-6 mb-8">
        {experiences.map((experience) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-zinc-100">{experience.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    experience.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {experience.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {experience.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {experience.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {experience.period}
                  </div>
                </div>
                <p className="text-zinc-300 mb-4">{experience.description}</p>
                
                {experience.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Achievements
                    </h4>
                    <ul className="space-y-1">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-zinc-400">
                          • {achievement.achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {experience.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200 mb-2 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs"
                        >
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEdit(experience)}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(experience.id!)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-100">
                  {editingExperience ? 'Edit Experience' : 'Add Experience'}
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
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      required
                    >
                      {experienceTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Start Date *
                    </label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => setFormData({ ...formData, startDate: date })}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="Select start month/year"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                      wrapperClassName="w-full"
                      popperClassName="react-datepicker-popper"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      End Date
                    </label>
                    <div className="space-y-3">
                      <DatePicker
                        selected={formData.endDate}
                        onChange={(date) => setFormData({ ...formData, endDate: date })}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        placeholderText="Select end month/year"
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        wrapperClassName="w-full"
                        popperClassName="react-datepicker-popper"
                        disabled={formData.current}
                        minDate={formData.startDate}
                      />
                      <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input
                          type="checkbox"
                          checked={formData.current}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            current: e.target.checked,
                            endDate: e.target.checked ? null : formData.endDate
                          })}
                          className="rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500"
                        />
                        Currently working here
                      </label>
                    </div>
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
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Achievements */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-zinc-300">
                      Achievements
                    </label>
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Add Achievement
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm text-zinc-400">Achievement {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Achievement title"
                            value={achievement.title}
                            onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:border-blue-500 focus:outline-none"
                          />
                          <textarea
                            placeholder="Achievement description"
                            value={achievement.description}
                            onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-zinc-100 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-zinc-300">
                      Skills
                    </label>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Add Skill
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Skill name"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="px-2 py-2 text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                    {saving ? 'Saving...' : 'Save Experience'}
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