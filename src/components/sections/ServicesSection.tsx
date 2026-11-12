"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { servicesData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { ServiceItem } from "@/types/portfolio";

// High-fidelity service brand SVGs matching Tarek's engineering stack
function ServiceBrandIcon({
  icon,
  className = "w-7 h-7",
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "WebsiteDesign":
      // Clean modern Monitor with code & responsive layout
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="7 8 10 10 7 12" />
          <line x1="12" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "ECommerce":
      // E-Commerce Shopping Cart with dynamic speed lines
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          <path d="M12 9l2 2 4-4" strokeWidth="2" />
        </svg>
      );
    case "LandingPage":
      // Rocket Launch for High-Conversion Landing Pages
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "Laravel":
      // Official Laravel Isometric Box Logo
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
        </svg>
      );
    case "WordPress":
      // Official WordPress Logo
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
        </svg>
      );
    case "CustomSolution":
      // Bespoke Custom Code & Layers
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    default:
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

// Point-topped rounded hexagonal glass container matching reference image
function HexagonGlassIcon({
  icon,
  variant,
  className = "w-20 h-20",
}: {
  icon: string;
  variant: "lavender" | "rose" | "champagne";
  className?: string;
}) {
  const gradientIds = {
    fill: `hex-glass-fill-${variant}`,
    border: `hex-glass-border-${variant}`,
  };

  // Distinct color palettes matching reference
  const colors = {
    lavender: {
      fillStart: "rgba(255, 255, 255, 0.32)",
      fillMid: "rgba(118, 131, 173, 0.42)",
      fillEnd: "rgba(40, 48, 78, 0.72)",
      borderStart: "rgba(255, 255, 255, 0.8)",
      borderEnd: "rgba(175, 190, 235, 0.35)",
      glow: "drop-shadow(0 0 16px rgba(118, 131, 173, 0.4))",
    },
    rose: {
      fillStart: "rgba(255, 255, 255, 0.38)",
      fillMid: "rgba(185, 122, 142, 0.45)",
      fillEnd: "rgba(74, 36, 53, 0.75)",
      borderStart: "rgba(255, 255, 255, 0.9)",
      borderEnd: "rgba(240, 180, 205, 0.4)",
      glow: "drop-shadow(0 0 20px rgba(195, 125, 148, 0.5))",
    },
    champagne: {
      fillStart: "rgba(255, 255, 255, 0.3)",
      fillMid: "rgba(155, 153, 135, 0.4)",
      fillEnd: "rgba(58, 57, 48, 0.7)",
      borderStart: "rgba(255, 255, 255, 0.75)",
      borderEnd: "rgba(220, 218, 190, 0.35)",
      glow: "drop-shadow(0 0 16px rgba(155, 153, 135, 0.38))",
    },
  };

  const c = colors[variant];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Hexagon SVG with rounded corners & glass gradient */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        style={{ filter: c.glow }}
      >
        <defs>
          <linearGradient id={gradientIds.fill} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={c.fillStart} />
            <stop offset="50%" stopColor={c.fillMid} />
            <stop offset="100%" stopColor={c.fillEnd} />
          </linearGradient>
          <linearGradient id={gradientIds.border} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.borderStart} />
            <stop offset="100%" stopColor={c.borderEnd} />
          </linearGradient>
        </defs>
        <path
          d="M 47 7.5 Q 50 5.8 53 7.5 L 85.5 26.2 Q 88.5 28 88.5 31.5 L 88.5 68.5 Q 88.5 72 85.5 73.8 L 53 92.5 Q 50 94.2 47 92.5 L 14.5 73.8 Q 11.5 72 11.5 68.5 L 11.5 31.5 Q 11.5 28 14.5 26.2 Z"
          fill={`url(#${gradientIds.fill})`}
          stroke={`url(#${gradientIds.border})`}
          strokeWidth="1.8"
        />
      </svg>

      {/* Centered Brand Icon */}
      <div className="absolute inset-0 flex items-center justify-center text-white/95">
        <ServiceBrandIcon icon={icon} className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
    </div>
  );
}

export default function ServicesSection({
  isStandalonePage = false,
  renderOnly = "all",
}: {
  isStandalonePage?: boolean;
  renderOnly?: "all" | "hero" | "services";
} = {}) {
  const { cmsData } = useCms();
  const { language, t, tCms, tService } = useLanguage();
  const rawServices: ServiceItem[] = cmsData.services?.length
    ? cmsData.services
    : servicesData;
  const activeServices = rawServices.filter((s) => s.active !== false);
  const baseServices: ServiceItem[] = activeServices.length > 0 ? activeServices : rawServices;
  const services: ServiceItem[] = baseServices.map((s) => tService(s));

  // Active carousel index (center card)
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "100px 0px" });
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Compute 3 visible cards
  const count = services.length;
  const leftIdx = (activeIndex - 1 + count) % count;
  const centerIdx = activeIndex;
  const rightIdx = (activeIndex + 1) % count;

  const leftService = services[leftIdx];
  const centerService = services[centerIdx];
  const rightService = services[rightIdx];

  const resetAutoSlide = useCallback(() => {
    setTimerKey((k) => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    resetAutoSlide();
  }, [count, resetAutoSlide]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
    resetAutoSlide();
  }, [count, resetAutoSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Check browser tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Automatic carousel sliding every 2000 milliseconds (2 seconds)
  useEffect(() => {
    if (
      !isInView ||
      isHovered ||
      !isTabVisible ||
      selectedService !== null ||
      prefersReducedMotion ||
      count <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 2000);

    return () => clearInterval(timer);
  }, [isInView, isHovered, isTabVisible, selectedService, prefersReducedMotion, count, timerKey]);

  // Keyboard navigation for carousel & modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedService) {
        if (e.key === "Escape") setSelectedService(null);
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [selectedService, handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedService]);

  const servicesHero = cmsData?.servicesHero;
  const heroBadge = servicesHero?.badge || "BESPOKE WEB SOLUTIONS // ARCHITECTURE & ENGINEERING";
  const heroTitle = servicesHero?.title || "Bespoke Web Solutions Crafted for Exponential Growth";
  const heroDesc =
    servicesHero?.description ||
    "From high-converting E-Commerce architectures and custom WordPress systems to robust Laravel backends and bespoke web applications built for speed and longevity.";
  const heroTags = servicesHero?.featureTags?.length
    ? servicesHero.featureTags
    : [
      "100% Bespoke Code",
      "Sub-Second Response",
      "WooCommerce & E-Commerce",
      "Laravel Custom Backends",
      "WordPress Theme & Plugin Core",
    ];

  const homeSectionMeta = cmsData?.homeSections?.find((s) => s.key === "services");
  const homeHeader = cmsData?.homeServicesHeader;
  const homeBadge = tCms(homeHeader?.badge || homeSectionMeta?.badge, "services.badge");
  const homeTitle = tCms(homeHeader?.title || homeSectionMeta?.title, "services.titlePrefix");
  const homeHighlight = tCms(homeHeader?.highlightText || homeSectionMeta?.subtitle, "services.titleHighlight");
  const homeDesc = tCms(
    homeHeader?.description || homeSectionMeta?.description,
    "services.description"
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="Services"
      className="relative pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 95% 70% at 50% 30%, #071022 0%, #060b18 50%, #050811 100%)",
      }}
    >
      {/* Seamless Top Ambient Transition & Incoming Soft Cyan Glow from Photo Section */}
      <div className="absolute top-0 inset-x-0 h-32 sm:h-44 bg-gradient-to-b from-[#050811] via-[#050811]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[200px] bg-gradient-to-b from-[#00d2ff]/08 via-[#0066ff]/04 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Atmospheric Soft Light Beam from top-left matching reference */}
      <div
        className="absolute -top-32 -left-20 w-[650px] h-[650px] pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 15% 15%, rgba(255, 255, 255, 0.22) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
          transform: "rotate(-18deg)",
        }}
      />

      {/* Central Soft Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[55rem] max-w-full h-[24rem] bg-gradient-to-b from-[#8b5cf6]/[0.05] via-[#ec4899]/[0.03] to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {isStandalonePage ? (
          renderOnly !== "services" && (
            /* Dedicated Services Page Hero Header */
            <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-9">
              {servicesHero?.showBadge !== false && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/35 text-[#00d2ff] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,210,255,0.2)] mb-3 sm:mb-4">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />
                  <span>{heroBadge}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white tracking-tight leading-[1.14] mb-3 sm:mb-4">
                {servicesHero?.highlightText ? (
                  <>
                    {heroTitle.includes(servicesHero.highlightText) ? (
                      <>
                        {heroTitle.replace(servicesHero.highlightText, "").trim()}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#c084fc]">
                          {servicesHero.highlightText}
                        </span>
                      </>
                    ) : (
                      heroTitle
                    )}
                  </>
                ) : (
                  heroTitle
                )}
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-5 sm:mb-6 font-normal">
                {heroDesc}
              </p>

              {/* Quick Capability Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                {heroTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1428]/90 border border-[#00d2ff]/30 text-slate-100 text-xs font-semibold tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:border-[#00d2ff]/60 hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )
        ) : (
          renderOnly !== "services" && (
            /* Compact Home Section Header */
            <SectionHeader
              badge={homeBadge}
              title={homeTitle}
              highlightText={homeHighlight}
              description={homeDesc}
              className="mb-3 sm:mb-4 md:mb-5"
            />
          )
        )}

        {renderOnly !== "hero" && (
          <>

            {/* ======================================================== */}
            {/* 1. 3-CARD OVERLAPPING COMPOSITION (UNIFIED FOR ALL SCREENS) */}
            {/* ======================================================== */}
            <div
              className="flex relative items-center justify-center select-none pt-2 pb-5 min-h-[270px] xs:min-h-[295px] sm:min-h-[365px] md:min-h-[390px] lg:min-h-[410px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Nav Arrow: Left */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous service"
                className="absolute left-0.5 sm:left-2 lg:left-6 z-40 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full bg-[#0c1222]/90 hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-[#00d2ff] hover:text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,210,255,0.2)] hover:shadow-[0_0_24px_rgba(0,210,255,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>

              {/* Nav Arrow: Right */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next service"
                className="absolute right-0.5 sm:right-2 lg:right-6 z-40 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full bg-[#0c1222]/90 hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-[#00d2ff] hover:text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,210,255,0.2)] hover:shadow-[0_0_24px_rgba(0,210,255,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>

              {/* Cards Composition Container */}
              <div className="relative flex items-center justify-center w-full max-w-5xl xl:max-w-6xl">

                {/* ---------------------------------------------------- */}
                {/* A. LEFT CARD (Lavender / Soft Blue, Positioned Behind)*/}
                {/* ---------------------------------------------------- */}
                <motion.div
                  key={`left-${leftService.number}`}
                  initial={{ opacity: 0.55, scale: 0.9 }}
                  animate={{ opacity: 0.78, scale: 0.93 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onClick={handlePrev}
                  className="relative z-10 shrink-0 w-[95px] xs:w-[110px] sm:w-[195px] md:w-[235px] lg:w-[255px] h-[205px] xs:h-[225px] sm:h-[285px] md:h-[310px] lg:h-[330px] rounded-[16px] sm:rounded-[20px] md:rounded-[22px] bg-[#0c1017]/90 backdrop-blur-xl border border-white/[0.07] shadow-[0_12px_30px_rgba(0,0,0,0.7)] p-1.5 xs:p-2 sm:p-2.5 md:p-3 flex flex-col justify-between translate-x-6 xs:translate-x-8 sm:translate-x-10 md:translate-x-12 lg:translate-x-14 translate-y-2 cursor-pointer group hover:opacity-100 hover:border-[#00d2ff]/30 transition-all"
                >
                  {/* Top Visual Panel: Lavender / Soft Blue */}
                  <div
                    className="relative w-full h-[58px] xs:h-[68px] sm:h-[100px] md:h-[112px] lg:h-[120px] rounded-[12px] sm:rounded-[14px] md:rounded-[16px] overflow-hidden flex items-center justify-center shadow-inner"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 70% at 65% 35%, #7683ad 0%, #46517a 50%, #282f4e 100%)",
                    }}
                  >
                    {leftService?.imageUrl ? (
                      <img
                        src={leftService.imageUrl}
                        alt={leftService.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-[inherit]"
                      />
                    ) : (
                      <>
                        {/* Diagonal Glass Light Reflections */}
                        <div
                          className="absolute inset-0 pointer-events-none rounded-[inherit]"
                          style={{
                            background:
                              "linear-gradient(125deg, transparent 15%, rgba(255,255,255,0.22) 28%, rgba(255,255,255,0.08) 35%, transparent 48%, rgba(255,255,255,0.18) 58%, rgba(255,255,255,0.04) 66%, transparent 80%)",
                            mixBlendMode: "overlay",
                          }}
                        />
                        {/* Hexagonal Glass Container */}
                        <HexagonGlassIcon icon={leftService.icon} variant="lavender" className="w-[24px] h-[24px] xs:w-[28px] xs:h-[28px] sm:w-[36px] sm:h-[36px] md:w-[46px] md:h-[46px]" />
                      </>
                    )}
                  </div>

                  {/* Lower Content Area */}
                  <div className="relative px-1 xs:px-1.5 sm:px-2.5 pt-1 sm:pt-1.5 pb-0.5 sm:pb-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-[13.5px] font-bold text-white tracking-tight leading-snug line-clamp-2">
                        {leftService.title}
                      </h3>
                      <p className="text-slate-300 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] leading-relaxed mt-0.5 sm:mt-1 line-clamp-2">
                        {leftService.shortDesc}
                      </p>
                    </div>

                    {/* Learn More Button: Aligned to the LEFT */}
                    <div className="pt-1 sm:pt-1.5 flex justify-start w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(leftService);
                        }}
                        className="rounded-full px-2 xs:px-2.5 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 text-[8.5px] xs:text-[9.5px] sm:text-xs font-semibold text-slate-200 hover:text-white bg-[#1a1f2b] hover:bg-[#252c3d] border border-white/[0.16] hover:border-[#00d2ff]/40 shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                      >
                        {leftService.buttonText || "Learn more"}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ---------------------------------------------------- */}
                {/* B. CENTER CARD (Rose / Pink, Taller & In Front)      */}
                {/* ---------------------------------------------------- */}
                <motion.div
                  key={`center-${centerService.number}`}
                  initial={{ scale: 0.96, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-20 shrink-0 w-[170px] xs:w-[195px] sm:w-[245px] md:w-[285px] lg:w-[310px] h-[255px] xs:h-[275px] sm:h-[335px] md:h-[360px] lg:h-[380px] rounded-[18px] sm:rounded-[24px] md:rounded-[26px] bg-[#12151e]/98 backdrop-blur-2xl border border-[#00d2ff]/35 hover:border-[#00d2ff]/65 shadow-[0_22px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,210,255,0.2),0_16px_40px_rgba(185,100,140,0.25)] hover:scale-[1.015] p-2 xs:p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between cursor-default transition-all duration-300"
                >
                  {/* Top Visual Panel: Elegant Rose / Mauve Pink */}
                  <div
                    className="relative w-full h-[78px] xs:h-[88px] sm:h-[125px] md:h-[140px] lg:h-[150px] rounded-[14px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden flex items-center justify-center shadow-inner"
                    style={{
                      background:
                        "radial-gradient(ellipse 95% 75% at 65% 35%, #b97a8e 0%, #854e63 48%, #4a2435 100%)",
                    }}
                  >
                    {centerService?.imageUrl ? (
                      <img
                        src={centerService.imageUrl}
                        alt={centerService.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-[inherit]"
                      />
                    ) : (
                      <>
                        {/* Diagonal Glass Light Reflections */}
                        <div
                          className="absolute inset-0 pointer-events-none rounded-[inherit]"
                          style={{
                            background:
                              "linear-gradient(125deg, transparent 15%, rgba(255,255,255,0.25) 28%, rgba(255,255,255,0.09) 35%, transparent 48%, rgba(255,255,255,0.2) 58%, rgba(255,255,255,0.05) 66%, transparent 80%)",
                            mixBlendMode: "overlay",
                          }}
                        />
                        {/* Hexagonal Glass Container */}
                        <HexagonGlassIcon icon={centerService.icon} variant="rose" className="w-[32px] h-[32px] xs:w-[38px] xs:h-[38px] sm:w-[48px] sm:h-[48px] md:w-[58px] md:h-[58px]" />
                      </>
                    )}
                  </div>

                  {/* Dot matrix texture below visual area */}
                  <div
                    className="absolute top-[90px] xs:top-[102px] sm:top-[140px] md:top-[155px] lg:top-[165px] inset-x-6 h-8 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
                      backgroundSize: "7px 7px",
                      maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                    }}
                  />

                  {/* Lower Content Area: Center card typography */}
                  <div className="relative px-1.5 xs:px-2 sm:px-3 pt-1.5 sm:pt-2 pb-0.5 sm:pb-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[11.5px] xs:text-[12.5px] sm:text-[13.5px] md:text-[15px] lg:text-[1.125rem] font-bold text-white tracking-tight leading-snug line-clamp-2">
                        {centerService.title}
                      </h3>
                      <p className="text-slate-200 text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] leading-relaxed mt-0.5 sm:mt-1 line-clamp-2 md:line-clamp-3">
                        {centerService.shortDesc}
                      </p>
                    </div>

                    {/* Learn More Button: Aligned to the CENTER */}
                    <div className="pt-1.5 sm:pt-2 flex justify-center w-full">
                      <button
                        type="button"
                        onClick={() => setSelectedService(centerService)}
                        className="rounded-full px-3 xs:px-3.5 sm:px-5 py-1 xs:py-1.5 sm:py-2 text-[9.5px] xs:text-[10.5px] sm:text-xs font-semibold text-white bg-[#1a2130] hover:bg-[#252f44] border border-[#00d2ff]/40 hover:border-[#00d2ff] shadow-[0_4px_14px_rgba(0,0,0,0.5),0_0_12px_rgba(0,210,255,0.2)] hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                      >
                        {centerService.buttonText || "Learn more"}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ---------------------------------------------------- */}
                {/* C. RIGHT CARD (Champagne / Silver, Positioned Behind)*/}
                {/* ---------------------------------------------------- */}
                <motion.div
                  key={`right-${rightService.number}`}
                  initial={{ opacity: 0.55, scale: 0.9 }}
                  animate={{ opacity: 0.78, scale: 0.93 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onClick={handleNext}
                  className="relative z-10 shrink-0 w-[95px] xs:w-[110px] sm:w-[195px] md:w-[235px] lg:w-[255px] h-[205px] xs:h-[225px] sm:h-[285px] md:h-[310px] lg:h-[330px] rounded-[16px] sm:rounded-[20px] md:rounded-[22px] bg-[#0c1017]/90 backdrop-blur-xl border border-white/[0.07] shadow-[0_12px_30px_rgba(0,0,0,0.7)] p-1.5 xs:p-2 sm:p-2.5 md:p-3 flex flex-col justify-between -translate-x-6 xs:-translate-x-8 sm:-translate-x-10 md:-translate-x-12 lg:-translate-x-14 translate-y-2 cursor-pointer group hover:opacity-100 hover:border-[#00d2ff]/30 transition-all"
                >
                  {/* Top Visual Panel: Champagne / Silver */}
                  <div
                    className="relative w-full h-[58px] xs:h-[68px] sm:h-[100px] md:h-[112px] lg:h-[120px] rounded-[12px] sm:rounded-[14px] md:rounded-[16px] overflow-hidden flex items-center justify-center shadow-inner"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 70% at 65% 35%, #9b9987 0%, #6b6959 50%, #3a3930 100%)",
                    }}
                  >
                    {rightService?.imageUrl ? (
                      <img
                        src={rightService.imageUrl}
                        alt={rightService.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-[inherit]"
                      />
                    ) : (
                      <>
                        {/* Diagonal Glass Light Reflections */}
                        <div
                          className="absolute inset-0 pointer-events-none rounded-[inherit]"
                          style={{
                            background:
                              "linear-gradient(125deg, transparent 15%, rgba(255,255,255,0.22) 28%, rgba(255,255,255,0.08) 35%, transparent 48%, rgba(255,255,255,0.18) 58%, rgba(255,255,255,0.04) 66%, transparent 80%)",
                            mixBlendMode: "overlay",
                          }}
                        />
                        {/* Hexagonal Glass Container */}
                        <HexagonGlassIcon icon={rightService.icon} variant="champagne" className="w-[24px] h-[24px] xs:w-[28px] xs:h-[28px] sm:w-[36px] sm:h-[36px] md:w-[46px] md:h-[46px]" />
                      </>
                    )}
                  </div>

                  {/* Lower Content Area */}
                  <div className="relative px-1 xs:px-1.5 sm:px-2.5 pt-1 sm:pt-1.5 pb-0.5 sm:pb-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-[13.5px] font-bold text-white tracking-tight leading-snug line-clamp-2">
                        {rightService.title}
                      </h3>
                      <p className="text-slate-300 text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] leading-relaxed mt-0.5 sm:mt-1 line-clamp-2">
                        {rightService.shortDesc}
                      </p>
                    </div>

                    {/* Learn More Button: Aligned to the RIGHT */}
                    <div className="pt-1 sm:pt-1.5 flex justify-end w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(rightService);
                        }}
                        className="rounded-full px-2 xs:px-2.5 sm:px-4 py-0.5 xs:py-1 sm:py-1.5 text-[8.5px] xs:text-[9.5px] sm:text-xs font-semibold text-slate-200 hover:text-white bg-[#1a1f2b] hover:bg-[#252c3d] border border-white/[0.16] hover:border-[#00d2ff]/40 shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                      >
                        {rightService.buttonText || "Learn more"}
                      </button>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>



            {/* ======================================================== */}
            {/* 3. CAROUSEL PAGINATION INDICATOR DOTS (ALL 6 SERVICES)   */}
            {/* ======================================================== */}
            <div
              className="flex items-center justify-center gap-2 mt-3 sm:mt-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {services.map((srv, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={srv.number}
                    type="button"
                    onClick={() => {
                      setActiveIndex(idx);
                      resetAutoSlide();
                    }}
                    aria-label={`Go to service ${idx + 1}: ${srv.title}`}
                    className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${isActive
                        ? "w-8 bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#c084fc] shadow-[0_0_12px_rgba(0,210,255,0.7)]"
                        : "w-2 bg-white/20 hover:bg-[#00d2ff]/40"
                      }`}
                  />
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* ======================================================== */}
      {/* 4. PRESERVED SERVICE DETAIL MODAL                        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050811]/90 backdrop-blur-2xl"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0e1322] border border-white/15 shadow-[0_0_60px_rgba(185,122,142,0.35),0_30px_70px_rgba(0,0,0,0.95)] p-6 sm:p-8 overflow-hidden select-none"
            >
              {/* Modal Background Ambient Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#b97a8e]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-black text-[#e092a9]">
                    {selectedService.number}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    // Service Architecture
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-9 h-9 rounded-full bg-[#171d2e] hover:bg-[#b97a8e] hover:text-[#050811] text-slate-300 border border-white/15 hover:border-transparent flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Title & Full Description */}
              <div className="my-6 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {selectedService.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {selectedService.fullDesc}
                </p>
              </div>

              {/* Key Deliverables & Features */}
              <div className="mb-6 space-y-2.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#e092a9]">
                  {t("services.featuresTitle", "Key Deliverables & Engineering Standards:")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#e092a9] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              {selectedService.techStack && (
                <div className="mb-6 space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {language === "bn" ? "প্রযুক্তি স্ট্যাক:" : "Technology Stack:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-[#b97a8e]/10 border border-[#b97a8e]/30 text-[#e092a9]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {language === "bn"
                    ? "আপনার প্রজেক্টের জন্য উপযুক্ত সমাধান প্রয়োজন?"
                    : "Ready to elevate your digital presence?"}
                </span>

                <Link
                  href={selectedService.buttonUrl || `/contact?service=${encodeURIComponent(selectedService.title)}`}
                  target={selectedService.openInNewTab ? "_blank" : undefined}
                  rel={selectedService.openInNewTab ? "noopener noreferrer" : undefined}
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#e092a9] via-[#f0b4c6] to-[#b97a8e] shadow-[0_0_20px_rgba(224,146,169,0.5)] hover:shadow-[0_0_30px_rgba(224,146,169,0.8)] transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{selectedService.buttonText || (language === "bn" ? "বিস্তারিত আলোচনা করুন" : "Inquire About This Service")}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
