import React from 'react';
import { interpolate } from 'remotion';
import { THEME } from '../../constants/theme';

interface VintageLanternProps {
  frame: number;
  scale?: number;
  igniteProgress?: number; // 0 = dark, 1 = blazing bright
  x?: number;
  y?: number;
}

/**
 * Mathematically Parameterized Vintage Railroad Lantern (Farol de Ferrocarril)
 * Features Victorian cast-brass architecture, Fresnel glass optic,
 * and high-intensity incandescent core filament.
 */
export const VintageLantern: React.FC<VintageLanternProps> = ({
  frame,
  scale = 1.0,
  igniteProgress = 1.0,
  x = 960,
  y = 360,
}) => {
  // Filament micro-flicker
  const flicker = igniteProgress > 0.05
    ? 1 + Math.sin(frame * 0.45) * 0.04 + Math.cos(frame * 0.78) * 0.03
    : 0;

  const glowRadius = interpolate(igniteProgress, [0, 1], [0, 180]) * flicker;
  const filamentAlpha = igniteProgress * flicker;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    >
      <svg
        width="440"
        height="620"
        viewBox="-220 -310 440 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Brass Metallic Gradient */}
          <linearGradient id="brass-grad" x1="-100" y1="-200" x2="100" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA751" />
            <stop offset="35%" stopColor="#FFE259" />
            <stop offset="65%" stopColor="#B38029" />
            <stop offset="100%" stopColor="#3D290A" />
          </linearGradient>

          {/* Cast Iron Dark Metal */}
          <linearGradient id="iron-grad" x1="0" y1="-300" x2="0" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A3A32" />
            <stop offset="50%" stopColor="#141E19" />
            <stop offset="100%" stopColor="#080F0C" />
          </linearGradient>

          {/* Incandescent Core Burner Gradient */}
          <radialGradient id="filament-glow" cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFE259" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFA751" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#FF6B00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF3300" stopOpacity="0" />
          </radialGradient>

          <filter id="lantern-hot-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Volumetric Filament Glow Behind Glass */}
        {igniteProgress > 0.01 && (
          <circle
            cx="0"
            cy="15"
            r={glowRadius}
            fill="url(#filament-glow)"
            filter="url(#lantern-hot-glow)"
            opacity={filamentAlpha}
          />
        )}

        {/* 2. Top Suspension Ring / Bail Handle */}
        <path
          d="M -55 -210 C -55 -275, 55 -275, 55 -210"
          stroke="url(#brass-grad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="0" cy="-275" r="14" stroke="url(#brass-grad)" strokeWidth="6" fill="#0E1612" />

        {/* 3. Top Ventilation Cap / Chimney */}
        {/* Tier 1 cap */}
        <path
          d="M -45 -205 L 45 -205 L 55 -175 L -55 -175 Z"
          fill="url(#iron-grad)"
          stroke="url(#brass-grad)"
          strokeWidth="2"
        />
        {/* Vent louvers */}
        <line x1="-35" y1="-190" x2="-20" y2="-190" stroke="#FFE259" strokeWidth="2" opacity="0.7" />
        <line x1="-10" y1="-190" x2="10" y2="-190" stroke="#FFE259" strokeWidth="2" opacity="0.7" />
        <line x1="20" y1="-190" x2="35" y2="-190" stroke="#FFE259" strokeWidth="2" opacity="0.7" />

        {/* Tier 2 hood */}
        <path
          d="M -85 -175 L 85 -175 L 95 -125 L -95 -125 Z"
          fill="url(#iron-grad)"
          stroke="url(#brass-grad)"
          strokeWidth="2.5"
        />
        {/* Brass rivets on hood */}
        {[-70, -35, 0, 35, 70].map((rx, idx) => (
          <circle key={idx} cx={rx} cy="-135" r="3" fill="#FFE259" stroke="#8A6D24" strokeWidth="1" />
        ))}

        {/* 4. Protective Cage Guards (Vertical Curved Brass Ribs) */}
        <path d="M -90 -125 C -120 15, -120 120, -90 170" stroke="url(#brass-grad)" strokeWidth="4.5" fill="none" />
        <path d="M 90 -125 C 120 15, 120 120, 90 170" stroke="url(#brass-grad)" strokeWidth="4.5" fill="none" />
        <path d="M -40 -125 C -55 15, -55 120, -40 170" stroke="url(#brass-grad)" strokeWidth="3.5" fill="none" />
        <path d="M 40 -125 C 55 15, 55 120, 40 170" stroke="url(#brass-grad)" strokeWidth="3.5" fill="none" />

        {/* Horizontal Guard Rings */}
        <ellipse cx="0" cy="-25" rx="98" ry="16" stroke="url(#brass-grad)" strokeWidth="3" fill="none" />
        <ellipse cx="0" cy="70" rx="96" ry="16" stroke="url(#brass-grad)" strokeWidth="3" fill="none" />

        {/* 5. Cylindrical Fresnel Glass Lens */}
        <rect
          x="-75"
          y="-120"
          width="150"
          height="285"
          rx="12"
          fill="rgba(0, 255, 163, 0.04)"
          stroke="rgba(255, 226, 89, 0.35)"
          strokeWidth="1.5"
        />

        {/* Fresnel Optical Rib Grooves */}
        {[-80, -45, -10, 25, 60, 95, 130].map((grooveY, idx) => (
          <path
            key={idx}
            d={`M -72 ${grooveY} Q 0 ${grooveY + 12} 72 ${grooveY}`}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.2"
            fill="none"
          />
        ))}

        {/* 6. Glowing Incandescent Filament & Burner Nozzle */}
        {igniteProgress > 0.05 && (
          <g>
            {/* Burner Brass Nozzle */}
            <path d="M -18 95 L 18 95 L 12 135 L -12 135 Z" fill="url(#brass-grad)" />
            
            {/* Incandescent coiled filament loop */}
            <path
              d="M -8 80 L -8 25 C -8 5, 8 5, 8 25 L 8 80"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#lantern-hot-glow)"
            />
            <path
              d="M -6 45 Q 0 15 6 45"
              stroke="#FFE259"
              strokeWidth="5"
              filter="url(#lantern-hot-glow)"
            />
          </g>
        )}

        {/* 7. Heavy Base Font & Fuel Reservoir */}
        <path
          d="M -92 170 L 92 170 L 105 235 L -105 235 Z"
          fill="url(#iron-grad)"
          stroke="url(#brass-grad)"
          strokeWidth="2.5"
        />
        <rect
          x="-112"
          y="235"
          width="224"
          height="28"
          rx="6"
          fill="url(#brass-grad)"
          stroke="#523F12"
          strokeWidth="2"
        />

        {/* Railway Stamped Plaque */}
        <rect x="-42" y="188" width="84" height="26" rx="4" fill="#080F0C" stroke="url(#brass-grad)" strokeWidth="1.5" />
        <text
          x="0"
          y="205"
          textAnchor="middle"
          fill="#FFE259"
          fontFamily={THEME.typography.technicalMono}
          fontSize="9"
          fontWeight="bold"
          letterSpacing="2"
        >
          E.A.C. Nº 7
        </text>
      </svg>
    </div>
  );
};
