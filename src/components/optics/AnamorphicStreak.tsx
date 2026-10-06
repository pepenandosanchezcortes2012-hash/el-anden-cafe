import React from 'react';
import { interpolate, Easing } from 'remotion';

interface AnamorphicStreakProps {
  progress: number; // 0 to 1 across the screen
  intensity?: number; // 0 to 1 brightness multiplier
  colorMode?: 'sapphire' | 'gold' | 'dual';
  yPosition?: number; // in px or percentage
  beamWidth?: number; // width multiplier
}

/**
 * Anamorphic Streak Flare (Horizontal Optical Glare)
 * Emulates the signature cylindrical lens flare of Cooke / Panavision Anamorphic optics.
 * Features a razor-sharp optical streak, elliptical halo, and sapphire/molten-gold chromatic core.
 */
export const AnamorphicStreak: React.FC<AnamorphicStreakProps> = ({
  progress,
  intensity = 1,
  colorMode = 'dual',
  yPosition = 540,
  beamWidth = 1920,
}) => {
  if (intensity <= 0.001) return null;

  // Non-linear exponential sweep across screen
  const easedX = interpolate(progress, [0, 1], [-200, 2120], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse intensity with parabolic arc during the pass
  const arcIntensity = Math.sin(progress * Math.PI) * intensity;
  const coreScaleX = 1 + arcIntensity * 1.5;

  const primaryGradient =
    colorMode === 'sapphire'
      ? 'linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.2) 20%, rgba(30, 107, 255, 0.8) 45%, #FFFFFF 50%, rgba(30, 107, 255, 0.8) 55%, rgba(0, 229, 255, 0.2) 80%, transparent 100%)'
      : colorMode === 'gold'
      ? 'linear-gradient(90deg, transparent 0%, rgba(255, 167, 81, 0.2) 20%, rgba(255, 226, 89, 0.8) 45%, #FFFFFF 50%, rgba(255, 226, 89, 0.8) 55%, rgba(255, 167, 81, 0.2) 80%, transparent 100%)'
      : 'linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.25) 18%, rgba(30, 107, 255, 0.7) 40%, rgba(255, 226, 89, 0.95) 49%, #FFFFFF 50%, rgba(255, 226, 89, 0.95) 51%, rgba(0, 229, 255, 0.7) 60%, rgba(30, 107, 255, 0.25) 82%, transparent 100%)';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 50,
        mixBlendMode: 'screen',
        opacity: arcIntensity,
      }}
    >
      {/* 1. Main Ultra-Thin Razor Streak (Full Screen Span) */}
      <div
        style={{
          position: 'absolute',
          top: yPosition - 1.5,
          left: 0,
          width: '100%',
          height: 3,
          background: primaryGradient,
          transform: `scaleX(${coreScaleX})`,
          filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 226, 89, 0.8))',
          willChange: 'transform, opacity',
        }}
      />

      {/* 2. Secondary Wider Horizontal Dispersion Beam */}
      <div
        style={{
          position: 'absolute',
          top: yPosition - 6,
          left: 0,
          width: '100%',
          height: 12,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.08) 25%, rgba(30, 107, 255, 0.35) 48%, rgba(255, 226, 89, 0.45) 50%, rgba(30, 107, 255, 0.35) 52%, rgba(0, 229, 255, 0.08) 75%, transparent 100%)',
          filter: 'blur(3px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* 3. Concentrated Optical Flare Core Sweeping with easedX */}
      <div
        style={{
          position: 'absolute',
          top: yPosition - 60,
          left: easedX - 250,
          width: 500,
          height: 120,
          willChange: 'transform, opacity',
        }}
      >
        {/* Vertical anamorphic oval bloom */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 200,
            width: 100,
            height: 80,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, #FFFFFF 0%, rgba(255, 226, 89, 0.8) 35%, rgba(0, 229, 255, 0.6) 65%, transparent 100%)',
            filter: 'blur(10px)',
            transform: 'scaleY(1.6)',
          }}
        />

        {/* High-intensity center point */}
        <div
          style={{
            position: 'absolute',
            top: 55,
            left: 235,
            width: 30,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow:
              '0 0 20px 8px #FFFFFF, 0 0 45px 15px rgba(0, 229, 255, 0.9), 0 0 80px 25px rgba(255, 226, 89, 0.6)',
          }}
        />
      </div>

      {/* 4. Subtle Ghosting Reflection Rings */}
      <div
        style={{
          position: 'absolute',
          top: yPosition - 25,
          left: 1920 - easedX * 0.7 - 75,
          width: 150,
          height: 50,
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 229, 255, 0.3)',
          background: 'radial-gradient(ellipse, rgba(0, 229, 255, 0.12) 0%, transparent 80%)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
};
