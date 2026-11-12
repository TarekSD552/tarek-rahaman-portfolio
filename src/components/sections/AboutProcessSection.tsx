"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass, Code2, ShieldCheck, Rocket, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { cinematicEase } from "@/lib/animations";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

const defaultProcessSteps = [
  {
    step: "01",
    phase: "Phase 01",
    title: "Discover & Plan",
    description:
      "Understand requirements, goals, target audience, and project strategy.",
    details: "Requirement Analysis • Tech Stack Selection • Architecture Blueprint",
    icon: Compass,
    accent: "#00d2ff",
  },
  {
    step: "02",
    phase: "Phase 02",
    title: "Design & Develop",
    description:
      "Create a modern user experience and build a clean, scalable solution.",
    details: "High-Fidelity UI/UX • Clean Scalable Code • Responsive Development",
    icon: Code2,
    accent: "#38bdf8",
  },
  {
    step: "03",
    phase: "Phase 03",
    title: "Test & Optimize",
    description:
      "Test performance, responsiveness, functionality, security, and user experience.",
    details: "Cross-Device Testing • Speed & SEO Tuning • Security Audit",
    icon: ShieldCheck,
    accent: "#818cf8",
  },
  {
    step: "04",
    phase: "Phase 04",
    title: "Launch & Support",
    description:
      "Deploy the project and provide ongoing support and improvements.",
    details: "Zero-Downtime Deploy • Post-Launch Monitoring • Ongoing Maintenance",
    icon: Rocket,
    accent: "#00f0ff",
  },
];

function getStepIcon(iconVal?: any) {
  if (typeof iconVal === "function") return iconVal;
  switch (iconVal) {
    case "Code2":
      return Code2;
    case "ShieldCheck":
      return ShieldCheck;
    case "Rocket":
      return Rocket;
    default:
      return Compass;
  }
}

export default function AboutProcessSection() {
  const { cmsData } = useCms();
  const { t, tCms, language } = useLanguage();
  const rawSteps = cmsData?.processSteps?.length ? cmsData.processSteps : defaultProcessSteps;

  const steps = rawSteps.map((step, idx) => {
    if (language !== "bn") return step;
    const bnSteps = [
      {
        phase: "ধাপ ০১",
        title: "পরিকল্পনা ও রিসার্চ",
        description: "প্রজেক্টের লক্ষ্য, প্রয়োজনীয়তা, অডিয়েন্স এবং কৌশল গভীরভাবে বিশ্লেষণ।",
        details: "চাহিদা বিশ্লেষণ • প্রযুক্তি নির্বাচন • আর্কিটেকচার প্ল্যান",
      },
      {
        phase: "ধাপ ০২",
        title: "ডিজাইন ও ডেভেলপমেন্ট",
        description: "আধুনিক ইউজার এক্সপেরিয়েন্স ডিজাইন এবং পরিষ্কার, স্কেলযোগ্য কোড তৈরি।",
        details: "আধুনিক ইউআই/ইউএক্স • স্কেলেবল কোড • রেসপনসিভ ডেভেলপমেন্ট",
      },
      {
        phase: "ধাপ ০৩",
        title: "টেস্টিং ও অপ্টিমাইজেশন",
        description: "গতি, রেসপনসিভনেস, কার্যকারিতা ও নিরাপত্তার পুঙ্খানুপুঙ্খ পরীক্ষা।",
        details: "ক্রস-ডিভাইস টেস্টিং • স্পিড ও এসইও টিউনিং • সিকিউরিটি অডিট",
      },
      {
        phase: "ধাপ ০৪",
        title: "লঞ্চ ও সার্বক্ষণিক সাপোর্ট",
        description: "লাইভ সার্ভারে নির্বিঘ্ন ডেপ্লয়মেন্ট এবং দীর্ঘমেয়াদী টেকনিক্যাল সাপোর্ট।",
        details: "স্মুথ ডেপ্লয়মেন্ট • সার্বক্ষণিক মনিটরিং • নিয়মিত রক্ষণাবেক্ষণ",
      },
    ];
    const item = bnSteps[idx] || bnSteps[0];
    return {
      ...step,
      phase: item.phase,
      title: item.title,
      description: item.description,
      details: item.details,
    };
  });

  const header = (cmsData as any)?.aboutProcessHeader || {};
  const badge = tCms(header.badge, "about.processBadge");
  const title = tCms(header.title, "about.processTitle");
  const highlightText = tCms(header.highlightText, "about.processHighlight");
  const description = tCms(header.description, "about.processDesc");

  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative my-8 sm:my-12 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00d2ff]/06 rounded-full blur-[140px] pointer-events-none" />

      <SectionHeader
        badge={badge}
        title={title}
        highlightText={highlightText}
        description={description}
        className="mb-8 sm:mb-10"
      />

      {/* Process Cards Grid (4 Columns Desktop, 2 Tablet, 1 Mobile) */}
      <div className="relative">
        {/* Subtle Horizontal Desktop Connecting Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: cinematicEase, delay: 0.2 }}
          className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#00d2ff]/20 via-[#00d2ff]/50 to-[#00d2ff]/20 z-0 pointer-events-none origin-left"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
          {steps.map((item, idx) => {
            const Icon = getStepIcon(item.icon);
            return (
              <motion.div
                key={item.step}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: cinematicEase }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: { duration: 0.22, ease: "easeOut" },
                      }
                }
                className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#080e1e]/90 hover:bg-[#0c1630] border border-[#00d2ff]/22 hover:border-[#00d2ff]/60 backdrop-blur-md transition-colors duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_36px_rgba(0,210,255,0.2)] flex flex-col justify-between select-none"
              >
                {/* Top Row: Icon Circle & Glowing Step Number */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#051122]/90 border border-[#00d2ff]/30 text-[#00d2ff] group-hover:border-[#00d2ff] group-hover:shadow-[0_0_16px_rgba(0,210,255,0.45)] flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#00d2ff] group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-widest text-[#00d2ff]/80 group-hover:text-[#00d2ff]">
                      <span className="text-slate-400 text-[10px]">{t("about.step")}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                        {item.step}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-[#00d2ff] transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row: Micro-Details & Phase Indicator */}
                <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-semibold text-slate-300 group-hover:text-[#00d2ff] transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                    {item.phase}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

