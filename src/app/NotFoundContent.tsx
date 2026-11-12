"use client";

import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFoundContent() {
  const { t, language } = useLanguage();
  const isBn = language === "bn";

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32 relative overflow-hidden">
      {/* Futuristic Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="text-center max-w-lg mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
          <span>{isBn ? "এরর ৪০৪ • পেজটি খুঁজে পাওয়া যায়নি" : "Error 404 • Destination Not Found"}</span>
        </div>

        <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00d2ff] to-[#0088ff] drop-shadow-[0_0_25px_rgba(0,210,255,0.4)]">
          404
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium">
          {t("errors.notFoundTitle")}
        </p>

        <p className="text-xs sm:text-sm text-slate-400">
          {t("errors.notFoundDesc")}
        </p>

        <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0088ff] text-[#050811] font-bold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t("errors.backHome")}</span>
          </Link>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-[#00d2ff]/40 text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#00d2ff]" />
            <span>{t("errors.browsePortfolio")}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

