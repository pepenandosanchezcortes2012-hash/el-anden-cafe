import React from 'react';
import { interpolate } from 'remotion';

interface VolumetricBeamProps {
  frame: number;
  originX?: number; // Lantern focal point X
  originY?: number; // Lantern focal point Y
  intensity?: number;
  angleDeg?: number;
}

/**
 * Volumetric Light Beam
 * Simulates high-density Rayleigh scattering from the locomotive & station lantern
 * cutting through midnight fog and steam.
 */
export const VolumetricBeam: React.FC<VolumetricBeamProps> = ({
  frame,
  originX = 960,
  originY = 320,
  intensity = 1.0,
  angleDeg = 75,
}) => {
  if (intensity <= 0.01) return null;

  // Filament micro-flicker and atmospheric breathing
  const flicker = 1 + Math.sin(frame * 0.35) * 0.04 + Math.cos(frame * 0.17) * 0.03;
  const activeAlpha = Math.min(1, intensity * flicker * 0.55);

  // Trajectory coordinates for conical projection
  const beamLength = 1100;
  const rad = (angleDeg * Math.PI) / 180;
  const endCenterX = originX + Math.cos(rad) * beamLength;
  const endCenterY = originY + Math.sin(rad) * beamLength;

  // Spread width at distance
  const baseSpread = 380;
  const p1X = originX - 18;
  const p1Y = originY - 10;
  const p2X = originX + 18;
  const p2Y = originY + 10;
  const p3X = endCenterX + baseSpread;
  const p3Y = endCenterY + 120;
  const p4X = endCenterX - baseSpread;
  const p4Y = endCenterY + 120;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        mixBlendMode: 'screen',
        opacity: activeAlpha,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          {/* Volumetric shaft linear gradient */}
          <linearGradient
            id="beam-gradient"
            x1={originX}
            y1={originY}
            x2={endCenterX}
            y2={endCenterY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.9" />
            <stop offset="12%" stopColor="#FFE259" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#FFA751" stopOpacity="0.32" />
            <stop offset="80%" stopColor="#0D3525" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#030705" stopOpacity="0" />
          </linearGradient>

          {/* Core high-intensity piercing ray */}
          <linearGradient
            id="beam-core-gradient"
            x1={originX}
            y1={originY}
            x2={endCenterX}
            y2={endCenterY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#FFE259" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#FFA751" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFA751" stopOpacity="0" />
          </linearGradient>

          <filter id="beam-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="30" />
          </filter>

          <filter id="core-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Diffuse volumetric cone */}
        <polygon
          points={`${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y} ${p4X},${p4Y}`}
          fill="url(#beam-gradient)"
          filter="url(#beam-blur)"
        />

        {/* Piercing central hot shaft */}
        <polygon
          points={`${originX - 6},${originY} ${originX + 6},${originY} ${endCenterX + 120},${endCenterY} ${endCenterX - 120},${endCenterY}`}
          fill="url(#beam-core-gradient)"
          filter="url(#core-blur)"
        />

        {/* Source flare coronal bloom */}
        <circle
          cx={originX}
          cy={originY}
          r="90"
          fill="url(#beam-core-gradient)"
          filter="url(#beam-blur)"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
