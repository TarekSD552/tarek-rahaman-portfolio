"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable smooth scroll on admin dashboard
    if (pathname?.startsWith("/admin")) return;

    // Only initialize smooth scroll on non-reduced-motion environments
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // On touch devices / mobile screens, native hardware-accelerated momentum scrolling is optimal
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isTouchDevice ? 0.9 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    let animId: number = 0;
    let isPaused = false;

    function raf(time: number) {
      if (isPaused) return;
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    // Pause RAF when document is hidden (background tab) to save CPU & battery
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(raf);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  return <>{children}</>;
}


