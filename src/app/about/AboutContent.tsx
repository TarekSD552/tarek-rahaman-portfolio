"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { normalizeImageUrl } from "@/lib/image-utils";
import {
  GraduationCap,
  Award,
  Globe2,
  Download,
  Send,
  CheckCircle2,
  MapPin,
  Building,
  Sparkles,
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
  User,
  Code2,
  Cpu,
  Zap,
  Target,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  Layers,
  Award,
  Briefcase,
  Sparkles,
  Code2,
  Cpu,
  Zap,
  Target,
  ShieldCheck,
  CheckCircle2,
  User,
  Users,
  Globe2,
  Building,
  BookOpen,
  Download,
  Send,
  MapPin,
  ExternalLink,
};

function getBadgeIcon(iconName?: string) {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  return Sparkles;
}
import WaveDivider from "@/components/ui/WaveDivider";
import SectionHeader from "@/components/ui/SectionHeader";
import AboutProcessSection from "@/components/sections/AboutProcessSection";
import AboutTechStackSection from "@/components/sections/AboutTechStackSection";
import AboutCtaSection from "@/components/sections/AboutCtaSection";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  profileData,
  educationData,
  certificationsData,
  futureVision,
  statsData,
  collagePhotosData,
} from "@/data/portfolioData";

export default function AboutContent() {
  const { cmsData } = useCms();
  const { t, tCms, tStatLabel, language } = useLanguage();
  const profile = cmsData?.profile || profileData;
  const rawEducation = cmsData?.education?.length ? cmsData.education : educationData;
  const rawCertifications = cmsData?.certifications?.length ? cmsData.certifications : certificationsData;
  const stats = cmsData?.stats?.length ? cmsData.stats : statsData;
  const vision = cmsData?.futureVision || futureVision;

  const education = rawEducation.map((edu) => {
    if (language !== "bn") return edu;
    const inst = edu.institution?.toLowerCase() || "";
    if (inst.includes("daffodil")) {
      return {
        ...edu,
        degree: t("about.degrees.diu.degree"),
        highlight: t("about.degrees.diu.highlight"),
        description: t("about.degrees.diu.desc"),
        location: "ঢাকা, বাংলাদেশ",
      };
    }
    if (inst.includes("police lines") || inst.includes("rajshahi")) {
      return {
        ...edu,
        degree: t("about.degrees.hsc.degree"),
        highlight: t("about.degrees.hsc.highlight"),
        description: t("about.degrees.hsc.desc"),
        location: "রাজশাহী বিভাগ",
      };
    }
    return edu;
  });

  const certifications = rawCertifications.map((cert) => {
    if (language !== "bn") return cert;
    const title = cert.title?.toLowerCase() || "";
    if (title.includes("nsda") || title.includes("skills development")) {
      return {
        ...cert,
        title: t("about.certifications.nsda.title"),
        issuer: t("about.certifications.nsda.issuer"),
        description: t("about.certifications.nsda.desc"),
      };
    }
    if (title.includes("wordpress") || title.includes("woocommerce")) {
      return {
        ...cert,
        title: t("about.certifications.wp.title"),
        issuer: t("about.certifications.wp.issuer"),
        description: t("about.certifications.wp.desc"),
      };
    }
    if (title.includes("frontend") || title.includes("web design")) {
      return {
        ...cert,
        title: t("about.certifications.frontend.title"),
        issuer: t("about.certifications.frontend.issuer"),
        description: t("about.certifications.frontend.desc"),
      };
    }
    return cert;
  });

  const heroPhotos = profile.heroPhotos?.length ? profile.heroPhotos : profileData.heroPhotos;
  const milestones = cmsData?.milestonesPhotos?.length ? cmsData.milestonesPhotos : collagePhotosData;

  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroRef.current.style.setProperty("--ab-mx", x.toFixed(4));
    heroRef.current.style.setProperty("--ab-my", y.toFixed(4));
  };

  const handleMouseLeave = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty("--ab-mx", "0");
    heroRef.current.style.setProperty("--ab-my", "0");
  };

  const mainPhotoUrl =
    profile.mainPortraitUrl ||
    profile.portraitUrl ||
    heroPhotos[1]?.src ||
    heroPhotos[0]?.src ||
    profileData.mainPortraitUrl ||
    "/assets/profile-1-scaled.png";

  const mainPhoto = {
    src: mainPhotoUrl,
    alt: heroPhotos[1]?.alt || profile.fullName || profile.name || "Md Tarek Rahaman - Creative Web Developer",
    label: heroPhotos[1]?.label || profile.fullName || profile.name || "Tarek Rahaman",
    role: heroPhotos[1]?.role || profile.titles?.[0] || "Creative Web Developer"
  };
  const workstationImg = heroPhotos[0]?.src || profileData.heroPhotos[0].src;
  const certificateImg = heroPhotos[2]?.src || heroPhotos[1]?.src || profileData.heroPhotos[2].src;

  const galleryItems = (cmsData.aboutGallery && cmsData.aboutGallery.length > 0)
    ? cmsData.aboutGallery
    : [
        {
          src: heroPhotos[0]?.src || profileData.heroPhotos[0].src,
          alt: heroPhotos[0]?.alt || "Workstation Lab",
          title: heroPhotos[0]?.label || "Workstation Lab",
        },
        {
          src: heroPhotos[2]?.src || profileData.heroPhotos[2].src,
          alt: heroPhotos[2]?.alt || "NSDA Govt. Certificate",
          title: heroPhotos[2]?.label || "NSDA Certified",
        },
        {
          src: milestones[1]?.src || collagePhotosData[1].src,
          alt: milestones[1]?.alt || "Agile Team Collaboration",
          title: milestones[1]?.title || "Agile Sprints",
        },
      ];

  const bio = cmsData?.aboutBio || {
    badge: "BIOGRAPHY & EXPERTISE",
    headingPrefix: "Turning complex problems into ",
    highlightedText: "elegant, scalable",
    headingSuffix: ", and revenue-generating digital products.",
    highlightStyle: "cyan",
    firstParagraph:
      "Software Engineering undergraduate at Daffodil International University (Data Science Major), NSDA-certified web engineer, and specialist in custom WordPress, WooCommerce, and Laravel systems with over 200+ commercial deployments.",
    secondParagraph:
      "Over the course of 200+ commercial web deployments, I have honed deep expertise in custom theme and plugin engineering, WooCommerce sales architecture, Laravel backends, database query optimization, and technical speed enhancement.",
    badges: [
      { id: "bio-badge-1", label: "DIU Software Eng.", icon: "GraduationCap", visible: true },
      { id: "bio-badge-2", label: "Data Science Major", icon: "Layers", visible: true },
      { id: "bio-badge-3", label: "NSDA Certified", icon: "Award", visible: true },
      { id: "bio-badge-4", label: "200+ Deployments", icon: "Briefcase", visible: true },
    ],
  };

  const visibility = cmsData?.aboutSectionsVisibility || {
    hero: true,
    profileGrid: true,
    profileCard: true,
    gallery: true,
    bioStory: true,
    process: true,
    techStack: true,
    education: true,
    certifications: true,
    vision: true,
    cta: true,
    stats: true,
  };

  const aboutHero = cmsData?.aboutHero || {
    visible: true,
    orbitEffectsVisible: true,
    badge: {
      text: "ABOUT ME // ACADEMIC & ENGINEERING JOURNEY",
      icon: "Sparkles",
      visible: true,
    },
    heading: {
      prefix: "Turning Ideas into ",
      highlight1: "Digital ",
      highlight2: "Experiences",
      suffix: "",
      highlightStyle: "gradient",
    },
    paragraphs: [
      {
        id: "hero-para-1",
        text: "Software Engineering undergraduate at Daffodil International University (Data Science Major), NSDA-certified web engineer, and specialist in custom WordPress, WooCommerce, and Laravel systems with over 200+ commercial deployments.",
        visible: true,
      },
    ],
    techBadges: [
      { id: "tech-badge-1", label: "WordPress", icon: "Sparkles", visible: true },
      { id: "tech-badge-2", label: "WooCommerce", icon: "Sparkles", visible: true },
      { id: "tech-badge-3", label: "Laravel", icon: "Sparkles", visible: true },
      { id: "tech-badge-4", label: "Data Science", icon: "Sparkles", visible: true },
      { id: "tech-badge-5", label: "Full-Stack", icon: "Sparkles", visible: true },
    ],
    stats: [
      { id: "hero-stat-1", value: "150", suffix: "+", label: "Happy Clients", icon: "User", visible: true },
      { id: "hero-stat-2", value: "200", suffix: "+", label: "Projects Completed", icon: "Layers", visible: true },
      { id: "hero-stat-3", value: "B.Sc. SWE", suffix: "", label: "DIU Data Science", icon: "GraduationCap", visible: true },
    ],
    buttons: [
      {
        id: "hero-btn-1",
        text: "Download Resume (PDF)",
        url: profile.cvUrl || profileData.cvUrl || "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
        icon: "Download",
        isDownload: true,
        downloadName: "Tarek-Rahaman-CV.pdf",
        visible: true,
      },
      {
        id: "hero-btn-2",
        text: "Let's Connect",
        url: "/contact",
        icon: "Send",
        openInNewTab: false,
        visible: true,
      },
    ],
  };

  const profileCard = cmsData?.aboutProfileCard || {
    visible: true,
    imageUrl: mainPhotoUrl,
    altText: mainPhoto.alt,
    verifiedBadgeText: "Verified",
    verifiedBadgeIcon: "ShieldCheck",
    showVerifiedBadge: true,
    eyebrowText: profile.fullName || profile.name,
    title: profile.titles?.[0] || "Full-Stack & WordPress Specialist",
    location: profile.location || "Mirpur-1, Dhaka, Bangladesh",
    locationIcon: "MapPin",
  };

  const aboutStatsSection = cmsData?.aboutStatsSection || {
    visible: true,
    badge: "PROVEN TRACK RECORD",
    title: "Milestones by the",
    highlightText: "Numbers",
    description: "",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO / BANNER INSPIRED BY HOME ABOUT SECTION */}
      {/* ======================================================== */}
      {visibility.hero !== false && aboutHero.visible !== false && (
        <div
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mb-8 sm:mb-10 select-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#060c1c]/90 via-[#050a16]/80 to-[#050811] border border-[#00d2ff]/20 p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.08)]"
        >
          {/* Soft Ambient Light Pools */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[360px] sm:h-[440px] bg-gradient-to-tr from-[#a855f7]/15 via-[#8b5cf6]/08 to-transparent rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/3 -left-20 w-[400px] h-[350px] bg-gradient-to-r from-[#00d2ff]/10 via-[#0088ff]/05 to-transparent rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[450px] h-[350px] bg-gradient-to-bl from-[#a855f7]/10 via-[#c084fc]/05 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: 3D Card Stack with Glowing Orbit Ring */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[340px] sm:min-h-[380px] md:min-h-[420px]">
              {/* Glowing Purple/Violet/Cyan Neon Orbit Ring */}
              {aboutHero.orbitEffectsVisible !== false && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 transition-transform duration-700 ease-out"
                  style={{
                    transform: "translate3d(calc(var(--ab-mx, 0) * -20px), calc(var(--ab-my, 0) * -16px), 0)",
                  }}
                >
                  <svg
                    viewBox="0 0 600 380"
                    className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] h-auto overflow-visible"
                  >
                    <defs>
                      <linearGradient id="about-page-orbit" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                        <stop offset="35%" stopColor="#818cf8" stopOpacity="0.9" />
                        <stop offset="65%" stopColor="#a855f7" stopOpacity="0.95" />
                        <stop offset="85%" stopColor="#c084fc" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                      </linearGradient>
                      <filter id="about-page-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <ellipse
                      cx="300"
                      cy="190"
                      rx="250"
                      ry="120"
                      transform="rotate(-18 300 190)"
                      fill="none"
                      stroke="url(#about-page-orbit)"
                      strokeWidth="8"
                      opacity="0.3"
                      filter="url(#about-page-glow)"
                    />
                    <ellipse
                      cx="300"
                      cy="190"
                      rx="250"
                      ry="120"
                      transform="rotate(-18 300 190)"
                      fill="none"
                      stroke="url(#about-page-orbit)"
                      strokeWidth="3"
                      className="drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]"
                    />
                    <circle
                      r="3.5"
                      fill="#00f0ff"
                      className="drop-shadow-[0_0_10px_#00f0ff] animate-pulse"
                      cx="90"
                      cy="240"
                    />
                    <circle
                      r="3"
                      fill="#c084fc"
                      className="drop-shadow-[0_0_10px_#c084fc] animate-pulse"
                      cx="480"
                      cy="120"
                    />
                  </svg>
                </div>
              )}

              {/* 3D Card Stack Container */}
              <div
                className="relative w-full max-w-[420px] sm:max-w-[460px] h-[340px] sm:h-[380px] flex items-center justify-center transition-transform duration-500 ease-out"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d",
                  transform:
                    "rotateY(calc(var(--ab-mx, 0) * 12deg)) rotateX(calc(var(--ab-my, 0) * -10deg))",
                }}
              >
                {/* Card 1: Workstation Left */}
                {heroPhotos[0] && heroPhotos[0].visible !== false && (
                  <motion.div
                    animate={{ y: [0, 8, 0], rotate: [-14, -13, -14] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-10 w-[170px] sm:w-[190px] aspect-[3/4] -left-2 sm:left-2 -top-2 rounded-2xl overflow-hidden border border-white/15 bg-[#0b1220] shadow-[0_20px_45px_rgba(0,0,0,0.9)] opacity-85 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src={normalizeImageUrl(workstationImg)}
                      alt={heroPhotos[0].alt || "Workstation Lab"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/70 via-transparent to-transparent" />
                  </motion.div>
                )}

                {/* Card 2: Certificate Right */}
                {(heroPhotos[2] || heroPhotos[1]) && (heroPhotos[2]?.visible !== false) && (
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [14, 13, 14] }}
                    transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-20 w-[170px] sm:w-[190px] aspect-[3/4] -right-2 sm:right-2 -bottom-2 rounded-2xl overflow-hidden border border-[#a855f7]/40 bg-[#0b1220] shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_20px_rgba(168,85,247,0.3)] opacity-85 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src={normalizeImageUrl(certificateImg)}
                      alt={heroPhotos[2]?.alt || "NSDA Certification"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/70 via-transparent to-transparent" />
                  </motion.div>
                )}

                {/* Card 3: Main Focal Portrait Center */}
                <div className="relative z-30 group/portrait cursor-pointer">
                  {/* Dedicated Soft Cyan Glow Backdrop */}
                  <div className="absolute -inset-3 bg-[#00d2ff]/20 rounded-3xl blur-2xl pointer-events-none -z-10" />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[190px] sm:w-[220px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#00d2ff] shadow-[0_0_35px_rgba(0,210,255,0.45),0_25px_60px_rgba(0,0,0,0.95)]"
                  >
                    <img
                      src={normalizeImageUrl(mainPhoto.src)}
                      alt={mainPhoto.alt || "Tarek Rahaman"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top group-hover/portrait:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040813]/90 via-[#040813]/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 inset-x-2.5 p-2.5 rounded-xl bg-[#060c18]/90 backdrop-blur-md border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] text-center">
                      <h4 className="text-sm font-black text-white tracking-wide leading-tight">
                        {profile.fullName || profile.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#00d2ff] mt-0.5">
                        {profile.titles?.[0] || mainPhoto.role || "Creative Web Developer"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Content & Key Signals */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-5">
              {/* Hero Top Badge */}
              {aboutHero.badge?.visible !== false && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(0,210,255,0.15)]">
                  {(() => {
                    const HeroBadgeIcon = getBadgeIcon(aboutHero.badge?.icon);
                    return <HeroBadgeIcon className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />;
                  })()}
                  <span>{tCms(aboutHero.badge?.text, "about.academicBadge")}</span>
                </div>
              )}

              {/* Hero Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white leading-[1.14] tracking-tight">
                <span>{tCms(aboutHero.heading.prefix, "about.title")}{" "}</span>
                <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                  {tCms(aboutHero.heading.highlight1, "about.subtitle")}
                </span>
                {aboutHero.heading.highlight2 && (
                  <span
                    className={
                      aboutHero.heading.highlightStyle === "purple"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                        : aboutHero.heading.highlightStyle === "emerald"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#059669] drop-shadow-[0_0_20px_rgba(52,211,153,0.45)]"
                        : aboutHero.heading.highlightStyle === "cyan"
                        ? "text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                    }
                  >
                    {aboutHero.heading.highlight2}
                  </span>
                )}
                {aboutHero.heading.suffix && <span>{aboutHero.heading.suffix}</span>}
              </h1>

              {/* Hero Paragraphs */}
              {aboutHero.paragraphs?.filter((p) => p.visible !== false).map((para, pIdx) => (
                <p
                  key={para.id}
                  className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal whitespace-pre-line"
                >
                  {pIdx === 0 ? tCms(para.text, "about.fullBioPara1") : para.text}
                </p>
              ))}

              {/* Core Tech Badges */}
              {aboutHero.techBadges?.filter((b) => b.visible !== false).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {aboutHero.techBadges
                    .filter((b) => b.visible !== false)
                    .map((badge) => {
                      const BadgeIcon = getBadgeIcon(badge.icon);
                      return badge.link ? (
                        <a
                          key={badge.id || badge.label}
                          href={badge.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a1428]/90 border border-[#00d2ff]/30 text-slate-100 text-xs font-semibold tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:border-[#00d2ff]/60 hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] hover:scale-105 transition-all"
                        >
                          <BadgeIcon className="w-3.5 h-3.5 text-[#00d2ff]" />
                          <span>{badge.label}</span>
                        </a>
                      ) : (
                        <span
                          key={badge.id || badge.label}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a1428]/90 border border-[#00d2ff]/30 text-slate-100 text-xs font-semibold tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:border-[#00d2ff]/60 hover:shadow-[0_0_12px_rgba(0,210,255,0.25)] transition-all"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                          <span>{badge.label}</span>
                        </span>
                      );
                    })}
                </div>
              )}

              {/* Quick Statistics Row */}
              {aboutHero.stats?.filter((s) => s.visible !== false).length > 0 && (
                <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-2 border-t border-white/[0.08] w-full">
                  {aboutHero.stats
                    .filter((s) => s.visible !== false)
                    .map((item, idx) => {
                      const StatIcon = getBadgeIcon(item.icon);
                      const borderGlow =
                        idx % 3 === 0
                          ? "bg-[#00d2ff]/10 border-[#00d2ff]/40 text-[#00f0ff] shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                          : idx % 3 === 1
                          ? "bg-[#a855f7]/12 border-[#a855f7]/40 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                          : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
                      return (
                        <div key={item.id || item.label} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${borderGlow}`}>
                            <StatIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                              {item.value}
                              {item.suffix || ""}
                            </div>
                            <div className="text-[11px] text-slate-300 font-medium">
                              {tStatLabel(item.label)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Action Buttons */}
              {aboutHero.buttons?.filter((b) => b.visible !== false).length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  {aboutHero.buttons
                    .filter((b) => b.visible !== false)
                    .map((btn, bIdx) => {
                      const BtnIcon = getBadgeIcon(btn.icon || (bIdx === 0 ? "Download" : "Send"));
                      const isPrimary = bIdx === 0;
                      const btnDisplayLabel =
                        bIdx === 0
                          ? t("about.downloadResume")
                          : t("about.letsConnect");

                      if (btn.isDownload) {
                        return (
                          <a
                            key={btn.id || btn.text}
                            href={btn.url || profile.cvUrl || profileData.cvUrl}
                            download={btn.downloadName || "Tarek-Rahaman-CV.pdf"}
                            className={
                              isPrimary
                                ? "group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#0088ff] shadow-[0_0_22px_rgba(0,210,255,0.7)] hover:shadow-[0_0_35px_rgba(0,210,255,0.95)] hover:scale-105 transition-all duration-300"
                                : "group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#091124]/90 hover:bg-[#00d2ff]/15 border border-[#00d2ff]/40 hover:border-[#00d2ff] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-105 transition-all duration-300"
                            }
                          >
                            <BtnIcon className={`w-4 h-4 ${isPrimary ? "text-[#050811] group-hover:translate-y-0.5" : "text-[#00d2ff] group-hover:translate-x-0.5"} transition-transform`} />
                            <span>{btnDisplayLabel}</span>
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={btn.id || btn.text}
                          href={btn.url}
                          target={btn.openInNewTab ? "_blank" : undefined}
                          rel={btn.openInNewTab ? "noopener noreferrer" : undefined}
                          className={
                            isPrimary
                              ? "group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#0088ff] shadow-[0_0_22px_rgba(0,210,255,0.7)] hover:shadow-[0_0_35px_rgba(0,210,255,0.95)] hover:scale-105 transition-all duration-300"
                              : "group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#091124]/90 hover:bg-[#00d2ff]/15 border border-[#00d2ff]/40 hover:border-[#00d2ff] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-105 transition-all duration-300"
                          }
                        >
                          <BtnIcon className={`w-4 h-4 ${isPrimary ? "text-[#050811] group-hover:translate-y-0.5" : "text-[#00d2ff] group-hover:translate-x-0.5"} transition-transform`} />
                          <span>{btnDisplayLabel}</span>
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transition Wave into Deep Dive Content */}
      {visibility.profileGrid !== false && (
        <WaveDivider variant={2} inverted className="my-2 sm:my-3 !py-0" />
      )}

      {/* 2. Detailed Bio & Credentials Grid */}
      {visibility.profileGrid !== false && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center my-8 sm:my-12">
          {/* Left Column: Visual Photo Composition */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Focal Portrait Card */}
            {profileCard.visible !== false && (
              <div className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-[#00d2ff]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#00d2ff]/70 hover:shadow-[0_20px_50px_rgba(0,210,255,0.25)]">
                <img
                  src={normalizeImageUrl(profileCard.imageUrl || mainPhoto.src)}
                  alt={profileCard.altText || mainPhoto.alt || "Md Tarek Rahaman - Creative Web Developer"}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/profile-1-scaled.png") {
                      target.src = "/assets/profile-1-scaled.png";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/30 to-transparent opacity-90" />
                
                {/* Verified Top Badge */}
                {profileCard.showVerifiedBadge !== false && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#051122]/90 border border-[#00d2ff]/40 text-[#00d2ff] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.3)]">
                    {(() => {
                      const VerifiedIcon = getBadgeIcon(profileCard.verifiedBadgeIcon || "ShieldCheck");
                      return <VerifiedIcon className="w-3.5 h-3.5 text-[#00d2ff]" />;
                    })()}
                    <span>{t("about.verifiedBadge")}</span>
                  </div>
                )}

                {/* Bottom Details Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  {profileCard.eyebrowText && (
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff] block mb-1">
                      {profileCard.eyebrowText}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {profileCard.title || profile.titles?.[0] || "Full-Stack & WordPress Specialist"}
                  </h3>
                  {profileCard.location && (
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-2">
                      {(() => {
                        const LocIcon = getBadgeIcon(profileCard.locationIcon || "MapPin");
                        return <LocIcon className="w-3.5 h-3.5 text-[#00d2ff]" />;
                      })()}
                      {profileCard.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Milestone Gallery Photos */}
            {visibility.gallery !== false && galleryItems.filter((p) => p.visible !== false).length > 0 && (
              <div
                className={`grid gap-3 ${
                  galleryItems.filter((p) => p.visible !== false).length > 3
                    ? "grid-cols-2 sm:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {galleryItems
                  .filter((p) => p.visible !== false)
                  .map((photo, i) => {
                    const itemContent = (
                      <div
                        key={photo.id || photo.src || i}
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-[#091124] border border-[#00d2ff]/25 hover:border-[#00d2ff]/70 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(0,210,255,0.25)] hover:-translate-y-0.5"
                      >
                        <img
                          src={normalizeImageUrl(photo.src)}
                          alt={photo.alt || photo.title || photo.label || "Gallery Photo"}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== "/assets/profile-1-scaled.png") {
                              target.src = "/assets/profile-1-scaled.png";
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/90 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <span className="text-[10px] font-bold text-slate-200 group-hover:text-[#00d2ff] transition-colors truncate block">
                            {photo.title || photo.label}
                          </span>
                        </div>
                      </div>
                    );

                    return photo.link ? (
                      <a
                        key={photo.id || photo.src || i}
                        href={photo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {itemContent}
                      </a>
                    ) : (
                      itemContent
                    );
                  })}
              </div>
            )}
          </div>

          {/* Right Column: Bio Narrative & Credentials */}
          {visibility.bioStory !== false && (
            <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed">
              {bio.showBadge !== false && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(0,210,255,0.15)]">
                  {(() => {
                    const BioBadgeIcon = getBadgeIcon(bio.badgeIcon || "Sparkles");
                    return <BioBadgeIcon className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />;
                  })()}
                  <span>{tCms(bio.badge, "about.biographyExpertise")}</span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {bio.headingPrefix || "Turning complex problems into "}
                <span
                  className={
                    bio.highlightStyle === "purple"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                      : bio.highlightStyle === "emerald"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#059669] drop-shadow-[0_0_20px_rgba(52,211,153,0.45)]"
                      : bio.highlightStyle === "gradient"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_20px_rgba(0,210,255,0.45)]"
                      : "text-cyan-gradient"
                  }
                >
                  {bio.highlightedText || "elegant, scalable"}
                </span>
                {bio.headingSuffix || ", and revenue-generating digital products."}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-normal whitespace-pre-line">
                {tCms(bio.firstParagraph, "about.fullBioPara1")}
              </p>

              {bio.secondParagraph && (
                <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-normal whitespace-pre-line">
                  {tCms(bio.secondParagraph, "about.fullBioPara2")}
                </p>
              )}

              {/* Additional Paragraphs if any */}
              {bio.additionalParagraphs?.filter((p) => p.visible !== false).map((ap) => (
                <p
                  key={ap.id}
                  className="text-sm sm:text-base leading-relaxed text-slate-200 font-normal whitespace-pre-line"
                >
                  {ap.text}
                </p>
              ))}

              {/* Specialty Badges Row */}
              {bio.badges && bio.badges.filter((b) => b.visible !== false).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {bio.badges
                    .filter((b) => b.visible !== false)
                    .map((chip, idx) => {
                      const ChipIcon = getBadgeIcon(chip.icon);
                      return (
                        <div
                          key={chip.id || chip.label || idx}
                          className="p-2.5 rounded-xl bg-[#091124]/90 border border-[#00d2ff]/22 text-[11px] font-bold text-white flex items-center gap-2 hover:border-[#00d2ff]/60 hover:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all"
                        >
                          <ChipIcon className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                          <span className="truncate">{chip.label}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* NEW SECTION 1: HOW I WORK / DEVELOPMENT PROCESS */}
      {visibility.process !== false && (
        <>
          <WaveDivider variant={2} className="my-2 sm:my-3 !py-0" />
          <AboutProcessSection />
        </>
      )}

      {/* NEW SECTION 2: TECHNOLOGIES & TOOLS */}
      {visibility.techStack !== false && (
        <>
          <WaveDivider variant={3} inverted className="my-2 sm:my-3 !py-0" />
          <AboutTechStackSection />
        </>
      )}

      {/* 3. Educational Journey */}
      {visibility.education !== false && (
        <>
          <WaveDivider variant={1} className="my-2 sm:my-3 !py-0" />
          <section className="my-8 sm:my-12">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-11 h-11 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff]">
                  {t("about.academics")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t("about.educationalJourney")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {education.map((edu) => (
                <div
                  key={edu.institution}
                  className="group p-6 rounded-2xl bg-[#080e1e]/90 hover:bg-[#0c1630] border border-[#00d2ff]/22 hover:border-[#00d2ff]/60 backdrop-blur-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_36px_rgba(0,210,255,0.2)] hover:-translate-y-1 flex flex-col justify-between h-full select-none"
                >
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] px-2.5 py-1 rounded-md bg-[#00d2ff]/10 border border-[#00d2ff]/25 inline-block">
                      {edu.highlight}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-[#00d2ff] transition-colors leading-snug">
                      {edu.degree}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
                      <Building className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                      <span>{edu.institution}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {edu.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3.5 border-t border-white/[0.08] text-xs text-slate-300 flex items-center gap-1.5 group-hover:text-[#00d2ff] transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 4. Professional Certifications */}
      {visibility.certifications !== false && (
        <>
          <WaveDivider variant={4} className="my-2 sm:my-3 !py-0" />
          <section className="my-8 sm:my-12">
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-11 h-11 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff]">
                  {t("about.credentials")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t("about.verifiedCertifications")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {certifications.map((cert) => (
                <div
                  key={cert.title}
                  className="group p-6 rounded-2xl bg-[#080e1e]/90 hover:bg-[#0c1630] border border-[#00d2ff]/22 hover:border-[#00d2ff]/60 backdrop-blur-md transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_36px_rgba(0,210,255,0.2)] hover:-translate-y-1 flex flex-col justify-between h-full select-none"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00d2ff] mb-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#00d2ff]" />
                      <span>{cert.issuer}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2.5 group-hover:text-[#00d2ff] transition-colors leading-snug">
                      {cert.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {cert.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-semibold text-[#00d2ff]">
                    <span>{t("about.verifiedCredential")}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 5. Future Vision & Global Aspirations */}
      {visibility.vision !== false && (
        <>
          <WaveDivider variant={2} inverted className="my-2 sm:my-3 !py-0" />
          <section className="my-8 sm:my-12 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0a1226]/95 via-[#070e20]/90 to-[#050914]/95 border border-[#00d2ff]/35 shadow-[0_0_50px_rgba(0,210,255,0.16),0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
            {/* Soft Ambient Light Pools */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8b5cf6]/08 rounded-full blur-[120px] pointer-events-none" />

            {/* Subtle Cyber Corner Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#00d2ff]/15 to-transparent pointer-events-none rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#8b5cf6]/15 to-transparent pointer-events-none rounded-br-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff] mb-2.5">
                <Globe2 className="w-4 h-4" />
                <span>{t("about.careerVision")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                {vision.title}
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-4xl mb-8 font-normal">
                {tCms(vision.statement, "about.visionText")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                {(vision.focusAreas || (vision as any).tags || futureVision.focusAreas).map((area: string) => (
                  <div
                    key={area}
                    className="p-4 rounded-xl bg-[#081020]/90 border border-[#00d2ff]/25 hover:border-[#00d2ff]/70 text-xs font-bold text-white flex items-center gap-3 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(0,210,255,0.25)] hover:-translate-y-0.5 group/tag"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff] group-hover/tag:scale-125 transition-transform shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* NEW SECTION 3: PREMIUM CALL TO ACTION */}
      {visibility.cta !== false && (
        <>
          <WaveDivider variant={3} className="my-2 sm:my-3 !py-0" />
          <AboutCtaSection />
        </>
      )}

      {/* 6. Proven Track Record & Statistics */}
      {visibility.stats !== false && aboutStatsSection.visible !== false && (
        <>
          <WaveDivider variant={1} inverted className="my-2 sm:my-3 !py-0" />
          <section className="my-8 sm:my-12">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold tracking-widest uppercase mb-2 shadow-[0_0_12px_rgba(0,210,255,0.15)]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />
                {tCms(aboutStatsSection.badge, "about.provenTrackRecord")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {tCms(aboutStatsSection.title, "about.milestonesByThe")}{" "}
                <span className="text-cyan-gradient">
                  {tCms(aboutStatsSection.highlightText, "about.numbers")}
                </span>
              </h2>
              {aboutStatsSection.description && (
                <p className="text-slate-300 text-sm mt-2">{aboutStatsSection.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => {
                const statIcons = [Users, Briefcase, Layers, Building];
                const IconComponent = statIcons[i % statIcons.length];
                return (
                  <div
                    key={stat.label}
                    className="group p-6 rounded-2xl bg-[#080e1e]/90 hover:bg-[#0c1630] border border-[#00d2ff]/22 hover:border-[#00d2ff]/60 backdrop-blur-md transition-all duration-300 text-center shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_36px_rgba(0,210,255,0.22)] hover:-translate-y-1 select-none flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 mx-auto rounded-xl bg-[#051122]/90 border border-[#00d2ff]/25 text-[#00d2ff] flex items-center justify-center mb-3 group-hover:border-[#00d2ff] group-hover:shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all">
                        <IconComponent className="w-4 h-4 text-[#00d2ff]" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                        <span className="text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.7)] ml-0.5">
                          {stat.suffix}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-100 mt-2">
                        {tStatLabel(stat.label)}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed font-normal">
                      {stat.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
