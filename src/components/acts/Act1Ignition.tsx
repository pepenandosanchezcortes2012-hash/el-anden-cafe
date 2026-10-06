import React, { useMemo } from 'react';
import { interpolate, spring, Easing } from 'remotion';
import { THEME } from '../../constants/theme';
import { VintageLantern } from '../svg/VintageLantern';
import { TunnelPerspective } from '../svg/TunnelPerspective';
import { VolumetricBeam } from '../optics/VolumetricBeam';
import { DustParticleField } from '../particles/DustParticleField';
import { seededRandomRange } from '../../utils/math';

interface Act1IgnitionProps {
  frame: number;
  fps: number;
}

/**
 * ACT I: LA IGNICIÓN EN LA PENUMBRA (Frames 0–210 | 0–3.5 s)
 * Total darkness -> 3-frame white flash exposure spike -> Vintage railroad lantern ignition ->
 * Geometric station arches revealed in 1-point perspective ->
 * Kinetic typography "EL MUNDO CORRE." with spring reveal ->
 * "CORRE" disintegrates into horizontal speed lines.
 */
export const Act1Ignition: React.FC<Act1IgnitionProps> = ({ frame, fps }) => {
  const { act1 } = THEME.timings;

  // 1. Initial Spark & 3-Frame White Flash (Frames 45–48)
  const isSparking = frame >= act1.sparkStart && frame < act1.lanternIgnite;
  const sparkIntensity = isSparking
    ? interpolate(frame, [act1.sparkStart, act1.lanternIgnite], [0.1, 0.9]) *
      (0.5 + Math.sin(frame * 2.2) * 0.5)
    : 0;

  let whiteFlashAlpha = 0;
  if (frame === 45) whiteFlashAlpha = 0.95;
  else if (frame === 46) whiteFlashAlpha = 1.0;
  else if (frame === 47) whiteFlashAlpha = 0.65;
  else if (frame === 48) whiteFlashAlpha = 0.25;

  // 2. Lantern Ignition State
  const lanternIgnite = interpolate(frame, [act1.lanternIgnite, act1.lanternIgnite + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 3. Perspective Tunnel Architectural Reveal
  const tunnelReveal = interpolate(frame, [act1.lanternIgnite + 5, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 4. Volumetric Light Beam & Particles
  const beamIntensity = interpolate(frame, [act1.lanternIgnite + 2, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Kinetic Typography "EL MUNDO CORRE."
  const sentence = 'EL MUNDO CORRE.';
  const chars = useMemo(() => sentence.split(''), [sentence]);

  // Speed lines data for "CORRE" disintegration (Frames 165–210)
  const isDisintegrating = frame >= act1.disintegrateStart;
  const disintegrateProgress = interpolate(frame, [act1.disintegrateStart, act1.end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Speed lines generated deterministically
  const speedLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 32; i++) {
      const seed = i * 47.19;
      const y = seededRandomRange(seed, 680, 830);
      const width = seededRandomRange(seed + 1, 140, 520);
      const speed = seededRandomRange(seed + 2, 1.4, 2.8);
      const color = i % 3 === 0 ? THEME.colors.emeraldNeon : THEME.colors.goldPure;
      lines.push({ y, width, speed, color, seed });
    }
    return lines;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: THEME.colors.bgAbyssal,
        perspective: '1200px',
        overflow: 'hidden',
      }}
    >
      {/* 3D Geometric Tunnel Perspective */}
      <TunnelPerspective revealProgress={tunnelReveal} vanishingX={960} vanishingY={460} />

      {/* Volumetric Rayleigh Scattering Cone */}
      <VolumetricBeam frame={frame} originX={960} originY={360} intensity={beamIntensity} />

      {/* Vintage Railroad Lantern at Center-Top Focal Point */}
      <VintageLantern
        frame={frame}
        scale={0.7}
        igniteProgress={lanternIgnite}
        x={960}
        y={350}
      />

      {/* Volumetric Golden Dust & Sparks */}
      <DustParticleField
        frame={frame}
        count={85}
        intensity={beamIntensity}
        lanternOriginX={960}
        lanternOriginY={360}
      />

      {/* Initial Ember Spark before ignition */}
      {isSparking && (
        <div
          style={{
            position: 'absolute',
            left: 960,
            top: 362,
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 16px 6px #FFE259, 0 0 35px 12px #FFA751',
            opacity: sparkIntensity,
          }}
        />
      )}

      {/* 3-Frame Exposure Spike (White Flash) */}
      {whiteFlashAlpha > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            opacity: whiteFlashAlpha,
            zIndex: 70,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Kinetic Typography: "EL MUNDO CORRE." */}
      <div
        style={{
          position: 'absolute',
          bottom: 220,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 35,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: THEME.typography.condensedGrotesque,
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: 14,
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          {chars.map((char, index) => {
            // Stagger character entry using spring with stiffness 260 and damping 10
            const charDelay = act1.typographyIn + index * 4;
            const springVal = spring({
              frame: frame - charDelay,
              fps,
              config: {
                damping: 10,
                stiffness: 260,
                mass: 0.6,
              },
            });

            const isCorrePart = index >= 9 && index <= 13; // "CORRE"
            const correDisplacementX =
              isCorrePart && isDisintegrating
                ? disintegrateProgress * (350 + (index - 9) * 120)
                : 0;
            const correAlpha =
              isCorrePart && isDisintegrating
                ? Math.max(0, 1 - disintegrateProgress * 1.5)
                : springVal;

            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  opacity: correAlpha,
                  transform: `translate3d(${correDisplacementX}px, ${(1 - springVal) * 60}px, 0) scale(${0.8 + springVal * 0.2})`,
                  clipPath: `inset(0 ${Math.max(0, (1 - springVal) * 100)}% 0 0)`,
                  color: isCorrePart ? THEME.colors.goldPure : '#FFFFFF',
                  textShadow: isCorrePart
                    ? '0 0 24px rgba(255, 226, 89, 0.7)'
                    : '0 0 16px rgba(255, 255, 255, 0.4)',
                  minWidth: char === ' ' ? '32px' : undefined,
                  willChange: 'transform, opacity',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Speed Lines Disintegration Layer for "CORRE" */}
      {isDisintegrating && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 40,
            opacity: interpolate(disintegrateProgress, [0, 0.2, 0.8, 1], [0, 1, 0.9, 0]),
          }}
        >
          {speedLines.map((line, idx) => {
            const currentX =
              interpolate(disintegrateProgress, [0, 1], [700, 2400]) * line.speed * 0.7 -
              line.width;
            return (
              <div
                key={`speedline-${idx}`}
                style={{
                  position: 'absolute',
                  top: line.y,
                  left: currentX,
                  width: line.width,
                  height: 2,
                  backgroundColor: line.color,
                  boxShadow: `0 0 12px ${line.color}`,
                  willChange: 'transform',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
