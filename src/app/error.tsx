"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Safely log the error for monitoring without exposing secrets
    console.error("[Runtime Error Boundary Caught]:", error?.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050811] text-white flex items-center justify-center px-4 py-16 selection:bg-[#00d2ff] selection:text-[#050811] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t("errors.serverErrorTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {t("errors.serverErrorDesc")}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0088ff] text-[#050811] font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t("errors.retry")}</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>{t("errors.backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
