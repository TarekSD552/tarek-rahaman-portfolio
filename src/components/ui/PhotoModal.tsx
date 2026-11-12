"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";

interface PhotoModalProps {
  photo: {
    src: string;
    alt: string;
    label: string;
  } | null;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  return (
    <AnimatePresence>
      {photo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030508]/80 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 max-w-2xl w-full bg-[#0a0f1d]/90 border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:text-amber-400 hover:bg-black/90 border border-white/10 transition-colors"
              aria-label="Close photo view"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo View */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[4/4] overflow-hidden bg-black/40">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-80" />
            </div>

            {/* Photo Info Banner */}
            <div className="p-6 sm:p-8 bg-[#0a0f1d] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tarek Rahaman — Gallery Focus</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {photo.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Creative Web Developer & Full-Stack Architect
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-full hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

