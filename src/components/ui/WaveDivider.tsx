"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export type DividerVariant = 1 | 2 | 3 | 4 | 5;

export interface WaveDividerProps {
  variant?: DividerVariant;
  inverted?: boolean;
  className?: string;
}

export default function WaveDivider({
  variant = 1,
  inverted = false,
  className = "",
}: WaveDividerProps) {
  const rawId = useId();
  const uid = `rgb_wd_${rawId.replace(/[^a-zA-Z0-9]/g, "_")}`;

  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none select-none py-2 sm:py-3 md:py-3.5 ${className}`}
      aria-hidden="true"
    >
      <div
        className={`w-full flex items-center justify-center transition-transform duration-500 ${
          inverted ? "rotate-180 scale-x-[-1]" : ""
        }`}
      >
        {variant === 1 && <DividerType1 uid={uid} />}
        {variant === 2 && <DividerType2 uid={uid} />}
        {variant === 3 && <DividerType3 uid={uid} />}
        {variant === 4 && <DividerType4 uid={uid} />}
        {variant === 5 && <DividerType5 uid={uid} />}
      </div>
    </div>
  );
}

// Common RGB color cycle for traveling energy points: 🔵 -> 🟣 -> 🩷 -> 🔴 -> 🟢 -> 🔵
const rgbCycleColors = [
  "#00d2ff", // 🔷 Cyan
  "#0066ff", // 🔵 Electric Blue
  "#a855f7", // 🟣 Neon Purple
  "#ec4899", // 🩷 Subtle Magenta
  "#ff2a5f", // 🔴 Neon Red Accent
  "#00ff9f", // 🟢 Emerald Accent
  "#00d2ff", // 🔷 Back to Cyan
];

// =========================================================================
// TYPE 1: Three Elegant Flowing Waves with Traveling RGB Neon Circuit
// Palette: Electric Blue (50%) + Cyan (50%) + Purple (30%) + Magenta/Red (20%)
// Wave 1: Blue -> Cyan -> Purple -> Magenta
// Wave 2: Purple -> Blue -> Cyan
// Wave 3: Subtle Cyan -> Emerald Green -> Blue
// =========================================================================
function DividerType1({ uid }: { uid: string }) {
  const gradRgb1 = `rgb1_w1_${uid}`;
  const gradRgb2 = `rgb1_w2_${uid}`;
  const gradGreenTeal = `rgb1_w3_${uid}`;
  const gradPulse = `rgb1_pulse_${uid}`;
  const blurFilter = `rgb1_blur_${uid}`;
  const ambientGlow = `rgb1_glow_${uid}`;

  return (
    <div className="relative w-full">
      {/* Background Soft Multicolored Ambient Reflection */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-16 bg-gradient-to-r from-[#0066ff]/08 via-[#a855f7]/07 to-[#00d2ff]/08 blur-[55px] pointer-events-none" />

      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-11 sm:h-14 md:h-18 lg:h-20"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main RGB Ribbon: Blue -> Cyan -> Purple -> Subtle Magenta -> Blue */}
          <linearGradient id={gradRgb1} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0.4" />
            <stop offset="22%" stopColor="#00d2ff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="74%" stopColor="#ec4899" stopOpacity="0.85" />
            <stop offset="90%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
          </linearGradient>

          {/* Secondary Crossing Ribbon: Purple -> Deep Blue -> Cyan */}
          <linearGradient id={gradRgb2} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#2563eb" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#00d2ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
          </linearGradient>

          {/* Subtle Accent Ribbon: Cyan -> Emerald Green -> Electric Blue */}
          <linearGradient id={gradGreenTeal} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#14b8a6" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#00ff9f" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#0284c7" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0.2" />
          </linearGradient>

          {/* Multi-Chromic Traveling Energy Pulse */}
          <linearGradient id={gradPulse} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#ec4899" stopOpacity="0.85" />
            <stop offset="88%" stopColor="#ff2a5f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
          </linearGradient>

          {/* Colored Underlayer Radial Glow */}
          <radialGradient id={ambientGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#00d2ff" stopOpacity="0.08" />
            <stop offset="80%" stopColor="#ff2a5f" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0" />
          </radialGradient>

          {/* Realistic Soft Neon Bloom Filter */}
          <filter id={blurFilter} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Back Glow Ellipse */}
        <ellipse cx="720" cy="45" rx="520" ry="26" fill={`url(#${ambientGlow})`} />

        {/* Underlayer Blurred Neon Light (Atmospheric Glow) */}
        <motion.path
          d="M-40 45 C 180 15, 380 75, 620 40 C 860 5, 1100 80, 1480 35"
          stroke={`url(#${gradRgb1})`}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.28"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 1: Main Primary Flowing Wave (Blue -> Cyan -> Purple -> Magenta) */}
        <motion.path
          d="M-40 45 C 180 15, 380 75, 620 40 C 860 5, 1100 80, 1480 35"
          stroke={`url(#${gradRgb1})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 2: Secondary Crossing Wave (Purple -> Deep Blue -> Cyan) */}
        <motion.path
          d="M-40 30 C 220 70, 460 20, 720 55 C 980 90, 1220 25, 1480 50"
          stroke={`url(#${gradRgb2})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
          animate={{ x: [0, -18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Wave 3: Subtle Accent Wave (Cyan -> Emerald Green -> Electric Blue) */}
        <motion.path
          d="M-40 55 C 260 25, 520 70, 780 35 C 1040 10, 1280 65, 1480 40"
          stroke={`url(#${gradGreenTeal})`}
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
          animate={{ x: [0, 14, 0], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Traveling Luminous RGB Energy Pulse (Continuous Flow) */}
        <motion.path
          d="M-40 45 C 180 15, 380 75, 620 40 C 860 5, 1100 80, 1480 35"
          stroke={`url(#${gradPulse})`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="180 1320"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ strokeDashoffset: [0, -1500] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Glowing RGB Energy Point 1: Traveling along Wave 1 */}
        <motion.circle
          r="3"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [80, 360, 680, 1020, 1380],
            cy: [38, 55, 36, 52, 38],
            fill: rgbCycleColors,
            opacity: [0.3, 0.95, 0.4, 0.95, 0.3],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glowing RGB Energy Point 2: Counter-orbiting along Wave 2 */}
        <motion.circle
          r="2.5"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [1360, 1040, 720, 420, 100],
            cy: [48, 28, 54, 24, 42],
            fill: [...rgbCycleColors].reverse(),
            opacity: [0.35, 0.9, 0.35, 0.9, 0.35],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// =========================================================================
// TYPE 2: Multiple Crossing Lines with Controlled Red & Purple Accents
// Palette: Electric Cyan, Neon Purple, Magenta, Red Accent, Deep Blue
// Wave 1: Cyan -> Blue -> Purple
// Wave 2: Purple -> Magenta -> Neon Red -> Blue
// Wave 3: Deep Indigo -> Cyan -> Emerald
// =========================================================================
function DividerType2({ uid }: { uid: string }) {
  const gradCyanBlue = `rgb2_w1_${uid}`;
  const gradPurpleRed = `rgb2_w2_${uid}`;
  const gradIndigoTeal = `rgb2_w3_${uid}`;
  const gradPulse = `rgb2_pul_${uid}`;
  const blurFilter = `rgb2_blur_${uid}`;
  const ambientGlow = `rgb2_glow_${uid}`;

  return (
    <div className="relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-16 bg-gradient-to-r from-[#00d2ff]/07 via-[#ff2a5f]/06 to-[#a855f7]/07 blur-[55px] pointer-events-none" />

      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-11 sm:h-14 md:h-18 lg:h-20"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Wave 1: Cyan -> Electric Blue -> Purple */}
          <linearGradient id={gradCyanBlue} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#00d2ff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#2563eb" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.3" />
          </linearGradient>

          {/* Wave 2: Purple -> Magenta -> Neon Red Accent -> Violet */}
          <linearGradient id={gradPurpleRed} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
            <stop offset="30%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ec4899" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#ff2a5f" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
          </linearGradient>

          {/* Wave 3: Deep Indigo -> Cyan -> Emerald Accent */}
          <linearGradient id={gradIndigoTeal} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
            <stop offset="45%" stopColor="#00d2ff" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#00ff9f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
          </linearGradient>

          {/* RGB Traveling Pulse */}
          <linearGradient id={gradPulse} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="70%" stopColor="#ff2a5f" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.25" />
          </linearGradient>

          <radialGradient id={ambientGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff2a5f" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#00d2ff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0" />
          </radialGradient>

          <filter id={blurFilter} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <ellipse cx="720" cy="45" rx="520" ry="26" fill={`url(#${ambientGlow})`} />

        {/* Underlayer Soft Violet / Red Halo */}
        <motion.path
          d="M-40 52 C 180 18, 440 82, 740 38 C 1000 12, 1240 76, 1480 32"
          stroke={`url(#${gradPurpleRed})`}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.24"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, -16, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Trail 1: Electric Cyan to Royal Blue & Purple */}
        <motion.path
          d="M-40 38 C 200 75, 420 12, 680 48 C 940 84, 1180 20, 1480 52"
          stroke={`url(#${gradCyanBlue})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 16, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Trail 2: Neon Purple -> Magenta -> Red Accent */}
        <motion.path
          d="M-40 52 C 180 18, 440 82, 740 38 C 1000 12, 1240 76, 1480 32"
          stroke={`url(#${gradPurpleRed})`}
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, -16, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Trail 3: Deep Indigo -> Cyan -> Emerald Arc */}
        <motion.path
          d="M-40 44 C 240 30, 500 60, 760 42 C 1020 24, 1260 62, 1480 46"
          stroke={`url(#${gradIndigoTeal})`}
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Trail 4: Delicate Cyan / Violet Razor Line */}
        <motion.path
          d="M-40 28 C 300 80, 600 20, 900 65 C 1200 15, 1360 55, 1480 36"
          stroke="#00f0ff"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Traveling RGB Energy Pulse */}
        <motion.path
          d="M-40 38 C 200 75, 420 12, 680 48 C 940 84, 1180 20, 1480 52"
          stroke={`url(#${gradPulse})`}
          strokeWidth="3.3"
          strokeLinecap="round"
          strokeDasharray="160 1340"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ strokeDashoffset: [0, -1500] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Glowing Energy Point: Cyan -> Purple -> Magenta -> Red */}
        <motion.circle
          r="2.8"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [120, 480, 820, 1160, 1380],
            cy: [44, 26, 62, 28, 48],
            fill: ["#00d2ff", "#a855f7", "#ec4899", "#ff2a5f", "#00d2ff"],
            opacity: [0.3, 0.95, 0.35, 0.95, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// =========================================================================
// TYPE 3: Fluid Wave with Glowing Purple / Magenta & Red Accent
// Palette: Velvet Purple -> Subtle Magenta -> Neon Red Accent + Cyan Counter
// =========================================================================
function DividerType3({ uid }: { uid: string }) {
  const gradMagentaRed = `rgb3_w1_${uid}`;
  const gradCyanSapphire = `rgb3_w2_${uid}`;
  const gradEmeraldTeal = `rgb3_w3_${uid}`;
  const gradPulse = `rgb3_pul_${uid}`;
  const blurFilter = `rgb3_blur_${uid}`;
  const pinkGlow = `rgb3_glow_${uid}`;

  return (
    <div className="relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-16 bg-gradient-to-r from-[#ec4899]/07 via-[#a855f7]/07 to-[#00d2ff]/07 blur-[55px] pointer-events-none" />

      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-11 sm:h-14 md:h-18 lg:h-20"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Wave 1: Purple -> Magenta -> Neon Red -> Rose */}
          <linearGradient id={gradMagentaRed} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="30%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ec4899" stopOpacity="0.95" />
            <stop offset="78%" stopColor="#ff2a5f" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.3" />
          </linearGradient>

          {/* Wave 2: Electric Cyan -> Ice Blue -> Deep Blue */}
          <linearGradient id={gradCyanSapphire} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0055ff" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#00d2ff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
          </linearGradient>

          {/* Wave 3: Emerald Accent Line */}
          <linearGradient id={gradEmeraldTeal} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00ff9f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0088ff" stopOpacity="0.2" />
          </linearGradient>

          {/* Traveling RGB Pulse */}
          <linearGradient id={gradPulse} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="70%" stopColor="#00f0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id={pinkGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#00d2ff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0" />
          </radialGradient>

          <filter id={blurFilter} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <ellipse cx="720" cy="45" rx="480" ry="24" fill={`url(#${pinkGlow})`} />

        {/* Ambient Bloom Underlayer */}
        <motion.path
          d="M-40 50 C 260 18, 520 78, 800 42 C 1080 14, 1300 68, 1480 38"
          stroke={`url(#${gradMagentaRed})`}
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.22"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribbon 1: Velvet Purple to Magenta & Red */}
        <motion.path
          d="M-40 50 C 260 18, 520 78, 800 42 C 1080 14, 1300 68, 1480 38"
          stroke={`url(#${gradMagentaRed})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribbon 2: Electric Cyan / Deep Blue Counter-Wave */}
        <motion.path
          d="M-40 35 C 220 62, 480 24, 720 54 C 980 78, 1240 28, 1480 48"
          stroke={`url(#${gradCyanSapphire})`}
          strokeWidth="1.9"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
          animate={{ x: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribbon 3: Emerald Accent Line */}
        <motion.path
          d="M-40 42 C 300 30, 600 60, 900 38 C 1200 20, 1380 55, 1480 45"
          stroke={`url(#${gradEmeraldTeal})`}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Traveling Luminous RGB Energy Pulse */}
        <motion.path
          d="M-40 50 C 260 18, 520 78, 800 42 C 1080 14, 1300 68, 1480 38"
          stroke={`url(#${gradPulse})`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="160 1340"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ strokeDashoffset: [0, -1500] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />

        {/* Traveling RGB Energy Point: Magenta -> Purple -> Cyan -> Red */}
        <motion.circle
          r="2.8"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [160, 520, 840, 1200, 1400],
            cy: [34, 62, 38, 54, 38],
            fill: ["#ec4899", "#a855f7", "#00d2ff", "#ff2a5f", "#ec4899"],
            opacity: [0.3, 0.95, 0.4, 0.95, 0.3],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// =========================================================================
// TYPE 4: Dramatic Flowing Energy with Emerald / Teal, Cyan & Light Sparks
// Palette: Emerald Green (20%) + Teal + Electric Cyan (50%) + Purple/Magenta (30%)
// =========================================================================
function DividerType4({ uid }: { uid: string }) {
  const gradEmeraldCyan = `rgb4_w1_${uid}`;
  const gradVoltPurple = `rgb4_w2_${uid}`;
  const gradBeam = `rgb4_bm_${uid}`;
  const blurFilter = `rgb4_blur_${uid}`;
  const tealGlow = `rgb4_glow_${uid}`;

  return (
    <div className="relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-16 bg-gradient-to-r from-[#00ff9f]/06 via-[#00d2ff]/08 to-[#a855f7]/07 blur-[55px] pointer-events-none" />

      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-11 sm:h-14 md:h-18 lg:h-20"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Wave 1: Emerald Green -> Teal -> Electric Cyan -> Deep Blue */}
          <linearGradient id={gradEmeraldCyan} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.25" />
            <stop offset="25%" stopColor="#00ff9f" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0.25" />
          </linearGradient>

          {/* Wave 2: Electric Blue -> Purple -> Magenta -> Neon Red Accent */}
          <linearGradient id={gradVoltPurple} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#2563eb" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="82%" stopColor="#ec4899" stopOpacity="0.85" />
            <stop offset="92%" stopColor="#ff2a5f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
          </linearGradient>

          {/* Traveling Multi-Color Beam */}
          <linearGradient id={gradBeam} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#00ff9f" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#00d2ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>

          <radialGradient id={tealGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff9f" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00d2ff" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#a855f7" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0" />
          </radialGradient>

          <filter id={blurFilter} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <ellipse cx="720" cy="45" rx="500" ry="25" fill={`url(#${tealGlow})`} />

        {/* Ambient Bloom Underlayer */}
        <motion.path
          d="M-40 32 C 160 76, 360 10, 580 58 C 800 96, 1020 18, 1240 68 C 1360 90, 1420 40, 1480 36"
          stroke={`url(#${gradEmeraldCyan})`}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribbon 1: Dramatic Flowing Teal, Emerald & Cyan Wave */}
        <motion.path
          d="M-40 32 C 160 76, 360 10, 580 58 C 800 96, 1020 18, 1240 68 C 1360 90, 1420 40, 1480 36"
          stroke={`url(#${gradEmeraldCyan})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribbon 2: Electric Blue, Purple & Red Accent */}
        <motion.path
          d="M-40 58 C 180 16, 400 82, 640 34 C 880 2, 1100 78, 1300 38 C 1390 18, 1440 50, 1480 54"
          stroke={`url(#${gradVoltPurple})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
          animate={{ x: [0, -14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ribbon 3: Center Stabilizer Filament */}
        <motion.path
          d="M-40 46 C 240 34, 480 62, 720 44 C 960 28, 1200 60, 1480 45"
          stroke="#00d2ff"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Traveling Luminous RGB Beam */}
        <motion.path
          d="M-40 32 C 160 76, 360 10, 580 58 C 800 96, 1020 18, 1240 68 C 1360 90, 1420 40, 1480 36"
          stroke={`url(#${gradBeam})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="170 1330"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ strokeDashoffset: [0, -1500] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating RGB Spark 1: Moving along wave with animated RGB colors */}
        <motion.circle
          r="2.8"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [360, 480, 400],
            cy: [30, 42, 30],
            fill: rgbCycleColors,
            opacity: [0.3, 0.95, 0.3],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating RGB Spark 2: Counter-orbiting spark */}
        <motion.circle
          r="2.5"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [920, 820, 920],
            cy: [52, 42, 52],
            fill: [...rgbCycleColors].reverse(),
            opacity: [0.25, 0.9, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating RGB Spark 3 */}
        <motion.circle
          r="2.2"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [1100, 1200, 1100],
            cy: [36, 48, 36],
            fill: rgbCycleColors,
            opacity: [0.3, 0.85, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// =========================================================================
// TYPE 5: Minimal Elegant S-Curve with a Brilliant Traveling RGB Comet Glow
// Palette: Clean High-Contrast Electric Cyan, Deep Blue, Purple & Full-Spectrum Comet
// =========================================================================
function DividerType5({ uid }: { uid: string }) {
  const gradCleanRgb = `rgb5_w1_${uid}`;
  const gradDarkSapphire = `rgb5_w2_${uid}`;
  const gradRgbComet = `rgb5_comet_${uid}`;
  const blurFilter = `rgb5_blur_${uid}`;
  const minimalGlow = `rgb5_glow_${uid}`;

  return (
    <div className="relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-14 bg-gradient-to-r from-[#00d2ff]/07 via-[#a855f7]/07 to-[#0066ff]/07 blur-[50px] pointer-events-none" />

      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-11 sm:h-14 md:h-18 lg:h-20"
        preserveAspectRatio="none"
      >
        <defs>
          {/* S-Curve Gradient: Blue -> Cyan -> Purple -> Cyan */}
          <linearGradient id={gradCleanRgb} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0055ff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#00d2ff" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
          </linearGradient>

          {/* Counter-Line: Sapphire -> Magenta Accent -> Deep Blue */}
          <linearGradient id={gradDarkSapphire} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#1d4ed8" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.25" />
          </linearGradient>

          {/* Brilliant Full-Spectrum RGB Comet Pulse: White Core -> Cyan -> Purple -> Red Accent */}
          <linearGradient id={gradRgbComet} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#ff2a5f" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id={minimalGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
            <stop offset="55%" stopColor="#00d2ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#050811" stopOpacity="0" />
          </radialGradient>

          <filter id={blurFilter} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <ellipse cx="720" cy="45" rx="440" ry="22" fill={`url(#${minimalGlow})`} />

        {/* Ambient Underlayer Line */}
        <motion.path
          d="M-40 45 C 320 12, 680 78, 1040 32 C 1240 12, 1380 48, 1480 42"
          stroke={`url(#${gradCleanRgb})`}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.24"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 16, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Path 1: Minimal Clean Flowing S-Curve */}
        <motion.path
          d="M-40 45 C 320 12, 680 78, 1040 32 C 1240 12, 1380 48, 1480 42"
          stroke={`url(#${gradCleanRgb})`}
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ x: [0, 16, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Path 2: Darker Sapphire Counter-Line */}
        <motion.path
          d="M-40 40 C 280 68, 640 18, 980 58 C 1220 78, 1380 38, 1480 45"
          stroke={`url(#${gradDarkSapphire})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
          animate={{ x: [0, -16, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Single Brilliant Traveling RGB Comet Pulse */}
        <motion.path
          d="M-40 45 C 320 12, 680 78, 1040 32 C 1240 12, 1380 48, 1480 42"
          stroke={`url(#${gradRgbComet})`}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeDasharray="150 1350"
          fill="none"
          filter={`url(#${blurFilter})`}
          animate={{ strokeDashoffset: [0, -1500] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Traveling RGB Companion Orb */}
        <motion.circle
          r="2.8"
          filter={`url(#${blurFilter})`}
          animate={{
            cx: [180, 560, 920, 1280, 1420],
            cy: [38, 62, 34, 52, 40],
            fill: rgbCycleColors,
            opacity: [0.3, 0.95, 0.4, 0.95, 0.3],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
