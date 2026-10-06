import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { THEME } from './constants/theme';
import { Act1Ignition } from './components/acts/Act1Ignition';
import { Act2TheMachine } from './components/acts/Act2TheMachine';
import { Act3Collapse } from './components/acts/Act3Collapse';
import { Act4ImmortalSeal } from './components/acts/Act4ImmortalSeal';
import { ChromaticAberration } from './components/optics/ChromaticAberration';
import { HeatDistortionFilter } from './components/optics/HeatDistortionFilter';
import { CinematicLetterbox } from './components/optics/CinematicLetterbox';

/**
 * MASTER COMPOSITION: "EL ANDÉN CAFÉ: THE MIDNIGHT STEAM"
 * Total Duration: 900 frames @ 60 FPS (15.0s exact)
 * Silent Film Motion Graphics with Optical Compensation Pipeline
 */
export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { act1, act2, act3, act4 } = THEME.timings;

  // -------------------------------------------------------------
  // DYNAMIC OPTICAL CHROMATIC ABERRATION CURVE
  // Calculated dynamically per frame for impact shockwaves
  // -------------------------------------------------------------
  const chromaticOffset = useMemo(() => {
    // Act 1: Initial lantern flash shockwave (Frames 45–55)
    if (frame >= 45 && frame <= 55) {
      return interpolate(frame, [45, 47, 55], [0, 3.2, 0]);
    }
    // Act 1: "CORRE" speed disintegration (Frames 170–210)
    if (frame >= 170 && frame <= 210) {
      return interpolate(frame, [170, 200, 210], [0.2, 2.4, 1.0]);
    }
    // Act 2: High pressure steam extraction peak (Frames 360–390)
    if (frame >= 360 && frame <= 390) {
      return 1.2;
    }
    // Act 3: Gravitational singularity collapse hit (Frames 530–550)
    if (frame >= 530 && frame <= 550) {
      return interpolate(frame, [530, 535, 550], [0.5, 3.8, 0.4]);
    }
    // Act 3: Anamorphic streak flare crossing (Frames 625–655)
    if (frame >= 625 && frame <= 655) {
      return interpolate(frame, [625, 640, 655], [0.3, 2.6, 0.2]);
    }
    // Base resting anamorphic optical dispersion
    return 0.35;
  }, [frame]);

  // -------------------------------------------------------------
  // PROCEDURAL HEAT DISTORTION INTENSITY
  // -------------------------------------------------------------
  const heatIntensity = useMemo(() => {
    if (frame >= act2.start && frame < act3.start) {
      return 0.85; // Strong during steam / espresso act
    }
    if (frame >= act3.start && frame < act3.implosionHit) {
      return 0.4;
    }
    return 0.15;
  }, [frame, act2.start, act3.start, act3.implosionHit]);

  // -------------------------------------------------------------
  // ACT CROSSFADE OPACITIES
  // Seamless transitions between acts
  // -------------------------------------------------------------
  const act1Opacity = interpolate(frame, [0, 205, 215], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const act2Opacity = interpolate(frame, [205, 215, 475, 485], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const act3Opacity = interpolate(frame, [475, 485, 715, 725], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const act4Opacity = interpolate(frame, [715, 725, 900], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: THEME.colors.bgAbyssal,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 1. Procedural SVG Optical Heat Distortion Engine */}
      <HeatDistortionFilter
        id="heat-distortion-filter"
        frame={frame}
        intensity={heatIntensity}
        scale={28}
      />

      {/* 2. Anamorphic Lens Container with Chromatic Aberration */}
      <ChromaticAberration offset={chromaticOffset} active={true}>
        {/* ACT I: La Ignición en la Penumbra (Frames 0–215) */}
        {frame <= 215 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: act1Opacity,
              willChange: 'opacity',
            }}
          >
            <Act1Ignition frame={frame} fps={fps} />
          </div>
        )}

        {/* ACT II: La Máquina y el Grano (Frames 205–485) */}
        {frame >= 205 && frame <= 485 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: act2Opacity,
              willChange: 'opacity',
            }}
          >
            <Act2TheMachine frame={frame} fps={fps} />
          </div>
        )}

        {/* ACT III: El Colapso y la Síntesis (Frames 475–725) */}
        {frame >= 475 && frame <= 725 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: act3Opacity,
              willChange: 'opacity',
            }}
          >
            <Act3Collapse frame={frame} fps={fps} />
          </div>
        )}

        {/* ACT IV: El Sello Inmortal y Cierre (Frames 715–900) */}
        {frame >= 715 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: act4Opacity,
              willChange: 'opacity',
            }}
          >
            <Act4ImmortalSeal frame={frame} fps={fps} />
          </div>
        )}
      </ChromaticAberration>

      {/* 3. Theatrical Cinemascope 2.39:1 Letterbox, Vignette & Technical HUD */}
      <CinematicLetterbox
        frame={frame}
        vignetteStrength={frame > 800 ? 0.95 : 0.65}
        showTechnicalHUD={frame < 870}
      />
    </div>
  );
};
