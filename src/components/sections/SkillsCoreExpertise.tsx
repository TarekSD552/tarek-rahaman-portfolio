"use client";

import { motion } from "framer-motion";
import { Globe, Server, ShoppingBag, Database, CheckCircle2, Sparkles, Layers, Cpu } from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

const defaultExpertiseData = [
  {
    number: "01",
    title: "Full-Stack Web Development",
    icon: "Globe",
    badge: "FRONTEND & BACKEND",
    highlights: [
      "Modern responsive web applications",
      "Frontend + backend integration",
      "Performance-focused development",
    ],
  },
  {
    number: "02",
    title: "Laravel & PHP Development",
    icon: "Server",
    badge: "BACKEND ARCHITECTURE",
    highlights: [
      "Custom web applications",
      "Database architecture",
      "Secure and scalable systems",
    ],
  },
  {
    number: "03",
    title: "WordPress & WooCommerce",
    icon: "ShoppingBag",
    badge: "CMS & E-COMMERCE",
    highlights: [
      "Professional business websites",
      "E-commerce development",
      "Elementor & custom solutions",
    ],
  },
  {
    number: "04",
    title: "Database & Data Solutions",
    icon: "Database",
    badge: "DATA ARCHITECTURE",
    highlights: [
      "MySQL database management",
      "Data organization",
      "Analytics and reporting fundamentals",
    ],
  },
];

const bnExpertiseData = [
  {
    number: "০১",
    title: "ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট",
    badge: "ফ্রন্টএন্ড ও ব্যাকএন্ড",
    highlights: [
      "আধুনিক ও রেসপন্সিভ ওয়েব অ্যাপ্লিকেশন",
      "ফ্রন্টএন্ড ও ব্যাকএন্ড নির্বিঘ্ন সংযোগ",
      "পারফরম্যান্স ও স্পিড ফোকাসড ডেভেলপমেন্ট",
    ],
  },
  {
    number: "০২",
    title: "লারাভেল ও পিএইচপি ডেভেলপমেন্ট",
    badge: "ব্যাকএন্ড আর্কিটেকচার",
    highlights: [
      "কাস্টম ওয়েব অ্যাপ্লিকেশন তৈরি",
      "শক্তিশালী ডাটাবেজ আর্কিটেকচার",
      "নিরাপদ ও স্কেলেবল ওয়েব সিস্টেম",
    ],
  },
  {
    number: "০৩",
    title: "ওয়ার্ডপ্রেস ও উকমার্স",
    badge: "সিএমএস ও ই-কমার্স",
    highlights: [
      "প্রফেশনাল বিজনেস ওয়েবসাইট",
      "উচ্চ কনভার্শনের ই-কমার্স শপ",
      "এলিমেন্টর ও কাস্টম থিম সমাধান",
    ],
  },
  {
    number: "০৪",
    title: "ডাটাবেজ ও ডাটা সলিউশন",
    badge: "ডাটা আর্কিটেকচার",
    highlights: [
      "MySQL ডাটাবেজ ম্যানেজমেন্ট",
      "ক্লিন ও স্ট্রাকচার্ড ডাটা সংগঠন",
      "এনালিটিক্স ও ব্যবসায়িক রিপোর্টিং",
    ],
  },
];

function getIconComponent(iconName?: string) {
  switch (iconName) {
    case "Server":
      return Server;
    case "ShoppingBag":
      return ShoppingBag;
    case "Database":
      return Database;
    case "Layers":
      return Layers;
    case "Cpu":
      return Cpu;
    default:
      return Globe;
  }
}

export default function SkillsCoreExpertise() {
  const { cmsData } = useCms();
  const { language } = useLanguage();
  const isBn = language === "bn";

  const rawItems = cmsData?.skillsCoreExpertise?.length
    ? cmsData.skillsCoreExpertise
    : defaultExpertiseData;
  const baseItems = rawItems.filter((item: any) => item.enabled !== false);

  const expertiseItems = isBn
    ? baseItems.map((item: any, idx: number) => {
        const bnMatch = bnExpertiseData[idx] || bnExpertiseData[0];
        return {
          ...item,
          number: bnMatch.number || item.number,
          title: bnMatch.title,
          badge: bnMatch.badge,
          highlights: bnMatch.highlights,
        };
      })
    : baseItems;

  const header = cmsData?.skillsCoreHeader;
  const badge = isBn ? "মূল সক্ষমতা ও ক্ষেত্র" : (header?.badge || "CORE EXPERTISE");
  const title = isBn ? "পেশাগত দক্ষতা ও" : (header?.title || "My Professional Strengths &");
  const highlightText = isBn ? "মূল সক্ষমতা" : (header?.highlightText || "Core Expertise");
  const description = isBn
    ? "বাণিজ্যিক নির্ভরযোগ্যতার সাথে আধুনিক, স্কেলেবল ও দ্রুতগতির ডিজিটাল সমাধান প্রদান।"
    : (header?.description ||
      "Delivering robust, scalable, and modern digital solutions across the full stack with commercial reliability.");

  return (
    <section
      id="core-expertise"
      className="relative py-14 sm:py-18 select-none overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-[#00d2ff]/07 via-[#818cf8]/05 to-[#c084fc]/07 rounded-full blur-[110px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.18)] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#00d2ff]">
            {badge}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3"
        >
          {title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#c084fc]">
            {highlightText}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
        >
          {description}
        </motion.p>
      </div>

      {/* 4 Larger Premium Cards in a Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
        {expertiseItems.map((item, idx) => {
          const Icon = getIconComponent(item.icon);
          return (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.08 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="group relative p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#080e1e]/85 hover:bg-[#0b1428]/95 border border-[#00d2ff]/20 hover:border-[#00d2ff]/65 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_36px_rgba(0,210,255,0.22)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Corner Ambient Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#00d2ff]/05 rounded-tr-3xl pointer-events-none group-hover:bg-[#00d2ff]/12 transition-colors duration-300" />

              <div>
                {/* Header Row: Micro Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#00d2ff]/10 border border-[#00d2ff]/25 text-[10px] font-mono font-bold tracking-wider text-[#00d2ff]">
                    {item.badge}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-[#00d2ff] transition-colors">
                    {item.number}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#051122]/90 border border-[#00d2ff]/30 text-[#00d2ff] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#00d2ff] group-hover:shadow-[0_0_18px_rgba(0,210,255,0.35)] transition-all duration-300 overflow-hidden">
                  {(item as any).imageUrl ? (
                    <img src={(item as any).imageUrl} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-[inherit]" />
                  ) : (
                    <Icon className="w-6 h-6 text-[#00d2ff]" />
                  )}
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-300 mb-4 leading-snug">
                  {item.title}
                </h3>

                {/* Bullet Points */}
                <ul className="space-y-2.5">
                  {(item.highlights || []).map((point: any) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Subtle Accent Glow Line */}
              <div className="mt-6 w-full h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent group-hover:via-[#00d2ff] transition-all duration-500" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
