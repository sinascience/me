"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Code,
  Star,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Skill } from "@/types/cms";

export default function AdminSkillsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    proficiency: "advanced",
    color: "#3b82f6",
    icon: "Code",
    order: 0,
  });

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    setIsAuthenticated(true);
    fetchSkills();
  }, [router]);

  const fetchSkills = async () => {
    try {
      const auth = localStorage.getItem("admin_auth");
      const response = await fetch("/api/admin/skills", {
        headers: { Authorization: `Bearer ${auth}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        setMessage({ type: "error", text: "Failed to fetch skills" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while fetching skills",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      proficiency: "advanced",
      color: "#3b82f6",
      icon: "Code",
      order: skills.length,
    });
    setEditingSkill(null);
    setShowForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const startEdit = (skill: Skill) => {
    setFormData({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      proficiency: skill.proficiency,
      color: skill.color,
      icon: skill.icon,
      order: skill.order,
    });
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const auth = localStorage.getItem("admin_auth");
      const url = editingSkill
        ? `/api/admin/skills/${editingSkill.id}`
        : "/api/admin/skills";
      const method = editingSkill ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Skill ${editingSkill ? "updated" : "created"} successfully!`,
        });
        resetForm();
        fetchSkills();
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Failed to save skill",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while saving the skill",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const auth = localStorage.getItem("admin_auth");
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth}` },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Skill deleted successfully!" });
        fetchSkills();
      } else {
        setMessage({ type: "error", text: "Failed to delete skill" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const iconOptions = [
    "Code",
    "Database",
    "Globe",
    "Smartphone",
    "Cpu",
    "Palette",
    "Settings",
    "Cloud",
  ];
  const categoryOptions = [
    "frontend",
    "backend",
    "database",
    "mobile",
    "devops",
    "design",
    "tools",
    "other",
  ];

  const getSkillsByCategory = () => {
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    // Sort skills within each category by order
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    return grouped;
  };

  const skillsByCategory = getSkillsByCategory();

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
              <h1 className="text-xl font-bold">Skills Management</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                {showForm ? "Cancel" : "Add Skill"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Add/Edit Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Skill Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="e.g., Frontend Development, Backend APIs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Describe your expertise in this skill area..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Proficiency Level
                    </label>
                    <select
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-12 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      {editingSkill ? "Update Skill" : "Add Skill"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Skills List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : Object.keys(skillsByCategory).length === 0 ? (
            <div className="text-center py-16">
              <Code className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No skills added yet
              </h3>
              <p className="text-zinc-400 mb-6">
                Add your first skill to get started.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
                Add First Skill
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                      <span className="text-zinc-400">
                        {categorySkills.length} skills
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{
                                  backgroundColor: skill.color + "20",
                                  color: skill.color,
                                }}
                              >
                                <Code className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{skill.title}</h4>
                                <p className="text-xs text-zinc-400">
                                  {skill.proficiency}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(skill)}
                                className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded transition-colors duration-300"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() =>
                                  deleteSkill(skill.id, skill.title)
                                }
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded transition-colors duration-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-zinc-400">Proficiency</span>
                              <span className="font-medium capitalize">
                                {skill.proficiency}
                              </span>
                            </div>
                            <div className="w-full bg-zinc-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    skill.proficiency === "beginner"
                                      ? "25"
                                      : skill.proficiency === "intermediate"
                                      ? "50"
                                      : skill.proficiency === "advanced"
                                      ? "75"
                                      : skill.proficiency === "expert"
                                      ? "100"
                                      : "50"
                                  }%`,
                                  backgroundColor: skill.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}

          {/* Status Message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-900/20 border border-green-800 text-green-400"
                  : "bg-red-900/20 border border-red-800 text-red-400"
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              <span>{message.text}</span>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
