"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { HeroPhoto } from "@/types/portfolio";
import { normalizeImageUrl } from "@/lib/image-utils";

interface HeroPhotoCollageProps {
  photos: HeroPhoto[];
}

export default function HeroPhotoCollage({ photos }: HeroPhotoCollageProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Close modal on Escape key, navigate with arrow keys
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight" && selectedIdx !== null) {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      } else if (e.key === "ArrowLeft" && selectedIdx !== null) {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      }
    },
    [selectedIdx, photos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIdx]);

  // 3-Photo Layered Depth Hierarchy (Enlarged by ~12-15% on Desktop for Optimal Hero Balance):
  // [LEFT PHOTO]   : Behind center, rotated -5deg, slightly smaller (z-10)
  // [CENTER PHOTO] : Main focus, STRAIGHT (0deg), largest & dominant, in front (z-20)
  // [RIGHT PHOTO]  : Behind center, rotated +5deg, slightly smaller (z-10)
  const cardConfigs = [
    {
      // Photo 1 (Step 1): Left/Back photo appears first
      containerClass:
        "absolute top-5 sm:top-7 lg:top-8 left-0 sm:left-1 lg:left-2 w-[135px] sm:w-[185px] md:w-[210px] lg:w-[220px] xl:w-[225px] aspect-[4/5] z-10",
      rotation: -5,
      floatY: [-2.5, 2.5, -2.5],
      floatDuration: 6.2,
      baseZ: 10,
      delay: 0.15,
    },
    {
      // Photo 2 (Step 2): Center/Main portrait appears second (Dominant & Straight 0°)
      containerClass:
        "absolute top-0 sm:top-1 lg:top-2 left-1/2 -translate-x-1/2 w-[175px] sm:w-[245px] md:w-[275px] lg:w-[285px] xl:w-[290px] aspect-[3/4] z-20",
      rotation: 0,
      floatY: [2.5, -2.5, 2.5],
      floatDuration: 7.0,
      baseZ: 20,
      delay: 0.45,
    },
    {
      // Photo 3 (Step 3): Right/Back photo appears third
      containerClass:
        "absolute bottom-2 sm:bottom-4 lg:bottom-5 right-0 sm:right-1 lg:right-2 w-[135px] sm:w-[180px] md:w-[205px] lg:w-[215px] xl:w-[220px] aspect-[4/5] z-10",
      rotation: 5,
      floatY: [-2.5, 2.5, -2.5],
      floatDuration: 5.6,
      baseZ: 10,
      delay: 0.75,
    },
  ];

  const selectedPhoto = selectedIdx !== null ? photos[selectedIdx] : null;

  return (
    <>
      {/* 3-Photo Layered Depth Collage Wrapper (Expanded by ~12-15% on Desktop) */}
      <div className="relative w-full max-w-[330px] sm:max-w-[430px] md:max-w-[485px] lg:max-w-[500px] xl:max-w-[515px] h-[330px] sm:h-[400px] md:h-[455px] lg:h-[465px] xl:h-[475px] mx-auto flex items-center justify-center select-none">
        {/* Soft Ambient Cyan/Blue Glow Behind Stack */}
        <div className="absolute inset-4 bg-gradient-to-tr from-[#00d2ff]/10 via-[#0088ff]/08 to-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        {photos.slice(0, 3).map((photo, idx) => {
          const config = cardConfigs[idx];
          const isHovered = hoveredIdx === idx;
          const isCenter = idx === 1;
          const imgSrc = normalizeImageUrl(photo.src);

          return (
            <motion.div
              key={photo.id || `hero-photo-${idx}`}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: config.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={config.containerClass}
              style={{
                zIndex: isHovered ? 30 : config.baseZ,
              }}
            >
              {/* Subtle Independent Floating Motion */}
              <motion.div
                animate={{
                  y: config.floatY,
                }}
                transition={{
                  duration: config.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full"
              >
                {/* Photo Card Frame: Clean Photography, Zero Overlaid Text */}
                <motion.div
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setSelectedIdx(idx)}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  animate={{
                    rotate: config.rotation,
                  }}
                  className={`group relative w-full h-full rounded-2xl sm:rounded-3xl cursor-pointer overflow-hidden bg-[#070d1d] transition-all duration-300 ${
                    isCenter
                      ? "border border-[#00d2ff]/50 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(0,210,255,0.2)] hover:border-[#00d2ff] hover:shadow-[0_18px_45px_rgba(0,0,0,0.95),0_0_36px_rgba(0,210,255,0.5)]"
                      : "border border-[#00d2ff]/25 shadow-[0_10px_28px_rgba(0,0,0,0.75),0_0_12px_rgba(0,210,255,0.12)] hover:border-[#00d2ff]/70 hover:shadow-[0_14px_35px_rgba(0,0,0,0.85),0_0_24px_rgba(0,210,255,0.35)]"
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View photo ${idx + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedIdx(idx);
                    }
                  }}
                >
                  {/* Clean Upright Image Display with NO overlaid text badges */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={photo.alt || "Tarek Rahaman Portfolio"}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-104 select-none"
                      loading={isCenter ? "eager" : "lazy"}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== "/assets/profile-1-scaled.png") {
                          target.src = "/assets/profile-1-scaled.png";
                        }
                      }}
                    />

                    {/* Subtle Depth Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/35 via-transparent to-transparent pointer-events-none" />

                    {/* Subtle Corner Glow Accent on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00d2ff]/[0.08] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Focus Modal View on Click */}
      <AnimatePresence>
        {selectedIdx !== null && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050811]/90 backdrop-blur-xl"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Modal Dialog Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#091024] border border-[#00d2ff]/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,210,255,0.35)] overflow-hidden"
            >
              {/* Background Glow Accents */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#00d2ff]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#0070f3]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#00d2ff]/15">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#00d2ff]">
                    {selectedPhoto.role || "Featured Portfolio Asset"}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedIdx(null)}
                  className="w-8 h-8 rounded-full bg-[#0d1730] hover:bg-[#00d2ff] hover:text-[#050811] text-slate-300 border border-[#00d2ff]/30 hover:border-[#00d2ff] flex items-center justify-center transition-all duration-200 shadow-[0_0_12px_rgba(0,210,255,0.2)]"
                  aria-label="Close photo view"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* High-Resolution Uncropped Photo Display */}
              <div className="relative w-full h-[300px] sm:h-[420px] my-4 rounded-2xl overflow-hidden bg-[#050811] border border-[#00d2ff]/20 shadow-inner flex items-center justify-center">
                <img
                  src={normalizeImageUrl(selectedPhoto.src)}
                  alt={selectedPhoto.alt || "Photo Preview"}
                  className="max-w-full max-h-full object-contain p-2 select-none"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "/assets/profile-1-scaled.png") {
                      target.src = "/assets/profile-1-scaled.png";
                    }
                  }}
                />
              </div>

              {/* Modal Footer with Clean Captions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {selectedPhoto.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-md">
                    {selectedPhoto.description}
                  </p>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIdx((prev) =>
                        prev !== null ? (prev - 1 + photos.length) % photos.length : 0
                      )
                    }
                    className="w-8 h-8 rounded-full bg-[#0c1630] hover:bg-[#00d2ff] hover:text-[#050811] text-slate-200 border border-[#00d2ff]/30 flex items-center justify-center transition-all duration-200"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-400 px-1">
                    {selectedIdx + 1} / {photos.length}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIdx((prev) =>
                        prev !== null ? (prev + 1) % photos.length : 0
                      )
                    }
                    className="w-8 h-8 rounded-full bg-[#0c1630] hover:bg-[#00d2ff] hover:text-[#050811] text-slate-200 border border-[#00d2ff]/30 flex items-center justify-center transition-all duration-200"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
