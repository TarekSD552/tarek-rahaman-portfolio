"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Lock, Sun, Moon, Globe, Check } from "lucide-react";
import { profileData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeImageUrl } from "@/lib/image-utils";

// Navigation routes
const defaultNavItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Skills", href: "/skills" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { cmsData } = useCms();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll listener for glassmorphism header depth (throttled to avoid redundant React renders)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navLinks = cmsData?.navigation?.length
    ? cmsData.navigation.filter((n) => n.enabled)
    : defaultNavItems;

  const brandName = cmsData?.siteSettings?.websiteName || profileData.name;

  // Translate navigation labels smoothly while respecting CMS overrides
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-[#05070D] border-b ${
        isScrolled
          ? "border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
          : "border-white/[0.04]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* ======================================================== */}
        {/* 1. LEFT SIDE — EXACT REFERENCE 06: (TR) Tarek Rahaman     */}
        {/* ======================================================== */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 sm:gap-3 select-none min-w-0 shrink"
          aria-label="Tarek Rahaman Portfolio Homepage"
        >
          {/* Logo Display: Custom Image Logo from CMS or Iconic TR Badge */}
          {cmsData?.siteSettings?.logoUrl ? (
            <div className="relative h-8 sm:h-10 w-auto max-w-[110px] sm:max-w-[140px] flex items-center justify-center shrink-0">
              <img
                src={normalizeImageUrl(cmsData.siteSettings.logoUrl)}
                alt={brandName}
                className="max-h-8 sm:max-h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,210,255,0.45)] group-hover:drop-shadow-[0_0_20px_rgba(0,210,255,0.8)] transition-all duration-300"
              />
            </div>
          ) : (
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#030712] border-2 border-[#00d2ff] flex items-center justify-center shadow-[0_0_16px_rgba(0,210,255,0.45)] group-hover:shadow-[0_0_24px_rgba(0,210,255,0.8)] transition-all duration-300 shrink-0">
              <span className="font-extrabold text-xs sm:text-sm tracking-wider text-[#00d2ff] group-hover:text-white transition-colors">
                {cmsData?.siteSettings?.logoText || "TR"}
              </span>
            </div>
          )}

          {/* Tarek Rahaman Brand Text */}
          <span className="text-sm sm:text-lg font-bold text-white tracking-tight group-hover:text-[#00d2ff] transition-colors truncate max-w-[125px] min-[390px]:max-w-none">
            {brandName}
          </span>
        </Link>

        {/* ======================================================== */}
        {/* 2. RIGHT SIDE — NAV LINKS + THEME + LANGUAGE CONTROLS    */}
        {/* ======================================================== */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <nav className="flex items-center gap-5 xl:gap-7">
            {navLinks.map((item) => {
              const normalizedPath = (pathname || "/").replace(/\/$/, "") || "/";
              const isProjectRoute =
                (item.href === "/project" ||
                  item.href === "/portfolio" ||
                  item.href === "/projects") &&
                (normalizedPath === "/project" ||
                  normalizedPath === "/portfolio" ||
                  normalizedPath === "/projects" ||
                  normalizedPath.startsWith("/portfolio/") ||
                  normalizedPath.startsWith("/project/") ||
                  normalizedPath.startsWith("/projects/"));

              const isActive =
                item.href === "/"
                  ? normalizedPath === "/"
                  : isProjectRoute ||
                    normalizedPath === item.href ||
                    normalizedPath.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 select-none relative py-1 ${
                    isActive
                      ? "text-[#00d2ff] font-semibold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {getNavLabel(item.name)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00d2ff] shadow-[0_0_8px_#00d2ff] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="h-4 w-[1px] bg-white/10 mx-1" aria-hidden="true" />

          {/* Theme Switcher Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? t("theme.switchToLight", "Switch to Light Mode")
                : t("theme.switchToDark", "Switch to Dark Mode")
            }
            title={
              theme === "dark"
                ? t("theme.switchToLight", "Switch to Light Mode")
                : t("theme.switchToDark", "Switch to Dark Mode")
            }
            className="group relative p-2 rounded-xl bg-white/[0.04] hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 transition-all duration-300 flex items-center justify-center cursor-pointer select-none"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            ) : (
              <Moon className="w-4 h-4 text-[#00d2ff] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,210,255,0.6)]" />
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label={t("language.selectLanguage", "Select Language")}
              aria-expanded={langDropdownOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 text-xs font-semibold text-slate-200 transition-all duration-200 cursor-pointer select-none"
            >
              <Globe className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span>{language === "en" ? "EN" : "বাং"}</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute right-0 mt-2 w-36 rounded-xl bg-[#080d1a] border border-[#00d2ff]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(0,210,255,0.15)] backdrop-blur-xl p-1.5 z-50 select-none"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={language === "en"}
                    onClick={() => {
                      setLanguage("en");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      language === "en"
                        ? "bg-[#00d2ff]/20 text-[#00d2ff] font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇬🇧</span>
                      <span>English</span>
                    </span>
                    {language === "en" && <Check className="w-3.5 h-3.5 text-[#00d2ff]" />}
                  </button>

                  <button
                    type="button"
                    role="option"
                    aria-selected={language === "bn"}
                    onClick={() => {
                      setLanguage("bn");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      language === "bn"
                        ? "bg-[#00d2ff]/20 text-[#00d2ff] font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇧🇩</span>
                      <span>বাংলা</span>
                    </span>
                    {language === "bn" && <Check className="w-3.5 h-3.5 text-[#00d2ff]" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtle Admin Portal Access */}
          <Link
            href="/admin/login"
            aria-label="Admin Portal"
            className="w-7 h-7 rounded-full bg-white/[0.03] hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 flex items-center justify-center text-slate-400 hover:text-[#00d2ff] transition-all ml-1"
            title="CMS Admin Login"
          >
            <Lock className="w-3 h-3" />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* MOBILE CONTROLS (Theme + Language + Hamburger)          */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? t("theme.switchToLight", "Switch to Light Mode")
                : t("theme.switchToDark", "Switch to Dark Mode")
            }
            className="p-1.5 sm:p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-[#00d2ff] transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#00d2ff]" />
            )}
          </button>

          {/* Mobile Language Switcher Quick Pill */}
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            aria-label="Toggle language between English and Bengali"
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-200 hover:text-[#00d2ff] transition-colors flex items-center gap-1"
          >
            <Globe className="w-3 h-3 text-[#00d2ff]" />
            <span>{language === "en" ? "EN" : "বাং"}</span>
          </button>

          {/* Mobile Admin Portal Icon (Visible on 400px+; always in mobile menu drawer) */}
          <Link
            href="/admin/login"
            aria-label="Admin Portal"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/[0.04] border border-white/10 hidden min-[400px]:flex items-center justify-center text-slate-400 hover:text-[#00d2ff] transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white bg-white/[0.04] rounded-xl border border-white/[0.1] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#00d2ff]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE MENU DRAWER                                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#05070D] border-t border-white/[0.08] px-6 py-5 overflow-hidden shadow-2xl space-y-4"
          >
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const normalizedPath = (pathname || "/").replace(/\/$/, "") || "/";
                const isProjectRoute =
                  (item.href === "/project" ||
                    item.href === "/portfolio" ||
                    item.href === "/projects") &&
                  (normalizedPath === "/project" ||
                    normalizedPath === "/portfolio" ||
                    normalizedPath === "/projects" ||
                    normalizedPath.startsWith("/portfolio/") ||
                    normalizedPath.startsWith("/project/") ||
                    normalizedPath.startsWith("/projects/"));

                const isActive =
                  item.href === "/"
                    ? normalizedPath === "/"
                    : isProjectRoute ||
                      normalizedPath === item.href ||
                      normalizedPath.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{getNavLabel(item.name)}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </Link>
                );
              })}

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/[0.02] border border-white/5"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{t("nav.adminDashboard", "Admin Dashboard")}</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </nav>

            {/* Mobile Drawer Settings (Theme & Language Selectors) */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
              {/* Language Switch */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === "en"
                      ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_10px_#00d2ff]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === "bn"
                      ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_10px_#00d2ff]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇧🇩 বাংলা
                </button>
              </div>

              {/* Theme Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300 hover:text-white"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t("theme.lightMode", "Light Mode")}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>{t("theme.darkMode", "Dark Mode")}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
