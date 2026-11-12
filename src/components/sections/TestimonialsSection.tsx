"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowRight,
  Sparkles,
  Globe,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { testimonialsData, statsData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";

// =========================================================================
// STATISTIC CARD WITH SMOOTH COUNT-UP ANIMATION & HOVER EFFECTS
// =========================================================================
interface StatCardItemProps {
  value: number;
  suffix?: string;
  label: string;
  subtext?: string;
  delay?: number;
}

function StatCard({
  value,
  suffix = "+",
  label,
  subtext,
  delay = 0,
}: StatCardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animId: number;
    const duration = 2000; // 2 seconds smooth count-up

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Cubic ease-out for ultra smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animId = requestAnimationFrame(step);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isInView, value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className="group relative p-3.5 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl flex flex-col justify-between bg-[#091024]/85 hover:bg-[#0c1630] text-white border border-[#00d2ff]/20 hover:border-[#00d2ff]/55 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_32px_rgba(0,210,255,0.22)] hover:-translate-y-1 backdrop-blur-md transition-all duration-300 select-none overflow-hidden"
    >
      {/* Soft Hover Glare Reflection */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent"
        aria-hidden="true"
      />

      <div>
        {/* Large Bold Number with Eased Count-Up */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {displayValue}
          </span>
          <span className="text-xl sm:text-3xl font-black text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff]">
            {suffix}
          </span>
        </div>

        {/* Clean Descriptive Label */}
        <h4 className="text-xs sm:text-base font-bold text-white mt-2.5 sm:mt-3.5 mb-0.5 sm:mb-1 tracking-tight leading-snug">
          {label}
        </h4>

        {/* Small Clean Descriptive Subtext */}
        {subtext && (
          <p className="text-[10px] sm:text-xs leading-relaxed line-clamp-2 text-slate-300">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// =========================================================================
// FUTURISTIC DIGITAL NETWORK GLOBE VISUAL (RIGHT SIDE)
// =========================================================================
function DigitalNetworkGlobe() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] rounded-2xl bg-[#091024]/85 border border-[#00d2ff]/25 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden group select-none shadow-[0_10px_35px_rgba(0,0,0,0.7)]">

      {/* Ambient Lighting Behind Globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] bg-gradient-to-tr from-[#00d2ff]/15 via-[#0066ff]/12 to-[#a855f7]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Tag of the Visual Card */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#00f0ff]">
            {t("testimonials.globalReach")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[10px] font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span>{t("testimonials.liveNetwork")}</span>
        </div>
      </div>

      {/* 3D Angled Digital Globe with Arcs & Floating Country Badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative my-4 sm:my-6 flex items-center justify-center flex-1"
      >
        <div className="relative w-[260px] sm:w-[320px] md:w-[350px] aspect-square flex items-center justify-center">

          {/* Spherical Base */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0c1938] via-[#070e24] to-[#030612] border border-[#00d2ff]/30 shadow-[inset_0_0_50px_rgba(0,210,255,0.15),0_0_30px_rgba(0,102,255,0.25)]" />

          {/* SVG Sphere Grid, Coordinate Arcs & Connection Beams */}
          <svg
            viewBox="0 0 360 360"
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          >
            <defs>
              <linearGradient id="globe-beam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>

              <radialGradient id="globe-glow" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#0066ff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Inner Glare Mask */}
            <circle cx="180" cy="180" r="170" fill="url(#globe-glow)" />

            {/* Latitude Ellipses */}
            <ellipse cx="180" cy="180" rx="170" ry="50" fill="none" stroke="#00d2ff" strokeOpacity="0.22" strokeDasharray="3 3" />
            <ellipse cx="180" cy="120" rx="145" ry="42" fill="none" stroke="#00d2ff" strokeOpacity="0.18" strokeDasharray="3 3" />
            <ellipse cx="180" cy="240" rx="145" ry="42" fill="none" stroke="#00d2ff" strokeOpacity="0.18" strokeDasharray="3 3" />

            {/* Longitude Ellipses */}
            <ellipse cx="180" cy="180" rx="60" ry="170" fill="none" stroke="#00d2ff" strokeOpacity="0.2" strokeDasharray="3 3" />
            <ellipse cx="180" cy="180" rx="120" ry="170" fill="none" stroke="#00d2ff" strokeOpacity="0.18" strokeDasharray="3 3" />

            {/* Outer Rim Ring */}
            <circle cx="180" cy="180" r="170" fill="none" stroke="#00d2ff" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Curved Connection Arcs (Intercontinental Beams) */}
            <path
              d="M 90 130 Q 140 70, 260 110"
              fill="none"
              stroke="url(#globe-beam)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            <path
              d="M 110 220 Q 180 200, 260 110"
              fill="none"
              stroke="url(#globe-beam)"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />
            <path
              d="M 90 130 Q 150 260, 250 240"
              fill="none"
              stroke="url(#globe-beam)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Pulsing Light Nodes */}
            <circle cx="90" cy="130" r="4.5" fill="#00f0ff" className="drop-shadow-[0_0_8px_#00f0ff]" />
            <circle cx="260" cy="110" r="4.5" fill="#00f0ff" className="drop-shadow-[0_0_8px_#00f0ff]" />
            <circle cx="230" cy="165" r="4" fill="#a855f7" className="drop-shadow-[0_0_8px_#a855f7]" />
            <circle cx="110" cy="220" r="3.5" fill="#38bdf8" className="drop-shadow-[0_0_8px_#38bdf8]" />
            <circle cx="250" cy="240" r="3.5" fill="#00f0ff" className="drop-shadow-[0_0_8px_#00f0ff]" />
          </svg>

          {/* Floating Pill Badges */}
          {/* 1. USA (Top-Left) */}
          <div className="absolute top-[28%] left-[6%] z-20 px-2.5 py-0.5 rounded-full bg-[#0066ff] text-white border border-[#00d2ff]/60 text-[10px] sm:text-[11px] font-bold shadow-[0_0_15px_rgba(0,102,255,0.7)] flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{t("testimonials.countriesList.usa")}</span>
          </div>

          {/* 2. UK & Europe (Top-Right) */}
          <div className="absolute top-[24%] right-[8%] z-20 px-2.5 py-0.5 rounded-full bg-[#0066ff] text-white border border-[#00d2ff]/60 text-[10px] sm:text-[11px] font-bold shadow-[0_0_15px_rgba(0,102,255,0.7)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a5f3fc]" />
            <span>{t("testimonials.countriesList.uk")}</span>
          </div>

          {/* 3. UAE & Middle East (Middle-Right) */}
          <div className="absolute top-[44%] right-[3%] z-20 px-2.5 py-0.5 rounded-full bg-[#0052cc] text-white border border-[#00d2ff]/50 text-[10px] sm:text-[11px] font-bold shadow-[0_0_12px_rgba(0,82,204,0.6)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
            <span>{t("testimonials.countriesList.uae")}</span>
          </div>

          {/* 4. Canada (Upper Left) */}
          <div className="absolute top-[16%] left-[22%] z-20 px-2 py-0.5 rounded-full bg-[#0b1b3d]/90 text-slate-200 border border-[#00d2ff]/40 text-[9px] sm:text-[10px] font-semibold backdrop-blur-md">
            <span>{t("testimonials.countriesList.canada")}</span>
          </div>

          {/* 5. Bangladesh (Central / HQ) */}
          <div className="absolute top-[52%] left-[42%] z-20 px-2.5 py-0.5 rounded-full bg-[#0066ff] text-white border border-[#00f0ff] text-[10px] sm:text-[11px] font-bold shadow-[0_0_18px_rgba(0,102,255,0.85)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f]" />
            <span>{t("testimonials.countriesList.bangladesh")}</span>
          </div>

          {/* 6. Australia (Bottom-Right) */}
          <div className="absolute bottom-[24%] right-[10%] z-20 px-2.5 py-0.5 rounded-full bg-[#0066ff] text-white border border-[#00d2ff]/60 text-[10px] sm:text-[11px] font-bold shadow-[0_0_12px_rgba(0,102,255,0.6)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{t("testimonials.countriesList.australia")}</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-300 font-medium">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]" />
          <span>{t("testimonials.activeDeployments")}</span>
        </span>
        <span className="font-mono text-[#00f0ff] font-bold">{t("testimonials.countries")}</span>
      </div>

    </div>
  );
}

// =========================================================================
// MAIN TESTIMONIALS SECTION EXPORT WITH REDESIGNED STATISTICS SHOWCASE
// =========================================================================
export default function TestimonialsSection() {
  const { cmsData } = useCms();
  const { t, tCms, tStatLabel } = useLanguage();
  const testimonials = cmsData?.testimonials?.length ? cmsData.testimonials : testimonialsData;
  const statsList = cmsData?.stats?.length ? cmsData.stats : statsData;
  const sectionMeta = cmsData?.homeSections?.find((s) => s.key === "testimonials");

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

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
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const current = testimonials[currentIndex] || testimonials[0] || testimonialsData[0];

  const testHeader = cmsData?.homeTestimonialsHeader;
  const rawBadge = testHeader?.badge || sectionMeta?.badge || "TESTIMONIALS";
  const badge = tCms(rawBadge, "testimonials.badge");

  const rawTitle = testHeader?.title || sectionMeta?.title || "Good Things You Have Heard About";
  const title = tCms(rawTitle, "testimonials.title");

  const rawSubtitle = testHeader?.highlightText || testHeader?.subtitle || sectionMeta?.subtitle || "Tarek Rahaman";
  const subtitle = tCms(rawSubtitle, "testimonials.subtitle");

  const rawDescription =
    testHeader?.description ||
    sectionMeta?.description ||
    "Here's what our Amazing Clients have to say till now about our web design and development services.";
  const description = tCms(rawDescription, "testimonials.description");

  const rawButtonText = sectionMeta?.buttonText || "Read All Testimonials";
  const buttonText = tCms(rawButtonText, "testimonials.viewAllReviews");
  const buttonLink = sectionMeta?.buttonLink || "/about";

  const statsSettings = cmsData?.homeStatsSettings;
  const rawStatsBadge = statsSettings?.badge || "TRACK RECORD & IMPACT";
  const statsBadge = tCms(rawStatsBadge, "testimonials.journeyBadge");

  const rawStatsTitle = statsSettings?.title || "My Journey in ";
  const statsTitle = tCms(rawStatsTitle, "testimonials.journeyTitle");

  const rawStatsHighlight = statsSettings?.highlightText || "Numbers";
  const statsHighlight = tCms(rawStatsHighlight, "testimonials.journeyHighlight");

  const rawStatsDesc = statsSettings?.description || "Quantifiable milestones reflecting client satisfaction, deployed architectures, and continuous technical growth.";
  const statsDesc = tCms(rawStatsDesc, "testimonials.journeyDesc");

  return (
    <section id="testimonials" className="relative pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 lg:pb-5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================================== */}
        {/* 1. TOP SPLIT TESTIMONIAL SHOWCASE                        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-10">

          {/* Left Column: Heading & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#00d2ff] uppercase">
              {badge}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#00d2ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.5)]">
                {subtitle}
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {description}
            </p>

            <div className="pt-2">
              <Link
                href={buttonLink}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] to-[#0088ff] shadow-[0_0_20px_rgba(0,210,255,0.6)] hover:shadow-[0_0_30px_rgba(0,210,255,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Active Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative p-4 sm:p-7 lg:p-10 rounded-xl sm:rounded-2xl bg-[#090f1e]/90 border border-[#00d2ff]/25 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Quote className="w-7 h-7 sm:w-10 sm:h-10 text-[#00d2ff]/30" />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        star <= (current.rating ?? 5)
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed italic mb-5 sm:mb-8">
                    &ldquo;{current.quote}&rdquo;
                  </p>

                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3.5 xs:gap-0 border-t border-white/[0.08] pt-4 sm:pt-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#00d2ff]/50 bg-slate-800 shrink-0">
                        <img
                          src={normalizeImageUrl(current.avatar, "/assets/profile-1-scaled.png")}
                          alt={current.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/assets/profile-1-scaled.png";
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {current.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#00d2ff] font-medium flex items-center gap-1.5 flex-wrap">
                          <span>{current.role}</span>
                          {current.company && (
                            <>
                              <span className="text-white/30">•</span>
                              <span className="text-slate-300">{current.company}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2 self-end xs:self-auto">
                      <button
                        onClick={prevSlide}
                        className="p-2 sm:p-2.5 rounded-full bg-[#0d162d] border border-[#00d2ff]/30 text-white hover:bg-[#00d2ff] hover:text-black transition-all cursor-pointer"
                        aria-label={t("testimonials.prevTestimonial")}
                      >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="p-2 sm:p-2.5 rounded-full bg-[#0d162d] border border-[#00d2ff]/30 text-white hover:bg-[#00d2ff] hover:text-black transition-all cursor-pointer"
                        aria-label={t("testimonials.nextTestimonial")}
                      >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

        {/* ======================================================== */}
        {/* 2. REDESIGNED STATISTICS SHOWCASE — "MY JOURNEY IN NUMBERS" */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-[#070d1e]/90 backdrop-blur-2xl border border-[#00d2ff]/25 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(0,210,255,0.12)] p-6 sm:p-10 lg:p-12 overflow-hidden"
        >
          {/* Subtle Ambient Glows Inside the Card Container */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0066ff]/15 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#a855f7]/12 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00d2ff]/05 rounded-full blur-[130px] pointer-events-none" />

          {/* Section Header at Top of Container */}
          <div className="text-left mb-8 sm:mb-10 lg:mb-12 relative z-10">
            {/* Small Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a1226]/90 border border-[#00d2ff]/40 shadow-[0_0_12px_rgba(0,210,255,0.2)] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#00f0ff] uppercase font-mono">
                {statsBadge}
              </span>
            </div>

            {/* Main Heading */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              <span>{statsTitle}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#c084fc] drop-shadow-[0_0_25px_rgba(0,210,255,0.5)]">
                {statsHighlight}
              </span>
            </h3>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              {statsDesc}
            </p>
          </div>

          {/* Responsive Two-Column Layout Below Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch relative z-10">

            {/* ---------------------------------------------------- */}
            {/* LEFT SIDE: 2-COLUMN GRID OF 6 STATISTIC CARDS        */}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-5">
              {statsList.map((stat, i) => (
                <StatCard
                  key={stat.label + i}
                  value={stat.value}
                  suffix={stat.suffix ?? "+"}
                  label={tStatLabel(stat.label)}
                  subtext={stat.description}
                  delay={0.05 * (i + 1)}
                />
              ))}
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT SIDE: DIGITAL NETWORK GLOBE & WORLDWIDE IMPACT */}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col">
              <DigitalNetworkGlobe />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
