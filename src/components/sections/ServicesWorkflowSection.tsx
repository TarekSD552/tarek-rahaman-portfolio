"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { processStepsData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesWorkflowSection() {
  const { cmsData } = useCms();
  const { t, tCms, language } = useLanguage();
  const isBn = language === "bn";

  const header = cmsData?.servicesWorkflowHeader;
  const badge = tCms(header?.badge, "servicesPage.workflow.badge");
  const title = tCms(header?.title, "servicesPage.workflow.title");
  const highlightText = tCms(header?.highlightText, "servicesPage.workflow.highlight");
  const description = tCms(header?.description, "servicesPage.workflow.desc");

  const rawSteps = cmsData?.servicesProcess?.length
    ? cmsData.servicesProcess
    : cmsData?.processSteps?.length
    ? cmsData.processSteps
    : processStepsData;

  const baseSteps = rawSteps.filter((s: any) => s.active !== false && s.enabled !== false);

  const bnStepDefaults = [
    {
      phase: "পর্যায় // ০১",
      title: "পরিকল্পনা ও গবেষণা",
      description: "প্রজেক্টের মূল চাহিদা, লক্ষ্য, টার্গেট অডিয়েন্স ও টেকনিক্যাল কাঠামো বিশ্লেষণ ও নির্ধারণ।",
    },
    {
      phase: "পর্যায় // ০২",
      title: "ডিজাইন ও ডেভেলপমেন্ট",
      description: "আধুনিক ইউজার এক্সপেরিয়েন্স তৈরি এবং ক্লিন, স্কেলেবল ও রেসপন্সিভ কোড ডেভেলপমেন্ট।",
    },
    {
      phase: "পর্যায় // ০৩",
      title: "টেস্টিং ও অপ্টিমাইজেশন",
      description: "পারফরম্যান্স, বিভিন্ন ডিভাইস রেসপন্সিভনেস, সিকিউরিটি এবং কোর ওয়েব ভাইটালস পরীক্ষা ও টিউনিং।",
    },
    {
      phase: "পর্যায় // ০৪",
      title: "লঞ্চ ও টেকনিক্যাল সাপোর্ট",
      description: "জিরো-ডাউনটাইম সার্ভার ডিপ্লয়মেন্ট এবং ডেলিভারির পরবর্তী টেকনিক্যাল সাপোর্ট ও মেইনটেন্যান্স।",
    },
    {
      phase: "পর্যায় // ০৫",
      title: "স্পিড ও এসইও অপ্টিমাইজেশন",
      description: "গুগল সার্চ ও স্পিড র‍্যাংকিং নিশ্চিত করতে পেজ স্পিড ও মেটাডাটা অপ্টিমাইজেশন।",
    },
    {
      phase: "পর্যায় // ০৬",
      title: "স্কেলিং ও ভবিষ্যৎ সহায়তা",
      description: "ব্যবসা বৃদ্ধির সাথে সাথে নতুন ফিচার যুক্ত করা ও নিরাপদ ব্যাকআপ সিস্টেম পর্যবেক্ষণ।",
    },
  ];

  const steps = baseSteps.map((step: any, idx: number) => {
    if (!isBn) return step;
    const fallback = bnStepDefaults[idx] || bnStepDefaults[0];
    return {
      ...step,
      phase: fallback.phase,
      title: fallback.title,
      description: fallback.description,
    };
  });

  return (
    <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-gradient-to-r from-[#00d2ff]/07 via-[#818cf8]/05 to-[#c084fc]/07 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/[0.08] border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.18)] mb-3"
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
          className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal"
        >
          {description}
        </motion.p>
      </div>

      {/* Process Phase Cards with Connecting Journey Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10 items-stretch">
        {steps.map((step: any, idx: number) => {
          const stepNumber = step.step
            ? step.step.startsWith("0")
              ? step.step
              : `0${step.step}`
            : `0${idx + 1}`;
          const phaseText = step.phase || (isBn ? `পর্যায় // ${stepNumber}` : `PHASE // ${stepNumber}`);

          return (
            <motion.div
              key={step.id || step.title || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.07 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              className="group relative p-4 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#080e1e]/90 hover:bg-[#0c1630] border border-[#00d2ff]/22 hover:border-[#00d2ff]/65 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_36px_rgba(0,210,255,0.2)] transition-all duration-300 flex flex-col justify-between h-full select-none overflow-hidden"
            >
              {/* Corner Glow Accent */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#00d2ff]/05 rounded-tr-3xl pointer-events-none group-hover:bg-[#00d2ff]/12 transition-colors duration-300" />

              <div>
                {/* Header row: Phase badge & Big faint step watermark */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00d2ff] px-2.5 py-1 rounded-md bg-[#00d2ff]/10 border border-[#00d2ff]/30 shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                    {phaseText}
                  </span>
                  <span className="font-mono text-3xl font-black text-white/10 group-hover:text-[#00d2ff]/30 transition-colors">
                    {stepNumber}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors mb-2.5 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {/* Bottom Connecting Journey Line */}
              <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-[#00d2ff] transition-colors">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] shadow-[0_0_6px_#00d2ff]" />
                  <span>
                    {isBn
                      ? `ধাপ ${idx + 1} / ${steps.length}`
                      : `Step ${idx + 1} of ${steps.length}`}
                  </span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
