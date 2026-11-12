"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowLeft, KeyRound, User, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    try {
      const session = localStorage.getItem("admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed?.authenticated && parsed?.user === "admin") {
          router.replace("/admin");
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      // Attempt API authentication first
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("admin_session", JSON.stringify(data.session));
        if (data.token) {
          localStorage.setItem("admin_token", data.token);
        }
        setIsLoading(false);
        setStatusMessage("Authentication successful. Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/admin");
        }, 400);
        return;
      } else {
        setIsLoading(false);
        setErrorMessage(data.error || "Invalid username or password");
        return;
      }
    } catch {
      // Local development fallback if fetch encounters an error
      if (username.trim() === "admin" && password === "TarekR9414@") {
        const fallbackSession = {
          authenticated: true,
          user: "admin",
          role: "Administrator",
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem("admin_session", JSON.stringify(fallbackSession));
        document.cookie = "admin_session=active; path=/; max-age=604800; SameSite=Lax";
        setIsLoading(false);
        setStatusMessage("Authentication successful. Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/admin");
        }, 400);
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid username or password");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050811] text-white flex items-center justify-center px-4 py-16 overflow-hidden selection:bg-[#00d2ff] selection:text-[#050811]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[32rem] h-[32rem] bg-[#0088ff]/12 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/3 w-[32rem] h-[32rem] bg-[#00d2ff]/12 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-30"
      >
        {/* Top Back Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00d2ff] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="relative rounded-2xl bg-[#081026] border border-[#00d2ff]/35 backdrop-blur-xl p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_30px_rgba(0,210,255,0.18)]">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            {/* Logo Mark */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d2ff] via-[#0072ff] to-[#1d4ed8] p-[1.5px] shadow-[0_0_20px_rgba(0,210,255,0.4)] mb-4">
              <div className="w-full h-full rounded-[10.5px] bg-[#060c1d] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#00d2ff]" />
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tarek <span className="text-[#00d2ff]">Rahaman</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff]/80 mt-1">
              Portfolio CMS • Admin Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-[#00d2ff]/70" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050b18] border border-[#00d2ff]/30 text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:shadow-[0_0_15px_rgba(0,210,255,0.35)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-[#00d2ff]/70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#050b18] border border-[#00d2ff]/30 text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:shadow-[0_0_15px_rgba(0,210,255,0.35)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] shadow-[0_0_18px_rgba(0,210,255,0.45)] hover:shadow-[0_0_26px_rgba(0,210,255,0.7)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 mt-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Success Message */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-center"
            >
              <p className="text-xs text-[#00d2ff] font-medium leading-relaxed">
                {statusMessage}
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center"
            >
              <p className="text-xs text-rose-400 font-medium leading-relaxed">
                {errorMessage}
              </p>
            </motion.div>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
              Restricted Area
            </span>
            <span className="font-mono text-slate-500">256-bit Encrypted</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
