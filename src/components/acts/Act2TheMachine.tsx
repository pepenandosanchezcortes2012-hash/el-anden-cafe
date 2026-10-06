import React from 'react';
import { interpolate, spring, Easing } from 'remotion';
import { THEME } from '../../constants/theme';
import { LocomotiveMechanical } from '../svg/LocomotiveMechanical';
import { TunnelPerspective } from '../svg/TunnelPerspective';
import { ProceduralSteam } from '../particles/ProceduralSteam';
import { DustParticleField } from '../particles/DustParticleField';

interface Act2TheMachineProps {
  frame: number;
  fps: number;
}

/**
 * ACT II: LA MÁQUINA Y EL GRANO (Frames 210–480 | 3.5–8.0 s)
 * Dolly Zoom (Vertigo Effect) -> Ultra-fine golden vector locomotive kinematics ->
 * Steam transmutation from train exhaust to dense espresso extraction ->
 * Master typography "NOSOTROS PARAMOS." + 3 Technical precision HUD telemetry overlays.
 */
export const Act2TheMachine: React.FC<Act2TheMachineProps> = ({ frame, fps }) => {
  const { act2 } = THEME.timings;
  const actFrame = frame - act2.start;

  // 1. Dolly Zoom (Vertigo Effect): camera scale surges while perspective shifts
  const dollyZoomProgress = interpolate(frame, [act2.start, act2.dollyEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cameraScale = interpolate(dollyZoomProgress, [0, 1], [0.92, 1.28]);
  const perspectiveY = interpolate(dollyZoomProgress, [0, 1], [50, 58]);

  // 2. Vector Stroke Drawing Progress for Locomotive
  const drawProgress = interpolate(frame, [act2.start + 5, act2.start + 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // 3. Steam Transmutation (Train smoke -> Espresso extraction steam)
  const morphProgress = interpolate(frame, [act2.steamMorphStart, act2.end - 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. Kinetic Typography: "NOSOTROS PARAMOS."
  const titleSpring = spring({
    frame: frame - (act2.start + 18),
    fps,
    config: {
      damping: 12,
      stiffness: 220,
      mass: 0.8,
    },
  });

  // 5. Technical HUD Staggered Entries
  const hud1Spring = spring({
    frame: frame - act2.hud1Start,
    fps,
    config: { damping: 14, stiffness: 240 },
  });

  const hud2Spring = spring({
    frame: frame - act2.hud2Start,
    fps,
    config: { damping: 14, stiffness: 240 },
  });

  const hud3Spring = spring({
    frame: frame - act2.hud3Start,
    fps,
    config: { damping: 14, stiffness: 240 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: THEME.colors.bgForestNight,
        perspective: '1000px',
        perspectiveOrigin: `50% ${perspectiveY}%`,
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Camera Dolly Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: `50% ${perspectiveY}%`,
          willChange: 'transform',
        }}
      >
        {/* Receding Tunnel Track in Background */}
        <TunnelPerspective
          revealProgress={0.65}
          depthZoom={dollyZoomProgress}
          vanishingX={960}
          vanishingY={440}
        />

        {/* Cinematic Golden Vector Locomotive & Kinematic Linkage */}
        <LocomotiveMechanical
          frame={frame}
          drawProgress={drawProgress}
          scale={1.22}
          x={960}
          y={600}
        />

        {/* Transmuting Steam & Heat Vapor (Chimney / Espresso Portafilter) */}
        <ProceduralSteam
          frame={frame}
          originX={1198}
          originY={448}
          morphToEspresso={morphProgress}
          opacity={0.9}
        />

        {/* Golden Dust in the Steam Haze */}
        <DustParticleField
          frame={frame}
          count={70}
          intensity={0.7}
        />
      </div>

      {/* Hero Typography: "NOSOTROS PARAMOS." */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 45,
          opacity: titleSpring,
          transform: `translate3d(0, ${(1 - titleSpring) * -35}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            fontFamily: THEME.typography.condensedGrotesque,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: 16,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: '0 0 25px rgba(255, 226, 89, 0.45)',
          }}
        >
          NOSOTROS PARAMOS.
        </div>
        <div
          style={{
            width: interpolate(titleSpring, [0, 1], [0, 340]),
            height: 3,
            backgroundColor: THEME.colors.emeraldNeon,
            boxShadow: '0 0 12px #00FFA3',
            marginTop: 8,
          }}
        />
      </div>

      {/* Technical HUD Precision Telemetry Overlay System */}
      {/* HUD 01 // TOSTADO LENTO (Left flank) */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 360,
          pointerEvents: 'none',
          zIndex: 42,
          opacity: hud1Spring,
          transform: `translate3d(${(1 - hud1Spring) * -50}px, 0, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            fontFamily: THEME.typography.technicalMono,
            fontSize: 14,
            fontWeight: 'bold',
            letterSpacing: 3,
            color: THEME.colors.goldPure,
            borderLeft: `3px solid ${THEME.colors.goldPure}`,
            paddingLeft: 12,
            marginBottom: 6,
          }}
        >
          [ 01 // TOSTADO LENTO ]
        </div>
        <div
          style={{
            fontFamily: THEME.typography.technicalMono,
            fontSize: 11,
            letterSpacing: 1.5,
            color: 'rgba(255, 255, 255, 0.65)',
            paddingLeft: 15,
          }}
        >
          TERMOCICLO TÉRMICO: 204.5°C
          <br />
          DESARROLLO DE GRANO: 14.8%
        </div>
      </div>

      {/* HUD 02 // PRESIÓN EXACTA (Right flank) */}
      <div
        style={{
          position: 'absolute',
          right: 110,
          top: 470,
          pointerEvents: 'none',
          zIndex: 42,
          textAlign: 'right',
          opacity: hud2Spring,
          transform: `translate3d(${(1 - hud2Spring) * 50}px, 0, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            fontFamily: THEME.typography.technicalMono,
            fontSize: 14,
            fontWeight: 'bold',
            letterSpacing: 3,
            color: THEME.colors.emeraldNeon,
            borderRight: `3px solid ${THEME.colors.emeraldNeon}`,
            paddingRight: 12,
            marginBottom: 6,
          }}
        >
          [ 02 // PRESIÓN EXACTA ]
        </div>
        <div
          style={{
            fontFamily: THEME.typography.technicalMono,
            fontSize: 11,
            letterSpacing: 1.5,
            color: 'rgba(255, 255, 255, 0.65)',
            paddingRight: 15,
          }}
        >
          EXTRACCIÓN: 9.0 BAR / 28.5s
          <br />
          CALDERA SATURADA: 93.5°C
        </div>
      </div>

      {/* HUD 03 // ALTA MONTAÑA (Bottom-left flank) */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          bottom: 210,
          pointerEvents: 'none',
          zIndex: 42,
          opacity: hud3Spring,
          transform: `translate3d(${(1 - hud3Spring) * -50}px, 0, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            fontFamily: THEME.typography.technicalMono,
            fontSize: 14,
            fontWeight: 'bold',
            letterSpacing: 3,
            color: THEME.colors.goldPure,
            borderLeft: `3px solid ${THEME.colors.emeraldNeon}`,
            paddingLeft: 12,
            marginBottom: 6,
          }}
        >
          [ 03 // ALTA MONTAÑA ]
        </div>
        <div
          style={{
            fontFamily: THEME.typography.technicalMono,
            fontSize: 11,
            letterSpacing: 1.5,
            color: 'rgba(255, 255, 255, 0.65)',
            paddingLeft: 15,
          }}
        >
          ORIGEN: 1,850 M.S.N.M.
          <br />
          VARIETAL: ARÁBICA TYPICA
        </div>
      </div>
    </div>
  );
};
