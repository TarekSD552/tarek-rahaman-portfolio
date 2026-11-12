"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/image-utils";
import { useCms } from "@/context/CmsContext";

interface UniversalImageManagerProps {
  label?: string;
  imageUrl?: string;
  currentUrl?: string;
  fallbackUrl?: string;
  alt?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait" | "auto" | "avatar" | "logo";
  onImageChange: (newUrl: string) => void;
  onImageRemove?: () => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
  showToast?: (text: string, type?: "success" | "error" | "info") => void;
  className?: string;
  presetFolder?: string;
  onSaveImmediate?: (newUrl: string) => Promise<void> | void;
  maxHeight?: string;
  previewHeightClass?: string;
}

export default function UniversalImageManager({
  label = "Image Asset",
  imageUrl = "",
  currentUrl = "",
  fallbackUrl = "/assets/profile-1-scaled.png",
  alt = "Preview",
  aspectRatio = "video",
  onImageChange,
  onImageRemove,
  openMediaPicker,
  showToast,
  className = "",
  presetFolder = "general",
  onSaveImmediate,
  maxHeight,
  previewHeightClass
}: UniversalImageManagerProps) {
  const { refreshCms } = useCms();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeUrl = currentUrl || imageUrl || fallbackUrl;

  const isPortrait = aspectRatio === "portrait";
  const isSquareOrLogo = aspectRatio === "square" || aspectRatio === "avatar" || aspectRatio === "logo";

  // Controlled, professional responsive preview heights
  // Portrait: Desktop ~500px, Tablet ~420px, Mobile ~320px
  // Landscape / Video: Desktop ~260px, Mobile ~180px
  // Logos / Avatars: Desktop ~190px, Mobile ~140px
  const getContainerSizing = () => {
    if (previewHeightClass) return previewHeightClass;
    switch (aspectRatio) {
      case "portrait":
        return "h-[320px] sm:h-[400px] md:h-[460px] lg:h-[490px] max-h-[520px] w-full";
      case "wide":
        return "h-[140px] sm:h-[180px] md:h-[220px] w-full";
      case "square":
      case "avatar":
      case "logo":
        return "h-[140px] sm:h-[170px] md:h-[190px] w-full";
      case "auto":
        return "h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px] w-full";
      case "video":
      default:
        return "h-[180px] sm:h-[220px] md:h-[260px] w-full";
    }
  };

  const maxWidthClass = isPortrait
    ? "max-w-xl mx-auto"
    : isSquareOrLogo
    ? "max-w-xs mx-auto"
    : "w-full";

  // Direct file upload to /api/cms/media
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (res.ok && data.success && data.mediaItem?.url) {
        const newUrl = data.mediaItem.url;
        onImageChange(newUrl);
        if (onSaveImmediate) {
          try {
            await onSaveImmediate(newUrl);
          } catch (saveErr) {
            console.error("Auto-save on direct upload failed:", saveErr);
          }
        }
        showToast?.(`Uploaded "${file.name}" and applied!`);
      } else {
        showToast?.(data.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast?.(err?.message || "Failed to upload file", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2.5 select-none ${maxWidthClass} ${className}`}>
      {/* Hidden File Input for Direct Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/x-icon,image/vnd.microsoft.icon,image/ico,.ico,.png,.jpg,.jpeg,.svg,.webp"
        className="hidden"
        onChange={handleDirectUpload}
      />

      {label && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>{label}</span>
          {imageUrl ? (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active Image
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-500">Using Default</span>
          )}
        </div>
      )}

      {/* Image Preview Card: Contained, Centered, Professional Proportions */}
      <div
        className={`relative ${getContainerSizing()} rounded-2xl overflow-hidden bg-gradient-to-b from-[#070b16] via-[#040711] to-[#02040a] border border-white/10 hover:border-[#00d2ff]/40 transition-all duration-300 group shadow-lg flex items-center justify-center p-3`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {activeUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Subtle background grid pattern for transparent PNG contrast */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <img
              src={normalizeImageUrl(activeUrl)}
              alt={alt}
              className="max-h-full max-w-full object-contain rounded-xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] group-hover:scale-[1.02] transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== normalizeImageUrl(fallbackUrl)) {
                  target.src = normalizeImageUrl(fallbackUrl);
                }
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-[11px] font-mono">No Image Set</span>
          </div>
        )}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="p-2 px-3 rounded-xl bg-black/80 hover:bg-[#00d2ff] hover:text-[#050811] text-white border border-white/20 hover:border-[#00d2ff] transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-semibold"
            title="Expand Fullscreen Preview"
          >
            <Eye className="w-4 h-4" />
            <span>View Fullscreen</span>
          </button>
        </div>

        {/* Uploading Spinner Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <RefreshCw className="w-6 h-6 text-[#00d2ff] animate-spin" />
            <span className="text-[11px] font-mono text-[#00d2ff] font-bold">Uploading File...</span>
          </div>
        )}
      </div>

      {/* Action Buttons: [Replace Image] [Upload New Image] [Remove Image] */}
      <div className="grid grid-cols-3 gap-2 pt-0.5">
        {/* 1. Replace Image Button */}
        <button
          type="button"
          onClick={() => {
            if (openMediaPicker) {
              openMediaPicker(async (url) => {
                onImageChange(url);
                if (onSaveImmediate) {
                  try {
                    await onSaveImmediate(url);
                  } catch (saveErr) {
                    console.error("Auto-save on media select failed:", saveErr);
                  }
                }
                showToast?.("Image selected from library!");
              });
            } else {
              fileInputRef.current?.click();
            }
          }}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/30 transition-all cursor-pointer truncate"
          title="Choose an existing image or upload"
        >
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Replace</span>
        </button>

        {/* 2. Upload New Image Button */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 transition-all cursor-pointer disabled:opacity-50 truncate"
          title="Upload a new image file from your computer"
        >
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Upload</span>
        </button>

        {/* 3. Remove Image Button */}
        <button
          type="button"
          onClick={() => setShowRemoveConfirm(true)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer truncate"
          title="Remove or reset this image"
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Remove</span>
        </button>
      </div>

      {/* URL Raw text display */}
      <div
        className="text-[10px] font-mono text-slate-400 truncate select-all px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
        title={activeUrl}
      >
        <span className="truncate">{activeUrl}</span>
        <span className="text-[9px] text-[#00d2ff]/80 font-bold uppercase shrink-0 ml-2">Active Path</span>
      </div>

      {/* Remove Confirmation Dialog */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#090f1f] border border-rose-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Remove this image?</h4>
                <p className="text-[11px] text-slate-400">
                  This will reset the image to default or clear it.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowRemoveConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const resetVal = fallbackUrl || "";
                  if (onImageRemove) {
                    onImageRemove();
                  } else {
                    onImageChange(resetVal);
                  }
                  if (onSaveImmediate) {
                    try {
                      await onSaveImmediate(resetVal);
                    } catch (saveErr) {
                      console.error("Auto-save on remove failed:", saveErr);
                    }
                  }
                  setShowRemoveConfirm(false);
                  showToast?.("Image reset / removed.");
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                Yes, Remove Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Lightbox Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl bg-[#090f1f] border border-[#00d2ff]/40 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-xs font-bold text-white truncate max-w-md">{label}</h4>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center rounded-xl bg-black/80 p-2">
              <img
                src={normalizeImageUrl(activeUrl)}
                alt={alt}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

