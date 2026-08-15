import React from 'react';

/**
 * Infinite horizontal scrolling ticker between sections.
 * The classic Awwwards-tier kinetic boundary element.
 */
const TICKER_ITEMS = [
  'DOOMSDAY',
  'WHO WINS?',
  'DOOM WINS',
  'AVENGERS WIN',
  'CAST YOUR VOTE',
  'MULTIVERSAL CLASH',
  'SECRET WARS',
];

export function ScrollTicker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative w-full overflow-hidden bg-[#000000] py-5 border-t border-b border-white/10">
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 18s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="ticker-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-white/30 px-6 whitespace-nowrap">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#00D6FF] opacity-40 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
