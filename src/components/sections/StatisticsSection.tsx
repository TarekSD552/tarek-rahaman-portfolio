"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, CheckCircle, Briefcase, Building2 } from "lucide-react";
import { statsData } from "@/data/portfolioData";

function CounterItem({
  value,
  suffix,
  label,
  description,
  icon: Icon,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ElementType;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animId: number;
    const duration = 2000; // 2 seconds

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * value));

      if (progress < 1) {
        animId = requestAnimationFrame(animateCount);
      } else {
        setCount(value);
      }
    };

    animId = requestAnimationFrame(animateCount);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] [html.light_&]:bg-white hover:bg-white/[0.05] [html.light_&]:hover:bg-slate-50 border border-white/[0.08] [html.light_&]:border-slate-200 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-500 overflow-hidden [html.light_&]:shadow-md"
    >
      {/* Background glow on hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all duration-500" />

      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 [html.light_&]:text-slate-600">
          PROVEN TRACK RECORD
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl sm:text-5xl font-black text-white [html.light_&]:text-slate-900 tracking-tight">
          {count}
        </span>
        <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
          {suffix}
        </span>
      </div>

      <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-200 [html.light_&]:text-slate-800">
        {label}
      </h3>

      <p className="mt-1 text-xs sm:text-sm text-slate-400 [html.light_&]:text-slate-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default function StatisticsSection() {
  const icons = [Users, CheckCircle, Briefcase, Building2];

  return (
    <section className="relative py-16 sm:py-24 border-y border-white/[0.06] [html.light_&]:border-slate-200 bg-[#05080e]/60 [html.light_&]:bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => (
            <CounterItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              icon={icons[idx % icons.length]}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

