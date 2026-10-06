/**
 * EL ANDÉN CAFÉ: THE MIDNIGHT STEAM
 * Design System, Color Palette, and Timing Constants
 */

export const THEME = {
  colors: {
    // Abyssal & Night Foundation
    bgAbyssal: '#030705',
    bgMidnight: '#07110C',
    bgForestNight: '#0A140F',
    bgEmeraldDeep: '#0D2119',
    
    // Molten Gold & Warm Luminescence
    goldPure: '#FFE259',
    goldMolten: '#FFA751',
    goldAmber: '#FF9100',
    goldFiligree: '#E6C665',
    goldDark: '#8A6D24',

    // Neon Emerald & High Tech Warning Accent
    emeraldNeon: '#00FFA3',
    emeraldGlow: 'rgba(0, 255, 163, 0.45)',
    emeraldDim: '#10523C',

    // Anamorphic Sapphire Optics
    sapphireCore: '#00E5FF',
    sapphireFlare: '#1E6BFF',
    sapphireDeep: '#0A1E4A',

    // Neutrals
    whiteHot: '#FFFFFF',
    charcoalPlate: '#131A16',
    smokeWhite: 'rgba(240, 248, 245, 0.85)',
  },
  typography: {
    condensedGrotesque: '"Impact", "Oswald", "Arial Black", sans-serif',
    technicalMono: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
    calligraphyScript: '"Cinzel Decorative", "Playfair Display", "Georgia", serif',
  },
  dimensions: {
    width: 1920,
    height: 1080,
    aspectRatioScope: 2.39, // 1920x803 active frame
    letterboxHeight: 138,   // Top & bottom black bars: (1080 - 803) / 2 ~= 138px
  },
  timings: {
    fps: 60,
    totalFrames: 900, // 15.0s exactly
    
    // Act Boundaries
    act1: {
      start: 0,
      end: 210, // 3.5s
      sparkStart: 18,
      lanternIgnite: 45,
      flashEnd: 48,
      typographyIn: 80,
      disintegrateStart: 165,
    },
    act2: {
      start: 210,
      end: 480, // 8.0s (duration: 270 frames = 4.5s)
      dollyStart: 210,
      dollyEnd: 360,
      steamMorphStart: 270,
      hud1Start: 250,
      hud2Start: 295,
      hud3Start: 340,
    },
    act3: {
      start: 480,
      end: 720, // 12.0s (duration: 240 frames = 4.0s)
      implosionStart: 480,
      implosionHit: 535,
      sealFormStart: 530,
      reliefEngraveStart: 580,
      streakStart: 620,
      streakEnd: 700,
    },
    act4: {
      start: 720,
      end: 900, // 15.0s (duration: 180 frames = 3.0s)
      calligraphyStart: 735,
      calligraphyEnd: 840,
      vignetteCloseStart: 810,
      fadeToBlackStart: 885,
    },
  },
} as const;
