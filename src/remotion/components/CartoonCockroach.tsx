import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type CartoonCockroachProps = {
  scale?: number;
  facing?: 'left' | 'right';
};

export const CartoonCockroach: React.FC<CartoonCockroachProps> = ({
  scale = 1,
  facing = 'right',
}) => {
  const frame = useCurrentFrame();
  const antennaWave = interpolate(frame % 30, [0, 15, 30], [-10, 12, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bodyBob = interpolate(frame % 24, [0, 12, 24], [0, -5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 240,
        height: 180,
        transform: `scale(${scale}) scaleX(${facing === 'left' ? -1 : 1}) translateY(${bodyBob}px)`,
        transformOrigin: 'center center',
      }}
    >
      <svg viewBox="0 0 240 180" width="100%" height="100%">
        <ellipse cx="126" cy="98" rx="70" ry="52" fill="#51311e" />
        <ellipse cx="126" cy="98" rx="54" ry="40" fill="#6a4128" />
        <ellipse cx="70" cy="92" rx="36" ry="30" fill="#4a2a18" />
        <ellipse cx="70" cy="92" rx="20" ry="16" fill="#734429" />
        <circle cx="58" cy="88" r="5" fill="#ffffff" />
        <circle cx="82" cy="88" r="5" fill="#ffffff" />
        <circle cx="58" cy="88" r="2.5" fill="#111111" />
        <circle cx="82" cy="88" r="2.5" fill="#111111" />
        <path d="M52 106 Q70 116 88 106" fill="none" stroke="#2b180d" strokeWidth="5" />
        <g stroke="#2b180d" strokeWidth="6" strokeLinecap="round">
          <line x1="100" y1="126" x2="54" y2="150" />
          <line x1="116" y1="136" x2="76" y2="168" />
          <line x1="138" y1="136" x2="110" y2="168" />
          <line x1="152" y1="126" x2="138" y2="160" />
          <line x1="98" y1="66" x2="54" y2="44" />
          <line x1="142" y1="66" x2="184" y2="42" />
          <line x1="164" y1="126" x2="204" y2="154" />
          <line x1="148" y1="136" x2="180" y2="170" />
        </g>
        <g stroke="#2b180d" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d={`M42 74 Q16 ${46 + antennaWave} 10 ${22 + antennaWave}`} />
          <path d={`M90 68 Q60 ${28 - antennaWave} 52 ${10 - antennaWave}`} />
        </g>
        <path d="M126 50 L112 108 L126 138 L140 108 Z" fill="#7d4d2e" opacity="0.62" />
      </svg>
    </div>
  );
};
