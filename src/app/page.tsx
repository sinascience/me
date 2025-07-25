import { HeroSection } from "@/components/sections/hero";
import { SkillsSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { ResizableNavigation } from "@/components/resizeable-navigation";
import { Background } from "@/components/ui/background";

export default function Home() {
  return (
    <main className="relative bg-[#0f0f0f] text-zinc-100 min-h-screen">
      <Background className="fixed top-0 left-0 h-svh w-screen z-0" />
      <ResizableNavigation />
      <div className="relative min-h-screen z-10">
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </main>
  );
}
