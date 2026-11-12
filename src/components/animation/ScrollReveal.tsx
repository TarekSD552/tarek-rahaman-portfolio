"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { cinematicEase } from "@/lib/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "center" | "fade";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportAmount?: number;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.55,
  distance = 30,
  className = "",
  viewportAmount = 0.15,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: -distance };
      case "right":
        return { opacity: 0, x: distance };
      case "center":
        return { opacity: 0, y: distance * 0.7, scale: 0.97 };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: cinematicEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  viewportAmount?: number;
}

export function StaggerGrid({
  children,
  stagger = 0.08,
  delay = 0.05,
  className = "",
  viewportAmount = 0.1,
}: StaggerGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface DirectionalCardProps {
  children: React.ReactNode;
  index: number;
  columns?: number;
  className?: string;
  delayOffset?: number;
}

export function DirectionalCard({
  children,
  index,
  columns = 3,
  className = "",
  delayOffset = 0,
}: DirectionalCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  const col = columns === 1 ? 0 : index % columns;
  const isLeft = columns > 1 && col === 0;
  const isRight = columns > 1 && col === columns - 1;

  let initial: Record<string, any> = { opacity: 0, y: 24, scale: 0.98 };
  if (isLeft) initial = { opacity: 0, x: -32 };
  if (isRight) initial = { opacity: 0, x: 32 };

  const delay = delayOffset + (index % columns) * 0.07;

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.52,
        delay,
        ease: cinematicEase,
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

