"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Lock,
  Globe,
  Code2,
  Layers,
  CheckCircle2,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  User,
  Zap,
  Award,
  FolderKanban,
  Star,
  Flame,
  Terminal,
} from "lucide-react";
import WaveDivider from "@/components/ui/WaveDivider";
import { projectsData } from "@/data/portfolioData";
import { cinematicEase } from "@/lib/animations";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { ProjectCategory, ProjectItem, ProjectCategoryItem } from "@/types/portfolio";
import { normalizeImageUrl } from "@/lib/image-utils";

function getDynamicIcon(iconName?: string) {
  switch (iconName) {
    case "Globe":
      return Globe;
    case "Layers":
      return Layers;
    case "CheckCircle2":
      return CheckCircle2;
    case "Code2":
      return Code2;
    case "Sparkles":
      return Sparkles;
    case "ShoppingBag":
      return ShoppingBag;
    case "Briefcase":
      return Briefcase;
    case "GraduationCap":
      return GraduationCap;
    case "User":
      return User;
    case "Zap":
      return Zap;
    case "Award":
      return Award;
    case "FolderKanban":
      return FolderKanban;
    case "Star":
      return Star;
    case "Flame":
      return Flame;
    case "Terminal":
      return Terminal;
    default:
      return Globe;
  }
}

export default function PortfolioContent() {
  const { cmsData } = useCms();
  const { t, tCms, tCategory, tStatLabel, language } = useLanguage();
  const portSettings = cmsData?.portfolioPageSettings;

  // Categories list with fallback
  const rawCategories = cmsData?.projectCategories?.length
    ? cmsData.projectCategories
    : [
        { label: "ALL WEBSITES", value: "all" },
        { label: "E-COMMERCE", value: "ecommerce" },
        { label: "BUSINESS & AGENCY", value: "business" },
        { label: "EDUCATION", value: "education" },
        { label: "PERSONAL PORTFOLIO", value: "portfolio" },
      ];

  const categoriesList = rawCategories.filter((c: any) => c.enabled !== false);

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const initialCount = portSettings?.initialProjectsCount || 9;
  const perPageCount = portSettings?.projectsPerPage || 6;
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // All projects from CMS or fallback
  const rawProjects = cmsData.projects?.length ? cmsData.projects : projectsData;
  const allProjects = useMemo(() => {
    return rawProjects
      .filter((p: any) => p.enabled !== false && p.active !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  }, [rawProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project: ProjectItem) => {
      const matchesCategory =
        activeFilter === "all" ||
        project.category?.toLowerCase() === activeFilter.toLowerCase() ||
        project.categoryName?.toLowerCase() === activeFilter.toLowerCase();

      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return matchesCategory;

      const matchesSearch =
        project.title?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.categoryName?.toLowerCase().includes(searchLower) ||
        project.clientName?.toLowerCase().includes(searchLower) ||
        (Array.isArray(project.technologies) &&
          project.technologies.some((t) => t.toLowerCase().includes(searchLower)));

      return matchesCategory && matchesSearch;
    });
  }, [allProjects, activeFilter, searchQuery]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredProjects.length - visibleCount);
  const hasMoreProjects =
    portSettings?.loadMoreEnabled !== false && visibleCount < filteredProjects.length;

  const handleFilterChange = (catVal: string) => {
    setActiveFilter(catVal);
    setVisibleCount(initialCount);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(initialCount);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + perPageCount);
  };

  // Hero Tags fallback
  const heroTags = portSettings?.heroTags?.length
    ? portSettings.heroTags.filter((t) => t.enabled !== false)
    : [
        { text: "WordPress Core" },
        { text: "WooCommerce" },
        { text: "Laravel Systems" },
        { text: "Next.js" },
        { text: "Full-Stack" },
      ];

  // Hero Stats fallback
  const heroStats = portSettings?.heroStats?.length
    ? portSettings.heroStats.filter((s) => s.enabled !== false)
    : [
        { number: `${allProjects.length}+`, label: "Live Websites", icon: "Globe" },
        { number: "4+", label: "Core Industries", icon: "Layers" },
        { number: "100%", label: "Responsive & Fast", icon: "CheckCircle2" },
      ];

  // Featured Project Showcase details
  const featured = portSettings?.heroFeatured;
  const flagshipProject = allProjects[0];
  const featuredTitle = featured?.title || flagshipProject?.title || "Featured Production Project";
  const featuredCategory =
    featured?.category || flagshipProject?.categoryName || flagshipProject?.category?.toUpperCase() || "E-COMMERCE";
  const featuredLiveUrl = featured?.liveUrl || flagshipProject?.liveUrl || "https://tereasnusuae.ae/";
  const featuredImage =
    featured?.image ||
    flagshipProject?.image ||
    "/assets/Screenshot-2026-09-04-024440.png";
  const featuredAlt = featured?.imageAlt || featuredTitle;
  const featuredLockText =
    featured?.lockText ||
    (featuredLiveUrl
      ? featuredLiveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : "live-production-site.com");

  // Format Load More button text
  const loadMoreBtnText = useMemo(() => {
    const baseText = portSettings?.loadMoreButtonText ? tCms(portSettings.loadMoreButtonText, "projects.loadMore") : t("projects.loadMore");
    const template = portSettings?.loadMoreRemainingTemplate ? tCms(portSettings.loadMoreRemainingTemplate, "projects.remainingTemplate") : t("projects.remainingTemplate");
    const remainingStr = template.replace("{remaining}", remainingCount.toString());
    return `${baseText.toUpperCase()} ${remainingStr}`;
  }, [portSettings?.loadMoreButtonText, portSettings?.loadMoreRemainingTemplate, remainingCount, t, tCms]);

  const BadgeIcon = getDynamicIcon(portSettings?.heroBadgeIcon || "Sparkles");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO / BANNER INSPIRED BY HOME PORTFOLIO    */}
      {/* ======================================================== */}
      {portSettings?.showHero !== false && (
        <div
          id="hero"
          className="relative mb-12 sm:mb-16 select-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#040a20] via-[#05102a] to-[#040a20] border border-[#00d2ff]/25 p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(0,210,255,0.12)]"
        >
          {/* Atmospheric Ambient Glow Lighting */}
          {portSettings?.showAmbientGlow !== false && (
            <>
              <div className="absolute top-1/4 -left-20 w-[500px] h-[450px] bg-gradient-to-r from-[#0077b6]/20 via-[#00d2ff]/12 to-transparent rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute top-1/4 -right-20 w-[550px] h-[480px] bg-gradient-to-l from-[#0055bb]/20 via-[#0088dd]/12 to-transparent rounded-full blur-[140px] pointer-events-none" />
            </>
          )}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Description & Stats */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a1224]/90 backdrop-blur-md border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)]">
                <BadgeIcon className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#00f0ff] uppercase">
                  {tCms(portSettings?.heroBadge, "projects.archiveBadge")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.14]">
                {language === "bn" ? (
                  <span>
                    বাছাইকৃত{" "}
                    <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                      পোর্টফোলিও
                    </span>
                  </span>
                ) : portSettings?.heroHeading ? (
                  <span>
                    {portSettings.heroHeading}{" "}
                    {portSettings.heroHeadingHighlight1 && (
                      <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                        {portSettings.heroHeadingHighlight1}{" "}
                      </span>
                    )}
                    {portSettings.heroHeadingLineBreak && <br />}
                    {portSettings.heroHeadingHighlight2 && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_20px_rgba(168,85,247,0.45)]">
                        {portSettings.heroHeadingHighlight2}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>Crafted with Precision &amp; Purpose</span>
                )}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {tCms(
                  portSettings?.heroDescription,
                  "projects.description"
                )}
              </p>

              {/* Core Tech Stack Badges */}
              {heroTags && heroTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {heroTags.map((tag: any, idx: number) => {
                    const TagIcon = tag.icon ? getDynamicIcon(tag.icon) : null;
                    return (
                      <span
                        key={tag.text || tag.id || idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a1224]/85 border border-[#00d2ff]/25 text-slate-200 text-xs font-semibold tracking-wide shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                      >
                        {TagIcon ? (
                          <TagIcon className="w-3 h-3 text-[#00d2ff]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                        )}
                        <span>{tag.text}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Live Milestone Stats Row */}
              {heroStats && heroStats.length > 0 && (
                <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-2 border-t border-white/[0.08] w-full">
                  {heroStats.map((stat: any, sIdx: number) => {
                    const StatIconComponent = getDynamicIcon(stat.icon);
                    const colorClass =
                      sIdx === 0
                        ? "text-[#00f0ff] bg-[#00d2ff]/10 border-[#00d2ff]/40 shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                        : sIdx === 1
                        ? "text-[#c084fc] bg-[#a855f7]/12 border-[#a855f7]/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]";

                    return (
                      <div key={stat.id || sIdx} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${colorClass}`}
                        >
                          <StatIconComponent className="w-5 h-5" />
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

            {/* Right Column: Signature 3D Browser Showcase Mockup */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-[480px] rounded-2xl bg-[#030712] border border-[#00d2ff]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,210,255,0.25)] overflow-hidden group/browser transition-transform duration-500 hover:scale-[1.02]">
                {/* Browser Window Bar */}
                <div className="px-4 py-3 bg-[#060e22] border-b border-[#00d2ff]/20 flex items-center gap-3">
                  {/* Window Control Dots */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Address Bar */}
                  <div className="flex-1 px-3 py-1 rounded-full bg-[#030612] border border-white/10 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Lock className="w-3 h-3 text-[#00f0ff]" />
                    <span className="truncate text-slate-300">{featuredLockText}</span>
                  </div>

                  {featuredLiveUrl && (
                    <a
                      href={featuredLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-[#00f0ff] transition-colors"
                      aria-label="Open live site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Browser Viewport with Flagship Screenshot */}
                <div className="relative aspect-[16/10] bg-[#02050e] overflow-hidden">
                  <img
                    src={normalizeImageUrl(featuredImage)}
                    alt={featuredAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover/browser:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />

                  {/* Overlay Tag at Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#060e22]/90 backdrop-blur-md border border-[#00d2ff]/30 flex items-center justify-between">
                    <div className="truncate mr-2">
                      <span className="text-[10px] font-mono font-bold text-[#00f0ff] uppercase">
                        {featured?.badge || "FEATURED SPOTLIGHT"}
                      </span>
                      <h4 className="text-xs font-black text-white truncate">{featuredTitle}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded-full bg-white/10 shrink-0">
                      {featuredCategory}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transition Wave into Search & Grid */}
      {portSettings?.showWaveDividers !== false && (
        <WaveDivider variant={4} inverted className="my-2 sm:my-4" />
      )}

      {/* Search & Filter Bar */}
      {(portSettings?.showSearch !== false || portSettings?.showFilters !== false) && (
        <div id="filters" className="mb-10 sm:mb-12 space-y-6">
          {/* Search Input */}
          {portSettings?.showSearch !== false && (
            <div className="max-w-md mx-auto relative">
              <Search className="w-5 h-5 text-[#00d2ff] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={tCms(
                  portSettings?.searchPlaceholder,
                  "projects.searchPlaceholder"
                )}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-[#090f1e]/90 border border-[#00d2ff]/30 focus:border-[#00d2ff] focus:outline-none text-sm text-white placeholder-slate-500 shadow-[0_0_15px_rgba(0,210,255,0.1)] transition-all"
              />
            </div>
          )}

          {/* Category Filter Pills */}
          {portSettings?.showFilters !== false && categoriesList.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {categoriesList.map((cat: any) => {
                const isActive = activeFilter.toLowerCase() === cat.value.toLowerCase();
                const CatIcon = cat.icon ? getDynamicIcon(cat.icon) : null;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleFilterChange(cat.value)}
                    className={`inline-flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 select-none cursor-pointer ${
                      isActive
                        ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.7)] scale-105 font-black"
                        : "bg-[#090f1e] text-slate-300 hover:text-white border border-[#00d2ff]/20 hover:border-[#00d2ff]/50"
                    }`}
                  >
                    {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
                    <span>{tCategory(cat.label)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Project Grid */}
      {portSettings?.showProjectGrid !== false && (
        <div id="projects">
          <h2 className="sr-only">Featured Web Projects &amp; Case Studies</h2>
          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="text-lg">{t("projects.noProjects")}</p>
              <button
                onClick={() => {
                  handleFilterChange("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#050811] bg-[#00d2ff] cursor-pointer"
              >
                {t("projects.resetFilters")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
                {displayedProjects.map((project: ProjectItem, idx: number) => {
                  const targetUrl = project.liveUrl || project.demoUrl || project.caseStudyUrl || "#";
                  const buttonLabel = tCms(project.buttonText, "projects.viewWebsite");

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      whileHover={{ y: -5 }}
                      transition={{
                        duration: 0.55,
                        delay: (idx % 3) * 0.08,
                        ease: cinematicEase,
                      }}
                      className="group relative rounded-2xl overflow-hidden bg-[#090f1e]/85 hover:bg-[#0c1429] border border-[#00d2ff]/20 hover:border-[#00d2ff]/60 backdrop-blur-xl transition-colors duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_35px_rgba(0,180,255,0.22)] h-full select-none"
                    >
                      {/* Screenshot */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#070b14]">
                        <Image
                          src={normalizeImageUrl(project.image)}
                          alt={project.imageAlt || project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090f1e] via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-[#00d2ff] bg-[#050811]/85 backdrop-blur-md border border-[#00d2ff]/30 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                            {tCategory(project.badgeText || project.categoryName || project.category || "")}
                          </span>
                          {project.featured && (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-500/40">
                              ★ Spotlight
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#00d2ff] transition-colors line-clamp-1 mb-1.5">
                            {project.title}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-4">
                            {project.description}
                          </p>

                          {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.technologies.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.06]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Large Primary Action Button */}
                        <div className="mt-auto pt-3 border-t border-white/[0.08]">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00a8ff] to-[#0072ff] shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_25px_rgba(0,210,255,0.75)] hover:scale-[1.015] active:scale-[0.985] transition-all duration-300 select-none cursor-pointer"
                          >
                            <span>{buttonLabel}</span>
                            <ArrowRight className="w-4 h-4 text-[#050811] group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Dynamic Load More Button */}
              {hasMoreProjects && (
                <div id="load-more" className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#00d2ff] bg-[#090f1e] hover:bg-[#00d2ff] hover:text-[#050811] border border-[#00d2ff]/40 hover:border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.2)] hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 select-none cursor-pointer"
                  >
                    <span>{loadMoreBtnText}</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {portSettings?.showWaveDividers !== false && (
        <div className="mt-16">
          <WaveDivider variant={4} />
        </div>
      )}
    </div>
  );
}

