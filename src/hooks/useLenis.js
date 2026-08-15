import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Initializes Lenis smooth scroll and returns a ref to the instance.
 * Other hooks (useScrollCanvasSequence) read from lenisRef.current.scroll
 * so the canvas stays in sync with the smoothed scroll value.
 *
 * lerp: 0.08 — light smoothing that doesn't fight the canvas lerp already in place.
 * syncTouch: false — native scroll on mobile (better UX on touch devices).
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      smooth: true,
      syncTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Lenis requires its own rAF loop
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
