import React from 'react';
import { interpolate, Easing } from 'remotion';

interface ProceduralSteamProps {
  frame: number;
  originX?: number;
  originY?: number;
  opacity?: number;
  morphToEspresso?: number; // 0 = locomotive steam, 1 = espresso machine vapor
  filterId?: string;
}

/**
 * Procedural Steam & Vapor Emitter
 * Renders rising, expanding plumes of thermal steam.
 * Morphs seamlessly between industrial locomotive steam and high-pressure espresso extraction.
 */
export const ProceduralSteam: React.FC<ProceduralSteamProps> = ({
  frame,
  originX = 960,
  originY = 620,
  opacity = 1.0,
  morphToEspresso = 0,
  filterId = 'heat-distortion-filter',
}) => {
  if (opacity <= 0.01) return null;

  // 12 rising plumes computed with cyclic staggered phases
  const plumeCount = 12;
  const plumes = [];

  for (let i = 0; i < plumeCount; i++) {
    // Each plume has a cycle duration of 75 frames
    const cycleDuration = 75;
    const offsetFrame = (frame + i * (cycleDuration / plumeCount)) % cycleDuration;
    const progress = offsetFrame / cycleDuration; // 0 to 1

    // Height rises exponentially with expansion
    const riseDist = interpolate(progress, [0, 1], [0, 380], {
      easing: Easing.bezier(0.2, 0.8, 0.3, 1),
    });

    // Horizontal expansion and turbulence sway
    const spreadX = (i % 2 === 0 ? 1 : -1) * (progress * 140) + Math.sin(frame * 0.06 + i) * 35;
    const radiusX = interpolate(progress, [0, 1], [15, 120]);
    const radiusY = interpolate(progress, [0, 1], [10, 80]);

    // Opacity fades in rapidly, peaks around progress 0.3, then dissolves
    const plumeAlpha = interpolate(progress, [0, 0.25, 0.7, 1], [0, 0.55, 0.35, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    plumes.push({
      cx: originX + spreadX,
      cy: originY - riseDist,
      rx: radiusX,
      ry: radiusY,
      alpha: plumeAlpha * opacity,
    });
  }

  // Color tint shifts from cool industrial mist to warm espresso crema vapor
  const steamColor =
    morphToEspresso > 0.5
      ? 'rgba(255, 243, 218, ' // warm golden espresso vapor
      : 'rgba(235, 245, 240, '; // crisp nocturnal locomotive steam

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 18,
        filter: filterId ? `url(#${filterId})` : undefined,
        mixBlendMode: 'screen',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <filter id="steam-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
        </defs>

        <g filter="url(#steam-blur)">
          {plumes.map((p, idx) => (
            <ellipse
              key={idx}
              cx={p.cx}
              cy={p.cy}
              rx={p.rx}
              ry={p.ry}
              fill={`${steamColor}${p.alpha.toFixed(3)})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
