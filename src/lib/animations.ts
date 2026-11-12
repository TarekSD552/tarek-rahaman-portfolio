import { Variants, Transition } from "framer-motion";

// Cinematic deceleration curve used in luxury UI/motion design
export const cinematicEase = [0.16, 1, 0.3, 1] as const;

export const cinematicTransition: Transition = {
  duration: 0.55,
  ease: cinematicEase,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 95,
  damping: 18,
  mass: 0.8,
};

// =========================================================================
// 1. REUSABLE MOTION VARIANTS WITH REDUCED-MOTION RESPECT
// =========================================================================

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: cinematicEase },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: cinematicEase },
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: cinematicEase },
  },
};

// Strategic Directional Card Reveal Variants
export const cardFromLeftVariants: Variants = {
  hidden: { opacity: 0, x: -35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: cinematicEase },
  },
};

export const cardFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: cinematicEase },
  },
};

export const cardFromCenterVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: cinematicEase },
  },
};

// Staggered Container for Grids & Lists
export const staggerContainerVariants = (
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Section Title Sequential Elements Variants
export const titleBadgeVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: cinematicEase },
  },
};

export const titleHeadingVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.08, ease: cinematicEase },
  },
};

export const titleDescVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.16, ease: cinematicEase },
  },
};

export const titleBarVariants: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: "48px",
    opacity: 1,
    transition: { duration: 0.65, delay: 0.24, ease: cinematicEase },
  },
};

// =========================================================================
// 2. CARD & BUTTON INTERACTION PRESETS
// =========================================================================

export const cardHoverPreset = {
  y: -6,
  scale: 1.012,
  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
};

export const buttonHoverPreset = {
  y: -2,
  scale: 1.03,
  transition: { duration: 0.2, ease: "easeOut" },
};

export const buttonTapPreset = {
  scale: 0.97,
};

// Directional Card Variant Picker based on column index
export function getCardDirectionVariant(index: number, columns = 3): Variants {
  if (columns === 1) return cardFromCenterVariants;
  if (columns === 2) {
    return index % 2 === 0 ? cardFromLeftVariants : cardFromRightVariants;
  }
  if (columns === 4) {
    const col = index % 4;
    if (col === 0) return cardFromLeftVariants;
    if (col === 3) return cardFromRightVariants;
    return cardFromCenterVariants;
  }
  // Default 3 columns:
  const col = index % 3;
  if (col === 0) return cardFromLeftVariants;
  if (col === 2) return cardFromRightVariants;
  return cardFromCenterVariants;
}

