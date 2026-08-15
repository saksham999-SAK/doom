import React from 'react';

/**
 * Pinned SVG Film Grain Noise Overlay (Awwwards-tier atmospheric detail)
 */
export function FilmGrainOverlay() {
  return (
    <div className="fixed inset-0 z-[90] pointer-events-none opacity-4 overflow-hidden mix-blend-overlay">
      <svg className="w-full h-full">
        <filter id="film-grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-noise)" />
      </svg>
    </div>
  );
}
