"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  ExternalLink,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Layers,
  Wrench,
  Terminal,
  X,
  Eye,
  Sliders,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Copy,
  Globe,
  RefreshCw,
  Search,
  BookOpen,
  Compass,
  Award,
  Zap,
  Flame,
  Brain,
  ShieldCheck,
  Palette,
  Settings,
  HelpCircle,
  FileText,
  Layout,
  Code2,
  Database,
  Image as ImageIcon
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import {
  SkillCategory,
  SkillItem,
  SkillsCoreExpertiseItem,
  SkillsLearningItem,
  SkillsRoadmapItem,
  SkillsHeroTag,
  SkillsHeroStat,
  SkillsHeroVisualCard,
  SkillsHeroSettings,
  SkillsCodingHeader,
  SkillsSeoSettings,
  SkillsDesignSettings,
} from "@/types/portfolio";
import { skillCategoriesData } from "@/data/portfolioData";

interface AdminSkillsCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type SkillsSectionKey =
  | "overview"
  | "hero"
  | "coding"
  | "tools"
  | "strengths"
  | "learning"
  | "roadmap"
  | "footer"
  | "seo"
  | "theme";

export default function AdminSkillsCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminSkillsCmsProps) {
  const { cmsData, updateCms } = useCms();

  const [internalSubPage, setInternalSubPage] = useState<SkillsSectionKey>("overview");
  const activeSubPage = (externalSubPage as SkillsSectionKey) || internalSubPage;

  const setActiveSubPage = (page: SkillsSectionKey) => {
    setInternalSubPage(page);
    if (externalSetSubPage) {
      externalSetSubPage(page);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // 1. HERO STATE
  const [heroForm, setHeroForm] = useState<SkillsHeroSettings>(
    cmsData.skillsHero || {
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
    }
  );

  // 2. CODING & TOOLS HEADERS
  const [codingHeader, setCodingHeader] = useState<SkillsCodingHeader>(
    cmsData.skillsCodingHeader || {
      badge: "DISCIPLINE 01",
      title: "Coding & Programming Languages",
      description: "Core programming languages, backend frameworks, and runtime environments.",
    }
  );

  const [toolsHeader, setToolsHeader] = useState<SkillsCodingHeader>(
    cmsData.skillsToolsHeader || {
      badge: "DISCIPLINE 02",
      title: "Tools & Technologies",
      description: "Development tools, deployment platforms, databases, and workflow utilities.",
    }
  );

  // 3. SKILLS CATEGORIES (Coding in index 0, Tools in index 1)
  const initialSkillCategories = cmsData.skills?.length
    ? cmsData.skills
    : skillCategoriesData;
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(initialSkillCategories);

  // Helper getters for Coding & Tools categories
  const codingCategoryIndex = skillCategories.findIndex(
    (c) =>
      c.category.toLowerCase().includes("coding") ||
      c.category.toLowerCase().includes("language")
  );
  const safeCodingIndex = codingCategoryIndex >= 0 ? codingCategoryIndex : 0;

  const toolsCategoryIndex = skillCategories.findIndex(
    (c) =>
      c.category.toLowerCase().includes("tool") ||
      c.category.toLowerCase().includes("technolog")
  );
  const safeToolsIndex = toolsCategoryIndex >= 0 ? toolsCategoryIndex : 1;

  // 4. CORE EXPERTISE
  const [coreHeader, setCoreHeader] = useState(
    cmsData.skillsCoreHeader || {
      badge: "CORE COMPETENCIES",
      title: "Architectural Strengths &",
      highlightText: "Core Technical Pillars",
      description:
        "Engineered for high performance, zero technical debt, security-first infrastructure, and frictionless client satisfaction.",
    }
  );

  const [coreExpertiseList, setCoreExpertiseList] = useState<SkillsCoreExpertiseItem[]>(
    cmsData.skillsCoreExpertise || [
      {
        id: "exp-1",
        number: "01",
        title: "Enterprise Web Architecture",
        badge: "CORE ENGINE",
        icon: "Layers",
        highlights: [
          "Custom PHP / Laravel Backends",
          "Multi-tenant Database Design",
          "RESTful API Development",
          "High-Concurrency Optimization",
        ],
      },
      {
        id: "exp-2",
        number: "02",
        title: "WordPress & WooCommerce Systems",
        badge: "CMS MASTERY",
        icon: "Globe",
        highlights: [
          "Bespoke Theme Development from Figma",
          "Custom Gutenberg Block Building",
          "Custom Plugin Engineering",
          "Advanced WooCommerce Checkout Workflows",
        ],
      },
      {
        id: "exp-3",
        number: "03",
        title: "Modern Reactive Frontend",
        badge: "USER INTERFACE",
        icon: "Sparkles",
        highlights: [
          "React.js & Next.js App Router",
          "Tailwind CSS Responsive Systems",
          "Framer Motion Micro-Interactions",
          "Accessible Semantic HTML5 / ARIA",
        ],
      },
      {
        id: "exp-4",
        number: "04",
        title: "Performance & Security Hardening",
        badge: "OPTIMIZATION",
        icon: "ShieldCheck",
        highlights: [
          "90+ Google Core Web Vitals Tuning",
          "Redis Caching & Asset Compression",
          "OWASP Compliant Security Auditing",
          "SQL Query & Database Indexing",
        ],
      },
    ]
  );

  // 5. CONTINUOUS LEARNING
  const [learningHeader, setLearningHeader] = useState(
    cmsData.skillsLearningHeader || {
      badge: "CONTINUOUS GROWTH",
      title: "Currently Learning &",
      highlightText: "Exploring",
      description:
        "Continuously expanding my technical knowledge and preparing for the next generation of digital solutions.",
    }
  );

  const [learningList, setLearningList] = useState<SkillsLearningItem[]>(
    cmsData.skillsLearning || [
      {
        id: "learn-1",
        icon: "Terminal",
        emoji: "🐍",
        title: "Python for Data Science",
        description:
          "Mastering NumPy, Pandas, Matplotlib, and exploratory data analysis workflows for real-world datasets.",
        status: "Learning / Exploring",
        tag: "DATA SCIENCE",
        gradient: "from-[#00d2ff] to-[#38bdf8]",
        footerLabel: "Active Learning",
      },
      {
        id: "learn-2",
        icon: "BarChart3",
        emoji: "📊",
        title: "Data Analytics & Power BI",
        description:
          "Transforming complex datasets into actionable business intelligence dashboards and KPI visual models.",
        status: "Learning / Exploring",
        tag: "BUSINESS INTELLIGENCE",
        gradient: "from-[#38bdf8] to-[#818cf8]",
        footerLabel: "Active Learning",
      },
      {
        id: "learn-3",
        icon: "Brain",
        emoji: "🧠",
        title: "Machine Learning Fundamentals",
        description:
          "Studying supervised learning algorithms, regression models, classification techniques, and neural networks.",
        status: "Learning / Exploring",
        tag: "ARTIFICIAL INTELLIGENCE",
        gradient: "from-[#818cf8] to-[#c084fc]",
        footerLabel: "Active Learning",
      },
      {
        id: "learn-4",
        icon: "Layers",
        emoji: "⚙️",
        title: "Advanced Software Architecture",
        description:
          "Deepening knowledge in clean architecture, microservices patterns, API scalability, and system design.",
        status: "Learning / Exploring",
        tag: "SYSTEM DESIGN",
        gradient: "from-[#c084fc] to-[#00d2ff]",
        footerLabel: "Active Learning",
      },
    ]
  );

  // 6. ROADMAP
  const [roadmapHeader, setRoadmapHeader] = useState(
    cmsData.skillsRoadmapHeader || {
      badge: "MY JOURNEY",
      title: "Professional Growth",
      highlightText: "Roadmap",
      description:
        "A continuous evolution of engineering mastery, from web fundamentals to full-stack systems and intelligent data science.",
    }
  );

  const [roadmapList, setRoadmapList] = useState<SkillsRoadmapItem[]>(
    cmsData.skillsRoadmap || [
      {
        id: "road-1",
        year: "2024",
        title: "Web Development Foundations",
        badge: "FOUNDATIONS",
        techList: ["HTML", "CSS", "JavaScript", "WordPress"],
        description:
          "Mastered semantic markup, modern responsive UI principles, DOM scripting, and custom WordPress setups.",
        isCurrent: false,
        isFuture: false,
      },
      {
        id: "road-2",
        year: "2025",
        title: "Professional Web Solutions",
        badge: "BACKEND & COMMERCE",
        techList: ["WooCommerce", "PHP", "Laravel", "Database Development"],
        description:
          "Engineered scalable e-commerce stores, custom PHP backends, relational database schemas, and commercial workflows.",
        isCurrent: false,
        isFuture: false,
      },
      {
        id: "road-3",
        year: "2026",
        title: "Full-Stack Development",
        badge: "CURRENT FOCUS",
        techList: ["Modern Web Applications", "Advanced Development", "Professional Client Projects"],
        description:
          "Delivering high-converting production platforms, custom Laravel systems, RESTful APIs, and full-stack solutions.",
        isCurrent: true,
        isFuture: false,
      },
      {
        id: "road-4",
        year: "FUTURE",
        title: "Data Science & AI",
        badge: "NEXT HORIZON",
        techList: ["Python", "Data Analytics", "Machine Learning", "Intelligent Systems"],
        description:
          "Expanding into intelligent data-driven applications, predictive machine learning models, and automated AI systems.",
        isCurrent: false,
        isFuture: true,
      },
    ]
  );

  // 7. FOOTER FORM
  const [footerForm, setFooterForm] = useState({
    brandTagline:
      cmsData.footerSettings?.brandTagline ||
      "Engineered with clean code, scalable architecture, and pixel perfection.",
    copyrightText:
      cmsData.footerSettings?.copyrightText ||
      `© ${new Date().getFullYear()} Tarek Rahaman. All rights reserved.`,
    phone: cmsData.contactInfo?.phone || "+880 1883 839955",
    email: cmsData.contactInfo?.email || "tarekrahaman186@gmail.com",
    availabilityText: cmsData.footerSettings?.availabilityText || "Available for Select Projects",
  });

  // 8. SEO SETTINGS
  const [seoForm, setSeoForm] = useState<SkillsSeoSettings>(
    cmsData.skillsSeoSettings || {
      title: "Professional Skills & Tech Stack | Tarek Rahaman",
      description:
        "Explore Tarek Rahaman's technical expertise in WordPress, PHP, Laravel, MySQL, JavaScript, Python, C, Java, React, and UI/UX engineering.",
      keywords:
        "Tarek Rahaman Skills, PHP Laravel Developer, Full Stack Engineer, WordPress Specialist, React Nextjs, MySQL, Data Science Python",
      ogTitle: "Technical Skills & Architecture | Tarek Rahaman",
      ogDescription:
        "Comprehensive breakdown of programming languages, frameworks, backend architectures, and developer tools mastered by Tarek Rahaman.",
      ogImage: "/assets/profile-1-scaled.png",
      canonicalUrl: "https://tarekrahaman.me/skills",
    }
  );

  // 9. THEME & DESIGN SETTINGS
  const [designSettings, setDesignSettings] = useState<SkillsDesignSettings>(
    cmsData.skillsDesignSettings || {
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
      primaryAccent: "#00d2ff",
      secondaryAccent: "#a855f7",
    }
  );

  // Stats calculation
  const totalSkillsCount = skillCategories.reduce(
    (acc, cat) => acc + (cat.skills?.length || 0),
    0
  );

  // Unified save handler
  const handleSaveAll = async (sectionName: string, customPayload?: any) => {
    setIsSaving(true);
    try {
      const payload = {
        skillsHero: heroForm,
        skillsCodingHeader: codingHeader,
        skillsToolsHeader: toolsHeader,
        skills: skillCategories,
        skillsCoreHeader: coreHeader,
        skillsCoreExpertise: coreExpertiseList,
        skillsLearningHeader: learningHeader,
        skillsLearning: learningList,
        skillsRoadmapHeader: roadmapHeader,
        skillsRoadmap: roadmapList,
        skillsSeoSettings: seoForm,
        skillsDesignSettings: designSettings,
        footerSettings: {
          ...(cmsData.footerSettings || {}),
          brandTagline: footerForm.brandTagline,
          copyrightText: footerForm.copyrightText,
          availabilityText: footerForm.availabilityText,
        },
        contactInfo: {
          ...(cmsData.contactInfo || {}),
          phone: footerForm.phone,
          email: footerForm.email,
        },
        ...customPayload,
      };

      await updateCms(payload);
      showToast(`Saved ${sectionName} changes successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Section definitions for the Overview Hub
  const skillsSections = [
    {
      id: "hero" as SkillsSectionKey,
      number: "01",
      name: "Skills Hero & Architecture Showcase",
      subtitle: "Headline, Chips, Stats & 3D Hexagons",
      desc: "Hero introduction, badge pill, summary narrative, 5 core chips, 3 quick metrics, and 3 signature 3D hexagon technology cards.",
      icon: Sparkles,
      countText: `${heroForm.stats?.length || 3} Metrics • ${heroForm.visualCards?.length || 3} Hexagons`,
      anchor: "#hero",
      visible: designSettings.sectionVisibility?.hero !== false,
      visibilityKey: "hero",
    },
    {
      id: "coding" as SkillsSectionKey,
      number: "02",
      name: "Coding & Programming Stacks",
      subtitle: "Discipline 01 & Percentage Mastery",
      desc: "Core programming languages (PHP, JavaScript, Python, C, Java, TypeScript) with real-time percentage sliders and proficiency labels.",
      icon: Cpu,
      countText: `${skillCategories[safeCodingIndex]?.skills?.length || 0} Coding Skills`,
      anchor: "#coding",
      visible: designSettings.sectionVisibility?.coding !== false,
      visibilityKey: "coding",
    },
    {
      id: "tools" as SkillsSectionKey,
      number: "03",
      name: "Tools & Technologies Stacks",
      subtitle: "Discipline 02 & Development Utilities",
      desc: "Essential developer tooling (WordPress, Laravel, React, Tailwind, MySQL, Git) with sliders, custom icons, and visibility toggles.",
      icon: Wrench,
      countText: `${skillCategories[safeToolsIndex]?.skills?.length || 0} Tools & Frameworks`,
      anchor: "#tools",
      visible: designSettings.sectionVisibility?.tools !== false,
      visibilityKey: "tools",
    },
    {
      id: "strengths" as SkillsSectionKey,
      number: "04",
      name: "Core Technical Pillars",
      subtitle: "Architectural Strengths & Competencies",
      desc: "Enterprise Web Architecture, WordPress / WooCommerce Systems, Reactive Frontend, and Security Hardening pillars with bullet lists.",
      icon: Layers,
      countText: `${coreExpertiseList.length} Core Pillars`,
      anchor: "#expertise",
      visible: designSettings.sectionVisibility?.strengths !== false,
      visibilityKey: "strengths",
    },
    {
      id: "learning" as SkillsSectionKey,
      number: "05",
      name: "Continuous Learning & Research",
      subtitle: "Emerging AI & High-Performance Tech",
      desc: "Disciplines actively being mastered including Python for Data Science, Power BI, Machine Learning, and Software Architecture.",
      icon: Brain,
      countText: `${learningList.length} Active Studies`,
      anchor: "#learning",
      visible: designSettings.sectionVisibility?.learning !== false,
      visibilityKey: "learning",
    },
    {
      id: "roadmap" as SkillsSectionKey,
      number: "06",
      name: "Engineering Roadmap & Milestones",
      subtitle: "Multi-Year Engineering Evolution",
      desc: "Past achievements (2024 Foundations), current focus (2025 Backend, 2026 Full-Stack), and future horizon (Data Science & AI).",
      icon: Compass,
      countText: `${roadmapList.length} Milestone Horizons`,
      anchor: "#growth-roadmap",
      visible: designSettings.sectionVisibility?.roadmap !== false,
      visibilityKey: "roadmap",
    },
    {
      id: "footer" as SkillsSectionKey,
      number: "07",
      name: "Skills Page Footer & Shared Components",
      subtitle: "Global Footer & Contact Sync",
      desc: "Shared global footer configuration, brand summary, direct contact credentials, and unified site navigation.",
      icon: ShieldCheck,
      countText: "Shared Global Component",
      anchor: "#footer",
      visible: true,
    },
    {
      id: "seo" as SkillsSectionKey,
      number: "08",
      name: "Skills SEO & Social Graph",
      subtitle: "Metadata, Keywords & OG Card",
      desc: "Search engine title, meta description, indexed keywords, canonical URL, and social preview card with Universal Image Manager.",
      icon: Globe,
      countText: "SEO & Social Sharing Card",
      anchor: "#seo",
      visible: true,
    },
    {
      id: "theme" as SkillsSectionKey,
      number: "09",
      name: "Section Ordering & Futuristic Theme",
      subtitle: "Layout Reorder, Wave Dividers & Glow",
      desc: "Customize the display sequence of skills sections, toggle section visibility, atmospheric glow pools, and RGB wave dividers.",
      icon: Palette,
      countText: "Layout & Theme Controls",
      anchor: "",
      visible: true,
    },
  ];

  // Common Header for Sub-Pages
  const renderSubPageHeader = (
    sectionNumber: string,
    title: string,
    description: string,
    liveAnchor: string,
    onSave: () => void,
    saveLabel = "Save Changes"
  ) => {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)] mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveSubPage("overview")}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00d2ff] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Skills CMS</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00d2ff] font-bold">
              Sub-Page #{sectionNumber}: {title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/skills${liveAnchor}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-[11px] font-bold text-[#00d2ff] transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Section</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{description}</p>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : saveLabel}</span>
          </button>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW 01: SKILLS OVERVIEW HUB
  // =========================================================================
  if (activeSubPage === "overview") {
    return (
      <div className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[11px] font-mono font-bold uppercase text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Skills CMS // 10 Sub-Pages Complete Suite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Skills &amp; Technologies Management Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Zero hardcoded content. Manage your headline narrative, coding stacks, developer tools, core technical pillars, active AI research, multi-year engineering roadmap, and futuristic cyberpunk theme.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/skills"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081228] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)]"
              >
                <Eye className="w-4 h-4" />
                <span>View Live /skills</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => handleSaveAll("All Skills Settings")}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save All Skills"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {skillsSections.map((sec) => {
            const Icon = sec.icon;

            return (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all duration-200 shadow-md flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-105 group-hover:bg-[#00d2ff]/20 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-[#00d2ff] uppercase">
                          SUB-PAGE #{sec.number}
                        </span>
                        <div className="text-[11px] font-bold text-slate-400 font-mono">
                          {sec.countText}
                        </div>
                      </div>
                    </div>

                    {sec.visible ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>LIVE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300">
                        <span>HIDDEN</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-base font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                      {sec.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#00d2ff]/80">{sec.subtitle}</p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  {sec.anchor ? (
                    <Link
                      href={`/skills${sec.anchor}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-[#00d2ff] transition-colors"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">Global Settings</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveSubPage(sec.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] cursor-pointer"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 02: 01. SKILLS HERO & ARCHITECTURE SHOWCASE
  // =========================================================================
  if (activeSubPage === "hero") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "01",
          "Skills Hero & Architecture Showcase",
          "Manage headline title, dual highlight words, introductory narrative, domain badges, quick metric bars, and signature 3D hexagon cards.",
          "#hero",
          () => handleSaveAll("Skills Hero")
        )}

        {/* Live Preview Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#060c1c] via-[#08122c] to-[#060c1c] border border-[#00d2ff]/30 shadow-[0_0_30px_rgba(0,210,255,0.1)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="text-xs font-mono font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Real-Time Hero Card Preview</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">Desktop & Mobile Responsive</span>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold uppercase">
              <Sparkles className="w-3 h-3 text-[#00d2ff]" />
              <span>{heroForm.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              <span>{heroForm.title} </span>
              <span className="text-[#00f0ff]">{heroForm.titleHighlight1} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899]">
                {heroForm.titleHighlight2}
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {heroForm.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {heroForm.tags?.map((t: any, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#0a1224] border border-[#00d2ff]/25 text-slate-200 text-xs font-semibold"
                >
                  • {t.text || t.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Text Fields */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Sparkles className="w-4 h-4" />
            <span>Headline & Narrative Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Top Badge Label
              </label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                placeholder="e.g. PROFESSIONAL SKILLS // TECHNICAL ARCHITECTURE"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Headline Lead Prefix
              </label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
                placeholder="e.g. Technical Level &"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#00f0ff] mb-1.5">
                Highlight Word 1 (Cyber Neon Blue)
              </label>
              <input
                type="text"
                value={heroForm.titleHighlight1}
                onChange={(e) => setHeroForm({ ...heroForm, titleHighlight1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-[#00f0ff] text-sm font-bold focus:border-[#00d2ff] outline-none"
                placeholder="e.g. Programming"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#c084fc] mb-1.5">
                Highlight Word 2 (Purple Gradient)
              </label>
              <input
                type="text"
                value={heroForm.titleHighlight2}
                onChange={(e) => setHeroForm({ ...heroForm, titleHighlight2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-[#c084fc] text-sm font-bold focus:border-[#00d2ff] outline-none"
                placeholder="e.g. Expertise"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Hero Introduction Description
            </label>
            <textarea
              rows={3}
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Core Domain Badges / Chips */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
              <Layers className="w-4 h-4" />
              <span>Core Domain Badges / Chips ({heroForm.tags?.length || 0})</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                const nextTags = [...(heroForm.tags || []), { text: "New Domain Badge" }];
                setHeroForm({ ...heroForm, tags: nextTags });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all border border-[#00d2ff]/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {heroForm.tags?.map((tag: any, tIdx) => (
              <div
                key={tIdx}
                className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
              >
                <input
                  type="text"
                  value={tag.text || tag.name || ""}
                  onChange={(e) => {
                    const nextTags = [...(heroForm.tags || [])];
                    nextTags[tIdx] = { ...nextTags[tIdx], text: e.target.value, name: e.target.value };
                    setHeroForm({ ...heroForm, tags: nextTags });
                  }}
                  className="w-full px-2 py-1 rounded bg-transparent text-white text-xs font-semibold focus:border-[#00d2ff] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextTags = (heroForm.tags || []).filter((_, i) => i !== tIdx);
                    setHeroForm({ ...heroForm, tags: nextTags });
                  }}
                  className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Metrics (3 Stat Cards) */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Award className="w-4 h-4" />
            <span>3 Quick Hero Metrics (Deployments, Proficiency, Technologies)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heroForm.stats?.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00d2ff] font-bold">
                    METRIC #{sIdx + 1}
                  </span>
                  <select
                    value={stat.icon || "Code2"}
                    onChange={(e) => {
                      const nextStats = [...(heroForm.stats || [])];
                      nextStats[sIdx].icon = e.target.value;
                      setHeroForm({ ...heroForm, stats: nextStats });
                    }}
                    className="px-2 py-1 rounded bg-[#0a1224] border border-white/10 text-[11px] text-cyan-300 font-mono outline-none"
                  >
                    <option value="Code2">Code2</option>
                    <option value="Cpu">Cpu</option>
                    <option value="Database">Database</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Terminal">Terminal</option>
                    <option value="Layers">Layers</option>
                    <option value="Zap">Zap</option>
                    <option value="Award">Award</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Value / Number
                  </label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => {
                      const nextStats = [...(heroForm.stats || [])];
                      nextStats[sIdx].number = e.target.value;
                      setHeroForm({ ...heroForm, stats: nextStats });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-black text-sm outline-none focus:border-[#00d2ff]"
                    placeholder="e.g. 15+"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const nextStats = [...(heroForm.stats || [])];
                      nextStats[sIdx].label = e.target.value;
                      setHeroForm({ ...heroForm, stats: nextStats });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-300 text-xs outline-none focus:border-[#00d2ff]"
                    placeholder="e.g. Core Technologies"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Hexagon Visual Cards */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
              <Cpu className="w-4 h-4" />
              <span>Signature 3D Floating Hexagon Cards (Left, Center Flagship, Right)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Universal Image Manager Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {heroForm.visualCards?.map((card, cIdx) => (
              <div
                key={cIdx}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3.5 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00d2ff]">
                    {cIdx === 1 ? "HEXAGON 02 (FLAGSHIP CENTER)" : `HEXAGON 0${cIdx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {cIdx === 1 ? "Enlarged Glow" : "Orbiting"}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Technology Name
                  </label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => {
                      const nextCards = [...(heroForm.visualCards || [])];
                      nextCards[cIdx].name = e.target.value;
                      setHeroForm({ ...heroForm, visualCards: nextCards });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-sm outline-none focus:border-[#00d2ff]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">
                      Mastery Percentage
                    </label>
                    <span className="text-xs font-mono font-bold text-[#00d2ff]">
                      {card.level}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={card.level}
                    onChange={(e) => {
                      const nextCards = [...(heroForm.visualCards || [])];
                      nextCards[cIdx].level = parseInt(e.target.value);
                      setHeroForm({ ...heroForm, visualCards: nextCards });
                    }}
                    className="w-full accent-[#00d2ff] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Brand Logo Fallback Name
                  </label>
                  <input
                    type="text"
                    value={card.logoName || ""}
                    onChange={(e) => {
                      const nextCards = [...(heroForm.visualCards || [])];
                      nextCards[cIdx].logoName = e.target.value;
                      setHeroForm({ ...heroForm, visualCards: nextCards });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-300 font-mono text-xs outline-none focus:border-[#00d2ff]"
                    placeholder="e.g. Laravel, WordPress, React"
                  />
                </div>

                {/* Universal Image Manager for Custom Upload */}
                <UniversalImageManager
                  label="Custom Hexagon Icon / Logo"
                  imageUrl={card.imageUrl || ""}
                  fallbackUrl="/assets/profile-1-scaled.png"
                  alt={card.name || "Hexagon Logo"}
                  aspectRatio="square"
                  onImageChange={(url) => {
                    const nextCards = [...(heroForm.visualCards || [])];
                    nextCards[cIdx].imageUrl = url;
                    setHeroForm({ ...heroForm, visualCards: nextCards });
                  }}
                  onImageRemove={() => {
                    const nextCards = [...(heroForm.visualCards || [])];
                    nextCards[cIdx].imageUrl = "";
                    setHeroForm({ ...heroForm, visualCards: nextCards });
                  }}
                  openMediaPicker={openMediaPicker}
                  showToast={showToast}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 03: 02. CODING & PROGRAMMING STACKS
  // =========================================================================
  if (activeSubPage === "coding") {
    const codingCategory = skillCategories[safeCodingIndex] || {
      category: "Coding & Programming Languages",
      skills: [],
    };
    const skillsList = codingCategory.skills || [];

    const updateCodingSkills = (newSkills: SkillItem[]) => {
      const nextCategories = [...skillCategories];
      nextCategories[safeCodingIndex] = {
        ...nextCategories[safeCodingIndex],
        skills: newSkills,
      };
      setSkillCategories(nextCategories);
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "02",
          "Coding & Programming Stacks",
          "Manage programming languages, backend runtimes, percentage mastery sliders, and custom proficiency labels.",
          "#coding",
          () => handleSaveAll("Coding Stacks")
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Terminal className="w-4 h-4" />
            <span>Coding Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Discipline Badge
              </label>
              <input
                type="text"
                value={codingHeader.badge}
                onChange={(e) => setCodingHeader({ ...codingHeader, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={codingHeader.title}
                onChange={(e) => setCodingHeader({ ...codingHeader, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Section Description
            </label>
            <input
              type="text"
              value={codingHeader.description || ""}
              onChange={(e) => setCodingHeader({ ...codingHeader, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 font-mono">
              TOTAL CODING SKILLS: <span className="text-[#00d2ff] font-bold">{skillsList.length}</span>
            </p>

            <button
              type="button"
              onClick={() => {
                const newSkill: SkillItem = {
                  id: `skill-${Date.now()}`,
                  name: "New Language",
                  level: 85,
                  proficiencyLabel: "Advanced",
                  enabled: true,
                };
                updateCodingSkills([...skillsList, newSkill]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all border border-[#00d2ff]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Programming Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsList.map((skill, sIdx) => (
              <div
                key={skill.id || sIdx}
                className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#00d2ff] font-bold">
                      SKILL #{sIdx + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Move Up"
                        disabled={sIdx === 0}
                        onClick={() => {
                          const next = [...skillsList];
                          const temp = next[sIdx - 1];
                          next[sIdx - 1] = next[sIdx];
                          next[sIdx] = temp;
                          updateCodingSkills(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Move Down"
                        disabled={sIdx === skillsList.length - 1}
                        onClick={() => {
                          const next = [...skillsList];
                          const temp = next[sIdx + 1];
                          next[sIdx + 1] = next[sIdx];
                          next[sIdx] = temp;
                          updateCodingSkills(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Duplicate"
                        onClick={() => {
                          const duplicateItem: SkillItem = {
                            ...skill,
                            id: `skill-${Date.now()}`,
                            name: `${skill.name} (Copy)`,
                          };
                          const next = [...skillsList];
                          next.splice(sIdx + 1, 0, duplicateItem);
                          updateCodingSkills(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete "${skill.name}"?`)) {
                            updateCodingSkills(skillsList.filter((_, i) => i !== sIdx));
                          }
                        }}
                        className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const next = [...skillsList];
                        next[sIdx].name = e.target.value;
                        updateCodingSkills(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-sm outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">
                        Mastery Percentage
                      </label>
                      <span className="text-xs font-mono font-bold text-[#00d2ff]">
                        {skill.level}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={skill.level}
                      onChange={(e) => {
                        const next = [...skillsList];
                        next[sIdx].level = parseInt(e.target.value);
                        updateCodingSkills(next);
                      }}
                      className="w-full accent-[#00d2ff] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Proficiency Label Override
                    </label>
                    <input
                      type="text"
                      value={skill.proficiencyLabel || ""}
                      onChange={(e) => {
                        const next = [...skillsList];
                        next[sIdx].proficiencyLabel = e.target.value;
                        updateCodingSkills(next);
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-cyan-300 font-mono text-xs outline-none focus:border-[#00d2ff]"
                      placeholder="e.g. Expert / Advanced / Proficient"
                    />
                  </div>

                  <UniversalImageManager
                    label="Custom Skill Icon / Logo"
                    imageUrl={skill.imageUrl || ""}
                    fallbackUrl="/assets/profile-1-scaled.png"
                    alt={skill.name || "Skill Icon"}
                    aspectRatio="square"
                    onImageChange={(url) => {
                      const next = [...skillsList];
                      next[sIdx].imageUrl = url;
                      updateCodingSkills(next);
                    }}
                    onImageRemove={() => {
                      const next = [...skillsList];
                      next[sIdx].imageUrl = "";
                      updateCodingSkills(next);
                    }}
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                  />
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">Visibility:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...skillsList];
                      next[sIdx].enabled = skill.enabled === false ? true : false;
                      updateCodingSkills(next);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      skill.enabled !== false
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {skill.enabled !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 04: 03. TOOLS & TECHNOLOGIES STACKS
  // =========================================================================
  if (activeSubPage === "tools") {
    const toolsCategory = skillCategories[safeToolsIndex] || {
      category: "Tools & Technologies",
      skills: [],
    };
    const toolsList = toolsCategory.skills || [];

    const updateToolsSkills = (newSkills: SkillItem[]) => {
      const nextCategories = [...skillCategories];
      nextCategories[safeToolsIndex] = {
        ...nextCategories[safeToolsIndex],
        skills: newSkills,
      };
      setSkillCategories(nextCategories);
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "03",
          "Tools & Technologies Stacks",
          "Manage developer software, CMS platforms, build utilities, database systems, and interactive mastery sliders.",
          "#tools",
          () => handleSaveAll("Tools & Technologies")
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Wrench className="w-4 h-4" />
            <span>Tools Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Discipline Badge
              </label>
              <input
                type="text"
                value={toolsHeader.badge}
                onChange={(e) => setToolsHeader({ ...toolsHeader, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={toolsHeader.title}
                onChange={(e) => setToolsHeader({ ...toolsHeader, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Section Description
            </label>
            <input
              type="text"
              value={toolsHeader.description || ""}
              onChange={(e) => setToolsHeader({ ...toolsHeader, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 font-mono">
              TOTAL TOOLS: <span className="text-[#00d2ff] font-bold">{toolsList.length}</span>
            </p>

            <button
              type="button"
              onClick={() => {
                const newTool: SkillItem = {
                  id: `tool-${Date.now()}`,
                  name: "New Tool",
                  level: 90,
                  proficiencyLabel: "Expert",
                  enabled: true,
                };
                updateToolsSkills([...toolsList, newTool]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all border border-[#00d2ff]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tool Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolsList.map((tool, tIdx) => (
              <div
                key={tool.id || tIdx}
                className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#00d2ff] font-bold">
                      TOOL #{tIdx + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Move Up"
                        disabled={tIdx === 0}
                        onClick={() => {
                          const next = [...toolsList];
                          const temp = next[tIdx - 1];
                          next[tIdx - 1] = next[tIdx];
                          next[tIdx] = temp;
                          updateToolsSkills(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Move Down"
                        disabled={tIdx === toolsList.length - 1}
                        onClick={() => {
                          const next = [...toolsList];
                          const temp = next[tIdx + 1];
                          next[tIdx + 1] = next[tIdx];
                          next[tIdx] = temp;
                          updateToolsSkills(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Duplicate"
                        onClick={() => {
                          const duplicateItem: SkillItem = {
                            ...tool,
                            id: `tool-${Date.now()}`,
                            name: `${tool.name} (Copy)`,
                          };
                          const next = [...toolsList];
                          next.splice(tIdx + 1, 0, duplicateItem);
                          updateToolsSkills(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete "${tool.name}"?`)) {
                            updateToolsSkills(toolsList.filter((_, i) => i !== tIdx));
                          }
                        }}
                        className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Tool / Technology Name
                    </label>
                    <input
                      type="text"
                      value={tool.name}
                      onChange={(e) => {
                        const next = [...toolsList];
                        next[tIdx].name = e.target.value;
                        updateToolsSkills(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-sm outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">
                        Mastery Percentage
                      </label>
                      <span className="text-xs font-mono font-bold text-[#00d2ff]">
                        {tool.level}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={tool.level}
                      onChange={(e) => {
                        const next = [...toolsList];
                        next[tIdx].level = parseInt(e.target.value);
                        updateToolsSkills(next);
                      }}
                      className="w-full accent-[#00d2ff] cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Proficiency Label Override
                    </label>
                    <input
                      type="text"
                      value={tool.proficiencyLabel || ""}
                      onChange={(e) => {
                        const next = [...toolsList];
                        next[tIdx].proficiencyLabel = e.target.value;
                        updateToolsSkills(next);
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-cyan-300 font-mono text-xs outline-none focus:border-[#00d2ff]"
                      placeholder="e.g. Expert / Advanced / Proficient"
                    />
                  </div>

                  <UniversalImageManager
                    label="Custom Tool Icon / Logo"
                    imageUrl={tool.imageUrl || ""}
                    fallbackUrl="/assets/profile-1-scaled.png"
                    alt={tool.name || "Tool Icon"}
                    aspectRatio="square"
                    onImageChange={(url) => {
                      const next = [...toolsList];
                      next[tIdx].imageUrl = url;
                      updateToolsSkills(next);
                    }}
                    onImageRemove={() => {
                      const next = [...toolsList];
                      next[tIdx].imageUrl = "";
                      updateToolsSkills(next);
                    }}
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                  />
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">Visibility:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...toolsList];
                      next[tIdx].enabled = tool.enabled === false ? true : false;
                      updateToolsSkills(next);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      tool.enabled !== false
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {tool.enabled !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 05: 04. CORE TECHNICAL PILLARS
  // =========================================================================
  if (activeSubPage === "strengths") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "04",
          "Core Technical Pillars",
          "Manage the 4 foundational engineering pillars highlighting enterprise architecture, CMS mastery, and reactive frontends.",
          "#expertise",
          () => handleSaveAll("Core Technical Pillars")
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Layers className="w-4 h-4" />
            <span>Pillars Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={coreHeader.badge}
                onChange={(e) => setCoreHeader({ ...coreHeader, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Title Lead
              </label>
              <input
                type="text"
                value={coreHeader.title}
                onChange={(e) => setCoreHeader({ ...coreHeader, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Highlight Text (Gradient)
              </label>
              <input
                type="text"
                value={coreHeader.highlightText}
                onChange={(e) => setCoreHeader({ ...coreHeader, highlightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Section Description
            </label>
            <input
              type="text"
              value={coreHeader.description}
              onChange={(e) => setCoreHeader({ ...coreHeader, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
        </div>

        {/* Pillars Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 font-mono">
              TOTAL PILLARS: <span className="text-[#00d2ff] font-bold">{coreExpertiseList.length}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                const newPillar: SkillsCoreExpertiseItem = {
                  id: `exp-${Date.now()}`,
                  number: `0${coreExpertiseList.length + 1}`,
                  title: "New Architectural Pillar",
                  badge: "CAPABILITY",
                  icon: "Layers",
                  highlights: ["Highlight 1", "Highlight 2", "Highlight 3"],
                  enabled: true,
                };
                setCoreExpertiseList([...coreExpertiseList, newPillar]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all border border-[#00d2ff]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pillar Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreExpertiseList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.number}
                        onChange={(e) => {
                          const next = [...coreExpertiseList];
                          next[idx].number = e.target.value;
                          setCoreExpertiseList(next);
                        }}
                        className="w-12 px-2 py-0.5 rounded bg-black/40 border border-white/10 text-xs font-mono font-bold text-[#00d2ff] text-center"
                        placeholder="01"
                      />
                      <input
                        type="text"
                        value={item.badge}
                        onChange={(e) => {
                          const next = [...coreExpertiseList];
                          next[idx].badge = e.target.value;
                          setCoreExpertiseList(next);
                        }}
                        className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300 focus:border-[#00d2ff] outline-none"
                        placeholder="BADGE"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...coreExpertiseList];
                          const temp = next[idx - 1];
                          next[idx - 1] = next[idx];
                          next[idx] = temp;
                          setCoreExpertiseList(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Move Down"
                        disabled={idx === coreExpertiseList.length - 1}
                        onClick={() => {
                          const next = [...coreExpertiseList];
                          const temp = next[idx + 1];
                          next[idx + 1] = next[idx];
                          next[idx] = temp;
                          setCoreExpertiseList(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Duplicate"
                        onClick={() => {
                          const duplicateItem: SkillsCoreExpertiseItem = {
                            ...item,
                            id: `exp-${Date.now()}`,
                            title: `${item.title} (Copy)`,
                          };
                          const next = [...coreExpertiseList];
                          next.splice(idx + 1, 0, duplicateItem);
                          setCoreExpertiseList(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete pillar "${item.title}"?`)) {
                            setCoreExpertiseList(coreExpertiseList.filter((_, i) => i !== idx));
                          }
                        }}
                        className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Pillar Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...coreExpertiseList];
                        next[idx].title = e.target.value;
                        setCoreExpertiseList(next);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Highlights / Key Competencies (comma-separated)
                    </label>
                    <textarea
                      rows={3}
                      value={(item.highlights || []).join(", ")}
                      onChange={(e) => {
                        const next = [...coreExpertiseList];
                        next[idx].highlights = e.target.value
                          .split(",")
                          .map((h) => h.trim())
                          .filter(Boolean);
                        setCoreExpertiseList(next);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <UniversalImageManager
                    label="Custom Pillar Vector / Icon"
                    imageUrl={item.imageUrl || ""}
                    fallbackUrl="/assets/profile-1-scaled.png"
                    alt={item.title}
                    aspectRatio="square"
                    onImageChange={(url) => {
                      const next = [...coreExpertiseList];
                      next[idx].imageUrl = url;
                      setCoreExpertiseList(next);
                    }}
                    onImageRemove={() => {
                      const next = [...coreExpertiseList];
                      next[idx].imageUrl = "";
                      setCoreExpertiseList(next);
                    }}
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                  />
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">Card Status:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...coreExpertiseList];
                      next[idx].enabled = item.enabled === false ? true : false;
                      setCoreExpertiseList(next);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      item.enabled !== false
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {item.enabled !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 06: 05. CONTINUOUS LEARNING & RESEARCH
  // =========================================================================
  if (activeSubPage === "learning") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "05",
          "Continuous Learning & Research",
          "Highlight emerging domains currently being explored (AI, Python for Data Science, Cloudflare, Power BI) without fake statistics.",
          "#continuous-growth",
          () => handleSaveAll("Continuous Learning")
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Brain className="w-4 h-4" />
            <span>Learning Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={learningHeader.badge}
                onChange={(e) => setLearningHeader({ ...learningHeader, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Title Lead
              </label>
              <input
                type="text"
                value={learningHeader.title}
                onChange={(e) => setLearningHeader({ ...learningHeader, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Highlight Word
              </label>
              <input
                type="text"
                value={learningHeader.highlightText}
                onChange={(e) => setLearningHeader({ ...learningHeader, highlightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Section Description
            </label>
            <input
              type="text"
              value={learningHeader.description}
              onChange={(e) => setLearningHeader({ ...learningHeader, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
        </div>

        {/* Learning Cards Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 font-mono">
              TOTAL STUDY TOPICS: <span className="text-[#00d2ff] font-bold">{learningList.length}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                const newTopic: SkillsLearningItem = {
                  id: `learn-${Date.now()}`,
                  title: "New Research Topic",
                  emoji: "🚀",
                  icon: "Zap",
                  description: "Exploring cutting-edge paradigms and practical integration.",
                  status: "Learning / Exploring",
                  tag: "INNOVATION",
                  footerLabel: "Active Learning",
                  enabled: true,
                };
                setLearningList([...learningList, newTopic]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all border border-[#00d2ff]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Topic Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.emoji || "💡"}
                      onChange={(e) => {
                        const next = [...learningList];
                        next[idx].emoji = e.target.value;
                        setLearningList(next);
                      }}
                      className="w-10 px-1 py-0.5 rounded text-center bg-black/40 border border-white/10 text-base"
                    />

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Move Left/Up"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...learningList];
                          const temp = next[idx - 1];
                          next[idx - 1] = next[idx];
                          next[idx] = temp;
                          setLearningList(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Move Right/Down"
                        disabled={idx === learningList.length - 1}
                        onClick={() => {
                          const next = [...learningList];
                          const temp = next[idx + 1];
                          next[idx + 1] = next[idx];
                          next[idx] = temp;
                          setLearningList(next);
                        }}
                        className="p-1 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete topic "${item.title}"?`)) {
                            setLearningList(learningList.filter((_, i) => i !== idx));
                          }
                        }}
                        className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Discipline Tag
                    </label>
                    <input
                      type="text"
                      value={item.tag}
                      onChange={(e) => {
                        const next = [...learningList];
                        next[idx].tag = e.target.value;
                        setLearningList(next);
                      }}
                      className="w-full px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-300 focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Topic Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...learningList];
                        next[idx].title = e.target.value;
                        setLearningList(next);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Study Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const next = [...learningList];
                        next[idx].description = e.target.value;
                        setLearningList(next);
                      }}
                      className="w-full px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Footer Phase Label
                    </label>
                    <input
                      type="text"
                      value={item.footerLabel || "Active Learning"}
                      onChange={(e) => {
                        const next = [...learningList];
                        next[idx].footerLabel = e.target.value;
                        setLearningList(next);
                      }}
                      className="w-full px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-purple-300 focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <UniversalImageManager
                    label="Custom Topic Icon / Image"
                    imageUrl={item.imageUrl || ""}
                    fallbackUrl="/assets/profile-1-scaled.png"
                    alt={item.title}
                    aspectRatio="square"
                    onImageChange={(url) => {
                      const next = [...learningList];
                      next[idx].imageUrl = url;
                      setLearningList(next);
                    }}
                    onImageRemove={() => {
                      const next = [...learningList];
                      next[idx].imageUrl = "";
                      setLearningList(next);
                    }}
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                  />
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">Card Status:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...learningList];
                      next[idx].enabled = item.enabled === false ? true : false;
                      setLearningList(next);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      item.enabled !== false
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {item.enabled !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 07: 06. ENGINEERING ROADMAP & MILESTONES
  // =========================================================================
  if (activeSubPage === "roadmap") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "06",
          "Engineering Roadmap & Milestones",
          "Outline past engineering foundations (2024), present full-stack focus (2025/2026), and future AI horizons.",
          "#growth-roadmap",
          () => handleSaveAll("Engineering Roadmap")
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Compass className="w-4 h-4" />
            <span>Roadmap Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Badge
              </label>
              <input
                type="text"
                value={roadmapHeader.badge}
                onChange={(e) => setRoadmapHeader({ ...roadmapHeader, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Title Lead
              </label>
              <input
                type="text"
                value={roadmapHeader.title}
                onChange={(e) => setRoadmapHeader({ ...roadmapHeader, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Highlight Word
              </label>
              <input
                type="text"
                value={roadmapHeader.highlightText}
                onChange={(e) => setRoadmapHeader({ ...roadmapHeader, highlightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Section Description
            </label>
            <input
              type="text"
              value={roadmapHeader.description}
              onChange={(e) => setRoadmapHeader({ ...roadmapHeader, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
        </div>

        {/* Roadmap Milestones Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400 font-mono">
              HORIZON MILESTONES: <span className="text-[#00d2ff] font-bold">{roadmapList.length}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                const newMilestone: SkillsRoadmapItem = {
                  id: `road-${Date.now()}`,
                  year: "2027",
                  title: "Next Technology Evolution",
                  badge: "PLANNED",
                  techList: ["WebAssembly", "Rust", "Edge AI"],
                  description: "Advancing into ultra-low-latency computing and edge intelligence.",
                  isCurrent: false,
                  isFuture: true,
                  enabled: true,
                };
                setRoadmapList([...roadmapList, newMilestone]);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050811] text-xs font-bold transition-all border border-[#00d2ff]/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Roadmap Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {roadmapList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const next = [...roadmapList];
                        next[idx].year = e.target.value;
                        setRoadmapList(next);
                      }}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-white text-xs font-mono font-bold focus:border-[#00d2ff] outline-none text-center"
                      placeholder="Year"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...roadmapList];
                        next[idx].title = e.target.value;
                        setRoadmapList(next);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
                      placeholder="Milestone Title"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.badge}
                      onChange={(e) => {
                        const next = [...roadmapList];
                        next[idx].badge = e.target.value;
                        setRoadmapList(next);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300 focus:border-[#00d2ff] outline-none"
                      placeholder="Badge"
                    />

                    <button
                      type="button"
                      title="Move Up"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...roadmapList];
                        const temp = next[idx - 1];
                        next[idx - 1] = next[idx];
                        next[idx] = temp;
                        setRoadmapList(next);
                      }}
                      className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Move Down"
                      disabled={idx === roadmapList.length - 1}
                      onClick={() => {
                        const next = [...roadmapList];
                        const temp = next[idx + 1];
                        next[idx + 1] = next[idx];
                        next[idx] = temp;
                        setRoadmapList(next);
                      }}
                      className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      onClick={() => {
                        if (confirm(`Delete milestone "${item.title}"?`)) {
                          setRoadmapList(roadmapList.filter((_, i) => i !== idx));
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...roadmapList];
                      next[idx].description = e.target.value;
                      setRoadmapList(next);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Technologies / Frameworks (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(item.techList || []).join(", ")}
                    onChange={(e) => {
                      const next = [...roadmapList];
                      next[idx].techList = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      setRoadmapList(next);
                    }}
                    className="w-full px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isCurrent || false}
                        onChange={(e) => {
                          const next = [...roadmapList];
                          next[idx].isCurrent = e.target.checked;
                          setRoadmapList(next);
                        }}
                        className="accent-[#00d2ff]"
                      />
                      <span>Current Focus (Neon Ping)</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isFuture || false}
                        onChange={(e) => {
                          const next = [...roadmapList];
                          next[idx].isFuture = e.target.checked;
                          setRoadmapList(next);
                        }}
                        className="accent-[#c084fc]"
                      />
                      <span>Future Horizon</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = [...roadmapList];
                      next[idx].enabled = item.enabled === false ? true : false;
                      setRoadmapList(next);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      item.enabled !== false
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {item.enabled !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 08: 07. SKILLS FOOTER & SHARED COMPONENTS
  // =========================================================================
  if (activeSubPage === "footer") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "07",
          "Skills Page Footer & Shared Components",
          "The website footer is a shared global component rendered across all pages. Manage quick contact credentials and tagline directly here.",
          "#footer",
          () => handleSaveAll("Footer & Shared Components")
        )}

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="p-4 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
              <span>Global Shared Component: Changes saved here sync live to all portfolio pages.</span>
            </span>
            <Link
              href="/admin?tab=footer"
              className="underline hover:text-white font-bold"
            >
              Open Full Footer CMS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={footerForm.phone}
                onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="text"
                value={footerForm.email}
                onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Brand Statement / Tagline
              </label>
              <input
                type="text"
                value={footerForm.brandTagline}
                onChange={(e) => setFooterForm({ ...footerForm, brandTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Copyright Notice
              </label>
              <input
                type="text"
                value={footerForm.copyrightText}
                onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 09: 08. SKILLS SEO & SOCIAL GRAPH
  // =========================================================================
  if (activeSubPage === "seo") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "08",
          "Skills Page SEO & Social Graph",
          "Search engine title, meta description, indexed keywords, canonical URL, and social preview card with Universal Image Manager.",
          "#seo",
          () => handleSaveAll("Skills SEO")
        )}

        {/* Live Search & Social Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Preview */}
          <div className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Google Search Snippet Preview
            </span>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">
                {seoForm.canonicalUrl || "https://tarekrahaman.me/skills"}
              </div>
              <div className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {seoForm.title}
              </div>
              <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {seoForm.description}
              </div>
            </div>
          </div>

          {/* Social Share Preview */}
          <div className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Social OpenGraph Share Card Preview
            </span>
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/5">
              <div className="h-28 bg-slate-900 overflow-hidden relative">
                {seoForm.ogImage ? (
                  <img
                    src={seoForm.ogImage}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                    No Social Image
                  </div>
                )}
              </div>
              <div className="p-3 space-y-1">
                <div className="text-[10px] font-mono text-[#00d2ff] uppercase">tarekrahaman.me</div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {seoForm.ogTitle || seoForm.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {seoForm.ogDescription || seoForm.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Form Inputs */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Browser / Meta Title
            </label>
            <input
              type="text"
              value={seoForm.title}
              onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#00d2ff] outline-none font-bold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase text-slate-300">
                Meta Description
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {seoForm.description?.length || 0} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={seoForm.description}
              onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Target Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seoForm.keywords || ""}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Canonical URL
              </label>
              <input
                type="text"
                value={seoForm.canonicalUrl || ""}
                onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-cyan-300 font-mono text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                OpenGraph Share Title
              </label>
              <input
                type="text"
                value={seoForm.ogTitle || ""}
                onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                OpenGraph Share Description
              </label>
              <input
                type="text"
                value={seoForm.ogDescription || ""}
                onChange={(e) => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          {/* OG Image with Universal Image Manager */}
          <UniversalImageManager
            label="Social Sharing Preview Image (OG Card)"
            imageUrl={seoForm.ogImage || ""}
            fallbackUrl="/assets/profile-1-scaled.png"
            alt="Skills SEO Image"
            aspectRatio="wide"
            onImageChange={(url) => setSeoForm({ ...seoForm, ogImage: url })}
            onImageRemove={() => setSeoForm({ ...seoForm, ogImage: "" })}
            openMediaPicker={openMediaPicker}
            showToast={showToast}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 10: 09. SECTION ORDERING, STYLING & FUTURISTIC THEME
  // =========================================================================
  if (activeSubPage === "theme") {
    const sectionNames: Record<string, string> = {
      hero: "01. Skills Hero & Architecture Showcase",
      coding: "02. Coding & Programming Stacks",
      tools: "03. Tools & Technologies Stacks",
      strengths: "04. Core Technical Pillars",
      learning: "05. Continuous Learning & Research",
      roadmap: "06. Engineering Roadmap & Milestones",
    };

    const currentOrder = designSettings.sectionOrder || [
      "hero",
      "coding",
      "tools",
      "strengths",
      "learning",
      "roadmap",
    ];

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "09",
          "Section Ordering, Styling & Futuristic Theme",
          "Customize the display order of skills sections, show or hide individual sections, and toggle atmospheric glow pools and RGB wave dividers.",
          "",
          () => handleSaveAll("Theme & Layout Settings")
        )}

        {/* Section Reordering Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
              <Layout className="w-4 h-4" />
              <span>Section Display Sequence (Reorder with Up / Down)</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                setDesignSettings({
                  ...designSettings,
                  sectionOrder: ["hero", "coding", "tools", "strengths", "learning", "roadmap"],
                });
                showToast("Reset section sequence to default.");
              }}
              className="text-xs font-mono text-slate-400 hover:text-[#00d2ff] underline"
            >
              Reset to Default Order
            </button>
          </div>

          <div className="space-y-2">
            {currentOrder.map((secKey, idx) => (
              <div
                key={secKey}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] font-mono text-xs font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {sectionNames[secKey] || secKey}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Move Up"
                    disabled={idx === 0}
                    onClick={() => {
                      const next = [...currentOrder];
                      const temp = next[idx - 1];
                      next[idx - 1] = next[idx];
                      next[idx] = temp;
                      setDesignSettings({ ...designSettings, sectionOrder: next });
                    }}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-25"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Move Down"
                    disabled={idx === currentOrder.length - 1}
                    onClick={() => {
                      const next = [...currentOrder];
                      const temp = next[idx + 1];
                      next[idx + 1] = next[idx];
                      next[idx] = temp;
                      setDesignSettings({ ...designSettings, sectionOrder: next });
                    }}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-25"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Eye className="w-4 h-4" />
            <span>Section Visibility Switches</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(sectionNames).map(([key, name]) => {
              const isSecVisible = (designSettings.sectionVisibility as Record<string, boolean | undefined>)?.[key] !== false;

              return (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1">{name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentVis = designSettings.sectionVisibility || {};
                      setDesignSettings({
                        ...designSettings,
                        sectionVisibility: {
                          ...currentVis,
                          [key]: !isSecVisible,
                        },
                      });
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      isSecVisible
                        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {isSecVisible ? "Visible" : "Hidden"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Futuristic Aesthetic Toggles */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#00d2ff]">
            <Sparkles className="w-4 h-4" />
            <span>Futuristic Aesthetic &amp; Ambient FX</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">3D Ambient Glow Pools</span>
                <span className="text-[11px] text-slate-400">
                  Render soft atmospheric cyan and purple radial glows behind sections
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDesignSettings({
                    ...designSettings,
                    showAmbientGlow: !designSettings.showAmbientGlow,
                  })
                }
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                  designSettings.showAmbientGlow !== false
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {designSettings.showAmbientGlow !== false ? "Active" : "Off"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Seamless Wave Dividers</span>
                <span className="text-[11px] text-slate-400">
                  Display glowing animated multi-colored SVG wave separators between disciplines
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDesignSettings({
                    ...designSettings,
                    showWaveDividers: !designSettings.showWaveDividers,
                  })
                }
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                  designSettings.showWaveDividers !== false
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {designSettings.showWaveDividers !== false ? "Active" : "Off"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
