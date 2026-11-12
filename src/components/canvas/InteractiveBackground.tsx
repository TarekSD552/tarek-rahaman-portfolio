"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // fallback to CSS gradient
    }

    const isMobile = window.innerWidth < 768;
    const isLowTier =
      (typeof navigator !== "undefined" &&
        Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) ||
      isMobile;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isLowTier ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25));
    mount.appendChild(renderer.domElement);

    // Particles creation: balanced count for maximum performance with identical visual density
    const particleCount = isLowTier ? 100 : 310;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Electric cyan, deep blue & subtle white tones
    const colorCyan = new THREE.Color("#00d2ff");
    const colorBlue = new THREE.Color("#0088ff");
    const colorWhite = new THREE.Color("#e2e8f0");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const randomChoice = Math.random();
      const c = randomChoice > 0.6 ? colorCyan : randomChoice > 0.3 ? colorBlue : colorWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking with lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX - width / 2) * 0.04;
      targetY = (event.clientY - height / 2) * 0.04;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Animation Loop with IntersectionObserver & visibility pause
    let clock = new THREE.Clock();
    let isPaused = false;
    let isOffscreen = false;

    // Use IntersectionObserver on hero section to pause WebGL when scrolled past top
    let observer: IntersectionObserver | null = null;
    const heroEl = document.getElementById("home");
    if (heroEl && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isOffscreen = !entry.isIntersecting;
        },
        { rootMargin: "400px 0px" }
      );
      observer.observe(heroEl);
    }

    const animate = () => {
      if (!isPaused && !isOffscreen) {
        const elapsedTime = clock.getElapsedTime();

        // Slow smooth rotation
        particles.rotation.y = elapsedTime * 0.04;
        particles.rotation.x = elapsedTime * 0.02;

        // Mouse parallax lerp
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        particles.position.x = mouseX;
        particles.position.y = -mouseY;

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility, { passive: true });

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer?.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70"
      aria-hidden="true"
    />
  );
}

