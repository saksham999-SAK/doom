import React, { useEffect, useRef, useState } from 'react';

/**
 * Smooth count-up number animation component.
 * Animates from old value to new value over ~600ms with easeOutQuart.
 */
export function CountUpNumber({ value, className = '', format = true }) {
  const [displayValue, setDisplayValue] = useState(value);
  const animRef = useRef(null);
  const startValueRef = useRef(value);

  useEffect(() => {
    const startValue = startValueRef.current;
    const endValue = value;
    if (startValue === endValue) return;

    const duration = 600;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutQuart(t);
      const current = Math.round(startValue + (endValue - startValue) * easedT);

      setDisplayValue(current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        startValueRef.current = endValue;
      }
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value]);

  const formatted = format ? displayValue.toLocaleString() : String(displayValue);
  return <span className={className}>{formatted}</span>;
}
