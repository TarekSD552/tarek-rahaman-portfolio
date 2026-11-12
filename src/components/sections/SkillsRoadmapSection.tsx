"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

const defaultRoadmapData = [
  {
    year: "2024",
    title: "Web Development Foundations",
    badge: "FOUNDATIONS",
    techList: ["HTML", "CSS", "JavaScript", "WordPress"],
    description:
      "Mastered semantic markup, modern responsive UI principles, DOM scripting, and custom WordPress setups.",
    isCurrent: false,
    isFuture: false,
  },
  {
    year: "2025",
    title: "Professional Web Solutions",
    badge: "BACKEND & COMMERCE",
    techList: ["WooCommerce", "PHP", "Laravel", "Database Development"],
    description:
      "Engineered scalable e-commerce stores, custom PHP backends, relational database schemas, and commercial workflows.",
    isCurrent: false,
    isFuture: false,
  },
  {
    year: "2026",
    title: "Full-Stack Development",
    badge: "CURRENT FOCUS",
    techList: ["Modern Web Applications", "Advanced Development", "Professional Client Projects"],
    description:
      "Delivering high-converting production platforms, custom Laravel systems, RESTful APIs, and full-stack solutions.",
    isCurrent: true,
    isFuture: false,
  },
  {
    year: "FUTURE",
    title: "Data Science & AI",
    badge: "NEXT HORIZON",
    techList: ["Python", "Data Analytics", "Machine Learning", "Intelligent Systems"],
    description:
      "Expanding into intelligent data-driven applications, predictive machine learning models, and automated AI systems.",
    isCurrent: false,
    isFuture: true,
  },
];

const bnRoadmapData = [
  {
    year: "২০২৪",
    title: "ওয়েব ডেভেলপমেন্টের সূচনা",
    badge: "ভিত্তি",
    techList: ["HTML", "CSS", "JavaScript", "WordPress"],
    description:
      "সিম্যান্টিক মার্কআপ, মডার্ন রেসপন্সিভ ডিজাইন, ডম স্ক্রিপ্টিং এবং ওয়ার্ডপ্রেস কাস্টমাইজেশন আয়ত্তকরণ।",
  },
  {
    year: "২০২৫",
    title: "প্রফেশনাল ওয়েব সলিউশন",
    badge: "ব্যাকএন্ড ও কমার্স",
    techList: ["WooCommerce", "PHP", "Laravel", "Database Development"],
    description:
      "স্কেলেবল ই-কমার্স স্টোর, কাস্টম পিএইচপি ব্যাকএন্ড, রিলেশনাল ডাটাবেজ স্কিমা ও বাণিজ্যিক সমাধান বাস্তবায়ন।",
  },
  {
    year: "২০২৬",
    title: "ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট",
    badge: "বর্তমান লক্ষ্য",
    techList: ["আধুনিক ওয়েব অ্যাপ", "উন্নত ডেভেলপমেন্ট", "প্রফেশনাল ক্লায়েন্ট প্রজেক্ট"],
    description:
      "উচ্চ কনভার্শনের প্রোডাকশন প্ল্যাটফর্ম, কাস্টম লারাভেল সিস্টেম, RESTful API এবং ফুল-স্ট্যাক প্ল্যাটফর্ম ডেলিভারি।",
  },
  {
    year: "ভবিষ্যৎ",
    title: "ডাটা সায়েন্স ও এআই",
    badge: "ভবিষ্যৎ দিগন্ত",
    techList: ["Python", "Data Analytics", "Machine Learning", "Intelligent Systems"],
    description:
      "বুদ্ধিমান ডাটা-ড্রিভেন অ্যাপ্লিকেশন, প্রেডিক্টিভ মেশিন লার্নিং মডেল এবং অটোমেটেড এআই সিস্টেমে সম্প্রসারণ।",
  },
];

export default function SkillsRoadmapSection() {
  const { cmsData } = useCms();
  const { language } = useLanguage();
  const isBn = language === "bn";

  const rawItems = cmsData?.skillsRoadmap?.length
    ? cmsData.skillsRoadmap
    : defaultRoadmapData;
  const baseItems = rawItems.filter((item: any) => item.enabled !== false);

  const roadmapItems = isBn
    ? baseItems.map((item: any, idx: number) => {
        const bnMatch = bnRoadmapData[idx] || bnRoadmapData[0];
        return {
          ...item,
          year: bnMatch.year || item.year,
          title: bnMatch.title,
          badge: bnMatch.badge,
          techList: bnMatch.techList,
          description: bnMatch.description,
        };
      })
    : baseItems;

  const header = isBn
    ? {
        badge: "আমার যাত্রা",
        title: "পেশাগত উন্নতির",
        highlightText: "রোডম্যাপ",
        description:
          "ওয়েব ডেভেলপমেন্টের ভিত্তি থেকে ফুল-স্ট্যাক ও ভবিষ্যৎ ডাটা সায়েন্সের দিকে আমার ধারাবাহিক অগ্রযাত্রা।",
      }
    : cmsData?.skillsRoadmapHeader || {
        badge: "MY JOURNEY",
        title: "Professional Growth",
        highlightText: "Roadmap",
        description:
          "A continuous evolution of engineering mastery, from web fundamentals to full-stack systems and intelligent data science.",
      };

  return (
    <section
      id="growth-roadmap"
      className="relative py-14 sm:py-18 select-none overflow-hidden"
    >
      {/* Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#00d2ff]/07 via-[#818cf8]/05 to-[#c084fc]/07 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.18)] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#00d2ff]">
            {header.badge}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3"
        >
          {header.title}{" "}
          {header.highlightText && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#c084fc]">
              {header.highlightText}
            </span>
          )}
        </motion.h2>

        {header.description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
          >
            {header.description}
          </motion.p>
        )}
      </div>

      {/* Timeline Container */}
      <div className="relative z-10">
        {/* DESKTOP TIMELINE (Visible on lg screens and up) */}
        <div className="hidden lg:block relative">
          {/* Horizontal Glowing Connecting Line */}
          <div className="absolute top-7 inset-x-8 h-0.5 bg-gradient-to-r from-[#00d2ff]/30 via-[#818cf8]/50 to-[#c084fc]/50 -z-0" />

          <div className="grid grid-cols-4 gap-6">
            {roadmapItems.map((item: any, idx: number) => (
              <motion.div
                key={item.year || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col items-center"
              >
                {/* Node Milestone Circle */}
                <div className="relative z-10 mb-6 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-xs tracking-wider border transition-all duration-300 ${
                      item.isCurrent
                        ? "bg-[#091530] border-[#00d2ff] text-[#00d2ff] shadow-[0_0_24px_rgba(0,210,255,0.6)] scale-110"
                        : item.isFuture
                        ? "bg-[#100d28] border-[#c084fc] text-[#c084fc] shadow-[0_0_18px_rgba(192,132,252,0.35)]"
                        : "bg-[#060c1d] border-[#00d2ff]/40 text-slate-300 shadow-[0_0_12px_rgba(0,0,0,0.8)]"
                    }`}
                  >
                    {item.year}
                  </div>

                  {/* Pulsing Ring on Current Year */}
                  {item.isCurrent && (
                    <span className="absolute -inset-1 rounded-full border border-[#00d2ff]/50 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Milestone Card */}
                <div
                  className={`w-full p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between h-full ${
                    item.isCurrent
                      ? "bg-[#091226]/95 border-[#00d2ff]/60 shadow-[0_8px_30px_rgba(0,210,255,0.2)]"
                      : item.isFuture
                      ? "bg-[#0c0a20]/90 border-[#c084fc]/35 hover:border-[#c084fc]/70 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
                      : "bg-[#080e1e]/85 border-[#00d2ff]/20 hover:border-[#00d2ff]/50 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/05 border border-white/10 text-[10px] font-mono font-bold tracking-wider text-[#00d2ff] mb-2.5">
                      {item.badge}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Tech Pills */}
                    {item.techList && (
                      <div className="text-xs font-semibold text-[#00d2ff]/90 mb-3 leading-relaxed">
                        {Array.isArray(item.techList) ? item.techList.join(" • ") : item.techList}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MOBILE & TABLET TIMELINE (Clean Vertical Layout) */}
        <div className="block lg:hidden relative pl-6 sm:pl-8">
          {/* Vertical Glowing Connecting Line */}
          <div className="absolute top-4 bottom-4 left-3 sm:left-4 w-0.5 bg-gradient-to-b from-[#00d2ff]/40 via-[#818cf8]/50 to-[#c084fc]/50" />

          <div className="space-y-6 sm:space-y-8">
            {roadmapItems.map((item: any, idx: number) => (
              <motion.div
                key={item.year || idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: 0.08 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Node Dot on Vertical Line */}
                <div
                  className={`absolute -left-3 sm:-left-4 top-4 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border -translate-x-1/2 z-10 ${
                    item.isCurrent
                      ? "bg-[#00d2ff] border-[#00d2ff] text-[#050811] shadow-[0_0_14px_#00d2ff]"
                      : item.isFuture
                      ? "bg-[#07051a] border-[#c084fc] text-[#c084fc]"
                      : "bg-[#050811] border-[#00d2ff]/50 text-[#00d2ff]"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                </div>

                {/* Card */}
                <div
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                    item.isCurrent
                      ? "bg-[#091226]/95 border-[#00d2ff]/60 shadow-[0_6px_25px_rgba(0,210,255,0.2)]"
                      : item.isFuture
                      ? "bg-[#0c0a20]/90 border-[#c084fc]/35"
                      : "bg-[#080e1e]/85 border-[#00d2ff]/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-xs font-mono font-black tracking-wider text-[#00d2ff]">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                    {item.title}
                  </h3>

                  {item.techList && (
                    <div className="text-xs font-semibold text-[#00d2ff]/90 mb-2 leading-relaxed">
                      {Array.isArray(item.techList) ? item.techList.join(" • ") : item.techList}
                    </div>
                  )}

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
