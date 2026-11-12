"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Download, ArrowUpRight, Sparkles, Send, FileText, CheckCircle2 } from "lucide-react";
import { profileData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import { cinematicEase } from "@/lib/animations";

export default function HeroSection() {
  const { cmsData } = useCms();
  const { language, t } = useLanguage();
  const hero = cmsData?.hero;

  const greeting =
    language === "bn"
      ? t("hero.greeting", "হ্যালো, আমি")
      : hero?.greeting || "Hello, I'm";
  const name =
    language === "bn"
      ? t("hero.name", "তারেক রহমান")
      : hero?.name || "Tarek Rahaman";
  const mainTitle =
    language === "bn"
      ? t("hero.role", "FULL-STACK WEB DEVELOPER")
      : hero?.mainTitle || "FULL-STACK WEB DEVELOPER";
  const description =
    language === "bn"
      ? t(
          "hero.subtitle",
          "আধুনিক, দ্রুতগতির এবং সুরক্ষিত ওয়েব অ্যাপ্লিকেশন তৈরি করি যা আপনার ব্যবসাকে পৌঁছে দেয় অনন্য উচ্চতায়।"
        )
      : hero?.description ||
        "Modern web applications that are fast, secure and user-friendly.";

  const cvBtnText =
    language === "bn"
      ? t("hero.downloadCv", "সিভি ডাউনলোড")
      : hero?.primaryButtonText || "Download CV";
  const hireBtnText =
    language === "bn"
      ? t("hero.hireMe", "হায়ার করুন")
      : hero?.secondaryButtonText || "Hire Me";

  const cvUrl =
    hero?.primaryButtonUrl ||
    profileData.cvUrl ||
    "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf";
  const hireUrl = hero?.secondaryButtonUrl || "/contact";

  // Dynamic single hero portrait (connected to CMS hero.portraitUrl & heroPhotos)
  const portraitSrc = normalizeImageUrl(
    hero?.portraitUrl ||
      cmsData?.profile?.heroPhotos?.[0]?.src ||
      cmsData?.profile?.heroPhotos?.[1]?.src ||
      "/assets/profile-1-scaled.png"
  );
  const portraitAlt = hero?.portraitAlt || name;

  // Clouds & beam controls
  const cloudBg = normalizeImageUrl(hero?.cloudBgUrl || "/assets/realistic-white-clouds.jpg");
  const showClouds = hero?.showClouds !== false;
  const showLightBeam = hero?.showLightBeam !== false;

  // Exact Animated Professional Titles (beside profile photo)
  const animatedTitles =
    hero?.animatedPhrases && hero.animatedPhrases.length > 0
      ? hero.animatedPhrases
      : cmsData?.profile?.titles && cmsData.profile.titles.length > 0
      ? cmsData.profile.titles
      : [
          "WordPress Expert",
          "Laravel Developer",
          "Frontend Developer",
          "Full-Stack Web Developer",
          "Website Designer",
          "E-Commerce Developer",
        ];
  const [titleIdx, setTitleIdx] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const isInView = useInView(heroRef, { margin: "100px 0px" });

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % animatedTitles.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isInView, animatedTitles.length]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full min-h-[auto] pt-20 sm:pt-22 pb-6 sm:pb-8 lg:pt-18 lg:pb-0 lg:h-[calc(100svh-3.2rem)] lg:min-h-[520px] lg:max-h-[740px] flex items-center justify-center overflow-hidden bg-[#030508]"
    >
      {/* ======================================================== */}
      {/* BACKGROUND — DEEP BLACK CINEMATIC + REALISTIC WHITE CLOUDS*/}
      {/* ======================================================== */}

      {/* 1. Base Deep Black Cinematic Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 85% at 75% 50%, #070b12 0%, #030508 65%, #010204 100%)",
        }}
      />

      {/* 2. Left-Side Shading (Protects Text Readability) */}
      <div className="absolute top-0 left-0 w-full lg:w-[58%] h-full bg-gradient-to-r from-[#010204] via-[#030508]/85 to-transparent pointer-events-none z-[5]" />

      {/* Seamless Multi-Stop Bottom Transition Gradient to Photo Collage Section */}
      <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#051428]/60 via-[#030508]/85 to-transparent pointer-events-none z-[15]" />

      {/* 3. Soft Atmospheric Fog Around Center & Diagonal Boundary */}
      <div
        className="absolute inset-y-0 left-[35%] sm:left-[42%] lg:left-[45%] w-[280px] sm:w-[380px] pointer-events-none hidden md:block z-[4]"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255, 255, 255, 0.07) 0%, rgba(200, 215, 230, 0.03) 35%, transparent 70%)",
        }}
      />

      {/* 4. Distant Ambient Smoke Across Background */}
      {showClouds && (
        <div
          className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden mix-blend-screen opacity-25"
          style={{
            backgroundImage: `url('${cloudBg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            maskImage: "linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.8) 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      )}

      {/* 5. Right-Side Realistic White Clouds & Fog (Diagonal Slice) */}
      {showClouds && (
        <div
          className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden"
          style={{
            clipPath: "polygon(67% 0%, 100% 0%, 100% 100%, 46% 100%)",
          }}
        >
          {/* Soft atmospheric white illumination (Hardware radial gradients for zero filter blur overhead) */}
          <div
            className="absolute top-1/4 right-[15%] w-[520px] h-[520px] rounded-full pointer-events-none animate-smoke-pulse"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%)",
              animationPlayState: isInView ? "running" : "paused",
            }}
          />
          <div
            className="absolute bottom-1/4 right-[25%] w-[460px] h-[460px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(226, 232, 240, 0.06) 0%, rgba(226, 232, 240, 0.02) 40%, transparent 70%)",
            }}
          />

          {/* Cloud Layer 1: High-Definition Panoramic White Smoke with Continuous Drift */}
          <div
            className="absolute inset-0 w-full h-full mix-blend-screen opacity-95 animate-cloud-drift-1 pointer-events-none"
            style={{
              backgroundImage: `url('${cloudBg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 45%",
              backgroundRepeat: "no-repeat",
              transform: "translateZ(0)",
              animationPlayState: isInView ? "running" : "paused",
            }}
          />

          {/* Cloud Layer 2: Volumetric Secondary Fog with Counter-Drift */}
          <div
            className="absolute -inset-10 w-[120%] h-[120%] mix-blend-screen opacity-75 animate-cloud-drift-2 pointer-events-none"
            style={{
              backgroundImage: `url('${cloudBg}')`,
              backgroundSize: "cover",
              backgroundPosition: "right 35%",
              backgroundRepeat: "no-repeat",
              filter: "blur(1.5px)",
              transform: "translateZ(0)",
              animationPlayState: isInView ? "running" : "paused",
            }}
          />

          {/* Cloud Layer 3: Deep Atmospheric Floating Wisps */}
          <div
            className="absolute -inset-6 w-[115%] h-[115%] mix-blend-screen opacity-55 animate-cloud-drift-3 pointer-events-none"
            style={{
              backgroundImage: `url('${cloudBg}')`,
              backgroundSize: "cover",
              backgroundPosition: "70% 55%",
              backgroundRepeat: "no-repeat",
              transform: "translateZ(0)",
              animationPlayState: isInView ? "running" : "paused",
            }}
          />
        </div>
      )}

      {/* Mobile Cloud Layer */}
      {showClouds && (
        <div
          className="absolute inset-0 pointer-events-none md:hidden overflow-hidden mix-blend-screen opacity-85"
          style={{
            backgroundImage: `url('${cloudBg}')`,
            backgroundSize: "cover",
            backgroundPosition: "right 40%",
            maskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
          }}
        />
      )}

      {/* 6. Elegant White / Silver Diagonal Light Beam */}
      {showLightBeam && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 hidden md:block">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 850"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="beamSilverGradient" x1="67%" y1="0%" x2="46%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#f1f5f9" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
              </linearGradient>
              <filter id="beamSilverGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur1" />
                <feGaussianBlur stdDeviation="7" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1="965"
              y1="0"
              x2="662"
              y2="850"
              stroke="url(#beamSilverGradient)"
              strokeWidth="2"
              filter="url(#beamSilverGlow)"
            />
          </svg>
        </div>
      )}

      {/* ======================================================== */}
      {/* HERO MAIN CONTAINER                                      */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full relative z-20 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center w-full h-full">
          
          {/* ====================================================== */}
          {/* LEFT SIDE — TYPOGRAPHY & BUTTONS                       */}
          {/* ====================================================== */}
          <div className="lg:col-span-7 text-left space-y-2.5 sm:space-y-3.5 py-4 lg:py-0 lg:-translate-y-7 transition-transform">
            
            {/* Optional Top Badge */}
            {hero?.showBadge && hero?.badgeText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 hover:bg-[#00d2ff]/18 border border-[#00d2ff]/35 hover:border-[#00d2ff] text-[#00d2ff] text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(0,210,255,0.2)] hover:shadow-[0_0_24px_rgba(0,210,255,0.5)] hover:scale-[1.04] transition-all duration-300 mb-1 cursor-default select-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
                <span>{hero.badgeText}</span>
              </motion.div>
            )}

            {/* 1. Small Cyan Greeting: Hello, I'm */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: cinematicEase }}
              className="text-base sm:text-lg font-semibold text-[#00d2ff] tracking-wide"
            >
              {greeting}
            </motion.div>

            {/* 2. Large Bold Name: Tarek Rahaman (Solid White) */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: cinematicEase }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
            >
              {name}
            </motion.h1>

            {/* 3. Cyan Professional Title: FULL-STACK WEB DEVELOPER */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: cinematicEase }}
              className="pt-0.5"
            >
              <h2 className="text-xs sm:text-base lg:text-lg font-bold tracking-wider text-[#00d2ff] uppercase">
                {mainTitle}
              </h2>
            </motion.div>

            {/* 4. Short Professional Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: cinematicEase }}
              className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-md pt-0.5 pb-1 sm:pb-2"
            >
              {description}
            </motion.p>

            {/* 5. Two Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4, ease: cinematicEase }}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-0.5 select-none"
            >
              {/* Primary Button */}
              {hero?.primaryButtonVisible !== false && (
                <motion.a
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={cvUrl}
                  download={hero?.primaryButtonDownload !== false ? "Tarek-Rahaman-CV.pdf" : undefined}
                  target={hero?.primaryButtonNewTab ? "_blank" : undefined}
                  rel={hero?.primaryButtonNewTab ? "noopener noreferrer" : undefined}
                  className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#0ea5e9] shadow-[0_0_24px_rgba(0,210,255,0.6)] hover:shadow-[0_0_42px_rgba(0,210,255,0.95)] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Download className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-y-0.5" />
                  <span>{cvBtnText}</span>
                </motion.a>
              )}

              {/* Secondary Dark Pill Button */}
              {hero?.secondaryButtonVisible !== false && (
                <motion.div
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={hireUrl}
                    target={hero?.secondaryButtonNewTab ? "_blank" : undefined}
                    className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-black/60 backdrop-blur-sm border border-[#00d2ff]/40 hover:border-[#00d2ff] hover:bg-[#00d2ff]/10 shadow-[0_4px_18px_rgba(0,0,0,0.6)] hover:shadow-[0_0_28px_rgba(0,210,255,0.5)] transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                    <span>{hireBtnText}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#00d2ff] group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300" />
                  </Link>
                </motion.div>
              )}
            </motion.div>

          </div>

          {/* ====================================================== */}
          {/* RIGHT SIDE — NATURAL PORTRAIT PRESENTATION             */}
          {/* ====================================================== */}
          <div className="lg:col-span-5 relative flex items-end justify-center w-full h-full lg:self-end mt-4 lg:mt-0">
            
            {/* Portrait Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] xl:max-w-[500px] flex items-end justify-center"
            >
              {/* Clean Floating Animated Professional Title */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 sm:top-6 lg:top-8 xl:top-10 right-0 sm:-right-4 lg:-right-6 xl:-right-12 z-30 pointer-events-none select-none max-w-[90%] sm:max-w-none"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff] animate-ping shrink-0" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={titleIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-[10.5px] min-[360px]:text-[11px] sm:text-sm lg:text-base font-bold tracking-wider text-[#00d2ff] drop-shadow-[0_0_12px_rgba(0,210,255,0.85)] drop-shadow-[0_0_22px_rgba(0,210,255,0.4)] whitespace-nowrap uppercase truncate max-w-[190px] min-[380px]:max-w-none"
                    >
                      {animatedTitles[titleIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Natural atmospheric white backlighting glow behind portrait */}
              <div className="absolute inset-x-4 top-1/6 bottom-4 bg-white/[0.08] rounded-full blur-[90px] pointer-events-none -z-10 animate-smoke-pulse" />

              {/* Portrait */}
              <div className="relative w-full flex items-end justify-center bg-transparent">
                <Image
                  src={portraitSrc}
                  alt={portraitAlt}
                  width={550}
                  height={650}
                  priority
                  sizes="(max-width: 640px) 360px, (max-width: 1024px) 500px, 550px"
                  quality={88}
                  className="w-auto h-auto max-h-[360px] sm:max-h-[420px] lg:max-h-[500px] xl:max-h-[550px] object-contain object-bottom select-none transition-transform duration-500 ease-out hover:scale-[1.01]"
                  style={{
                    maskImage: "linear-gradient(to bottom, black 0%, black 84%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 84%, transparent 100%)",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.srcset) target.srcset = "";
                    target.src = "/assets/profile-1-scaled.png";
                  }}
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
