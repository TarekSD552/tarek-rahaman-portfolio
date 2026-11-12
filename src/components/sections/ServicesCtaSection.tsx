"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Send, Sparkles } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";

export default function ServicesCtaSection() {
  const { cmsData } = useCms();
  const { tCms } = useLanguage();
  const cta = cmsData?.servicesCta;
  const badge = tCms(cta?.badge, "servicesPage.servicesCta.badge");
  const title = tCms(cta?.title, "servicesPage.servicesCta.title");
  const description = tCms(cta?.description, "servicesPage.servicesCta.desc");
  const primaryButtonText = tCms(cta?.primaryButtonText, "servicesPage.servicesCta.primaryBtn");
  const primaryButtonUrl = cta?.primaryButtonUrl || "/contact";
  const primaryButtonVisible = cta?.primaryButtonVisible !== false;
  const secondaryButtonText = tCms(cta?.secondaryButtonText, "servicesPage.servicesCta.secondaryBtn");
  const secondaryButtonUrl = cta?.secondaryButtonUrl || "/portfolio";
  const secondaryButtonVisible = cta?.secondaryButtonVisible !== false;
  const bgImageUrl = cta?.bgImageUrl ? normalizeImageUrl(cta.bgImageUrl) : null;

  return (
    <section className="relative py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-12 sm:mb-14 overflow-hidden">
      {/* Background Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#00d2ff]/15 via-[#818cf8]/10 to-[#c084fc]/12 rounded-full blur-[130px] pointer-events-none" />

      {/* Cyber Glassmorphism Container */}
      <div
        className="relative text-center p-8 sm:p-12 md:p-14 rounded-3xl bg-gradient-to-b from-[#091328]/95 via-[#070e20]/90 to-[#040814]/95 border border-[#00d2ff]/40 shadow-[0_0_60px_rgba(0,210,255,0.18),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        style={
          bgImageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(9, 19, 40, 0.92), rgba(4, 8, 20, 0.96)), url('${bgImageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
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

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
            <span>{badge}</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black text-white tracking-tight leading-tight"
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto pb-3 font-normal"
          >
            {description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 pt-1"
          >
            {primaryButtonVisible && (
              <MagneticButton>
                <Link
                  href={primaryButtonUrl}
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#0088ff] shadow-[0_0_25px_rgba(0,210,255,0.75)] hover:shadow-[0_0_40px_rgba(0,210,255,1)] hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-4 h-4 text-[#050811] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>{primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4 text-[#050811] group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
            )}

            {secondaryButtonVisible && (
              <MagneticButton>
                <Link
                  href={secondaryButtonUrl}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#091224]/90 hover:bg-[#00d2ff]/15 border border-[#00d2ff]/45 hover:border-[#00d2ff] hover:shadow-[0_0_22px_rgba(0,210,255,0.35)] hover:scale-105 transition-all duration-300"
                >
                  <span>{secondaryButtonText}</span>
                </Link>
              </MagneticButton>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
