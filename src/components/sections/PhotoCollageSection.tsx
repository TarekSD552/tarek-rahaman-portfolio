"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Monitor,
  Users,
  Star,
  User,
  Award,
  Briefcase,
} from "lucide-react";
import { collagePhotosData } from "@/data/portfolioData";
import { CollagePhotoItem } from "@/types/portfolio";
import { useCms } from "@/context/CmsContext";
import { normalizeImageUrl } from "@/lib/image-utils";

// Helper to render accurate icons for each badge matching reference
function getBadgeIcon(badge?: string) {
  switch (badge) {
    case "WORKSTATION":
      return <Monitor className="w-3.5 h-3.5 text-[#00d2ff]" />;
    case "COLLABORATION":
      return <Users className="w-3.5 h-3.5 text-[#00d2ff]" />;
    case "MAIN FOCAL PORTRAIT":
      return <User className="w-3.5 h-3.5 text-[#00d2ff]" />;
    case "CERTIFICATION":
      return <Award className="w-3.5 h-3.5 text-[#00d2ff]" />;
    case "PROFESSIONAL":
      return <Briefcase className="w-3.5 h-3.5 text-[#00d2ff]" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />;
  }
}

export default function PhotoCollageSection() {
  const { cmsData } = useCms();
  const rawPhotos: CollagePhotoItem[] = cmsData.milestonesPhotos?.length
    ? cmsData.milestonesPhotos
    : collagePhotosData;

  const section = cmsData.homeSections?.find((s) => s.key === "milestones");
  const journeyHeader = cmsData?.homeJourneyHeader || {
    badge: section?.badge || "MOMENTS & MILESTONES",
    headingLine1: "Crafting Digital Solutions,",
    headingLine2: "Living The Journey",
    description: "A glimpse of my work, achievements, and learning journey.",
    showSmileArc: true,
  };

  // Ensure 5 exact card definitions matching reference with CMS badges
  const photos = [
    { ...rawPhotos[0], badge: rawPhotos[0]?.badge || "WORKSTATION" },
    { ...rawPhotos[1], badge: rawPhotos[1]?.badge || "COLLABORATION" },
    { ...rawPhotos[2], badge: rawPhotos[2]?.badge || "MAIN FOCAL PORTRAIT" },
    { ...rawPhotos[3], badge: rawPhotos[3]?.badge || "CERTIFICATION" },
    { ...rawPhotos[4], badge: rawPhotos[4]?.badge || "PROFESSIONAL" },
  ];

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mobileActiveIdx, setMobileActiveIdx] = useState<number>(2); // Center photo by default
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : null
        );
      }
    },
    [selectedIdx, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIdx]);

  // Center mobile scroll on initial mount
  useEffect(() => {
    if (mobileScrollRef.current) {
      const centerCard = mobileScrollRef.current.children[2] as HTMLElement;
      if (centerCard) {
        centerCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, []);

  const activePhoto: CollagePhotoItem | null =
    selectedIdx !== null ? photos[selectedIdx] : null;

  // Staggered Entrance Variants for Header
  const headerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const headerItemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Exact desktop 5-card fan geometry matching reference image with optimized framing
  const desktopLayout = [
    {
      left: "1%",
      top: "22px",
      width: "22%",
      height: "320px",
      zIndex: 10,
      rotation: -5,
      objectPosition: "25% center", // Perfectly frames Tarek working at workstation monitor
    },
    {
      left: "18.5%",
      top: "11px",
      width: "23%",
      height: "340px",
      zIndex: 20,
      rotation: -2,
      objectPosition: "center center", // Collaborative team sprint
    },
    {
      left: "36.8%",
      top: "0px",
      width: "26.4%",
      height: "380px", // Prominent tall focal portrait showing complete visible body, suit & hands
      zIndex: 30,
      rotation: 0,
      objectPosition: "center 8%", // Full face, necktie, chest, suit buttons, and lower torso
    },
    {
      left: "58.5%",
      top: "11px",
      width: "23%",
      height: "340px",
      zIndex: 20,
      rotation: 2,
      objectPosition: "center 15%", // Certificate emblem, Govt. authority & title clearly readable
    },
    {
      left: "77%",
      top: "22px",
      width: "22%",
      height: "320px",
      zIndex: 10,
      rotation: 5,
      objectPosition: "center center", // Professional suit & tie adjustment
    },
  ];

  return (
    <section
      id="visual-journey"
      aria-label="Moments & Milestones"
      className="relative z-20 w-full min-h-[auto] pt-3 sm:pt-4 md:pt-6 pb-6 sm:pb-8 md:pb-12 lg:pb-14 flex flex-col items-center overflow-hidden scroll-mt-20"
      style={{
        background:
          "radial-gradient(ellipse 95% 65% at 50% 45%, #071f38 0%, #051428 55%, #050811 100%)",
      }}
    >
      {/* Seamless Top & Bottom Ambient Edge Blending */}
      <div className="absolute top-0 inset-x-0 h-20 sm:h-24 bg-gradient-to-b from-[#030508] via-[#030508]/65 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-36 sm:h-48 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-transparent pointer-events-none z-10" />
      {/* Soft Ambient Cyan/Blue Glow Overflowing into Services Section */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[180px] bg-gradient-to-t from-[#00d2ff]/12 via-[#0066ff]/08 to-transparent rounded-full blur-[90px] pointer-events-none z-10" />
      {/* ======================================================== */}
      {/* 1. CINEMATIC NAVY & CYAN ATMOSPHERIC BACKGROUND EFFECTS   */}
      {/* ======================================================== */}

      {/* Central Cyan Ambient Light Pool */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] lg:w-[1150px] h-[320px] sm:h-[450px] bg-gradient-to-r from-[#00d2ff]/12 via-[#0088ff]/15 to-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left-Side Glowing Cyan Crescent Arc */}
      <svg
        className="absolute -left-10 lg:-left-6 top-1/2 -translate-y-1/2 w-[320px] lg:w-[420px] h-[520px] lg:h-[620px] pointer-events-none select-none hidden md:block"
        viewBox="0 0 420 620"
        fill="none"
      >
        <path
          d="M -30 50 Q 250 310 -20 570"
          stroke="url(#left-arc-glow)"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_16px_rgba(0,210,255,0.7)]"
        />
        <defs>
          <linearGradient id="left-arc-glow" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#00d2ff" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/3 -left-20 w-[320px] h-[320px] bg-[#00d2ff]/12 rounded-full blur-[100px] pointer-events-none hidden md:block" />

      {/* Right-Side Glowing Cyan Arc */}
      <svg
        className="absolute -right-10 lg:-right-6 top-1/2 -translate-y-1/2 w-[320px] lg:w-[420px] h-[520px] lg:h-[620px] pointer-events-none select-none hidden md:block"
        viewBox="0 0 420 620"
        fill="none"
      >
        <path
          d="M 450 50 Q 170 310 440 570"
          stroke="url(#right-arc-glow)"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_16px_rgba(0,210,255,0.7)]"
        />
        <defs>
          <linearGradient id="right-arc-glow" x1="100%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#00d2ff" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/3 -right-20 w-[320px] h-[320px] bg-[#0088ff]/14 rounded-full blur-[100px] pointer-events-none hidden md:block" />

      {/* Bottom Ambient Cyan Floor Glow */}
      <div className="absolute -bottom-8 inset-x-0 h-36 bg-gradient-to-t from-[#00d2ff]/18 via-[#0088ff]/08 to-transparent blur-2xl pointer-events-none" />

      {/* ======================================================== */}
      {/* 2. SECTION CONTENT CONTAINER                             */}
      {/* ======================================================== */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-start items-center h-full">

        {/* ======================================================== */}
        {/* 2A. HEADING AREA (MOVED UPWARD BY ~40px WITH CLEAN GAP)   */}
        {/* ======================================================== */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="text-center max-w-3xl mx-auto mb-4 sm:mb-5 lg:mb-6"
        >
          {/* Centered Pill Badge with subtle horizontal lines */}
          <motion.div
            variants={headerItemVariants}
            className="flex items-center justify-center gap-3 mb-2 sm:mb-2.5"
          >
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#00d2ff]/40" />
            <div className="group/milestone relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#051528]/90 hover:bg-[#071d37] backdrop-blur-md border border-[#00d2ff]/40 hover:border-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)] hover:shadow-[0_0_28px_rgba(0,210,255,0.6),0_4px_16px_rgba(0,0,0,0.6)] hover:scale-[1.06] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none overflow-hidden animate-milestone-glow">
              {/* Soft Ambient Attention Pulse Ring */}
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00d2ff]/30 via-[#38bdf8]/20 to-[#00d2ff]/30 blur-sm group-hover/milestone:blur-md opacity-70 group-hover/milestone:opacity-100 transition-all duration-300 -z-10 animate-pulse" />

              {/* Shimmer light sweep on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/milestone:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

              <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] transition-transform duration-300 group-hover/milestone:scale-125 group-hover/milestone:rotate-12 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#00d2ff] group-hover/milestone:text-white uppercase transition-colors duration-300 drop-shadow-[0_0_8px_rgba(0,210,255,0.5)]">
                {journeyHeader.badge || section?.badge || "MOMENTS & MILESTONES"}
              </span>
            </div>
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#00d2ff]/40" />
          </motion.div>

          {/* Main 2-Line Heading with Italic Cyan 'Living The Journey' */}
          <motion.h2
            variants={headerItemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-white tracking-tight leading-[1.18]"
          >
            <span>{journeyHeader.headingLine1 || "Crafting Digital Solutions,"}</span>
            <br />
            <span className="text-[#00d2ff] italic font-extrabold drop-shadow-[0_0_25px_rgba(0,210,255,0.45)]">
              {journeyHeader.headingLine2 || "Living The Journey"}
            </span>
          </motion.h2>

          {/* Curved Cyan Glowing Smile Arc directly below heading */}
          {journeyHeader.showSmileArc !== false && (
            <motion.div
              variants={headerItemVariants}
              className="flex justify-center -mt-1 sm:-mt-0.5 mb-1.5"
            >
              <svg
                className="w-44 sm:w-56 md:w-72 h-3.5 sm:h-4 overflow-visible"
                viewBox="0 0 280 20"
                fill="none"
              >
                <path
                  d="M 10 5 Q 140 18 270 5"
                  stroke="url(#cyan-smile-glow)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(0,210,255,0.95)]"
                />
                <defs>
                  <linearGradient id="cyan-smile-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.1" />
                    <stop offset="25%" stopColor="#00d2ff" stopOpacity="1" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                    <stop offset="75%" stopColor="#00d2ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          )}

          {/* Subtitle */}
          <motion.p
            variants={headerItemVariants}
            className="text-slate-200 text-xs sm:text-sm md:text-[15px] font-normal max-w-xl mx-auto tracking-wide"
          >
            {journeyHeader.description || "A glimpse of my work, achievements, and learning journey."}
          </motion.p>
        </motion.div>

        {/* ======================================================== */}
        {/* 2B. DESKTOP & TABLET: 5-CARD OVERLAPPING FAN COLLAGE     */}
        {/* MAINTAINED COMPLETE VISIBILITY & CLEAR GAP FROM SUBTITLE */}
        {/* ======================================================== */}
        <div className="hidden sm:block relative w-full max-w-5xl xl:max-w-[1140px] mx-auto h-[380px] md:h-[385px] lg:h-[390px] select-none overflow-visible mt-0">
          {photos.map((photo, idx) => {
            const isHovered = hoveredIdx === idx;
            const isCenter = idx === 2; // Main Focal Portrait
            const pos = desktopLayout[idx];

            return (
              <motion.div
                key={photo.id}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.92,
                  rotate: pos.rotation * 1.4,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: pos.rotation,
                }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.08 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  scale: isCenter ? 1.03 : 1.05,
                  y: -8,
                  rotate: 0,
                  transition: { duration: 0.28, ease: "easeOut" },
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                  zIndex: isHovered ? 45 : pos.zIndex,
                }}
                className={`absolute group cursor-pointer transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden ${
                  isHovered
                    ? "border-2 border-[#00d2ff] shadow-[0_0_35px_rgba(0,210,255,0.5),0_25px_50px_rgba(0,0,0,0.95)]"
                    : isCenter
                    ? "border-2 border-[#00d2ff] shadow-[0_0_30px_rgba(0,210,255,0.45),0_20px_50px_rgba(0,0,0,0.85)]"
                    : "border border-white/15 shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
                }`}
              >
                {/* Photo Image with Custom Object Position to Reveal Full Photo */}
                <img
                  src={normalizeImageUrl(photo.src)}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: pos.objectPosition || "center top",
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/profile-1-scaled.png") {
                      target.src = "/assets/profile-1-scaled.png";
                    }
                  }}
                />

                {/* Subtle Cinematic Vignette only at bottom edge so body/suit remain fully visible */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04101e]/75 via-[#04101e]/25 to-transparent pointer-events-none" />

                {/* Center Card: FEATURED Crown Badge at Top */}
                {isCenter && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#051528]/90 backdrop-blur-md border border-[#00d2ff]/50 text-[#00d2ff] text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-md pointer-events-none">
                    <Star className="w-3 h-3 text-[#00d2ff] fill-[#00d2ff]" />
                    <span>FEATURED</span>
                  </div>
                )}

                {/* Bottom Centered Pill Badge (Matching Reference) */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 px-3 sm:px-3.5 py-1 rounded-full bg-[#040e1e]/95 backdrop-blur-md border border-[#00d2ff]/50 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(0,210,255,0.45)] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.6)] whitespace-nowrap pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:border-[#00d2ff] group-hover:text-white group-hover:shadow-[0_0_18px_rgba(0,210,255,0.6)]">
                  {getBadgeIcon(photo.badge)}
                  <span>{photo.badge}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* 2C. MOBILE: CLEAN HORIZONTAL SNAP CAROUSEL               */}
        {/* ======================================================== */}
        <div className="sm:hidden w-full mt-3 sm:mt-4">
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 px-3 pb-3 scrollbar-none items-center"
            style={{ scrollBehavior: "smooth" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const cardWidth = 240 + 14;
              const currentIdx = Math.round(el.scrollLeft / cardWidth);
              if (currentIdx >= 0 && currentIdx < photos.length) {
                setMobileActiveIdx(currentIdx);
              }
            }}
          >
            {photos.map((photo, idx) => {
              const isCenter = idx === 2;
              const isActive = mobileActiveIdx === idx;

              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative shrink-0 w-[240px] h-[310px] rounded-2xl overflow-hidden snap-center cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "border-2 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.4)] scale-[1.02]"
                      : isCenter
                      ? "border-2 border-[#00d2ff]/60 shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
                      : "border border-white/15 opacity-85"
                  }`}
                >
                  <img
                    src={normalizeImageUrl(photo.src)}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition:
                        idx === 0
                          ? "25% center"
                          : idx === 2
                          ? "center 8%"
                          : idx === 3
                          ? "center 15%"
                          : "center center",
                    }}
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== "/assets/profile-1-scaled.png") {
                        target.src = "/assets/profile-1-scaled.png";
                      }
                    }}
                  />

                  {/* Gradient overlay in lower 25% only */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#04101e]/75 via-[#04101e]/20 to-transparent pointer-events-none" />

                  {/* Center Card: FEATURED badge at top */}
                  {isCenter && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#051528]/90 backdrop-blur-md border border-[#00d2ff]/50 text-[#00d2ff] text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-md">
                      <Star className="w-2.5 h-2.5 text-[#00d2ff] fill-[#00d2ff]" />
                      <span>FEATURED</span>
                    </div>
                  )}

                  {/* Bottom Pill Badge */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#040e1e]/95 backdrop-blur-md border border-[#00d2ff]/50 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(0,210,255,0.45)] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md whitespace-nowrap">
                    {getBadgeIcon(photo.badge)}
                    <span>{photo.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (mobileScrollRef.current) {
                    const card = mobileScrollRef.current.children[i] as HTMLElement;
                    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                    setMobileActiveIdx(i);
                  }
                }}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  mobileActiveIdx === i
                    ? "w-6 bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]"
                    : "w-1.5 bg-white/20"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. LIGHTBOX MODAL (PRESERVED FULL-VIEW EXPERIENCE)        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activePhoto && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d1b]/90 backdrop-blur-xl"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#07213b] to-[#041224] border border-[#00d2ff]/40 shadow-[0_0_50px_rgba(0,210,255,0.35),0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                aria-label="Close photo preview"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#051528]/85 border border-[#00d2ff]/40 text-slate-300 hover:text-white hover:border-[#00d2ff] flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Nav Buttons */}
              <button
                onClick={() =>
                  setSelectedIdx(
                    (selectedIdx - 1 + photos.length) % photos.length
                  )
                }
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#051528]/85 border border-[#00d2ff]/40 text-slate-300 hover:text-white hover:border-[#00d2ff] flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setSelectedIdx((selectedIdx + 1) % photos.length)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#051528]/85 border border-[#00d2ff]/40 text-slate-300 hover:text-white hover:border-[#00d2ff] flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Modal Image Display */}
              <div className="relative w-full h-[320px] sm:h-[400px] bg-black/40 flex items-center justify-center p-3">
                <img
                  src={normalizeImageUrl(activePhoto.src)}
                  alt={activePhoto.alt}
                  className="max-w-full max-h-full object-contain select-none rounded-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/profile-1-scaled.png") {
                      target.src = "/assets/profile-1-scaled.png";
                    }
                  }}
                />
              </div>

              {/* Modal Footer Info */}
              <div className="p-5 sm:p-6 bg-[#041224]/95 border-t border-[#00d2ff]/25">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-1.5">
                    {getBadgeIcon(activePhoto.badge)}
                    <span>{activePhoto.badge}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Photo {selectedIdx + 1} of {photos.length}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-[#00d2ff] font-semibold mt-0.5">
                  {activePhoto.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  {activePhoto.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
