"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  Send,
  MessageCircle,
  Globe,
  Coffee,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus({ type: "loading", message: "Sending message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const errorData = await response.json();
        setStatus({
          type: "error",
          message:
            errorData.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
      console.log(error);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "sina4science@gmail.com",
      href: "mailto:sina4science@gmail.com",
      color: "text-blue-400",
      description: "Best for professional inquiries",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "/in/anis-fajar-fakhruddin-33aa402ba/",
      href: "https://linkedin.com/in/anis-fajar-fakhruddin-33aa402ba/",
      color: "text-indigo-400",
      description: "Professional networking",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "/sinascience",
      href: "https://github.com/sinascience",
      color: "text-purple-400",
      description: "Code repositories and contributions",
    },
    {
      icon: MessageCircle,
      label: "Discord",
      value: "@belpoizz",
      href: "https://discord.com/users/858389159555497994",
      color: "text-indigo-400",
      description: "Quick communication",
    },
  ];

  const availability = [
    { label: "Location", value: "Indonesia", icon: MapPin },
    { label: "Timezone", value: "UTC+7 (WIB)", icon: Globe },
    { label: "Status", value: "Available for opportunities", icon: Calendar },
    { label: "Response Time", value: "Within 24 hours", icon: Coffee },
  ];

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Let&apos;s Work Together
          </span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Ready to bring your ideas to life with scalable, professional
          solutions. Let&apos;s discuss how I can contribute to your next
          project.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-zinc-200 mb-8">
            Get In Touch
          </h3>

          <div className="space-y-6 mb-12">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div
                  className={`p-3 rounded-lg bg-zinc-800 ${method.color} mr-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <method.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-zinc-200 mb-1">
                    {method.label}
                  </h4>
                  <p className="text-zinc-300 font-mono text-sm">
                    {method.value}
                  </p>
                  <p className="text-zinc-500 text-sm">{method.description}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Availability */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-zinc-200 mb-4">
              Availability
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availability.map((item, index) => (
                <div key={index} className="flex items-center">
                  <item.icon className="h-4 w-4 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-zinc-400">{item.label}</p>
                    <p className="text-zinc-300 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-zinc-200 mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={status.type === "loading"}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={status.type === "loading"}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={status.type === "loading"}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  disabled={status.type === "loading"}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Status Message */}
              {status.type !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    status.type === "success"
                      ? "bg-green-900/20 border border-green-800 text-green-400"
                      : status.type === "error"
                      ? "bg-red-900/20 border border-red-800 text-red-400"
                      : "bg-blue-900/20 border border-blue-800 text-blue-400"
                  }`}
                >
                  {status.type === "loading" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {status.type === "success" && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {status.type === "error" && (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">{status.message}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={status.type === "loading"}
                whileHover={status.type !== "loading" ? { scale: 1.02 } : {}}
                whileTap={status.type !== "loading" ? { scale: 0.98 } : {}}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status.type === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-24 pt-12 border-t border-zinc-800 text-center"
      >
        <p className="text-zinc-400 mb-4">
          Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Framer
          Motion
        </p>
        <p className="text-zinc-500 text-sm">
          © 2024 Anis Fajar Fakhruddin. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
}
