"use client";

import { useCms } from "@/context/CmsContext";
import WaveDivider from "@/components/ui/WaveDivider";
import ServicesSection from "@/components/sections/ServicesSection";
import ServicesWhyWorkWithMe from "@/components/sections/ServicesWhyWorkWithMe";
import ServiceAreaSection from "@/components/sections/ServiceAreaSection";
import ServicesWorkflowSection from "@/components/sections/ServicesWorkflowSection";
import ServicesTechStack from "@/components/sections/ServicesTechStack";
import ServicesFaqSection from "@/components/sections/ServicesFaqSection";
import ServicesCtaSection from "@/components/sections/ServicesCtaSection";

export default function ServicesContent() {
  const { cmsData } = useCms();

  const design = cmsData.servicesDesignSettings || {
    sectionOrder: ["hero", "services", "whyUs", "process", "tech", "faq", "cta"],
    sectionVisibility: {
      hero: true,
      services: true,
      whyUs: true,
      process: true,
      tech: true,
      faq: true,
      cta: true,
    },
    showWaveDividers: true,
    show3dBackground: true,
    primaryAccentColor: "#00d2ff",
    secondaryAccentColor: "#818cf8",
  };

  const sectionOrder = design.sectionOrder?.length
    ? design.sectionOrder
    : ["hero", "services", "whyUs", "process", "tech", "faq", "cta"];

  const sectionVisibility = design.sectionVisibility || {
    hero: true,
    services: true,
    whyUs: true,
    process: true,
    tech: true,
    faq: true,
    cta: true,
  };

  const showWaveDividers = design.showWaveDividers !== false;

  const renderSection = (key: string, index: number) => {
    switch (key) {
      case "hero":
        if (sectionVisibility.hero === false) return null;
        return (
          <div key="section-hero">
            <ServicesSection isStandalonePage={true} renderOnly="hero" />
          </div>
        );

      case "services":
        if (sectionVisibility.services === false) return null;
        return (
          <div key="section-services">
            <ServicesSection isStandalonePage={true} renderOnly="services" />
          </div>
        );

      case "whyUs":
        if (sectionVisibility.whyUs === false) return null;
        return (
          <div key="section-whyUs">
            <ServicesWhyWorkWithMe />
            <ServiceAreaSection />
            {showWaveDividers && <WaveDivider variant={3} className="my-2 sm:my-3 !py-0" />}
          </div>
        );

      case "process":
        if (sectionVisibility.process === false) return null;
        return (
          <div key="section-process">
            <ServicesWorkflowSection />
          </div>
        );

      case "tech":
        if (sectionVisibility.tech === false) return null;
        return (
          <div key="section-tech">
            <ServicesTechStack />
            {showWaveDividers && <WaveDivider variant={2} className="my-2 sm:my-3 !py-0" />}
          </div>
        );

      case "faq":
        if (sectionVisibility.faq === false) return null;
        return (
          <div key="section-faq">
            <ServicesFaqSection />
            {showWaveDividers && <WaveDivider variant={4} inverted className="my-2 sm:my-3 !py-0" />}
          </div>
        );

      case "cta":
        if (sectionVisibility.cta === false) return null;
        return (
          <div key="section-cta">
            <ServicesCtaSection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="relative z-10 flex flex-col">
      {sectionOrder.map((key, idx) => renderSection(key, idx))}
    </main>
  );
}

