"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function InitialPageLoader() {
  const { cmsData } = useCms();
  const { t } = useLanguage();
  const [progress, setProgress] = useState(15);
  const [isReady, setIsReady] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const soundPlayedRef = useRef(false);

  // Play transition sound safely with volume control & browser autoplay protection
  const playTransitionSound = () => {
    if (soundPlayedRef.current) return;
    soundPlayedRef.current = true;

    const settings = cmsData?.loadingSoundSettings;
    // Check if loading sound is disabled in admin dashboard
    if (settings && settings.enabled === false) return;

    const soundUrl = settings?.soundUrl || "/sounds/whoosh-transition.wav";
    const rawVol = typeof settings?.volume === "number" ? settings.volume : 45;
    const volume = Math.max(0, Math.min(1, rawVol / 100));

    try {
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser policy or audio format issue
          // Silently proceed so animation and user experience never freeze
        });
      }
    } catch {
      // Safe fallback - animation continues undisturbed
    }
  };

  useEffect(() => {
    // Fast, smooth and realistic progress increments
    const t1 = setTimeout(() => setProgress(50), 220);
    const t2 = setTimeout(() => setProgress(85), 520);
    const t3 = setTimeout(() => setProgress(100), 780);

    // When progress reaches 100%, trigger the ready state (logo scale + center glow)
    const tReady = setTimeout(() => {
      setIsReady(true);
    }, 850);

    // Trigger cinematic vertical split exit & play transition sound at this exact moment
    const tSplit = setTimeout(() => {
      setIsSplitting(true);
      playTransitionSound();
    }, 1050);

    // Completely unmount and remove overlay so interaction is 100% clean
    const tFinish = setTimeout(() => {
      setIsFinished(true);
    }, 2050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tReady);
      clearTimeout(tSplit);
      clearTimeout(tFinish);
    };
  }, [cmsData]);

  if (isFinished) {
    return null;
  }

  // Premium cubic-bezier for a synchronized cinematic split
  const splitTransition = {
    duration: 0.95,
    ease: [0.85, 0, 0.15, 1] as const,
  };

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none select-none overflow-hidden"
      aria-label="Loading Website"
      role="status"
    >
      {/* ======================================================== */}
      {/* 1. LEFT HALF PANEL (Curtain slides to the left)          */}
      {/* ======================================================== */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isSplitting ? "-100%" : 0 }}
        transition={splitTransition}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#050811] z-20 overflow-hidden border-r border-[#00d2ff]/30 shadow-[4px_0_30px_rgba(0,210,255,0.3)]"
      >
        {/* Subtle Cyber Radial Glow */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#00d2ff]/10 via-[#0066ff]/05 to-transparent blur-[120px] pointer-events-none" />
      </motion.div>

      {/* ======================================================== */}
      {/* 2. RIGHT HALF PANEL (Curtain slides to the right)        */}
      {/* ======================================================== */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isSplitting ? "100%" : 0 }}
        transition={splitTransition}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#050811] z-20 overflow-hidden border-l border-[#00d2ff]/30 shadow-[-4px_0_30px_rgba(0,210,255,0.3)]"
      >
        {/* Subtle Cyber Radial Glow */}
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-[#00d2ff]/10 via-[#0066ff]/05 to-transparent blur-[120px] pointer-events-none" />
      </motion.div>

      {/* ======================================================== */}
      {/* 3. CENTER VERTICAL SPLIT GLOW SEAM                       */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{
          opacity: isSplitting ? [1, 0.9, 0] : isReady ? 0.95 : 0,
          scaleY: isReady ? 1 : 0.6,
        }}
        transition={{
          duration: isSplitting ? 0.75 : 0.35,
          ease: "easeInOut",
        }}
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] sm:w-[3px] bg-gradient-to-b from-transparent via-[#00f0ff] to-transparent shadow-[0_0_20px_#00f0ff,0_0_40px_#00d2ff] z-30 pointer-events-none"
      />

      {/* Subtle Cyan Flare on split trigger */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isSplitting ? [0, 0.5, 0] : 0,
          scale: isSplitting ? [0.8, 1.3, 1.8] : 0.8,
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-[#00d2ff]/20 via-[#818cf8]/15 to-transparent blur-3xl z-25 pointer-events-none"
      />

      {/* ======================================================== */}
      {/* 4. CENTER BRAND CONTENT (TR Logo, Name, Progress)        */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: isSplitting ? 0 : 1,
            scale: isSplitting ? 0.92 : isReady ? 1.06 : 1,
          }}
          transition={{
            duration: isSplitting ? 0.32 : 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex flex-col items-center"
        >
          {/* TR Monogram Logo with Pulsing Glowing Border */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative group mb-5"
          >
            {/* Animated Glowing Ring */}
            <div
              className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#00d2ff] blur-md transition-all duration-300 ${
                isReady
                  ? "opacity-100 scale-105 shadow-[0_0_30px_#00d2ff]"
                  : "opacity-75 animate-pulse"
              }`}
            />

            {/* Logo Emblem Box */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#070d1e] border border-[#00d2ff]/60 flex items-center justify-center shadow-[0_0_35px_rgba(0,210,255,0.35)] transition-all duration-300">
              <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-br from-white via-[#00d2ff] to-[#818cf8] bg-clip-text text-transparent">
                TR
              </span>
            </div>
          </motion.div>

          {/* Subtle Brand Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center space-y-1 mb-4"
          >
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wider uppercase font-sans">
              Tarek Rahaman
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#00d2ff]/80 uppercase">
              Creative Web Developer
            </p>
          </motion.div>

          {/* Thin Glowing Animated Progress Line */}
          <div className="w-36 sm:w-44 h-[2px] rounded-full bg-white/10 overflow-hidden relative shadow-[0_0_10px_rgba(0,210,255,0.2)]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#00d2ff] rounded-full shadow-[0_0_12px_#00d2ff]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>

          {/* Minimal "Loading Portfolio..." Status */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="mt-3 text-[10px] sm:text-[11px] font-mono text-slate-400 tracking-widest uppercase"
          >
            {isReady
              ? t("features.loadingReady", "Ready")
              : t("features.loadingText", "Loading Portfolio...")}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
