"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import PhotoCollageSection from "@/components/sections/PhotoCollageSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyChooseMeSection from "@/components/sections/WhyChooseMeSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import FinalCtaSection from "@/components/sections/FinalCtaSection";
import Footer from "@/components/layout/Footer";
import WaveDivider from "@/components/ui/WaveDivider";
import { useCms } from "@/context/CmsContext";
import { defaultCmsData } from "@/lib/cms-default-data";

// Lazy-load Three.js subtle ambient background
const InteractiveBackground = dynamic(
  () => import("@/components/canvas/InteractiveBackground"),
  { ssr: false }
);

const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
  hero: <HeroSection key="sec-hero" />,
  milestones: <PhotoCollageSection key="sec-milestones" />,
  services: (
    <div key="sec-services">
      <ServicesSection />
      <WhyChooseMeSection />
      <WaveDivider variant={2} inverted className="!py-0 my-0 sm:-my-1 md:-my-2" />
    </div>
  ),
  skills: <SkillsSection key="sec-skills" />,
  projects: (
    <div key="sec-projects">
      <ProjectsSection />
      <WaveDivider variant={4} inverted className="!py-0 my-0 sm:-my-1 md:-my-2" />
    </div>
  ),
  workflow: <ProcessSection key="sec-workflow" />,
  about: (
    <div key="sec-about">
      <AboutSection />
      <WaveDivider variant={2} inverted className="!py-0 my-0 sm:-my-1 md:-my-2" />
    </div>
  ),
  testimonials: (
    <div key="sec-testimonials">
      <TestimonialsSection />
      <WaveDivider variant={3} className="!py-0 my-0 sm:-my-1 md:-my-2" />
    </div>
  ),
  clients: (
    <div key="sec-clients">
      <ClientsMarquee />
      <WaveDivider variant={4} inverted className="!py-0 my-0 sm:-my-1 md:-my-2" />
    </div>
  ),
  cta: <FinalCtaSection key="sec-cta" />,
};

export default function Home() {
  const { cmsData, getSectionStatus } = useCms();

  const sectionsToRender = (
    cmsData?.homeSections && cmsData.homeSections.length > 0
      ? [...cmsData.homeSections]
      : defaultCmsData.homeSections
  )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((sec) => sec.enabled !== false && getSectionStatus(sec.key));

  const show3dBg = cmsData?.homeThemeSettings?.enable3dBackground !== false;

  return (
    <>
      {/* Three.js Subtle Ambient Background */}
      {show3dBg && <InteractiveBackground />}

      <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
        {/* Sticky Header Navigation */}
        <Navbar />

        <main className="relative z-10 flex flex-col">
          {sectionsToRender.map((sec) => SECTION_COMPONENTS[sec.key] || null)}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
