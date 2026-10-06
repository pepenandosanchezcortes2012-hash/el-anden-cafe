import React from 'react';
import { THEME } from '../../constants/theme';

interface CinematicLetterboxProps {
  frame: number;
  vignetteStrength?: number; // 0 to 1
  showTechnicalHUD?: boolean;
}

/**
 * Cinematic Scope 2.39:1 Letterbox & Vignette Mask
 * Imparts anamorphic theatrical aspect ratio and deepens abyssal peripheral contrast.
 */
export const CinematicLetterbox: React.FC<CinematicLetterboxProps> = ({
  frame,
  vignetteStrength = 0.75,
  showTechnicalHUD = true,
}) => {
  const barHeight = THEME.dimensions.letterboxHeight;

  // Format frame as timecode 00:00:00:00
  const totalSeconds = Math.floor(frame / 60);
  const subFrames = frame % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timecode = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(subFrames).padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 80,
      }}
    >
      {/* Top Scope Matte Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: '#030705',
          borderBottom: '1px solid rgba(255, 226, 89, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          boxSizing: 'border-box',
        }}
      >
        {showTechnicalHUD && (
          <>
            <div
              style={{
                fontFamily: THEME.typography.technicalMono,
                fontSize: 11,
                letterSpacing: 2,
                color: 'rgba(255, 226, 89, 0.55)',
                textTransform: 'uppercase',
              }}
            >
              EL ANDÉN // 2.39:1 ANAMORPHIC MASTER // 60 FPS
            </div>
            <div
              style={{
                fontFamily: THEME.typography.technicalMono,
                fontSize: 11,
                letterSpacing: 1.5,
                color: THEME.colors.emeraldNeon,
                opacity: 0.8,
              }}
            >
              TC {timecode} [F:{frame.toString().padStart(4, '0')}]
            </div>
          </>
        )}
      </div>

      {/* Bottom Scope Matte Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: '#030705',
          borderTop: '1px solid rgba(255, 226, 89, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          boxSizing: 'border-box',
        }}
      >
        {showTechnicalHUD && (
          <>
            <div
              style={{
                fontFamily: THEME.typography.technicalMono,
                fontSize: 10,
                letterSpacing: 2,
                color: 'rgba(255, 226, 89, 0.4)',
              }}
            >
              LOC: ESTACIÓN CENTRAL // 2,400 M.S.N.M.
            </div>
            <div
              style={{
                fontFamily: THEME.typography.technicalMono,
                fontSize: 10,
                letterSpacing: 2,
                color: 'rgba(255, 226, 89, 0.4)',
              }}
            >
              OPTIQUE: COOKE ANAMORPHIC /i // T2.3
            </div>
          </>
        )}
      </div>

      {/* Atmospheric Vignette Falloff */}
      <div
        style={{
          position: 'absolute',
          top: barHeight,
          left: 0,
          right: 0,
          bottom: barHeight,
          background: `radial-gradient(ellipse at center, transparent 45%, rgba(3, 7, 5, ${vignetteStrength * 0.7}) 80%, rgba(3, 7, 5, ${vignetteStrength}) 100%)`,
        }}
      />

      {/* Anamorphic Framing Crosshairs */}
      <div
        style={{
          position: 'absolute',
          top: barHeight + 24,
          left: 40,
          width: 14,
          height: 14,
          borderTop: '1.5px solid rgba(0, 255, 163, 0.4)',
          borderLeft: '1.5px solid rgba(0, 255, 163, 0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: barHeight + 24,
          right: 40,
          width: 14,
          height: 14,
          borderTop: '1.5px solid rgba(0, 255, 163, 0.4)',
          borderRight: '1.5px solid rgba(0, 255, 163, 0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: barHeight + 24,
          left: 40,
          width: 14,
          height: 14,
          borderBottom: '1.5px solid rgba(0, 255, 163, 0.4)',
          borderLeft: '1.5px solid rgba(0, 255, 163, 0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: barHeight + 24,
          right: 40,
          width: 14,
          height: 14,
          borderBottom: '1.5px solid rgba(0, 255, 163, 0.4)',
          borderRight: '1.5px solid rgba(0, 255, 163, 0.4)',
        }}
      />
    </div>
  );
};
