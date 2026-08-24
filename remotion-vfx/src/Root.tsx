import React from 'react';
import { Composition, staticFile } from 'remotion';
import { EidComposition } from './components/Composition';

export const Root: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape Composition (YouTube / Desktop) */}
      <Composition
        id="EidComposition"
        component={EidComposition}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          theme: 'midnight-gold',
          senderName: 'K M KHADIMUL HASAN',
          message: 'May your faith and devotion be rewarded with abundance, happiness, and peace.',
          audioUrl: staticFile('audio.mp3'),
          volume: 0.8,
          particleDensity: 1.0,
          cameraShake: true,
        }}
      />
      {/* 9:16 Portrait Composition (Reels / TikTok / Shorts) */}
      <Composition
        id="EidCompositionVertical"
        component={EidComposition}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: 'midnight-gold',
          senderName: 'K M KHADIMUL HASAN',
          message: 'May your faith and devotion be rewarded with abundance, happiness, and peace.',
          audioUrl: staticFile('audio.mp3'),
          volume: 0.8,
          particleDensity: 1.0,
          cameraShake: true,
        }}
      />
    </>
  );
};
export default Root;
