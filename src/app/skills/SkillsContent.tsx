"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  Sparkles,
  Cpu,
  Database,
  Layers,
  Code2,
  CheckCircle2,
  Award,
  Zap,
  Flame,
  Wrench,
  Globe,
  ShieldCheck,
  Brain,
  Sliders,
} from "lucide-react";
import SkillsCoreExpertise from "@/components/sections/SkillsCoreExpertise";
import SkillsLearningSection from "@/components/sections/SkillsLearningSection";
import SkillsRoadmapSection from "@/components/sections/SkillsRoadmapSection";
import WaveDivider from "@/components/ui/WaveDivider";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { skillCategoriesData } from "@/data/portfolioData";
import { TechBrandLogo } from "@/components/sections/SkillsSection";
import { SkillsHeroVisualCard, SkillsHeroStat } from "@/types/portfolio";
import { cinematicEase } from "@/lib/animations";

function getStatIcon(iconName?: string) {
  switch (iconName) {
    case "Code2":
      return Code2;
    case "Cpu":
      return Cpu;
    case "Database":
      return Database;
    case "Sparkles":
      return Sparkles;
    case "Terminal":
      return Terminal;
    case "Layers":
      return Layers;
    case "Zap":
      return Zap;
    case "Flame":
      return Flame;
    case "Award":
      return Award;
    case "ShieldCheck":
      return ShieldCheck;
    default:
      return Code2;
  }
}

// Hexagonal SVG Frame for Hero Showcase
function HeroHexCard({
  name,
  level,
  logoName,
  imageUrl,
  isCenter = false,
  masteryLabel = "Mastery",
}: SkillsHeroVisualCard & { isCenter?: boolean; masteryLabel?: string }) {
  const width = isCenter
    ? "w-[130px] xs:w-[160px] sm:w-[190px]"
    : "w-[100px] xs:w-[130px] sm:w-[150px]";
  const height = isCenter
    ? "h-[155px] xs:h-[195px] sm:h-[230px]"
    : "h-[120px] xs:h-[155px] sm:h-[185px]";

  const safeFillId = `hero-hex-fill-${name.replace(/[^a-zA-Z0-9]/g, "-")}`;
  const safeStrokeId = `hero-hex-stroke-${name.replace(/[^a-zA-Z0-9]/g, "-")}`;

  return (
    <motion.div
      animate={{
        y: isCenter ? [0, -8, 0] : [0, 6, 0],
      }}
      transition={{
        duration: isCenter ? 5 : 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative select-none ${width} ${height} flex items-center justify-center`}
    >
      {/* Hexagon SVG Frame */}
      <svg
        viewBox="0 0 100 120"
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{
          filter: isCenter
            ? "drop-shadow(0 0 25px rgba(0, 210, 255, 0.6)) drop-shadow(0 15px 35px rgba(168, 85, 247, 0.45))"
            : "drop-shadow(0 0 14px rgba(0, 210, 255, 0.3))",
        }}
      >
        <defs>
          <linearGradient id={safeFillId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#081024" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#0d1836" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#170d2b" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id={safeStrokeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        <path
          d="M 50 3 Q 52 2 55 3.7 L 94 25 Q 97 26.7 97 30 L 97 78 Q 97 81.3 94 83 L 55 104.3 Q 52 106 50 105 L 11 83 Q 8 81.3 8 78 L 8 30 Q 8 26.7 11 25 L 50 3 Z"
          fill={`url(#${safeFillId})`}
          stroke={`url(#${safeStrokeId})`}
          strokeWidth={isCenter ? "2.6" : "2"}
        />
      </svg>

      {/* Inner Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className={`${isCenter ? "w-10 h-10 sm:w-12 sm:h-12" : "w-8 h-8 sm:w-9 sm:h-9"} object-contain`}
          />
        ) : (
          <TechBrandLogo
            name={logoName || name}
            className={isCenter ? "w-10 h-10 sm:w-12 sm:h-12" : "w-8 h-8 sm:w-9 sm:h-9"}
          />
        )}
        <h4 className="text-xs sm:text-sm font-black text-white mt-2 leading-tight tracking-wide">
          {name}
        </h4>
        <span className="font-mono text-[11px] sm:text-xs font-extrabold text-[#00f0ff] mt-0.5">
          {level}% {masteryLabel}
        </span>
      </div>
    </motion.div>
  );
}

export default function SkillsContent() {
  const { cmsData } = useCms();
  const { t, tStatLabel, language } = useLanguage();
  const isBn = language === "bn";

  const rawCategories = cmsData.skills?.length ? cmsData.skills : skillCategoriesData;

  const hero = cmsData.skillsHero || {
    badge: "PROFESSIONAL SKILLS // TECHNICAL ARCHITECTURE",
    badgeIcon: "Sparkles",
    title: "Technical Level & ",
    titleHighlight1: "Programming ",
    titleHighlight2: "Expertise",
    description:
      "Software Engineering undergraduate at Daffodil International University with practical commercial mastery across backend systems, database performance, modern frontend frameworks, and bespoke WordPress architectures.",
    tags: [
      { text: "Full-Stack Web Systems" },
      { text: "Database Query Optimization" },
      { text: "WordPress Theme & Plugin Core" },
      { text: "Laravel MVC & REST APIs" },
      { text: "Data Science & Python" },
    ],
    stats: [
      { number: "15+", label: "Core Technologies", icon: "Code2" },
      { number: "98%", label: "Max Proficiency", icon: "Cpu" },
      { number: "200+", label: "Deployments", icon: "Database" },
    ],
    visualCards: [
      { name: "Laravel", level: 92, logoName: "Laravel" },
      { name: "WordPress / PHP", level: 98, logoName: "WordPress" },
      { name: "React / Next.js", level: 90, logoName: "React" },
    ],
  };

  const bnHero = {
    badge: "পেশাগত দক্ষতা // টেকনিক্যাল আর্কিটেকচার",
    title: "কারিগরি দক্ষতা ও ",
    titleHighlight1: "প্রোগ্রামিং ",
    titleHighlight2: "দক্ষতা",
    description:
      "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির সফটওয়্যার ইঞ্জিনিয়ারিং শিক্ষার্থী — ব্যাকএন্ড সিস্টেম, ডাটাবেজ পারফরম্যান্স, আধুনিক ফ্রন্টএন্ড এবং কাস্টম ওয়ার্ডপ্রেস আর্কিটেকচারে বাস্তব বাণিজ্যিক অভিজ্ঞতাসম্পন্ন।",
    tags: [
      { text: "ফুল-স্ট্যাক ওয়েব সিস্টেম" },
      { text: "ডাটাবেজ কুয়েরি অপ্টিমাইজেশন" },
      { text: "ওয়ার্ডপ্রেস থিম ও প্লাগইন আর্কিটেকচার" },
      { text: "লারাভেল MVC ও REST APIs" },
      { text: "ডাটা সায়েন্স ও পাইথন" },
    ],
  };

  const codingHeader = isBn
    ? {
        badge: "দক্ষতা ক্ষেত্র ০১",
        title: "কোডিং ও প্রোগ্রামিং ল্যাঙ্গুয়েজ",
        description: "কোর প্রোগ্রামিং ল্যাঙ্গুয়েজ, ব্যাকএন্ড ফ্রেমওয়ার্ক ও রানটাইম পরিবেশ।",
      }
    : cmsData.skillsCodingHeader || {
        badge: "DISCIPLINE 01",
        title: "Coding & Programming Languages",
        description: "Core programming languages, backend frameworks, and runtime environments.",
      };

  const toolsHeader = isBn
    ? {
        badge: "দক্ষতা ক্ষেত্র ০২",
        title: "টুলস ও টেকনোলজিস",
        description: "ডেভেলপমেন্ট টুলস, ডিপ্লয়মেন্ট প্ল্যাটফর্ম, ডাটাবেজ ও আধুনিক ওয়ার্কফ্লো ইউটিলিটি।",
      }
    : cmsData.skillsToolsHeader || {
        badge: "DISCIPLINE 02",
        title: "Tools & Technologies",
        description: "Development tools, deployment platforms, databases, and workflow utilities.",
      };

  const designSettings = cmsData.skillsDesignSettings || {
    sectionOrder: ["hero", "coding", "tools", "strengths", "learning", "roadmap"],
    sectionVisibility: {
      hero: true,
      coding: true,
      tools: true,
      strengths: true,
      learning: true,
      roadmap: true,
    },
    showAmbientGlow: true,
    showWaveDividers: true,
  };

  const isVisible = (secKey: string) => {
    return (designSettings.sectionVisibility as Record<string, boolean | undefined>)?.[secKey] !== false;
  };

  const sectionOrder = designSettings.sectionOrder || [
    "hero",
    "coding",
    "tools",
    "strengths",
    "learning",
    "roadmap",
  ];

  // Render individual sections
  const renderHeroSection = () => {
    if (!isVisible("hero")) return null;

    const cards = hero.visualCards?.length
      ? hero.visualCards
      : [
          { name: "Laravel", level: 92, logoName: "Laravel" },
          { name: "WordPress / PHP", level: 98, logoName: "WordPress" },
          { name: "React / Next.js", level: 90, logoName: "React" },
        ];

    return (
      <div
        key="hero"
        id="hero"
        className="relative mb-14 sm:mb-18 select-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#060c1c]/90 via-[#050a16]/80 to-[#050811] border border-[#00d2ff]/20 p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,210,255,0.08)]"
      >
        {/* Soft Atmospheric Glow Pools */}
        {designSettings.showAmbientGlow !== false && (
          <>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[360px] bg-gradient-to-tr from-[#a855f7]/15 via-[#8b5cf6]/08 to-transparent rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/3 -right-20 w-[450px] h-[380px] bg-gradient-to-bl from-[#00d2ff]/12 via-[#0088ff]/06 to-transparent rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Technical Header & Indicators */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(0,210,255,0.15)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />
              <span>{isBn ? bnHero.badge : hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.14]">
              <span>{isBn ? bnHero.title : (hero.title || "Technical Level & ")}</span>
              {(isBn ? bnHero.titleHighlight1 : hero.titleHighlight1) && (
                <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                  {isBn ? bnHero.titleHighlight1 : hero.titleHighlight1}{" "}
                </span>
              )}
              {(isBn ? bnHero.titleHighlight2 : hero.titleHighlight2) && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]">
                  {isBn ? bnHero.titleHighlight2 : hero.titleHighlight2}
                </span>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {isBn ? bnHero.description : hero.description}
            </p>

            {/* Core Domain Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(isBn ? bnHero.tags : (hero.tags || [])).map((domain: any, tIdx: number) => {
                const tagText = domain.text || domain.name || String(domain);
                return (
                  <span
                    key={tagText || tIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a1224]/85 border border-[#00d2ff]/25 text-slate-200 text-xs font-semibold tracking-wide shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                    <span>{tagText}</span>
                  </span>
                );
              })}
            </div>

            {/* Quick Metrics Bar */}
            {hero.stats && hero.stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-2 border-t border-white/[0.08] w-full">
                {hero.stats.map((stat, sIdx) => {
                  const Icon = getStatIcon(stat.icon);
                  const colorClass =
                    sIdx === 0
                      ? "text-[#00f0ff] bg-[#00d2ff]/10 border-[#00d2ff]/40 shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                      : sIdx === 1
                      ? "text-[#c084fc] bg-[#a855f7]/12 border-[#a855f7]/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]";

                  return (
                    <div key={stat.label || sIdx} className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${colorClass}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                          {stat.number}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {tStatLabel(stat.label)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Signature 3D Hexagon Stage with Floating Pedestal */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[320px] sm:min-h-[360px] overflow-hidden sm:overflow-visible">
            {/* Hexagon Trio */}
            <div className="relative flex items-center justify-center gap-2 sm:gap-3 z-20">
              {cards[0] && (
                <div className="-mr-4 sm:-mr-6 z-10">
                  <HeroHexCard {...cards[0]} isCenter={false} masteryLabel={isBn ? "দক্ষতা" : "Mastery"} />
                </div>
              )}

              {cards[1] && (
                <div className="z-30 scale-105">
                  <HeroHexCard {...cards[1]} isCenter={true} masteryLabel={isBn ? "দক্ষতা" : "Mastery"} />
                </div>
              )}

              {cards[2] && (
                <div className="-ml-4 sm:-ml-6 z-10">
                  <HeroHexCard {...cards[2]} isCenter={false} masteryLabel={isBn ? "দক্ষতা" : "Mastery"} />
                </div>
              )}
            </div>

            {/* Glowing Floating Pedestal Beneath */}
            <div className="relative -mt-6 sm:-mt-8 z-0 pointer-events-none">
              <svg
                viewBox="0 0 280 65"
                className="w-[280px] sm:w-[320px] h-auto overflow-visible"
              >
                <ellipse
                  cx="140"
                  cy="28"
                  rx="130"
                  ry="22"
                  fill="rgba(0, 210, 255, 0.15)"
                  filter="blur(16px)"
                />
                <polygon
                  points="140,6 260,24 140,42 20,24"
                  fill="#071228"
                  stroke="#00f0ff"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_15px_rgba(0,210,255,0.85)]"
                />
                <polygon
                  points="140,12 240,26 140,38 40,26"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Coding Category
  const renderCodingSection = () => {
    if (!isVisible("coding")) return null;

    const codingCat =
      rawCategories.find((c) =>
        c.category?.toLowerCase().includes("coding") ||
        c.category?.toLowerCase().includes("language")
      ) || rawCategories[0];

    if (!codingCat) return null;
    const skills = (codingCat.skills || []).filter((s) => s.enabled !== false);

    return (
      <div key="coding" id="coding" className="space-y-6 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff]">
              {codingHeader.badge || "DISCIPLINE 01"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {codingHeader.title || codingCat.category}
            </h2>
            {codingHeader.description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {codingHeader.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.04, ease: cinematicEase }}
              whileHover={{
                y: -5,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              className="p-4 sm:p-4.5 rounded-xl bg-[#090f1e]/85 hover:bg-[#0c1429] border border-[#00d2ff]/20 hover:border-[#00d2ff]/50 backdrop-blur-md transition-all duration-300 shadow-[0_4px_18px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(0,210,255,0.18)] flex flex-col justify-between h-full select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {skill.imageUrl ? (
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        loading="lazy"
                        decoding="async"
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <TechBrandLogo name={skill.name} className="w-5 h-5" />
                    )}
                    <span className="font-bold text-white text-sm sm:text-base tracking-wide">
                      {skill.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#00d2ff]">
                    {skill.level}%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#0d162d] overflow-hidden p-[1px] border border-[#00d2ff]/10 mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.9, delay: 0.15 + (idx % 3) * 0.08, ease: cinematicEase }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0055ff] via-[#00a3ff] to-[#00f0ff] shadow-[0_0_12px_rgba(0,210,255,0.8)]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{isBn ? "দক্ষতা স্তর" : "Proficiency"}</span>
                <span className="text-[#00d2ff] font-semibold">
                  {isBn
                    ? (skill.level >= 90
                        ? "এক্সপার্ট"
                        : skill.level >= 80
                        ? "অ্যাডভান্সড"
                        : "দক্ষ")
                    : (skill.proficiencyLabel ||
                        (skill.level >= 90
                          ? "Expert"
                          : skill.level >= 80
                          ? "Advanced"
                          : "Proficient"))}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Render Tools Category
  const renderToolsSection = () => {
    if (!isVisible("tools")) return null;

    const toolsCat =
      rawCategories.find((c) =>
        c.category?.toLowerCase().includes("tool") ||
        c.category?.toLowerCase().includes("technolog")
      ) || rawCategories[1];

    if (!toolsCat) return null;
    const skills = (toolsCat.skills || []).filter((s) => s.enabled !== false);

    return (
      <div key="tools" id="tools" className="space-y-6 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff]">
              {toolsHeader.badge || "DISCIPLINE 02"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {toolsHeader.title || toolsCat.category}
            </h2>
            {toolsHeader.description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {toolsHeader.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.04, ease: cinematicEase }}
              whileHover={{
                y: -5,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              className="p-4 sm:p-4.5 rounded-xl bg-[#090f1e]/85 hover:bg-[#0c1429] border border-[#00d2ff]/20 hover:border-[#00d2ff]/50 backdrop-blur-md transition-all duration-300 shadow-[0_4px_18px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(0,210,255,0.18)] flex flex-col justify-between h-full select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {skill.imageUrl ? (
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        loading="lazy"
                        decoding="async"
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <TechBrandLogo name={skill.name} className="w-5 h-5" />
                    )}
                    <span className="font-bold text-white text-sm sm:text-base tracking-wide">
                      {skill.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#00d2ff]">
                    {skill.level}%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#0d162d] overflow-hidden p-[1px] border border-[#00d2ff]/10 mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.9, delay: 0.15 + (idx % 3) * 0.08, ease: cinematicEase }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0055ff] via-[#00a3ff] to-[#00f0ff] shadow-[0_0_12px_rgba(0,210,255,0.8)]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{isBn ? "দক্ষতা স্তর" : "Proficiency"}</span>
                <span className="text-[#00d2ff] font-semibold">
                  {isBn
                    ? (skill.level >= 90
                        ? "এক্সপার্ট"
                        : skill.level >= 80
                        ? "অ্যাডভান্সড"
                        : "দক্ষ")
                    : (skill.proficiencyLabel ||
                        (skill.level >= 90
                          ? "Expert"
                          : skill.level >= 80
                          ? "Advanced"
                          : "Proficient"))}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderStrengthsSection = () => {
    if (!isVisible("strengths")) return null;
    return (
      <div key="strengths" id="expertise" className="mb-16">
        <SkillsCoreExpertise />
      </div>
    );
  };

  const renderLearningSection = () => {
    if (!isVisible("learning")) return null;
    return (
      <div key="learning" id="learning" className="mb-16">
        <SkillsLearningSection />
      </div>
    );
  };

  const renderRoadmapSection = () => {
    if (!isVisible("roadmap")) return null;
    return (
      <div key="roadmap" id="roadmap" className="mb-16">
        <SkillsRoadmapSection />
      </div>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    hero: renderHeroSection,
    coding: renderCodingSection,
    tools: renderToolsSection,
    strengths: renderStrengthsSection,
    learning: renderLearningSection,
    roadmap: renderRoadmapSection,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {sectionOrder.map((secKey, idx) => {
        const renderFn = sectionMap[secKey];
        if (!renderFn) return null;

        const rendered = renderFn();
        if (!rendered) return null;

        return (
          <div key={secKey}>
            {rendered}
            {designSettings.showWaveDividers !== false &&
              idx < sectionOrder.length - 1 && (
                <WaveDivider
                  variant={((idx % 3) + 1) as 1 | 2 | 3}
                  className="my-4 sm:my-6"
                />
              )}
          </div>
        );
      })}
    </div>
  );
}
