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
