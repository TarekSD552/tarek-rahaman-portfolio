"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap, Gem, MessageSquare, Rocket, Sparkles, Shield, CheckCircle2, Award, HeartHandshake } from "lucide-react";
import { cinematicEase } from "@/lib/animations";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, any> = {
  Zap,
  Gem,
  MessageSquare,
  Rocket,
  Shield,
  CheckCircle2,
  Award,
  HeartHandshake
};

const whyChooseMeData = [
  {
    badge: "⚡ FAST DELIVERY",
    title: "Fast & Reliable Delivery",
    description:
      "Projects are carefully planned and delivered efficiently without compromising quality.",
    icon: Zap,
    gradient: "from-[#00d2ff] to-[#0088ff]",
  },
  {
    badge: "💎 PREMIUM QUALITY",
    title: "Premium Quality",
    description:
      "Modern, clean, responsive, and professionally engineered digital experiences.",
    icon: Gem,
    gradient: "from-[#00f0ff] to-[#818cf8]",
  },
  {
    badge: "💬 CLEAR COMMUNICATION",
    title: "Clear Communication",
    description:
      "Stay informed throughout the project with transparent and professional communication.",
    icon: MessageSquare,
    gradient: "from-[#818cf8] to-[#c084fc]",
  },
  {
    badge: "🚀 PERFORMANCE FOCUSED",
    title: "Performance Focused",
    description:
      "Fast, optimized, scalable websites built for excellent user experience.",
    icon: Rocket,
    gradient: "from-[#00d2ff] to-[#a855f7]",
  },
];

export default function ServicesWhyWorkWithMe() {
  const { cmsData } = useCms();
  const { t, tCms, language } = useLanguage();
  const whyData = cmsData?.servicesWhyWorkWithMe;
  const badge = tCms(whyData?.badge, "servicesPage.whyChoose.badge");
  const title = tCms(whyData?.title, "servicesPage.whyChoose.title");
  const subtitle = tCms(whyData?.subtitle, "servicesPage.whyChoose.subtitle");
  const highlight = tCms(whyData?.highlightText, "servicesPage.whyChoose.subtitle");
  const description = tCms(whyData?.description, "servicesPage.whyChoose.desc");
  const rawCards = whyData?.cards?.length ? whyData.cards : whyChooseMeData;
  const cards = rawCards.filter((c: any) => c.enabled !== false).map((c: any, idx: number) => {
    if (language !== "bn") return c;
    const localized = [
      {
        badge: t("servicesPage.whyChoose.deliveryBadge"),
        title: t("servicesPage.whyChoose.deliveryTitle"),
        description: t("servicesPage.whyChoose.deliveryDesc"),
      },
      {
        badge: t("servicesPage.whyChoose.qualityBadge"),
        title: t("servicesPage.whyChoose.qualityTitle"),
        description: t("servicesPage.whyChoose.qualityDesc"),
      },
      {
        badge: t("servicesPage.whyChoose.commBadge"),
        title: t("servicesPage.whyChoose.commTitle"),
        description: t("servicesPage.whyChoose.commDesc"),
      },
      {
        badge: t("servicesPage.whyChoose.perfBadge"),
        title: t("servicesPage.whyChoose.perfTitle"),
        description: t("servicesPage.whyChoose.perfDesc"),
      },
    ];
    const match = localized[idx] || localized[0];
    return {
      ...c,
      badge: match.badge,
      title: match.title,
      description: match.description,
    };
  });

  const shouldReduceMotion = useReducedMotion();

  const getCardMotion = (idx: number) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.4 },
      };
    }
    if (idx === 0) {
      return {
        initial: { opacity: 0, x: -30 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.55, delay: 0.05, ease: cinematicEase },
      };
    }
    if (idx === 3) {
      return {
        initial: { opacity: 0, x: 30 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.55, delay: 0.25, ease: cinematicEase },
      };
    }
    return {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.55, delay: 0.1 + (idx - 1) * 0.08, ease: cinematicEase },
    };
  };

  return (
    <section
      id="why-choose-me"
      className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden"
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[300px] bg-gradient-to-r from-[#00d2ff]/08 via-[#8b5cf6]/06 to-[#0088ff]/08 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 relative z-10">
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
            {highlight}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal"
        >
          {description}
        </motion.p>
      </div>

      {/* 4 Feature Cards (Desktop 4-col, Tablet 2-col, Mobile 1-col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10 items-stretch">
        {cards.map((item: any, idx: number) => {
          const Icon = typeof item.icon === "string" ? (iconMap[item.icon] || Zap) : (item.icon || Zap);
          const motionProps = getCardMotion(idx);
          return (
            <motion.div
              key={item.badge || idx}
              initial={motionProps.initial}
              whileInView={motionProps.whileInView}
              viewport={{ once: true, amount: 0.15 }}
              transition={motionProps.transition}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -5,
                      transition: { duration: 0.22, ease: "easeOut" },
                    }
              }
              className="group relative p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#080e1e]/90 hover:bg-[#0c1630] border border-[#00d2ff]/22 hover:border-[#00d2ff]/65 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_36px_rgba(0,210,255,0.2)] transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
            >
              {/* Subtle Ambient Corner Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#00d2ff]/05 rounded-tr-3xl pointer-events-none group-hover:bg-[#00d2ff]/12 transition-colors duration-300" />

              <div>
                {/* Micro Badge */}
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#00d2ff]/10 border border-[#00d2ff]/25 text-[10px] font-mono font-bold tracking-wider text-[#00d2ff] mb-4">
                  {item.badge}
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#051122]/90 border border-[#00d2ff]/30 text-[#00d2ff] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#00d2ff] group-hover:shadow-[0_0_18px_rgba(0,210,255,0.4)] transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#00d2ff]" />
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-300 mb-2.5">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Glowing Line on Hover */}
              <div className="mt-5 w-full h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#00d2ff]/25 to-transparent group-hover:via-[#00d2ff] transition-all duration-300" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

