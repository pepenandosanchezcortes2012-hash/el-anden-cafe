import React from 'react';
import { interpolate } from 'remotion';
import { THEME } from '../../constants/theme';

interface BrandEmblemProps {
  frame: number;
  scale?: number;
  opacity?: number;
  lensSealProgress?: number; // 0 to 1 (assembly of aperture and gold rim)
  reliefProgress?: number;   // 0 to 1 (depth of engraved relief)
  magneticPulse?: boolean;
  offsetY?: number;          // vertical offset in px from screen center
}

/**
 * Brand Emblem & Imagotype for "EL ANDÉN CAFÉ"
 * Mathematically constructed heraldic seal featuring an optical emerald iris,
 * knurled gear rim, frontal Victorian locomotive silhouette, and ornate filigree.
 */
export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  frame,
  scale = 1.0,
  opacity = 1.0,
  lensSealProgress = 1.0,
  reliefProgress = 1.0,
  magneticPulse = false,
  offsetY = 0,
}) => {
  if (opacity <= 0.001) return null;

  // Magnetic breathing pulse: subtle harmonic scale oscillation
  const pulseScale = magneticPulse ? 1.0 + Math.sin(frame * 0.075) * 0.014 : 1.0;
  const activeScale = scale * pulseScale;

  // Aperture lock rotation during seal assembly
  const rimRotation = interpolate(lensSealProgress, [0, 1], [-90, 0]);
  const rimScale = interpolate(lensSealProgress, [0, 1], [1.35, 1.0]);

  // Relief shadow intensity
  const shadowSpread = reliefProgress * 4;
  const shadowAlpha = reliefProgress * 0.85;

  // Generate 48 knurled gear teeth along outer perimeter
  const teethCount = 48;
  const teeth = [];
  const toothRadius = 248;

  for (let i = 0; i < teethCount; i++) {
    const angle = (i * 360) / teethCount;
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * toothRadius;
    const y = Math.sin(rad) * toothRadius;
    teeth.push({ x, y, angle });
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, calc(-50% + ${offsetY}px)) scale(${activeScale})`,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
        zIndex: 35,
        opacity,
      }}
    >
      <svg
        width="600"
        height="600"
        viewBox="-300 -300 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0px -${shadowSpread * 0.4}px ${shadowSpread}px rgba(255, 226, 89, ${shadowAlpha * 0.5})) drop-shadow(0px ${shadowSpread * 1.2}px ${shadowSpread * 2}px rgba(0, 0, 0, ${shadowAlpha * 0.95}))`,
        }}
      >
        <defs>
          {/* Outer Bezel Gold */}
          <linearGradient id="emblem-gold-bezel" x1="-250" y1="-250" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#FFE259" />
            <stop offset="60%" stopColor="#FFA751" />
            <stop offset="85%" stopColor="#C97D1A" />
            <stop offset="100%" stopColor="#5E3705" />
          </linearGradient>

          {/* Deep Emerald Optic Glass */}
          <radialGradient id="emerald-lens" cx="0" cy="0" r="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.22" />
            <stop offset="35%" stopColor="#0C3B29" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#051B12" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#020805" stopOpacity="1" />
          </radialGradient>

          {/* Radial brushed sheen */}
          <linearGradient id="lens-sheen" x1="-200" y1="-200" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#00FFA3" stopOpacity="0.25" />
          </linearGradient>

          {/* Circular Text Paths */}
          <path
            id="text-path-top"
            d="M -192 0 A 192 192 0 1 1 192 0"
            fill="none"
          />
          <path
            id="text-path-bottom"
            d="M -204 0 A 204 204 0 0 0 204 0"
            fill="none"
          />
        </defs>

        {/* 1. Outer Knurled Gear & Locking Aperture Ring */}
        <g
          transform={`scale(${rimScale}) rotate(${rimRotation})`}
          style={{ willChange: 'transform' }}
        >
          {/* Teeth */}
          {teeth.map((t, idx) => (
            <rect
              key={`tooth-${idx}`}
              x={t.x - 3}
              y={t.y - 7}
              width="6"
              height="14"
              rx="1.5"
              fill="url(#emblem-gold-bezel)"
              transform={`rotate(${t.angle}, ${t.x}, ${t.y})`}
            />
          ))}

          {/* Heavy Rim Ring */}
          <circle cx="0" cy="0" r="242" stroke="url(#emblem-gold-bezel)" strokeWidth="8" fill="none" />
          <circle cx="0" cy="0" r="236" stroke="#030705" strokeWidth="2" fill="none" />
          <circle cx="0" cy="0" r="226" stroke="url(#emblem-gold-bezel)" strokeWidth="3" fill="none" />
        </g>

        {/* 2. Deep Emerald Core Glass Disc */}
        <circle cx="0" cy="0" r="224" fill="url(#emerald-lens)" />
        <circle cx="0" cy="0" r="224" fill="url(#lens-sheen)" />

        {/* Inner concentric gold hairline guides */}
        <circle cx="0" cy="0" r="208" stroke="#FFE259" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="0" cy="0" r="156" stroke="url(#emblem-gold-bezel)" strokeWidth="2.5" fill="none" />
        <circle cx="0" cy="0" r="148" stroke="#00FFA3" strokeWidth="1" opacity="0.5" fill="none" />

        {/* 3. Circular Typography En Route */}
        {/* Upper Arc: "EL ANDÉN CAFÉ" */}
        <text
          fill="#FFE259"
          fontFamily={THEME.typography.calligraphyScript}
          fontSize="24"
          fontWeight="bold"
          letterSpacing="8"
          style={{ textAnchor: 'middle' }}
        >
          <textPath href="#text-path-top" startOffset="50%">
            EL ANDÉN CAFÉ
          </textPath>
        </text>

        {/* Lower Arc: "TOSTADO ARTESANAL • 1888" */}
        <text
          fill="#FFE259"
          fontFamily={THEME.typography.technicalMono}
          fontSize="12"
          fontWeight="bold"
          letterSpacing="6"
          opacity="0.85"
          style={{ textAnchor: 'middle' }}
        >
          <textPath href="#text-path-bottom" startOffset="50%">
            TOSTADO ARTESANAL • 1888
          </textPath>
        </text>

        {/* Star Accents at left and right */}
        <polygon points="-186,-2 -190,4 -196,4 -191,8 -193,14 -186,10 -180,14 -182,8 -177,4 -183,4" fill="#00FFA3" />
        <polygon points="186,-2 182,4 176,4 181,8 179,14 186,10 192,14 190,8 195,4 189,4" fill="#00FFA3" />

        {/* 4. Central Frontal Locomotive Heraldry */}
        <g id="central-loco">
          {/* Smokebox Circular Boiler Face */}
          <circle cx="0" cy="8" r="76" fill="#06120D" stroke="url(#emblem-gold-bezel)" strokeWidth="3" />
          <circle cx="0" cy="8" r="66" stroke="#FFE259" strokeWidth="1.2" fill="none" />

          {/* Locomotive Central Headlight at apex */}
          <rect x="-18" y="-95" width="36" height="34" rx="4" fill="url(#emblem-gold-bezel)" stroke="#FFE259" strokeWidth="1.5" />
          <circle cx="0" cy="-78" r="11" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFE259)" />
          {/* Headlamp bracket struts */}
          <line x1="-18" y1="-80" x2="-35" y2="-68" stroke="#FFE259" strokeWidth="2.5" />
          <line x1="18" y1="-80" x2="35" y2="-68" stroke="#FFE259" strokeWidth="2.5" />

          {/* Smokebox Hinged Door Details */}
          <circle cx="0" cy="8" r="48" fill="#0B1C15" stroke="url(#emblem-gold-bezel)" strokeWidth="1.8" />
          {/* Central Heraldic Brass Star */}
          <polygon
            points="0,-8 5,3 16,3 7,10 10,21 0,14 -10,21 -7,10 -16,3 -5,3"
            fill="url(#emblem-gold-bezel)"
          />

          {/* Radial Door Dogs (Cerrojos victorianos) */}
          {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * 44;
            const y1 = 8 + Math.sin(rad) * 44;
            const x2 = Math.cos(rad) * 58;
            const y2 = 8 + Math.sin(rad) * 58;
            return (
              <line
                key={`dog-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFE259"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Front Cowcatcher / Track Pilot */}
          <polygon
            points="-70,84 70,84 45,116 -45,116"
            fill="#06120D"
            stroke="url(#emblem-gold-bezel)"
            strokeWidth="2"
          />
          {[-35, -20, -5, 10, 25, 40].map((px, idx) => (
            <line
              key={`grille-${idx}`}
              x1={px}
              y1="85"
              x2={px * 0.7}
              y2="114"
              stroke="#00FFA3"
              strokeWidth="1.5"
            />
          ))}

          {/* Front Steam Cylinders */}
          <rect x="-106" y="44" width="34" height="42" rx="4" fill="#06120D" stroke="url(#emblem-gold-bezel)" strokeWidth="1.5" />
          <rect x="72" y="44" width="34" height="42" rx="4" fill="#06120D" stroke="url(#emblem-gold-bezel)" strokeWidth="1.5" />

          {/* 5. Victorian Botanical Filigree & Coffee Beans */}
          {/* Left Flourish */}
          <path
            d="M -75 -25 C -120 -50, -145 -10, -115 20 C -90 40, -65 15, -80 0"
            stroke="url(#emblem-gold-bezel)"
            strokeWidth="2"
            fill="none"
          />
          {/* Right Flourish */}
          <path
            d="M 75 -25 C 120 -50, 145 -10, 115 20 C 90 40, 65 15, 80 0"
            stroke="url(#emblem-gold-bezel)"
            strokeWidth="2"
            fill="none"
          />

          {/* Stylized Coffee Cherries */}
          <ellipse cx="-120" cy="5" rx="7" ry="9" transform="rotate(-25, -120, 5)" fill="#FFA751" stroke="#FFE259" strokeWidth="1" />
          <ellipse cx="-132" cy="18" rx="6" ry="8" transform="rotate(15, -132, 18)" fill="#FFA751" stroke="#FFE259" strokeWidth="1" />
          <ellipse cx="120" cy="5" rx="7" ry="9" transform="rotate(25, 120, 5)" fill="#FFA751" stroke="#FFE259" strokeWidth="1" />
          <ellipse cx="132" cy="18" rx="6" ry="8" transform="rotate(-15, 132, 18)" fill="#FFA751" stroke="#FFE259" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};
