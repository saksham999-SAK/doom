import React, { useState, useEffect } from 'react';

/**
 * Vertical Page Scroll Progress Bar fixed on the right viewport edge
 */
export function ScrollProgressBar() {
  const [pageProgress, setPageProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      setPageProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[2px] z-[80] bg-white/10 pointer-events-none">
      <div
        className="w-full bg-gradient-to-b from-[#00D6FF] via-[#0050FF] to-[#FF2A5F] transition-all duration-150 rounded-b-full shadow-[0_0_8px_#00D6FF]"
        style={{ height: `${pageProgress * 100}%` }}
      />
    </div>
  );
}
