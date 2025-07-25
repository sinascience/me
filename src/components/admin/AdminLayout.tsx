"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Settings,
  LogOut,
  Eye
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = "Admin Panel" }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

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

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Skills', href: '/admin/skills', icon: Users },
    { name: 'Contact', href: '/admin/contact', icon: MessageCircle },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold text-white">Portfolio CMS</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 text-zinc-300 rounded-lg hover:bg-zinc-800 hover:text-blue-400 transition-colors duration-300 group"
                  >
                    <item.icon className="h-5 w-5 mr-3 group-hover:text-blue-400" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                target="_blank"
                className="flex items-center text-zinc-400 hover:text-blue-400 transition-colors duration-300"
              >
                <Eye className="h-5 w-5 mr-2" />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-zinc-400 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}