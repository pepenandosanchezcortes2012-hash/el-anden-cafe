import React from 'react';
import { interpolate, spring, Easing } from 'remotion';
import { THEME } from '../../constants/theme';
import { BrandEmblem } from '../svg/BrandEmblem';
import { AnamorphicStreak } from '../optics/AnamorphicStreak';
import { DustParticleField } from '../particles/DustParticleField';

interface Act3CollapseProps {
  frame: number;
  fps: number;
}

/**
 * ACT III: EL COLAPSO Y LA SÍNTESIS (Frames 480–720 | 8.0–12.0 s)
 * Gravitational Implosion & Converging Layers -> Singularity Shockwave ->
 * Assembly of Emerald Optic Lens & Gold Gear Rim -> Real-time Inverted Relief Engraving ->
 * Sweeping Anamorphic Streak Flare across the Master Brand Seal.
 */
export const Act3Collapse: React.FC<Act3CollapseProps> = ({ frame, fps }) => {
  const { act3 } = THEME.timings;

  // 1. Gravitational Implosion (Frames 480–535)
  const isImploding = frame < act3.implosionHit;
  const implosionProgress = interpolate(frame, [act3.start, act3.implosionHit], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0), // Extreme gravitational pull acceleration
  });

  // Implosion inward suction variables
  const implosionScale = interpolate(implosionProgress, [0, 1], [1.15, 0.05]);
  const implosionRotation = implosionProgress * 180;
  const implosionAlpha = interpolate(implosionProgress, [0, 0.85, 1], [1, 0.9, 0]);

  // 2. Singularity Shockwave Burst (Frames 535–580)
  const postHitFrame = Math.max(0, frame - act3.implosionHit);
  const shockwaveProgress = interpolate(postHitFrame, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const shockwaveRadius = interpolate(shockwaveProgress, [0, 1], [0, 650]);
  const shockwaveAlpha = interpolate(shockwaveProgress, [0, 0.15, 1], [0, 0.95, 0]);

  // 3. Imagotype Assembly (Lens seal & Gold rim lock) (Frames 530–620)
  const lensSealProgress = interpolate(frame, [act3.sealFormStart, 620], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Emblem Entry Spring
  const emblemSpring = spring({
    frame: frame - act3.sealFormStart,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 1.1,
    },
  });

  // 4. Real-time Inverted Relief Engraving (Frames 580–660)
  const reliefProgress = interpolate(frame, [act3.reliefEngraveStart, 660], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // 5. Anamorphic Horizontal Streak Flare Sweep (Frames 620–700)
  const isStreaking = frame >= act3.streakStart && frame <= act3.streakEnd;
  const streakProgress = interpolate(frame, [act3.streakStart, act3.streakEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
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
      {/* Imploding Structural Convergent Lines */}
      {isImploding && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${implosionScale}) rotate(${implosionRotation}deg)`,
            opacity: implosionAlpha,
            willChange: 'transform, opacity',
          }}
        >
          <svg width="1200" height="1200" viewBox="-600 -600 1200 1200">
            {/* Concentric collapsing rings */}
            {[100, 200, 320, 460, 580].map((r, idx) => (
              <circle
                key={`ring-${idx}`}
                cx="0"
                cy="0"
                r={r}
                stroke={idx % 2 === 0 ? THEME.colors.goldPure : THEME.colors.emeraldNeon}
                strokeWidth={2}
                strokeDasharray="12 12"
                opacity={0.7}
              />
            ))}
            {/* Convergent radial spokes */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, idx) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={`spoke-${idx}`}
                  x1={Math.cos(rad) * 60}
                  y1={Math.sin(rad) * 60}
                  x2={Math.cos(rad) * 580}
                  y2={Math.sin(rad) * 580}
                  stroke={THEME.colors.goldPure}
                  strokeWidth="2.5"
                  opacity="0.8"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Post-Implosion Singularity Shockwave */}
      {shockwaveAlpha > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 28,
          }}
        >
          <svg width="1400" height="1400" viewBox="-700 -700 1400 1400">
            {/* Primary Gold Shockwave Ring */}
            <circle
              cx="0"
              cy="0"
              r={shockwaveRadius}
              stroke="url(#shock-gold)"
              strokeWidth={Math.max(1, 8 * (1 - shockwaveProgress))}
              fill="none"
              opacity={shockwaveAlpha}
            />
            {/* Secondary Emerald Shockwave Ring */}
            <circle
              cx="0"
              cy="0"
              r={Math.max(0, shockwaveRadius - 40)}
              stroke={THEME.colors.emeraldNeon}
              strokeWidth="2"
              fill="none"
              opacity={shockwaveAlpha * 0.7}
            />
            <defs>
              <radialGradient id="shock-gold" cx="0" cy="0" r="100%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#FFE259" />
                <stop offset="100%" stopColor="#FFA751" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Master Imagotype Assembly & Real-Time Relief */}
      {frame >= act3.sealFormStart && (
        <BrandEmblem
          frame={frame}
          scale={emblemSpring}
          opacity={Math.min(1, emblemSpring * 1.2)}
          lensSealProgress={lensSealProgress}
          reliefProgress={reliefProgress}
        />
      )}

      {/* Anamorphic Horizontal Streak Flare Crossing the Seal */}
      {isStreaking && (
        <AnamorphicStreak
          progress={streakProgress}
          intensity={1.25}
          colorMode="dual"
          yPosition={540}
        />
      )}

      {/* Golden Sparks Burst during Seal Forging */}
      <DustParticleField
        frame={frame}
        count={65}
        intensity={interpolate(frame, [act3.sealFormStart, 600, 720], [0.3, 1, 0.6])}
      />
    </div>
  );
};
