"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, BarChart3, Layers, Terminal } from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

const defaultLearningTopics = [
  {
    icon: "Terminal",
    emoji: "🐍",
    title: "Python for Data Science",
    description:
      "Mastering NumPy, Pandas, Matplotlib, and exploratory data analysis workflows for real-world datasets.",
    status: "Learning / Exploring",
    tag: "DATA SCIENCE",
    gradient: "from-[#00d2ff] to-[#38bdf8]",
    footerLabel: "Active Learning",
  },
  {
    icon: "BarChart3",
    emoji: "📊",
    title: "Data Analytics & Power BI",
    description:
      "Transforming complex datasets into actionable business intelligence dashboards and KPI visual models.",
    status: "Learning / Exploring",
    tag: "BUSINESS INTELLIGENCE",
    gradient: "from-[#38bdf8] to-[#818cf8]",
    footerLabel: "Active Learning",
  },
  {
    icon: "Brain",
    emoji: "🧠",
    title: "Machine Learning Fundamentals",
    description:
      "Studying supervised learning algorithms, regression models, classification techniques, and neural networks.",
    status: "Learning / Exploring",
    tag: "ARTIFICIAL INTELLIGENCE",
    gradient: "from-[#818cf8] to-[#c084fc]",
    footerLabel: "Active Learning",
  },
  {
    icon: "Layers",
    emoji: "⚙️",
    title: "Advanced Software Architecture",
    description:
      "Deepening knowledge in clean architecture, microservices patterns, API scalability, and system design.",
    status: "Learning / Exploring",
    tag: "SYSTEM DESIGN",
    gradient: "from-[#c084fc] to-[#00d2ff]",
    footerLabel: "Active Learning",
  },
];

const bnLearningTopics = [
  {
    title: "ডাটা সায়েন্সের জন্য পাইথন",
    description:
      "বাস্তব ডেটাসেট বিশ্লেষণের জন্য NumPy, Pandas, Matplotlib এবং এক্সপ্লোরেটরি ডাটা এনালাইসিস আয়ত্তকরণ।",
    status: "অধ্যয়নরত",
    tag: "ডাটা সায়েন্স",
    footerLabel: "সক্রিয় শিখন",
  },
  {
    title: "ডাটা এনালিটিক্স ও পাওয়ার বিআই",
    description:
      "জটিল ডেটাসেটকে কার্যকরী ব্যবসায়িক ড্যাশবোর্ড এবং কেপিআই ভিজ্যুয়াল মডেলে রূপান্তর।",
    status: "অধ্যয়নরত",
    tag: "বিজনেস ইন্টেলিজেন্স",
    footerLabel: "সক্রিয় শিখন",
  },
  {
    title: "মেশিন লার্নিং ফান্ডামেন্টালস",
    description:
      "সুপারভাইজড লার্নিং অ্যালগরিদম, রিগ্রেশন মডেল, ক্লাসিফিকেশন এবং নিউরাল নেটওয়ার্ক গবেষণা।",
    status: "অধ্যয়নরত",
    tag: "কৃত্রিম বুদ্ধিমত্তা",
    footerLabel: "সক্রিয় শিখন",
  },
  {
    title: "অ্যাডভান্সড সফটওয়্যার আর্কিটেকচার",
    description:
      "ক্লিন আর্কিটেকচার, মাইক্রোসার্ভিস প্যাটার্ন, এপিআই স্কেলেবিলিটি এবং আধুনিক সিস্টেম ডিজাইন দক্ষতা বৃদ্ধি।",
    status: "অধ্যয়নরত",
    tag: "সিস্টেম ডিজাইন",
    footerLabel: "সক্রিয় শিখন",
  },
];

function getLearningIcon(iconName?: string) {
  switch (iconName) {
    case "BarChart3":
      return BarChart3;
    case "Brain":
      return Brain;
    case "Layers":
      return Layers;
    default:
      return Terminal;
  }
}

export default function SkillsLearningSection() {
  const { cmsData } = useCms();
  const { language } = useLanguage();
  const isBn = language === "bn";

  const rawList = cmsData?.skillsLearning?.length
    ? cmsData.skillsLearning
    : defaultLearningTopics;
  const baseList = rawList.filter((item: any) => item.enabled !== false);

  const learningList = isBn
    ? baseList.map((item: any, idx: number) => {
        const bnMatch = bnLearningTopics[idx] || bnLearningTopics[0];
        return {
          ...item,
          title: bnMatch.title,
          description: bnMatch.description,
          status: bnMatch.status,
          tag: bnMatch.tag,
          footerLabel: bnMatch.footerLabel,
        };
      })
    : baseList;

  const header = isBn
    ? {
        badge: "চলমান শিখন ও অন্বেষণ",
        title: "ভবিষ্যৎ প্রযুক্তি ও",
        highlightText: "চলমান গবেষণা",
        description:
          "ডাটা সায়েন্স, মেশিন লার্নিং ও আধুনিক সফটওয়্যার আর্কিটেকচারে নিজেকে প্রতিনিয়ত আপডেট রাখছি।",
      }
    : cmsData?.skillsLearningHeader || {
        badge: "CONTINUOUS GROWTH",
        title: "Currently Learning &",
        highlightText: "Exploring",
        description:
          "Continuously expanding my technical knowledge and preparing for the next generation of digital solutions.",
      };

  return (
    <section
      id="continuous-growth"
      className="relative py-14 sm:py-18 select-none overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-gradient-to-r from-[#818cf8]/06 via-[#c084fc]/06 to-[#00d2ff]/06 rounded-full blur-[110px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#818cf8]/10 border border-[#818cf8]/30 shadow-[0_0_15px_rgba(129,140,248,0.18)] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#818cf8] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#818cf8]">
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

      {/* 4 Elegant Learning Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
        {learningList.map((topic: any, idx: number) => {
          const Icon = getLearningIcon(topic.icon);
          return (
            <motion.div
              key={topic.title || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.48,
                delay: 0.07 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#080d1d]/90 hover:bg-[#0b1328]/95 border border-white/10 hover:border-[#00d2ff]/55 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_14px_32px_rgba(0,210,255,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#818cf8]/06 rounded-tr-3xl pointer-events-none group-hover:bg-[#00d2ff]/12 transition-colors duration-300" />

              <div>
                {/* Header Row: Discipline Tag + Live Pulsing Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#00d2ff] transition-colors">
                    {topic.tag}
                  </span>

                  {/* Pulsing Status Indicator */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/25 text-[10px] font-medium text-[#00d2ff]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d2ff] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00d2ff]" />
                    </span>
                    <span>{isBn ? "অধ্যয়নরত" : (topic.status?.split("/")[0]?.trim() || "Exploring")}</span>
                  </div>
                </div>

                {/* Icon Container with Emoji + Vector Icon or Custom Image */}
                <div className="w-12 h-12 rounded-2xl bg-[#061021]/90 border border-white/10 group-hover:border-[#00d2ff]/40 text-[#00d2ff] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(0,210,255,0.25)] transition-all duration-300 overflow-hidden">
                  {topic.imageUrl ? (
                    <img
                      src={topic.imageUrl}
                      alt={topic.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : topic.emoji ? (
                    <span className="text-xl select-none">{topic.emoji}</span>
                  ) : (
                    <Icon className="w-6 h-6 text-[#00d2ff]" />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-300 mb-2.5 leading-snug">
                  {topic.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Status Footer Pill */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{isBn ? "পর্যায়" : "Phase"}</span>
                <span className="text-[#818cf8] font-semibold group-hover:text-[#00d2ff] transition-colors">
                  {topic.footerLabel || topic.progressText || (isBn ? "সক্রিয় শিখন" : "Active Learning")}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
