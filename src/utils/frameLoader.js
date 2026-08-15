/**
 * Dynamic Frame Loader Utility
 * Uses Vite's import.meta.glob to automatically discover, sort, and resolve
 * all frame images placed in /public/frames/ without hardcoding frame counts.
 */

// Dynamically match any frame images in /public/frames
const frameModules = import.meta.glob('/public/frames/*.{jpg,jpeg,png,webp}', {
  eager: false,
});

/**
 * Returns an array of resolved public browser URLs sorted numerically by frame number.
 */
export function getDynamicFrameUrls() {
  const rawPaths = Object.keys(frameModules);

  // Extract public URL path by stripping '/public'
  const urls = rawPaths.map((path) => path.replace('/public', ''));

  // Sort numerically based on digit sequences in filenames (e.g. frame-001 -> 1, frame-285 -> 285)
  urls.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });

  return urls;
}
