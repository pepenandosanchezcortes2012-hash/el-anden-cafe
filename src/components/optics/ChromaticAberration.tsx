import React from 'react';

interface ChromaticAberrationProps {
  offset: number; // Offset in pixels (typically 0 to 4px)
  children: React.ReactNode;
  active?: boolean;
}

/**
 * Anamorphic Lens Chromatic Aberration Container
 * Splits visual layers into Red, Green, and Blue channels with subpixel displacement
 * and 'mix-blend-mode: screen' recombination to emulate anamorphic glass dispersion.
 */
export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  offset,
  children,
  active = true,
}) => {
  // If offset is virtually zero or inactive, render single high-efficiency layer
  if (!active || Math.abs(offset) < 0.1) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {children}
      </div>
    );
  }

  const redOffsetX = -offset;
  const redOffsetY = -offset * 0.2;
  const blueOffsetX = offset * 1.1;
  const blueOffsetY = offset * 0.25;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#030705',
      }}
    >
      {/* SVG Filters for True Spectral RGB Channel Isolation */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          {/* Red channel isolate */}
          <filter id="rgb-split-red" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Green channel isolate */}
          <filter id="rgb-split-green" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>

          {/* Blue channel isolate */}
          <filter id="rgb-split-blue" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: RED Channel (shifted left-up) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#rgb-split-red)',
          transform: `translate3d(${redOffsetX}px, ${redOffsetY}px, 0)`,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>

      {/* Layer 2: GREEN Channel (neutral anchor) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#rgb-split-green)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>

      {/* Layer 3: BLUE Channel (shifted right-down) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#rgb-split-blue)',
          mixBlendMode: 'screen',
          transform: `translate3d(${blueOffsetX}px, ${blueOffsetY}px, 0)`,
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};
