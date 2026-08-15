/**
 * Framer Motion spring presets — 4 weight tiers.
 * Heavier elements have lower stiffness and higher mass (feel like they have weight).
 * Never use the same config for everything.
 */

// ─────────────────────────────────────────────
// HEAVY — Large headlines, hero text
// Slow, weighty settle with slight overshoot
// ─────────────────────────────────────────────
export const SPRING_HEAVY = {
  type: 'spring',
  stiffness: 90,
  damping: 20,
  mass: 1.2,
};

// ─────────────────────────────────────────────
// MEDIUM — Cards, containers, panels
// Snappier, confident settle
// ─────────────────────────────────────────────
export const SPRING_MEDIUM = {
  type: 'spring',
  stiffness: 150,
  damping: 18,
  mass: 0.9,
};

// ─────────────────────────────────────────────
// LIGHT — Labels, eyebrows, subtexts, buttons
// Quick with natural tail-off
// ─────────────────────────────────────────────
export const SPRING_LIGHT = {
  type: 'spring',
  stiffness: 280,
  damping: 22,
  mass: 0.6,
};

// ─────────────────────────────────────────────
// SNAPPY — Small UI: chips, badges, dots, icons
// Crisp, near-instant with tight overshoot
// ─────────────────────────────────────────────
export const SPRING_SNAPPY = {
  type: 'spring',
  stiffness: 380,
  damping: 24,
  mass: 0.5,
};

// Legacy alias — kept so any file still importing SPRING_PHYSICS doesn't break
export const SPRING_PHYSICS = SPRING_MEDIUM;

// ─────────────────────────────────────────────
// Word-stagger container — headline reveals
// ─────────────────────────────────────────────
export const WORD_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.05,
    },
  },
};

// Individual word: clip-path slide-up with easeOutExpo
export const WORD_CHILD_VARIANTS = {
  hidden: {
    opacity: 0,
    y: '90%',
    rotateX: -25,
  },
  visible: {
    opacity: 1,
    y: '0%',
    rotateX: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ─────────────────────────────────────────────
// Section stagger container — for grouped block reveals
// (eyebrow → headline → subtext → cards)
// ─────────────────────────────────────────────
export const SECTION_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

export const SECTION_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_LIGHT,
  },
};

// ─────────────────────────────────────────────
// Question card entrance/exit direction profiles
// ─────────────────────────────────────────────
export const QUESTION_CONFIGS = [
  {
    id: '01',
    question: 'Will Thor kill Doom?',
    start: 0.0,
    end: 0.2,
    direction: 'left',
    rotateZ: -2.5,
    alignClass: 'items-center text-center max-w-4xl',
  },
  {
    id: '02',
    question: 'Does Iron Man return?',
    start: 0.2,
    end: 0.4,
    direction: 'right',
    rotateZ: 2.5,
    alignClass: 'items-center text-center max-w-4xl',
  },
  {
    id: '03',
    question: 'Is Captain America back in the fight?',
    start: 0.4,
    end: 0.6,
    direction: 'up',
    scale: 0.95,
    alignClass: 'items-center text-center max-w-5xl',
  },
  {
    id: '04',
    question: 'Can the Fantastic Four alter destiny?',
    start: 0.6,
    end: 0.8,
    direction: 'left',
    rotateZ: -2.0,
    alignClass: 'items-center text-center max-w-4xl',
  },
  {
    id: '05',
    question: 'Who will survive the Secret Wars?',
    start: 0.8,
    end: 1.0,
    direction: 'right',
    rotateZ: 2.0,
    alignClass: 'items-center text-center max-w-5xl',
  },
];
