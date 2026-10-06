import React from 'react';
import { interpolate, Easing } from 'remotion';
import { THEME } from '../../constants/theme';

interface CalligraphyTaglineProps {
  progress: number; // 0 to 1
  opacity?: number;
  y?: number;
}

/**
 * Living Calligraphy Tagline: "Una pausa antes de seguir"
 * Draws animated cursive lettering and baroque flourish underline
 * through coordinated stroke-dashoffset interpolation from left to right.
 */
export const CalligraphyTagline: React.FC<CalligraphyTaglineProps> = ({
  progress,
  opacity = 1.0,
  y = 860,
}) => {
  if (opacity <= 0.001 || progress <= 0.001) return null;

  // Staggered draw-ins for the words and the ornate underline
  const textProgress = interpolate(progress, [0, 0.75], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const swashProgress = interpolate(progress, [0.4, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Calculate dynamic clip path / stroke dashoffset
  const swashLength = 780;
  const swashDashoffset = swashLength * (1 - swashProgress);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: y,
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 40,
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      {/* 1. Main Calligraphic Text with Gradient Mask Reveal */}
      <div
        style={{
          fontFamily: THEME.typography.calligraphyScript,
          fontStyle: 'italic',
          fontSize: 34,
          letterSpacing: 4,
          color: '#FFE259',
          textShadow: '0 0 16px rgba(255, 226, 89, 0.6), 0 0 35px rgba(255, 167, 81, 0.3)',
          clipPath: `inset(0 ${Math.max(0, (1 - textProgress) * 100)}% 0 0)`,
          willChange: 'clip-path',
          whiteSpace: 'nowrap',
          padding: '0 20px',
        }}
      >
        “ Una pausa antes de seguir ”
      </div>

      {/* 2. Living Vector Calligraphic Flourish Swash */}
      <svg
        width="820"
        height="60"
        viewBox="0 0 820 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginTop: 4 }}
      >
        <defs>
          <linearGradient id="swash-gold" x1="0" y1="0" x2="820" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA751" stopOpacity="0.1" />
            <stop offset="20%" stopColor="#FFE259" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="80%" stopColor="#FFE259" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0.2" />
          </linearGradient>

          <filter id="swash-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic decorative flourished calligraphy stroke */}
        <path
          d="M 60 22 C 140 10, 240 32, 410 24 C 580 16, 680 34, 760 18 M 360 32 Q 410 44 460 32"
          stroke="url(#swash-gold)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={swashLength}
          strokeDashoffset={swashDashoffset}
          filter="url(#swash-glow)"
        />

        {/* Central Diamond Accent */}
        {swashProgress > 0.85 && (
          <polygon
            points="410,18 415,24 410,30 405,24"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 6px #FFE259)"
          />
        )}
      </svg>
    </div>
  );
};
