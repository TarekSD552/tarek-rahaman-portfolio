"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { processStepsData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";

export default function ProcessSection() {
  const { cmsData } = useCms();
  const sectionMeta = cmsData?.homeSections?.find((s) => s.key === "workflow");
  const steps = cmsData?.processSteps?.length ? cmsData.processSteps : processStepsData;

  const badge = sectionMeta?.badge || "WHY US";
  const title = sectionMeta?.title || "Why Choose";
  const highlightText = sectionMeta?.subtitle || "Us";
  const description =
    sectionMeta?.description ||
    "Providing intelligent, streamlined, and robust solutions that drive exceptional value and elevate your organization.";

  return (
    <section id="why-us" className="relative pt-3 sm:pt-4 md:pt-5 pb-3 sm:pb-4 md:pb-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={badge}
          title={title}
          highlightText={highlightText}
          description={description}
          className="mb-8 sm:mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#090f1e]/85 hover:bg-[#0c1429] border border-[#00d2ff]/15 hover:border-[#00d2ff]/50 backdrop-blur-md transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_30px_rgba(0,210,255,0.18)] hover:-translate-y-1 flex flex-col justify-between h-full select-none"
            >
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#00d2ff] mb-2 block">
                  {step.step ? (step.step.startsWith("0") ? step.step : `0${step.step}`) : `0${idx + 1}`}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 hover:text-[#00d2ff] transition-colors">
                  {step.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-semibold text-[#00d2ff]">
                <span>Phase {step.step ? (step.step.startsWith("0") ? step.step : `0${step.step}`) : `0${idx + 1}`} of {steps.length < 10 ? `0${steps.length}` : steps.length}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
