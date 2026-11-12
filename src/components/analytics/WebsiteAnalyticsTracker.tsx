"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Generate clean random alphanumeric token
function generateToken(prefix: string): string {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}

// Cookie helper
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Persistent, unbreakable Visitor ID (dual-synced between localStorage and cookie)
function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "tr_v_server";

  let vid: string | null = null;

  // 1. Check localStorage
  try {
    const local = localStorage.getItem("tr_visitor_id");
    if (local && local.startsWith("tr_v_")) {
      vid = local;
    }
  } catch {}

  // 2. Check Cookie fallback
  if (!vid) {
    const cookieVal = getCookie("tr_visitor_id");
    if (cookieVal && cookieVal.startsWith("tr_v_")) {
      vid = cookieVal;
      try {
        localStorage.setItem("tr_visitor_id", vid);
      } catch {}
    }
  }

  // 3. Generate once if genuinely new visitor
  if (!vid) {
    vid = generateToken("tr_v");
    try {
      localStorage.setItem("tr_visitor_id", vid);
    } catch {}
    setCookie("tr_visitor_id", vid);
  } else {
    // Keep cookie synchronized and fresh
    setCookie("tr_visitor_id", vid);
  }

  return vid;
}

// Session ID (persists across page reloads in the same tab, resets on tab close)
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "tr_s_server";

  let sid: string | null = null;
  try {
    const sessionVal = sessionStorage.getItem("tr_session_id");
    if (sessionVal && sessionVal.startsWith("tr_s_")) {
      sid = sessionVal;
    }
  } catch {}

  if (!sid) {
    sid = generateToken("tr_s");
    try {
      sessionStorage.setItem("tr_session_id", sid);
    } catch {}
  }

  return sid;
}

// Detect simple device category
function getDeviceType(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// Detect common browser
function getBrowser(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/")) return "Safari";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  return "Other";
}

// Detect common OS
function getOS(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("like Mac")) return "iOS";
  return "Other";
}

export default function WebsiteAnalyticsTracker() {
  const pathname = usePathname();

  // Stable session and visitor identifiers (guaranteed non-null immediately)
  const sessionRef = useRef<{
    visitorId: string;
    sessionId: string;
    deviceType: "Desktop" | "Mobile" | "Tablet";
    browser: string;
    os: string;
    referrer: string;
  } | null>(null);

  // Per-page tracking refs
  const currentPathRef = useRef<string>("");
  const activeSecondsAccumulatorRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const isPageVisibleRef = useRef<boolean>(true);

  // StrictMode & Double-Mount Deduplication
  const lastPageViewPingRef = useRef<{ path: string; timestamp: number }>({
    path: "",
    timestamp: 0,
  });

  // Synchronous initialization on first client execution
  if (!sessionRef.current && typeof window !== "undefined") {
    const vid = getOrCreateVisitorId();
    const sid = getOrCreateSessionId();
    sessionRef.current = {
      visitorId: vid,
      sessionId: sid,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      referrer: typeof document !== "undefined" && document.referrer ? document.referrer.slice(0, 200) : "",
    };
  }

  // Send payload to backend via sendBeacon or keepalive fetch
  const sendPing = (isNewPageView: boolean = false) => {
    if (!sessionRef.current) {
      const vid = getOrCreateVisitorId();
      const sid = getOrCreateSessionId();
      sessionRef.current = {
        visitorId: vid,
        sessionId: sid,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        referrer: typeof document !== "undefined" && document.referrer ? document.referrer.slice(0, 200) : "",
      };
    }

    const path = currentPathRef.current || pathname || "/";
    if (path.startsWith("/admin") || path.startsWith("/api")) return;

    // Calculate active duration safely
    const now = Date.now();
    let durationSeconds = 0;
    if (isPageVisibleRef.current) {
      const rawDelta = Math.round((now - lastActiveTimestampRef.current) / 1000);
      durationSeconds = Math.max(0, Math.min(60, rawDelta)); // cap at 60s per heartbeat
    }
    lastActiveTimestampRef.current = now;

    // StrictMode / Rapid-fire Deduplication for new page views
    let shouldCountAsNewPageView = isNewPageView;
    if (isNewPageView) {
      const last = lastPageViewPingRef.current;
      if (last.path === path && now - last.timestamp < 2000) {
        // Less than 2 seconds since last pageview on same path -> React StrictMode duplicate mount!
        shouldCountAsNewPageView = false;
      } else {
        lastPageViewPingRef.current = { path, timestamp: now };
      }
    }

    const payload = {
      sessionId: sessionRef.current.sessionId,
      visitorId: sessionRef.current.visitorId,
      path: path,
      pageTitle: typeof document !== "undefined" ? document.title : path,
      scrollDepth: maxScrollDepthRef.current,
      durationSeconds: durationSeconds,
      deviceType: sessionRef.current.deviceType,
      browser: sessionRef.current.browser,
      os: sessionRef.current.os,
      referrer: sessionRef.current.referrer,
      isNewPageView: shouldCountAsNewPageView,
    };

    try {
      const dataStr = JSON.stringify(payload);
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([dataStr], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataStr,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Fail silently without disrupting browsing
    }
  };

  // Route Transition Handler
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    // Flush previous page time if navigating within app
    if (currentPathRef.current && currentPathRef.current !== pathname) {
      sendPing(false);
    }

    // Set new page tracking
    currentPathRef.current = pathname;
    lastActiveTimestampRef.current = Date.now();
    activeSecondsAccumulatorRef.current = 0;
    maxScrollDepthRef.current = 0;
    isPageVisibleRef.current = typeof document !== "undefined" ? !document.hidden : true;

    // Send initial pageview event after slight delay so document.title is populated
    const timer = setTimeout(() => {
      // Calculate initial scroll depth (for short pages that fit on screen)
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const winHeight = window.innerHeight;
        const docHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          winHeight
        );
        const initialScroll = Math.min(100, Math.max(0, Math.round((winHeight / docHeight) * 100)));
        maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, initialScroll);
      }
      sendPing(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Throttled Scroll Progress Listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          try {
            const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const fullHeight = Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight,
              windowHeight
            );

            // Calculate percentage from 0 to 100
            const currentScrollPercentage = Math.min(
              100,
              Math.max(0, Math.round(((scrollTop + windowHeight) / fullHeight) * 100))
            );

            if (currentScrollPercentage > maxScrollDepthRef.current) {
              maxScrollDepthRef.current = currentScrollPercentage;
            }
          } catch {}
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Page Visibility API + Periodic Heartbeat + Unload Listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Periodic heartbeat every 25 seconds while user is active
    const heartbeatInterval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        sendPing(false);
      }
    }, 25000);

    // Visibility Change: pause counting when hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden / minimized: flush active time and mark hidden
        if (isPageVisibleRef.current) {
          sendPing(false);
          isPageVisibleRef.current = false;
        }
      } else {
        // Tab visible again: reset timestamp so idle background time is not counted
        isPageVisibleRef.current = true;
        lastActiveTimestampRef.current = Date.now();
      }
    };

    // Before Unload: page is closing
    const handleBeforeUnload = () => {
      sendPing(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // Headless component
}
