import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './MainComposition';
import { THEME } from './constants/theme';

export const Root: React.FC = () => {
  return (
    <>
      {/* Primary Theatrical Composition: 1920x1080 @ 60 FPS, 900 frames (15s) */}
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={THEME.timings.totalFrames}
        fps={THEME.timings.fps}
        width={THEME.dimensions.width}
        height={THEME.dimensions.height}
      />

      {/* 4K Ultra-HD Master Option (3840x2160) */}
      <Composition
        id="MainComposition-4K"
        component={MainComposition}
        durationInFrames={THEME.timings.totalFrames}
        fps={THEME.timings.fps}
        width={3840}
        height={2160}
      />
    </>
  );
};
