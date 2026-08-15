import React, { useMemo } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { HeroSequenceSection } from './components/HeroSequenceSection';
import { DoomsdayVotingSection } from './components/DoomsdayVotingSection';
import { ScrollTicker } from './components/ScrollTicker';
import { FilmGrainOverlay } from './components/FilmGrainOverlay';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { useImagePreloader } from './hooks/useImagePreloader';
import { useLenis } from './hooks/useLenis';
import { getDynamicFrameUrls } from './utils/frameLoader';

export function App() {
  // Dynamically discover all frame image URLs in /public/frames/ without hardcoding count
  const frameUrls = useMemo(() => getDynamicFrameUrls(), []);
  const { images, loadedCount, isLoaded, progress, totalFrames } = useImagePreloader(frameUrls);

  // Lenis smooth scroll — lenisRef passed to canvas hook for synchronized scroll reading
  const lenisRef = useLenis();

  return (
    <div className="bg-[#000000] min-h-screen text-white relative font-sans selection:bg-[#00D6FF] selection:text-black">
      {/* 1. Atmospheric Detail Layer */}
      <FilmGrainOverlay />
      <CustomCursor />
      <ScrollProgressBar />

      {/* 2. Dynamic Preloader Overlay */}
      <LoadingScreen
        progress={progress}
        loadedCount={loadedCount}
        totalFrames={totalFrames}
        isLoaded={isLoaded}
      />

      {/* 3. Main Scroll Experience */}
      <main>
        {/* Pinned 300vh Image Sequence + Alternating Spring Question Overlays */}
        <HeroSequenceSection
          images={images}
          isLoaded={isLoaded}
          lenisRef={lenisRef}
        />

        {/* Kinetic section boundary ticker — Awwwards signature element */}
        <ScrollTicker />

        {/* Final Live Voting Section */}
        <DoomsdayVotingSection />
      </main>
    </div>
  );
}

export default App;
