import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollCanvasSequence } from '../hooks/useScrollCanvasSequence';
import { NarrativeOverlay } from './NarrativeOverlay';
import { SPRING_LIGHT } from '../config/motionVariants';

export function HeroSequenceSection({ images, isLoaded, lenisRef }) {
  const wrapperRef = useRef(null);
  const canvasRef  = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollProgress } = useScrollCanvasSequence({
    wrapperRef,
    canvasRef,
    images,
    isLoaded,
    lerpFactor: 0.30,
    lenisRef,
  });

  // Mouse parallax
  useEffect(() => {
    const handle = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  // ── Dynamic vignette — darker at start/end, opens up mid-scroll ──
  const vignetteOpacity = scrollProgress < 0.08 || scrollProgress > 0.90
    ? 0.78
    : 0.28 + Math.sin(scrollProgress * Math.PI) * 0.1;

  // ── HUD bar values ──
  const hudFrame   = images.length > 0 ? Math.round(scrollProgress * (images.length - 1)) + 1 : 1;
  const hudTotal   = images.length;
  const hudPercent = Math.round(scrollProgress * 100);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full h-[400vh] bg-[#000000]"
      id="sequence"
    >
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center bg-[#000000] overflow-hidden">

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block relative z-10"
          style={{ willChange: 'contents' }}
        />

        {/* Dynamic breathing vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[15] transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0,0,0,0.96) 100%)',
            opacity: vignetteOpacity,
          }}
        />
        {/* Top/bottom linear vignette */}
        <div className="absolute inset-0 pointer-events-none z-[15] bg-gradient-to-t from-black/90 via-transparent to-black/70" />

        {/* Expanded 10-Beat Cinematic Narrative Overlay */}
        <NarrativeOverlay scrollProgress={scrollProgress} mousePos={mousePos} />

        {/* Cinematic HUD bar — neutral white progress line without blue/pink color gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}
        >
          <span className="text-[10px] font-space text-white/40 tracking-widest tabular-nums font-semibold">
            FRAME <span className="text-white/80">{String(hudFrame).padStart(3, '0')}</span> / {String(hudTotal).padStart(3, '0')}
          </span>
          <div className="flex-1 mx-6 h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/70 rounded-full"
              style={{ width: `${hudPercent}%`, transition: 'width 80ms linear' }}
            />
          </div>
          <span className="text-[10px] font-space text-white/40 tracking-widest uppercase font-semibold">
            CINEMATIC NARRATIVE
          </span>
        </div>

        {/* Scroll indicator — fades out after scroll starts */}
        {scrollProgress < 0.04 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING_LIGHT}
            className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center pointer-events-none"
          >
            <span className="text-[11px] font-space tracking-[0.2em] text-white/50 uppercase mb-2 font-medium">
              SCROLL TO REVEAL NARRATIVE
            </span>
            <div className="w-1 h-8 bg-white/20 rounded-full overflow-hidden">
              <div className="w-full h-1/2 bg-white/80 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Gradient wipe — dissolves canvas into voting section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black pointer-events-none z-30" />
    </section>
  );
}
