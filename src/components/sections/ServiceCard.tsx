"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ServiceItem } from "@/types/portfolio";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  onExplore: (service: ServiceItem) => void;
}

// Official & Recognizable Service Brand SVGs
function ServiceBrandIcon({ icon, className = "w-6 h-6" }: { icon: string; className?: string }) {
  switch (icon) {
    case "WebsiteDesign":
      // Clean modern Monitor with code & responsive layout
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="7 8 10 10 7 12" />
          <line x1="12" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "ECommerce":
      // E-Commerce Shopping Cart with dynamic speed lines
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          <path d="M12 9l2 2 4-4" strokeWidth="2" />
        </svg>
      );
    case "LandingPage":
      // Rocket Launch for High-Conversion Landing Pages
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "Laravel":
      // Official Laravel Isometric Box Logo (Simple Icons)
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
        </svg>
      );
    case "WordPress":
      // Official WordPress Logo
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
        </svg>
      );
    case "CustomSolution":
      // Bespoke Custom Code & Layers
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}

export default function ServiceCard({ service, index, onExplore }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative h-full rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 select-none bg-[#080e1e]/85 hover:bg-[#0c1429]/95 border border-[#00d2ff]/20 hover:border-[#00d2ff]/55 shadow-[0_8px_25px_rgba(0,0,0,0.65),0_0_12px_rgba(0,210,255,0.06)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.8),0_0_22px_rgba(0,210,255,0.22)] hover:-translate-y-1 backdrop-blur-xl"
    >
      {/* Background Ambient Corner Accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#00d2ff]/06 to-transparent rounded-tr-2xl pointer-events-none" />

      {/* Main Content Area */}
      <div>
        {/* 1. Small service number + small badge & 2. One service icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-white/20 group-hover:text-[#00d2ff]/60 transition-colors">
              {service.number}
            </span>

            {service.badge && (
              <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-[#00d2ff]/10 border border-[#00d2ff]/25 text-[#00d2ff]">
                {service.badge}
              </span>
            )}
          </div>

          {/* Circular Glowing Icon Container */}
          <div className="relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#051122]/90 border border-[#00d2ff]/30 text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.15)] group-hover:shadow-[0_0_22px_rgba(0,210,255,0.35)] group-hover:border-[#00d2ff] transition-all duration-300 ease-out group-hover:scale-105">
            <ServiceBrandIcon icon={service.icon} className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Short Service Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00d2ff] transition-colors duration-200 tracking-tight leading-snug mb-2">
          {service.title}
        </h3>

        {/* 4. Very Short Description (1-2 lines) */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
          {service.shortDesc}
        </p>

        {/* 5. Only 3 Short Bullet Points Maximum */}
        <div className="space-y-1.5 mb-5 pt-3 border-t border-white/[0.07]">
          {service.features.slice(0, 3).map((feat) => (
            <div key={feat} className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#00d2ff]" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Small "EXPLORE SERVICE" Button */}
      <div className="pt-3 border-t border-white/[0.07]">
        <button
          type="button"
          onClick={() => onExplore(service)}
          className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#060e20] hover:bg-gradient-to-r hover:from-[#00d2ff] hover:to-[#0072ff] text-slate-200 hover:text-black border border-[#00d2ff]/25 hover:border-transparent shadow-[0_0_8px_rgba(0,210,255,0.1)] hover:shadow-[0_0_18px_rgba(0,210,255,0.4)] transition-all duration-300 select-none"
          aria-label={`Explore ${service.title}`}
        >
          <span>Explore Service</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
