"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Sparkles,
  Save,
  CheckCircle2,
  Upload,
  Globe,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Compass,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Layers,
  ChevronRight,
  ArrowLeft,
  Bot,
  MessageSquare
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import {
  CmsPage,
  FooterSettings,
  FooterLinkItem,
  AiChatSettings,
  AiQuickQuestion
} from "@/types/portfolio";
import { defaultAiChatSettings } from "@/lib/cms-default-data";

interface AdminSettingsCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type SettingsSubTab = "overview" | "identity" | "footer" | "seo" | "aichat";

export default function AdminSettingsCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminSettingsCmsProps) {
  const { cmsData, updateCms } = useCms();

  const [internalSubPage, setInternalSubPage] = useState<SettingsSubTab>("overview");
  const activeSubTab = (externalSubPage as SettingsSubTab) || internalSubPage;

  const setActiveSubTab = (tab: SettingsSubTab) => {
    setInternalSubPage(tab);
    if (externalSetSubPage) {
      externalSetSubPage(tab);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // Site Identity Form
  const [siteForm, setSiteForm] = useState({
    websiteName: cmsData.siteSettings?.websiteName || "Tarek Rahaman",
    tagline:
      cmsData.siteSettings?.tagline ||
      "Full-Stack Web Developer & WordPress / WooCommerce Specialist",
    logoText: cmsData.siteSettings?.logoText || "TR",
    logoUrl: cmsData.siteSettings?.logoUrl || "",
    faviconUrl: cmsData.siteSettings?.faviconUrl || "/favicon.ico",
    copyrightText:
      cmsData.siteSettings?.copyrightText || "Copyright © 2026 Tarek Rahaman | All Rights Reserved.",
    copyrightYear: cmsData.siteSettings?.copyrightYear || "2026",
    footerText:
      cmsData.siteSettings?.footerText ||
      "Transform Your Online Presence with Tarek Rahaman — Expert Full-Stack & WordPress Developer delivering high-performance results.",
    cvUrl: cmsData.siteSettings?.cvUrl || "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
    availableForHire: cmsData.siteSettings?.availableForHire ?? true
  });

  // Footer Settings
  const [footerForm, setFooterForm] = useState<FooterSettings>(
    cmsData.footerSettings || {
      logoText: "TR",
      brandName: "Tarek Rahaman",
      description:
        "Full-Stack Web Developer & WordPress Specialist crafting high-converting e-commerce, custom Laravel web applications, and fast digital experiences.",
      copyrightText: "Copyright © 2026 Tarek Rahaman | All Rights Reserved.",
      links: [
        { name: "Home", href: "/", enabled: true },
        { name: "About Me", href: "/about", enabled: true },
        { name: "Services", href: "/services", enabled: true },
        { name: "Skills & Tech", href: "/skills", enabled: true },
        { name: "Portfolio", href: "/portfolio", enabled: true },
        { name: "Contact", href: "/contact", enabled: true }
      ]
    }
  );

  // Synchronize siteForm with latest cmsData
  useEffect(() => {
    if (cmsData.siteSettings) {
      setSiteForm({
        websiteName: cmsData.siteSettings.websiteName || "Tarek Rahaman",
        tagline:
          cmsData.siteSettings.tagline ||
          "Full-Stack Web Developer & WordPress / WooCommerce Specialist",
        logoText: cmsData.siteSettings.logoText || "TR",
        logoUrl: cmsData.siteSettings.logoUrl || "",
        faviconUrl:
          cmsData.siteSettings.faviconUrl ||
          (cmsData.siteSettings as any)?.favicon ||
          "/favicon.ico",
        copyrightText:
          cmsData.siteSettings.copyrightText ||
          "Copyright © 2026 Tarek Rahaman | All Rights Reserved.",
        copyrightYear: cmsData.siteSettings.copyrightYear || "2026",
        footerText:
          cmsData.siteSettings.footerText ||
          "Transform Your Online Presence with Tarek Rahaman — Expert Full-Stack & WordPress Developer delivering high-performance results.",
        cvUrl:
          cmsData.siteSettings.cvUrl ||
          "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
        availableForHire: cmsData.siteSettings.availableForHire ?? true,
      });
    }
  }, [cmsData.siteSettings]);

  // Synchronize footerForm with latest cmsData
  useEffect(() => {
    if (cmsData.footerSettings) {
      setFooterForm(cmsData.footerSettings);
    }
  }, [cmsData.footerSettings]);

  // AI Chat Assistant Form State
  const [aiChatForm, setAiChatForm] = useState<AiChatSettings>(
    cmsData.aiChatSettings || defaultAiChatSettings
  );

  useEffect(() => {
    if (cmsData.aiChatSettings) {
      setAiChatForm(cmsData.aiChatSettings);
    }
  }, [cmsData.aiChatSettings]);

  // Pages SEO list
  const defaultPages: CmsPage[] = [
    {
      id: "home",
      title: "Tarek Rahaman | Full-Stack Web Developer & WordPress Specialist",
      slug: "/",
      description:
        "Official portfolio of Tarek Rahaman. Professional Full-Stack Web Developer, Laravel Specialist & WordPress/WooCommerce Expert based in Dhaka, Bangladesh.",
      seoTitle: "Tarek Rahaman | Full-Stack Web Developer & WordPress Specialist",
      seoDesc:
        "Transform your online presence with Tarek Rahaman. High-performance custom web applications, WordPress WooCommerce development, and speed optimization.",
      keywords:
        "Tarek Rahaman, Full-Stack Developer, WordPress Specialist, Laravel Developer, Bangladesh Web Developer",
      ogImage: "/assets/profile-1-scaled.png"
    },
    {
      id: "about",
      title: "About | Tarek Rahaman",
      slug: "/about",
      description:
        "Learn about Tarek Rahaman's background, education at Daffodil International University, NSDA certifications, and engineering journey.",
      seoTitle: "About Tarek Rahaman | Software Engineer & Web Architect",
      seoDesc:
        "Discover Tarek Rahaman's journey in software engineering, Data Science, verified NSDA certifications, and high-performance development philosophies.",
      keywords: "About Tarek Rahaman, Software Engineering DIU, NSDA Certified Developer, Web Architect",
      ogImage: "/assets/profile-1-scaled.png"
    },
    {
      id: "services",
      title: "Services | Tarek Rahaman",
      slug: "/services",
      description:
        "Professional digital services: Custom WordPress Development, Enterprise Laravel Web Apps, WooCommerce Systems, and Page Speed Tuning.",
      seoTitle: "Professional Web Development Services | Tarek Rahaman",
      seoDesc:
        "Explore professional services including WordPress architecture, WooCommerce online store design, Laravel applications, and Core Web Vitals speed optimization.",
      keywords:
        "WordPress Development Services, WooCommerce Expert, Laravel Application Developer, Website Speed Optimization",
      ogImage: "/assets/profile-1-scaled.png"
    },
    {
      id: "skills",
      title: "Skills & Tech Stack | Tarek Rahaman",
      slug: "/skills",
      description:
        "Comprehensive technical proficiency across modern web frameworks, backend databases, frontend UI tools, and development workflows.",
      seoTitle: "Technical Skills & Technologies | Tarek Rahaman",
      seoDesc:
        "In-depth overview of technical skills: PHP, Laravel, React, Tailwind CSS, WordPress, WooCommerce, Docker, MySQL, and Data Science tools.",
      keywords:
        "Web Developer Skills, PHP Laravel Stacks, React Frontend, WordPress WooCommerce Tools",
      ogImage: "/assets/profile-1-scaled.png"
    },
    {
      id: "portfolio",
      title: "Portfolio Projects | Tarek Rahaman",
      slug: "/portfolio",
      description:
        "Explore curated showcase projects including high-converting e-commerce stores, modern corporate sites, and custom web applications.",
      seoTitle: "Portfolio Showcase Projects | Tarek Rahaman",
      seoDesc:
        "Browse live client websites, custom e-commerce architectures, educational portals, and web applications built by Tarek Rahaman.",
      keywords:
        "Portfolio Web Projects, WordPress Case Studies, Laravel Portals, WooCommerce Client Work",
      ogImage: "/assets/profile-1-scaled.png"
    },
    {
      id: "contact",
      title: "Contact & Consultation | Tarek Rahaman",
      slug: "/contact",
      description:
        "Get in touch with Tarek Rahaman for web development projects, custom WordPress architectures, and Laravel applications. Available for freelance contracts.",
      seoTitle: "Contact & Consultation | Tarek Rahaman",
      seoDesc:
        "Reach out to Tarek Rahaman directly via WhatsApp, email, or telephone for project inquiries, custom estimates, and consultations.",
      keywords:
        "Contact Tarek Rahaman, Hire Web Developer Bangladesh, WordPress Consultant Dhaka, Laravel Freelancer",
      ogImage: "/assets/profile-1-scaled.png"
    }
  ];

  const [pagesList, setPagesList] = useState<CmsPage[]>(
    cmsData.pages && cmsData.pages.length > 0 ? cmsData.pages : defaultPages
  );
  const [selectedPageId, setSelectedPageId] = useState<string>("home");

  // Save changes handler
  const handleSaveAll = async (sectionName: string) => {
    setIsSaving(true);
    try {
      const updatedSiteSettings = {
        ...cmsData.siteSettings,
        websiteName: siteForm.websiteName,
        tagline: siteForm.tagline,
        logoText: siteForm.logoText,
        logoUrl: siteForm.logoUrl,
        favicon: siteForm.faviconUrl,
        faviconUrl: siteForm.faviconUrl,
        copyrightText: siteForm.copyrightText,
        copyrightYear: siteForm.copyrightYear,
        footerText: siteForm.footerText,
        cvUrl: siteForm.cvUrl,
        availableForHire: siteForm.availableForHire
      };

      await updateCms({
        siteSettings: updatedSiteSettings,
        footerSettings: {
          ...footerForm,
          brandName: siteForm.websiteName,
          logoText: siteForm.logoText,
          copyrightText: siteForm.copyrightText,
        },
        pages: pagesList,
        aiChatSettings: aiChatForm
      });

      showToast(`Saved ${sectionName} changes successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedPage = pagesList.find((p) => p.id === selectedPageId) || pagesList[0];

  // Overview Hub View
  if (activeSubTab === "overview") {
    return (
      <div className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[11px] font-mono font-bold uppercase text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Global Settings CMS // 4 Sub-Pages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Global Settings &amp; SEO Management Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Configure site-wide identity, logo badge, favicon, global footer branding, AI chat assistant, and search engine metadata for all 6 public routes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081228] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)]"
              >
                <Globe className="w-4 h-4" />
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Main Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            onClick={() => setActiveSubTab("identity")}
            className="p-6 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-105 transition-all">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                Site Identity &amp; Branding
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Website title, primary tagline, logo monogram text, custom logo URL, favicon, and hire availability status.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#00d2ff]">
              <span>Manage Identity</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab("footer")}
            className="p-6 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                Global Footer Manager
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Brand narrative, logo text, company navigation links, quick link titles, and copyright legal disclaimer.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-purple-400">
              <span>Manage Footer</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab("seo")}
            className="p-6 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Per-Page SEO &amp; OG Graph
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Edit meta titles, descriptions, keyword tags, and social media Open Graph preview cards for all 6 routes.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Manage 6 Page SEOs</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => setActiveSubTab("aichat")}
            className="p-6 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-105 transition-all">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                AI Chat Assistant
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Floating AI representative, Bangla/English/Banglish support, Gemini AI, custom greetings, and suggested questions.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#00d2ff]">
              <span>Manage AI Assistant</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 01. SITE IDENTITY
  // =========================================================================
  if (activeSubTab === "identity") {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveSubTab("overview")}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00d2ff] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Settings Hub</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#00d2ff] font-bold">Site Identity &amp; Branding</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Site Identity &amp; Global Branding
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Configure brand name, tagline, logo monogram, custom logo image, and hire status.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAll("Site Identity")}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Saving..." : "Save Identity"}</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Website Brand Name
              </label>
              <input
                type="text"
                value={siteForm.websiteName}
                onChange={(e) => setSiteForm({ ...siteForm, websiteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#00d2ff] outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Logo Monogram Text (e.g. TR)
              </label>
              <input
                type="text"
                value={siteForm.logoText}
                onChange={(e) => setSiteForm({ ...siteForm, logoText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-sm font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Primary Brand Tagline
            </label>
            <input
              type="text"
              value={siteForm.tagline}
              onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <UniversalImageManager
                label="Favicon Asset (Browser Tab Icon)"
                imageUrl={siteForm.faviconUrl}
                fallbackUrl="/favicon.ico"
                alt="Favicon"
                aspectRatio="square"
                onImageChange={(url) => setSiteForm((prev) => ({ ...prev, faviconUrl: url, favicon: url }))}
                onImageRemove={() => {
                  setSiteForm((prev) => ({ ...prev, faviconUrl: "/favicon.ico", favicon: "/favicon.ico" }));
                }}
                onSaveImmediate={async (url) => {
                  const targetFavicon = url || "/favicon.ico";
                  const updated = {
                    ...cmsData.siteSettings,
                    ...siteForm,
                    faviconUrl: targetFavicon,
                    favicon: targetFavicon
                  };
                  setSiteForm((prev) => ({ ...prev, faviconUrl: targetFavicon, favicon: targetFavicon }));
                  await updateCms({ siteSettings: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Controls the live browser tab favicon (PNG, JPG, ICO, SVG). Cache-busting (?v=timestamp) forces browsers to refresh the icon instantly.
              </p>
            </div>

            <div>
              <UniversalImageManager
                label="Custom Brand Logo Image (Navbar & Footer)"
                imageUrl={siteForm.logoUrl}
                fallbackUrl=""
                alt="Brand Logo"
                aspectRatio="square"
                onImageChange={(url) => setSiteForm((prev) => ({ ...prev, logoUrl: url }))}
                onImageRemove={() => {
                  setSiteForm((prev) => ({ ...prev, logoUrl: "" }));
                }}
                onSaveImmediate={async (url) => {
                  const updated = {
                    ...cmsData.siteSettings,
                    ...siteForm,
                    logoUrl: url || ""
                  };
                  setSiteForm((prev) => ({ ...prev, logoUrl: url || "" }));
                  await updateCms({ siteSettings: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Single source of truth for both top Navbar and Global Footer. When removed or empty, falls back to the stylized &quot;{siteForm.logoText || "TR"}&quot; monogram.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Copyright Year
            </label>
            <input
              type="text"
              value={siteForm.copyrightYear}
              onChange={(e) => setSiteForm({ ...siteForm, copyrightYear: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs font-mono focus:border-[#00d2ff] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Available For Hire Status</div>
              <div className="text-[11px] text-slate-400">
                Shows the pulsing green status dot in header and footer
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSiteForm({ ...siteForm, availableForHire: !siteForm.availableForHire })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                siteForm.availableForHire
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {siteForm.availableForHire ? "AVAILABLE FOR WORK" : "CURRENTLY BUSY"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 02. GLOBAL FOOTER MANAGER
  // =========================================================================
  if (activeSubTab === "footer") {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveSubTab("overview")}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00d2ff] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Settings Hub</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#00d2ff] font-bold">Global Footer Manager</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Global Footer Manager
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Customize footer branding text, logo emblem, navigation links, and legal copyright disclaimer.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAll("Footer Settings")}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Saving..." : "Save Footer"}</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          {/* Brand Logo Info Banner */}
          <div className="p-4 rounded-xl bg-[#00d2ff]/5 border border-[#00d2ff]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse" />
                <span>Global Brand Logo Sync</span>
              </div>
              <p className="text-[11px] text-slate-300">
                The global website brand logo image is centrally managed in{" "}
                <button
                  type="button"
                  onClick={() => setActiveSubTab("identity")}
                  className="text-[#00d2ff] underline font-bold hover:text-white"
                >
                  01. Site Identity &amp; Branding
                </button>
                . It automatically syncs across the top Navbar and Global Footer.
              </p>
            </div>
            {siteForm.logoUrl ? (
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 shrink-0 self-start sm:self-auto">
                Custom Logo Active
              </span>
            ) : (
              <span className="text-[10px] font-mono text-cyan-300 font-bold px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 shrink-0 self-start sm:self-auto">
                Monogram Active ({siteForm.logoText || "TR"})
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Footer Brand Name
              </label>
              <input
                type="text"
                value={footerForm.brandName || ""}
                onChange={(e) => setFooterForm({ ...footerForm, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Footer Logo Monogram
              </label>
              <input
                type="text"
                value={footerForm.logoText || ""}
                onChange={(e) => setFooterForm({ ...footerForm, logoText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-sm font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Footer Description Copy
            </label>
            <textarea
              rows={3}
              value={footerForm.description || ""}
              onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Copyright Legal Disclaimer
            </label>
            <input
              type="text"
              value={footerForm.copyrightText || ""}
              onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>

          {/* Footer Navigation Links */}
          <div className="pt-3 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 font-bold">
                Footer Quick Links
              </label>
              <button
                type="button"
                onClick={() =>
                  setFooterForm({
                    ...footerForm,
                    links: [...(footerForm.links || []), { name: "New Link", href: "/", enabled: true }]
                  })
                }
                className="inline-flex items-center gap-1 text-xs text-[#00d2ff] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            <div className="space-y-2">
              {(footerForm.links || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const next = [...(footerForm.links || [])];
                      next[idx].name = e.target.value;
                      setFooterForm({ ...footerForm, links: next });
                    }}
                    className="w-40 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const next = [...(footerForm.links || [])];
                      next[idx].href = e.target.value;
                      setFooterForm({ ...footerForm, links: next });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-xs font-mono focus:border-[#00d2ff] outline-none"
                    placeholder="URL / Route"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = (footerForm.links || []).filter((_, i) => i !== idx);
                      setFooterForm({ ...footerForm, links: next });
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 03. PER-PAGE SEO
  // =========================================================================
  if (activeSubTab === "seo") {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveSubTab("overview")}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00d2ff] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Settings Hub</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#00d2ff] font-bold">Per-Page SEO &amp; Open Graph</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Search Engine Optimization &amp; Social Share
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Manage meta titles, descriptions, keyword indexing, and social preview cards for each of your 6 public routes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAll("Page SEO")}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Saving..." : "Save SEO"}</span>
            </button>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {pagesList.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => setSelectedPageId(page.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedPageId === page.id
                  ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                  : "bg-[#070d1e] text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {page.slug || page.id}
            </button>
          ))}
        </div>

        {/* Selected Page SEO Card */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00d2ff]" />
              <span className="text-sm font-bold text-white capitalize">{selectedPage.id} Page SEO</span>
              <span className="text-xs font-mono text-cyan-300">({selectedPage.slug})</span>
            </div>
            <Link
              href={selectedPage.slug || "/"}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-[#00d2ff] hover:underline"
            >
              <span>View Route</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Browser / Meta Title
            </label>
            <input
              type="text"
              value={selectedPage.seoTitle || selectedPage.title || ""}
              onChange={(e) => {
                const updated = pagesList.map((p) =>
                  p.id === selectedPageId
                    ? { ...p, seoTitle: e.target.value, title: e.target.value }
                    : p
                );
                setPagesList(updated);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#00d2ff] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={selectedPage.seoDesc || selectedPage.description || ""}
              onChange={(e) => {
                const updated = pagesList.map((p) =>
                  p.id === selectedPageId
                    ? { ...p, seoDesc: e.target.value, description: e.target.value }
                    : p
                );
                setPagesList(updated);
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:border-[#00d2ff] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={selectedPage.keywords || ""}
              onChange={(e) => {
                const updated = pagesList.map((p) =>
                  p.id === selectedPageId ? { ...p, keywords: e.target.value } : p
                );
                setPagesList(updated);
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#00d2ff] outline-none font-mono"
            />
          </div>

          <div>
            <UniversalImageManager
              label="Page Social Share (Open Graph) Preview Image"
              imageUrl={selectedPage.ogImage || "/assets/profile-1-scaled.png"}
              fallbackUrl="/assets/profile-1-scaled.png"
              alt={`${selectedPage.id} OG Preview`}
              aspectRatio="video"
              onImageChange={(url) => {
                const updated = pagesList.map((p) =>
                  p.id === selectedPageId ? { ...p, ogImage: url } : p
                );
                setPagesList(updated);
              }}
              onSaveImmediate={async (url) => {
                const updated = pagesList.map((p) =>
                  p.id === selectedPageId ? { ...p, ogImage: url } : p
                );
                setPagesList(updated);
                await updateCms({ pages: updated });
              }}
              openMediaPicker={openMediaPicker}
              showToast={showToast}
            />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 04. AI CHAT ASSISTANT MANAGER
  // =========================================================================
  if (activeSubTab === "aichat") {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveSubTab("overview")}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00d2ff] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Settings Hub</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#00d2ff] font-bold">AI Chat Assistant</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>AI Chat Assistant Control System</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[#00d2ff]">
                  Gemini AI + Live CMS
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Configure your floating AI representative, bilingual welcome messages, suggested questions, and custom owner directives.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAll("AI Assistant")}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Saving..." : "Save AI Settings"}</span>
            </button>
          </div>
        </div>

        {/* 1. Status & Persona Card */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Assistant Activation &amp; Persona
              </h3>
              <p className="text-xs text-slate-400">
                Turn the floating chat on or off and set the persona name.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setAiChatForm({ ...aiChatForm, enabled: aiChatForm.enabled === false ? true : false })
              }
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                aiChatForm.enabled !== false
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {aiChatForm.enabled !== false ? "● ACTIVE ON ALL PAGES" : "○ DISABLED"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                AI Assistant Name
              </label>
              <input
                type="text"
                value={aiChatForm.botName || "Tarek AI Assistant"}
                onChange={(e) => setAiChatForm({ ...aiChatForm, botName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-[#00d2ff] outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Virtual Role Title
              </label>
              <input
                type="text"
                value={aiChatForm.botRole || "Official Virtual Representative of Tarek Rahaman"}
                onChange={(e) => setAiChatForm({ ...aiChatForm, botRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-cyan-300 text-sm focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Welcome Messages Card */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Bilingual Welcome Messages
            </h3>
            <p className="text-xs text-slate-400">
              Shown to visitors upon opening the chat for the first time.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 flex items-center justify-between">
              <span>🇬🇧 English Welcome Message</span>
            </label>
            <textarea
              rows={3}
              value={aiChatForm.welcomeMessageEn || ""}
              onChange={(e) => setAiChatForm({ ...aiChatForm, welcomeMessageEn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 flex items-center justify-between">
              <span>🇧🇩 Bangla Welcome Message</span>
            </label>
            <textarea
              rows={3}
              value={aiChatForm.welcomeMessageBn || ""}
              onChange={(e) => setAiChatForm({ ...aiChatForm, welcomeMessageBn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:border-[#00d2ff] outline-none resize-none leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* 3. Quick Suggestions (Chips) Manager */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Suggested Quick Questions (Chips)
              </h3>
              <p className="text-xs text-slate-400">
                Buttons shown when chat opens. Clicking any button immediately sends the prompt to the AI.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newQ: AiQuickQuestion = {
                  id: `q-${Date.now()}`,
                  label: "💬 New Question",
                  prompt: "Tell me more about your work."
                };
                setAiChatForm({
                  ...aiChatForm,
                  quickQuestions: [...(aiChatForm.quickQuestions || defaultAiChatSettings.quickQuestions || []), newQ]
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold border border-[#00d2ff]/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {(aiChatForm.quickQuestions || defaultAiChatSettings.quickQuestions || []).map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Chip Label (Button Text)
                    </label>
                    <input
                      type="text"
                      value={q.label}
                      onChange={(e) => {
                        const updated = [...(aiChatForm.quickQuestions || [])];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setAiChatForm({ ...aiChatForm, quickQuestions: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#00d2ff] outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Prompt Sent to AI
                    </label>
                    <input
                      type="text"
                      value={q.prompt}
                      onChange={(e) => {
                        const updated = [...(aiChatForm.quickQuestions || [])];
                        updated[idx] = { ...updated[idx], prompt: e.target.value };
                        setAiChatForm({ ...aiChatForm, quickQuestions: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-slate-200 text-xs focus:border-[#00d2ff] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = (aiChatForm.quickQuestions || []).filter((_, i) => i !== idx);
                    setAiChatForm({ ...aiChatForm, quickQuestions: updated });
                  }}
                  title="Delete Question"
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors self-end sm:self-auto cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Owner Custom Directives / Addendum */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Owner Custom Instructions (AI System Addendum)
            </h3>
            <p className="text-xs text-slate-400">
              Any special notices, limited-time offers, or specific instructions you want the AI to always remember.
            </p>
          </div>

          <textarea
            rows={3}
            value={aiChatForm.systemPromptAddendum || ""}
            onChange={(e) => setAiChatForm({ ...aiChatForm, systemPromptAddendum: e.target.value })}
            placeholder="e.g. Currently offering a free initial consultation on WordPress speed optimization; Tarek is available for urgent e-commerce fixes this week."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-[#00d2ff] outline-none resize-none"
          />
        </div>

        {/* 5. Google Gemini API Key Notice & Guide */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00d2ff]/10 via-[#0066ff]/10 to-[#070d1e] border border-[#00d2ff]/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00d2ff]">
            <Sparkles className="w-4 h-4" />
            <span>Google Gemini AI Engine Integration</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The AI Chat Assistant securely connects to the Gemini API using the server environment variable <code className="px-1.5 py-0.5 rounded bg-black/50 text-cyan-300 font-mono text-[11px]">GEMINI_API_KEY</code> located in <code className="px-1.5 py-0.5 rounded bg-black/50 text-cyan-300 font-mono text-[11px]">.env.local</code>. Your API key is <strong>never exposed</strong> in client-side code or browser requests.
          </p>
          <p className="text-[11px] text-slate-400">
            Get your free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] underline font-bold">Google AI Studio</a>. If no key is set, the assistant automatically uses the built-in dynamic portfolio knowledge engine to answer in Bangla, English, and Banglish!
          </p>
        </div>
      </div>
    );
  }

  return null;
}
