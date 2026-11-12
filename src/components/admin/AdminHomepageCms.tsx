"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
  Layers,
  Wrench,
  Cpu,
  FolderKanban,
  Zap,
  User,
  Quote,
  TrendingUp,
  Globe,
  Send,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Eye,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  X,
  ChevronRight,
  ArrowLeft,
  Star,
  Copy,
  Sliders,
  SlidersHorizontal,
  Code2,
  Settings,
  Monitor,
  Download,
  Award,
  Briefcase,
  ShieldCheck,
  Check,
  MapPin,
  ChevronDown,
  Search,
  Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import BrandIconRenderer, {
  BRAND_ICON_OPTIONS,
  getDefaultBrandIcon,
  BrandIconOption
} from "@/components/ui/BrandIconRenderer";
import {
  CollagePhotoItem,
  TestimonialItem,
  StatItem,
  ProcessStep,
  ClientBrand,
  ProjectItem,
  ServiceItem,
  SkillCategory,
  SkillItem,
  ProjectCategory,
  HomeJourneyHeader,
  HomeSectionHeader,
  HomePortfolioSettings,
  HomeAboutSettings,
  HomeStatsSettings,
  HomeCtaSettings,
  HomeThemeSettings,
  CmsSection,
  CmsHero
} from "@/types/portfolio";
import { defaultCmsData } from "@/lib/cms-default-data";

interface AdminHomepageCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type HomepageSectionKey =
  | "overview"
  | "hero"
  | "journey"
  | "services"
  | "skills"
  | "tools"
  | "portfolio"
  | "why-us"
  | "about"
  | "testimonials"
  | "stats"
  | "clients"
  | "cta"
  | "seo"
  | "theme";

const AVAILABLE_BADGE_ICONS: { value: string; label: string }[] = [
  { value: "Sparkles", label: "Sparkles / Creative" },
  { value: "Award", label: "Award / Certification" },
  { value: "ShieldCheck", label: "Shield / Security" },
  { value: "Code2", label: "Code / Software" },
  { value: "Cpu", label: "CPU / Data Science" },
  { value: "Zap", label: "Zap / Speed & High Performance" },
  { value: "Layers", label: "Layers / Architecture" },
  { value: "Globe", label: "Globe / Web Worldwide" },
  { value: "User", label: "User / Profile" },
  { value: "Wrench", label: "Wrench / Engineering" },
  { value: "FolderKanban", label: "Folder / Portfolio" },
  { value: "TrendingUp", label: "Trending / Statistics" },
  { value: "Quote", label: "Quote / Testimonials" },
  { value: "Send", label: "Send / Contact" },
  { value: "Download", label: "Download / CV" },
];

const BADGE_ICON_COMPONENTS: Record<string, any> = {
  Sparkles,
  Award,
  ShieldCheck,
  Code2,
  Cpu,
  Zap,
  Layers,
  Globe,
  User,
  Wrench,
  FolderKanban,
  TrendingUp,
  Quote,
  Send,
  Download,
};

function BrandCardEditor({
  brand,
  idx,
  onChange,
  onDelete,
  openMediaPicker,
  showToast,
}: {
  brand: ClientBrand;
  idx: number;
  onChange: (updated: ClientBrand) => void;
  onDelete: () => void;
  openMediaPicker: (cb: (url: string) => void) => void;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}) {
  const [iconSearch, setIconSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isUploading, setIsUploading] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeIconName = brand.iconName || getDefaultBrandIcon(brand);
  const hasCustomLogo = Boolean(brand.logoUrl && brand.logoUrl.trim().length > 0);

  const categories = [
    "All",
    "E-Commerce & Retail",
    "Luxury & Lifestyle",
    "Hospitality & Travel",
    "EdTech & Learning",
    "Tech & SaaS",
    "Business & Enterprise",
  ];

  const filteredIcons = BRAND_ICON_OPTIONS.filter((opt) => {
    if (selectedCategory !== "All" && opt.category !== selectedCategory) return false;
    if (!iconSearch.trim()) return true;
    const q = iconSearch.toLowerCase();
    return (
      opt.name.toLowerCase().includes(q) ||
      opt.label.toLowerCase().includes(q) ||
      opt.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (res.ok && data.success && data.mediaItem?.url) {
        onChange({
          ...brand,
          logoUrl: data.mediaItem.url,
          logoAlt: brand.logoAlt || `${brand.name} Logo`,
        });
        showToast(`Uploaded logo for "${brand.name}"!`);
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to upload logo", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveCustomLogo = () => {
    onChange({ ...brand, logoUrl: "" });
    showToast(`Removed custom logo. Reverted to default ${activeIconName} icon.`);
  };

  const handleResetToDefaultIcon = () => {
    const recommended = getDefaultBrandIcon(brand);
    onChange({ ...brand, iconName: recommended });
    showToast(`Reset icon to recommended default: ${recommended}`);
  };

  return (
    <div
      className={`p-6 rounded-2xl bg-[#050914] border transition-all duration-300 ${
        brand.active !== false
          ? "border-white/10 hover:border-[#00d2ff]/40 shadow-lg"
          : "border-white/5 opacity-70"
      }`}
    >
      {/* Hidden File Input for Direct Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Card Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08] mb-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-xs font-mono font-bold text-[#00d2ff] flex items-center justify-center">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{brand.name || "Untitled Brand"}</span>
              {brand.active !== false ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-500/15 border border-slate-500/30 text-[10px] font-mono text-slate-400">
                  Hidden / Inactive
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {brand.industry || "No industry specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active / Inactive switch */}
          <button
            type="button"
            onClick={() => onChange({ ...brand, active: brand.active === false ? true : false })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              brand.active !== false
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {brand.active !== false ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Hidden</span>
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 cursor-pointer transition-colors"
            title="Delete Brand"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT COLUMN: BRAND INFO & DISPLAY SETTINGS (5 Cols)      */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-[11px] uppercase font-mono text-slate-400 block mb-1.5 font-semibold">
              Brand Name
            </label>
            <input
              type="text"
              value={brand.name || ""}
              onChange={(e) => onChange({ ...brand, name: e.target.value, label: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              placeholder="e.g. Naogaon Mango Bazar"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-mono text-slate-400 block mb-1.5 font-semibold">
              Industry / Category Tag
            </label>
            <input
              type="text"
              value={brand.industry || ""}
              onChange={(e) => onChange({ ...brand, industry: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              placeholder="e.g. E-Commerce Fruit Hub"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-mono text-slate-400 block mb-1.5 font-semibold flex items-center justify-between">
              <span>Website Destination URL</span>
              <span className="text-[10px] text-slate-500 lowercase">(optional link)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={brand.websiteUrl || ""}
                onChange={(e) => onChange({ ...brand, websiteUrl: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                placeholder="https://example.com"
              />
              <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Display Settings Subcard */}
          <div className="p-4 rounded-xl bg-[#080e1e]/90 border border-white/[0.08] space-y-3">
            <h5 className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span>Card Display Settings</span>
            </h5>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Logo / Icon Size
                </label>
                <select
                  value={brand.logoSize || "md"}
                  onChange={(e) =>
                    onChange({
                      ...brand,
                      logoSize: e.target.value as "sm" | "md" | "lg",
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] cursor-pointer"
                >
                  <option value="sm">Small (24px)</option>
                  <option value="md">Medium (32px)</option>
                  <option value="lg">Large (40px)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Logo Fit Mode
                </label>
                <select
                  value={brand.fitMode || "contain"}
                  onChange={(e) =>
                    onChange({
                      ...brand,
                      fitMode: e.target.value as "contain" | "cover",
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] cursor-pointer"
                >
                  <option value="contain">Contain (Best for Logos)</option>
                  <option value="cover">Cover (Full Bleed)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={brand.showName !== false}
                  onChange={(e) => onChange({ ...brand, showName: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#00d2ff] rounded cursor-pointer"
                />
                <span>Show Brand Name on Orbit Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={Boolean(brand.showIndustry)}
                  onChange={(e) => onChange({ ...brand, showIndustry: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#00d2ff] rounded cursor-pointer"
                />
                <span>Show Industry Tag Subtitle</span>
              </label>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: BRAND LOGO / WEBSITE ICON MANAGEMENT (7)   */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#080e1e] border border-[#00d2ff]/25 space-y-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div>
                <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00d2ff]" />
                  <span>BRAND LOGO / WEBSITE ICON</span>
                </h5>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Priority 1: Custom Logo → Priority 2: Default Industry Icon
                </p>
              </div>

              {/* Status Indicator */}
              {hasCustomLogo ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Custom Logo Active</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                  <Sparkles className="w-3 h-3 text-[#00d2ff]" />
                  <span>Default Website Icon Active</span>
                </span>
              )}
            </div>

            {/* Current Visual Preview Display */}
            <div className="p-4 rounded-xl bg-[#050914] border border-white/[0.08] flex items-center gap-5">
              {/* Circular Hologram Orb Preview (Matches live homepage orbital card!) */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#081126]/95 border-2 border-[#00d2ff]/40 shadow-[0_0_20px_rgba(0,217,255,0.25)] flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
                  {hasCustomLogo ? (
                    <div className="w-10 h-10 relative flex items-center justify-center">
                      <img
                        src={normalizeImageUrl(brand.logoUrl)}
                        alt={brand.logoAlt || brand.name}
                        className={`w-full h-full ${
                          brand.fitMode === "cover" ? "object-cover rounded-full" : "object-contain"
                        } drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]`}
                      />
                    </div>
                  ) : (
                    <BrandIconRenderer
                      iconName={brand.iconName}
                      brandName={brand.name}
                      industry={brand.industry}
                      className="w-8 h-8"
                    />
                  )}
                  {brand.showName !== false && (
                    <span className="text-[8px] font-bold text-white line-clamp-1 mt-1 px-1">
                      {brand.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Info text beside preview */}
              <div className="space-y-1.5 text-xs flex-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Current Display:</span>
                  <span className="text-[#00d2ff] font-mono">
                    {hasCustomLogo ? "Custom Uploaded Logo" : `Default Icon (${activeIconName})`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {hasCustomLogo
                    ? "Your custom logo is rendered with priority on the live homepage orbit."
                    : `No custom logo uploaded yet. Displaying the relevant ${activeIconName} website icon based on ${
                        brand.industry || "brand category"
                      }.`}
                </p>
                {hasCustomLogo && (
                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-sm">
                    Path: {brand.logoUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Logo Management Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-xs font-bold text-[#00d2ff] cursor-pointer transition-colors shadow-[0_0_12px_rgba(0,210,255,0.15)] disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {isUploading
                    ? "Uploading..."
                    : hasCustomLogo
                    ? "Replace Logo"
                    : "Upload Logo"}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  openMediaPicker((url) => {
                    onChange({
                      ...brand,
                      logoUrl: url,
                      logoAlt: brand.logoAlt || `${brand.name} Logo`,
                    });
                    showToast(`Selected logo for "${brand.name}" from Media Assets!`);
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-bold text-purple-300 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Select from Media Assets</span>
              </button>

              {hasCustomLogo && (
                <button
                  type="button"
                  onClick={handleRemoveCustomLogo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-300 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Custom Logo</span>
                </button>
              )}
            </div>

            {/* Image Path URL & Alt Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Logo Image Path / URL
                </label>
                <input
                  type="text"
                  value={brand.logoUrl || ""}
                  onChange={(e) => onChange({ ...brand, logoUrl: e.target.value })}
                  placeholder="/uploads/my-brand-logo.png"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Logo Alt Text
                </label>
                <input
                  type="text"
                  value={brand.logoAlt || ""}
                  onChange={(e) => onChange({ ...brand, logoAlt: e.target.value })}
                  placeholder={`e.g. ${brand.name} official logo`}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>
            </div>

            {/* ==================================================== */}
            {/* DEFAULT WEBSITE ICON SELECTOR SYSTEM                 */}
            {/* ==================================================== */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    DEFAULT WEBSITE ICON SELECTOR
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#00d2ff]">
                    {activeIconName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefaultIcon}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-[11px] font-bold text-[#00d2ff] cursor-pointer transition-colors"
                    title="Calculate best matching icon automatically based on brand name and industry"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to Industry Default</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowIconGrid(!showIconGrid)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-slate-200 cursor-pointer"
                  >
                    <span>{showIconGrid ? "Collapse Icons" : "Browse All Icons"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showIconGrid ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Icon Selector Grid (Always searchable or expandable) */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(e) => {
                        setIconSearch(e.target.value);
                        if (!showIconGrid) setShowIconGrid(true);
                      }}
                      placeholder="Search icons (e.g. mango, hotel, diamond, code, fashion, learning)..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 text-[10px] font-mono">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          if (!showIconGrid) setShowIconGrid(true);
                        }}
                        className={`px-2 py-1 rounded-md shrink-0 cursor-pointer transition-colors ${
                          selectedCategory === cat
                            ? "bg-[#00d2ff] text-[#050811] font-bold shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered Icon Grid */}
                {(showIconGrid || iconSearch.trim().length > 0) && (
                  <div className="p-3 rounded-xl bg-[#050914] border border-white/10 max-h-56 overflow-y-auto space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {filteredIcons.map((opt) => {
                        const isSelected = activeIconName === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => {
                              onChange({ ...brand, iconName: opt.name });
                              showToast(`Selected "${opt.label}" as default icon`);
                            }}
                            className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-[#00d2ff]/20 border-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.3)] text-white"
                                : "bg-[#080e1e] border-white/5 hover:border-white/20 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div className="shrink-0">
                              <BrandIconRenderer iconName={opt.name} className="w-5 h-5" />
                            </div>
                            <div className="truncate text-[10px]">
                              <div className="font-bold truncate">{opt.name}</div>
                              <div className="text-[8.5px] text-slate-400 truncate">
                                {opt.category}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {filteredIcons.length === 0 && (
                      <p className="text-center text-xs text-slate-500 py-3">
                        No icons found matching "{iconSearch}".
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminHomepageCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminHomepageCmsProps) {
  const { cmsData, updateCms } = useCms();

  // Internal or synchronized subpage state
  const [internalSubPage, setInternalSubPage] = useState<HomepageSectionKey>("overview");
  const activeSubPage = (externalSubPage as HomepageSectionKey) || internalSubPage;

  const setActiveSubPage = (page: HomepageSectionKey) => {
    setInternalSubPage(page);
    if (externalSetSubPage) {
      externalSetSubPage(page);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // ---------------------------------------------------------------------------
  // Local Editable States
  // ---------------------------------------------------------------------------
  const [heroForm, setHeroForm] = useState<CmsHero>({
    ...defaultCmsData.hero,
    ...(cmsData.hero || {})
  });

  const [sectionsList, setSectionsList] = useState<CmsSection[]>(
    cmsData.homeSections && cmsData.homeSections.length > 0
      ? [...cmsData.homeSections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : defaultCmsData.homeSections
  );

  const [journeyHeader, setJourneyHeader] = useState<HomeJourneyHeader>({
    ...defaultCmsData.homeJourneyHeader,
    ...(cmsData.homeJourneyHeader || {})
  });
  const [photos, setPhotos] = useState<CollagePhotoItem[]>([
    ...(cmsData.milestonesPhotos && cmsData.milestonesPhotos.length > 0
      ? cmsData.milestonesPhotos
      : defaultCmsData.milestonesPhotos || [])
  ]);

  const [servicesHeader, setServicesHeader] = useState<HomeSectionHeader>({
    ...defaultCmsData.homeServicesHeader,
    ...(cmsData.homeServicesHeader || {})
  });
  const [services, setServices] = useState<ServiceItem[]>([
    ...(cmsData.services && cmsData.services.length > 0
      ? cmsData.services
      : defaultCmsData.services || [])
  ]);

  const [skillsHeader, setSkillsHeader] = useState<HomeSectionHeader>({
    ...defaultCmsData.homeSkillsHeader,
    ...(cmsData.homeSkillsHeader || {})
  });
  const [toolsHeader, setToolsHeader] = useState<HomeSectionHeader>({
    ...defaultCmsData.homeToolsHeader,
    ...(cmsData.homeToolsHeader || {})
  });
  const [skills, setSkills] = useState<SkillCategory[]>([
    ...(cmsData.skills && cmsData.skills.length > 0
      ? cmsData.skills
      : defaultCmsData.skills || [])
  ]);

  const [portfolioSettings, setPortfolioSettings] = useState<HomePortfolioSettings>({
    ...defaultCmsData.homePortfolioSettings,
    ...(cmsData.homePortfolioSettings || {})
  });
  const [projects, setProjects] = useState<ProjectItem[]>([
    ...(cmsData.projects && cmsData.projects.length > 0
      ? cmsData.projects
      : defaultCmsData.projects || [])
  ]);

  const [workflowHeader, setWorkflowHeader] = useState<HomeSectionHeader>({
    ...defaultCmsData.homeWorkflowHeader,
    ...(cmsData.homeWorkflowHeader || {})
  });
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    ...(cmsData.processSteps && cmsData.processSteps.length > 0
      ? cmsData.processSteps
      : defaultCmsData.processSteps || [])
  ]);

  const [aboutSettings, setAboutSettings] = useState<HomeAboutSettings>({
    ...defaultCmsData.homeAboutSettings,
    ...(cmsData.homeAboutSettings || {})
  });

  const [testimonialsHeader, setTestimonialsHeader] = useState<HomeSectionHeader>({
    ...defaultCmsData.homeTestimonialsHeader,
    ...(cmsData.homeTestimonialsHeader || {})
  });
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    ...(cmsData.testimonials && cmsData.testimonials.length > 0
      ? cmsData.testimonials
      : defaultCmsData.testimonials || [])
  ]);

  const [statsSettings, setStatsSettings] = useState<HomeStatsSettings>({
    ...defaultCmsData.homeStatsSettings,
    ...(cmsData.homeStatsSettings || {})
  });
  const [stats, setStats] = useState<StatItem[]>([
    ...(cmsData.stats && cmsData.stats.length > 0
      ? cmsData.stats
      : defaultCmsData.stats || [])
  ]);

  const [clientsHeader, setClientsHeader] = useState<HomeSectionHeader>({
    ...defaultCmsData.homeClientsHeader,
    ...(cmsData.homeClientsHeader || {})
  });
  const [clientBrands, setClientBrands] = useState<ClientBrand[]>([
    ...(cmsData.clientBrands && cmsData.clientBrands.length > 0
      ? cmsData.clientBrands
      : defaultCmsData.clientBrands || [])
  ]);

  const [ctaSettings, setCtaSettings] = useState<HomeCtaSettings>({
    ...defaultCmsData.homeCtaSettings,
    ...(cmsData.homeCtaSettings || {})
  });

  const [themeSettings, setThemeSettings] = useState<HomeThemeSettings>({
    ...defaultCmsData.homeThemeSettings,
    ...(cmsData.homeThemeSettings || {})
  });

  const homePageRecord = cmsData.pages?.find((p) => p.slug === "/") || defaultCmsData.pages[0];
  const [seoForm, setSeoForm] = useState({
    title: homePageRecord?.title || "Home",
    seoTitle: homePageRecord?.seoTitle || "Tarek Rahaman | Creative Web Developer",
    seoDesc: homePageRecord?.seoDesc || "Full-stack developer portfolio featuring Laravel, WordPress, and React projects.",
    keywords: homePageRecord?.keywords || "Full-stack Developer, WordPress Expert, Laravel, React, Web Development",
    ogImage: homePageRecord?.ogImage || "/assets/profile-1-scaled.png"
  });

  // Sync state whenever cmsData updates
  useEffect(() => {
    if (cmsData.hero) setHeroForm({ ...defaultCmsData.hero, ...cmsData.hero });
    if (cmsData.homeSections) {
      setSectionsList([...cmsData.homeSections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
    if (cmsData.homeJourneyHeader) setJourneyHeader({ ...defaultCmsData.homeJourneyHeader, ...cmsData.homeJourneyHeader });
    if (cmsData.milestonesPhotos) setPhotos([...cmsData.milestonesPhotos]);
    if (cmsData.homeServicesHeader) setServicesHeader({ ...defaultCmsData.homeServicesHeader, ...cmsData.homeServicesHeader });
    if (cmsData.services) setServices([...cmsData.services]);
    if (cmsData.homeSkillsHeader) setSkillsHeader({ ...defaultCmsData.homeSkillsHeader, ...cmsData.homeSkillsHeader });
    if (cmsData.homeToolsHeader) setToolsHeader({ ...defaultCmsData.homeToolsHeader, ...cmsData.homeToolsHeader });
    if (cmsData.skills) setSkills([...cmsData.skills]);
    if (cmsData.homePortfolioSettings) setPortfolioSettings({ ...defaultCmsData.homePortfolioSettings, ...cmsData.homePortfolioSettings });
    if (cmsData.projects) setProjects([...cmsData.projects]);
    if (cmsData.homeWorkflowHeader) setWorkflowHeader({ ...defaultCmsData.homeWorkflowHeader, ...cmsData.homeWorkflowHeader });
    if (cmsData.processSteps) setProcessSteps([...cmsData.processSteps]);
    if (cmsData.homeAboutSettings) setAboutSettings({ ...defaultCmsData.homeAboutSettings, ...cmsData.homeAboutSettings });
    if (cmsData.homeTestimonialsHeader) setTestimonialsHeader({ ...defaultCmsData.homeTestimonialsHeader, ...cmsData.homeTestimonialsHeader });
    if (cmsData.testimonials) setTestimonials([...cmsData.testimonials]);
    if (cmsData.homeStatsSettings) setStatsSettings({ ...defaultCmsData.homeStatsSettings, ...cmsData.homeStatsSettings });
    if (cmsData.stats) setStats([...cmsData.stats]);
    if (cmsData.homeClientsHeader) setClientsHeader({ ...defaultCmsData.homeClientsHeader, ...cmsData.homeClientsHeader });
    if (cmsData.clientBrands) setClientBrands([...cmsData.clientBrands]);
    if (cmsData.homeCtaSettings) setCtaSettings({ ...defaultCmsData.homeCtaSettings, ...cmsData.homeCtaSettings });
    if (cmsData.homeThemeSettings) setThemeSettings({ ...defaultCmsData.homeThemeSettings, ...cmsData.homeThemeSettings });
    const p = cmsData.pages?.find((x) => x.slug === "/");
    if (p) {
      setSeoForm({
        title: p.title || "Home",
        seoTitle: p.seoTitle || "Tarek Rahaman | Creative Web Developer",
        seoDesc: p.seoDesc || "",
        keywords: p.keywords || "",
        ogImage: p.ogImage || "/assets/profile-1-scaled.png"
      });
    }
  }, [cmsData]);

  // Section meta finder
  const getSection = (key: string) => sectionsList.find((s) => s.key === key);

  // Instant toggle section visibility
  const handleToggleSection = async (key: string) => {
    const updated = sectionsList.map((sec) =>
      sec.key === key ? { ...sec, enabled: !sec.enabled } : sec
    );
    setSectionsList(updated);
    const success = await updateCms({ homeSections: updated });
    if (success) {
      const target = updated.find((s) => s.key === key);
      showToast(`${target?.name || key} is now ${target?.enabled ? "visible" : "hidden"} on live homepage.`);
    } else {
      showToast("Failed to update section visibility", "error");
    }
  };

  // Reorder Sections (Move Up / Down)
  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sectionsList.length) return;

    const list = [...sectionsList];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    const reordered = list.map((sec, i) => ({
      ...sec,
      order: i + 1,
    }));

    setSectionsList(reordered);
    const success = await updateCms({ homeSections: reordered });
    if (success) {
      showToast("Homepage section order updated and synchronized!");
    } else {
      showToast("Failed to update section order", "error");
    }
  };

  // 14 Defined Homepage Section Configs
  const homepageSections = [
    {
      id: "hero" as HomepageSectionKey,
      secKey: "hero",
      number: "01",
      name: "Hero Section",
      subtitle: "Main Headline & Portrait",
      desc: "Greeting, full title, intro bio, Download CV button, Hire Me CTA, and main portrait image.",
      icon: Camera,
      anchor: "#home",
      countText: "1 Main Hero"
    },
    {
      id: "journey" as HomepageSectionKey,
      secKey: "milestones",
      number: "02",
      name: "Journey / Moments Collage",
      subtitle: "Futuristic 5-Photo Collage",
      desc: "Overlapping moments, milestone badges, titles, descriptions, rotation angles, and image assets.",
      icon: Sparkles,
      anchor: "#visual-journey",
      countText: `${photos.length} Photo Cards`
    },
    {
      id: "services" as HomepageSectionKey,
      secKey: "services",
      number: "03",
      name: "Services Preview",
      subtitle: "Core Capabilities Carousel",
      desc: "Interactive services showcase, 3D carousel items, feature tags, custom icons, and learn-more links.",
      icon: Wrench,
      anchor: "#services",
      countText: `${services.length} Services`
    },
    {
      id: "skills" as HomepageSectionKey,
      secKey: "skills",
      number: "04",
      name: "Skills Preview",
      subtitle: "Technical Stacks & Levels",
      desc: "Frontend, Backend, and Database technologies with interactive proficiency sliders and category tags.",
      icon: Cpu,
      anchor: "#skills",
      countText: `${skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0)} Skills`
    },
    {
      id: "tools" as HomepageSectionKey,
      secKey: "skills",
      number: "05",
      name: "Tools & Technologies",
      subtitle: "Developer Workflow & DevOps",
      desc: "Integrated developer tools, deployment platforms, API toolchains, and design engineering software.",
      icon: Layers,
      anchor: "#skills",
      countText: "Workflow Tools"
    },
    {
      id: "portfolio" as HomepageSectionKey,
      secKey: "projects",
      number: "06",
      name: "Portfolio Preview",
      subtitle: "Featured Projects & Case Studies",
      desc: "Homepage portfolio gallery with complete project CRUD, thumbnail uploads, live demos, and GitHub links.",
      icon: FolderKanban,
      anchor: "#portfolio",
      countText: `${projects.filter((p) => p.featured).length} Featured of ${projects.length} Total`
    },
    {
      id: "why-us" as HomepageSectionKey,
      secKey: "workflow",
      number: "07",
      name: "Why Choose Me",
      subtitle: "Engineering Process Blueprint",
      desc: "Structured development phases, architectural planning, code execution, QA testing, and delivery steps.",
      icon: Zap,
      anchor: "#why-us",
      countText: `${processSteps.length} Process Phases`
    },
    {
      id: "about" as HomepageSectionKey,
      secKey: "about",
      number: "08",
      name: "About Preview",
      subtitle: "Personal Story & Philosophy",
      desc: "Homepage about intro card, key career achievements, personal philosophy, and link to full story.",
      icon: User,
      anchor: "#about",
      countText: "About Spotlight"
    },
    {
      id: "testimonials" as HomepageSectionKey,
      secKey: "testimonials",
      number: "09",
      name: "Testimonials",
      subtitle: "Client Reviews & Ratings",
      desc: "Client quotes, 5-star ratings, company roles, client avatar images, and verification badges.",
      icon: Quote,
      anchor: "#testimonials",
      countText: `${testimonials.length} Client Reviews`
    },
    {
      id: "stats" as HomepageSectionKey,
      secKey: "testimonials",
      number: "10",
      name: "Statistics / Numbers",
      subtitle: "Measurable Impact & Metrics",
      desc: "Key metrics including completed projects, satisfied clients, code quality, and worldwide deployments.",
      icon: TrendingUp,
      anchor: "#testimonials",
      countText: `${stats.length} Core Metrics`
    },
    {
      id: "clients" as HomepageSectionKey,
      secKey: "clients",
      number: "11",
      name: "Client Brands",
      subtitle: "Partner Logos & Industry Tags",
      desc: "Marquee carousel of client logos, enterprise partners, and high-growth brands.",
      icon: Globe,
      anchor: "#clients",
      countText: `${clientBrands.length} Partner Brands`
    },
    {
      id: "cta" as HomepageSectionKey,
      secKey: "cta",
      number: "12",
      name: "Call To Action (CTA)",
      subtitle: "Conversion & Project Inquiries",
      desc: "Final conversion banner with primary CTA button, consultation booking link, and direct contact hooks.",
      icon: Send,
      anchor: "#contact",
      countText: "Final Banner"
    },
    {
      id: "seo" as HomepageSectionKey,
      secKey: "hero",
      number: "13",
      name: "Homepage SEO & OG",
      subtitle: "Search & Social Sharing Meta",
      desc: "Meta title, description, keywords, Open Graph image, and indexing tags for search engines.",
      icon: Globe,
      anchor: "",
      countText: "Meta Tags"
    },
    {
      id: "theme" as HomepageSectionKey,
      secKey: "hero",
      number: "14",
      name: "Design & Visuals",
      subtitle: "Colors & Ambient Effects",
      desc: "Accent colors, 3D interactive canvas background toggle, and ambient wave divider animations.",
      icon: Settings,
      anchor: "",
      countText: "Visual Controls"
    }
  ];

  // Helper to render the common sub-page header
  const renderSubPageHeader = (
    sectionId: HomepageSectionKey,
    secKey: string,
    title: string,
    description: string,
    anchor: string,
    onSave: () => Promise<void>,
    saveLabel: string = "Save Changes"
  ) => {
    const sec = getSection(secKey);
    const isEnabled = sec ? sec.enabled : true;

    return (
      <div className="space-y-4 mb-6">
        {/* Breadcrumb Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl bg-[#060c1c]/90 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubPage("overview")}
              className="inline-flex items-center gap-1.5 font-bold text-[#00d2ff] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Homepage Hub</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold">{title}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {anchor && (
              <Link
                href={`/${anchor}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07132a] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Section</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Section Title, Live Status & Instant Visibility Switch */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#081026] via-[#0a1533] to-[#070e22] border border-[#00d2ff]/25 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isEnabled ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-rose-500"}`} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                Live Status: {isEnabled ? "Visible on Homepage" : "Hidden from Homepage"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {sec && (
              <button
                type="button"
                onClick={() => handleToggleSection(secKey)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300"
                    : "bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300"
                }`}
              >
                {isEnabled ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Hide Section</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-rose-400" />
                    <span>Show Section</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Saving..." : saveLabel}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW: HOMEPAGE OVERVIEW HUB (14 SECTIONS + DYNAMIC ORDER CONTROLS)
  // =========================================================================
  if (activeSubPage === "overview") {
    return (
      <div className="space-y-6">
        {/* Main Hub Welcome & Stats Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[11px] font-mono font-bold uppercase text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Homepage CMS Architecture // 14 Dedicated Modules</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Homepage Content &amp; Layout Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Every single visible element of the live Homepage can be managed from here. Reorder sections with Move Up / Down buttons, toggle visibility, and customize text, images, buttons, and stats.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081228] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)]"
              >
                <Eye className="w-4 h-4" />
                <span>View Live Homepage</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Section Ordering & Visibility Suite */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00d2ff]" />
                <span>Homepage Section Order &amp; Live Visibility</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Use the Move Up / Move Down buttons to reorder how sections render on the public Homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsSaving(true);
                try {
                  const success = await updateCms({ homeSections: sectionsList });
                  if (success) {
                    showToast("Homepage section layout & visibility saved successfully!");
                  } else {
                    showToast("Failed to save layout", "error");
                  }
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0088ff] text-[#050811] text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,210,255,0.4)] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Section Order"}</span>
            </button>
          </div>

          {/* Section Ordering List */}
          <div className="space-y-2.5">
            {sectionsList.map((sec, idx) => {
              const matchedConfig = homepageSections.find((h) => h.secKey === sec.key);
              const Icon = matchedConfig?.icon || Layers;
              return (
                <div
                  key={sec.key + idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#050914] border border-white/10 hover:border-[#00d2ff]/40 flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Icon className="w-4 h-4 text-[#00d2ff] shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>{sec.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">({sec.key})</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{sec.title} — {sec.subtitle || sec.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, "up")}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sectionsList.length - 1}
                      onClick={() => handleMoveSection(idx, "down")}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Show / Hide Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleSection(sec.key)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        sec.enabled !== false
                          ? "bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sec.enabled !== false ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                      <span>{sec.enabled !== false ? "VISIBLE" : "HIDDEN"}</span>
                    </button>

                    {/* Manage Link */}
                    {matchedConfig && (
                      <button
                        type="button"
                        onClick={() => setActiveSubPage(matchedConfig.id)}
                        className="p-1.5 px-2.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 14 Clickable Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {homepageSections.map((sec) => {
            const Icon = sec.icon;
            const liveSec = getSection(sec.secKey);
            const isEnabled = liveSec ? liveSec.enabled : true;

            return (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all duration-200 shadow-md flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#00d2ff]/05 rounded-full blur-2xl group-hover:bg-[#00d2ff]/15 transition-all" />

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-105 group-hover:bg-[#00d2ff]/20 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-[#00d2ff] uppercase">
                          SECTION #{sec.number}
                        </span>
                        <div className="text-[11px] font-bold text-slate-400 font-mono">
                          {sec.countText}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (sec.secKey) handleToggleSection(sec.secKey);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        isEnabled
                          ? "bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                      <span>{isEnabled ? "LIVE" : "HIDDEN"}</span>
                    </button>
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-base font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                      {sec.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#00d2ff]/80">
                      {sec.subtitle}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  {sec.anchor ? (
                    <Link
                      href={`/${sec.anchor}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title={`View live section on ${sec.anchor}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={() => setActiveSubPage(sec.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00d2ff]/15 to-[#0088ff]/15 hover:from-[#00d2ff] hover:to-[#0088ff] text-[#00d2ff] hover:text-[#050811] border border-[#00d2ff]/30 text-xs font-bold transition-all cursor-pointer group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                  >
                    <span>Manage Section</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
  // SUBPAGE 01: HERO SECTION
  // =========================================================================
  if (activeSubPage === "hero") {
    const handleSaveHero = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({ hero: heroForm });
        if (success) {
          showToast("Hero Section saved and synced with live homepage!");
        } else {
          showToast("Failed to save Hero Section", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "hero",
          "hero",
          "01. Hero Section Management",
          "Manage top badge, greeting, name, main title, glowing highlights, intro bio, action buttons, background clouds, light beam, and portrait photo.",
          "#home",
          handleSaveHero,
          "Save Hero Section"
        )}

        {/* Master Card 1: Typography & Headline Builder */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Camera className="w-4 h-4 text-[#00d2ff]" />
            <span>Hero Typography &amp; Headlines</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top Badge Builder */}
            <div className="md:col-span-2 p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00d2ff] uppercase font-mono">
                  Optional Top Eyebrow Badge
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={heroForm.showBadge || false}
                    onChange={(e) => setHeroForm({ ...heroForm, showBadge: e.target.checked })}
                    className="accent-[#00d2ff]"
                  />
                  <span>Show Top Badge</span>
                </label>
              </div>

              {heroForm.showBadge && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={heroForm.badgeText || ""}
                      onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                      placeholder="e.g. FULL-STACK DEVELOPER &amp; ARCHITECT"
                      className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Badge Icon
                    </label>
                    <select
                      value={heroForm.badgeIcon || "Sparkles"}
                      onChange={(e) => setHeroForm({ ...heroForm, badgeIcon: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    >
                      {AVAILABLE_BADGE_ICONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Greeting */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Greeting Text
              </label>
              <input
                type="text"
                value={heroForm.greeting || ""}
                onChange={(e) => setHeroForm({ ...heroForm, greeting: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
                placeholder="Hello, I'm"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Display Name (Solid White)
              </label>
              <input
                type="text"
                value={heroForm.name || ""}
                onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
                placeholder="Tarek Rahaman"
              />
            </div>

            {/* Main Headline Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Main Headline Title (Cyan Label)
              </label>
              <input
                type="text"
                value={heroForm.mainTitle || ""}
                onChange={(e) => setHeroForm({ ...heroForm, mainTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
                placeholder="FULL-STACK WEB DEVELOPER"
              />
            </div>

            {/* Sub-headline */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Sub-Headline / Core Specialization
              </label>
              <input
                type="text"
                value={heroForm.subTitle || ""}
                onChange={(e) => setHeroForm({ ...heroForm, subTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
                placeholder="Laravel • Python • WordPress • WooCommerce Specialist"
              />
            </div>

            {/* Intro Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Hero Short Description / Intro Bio
              </label>
              <textarea
                rows={3}
                value={heroForm.description || ""}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
                placeholder="Brief intro statement rendered beneath the hero title"
              />
            </div>
          </div>

          {/* Rotating Professional Animated Phrases Manager */}
          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase font-mono block">
                  Rotating Animated Titles (Displayed next to portrait with ping indicator)
                </label>
                <p className="text-[11px] text-slate-400">
                  Rotates automatically every 2 seconds on the live hero section.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const arr = [...(heroForm.animatedPhrases || [])];
                  arr.push("NEW EXPERTISE TITLE");
                  setHeroForm({ ...heroForm, animatedPhrases: arr });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Phrase</span>
              </button>
            </div>

            <div className="space-y-2">
              {(heroForm.animatedPhrases || []).map((phrase, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 w-6 text-right">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => {
                      const arr = [...(heroForm.animatedPhrases || [])];
                      arr[idx] = e.target.value;
                      setHeroForm({ ...heroForm, animatedPhrases: arr });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (heroForm.animatedPhrases || []).filter((_, i) => i !== idx);
                      setHeroForm({ ...heroForm, animatedPhrases: arr });
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Master Card 2: CTA Action Buttons */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Send className="w-4 h-4 text-[#00d2ff]" />
            <span>Hero Action Buttons Manager</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Primary Button */}
            <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs font-bold text-[#00d2ff] uppercase font-mono">
                  Primary Button (Cyan Glowing)
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroForm.primaryButtonVisible !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonVisible: e.target.checked })}
                    className="accent-[#00d2ff]"
                  />
                  <span>Visible</span>
                </label>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={heroForm.primaryButtonText || "Download CV"}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Destination URL / CV Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroForm.primaryButtonUrl || ""}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonUrl: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => setHeroForm({ ...heroForm, primaryButtonUrl: url }))}
                    className="px-3 py-2 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroForm.primaryButtonDownload !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonDownload: e.target.checked })}
                    className="accent-[#00d2ff]"
                  />
                  <span>Trigger File Download</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroForm.primaryButtonNewTab || false}
                    onChange={(e) => setHeroForm({ ...heroForm, primaryButtonNewTab: e.target.checked })}
                    className="accent-[#00d2ff]"
                  />
                  <span>Open in New Tab</span>
                </label>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-xs font-bold text-[#00d2ff] uppercase font-mono">
                  Secondary Button (Dark Glass Pill)
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroForm.secondaryButtonVisible !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonVisible: e.target.checked })}
                    className="accent-[#00d2ff]"
                  />
                  <span>Visible</span>
                </label>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryButtonText || "Hire Me"}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryButtonUrl || "/contact"}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={heroForm.secondaryButtonNewTab || false}
                    onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonNewTab: e.target.checked })}
                    className="accent-[#00d2ff]"
                  />
                  <span>Open in New Tab</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Master Card 3: Visuals, Clouds & Portrait */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Sparkles className="w-4 h-4 text-[#00d2ff]" />
            <span>Visual Assets, Clouds &amp; Lighting</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Main Portrait */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                Main Hero Portrait Photo
              </label>
              <UniversalImageManager
                label="Hero Main Portrait"
                imageUrl={heroForm.portraitUrl || ""}
                fallbackUrl="/assets/profile-1-scaled.png"
                alt={heroForm.name || "Hero Portrait"}
                aspectRatio="portrait"
                onImageChange={(newUrl) => setHeroForm({ ...heroForm, portraitUrl: newUrl })}
                onImageRemove={() => setHeroForm({ ...heroForm, portraitUrl: "" })}
                onSaveImmediate={async (newUrl) => {
                  const updated = { ...heroForm, portraitUrl: newUrl };
                  setHeroForm(updated);
                  await updateCms({ hero: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>

            {/* Background Clouds & Beam Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                  Atmospheric Cloud Background Asset
                </label>
                <UniversalImageManager
                  label="White Clouds / Smoke Asset"
                  imageUrl={heroForm.cloudBgUrl || "/assets/realistic-white-clouds.jpg"}
                  fallbackUrl="/assets/realistic-white-clouds.jpg"
                  alt="Realistic Clouds"
                  aspectRatio="video"
                  onImageChange={(newUrl) => setHeroForm({ ...heroForm, cloudBgUrl: newUrl })}
                  onImageRemove={() => setHeroForm({ ...heroForm, cloudBgUrl: "" })}
                  onSaveImmediate={async (newUrl) => {
                    const updated = { ...heroForm, cloudBgUrl: newUrl };
                    setHeroForm(updated);
                    await updateCms({ hero: updated });
                  }}
                  openMediaPicker={openMediaPicker}
                  showToast={showToast}
                />
              </div>

              <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#00d2ff] uppercase font-mono block">
                  Lighting &amp; Effect Toggles
                </span>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.showClouds !== false}
                      onChange={(e) => setHeroForm({ ...heroForm, showClouds: e.target.checked })}
                      className="accent-[#00d2ff]"
                    />
                    <span>Enable Volumetric White Clouds &amp; Drifting Smoke Layers</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.showLightBeam !== false}
                      onChange={(e) => setHeroForm({ ...heroForm, showLightBeam: e.target.checked })}
                      className="accent-[#00d2ff]"
                    />
                    <span>Enable White / Silver Diagonal Cyber Light Beam</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 02: JOURNEY / MOMENTS COLLAGE
  // =========================================================================
  if (activeSubPage === "journey") {
    const handleSaveJourney = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeJourneyHeader: journeyHeader,
          milestonesPhotos: photos,
        });
        if (success) {
          showToast("Moments & Milestones Collage updated successfully!");
        } else {
          showToast("Failed to save Collage", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "journey",
          "milestones",
          "02. Journey / Moments Collage Management",
          "Manage the 2-line heading, subtitle, smile glow arc, and the 5 overlapping panoramic collage cards.",
          "#visual-journey",
          handleSaveJourney,
          "Save Collage"
        )}

        {/* Master Card 1: Section Header */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Sparkles className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header &amp; Glow Arc Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Pill Badge Text
              </label>
              <input
                type="text"
                value={journeyHeader.badge || ""}
                onChange={(e) => setJourneyHeader({ ...journeyHeader, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                placeholder="MOMENTS &amp; MILESTONES"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Heading Line 1 (Solid White)
              </label>
              <input
                type="text"
                value={journeyHeader.headingLine1 || ""}
                onChange={(e) => setJourneyHeader({ ...journeyHeader, headingLine1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                placeholder="Crafting Digital Solutions,"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Heading Line 2 (Italic Glowing Cyan)
              </label>
              <input
                type="text"
                value={journeyHeader.headingLine2 || ""}
                onChange={(e) => setJourneyHeader({ ...journeyHeader, headingLine2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                placeholder="Living The Journey"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={journeyHeader.description || ""}
                onChange={(e) => setJourneyHeader({ ...journeyHeader, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                placeholder="A glimpse of my work, achievements, and learning journey."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={journeyHeader.showSmileArc !== false}
                  onChange={(e) => setJourneyHeader({ ...journeyHeader, showSmileArc: e.target.checked })}
                  className="accent-[#00d2ff]"
                />
                <span>Show Curved Cyan Glowing Smile Arc beneath heading</span>
              </label>
            </div>
          </div>
        </div>

        {/* Master Card 2: 5+ Collage Photo Cards */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#00d2ff]" />
              <span>Collage Photo Cards ({photos.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newCard: CollagePhotoItem = {
                  id: `photo-${Date.now()}`,
                  src: "/assets/profile-1-scaled.png",
                  alt: "New Milestone Moment",
                  badge: "MILESTONE",
                  title: "New Achievement",
                  subtitle: "Location or Date",
                  description: "Milestone description displayed inside card",
                  rotation: 0,
                  desktopPos: {
                    left: "10%",
                    top: "10%",
                    width: "280px",
                    zIndex: photos.length + 1,
                    aspectRatio: "3/4"
                  }
                };
                setPhotos([...photos, newCard]);
                showToast("Added new collage photo card");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {photos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase">
                      Card #{idx + 1} • {photo.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Tilt: {photo.rotation}°
                    </span>
                  </div>

                  <div className="mb-4">
                    <UniversalImageManager
                      label="Card Image Asset"
                      imageUrl={photo.src}
                      fallbackUrl="/assets/profile-1-scaled.png"
                      alt={photo.alt || photo.title}
                      aspectRatio="portrait"
                      onImageChange={(newUrl) => {
                        const updated = [...photos];
                        updated[idx] = { ...updated[idx], src: newUrl };
                        setPhotos(updated);
                      }}
                      onImageRemove={() => {
                        const updated = [...photos];
                        updated[idx] = { ...updated[idx], src: "" };
                        setPhotos(updated);
                      }}
                      onSaveImmediate={async (newUrl) => {
                        const updated = [...photos];
                        updated[idx] = { ...updated[idx], src: newUrl };
                        setPhotos(updated);
                        await updateCms({ milestonesPhotos: updated });
                      }}
                      openMediaPicker={openMediaPicker}
                      showToast={showToast}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Card Badge
                      </label>
                      <input
                        type="text"
                        value={photo.badge || ""}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setPhotos(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        placeholder="WORKSTATION, COLLABORATION, etc."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={photo.title || ""}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setPhotos(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Subtitle / Role
                      </label>
                      <input
                        type="text"
                        value={photo.subtitle || ""}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          setPhotos(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Description / Story
                      </label>
                      <textarea
                        rows={2}
                        value={photo.description || ""}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setPhotos(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Rotation Angle ({photo.rotation || 0}°)
                      </label>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="1"
                        value={photo.rotation || 0}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[idx] = { ...updated[idx], rotation: Number(e.target.value) };
                          setPhotos(updated);
                        }}
                        className="w-full accent-[#00d2ff]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...photos];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setPhotos(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === photos.length - 1}
                      onClick={() => {
                        const updated = [...photos];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setPhotos(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete card #${idx + 1}?`)) {
                        setPhotos(photos.filter((_, i) => i !== idx));
                        showToast("Card deleted");
                      }
                    }}
                    className="p-1 text-rose-400 hover:bg-rose-500/15 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
  // SUBPAGE 03: SERVICES PREVIEW
  // =========================================================================
  if (activeSubPage === "services") {
    const handleSaveServices = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeServicesHeader: servicesHeader,
          services,
        });
        if (success) {
          showToast("Services preview section saved successfully!");
        } else {
          showToast("Failed to save services", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "services",
          "services",
          "03. Services Preview Management",
          "Manage services header badge, title, highlight text, and interactive 3D service cards.",
          "#services",
          handleSaveServices,
          "Save Services"
        )}

        {/* Section Header Card */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Wrench className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={servicesHeader.badge || "SERVICES"}
                onChange={(e) => setServicesHeader({ ...servicesHeader, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title Prefix
              </label>
              <input
                type="text"
                value={servicesHeader.title || "My"}
                onChange={(e) => setServicesHeader({ ...servicesHeader, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Highlighted Word (Cyan)
              </label>
              <input
                type="text"
                value={servicesHeader.highlightText || "Services"}
                onChange={(e) => setServicesHeader({ ...servicesHeader, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description
              </label>
              <input
                type="text"
                value={servicesHeader.description || ""}
                onChange={(e) => setServicesHeader({ ...servicesHeader, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Services Cards List */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00d2ff]" />
              <span>Service Cards ({services.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newSvc: ServiceItem = {
                  id: `svc-${Date.now()}`,
                  number: `0${services.length + 1}`,
                  title: "New Digital Service",
                  shortDesc: "Comprehensive web solution built for performance and scale.",
                  fullDesc: "Complete description of technical architecture and delivery phases.",
                  features: ["Responsive UI", "SEO Architecture", "Custom Integration"],
                  icon: "WebsiteDesign",
                  badge: "CUSTOM",
                  featured: true,
                  order: services.length + 1
                };
                setServices([...services, newSvc]);
                showToast("Added new service card");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, idx) => (
              <div
                key={svc.id || idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase">
                      Service #{svc.number || idx + 1}
                    </span>
                    <select
                      value={svc.icon || "WebsiteDesign"}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setServices(updated);
                      }}
                      className="px-2 py-1 rounded bg-[#080e1e] border border-white/10 text-[10px] text-white"
                    >
                      <option value="WebsiteDesign">Website Design</option>
                      <option value="ECommerce">E-Commerce</option>
                      <option value="LandingPage">Landing Page</option>
                      <option value="Laravel">Laravel Backend</option>
                      <option value="WordPress">WordPress</option>
                      <option value="CustomSolution">Custom Solution</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={svc.title}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setServices(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={svc.shortDesc || ""}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx] = { ...updated[idx], shortDesc: e.target.value };
                        setServices(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Feature Bullets (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(svc.features || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx] = {
                          ...updated[idx],
                          features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        };
                        setServices(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...services];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setServices(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === services.length - 1}
                      onClick={() => {
                        const updated = [...services];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setServices(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete service "${svc.title}"?`)) {
                        setServices(services.filter((_, i) => i !== idx));
                        showToast("Service deleted");
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
  // SUBPAGE 04 & 05: SKILLS & TOOLS PREVIEW
  // =========================================================================
  if (activeSubPage === "skills" || activeSubPage === "tools") {
    const handleSaveSkills = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeSkillsHeader: skillsHeader,
          homeToolsHeader: toolsHeader,
          skills
        });
        if (success) {
          showToast("Skills and tools preview saved successfully!");
        } else {
          showToast("Failed to save skills", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          activeSubPage,
          "skills",
          activeSubPage === "tools" ? "05. Tools & Tech Management" : "04. Skills Preview Management",
          "Manage headers, proficiency percentages, and technology sliders for technical languages and workflow developer platforms.",
          "#skills",
          handleSaveSkills,
          "Save Skills & Tools"
        )}

        {/* Section Headers Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Part 1 Header: Tech Skills */}
          <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Cpu className="w-4 h-4 text-[#00d2ff]" />
              <span>Part 1: Tech Skills Header</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={skillsHeader.badge || "MY TECH STACK"}
                  onChange={(e) => setSkillsHeader({ ...skillsHeader, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={skillsHeader.title || "My Tech Skills"}
                  onChange={(e) => setSkillsHeader({ ...skillsHeader, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Highlighted Word
                </label>
                <input
                  type="text"
                  value={skillsHeader.highlightText || "Tech Skills"}
                  onChange={(e) => setSkillsHeader({ ...skillsHeader, highlightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={skillsHeader.description || ""}
                  onChange={(e) => setSkillsHeader({ ...skillsHeader, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>
            </div>
          </div>

          {/* Part 2 Header: Tools & Platforms */}
          <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-2">
              <Wrench className="w-4 h-4 text-[#00d2ff]" />
              <span>Part 2: Tools &amp; Platforms Header</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={toolsHeader.badge || "WORKFLOW & PLATFORMS"}
                  onChange={(e) => setToolsHeader({ ...toolsHeader, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={toolsHeader.title || "Tools & Technologies"}
                  onChange={(e) => setToolsHeader({ ...toolsHeader, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Highlighted Word
                </label>
                <input
                  type="text"
                  value={toolsHeader.highlightText || "Technologies"}
                  onChange={(e) => setToolsHeader({ ...toolsHeader, highlightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={toolsHeader.description || ""}
                  onChange={(e) => setToolsHeader({ ...toolsHeader, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Categories and Stacks */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00d2ff]" />
              <span>Skills &amp; Tools Categories ({skills.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newCat: SkillCategory = {
                  category: "New Skill Category",
                  skills: [
                    { name: "New Skill", level: 85 }
                  ]
                };
                setSkills([...skills, newCat]);
                showToast("Added new skill category");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Category</span>
            </button>
          </div>

          <div className="space-y-6">
            {skills.map((cat, catIdx) => (
              <div key={catIdx} className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[catIdx] = { ...updated[catIdx], category: e.target.value };
                      setSkills(updated);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-sm font-bold text-white outline-none focus:border-[#00d2ff]"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...skills];
                        updated[catIdx].skills.push({ name: "New Item", level: 80 });
                        setSkills(updated);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00d2ff]/10 text-[#00d2ff] text-[11px] font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.category}"?`)) {
                          setSkills(skills.filter((_, i) => i !== catIdx));
                        }
                      }}
                      className="p-1 text-rose-400 hover:bg-rose-500/15 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.skills.map((sk, skIdx) => (
                    <div key={skIdx} className="p-3 rounded-xl bg-[#080e1e] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={sk.name}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[catIdx].skills[skIdx].name = e.target.value;
                            setSkills(updated);
                          }}
                          className="px-2 py-1 rounded bg-[#050914] border border-white/10 text-xs text-white outline-none flex-1 mr-2"
                        />
                        <span className="text-xs font-mono font-bold text-[#00d2ff]">
                          {sk.level}%
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...skills];
                            updated[catIdx].skills.splice(skIdx, 1);
                            setSkills(updated);
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sk.level}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[catIdx].skills[skIdx].level = Number(e.target.value);
                            setSkills(updated);
                          }}
                          className="w-full accent-[#00d2ff]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 06: PORTFOLIO PREVIEW
  // =========================================================================
  if (activeSubPage === "portfolio") {
    const handleSavePortfolio = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homePortfolioSettings: portfolioSettings,
          projects,
        });
        if (success) {
          showToast("Portfolio preview section saved successfully!");
        } else {
          showToast("Failed to save portfolio", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "portfolio",
          "projects",
          "06. Portfolio Preview Management",
          "Manage portfolio badge, 3 key statistical counters, Explore button, and featured laptop slideshow projects.",
          "#portfolio",
          handleSavePortfolio,
          "Save Portfolio"
        )}

        {/* Master Card 1: Section Header */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <FolderKanban className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header &amp; Explore Button</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={portfolioSettings.badge || "Parallax Hero Style"}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Number
              </label>
              <input
                type="text"
                value={portfolioSettings.badgeNumber || "08"}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, badgeNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title Prefix (Solid White)
              </label>
              <input
                type="text"
                value={portfolioSettings.title || "My"}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Subtitle (Glowing Cyan)
              </label>
              <input
                type="text"
                value={portfolioSettings.subtitle || "Portfolio"}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={portfolioSettings.buttonText || "Explore Projects"}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Button URL
              </label>
              <input
                type="text"
                value={portfolioSettings.buttonUrl || "/portfolio"}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, buttonUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={portfolioSettings.description || ""}
                onChange={(e) => setPortfolioSettings({ ...portfolioSettings, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Master Card 2: 3 Statistics Counters */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
              <span>3 Portfolio Key Statistics Row</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const arr = [...(portfolioSettings.stats || [])];
                arr.push({
                  id: `p-stat-${Date.now()}`,
                  value: "50+",
                  label: "New Metric",
                  icon: "Award",
                  visible: true
                });
                setPortfolioSettings({ ...portfolioSettings, stats: arr });
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 text-[#00d2ff] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(portfolioSettings.stats || []).map((st, sIdx) => (
              <div key={st.id || sIdx} className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase">
                    Stat #{sIdx + 1}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={st.visible !== false}
                      onChange={(e) => {
                        const arr = [...(portfolioSettings.stats || [])];
                        arr[sIdx] = { ...arr[sIdx], visible: e.target.checked };
                        setPortfolioSettings({ ...portfolioSettings, stats: arr });
                      }}
                      className="accent-[#00d2ff]"
                    />
                    <span>Visible</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const arr = [...(portfolioSettings.stats || [])];
                        arr[sIdx] = { ...arr[sIdx], value: e.target.value };
                        setPortfolioSettings({ ...portfolioSettings, stats: arr });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                      placeholder="e.g. 10+"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const arr = [...(portfolioSettings.stats || [])];
                        arr[sIdx] = { ...arr[sIdx], label: e.target.value };
                        setPortfolioSettings({ ...portfolioSettings, stats: arr });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                      placeholder="e.g. Projects"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (portfolioSettings.stats || []).filter((_, i) => i !== sIdx);
                      setPortfolioSettings({ ...portfolioSettings, stats: arr });
                    }}
                    className="p-1 text-rose-400 hover:bg-rose-500/15 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Card 3: Featured Projects Slider */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#00d2ff]" />
                <span>Featured Projects in 3D Laptop Slider</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle "Featured on Homepage" to choose which projects cycle through the 3D laptop slider.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj, pIdx) => (
              <div
                key={proj.id || pIdx}
                className="p-4 rounded-xl bg-[#050914] border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={normalizeImageUrl(proj.image, "/assets/profile-1-scaled.png")}
                    alt={proj.title}
                    className="w-12 h-10 object-cover rounded-lg bg-slate-800 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{proj.title}</h4>
                    <span className="text-[10px] font-mono text-[#00d2ff]">{proj.categoryName || proj.category}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const arr = [...projects];
                    arr[pIdx] = { ...arr[pIdx], featured: !arr[pIdx].featured };
                    setProjects(arr);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                    proj.featured
                      ? "bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff]"
                      : "bg-white/5 border border-white/10 text-slate-400"
                  }`}
                >
                  {proj.featured ? "FEATURED" : "HIDDEN"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 07: WHY CHOOSE ME (PROCESS)
  // =========================================================================
  if (activeSubPage === "why-us") {
    const handleSaveProcess = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeWorkflowHeader: workflowHeader,
          processSteps,
        });
        if (success) {
          showToast("Why Choose Me section saved successfully!");
        } else {
          showToast("Failed to save process", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "why-us",
          "workflow",
          "07. Why Choose Me / Process Management",
          "Manage section header and the engineering blueprint process cards.",
          "#why-us",
          handleSaveProcess,
          "Save Process"
        )}

        {/* Section Header Card */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Zap className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={workflowHeader.badge || "WHY US"}
                onChange={(e) => setWorkflowHeader({ ...workflowHeader, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title Prefix
              </label>
              <input
                type="text"
                value={workflowHeader.title || "Why Choose"}
                onChange={(e) => setWorkflowHeader({ ...workflowHeader, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Highlighted Word (Cyan)
              </label>
              <input
                type="text"
                value={workflowHeader.highlightText || "Us"}
                onChange={(e) => setWorkflowHeader({ ...workflowHeader, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description
              </label>
              <input
                type="text"
                value={workflowHeader.description || ""}
                onChange={(e) => setWorkflowHeader({ ...workflowHeader, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Process Steps Cards */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00d2ff]" />
              <span>Process Steps ({processSteps.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newStep: ProcessStep = {
                  step: `0${processSteps.length + 1}`,
                  phase: `Phase 0${processSteps.length + 1}`,
                  title: "New Development Phase",
                  description: "Detailed description of this engineering milestone.",
                  accent: "#00d2ff"
                };
                setProcessSteps([...processSteps, newStep]);
                showToast("Added new process phase");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Step</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((step, idx) => (
              <div
                key={step.step || idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase">
                      STEP #{step.step || idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step.step || ""}
                      onChange={(e) => {
                        const updated = [...processSteps];
                        updated[idx] = { ...updated[idx], step: e.target.value };
                        setProcessSteps(updated);
                      }}
                      className="w-16 px-2 py-1 rounded bg-[#080e1e] border border-white/10 text-xs text-white text-center font-mono"
                      placeholder="01"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) => {
                        const updated = [...processSteps];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setProcessSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={step.description || ""}
                      onChange={(e) => {
                        const updated = [...processSteps];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setProcessSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...processSteps];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setProcessSteps(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === processSteps.length - 1}
                      onClick={() => {
                        const updated = [...processSteps];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setProcessSteps(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete step #${idx + 1}?`)) {
                        setProcessSteps(processSteps.filter((_, i) => i !== idx));
                        showToast("Step deleted");
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
  // SUBPAGE 08: ABOUT PREVIEW
  // =========================================================================
  if (activeSubPage === "about") {
    const handleSaveAboutPreview = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeAboutSettings: aboutSettings,
        });
        if (success) {
          showToast("About Preview section saved successfully!");
        } else {
          showToast("Failed to save About Preview", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "about",
          "about",
          "08. About Preview Management",
          "Manage About section header, 3D floating photos, nameplate, 4 tech badges, and the 2 key impact statistics.",
          "#about",
          handleSaveAboutPreview,
          "Save About Preview"
        )}

        {/* Master Card 1: Section Header */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <User className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header &amp; Nameplate Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={aboutSettings.badge || "ABOUT ME"}
                onChange={(e) => setAboutSettings({ ...aboutSettings, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Heading Line 1 (Solid White)
              </label>
              <input
                type="text"
                value={aboutSettings.title || "Turning Ideas into"}
                onChange={(e) => setAboutSettings({ ...aboutSettings, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Heading Line 2 (Cyan &amp; Purple Glow)
              </label>
              <input
                type="text"
                value={aboutSettings.subtitle || "Digital Experiences"}
                onChange={(e) => setAboutSettings({ ...aboutSettings, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Nameplate Display Name
              </label>
              <input
                type="text"
                value={aboutSettings.name || "Tarek Rahaman"}
                onChange={(e) => setAboutSettings({ ...aboutSettings, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Nameplate Role / Title
              </label>
              <input
                type="text"
                value={aboutSettings.role || "Creative Web Developer"}
                onChange={(e) => setAboutSettings({ ...aboutSettings, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description / Bio
              </label>
              <textarea
                rows={3}
                value={aboutSettings.description || ""}
                onChange={(e) => setAboutSettings({ ...aboutSettings, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Master Card 2: 3D Floating Images */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Camera className="w-4 h-4 text-[#00d2ff]" />
            <span>3D Floating Photo Cards</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Workstation */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                Left Card (Workstation Lab)
              </label>
              <UniversalImageManager
                label="Workstation Photo"
                imageUrl={aboutSettings.workstationImage || "/assets/WhatsApp-Image-2026-08-06-at-4.49.13-PM.jpeg"}
                fallbackUrl="/assets/WhatsApp-Image-2026-08-06-at-4.49.13-PM.jpeg"
                alt={aboutSettings.workstationAlt || "Workstation Lab"}
                aspectRatio="portrait"
                onImageChange={(newUrl) => setAboutSettings({ ...aboutSettings, workstationImage: newUrl })}
                onImageRemove={() => setAboutSettings({ ...aboutSettings, workstationImage: "" })}
                onSaveImmediate={async (newUrl) => {
                  const updated = { ...aboutSettings, workstationImage: newUrl };
                  setAboutSettings(updated);
                  await updateCms({ homeAboutSettings: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>

            {/* Card 2: Certificate */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                Right Card (Certificate / Award)
              </label>
              <UniversalImageManager
                label="Certificate Photo"
                imageUrl={aboutSettings.certificateImage || "/assets/1786250627196.jpg.jpeg"}
                fallbackUrl="/assets/1786250627196.jpg.jpeg"
                alt={aboutSettings.certificateAlt || "NSDA Certificate"}
                aspectRatio="portrait"
                onImageChange={(newUrl) => setAboutSettings({ ...aboutSettings, certificateImage: newUrl })}
                onImageRemove={() => setAboutSettings({ ...aboutSettings, certificateImage: "" })}
                onSaveImmediate={async (newUrl) => {
                  const updated = { ...aboutSettings, certificateImage: newUrl };
                  setAboutSettings(updated);
                  await updateCms({ homeAboutSettings: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>

            {/* Card 3: Center Portrait */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                Center Focal Portrait (Upright)
              </label>
              <UniversalImageManager
                label="Main Portrait"
                imageUrl={aboutSettings.portraitImage || "/assets/profile-1-scaled.png"}
                fallbackUrl="/assets/profile-1-scaled.png"
                alt={aboutSettings.portraitAlt || "Tarek Portrait"}
                aspectRatio="portrait"
                onImageChange={(newUrl) => setAboutSettings({ ...aboutSettings, portraitImage: newUrl })}
                onImageRemove={() => setAboutSettings({ ...aboutSettings, portraitImage: "" })}
                onSaveImmediate={async (newUrl) => {
                  const updated = { ...aboutSettings, portraitImage: newUrl };
                  setAboutSettings(updated);
                  await updateCms({ homeAboutSettings: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>
          </div>
        </div>

        {/* Master Card 3: 4 Tech Badges & 2 Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4 Tech Badges */}
          <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00d2ff]" />
                <span>4 Core Technology Badges</span>
              </h3>

              <button
                type="button"
                onClick={() => {
                  const arr = [...(aboutSettings.techBadges || [])];
                  arr.push({ id: `ab-badge-${Date.now()}`, label: "New Tech", visible: true });
                  setAboutSettings({ ...aboutSettings, techBadges: arr });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00d2ff]/10 text-[#00d2ff] text-[11px] font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Badge</span>
              </button>
            </div>

            <div className="space-y-2">
              {(aboutSettings.techBadges || []).map((b, bIdx) => (
                <div key={b.id || bIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={b.label}
                    onChange={(e) => {
                      const arr = [...(aboutSettings.techBadges || [])];
                      arr[bIdx] = { ...arr[bIdx], label: e.target.value };
                      setAboutSettings({ ...aboutSettings, techBadges: arr });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (aboutSettings.techBadges || []).filter((_, i) => i !== bIdx);
                      setAboutSettings({ ...aboutSettings, techBadges: arr });
                    }}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/15 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Key Statistics */}
          <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
                <span>2 Key Impact Statistics</span>
              </h3>

              <button
                type="button"
                onClick={() => {
                  const arr = [...(aboutSettings.stats || [])];
                  arr.push({
                    id: `ab-stat-${Date.now()}`,
                    value: "100+",
                    label: "New Metric",
                    icon: "User",
                    colorTheme: "cyan",
                    visible: true
                  });
                  setAboutSettings({ ...aboutSettings, stats: arr });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00d2ff]/10 text-[#00d2ff] text-[11px] font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Stat</span>
              </button>
            </div>

            <div className="space-y-3">
              {(aboutSettings.stats || []).map((st, stIdx) => (
                <div key={st.id || stIdx} className="p-3 rounded-xl bg-[#050914] border border-white/10 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Number Value
                      </label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const arr = [...(aboutSettings.stats || [])];
                          arr[stIdx] = { ...arr[stIdx], value: e.target.value };
                          setAboutSettings({ ...aboutSettings, stats: arr });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                        placeholder="e.g. 150+"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Label Text
                      </label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const arr = [...(aboutSettings.stats || [])];
                          arr[stIdx] = { ...arr[stIdx], label: e.target.value };
                          setAboutSettings({ ...aboutSettings, stats: arr });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                        placeholder="e.g. Happy Clients"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={st.colorTheme || "cyan"}
                      onChange={(e) => {
                        const arr = [...(aboutSettings.stats || [])];
                        arr[stIdx] = { ...arr[stIdx], colorTheme: e.target.value as any };
                        setAboutSettings({ ...aboutSettings, stats: arr });
                      }}
                      className="px-2 py-1 rounded bg-[#080e1e] border border-white/10 text-[10px] text-white"
                    >
                      <option value="cyan">Cyan Theme</option>
                      <option value="purple">Purple Theme</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const arr = (aboutSettings.stats || []).filter((_, i) => i !== stIdx);
                        setAboutSettings({ ...aboutSettings, stats: arr });
                      }}
                      className="p-1 text-rose-400 hover:bg-rose-500/15 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 09: TESTIMONIALS
  // =========================================================================
  if (activeSubPage === "testimonials") {
    const handleSaveTestimonials = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeTestimonialsHeader: testimonialsHeader,
          testimonials,
        });
        if (success) {
          showToast("Client Testimonials updated successfully!");
        } else {
          showToast("Failed to save testimonials", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "testimonials",
          "testimonials",
          "09. Client Testimonials Management",
          "Manage testimonials section header, CTA button, client quotes, roles, company names, and 5-star ratings.",
          "#testimonials",
          handleSaveTestimonials,
          "Save Testimonials"
        )}

        {/* Section Header Card */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Quote className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={testimonialsHeader.badge || "TESTIMONIALS"}
                onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Main Title
              </label>
              <input
                type="text"
                value={testimonialsHeader.title || "Good Things You Have Heard About"}
                onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Highlighted Name (Cyan)
              </label>
              <input
                type="text"
                value={testimonialsHeader.highlightText || "Tarek Rahaman"}
                onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description
              </label>
              <input
                type="text"
                value={testimonialsHeader.description || ""}
                onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#00d2ff]" />
              <span>Client Reviews ({testimonials.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newRev: TestimonialItem = {
                  id: `review-${Date.now()}`,
                  name: "New Client",
                  role: "Managing Director",
                  company: "Global Tech Enterprise",
                  quote: "Tarek delivered exceptional quality and solved our complex web challenges seamlessly.",
                  avatar: "/assets/profile-1-scaled.png",
                  rating: 5
                };
                setTestimonials([...testimonials, newRev]);
                showToast("Added new testimonial review");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((test, idx) => (
              <div
                key={test.id || idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase">
                      Review #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => {
                            const updated = [...testimonials];
                            updated[idx] = { ...updated[idx], rating: star };
                            setTestimonials(updated);
                          }}
                          className={`w-3.5 h-3.5 cursor-pointer ${
                            star <= (test.rating ?? 5) ? "fill-amber-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <UniversalImageManager
                      label="Client Avatar"
                      imageUrl={test.avatar}
                      fallbackUrl="/assets/profile-1-scaled.png"
                      alt={test.name}
                      aspectRatio="square"
                      onImageChange={(newUrl) => {
                        const updated = [...testimonials];
                        updated[idx] = { ...updated[idx], avatar: newUrl };
                        setTestimonials(updated);
                      }}
                      onImageRemove={() => {
                        const updated = [...testimonials];
                        updated[idx] = { ...updated[idx], avatar: "" };
                        setTestimonials(updated);
                      }}
                      onSaveImmediate={async (newUrl) => {
                        const updated = [...testimonials];
                        updated[idx] = { ...updated[idx], avatar: newUrl };
                        setTestimonials(updated);
                        await updateCms({ testimonials: updated });
                      }}
                      openMediaPicker={openMediaPicker}
                      showToast={showToast}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setTestimonials(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={test.role || ""}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            setTestimonials(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={test.company || ""}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx] = { ...updated[idx], company: e.target.value };
                            setTestimonials(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Testimonial Quote
                      </label>
                      <textarea
                        rows={3}
                        value={test.quote}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[idx] = { ...updated[idx], quote: e.target.value };
                          setTestimonials(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...testimonials];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setTestimonials(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === testimonials.length - 1}
                      onClick={() => {
                        const updated = [...testimonials];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setTestimonials(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete testimonial from "${test.name}"?`)) {
                        setTestimonials(testimonials.filter((_, i) => i !== idx));
                        showToast("Review deleted");
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
  // SUBPAGE 10: STATISTICS / NUMBERS ("MY JOURNEY IN NUMBERS")
  // =========================================================================
  if (activeSubPage === "stats") {
    const handleSaveStats = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeStatsSettings: statsSettings,
          stats,
        });
        if (success) {
          showToast("Statistics & Numbers updated successfully!");
        } else {
          showToast("Failed to save statistics", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "stats",
          "testimonials",
          "10. Statistics / Numbers Management",
          "Manage 'My Journey in Numbers' section header, animated count-up metrics, and worldwide deployment country tags.",
          "#testimonials",
          handleSaveStats,
          "Save Numbers"
        )}

        {/* Section Header Card */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header &amp; Impact Story</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={statsSettings.badge || "TRACK RECORD & IMPACT"}
                onChange={(e) => setStatsSettings({ ...statsSettings, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title Prefix
              </label>
              <input
                type="text"
                value={statsSettings.title || "My Journey in "}
                onChange={(e) => setStatsSettings({ ...statsSettings, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Highlighted Word (Gradient)
              </label>
              <input
                type="text"
                value={statsSettings.highlightText || "Numbers"}
                onChange={(e) => setStatsSettings({ ...statsSettings, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description / Subtitle
              </label>
              <input
                type="text"
                value={statsSettings.description || ""}
                onChange={(e) => setStatsSettings({ ...statsSettings, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Statistical Metrics Cards */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
              <span>Statistical Metrics Cards ({stats.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newStat: StatItem = {
                  label: "New Statistic",
                  value: 100,
                  suffix: "+",
                  description: "Milestone description"
                };
                setStats([...stats, newStat]);
                showToast("Added new statistic");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label + idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Number Value
                      </label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx] = { ...updated[idx], value: Number(e.target.value) };
                          setStats(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>
                    <div className="w-20">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Suffix
                      </label>
                      <input
                        type="text"
                        value={stat.suffix || ""}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx] = { ...updated[idx], suffix: e.target.value };
                          setStats(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        placeholder="+"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Stat Label
                    </label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setStats(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={stat.description || ""}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setStats(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...stats];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setStats(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stats.length - 1}
                      onClick={() => {
                        const updated = [...stats];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setStats(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete stat "${stat.label}"?`)) {
                        setStats(stats.filter((_, i) => i !== idx));
                        showToast("Statistic removed");
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
  // SUBPAGE 11: CLIENT BRANDS MARQUEE
  // =========================================================================
  if (activeSubPage === "clients") {
    const handleSaveClients = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeClientsHeader: clientsHeader,
          clientBrands,
        });
        if (success) {
          showToast("Client Brands & Marquee updated successfully!");
        } else {
          showToast("Failed to save client brands", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "clients",
          "clients",
          "11. Client Brands & Marquee Management",
          "Manage partner brands, logos, industry tags, and the orbital showcase marquee on the homepage.",
          "#clients",
          handleSaveClients,
          "Save Brands"
        )}

        {/* Section Header Card */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Globe className="w-4 h-4 text-[#00d2ff]" />
            <span>Section Header Controls</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={clientsHeader.badge || "OUR CLIENTS"}
                onChange={(e) => setClientsHeader({ ...clientsHeader, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title Prefix
              </label>
              <input
                type="text"
                value={clientsHeader.title || "Client That We Have"}
                onChange={(e) => setClientsHeader({ ...clientsHeader, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Highlighted Word (Cyan)
              </label>
              <input
                type="text"
                value={clientsHeader.highlightText || "Worked With."}
                onChange={(e) => setClientsHeader({ ...clientsHeader, highlightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Description
              </label>
              <input
                type="text"
                value={clientsHeader.description || ""}
                onChange={(e) => setClientsHeader({ ...clientsHeader, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>
        </div>

        {/* Partner Brands List */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00d2ff]" />
              <span>Partner Brands ({clientBrands.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => {
                const newBrand: ClientBrand = {
                  name: "New Partner Brand",
                  label: "New Partner Brand",
                  industry: "E-Commerce / Technology",
                  iconName: "Globe",
                  logoUrl: "",
                  logoAlt: "New Partner Brand Logo",
                  logoSize: "md",
                  fitMode: "contain",
                  showName: true,
                  showIndustry: false,
                  active: true,
                  websiteUrl: "",
                };
                setClientBrands([...clientBrands, newBrand]);
                showToast("Added new partner brand");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Brand</span>
            </button>
          </div>

          <div className="space-y-6">
            {clientBrands.map((brand, idx) => (
              <BrandCardEditor
                key={brand.name + idx}
                brand={brand}
                idx={idx}
                onChange={(updatedBrand) => {
                  const updated = [...clientBrands];
                  updated[idx] = updatedBrand;
                  setClientBrands(updated);
                }}
                onDelete={() => {
                  if (confirm(`Delete brand "${brand.name}"?`)) {
                    setClientBrands(clientBrands.filter((_, i) => i !== idx));
                    showToast("Brand deleted");
                  }
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 12: CALL TO ACTION (CTA) SECTION
  // =========================================================================
  if (activeSubPage === "cta") {
    const handleSaveCta = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeCtaSettings: ctaSettings,
        });
        if (success) {
          showToast("Call To Action banner saved successfully!");
        } else {
          showToast("Failed to save Call To Action", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "cta",
          "cta",
          "12. Call To Action (CTA) Banner Management",
          "Manage the final conversion banner on the homepage: badge label, main headline, description, button links, background workstation scene, and floating tech pills.",
          "#contact",
          handleSaveCta,
          "Save CTA Banner"
        )}

        {/* Master Card 1: Content & Typography */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Send className="w-4 h-4 text-[#00d2ff]" />
            <span>CTA Banner Content &amp; Buttons</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Badge Label
              </label>
              <input
                type="text"
                value={ctaSettings.badge || "LET'S WORK TOGETHER"}
                onChange={(e) => setCtaSettings({ ...ctaSettings, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Main Headline
              </label>
              <input
                type="text"
                value={ctaSettings.title || "Have a Vision? Let's Turn It Into Reality."}
                onChange={(e) => setCtaSettings({ ...ctaSettings, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Supporting Text / Subtitle
              </label>
              <textarea
                rows={3}
                value={ctaSettings.description || ""}
                onChange={(e) => setCtaSettings({ ...ctaSettings, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Primary Button Label
              </label>
              <input
                type="text"
                value={ctaSettings.buttonText || "LET'S TALK PROJECTS"}
                onChange={(e) => setCtaSettings({ ...ctaSettings, buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Primary Button Link
              </label>
              <input
                type="text"
                value={ctaSettings.buttonLink || "/contact"}
                onChange={(e) => setCtaSettings({ ...ctaSettings, buttonLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Master Card 2: Background Scene & Floating Accents */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <Sparkles className="w-4 h-4 text-[#00d2ff]" />
            <span>Background Scene &amp; Floating Accents</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                CTA Integrated Background Image Asset
              </label>
              <UniversalImageManager
                label="Developer Workstation Scene"
                imageUrl={ctaSettings.bgImageUrl || "/assets/developer-workstation-hd.jpg"}
                fallbackUrl="/assets/developer-workstation-hd.jpg"
                alt="Developer Scene"
                aspectRatio="video"
                onImageChange={(newUrl) => setCtaSettings({ ...ctaSettings, bgImageUrl: newUrl })}
                onImageRemove={() => setCtaSettings({ ...ctaSettings, bgImageUrl: "" })}
                onSaveImmediate={async (newUrl) => {
                  const updated = { ...ctaSettings, bgImageUrl: newUrl };
                  setCtaSettings(updated);
                  await updateCms({ homeCtaSettings: updated });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#00d2ff] uppercase font-mono block">
                  Floating Tech Pills
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Floating Code Snippet Text
                    </label>
                    <input
                      type="text"
                      value={ctaSettings.codePillText || "await deployVision()"}
                      onChange={(e) => setCtaSettings({ ...ctaSettings, codePillText: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Monogram Badge Text
                    </label>
                    <input
                      type="text"
                      value={ctaSettings.monogramText || "TR"}
                      onChange={(e) => setCtaSettings({ ...ctaSettings, monogramText: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Metric Pill Label
                      </label>
                      <input
                        type="text"
                        value={ctaSettings.metricPillText || "Production Live:"}
                        onChange={(e) => setCtaSettings({ ...ctaSettings, metricPillText: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Metric Value
                      </label>
                      <input
                        type="text"
                        value={ctaSettings.metricPillValue || "100%"}
                        onChange={(e) => setCtaSettings({ ...ctaSettings, metricPillValue: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 13: HOMEPAGE SEO & OPEN GRAPH
  // =========================================================================
  if (activeSubPage === "seo") {
    const handleSaveSeo = async () => {
      setIsSaving(true);
      try {
        const updatedPages = (cmsData.pages || defaultCmsData.pages).map((p) =>
          p.slug === "/" ? { ...p, ...seoForm } : p
        );
        const success = await updateCms({ pages: updatedPages });
        if (success) {
          showToast("Homepage SEO & Open Graph meta saved!");
        } else {
          showToast("Failed to save SEO meta", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "seo",
          "hero",
          "13. Homepage SEO & Open Graph Management",
          "Manage search engine meta title, description, keywords, Open Graph image, and social preview cards for the homepage.",
          "",
          handleSaveSeo,
          "Save SEO Settings"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Homepage SEO Meta Title
              </label>
              <input
                type="text"
                value={seoForm.seoTitle}
                onChange={(e) => setSeoForm({ ...seoForm, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Meta Description (Search Snippet)
              </label>
              <textarea
                rows={3}
                value={seoForm.seoDesc}
                onChange={(e) => setSeoForm({ ...seoForm, seoDesc: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Meta Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={seoForm.keywords}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2 pt-3 border-t border-white/[0.08]">
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono">
                Social Share Image (Open Graph / Twitter Card)
              </label>
              <UniversalImageManager
                label="Open Graph Image Asset"
                imageUrl={seoForm.ogImage}
                fallbackUrl="/assets/profile-1-scaled.png"
                alt="Open Graph Preview"
                aspectRatio="video"
                onImageChange={(newUrl) => setSeoForm({ ...seoForm, ogImage: newUrl })}
                onImageRemove={() => setSeoForm({ ...seoForm, ogImage: "" })}
                onSaveImmediate={async (newUrl) => {
                  const updatedForm = { ...seoForm, ogImage: newUrl };
                  setSeoForm(updatedForm);
                  const updatedPages = (cmsData.pages || defaultCmsData.pages).map((p) =>
                    p.slug === "/" ? { ...p, ...updatedForm } : p
                  );
                  await updateCms({ pages: updatedPages });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 14: DESIGN & VISUAL SETTINGS
  // =========================================================================
  if (activeSubPage === "theme") {
    const handleSaveTheme = async () => {
      setIsSaving(true);
      try {
        const success = await updateCms({
          homeThemeSettings: themeSettings,
        });
        if (success) {
          showToast("Homepage visual settings saved successfully!");
        } else {
          showToast("Failed to save design settings", "error");
        }
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "theme",
          "hero",
          "14. Homepage Design & Visual Settings",
          "Manage primary accent colors, 3D interactive Three.js canvas background, and ambient divider animations.",
          "",
          handleSaveTheme,
          "Save Design Settings"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Primary Neon Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeSettings.primaryAccent || "#00d2ff"}
                  onChange={(e) => setThemeSettings({ ...themeSettings, primaryAccent: e.target.value })}
                  className="w-10 h-10 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.primaryAccent || "#00d2ff"}
                  onChange={(e) => setThemeSettings({ ...themeSettings, primaryAccent: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Secondary Neon Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeSettings.secondaryAccent || "#00f0ff"}
                  onChange={(e) => setThemeSettings({ ...themeSettings, secondaryAccent: e.target.value })}
                  className="w-10 h-10 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <input
                  type="text"
                  value={themeSettings.secondaryAccent || "#00f0ff"}
                  onChange={(e) => setThemeSettings({ ...themeSettings, secondaryAccent: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-3 border-t border-white/[0.08] space-y-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={themeSettings.enable3dBackground !== false}
                  onChange={(e) => setThemeSettings({ ...themeSettings, enable3dBackground: e.target.checked })}
                  className="accent-[#00d2ff]"
                />
                <span>Enable Interactive Three.js Ambient Particle Background on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={themeSettings.enableWaveDividers !== false}
                  onChange={(e) => setThemeSettings({ ...themeSettings, enableWaveDividers: e.target.checked })}
                  className="accent-[#00d2ff]"
                />
                <span>Enable Animated Wave Dividers Between Homepage Sections</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
