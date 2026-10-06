import React from 'react';
import { interpolate, Easing } from 'remotion';
import { THEME } from '../../constants/theme';
import { BrandEmblem } from '../svg/BrandEmblem';
import { VintageLantern } from '../svg/VintageLantern';
import { CalligraphyTagline } from '../svg/CalligraphyTagline';
import { DustParticleField } from '../particles/DustParticleField';

interface Act4ImmortalSealProps {
  frame: number;
  fps: number;
}

/**
 * ACT IV: EL SELLO INMORTAL Y CIERRE (Frames 720–900 | 12.0–15.0 s)
 * Master Brand Emblem suspended in center with magnetic breathing pulse ->
 * Living calligraphy "Una pausa antes de seguir" drawn via stroke-dashoffset ->
 * Peripheral vignette encroachment -> Final fade to absolute black at frame 885.
 */
export const Act4ImmortalSeal: React.FC<Act4ImmortalSealProps> = ({ frame }) => {
  const { act4 } = THEME.timings;

  // 1. Living Calligraphy Draw Progress (Frames 735–840)
  const calligraphyProgress = interpolate(frame, [act4.calligraphyStart, act4.calligraphyEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 2. Peripheral Vignette Encroachment (Frames 810–885)
  const vignetteEncroach = interpolate(frame, [act4.vignetteCloseStart, act4.fadeToBlackStart], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // 3. Final Absolute Blackout (Frames 885–900)
  const fadeToBlack = interpolate(frame, [act4.fadeToBlackStart, act4.end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle golden atmospheric breathing
  const ambientLanternGlow = 0.85 + Math.sin(frame * 0.08) * 0.08;

  // Emblem settles from Act III scale (1.0) into its final resting composition,
  // freeing headroom for the lantern inside the 2.39:1 scope frame.
  const settle = interpolate(frame, [act4.start, act4.start + 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const emblemScale = interpolate(settle, [0, 1], [1.0, 0.78]);
  const emblemOffsetY = interpolate(settle, [0, 1], [0, 20]);
  const lanternFadeIn = interpolate(frame, [act4.start + 10, act4.start + 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: THEME.colors.bgAbyssal,
        overflow: 'hidden',
      }}
    >
      {/* Background Radial Light Well */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 46%, rgba(13, 33, 25, 0.7) 0%, rgba(7, 17, 12, 0.9) 55%, #030705 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Vintage Lantern Accent Light Source */}
      <div style={{ position: 'absolute', inset: 0, opacity: lanternFadeIn, willChange: 'opacity' }}>
        <VintageLantern
          frame={frame}
          scale={0.32}
          igniteProgress={ambientLanternGlow}
          x={960}
          y={255}
        />
      </div>

      {/* Volumetric Floating Gold Dust Motes */}
      <DustParticleField
        frame={frame}
        count={55}
        intensity={1 - vignetteEncroach * 0.5}
        lanternOriginX={960}
        lanternOriginY={255}
      />

      {/* Suspended Brand Emblem with Magnetic Breathing Pulse */}
      <BrandEmblem
        frame={frame}
        scale={emblemScale}
        offsetY={emblemOffsetY}
        opacity={1}
        lensSealProgress={1.0}
        reliefProgress={1.0}
        magneticPulse={true}
      />

      {/* Living Calligraphy: "Una pausa antes de seguir" */}
      <CalligraphyTagline
        progress={calligraphyProgress}
        opacity={1 - fadeToBlack}
        y={845}
      />

      {/* Vignette Edge Encroachment Mask (Focuses light strictly on emblem & tagline) */}
      {vignetteEncroach > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, transparent ${interpolate(vignetteEncroach, [0, 1], [40, 18])}%, rgba(3, 7, 5, ${vignetteEncroach * 0.95}) 68%, #030705 92%)`,
            pointerEvents: 'none',
            zIndex: 60,
          }}
        />
      )}

      {/* Final Absolute Fade to Black at Frame 885 */}
      {fadeToBlack > 0.001 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#030705',
            opacity: fadeToBlack,
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
