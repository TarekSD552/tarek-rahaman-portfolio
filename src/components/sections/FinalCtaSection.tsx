"use client";

import { motion } from "framer-motion";
import { Send, Users, Sparkles, Code2 } from "lucide-react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";

export default function FinalCtaSection() {
  const { cmsData } = useCms();
  const { t, tCms } = useLanguage();
  const sectionMeta = cmsData?.homeSections?.find((s) => s.key === "cta");
  const ctaSettings = cmsData?.homeCtaSettings;

  const rawBadge = ctaSettings?.badge || sectionMeta?.badge || "LET'S WORK TOGETHER";
  const badge = tCms(rawBadge, "finalCta.badge");

  const rawTitle = ctaSettings?.title || sectionMeta?.title || "Have a Vision? Let's Turn It Into Reality.";
  const title = tCms(rawTitle, "finalCta.title");

  const rawDescription =
    ctaSettings?.description ||
    sectionMeta?.description ||
    "Available for freelance projects, WordPress developments, and full-stack contracts.";
  const description = tCms(rawDescription, "finalCta.description");

  const rawButtonText = ctaSettings?.buttonText || sectionMeta?.buttonText || "LET'S TALK PROJECTS";
  const buttonText = tCms(rawButtonText, "finalCta.button");
  const buttonLink = ctaSettings?.buttonLink || sectionMeta?.buttonLink || "/contact";
  const bgImageUrl = normalizeImageUrl(ctaSettings?.bgImageUrl || "/assets/developer-workstation-hd.jpg");
  const codePillText = ctaSettings?.codePillText || "await deployVision()";
  const showCodePill = ctaSettings?.showCodePill !== false;
  const monogramText = ctaSettings?.monogramText || "TR";
  const showMonogram = ctaSettings?.showMonogram !== false;
  const rawMetricPillText = ctaSettings?.metricPillText || "Production Live:";
  const metricPillText = tCms(rawMetricPillText, "finalCta.productionLive");
  const metricPillValue = ctaSettings?.metricPillValue || "100%";
  const showMetricPill = ctaSettings?.showMetricPill !== false;
  return (
    <section
      id="contact"
      aria-label="Call to Action"
      className="relative w-full pt-0 pb-16 sm:pb-20 lg:pb-24 bg-[#050811] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================================== */}
        {/* WIDE HORIZONTAL CINEMATIC CTA BANNER (ONE UNIFIED CANVAS)*/}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-[#030612] border border-[#00d2ff]/35 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(0,210,255,0.18)] overflow-hidden"
        >
          {/* Subtle Bottom Edge Glowing Cyan/Neon Line */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_18px_#00f0ff] z-30" />

          {/* ---------------------------------------------------- */}
          {/* 1. ATMOSPHERIC AMBIENT GLOW LIGHTING (FULL CARD)     */}
          {/* ---------------------------------------------------- */}
          {/* Cyan Glow - Lower Left */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-16 -left-16 w-[450px] h-[350px] bg-gradient-to-tr from-[#00d2ff]/22 via-[#0066ff]/14 to-transparent rounded-full blur-[130px] pointer-events-none z-10"
          />

          {/* Purple Glow - Upper Right */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.22, 0.35, 0.22],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -top-16 right-10 w-[550px] h-[420px] bg-gradient-to-bl from-[#a855f7]/26 via-[#7c3aed]/14 to-transparent rounded-full blur-[140px] pointer-events-none z-10"
          />

          {/* Soft Center Bridge Ambient Light */}
          <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-gradient-to-r from-[#00d2ff]/10 via-[#a855f7]/12 to-transparent rounded-full blur-[130px] pointer-events-none z-10" />

          {/* ---------------------------------------------------- */}
          {/* 2. MOUNTAIN SILHOUETTE + NEON RIDGE (LOWER-LEFT)     */}
          {/* ---------------------------------------------------- */}
          <svg
            viewBox="0 0 540 170"
            className="absolute bottom-0 left-0 w-[280px] sm:w-[420px] md:w-[500px] h-auto pointer-events-none opacity-50 overflow-visible z-10"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cta-mountain-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#0066ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="cta-mountain-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#050a18" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#030612" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M 0 170 L 0 118 Q 70 88, 120 122 T 260 72 Q 330 128, 540 152 L 540 170 Z"
              fill="url(#cta-mountain-fill)"
            />
            <path
              d="M 0 118 Q 70 88, 120 122 T 260 72 Q 330 128, 540 152"
              fill="none"
              stroke="url(#cta-mountain-grad)"
              strokeWidth="2.4"
              className="drop-shadow-[0_0_10px_#00f0ff]"
            />
          </svg>

          {/* ---------------------------------------------------- */}
          {/* 3. INTEGRATED WORKSPACE IMAGE (BACKGROUND LAYER)     */}
          {/* ---------------------------------------------------- */}
          {/* Stretches from middle to right edge, emerging seamlessly from the dark navy card */}
          <div className="absolute inset-y-0 right-0 w-full md:w-[75%] lg:w-[62%] xl:w-[58%] h-full pointer-events-none overflow-hidden z-0">
            {/* The HD Developer Scene */}
            <img
              src={bgImageUrl}
              alt="Developer Workstation Scene"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center sm:object-right select-none"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0.35) 42%, rgba(0,0,0,0.75) 62%, black 82%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0.35) 42%, rgba(0,0,0,0.75) 62%, black 82%, black 100%)",
              }}
            />

            {/* Ultra-smooth Wide Left Gradient Overlay (Dissolves left pixels into #030612) */}
            <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-[#030612] via-[#030612]/80 via-35% via-[#030612]/30 via-70% to-transparent z-10" />

            {/* Top and Bottom Edge Fades */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#030612] via-[#030612]/60 to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#030612] via-[#030612]/60 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#030612] to-transparent z-10" />
          </div>

          {/* ---------------------------------------------------- */}
          {/* 4. FOREGROUND CONTENT & FLOATING ACCENTS             */}
          {/* ---------------------------------------------------- */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]">

            {/* Left Content Area (Columns 1-6) */}
            <div className="lg:col-span-6 xl:col-span-6 p-5 sm:p-10 md:p-12 lg:p-14 text-left z-20">

              {/* Top Badge Group */}
              <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/40 text-[#00f0ff] text-[11px] sm:text-xs font-mono font-black flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.3)] shrink-0">
                  CTA
                </span>
                <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#0a152e]/90 border border-[#00d2ff]/40 shadow-[0_0_12px_rgba(0,210,255,0.25)]">
                  <Users className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#00d2ff] uppercase font-mono">
                    {badge}
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3rem] font-black text-white tracking-tight leading-[1.14] mb-3.5 sm:mb-5">
                {title}
              </h2>

              {/* Supporting Text */}
              <p className="text-slate-200 text-xs sm:text-base leading-relaxed max-w-lg mb-6 sm:mb-9">
                {description}
              </p>

              {/* Prominent Glowing Cyan CTA Button */}
              <div>
                <Link
                  href={buttonLink}
                  className="group inline-flex items-center gap-2.5 px-6 sm:px-9 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00f0ff] via-[#00d2ff] to-[#0099ff] shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:shadow-[0_0_40px_rgba(0,240,255,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#050811] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  <span>{buttonText}</span>
                </Link>
              </div>

            </div>

            {/* Right Side Floating Badges & Accents (Columns 7-12) */}
            <div className="lg:col-span-6 xl:col-span-6 relative w-full h-[240px] sm:h-[300px] lg:h-full min-h-[240px] lg:min-h-[480px] flex items-center justify-end pointer-events-none">

              {/* Floating Code Pill */}
              {showCodePill && (
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 left-4 sm:left-12 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091124]/90 border border-[#00d2ff]/40 shadow-[0_0_20px_rgba(0,210,255,0.35)] backdrop-blur-md"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span className="text-[10px] font-mono text-slate-300">
                    <span className="text-[#00f0ff]">await</span> {codePillText.replace(/^await\s*/, "")}
                  </span>
                </motion.div>
              )}

              {/* Glowing Monogram Badge on Far Right */}
              {showMonogram && (
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-6 right-6 sm:top-8 sm:right-10 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091124]/90 border border-[#00d2ff]/40 shadow-[0_0_20px_rgba(0,210,255,0.35)] backdrop-blur-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-[#00f0ff] font-mono">
                    {monogramText}
                  </span>
                </motion.div>
              )}

              {/* Live Performance Metric Pill */}
              {showMetricPill && (
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 left-8 sm:left-20 z-20 hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#081226]/85 border border-[#38bdf8]/35 shadow-[0_0_15px_rgba(56,189,248,0.25)] backdrop-blur-md"
                >
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                  <span className="text-[9.5px] font-mono font-medium text-slate-300">
                    {metricPillText} <span className="text-[#38bdf8] font-bold">{metricPillValue}</span>
                  </span>
                </motion.div>
              )}

              {/* Glowing Neon Line Along Desk Edge */}
              <div className="absolute bottom-2 right-8 sm:right-12 w-2/3 h-1 rounded-full bg-gradient-to-r from-transparent via-[#a855f7] to-[#00d2ff] shadow-[0_0_16px_#a855f7] z-20 opacity-85" />

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}