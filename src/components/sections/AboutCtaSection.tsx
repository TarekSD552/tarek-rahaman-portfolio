"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Sparkles, Send } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutCtaSection() {
  const { cmsData } = useCms();
  const { t, tCms } = useLanguage();
  const cta = cmsData?.aboutCta;

  const badge = tCms(cta?.badge, "about.ctaBadge");
  const title = tCms(cta?.title, "about.ctaTitle");
  const description = tCms(cta?.description, "about.ctaDesc");
  const primaryButtonText = tCms(cta?.primaryButtonText, "about.ctaPrimary");
  const primaryButtonUrl = cta?.primaryButtonUrl || "/contact";
  const secondaryButtonText = tCms(cta?.secondaryButtonText, "about.ctaSecondary");
  const secondaryButtonUrl = cta?.secondaryButtonUrl || "/contact";

  return (
    <section className="relative my-8 sm:my-12 overflow-hidden">
      {/* Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[360px] bg-gradient-to-r from-[#00d2ff]/15 via-[#8b5cf6]/10 to-[#00f0ff]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Cyber Glassmorphism Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#091328]/95 via-[#070e20]/90 to-[#040814]/95 border border-[#00d2ff]/40 shadow-[0_0_60px_rgba(0,210,255,0.18),0_25px_60px_rgba(0,0,0,0.9)] p-8 sm:p-12 md:p-14 text-center overflow-hidden">
        {/* Subtle Cyber Corner Accents */}
        <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-[#00d2ff]/20 to-transparent pointer-events-none rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-[#8b5cf6]/20 to-transparent pointer-events-none rounded-br-3xl" />

        {/* Ambient Grid Accent */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00d2ff 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Small Badge / Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,210,255,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#00d2ff]" />
            {badge}
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {description}
          </motion.p>

          {/* Two Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
          >
            {/* Primary Button */}
            <MagneticButton>
              <Link
                href={primaryButtonUrl}
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#0088ff] shadow-[0_0_28px_rgba(0,210,255,0.75)] hover:shadow-[0_0_40px_rgba(0,210,255,1)] hover:scale-105 transition-all duration-300"
              >
                <Send className="w-4 h-4 text-[#050811] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span>{primaryButtonText}</span>
                <ArrowRight className="w-4 h-4 text-[#050811] group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>

            {/* Secondary Button */}
            <MagneticButton>
              <Link
                href={secondaryButtonUrl}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#091224]/90 hover:bg-[#00d2ff]/15 border border-[#00d2ff]/45 hover:border-[#00d2ff] hover:shadow-[0_0_22px_rgba(0,210,255,0.35)] hover:scale-105 transition-all duration-300"
              >
                <Mail className="w-4 h-4 text-[#00d2ff] group-hover:scale-110 transition-transform" />
                <span>{secondaryButtonText}</span>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

