"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  color: string;
  glowColor: string;
  type: "dot" | "sparkle" | "aura";
  rotation: number;
  vRot: number;
  wobblePhase: number;
  wobbleSpeed: number;
}

export default function CustomCursor() {
  const pathname = usePathname();
  const [isEnabled, setIsEnabled] = useState(false);

  // Disable completely on Admin Dashboard & CMS routes
  const isAdminRoute = Boolean(pathname && pathname.startsWith("/admin"));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const butterflyRef = useRef<HTMLDivElement>(null);

  // Animation & Physics Refs (zero React re-render overhead for true 60-120fps)
  const mousePos = useRef({ x: -200, y: -200 });
  const bfPos = useRef({ x: -200, y: -200 });
  const bfRotate = useRef(0);
  const isMouseActive = useRef(false);
  const isFluttering = useRef(false);
  const isBurstActive = useRef(false);
  const burstTimer = useRef<NodeJS.Timeout | null>(null);
  const particles = useRef<TrailParticle[]>([]);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    if (isAdminRoute) return;

    // Accessibility check: Disable on prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Detect touch device
    isTouchDevice.current = window.matchMedia("(pointer: coarse)").matches;

    setIsEnabled(true);
  }, [isAdminRoute]);

  useEffect(() => {
    if (!isEnabled || isAdminRoute) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animId: number;
    let canvasNeedsClear = true;
    const startTime = performance.now();
    let lastTrailTime = 0;
    let lastIdleShimmerTime = 0;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Premium magical color palette: Purple, Pink, Cyan, and subtle Blue tones + Starlight White
    const particlePalette = [
      { base: "rgba(0, 240, 255, ", glow: "#00f0ff" },     // Neon Cyan
      { base: "rgba(168, 85, 247, ", glow: "#a855f7" },    // Vivid Purple
      { base: "rgba(236, 72, 153, ", glow: "#ec4899" },    // Neon Pink
      { base: "rgba(192, 132, 252, ", glow: "#c084fc" },   // Soft Lilac / Violet
      { base: "rgba(56, 189, 248, ", glow: "#38bdf8" },    // Sky Azure
      { base: "rgba(255, 255, 255, ", glow: "#ffffff" },    // Diamond Sparkle White
      { base: "rgba(244, 114, 182, ", glow: "#f472b6" },   // Rose Pink
    ];

    // Helper to spawn a single customized particle
    const spawnParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      type: "dot" | "sparkle" | "aura" = "dot",
      sizeMultiplier = 1.0,
      initialAlpha = 0.9
    ) => {
      if (particles.current.length >= 45) return;
      const paletteItem = particlePalette[Math.floor(Math.random() * particlePalette.length)];
      const baseSize =
        type === "aura"
          ? Math.random() * 2.5 + 2.5
          : type === "sparkle"
          ? Math.random() * 1.8 + 2.0
          : Math.random() * 1.6 + 0.9;

      const size = baseSize * sizeMultiplier;

      particles.current.push({
        x,
        y,
        vx,
        vy,
        size,
        maxSize: size,
        alpha: initialAlpha,
        decay: type === "aura" ? 0.016 : Math.random() * 0.016 + 0.014,
        color: paletteItem.base,
        glowColor: paletteItem.glow,
        type,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
      });
    };

    // Mobile ambient initialization: start near top right if no touch yet
    if (isTouchDevice.current && !isMouseActive.current) {
      bfPos.current.x = Math.min(window.innerWidth - 60, window.innerWidth * 0.85);
      bfPos.current.y = Math.min(180, window.innerHeight * 0.25);
      if (containerRef.current) containerRef.current.style.opacity = "1";
    }

    // High-performance RAF animation loop
    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;

      // Handle mobile ambient flight when idle
      if (isTouchDevice.current && !isMouseActive.current) {
        const cx = window.innerWidth * 0.82;
        const cy = 160;
        const ambientTargetX = cx + Math.cos(elapsed * 0.8) * 45;
        const ambientTargetY = cy + Math.sin(elapsed * 1.2) * 35;

        const deltaX = ambientTargetX - bfPos.current.x;
        const deltaY = ambientTargetY - bfPos.current.y;
        bfPos.current.x = lerp(bfPos.current.x, ambientTargetX, 0.06);
        bfPos.current.y = lerp(bfPos.current.y, ambientTargetY, 0.06);

        const targetAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
        let diff = (targetAngle - bfRotate.current) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        bfRotate.current = lerp(bfRotate.current, bfRotate.current + diff, 0.08);

        // Gentle wing flutter during ambient drift
        if (!isFluttering.current) {
          isFluttering.current = true;
          butterflyRef.current?.classList.add("bf-fluttering");
        }

        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${bfPos.current.x}px, ${bfPos.current.y}px, 0) rotate(${bfRotate.current}deg)`;
        }

        // Ambient sparkle trail on mobile
        if (now - lastTrailTime > 140) {
          lastTrailTime = now;
          spawnParticle(
            bfPos.current.x + (Math.random() - 0.5) * 8,
            bfPos.current.y + (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4 + 0.2,
            Math.random() > 0.6 ? "sparkle" : "dot",
            0.9,
            0.75
          );
        }
      } else if (isMouseActive.current) {
        // Butterfly gracefully trails cursor with smooth natural offset
        const targetX = mousePos.current.x + 18;
        const targetY = mousePos.current.y - 18;

        const deltaX = targetX - bfPos.current.x;
        const deltaY = targetY - bfPos.current.y;
        const speed = Math.hypot(deltaX, deltaY);

        // Smooth trailing interpolation
        bfPos.current.x = lerp(bfPos.current.x, targetX, 0.11);
        bfPos.current.y = lerp(bfPos.current.y, targetY, 0.11);

        // Natural flight orientation & rotation
        let targetAngle = 0;
        if (speed > 1.8) {
          const flightAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
          const banking = Math.max(-25, Math.min(25, deltaX * 0.5));
          targetAngle = lerp(flightAngle, banking, 0.5);
        } else {
          // When hovering: gently wobble and level out
          targetAngle = Math.sin(elapsed * 2.2) * 6;
        }

        // Shortest rotational path
        let diff = (targetAngle - bfRotate.current) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        bfRotate.current = lerp(bfRotate.current, bfRotate.current + diff, 0.12);

        // Multi-frequency floating harmonic bobbing
        const hoverY = Math.sin(elapsed * 3.2) * 2.8 + Math.cos(elapsed * 1.7) * 1.2;
        const hoverX = Math.cos(elapsed * 2.4) * 2.0;

        // Wing flutter speed control based on velocity
        if (!isBurstActive.current) {
          if (speed > 2.2 && !isFluttering.current) {
            isFluttering.current = true;
            butterflyRef.current?.classList.add("bf-fluttering");
          } else if (speed <= 2.2 && isFluttering.current) {
            isFluttering.current = false;
            butterflyRef.current?.classList.remove("bf-fluttering");
          }
        }

        // Apply 3D transform directly to container element
        if (containerRef.current) {
          const finalX = bfPos.current.x + hoverX;
          const finalY = bfPos.current.y + hoverY;
          containerRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) rotate(${bfRotate.current}deg)`;
        }

        const currX = bfPos.current.x + hoverX;
        const currY = bfPos.current.y + hoverY;

        // A. Dynamic Active Flight Trail: Spawns glowing dots, sparkles & soft aura dust
        if (speed > 2.0 && now - lastTrailTime > 42) {
          lastTrailTime = now;

          // Opposite velocity vector with soft natural dispersion
          const angle = (bfRotate.current - 90) * (Math.PI / 180);
          const backX = Math.cos(angle) * -12;
          const backY = Math.sin(angle) * -12;

          // 1. Primary trail particle
          const particleType = Math.random() < 0.35 ? "sparkle" : "dot";
          spawnParticle(
            currX + backX + (Math.random() - 0.5) * 8,
            currY + backY + (Math.random() - 0.5) * 8,
            -deltaX * 0.04 + (Math.random() - 0.5) * 0.7,
            -deltaY * 0.04 + (Math.random() - 0.5) * 0.7 + 0.3,
            particleType,
            1.0,
            0.9
          );

          // 2. Occasional soft aura cloud particle for ethereal depth
          if (Math.random() < 0.28) {
            spawnParticle(
              currX + backX,
              currY + backY,
              -deltaX * 0.02 + (Math.random() - 0.5) * 0.3,
              -deltaY * 0.02 + (Math.random() - 0.5) * 0.3 + 0.2,
              "aura",
              1.2,
              0.45
            );
          }
        }

        // B. Idle Ambient Shimmer: Spawns a delicate starlight sparkle when stationary
        if (speed <= 2.0 && now - lastIdleShimmerTime > 180) {
          lastIdleShimmerTime = now;
          spawnParticle(
            currX + (Math.random() - 0.5) * 14,
            currY + (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3 - 0.2,
            Math.random() < 0.5 ? "sparkle" : "dot",
            0.85,
            0.8
          );
        }
      }

      // Render glowing particles on canvas (clears only when particles are active or just finished)
      if (particles.current.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasNeedsClear = true;
      } else if (canvasNeedsClear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasNeedsClear = false;
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        // Natural movement with subtle sinusoidal wave drift
        p.wobblePhase += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobblePhase) * 0.3;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;
        p.size *= 0.985;

        // Clean removal when faded or shrunk
        if (p.alpha <= 0.01 || p.size <= 0.25) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();

        if (p.type === "sparkle") {
          // Four-pointed magical diamond star with high-performance double-pass vector glow
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          const s = p.size * 1.5;

          // Outer soft glow aura
          const glowS = s * 1.7;
          ctx.beginPath();
          ctx.moveTo(0, -glowS);
          ctx.quadraticCurveTo(0, 0, glowS, 0);
          ctx.quadraticCurveTo(0, 0, 0, glowS);
          ctx.quadraticCurveTo(0, 0, -glowS, 0);
          ctx.quadraticCurveTo(0, 0, 0, -glowS);
          ctx.closePath();
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha * 0.35)})`;
          ctx.fill();

          // Vibrant core diamond
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.closePath();
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
          ctx.fill();
        } else if (p.type === "aura") {
          // Soft ambient glowing dust orb (vector concentric glow)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha * 0.22)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha * 0.55)})`;
          ctx.fill();
        } else {
          // Standard crisp glowing orb
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha * 0.28)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    let isPaused = false;
    const safeRender = (now: number) => {
      if (isPaused) return;
      render(now);
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(safeRender);
      } else {
        cancelAnimationFrame(animId);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

    animId = requestAnimationFrame(safeRender);

    // Pointer move listener (handles both desktop mouse and mobile touch pointers)
    const onPointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isMouseActive.current) {
        isMouseActive.current = true;
        bfPos.current.x = e.clientX + 18;
        bfPos.current.y = e.clientY - 18;
      }

      if (containerRef.current) {
        containerRef.current.style.opacity = "1";
      }
    };

    const onMouseLeave = () => {
      if (!isTouchDevice.current && containerRef.current) {
        containerRef.current.style.opacity = "0";
      }
    };

    const onMouseEnter = () => {
      if (isMouseActive.current && containerRef.current) {
        containerRef.current.style.opacity = "1";
      }
    };

    // Click / Tap Interaction: Flutter burst + 12-particle magical radiating starburst
    const onClick = (e: MouseEvent) => {
      // 1. Trigger energetic flutter burst on wings
      isBurstActive.current = true;
      butterflyRef.current?.classList.add("bf-burst");
      if (burstTimer.current) clearTimeout(burstTimer.current);
      burstTimer.current = setTimeout(() => {
        isBurstActive.current = false;
        butterflyRef.current?.classList.remove("bf-burst");
      }, 420);

      // 2. Emit radiant multi-tone starburst
      const originX = bfPos.current.x;
      const originY = bfPos.current.y;
      for (let k = 0; k < 12; k++) {
        const rad = (Math.PI * 2 * k) / 12 + (Math.random() - 0.5) * 0.3;
        const spd = Math.random() * 2.2 + 1.2;
        spawnParticle(
          originX,
          originY,
          Math.cos(rad) * spd,
          Math.sin(rad) * spd,
          k % 3 === 0 ? "sparkle" : "dot",
          Math.random() * 0.5 + 1.0,
          0.95
        );
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (burstTimer.current) clearTimeout(burstTimer.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("click", onClick);
    };
  }, [isEnabled, isAdminRoute]);

  if (!isEnabled || isAdminRoute) return null;

  return (
    <>
      {/* 1. Subtle Stardust Particle Trail Canvas (Z-Index 40: Above page content, below modals & AI chat) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 select-none overflow-hidden"
      />

      {/* 2. Floating Cyber Butterfly Follower Container */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none"
      >
        <div
          ref={containerRef}
          className="fixed top-0 left-0 pointer-events-none opacity-0 transition-opacity duration-300 ease-out will-change-transform select-none bf-butterfly-wrapper"
          style={{ transform: "translate3d(-200px, -200px, 0)" }}
        >
          <div
            ref={butterflyRef}
            className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          >
            {/* Soft Multi-tone Neon Ambient Halo Behind Butterfly */}
            <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-[#00d2ff]/25 via-[#c084fc]/30 to-[#ec4899]/25 blur-md pointer-events-none opacity-85 animate-pulse" />

            {/* Glowing Cyber Butterfly Vector Graphic with Purple-Pink-Cyan Gradient & Neon Glow */}
            <svg
              width={30}
              height={26}
              viewBox="0 0 60 50"
              fill="none"
              className="pointer-events-none select-none bf-glow-effect transition-transform duration-300 sm:scale-100 scale-90"
            >
              <defs>
                {/* Left Wing Animated Gradient: Purple -> Pink -> Cyan -> Soft Blue */}
                <linearGradient id="bfWingGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95">
                    <animate
                      attributeName="stop-color"
                      values="#ffffff;#fdf4ff;#e0f2fe;#ffffff"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="22%" stopColor="#00f0ff" stopOpacity="0.92">
                    <animate
                      attributeName="stop-color"
                      values="#00f0ff;#ec4899;#a855f7;#00f0ff"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="55%" stopColor="#c084fc" stopOpacity="0.88">
                    <animate
                      attributeName="stop-color"
                      values="#c084fc;#00d2ff;#f472b6;#c084fc"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="80%" stopColor="#ec4899" stopOpacity="0.85">
                    <animate
                      attributeName="stop-color"
                      values="#ec4899;#818cf8;#00f0ff;#ec4899"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8">
                    <animate
                      attributeName="stop-color"
                      values="#38bdf8;#c084fc;#ec4899;#38bdf8"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>

                {/* Right Wing Animated Gradient */}
                <linearGradient id="bfWingGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95">
                    <animate
                      attributeName="stop-color"
                      values="#ffffff;#fdf4ff;#e0f2fe;#ffffff"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="22%" stopColor="#00f0ff" stopOpacity="0.92">
                    <animate
                      attributeName="stop-color"
                      values="#00f0ff;#ec4899;#a855f7;#00f0ff"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="55%" stopColor="#c084fc" stopOpacity="0.88">
                    <animate
                      attributeName="stop-color"
                      values="#c084fc;#00d2ff;#f472b6;#c084fc"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="80%" stopColor="#ec4899" stopOpacity="0.85">
                    <animate
                      attributeName="stop-color"
                      values="#ec4899;#818cf8;#00f0ff;#ec4899"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8">
                    <animate
                      attributeName="stop-color"
                      values="#38bdf8;#c084fc;#ec4899;#38bdf8"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>

                {/* Wing Rim Stroke Gradient */}
                <linearGradient id="bfStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>

                {/* Central Body Gradient */}
                <linearGradient id="bfBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#c084fc" />
                  <stop offset="70%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Left Wing Group */}
              <g className="bf-wing-left">
                <path
                  d="M30 26 C26 14, 12 4, 3 8 C-3 12, 1 24, 15 28 C8 32, 7 42, 16 43 C24 44, 28 35, 30 26 Z"
                  fill="url(#bfWingGradLeft)"
                  stroke="url(#bfStrokeGrad)"
                  strokeWidth="1.2"
                />
                {/* Luminescent Wing Spots & Veins */}
                <circle cx="12" cy="16" r="2.2" fill="#ffffff" opacity="0.9" />
                <circle cx="18" cy="34" r="1.5" fill="#fdf4ff" opacity="0.8" />
                <path d="M12 16 Q20 22 28 26" stroke="#ffffff" strokeWidth="0.8" opacity="0.75" />
                <path d="M18 34 Q22 32 28 27" stroke="#c084fc" strokeWidth="0.7" opacity="0.6" />
              </g>

              {/* Right Wing Group */}
              <g className="bf-wing-right">
                <path
                  d="M30 26 C34 14, 48 4, 57 8 C63 12, 59 24, 45 28 C52 32, 53 42, 44 43 C36 44, 32 35, 30 26 Z"
                  fill="url(#bfWingGradRight)"
                  stroke="url(#bfStrokeGrad)"
                  strokeWidth="1.2"
                />
                {/* Luminescent Wing Spots & Veins */}
                <circle cx="48" cy="16" r="2.2" fill="#ffffff" opacity="0.9" />
                <circle cx="42" cy="34" r="1.5" fill="#fdf4ff" opacity="0.8" />
                <path d="M48 16 Q40 22 32 26" stroke="#ffffff" strokeWidth="0.8" opacity="0.75" />
                <path d="M42 34 Q38 32 32 27" stroke="#c084fc" strokeWidth="0.7" opacity="0.6" />
              </g>

              {/* Slender Cyber Center Body & Antennae */}
              <ellipse cx="30" cy="27" rx="2" ry="8.5" fill="url(#bfBodyGrad)" />
              <circle cx="30" cy="17.5" r="2" fill="#ffffff" />
              <path d="M29 16 C26 11, 23 9, 21 10" stroke="#00f0ff" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M31 16 C34 11, 37 9, 39 10" stroke="#ec4899" strokeWidth="1.1" strokeLinecap="round" />
              {/* Glowing Antenna Tips */}
              <circle cx="21" cy="10" r="0.9" fill="#00f0ff" />
              <circle cx="39" cy="10" r="0.9" fill="#ec4899" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
