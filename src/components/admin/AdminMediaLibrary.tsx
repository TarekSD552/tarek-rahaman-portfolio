"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Eye,
  FileText,
  AlertTriangle,
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import { CmsMediaItem } from "@/types/portfolio";

interface AdminMediaLibraryProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
}

export default function AdminMediaLibrary({ showToast }: AdminMediaLibraryProps) {
  const { cmsData, updateCms, refreshCms } = useCms();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "document">("all");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Preview Modal
  const [previewMedia, setPreviewMedia] = useState<CmsMediaItem | null>(null);

  // Delete Warning Modal
  const [deleteWarning, setDeleteWarning] = useState<{
    isOpen: boolean;
    media: CmsMediaItem | null;
    inUseLocations: string[];
  }>({
    isOpen: false,
    media: null,
    inUseLocations: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaList = cmsData.media || [];

  // Function to check if a media item is currently in use in cmsData
  const checkMediaInUse = (url: string): string[] => {
    const locations: string[] = [];
    if (!url) return locations;

    // Check Hero
    if (cmsData.hero?.portraitUrl === url) locations.push("Homepage Hero Portrait");
    if (cmsData.hero?.primaryButtonUrl === url) locations.push("Hero Resume Link");

    // Check Profile Photos
    cmsData.profile?.heroPhotos?.forEach((p, idx) => {
      if (p.src === url) locations.push(`About Hero Card ${idx + 1}`);
    });

    // Check Milestones Photos
    cmsData.milestonesPhotos?.forEach((p, idx) => {
      if (p.src === url) locations.push(`Moments Collage Photo ${idx + 1}`);
    });

    // Check Projects
    cmsData.projects?.forEach((p) => {
      if (p.image === url) locations.push(`Project "${p.title}"`);
    });

    // Check Site Settings
    if (cmsData.siteSettings?.logoUrl === url) locations.push("Navbar Brand Logo");
    if (cmsData.siteSettings?.faviconUrl === url) locations.push("Website Favicon");
    if (cmsData.siteSettings?.cvUrl === url) locations.push("Site Settings CV File");

    return locations;
  };

  // Filtered media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesType =
        filterType === "all" ||
        (filterType === "image" && item.mimeType?.startsWith("image/")) ||
        (filterType === "document" && !item.mimeType?.startsWith("image/"));
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [mediaList, filterType, searchQuery]);

  // Handle direct file upload to /api/cms/media
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCms();
        showToast(`Uploaded "${file.name}" successfully!`);
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to upload file", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast("URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#070d1e] via-[#0b1633] to-[#070d1e] border border-[#00d2ff]/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 uppercase tracking-widest">
              Digital Assets Repo
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">/public/uploads/</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Media Assets Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Upload, preview, copy URLs, and safely manage images, logos, screenshots, and PDF documents. Includes automatic in-use safety verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#00d2ff] to-[#0072ff] hover:opacity-90 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
          </button>
        </div>
      </div>

      {/* Main Media Grid Card */}
      <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media by filename..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#050811] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {(["all", "image", "document"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${filterType === type
                    ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
              >
                {type === "all" ? `All (${mediaList.length})` : type === "image" ? "Images" : "Documents"}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.mimeType?.startsWith("image/") || item.url.match(/\.(jpeg|jpg|png|webp|svg|gif)$/i);
            const inUseLocations = checkMediaInUse(item.url);
            const isInUse = inUseLocations.length > 0;

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#050811] border border-white/10 hover:border-[#00d2ff]/40 transition-all space-y-2 flex flex-col justify-between group"
              >
                {/* Media Thumbnail */}
                <div
                  onClick={() => setPreviewMedia(item)}
                  className="relative aspect-square rounded-lg overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center cursor-pointer"
                >
                  {isImage ? (
                    <img
                      src={normalizeImageUrl(item.url)}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-8 h-8 text-[#00d2ff]" />
                      <span className="text-[9px] uppercase font-mono mt-1 font-bold">PDF Doc</span>
                    </div>
                  )}

                  {isInUse && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/80 text-white">
                      In Use
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <div className="text-[11px] font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    {item.size ? (typeof item.size === "number" ? `${(item.size / 1024).toFixed(0)} KB` : item.size) : "Uploaded"}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00d2ff] cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedUrl === item.url ? <Check className="w-3 h-3 text-[#00d2ff]" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={() => setPreviewMedia(item)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                    title="Preview"
                  >
                    <Eye className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      if (isInUse) {
                        setDeleteWarning({
                          isOpen: true,
                          media: item,
                          inUseLocations
                        });
                      } else {
                        if (confirm(`Delete media asset "${item.name}"?`)) {
                          const updated = mediaList.filter((m) => m.id !== item.id);
                          updateCms({ media: updated });
                          showToast("Media asset deleted.");
                        }
                      }
                    }}
                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-[#090f1f] border border-[#00d2ff]/40 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white truncate max-w-md">{previewMedia.name}</h3>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center">
                {previewMedia.mimeType?.startsWith("image/") || previewMedia.url.match(/\.(jpeg|jpg|png|webp|svg|gif)$/i) ? (
                  <img
                    src={normalizeImageUrl(previewMedia.url)}
                    alt={previewMedia.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 space-y-2">
                    <FileText className="w-12 h-12 text-[#00d2ff]" />
                    <span className="text-sm font-bold">{previewMedia.name}</span>
                    <a
                      href={previewMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-[#00d2ff]/20 text-[#00d2ff] font-bold text-xs flex items-center gap-1.5"
                    >
                      <span>Open Document in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#050811] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">File URL:</span>
                  <button
                    onClick={() => copyToClipboard(previewMedia.url)}
                    className="text-[#00d2ff] hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-slate-300 break-all select-all">
                  {previewMedia.url}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IN-USE SAFETY WARNING MODAL */}
      <AnimatePresence>
        {deleteWarning.isOpen && deleteWarning.media && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#13070b] border border-rose-500/50 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Media Currently In Use</h3>
                  <p className="text-xs text-rose-200">This asset is actively displayed on your live website.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Active Locations:</span>
                <ul className="space-y-1 text-slate-300">
                  {deleteWarning.inUseLocations.map((loc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{loc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-slate-400">
                Deleting this media item will break the images or links at these locations. We recommend replacing them in the respective section before deleting.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setDeleteWarning({ isOpen: false, media: null, inUseLocations: [] })}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs cursor-pointer"
                >
                  Keep File (Recommended)
                </button>
                <button
                  onClick={async () => {
                    const updated = mediaList.filter((m) => m.id !== deleteWarning.media?.id);
                    await updateCms({ media: updated });
                    setDeleteWarning({ isOpen: false, media: null, inUseLocations: [] });
                    showToast("Media asset forcefully deleted.", "error");
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer hover:bg-rose-700"
                >
                  Delete Anyway
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
