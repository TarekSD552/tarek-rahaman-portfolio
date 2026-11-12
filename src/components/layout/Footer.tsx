"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Mail, Phone, MapPin, Globe } from "lucide-react";
import { profileData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import DynamicSocialIcon from "@/components/icons/DynamicSocialIcon";

// Company Menu Navigation Links — Direct Page Routing
const companyMenuLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Skills", href: "/skills" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const { cmsData } = useCms();
  const { language, t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const over = window.scrollY > 120;
          setShowScrollTop((prev) => (prev !== over ? over : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footer = cmsData?.footerSettings;
  const site = cmsData?.siteSettings;
  const email = cmsData?.contactInfo?.email || profileData.email;
  const phone = cmsData?.contactInfo?.phone || profileData.phone;
  const location = cmsData?.contactInfo?.location || profileData.location;
  const copyright = footer?.copyrightText || "© 2026 Tarek Rahaman. All Rights Reserved.";
  const copyrightDisplay =
    language === "bn"
      ? t("footer.copyright", "© ২০২৬ তারেক রহমান। সর্বস্বত্ব সংরক্ষিত।")
      : copyright;
  const designedByText = t("footer.designedBy", "Designed & Developed by");

  const getNavLabel = (name: string) => {
    const lower = name.toLowerCase().trim();
    if (lower === "home") return t("nav.home", "Home");
    if (lower === "about") return t("nav.about", "About");
    if (lower === "services") return t("nav.services", "Services");
    if (lower === "skills") return t("nav.skills", "Skills");
    if (lower === "portfolio" || lower === "projects" || lower === "project")
      return t("nav.portfolio", "Portfolio");
    if (lower === "contact") return t("nav.contact", "Contact");
    return name;
  };

  const facebookUrl =
    cmsData?.contactInfo?.facebook ||
    profileData.socialLinks?.find((s) => s.name.toLowerCase() === "facebook")?.url ||
    "https://www.facebook.com/tarak.rahoman.3";
  const brandName = site?.websiteName || footer?.brandName || "Tarek Rahaman";
  const brandDesc =
    language === "bn"
      ? "উন্নত ডিজিটাল অভিজ্ঞতা ও হাই-পারফরম্যান্স ওয়েব ডেভেলপমেন্ট সল্যুশন নিয়ে আপনার ব্র্যান্ডের প্রবৃদ্ধিতে আমি নিবেদিত।"
      : footer?.description ||
        site?.footerText ||
        "Transform Your Online Presence with Tarek Rahaman — Expert Full-Stack & WordPress Developer delivering high-performance results.";
  const activeCompanyLinks = footer?.links?.length ? footer.links : companyMenuLinks;
  const logoUrl = site?.logoUrl;
  const logoText = site?.logoText || footer?.logoText || "TR";

  // Dynamic Social Links from CMS with fallback to defaults
  const dynamicSocialLinks = (cmsData?.profile?.socialLinks || profileData.socialLinks || [])
    .filter((s) => s.active !== false && s.url && s.url.trim().length > 0)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const activeSocialList =
    dynamicSocialLinks.length > 0
      ? dynamicSocialLinks.map((s) => ({
          name: s.name,
          href: s.url,
          icon: s.icon || s.name,
          ariaLabel: `Follow Tarek Rahaman on ${s.name}`,
        }))
      : [
          {
            name: "Facebook",
            href:
              cmsData?.contactInfo?.facebook ||
              "https://www.facebook.com/tarak.rahoman.3",
            icon: "Facebook",
            ariaLabel: "Follow Tarek Rahaman on Facebook",
          },
          {
            name: "Instagram",
            href:
              cmsData?.contactInfo?.instagram ||
              "https://www.instagram.com/tarek_rahman333?igsh=d3VnNWZ4bGN4MHEz",
            icon: "Instagram",
            ariaLabel: "Follow Tarek Rahaman on Instagram",
          },
          {
            name: "GitHub",
            href:
              cmsData?.contactInfo?.github ||
              "https://github.com/TarekSD552",
            icon: "GitHub",
            ariaLabel: "Visit Tarek Rahaman's GitHub Profile",
          },
          {
            name: "WhatsApp",
            href:
              cmsData?.contactInfo?.whatsapp ||
              profileData.whatsapp ||
              "https://wa.me/8801733119269?text=Hi%20Tarek,%20I%20want%20to%20talk%20about%20a%20project.",
            icon: "WhatsApp",
            ariaLabel: "Contact Tarek Rahaman via WhatsApp",
          },
          {
            name: "Website",
            href: "https://tarekrahaman.com/",
            icon: "Globe",
            ariaLabel: "Visit Tarek Rahaman's Official Website",
          },
        ];

  return (
    <footer className="relative pt-12 sm:pt-14 pb-8 sm:pb-10 border-t border-[#00d2ff]/20 bg-[#040711] text-slate-300 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 sm:pb-10 border-b border-white/[0.08]">
          
          {/* COLUMN 1: Logo + Name, Short Description, 5 Social Icons */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white font-extrabold text-2xl tracking-tight group"
              aria-label={`${brandName} Home`}
            >
              {logoUrl ? (
                <div className="relative h-9 sm:h-10 w-auto max-w-[140px] flex items-center justify-center">
                  <img
                    src={normalizeImageUrl(logoUrl)}
                    alt={brandName}
                    className="max-h-9 sm:max-h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,210,255,0.45)] group-hover:drop-shadow-[0_0_20px_rgba(0,210,255,0.8)] transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#0066ff] flex items-center justify-center text-[#050811] font-black text-sm shadow-[0_0_15px_rgba(0,210,255,0.6)] group-hover:scale-105 transition-transform duration-300">
                  {logoText}
                </div>
              )}
              <span className="tracking-tight text-white group-hover:text-[#00d2ff] transition-colors">
                {brandName}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-200 max-w-sm leading-relaxed">
              {brandDesc}
            </p>

            {/* Dynamic Social Icons in One Horizontal Row on Desktop */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 flex-wrap">
              {activeSocialList.map((social) => {
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0a1022] hover:bg-[#00d2ff] hover:text-[#050811] border border-[#00d2ff]/25 hover:border-[#00d2ff] text-slate-300 shadow-[0_0_12px_rgba(0,210,255,0.15)] hover:shadow-[0_0_20px_rgba(0,210,255,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
                    aria-label={social.ariaLabel}
                    title={social.name}
                  >
                    <DynamicSocialIcon
                      iconName={social.icon}
                      platformName={social.name}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: COMPANY (Dedicated Page Routes) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              {t("footer.quickLinks", "Company")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {activeCompanyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00d2ff] transition-colors inline-block cursor-pointer"
                  >
                    {getNavLabel(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: INFORMATION (Services Page Routes) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              {language === "bn" ? "সার্ভিসসমূহ" : "Services"}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#00d2ff] transition-colors inline-block"
                >
                  {t("services.service1Title", "Web Development")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#00d2ff] transition-colors inline-block"
                >
                  {t("services.service2Title", "E-Commerce Store")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#00d2ff] transition-colors inline-block"
                >
                  {t("services.service3Title", "Landing Pages")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#00d2ff] transition-colors inline-block"
                >
                  {t("services.service4Title", "Speed Optimization")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-[#00d2ff] transition-colors inline-block"
                >
                  {t("services.service5Title", "Website Redesign")}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT US */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              {t("footer.contactInfo", "Contact Us")}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00d2ff] shrink-0" />
                <span className="truncate">{email}</span>
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 hover:text-[#00d2ff] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#00d2ff] shrink-0" />
                <span>{phone}</span>
              </a>

              <div className="flex items-start gap-2 text-xs text-slate-400 pt-0.5">
                <MapPin className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                <span>{location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Centered Copyright & Developer Credit */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pt-6 sm:pt-8 pb-2 flex flex-col items-center justify-center text-center space-y-2 max-w-3xl mx-auto px-4"
        >
          {/* 1. Horizontal Centered Copyright Text */}
          <p className="text-slate-400 text-xs sm:text-sm text-center font-normal tracking-wide select-text">
            {copyrightDisplay}
          </p>

          {/* 2. Professional Developer Credit with Animated Neon Facebook Link */}
          <p className="text-slate-400 text-xs sm:text-sm text-center font-medium tracking-wide flex items-center justify-center flex-wrap gap-1.5 select-text">
            <span>{designedByText}</span>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Tarek Rahaman's Facebook Profile (opens in new tab)"
              className="group relative inline-flex items-center font-semibold text-[#00d2ff] hover:text-[#00f0ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040711] rounded px-1 py-0.5 transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,210,255,0.9)]">
                Tarek Rahaman
              </span>
              {/* Glowing animated underline effect with prefers-reduced-motion safety */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#0088ff] rounded-full transition-all duration-300 ease-out group-hover:w-full group-focus-visible:w-full shadow-[0_0_10px_#00d2ff] motion-reduce:transition-none"
              />
            </a>
          </p>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* FIXED VIEWPORT SCROLL TO TOP BUTTON (ALWAYS FIXED BOTTOM RIGHT)     */}
      {/* =================================================================== */}
      {isMounted &&
        createPortal(
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
            style={{ position: "fixed", zIndex: 99980 }}
            className={`scroll-to-top-fixed group w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#060b18]/95 via-[#091638]/95 to-[#050c22]/95 backdrop-blur-md border border-[#00d2ff]/45 hover:border-[#00d2ff] text-[#00d2ff] hover:text-[#050811] hover:bg-[#00d2ff] shadow-[0_4px_20px_rgba(0,0,0,0.7),0_0_18px_rgba(0,210,255,0.25)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.85),0_0_32px_rgba(0,210,255,0.75)] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.06] active:scale-95 cursor-pointer select-none pointer-events-auto ${
              showScrollTop
                ? "opacity-100 translate-y-0 scale-100 visible"
                : "opacity-0 translate-y-3 scale-90 pointer-events-none invisible"
            }`}
          >
            {/* Subtle Expanding Radar Attention Ring */}
            <span className="absolute -inset-1 rounded-full border border-[#00d2ff]/30 ai-radar-wave pointer-events-none -z-10" />

            {/* Subtle Cyan Pulse Glow Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00d2ff]/25 via-[#0066ff]/20 to-[#00d2ff]/25 blur-sm group-hover:blur-md opacity-60 group-hover:opacity-100 transition-all duration-300 -z-10 animate-pulse" />

            {/* Shimmer light sweep on hover */}
            <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </span>

            <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]" />
          </button>,
          document.body
        )}
    </footer>
  );
}
