"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { clientBrandsData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import BrandIconRenderer from "@/components/ui/BrandIconRenderer";
import { ClientBrand } from "@/types/portfolio";

function OrbitalBrandCard({ brand }: { brand: ClientBrand }) {
  const content = (
    <div className="w-14 h-14 min-[380px]:w-18 min-[380px]:h-18 sm:w-22 md:w-24 sm:h-22 md:h-24 rounded-full bg-[#081126]/90 border border-white/20 hover:border-[#00d9ff] shadow-[0_8px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(0,217,255,0.2)] flex flex-col items-center justify-center text-center p-1 sm:p-1.5 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(0,217,255,0.7)] cursor-pointer group backdrop-blur-md">
      {/* Priority 1: Custom Uploaded Brand Logo */}
      {brand.logoUrl ? (
        <div
          className={`relative flex items-center justify-center ${
            brand.logoSize === "sm"
              ? "w-6 h-6"
              : brand.logoSize === "lg"
              ? "w-8 sm:w-9 h-8 sm:h-9"
              : "w-7 sm:w-8 h-7 sm:h-8"
          }`}
        >
          <img
            src={normalizeImageUrl(brand.logoUrl)}
            alt={brand.logoAlt || brand.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full ${
              brand.fitMode === "cover" ? "object-cover rounded-full" : "object-contain"
            } drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]`}
          />
        </div>
      ) : (
        /* Priority 2: Relevant Category / Default Industry Icon */
        <BrandIconRenderer
          iconName={brand.iconName}
          brandName={brand.name}
          industry={brand.industry}
          className={
            brand.logoSize === "sm"
              ? "w-5 sm:w-6 h-5 sm:h-6"
              : brand.logoSize === "lg"
              ? "w-7 sm:w-8 h-7 sm:h-8"
              : "w-6 sm:w-7 h-6 sm:h-7"
          }
        />
      )}

      {/* Brand Name */}
      {brand.showName !== false && (
        <span className="text-[9px] sm:text-[10px] font-bold text-slate-200 group-hover:text-white leading-tight mt-1 px-1 line-clamp-2">
          {brand.name}
        </span>
      )}

      {/* Optional Industry Tag */}
      {brand.showIndustry && (
        <span className="text-[7.5px] sm:text-[8px] text-[#00d9ff]/75 font-mono leading-none tracking-tight line-clamp-1 mt-0.5 px-0.5">
          {brand.industry}
        </span>
      )}
    </div>
  );

  if (brand.websiteUrl) {
    return (
      <a
        href={brand.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={brand.name}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default function ClientsMarquee() {
  const { cmsData } = useCms();
  const { t, tCms } = useLanguage();
  const sectionMeta = cmsData?.homeSections?.find((s) => s.key === "clients");
  const clientsHeader = cmsData?.homeClientsHeader;

  // Active brands filtered from CMS data with fallback to defaults
  const rawBrands = cmsData?.clientBrands?.length ? cmsData.clientBrands : clientBrandsData;
  const brands = rawBrands.filter((b) => b.active !== false);

  const rawBadge = clientsHeader?.badge || sectionMeta?.badge || "OUR CLIENTS";
  const badge = tCms(rawBadge, "clients.badge");

  const rawTitle = clientsHeader?.title || sectionMeta?.title || "Clients That We Have";
  const title = tCms(rawTitle, "clients.title");

  const rawSubtitle = clientsHeader?.highlightText || clientsHeader?.subtitle || sectionMeta?.subtitle || "Worked With.";
  const subtitle = tCms(rawSubtitle, "clients.subtitle");

  const rawDescription =
    clientsHeader?.description ||
    sectionMeta?.description ||
    "We have collaborated with these amazing brands and clients to create stunning web solutions and products.";
  const description = tCms(rawDescription, "clients.description");

  return (
    <section
      id="clients"
      aria-label={t("clients.ariaLabel")}
      className="relative w-full pt-3 sm:pt-5 lg:pt-6 pb-0 overflow-hidden select-none bg-[#050811]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* WIDE HORIZONTAL PREMIUM CARD WITH GLOWING CYAN BORDER    */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-[#060b18] via-[#08132c] to-[#060b18] border border-[#00d9ff]/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,217,255,0.18)] p-3.5 sm:p-8 md:p-10 lg:p-12 overflow-hidden"
        >
          {/* Ambient Lighting Glow Pools */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[380px] bg-[#00d9ff]/12 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-4 left-1/4 -translate-x-1/2 w-[360px] h-[220px] bg-[#a855f7]/18 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[350px] h-[300px] bg-[#00d9ff]/08 rounded-full blur-[130px] pointer-events-none" />

          {/* Main Two-Area Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
            {/* ==================================================== */}
            {/* 1. LEFT SIDE: CLIENT ECOSYSTEM (ORBITAL HUB)         */}
            {/* ==================================================== */}
            <div className="lg:col-span-7 flex items-center justify-center relative min-h-[360px] sm:min-h-[420px] md:min-h-[440px]">
              <div className="relative w-full max-w-[500px] sm:max-w-[560px] md:max-w-[600px] aspect-[1.35/1] min-h-[350px] sm:min-h-[400px] flex items-center justify-center">
                {/* A. Dotted Orbital Ellipse Path Connecting Client Nodes */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  viewBox="0 0 560 400"
                >
                  <defs>
                    <linearGradient id="client-orbit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.35" />
                    </linearGradient>
                  </defs>
                  <ellipse
                    cx="280"
                    cy="200"
                    rx="225"
                    ry="135"
                    fill="none"
                    stroke="url(#client-orbit-grad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 5"
                  />
                </svg>

                {/* B. Holographic Concentric Glowing Pedestal beneath Center Hub */}
                <div className="absolute top-[58%] left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                  {/* Outer Glowing Ring */}
                  <div className="w-48 sm:w-56 md:w-60 h-12 sm:h-14 rounded-[50%] border border-[#a855f7]/40 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
                  {/* Middle Cyan Ring */}
                  <div className="w-36 sm:w-44 md:w-48 h-9 sm:h-11 rounded-[50%] border border-[#00d9ff]/55 shadow-[0_0_20px_rgba(0,217,255,0.65)] -mt-2" />
                  {/* Core Glowing Hologram Pad */}
                  <div className="w-28 sm:w-32 md:w-36 h-7 sm:h-8 rounded-[50%] bg-gradient-to-r from-[#00d9ff]/45 via-[#a855f7]/60 to-[#ec4899]/35 blur-sm -mt-2" />
                </div>

                {/* C. Futuristic Floating Central "Clients" Sphere Hub */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-20 w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full bg-gradient-to-br from-[#0e1e44] via-[#091228] to-[#040814] border-2 border-[#00d9ff] shadow-[0_0_35px_rgba(0,217,255,0.5),inset_0_0_25px_rgba(0,217,255,0.35),inset_0_10px_20px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center text-center cursor-default group"
                >
                  {/* Top Specular Glass Reflection */}
                  <div className="absolute top-1.5 inset-x-3 h-5 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

                  {/* Center Team Icon */}
                  <Users className="w-7 sm:w-8 h-7 sm:h-8 text-[#00f0ff] mb-1 drop-shadow-[0_0_10px_#00f0ff]" />

                  {/* Word "Clients" */}
                  <span className="text-xs sm:text-sm font-black text-white tracking-wider">
                    {t("clients.hubTitle")}
                  </span>
                </motion.div>

                {/* D. Six Circular Glass Client Cards in Orbital Layout */}
                {(() => {
                  const b0 = brands[0] || clientBrandsData[0];
                  const b1 = brands[1] || clientBrandsData[1];
                  const b2 = brands[2] || clientBrandsData[2];
                  const b3 = brands[3] || clientBrandsData[3];
                  const b4 = brands[4] || clientBrandsData[4];
                  const b5 = brands[5] || clientBrandsData[5];

                  return (
                    <>
                      {/* 1. Client 1 (Top-Left) */}
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        className="absolute top-[4%] left-[18%] sm:left-[21%] z-30"
                      >
                        <OrbitalBrandCard brand={b0} />
                      </motion.div>

                      {/* 2. Client 2 (Far-Left) */}
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-[38%] left-[1%] sm:left-[3%] z-30"
                      >
                        <OrbitalBrandCard brand={b1} />
                      </motion.div>

                      {/* 3. Client 3 (Bottom-Left) */}
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                        className="absolute bottom-[4%] left-[18%] sm:left-[21%] z-30"
                      >
                        <OrbitalBrandCard brand={b2} />
                      </motion.div>

                      {/* 4. Client 4 (Top-Right) */}
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="absolute top-[4%] right-[18%] sm:right-[21%] z-30"
                      >
                        <OrbitalBrandCard brand={b3} />
                      </motion.div>

                      {/* 5. Client 5 (Far-Right) */}
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        className="absolute top-[38%] right-[1%] sm:right-[3%] z-30"
                      >
                        <OrbitalBrandCard brand={b4} />
                      </motion.div>

                      {/* 6. Client 6 (Bottom-Right) */}
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                        className="absolute bottom-[4%] right-[18%] sm:right-[21%] z-30"
                      >
                        <OrbitalBrandCard brand={b5} />
                      </motion.div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* ==================================================== */}
            {/* 2. RIGHT SIDE: CONTENT & DIAGONAL ACCENT SHAPES      */}
            {/* ==================================================== */}
            <div className="lg:col-span-5 flex items-center justify-between gap-6 text-left">
              <div className="space-y-4 max-w-md">
                {/* Small Futuristic Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-[#0a152e]/90 border border-[#00d9ff]/40 shadow-[0_0_12px_rgba(0,217,255,0.25)]">
                  <Users className="w-3.5 h-3.5 text-[#00d9ff]" />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#00d9ff] uppercase font-mono">
                    {badge}
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white tracking-tight leading-[1.18]">
                  <span>{title} </span>
                  <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] via-[#38bdf8] to-[#c084fc] drop-shadow-[0_0_25px_rgba(0,217,255,0.5)]">
                    {subtitle}
                  </span>
                </h2>

                {/* Supporting Paragraph */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Decorative Futuristic Cyan & Purple Diagonal Glowing Shapes */}
              <div className="hidden sm:flex items-center gap-2.5 shrink-0 pr-2 lg:pr-4">
                {/* Cyan Diagonal Bar */}
                <div className="w-3.5 sm:w-4.5 h-16 sm:h-20 rounded-full bg-gradient-to-b from-[#00d9ff] via-[#00a8ff] to-[#0066ff] shadow-[0_0_25px_rgba(0,217,255,0.85)] -skew-x-12" />
                {/* Purple Diagonal Bar */}
                <div className="w-3.5 sm:w-4.5 h-16 sm:h-20 rounded-full bg-gradient-to-b from-[#c084fc] via-[#a855f7] to-[#7c3aed] shadow-[0_0_25px_rgba(168,85,247,0.85)] -skew-x-12" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
