/**
 * Mathematical & Procedural Animation Utilities
 * Provides deterministic pseudo-randomness, non-linear easing,
 * and particle physics equations for high-fidelity 60fps motion graphics.
 */

// Deterministic Linear Congruential Generator (LCG) for reproducible noise
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

export function seededRandomRange(seed: number, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Hermite smoothstep for organic ease-in-out transitions
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

// Cubic bezier curve approximation for bespoke easing: (0.16, 1, 0.3, 1)
export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutBack(x: number, overshoot = 1.70158): number {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * 2D Particle state generator with harmonic orbital drift
 */
export interface ParticleState {
  x: number;
  y: number;
  size: number;
  opacity: number;
  goldShade: string;
  glowSize: number;
}

export function calculateDustParticle(
  index: number,
  frame: number,
  canvasWidth: number,
  canvasHeight: number,
  beamAngleDeg = 35
): ParticleState {
  const baseSeed = index * 93.17;
  
  // Origin along volumetric beam trajectory
  const initialX = seededRandomRange(baseSeed + 1, canvasWidth * 0.25, canvasWidth * 0.85);
  const initialY = seededRandomRange(baseSeed + 2, canvasHeight * 0.15, canvasHeight * 0.85);

  // Harmonic drifting speeds
  const driftFreqX = 0.015 + seededRandom(baseSeed + 3) * 0.02;
  const driftFreqY = 0.012 + seededRandom(baseSeed + 4) * 0.025;
  const driftAmpX = 25 + seededRandom(baseSeed + 5) * 45;
  const driftAmpY = 35 + seededRandom(baseSeed + 6) * 55;

  // Thermal convection (rising motion)
  const riseSpeed = 0.4 + seededRandom(baseSeed + 7) * 0.8;
  const totalRise = (frame * riseSpeed) % (canvasHeight * 0.7);

  // Position with sinusoidal sway
  const swayX = Math.sin(frame * driftFreqX + index) * driftAmpX;
  const swayY = Math.cos(frame * driftFreqY + index * 1.5) * driftAmpY;

  const currentX = initialX + swayX + Math.sin(frame * 0.03 + index) * 10;
  let currentY = initialY + swayY - totalRise;
  if (currentY < canvasHeight * 0.05) {
    currentY += canvasHeight * 0.75;
  }

  // Particle size (fine dust vs luminous spark)
  const isSpark = index % 5 === 0;
  const size = isSpark
    ? seededRandomRange(baseSeed + 8, 2.5, 5.0)
    : seededRandomRange(baseSeed + 8, 1.0, 2.2);

  // Breathing opacity with flickering
  const flicker = Math.sin(frame * 0.2 + index * 3.7) * 0.2;
  const baseOpacity = isSpark ? 0.85 : 0.45;
  const opacity = clamp(baseOpacity + flicker, 0.1, 1.0);

  // Color selection
  const goldPalette = ['#FFE259', '#FFA751', '#FFF6BD', '#00FFA3', '#FFD166'];
  const goldShade = goldPalette[index % goldPalette.length];

  return {
    x: currentX,
    y: currentY,
    size,
    opacity,
    goldShade,
    glowSize: isSpark ? size * 4 : size * 2,
  };
}
