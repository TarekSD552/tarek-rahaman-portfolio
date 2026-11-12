"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Compass,
  Zap,
  ArrowRight,
  Trash2,
  AlertTriangle,
  X,
  Share2,
} from "lucide-react";

interface PageProgressItem {
  path: string;
  pageTitle: string;
  totalViews: number;
  totalDurationSeconds: number;
  avgScrollDepth: number;
  avgDurationSeconds: number;
}

interface MostVisitedPageItem {
  path: string;
  views: number;
  avgScrollDepth: number;
  avgDurationSeconds: number;
}

interface DeviceBreakdownItem {
  device: "Desktop" | "Mobile" | "Tablet";
  count: number;
  percentage: number;
}

interface TrafficSourceItem {
  source: string;
  count: number;
  percentage: number;
}

interface VisitorSessionItem {
  sessionId: string;
  visitorId: string;
  firstSeen: string;
  lastSeen: string;
  date: string;
  deviceType: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  os: string;
  referrer: string;
  trafficSource?: string;
  totalDurationSeconds: number;
  maxScrollDepth: number;
  engagementScore: number;
  pageViewsCount: number;
  pagesVisited: {
    path: string;
    pageTitle?: string;
    durationSeconds: number;
    maxScrollDepth: number;
    viewCount: number;
    lastViewedAt: string;
  }[];
}

interface TimelineItem {
  date: string;
  uniqueVisitors: number;
  pageViews: number;
  avgTimeSeconds: number;
}

interface AnalyticsDataResponse {
  overview: {
    liveNow: number;
    todayVisitors: number;
    todayPageViews: number;
    totalVisitorsAllTime: number;
    totalPageViewsInRange: number;
    weeklyVisitors: number;
    monthlyVisitors: number;
    avgTimeSpentSeconds: number;
    avgEngagement: number;
  };
  deviceBreakdown: DeviceBreakdownItem[];
  trafficSourceBreakdown: TrafficSourceItem[];
  dateRange: {
    range: string;
    startDate: string;
    endDate: string;
  };
  timeline: TimelineItem[];
  pageProgress: PageProgressItem[];
  mostVisitedPages: MostVisitedPageItem[];
  recentSessions: VisitorSessionItem[];
}

export default function AdminAnalyticsCms({
  showToast,
}: {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}) {
  const [range, setRange] = useState<"today" | "7d" | "30d" | "month" | "all" | "custom">("7d");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<AnalyticsDataResponse | null>(null);
  const [selectedSession, setSelectedSession] = useState<VisitorSessionItem | null>(null);
  const [sessionSearch, setSessionSearch] = useState<string>("");
  const [activeChartMetric, setActiveChartMetric] = useState<"visitors" | "pageViews">("visitors");
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Reset Analytics Handler
  const handleResetAnalytics = async (mode: "all" | "today") => {
    setIsResetting(true);
    try {
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("admin_token");
        if (token) {
          authHeaders["Authorization"] = `Bearer ${token}`;
        } else {
          const session = localStorage.getItem("admin_session");
          if (session) {
            try {
              if (JSON.parse(session)?.authenticated) {
                authHeaders["Authorization"] = "Bearer active";
              }
            } catch {}
          }
        }
      }
      const res = await fetch("/api/analytics/reset", {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({ mode }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message, "success");
        setResetModalOpen(false);
        await fetchAnalytics();
      } else {
        showToast(json.error || "Failed to reset analytics", "error");
      }
    } catch {
      showToast("Network error while resetting analytics", "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Fetch real data from server (silent mode prevents screen flashing on background polling)
  const fetchAnalytics = useCallback(
    async (silent: boolean = false) => {
      if (!silent) setIsLoading(true);
      try {
        let url = `/api/analytics/stats?range=${range}`;
        if (range === "custom" && startDate && endDate) {
          url += `&from=${startDate}&to=${endDate}`;
        }
        const authHeaders: Record<string, string> = {};
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("admin_token");
          if (token) {
            authHeaders["Authorization"] = `Bearer ${token}`;
          } else {
            const session = localStorage.getItem("admin_session");
            if (session) {
              try {
                if (JSON.parse(session)?.authenticated) {
                  authHeaders["Authorization"] = "Bearer active";
                }
              } catch {}
            }
          }
        }
        const res = await fetch(url, {
          cache: "no-store",
          headers: authHeaders,
          credentials: "include",
        });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else if (!silent) {
          showToast("Failed to load analytics data", "error");
        }
      } catch {
        if (!silent) {
          showToast("Network error while fetching analytics", "error");
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [range, startDate, endDate, showToast]
  );

  useEffect(() => {
    fetchAnalytics(false);

    // Dynamic background polling every 15s to keep Live Now and stats up-to-date
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  // Format seconds to user-friendly "Xm Ys"
  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    if (!data?.recentSessions) return [];
    if (!sessionSearch.trim()) return data.recentSessions;
    const q = sessionSearch.toLowerCase();
    return data.recentSessions.filter(
      (s) =>
        s.sessionId.toLowerCase().includes(q) ||
        s.browser.toLowerCase().includes(q) ||
        s.deviceType.toLowerCase().includes(q) ||
        (s.trafficSource && s.trafficSource.toLowerCase().includes(q)) ||
        s.pagesVisited.some((p) => p.path.toLowerCase().includes(q))
    );
  }, [data?.recentSessions, sessionSearch]);

  // Max value for timeline chart scaling
  const maxChartValue = useMemo(() => {
    if (!data?.timeline || data.timeline.length === 0) return 10;
    const values = data.timeline.map((t) =>
      activeChartMetric === "visitors" ? t.uniqueVisitors : t.pageViews
    );
    const max = Math.max(...values);
    return max > 0 ? Math.ceil(max * 1.25) : 10;
  }, [data?.timeline, activeChartMetric]);

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. HEADER & DATE FILTER CONTROLS                         */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#091536] to-[#050b1a] border border-[#00d2ff]/30 shadow-[0_0_40px_rgba(0,210,255,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[10px] font-mono font-bold uppercase text-[#00d2ff] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Privacy-Friendly Website Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#00d2ff]" />
            <span>Website Statistics &amp; Engagement Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time tracking of live active visitors, unique devices, traffic sources, scroll depth progress, and anonymous session journeys.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "today", label: "Today" },
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "Last 30 Days" },
              { id: "month", label: "This Month" },
              { id: "all", label: "All Time" },
              { id: "custom", label: "Custom" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                range === item.id
                  ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                  : "bg-[#040815] text-slate-300 border border-white/10 hover:border-[#00d2ff]/40"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => fetchAnalytics(false)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#040815] border border-white/10 text-slate-300 hover:text-white hover:border-[#00d2ff]/40 disabled:opacity-50 transition-all cursor-pointer"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#00d2ff]" : ""}`} />
          </button>

          {/* Reset / Clear Test Data Button */}
          <button
            onClick={() => setResetModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5 ml-1"
            title="Clear or reset test analytics data safely"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker (shown when 'custom' is selected) */}
      {range === "custom" && (
        <div className="p-4 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-mono text-slate-300">Custom Date Range:</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#040815] border border-white/10 text-white font-mono text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#040815] border border-white/10 text-white font-mono text-xs focus:border-[#00d2ff] outline-none"
            />
          </div>
          <button
            onClick={() => fetchAnalytics(false)}
            className="px-4 py-1.5 rounded-xl bg-[#00d2ff] text-[#050811] font-bold text-xs hover:opacity-90 cursor-pointer"
          >
            Apply Filter
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TOP SUMMARY CARDS (7 METRICS INCL. LIVE VISITORS NOW) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* Card 0: Live Visitors Now (ADD 1) */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)] relative overflow-hidden group hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                Live Now
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : data?.overview.liveNow || 0}
          </div>
          <span className="text-[10px] text-emerald-300 font-mono mt-1 block">
            Visitors currently active
          </span>
        </div>

        {/* Card 1: Today's Unique Visitors */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 shadow-lg relative overflow-hidden group hover:border-[#00d2ff]/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-400">Today&apos;s Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : data?.overview.todayVisitors || 0}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            Different visitors detected today
          </span>
        </div>

        {/* Card 2: Today's Page Views */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-cyan-500/20 shadow-lg relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-400">Today&apos;s Page Views</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : data?.overview.todayPageViews || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            Total pages viewed today
          </span>
        </div>

        {/* Card 3: Weekly Unique Visitors */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-purple-500/20 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-400">Weekly Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : data?.overview.weeklyVisitors || 0}
          </div>
          <span className="text-[10px] text-purple-300 font-mono mt-1 block">
            Unique visitors across last 7 days
          </span>
        </div>

        {/* Card 4: Monthly Unique Visitors */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-indigo-500/20 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-400">Monthly Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : data?.overview.monthlyVisitors || 0}
          </div>
          <span className="text-[10px] text-indigo-300 font-mono mt-1 block">
            Unique visitors this calendar month
          </span>
        </div>

        {/* Card 5: Total Unique Visitors (All-Time) */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-emerald-500/20 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-400">Total Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : data?.overview.totalVisitorsAllTime || 0}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            All-time unique visitors since launch
          </span>
        </div>

        {/* Card 6: Average Time Spent */}
        <div className="p-4 rounded-2xl bg-[#070e24] border border-amber-500/20 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-400">Avg Time Spent</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isLoading && !data ? "..." : formatDuration(data?.overview.avgTimeSpentSeconds || 0)}
          </div>
          <span className="text-[10px] text-amber-300 font-mono mt-1 block">
            Avg active duration per session
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DEVICE ANALYTICS (ADD 2) & TRAFFIC SOURCES (ADD 3)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =================== DEVICE ANALYTICS =================== */}
        <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 shadow-[0_0_30px_rgba(0,210,255,0.06)] space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#00d2ff]" />
                  Device Analytics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                  Hardware Breakdown
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Visitor distribution across Desktop, Mobile, and Tablet hardware.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300">
              Total:{" "}
              <strong className="text-[#00d2ff]">
                {(data?.deviceBreakdown || []).reduce((acc, d) => acc + d.count, 0)}
              </strong>
            </span>
          </div>

          {/* Segmented Visual Comparison Bar */}
          <div className="w-full h-3 rounded-full bg-[#040815] border border-white/10 overflow-hidden flex">
            {(data?.deviceBreakdown || []).map((dev) => {
              const color =
                dev.device === "Desktop"
                  ? "bg-[#00d2ff]"
                  : dev.device === "Mobile"
                  ? "bg-emerald-400"
                  : "bg-purple-400";
              return (
                <div
                  key={dev.device}
                  style={{ width: `${dev.percentage}%` }}
                  className={`h-full ${color} transition-all duration-500`}
                  title={`${dev.device}: ${dev.percentage}% (${dev.count})`}
                />
              );
            })}
          </div>

          {/* Device Cards List */}
          <div className="space-y-3 pt-1">
            {(data?.deviceBreakdown || []).map((dev) => {
              const Icon =
                dev.device === "Desktop"
                  ? Monitor
                  : dev.device === "Mobile"
                  ? Smartphone
                  : Tablet;

              const colorTheme =
                dev.device === "Desktop"
                  ? {
                      text: "text-[#00d2ff]",
                      bg: "bg-[#00d2ff]/10",
                      border: "border-[#00d2ff]/30",
                      bar: "from-[#00d2ff] to-[#0072ff] shadow-[0_0_12px_rgba(0,210,255,0.4)]",
                    }
                  : dev.device === "Mobile"
                  ? {
                      text: "text-emerald-400",
                      bg: "bg-emerald-500/10",
                      border: "border-emerald-500/30",
                      bar: "from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
                    }
                  : {
                      text: "text-purple-400",
                      bg: "bg-purple-500/10",
                      border: "border-purple-500/30",
                      bar: "from-purple-400 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]",
                    };

              return (
                <div
                  key={dev.device}
                  className="p-3.5 rounded-2xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl ${colorTheme.bg} border ${colorTheme.border} flex items-center justify-center ${colorTheme.text}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block">{dev.device}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {dev.count} {dev.count === 1 ? "visitor" : "visitors"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-black font-mono ${colorTheme.text}`}>
                        {dev.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Modern Glowing Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#070e24] border border-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dev.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${colorTheme.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================== TRAFFIC SOURCES =================== */}
        <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 shadow-[0_0_30px_rgba(0,210,255,0.06)] space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00d2ff]" />
                  Traffic Sources
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Referral Breakdown
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Where your visitors originated (Referrers, Direct, Search &amp; Social).
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-300">
              Total Sources: <strong className="text-cyan-400">{(data?.trafficSourceBreakdown || []).length}</strong>
            </span>
          </div>

          {/* Segmented Visual Comparison Bar */}
          <div className="w-full h-3 rounded-full bg-[#040815] border border-white/10 overflow-hidden flex">
            {(data?.trafficSourceBreakdown || []).map((src, i) => {
              const colors = [
                "bg-[#00d2ff]",
                "bg-blue-500",
                "bg-indigo-500",
                "bg-sky-400",
                "bg-fuchsia-400",
                "bg-slate-400",
              ];
              return (
                <div
                  key={src.source}
                  style={{ width: `${src.percentage}%` }}
                  className={`h-full ${colors[i % colors.length]} transition-all duration-500`}
                  title={`${src.source}: ${src.percentage}% (${src.count})`}
                />
              );
            })}
          </div>

          {/* Traffic Sources List */}
          <div className="space-y-2.5 pt-1 max-h-[300px] overflow-y-auto pr-1">
            {(data?.trafficSourceBreakdown || []).map((src) => {
              const getSourceMeta = (name: string) => {
                switch (name) {
                  case "Direct":
                    return {
                      icon: Zap,
                      color: "text-[#00d2ff]",
                      bg: "bg-[#00d2ff]/10",
                      border: "border-[#00d2ff]/30",
                      bar: "from-[#00d2ff] to-cyan-600 shadow-[0_0_12px_rgba(0,210,255,0.4)]",
                    };
                  case "Google Search":
                    return {
                      icon: Search,
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                      border: "border-blue-500/30",
                      bar: "from-blue-400 to-indigo-600 shadow-[0_0_12px_rgba(96,165,250,0.4)]",
                    };
                  case "Facebook":
                    return {
                      icon: Share2,
                      color: "text-indigo-400",
                      bg: "bg-indigo-500/10",
                      border: "border-indigo-500/30",
                      bar: "from-indigo-400 to-blue-600 shadow-[0_0_12px_rgba(129,140,248,0.4)]",
                    };
                  case "LinkedIn":
                    return {
                      icon: Globe,
                      color: "text-sky-400",
                      bg: "bg-sky-500/10",
                      border: "border-sky-500/30",
                      bar: "from-sky-400 to-cyan-600 shadow-[0_0_12px_rgba(56,189,248,0.4)]",
                    };
                  case "Instagram":
                    return {
                      icon: Sparkles,
                      color: "text-fuchsia-400",
                      bg: "bg-fuchsia-500/10",
                      border: "border-fuchsia-500/30",
                      bar: "from-fuchsia-400 to-pink-600 shadow-[0_0_12px_rgba(232,121,249,0.4)]",
                    };
                  default:
                    return {
                      icon: Compass,
                      color: "text-slate-300",
                      bg: "bg-slate-500/10",
                      border: "border-slate-500/30",
                      bar: "from-slate-400 to-slate-600 shadow-[0_0_12px_rgba(148,163,184,0.3)]",
                    };
                }
              };

              const meta = getSourceMeta(src.source);
              const Icon = meta.icon;

              return (
                <div
                  key={src.source}
                  className="p-3 rounded-2xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg ${meta.bg} border ${meta.border} flex items-center justify-center ${meta.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{src.source}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {src.count} {src.count === 1 ? "visitor" : "visitors"}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-black font-mono ${meta.color}`}>
                      {src.percentage}%
                    </span>
                  </div>

                  {/* Modern Glowing Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#070e24] border border-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${src.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${meta.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. VISITOR ENGAGEMENT & WEBSITE PROGRESS (SCROLL DEPTH)  */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00d2ff]" />
                Visitor Engagement &amp; Page Progress
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                Avg Scroll Depth
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Accurate percentage of how far visitors explore down each key section of your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Overall Site Engagement:</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30">
              {data?.overview.avgEngagement || 0}%
            </span>
          </div>
        </div>

        {/* Progress Bars Grid for 6 Main Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.pageProgress || []).map((page) => {
            const depth = page.avgScrollDepth || 0;
            const barColor =
              depth >= 75
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : depth >= 45
                ? "bg-gradient-to-r from-[#00d2ff] to-[#0072ff] shadow-[0_0_15px_rgba(0,210,255,0.5)]"
                : "bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]";

            return (
              <div
                key={page.path}
                className="p-4 rounded-2xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{page.pageTitle}</span>
                    <span className="text-[10px] font-mono text-slate-500">{page.path}</span>
                  </div>
                  <span className="text-sm font-black font-mono text-[#00d2ff]">
                    {depth}%
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-3 rounded-full bg-[#070e24] border border-white/10 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${depth}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>

                {/* Micro Stats */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>
                    Views: <strong className="text-white">{page.totalViews}</strong>
                  </span>
                  <span>
                    Avg Time:{" "}
                    <strong className="text-slate-300">
                      {formatDuration(page.avgDurationSeconds)}
                    </strong>
                  </span>
                  <span>
                    Explored: <strong className="text-emerald-400">{depth}%</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. VISITOR TREND CHART (DAILY / WEEKLY / MONTHLY)        */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
              Visitor Growth &amp; Page View Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily trend breakdown for the selected timeframe.
            </p>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#040815] border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveChartMetric("visitors")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartMetric === "visitors"
                  ? "bg-[#00d2ff] text-[#050811] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Unique Visitors
            </button>
            <button
              onClick={() => setActiveChartMetric("pageViews")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartMetric === "pageViews"
                  ? "bg-[#00d2ff] text-[#050811] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Page Views
            </button>
          </div>
        </div>

        {/* Interactive SVG Bar Chart */}
        <div className="pt-2">
          {!data?.timeline || data.timeline.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-xs">
              No timeline data available for this range yet.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-56 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-2 overflow-x-auto">
                {data.timeline.map((item) => {
                  const val =
                    activeChartMetric === "visitors" ? item.uniqueVisitors : item.pageViews;
                  const heightPercent =
                    maxChartValue > 0 ? Math.max(8, (val / maxChartValue) * 100) : 8;

                  return (
                    <div
                      key={item.date}
                      className="flex-1 min-w-[32px] sm:min-w-[40px] flex flex-col items-center gap-2 h-full justify-end group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 px-2 py-1 rounded-lg bg-[#040815] border border-[#00d2ff]/40 shadow-xl text-[10px] font-mono text-white whitespace-nowrap">
                        <div>{item.date}</div>
                        <div className="text-[#00d2ff] font-bold">
                          {val} {activeChartMetric === "visitors" ? "Visitors" : "Views"}
                        </div>
                      </div>

                      {/* Bar Value Indicator */}
                      <span className="text-[10px] font-mono text-slate-400 opacity-80 group-hover:text-[#00d2ff] transition-colors">
                        {val}
                      </span>

                      {/* Animated Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`w-full rounded-t-xl transition-all cursor-pointer ${
                          val > 0
                            ? "bg-gradient-to-t from-[#00d2ff]/30 via-[#00d2ff]/70 to-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.3)] group-hover:shadow-[0_0_20px_rgba(0,210,255,0.7)] group-hover:brightness-125"
                            : "bg-white/5 border border-white/5"
                        }`}
                      />

                      {/* Date label */}
                      <span className="text-[9px] font-mono text-slate-500 truncate max-w-full">
                        {item.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. MOST VISITED PAGES TABLE & BREAKDOWN                  */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#00d2ff]" />
              Most Visited Pages &amp; Sections
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by page views with scroll engagement depth.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Page Route</th>
                <th className="py-2.5 px-3 text-right">Views</th>
                <th className="py-2.5 px-3 text-right">Avg Time</th>
                <th className="py-2.5 px-3 text-right">Avg Scroll</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!data?.mostVisitedPages || data.mostVisitedPages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 font-mono">
                    No page visits recorded in this period yet.
                  </td>
                </tr>
              ) : (
                data.mostVisitedPages.map((page, idx) => (
                  <tr key={page.path} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500">#{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#00d2ff]">{page.path}</span>
                        {page.path === "/" && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Home
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {page.views}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {formatDuration(page.avgDurationSeconds)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {page.avgScrollDepth}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 7. RECENT ANONYMOUS VISITOR SESSIONS (WITH DEVICE & SRC) */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00d2ff]" />
              Recent Anonymous Visitor Sessions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Privacy-friendly individual session journeys (device type, traffic source, duration, maximum scroll, and pages explored).
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search session, device, source..."
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Session ID</th>
                <th className="py-2.5 px-3">Device Type</th>
                <th className="py-2.5 px-3">Traffic Source</th>
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Pages Explored</th>
                <th className="py-2.5 px-3 text-right">Time Spent</th>
                <th className="py-2.5 px-3 text-right">Max Scroll</th>
                <th className="py-2.5 px-3 text-right">Engagement</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    No sessions match the current search or date range.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const DeviceIcon =
                    session.deviceType === "Mobile"
                      ? Smartphone
                      : session.deviceType === "Tablet"
                      ? Tablet
                      : Monitor;

                  const engagementBadge =
                    session.engagementScore >= 70
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : session.engagementScore >= 40
                      ? "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30";

                  const src = session.trafficSource || "Direct";
                  const srcBadge =
                    src === "Direct"
                      ? "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/30"
                      : src === "Google Search"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      : src === "Facebook"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      : src === "LinkedIn"
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                      : src === "Instagram"
                      ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30"
                      : "bg-slate-500/10 text-slate-300 border-slate-500/30";

                  return (
                    <tr
                      key={session.sessionId}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => setSelectedSession(session)}
                    >
                      {/* 1. Session ID */}
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        <span className="text-[#00d2ff] group-hover:underline">
                          {session.sessionId.slice(0, 16)}...
                        </span>
                      </td>

                      {/* 2. Device Type Column */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-mono text-[11px]">
                          <DeviceIcon className="w-3.5 h-3.5 text-[#00d2ff]" />
                          <span>{session.deviceType}</span>
                          <span className="text-slate-500 text-[10px]">({session.browser})</span>
                        </div>
                      </td>

                      {/* 3. Traffic Source Column */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border ${srcBadge}`}
                        >
                          {src}
                        </span>
                      </td>

                      {/* 4. Date & Time */}
                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                        {new Date(session.lastSeen).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        <span className="text-slate-600">({session.date})</span>
                      </td>

                      {/* 5. Pages Explored */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {session.pagesVisited.slice(0, 3).map((p) => (
                            <span
                              key={p.path}
                              className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10"
                            >
                              {p.path}
                            </span>
                          ))}
                          {session.pagesVisited.length > 3 && (
                            <span className="text-[10px] font-mono text-slate-500">
                              +{session.pagesVisited.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Time Spent */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {formatDuration(session.totalDurationSeconds)}
                      </td>

                      {/* 7. Max Scroll */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                        {session.maxScrollDepth}%
                      </td>

                      {/* 8. Engagement */}
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${engagementBadge}`}
                        >
                          {session.engagementScore}%
                        </span>
                      </td>

                      {/* 9. Details Button */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSession(session);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#00d2ff]/10 text-[#00d2ff] hover:bg-[#00d2ff] hover:text-[#050811] text-[10px] font-bold transition-all cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 8. INDIVIDUAL SESSION DETAILS MODAL                      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">
                      Session Details: {selectedSession.sessionId}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Anonymous Device ID: {selectedSession.visitorId}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Session Meta Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-2xl bg-[#040815] border border-white/5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Device &amp; OS</span>
                  <span className="text-xs font-bold text-white">
                    {selectedSession.deviceType} • {selectedSession.os}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Traffic Source</span>
                  <span className="text-xs font-bold text-[#00d2ff]">
                    {selectedSession.trafficSource || "Direct"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Browser</span>
                  <span className="text-xs font-bold text-white">{selectedSession.browser}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Duration</span>
                  <span className="text-xs font-bold font-mono text-white">
                    {formatDuration(selectedSession.totalDurationSeconds)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Engagement</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {selectedSession.engagementScore}%
                  </span>
                </div>
              </div>

              {/* Pages Visited in this Session */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Pages Visited in this Session
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedSession.pagesVisited.map((page, i) => (
                    <div
                      key={page.path + i}
                      className="p-3 rounded-xl bg-[#040815] border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{page.path}</span>
                          <span className="text-[10px] text-slate-500">
                            {page.viewCount} {page.viewCount > 1 ? "views" : "view"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Last seen: {new Date(page.lastViewedAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Time</span>
                          <span className="font-mono font-bold text-slate-200">
                            {formatDuration(page.durationSeconds)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Scroll Depth</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {page.maxScrollDepth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 9. RESET ANALYTICS CONFIRMATION MODAL                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {resetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#0b1329] border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5 text-rose-400">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Reset Analytics &amp; Test Data</h3>
                    <p className="text-[10px] font-mono text-rose-300">Admin Maintenance Utility</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  disabled={isResetting}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Clearing test data allows you to reset synthetic or localhost test visits back to zero before going live. Select the reset scope:
              </p>

              <div className="space-y-2.5 pt-1">
                {/* Option A: Clear Today's Data */}
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => handleResetAnalytics("today")}
                  className="w-full p-3 rounded-2xl bg-[#070e24] border border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/10 text-left transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                      Clear Today&apos;s Test Data Only
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Clears today&apos;s unique visitors, page views, and sessions while keeping historical data intact.
                  </p>
                </button>

                {/* Option B: Reset All Data */}
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => handleResetAnalytics("all")}
                  className="w-full p-3 rounded-2xl bg-[#070e24] border border-rose-500/30 hover:border-rose-400/60 hover:bg-rose-500/10 text-left transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-400 group-hover:text-rose-300">
                      Reset All Analytics (Factory Reset)
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Zero Everything
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Completely wipes all historical sessions, page progress, and visitor records back to zero.
                  </p>
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
