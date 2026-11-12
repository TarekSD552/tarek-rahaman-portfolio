"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Palette, Smartphone, Wrench, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cinematicEase } from "@/lib/animations";

export default function WhyChooseMeSection() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const items = [
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      iconBg: "bg-amber-500/10",
      iconBorder: "border-amber-500/30",
      iconColor: "text-amber-400",
      title: t("whyChooseMe.item1Title", "Fast & Responsive"),
      badge: t("whyChooseMe.item1Badge", "⚡ Speed"),
      description: t(
        "whyChooseMe.item1Desc",
        "Ultra-fast loading speeds, optimized assets, and silky-smooth rendering across every browser."
      ),
    },
    {
      icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5" />,
      iconBg: "bg-[#00d2ff]/10",
      iconBorder: "border-[#00d2ff]/30",
      iconColor: "text-[#00d2ff]",
      title: t("whyChooseMe.item2Title", "Modern UI/UX Design"),
      badge: t("whyChooseMe.item2Badge", "🎨 Aesthetics"),
      description: t(
        "whyChooseMe.item2Desc",
        "Pixel-perfect layouts, intuitive navigation flows, and captivating cyber-modern visuals."
      ),
    },
    {
      icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />,
      iconBg: "bg-emerald-500/10",
      iconBorder: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      title: t("whyChooseMe.item3Title", "Mobile Friendly"),
      badge: t("whyChooseMe.item3Badge", "📱 100% Adaptive"),
      description: t(
        "whyChooseMe.item3Desc",
        "Engineered mobile-first with flawless touch ergonomics, adaptive scales, and zero layout shift."
      ),
    },
    {
      icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />,
      iconBg: "bg-purple-500/10",
      iconBorder: "border-purple-500/30",
      iconColor: "text-purple-400",
      title: t("whyChooseMe.item4Title", "Ongoing Support"),
      badge: t("whyChooseMe.item4Badge", "🛠️ Reliable"),
      description: t(
        "whyChooseMe.item4Desc",
        "Continuous maintenance, proactive security, speed tuning, and prompt developer assistance."
      ),
    },
  ];

  // Strategic directional card motions:
  // Card 1: from Left
  // Card 2: from Bottom / Center
  // Card 3: from Bottom / Center
  // Card 4: from Right
  const getCardMotion = (idx: number) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.35, delay: idx * 0.08 },
      };
    }

    if (idx === 0) {
      return {
        initial: { opacity: 0, x: -35 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.55, delay: 0.08, ease: cinematicEase },
      };
    }
    if (idx === 3) {
      return {
        initial: { opacity: 0, x: 35 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.55, delay: 0.32, ease: cinematicEase },
      };
    }
    return {
      initial: { opacity: 0, y: 28, scale: 0.98 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.55, delay: 0.16 + idx * 0.08, ease: cinematicEase },
    };
  };

  return (
    <section
      aria-label="Why Work With Me"
      className="relative py-8 sm:py-10 md:py-12 bg-[#050811] overflow-hidden select-none"
    >
      {/* Subtle Ambient Glow Behind Section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[220px] bg-gradient-to-r from-[#00d2ff]/05 via-[#818cf8]/04 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Clean Header with Sequential Reveal */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1.5">
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: cinematicEase }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/25 text-[#00d2ff] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,210,255,0.15)] mb-1"
          >
            <Sparkles className="w-3 h-3 text-[#00d2ff] animate-pulse" />
            <span>{t("whyChooseMe.badge", "Core Engineering Values")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: cinematicEase }}
            className="text-2xl sm:text-3xl md:text-3xl font-black text-white tracking-tight"
          >
            {t("whyChooseMe.titlePrefix", "Why Work With")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#c084fc]">
              {t("whyChooseMe.titleHighlight", "Me?")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease: cinematicEase }}
            className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
          >
            {t(
              "whyChooseMe.subtitle",
              "Delivering high-performance, future-proof digital experiences tailored to scale your brand."
            )}
          </motion.p>
        </div>

        {/* 4 Compact Modern Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4">
          {items.map((item, idx) => {
            const motionProps = getCardMotion(idx);

            return (
              <motion.div
                key={item.title}
                initial={motionProps.initial}
                whileInView={motionProps.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={motionProps.transition}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -6,
                        scale: 1.015,
                        transition: { duration: 0.22, ease: "easeOut" },
                      }
                }
                className="group relative p-4 sm:p-5 rounded-2xl bg-[#070e24]/80 backdrop-blur-sm border border-white/10 hover:border-[#00d2ff]/50 shadow-md hover:shadow-[0_0_25px_rgba(0,210,255,0.22)] transition-colors duration-300 flex flex-col justify-between"
              >
                {/* Top Row: Icon + Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.iconBg} border ${item.iconBorder} ${item.iconColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 group-hover:border-[#00d2ff]/30 group-hover:text-slate-200 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1.5 group-hover:text-[#00d2ff] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Micro Indicator */}
                <div className="pt-3 mt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 group-hover:text-[#00d2ff] transition-colors">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{t("whyChooseMe.guaranteedStandard", "Guaranteed Standard")}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
