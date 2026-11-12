"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Layers,
  Sparkles,
  ArrowRight,
  User,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";

// Four core technology badges matching reference design
const techBadges = [
  "WordPress",
  "WooCommerce",
  "Laravel",
  "Web Development",
];

export default function AboutSection() {
  const { cmsData } = useCms();
  const { language, t, tCms } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "100px 0px" });

  const sectionMeta = cmsData?.homeSections?.find((s) => s.key === "about");
  const aboutSettings = cmsData?.homeAboutSettings;

  const badgeText = tCms(aboutSettings?.badge || sectionMeta?.badge, "about.badge");
  const titleText = tCms(aboutSettings?.title || sectionMeta?.title, "about.title");
  const subtitleText = tCms(aboutSettings?.subtitle || sectionMeta?.subtitle, "about.subtitle");
  const descriptionText = tCms(
    aboutSettings?.description || sectionMeta?.description || cmsData?.profile?.shortBio,
    "about.shortBio"
  );
  const nameText = language === "bn" ? "তারেক রহমান" : aboutSettings?.name || cmsData?.profile?.name || "Tarek Rahaman";
  const roleText = language === "bn" ? t("about.role", "ক্রিয়েটিভ ওয়েব ডেভেলপার") : aboutSettings?.role || cmsData?.profile?.titles?.[0] || "Creative Web Developer";

  // Mouse Move Parallax on Left 3D Stage — zero React re-render overhead via CSS variables
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    sectionRef.current.style.setProperty("--mx", x.toFixed(4));
    sectionRef.current.style.setProperty("--my", y.toFixed(4));
  };

  const handleMouseLeave = () => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty("--mx", "0");
      sectionRef.current.style.setProperty("--my", "0");
    }
  };

  // Image URLs matching exact real assets
  const portraitImg = normalizeImageUrl(
    aboutSettings?.portraitImage ||
      cmsData?.profile?.heroPhotos?.[1]?.src ||
      cmsData?.profile?.heroPhotos?.[0]?.src,
    "/assets/profile-1-scaled.png"
  );
  const portraitAlt = aboutSettings?.portraitAlt || "Tarek Rahaman - Creative Web Developer";

  const workstationImg = normalizeImageUrl(
    aboutSettings?.workstationImage || cmsData?.milestonesPhotos?.[0]?.src,
    "/assets/WhatsApp-Image-2026-08-06-at-4.49.13-PM.jpeg"
  );
  const workstationAlt = aboutSettings?.workstationAlt || "Tarek Rahaman - Workstation Lab";

  const certificateImg = normalizeImageUrl(
    aboutSettings?.certificateImage ||
      cmsData?.milestonesPhotos?.[3]?.src ||
      cmsData?.profile?.heroPhotos?.[2]?.src,
    "/assets/1786250627196.jpg.jpeg"
  );
  const certificateAlt = aboutSettings?.certificateAlt || "NSDA National Skills Certificate Level-3";

  const techBadges =
    aboutSettings?.techBadges && aboutSettings.techBadges.length > 0
      ? aboutSettings.techBadges.filter((b) => b.visible !== false).map((b) => b.label)
      : [
          "WordPress",
          "WooCommerce",
          "Laravel",
          "Web Development",
        ];

  const statsList =
    aboutSettings?.stats && aboutSettings.stats.length > 0
      ? aboutSettings.stats.filter((s) => s.visible !== false)
      : [
          { id: "ab-stat-1", value: "150+", label: "Happy Clients", icon: "User", colorTheme: "cyan" as const, visible: true },
          { id: "ab-stat-2", value: "200+", label: "Projects Completed", icon: "Layers", colorTheme: "purple" as const, visible: true },
        ];

  return (
    <section
      id="about"
      aria-label="About Me"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-transparent pt-3 sm:pt-4 lg:pt-5 pb-3 sm:pb-4 lg:pb-5 overflow-hidden select-none"
    >
      {/* Seamless Top & Bottom Ambient Edge Blending */}
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#050811] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#050811] to-transparent pointer-events-none z-10" />

      {/* Contained Futuristic Ambient Lighting with Soft Vertical Fade Mask */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        {/* Soft Purple Ambient Light Pool Behind 3D Cards */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[680px] h-[360px] sm:h-[440px] bg-gradient-to-tr from-[#a855f7]/14 via-[#8b5cf6]/07 to-transparent rounded-full blur-[130px]" />

        {/* Subtle Cyan Light Pool on the Far Left */}
        <div className="absolute top-1/3 -left-20 w-[400px] h-[350px] bg-gradient-to-r from-[#00d2ff]/10 via-[#0088ff]/05 to-transparent rounded-full blur-[110px]" />

        {/* Soft Violet Light on Upper Right behind Headline */}
        <div className="absolute top-1/4 right-10 w-[450px] h-[350px] bg-gradient-to-bl from-[#a855f7]/10 via-[#c084fc]/05 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ======================================================== */}
          {/* 1. LEFT COLUMN: 3D CARD STACK WITH GLOWING PURPLE ORBIT */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[380px] md:min-h-[420px]">

            {/* A. GLOWING PURPLE/VIOLET/CYAN NEON ORBIT RING */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 transition-transform duration-700 ease-out"
              style={{
                transform: "translate3d(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -16px), 0)",
              }}
            >
              <svg
                viewBox="0 0 600 380"
                className="w-full max-w-[320px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[560px] h-auto overflow-visible"
              >
                <defs>
                  {/* Purple to Cyan Glowing Gradient */}
                  <linearGradient id="about-orbit-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="85%" stopColor="#c084fc" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                  </linearGradient>

                  <filter id="about-orbit-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Soft Ambient Blurred Neon Aura */}
                <ellipse
                  cx="300"
                  cy="190"
                  rx="260"
                  ry="125"
                  transform="rotate(-18 300 190)"
                  fill="none"
                  stroke="url(#about-orbit-grad)"
                  strokeWidth="8"
                  opacity="0.35"
                  filter="url(#about-orbit-glow)"
                />

                {/* Sharp Vibrant Core Neon Orbit Ring */}
                <ellipse
                  cx="300"
                  cy="190"
                  rx="260"
                  ry="125"
                  transform="rotate(-18 300 190)"
                  fill="none"
                  stroke="url(#about-orbit-grad)"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]"
                />

                {/* Orbit Traveling Particle 1: Cyan Node */}
                <circle
                  r="3.5"
                  fill="#00f0ff"
                  className="drop-shadow-[0_0_10px_#00f0ff] animate-pulse"
                  cx="90"
                  cy="240"
                />

                {/* Orbit Traveling Particle 2: Purple Node */}
                <circle
                  r="3"
                  fill="#c084fc"
                  className="drop-shadow-[0_0_10px_#c084fc] animate-pulse"
                  cx="480"
                  cy="120"
                />
              </svg>
            </div>

            {/* B. 3D CARD STACK CONTAINER WITH PERSPECTIVE */}
            <div
              className="relative w-full max-w-[420px] sm:max-w-[460px] h-[340px] sm:h-[380px] flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
                transform: "rotateY(calc(var(--mx, 0) * 12deg)) rotateX(calc(var(--my, 0) * -10deg))",
              }}
            >
              {/* ---------------------------------------------------- */}
              {/* CARD 1 (LEFT, ROTATED LEFT ~ -14deg, WORKSTATION)   */}
              {/* ---------------------------------------------------- */}
              <motion.div
                animate={
                  isInView
                    ? {
                        y: [0, 8, 0],
                        rotate: [-14, -13, -14],
                      }
                    : undefined
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-10 w-[145px] xs:w-[170px] sm:w-[200px] md:w-[220px] aspect-[3/4] -translate-x-12 xs:-translate-x-16 sm:-translate-x-20 md:-translate-x-24 translate-y-3 sm:translate-y-4 rounded-2xl overflow-hidden border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.85)] cursor-pointer group/card1"
              >
                <img
                  src={workstationImg}
                  alt="Tarek Rahaman - Workstation Lab"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover/card1:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/WhatsApp-Image-2026-08-06-at-4.49.13-PM.jpeg") {
                      target.src = "/assets/WhatsApp-Image-2026-08-06-at-4.49.13-PM.jpeg";
                    }
                  }}
                />
                {/* Subtle dark gradient overlay to keep focal emphasis on center portrait */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/75 via-[#050811]/25 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </motion.div>

              {/* ---------------------------------------------------- */}
              {/* CARD 2 (RIGHT, ROTATED RIGHT ~ +14deg, CERTIFICATE) */}
              {/* ---------------------------------------------------- */}
              <motion.div
                animate={
                  isInView
                    ? {
                        y: [0, 8, 0],
                        rotate: [14, 13, 14],
                      }
                    : undefined
                }
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute z-10 w-[145px] xs:w-[170px] sm:w-[200px] md:w-[220px] aspect-[3/4] translate-x-12 xs:translate-x-16 sm:translate-x-20 md:translate-x-24 translate-y-3 sm:translate-y-4 rounded-2xl overflow-hidden border border-white/25 shadow-[0_15px_40px_rgba(0,0,0,0.85)] bg-[#070d18] cursor-pointer group/card2"
              >
                <img
                  src={certificateImg}
                  alt="NSDA National Skills Certificate Level-3"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover/card2:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/1786250627196.jpg.jpeg") {
                      target.src = "/assets/1786250627196.jpg.jpeg";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </motion.div>

              {/* ---------------------------------------------------- */}
              {/* CARD 3 (CENTER, UPRIGHT, FRONT FOCAL PORTRAIT)       */}
              {/* ---------------------------------------------------- */}
              <motion.div
                animate={
                  isInView
                    ? {
                        y: [0, -10, 0],
                      }
                    : undefined
                }
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-30 w-[175px] xs:w-[200px] sm:w-[230px] md:w-[250px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#00d2ff] shadow-[0_0_30px_rgba(0,210,255,0.45),0_25px_60px_rgba(0,0,0,0.95)] group/portrait cursor-pointer"
              >
                {/* Main Portrait Photo */}
                <img
                  src={portraitImg}
                  alt="Tarek Rahaman - Creative Web Developer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover/portrait:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/profile-1-scaled.png") {
                      target.src = "/assets/profile-1-scaled.png";
                    }
                  }}
                />

                {/* Subtle Inner Glass Glare & Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040813]/90 via-[#040813]/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 pointer-events-none" />

                {/* Integrated Dark Glass Nameplate at Bottom */}
                <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2.5 sm:inset-x-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#060c18]/90 backdrop-blur-md border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] text-center">
                  <h4 className="text-sm sm:text-base font-black text-white tracking-wide leading-tight">
                    {nameText}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#00d2ff] mt-0.5">
                    {roleText}
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. RIGHT COLUMN: ABOUT CONTENT & STATISTICS              */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-5 sm:space-y-6">

            {/* Step 1: Small Cyan Accent Label: ABOUT ME */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2"
            >
              <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#00d2ff] uppercase">
                {badgeText}
              </span>
            </motion.div>

            {/* Step 2: Main Heading with Cyan & Purple Gradient */}
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white leading-[1.18] tracking-tight"
            >
              <span>{titleText}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#c084fc] to-[#ec4899] drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]">
                {subtitleText}
              </span>
            </motion.h2>

            {/* Step 3: Concise Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl"
            >
              {descriptionText}
            </motion.p>

            {/* Step 4: Four Compact Technology Badges with Cyan Bullet */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="flex flex-wrap gap-2 sm:gap-2.5 pt-1"
            >
              {techBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0a1224]/85 backdrop-blur-md border border-[#00d2ff]/25 hover:border-[#00d2ff]/60 text-slate-200 text-xs sm:text-[13px] font-semibold tracking-wide shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                  <span>{badge}</span>
                </span>
              ))}
            </motion.div>

            {/* Step 5: Statistics matching Reference */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="flex flex-wrap items-center gap-8 sm:gap-12 pt-3"
            >
              {statsList.map((stat, idx) => {
                const isCyan = stat.colorTheme !== "purple";
                const IconComponent = stat.icon === "Layers" ? Layers : stat.icon === "Award" ? Award : User;
                return (
                  <div key={stat.id || stat.label || idx} className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        isCyan
                          ? "bg-[#00d2ff]/10 border border-[#00d2ff]/40 text-[#00f0ff] shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                          : "bg-[#a855f7]/12 border border-[#a855f7]/40 text-[#c084fc] shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${isCyan ? "text-[#00f0ff]" : "text-[#c084fc]"}`} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                        {language === "bn"
                          ? stat.label.toLowerCase().includes("client")
                            ? t("about.happyClients", "সন্তুষ্ট ক্লায়েন্ট")
                            : stat.label.toLowerCase().includes("project")
                            ? t("about.projectsCompleted", "সম্পন্ন প্রজেক্ট")
                            : stat.label
                          : stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
