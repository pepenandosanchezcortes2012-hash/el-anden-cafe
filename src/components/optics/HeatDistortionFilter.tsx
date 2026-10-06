import React from 'react';

interface HeatDistortionFilterProps {
  id?: string;
  frame: number;
  intensity?: number; // 0 to 1
  scale?: number;     // displacement scale
}

/**
 * Procedural SVG Heat Distortion & Steam Refraction Filter
 * Uses animated feTurbulence and feDisplacementMap to dynamically bend light
 * in sync with locomotive steam and espresso boiler vapor.
 */
export const HeatDistortionFilter: React.FC<HeatDistortionFilterProps> = ({
  id = 'heat-distortion-filter',
  frame,
  intensity = 0.5,
  scale = 28,
}) => {
  // Evolve turbulence coordinates smoothly with frame
  const baseFreqX = 0.008 + Math.sin(frame * 0.04) * 0.003;
  const baseFreqY = 0.035 + Math.cos(frame * 0.03) * 0.008;

  // Modulate displacement scale with intensity
  const activeScale = scale * intensity;

  return (
    <svg
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${baseFreqX.toFixed(5)} ${baseFreqY.toFixed(5)}`}
            numOctaves={3}
            seed={(frame * 0.5) % 100}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={activeScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        {/* Lighter variant for ambient atmospheric steam */}
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="turbulence"
            baseFrequency={`${(baseFreqX * 0.7).toFixed(5)} ${(baseFreqY * 0.6).toFixed(5)}`}
            numOctaves={2}
            seed={(frame * 0.2) % 100}
            result="softNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={activeScale * 0.45}
            xChannelSelector="R"
            yChannelSelector="B"
            result="softDisplaced"
          />
        </filter>
      </defs>
    </svg>
  );
};
