/**
 * Narrative Sequence Configuration
 * Centralized mapping of the 10 scroll-synced narrative beats.
 * All ranges are mapped to normalized global scrollProgress [0.0, 1.0].
 */

export const NARRATIVE_BEATS = [
  // ── Beat 1: Intro / Arrival ──
  {
    id: 'beat-1',
    start: 0.00,
    fadeInEnd: 0.03,
    fadeOutStart: 0.09,
    end: 0.12,
    eyebrow: 'THE DOOM EVENT',
    headline: 'DOOM HAS ARRIVED',
    paragraph: "Doom has always been more than a man in armor. Science, magic and absolute ambition have made him one of Earth's greatest threats.",
  },

  // ── Beat 2: Character Intro — DOOM ──
  {
    id: 'beat-2',
    start: 0.12,
    fadeInEnd: 0.15,
    fadeOutStart: 0.21,
    end: 0.24,
    name: 'DOOM',
    subtitle: 'MASTER OF SCIENCE & SORCERY',
    paragraph: 'Master of dark arcana and pinnacle engineering. A sovereign who bends reality itself to his supreme will.',
  },

  // ── Beat 3: Character Intro — THOR ──
  {
    id: 'beat-3',
    start: 0.24,
    fadeInEnd: 0.27,
    fadeOutStart: 0.33,
    end: 0.36,
    name: 'THOR',
    subtitle: 'GOD OF THUNDER',
    paragraph: 'Wielder of Mjolnir, heir of Asgard. The storm awakens to challenge absolute tyranny.',
  },

  // ── Beat 4: VS Clash Section ──
  {
    id: 'beat-4',
    start: 0.36,
    fadeInEnd: 0.39,
    fadeOutStart: 0.45,
    end: 0.48,
    leftName: 'THOR',
    leftSub: 'GOD OF THUNDER',
    centerVs: 'VS',
    rightName: 'DOOM',
    rightSub: 'MASTER OF SCIENCE & SORCERY',
  },

  // ── Beat 5: Cinematic Interlude — THE TIME HAS COME ──
  {
    id: 'beat-5',
    start: 0.48,
    fadeInEnd: 0.51,
    fadeOutStart: 0.57,
    end: 0.60,
    eyebrow: 'THE EVENT HORIZON',
    headline: 'THE TIME HAS COME',
    paragraph: 'Fate converges upon a singular moment. No gods or mortals can escape what is written.',
  },

  // ── Beat 6: Mid-Fight Giant Single Words ──
  {
    id: 'beat-6',
    start: 0.60,
    end: 0.74,
    words: [
      { word: 'THUNDER.', start: 0.600, fadeInEnd: 0.615, fadeOutStart: 0.625, end: 0.635 },
      { word: 'CHAOS.',   start: 0.635, fadeInEnd: 0.650, fadeOutStart: 0.660, end: 0.670 },
      { word: 'IMPACT.',  start: 0.670, fadeInEnd: 0.685, fadeOutStart: 0.695, end: 0.705 },
      { word: 'RAGE.',    start: 0.705, fadeInEnd: 0.720, fadeOutStart: 0.730, end: 0.740 },
    ],
  },

  // ── Beat 7: Turning Point (Pacing Contrast / Slow-Down Beat) ──
  {
    id: 'beat-7',
    start: 0.74,
    fadeInEnd: 0.77,
    fadeOutStart: 0.83,
    end: 0.86,
    headline: 'BUT DOOM WAS READY.',
    paragraph: 'He knew exactly where Thor would strike.',
  },

  // ── Beat 8: Final Transition / CTA ──
  {
    id: 'beat-8',
    start: 0.86,
    fadeInEnd: 0.89,
    fadeOutStart: 0.97,
    end: 1.00,
    eyebrow: 'THE DECISION HAS BEGUN',
    headline: 'WHO WINS?',
    subtext: 'THOR / GOD OF THUNDER  VS  DOOM / MASTER OF SCIENCE & SORCERY',
  },
];
