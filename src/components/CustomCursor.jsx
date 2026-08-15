import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Custom spring cursor with two-tier physics:
 *   Dot  → stiffness:600, damping:35  — near-instant "laser precise" feel
 *   Ring → stiffness:75,  damping:13  — lags 3-4 frames behind, "heavy glass" feel
 *
 * The visible gap between dot and ring is what sells the depth illusion.
 */
export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const ringVelRef = useRef({ vx: 0, vy: 0 });
  const rafRef = useRef(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsVisible(true);

    const STIFFNESS = 0.075; // lower = more lag (0.05–0.15 range)
    const DAMPING   = 0.72;  // higher = less bounce (0.6–0.85 range)

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY }); // dot is instant

      const target = e.target;
      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor="hover"]') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A';
      setIsHovered(Boolean(isInteractive));
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Physics loop for ring — spring toward dot position
    const physicsLoop = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const rx = ringRef.current.x;
      const ry = ringRef.current.y;

      // Spring force toward target
      const ax = (tx - rx) * STIFFNESS;
      const ay = (ty - ry) * STIFFNESS;

      ringVelRef.current.vx = (ringVelRef.current.vx + ax) * DAMPING;
      ringVelRef.current.vy = (ringVelRef.current.vy + ay) * DAMPING;

      ringRef.current.x = rx + ringVelRef.current.vx;
      ringRef.current.y = ry + ringVelRef.current.vy;

      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      rafRef.current = requestAnimationFrame(physicsLoop);
    };

    rafRef.current = requestAnimationFrame(physicsLoop);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  const dotSize   = isHovered ? 6  : 6;
  const ringSize  = isHovered ? 52 : 26;
  const ringAlpha = isHovered ? 0.15 : 0;
  const ringBorderAlpha = isHovered ? 0.9 : 0.45;

  return (
    <>
      {/* Precision dot — instant response */}
      <div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100]"
        style={{
          width:  dotSize,
          height: dotSize,
          background: '#00D6FF',
          transform: `translate(${pos.x - dotSize / 2}px, ${pos.y - dotSize / 2}px)`,
          willChange: 'transform',
        }}
      />

      {/* Ring — spring-lagged behind dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99]"
        animate={{
          width:           ringSize,
          height:          ringSize,
          backgroundColor: `rgba(0,214,255,${ringAlpha})`,
          borderColor:     `rgba(0,214,255,${ringBorderAlpha})`,
        }}
        transition={{
          // Ring expand/contract uses SNAPPY spring
          type: 'spring', stiffness: 320, damping: 22, mass: 0.5,
        }}
        style={{
          border: '1px solid',
          transform: `translate(${ringPos.x - ringSize / 2}px, ${ringPos.y - ringSize / 2}px)`,
          backdropFilter: 'blur(1px)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
