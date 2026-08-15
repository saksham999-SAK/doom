/**
 * Math utilities for continuous, scroll-driven progress interpolation.
 * Driven 100% by the single scrollProgress variable.
 */

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Maps a value from [inMin, inMax] to [outMin, outMax] with output clamping.
 */
export function remap(value, inMin, inMax, outMin, outMax) {
  if (inMin === inMax) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
}

/**
 * Computes a smooth envelope value (0 -> 1 -> 1 -> 0) across a sub-range.
 * @param {number} p Current global scrollProgress (0..1)
 * @param {number} start Range start
 * @param {number} fadeInEnd Point where opacity reaches 1
 * @param {number} fadeOutStart Point where opacity begins fading out
 * @param {number} end Range end
 */
export function getEnvelope(p, start, fadeInEnd, fadeOutStart, end) {
  if (p < start || p > end) return 0;
  if (p >= fadeInEnd && p <= fadeOutStart) return 1;
  if (p < fadeInEnd) {
    return remap(p, start, fadeInEnd, 0, 1);
  }
  return remap(p, fadeOutStart, end, 1, 0);
}

/**
 * Computes property values for standard entrance/exit beats:
 * - opacity: envelope 0 -> 1 -> 0
 * - translateY: enters from `startY`, resting at 0, exits to `endY`
 * - translateX: enters from `startX`, resting at 0, exits to `endX`
 * - blur: enters from `startBlur`, resting at 0, exits to `endBlur`
 * - scale: enters from `startScale`, resting at 1, exits to `endScale`
 * - letterSpacing: enters from `startSpacing`, resting at `endSpacing`
 */
export function computeBeatStyles(p, beatConfig) {
  const {
    start,
    fadeInEnd,
    fadeOutStart,
    end,
    startY = 40,
    endY = -30,
    startX = 0,
    endX = 0,
    startBlur = 10,
    endBlur = 8,
    startScale = 1.0,
    endScale = 1.0,
    startSpacing = null,
    endSpacing = null,
  } = beatConfig;

  // Active check
  if (p < start || p > end) {
    return { isVisible: false, opacity: 0 };
  }

  const opacity = getEnvelope(p, start, fadeInEnd, fadeOutStart, end);

  // Position interpolation
  let translateY = 0;
  if (p < fadeInEnd) {
    translateY = remap(p, start, fadeInEnd, startY, 0);
  } else if (p > fadeOutStart) {
    translateY = remap(p, fadeOutStart, end, 0, endY);
  }

  let translateX = 0;
  if (p < fadeInEnd) {
    translateX = remap(p, start, fadeInEnd, startX, 0);
  } else if (p > fadeOutStart) {
    translateX = remap(p, fadeOutStart, end, 0, endX);
  }

  // Blur interpolation
  let blur = 0;
  if (p < fadeInEnd) {
    blur = remap(p, start, fadeInEnd, startBlur, 0);
  } else if (p > fadeOutStart) {
    blur = remap(p, fadeOutStart, end, 0, endBlur);
  }

  // Scale interpolation
  let scale = 1.0;
  if (p < fadeInEnd) {
    scale = remap(p, start, fadeInEnd, startScale, 1.0);
  } else if (p > fadeOutStart) {
    scale = remap(p, fadeOutStart, end, 1.0, endScale);
  }

  // Letter spacing interpolation
  let letterSpacing = null;
  if (startSpacing !== null && endSpacing !== null) {
    letterSpacing = remap(p, start, fadeInEnd, startSpacing, endSpacing);
  }

  return {
    isVisible: opacity > 0.001,
    opacity,
    translateY,
    translateX,
    blur,
    scale,
    letterSpacing,
  };
}
