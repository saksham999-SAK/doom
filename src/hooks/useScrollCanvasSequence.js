import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for canvas drawing and scroll sequence mapping.
 * Reads scroll position from Lenis (if available) to stay in sync
 * with smooth scroll input. Falls back to getBoundingClientRect()
 * which is equivalent and always correct for sticky sections.
 *
 * @param {Object} config
 * @param {React.RefObject} config.wrapperRef  Ref to the tall scroll wrapper section
 * @param {React.RefObject} config.canvasRef   Ref to the sticky canvas element
 * @param {Array<HTMLImageElement>} config.images  Preloaded image array
 * @param {boolean} config.isLoaded  Preload complete flag
 * @param {number} [config.lerpFactor=0.30]  Frame lerp smoothing (0–1)
 * @param {React.RefObject} [config.lenisRef]  Optional Lenis instance ref
 */
export function useScrollCanvasSequence({
  wrapperRef,
  canvasRef,
  images,
  isLoaded,
  lerpFactor = 0.15,
  lenisRef,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);

  const totalFrames = images.length || 1;

  // Respect prefers-reduced-motion
  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mq.matches;
    const onChange = (e) => { prefersReducedMotionRef.current = e.matches; };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  /**
   * Cover-scale drawing: true object-fit:cover math, no black bars.
   */
  const drawFrameToCanvas = useCallback((image) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth  = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (
      canvas.width  !== Math.floor(displayWidth  * dpr) ||
      canvas.height !== Math.floor(displayHeight * dpr)
    ) {
      canvas.width  = Math.floor(displayWidth  * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const imgWidth  = image.naturalWidth  || image.width  || 2340;
    const imgHeight = image.naturalHeight || image.height || 1080;

    const scale      = Math.max(displayWidth / imgWidth, displayHeight / imgHeight);
    const drawWidth  = imgWidth  * scale;
    const drawHeight = imgHeight * scale;
    const offsetX    = (displayWidth  - drawWidth)  / 2;
    const offsetY    = (displayHeight - drawHeight) / 2;

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, [canvasRef]);

  /**
   * Compute scroll progress relative to the wrapper section.
   * Uses getBoundingClientRect() which is always accurate for sticky sections,
   * and is compatible with both native scroll and Lenis-smoothed scroll.
   */
  const computeProgress = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 0;

    const rect          = wrapper.getBoundingClientRect();
    const wrapperHeight = wrapper.offsetHeight - window.innerHeight;
    if (wrapperHeight <= 0) return 0;

    const raw = -rect.top / wrapperHeight;
    return Math.min(Math.max(raw, 0), 1);
  }, [wrapperRef]);

  // Sync on scroll + resize (passive listeners on Lenis scroll OR window scroll)
  useEffect(() => {
    if (!isLoaded || totalFrames === 0) return;

    const syncScroll = () => {
      const p = computeProgress();
      setScrollProgress(p);
      targetFrameRef.current = prefersReducedMotionRef.current
        ? Math.floor(p * (totalFrames - 1))
        : p * (totalFrames - 1);
    };

    // If Lenis is available, subscribe to its scroll event for sync
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.on('scroll', syncScroll);
    } else {
      window.addEventListener('scroll', syncScroll, { passive: true });
    }
    window.addEventListener('resize', syncScroll, { passive: true });
    syncScroll();

    return () => {
      if (lenis) {
        lenis.off('scroll', syncScroll);
      } else {
        window.removeEventListener('scroll', syncScroll);
      }
      window.removeEventListener('resize', syncScroll);
    };
  }, [isLoaded, totalFrames, computeProgress, lenisRef]);

  // Continuous rAF render loop — lerp current frame toward target
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const renderLoop = () => {
      const p = computeProgress();
      setScrollProgress(p);

      let target = p * (totalFrames - 1);
      if (prefersReducedMotionRef.current) {
        target = Math.floor(target);
        currentFrameRef.current = target;
      }

      targetFrameRef.current = target;
      let current = currentFrameRef.current;

      if (!prefersReducedMotionRef.current) {
        const diff = target - current;
        if (Math.abs(diff) < 0.001) {
          current = target;
        } else {
          const step       = diff * lerpFactor;
          const cappedStep = Math.sign(step) * Math.min(Math.abs(step), 25);
          current += cappedStep;
        }
      }

      currentFrameRef.current = current;

      const frameIndex = Math.min(Math.max(Math.floor(current), 0), totalFrames - 1);

      // Draw guard: only redraw when frame actually changes
      if (frameIndex !== lastDrawnFrameRef.current) {
        lastDrawnFrameRef.current = frameIndex;
        const img = images[frameIndex];
        if (img) drawFrameToCanvas(img);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isLoaded, images, totalFrames, lerpFactor, computeProgress, drawFrameToCanvas]);

  return {
    scrollProgress,
    currentFrameIndex: Math.floor(currentFrameRef.current),
    totalFrames,
  };
}
