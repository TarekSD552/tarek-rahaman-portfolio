"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Layers,
  Award,
  ChevronDown,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { projectsData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { ProjectItem } from "@/types/portfolio";
import { normalizeImageUrl } from "@/lib/image-utils";

export default function ProjectsSection() {
  const { cmsData } = useCms();
  const { language, t, tCms, tCategory } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "100px 0px" });

  const sectionMeta = cmsData?.homeSections?.find((s) => s.key === "projects");
  const portfolioSettings = cmsData?.homePortfolioSettings;
  const badgeLabel = tCms(portfolioSettings?.badge || sectionMeta?.badge, "projects.badge");
  const badgeNumber = portfolioSettings?.badgeNumber || "08";
  const titleText = tCms(portfolioSettings?.title || sectionMeta?.title, "projects.title");
  const subtitleText = tCms(portfolioSettings?.subtitle || sectionMeta?.subtitle, "projects.subtitle");
  const descText = tCms(
    portfolioSettings?.description || sectionMeta?.description,
    "projects.description"
  );
  const buttonText = tCms(portfolioSettings?.buttonText, "projects.exploreButton");
  const buttonUrl = portfolioSettings?.buttonUrl || "/portfolio";
  const statsList = [
    {
      id: "p-stat-1",
      value: "10+",
      label: language === "bn" ? "প্রজেক্ট" : "Projects",
      icon: "FolderGit2",
      visible: true,
    },
    {
      id: "p-stat-2",
      value: "5+",
      label: language === "bn" ? "ক্যাটাগরি" : "Categories",
      icon: "Layers",
      visible: true,
    },
    {
      id: "p-stat-3",
      value: "100%",
      label: language === "bn" ? "ক্লায়েন্ট সন্তুষ্টি" : "Client Satisfaction",
      icon: "Award",
      visible: true,
    },
  ];

  // Retrieve all existing projects from CMS or fallback data
  const rawProjects: ProjectItem[] =
    cmsData?.projects && cmsData.projects.length > 0
      ? cmsData.projects
      : projectsData;

  // Active & featured projects for the Homepage Portfolio Preview
  const featuredProjects = rawProjects.filter((p) => p.active !== false && p.featured);
  const allProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : rawProjects.filter((p) => p.active !== false);

  const total = allProjects.length;

  // Active featured project
  const activeProject: ProjectItem =
    allProjects[currentIndex] || allProjects[0] || projectsData[0];

  // Manual navigation handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatic slideshow: advances every 2.5 seconds when visible
  useEffect(() => {
    if (!isInView || isPaused || total <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 2500);

    return () => clearInterval(timer);
  }, [isInView, isPaused, total]);

  // Mouse Parallax for subtle 3D depth — zero React re-render overhead via CSS variables
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.setProperty("--mx", x.toFixed(4));
    stageRef.current.style.setProperty("--my", y.toFixed(4));
  };

  const handleMouseLeave = () => {
    if (stageRef.current) {
      stageRef.current.style.setProperty("--mx", "0");
      stageRef.current.style.setProperty("--my", "0");
    }
    setIsPaused(false);
  };

  // Touch / Swipe Navigation for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Clean URL string for the browser address bar
  const cleanUrl = activeProject.liveUrl
    ? activeProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "live-website.com";

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      aria-label="My Portfolio"
      className="relative w-full bg-gradient-to-b from-[#040a20] via-[#05102a] to-[#040a20] pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 lg:pb-5 overflow-hidden select-none scroll-mt-20"
    >
      {/* Anchor targets for smooth scrolling from /#projects or /#project */}
      <span id="projects" className="absolute -top-24 pointer-events-none" />
      <span id="project" className="absolute -top-24 pointer-events-none" />
      {/* ======================================================== */}
      {/* Unified Continuous Dark Navy & Blue Ambient Background    */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* 1. Deep Atmospheric Dark Navy Radial Depth Pool across Entire Section */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 70% at 50% 50%, rgba(6, 26, 62, 0.65) 0%, rgba(4, 14, 36, 0.92) 60%, rgba(3, 9, 24, 1) 100%)",
          }}
        />

        {/* 2. Soft Blue / Cyan Ambient Glow on Left Side */}
        <div className="absolute top-1/4 -left-20 w-[500px] sm:w-[650px] h-[480px] bg-gradient-to-r from-[#0077b6]/22 via-[#00d2ff]/14 to-transparent rounded-full blur-[140px]" />

        {/* 3. Soft Ocean-Blue Ambient Glow Behind Website Preview (Unified Tone, Zero Purple) */}
        <div className="absolute top-1/4 -right-20 w-[550px] sm:w-[700px] h-[520px] bg-gradient-to-l from-[#0055bb]/22 via-[#0088dd]/14 to-transparent rounded-full blur-[140px]" />

        {/* 4. Center Subtle Floor Glow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[800px] h-[220px] bg-gradient-to-r from-[#00d2ff]/08 via-[#0077b6]/08 to-[#00d2ff]/08 rounded-full blur-[140px]" />

        {/* 5. Subtle Top and Bottom Edge Feathering to Blend with Adjacent Sections */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#040a20] via-[#040a20]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050811] via-[#050811]/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ======================================================== */}
        {/* TWO-COLUMN SPLIT LAYOUT (EXACT REFERENCE DESIGN 08)     */}
        {/* ======================================================== */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center"
        >

          {/* ------------------------------------------------------ */}
          {/* 1. LEFT SIDE: CONTENT, STATISTICS & CTA               */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left z-20">

            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#0a1224]/90 backdrop-blur-md border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] mb-3.5 sm:mb-4"
            >
              <span className="px-1.5 py-0.5 rounded-full bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[10px] font-black text-[#00f0ff] uppercase">
                {badgeNumber}
              </span>
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#00f0ff] uppercase">
                {badgeLabel}
              </span>
            </motion.div>

            {/* Main Heading with glowing Cyan Highlight */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4"
            >
              <span>{titleText} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#00d2ff] drop-shadow-[0_0_25px_rgba(0,210,255,0.6)]">
                {subtitleText}
              </span>
            </motion.h2>

            {/* Short Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 sm:mb-7 max-w-lg"
            >
              {descText}
            </motion.p>

            {/* Statistics Row */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="flex flex-wrap items-center gap-5 sm:gap-7 mb-7 sm:mb-8"
            >
              {statsList.filter((s) => s.visible !== false).map((stat, i) => {
                const IconComponent = stat.icon === "Layers" ? Layers : stat.icon === "Award" ? Award : FolderGit2;
                return (
                  <div key={stat.id || stat.label || i} className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,210,255,0.2)] shrink-0">
                      <IconComponent className="w-5 h-5 text-[#00f0ff]" />
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.32 }}
            >
              <Link
                href={buttonUrl}
                className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] via-[#00d2ff] to-[#00a8ff] text-[#050811] shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{buttonText}</span>
                <ChevronDown className="w-4 h-4 text-[#050811] transition-transform duration-300 group-hover:translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* 2. RIGHT SIDE: 3D LAPTOP SLIDER + ORBITAL LIGHT RING   */}
          {/* ------------------------------------------------------ */}
          <div
            className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center justify-center min-h-[400px] sm:min-h-[460px] md:min-h-[500px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

            {/* A. NEON ORBIT RING (Behind Laptop, matching Reference) */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 transition-transform duration-700 ease-out"
              style={{
                transform: "translate3d(calc(var(--mx, 0) * -24px), calc(var(--my, 0) * -18px), 0)",
              }}
            >
              <svg
                viewBox="0 0 680 440"
                className="w-full max-w-[340px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[620px] h-auto overflow-visible"
              >
                <defs>
                  {/* Neon Cyan to Ocean-Blue Gradient (Zero Purple) */}
                  <linearGradient id="hero-orbit-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#0077b6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0055bb" stopOpacity="0.8" />
                  </linearGradient>

                  <filter id="hero-orbit-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Soft Glowing Ambient Aura */}
                <ellipse
                  cx="340"
                  cy="220"
                  rx="300"
                  ry="150"
                  transform="rotate(-20 340 220)"
                  fill="none"
                  stroke="url(#hero-orbit-grad)"
                  strokeWidth="8"
                  opacity="0.32"
                  filter="url(#hero-orbit-glow)"
                />

                {/* Sharp Glowing Neon Circuit Ring */}
                <ellipse
                  cx="340"
                  cy="220"
                  rx="300"
                  ry="150"
                  transform="rotate(-20 340 220)"
                  fill="none"
                  stroke="url(#hero-orbit-grad)"
                  strokeWidth="3.2"
                  className="drop-shadow-[0_0_16px_rgba(0,240,255,0.7)]"
                />

                {/* Orbit Traveling Particle 1: Cyan Pulse */}
                <circle
                  r="3.5"
                  fill="#00f0ff"
                  className="drop-shadow-[0_0_10px_#00f0ff] animate-pulse"
                  cx="120"
                  cy="280"
                />

                {/* Orbit Traveling Particle 2: Ocean Blue Pulse */}
                <circle
                  r="3"
                  fill="#38bdf8"
                  className="drop-shadow-[0_0_10px_#38bdf8] animate-pulse"
                  cx="540"
                  cy="140"
                />
              </svg>
            </div>

            {/* B. 3D FLOATING LAPTOP SHOWCASE CONTAINER */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-[260px] xs:max-w-[310px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[560px] flex flex-col items-center"
              style={{
                perspective: "1200px",
              }}
            >
              {/* Perspective Wrapper with Smooth Mouse Tilt */}
              <div
                className="w-full relative transition-transform duration-500 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(calc(-15deg + var(--mx, 0) * 12deg)) rotateX(calc(9deg - var(--my, 0) * 8deg)) rotateZ(-2.5deg)",
                }}
              >
                {/* Previous Arrow Button (Floating on Left of Preview) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handlePrev();
                  }}
                  aria-label="Previous Project"
                  title="Previous Project"
                  className="absolute -left-2 sm:-left-5 top-[45%] -translate-y-1/2 z-30 w-7 sm:w-10 h-7 sm:h-10 rounded-full bg-[#0a1224]/90 backdrop-blur-md border border-[#00d2ff]/40 text-[#00f0ff] hover:bg-[#00d2ff] hover:text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_25px_rgba(0,210,255,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
                >
                  <ChevronLeft className="w-3.5 sm:w-5 h-3.5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                </button>

                {/* Next Arrow Button (Floating on Right of Preview) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleNext();
                  }}
                  aria-label="Next Project"
                  title="Next Project"
                  className="absolute -right-2 sm:-right-5 top-[45%] -translate-y-1/2 z-30 w-7 sm:w-10 h-7 sm:h-10 rounded-full bg-[#0a1224]/90 backdrop-blur-md border border-[#00d2ff]/40 text-[#00f0ff] hover:bg-[#00d2ff] hover:text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_25px_rgba(0,210,255,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 sm:w-5 h-3.5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 1. LAPTOP DISPLAY LID (Screen Housing) */}
                <div className="relative w-full aspect-[16/10] bg-[#0c101c] rounded-t-2xl p-2 sm:p-2.5 border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(0,210,255,0.22)] overflow-hidden">

                  {/* Top Web Camera & Window Bezel Notch */}
                  <div className="flex items-center justify-between px-1 mb-1 sm:mb-1.5 select-none">
                    {/* Browser Window Control Buttons */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ff5f56]" />
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ffbd2e]" />
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#27c93f]" />
                    </div>

                    {/* Camera Dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-black/90 border border-white/25" />

                    {/* Live Website URL Pill */}
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] sm:text-[10px] text-slate-300 font-mono flex items-center gap-1 hover:text-[#00f0ff] transition-colors"
                      title={`Open ${cleanUrl} in a new tab`}
                    >
                      <Lock className="w-2.5 h-2.5 text-[#00f0ff] shrink-0" />
                      <span className="truncate max-w-[130px] sm:max-w-[180px]">
                        {cleanUrl}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                    </a>
                  </div>

                  {/* Screen Content: Clickable Project Screenshot Slider */}
                  <div className="relative w-full h-[calc(100%-20px)] sm:h-[calc(100%-24px)] rounded-b-lg overflow-hidden bg-[#070b14]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProject.id || currentIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="w-full h-full relative"
                      >
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block w-full h-full group/screen cursor-pointer overflow-hidden"
                          title={`Click to open ${activeProject.title} live website (${activeProject.liveUrl})`}
                        >
                          {/* Real Project Screenshot */}
                          <img
                            src={normalizeImageUrl(activeProject.image)}
                            alt={activeProject.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/screen:scale-105"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== "/assets/Screenshot-2026-08-28-003617.png") {
                                target.src = "/assets/Screenshot-2026-08-28-003617.png";
                              }
                            }}
                          />

                          {/* Glass Surface Reflection Gradient (Apple Glare) */}
                          <div
                            className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.10]"
                            aria-hidden="true"
                          />

                          {/* Hover Overlay: Dark Glass Pill with External Link */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050811]/90 backdrop-blur-md border border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.6)] text-[#00f0ff] text-xs font-bold tracking-wide transform scale-95 group-hover/screen:scale-100 transition-transform duration-300">
                              <span>{t("projects.livePreview", "Open Live Website")}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#00f0ff]" />
                            </div>
                          </div>

                          {/* Subtle Bottom Vignette */}
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </a>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* 2. LAPTOP BASE (Keyboard Deck in Perspective) */}
                <div className="relative w-[104%] -left-[2%] h-3.5 sm:h-4.5 bg-gradient-to-b from-[#1b2336] via-[#101726] to-[#070a12] rounded-b-xl border-t border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  {/* Front Lip Opening Indent Notch */}
                  <div className="w-14 sm:w-20 h-1 bg-white/30 rounded-full" />
                </div>

                {/* 3. REALISTIC CAST FLOOR SHADOW */}
                <div
                  className="w-[85%] mx-auto h-7 bg-black/90 blur-xl rounded-full -mt-2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* C. ACTIVE PROJECT TITLE & CATEGORY BADGE */}
              <div className="flex items-center justify-between w-full px-2 sm:px-4 mt-3 sm:mt-4 z-20">
                <div className="flex items-center gap-2 truncate">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[#00d2ff] bg-[#00d2ff]/10 border border-[#00d2ff]/30 shrink-0">
                    {activeProject.categoryName || activeProject.category}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {activeProject.title}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 shrink-0 ml-2">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </div>
              </div>

              {/* D. PAGINATION DOTS (Active dot glows with cyan/blue gradient) */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 sm:mt-3 z-20">
                {allProjects.map((p, idx) => {
                  const isCur = idx === currentIndex;
                  return (
                    <button
                      key={p.id || idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurrentIndex(idx);
                      }}
                      aria-label={`Jump to project ${idx + 1}: ${p.title}`}
                      title={p.title}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isCur
                          ? "w-7 bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#00a8ff] shadow-[0_0_12px_#00f0ff]"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  );
                })}
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
