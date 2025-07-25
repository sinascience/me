"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Home as HomeIcon, User, Briefcase, Award, Mail, Github, Linkedin } from 'lucide-react';
import { useState } from "react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export function ResizableNavigation() {
  const { handleSmoothClick } = useSmoothScroll();
  
  const navItems = [
    { name: "Home", link: "#", icon: <HomeIcon className="h-4 w-4" /> },
    { name: "Skills", link: "#skills", icon: <User className="h-4 w-4" /> },
    { name: "Experience", link: "#experience", icon: <Award className="h-4 w-4" /> },
    { name: "Projects", link: "#projects", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Contact", link: "#contact", icon: <Mail className="h-4 w-4" /> },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody className="bg-transparent backdrop-blur-xl">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          me.
        </div>
        <NavItems 
          items={navItems} 
          className="glassmorphism-nav" 
          onItemClick={(e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href) {
              handleSmoothClick(e, href);
            }
          }}
        />
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anisfajarfakhruddin"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/in/anisfajarfakhruddin"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav className="bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <MobileNavHeader className="bg-transparent backdrop-blur-xl">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Anis Fajar
          </div>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-zinc-300 hover:text-blue-400"
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="bg-[#0f0f0f]/90 backdrop-blur-xl border border-zinc-800/50"
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={(e) => {
                handleSmoothClick(e, item.link);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 p-4 rounded-lg bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 text-zinc-300 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
          <div className="pt-6 border-t border-zinc-800/50">
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/anisfajarfakhruddin"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center p-3 rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/anisfajarfakhruddin"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center p-3 rounded-lg bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
