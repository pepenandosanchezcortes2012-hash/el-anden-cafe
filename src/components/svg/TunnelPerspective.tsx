import React from 'react';
import { THEME } from '../../constants/theme';

interface TunnelPerspectiveProps {
  revealProgress: number; // 0 (hidden) to 1 (fully revealed)
  depthZoom?: number;     // camera dolly zoom offset (0 to 1)
  vanishingX?: number;
  vanishingY?: number;
}

/**
 * Geometric Station Tunnel Arches in 1-Point Perspective
 * Renders Victorian ironwork terminal ribs, structural cross-trusses,
 * and receding steel railway tracks with logarithmic sleeper spacing.
 */
export const TunnelPerspective: React.FC<TunnelPerspectiveProps> = ({
  revealProgress,
  depthZoom = 0,
  vanishingX = 960,
  vanishingY = 520,
}) => {
  if (revealProgress <= 0.001) return null;

  // Number of receding arch portals
  const archCount = 9;
  const arches = [];

  for (let i = 0; i < archCount; i++) {
    // Relative depth from near (0) to far (1)
    const baseZ = (i / (archCount - 1));
    // Apply camera dolly zoom
    const animatedZ = Math.max(0.04, baseZ - depthZoom * 0.45);
    const scale = 1 / (1 + animatedZ * 4.2);

    // Arch dimensions at this depth
    const archWidth = 1900 * scale;
    const archHeight = 880 * scale;
    const pillarHeight = 440 * scale;
    const archTopY = vanishingY - archHeight;
    const groundY = vanishingY + pillarHeight;
    const leftX = vanishingX - archWidth / 2;
    const rightX = vanishingX + archWidth / 2;

    // Dimming with atmospheric depth
    const archAlpha = (1 - animatedZ * 0.75) * revealProgress;
    const strokeW = Math.max(0.8, 3.2 * scale);

    arches.push({
      leftX,
      rightX,
      archTopY,
      groundY,
      pillarHeight,
      archWidth,
      archHeight,
      archAlpha,
      strokeW,
      scale,
      index: i,
    });
  }

  // Converging railroad tracks & sleepers
  const sleeperCount = 28;
  const sleepers = [];
  const startY = 1080;
  const endY = vanishingY + 30;

  for (let s = 0; s < sleeperCount; s++) {
    const t = Math.pow(s / (sleeperCount - 1), 2.2); // exponential perspective spacing
    const y = startY - (startY - endY) * t;
    const currentScale = 1 - t * 0.94;
    const halfWidth = 320 * currentScale;
    const sleeperAlpha = (1 - t * 0.6) * revealProgress;

    sleepers.push({
      x1: vanishingX - halfWidth,
      x2: vanishingX + halfWidth,
      y,
      strokeWidth: Math.max(1, 4 * currentScale),
      alpha: sleeperAlpha,
    });
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        opacity: revealProgress,
        willChange: 'transform, opacity',
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
          <linearGradient id="rail-gold" x1="0" y1="1080" x2="0" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE259" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFA751" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="arch-glow" x1="960" y1="0" x2="960" y2="1080" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE259" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#00FFA3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0A140F" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. Receding Sleepers (Durmientes de Ferrocarril) */}
        {sleepers.map((s, idx) => (
          <line
            key={`sleeper-${idx}`}
            x1={s.x1}
            y1={s.y}
            x2={s.x2}
            y2={s.y}
            stroke="#FFE259"
            strokeWidth={s.strokeWidth}
            opacity={s.alpha * 0.35}
          />
        ))}

        {/* 2. Converging Steel Rails */}
        {/* Left main rail */}
        <line
          x1={vanishingX - 280}
          y1={1080}
          x2={vanishingX - 12}
          y2={vanishingY + 28}
          stroke="url(#rail-gold)"
          strokeWidth="3"
        />
        {/* Left inner guard rail */}
        <line
          x1={vanishingX - 250}
          y1={1080}
          x2={vanishingX - 10}
          y2={vanishingY + 28}
          stroke="#00FFA3"
          strokeWidth="1.2"
          opacity="0.4"
        />
        {/* Right main rail */}
        <line
          x1={vanishingX + 280}
          y1={1080}
          x2={vanishingX + 12}
          y2={vanishingY + 28}
          stroke="url(#rail-gold)"
          strokeWidth="3"
        />
        {/* Right inner guard rail */}
        <line
          x1={vanishingX + 250}
          y1={1080}
          x2={vanishingX + 10}
          y2={vanishingY + 28}
          stroke="#00FFA3"
          strokeWidth="1.2"
          opacity="0.4"
        />

        {/* 3. Receding Victorian Arch Portals */}
        {arches.map((arch) => {
          const cornerR = arch.archWidth * 0.45;
          const pathD = `
            M ${arch.leftX} ${arch.groundY}
            L ${arch.leftX} ${arch.groundY - arch.pillarHeight}
            C ${arch.leftX} ${arch.archTopY}, ${vanishingX - cornerR} ${arch.archTopY}, ${vanishingX} ${arch.archTopY}
            C ${vanishingX + cornerR} ${arch.archTopY}, ${arch.rightX} ${arch.groundY - arch.pillarHeight}, ${arch.rightX} ${arch.groundY - arch.pillarHeight}
            L ${arch.rightX} ${arch.groundY}
          `;

          return (
            <g key={`arch-${arch.index}`} opacity={arch.archAlpha}>
              {/* Outer structural rib */}
              <path
                d={pathD}
                stroke="url(#arch-glow)"
                strokeWidth={arch.strokeW}
                fill="none"
              />

              {/* Internal truss chevron bracing for nearest arches */}
              {arch.index < 4 && (
                <path
                  d={`
                    M ${arch.leftX} ${arch.groundY - arch.pillarHeight * 0.5}
                    L ${arch.leftX + 45 * arch.scale} ${arch.groundY - arch.pillarHeight * 0.7}
                    M ${arch.rightX} ${arch.groundY - arch.pillarHeight * 0.5}
                    L ${arch.rightX - 45 * arch.scale} ${arch.groundY - arch.pillarHeight * 0.7}
                  `}
                  stroke="#FFE259"
                  strokeWidth={arch.strokeW * 0.6}
                  opacity="0.4"
                />
              )}

              {/* Station Keystone Accent */}
              <polygon
                points={`
                  ${vanishingX - 12 * arch.scale},${arch.archTopY - 6 * arch.scale}
                  ${vanishingX + 12 * arch.scale},${arch.archTopY - 6 * arch.scale}
                  ${vanishingX + 8 * arch.scale},${arch.archTopY + 14 * arch.scale}
                  ${vanishingX - 8 * arch.scale},${arch.archTopY + 14 * arch.scale}
                `}
                fill="#FFE259"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* 4. Deep Vanishing Point Corona */}
        <circle
          cx={vanishingX}
          cy={vanishingY + 15}
          r="12"
          fill="#FFE259"
          opacity={0.4 * revealProgress}
          filter="blur(4px)"
        />
      </svg>
    </div>
  );
};
