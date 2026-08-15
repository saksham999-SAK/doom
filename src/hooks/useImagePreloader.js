import { useState, useEffect } from 'react';

/**
 * Custom hook to dynamically preload all frame images into memory before rendering.
 * @param {Array<string>} frameUrls - Array of image URLs to preload
 */
export function useImagePreloader(frameUrls = []) {
  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const total = frameUrls.length;

    if (total === 0) {
      setIsLoaded(true);
      return;
    }

    const preloadedImages = new Array(total);
    let loadedCounter = 0;

    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;

      img.onload = () => {
        if (isCancelled) return;
        loadedCounter++;
        preloadedImages[index] = img;
        setLoadedCount(loadedCounter);
        if (loadedCounter === total) {
          setImages(preloadedImages);
          setIsLoaded(true);
          console.log(`[ImagePreloader] Dynamically preloaded all ${total} frames successfully!`);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        console.warn(`[ImagePreloader] Error loading frame ${index}: ${url}`);
        loadedCounter++;
        setLoadedCount(loadedCounter);
        if (loadedCounter === total) {
          setImages(preloadedImages);
          setIsLoaded(true);
        }
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [frameUrls]);

  const progress = frameUrls.length > 0 ? Math.round((loadedCount / frameUrls.length) * 100) : 0;

  return { images, loadedCount, isLoaded, progress, totalFrames: frameUrls.length };
}
