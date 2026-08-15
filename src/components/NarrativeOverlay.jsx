import React from 'react';
import { NARRATIVE_BEATS } from '../config/narrativeSequenceConfig';
import { computeBeatStyles, remap, clamp } from '../utils/scrollInterpolation';

export function NarrativeOverlay({ scrollProgress, mousePos = { x: 0, y: 0 } }) {
  const p = scrollProgress;

  // ── Beat 1: Intro / Arrival ──
  const b1Config = NARRATIVE_BEATS[0];
  const b1Styles = computeBeatStyles(p, {
    ...b1Config,
    startY: 60,
    endY: -40,
    startBlur: 12,
    endBlur: 8,
    startSpacing: 8,
    endSpacing: 3,
  });

  // ── Beat 2: Character Intro — DOOM ──
  const b2Config = NARRATIVE_BEATS[1];
  const b2Styles = computeBeatStyles(p, {
    ...b2Config,
    startY: 50,
    endY: -30,
    startBlur: 15,
    endBlur: 8,
  });

  // ── Beat 3: Character Intro — THOR ──
  const b3Config = NARRATIVE_BEATS[2];
  const b3Styles = computeBeatStyles(p, {
    ...b3Config,
    startY: 40,
    endY: -30,
    startScale: 1.15,
    endScale: 0.95,
    startX: -50,
  });

  // ── Beat 4: VS Clash Section ──
  const b4Config = NARRATIVE_BEATS[3];
  const b4Styles = computeBeatStyles(p, {
    ...b4Config,
    startY: 20,
    endY: -20,
    startBlur: 8,
    endBlur: 6,
  });
  const b4ThorX = p < b4Config.fadeInEnd ? remap(p, b4Config.start, b4Config.fadeInEnd, -120, 0) : 0;
  const b4DoomX = p < b4Config.fadeInEnd ? remap(p, b4Config.start, b4Config.fadeInEnd, 120, 0) : 0;
  const b4VsScale = p < b4Config.fadeInEnd ? remap(p, b4Config.start, b4Config.fadeInEnd, 0, 1) : 1;

  // ── Beat 5: Cinematic Interlude — THE TIME HAS COME ──
  const b5Config = NARRATIVE_BEATS[4];
  const b5Styles = computeBeatStyles(p, {
    ...b5Config,
    startY: 50,
    endY: -30,
    startBlur: 12,
    endBlur: 8,
  });

  // ── Beat 6: Mid-Fight Giant Single Words ──
  const b6Config = NARRATIVE_BEATS[5];

  // ── Beat 7: Turning Point (Slow-Down Pacing Beat) ──
  const b7Config = NARRATIVE_BEATS[6];
  const b7Styles = computeBeatStyles(p, {
    ...b7Config,
    startY: 40,
    endY: -20,
    startBlur: 10,
    endBlur: 8,
  });

  // ── Beat 8: Final Transition / CTA ──
  const b8Config = NARRATIVE_BEATS[7];
  const b8Styles = computeBeatStyles(p, {
    ...b8Config,
    startY: 50,
    endY: 0,
    startBlur: 12,
    endBlur: 0,
  });

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none">
      
      {/* ── Beat 1: Intro / Arrival ── */}
      {b1Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-5xl px-4 py-8"
          style={{
            opacity: b1Styles.opacity,
            transform: `translate3d(${mousePos.x * 12}px, ${b1Styles.translateY + mousePos.y * 8}px, 0) scale(${b1Styles.scale})`,
            filter: `blur(${b1Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <span
            className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.35em] text-white/60 mb-4 font-semibold drop-shadow-md"
            style={{ letterSpacing: `${b1Styles.letterSpacing || 4}px` }}
          >
            {b1Config.eyebrow}
          </span>

          <h1 className="font-bebas text-[clamp(3.5rem,13vw,10rem)] text-white leading-[0.85] tracking-wider mb-6 drop-shadow-2xl">
            {b1Config.headline}
          </h1>

          <p
            className="font-space text-[13px] md:text-[16px] text-white/55 max-w-[440px] mx-auto leading-relaxed drop-shadow-md"
            style={{
              opacity: clamp(remap(p, b1Config.start + 0.015, b1Config.fadeInEnd, 0, 1), 0, 1) * 0.85,
              transform: `translateY(${remap(p, b1Config.start + 0.015, b1Config.fadeInEnd, 20, 0)}px)`,
            }}
          >
            {b1Config.paragraph}
          </p>
        </div>
      )}

      {/* ── Beat 2: Character Intro — DOOM ── */}
      {b2Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-6xl px-4 py-8"
          style={{
            opacity: b2Styles.opacity,
            transform: `translate3d(${mousePos.x * 12}px, ${b2Styles.translateY + mousePos.y * 8}px, 0)`,
            filter: `blur(${b2Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          {/* Neutral label: text-white/60 */}
          <span className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.35em] text-white/60 mb-3 font-semibold">
            CHARACTER FILE // 01
          </span>

          {/* DOOM Font Size Increased: clamp(70px, 14vw, 200px) */}
          <h2 className="font-bebas text-[clamp(70px,14vw,200px)] text-white leading-[0.82] tracking-widest my-3 drop-shadow-2xl">
            {b2Config.name}
          </h2>

          {/* Neutral subtitle: text-white/70 */}
          <span
            className="font-space text-xs md:text-base font-semibold uppercase tracking-[0.25em] text-white/70 mb-5 block"
            style={{
              opacity: clamp(remap(p, b2Config.start + 0.01, b2Config.fadeInEnd, 0, 1), 0, 1),
            }}
          >
            {b2Config.subtitle}
          </span>

          <p
            className="font-space text-[13px] md:text-[16px] text-white/55 max-w-[440px] mx-auto leading-relaxed"
            style={{
              opacity: clamp(remap(p, b2Config.start + 0.02, b2Config.fadeInEnd, 0, 1), 0, 1) * 0.85,
            }}
          >
            {b2Config.paragraph}
          </p>
        </div>
      )}

      {/* ── Beat 3: Character Intro — THOR ── */}
      {b3Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-6xl px-4 py-8"
          style={{
            opacity: b3Styles.opacity,
            transform: `translate3d(${mousePos.x * 12}px, ${b3Styles.translateY + mousePos.y * 8}px, 0) scale(${b3Styles.scale})`,
            filter: `blur(${b3Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.35em] text-white/60 mb-3 font-semibold">
            CHARACTER FILE // 02
          </span>

          {/* THOR Font Size Increased: clamp(70px, 14vw, 200px) */}
          <h2 className="font-bebas text-[clamp(70px,14vw,200px)] text-white leading-[0.82] tracking-widest my-3 drop-shadow-2xl">
            {b3Config.name}
          </h2>

          <span
            className="font-space text-xs md:text-base font-semibold uppercase tracking-[0.25em] text-white/70 mb-5 block"
            style={{
              transform: `translateX(${b3Styles.translateX}px)`,
              opacity: b3Styles.opacity,
            }}
          >
            {b3Config.subtitle}
          </span>

          <p className="font-space text-[13px] md:text-[16px] text-white/55 max-w-[440px] mx-auto leading-relaxed">
            {b3Config.paragraph}
          </p>
        </div>
      )}

      {/* ── Beat 4: VS Clash Section ── */}
      {b4Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-6xl px-4 py-8"
          style={{
            opacity: b4Styles.opacity,
            transform: `translate3d(0, ${b4Styles.translateY}px, 0)`,
            filter: `blur(${b4Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.4em] text-white/40 mb-8 block font-semibold">
            THE CLASH OF TITANS
          </span>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
            {/* Thor (Left) */}
            <div
              className="flex flex-col items-center md:items-end text-center md:text-right"
              style={{
                transform: `translateX(${b4ThorX}px)`,
                willChange: 'transform',
              }}
            >
              <h3 className="font-bebas text-[clamp(5rem,12vw,10.5rem)] text-white leading-none tracking-wider">
                {b4Config.leftName}
              </h3>
              <span className="font-space text-[12px] md:text-[14px] font-mono tracking-widest uppercase text-white/50">
                {b4Config.leftSub}
              </span>
            </div>

            {/* VS Badge (Center) */}
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center my-2 md:my-0 shadow-2xl shrink-0"
              style={{
                transform: `scale(${b4VsScale})`,
                willChange: 'transform',
              }}
            >
              <span className="font-bebas text-2xl md:text-3xl text-white tracking-widest">
                {b4Config.centerVs}
              </span>
            </div>

            {/* Doom (Right) */}
            <div
              className="flex flex-col items-center md:items-start text-center md:text-left"
              style={{
                transform: `translateX(${b4DoomX}px)`,
                willChange: 'transform',
              }}
            >
              <h3 className="font-bebas text-[clamp(5rem,12vw,10.5rem)] text-white leading-none tracking-wider">
                {b4Config.rightName}
              </h3>
              <span className="font-space text-[12px] md:text-[14px] font-mono tracking-widest uppercase text-white/50">
                {b4Config.rightSub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Beat 5: Cinematic Interlude — THE TIME HAS COME ── */}
      {b5Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-5xl px-4 py-8"
          style={{
            opacity: b5Styles.opacity,
            transform: `translate3d(0, ${b5Styles.translateY}px, 0)`,
            filter: `blur(${b5Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.35em] text-white/60 mb-4 font-semibold drop-shadow-md">
            {b5Config.eyebrow}
          </span>
          <h2 className="font-bebas text-[clamp(3.5rem,13vw,10rem)] text-white leading-[0.85] tracking-wider mb-6 drop-shadow-2xl">
            {b5Config.headline}
          </h2>
          <p className="font-space text-[13px] md:text-[16px] text-white/55 max-w-[440px] mx-auto leading-relaxed drop-shadow-md">
            {b5Config.paragraph}
          </p>
        </div>
      )}

      {/* ── Beat 6: Mid-Fight Giant Single Words ── */}
      {b6Config.words.map((item, idx) => {
        const wordStyles = computeBeatStyles(p, {
          ...item,
          startY: 0,
          endY: 0,
          startScale: 1.4,
          endScale: 0.9,
          startBlur: 15,
          endBlur: 10,
        });

        if (!wordStyles.isVisible) return null;

        return (
          <div
            key={idx}
            className="flex items-center justify-center text-center px-4"
            style={{
              opacity: wordStyles.opacity,
              transform: `scale(${wordStyles.scale})`,
              filter: `blur(${wordStyles.blur}px)`,
              willChange: 'transform, opacity, filter',
            }}
          >
            <h2 className="font-bebas text-[clamp(6.5rem,20vw,16rem)] text-white leading-none tracking-widest drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              {item.word}
            </h2>
          </div>
        );
      })}

      {/* ── Beat 7: Turning Point (Pacing Contrast / Slow-Down Beat) ── */}
      {b7Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-5xl px-4 py-8"
          style={{
            opacity: b7Styles.opacity,
            transform: `translate3d(0, ${b7Styles.translateY}px, 0)`,
            filter: `blur(${b7Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.4em] text-white/60 mb-4 font-semibold">
            THE MOMENT OF RECKONING
          </span>
          <h2 className="font-bebas text-[clamp(4.5rem,11.5vw,9.5rem)] text-white leading-[0.88] tracking-wider mb-5 drop-shadow-2xl">
            {b7Config.headline}
          </h2>
          <p className="font-space text-[13px] md:text-[16px] text-white/55 max-w-[440px] mx-auto leading-relaxed">
            {b7Config.paragraph}
          </p>
        </div>
      )}

      {/* ── Beat 8: Final Transition / CTA ── */}
      {b8Styles.isVisible && (
        <div
          className="flex flex-col items-center text-center max-w-5xl px-4 py-8"
          style={{
            opacity: b8Styles.opacity,
            transform: `translate3d(0, ${b8Styles.translateY}px, 0)`,
            filter: `blur(${b8Styles.blur}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <span className="font-space text-[13px] md:text-[16px] uppercase tracking-[0.35em] text-white/60 mb-4 font-semibold">
            {b8Config.eyebrow}
          </span>
          <h2 className="font-bebas text-[clamp(6rem,15vw,12rem)] text-white leading-[0.85] tracking-widest mb-6 drop-shadow-2xl">
            {b8Config.headline}
          </h2>
          <span className="font-space text-[12px] md:text-[14px] font-mono tracking-[0.2em] text-white/50 uppercase max-w-lg border-t border-b border-white/10 py-3">
            {b8Config.subtext}
          </span>
        </div>
      )}

    </div>
  );
}
