"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Layers,
  User,
  FolderKanban,
  Wrench,
  Cpu,
  Image as ImageIcon,
  Compass,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  X,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  ShieldCheck,
  Bot,
  Save,
  Upload,
  Copy,
  ArrowUp,
  ArrowDown,
  Check,
  Phone,
  Mail,
  RefreshCw,
  BookOpen,
  Award,
  Camera,
  Globe,
  Sliders,
  Menu,
  Film,
  Zap,
  Quote,
  TrendingUp,
  Send,
  ChevronDown,
  ChevronRight,
  Terminal,
  Brain,
  Tag,
  Code2,
  GraduationCap,
  Sparkle,
  HelpCircle,
  MessageCircle,
  Clock,
  MapPin,
  BarChart3,
  Volume2,
} from "lucide-react";
import AdminHomepageCms from "@/components/admin/AdminHomepageCms";
import AdminAboutCms from "@/components/admin/AdminAboutCms";
import AdminServicesCms from "@/components/admin/AdminServicesCms";
import AdminSkillsCms from "@/components/admin/AdminSkillsCms";
import AdminProjectsCms from "@/components/admin/AdminProjectsCms";
import AdminContactSocialCms from "@/components/admin/AdminContactSocialCms";
import AdminNavigationCms from "@/components/admin/AdminNavigationCms";
import AdminSettingsCms from "@/components/admin/AdminSettingsCms";
import AdminMediaLibrary from "@/components/admin/AdminMediaLibrary";
import WebsiteMediaManagerSection from "@/components/admin/WebsiteMediaManagerSection";
import AdminAnalyticsCms from "@/components/admin/AdminAnalyticsCms";
import AdminLoadingSoundCms from "@/components/admin/AdminLoadingSoundCms";
import { useCms } from "@/context/CmsContext";

interface AdminSession {
  authenticated: boolean;
  user: string;
  role?: string;
  loggedInAt?: string;
}

export type CmsTab =
  | "dashboard"
  | "analytics"
  | "homepage"
  | "about-profile"
  | "services"
  | "skills"
  | "projects"
  | "contact-social"
  | "navigation"
  | "settings"
  | "media"
  | "website-media"
  | "loading-sound"
  | "pages"
  | "sections"
  | "hero"
  | "milestones";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { cmsData, updateCms, refreshCms, isLoading: isCmsLoading } = useCms();

  // Authentication State
  const [session, setSession] = useState<AdminSession | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<CmsTab>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // SubPage State for each CMS module
  const [homepageSubPage, setHomepageSubPage] = useState<string>("overview");
  const [aboutSubPage, setAboutSubPage] = useState<string>("overview");
  const [servicesSubPage, setServicesSubPage] = useState<string>("overview");
  const [skillsSubPage, setSkillsSubPage] = useState<string>("overview");
  const [projectsSubPage, setProjectsSubPage] = useState<string>("overview");
  const [contactSubPage, setContactSubPage] = useState<string>("overview");
  const [settingsSubPage, setSettingsSubPage] = useState<string>("overview");

  // Single-open Accordion state: on initial page load, all expandable menus are collapsed (null)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  // Toast System
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
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

  // Media Picker Callback & File Upload Input
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast trigger helper
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((curr) => (curr?.text === text ? null : curr));
    }, 3500);
  };

  // Safe delete modal helper
  const promptDelete = (title: string, description: string, onConfirm: () => void) => {
    setDeleteModal({
      isOpen: true,
      title,
      description,
      onConfirm: () => {
        onConfirm();
        setDeleteModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Auth check on mount with resilient local storage and server session sync
  useEffect(() => {
    let isCancelled = false;

    const verifyAuth = async () => {
      // 1. Instant check from localStorage for zero-delay rendering without flicker
      try {
        const local = localStorage.getItem("admin_session");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed?.authenticated && parsed?.user === "admin") {
            if (!isCancelled) {
              setSession({
                authenticated: true,
                user: parsed.user,
                role: parsed.role || "Administrator",
                loggedInAt: parsed.loggedInAt || new Date().toISOString(),
              });
              setAuthChecking(false);
            }
          }
        }
      } catch {}

      // 2. Validate with backend session cookie
      try {
        const local = localStorage.getItem("admin_session");
        const token = localStorage.getItem("admin_token");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else if (local) {
          try {
            const parsed = JSON.parse(local);
            if (parsed?.authenticated && parsed?.user === "admin") {
              headers["Authorization"] = "Bearer active";
            }
          } catch {}
        }

        const res = await fetch("/api/admin/auth", {
          credentials: "include",
          headers,
        });
        const data = await res.json();
        if (data.authenticated) {
          if (!isCancelled) {
            setSession({
              authenticated: true,
              user: data.user || "admin",
              role: data.role || "Administrator",
              loggedInAt: data.loggedInAt,
            });
            setAuthChecking(false);
          }
        } else {
          // Check if localStorage has valid session fallback
          const local = localStorage.getItem("admin_session");
          let hasValidLocal = false;
          try {
            if (local && JSON.parse(local)?.authenticated) hasValidLocal = true;
          } catch {}

          if (!hasValidLocal) {
            try {
              localStorage.removeItem("admin_session");
      localStorage.removeItem("admin_token");
            } catch {}
            if (!isCancelled) {
              setAuthChecking(false);
              router.replace("/admin/login");
            }
          } else {
            // Re-sync server session cookie if localStorage is valid
            document.cookie = "admin_session=active; path=/; max-age=604800; SameSite=Lax";
            if (!isCancelled) {
              setAuthChecking(false);
            }
          }
        }
      } catch (err) {
        // Fallback: check localStorage
        const local = localStorage.getItem("admin_session");
        let hasValidLocal = false;
        try {
          if (local && JSON.parse(local)?.authenticated) hasValidLocal = true;
        } catch {}

        if (!hasValidLocal && !isCancelled) {
          setAuthChecking(false);
          router.replace("/admin/login");
        } else if (!isCancelled) {
          setAuthChecking(false);
        }
      }
    };

    verifyAuth();

    return () => {
      isCancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("admin_session");
      localStorage.removeItem("admin_token");
      document.cookie = "admin_session=; path=/; max-age=0; SameSite=Lax";
      await fetch("/api/admin/auth", { method: "DELETE" });
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore errors during logout
    } finally {
      router.replace("/admin/login");
    }
  };

  // Open media picker modal or direct file picker
  const openMediaPicker = (callback: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/cms/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success) {
          callback(data.mediaItem.url);
          showToast(`Uploaded ${file.name} successfully!`);
        } else {
          showToast(data.error || "Upload failed", "error");
        }
      } catch (err: any) {
        showToast(err.message || "Upload error", "error");
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  // Handle Generic File Upload from Media Manager Tab
  const handleGenericFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCms();
        showToast(`Uploaded ${file.name} successfully!`);
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Upload error", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (authChecking || !session) {
    return (
      <div className="min-h-screen bg-[#050811] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center shadow-[0_0_25px_rgba(0,210,255,0.3)] animate-pulse mb-4">
          <ShieldCheck className="w-6 h-6 text-[#00d2ff]" />
        </div>
        <p className="text-xs sm:text-sm font-mono tracking-widest text-[#00d2ff] uppercase">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  const totalSkills = cmsData.skills?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0;

  // Sub-items definitions for each major section
  const homepageSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "hero", label: "01. Hero Section", icon: Camera },
    { id: "journey", label: "02. Journey / Collage", icon: Sparkles },
    { id: "services", label: "03. Services Preview", icon: Wrench },
    { id: "skills", label: "04. Skills Preview", icon: Cpu },
    { id: "tools", label: "05. Tools & Tech", icon: Layers },
    { id: "portfolio", label: "06. Portfolio Preview", icon: FolderKanban },
    { id: "why-us", label: "07. Why Choose Me", icon: Zap },
    { id: "about", label: "08. About Preview", icon: User },
    { id: "testimonials", label: "09. Testimonials", icon: Quote },
    { id: "stats", label: "10. Statistics / Numbers", icon: TrendingUp },
    { id: "clients", label: "11. Client Brands", icon: Globe },
    { id: "cta", label: "12. Final CTA", icon: Send },
    { id: "seo", label: "13. Homepage SEO & OG", icon: Globe },
    { id: "theme", label: "14. Design & Visuals", icon: Settings },
  ];

  const aboutSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "hero", label: "01. Hero & Badges", icon: Sparkles },
    { id: "profile", label: "02. Biography Details", icon: User },
    { id: "photos", label: "03. Milestone Gallery", icon: Camera },
    { id: "process", label: "04. Engineering Process", icon: Layers },
    { id: "tech", label: "05. Core Tech Stack", icon: Cpu },
    { id: "education", label: "06. Academic Education", icon: GraduationCap },
    { id: "certifications", label: "07. Verified Credentials", icon: Award },
    { id: "vision", label: "08. Future Vision", icon: Sparkle },
    { id: "cta", label: "09. Closing CTA", icon: Send },
    { id: "stats", label: "10. Milestones by Numbers", icon: TrendingUp },
    { id: "seo", label: "11. Page SEO & OG", icon: Globe },
  ];

  const servicesSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "hero", label: "01. Services Hero", icon: Sparkles },
    { id: "services", label: "02. Services Showcase", icon: Wrench },
    { id: "why-us", label: "03. Why Work With Me", icon: Zap },
    { id: "process", label: "04. Engineering Process", icon: Layers },
    { id: "tech", label: "05. Technologies & Tools", icon: Cpu },
    { id: "faq", label: "06. FAQ Management", icon: HelpCircle },
    { id: "cta", label: "07. Final CTA Banner", icon: Send },
    { id: "footer", label: "08. Footer Controls", icon: Compass },
    { id: "seo", label: "09. Page SEO & OG", icon: Globe },
    { id: "theme", label: "10. Design & Visuals", icon: Settings },
  ];

  const skillsSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "hero", label: "01. Skills Hero", icon: Sparkles },
    { id: "coding", label: "02. Coding & Programming", icon: Code2 },
    { id: "tools", label: "03. Tools & Technologies", icon: Terminal },
    { id: "strengths", label: "04. Core Expertise & Strengths", icon: Layers },
    { id: "learning", label: "05. Currently Learning", icon: Brain },
    { id: "roadmap", label: "06. Growth Roadmap", icon: Compass },
    { id: "footer", label: "07. Footer Controls", icon: Compass },
    { id: "seo", label: "08. Page SEO & OG", icon: Globe },
    { id: "theme", label: "09. Design & Visuals", icon: Settings },
  ];

  const projectsSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "hero", label: "01. Portfolio Hero", icon: Sparkles },
    { id: "search-filters", label: "02. Search & Filters", icon: Search },
    { id: "projects", label: "03. Projects Database", icon: FolderKanban },
    { id: "load-more", label: "04. Load More & Pagination", icon: ChevronDown },
    { id: "visibility-theme", label: "05. Visibility & Theme", icon: Settings },
    { id: "seo", label: "06. Page SEO & OG", icon: Globe },
  ];

  const contactSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "hero", label: "01. Contact Hero", icon: Sparkles },
    { id: "quick-channels", label: "02. Quick Contact Channels", icon: MessageCircle },
    { id: "availability", label: "03. Availability Badges", icon: Clock },
    { id: "direct-reach", label: "04. Direct Reach Cards", icon: Mail },
    { id: "office-hours", label: "05. Location & Working Hours", icon: MapPin },
    { id: "form", label: "06. Contact Form Management", icon: Send },
    { id: "resume", label: "07. Resume Download Section", icon: FileText },
    { id: "social", label: "08. Social Media Hub", icon: Share2 },
    { id: "visibility-theme", label: "09. Visibility & Visuals", icon: Settings },
    { id: "seo", label: "10. Page SEO & OG", icon: Globe },
  ];

  const settingsSubItems = [
    { id: "overview", label: "Overview Hub", icon: Layers },
    { id: "identity", label: "01. Site Identity & Branding", icon: Settings },
    { id: "footer", label: "02. Global Footer Manager", icon: Compass },
    { id: "seo", label: "03. Per-Page SEO & OG", icon: Globe },
    { id: "aichat", label: "04. AI Chat Assistant", icon: Bot },
  ];

  // Helper to get active breadcrumb
  const getCurrentBreadcrumb = () => {
    if (activeTab === "homepage" || activeTab === "sections" || activeTab === "hero" || activeTab === "milestones") {
      const item = homepageSubItems.find((s) => s.id === homepageSubPage);
      return { parent: "Homepage CMS", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "about-profile") {
      const item = aboutSubItems.find((s) => s.id === aboutSubPage);
      return { parent: "About & Profile CMS", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "services") {
      const item = servicesSubItems.find((s) => s.id === servicesSubPage);
      return { parent: "Services Page CMS", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "skills") {
      const item = skillsSubItems.find((s) => s.id === skillsSubPage);
      return { parent: "Skills & Tech CMS", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "projects") {
      const item = projectsSubItems.find((s) => s.id === projectsSubPage);
      return { parent: "Portfolio Projects", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "contact-social") {
      const item = contactSubItems.find((s) => s.id === contactSubPage);
      return { parent: "Contact & Social CMS", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "settings" || activeTab === "pages") {
      const item = settingsSubItems.find((s) => s.id === settingsSubPage);
      return { parent: "Site Settings & SEO", sub: item?.label || "Overview Hub" };
    }
    if (activeTab === "navigation") return { parent: "Global Navigation", sub: "Navbar & Mobile Menu" };
    if (activeTab === "analytics") return { parent: "Website Statistics", sub: "Live Analytics & Engagement" };
    if (activeTab === "media") return { parent: "Media Assets", sub: "Asset Library" };
    if (activeTab === "website-media") return { parent: "Website Media Manager", sub: "Audio & Background Music" };
    if (activeTab === "loading-sound") return { parent: "Media & Audio", sub: "Loading Sound Settings" };
    return { parent: "Admin Dashboard", sub: "Control Center" };
  };

  const breadcrumb = getCurrentBreadcrumb();

  return (
    <div className="min-h-screen bg-[#050811] text-white flex select-none overflow-x-hidden selection:bg-[#00d2ff] selection:text-[#050811]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-[99999] px-4 py-2.5 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] border flex items-center gap-2.5 text-xs font-bold ${
              toastMessage.type === "error"
                ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
                : "bg-[#07132a]/95 border-[#00d2ff]/50 text-[#00d2ff]"
            }`}
          >
            {toastMessage.type === "error" ? (
              <X className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#00d2ff]" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input for Image Uploading */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
        className="hidden"
        onChange={handleGenericFileUpload}
      />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* FIXED LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 xl:w-72 bg-[#060b19] border-r border-[#00d2ff]/20 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0 shadow-[0_0_50px_rgba(0,210,255,0.25)]" : "-translate-x-full"
        }`}
      >
        {/* Brand Area */}
        <div className="p-5 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#818cf8] opacity-75 blur-sm" />
                <div className="relative w-10 h-10 rounded-xl bg-[#070d1e] border border-[#00d2ff]/50 flex items-center justify-center font-black text-sm text-[#00d2ff]">
                  TR
                </div>
              </div>

              <div>
                <h1 className="text-sm font-extrabold text-white tracking-tight">Tarek Rahaman</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#00d2ff]/90">
                    Production CMS
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items List with Expandable Nested Submenus */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            A-to-Z Website CMS
          </div>

          {/* 1. Dashboard Overview */}
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setOpenAccordion(null);
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === "dashboard" ? "text-[#00d2ff]" : "text-slate-400 group-hover:text-white"}`} />
            <span>Dashboard</span>
          </button>

          {/* 1.5. Live Website Analytics System */}
          <button
            onClick={() => {
              setActiveTab("analytics");
              setOpenAccordion(null);
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === "analytics" ? "text-[#00d2ff]" : "text-slate-400 group-hover:text-white"}`} />
              <span className="truncate">Website Analytics</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Live
            </span>
          </button>

          {/* 2. Homepage CMS (Expandable 12 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "homepage") {
                  setActiveTab("homepage");
                  setHomepageSubPage("overview");
                  setOpenAccordion("homepage");
                } else {
                  toggleAccordion("homepage");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "homepage" || activeTab === "sections" || activeTab === "hero" || activeTab === "milestones"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">Homepage CMS</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                  12
                </span>
                {openAccordion === "homepage" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "homepage" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-[#00d2ff]/20 ml-3.5 overflow-hidden"
                >
                  {homepageSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive =
                      (activeTab === "homepage" || activeTab === "sections" || activeTab === "hero" || activeTab === "milestones") &&
                      homepageSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("homepage");
                          setHomepageSubPage(sub.id);
                          setOpenAccordion("homepage");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-[#00d2ff]/20 text-[#00d2ff] font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-[#00d2ff]" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. About & Profile (Expandable 10 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "about-profile") {
                  setActiveTab("about-profile");
                  setAboutSubPage("overview");
                  setOpenAccordion("about");
                } else {
                  toggleAccordion("about");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "about-profile"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">About &amp; Profile</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#818cf8]/10 text-[#818cf8] border border-[#818cf8]/20">
                  10
                </span>
                {openAccordion === "about" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "about" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-[#818cf8]/20 ml-3.5 overflow-hidden"
                >
                  {aboutSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === "about-profile" && aboutSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("about-profile");
                          setAboutSubPage(sub.id);
                          setOpenAccordion("about");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-[#818cf8]/20 text-[#818cf8] font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-[#818cf8]" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Services Page (Expandable 8 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "services") {
                  setActiveTab("services");
                  setServicesSubPage("overview");
                  setOpenAccordion("services");
                } else {
                  toggleAccordion("services");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "services"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Wrench className="w-4 h-4 shrink-0" />
                <span className="truncate">Services Page</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  8
                </span>
                {openAccordion === "services" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "services" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-purple-500/20 ml-3.5 overflow-hidden"
                >
                  {servicesSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === "services" && servicesSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("services");
                          setServicesSubPage(sub.id);
                          setOpenAccordion("services");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-purple-500/20 text-purple-300 font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-purple-400" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Skills & Tech (Expandable 7 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "skills") {
                  setActiveTab("skills");
                  setSkillsSubPage("overview");
                  setOpenAccordion("skills");
                } else {
                  toggleAccordion("skills");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "skills"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Cpu className="w-4 h-4 shrink-0" />
                <span className="truncate">Skills &amp; Tech</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  7
                </span>
                {openAccordion === "skills" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "skills" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-cyan-500/20 ml-3.5 overflow-hidden"
                >
                  {skillsSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === "skills" && skillsSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("skills");
                          setSkillsSubPage(sub.id);
                          setOpenAccordion("skills");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-cyan-500/20 text-cyan-300 font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-cyan-400" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Portfolio Projects (Expandable 3 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "projects") {
                  setActiveTab("projects");
                  setProjectsSubPage("overview");
                  setOpenAccordion("projects");
                } else {
                  toggleAccordion("projects");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "projects"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <FolderKanban className="w-4 h-4 shrink-0" />
                <span className="truncate">Portfolio Projects</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                  {cmsData.projects?.length || 0}
                </span>
                {openAccordion === "projects" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "projects" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-[#00d2ff]/20 ml-3.5 overflow-hidden"
                >
                  {projectsSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === "projects" && projectsSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("projects");
                          setProjectsSubPage(sub.id);
                          setOpenAccordion("projects");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-[#00d2ff]/20 text-[#00d2ff] font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-[#00d2ff]" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 7. Contact & Social (Expandable 6 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "contact-social") {
                  setActiveTab("contact-social");
                  setContactSubPage("overview");
                  setOpenAccordion("contact");
                } else {
                  toggleAccordion("contact");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "contact-social"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Share2 className="w-4 h-4 shrink-0" />
                <span className="truncate">Contact &amp; Social</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  6
                </span>
                {openAccordion === "contact" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "contact" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-emerald-500/20 ml-3.5 overflow-hidden"
                >
                  {contactSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeTab === "contact-social" && contactSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("contact-social");
                          setContactSubPage(sub.id);
                          setOpenAccordion("contact");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-emerald-500/20 text-emerald-300 font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-emerald-400" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 8. Global Navigation Menu */}
          <button
            onClick={() => {
              setActiveTab("navigation");
              setOpenAccordion(null);
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
              activeTab === "navigation"
                ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Compass className="w-4 h-4 shrink-0" />
              <span className="truncate">Navigation Menu</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
              {cmsData.navigation?.length || 6}
            </span>
          </button>

          {/* 9. Site Settings & SEO (Expandable 3 Sub-Pages) */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                if (activeTab !== "settings" && activeTab !== "pages") {
                  setActiveTab("settings");
                  setSettingsSubPage("overview");
                  setOpenAccordion("settings");
                } else {
                  toggleAccordion("settings");
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
                activeTab === "settings" || activeTab === "pages"
                  ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Settings className="w-4 h-4 shrink-0" />
                <span className="truncate">Site Settings &amp; SEO</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  4
                </span>
                {openAccordion === "settings" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openAccordion === "settings" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-4 pr-1 py-1 space-y-0.5 border-l border-amber-500/20 ml-3.5 overflow-hidden"
                >
                  {settingsSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive =
                      (activeTab === "settings" || activeTab === "pages") && settingsSubPage === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab("settings");
                          setSettingsSubPage(sub.id);
                          setOpenAccordion("settings");
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSubActive
                            ? "bg-amber-500/20 text-amber-300 font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-amber-400" : "text-slate-500"}`} />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 10. Media Library */}
          <button
            onClick={() => {
              setActiveTab("media");
              setOpenAccordion(null);
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
              activeTab === "media"
                ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">Media Assets</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
              {cmsData.media?.length || 0}
            </span>
          </button>

          {/* 11. Website Media Manager (Audio & YouTube background music) */}
          <button
            onClick={() => {
              setActiveTab("website-media");
              setOpenAccordion(null);
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
              activeTab === "website-media"
                ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Film className="w-4 h-4 shrink-0" />
              <span className="truncate">Website Media Manager</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
              {(cmsData.mediaManager?.videos?.length || 0) +
                (cmsData.mediaManager?.audios?.length || 0) +
                (cmsData.mediaManager?.youtubeAudios?.length || 0)}
            </span>
          </button>

          {/* 12. Loading Sound Settings (Transition Audio) */}
          <button
            onClick={() => {
              setActiveTab("loading-sound");
              setOpenAccordion(null);
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative group ${
              activeTab === "loading-sound"
                ? "bg-gradient-to-r from-[#00d2ff]/20 to-[#00d2ff]/05 text-[#00d2ff] border-l-2 border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.15)] font-bold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Volume2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Loading Sound</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                cmsData.loadingSoundSettings?.enabled === false
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              }`}
            >
              {cmsData.loadingSoundSettings?.enabled === false ? "Off" : "FX"}
            </span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/[0.08] space-y-2 bg-[#050811]/60">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#070d1e] hover:bg-[#00d2ff]/10 border border-[#00d2ff]/25 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span>View Live Portfolio</span>
            </span>
            <span className="text-[10px] font-mono text-[#00d2ff]">VISIT</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#060b19]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white capitalize flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span>{breadcrumb.parent}</span>
                  <span className="text-[#00d2ff] font-mono text-xs">/</span>
                  <span className="text-xs sm:text-sm text-[#00d2ff] font-bold">
                    {breadcrumb.sub}
                  </span>
                </span>
                <span className="text-[11px] font-mono font-normal text-slate-400 hidden sm:inline">
                  // Portfolio Management
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/25 text-[11px] font-mono text-[#00d2ff]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
              <span>Storage: Persistent JSON</span>
            </div>

            <button
              onClick={async () => {
                await refreshCms();
                showToast("CMS Data refreshed from disk.");
              }}
              title="Refresh Data"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isCmsLoading ? "animate-spin text-[#00d2ff]" : ""}`} />
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0088ff] text-white text-xs font-bold shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_22px_rgba(0,210,255,0.7)] transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Preview</span>
            </Link>
          </div>
        </header>

        {/* Tab Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070e24] via-[#091536] to-[#050b1a] border border-[#00d2ff]/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,210,255,0.12)]">
                <div className="relative z-10 max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[10px] font-mono font-bold uppercase text-[#00d2ff] mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>A-to-Z Production CMS Ready</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#818cf8]">Portfolio CMS</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Complete nested control over every public page, section, text, project, service, skill, media asset, and background audio without touching code.
                  </p>
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveTab("homepage");
                        setHomepageSubPage("overview");
                        setOpenAccordion("homepage");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] shadow-[0_0_20px_rgba(0,210,255,0.45)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Edit Homepage (12 Sections)</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("projects");
                        setProjectsSubPage("overview");
                        setOpenAccordion("projects");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-[#070e24] border border-[#00d2ff]/30 hover:border-[#00d2ff] cursor-pointer"
                    >
                      <FolderKanban className="w-4 h-4 text-[#00d2ff]" />
                      <span>Portfolio Projects</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("analytics");
                        setOpenAccordion(null);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.45)] cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Website Analytics</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("website-media");
                        setOpenAccordion(null);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-[#070e24] border border-[#00d2ff]/30 hover:border-[#00d2ff] cursor-pointer"
                    >
                      <Film className="w-4 h-4 text-[#00d2ff]" />
                      <span>Background Audio</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("loading-sound");
                        setOpenAccordion(null);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-[#070e24] border border-[#00d2ff]/30 hover:border-[#00d2ff] cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#00d2ff]" />
                      <span>Loading Sound FX</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                  { label: "Homepage", count: 12, tab: "homepage" as CmsTab, icon: Layers, accordion: "homepage" },
                  { label: "Projects", count: cmsData.projects?.length || 0, tab: "projects" as CmsTab, icon: FolderKanban, accordion: "projects" },
                  { label: "Services", count: cmsData.services?.length || 0, tab: "services" as CmsTab, icon: Wrench, accordion: "services" },
                  { label: "Skills", count: totalSkills, tab: "skills" as CmsTab, icon: Cpu, accordion: "skills" },
                  { label: "Media Assets", count: cmsData.media?.length || 0, tab: "media" as CmsTab, icon: ImageIcon, accordion: null },
                  { label: "Nav Items", count: cmsData.navigation?.length || 6, tab: "navigation" as CmsTab, icon: Compass, accordion: null },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      onClick={() => {
                        setActiveTab(stat.tab);
                        setOpenAccordion(stat.accordion);
                      }}
                      className="p-4 rounded-2xl bg-[#070d1e]/90 border border-white/10 hover:border-[#00d2ff]/40 transition-all cursor-pointer group shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xl sm:text-2xl font-black text-white font-mono">{stat.count}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-300">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Dedicated Page CMS Quick Jump Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => {
                    setActiveTab("homepage");
                    setHomepageSubPage("overview");
                    setOpenAccordion("homepage");
                  }}
                  className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 hover:border-[#00d2ff] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#00d2ff] transition-colors">Homepage CMS (12 Sections)</h4>
                      <p className="text-[11px] text-slate-400">Hero, Moments collage, Services, Tech, Process, Testimonials, Clients &amp; CTA</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("about-profile");
                    setAboutSubPage("overview");
                    setOpenAccordion("about");
                  }}
                  className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#818cf8]/20 hover:border-[#818cf8] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[#818cf8]/10 border border-[#818cf8]/30 flex items-center justify-center text-[#818cf8]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#818cf8] transition-colors">About &amp; Profile CMS (10 Sub-Pages)</h4>
                      <p className="text-[11px] text-slate-400">Hero portrait stack, Education, Verified Certifications, Future Vision &amp; CTA</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("services");
                    setServicesSubPage("overview");
                    setOpenAccordion("services");
                  }}
                  className="p-5 rounded-2xl bg-[#070d1e]/90 border border-purple-500/20 hover:border-purple-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Services Page CMS (11 Sub-Pages)</h4>
                      <p className="text-[11px] text-slate-400">Hero, 3D Showcase, Why Work With Me, Process, Tech Stack, FAQs, CTA, Footer, SEO &amp; Visual Controls</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("skills");
                    setSkillsSubPage("overview");
                    setOpenAccordion("skills");
                  }}
                  className="p-5 rounded-2xl bg-[#070d1e]/90 border border-cyan-500/20 hover:border-cyan-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Skills &amp; Tech CMS (10 Sub-Pages)</h4>
                      <p className="text-[11px] text-slate-400">Hero, Coding Languages, Tools, Core Strengths, Learning, Roadmap, Footer, SEO &amp; Visual Controls</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("projects");
                    setProjectsSubPage("overview");
                    setOpenAccordion("projects");
                  }}
                  className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 hover:border-[#00d2ff] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#00d2ff] transition-colors">Portfolio Page CMS (6 Sub-Pages)</h4>
                      <p className="text-[11px] text-slate-400">Hero Showcase, Category Filters, Projects Database, Pagination, Theme &amp; SEO</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("contact-social");
                    setContactSubPage("overview");
                    setOpenAccordion("contact");
                  }}
                  className="p-5 rounded-2xl bg-[#070d1e]/90 border border-emerald-500/20 hover:border-emerald-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Contact Page &amp; Social CMS (10 Sub-Pages)</h4>
                      <p className="text-[11px] text-slate-400">Hero, Quick Channels, Badges, Direct Reach, Form, Schedule, Resume, Theme &amp; SEO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE CMS (12 COMPLETE SECTIONS) */}
          {(activeTab === "homepage" || activeTab === "sections" || activeTab === "hero" || activeTab === "milestones") && (
            <AdminHomepageCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={homepageSubPage}
              onSubPageChange={(page) => {
                setHomepageSubPage(page);
                setOpenAccordion("homepage");
              }}
            />
          )}

          {/* TAB 3: ABOUT & PROFILE CMS (10 COMPLETE SECTIONS) */}
          {activeTab === "about-profile" && (
            <AdminAboutCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={aboutSubPage}
              onSubPageChange={(page) => {
                setAboutSubPage(page);
                setOpenAccordion("about");
              }}
            />
          )}

          {/* TAB 4: SERVICES PAGE CMS (8 COMPLETE SECTIONS) */}
          {activeTab === "services" && (
            <AdminServicesCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={servicesSubPage}
              onSubPageChange={(page) => {
                setServicesSubPage(page);
                setOpenAccordion("services");
              }}
            />
          )}

          {/* TAB 5: SKILLS & TECHNOLOGIES CMS (7 COMPLETE SECTIONS) */}
          {activeTab === "skills" && (
            <AdminSkillsCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={skillsSubPage}
              onSubPageChange={(page) => {
                setSkillsSubPage(page);
                setOpenAccordion("skills");
              }}
            />
          )}

          {/* TAB 6: PORTFOLIO PROJECTS CMS (3 COMPLETE SECTIONS) */}
          {activeTab === "projects" && (
            <AdminProjectsCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={projectsSubPage}
              onSubPageChange={(page) => {
                setProjectsSubPage(page);
                setOpenAccordion("projects");
              }}
            />
          )}

          {/* TAB 7: CONTACT & SOCIAL CMS (6 COMPLETE SECTIONS) */}
          {activeTab === "contact-social" && (
            <AdminContactSocialCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={contactSubPage}
              onSubPageChange={(page) => {
                setContactSubPage(page);
                setOpenAccordion("contact");
              }}
            />
          )}

          {/* TAB 1.5: WEBSITE ANALYTICS & VISITOR ENGAGEMENT */}
          {activeTab === "analytics" && (
            <AdminAnalyticsCms showToast={showToast} />
          )}

          {/* TAB 8: GLOBAL NAVIGATION CMS */}
          {activeTab === "navigation" && (
            <AdminNavigationCms showToast={showToast} />
          )}

          {/* TAB 9: SITE SETTINGS & SEO (3 COMPLETE SECTIONS) */}
          {(activeTab === "settings" || activeTab === "pages") && (
            <AdminSettingsCms
              showToast={showToast}
              openMediaPicker={openMediaPicker}
              activeSubPage={settingsSubPage}
              onSubPageChange={(page) => {
                setSettingsSubPage(page);
                setOpenAccordion("settings");
              }}
            />
          )}

          {/* TAB 10: MEDIA ASSETS LIBRARY */}
          {activeTab === "media" && (
            <AdminMediaLibrary showToast={showToast} openMediaPicker={openMediaPicker} />
          )}

          {/* TAB 11: WEBSITE MEDIA MANAGER (AUDIO / YOUTUBE BACKGROUND MUSIC) */}
          {activeTab === "website-media" && (
            <WebsiteMediaManagerSection
              cmsData={cmsData}
              updateCms={updateCms}
              showToast={showToast}
              promptDelete={promptDelete}
            />
          )}

          {/* TAB 12: LOADING SOUND SETTINGS (TRANSITION AUDIO) */}
          {activeTab === "loading-sound" && (
            <AdminLoadingSoundCms
              cmsData={cmsData}
              updateCms={updateCms}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* SAFE DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1329] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[0_0_50px_rgba(244,63,94,0.2)]"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{deleteModal.title || "Confirm Removal"}</h3>
                  <p className="text-[11px] font-mono text-rose-300">Irreversible Deletion</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {deleteModal.description || "Are you sure you want to permanently delete this item from your CMS database?"}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteModal.onConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
                >
                  Delete Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
