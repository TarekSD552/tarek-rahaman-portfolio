import fs from "fs/promises";
import path from "path";

const ANALYTICS_FILE_PATH = path.join(process.cwd(), "src", "data", "analytics-data.json");

export interface PageVisitItem {
  path: string;
  pageTitle?: string;
  durationSeconds: number;
  maxScrollDepth: number;
  viewCount: number;
  lastViewedAt: string;
}

export interface VisitorSession {
  sessionId: string;
  visitorId: string;
  firstSeen: string;
  lastSeen: string;
  date: string; // YYYY-MM-DD
  deviceType: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  os: string;
  referrer: string;
  trafficSource?: string;
  totalDurationSeconds: number;
  maxScrollDepth: number;
  engagementScore: number;
  pageViewsCount: number;
  pagesVisited: PageVisitItem[];
}

export interface PageAggregateStat {
  path: string;
  pageTitle: string;
  totalViews: number;
  totalDurationSeconds: number;
  totalScrollDepth: number;
  scrollCount: number;
  avgScrollDepth: number;
  avgDurationSeconds: number;
}

export interface AnalyticsDataStore {
  sessions: VisitorSession[];
  pageStats: Record<
    string,
    {
      totalViews: number;
      totalDurationSeconds: number;
      totalScrollDepth: number;
      scrollCount: number;
    }
  >;
  dailyStats: Record<
    string,
    {
      visitors: string[]; // unique visitorIds for that day
      pageViews: number;
      totalDurationSeconds: number;
    }
  >;
  allTimeVisitorIds: string[];
}

const defaultDataStore: AnalyticsDataStore = {
  sessions: [],
  pageStats: {},
  dailyStats: {},
  allTimeVisitorIds: [],
};

// Simple write queue to avoid race conditions during concurrent beacon writes
let writeLock: Promise<void> = Promise.resolve();

async function safeWriteJson(data: AnalyticsDataStore): Promise<void> {
  writeLock = writeLock.then(async () => {
    try {
      const dir = path.dirname(ANALYTICS_FILE_PATH);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(ANALYTICS_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("[Analytics DB] Failed to write data file:", err);
    }
  });
  return writeLock;
}

export async function getAnalyticsData(): Promise<AnalyticsDataStore> {
  try {
    const raw = await fs.readFile(ANALYTICS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      pageStats: parsed.pageStats || {},
      dailyStats: parsed.dailyStats || {},
      allTimeVisitorIds: Array.isArray(parsed.allTimeVisitorIds) ? parsed.allTimeVisitorIds : [],
    };
  } catch {
    // If file doesn't exist, initialize with empty structure
    await safeWriteJson(defaultDataStore);
    return { ...defaultDataStore };
  }
}

export function categorizeTrafficSource(referrer?: string): string {
  if (!referrer || typeof referrer !== "string" || referrer.trim() === "") {
    return "Direct";
  }
  const ref = referrer.toLowerCase();
  // Self/internal referrer or localhost
  if (ref.includes("localhost") || ref.includes("127.0.0.1") || ref.includes("tarekrahaman")) {
    return "Direct";
  }
  if (ref.includes("google.") || ref.includes("google.com")) return "Google Search";
  if (
    ref.includes("facebook.com") ||
    ref.includes("fb.com") ||
    ref.includes("fb.me") ||
    ref.includes("m.facebook.com")
  ) {
    return "Facebook";
  }
  if (ref.includes("linkedin.com") || ref.includes("lnkd.in")) return "LinkedIn";
  if (ref.includes("instagram.com")) return "Instagram";
  if (ref.includes("twitter.com") || ref.includes("t.co") || ref.includes("x.com")) return "Twitter / X";
  if (ref.includes("github.com")) return "GitHub";
  if (ref.includes("youtube.com") || ref.includes("youtu.be")) return "YouTube";
  return "Other Websites";
}

export interface RecordActivityPayload {
  sessionId: string;
  visitorId: string;
  path: string;
  pageTitle?: string;
  scrollDepth?: number;
  durationSeconds?: number;
  deviceType?: "Desktop" | "Mobile" | "Tablet";
  browser?: string;
  os?: string;
  referrer?: string;
  isNewPageView?: boolean;
}

export async function recordVisitorActivity(payload: RecordActivityPayload): Promise<void> {
  const store = await getAnalyticsData();
  const now = new Date();
  const nowIso = now.toISOString();
  const dateKey = nowIso.split("T")[0]; // YYYY-MM-DD

  const cleanPath = payload.path ? payload.path.split("?")[0].toLowerCase() : "/";
  // Never track admin pages or API routes
  if (cleanPath.startsWith("/admin") || cleanPath.startsWith("/api")) {
    return;
  }

  const scrollDepth = Math.min(100, Math.max(0, Math.round(payload.scrollDepth || 0)));
  const durationInc = Math.max(0, Math.min(600, Math.round(payload.durationSeconds || 0)));

  // 1. Maintain All-Time Unique Visitors
  if (!store.allTimeVisitorIds.includes(payload.visitorId)) {
    store.allTimeVisitorIds.push(payload.visitorId);
  }

  // 2. Maintain Daily Stats
  if (!store.dailyStats[dateKey]) {
    store.dailyStats[dateKey] = {
      visitors: [],
      pageViews: 0,
      totalDurationSeconds: 0,
    };
  }
  if (!store.dailyStats[dateKey].visitors.includes(payload.visitorId)) {
    store.dailyStats[dateKey].visitors.push(payload.visitorId);
  }
  if (payload.isNewPageView) {
    store.dailyStats[dateKey].pageViews += 1;
  }
  store.dailyStats[dateKey].totalDurationSeconds += durationInc;

  // 3. Maintain Cumulative Page Stats
  if (!store.pageStats[cleanPath]) {
    store.pageStats[cleanPath] = {
      totalViews: 0,
      totalDurationSeconds: 0,
      totalScrollDepth: 0,
      scrollCount: 0,
    };
  }
  if (payload.isNewPageView) {
    store.pageStats[cleanPath].totalViews += 1;
  }
  store.pageStats[cleanPath].totalDurationSeconds += durationInc;
  if (scrollDepth > 0) {
    store.pageStats[cleanPath].totalScrollDepth += scrollDepth;
    store.pageStats[cleanPath].scrollCount += 1;
  }

  // 4. Find or Create Session
  let session = store.sessions.find((s) => s.sessionId === payload.sessionId);
  const detectedSource = categorizeTrafficSource(payload.referrer);

  if (!session) {
    session = {
      sessionId: payload.sessionId,
      visitorId: payload.visitorId,
      firstSeen: nowIso,
      lastSeen: nowIso,
      date: dateKey,
      deviceType: payload.deviceType || "Desktop",
      browser: payload.browser || "Unknown",
      os: payload.os || "Unknown",
      referrer: payload.referrer || "",
      trafficSource: detectedSource,
      totalDurationSeconds: durationInc,
      maxScrollDepth: scrollDepth,
      engagementScore: calculateEngagementScore(durationInc, scrollDepth, 1),
      pageViewsCount: payload.isNewPageView ? 1 : 0,
      pagesVisited: [
        {
          path: cleanPath,
          pageTitle: payload.pageTitle || cleanPath,
          durationSeconds: durationInc,
          maxScrollDepth: scrollDepth,
          viewCount: 1,
          lastViewedAt: nowIso,
        },
      ],
    };
    // Keep max 500 recent sessions to prevent unbounded file growth
    store.sessions.unshift(session);
    if (store.sessions.length > 500) {
      store.sessions = store.sessions.slice(0, 500);
    }
  } else {
    // Update existing session
    session.lastSeen = nowIso;
    session.totalDurationSeconds += durationInc;
    if (!session.trafficSource || session.trafficSource === "Direct") {
      if (detectedSource !== "Direct") {
        session.trafficSource = detectedSource;
      }
    }
    if (scrollDepth > session.maxScrollDepth) {
      session.maxScrollDepth = scrollDepth;
    }
    if (payload.isNewPageView) {
      session.pageViewsCount += 1;
    }

    // Find page within session
    let pageItem = session.pagesVisited.find((p) => p.path === cleanPath);
    if (!pageItem) {
      pageItem = {
        path: cleanPath,
        pageTitle: payload.pageTitle || cleanPath,
        durationSeconds: durationInc,
        maxScrollDepth: scrollDepth,
        viewCount: 1,
        lastViewedAt: nowIso,
      };
      session.pagesVisited.push(pageItem);
    } else {
      pageItem.durationSeconds += durationInc;
      if (scrollDepth > pageItem.maxScrollDepth) {
        pageItem.maxScrollDepth = scrollDepth;
      }
      if (payload.isNewPageView) {
        pageItem.viewCount += 1;
      }
      pageItem.lastViewedAt = nowIso;
    }

    session.engagementScore = calculateEngagementScore(
      session.totalDurationSeconds,
      session.maxScrollDepth,
      session.pagesVisited.length
    );
  }

  await safeWriteJson(store);
}

function calculateEngagementScore(duration: number, maxScroll: number, pageCount: number): number {
  // Score 0 - 100 based on scroll depth (50%), time on site (30%), pages explored (20%)
  const scrollComponent = Math.min(50, (maxScroll / 100) * 50);
  const timeComponent = Math.min(30, (duration / 120) * 30); // 2 mins reaches max 30
  const pageComponent = Math.min(20, Math.max(1, pageCount) * 6.6); // 3 pages reaches max 20
  return Math.min(100, Math.round(scrollComponent + timeComponent + pageComponent));
}

export interface AnalyticsQueryOptions {
  range: "today" | "7d" | "30d" | "month" | "all" | "custom";
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export async function getAnalyticsSummary(options: AnalyticsQueryOptions) {
  const store = await getAnalyticsData();
  const now = new Date();
  const todayKey = now.toISOString().split("T")[0];

  // Determine start & end date for the filter
  let filterStart = todayKey;
  let filterEnd = todayKey;

  if (options.range === "today") {
    filterStart = todayKey;
    filterEnd = todayKey;
  } else if (options.range === "7d") {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    filterStart = d.toISOString().split("T")[0];
    filterEnd = todayKey;
  } else if (options.range === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    filterStart = d.toISOString().split("T")[0];
    filterEnd = todayKey;
  } else if (options.range === "month") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    filterStart = `${year}-${month}-01`;
    filterEnd = todayKey;
  } else if (options.range === "all") {
    filterStart = "2020-01-01";
    filterEnd = todayKey;
  } else if (options.range === "custom") {
    filterStart = options.startDate || todayKey;
    filterEnd = options.endDate || todayKey;
  }

  // Filter daily stats
  const timelineDates: string[] = [];
  const curr = new Date(filterStart);
  const end = new Date(filterEnd);
  // Cap at 90 days max for chart
  let loopCount = 0;
  while (curr <= end && loopCount < 90) {
    timelineDates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
    loopCount++;
  }

  const timeline = timelineDates.map((dateStr) => {
    const day = store.dailyStats[dateStr] || { visitors: [], pageViews: 0, totalDurationSeconds: 0 };
    return {
      date: dateStr,
      uniqueVisitors: day.visitors.length,
      pageViews: day.pageViews,
      avgTimeSeconds: day.visitors.length > 0 ? Math.round(day.totalDurationSeconds / day.visitors.length) : 0,
    };
  });

  // Filter sessions in range
  const sessionsInRange = store.sessions.filter((s) => {
    return s.date >= filterStart && s.date <= filterEnd;
  });

  // Calculate Summary metrics
  const todayStats = store.dailyStats[todayKey] || { visitors: [], pageViews: 0, totalDurationSeconds: 0 };
  const todayVisitors = new Set(todayStats.visitors || []).size;
  const todayPageViews = todayStats.pageViews || 0;

  // Last 7 days unique visitors (deduplicated across days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysKey = sevenDaysAgo.toISOString().split("T")[0];
  const weeklyVisitorSet = new Set<string>();
  Object.keys(store.dailyStats)
    .filter((d) => d >= sevenDaysKey && d <= todayKey)
    .forEach((d) => {
      (store.dailyStats[d]?.visitors || []).forEach((v) => weeklyVisitorSet.add(v));
    });
  const weeklyVisitors = weeklyVisitorSet.size;

  // Monthly unique visitors (deduplicated across the current month)
  const currentMonthPrefix = todayKey.substring(0, 7); // YYYY-MM
  const monthlyVisitorSet = new Set<string>();
  Object.keys(store.dailyStats)
    .filter((d) => d.startsWith(currentMonthPrefix))
    .forEach((d) => {
      (store.dailyStats[d]?.visitors || []).forEach((v) => monthlyVisitorSet.add(v));
    });
  const monthlyVisitors = monthlyVisitorSet.size;

  // All-time unique visitors (strictly deduplicated)
  const allTimeVisitorSet = new Set<string>([
    ...(store.allTimeVisitorIds || []),
    ...Object.values(store.dailyStats || {}).flatMap((d) => d.visitors || []),
  ]);
  const totalVisitorsAllTime = allTimeVisitorSet.size;
  const totalPageViewsInRange = timeline.reduce((acc, t) => acc + t.pageViews, 0);

  // Average Time Spent & Engagement in range
  const totalDuration = sessionsInRange.reduce((acc, s) => acc + s.totalDurationSeconds, 0);
  const avgTimeSpentSeconds = sessionsInRange.length > 0 ? Math.round(totalDuration / sessionsInRange.length) : 0;
  const avgEngagement =
    sessionsInRange.length > 0
      ? Math.round(sessionsInRange.reduce((acc, s) => acc + s.engagementScore, 0) / sessionsInRange.length)
      : 0;

  // Page-by-page progress & average scroll depth
  const keyPages = [
    { path: "/", title: "Home Page" },
    { path: "/about", title: "About Page" },
    { path: "/services", title: "Services Page" },
    { path: "/skills", title: "Skills Page" },
    { path: "/projects", title: "Projects Page" },
    { path: "/contact", title: "Contact Page" },
  ];

  const pageProgress: PageAggregateStat[] = keyPages.map((kp) => {
    // Calculate from sessions in range (or all-time fallback if no range visits yet)
    let totalScroll = 0;
    let scrollCount = 0;
    let totalViews = 0;
    let totalDuration = 0;

    sessionsInRange.forEach((sess) => {
      const match = sess.pagesVisited.find(
        (p) => p.path === kp.path || (kp.path === "/projects" && (p.path === "/project" || p.path === "/portfolio"))
      );
      if (match) {
        totalViews += match.viewCount;
        totalDuration += match.durationSeconds;
        if (match.maxScrollDepth > 0) {
          totalScroll += match.maxScrollDepth;
          scrollCount += 1;
        }
      }
    });

    // Fallback to cumulative page stats if sessions in range has 0
    if (totalViews === 0 && store.pageStats[kp.path]) {
      const p = store.pageStats[kp.path];
      totalViews = p.totalViews;
      totalDuration = p.totalDurationSeconds;
      totalScroll = p.totalScrollDepth;
      scrollCount = p.scrollCount;
    }

    const avgScroll = scrollCount > 0 ? Math.round(totalScroll / scrollCount) : 0;
    const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;

    return {
      path: kp.path,
      pageTitle: kp.title,
      totalViews,
      totalDurationSeconds: totalDuration,
      totalScrollDepth: totalScroll,
      scrollCount,
      avgScrollDepth: avgScroll,
      avgDurationSeconds: avgDuration,
    };
  });

  // Top Most Visited Pages
  const allPageMap: Record<string, { views: number; duration: number; scroll: number; scrollCount: number }> = {};
  sessionsInRange.forEach((sess) => {
    sess.pagesVisited.forEach((p) => {
      if (!allPageMap[p.path]) {
        allPageMap[p.path] = { views: 0, duration: 0, scroll: 0, scrollCount: 0 };
      }
      allPageMap[p.path].views += p.viewCount;
      allPageMap[p.path].duration += p.durationSeconds;
      if (p.maxScrollDepth > 0) {
        allPageMap[p.path].scroll += p.maxScrollDepth;
        allPageMap[p.path].scrollCount += 1;
      }
    });
  });

  // If no range data, populate with store.pageStats
  if (Object.keys(allPageMap).length === 0) {
    Object.keys(store.pageStats).forEach((p) => {
      const stat = store.pageStats[p];
      allPageMap[p] = {
        views: stat.totalViews,
        duration: stat.totalDurationSeconds,
        scroll: stat.totalScrollDepth,
        scrollCount: stat.scrollCount,
      };
    });
  }

  const mostVisitedPages = Object.keys(allPageMap)
    .map((path) => {
      const item = allPageMap[path];
      const avgScroll = item.scrollCount > 0 ? Math.round(item.scroll / item.scrollCount) : 0;
      const avgDur = item.views > 0 ? Math.round(item.duration / item.views) : 0;
      return {
        path,
        views: item.views,
        avgScrollDepth: avgScroll,
        avgDurationSeconds: avgDur,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // Real-time Live Visitors Active (last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const liveVisitorsSet = new Set<string>();
  store.sessions.forEach((s) => {
    if (s.lastSeen >= fiveMinutesAgo) {
      liveVisitorsSet.add(s.visitorId);
    }
  });
  const liveNow = liveVisitorsSet.size;

  // Device Breakdown (from sessions in range or all sessions)
  const targetSessions = sessionsInRange.length > 0 ? sessionsInRange : store.sessions;
  const deviceMap: Record<"Desktop" | "Mobile" | "Tablet", Set<string>> = {
    Desktop: new Set(),
    Mobile: new Set(),
    Tablet: new Set(),
  };

  targetSessions.forEach((s) => {
    const dev = s.deviceType === "Mobile" ? "Mobile" : s.deviceType === "Tablet" ? "Tablet" : "Desktop";
    deviceMap[dev].add(s.visitorId);
  });

  const totalDeviceVisitors = deviceMap.Desktop.size + deviceMap.Mobile.size + deviceMap.Tablet.size;
  const deviceBreakdown = [
    {
      device: "Desktop" as const,
      count: deviceMap.Desktop.size,
      percentage: totalDeviceVisitors > 0 ? Math.round((deviceMap.Desktop.size / totalDeviceVisitors) * 100) : 0,
    },
    {
      device: "Mobile" as const,
      count: deviceMap.Mobile.size,
      percentage: totalDeviceVisitors > 0 ? Math.round((deviceMap.Mobile.size / totalDeviceVisitors) * 100) : 0,
    },
    {
      device: "Tablet" as const,
      count: deviceMap.Tablet.size,
      percentage: totalDeviceVisitors > 0 ? Math.round((deviceMap.Tablet.size / totalDeviceVisitors) * 100) : 0,
    },
  ];

  // Traffic Source Breakdown
  const sourceMap: Record<string, Set<string>> = {
    "Direct": new Set(),
    "Google Search": new Set(),
    "Facebook": new Set(),
    "LinkedIn": new Set(),
    "Instagram": new Set(),
    "Other Websites": new Set(),
  };

  targetSessions.forEach((s) => {
    const src = s.trafficSource || categorizeTrafficSource(s.referrer);
    if (!sourceMap[src]) {
      sourceMap[src] = new Set();
    }
    sourceMap[src].add(s.visitorId);
  });

  const totalSourceVisitors = Object.values(sourceMap).reduce((acc, set) => acc + set.size, 0);
  const standardSources = ["Direct", "Google Search", "Facebook", "LinkedIn", "Instagram", "Other Websites"];
  const allFoundSources = Array.from(new Set([...standardSources, ...Object.keys(sourceMap)]));

  const trafficSourceBreakdown = allFoundSources.map((name) => {
    const count = sourceMap[name]?.size || 0;
    return {
      source: name,
      count,
      percentage: totalSourceVisitors > 0 ? Math.round((count / totalSourceVisitors) * 100) : 0,
    };
  });

  return {
    overview: {
      liveNow,
      todayVisitors,
      todayPageViews,
      totalVisitorsAllTime,
      totalPageViewsInRange,
      weeklyVisitors,
      monthlyVisitors,
      avgTimeSpentSeconds,
      avgEngagement,
    },
    deviceBreakdown,
    trafficSourceBreakdown,
    dateRange: {
      range: options.range,
      startDate: filterStart,
      endDate: filterEnd,
    },
    timeline,
    pageProgress,
    mostVisitedPages,
    recentSessions: sessionsInRange.slice(0, 25), // latest 25 sessions
  };
}

/**
 * Reset analytics data safely (called from Admin Dashboard only)
 * - "all": resets all visitor data to 0
 * - "today": removes today's test records while preserving historical analytics
 */
export async function resetAnalyticsData(mode: "all" | "today" = "all"): Promise<void> {
  const store = await getAnalyticsData();
  const todayKey = new Date().toISOString().split("T")[0];

  if (mode === "all") {
    const emptyStore: AnalyticsDataStore = {
      sessions: [],
      pageStats: {},
      dailyStats: {},
      allTimeVisitorIds: [],
    };
    await safeWriteJson(emptyStore);
    return;
  }

  if (mode === "today") {
    // Remove today's daily stats
    delete store.dailyStats[todayKey];

    // Remove today's sessions
    store.sessions = store.sessions.filter((s) => s.date !== todayKey);

    // Recalculate allTimeVisitorIds from remaining sessions and daily stats
    const remainingVisitors = new Set<string>();
    store.sessions.forEach((s) => remainingVisitors.add(s.visitorId));
    Object.values(store.dailyStats).forEach((day) => {
      day.visitors.forEach((vid) => remainingVisitors.add(vid));
    });
    store.allTimeVisitorIds = Array.from(remainingVisitors);

    // Recalculate pageStats from remaining sessions
    const newPageStats: Record<
      string,
      { totalViews: number; totalDurationSeconds: number; totalScrollDepth: number; scrollCount: number }
    > = {};

    store.sessions.forEach((s) => {
      s.pagesVisited.forEach((p) => {
        if (!newPageStats[p.path]) {
          newPageStats[p.path] = { totalViews: 0, totalDurationSeconds: 0, totalScrollDepth: 0, scrollCount: 0 };
        }
        newPageStats[p.path].totalViews += p.viewCount;
        newPageStats[p.path].totalDurationSeconds += p.durationSeconds;
        if (p.maxScrollDepth > 0) {
          newPageStats[p.path].totalScrollDepth += p.maxScrollDepth;
          newPageStats[p.path].scrollCount += 1;
        }
      });
    });
    store.pageStats = newPageStats;

    await safeWriteJson(store);
  }
}


