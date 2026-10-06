import React from 'react';
import { THEME } from '../../constants/theme';

interface LocomotiveMechanicalProps {
  frame: number;
  drawProgress?: number; // 0 to 1 for stroke draw-in
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
}

/**
 * Mathematically Parameterized Victorian Steam Locomotive & Gear Kinetics
 * Features kinematic slider-crank linkage, coupled driving wheels,
 * precision interlocking gear trains, and ultra-fine gold line work (1px - 1.5px).
 */
export const LocomotiveMechanical: React.FC<LocomotiveMechanicalProps> = ({
  frame,
  drawProgress = 1.0,
  opacity = 1.0,
  scale = 1.0,
  x = 960,
  y = 540,
}) => {
  if (opacity <= 0.001 || drawProgress <= 0.001) return null;

  // Angular kinematics
  const wheelSpeed = 4.2; // degrees per frame
  const wheelAngleDeg = (frame * wheelSpeed) % 360;
  const wheelAngleRad = (wheelAngleDeg * Math.PI) / 180;

  // Pilot wheel spins faster due to smaller radius
  const pilotWheelAngleDeg = (frame * wheelSpeed * 2.1) % 360;

  // Interlocking gear pair angular speeds
  const gear1AngleDeg = (frame * 3.0) % 360;
  const gear2AngleDeg = -(frame * 3.0 * (18 / 12)) % 360; // 18 teeth vs 12 teeth ratio

  // Driving Wheel centers
  const wheel1X = -90;
  const wheel2X = 90;
  const wheelY = 120;
  const wheelR = 75;
  const crankR = 34;

  // Crank pin positions on driving wheels (mechanically locked in phase)
  const pin1X = wheel1X + Math.cos(wheelAngleRad) * crankR;
  const pin1Y = wheelY + Math.sin(wheelAngleRad) * crankR;
  const pin2X = wheel2X + Math.cos(wheelAngleRad) * crankR;
  const pin2Y = wheelY + Math.sin(wheelAngleRad) * crankR;

  // Piston crosshead kinematic calculation (Slider-Crank mechanism)
  // Crosshead slides horizontally along y = 120, cylinder front at x = 290
  const rodLength = 175;
  const dy = pin2Y - wheelY;
  // x_crosshead = pin2X + sqrt(rodLength^2 - dy^2)
  const crossheadX = pin2X + Math.sqrt(Math.max(0, rodLength * rodLength - dy * dy));
  const crossheadY = wheelY;

  // Stroke-dasharray for line drawing reveals
  const strokeDash = drawProgress < 0.999 ? '1200' : undefined;
  const strokeOffset = drawProgress < 0.999 ? `${1200 * (1 - drawProgress)}` : undefined;

  // Helper to render wheel spokes
  const renderWheelSpokes = (cx: number, cy: number, r: number, count: number, angleDeg: number) => {
    const spokes = [];
    for (let i = 0; i < count; i++) {
      const theta = (angleDeg + (i * 360) / count) * (Math.PI / 180);
      const x2 = cx + Math.cos(theta) * (r - 8);
      const y2 = cy + Math.sin(theta) * (r - 8);
      spokes.push(
        <line
          key={`spoke-${i}`}
          x1={cx}
          y1={cy}
          x2={x2}
          y2={y2}
          stroke="#FFE259"
          strokeWidth="1.2"
          opacity="0.85"
        />
      );
    }
    return spokes;
  };

  // Helper to render gear teeth
  const renderGear = (cx: number, cy: number, r: number, teeth: number, angleDeg: number) => {
    const elements = [];
    const toothR = r + 7;
    for (let i = 0; i < teeth; i++) {
      const theta = (angleDeg + (i * 360) / teeth) * (Math.PI / 180);
      const xOut = cx + Math.cos(theta) * toothR;
      const yOut = cy + Math.sin(theta) * toothR;
      elements.push(
        <circle
          key={`tooth-${i}`}
          cx={xOut}
          cy={yOut}
          r="2.5"
          fill="#FFE259"
          stroke="#FFA751"
          strokeWidth="0.8"
        />
      );
    }
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} stroke="#FFE259" strokeWidth="1.5" fill="none" />
        <circle cx={cx} cy={cy} r={r * 0.55} stroke="#FFA751" strokeWidth="1.2" fill="none" />
        <circle cx={cx} cy={cy} r="4" fill="#FFE259" />
        {elements}
      </g>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
        zIndex: 20,
        opacity,
      }}
    >
      <svg
        width="880"
        height="500"
        viewBox="-440 -250 880 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Mechanical Gradient */}
          <linearGradient id="loco-gold" x1="-300" y1="-150" x2="300" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="30%" stopColor="#FFE259" />
            <stop offset="70%" stopColor="#FFA751" />
            <stop offset="100%" stopColor="#D48828" />
          </linearGradient>

          <filter id="gold-line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Precision Interlocking Gears in Overhead Chassis */}
        <g opacity="0.75">
          {renderGear(-220, -110, 42, 18, gear1AngleDeg)}
          {renderGear(-165, -110, 28, 12, gear2AngleDeg)}
        </g>

        {/* 2. Main Locomotive Boiler (Caldera) & Cabin Profile */}
        <g
          stroke="url(#loco-gold)"
          strokeWidth="1.4"
          strokeDasharray={strokeDash}
          strokeDashoffset={strokeOffset}
          filter="url(#gold-line-glow)"
        >
          {/* Driver Cabin (Cabina Victoriana) */}
          <path d="M -260 120 L -260 -60 L -140 -60 L -140 120 Z" />
          <path d="M -275 -60 L -130 -60 L -135 -72 L -270 -72 Z" fill="rgba(255, 226, 89, 0.1)" />
          {/* Cabin arched windows */}
          <rect x="-240" y="-45" width="38" height="48" rx="6" stroke="#00FFA3" strokeWidth="1.2" />
          <rect x="-190" y="-45" width="38" height="48" rx="6" stroke="#00FFA3" strokeWidth="1.2" />

          {/* Main Boiler Cylinder */}
          <line x1="-140" y1="-35" x2="210" y2="-35" />
          <line x1="-140" y1="55" x2="210" y2="55" />
          {/* Boiler brass strapping bands */}
          {[-75, -10, 55, 120, 185].map((bx, idx) => (
            <line key={`band-${idx}`} x1={bx} y1="-35" x2={bx} y2="55" stroke="#FFE259" strokeWidth="1.5" />
          ))}

          {/* Steam Dome (Domo de Vapor) */}
          <path d="M -30 -35 C -30 -75, 20 -75, 20 -35 Z" fill="rgba(255, 226, 89, 0.08)" />
          {/* Sand Dome */}
          <path d="M 80 -35 C 80 -65, 120 -65, 120 -35 Z" fill="rgba(255, 226, 89, 0.08)" />

          {/* Smokestack / Chimney (Expulsión de Vapor) */}
          <path d="M 175 -35 L 170 -115 L 195 -125 L 220 -115 L 215 -35 Z" fill="rgba(255, 226, 89, 0.12)" />
          <line x1="166" y1="-115" x2="224" y2="-115" stroke="#FFE259" strokeWidth="2" />

          {/* Front Smokebox & Headlight Support */}
          <path d="M 210 -35 C 235 -35, 235 55, 210 55 Z" />
          {/* Headlamp Bracket */}
          <line x1="225" y1="-10" x2="255" y2="-10" stroke="#FFE259" strokeWidth="2" />
          <polygon points="255,-25 285,-20 285,0 255,5" fill="#FFE259" opacity="0.85" />

          {/* Steam Cylinder & Crosshead Guide Bar */}
          <rect x="250" y="98" width="90" height="44" rx="4" stroke="#FFE259" strokeWidth="1.5" />
          <line x1="130" y1={wheelY} x2="260" y2={wheelY} stroke="#FFE259" strokeWidth="2.5" />

          {/* Cowcatcher / Pilot Wedge (Deflector de Vía) */}
          <path d="M 230 145 L 340 145 L 310 110 L 230 110 Z" />
          <line x1="245" y1="145" x2="270" y2="110" stroke="#00FFA3" strokeWidth="1" />
          <line x1="275" y1="145" x2="290" y2="110" stroke="#00FFA3" strokeWidth="1" />
          <line x1="305" y1="145" x2="305" y2="110" stroke="#00FFA3" strokeWidth="1" />

          {/* Main Running Board (Chasis Inferior) */}
          <line x1="-275" y1="65" x2="250" y2="65" strokeWidth="3" />
        </g>

        {/* 3. Rotating Driver Wheels (Ruedas de Gran Tracción) */}
        {/* Wheel 1 */}
        <g>
          <circle cx={wheel1X} cy={wheelY} r={wheelR} stroke="#FFE259" strokeWidth="2" fill="none" />
          <circle cx={wheel1X} cy={wheelY} r={wheelR - 6} stroke="#FFA751" strokeWidth="1.2" fill="none" />
          <circle cx={wheel1X} cy={wheelY} r="18" fill="url(#loco-gold)" />
          {renderWheelSpokes(wheel1X, wheelY, wheelR, 14, wheelAngleDeg)}
          {/* Counterweight Crescent */}
          <path
            d={`M ${wheel1X + Math.cos(wheelAngleRad + Math.PI * 0.7) * (wheelR - 7)} ${wheelY + Math.sin(wheelAngleRad + Math.PI * 0.7) * (wheelR - 7)}
               A ${wheelR - 7} ${wheelR - 7} 0 0 1 ${wheel1X + Math.cos(wheelAngleRad + Math.PI * 1.3) * (wheelR - 7)} ${wheelY + Math.sin(wheelAngleRad + Math.PI * 1.3) * (wheelR - 7)}
               Z`}
            fill="#FFE259"
            opacity="0.5"
          />
        </g>

        {/* Wheel 2 */}
        <g>
          <circle cx={wheel2X} cy={wheelY} r={wheelR} stroke="#FFE259" strokeWidth="2" fill="none" />
          <circle cx={wheel2X} cy={wheelY} r={wheelR - 6} stroke="#FFA751" strokeWidth="1.2" fill="none" />
          <circle cx={wheel2X} cy={wheelY} r="18" fill="url(#loco-gold)" />
          {renderWheelSpokes(wheel2X, wheelY, wheelR, 14, wheelAngleDeg)}
          {/* Counterweight Crescent */}
          <path
            d={`M ${wheel2X + Math.cos(wheelAngleRad + Math.PI * 0.7) * (wheelR - 7)} ${wheelY + Math.sin(wheelAngleRad + Math.PI * 0.7) * (wheelR - 7)}
               A ${wheelR - 7} ${wheelR - 7} 0 0 1 ${wheel2X + Math.cos(wheelAngleRad + Math.PI * 1.3) * (wheelR - 7)} ${wheelY + Math.sin(wheelAngleRad + Math.PI * 1.3) * (wheelR - 7)}
               Z`}
            fill="#FFE259"
            opacity="0.5"
          />
        </g>

        {/* Pilot Truck Wheels (Ruedas Delanteras Guía) */}
        <g>
          <circle cx="215" cy="140" r="32" stroke="#FFE259" strokeWidth="1.5" fill="none" />
          {renderWheelSpokes(215, 140, 32, 8, pilotWheelAngleDeg)}
          <circle cx="285" cy="140" r="32" stroke="#FFE259" strokeWidth="1.5" fill="none" />
          {renderWheelSpokes(285, 140, 32, 8, pilotWheelAngleDeg)}
        </g>

        {/* 4. Kinematic Mechanical Linkage: Side Coupling Rod & Main Connecting Rod */}
        {/* Side Coupling Rod connecting Pin 1 and Pin 2 */}
        <line
          x1={pin1X}
          y1={pin1Y}
          x2={pin2X}
          y2={pin2Y}
          stroke="#FFE259"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1={pin1X}
          y1={pin1Y}
          x2={pin2X}
          y2={pin2Y}
          stroke="#030705"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Main Piston Connecting Rod connecting Pin 2 to Crosshead */}
        <line
          x1={pin2X}
          y1={pin2Y}
          x2={crossheadX}
          y2={crossheadY}
          stroke="url(#loco-gold)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Crosshead Slider Block */}
        <rect
          x={crossheadX - 10}
          y={crossheadY - 8}
          width="20"
          height="16"
          rx="3"
          fill="#FFE259"
          stroke="#3D290A"
          strokeWidth="1.5"
        />

        {/* Joint Pins */}
        <circle cx={pin1X} cy={pin1Y} r="5" fill="#FFFFFF" stroke="#FFA751" strokeWidth="2" />
        <circle cx={pin2X} cy={pin2Y} r="5" fill="#FFFFFF" stroke="#FFA751" strokeWidth="2" />
      </svg>
    </div>
  );
};
