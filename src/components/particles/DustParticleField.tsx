import React, { useMemo } from 'react';
import { calculateDustParticle } from '../../utils/math';
import { THEME } from '../../constants/theme';

interface DustParticleFieldProps {
  frame: number;
  count?: number; // 60 to 100
  intensity?: number;
  lanternOriginX?: number;
  lanternOriginY?: number;
}

/**
 * Volumetric Golden Dust & Ember Particles
 * Deterministic harmonic particle field interacting with the lantern light cone.
 * All motions are computed purely from frame with zero random jitter between renders.
 */
export const DustParticleField: React.FC<DustParticleFieldProps> = ({
  frame,
  count = 80,
  intensity = 1.0,
}) => {
  if (intensity <= 0.01) return null;

  const width = THEME.dimensions.width;
  const height = THEME.dimensions.height;

  // Calculate deterministic states for all particles at current frame
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(calculateDustParticle(i, frame, width, height));
    }
    return list;
  }, [count, frame, width, height]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 25,
        opacity: intensity,
        mixBlendMode: 'screen',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map((p, idx) => {
          const isSpark = idx % 5 === 0;
          return (
            <g key={idx}>
              {/* Outer soft aura */}
              <circle
                cx={p.x}
                cy={p.y}
                r={p.glowSize}
                fill={p.goldShade}
                opacity={p.opacity * 0.35}
                filter="url(#gold-glow)"
              />
              {/* Solid crystalline core */}
              <circle
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill={isSpark ? '#FFFFFF' : p.goldShade}
                opacity={p.opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
