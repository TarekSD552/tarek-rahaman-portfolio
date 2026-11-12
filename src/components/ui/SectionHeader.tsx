"use client";

import { motion } from "framer-motion";
import {
  titleBadgeVariants,
  titleHeadingVariants,
  titleDescVariants,
  titleBarVariants,
} from "@/lib/animations";

interface SectionHeaderProps {
  badge: string;
  title: string;
  highlightText?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  highlightText,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-3xl ${
        className ?? "mb-12 sm:mb-16"
      } ${isCenter ? "mx-auto text-center" : "text-left"}`}
    >
      {/* 1. Small Cyan Accent Label */}
      <motion.div
        variants={titleBadgeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-widest text-[#00d2ff] uppercase mb-2"
      >
        <span>{badge}</span>
      </motion.div>

      {/* 2. Main Title */}
      <motion.h2
        variants={titleHeadingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
      >
        {title}{" "}
        {highlightText && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#818cf8]">
            {highlightText}
          </span>
        )}
      </motion.h2>

      {/* 3. Description / Subheading */}
      {description && (
        <motion.p
          variants={titleDescVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      )}

      {/* 4. Subtle Animated Glowing Cyan Rule */}
      <motion.div
        variants={titleBarVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`h-1 bg-gradient-to-r from-[#00d2ff] to-[#0066ff] mt-5 rounded-full shadow-[0_0_8px_#00d2ff] ${
          isCenter ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
