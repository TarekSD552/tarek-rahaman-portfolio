"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  ExternalLink,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  Eye,
  Star,
  StarOff,
  Globe,
  Code2,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Copy,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Tag,
  ChevronDown,
  Sliders,
  Settings,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  User,
  Zap,
  Award,
  Lock,
  ArrowRight,
  Flame,
  Check,
  X,
  ShieldCheck,
  HelpCircle,
  Info
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import {
  ProjectItem,
  ProjectCategoryItem,
  PortfolioPageSettings,
  PortfolioHeroTag,
  PortfolioHeroStat,
  PortfolioHeroFeatured
} from "@/types/portfolio";

interface AdminProjectsCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type ProjectsSectionKey =
  | "overview"
  | "hero"
  | "search-filters"
  | "projects"
  | "load-more"
  | "visibility-theme"
  | "seo";

export default function AdminProjectsCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminProjectsCmsProps) {
  const { cmsData, updateCms } = useCms();

  const [internalSubPage, setInternalSubPage] = useState<ProjectsSectionKey>("overview");
  const activeSubPage = (externalSubPage as ProjectsSectionKey) || internalSubPage;

  const setActiveSubPage = (page: ProjectsSectionKey) => {
    setInternalSubPage(page);
    if (externalSetSubPage) {
      externalSetSubPage(page);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // 1. Projects State
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(
    cmsData.projects && cmsData.projects.length > 0 ? cmsData.projects : []
  );

  // 2. Categories State
  const [categoriesList, setCategoriesList] = useState<ProjectCategoryItem[]>(
    cmsData.projectCategories && cmsData.projectCategories.length > 0
      ? cmsData.projectCategories
      : [
          { id: "cat-all", label: "ALL WEBSITES", value: "all", icon: "Globe", description: "Complete collection of live production websites", enabled: true, order: 1 },
          { id: "cat-ecom", label: "E-COMMERCE", value: "ecommerce", icon: "ShoppingBag", description: "WooCommerce & online retail stores", enabled: true, order: 2 },
          { id: "cat-biz", label: "BUSINESS & AGENCY", value: "business", icon: "Briefcase", description: "Corporate portals and commercial agency sites", enabled: true, order: 3 },
          { id: "cat-edu", label: "EDUCATION", value: "education", icon: "GraduationCap", description: "Language schools & LMS student portals", enabled: true, order: 4 },
          { id: "cat-port", label: "PERSONAL PORTFOLIO", value: "portfolio", icon: "User", description: "Personal branding and showcase platforms", enabled: true, order: 5 },
        ]
  );

  // 3. Hero & Page Settings State
  const defaultSettings: PortfolioPageSettings = {
    heroBadge: "PORTFOLIO ARCHIVE // PRODUCTION DEPLOYMENTS",
    heroBadgeIcon: "Sparkles",
    heroHeading: "Crafted with Precision & Purpose",
    heroHeadingHighlight1: "Precision & ",
    heroHeadingHighlight2: "Purpose",
    heroHeadingLineBreak: false,
    heroSubtitle: "Featured Case Studies",
    heroDescription:
      "Explore our complete archive of live commercial websites across high-converting e-commerce, corporate agency portals, educational LMS platforms, and bespoke web applications.",
    heroTags: [
      { id: "ht-1", text: "WordPress Core", icon: "Code2", enabled: true },
      { id: "ht-2", text: "WooCommerce", icon: "ShoppingBag", enabled: true },
      { id: "ht-3", text: "Laravel Systems", icon: "Layers", enabled: true },
      { id: "ht-4", text: "Next.js", icon: "Zap", enabled: true },
      { id: "ht-5", text: "Full-Stack", icon: "Globe", enabled: true },
    ],
    heroStats: [
      { id: "hs-1", number: "10+", label: "Live Websites", icon: "Globe", enabled: true },
      { id: "hs-2", number: "4+", label: "Core Industries", icon: "Layers", enabled: true },
      { id: "hs-3", number: "100%", label: "Responsive & Fast", icon: "CheckCircle2", enabled: true },
    ],
    heroFeatured: {
      title: "Featured Client Website",
      category: "Full-Stack E-Commerce",
      liveUrl: "https://dengofit.com",
      image: "/assets/profile-1-scaled.png",
      imageAlt: "Featured Client Project Showcase",
      imageCaption: "Production Website",
      badge: "LIVE DEMO",
      lockText: "https://dengofit.com",
      enabled: true,
    },
    searchPlaceholder: "Search projects by title, stack, or keywords...",
    searchIcon: "Search",
    searchEnabled: true,
    loadMoreButtonText: "LOAD MORE WEBSITES",
    loadMoreRemainingTemplate: "SHOW MORE ({remaining} REMAINING)",
    initialProjectsCount: 9,
    projectsPerPage: 6,
    loadMoreEnabled: true,
    showHero: true,
    showSearch: true,
    showFilters: true,
    showProjectGrid: true,
    showLoadMore: true,
    showWaveDividers: true,
    showAmbientGlow: true,
    accentColor: "#00d2ff",
    seo: {
      title: "Featured Projects & Client Portfolios | Tarek Rahaman",
      description: "Explore Tarek Rahaman's featured portfolio of high-impact web applications, client solutions, e-commerce platforms, and scalable digital architectures.",
      keywords: "Tarek Rahaman, Portfolio, Web Development, WordPress, Laravel, Next.js, E-commerce, Case Studies",
      canonicalUrl: "https://tarekrahaman.me/portfolio",
      ogTitle: "Featured Projects & Client Portfolios | Tarek Rahaman",
      ogDescription: "A curated collection of live commercial websites, e-commerce systems, and full-stack web platforms engineered by Tarek Rahaman.",
      ogImage: "/assets/profile-1-scaled.png",
    },
  };

  const [pageSettings, setPageSettings] = useState<PortfolioPageSettings>({
    ...defaultSettings,
    ...(cmsData.portfolioPageSettings || {}),
    heroTags: cmsData.portfolioPageSettings?.heroTags || defaultSettings.heroTags,
    heroStats: cmsData.portfolioPageSettings?.heroStats || defaultSettings.heroStats,
    heroFeatured: {
      ...defaultSettings.heroFeatured,
      ...(cmsData.portfolioPageSettings?.heroFeatured || {}),
    },
    seo: {
      ...defaultSettings.seo,
      ...(cmsData.portfolioPageSettings?.seo || {}),
    },
  });

  // Search & Filter in Admin Projects Tab
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>("all");

  // Modals
  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<ProjectItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<ProjectCategoryItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Tech tag input buffer inside project modal
  const [techTagInput, setTechTagInput] = useState("");

  // Filtered projects for the Admin Projects Database view
  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const matchesCat =
        adminCategoryFilter === "all" ||
        project.category?.toLowerCase() === adminCategoryFilter.toLowerCase() ||
        project.categoryName?.toLowerCase() === adminCategoryFilter.toLowerCase();
      const matchesSearch =
        project.title?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
        project.technologies?.some((t) => t.toLowerCase().includes(adminSearchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [projectsList, adminCategoryFilter, adminSearchQuery]);

  // Unified save handler
  const handleSaveAll = async (sectionName: string, customPayload?: any) => {
    setIsSaving(true);
    try {
      const updatedPages = (cmsData.pages || []).map((p) =>
        p.id === "portfolio" || p.slug === "portfolio"
          ? {
              ...p,
              title: pageSettings.heroHeading || p.title,
              seoTitle: pageSettings.seo?.title || pageSettings.seoTitle || p.seoTitle,
              seoDesc: pageSettings.seo?.description || pageSettings.seoDesc || p.seoDesc,
            }
          : p
      );

      const payload = {
        projects: projectsList,
        projectCategories: categoriesList,
        portfolioPageSettings: pageSettings,
        pages: updatedPages,
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

  // Section cards for Overview Hub
  const portfolioSections = [
    {
      id: "hero" as ProjectsSectionKey,
      number: "01",
      name: "Portfolio Hero & Showcase",
      desc: "Hero badge, dual-color heading, line breaks, live stats, tech tags, and 3D browser showcase mockup",
      icon: Sparkles,
      color: "from-cyan-500/20 to-blue-500/10",
      accent: "text-cyan-400",
    },
    {
      id: "search-filters" as ProjectsSectionKey,
      number: "02",
      name: "Search & Category Filters",
      desc: "Live search bar placeholder, dynamic category pills (E-commerce, Business, etc.), reordering, and visibility",
      icon: Search,
      color: "from-blue-500/20 to-indigo-500/10",
      accent: "text-blue-400",
    },
    {
      id: "projects" as ProjectsSectionKey,
      number: "03",
      name: "Projects Database (Full CRUD)",
      desc: "Add, edit, duplicate, delete projects with images, live URLs, custom button text, badges, and tech tags",
      icon: FolderKanban,
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-400",
    },
    {
      id: "load-more" as ProjectsSectionKey,
      number: "04",
      name: "Load More & Pagination",
      desc: "Initial visible count, per-click batch size, dynamic remaining items counter template {remaining}",
      icon: ChevronDown,
      color: "from-amber-500/20 to-orange-500/10",
      accent: "text-amber-400",
    },
    {
      id: "visibility-theme" as ProjectsSectionKey,
      number: "05",
      name: "Visibility & Theme Controls",
      desc: "Toggle hero, search, filters, project grid, wave dividers, ambient glow lighting, and accent colors",
      icon: Sliders,
      color: "from-purple-500/20 to-pink-500/10",
      accent: "text-purple-400",
    },
    {
      id: "seo" as ProjectsSectionKey,
      number: "06",
      name: "Page SEO & Open Graph",
      desc: "Meta title, meta description with character counter, keywords, canonical URL, OG share card & image",
      icon: Globe,
      color: "from-rose-500/20 to-pink-500/10",
      accent: "text-rose-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#060c1d] via-[#08132d] to-[#060c1d] border border-[#00d2ff]/20 shadow-[0_0_30px_rgba(0,210,255,0.06)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d2ff]">
            <Link href="/admin" className="hover:underline opacity-80">
              Admin
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span>Portfolio CMS</span>
            {activeSubPage !== "overview" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-white font-bold capitalize">
                  {portfolioSections.find((s) => s.id === activeSubPage)?.name || activeSubPage}
                </span>
              </>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[#00d2ff]" />
            Portfolio Page Management
          </h2>
          <p className="text-xs text-slate-400">
            100% dynamic control over every heading, badge, category filter, project card, image, and SEO on <span className="font-mono text-[#00d2ff]">/portfolio</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            href="/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#091124] hover:bg-[#0c1836] border border-[#00d2ff]/30 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Live Portfolio</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={() => handleSaveAll(portfolioSections.find((s) => s.id === activeSubPage)?.name || "Portfolio")}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00a8ff] to-[#0072ff] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveSubPage("overview")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubPage === "overview"
              ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)]"
              : "bg-[#070e24] text-slate-300 hover:text-white hover:bg-[#0b173b] border border-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Overview Hub</span>
        </button>

        {portfolioSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubPage === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSubPage(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                  : "bg-[#070e24] text-slate-300 hover:text-white hover:bg-[#0b173b] border border-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.number}. {sec.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 0. OVERVIEW HUB                                          */}
      {/* ======================================================== */}
      {activeSubPage === "overview" && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Projects</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">{projectsList.length}</div>
              <div className="mt-1 text-[11px] text-[#00d2ff] flex items-center gap-1">
                <span>{projectsList.filter((p) => p.featured).length} Featured</span>
                <span>•</span>
                <span>{projectsList.filter((p) => p.homeFeatured).length} on Home</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-blue-500/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Categories</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">{categoriesList.length}</div>
              <div className="mt-1 text-[11px] text-blue-400">
                {categoriesList.filter((c) => c.enabled !== false).length} Active Filters
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-purple-500/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Initial Load / Page</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">
                {pageSettings.initialProjectsCount || 9} / {pageSettings.projectsPerPage || 6}
              </div>
              <div className="mt-1 text-[11px] text-purple-400">
                {pageSettings.loadMoreEnabled !== false ? "Load More Active" : "All Shown"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-emerald-500/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">SEO Readiness</div>
              <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="mt-1 text-[11px] text-slate-400 truncate">
                {pageSettings.seo?.title ? "Optimized" : "Default"}
              </div>
            </div>
          </div>

          {/* Section Jump Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSubPage(sec.id)}
                  className="p-5 rounded-2xl bg-[#070e24] border border-white/10 hover:border-[#00d2ff]/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-[#00d2ff]">
                        {sec.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                        {sec.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
                    <span>Configure Section</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00d2ff] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. PORTFOLIO HERO SECTION CMS                            */}
      {/* ======================================================== */}
      {activeSubPage === "hero" && (
        <div className="space-y-6">
          {/* Hero Typography & Badge Card */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00d2ff]" />
                  Hero Typography &amp; Badges
                </h3>
                <p className="text-xs text-slate-400">
                  Manage the top badge, heading, dual highlight words, line breaks, and description.
                </p>
              </div>
              <button
                onClick={() => handleSaveAll("Portfolio Hero")}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                Save Hero
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Hero Top Badge Text
                </label>
                <input
                  type="text"
                  value={pageSettings.heroBadge || ""}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroBadge: e.target.value })}
                  placeholder="PORTFOLIO ARCHIVE // PRODUCTION DEPLOYMENTS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Badge Icon
                </label>
                <select
                  value={pageSettings.heroBadgeIcon || "Sparkles"}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroBadgeIcon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Globe">Globe</option>
                  <option value="Award">Award</option>
                  <option value="Zap">Zap</option>
                  <option value="Code2">Code2</option>
                  <option value="Layers">Layers</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Main Heading Text
                </label>
                <input
                  type="text"
                  value={pageSettings.heroHeading || ""}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroHeading: e.target.value })}
                  placeholder="Crafted with Precision & Purpose"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Heading Highlight #1 (Cyan Glow)
                </label>
                <input
                  type="text"
                  value={pageSettings.heroHeadingHighlight1 || ""}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroHeadingHighlight1: e.target.value })}
                  placeholder="Precision & "
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Heading Highlight #2 (Blue Glow)
                </label>
                <input
                  type="text"
                  value={pageSettings.heroHeadingHighlight2 || ""}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroHeadingHighlight2: e.target.value })}
                  placeholder="Purpose"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="heroHeadingLineBreak"
                  checked={pageSettings.heroHeadingLineBreak || false}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroHeadingLineBreak: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#00d2ff]"
                />
                <label htmlFor="heroHeadingLineBreak" className="text-xs text-slate-300 cursor-pointer">
                  Break heading into a new line before highlight words
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Hero Paragraph / Description
                </label>
                <textarea
                  rows={3}
                  value={pageSettings.heroDescription || ""}
                  onChange={(e) => setPageSettings({ ...pageSettings, heroDescription: e.target.value })}
                  placeholder="Hero description paragraph..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hero Tech Tags Manager */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#00d2ff]" />
                  Hero Tech Badges / Tags
                </h3>
                <p className="text-xs text-slate-400">
                  Badges rendered directly under the hero heading (e.g., WordPress Core, WooCommerce, Laravel).
                </p>
              </div>
              <button
                onClick={() => {
                  const newTag: PortfolioHeroTag = {
                    id: `ht-${Date.now()}`,
                    text: "New Tech Badge",
                    icon: "Code2",
                    enabled: true,
                  };
                  setPageSettings({
                    ...pageSettings,
                    heroTags: [...(pageSettings.heroTags || []), newTag],
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-[#0c1836] hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="space-y-3">
              {(pageSettings.heroTags || []).map((tag, idx) => (
                <div
                  key={tag.id || idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#040815] border border-white/5"
                >
                  <span className="font-mono text-xs text-slate-500 w-6">#{idx + 1}</span>

                  <input
                    type="text"
                    value={tag.text}
                    onChange={(e) => {
                      const updated = [...(pageSettings.heroTags || [])];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setPageSettings({ ...pageSettings, heroTags: updated });
                    }}
                    placeholder="Tag label (e.g. Next.js)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#070e24] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />

                  <select
                    value={tag.icon || "Code2"}
                    onChange={(e) => {
                      const updated = [...(pageSettings.heroTags || [])];
                      updated[idx] = { ...updated[idx], icon: e.target.value };
                      setPageSettings({ ...pageSettings, heroTags: updated });
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#070e24] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  >
                    <option value="Code2">Code2</option>
                    <option value="Globe">Globe</option>
                    <option value="ShoppingBag">ShoppingBag</option>
                    <option value="Layers">Layers</option>
                    <option value="Zap">Zap</option>
                    <option value="CheckCircle2">CheckCircle2</option>
                  </select>

                  <button
                    onClick={() => {
                      const updated = (pageSettings.heroTags || []).filter((_, i) => i !== idx);
                      setPageSettings({ ...pageSettings, heroTags: updated });
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Stats (3 Key Numbers) */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00d2ff]" />
                  Hero Quick Statistics (3 Key Highlights)
                </h3>
                <p className="text-xs text-slate-400">
                  Showcase milestone numbers (e.g. 10+ Live Websites, 4+ Core Industries, 100% Responsive).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(pageSettings.heroStats || []).map((stat, idx) => (
                <div key={stat.id || idx} className="p-4 rounded-xl bg-[#040815] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#00d2ff]">Stat #{idx + 1}</span>
                    <select
                      value={stat.icon || "Globe"}
                      onChange={(e) => {
                        const updated = [...(pageSettings.heroStats || [])];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setPageSettings({ ...pageSettings, heroStats: updated });
                      }}
                      className="px-2 py-1 rounded bg-[#070e24] border border-white/10 text-[11px] text-white outline-none"
                    >
                      <option value="Globe">Globe</option>
                      <option value="Layers">Layers</option>
                      <option value="CheckCircle2">CheckCircle2</option>
                      <option value="Zap">Zap</option>
                      <option value="Award">Award</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Number / Value</label>
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => {
                        const updated = [...(pageSettings.heroStats || [])];
                        updated[idx] = { ...updated[idx], number: e.target.value };
                        setPageSettings({ ...pageSettings, heroStats: updated });
                      }}
                      placeholder="e.g. 10+"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#070e24] border border-white/10 text-white text-xs font-bold font-mono focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...(pageSettings.heroStats || [])];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setPageSettings({ ...pageSettings, heroStats: updated });
                      }}
                      placeholder="e.g. Live Websites"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#070e24] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Showcase Browser Window Mockup */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00d2ff]" />
                Featured Showcase Mockup (Right Column Card)
              </h3>
              <p className="text-xs text-slate-400">
                The futuristic 3D browser mockup displayed on the right of the Hero banner.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Browser Title / Caption
                </label>
                <input
                  type="text"
                  value={pageSettings.heroFeatured?.title || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), title: e.target.value },
                    })
                  }
                  placeholder="Featured Client Website"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Address Bar URL / Lock Text
                </label>
                <input
                  type="text"
                  value={pageSettings.heroFeatured?.lockText || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), lockText: e.target.value },
                    })
                  }
                  placeholder="https://dengofit.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Live Preview Link URL
                </label>
                <input
                  type="text"
                  value={pageSettings.heroFeatured?.liveUrl || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), liveUrl: e.target.value },
                    })
                  }
                  placeholder="https://dengofit.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Spotlight Badge Label
                </label>
                <input
                  type="text"
                  value={pageSettings.heroFeatured?.badge || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), badge: e.target.value },
                    })
                  }
                  placeholder="LIVE DEMO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={pageSettings.heroFeatured?.imageAlt || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), imageAlt: e.target.value },
                    })
                  }
                  placeholder="Featured Client Project Showcase"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              {/* Universal Image Manager for Featured Showcase */}
              <div className="md:col-span-2">
                <UniversalImageManager
                  label="Showcase Screenshot Image"
                  imageUrl={pageSettings.heroFeatured?.image || "/assets/profile-1-scaled.png"}
                  alt="Featured Showcase Screenshot"
                  aspectRatio="wide"
                  openMediaPicker={openMediaPicker}
                  showToast={showToast}
                  onImageChange={(newUrl) => {
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), image: newUrl },
                    });
                  }}
                  onImageRemove={() => {
                    setPageSettings({
                      ...pageSettings,
                      heroFeatured: { ...(pageSettings.heroFeatured || {}), image: "" },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SEARCH & CATEGORY FILTERS CMS                         */}
      {/* ======================================================== */}
      {activeSubPage === "search-filters" && (
        <div className="space-y-6">
          {/* Search Bar Settings Card */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#00d2ff]" />
                  Search Input Controls
                </h3>
                <p className="text-xs text-slate-400">
                  Configure search placeholder and real-time filtering behavior.
                </p>
              </div>
              <button
                onClick={() => handleSaveAll("Search & Filters")}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                Save Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Search Bar Placeholder Text
                </label>
                <input
                  type="text"
                  value={pageSettings.searchPlaceholder || ""}
                  onChange={(e) => setPageSettings({ ...pageSettings, searchPlaceholder: e.target.value })}
                  placeholder="Search projects by title, stack, or keywords..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="searchEnabledToggle"
                  checked={pageSettings.searchEnabled !== false}
                  onChange={(e) => setPageSettings({ ...pageSettings, searchEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#00d2ff]"
                />
                <label htmlFor="searchEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                  Enable real-time search input bar on the Portfolio page
                </label>
              </div>
            </div>
          </div>

          {/* Dynamic Categories CRUD Card */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#00d2ff]" />
                  Dynamic Category Filter Pills
                </h3>
                <p className="text-xs text-slate-400">
                  Add, edit, reorder, or toggle category pills that filter projects on the live website.
                </p>
              </div>

              <button
                onClick={() => {
                  setCategoryModal({
                    isOpen: true,
                    mode: "add",
                    index: -1,
                    data: {
                      id: `cat-${Date.now()}`,
                      label: "NEW CATEGORY",
                      value: `category-${categoriesList.length + 1}`,
                      icon: "Layers",
                      description: "Custom project category filter",
                      enabled: true,
                      order: categoriesList.length + 1,
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {categoriesList.map((cat, idx) => (
                <div
                  key={cat.id || cat.value || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500 w-6">#{idx + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-wide">{cat.label}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#00d2ff] border border-white/10">
                          {cat.value}
                        </span>
                        {cat.enabled === false && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Hidden
                          </span>
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...categoriesList];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setCategoriesList(updated);
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === categoriesList.length - 1}
                      onClick={() => {
                        if (idx === categoriesList.length - 1) return;
                        const updated = [...categoriesList];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setCategoriesList(updated);
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setCategoryModal({
                          isOpen: true,
                          mode: "edit",
                          index: idx,
                          data: { ...cat },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-300 hover:text-[#00d2ff]"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setDeleteConfirm({
                          isOpen: true,
                          title: `Delete Category "${cat.label}"?`,
                          description:
                            "This category will be removed from the filter pills list. Associated projects will still be saved in the database.",
                          onConfirm: () => {
                            setCategoriesList(categoriesList.filter((_, i) => i !== idx));
                            setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-red-400"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PROJECTS DATABASE CMS (FULL CRUD)                     */}
      {/* ======================================================== */}
      {activeSubPage === "projects" && (
        <div className="space-y-6">
          {/* Search, Filter & Add Project Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Filter projects by title or stack..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <select
                value={adminCategoryFilter}
                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              >
                <option value="all">All Categories ({projectsList.length})</option>
                {categoriesList.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setProjectModal({
                    isOpen: true,
                    mode: "add",
                    index: -1,
                    data: {
                      id: `proj-${Date.now()}`,
                      title: "New Client Project",
                      slug: `project-${projectsList.length + 1}`,
                      category: categoriesList[0]?.value || "ecommerce",
                      categoryName: categoriesList[0]?.label || "E-COMMERCE",
                      image: "/assets/profile-1-scaled.png",
                      imageAlt: "Client project preview",
                      description: "Custom digital solution built with modern engineering and high conversion architecture.",
                      liveUrl: "https://example.com",
                      demoUrl: "https://example.com",
                      technologies: ["WordPress", "PHP", "Tailwind CSS"],
                      buttonText: "LIVE DEMO",
                      buttonIcon: "ArrowRight",
                      featured: false,
                      homeFeatured: false,
                      enabled: true,
                      active: true,
                      order: projectsList.length + 1,
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          {/* Projects Table / Card List */}
          <div className="space-y-3">
            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#070e24] border border-white/5 space-y-3">
                <FolderKanban className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No projects found</h4>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query or category filter.
                </p>
              </div>
            ) : (
              filteredProjects.map((project, idx) => {
                const originalIndex = projectsList.findIndex((p) => p.id === project.id);
                return (
                  <div
                    key={project.id || idx}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#070e24] border border-white/5 hover:border-[#00d2ff]/30 transition-all"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-[#040815] shrink-0 border border-white/10">
                        <Image
                          src={normalizeImageUrl(project.image)}
                          alt={project.imageAlt || project.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#00d2ff] border border-white/10">
                            {project.category}
                          </span>

                          {project.featured && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Featured</span>
                            </span>
                          )}

                          {project.homeFeatured && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              <Flame className="w-3 h-3 text-purple-400" />
                              <span>Home</span>
                            </span>
                          )}

                          {project.enabled === false && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              Disabled
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1">{project.description}</p>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(project.technologies || []).slice(0, 4).map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#040815] text-slate-300 border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                          {(project.technologies || []).length > 4 && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              +{project.technologies.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      {/* Move Up */}
                      <button
                        disabled={originalIndex <= 0}
                        onClick={() => {
                          if (originalIndex <= 0) return;
                          const updated = [...projectsList];
                          const temp = updated[originalIndex];
                          updated[originalIndex] = updated[originalIndex - 1];
                          updated[originalIndex - 1] = temp;
                          setProjectsList(updated);
                        }}
                        className="p-2 rounded-xl bg-[#040815] text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        disabled={originalIndex >= projectsList.length - 1}
                        onClick={() => {
                          if (originalIndex >= projectsList.length - 1) return;
                          const updated = [...projectsList];
                          const temp = updated[originalIndex];
                          updated[originalIndex] = updated[originalIndex + 1];
                          updated[originalIndex + 1] = temp;
                          setProjectsList(updated);
                        }}
                        className="p-2 rounded-xl bg-[#040815] text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => {
                          const copyItem: ProjectItem = {
                            ...project,
                            id: `proj-${Date.now()}`,
                            title: `${project.title} (Copy)`,
                            slug: `${project.slug || "project"}-copy`,
                          };
                          const updated = [...projectsList];
                          updated.splice(originalIndex + 1, 0, copyItem);
                          setProjectsList(updated);
                          showToast(`Duplicated "${project.title}"!`);
                        }}
                        className="p-2 rounded-xl bg-[#040815] text-slate-400 hover:text-[#00d2ff] transition-colors"
                        title="Duplicate Project"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Edit Modal Button */}
                      <button
                        onClick={() => {
                          setProjectModal({
                            isOpen: true,
                            mode: "edit",
                            index: originalIndex,
                            data: { ...project },
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#040815] hover:bg-[#00d2ff]/20 border border-white/10 hover:border-[#00d2ff]/40 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#00d2ff]" />
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setDeleteConfirm({
                            isOpen: true,
                            title: `Delete "${project.title}"?`,
                            description: "This project will be permanently removed from your portfolio database.",
                            onConfirm: () => {
                              setProjectsList(projectsList.filter((_, i) => i !== originalIndex));
                              setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                              showToast(`Deleted "${project.title}"`);
                            },
                          });
                        }}
                        className="p-2 rounded-xl bg-[#040815] text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LOAD MORE & PAGINATION CMS                            */}
      {/* ======================================================== */}
      {activeSubPage === "load-more" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-[#00d2ff]" />
                Load More &amp; Pagination Controls
              </h3>
              <p className="text-xs text-slate-400">
                Manage batch loading behavior, button labels, and remaining items counter templates.
              </p>
            </div>
            <button
              onClick={() => handleSaveAll("Pagination Settings")}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              Save Pagination
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Button Label Text
              </label>
              <input
                type="text"
                value={pageSettings.loadMoreButtonText || ""}
                onChange={(e) => setPageSettings({ ...pageSettings, loadMoreButtonText: e.target.value })}
                placeholder="LOAD MORE WEBSITES"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Remaining Items Template <span className="text-[#00d2ff] font-bold">Use {"{remaining}"}</span>
              </label>
              <input
                type="text"
                value={pageSettings.loadMoreRemainingTemplate || ""}
                onChange={(e) => setPageSettings({ ...pageSettings, loadMoreRemainingTemplate: e.target.value })}
                placeholder="SHOW MORE ({remaining} REMAINING)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Initial Visible Projects Count
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={pageSettings.initialProjectsCount || 9}
                onChange={(e) =>
                  setPageSettings({ ...pageSettings, initialProjectsCount: parseInt(e.target.value) || 9 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Projects to Load Per Click
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={pageSettings.projectsPerPage || 6}
                onChange={(e) =>
                  setPageSettings({ ...pageSettings, projectsPerPage: parseInt(e.target.value) || 6 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2 pt-2">
              <input
                type="checkbox"
                id="enableLoadMoreToggle"
                checked={pageSettings.loadMoreEnabled !== false}
                onChange={(e) => setPageSettings({ ...pageSettings, loadMoreEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#00d2ff]"
              />
              <label htmlFor="enableLoadMoreToggle" className="text-xs text-slate-300 cursor-pointer">
                Enable Load More button pagination (if disabled, all projects display at once)
              </label>
            </div>
          </div>

          {/* Live Simulator Preview */}
          <div className="p-4 rounded-xl bg-[#040815] border border-[#00d2ff]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00d2ff]">
              <Info className="w-4 h-4" />
              <span>Live Calculation Preview</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              With current <span className="font-mono text-white font-bold">{projectsList.length} total projects</span>:{" "}
              The live website will initially show{" "}
              <span className="font-mono text-[#00d2ff] font-bold">
                {Math.min(projectsList.length, pageSettings.initialProjectsCount || 9)}
              </span>{" "}
              projects. If more remain, the button will display:{" "}
              <span className="px-2 py-0.5 rounded bg-[#070e24] border border-[#00d2ff]/40 text-[#00d2ff] font-mono text-xs">
                {(pageSettings.loadMoreRemainingTemplate || "SHOW MORE ({remaining} REMAINING)").replace(
                  "{remaining}",
                  String(Math.max(0, projectsList.length - (pageSettings.initialProjectsCount || 9)))
                )}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. VISIBILITY & THEME CONTROLS                           */}
      {/* ======================================================== */}
      {activeSubPage === "visibility-theme" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00d2ff]" />
                Section Visibility &amp; Visual Aesthetics
              </h3>
              <p className="text-xs text-slate-400">
                Toggle individual sections and adjust cyber visual lighting effects.
              </p>
            </div>
            <button
              onClick={() => handleSaveAll("Visibility & Theme")}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              Save Theme
            </button>
          </div>

          {/* Section Toggles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Page Section Switches</h4>

            {[
              { id: "showHero", label: "Hero Banner & 3D Showcase Card", desc: "Top header with badges, dual highlights, and browser mockup" },
              { id: "showSearch", label: "Real-Time Search Bar", desc: "Interactive keyword search input" },
              { id: "showFilters", label: "Category Filter Pills", desc: "Category pills (All, E-Commerce, Business, etc.)" },
              { id: "showProjectGrid", label: "Projects Database Grid", desc: "Main showcase grid displaying projects" },
              { id: "showWaveDividers", label: "Wave Dividers", desc: "Futuristic wave transition dividers at section borders" },
              { id: "showAmbientGlow", label: "Atmospheric Ambient Glow Lighting", desc: "Blur glow lighting effects in page background" },
            ].map((toggleItem) => {
              const isChecked = (pageSettings as any)[toggleItem.id] !== false;
              return (
                <div
                  key={toggleItem.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#040815] border border-white/5"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{toggleItem.label}</div>
                    <div className="text-[11px] text-slate-400">{toggleItem.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setPageSettings({ ...pageSettings, [toggleItem.id]: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#00d2ff] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* Theme Color */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Theme Accent Color</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Primary Accent Color Hex
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={pageSettings.accentColor || "#00d2ff"}
                    onChange={(e) => setPageSettings({ ...pageSettings, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={pageSettings.accentColor || "#00d2ff"}
                    onChange={(e) => setPageSettings({ ...pageSettings, accentColor: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PAGE SEO & OPEN GRAPH CMS                             */}
      {/* ======================================================== */}
      {activeSubPage === "seo" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00d2ff]" />
                  Portfolio Page SEO &amp; Open Graph Meta
                </h3>
                <p className="text-xs text-slate-400">
                  Manage search engine titles, snippets, social share cards, and canonical tags for <span className="font-mono text-[#00d2ff]">/portfolio</span>.
                </p>
              </div>
              <button
                onClick={() => handleSaveAll("Portfolio SEO")}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                Save SEO
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">
                    Meta Title (Browser Tab &amp; Google SERP)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {(pageSettings.seo?.title || "").length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={pageSettings.seo?.title || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      seo: { ...(pageSettings.seo || {}), title: e.target.value },
                    })
                  }
                  placeholder="Featured Projects & Client Portfolios | Tarek Rahaman"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">
                    Meta Description (Search Snippet)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {(pageSettings.seo?.description || "").length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={pageSettings.seo?.description || ""}
                  onChange={(e) =>
                    setPageSettings({
                      ...pageSettings,
                      seo: { ...(pageSettings.seo || {}), description: e.target.value },
                    })
                  }
                  placeholder="Explore Tarek Rahaman's featured portfolio of high-impact web applications..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Keywords (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={pageSettings.seo?.keywords || ""}
                    onChange={(e) =>
                      setPageSettings({
                        ...pageSettings,
                        seo: { ...(pageSettings.seo || {}), keywords: e.target.value },
                      })
                    }
                    placeholder="Tarek Rahaman, Portfolio, WordPress, Laravel, Next.js"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={pageSettings.seo?.canonicalUrl || ""}
                    onChange={(e) =>
                      setPageSettings({
                        ...pageSettings,
                        seo: { ...(pageSettings.seo || {}), canonicalUrl: e.target.value },
                      })
                    }
                    placeholder="https://tarekrahaman.me/portfolio"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Open Graph (Social) Title
                  </label>
                  <input
                    type="text"
                    value={pageSettings.seo?.ogTitle || ""}
                    onChange={(e) =>
                      setPageSettings({
                        ...pageSettings,
                        seo: { ...(pageSettings.seo || {}), ogTitle: e.target.value },
                      })
                    }
                    placeholder="Featured Projects & Client Portfolios | Tarek Rahaman"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Open Graph (Social) Description
                  </label>
                  <input
                    type="text"
                    value={pageSettings.seo?.ogDescription || ""}
                    onChange={(e) =>
                      setPageSettings({
                        ...pageSettings,
                        seo: { ...(pageSettings.seo || {}), ogDescription: e.target.value },
                      })
                    }
                    placeholder="Social share summary description..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <UniversalImageManager
                    label="Open Graph / Social Share Card Image"
                    imageUrl={pageSettings.seo?.ogImage || "/assets/profile-1-scaled.png"}
                    alt="SEO Social Share Image"
                    aspectRatio="wide"
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                    onImageChange={(newUrl) => {
                      setPageSettings({
                        ...pageSettings,
                        seo: { ...(pageSettings.seo || {}), ogImage: newUrl },
                      });
                    }}
                    onImageRemove={() => {
                      setPageSettings({
                        ...pageSettings,
                        seo: { ...(pageSettings.seo || {}), ogImage: "" },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Google SERP Preview Card */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00d2ff]">
              <Globe className="w-4 h-4" />
              <span>Live Google Search SERP Preview</span>
            </div>
            <div className="p-4 rounded-xl bg-[#202124] text-left max-w-2xl border border-white/5 space-y-1">
              <div className="text-[11px] font-sans text-[#bdc1c6] truncate">
                {pageSettings.seo?.canonicalUrl || "https://tarekrahaman.me/portfolio"}
              </div>
              <h4 className="text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {pageSettings.seo?.title || "Featured Projects & Client Portfolios | Tarek Rahaman"}
              </h4>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {pageSettings.seo?.description ||
                  "Explore Tarek Rahaman's featured portfolio of high-impact web applications, client solutions, e-commerce platforms, and scalable digital architectures."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PROJECT                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {projectModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl my-8 p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {projectModal.mode === "add" ? "Add New Project" : "Edit Project"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure title, category, screenshot image, tech stack, and action buttons.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setProjectModal({ ...projectModal, isOpen: false })}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#040815]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={projectModal.data.title || ""}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, title: e.target.value },
                        })
                      }
                      placeholder="e.g. Modern E-Commerce Platform"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={projectModal.data.category || "ecommerce"}
                      onChange={(e) => {
                        const selectedCat = categoriesList.find((c) => c.value === e.target.value);
                        setProjectModal({
                          ...projectModal,
                          data: {
                            ...projectModal.data,
                            category: e.target.value,
                            categoryName: selectedCat?.label || e.target.value,
                          },
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    >
                      {categoriesList.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label} ({c.value})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Category Custom Label Override (Optional)
                    </label>
                    <input
                      type="text"
                      value={projectModal.data.categoryName || ""}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, categoryName: e.target.value },
                        })
                      }
                      placeholder="Leave blank to use category default"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      URL Slug / Unique ID
                    </label>
                    <input
                      type="text"
                      value={projectModal.data.slug || projectModal.data.id || ""}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, slug: e.target.value },
                        })
                      }
                      placeholder="e.g. dengofit-store"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                    />
                  </div>
                </div>

                {/* Main Image with UniversalImageManager */}
                <div>
                  <UniversalImageManager
                    label="Project Card Image"
                    imageUrl={projectModal.data.image || "/assets/profile-1-scaled.png"}
                    alt={projectModal.data.imageAlt || projectModal.data.title || "Project Preview"}
                    aspectRatio="video"
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                    onImageChange={(newUrl) => {
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, image: newUrl },
                      });
                    }}
                    onImageRemove={() => {
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, image: "" },
                      });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={projectModal.data.imageAlt || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, imageAlt: e.target.value },
                      })
                    }
                    placeholder="Descriptive alt text for accessibility & SEO"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Short Description (Displayed on Card) *
                  </label>
                  <textarea
                    rows={2}
                    value={projectModal.data.description || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, description: e.target.value },
                      })
                    }
                    placeholder="Short summary of the project architecture and features..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                {/* Tech Stack Tags CRUD */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Technologies / Tech Stack Tags
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={techTagInput}
                      onChange={(e) => setTechTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (techTagInput.trim()) {
                            const current = projectModal.data.technologies || [];
                            if (!current.includes(techTagInput.trim())) {
                              setProjectModal({
                                ...projectModal,
                                data: {
                                  ...projectModal.data,
                                  technologies: [...current, techTagInput.trim()],
                                },
                              });
                            }
                            setTechTagInput("");
                          }
                        }
                      }}
                      placeholder="Type tag (e.g. Next.js) and press Enter or Add..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (techTagInput.trim()) {
                          const current = projectModal.data.technologies || [];
                          if (!current.includes(techTagInput.trim())) {
                            setProjectModal({
                              ...projectModal,
                              data: {
                                ...projectModal.data,
                                technologies: [...current, techTagInput.trim()],
                              },
                            });
                          }
                          setTechTagInput("");
                        }
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#040815] border border-white/5 min-h-[42px]">
                    {(projectModal.data.technologies || []).length === 0 ? (
                      <span className="text-[11px] text-slate-500">No tech tags added yet</span>
                    ) : (
                      (projectModal.data.technologies || []).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#070e24] text-[#00d2ff] border border-[#00d2ff]/30"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (projectModal.data.technologies || []).filter((_, i) => i !== tIdx);
                              setProjectModal({
                                ...projectModal,
                                data: { ...projectModal.data, technologies: updated },
                              });
                            }}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Links & Button Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Live Preview URL *
                    </label>
                    <input
                      type="text"
                      value={projectModal.data.liveUrl || ""}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, liveUrl: e.target.value },
                        })
                      }
                      placeholder="https://example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Demo / Secondary URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={projectModal.data.demoUrl || ""}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, demoUrl: e.target.value },
                        })
                      }
                      placeholder="https://demo.example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Button Action Text
                    </label>
                    <input
                      type="text"
                      value={projectModal.data.buttonText || ""}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, buttonText: e.target.value },
                        })
                      }
                      placeholder="LIVE DEMO"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Button Icon
                    </label>
                    <select
                      value={projectModal.data.buttonIcon || "ArrowRight"}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, buttonIcon: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    >
                      <option value="ArrowRight">ArrowRight</option>
                      <option value="ExternalLink">ExternalLink</option>
                      <option value="Globe">Globe</option>
                      <option value="Code2">Code2</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#040815] border border-white/5">
                    <input
                      type="checkbox"
                      id="modalFeaturedToggle"
                      checked={projectModal.data.featured || false}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, featured: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded accent-[#00d2ff]"
                    />
                    <label htmlFor="modalFeaturedToggle" className="text-xs text-slate-300 cursor-pointer">
                      Featured Project (Gold Star)
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#040815] border border-white/5">
                    <input
                      type="checkbox"
                      id="modalHomeToggle"
                      checked={projectModal.data.homeFeatured || false}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: { ...projectModal.data, homeFeatured: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded accent-[#00d2ff]"
                    />
                    <label htmlFor="modalHomeToggle" className="text-xs text-slate-300 cursor-pointer">
                      Show on Homepage Preview
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#040815] border border-white/5">
                    <input
                      type="checkbox"
                      id="modalEnabledToggle"
                      checked={projectModal.data.enabled !== false}
                      onChange={(e) =>
                        setProjectModal({
                          ...projectModal,
                          data: {
                            ...projectModal.data,
                            enabled: e.target.checked,
                            active: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded accent-[#00d2ff]"
                    />
                    <label htmlFor="modalEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                      Project Visible / Enabled
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProjectModal({ ...projectModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-[#040815]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!projectModal.data.title || !projectModal.data.description) {
                      showToast("Please provide at least a title and description.", "error");
                      return;
                    }

                    const finalItem: ProjectItem = {
                      id: projectModal.data.id || `proj-${Date.now()}`,
                      title: projectModal.data.title,
                      slug: projectModal.data.slug || projectModal.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      category: projectModal.data.category || "ecommerce",
                      categoryName: projectModal.data.categoryName,
                      image: projectModal.data.image || "/assets/profile-1-scaled.png",
                      imageAlt: projectModal.data.imageAlt,
                      description: projectModal.data.description,
                      liveUrl: projectModal.data.liveUrl || "#",
                      demoUrl: projectModal.data.demoUrl,
                      technologies: projectModal.data.technologies || ["WordPress"],
                      buttonText: projectModal.data.buttonText || "LIVE DEMO",
                      buttonIcon: projectModal.data.buttonIcon || "ArrowRight",
                      featured: projectModal.data.featured || false,
                      homeFeatured: projectModal.data.homeFeatured || false,
                      enabled: projectModal.data.enabled !== false,
                      active: projectModal.data.enabled !== false,
                      order: projectModal.data.order || 0,
                    };

                    if (projectModal.mode === "add") {
                      setProjectsList([finalItem, ...projectsList]);
                      showToast(`Added "${finalItem.title}"!`);
                    } else {
                      const updated = [...projectsList];
                      updated[projectModal.index] = finalItem;
                      setProjectsList(updated);
                      showToast(`Updated "${finalItem.title}"!`);
                    }

                    setProjectModal({ ...projectModal, isOpen: false });
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00a8ff] to-[#0072ff] hover:opacity-90 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                >
                  {projectModal.mode === "add" ? "Create Project" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY                               */}
      {/* ======================================================== */}
      <AnimatePresence>
        {categoryModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#00d2ff]" />
                  {categoryModal.mode === "add" ? "Add New Category" : "Edit Category"}
                </h3>
                <button
                  onClick={() => setCategoryModal({ ...categoryModal, isOpen: false })}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Category Label (Button Title) *
                  </label>
                  <input
                    type="text"
                    value={categoryModal.data.label || ""}
                    onChange={(e) =>
                      setCategoryModal({
                        ...categoryModal,
                        data: { ...categoryModal.data, label: e.target.value },
                      })
                    }
                    placeholder="e.g. MOBILE APPS"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Slug / Value Key *
                  </label>
                  <input
                    type="text"
                    value={categoryModal.data.value || ""}
                    onChange={(e) =>
                      setCategoryModal({
                        ...categoryModal,
                        data: { ...categoryModal.data, value: e.target.value.toLowerCase().replace(/\s+/g, "-") },
                      })
                    }
                    placeholder="e.g. mobile-apps"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Category Icon
                  </label>
                  <select
                    value={categoryModal.data.icon || "Layers"}
                    onChange={(e) =>
                      setCategoryModal({
                        ...categoryModal,
                        data: { ...categoryModal.data, icon: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  >
                    <option value="Globe">Globe</option>
                    <option value="ShoppingBag">ShoppingBag</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="GraduationCap">GraduationCap</option>
                    <option value="User">User</option>
                    <option value="Layers">Layers</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="FolderKanban">FolderKanban</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Description (Admin Reference)
                  </label>
                  <input
                    type="text"
                    value={categoryModal.data.description || ""}
                    onChange={(e) =>
                      setCategoryModal({
                        ...categoryModal,
                        data: { ...categoryModal.data, description: e.target.value },
                      })
                    }
                    placeholder="e.g. Native and cross-platform apps"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="catEnabledToggle"
                    checked={categoryModal.data.enabled !== false}
                    onChange={(e) =>
                      setCategoryModal({
                        ...categoryModal,
                        data: { ...categoryModal.data, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="catEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                    Category Filter Pill Visible
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ ...categoryModal, isOpen: false })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!categoryModal.data.label || !categoryModal.data.value) {
                      showToast("Please provide label and value", "error");
                      return;
                    }
                    const finalCat: ProjectCategoryItem = {
                      id: categoryModal.data.id || `cat-${Date.now()}`,
                      label: categoryModal.data.label,
                      value: categoryModal.data.value,
                      icon: categoryModal.data.icon || "Layers",
                      description: categoryModal.data.description,
                      enabled: categoryModal.data.enabled !== false,
                      order: categoryModal.data.order || categoriesList.length + 1,
                    };

                    if (categoryModal.mode === "add") {
                      setCategoriesList([...categoriesList, finalCat]);
                      showToast(`Added category "${finalCat.label}"!`);
                    } else {
                      const updated = [...categoriesList];
                      updated[categoryModal.index] = finalCat;
                      setCategoriesList(updated);
                      showToast(`Updated category "${finalCat.label}"!`);
                    }
                    setCategoryModal({ ...categoryModal, isOpen: false });
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90"
                >
                  {categoryModal.mode === "add" ? "Add Category" : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-red-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{deleteConfirm.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{deleteConfirm.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteConfirm.onConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
